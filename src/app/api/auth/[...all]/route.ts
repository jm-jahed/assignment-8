import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Concept: Better Auth Next.js App Router Route Handler
 * Why:
 * Better Auth is framework-agnostic. To wire it into Next.js App Router,
 * we use the official `toNextJsHandler` adapter inside a catch-all route `[...all]`.
 *
 * How:
 * Any incoming request to `/api/auth/*` (such as sign-up, sign-in, session check,
 * and the `/api/auth/jwks` endpoint) is intercepted and handled by Better Auth.
 *
 * Example:
 * GET /api/auth/jwks -> Returns public cryptographic keys for Express backend verification.
 */
export const { GET, POST } = toNextJsHandler(auth);
