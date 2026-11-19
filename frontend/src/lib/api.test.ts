import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { apiFetch, clearSessionToken, setSessionToken } from "./api";

function jsonResponse(body: unknown, init: { status: number; ok?: boolean }): Response {
  return {
    ok: init.ok ?? init.status < 400,
    status: init.status,
    json: () => Promise.resolve(body),
  } as unknown as Response;
}

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    clearSessionToken();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    clearSessionToken();
    vi.restoreAllMocks();
  });

  it("[AC-006] parses the exact detail from a non-OK response body", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue(jsonResponse({ detail: "This email is already in use" }, { status: 400 }));

    await expect(apiFetch("/auth/signup", { method: "POST" })).rejects.toThrow(
      "This email is already in use",
    );
  });

  it("[AC-006] falls back to a status line when the body has no detail", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(jsonResponse({}, { status: 502 }));

    await expect(apiFetch("/events")).rejects.toThrow(/502/);
  });

  it("[AC-006] sends the stored session token as Authorization: Bearer on subsequent calls", async () => {
    setSessionToken("tok_after_signin");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: true }, { status: 200, ok: true }));
    globalThis.fetch = fetchMock;

    await apiFetch("/events");

    const [, init] = fetchMock.mock.calls[0];
    expect((init as RequestInit).headers).toMatchObject({
      Authorization: "Bearer tok_after_signin",
    });
  });

  it("[AC-006] returns undefined body for a 204 response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: () => Promise.resolve({}),
    } as unknown as Response);

    await expect(apiFetch("/auth/signout", { method: "POST" })).resolves.toBeUndefined();
  });
});
