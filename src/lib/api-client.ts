import { authClient } from "./auth-client";

/**
 * Concept: Authenticated API Fetch Wrapper with Timeout and Generic Typing.
 * Why:
 * When making requests to protected Express API endpoints (e.g., creating an event or RSVPing),
 * the client must attach the JWT bearer token in the `Authorization: Bearer <token>` header.
 *
 * How:
 * 1. `getAccessToken` safely retrieves the token from Better Auth's `authClient.token()`.
 * 2. If the user is not logged in or token retrieval fails, it returns `null`.
 * 3. `fetchWithAuth` automatically adds the Bearer header, sets Content-Type, and enforces
 *    a 15-second AbortController timeout to prevent hung requests.
 * Example: `const res = await fetchWithAuth<EventDetail>("/events/123");`
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode?: number;
  data?: T;
  message?: string;
}

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

export async function fetchWithAuth<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

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
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
      data: (result.data !== undefined ? result.data : result) as T,
      message: result.message,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      return {
        success: false,
        statusCode: 408,
        message: "Request timed out. Please check your network connection.",
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: err.message || "Network error. Please verify backend is running.",
    };
  }
}
