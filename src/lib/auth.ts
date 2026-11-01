import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import dns from "node:dns";

// Resilient DNS resolution for Windows environment
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Non-fatal if host environment restricts custom DNS
}

/**
 * Concept: Better Auth Server Instance & MongoDB Adapter
 * Why:
 * Better Auth serves as the single source of truth for user authentication.
 * It manages user registration, password hashing, and OAuth accounts directly
 * inside dedicated MongoDB collections (`user`, `session`, `account`, `jwks`).
 *
 * How:
 * 1. MongoDB Connection: Connects using the native `MongoClient` driver.
 *    If the deployment is a Replica Set (e.g., MongoDB Atlas), passing `{ client }`
 *    enables native multi-document transaction support.
 * 2. JWT Plugin: Generates asymmetric EdDSA (Ed25519) key pairs stored in the database
 *    and exposes public verification keys at `GET /api/auth/jwks` for our Express API.
 * 3. Minimal Payload: We define `definePayload` to include only necessary fields (email, name),
 *    while Better Auth automatically assigns `sub: user.id`.
 */

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/community_connect";
const client = new MongoClient(mongoUri);
const db = client.db();

const isReplicaSet = mongoUri.includes("replicaSet") || mongoUri.includes("mongodb+srv");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db, isReplicaSet ? { client } : undefined),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  plugins: [
    jwt({
      jwt: {
        issuer: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        audience: process.env.JWT_AUDIENCE || "community-connect-api",
        expirationTime: "15m",
        definePayload: ({ user }) => ({
          email: user.email,
          name: user.name,
        }),
      },
    }),
  ],
});
