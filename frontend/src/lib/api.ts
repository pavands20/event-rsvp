/// <reference types="vite/client" />
// Without the reference above, `import.meta.env` is not typed and `tsc --noEmit` fails --
// which `vite build` does not catch, because it tree-shakes this module out when no screen
// imports it yet.
//
// Where the generated API lives.
//
// Set at build time: the platform bakes the deployed API URL into the frontend build. The
// fallback is the local backend so a bare `npm run dev` still points somewhere real.
//
// The generated screens do NOT use this yet -- they render seeded sample data, exactly as
// they were approved. This is the seam to replace that with real calls, one screen at a
// time.
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// The shared bearer the deployed API expects (its SECRET_KEY). The platform bakes the
// same value into both sides at deploy time, so authenticated calls work out of the box.
export const API_SECRET_KEY: string = import.meta.env.VITE_API_SECRET_KEY ?? "";

// The frontend and the API are on different origins once deployed, so a login flow
// cannot rely on a cookie coming back (a browser drops a cross-origin cookie unless every
// attribute is exactly right, and that keeps getting stricter regardless). A ticket that
// implements login reads `/auth/login`'s token from its response body and calls
// `setSessionToken` with it; apiFetch then sends it as the bearer on every later call,
// ahead of the shared secret.
const SESSION_TOKEN_KEY = "session_token";

export function getSessionToken(): string | null {
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setSessionToken(token: string): void {
  try {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } catch {
    // Storage unavailable (private mode, quota): the session just won't persist.
  }
}

export function clearSessionToken(): void {
  try {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // Nothing to clear if storage was never reachable.
  }
}

// NFR-008: carries the API's raw `detail` so a screen can map field-specific
// validation errors. FastAPI returns `detail` as a string for custom checks
// (e.g. "start_at must be in the future") and as a list of Pydantic error
// objects (`[{ loc, msg, type, ... }]`) for schema validation. The `message`
// is always a readable string so callers that only need a message still work.
export class ApiError extends Error {
  status: number;
  detail: unknown;
  constructor(message: string, status: number, detail: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const bearer = getSessionToken() ?? API_SECRET_KEY;
  // Join with exactly one slash: API_BASE_URL is baked with a trailing slash (the API
  // sits behind a /apps/<slug>/ path prefix) and paths start with "/", so a naive
  // concat yields "...//auth/me", which a path-prefix proxy need not route.
  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    // NFR-003: a 401 means the session is gone (missing/expired/revoked). Clear
    // the token and send the user back to the sign-in page. Only redirect when
    // a token was present: a 401 on the auth screens themselves (wrong password
    // on /auth/signin) is a credential error to surface, not a session expiry.
    if (response.status === 401) {
      const hadToken = getSessionToken() !== null;
      clearSessionToken();
      if (hadToken && typeof window !== "undefined" && window.location) {
        window.location.assign("/auth");
      }
    }
    // NFR-008: surface the exact `detail` the API returned so the screen can
    // show "This email is already in use" rather than a generic status string,
    // and map field-specific Pydantic validation errors to their inputs. Fall
    // back to a status line when the body is not JSON or lacks `detail`
    // (e.g. a proxy 502) so a caller always gets a readable message.
    let detail: unknown = `${init?.method ?? "GET"} ${path} failed: ${response.status}`;
    let message = `${init?.method ?? "GET"} ${path} failed: ${response.status}`;
    try {
      const body = await response.json();
      if (body && "detail" in body) {
        detail = body.detail;
        if (typeof body.detail === "string" && body.detail.length > 0) {
          message = body.detail;
        } else if (Array.isArray(body.detail) && body.detail.length > 0) {
          message =
            body.detail
              .map((e: { msg?: string }) => e?.msg)
              .filter(Boolean)
              .join("; ") || message;
        }
      }
    } catch {
      // Non-JSON body: keep the status fallback.
    }
    throw new ApiError(message, response.status, detail);
  }
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
