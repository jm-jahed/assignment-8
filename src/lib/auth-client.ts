import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

/**
 * Concept: Better Auth Browser Client SDK
 * Why:
 * Used by React Client Components (`"use client"`) to initiate login, registration,
 * social OAuth popups/redirects, logout, and fetch user session status without manual HTTP calls.
 *
 * How:
 * We instantiate `createAuthClient` with the `jwtClient` plugin so the client can request
 * cryptographic JWT tokens for our backend API via `authClient.token()`.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [jwtClient()],
});
