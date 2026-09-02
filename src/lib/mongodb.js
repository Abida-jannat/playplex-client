import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Use global caching in development to prevent connection leaks during Hot Module Replacement (HMR)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Direct connection in production
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;;