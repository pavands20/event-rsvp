// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.

import React from "react";

import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch, setSessionToken } from "@/lib/api";

const PRODUCT = "Event RSVP";

type AuthResponse = { token: string; organiser: { id: number; email: string } };

export default function Screen() {
  const navigate = useNavigate();
  const [tab, setTab] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const rule = `2px solid ${brand.primaryColor}`;
  const field = { border: rule, borderRadius: brand.radius, height: 44 };

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      const path = tab === "signup" ? "/auth/signup" : "/auth/signin";
      const data = await apiFetch<AuthResponse>(path, {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });
      setSessionToken(data.token);
      navigate("events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}
    >
      <style>{`
        input:focus { --tw-ring-color: ${brand.primaryColor}; --tw-ring-offset-color: transparent; }
        button:focus-visible { --tw-ring-color: ${brand.accentColor}; --tw-ring-offset-color: transparent; }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; }
        }
      `}</style>

      {/* Row 1: page_title */}
      <header data-wf="b-0-0" className="px-10 py-5" style={{ borderBottom: rule }}>
        <h1 className="text-lg font-bold tracking-tight" style={{ fontFamily: brand.fontHeading }}>
          {PRODUCT}
        </h1>
      </header>

      <div className="flex flex-1 items-start justify-center px-6 py-12">
        <div className="w-full max-w-[440px]">
          {/* Row 2: tabs */}
          <div
            data-wf="b-1-0"
            role="tablist"
            aria-label="Authentication"
            className="flex"
            style={{ borderBottom: rule }}
          >
            <button
              data-wf="i-1-0-0"
              type="button"
              role="tab"
              aria-selected={tab === "signin"}
              aria-controls="auth-form"
              id="tab-signin"
              onClick={() => {
                setTab("signin");
                setError("");
              }}
              className="px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2"
              style={{
                borderBottom:
                  tab === "signin" ? `2px solid ${brand.primaryColor}` : `2px solid transparent`,
                marginBottom: "-2px",
                color: tab === "signin" ? brand.primaryColor : brand.neutralColor,
              }}
            >
              Sign In
            </button>
            <button
              data-wf="i-1-0-1"
              type="button"
              role="tab"
              aria-selected={tab === "signup"}
              aria-controls="auth-form"
              id="tab-signup"
              onClick={() => {
                setTab("signup");
                setError("");
              }}
              className="px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2"
              style={{
                borderBottom:
                  tab === "signup" ? `2px solid ${brand.primaryColor}` : `2px solid transparent`,
                marginBottom: "-2px",
                color: tab === "signup" ? brand.primaryColor : brand.neutralColor,
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Row 3: form */}
          <form
            id="auth-form"
            data-wf="b-2-0"
            role="tabpanel"
            aria-labelledby={tab === "signin" ? "tab-signin" : "tab-signup"}
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
          >
            <div className="space-y-2">
              <label
                htmlFor="auth-email"
                className="block text-[11px] font-bold uppercase tracking-[0.16em]"
              >
                Email
              </label>
              <input
                id="auth-email"
                data-wf="i-2-0-0"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white px-3 text-sm outline-none focus:ring-2"
                style={field}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="auth-password"
                className="block text-[11px] font-bold uppercase tracking-[0.16em]"
              >
                Password (min 8 characters)
              </label>
              <input
                id="auth-password"
                data-wf="i-2-0-1"
                type="password"
                autoComplete={tab === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white px-3 text-sm outline-none focus:ring-2"
                style={field}
              />
            </div>

            {error && (
              <p
                role="alert"
                className="px-4 py-3 text-sm font-semibold"
                style={{ border: `2px solid ${brand.accentColor}`, color: brand.accentColor }}
              >
                {error}
              </p>
            )}

            {/* Row 4: button */}
            <button
              data-wf="b-3-0"
              type="submit"
              disabled={loading}
              className="h-11 w-full text-sm font-bold uppercase tracking-[0.16em] text-white disabled:opacity-50 focus:outline-none focus:ring-2"
              style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}
            >
              {loading ? "Please wait…" : tab === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Row 5: text */}
          <p data-wf="b-4-0" className="mt-8 text-sm" style={{ color: brand.neutralColor }}>
            Forgot your password? Password recovery is not available. If you lose access, your
            events and guest lists are permanently lost.
          </p>
        </div>
      </div>
    </div>
  );
}
