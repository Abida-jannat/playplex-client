import dns from "node:dns";
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import clientPromise from "./mongodb";

const client = await clientPromise;

export const auth = betterAuth({

    baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  
  database: mongodbAdapter(client.db("playplex"), { client }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});