/* eslint-disable no-console */
// Load environment variables from a .env file if one exists
require("dotenv").config();

const md5 = require("md5");

const { connectToDatabase } = require("@utils/database");
const { get, omit } = require("lodash");
// const { Participant, Ticket } = require("@utils/structs");
const { sendParticipantUpdate } = require("@utils/notifications");
const { generateRandomId } = require("@utils/functions");

const bcrypt = require("bcryptjs");

const MongoObjectId = process.env.MONGODB_URI
  ? require("mongodb").ObjectId
  : (id) => {
      return id;
    };

const saltRounds = 10;

module.exports = () => {
  const databases = async () => {
    // Connect to MongoDB Database and return user connection
    try {
      const { db } = await connectToDatabase();
      try {
        return Promise.resolve({
          users: db.collection("users"),
          accounts: db.collection("accounts"),
        });
      } catch (err) {
        Promise.reject(err);
      }
    } catch (err) {
      Promise.reject(err);
    }
  };
  return databases().then(({ users, accounts }) => {
    users.createIndex({ "$**": "text" }, { name: "TextIndex" });

    const API = {
      insert: async (user) => {
        return new Promise(async (resolve, reject) => {
          const { firstName, lastName, email = "", password } = user;

          if (firstName === "" || lastName === "" || email === "") {
            return Promise.reject({ error: "Missing or invalid params" });
          }

          const emailRequested = email;

          const { user: existingUser } = await API.get({
            email: emailRequested,
          });

          if (existingUser) {
            return reject({ error: "duplicate_user_email" });
          }

          // bcrypt.hash(password, saltRounds, function (err, hash) {
          users.insertOne(
            {
              ...user,
              name: `${firstName} ${lastName}`,
              firstName,
              lastName,
              email: emailRequested,
              token: md5(`${email}-${firstName}`),
              emailVerified: false,
              logins: [],
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            (err, response) => {
              if (!user._id && user._id) user._id = response._id;
              return resolve({
                ...user,
                _id: response.insertedId,
              });
            }
          );
          // });
        });
      },

      list: (query = {}) => {
        return new Promise((resolve, reject) => {
          const result = users.find(query).sort({ date: 1 });
          result.toArray((err, users) => {
            if (err) {
              reject(err);
            } else {
              resolve({ users });
            }
          });
        });
      },
      update: (_id, user) => {
        return new Promise((resolve, reject) => {
          const userData = get(user, "values", user);
          const userUpdate = omit({ ...userData }, ["_id"]);
          userUpdate.name = `${userData.firstName} ${userData.lastName}`;
          API.get({ username: userUpdate.username }).then(
            ({ user: existingUser }) => {
              if (
                existingUser !== false &&
                get(existingUser, "_id", "").toString() !== _id
              ) {
                reject({ success: false, text: "Email is already in use." });
              } else {
                // bcrypt.hash(
                //   userUpdate.password,
                //   saltRounds,
                //   function (err, hash) {
                const updates = {
                  ...userUpdate,
                  token: md5(`${userData.email}-${userData.firstName}`),
                };
                if (userUpdate.password) {
                  updates.password = hash;
                }
                users.findOneAndUpdate(
                  { _id: MongoObjectId(_id) },
                  { $set: updates },
                  { returnOriginal: false },
                  (err, data) => {
                    if (err) {
                      console.log(err);
                      return reject({
                        success: false,
                        text: "Unable to update user",
                      });
                    }
                    const user = get(data, "value", false);
                    resolve({ success: true, text: "User updated.", user });
                  }
                );
                //   }
                // );
              }
            }
          );
        });
      },
      setRole: (onStage = false, userId) => {
        return new Promise((resolve, reject) => {
          users.findOneAndUpdate(
            { _id: MongoObjectId(userId) },
            { $set: { defaultOnStage: onStage } },
            { returnOriginal: false },
            (err, data) => {
              if (err) return reject(err);
              const user = get(data, "value", false);
              resolve({ user });
            }
          );
        });
      },
      delete: (_id) => {
        return new Promise((resolve) => {
          users
            .remove(
              { _id: MongoObjectId(_id) },
              {
                justOne: true,
              }
            )
            .then(({ result }) => {
              accounts.remove(
                { userId: MongoObjectId(_id) },
                {
                  justOne: true,
                }
              );
              if (result.n > 0) {
                return resolve({ success: true });
              } else {
                return resolve({ success: false });
              }
            });
        });
      },
      get: ({ email = null, username = null, _id = null } = {}) => {
        let query = {};

        const requestEmail = email && email.toLowerCase();
        const requestUsername = username && username.toLowerCase();

        if (requestEmail) {
          query = { email: requestEmail };
        } else if (requestUsername) {
          query = { username: requestUsername };
        } else if (_id) {
          query = { _id: MongoObjectId(_id) };
        } else {
          return Promise.resolve({ user: false });
        }

        return new Promise((resolve, reject) => {
          users.findOne(query, (err, user) => {
            if (err) return reject(err);
            // const passwordSet = get(user, "password", null) !== "" && get(user, "password", null) !== null;
            return resolve({
              user: user ? { ...omit(user, ["password"]) } : false,
            });
          });
        });
      },
      find: ({ email = null, username = null, _id = null } = {}) => {
        let query = {};

        const requestEmail = email && email.toLowerCase();
        const requestUsername = username && username.toLowerCase();

        if (requestEmail) {
          query = { email: requestEmail };
        } else if (username) {
          query = { username: requestUsername };
        } else if (_id) {
          query = { _id: MongoObjectId(_id) };
        }

        return new Promise((resolve, reject) => {
          const result = users.find(query).sort({ name: 1 });
          result.toArray((err, users) => {
            const usersFiltered = users.map((user) => {
              return omit(user, ["password"]);
            });
            if (err) {
              reject(err);
            } else {
              resolve({ users: usersFiltered });
            }
          });
        });
      },
      assignAgoraId: (userId) => {
        return new Promise((resolve, reject) => {
          let generatedUserId = Math.floor(Math.random() * 100000000) + 1;
          console.log("generatedUserId", generatedUserId);
          let existingUser = false;
          do {
            const { user } = API.get({ agoraId: generatedUserId });

            if (user) {
              console.log(
                "generatedUserId found!! regenerating....",
                generatedUserId
              );
              existingUser = true;
              generatedUserId = Math.floor(Math.random() * 100000000) + 1;
              console.log("generatedUserId regeneration:", generatedUserId);
            }
          } while (existingUser !== false);

          users.findOneAndUpdate(
            { _id: MongoObjectId(userId) },
            { $set: { agoraId: generatedUserId } },
            { returnOriginal: false },
            (err, data) => {
              if (err) {
                console.log(err);
                return reject({
                  success: false,
                  text: "Unable to update user",
                });
              }
              const user = get(data, "value", false);
              resolve({ success: true, text: "User updated.", user });
            }
          );
        });
      },
      search: (query) => {
        return new Promise((resolve, reject) => {
          const result = users.find({ $text: { $search: query } });
          result.toArray((err, users) => {
            resolve({
              users: users.map(({ _id, name }) => {
                return { _id, name };
              }),
            });
          });
        });
      },
      searchByEmail: (email) => {
        return new Promise((resolve, reject) => {
          const result = users.find({ email: email.toLowerCase() });
          result.toArray((err, users) => {
            resolve({
              users: users.map(({ _id, name, email }) => {
                return { _id, name, email };
              }),
            });
          });
        });
      },
      deleteRobots: () => {
        return new Promise((resolve) => {
          users
            .remove(
              { robot: true },
              {
                justOne: true,
              }
            )
            .then(({ result }) => {
              resolve({ result });
            });
        });
      },
    };
    return Promise.resolve(API);
  });
};
