import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const navigateMock = vi.fn();
vi.mock("@/lib/navigate", () => ({
  useNavigate: () => navigateMock,
  toPath: (route: string) => "/" + route,
}));

const apiFetchMock = vi.fn();
vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api");
  return { ...actual, apiFetch: (...args: unknown[]) => apiFetchMock(...args) };
});

import Events from "./Events";

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={["/events"]}>
      <Events />
    </MemoryRouter>,
  );
}

describe("Events screen UTC rendering", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    apiFetchMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("[NFR-010] shows a UTC label on the events list with no timezone selector", async () => {
    const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    apiFetchMock.mockResolvedValueOnce([
      {
        id: "evt-1",
        title: "Future Gala",
        start_at: d.toISOString(),
        capacity: 25,
        counts: { yes: 0, no: 0, maybe: 0 },
      },
    ]);

    renderScreen();

    await waitFor(() => expect(screen.getByText("Future Gala")).toBeInTheDocument());
    // Times are labelled as UTC and there is no timezone selection UI.
    expect(screen.getByText(/All times in UTC/)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
