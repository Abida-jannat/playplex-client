import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://playplex-server-tawny.vercel.app" 
});