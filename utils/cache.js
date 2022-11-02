const redis = require("redis");

// default cache of 5 minutes
const CACHE_TIME_IN_S = 60 * 24;

// init the client
let client = {};
try {
  // try to connect to redis if possible
  if (process.env.REDIS_URL) {
    // REDIS_URL is set by VERCEL
    client = redis.createClient(process.env.REDIS_URL);
  } else {
    // eslint-disable-next-line no-console
    console.error("Unable to initialize Redis Client");
  }
} catch {
  // die quietly
  // eslint-disable-next-line no-console
  console.error("Error initializing Redis Client");
}

module.exports = {
  instance: client,
  get: (key) =>
    new Promise((resolve) => {
      // if not connected, return null
      if (!client.connected || !client.connected) return resolve(null);
      // otherwise get a value from the client
      client.get(key, (error, reply) => {
        if (error || reply === null) {
          resolve(null);
        } else {
          resolve(reply);
        }
      });
    }),
  getObject: (key) =>
    new Promise((resolve) => {
      // if not connected, return null
      if (!client.connected || !client.connected) return resolve(null);
      // otherwise get a value from the client
      client.get(key, (error, reply) => {
        try {
          if (error || reply === null) {
            resolve(null);
          } else {
            resolve(JSON.parse(reply));
          }
        } catch {
          resolve(null);
        }
      });
    }),
  set: (key, value, seconds = CACHE_TIME_IN_S, cb) => {
    try {
      // if not connected, skip
      if (!client.connected || !client.connected) return;

      client.setex(key, seconds, value, cb);
    } catch (e) {
      // die silently
    }
  },
  setObject: (key, value, seconds = CACHE_TIME_IN_S, cb) => {
    try {
      // if not connected, skip
      if (!client.connected || !client.connected) return;

      client.setex(
        key,
        seconds,
        JSON.stringify({
          __cache: true,
          __key: key,
          __expiration: new Date(Date.now() + seconds * 1000).toISOString(),
          ...value,
        }),
        cb
      );
    } catch (e) {
      // die silently
    }
  },
  clear: (key) => {
    // if not connected, skip
    if (!client.connected || !client.connected) return;

    client.del(key);
  },
};
