import { authClient } from "./auth-client";

/**
 * Concept: Authenticated API Fetch Wrapper
 * Why:
 * When making requests to protected Express API endpoints (e.g., creating an event or RSVPing),
 * the client must attach the JWT bearer token in the `Authorization: Bearer <token>` header.
 *
 * How:
 * `getAccessToken` safely retrieves the token from Better Auth's `authClient.token()`.
 * If user is not logged in or token retrieval fails, it returns `null`.
 * `fetchWithAuth` automatically adds the Bearer header if a token is available.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      return null;
    }

    return data.token;
  } catch {
    return null;
  }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; statusCode?: number }> {
  try {
    const token = await getAccessToken();
    const headers = new Headers(options.headers || {});

    headers.set("Content-Type", "application/json");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        statusCode: response.status,
        message: result.message || "An unexpected error occurred",
      };
    }

    return {
      success: true,
      statusCode: response.status,
      data: result.data !== undefined ? result.data : result,
      message: result.message,
    };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      message: err.message || "Network error. Please verify backend is running.",
    };
  }
}
