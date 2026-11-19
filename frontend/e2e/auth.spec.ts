import { randomUUID } from "node:crypto";

import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

import { adminCredentials } from "./support/admin";

// The backend the frontend talks to. The platform bakes VITE_API_BASE_URL into the
// preview build; locally it falls back to http://localhost:8000 (see src/lib/api.ts).
// E2E_API_BASE_URL lets the platform point direct API calls at the same place.
const API_BASE =
  process.env.E2E_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? "http://localhost:8000";

// localStorage key the frontend stores the session token under (src/lib/api.ts).
const SESSION_TOKEN_KEY = "session_token";

// Every test gets its own unique organiser so parallel/serial runs never collide on
// "This email is already in use". Passwords are generated at runtime, never literal.
function uniqueCredentials(): { email: string; password: string } {
  return {
    email: `qa-${randomUUID()}@example.com`,
    password: randomUUID(),
  };
}

// Create an organiser through the public signup API, the way the contract says test
// users must be made (no direct database seeding). Throws if signup does not succeed.
async function signUpViaApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<void> {
  const response = await request.post(`${API_BASE}/auth/signup`, {
    data: { email, password },
  });
  expect(response.ok(), `signup API should succeed for ${email}`).toBeTruthy();
}

// Switch the auth screen to the named tab and fill the email/password fields.
async function fillAuthForm(page: Page, tab: "signin" | "signup", email: string, password: string) {
  await page.getByRole("tab", { name: tab === "signup" ? "Sign Up" : "Sign In" }).click();
  await page.locator("#auth-email").fill(email);
  await page.locator("#auth-password").fill(password);
}

// Submit the auth form by clicking the form's submit button (not the tab of the same name).
async function submitAuthForm(page: Page, tab: "signin" | "signup") {
  await page.getByRole("button", { name: tab === "signup" ? "Sign Up" : "Sign In" }).click();
}

test.describe("US-001-3 signup and signin e2e", () => {
  test.beforeEach(async ({ page }) => {
    // Start every test from a clean auth screen with no leftover token.
    await page.goto("/auth");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("[AC-1] a new user signs up with a unique email and password >= 8 chars and lands on the events list", async ({
    page,
  }) => {
    const { email, password } = uniqueCredentials();

    await fillAuthForm(page, "signup", email, password);
    await submitAuthForm(page, "signup");

    // Landing on the events list: the URL is /events and the page heading is visible.
    await page.waitForURL("**/events", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Events" })).toBeVisible();
  });

  test("[AC-2] signup with an already-registered email shows 'This email is already in use'", async ({
    page,
    request,
  }) => {
    const { email, password } = uniqueCredentials();
    // Register the organiser first, through the API.
    await signUpViaApi(request, email, password);

    await fillAuthForm(page, "signup", email, password);
    await submitAuthForm(page, "signup");

    await expect(page.getByRole("alert")).toHaveText("This email is already in use");
    // The user stays on the auth screen.
    await expect(page).toHaveURL(/\/auth/);
  });

  test("[AC-3] signup with a short password shows the minimum-length message", async ({ page }) => {
    const { email } = uniqueCredentials();
    // A non-empty but too-short password: passes the required check, fails the API rule.
    const shortPassword = "short";

    await fillAuthForm(page, "signup", email, shortPassword);
    await submitAuthForm(page, "signup");

    await expect(page.getByRole("alert")).toHaveText("Password must be at least 8 characters");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("[AC-4] an existing organiser signs in and lands on the events list", async ({
    page,
    request,
  }) => {
    const { email, password } = uniqueCredentials();
    await signUpViaApi(request, email, password);

    await fillAuthForm(page, "signin", email, password);
    await submitAuthForm(page, "signin");

    await page.waitForURL("**/events", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Events" })).toBeVisible();
  });

  test("[AC-5] signin with wrong credentials shows 'Invalid email or password'", async ({
    page,
    request,
  }) => {
    const { email, password } = uniqueCredentials();
    await signUpViaApi(request, email, password);

    // Sign in with a wrong password (still >= 8 chars so it is not a length error).
    await fillAuthForm(page, "signin", email, randomUUID());
    await submitAuthForm(page, "signin");

    await expect(page.getByRole("alert")).toHaveText("Invalid email or password");
    await expect(page).toHaveURL(/\/auth/);
  });

  test("[AC-6] after signin, the token is present in localStorage", async ({ page, request }) => {
    const { email, password } = uniqueCredentials();
    await signUpViaApi(request, email, password);

    await fillAuthForm(page, "signin", email, password);
    await submitAuthForm(page, "signin");

    await page.waitForURL("**/events", { timeout: 15_000 });

    const token = await page.evaluate((key) => localStorage.getItem(key), SESSION_TOKEN_KEY);
    expect(token, "session_token should be set in localStorage after signin").not.toBeNull();
    expect(token!.length, "session_token should be a non-empty string").toBeGreaterThan(0);
  });

  test("[NFR-008] clear error messages: a missing-field signin shows a clear message", async ({
    page,
  }) => {
    // Frontend guards empty fields with a clear, specific message before any API call.
    await fillAuthForm(page, "signin", "someone@example.com", "");
    await submitAuthForm(page, "signin");

    await expect(page.getByRole("alert")).toBeVisible();
    const message = await page.getByRole("alert").textContent();
    expect(message, "the refused input must explain what to fix").toBeTruthy();
    expect(message!.length).toBeGreaterThan(0);
  });

  test("[NFR-003] session protection: the bootstrap admin can sign in and the token persists across a reload", async ({
    page,
  }) => {
    // The platform seeds the bootstrap admin for every E2E run. Signing in as it proves a
    // real, seeded organiser authenticates end to end; the token survives a reload, which is
    // the behaviour a protected page relies on to stay open within a session.
    const { email, password } = adminCredentials();

    await fillAuthForm(page, "signin", email, password);
    await submitAuthForm(page, "signin");

    await page.waitForURL("**/events", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Events" })).toBeVisible();

    const tokenBefore = await page.evaluate((key) => localStorage.getItem(key), SESSION_TOKEN_KEY);
    expect(tokenBefore, "token present after signin").not.toBeNull();

    await page.reload();
    // The token is a client-side credential, so it must persist across a reload.
    const tokenAfter = await page.evaluate((key) => localStorage.getItem(key), SESSION_TOKEN_KEY);
    expect(tokenAfter, "token persists across reload").not.toBeNull();
    expect(tokenAfter).toBe(tokenBefore);
  });
});
