import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App shell", () => {
  it("[NFR-003] keeps the app menu visible on the /auth sign-in screen", () => {
    render(
      <MemoryRouter initialEntries={["/auth"]}>
        <App />
      </MemoryRouter>,
    );
    // The app shell (with its My Events menu link) stays visible on /auth,
    // while the guarded organiser content behind it is not rendered.
    expect(screen.getAllByText("My Events").length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: /Sign In/i })).toBeInTheDocument();
  });

  it("[NFR-003] shows the app menu when the protected /events route redirects to /auth", () => {
    // No session token in storage: the guard redirects /events to /auth, but the
    // shell (and its menu) still render around the sign-in screen.
    render(
      <MemoryRouter initialEntries={["/events"]}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getAllByText("My Events").length).toBeGreaterThan(0);
    expect(screen.getByRole("tab", { name: /Sign In/i })).toBeInTheDocument();
  });
});
