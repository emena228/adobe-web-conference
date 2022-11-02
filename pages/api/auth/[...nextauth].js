import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { get } from "lodash";
import { connectToDatabase } from "@utils/database";
import { RateLimiterRedis } from "rate-limiter-flexible";
import userFunctions from "@utils/db/users";
import bcrypt from "bcryptjs";
import cache from "@utils/cache";

const MongoObjectId = process.env.MONGODB_URI
  ? require("mongodb").ObjectId
  : (id) => {
      return id;
    };

const options = {
  providers: [
    Providers.Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: (req, res) => {
        return new Promise(async (resolve, reject) => {
          const headers = req.headers || {};
          const hasRedis = process.env.REDIS_URL ? true : false;

          const ipAddr = headers["x-real-ip"];
          const userRequestCountry = headers["x-vercel-ip-country"] || null;
          const userRequestRegion =
            headers["x-vercel-ip-country-region"] || null;
          const userRequestCity = headers["x-vercel-ip-city"] || null;

          const maxWrongAttemptsByIPperDay = 100;
          const maxConsecutiveFailsByUsername = 20;

          let limiterSlowBruteByIP = null,
            limiterConsecutiveFailsByUsername = null,
            resUsernameAndIP = null,
            resSlowByIP = null;

          const creds = get(req, "body", req);

          const { email, password } = creds;

          const getUsernameIPkey = (email) => `${email}`;

          const usernamePrepped = email.toLowerCase();

          const usernameIPkey = getUsernameIPkey(usernamePrepped);

          if (hasRedis) {
            try {
              limiterSlowBruteByIP = new RateLimiterRedis({
                redis: cache.instance,
                keyPrefix: "login_fail_ip_per_day",
                points: maxWrongAttemptsByIPperDay,
                duration: 60 * 60 * 24,
                blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
              });

              limiterConsecutiveFailsByUsername = new RateLimiterRedis({
                redis: cache.instance,
                keyPrefix: "login_fail_consecutive_username",
                points: maxConsecutiveFailsByUsername,
                duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
                blockDuration: 60 * 60 * 24, // Block for 1 day
              });
            } catch (err) {
              console.log(err);
              return reject(`/sign-in?error=cache-layer-error`);
            }

            [resUsernameAndIP, resSlowByIP] = await Promise.all([
              limiterConsecutiveFailsByUsername.get(usernameIPkey),
              limiterSlowBruteByIP.get(ipAddr),
            ]);

            let retrySecs = 0;

            // Check if IP or Username + IP is already blocked
            if (
              resSlowByIP !== null &&
              resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
            ) {
              retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
            } else if (
              resUsernameAndIP !== null &&
              resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsername
            ) {
              retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
            }

            if (retrySecs > 0) {
              return reject(
                "/sign-in?error=account-locked&email=" + usernamePrepped
              );
            }
          }

          const { db } = await connectToDatabase();

          const query = { email: email.toLowerCase() };
          const user = await db.collection("users").findOne(query);
          console.log("query,", query, user);

          if (!user) {
            if (hasRedis) {
              await Promise.all([
                limiterSlowBruteByIP.consume(ipAddr),
                limiterConsecutiveFailsByUsername.consume(usernameIPkey),
              ]);
            }

            return reject("/sign-in?error=invalid-credentials");
          }
          // else {
          //   return resolve({
          //     ...user,
          //     country: userRequestCountry,
          //     region: userRequestRegion,
          //     city: userRequestCity,
          //   });
          // }

          return bcrypt.compare(
            password,
            user.password,
            async (err, result) => {
              if (result) {
                return resolve({
                  ...user,
                  country: userRequestCountry,
                  region: userRequestRegion,
                  city: userRequestCity,
                });
              } else {
                if (hasRedis) {
                  await Promise.all([
                    limiterSlowBruteByIP.consume(ipAddr),
                    limiterConsecutiveFailsByUsername.consume(usernameIPkey),
                  ]);
                }
                return reject("/sign-in?error=invalid-credentials");
              }
            }
          );
        });
      },
    }),
    Providers.Credentials({
      id: "loginurl",
      name: "LoginUrl",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      authorize: (req, res) => {
        return new Promise(async (resolve, reject) => {
          const headers = req.headers || {};

          const userRequestCountry = headers["x-vercel-ip-country"] || null;
          const userRequestRegion =
            headers["x-vercel-ip-country-region"] || null;
          const userRequestCity = headers["x-vercel-ip-city"] || null;

          const creds = get(req, "body", req);

          const { token } = creds;

          const { db } = await connectToDatabase();

          const query = {
            token: token,
          };
          const user = await db.collection("users").findOne(query);
          if (user) {
            return resolve({
              ...user,
              country: userRequestCountry,
              region: userRequestRegion,
              city: userRequestCity,
            });
          } else if (!user) {
            return reject("/auth/adobe?error=invalid-credentials");
          }
        });
      },
    }),
  ],
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // 24 hours
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXT_SECRET,

  jwt: {
    encryption: true,
    secret: process.env.JWT_SECRET,
    signingKey: process.env.JWT_SIGNING_KEY,
    encryptionKey: process.env.JWT_ENCRYPTION_KEY,
  },

  database: process.env.MONGODB_URI,
  callbacks: {
    async jwt(token, user, account, profile, isNewUser) {
      // Add access_token to the token right after signin
      // console.log("jwt", token, user, account, profile, isNewUser);

      if (user) {
        const userId = user._id || user.id;
        let agoraId = null;
        if (!user.agoraId) {
          const { get: getUser, update: updateUser } = await userFunctions();

          let duplicateId = false;

          do {
            agoraId = Math.floor(Math.random() * 100000000) + 1;

            const { user: duplicateUser } = await getUser({
              agoraId: agoraId,
            });

            if (duplicateUser) {
              duplicateId = true;
            }
          } while (duplicateId);

          const { user: userDetails } = await getUser({
            _id: userId,
          });

          const updates = {
            ...userDetails,
            agoraId: agoraId,
          };

          await updateUser(userId, updates);
        } else {
          agoraId = user.agoraId;
        }

        token._id = userId;
        token.name = user.name;
        token.admin = get(user, "admin", false);
        token.company = get(user, "company", false);
        token.agoraId = agoraId;
      }

      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    signIn: (user, account, profile) => {
      return Promise.resolve(true);
    },
    /**
     * @param  {string} url      URL provided as callback URL by the client
     * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
     * @return {string}          URL the client will be redirect to
     */
    async redirect(url, baseUrl) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    session: (session, user) => {
      const { _id, id, admin } = user;
      session.user._id = id || _id;
      session.user.admin = admin || false;
      session.user.agoraId = user.agoraId || null;
      session.user.company = user.company || "";

      return Promise.resolve({
        ...session,
        user: { _id: session.user.id, ...session.user },
      });
    },
  },
  events: {
    createUser: async (data) => {
      const { id: userId } = data;
      const { get: getUser, update: updateUser } = await userFunctions();

      let generatedUserId = null;
      let duplicateId = false;

      do {
        generatedUserId = Math.floor(Math.random() * 100000000) + 1;

        const { user: duplicateUser } = await getUser({
          agoraId: generatedUserId,
        });

        if (duplicateUser) {
          duplicateId = true;
        }
      } while (duplicateId);

      const { user: userDetails } = await getUser({
        _id: userId,
      });

      const updates = {
        ...userDetails,
        agoraId: generatedUserId,
      };

      await updateUser(userId, updates);
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
