import { MongoClient } from "mongodb";

const connectionString = "mongodb://127.0.0.1:27017";
const client = new MongoClient(connectionString, {
  useUnifiedTopology: true,
});

await client.connect();
const db = client.db("practice-mongo");


export { client, db }; 