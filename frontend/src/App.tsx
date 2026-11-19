import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";
import type { ReactElement } from "react";

import { apiFetch, clearSessionToken, getSessionToken } from "@/lib/api";
import { Icons } from "@/lib/icons";
import { useNavigate } from "@/lib/navigate";
import Auth from "@/screens/Auth";
import Events from "@/screens/Events";
import EventEditor from "@/screens/EventEditor";
import GuestList from "@/screens/GuestList";
import PublicEvent from "@/screens/PublicEvent";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center gap-2 rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// NFR-003: organiser pages require a valid session token. With no token, the
// guard redirects to the sign-in page instead of rendering protected content.
function ProtectedScreen({ children }: { children: ReactElement }) {
  if (!getSessionToken()) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

// The Sign Out nav control triggers the sign-out flow (POST /auth/signout, clear
// the token, navigate to /auth) rather than just linking to /auth.
function SignOutLink() {
  const navigate = useNavigate();
  async function handleSignOut(e: React.MouseEvent) {
    e.preventDefault();
    try {
      await apiFetch("/auth/signout", { method: "POST" });
    } catch {
      // Even if the call fails, clear the local session and return to /auth.
    }
    clearSessionToken();
    navigate("/auth");
  }
  return (
    <a href="/auth" onClick={handleSignOut} className={navLinkClass({ isActive: false })}>
      <Icons.X size={16} />
      {"Sign Out"}
    </a>
  );
}

// The app's menu, drawn around every screen except the ones routed outside it below.
function AppShellLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <div className="flex items-center gap-6 px-6 py-2">
          <p
            className="shrink-0 text-sm font-semibold"
            style={{ fontFamily: "var(--brand-font-heading)" }}
          >
            {"Event RSVP"}
          </p>
          <nav aria-label="App menu" className="flex flex-wrap items-center gap-1">
            <NavLink to="/events" className={navLinkClass}>
              <Icons.Home size={16} />
              {"My Events"}
            </NavLink>
            <SignOutLink />
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route
          path="/events"
          element={
            <ProtectedScreen>
              <Events />
            </ProtectedScreen>
          }
        />
        <Route
          path="/event-editor"
          element={
            <ProtectedScreen>
              <EventEditor />
            </ProtectedScreen>
          }
        />
        <Route
          path="/guest-list"
          element={
            <ProtectedScreen>
              <GuestList />
            </ProtectedScreen>
          }
        />
      </Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/public-event" element={<PublicEvent />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
