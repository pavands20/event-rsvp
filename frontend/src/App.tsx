import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Icons } from "@/lib/icons";
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
            <NavLink to="/auth" className={navLinkClass}>
              <Icons.X size={16} />
              {"Sign Out"}
            </NavLink>
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
        <Route path="/events" element={<Events />} />
        <Route path="/event-editor" element={<EventEditor />} />
        <Route path="/guest-list" element={<GuestList />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/public-event" element={<PublicEvent />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
}
