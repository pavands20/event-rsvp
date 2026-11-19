import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();
vi.mock("@/lib/navigate", () => ({
  useNavigate: () => navigateMock,
  toPath: (route: string) => "/" + route.replace(/^\/+/, ""),
}));

const apiFetchMock = vi.fn();
const clearSessionTokenMock = vi.fn();
let sessionTokenValue: string | null = null;
vi.mock("@/lib/api", () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  setSessionToken: () => undefined,
  clearSessionToken: () => clearSessionTokenMock(),
  getSessionToken: () => sessionTokenValue,
  API_BASE_URL: "http://localhost:8000",
  API_SECRET_KEY: "",
}));

import App from "./App";

describe("US-003 sign-out and protected-route guard", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    apiFetchMock.mockReset();
    clearSessionTokenMock.mockReset();
    sessionTokenValue = null;
  });

  afterEach(() => {
    vi.clearAllMocks();
    sessionTokenValue = null;
  });

  it("[NFR-003] protected-route guard redirects to /auth when no token is present", () => {
    sessionTokenValue = null;
    render(
      <MemoryRouter initialEntries={["/events"]}>
        <App />
      </MemoryRouter>,
    );

    // The guard redirects to the sign-in page instead of showing organiser content.
    expect(screen.getByRole("tab", { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "My Events" })).not.toBeInTheDocument();
  });

  it("[AC-1] clicking Sign Out calls POST /auth/signout, clears the token, and navigates to /auth", async () => {
    const user = userEvent.setup();
    sessionTokenValue = "tok_before_signout";
    apiFetchMock.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter initialEntries={["/events"]}>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("link", { name: /Sign Out/i }));

    await waitFor(() => expect(clearSessionTokenMock).toHaveBeenCalled());
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/auth/signout",
      expect.objectContaining({ method: "POST" }),
    );
    expect(navigateMock).toHaveBeenCalledWith("/auth");
  });
});
