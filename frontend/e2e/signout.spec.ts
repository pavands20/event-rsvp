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

// Passwords are generated at runtime, never written as literals.
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

// Sign in through the UI and wait until the events list is showing. Returns nothing;
// throws if sign-in does not land on /events within the timeout.
async function signInViaUi(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/auth");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await fillAuthForm(page, "signin", email, password);
  await submitAuthForm(page, "signin");
  await page.waitForURL("**/events", { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "My Events" })).toBeVisible();
}

// Assert there is no session token in localStorage.
async function expectNoToken(page: Page): Promise<void> {
  const token = await page.evaluate((key) => localStorage.getItem(key), SESSION_TOKEN_KEY);
  expect(token, "session_token must be absent from localStorage").toBeNull();
}

test.describe("US-003-3 sign-out, protected routes, and password-recovery message", () => {
  test.beforeEach(async ({ page }) => {
    // Start every test from a clean auth screen with no leftover token.
    await page.goto("/auth");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("[AC-1] a signed-in organiser clicks Sign Out and lands on the sign-in page with the token cleared from localStorage", async ({
    page,
  }) => {
    const { email, password } = adminCredentials();
    await signInViaUi(page, email, password);

    // Confirm we are authenticated: a token is present in localStorage.
    const tokenBefore = await page.evaluate((key) => localStorage.getItem(key), SESSION_TOKEN_KEY);
    expect(tokenBefore, "token present before sign-out").not.toBeNull();

    // Click the Sign Out control in the app menu.
    await page.getByRole("link", { name: /Sign Out/ }).click();

    // The user lands on the sign-in page.
    await page.waitForURL("**/auth", { timeout: 15_000 });
    await expect(page.getByRole("tab", { name: "Sign In" })).toBeVisible();

    // The session token is cleared from localStorage.
    await expectNoToken(page);
  });

  test("[AC-2] after sign-out, navigating directly to /events redirects to /auth", async ({
    page,
  }) => {
    const { email, password } = adminCredentials();
    await signInViaUi(page, email, password);

    // Sign out first.
    await page.getByRole("link", { name: /Sign Out/ }).click();
    await page.waitForURL("**/auth", { timeout: 15_000 });

    // Now navigate directly to /events (a full navigation, the way a bookmark would).
    await page.goto("/events");

    // The protected route must redirect back to the sign-in page.
    await page.waitForURL("**/auth", { timeout: 15_000 });
    await expect(page.getByRole("tab", { name: "Sign In" })).toBeVisible();
  });

  test("[AC-3] the Auth screen displays the 'Password recovery is not available' message", async ({
    page,
  }) => {
    await page.goto("/auth");

    // The message must be visible on the auth screen so users know recovery is unavailable.
    await expect(page.getByText("Password recovery is not available")).toBeVisible();
  });

  test("[NFR-003] session protection: with no token, navigating directly to /events redirects to /auth", async ({
    page,
  }) => {
    // No sign-in at all: localStorage has no token (cleared in beforeEach).
    await expectNoToken(page);

    // A direct navigation to a protected organiser page must redirect to sign-in.
    await page.goto("/events");
    await page.waitForURL("**/auth", { timeout: 15_000 });
    await expect(page.getByRole("tab", { name: "Sign In" })).toBeVisible();
  });

  test("[NFR-003] session protection: after sign-out the token is gone and /events is inaccessible", async ({
    page,
  }) => {
    const { email, password } = uniqueCredentials();
    // Sign up and sign in through the UI so a real session exists.
    await signUpViaApi(page.request, email, password);
    await signInViaUi(page, email, password);

    // Sign out, which must terminate the session.
    await page.getByRole("link", { name: /Sign Out/ }).click();
    await page.waitForURL("**/auth", { timeout: 15_000 });

    await expectNoToken(page);

    // A direct visit to a protected page must not show organiser content.
    await page.goto("/events");
    await page.waitForURL("**/auth", { timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "My Events" })).not.toBeVisible();
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

  test("[NFR-010] event times shown in UTC only: the events list renders times with a UTC label and no timezone selector", async ({
    page,
  }) => {
    // Event times are stored and displayed in UTC with no timezone selection UI.
    // We sign in first so we can see the organiser events list, then check the rendering.
    const { email, password } = adminCredentials();
    await signInViaUi(page, email, password);

    // The events list must show a UTC time label and no timezone picker anywhere.
    await expect(page.getByText(/UTC/).first()).toBeVisible();
    // There must be no timezone selection UI (no select/combobox offering a timezone).
    await expect(page.getByRole("combobox")).toHaveCount(0);
  });
});
