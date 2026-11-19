import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();
vi.mock("@/lib/navigate", () => ({
  useNavigate: () => navigateMock,
  toPath: (route: string) => "/" + route,
}));

const apiFetchMock = vi.fn();
const setSessionTokenMock = vi.fn();
vi.mock("@/lib/api", () => ({
  apiFetch: (...args: unknown[]) => apiFetchMock(...args),
  setSessionToken: (...args: unknown[]) => setSessionTokenMock(...args),
  getSessionToken: () => null,
  clearSessionToken: () => undefined,
  API_BASE_URL: "http://localhost:8000",
  API_SECRET_KEY: "",
}));

import Auth from "./Auth";

function renderAuth() {
  return render(
    <MemoryRouter initialEntries={["/auth"]}>
      <Auth />
    </MemoryRouter>,
  );
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
) {
  await user.type(screen.getByLabelText(/Email/i), email);
  await user.type(screen.getByLabelText(/Password/i), password);
  await user.click(screen.getByRole("button", { name: /Sign Up|Sign In/i }));
}

describe("Auth screen", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    apiFetchMock.mockReset();
    setSessionTokenMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("[AC-001] signup success calls POST /auth/signup, stores the token, and navigates to /events", async () => {
    const user = userEvent.setup();
    apiFetchMock.mockResolvedValueOnce({
      token: "tok_abc",
      organiser: { id: 1, email: "new@user.eu" },
    });

    renderAuth();
    await user.click(screen.getByRole("tab", { name: /Sign Up/i }));
    await fillAndSubmit(user, "new@user.eu", "password123");

    await waitFor(() => expect(setSessionTokenMock).toHaveBeenCalledWith("tok_abc"));
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/auth/signup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "new@user.eu", password: "password123" }),
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("events");
  });

  it("[AC-002] signup with an already-registered email displays the API error 'This email is already in use'", async () => {
    const user = userEvent.setup();
    apiFetchMock.mockRejectedValueOnce(new Error("This email is already in use"));

    renderAuth();
    await user.click(screen.getByRole("tab", { name: /Sign Up/i }));
    await fillAndSubmit(user, "organiser@clubboard.eu", "password123");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("This email is already in use"),
    );
    expect(setSessionTokenMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("[AC-003] signup with a password < 8 chars displays the API error 'Password must be at least 8 characters'", async () => {
    const user = userEvent.setup();
    apiFetchMock.mockRejectedValueOnce(new Error("Password must be at least 8 characters"));

    renderAuth();
    await user.click(screen.getByRole("tab", { name: /Sign Up/i }));
    await fillAndSubmit(user, "short@user.eu", "short");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Password must be at least 8 characters"),
    );
    expect(setSessionTokenMock).not.toHaveBeenCalled();
  });

  it("[AC-004] signin success calls POST /auth/signin, stores the token, and navigates to /events", async () => {
    const user = userEvent.setup();
    apiFetchMock.mockResolvedValueOnce({
      token: "tok_signin",
      organiser: { id: 2, email: "organiser@clubboard.eu" },
    });

    renderAuth();
    await fillAndSubmit(user, "organiser@clubboard.eu", "password123");

    await waitFor(() => expect(setSessionTokenMock).toHaveBeenCalledWith("tok_signin"));
    expect(apiFetchMock).toHaveBeenCalledWith(
      "/auth/signin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "organiser@clubboard.eu", password: "password123" }),
      }),
    );
    expect(navigateMock).toHaveBeenCalledWith("events");
  });

  it("[AC-005] signin with incorrect credentials displays 'Invalid email or password'", async () => {
    const user = userEvent.setup();
    apiFetchMock.mockRejectedValueOnce(new Error("Invalid email or password"));

    renderAuth();
    await fillAndSubmit(user, "organiser@clubboard.eu", "wrongpassword");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid email or password"),
    );
    expect(setSessionTokenMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("[AC-011] keeps the 'Password recovery is not available' message visible", () => {
    renderAuth();
    expect(screen.getByText(/Password recovery is not available/i)).toBeInTheDocument();
  });
});
