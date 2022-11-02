/* eslint-disable no-console */
// Load environment variables from a .env file if one exists
require("dotenv").config();
const { ItemHistory } = require("@utils/structs");
const { get } = require("lodash");
const { connectToDatabase } = require("@utils/database");

const MongoObjectId = process.env.MONGODB_URI
  ? require("mongodb").ObjectId
  : (id) => {
      return id;
    };

module.exports = () => {
  const databases = async () => {
    // Connect to MongoDB Database and return games connection / collection
    try {
      const { db } = await connectToDatabase();
      try {
        return Promise.resolve({
          channels: db.collection("channels"),
        });
      } catch (err) {
        Promise.reject(err);
      }
    } catch (err) {
      Promise.reject(err);
    }
  };
  return databases().then(({ channels }) => {
    const API = {
      get: (query = {}) => {
        let queryObj;
        if (query._id) {
          queryObj = { _id: MongoObjectId(query._id) };
        } else {
          queryObj = query;
        }
        return new Promise((resolve, reject) => {
          channels.findOne(queryObj, (err, channel) => {
            if (err) return reject(err);
            return resolve({ channel });
          });
        });
      },
      list: (query = {}) => {
        return new Promise((resolve, reject) => {
          const result = channels.find(query).sort({ dateTime: 1 });
          result.toArray((err, channels) => {
            if (err) {
              reject(err);
            } else {
              resolve({ channels });
            }
          });
        });
      },
      insert: (channel, user) => {
        const insertQuery = async () => {
          const { name, uid = "", status = "open", dateTime } = channel;
          // const hostUserId = hostId !== null ? MongoObjectId(hostId) : null;
          if (name === "") {
            Promise.reject({ error: "Missing or invalid params" });
          }

          const firstHistoryEl = new ItemHistory(user, "channel");
          const { channel: duplicateChannel } = await API.get({ uid });

          if (duplicateChannel) {
            Promise.reject({ error: "Duplicate Channel found" });
          } else {
            channels.insertOne(
              {
                ...channel,
                uid,
                view: "preshow",
                status,
                history: [firstHistoryEl],
                dateTime: new Date(dateTime),
                created: new Date(),
              },
              (err, response) => {
                if (err) return Promise.reject(err);
                if (!channel._id && channel._id) channel._id = response._id;
                Promise.resolve(channel);
              }
            );
          }
        };
        return insertQuery();
      },
      update: (_id, channel) => {
        return new Promise((resolve, reject) => {
          const channelUpdated = {
            ...channel,
            dateTime: new Date(channel.dateTime),
          };
          channels.findOneAndUpdate(
            { _id: MongoObjectId(_id) },
            { $set: channelUpdated },
            { returnOriginal: false },
            (err, data) => {
              if (err)
                return reject({
                  success: false,
                  text: "Unable to update channel",
                });
              const channel = get(data, "value", false);
              resolve({ success: true, text: "Channel updated.", channel });
            }
          );
        });
      },
      delete: (_id) => {
        return new Promise((resolve) => {
          channels
            .remove(
              { _id: MongoObjectId(_id) },
              {
                justOne: true,
              }
            )
            .then(({ result }) => {
              if (result.n > 0) {
                return resolve({ success: true });
              } else {
                return resolve({ success: false });
              }
            });
        });
      },

      setView: (channelId, view) => {
        return new Promise((resolve, reject) => {
          channels.findOneAndUpdate(
            {
              _id: MongoObjectId(channelId),
            },
            { $set: { view: view } },
            { returnOriginal: false },
            (err, data) => {
              if (err) return reject(err);
              const channel = get(data, "value", false);
              resolve(channel);
            }
          );
        });
      },

      setLayout: (channelId, layout) => {
        return new Promise((resolve, reject) => {
          channels.findOneAndUpdate(
            {
              _id: MongoObjectId(channelId),
            },
            { $set: { layout: layout } },
            { returnOriginal: false },
            (err, data) => {
              if (err) return reject(err);
              const channel = get(data, "value", false);
              resolve(channel);
            }
          );
        });
      },

      setPosition: (channelId, role, subject, clearPosition = false) => {
        return new Promise((resolve, reject) => {
          let query = {};
          switch (role) {
            case "presenter_1":
              query = { presenter_1: subject };
              break;
            case "presenter_2":
              query = { presenter_2: subject };
              break;
            case "presenter_3":
              query = { presenter_3: subject };
              break;
            case "presenter_4":
              query = { presenter_4: subject };
              break;
            case "presenter_5":
              query = { presenter_5: subject };
              break;
          }
          if (clearPosition) {
            query[clearPosition] = { _id: null, name: null, agoraId: null };
          }

          channels.findOneAndUpdate(
            {
              uid: channelId,
            },
            { $set: query },
            { returnOriginal: false },
            (err, data) => {
              if (err) return reject(err);
              const channel = get(data, "value", false);
              resolve({ channel });
            }
          );
        });
      },
    };
    return Promise.resolve(API);
  });
};
