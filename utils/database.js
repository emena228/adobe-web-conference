import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) throw new Error("Missing environment variable MONGODB_URI");
if (!dbName) throw new Error("Missing environment variable MONGODB_DB");

export async function connectToDatabase() {
  if (global.connection) return global.connection;
  if (!global.connectionPromise) {
    global.connectionPromise = MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  const client = await global.connectionPromise;
  const db = await client.db(dbName);
  global.connection = {
    client,
    db,
  };
  return global.connection;
}
