const MongoObjectId = process.env.MONGODB_URI
  ? require("mongodb").ObjectId
  : (id) => {
      return id;
    };

function ItemHistory(user, type) {
  return {
    user: MongoObjectId(user._id),
    action: `${type} created`,
    dateTime: new Date(),
  };
}

module.exports = {
  ItemHistory,
};
