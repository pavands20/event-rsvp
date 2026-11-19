// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Input, Label, Select, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { AlertCircle, CheckCircle } = Icons;

const SAMPLE_EVENT = {
  title: "Saturday Hike at Bear Mountain",
  start_at: "2026-03-15T09:00:00Z",
  location: "Bear Mountain Trailhead",
  description:
    "Join us for a scenic group hike up Bear Mountain. Bring water, sturdy shoes, and a packed lunch. We'll meet at the trailhead parking area.",
  capacity: 15,
  rsvps_open: true,
};

const INITIAL_RSVPS = [
  { guest_name: "Marcus Vidal", guest_email: "m.vidal@outlook.com", response: "Yes", extra_guests: 2, answered_at: "2026-11-16T14:22:00Z" },
  { guest_name: "Priya Anand", guest_email: "priya.anand@gmail.com", response: "Yes", extra_guests: 0, answered_at: "2026-11-16T15:10:00Z" },
  { guest_name: "Tomás Beck", guest_email: "tomas.beck@proton.me", response: "Yes", extra_guests: 1, answered_at: "2026-11-17T08:45:00Z" },
  { guest_name: "Lena Okafor", guest_email: "lena.okafor@gmail.com", response: "No", extra_guests: 0, answered_at: "2026-11-17T11:30:00Z" },
  { guest_name: "Hiro Tanaka", guest_email: "hiro.tanaka@fastmail.com", response: "Maybe", extra_guests: 0, answered_at: "2026-11-17T16:05:00Z" },
  { guest_name: "Sara Lindqvist", guest_email: "sara.l@icloud.com", response: "Yes", extra_guests: 3, answered_at: "2026-11-18T09:15:00Z" },
  { guest_name: "Devon Reyes", guest_email: "devon.reyes@gmail.com", response: "Yes", extra_guests: 0, answered_at: "2026-11-18T12:40:00Z" },
];

export default function Screen() {
  const [rsvps, setRsvps] = React.useState(INITIAL_RSVPS);
  const [eventFound] = React.useState(true);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    response: "Yes",
    extraGuests: "0",
  });
  const [errors, setErrors] = React.useState({});
  const [successMsg, setSuccessMsg] = React.useState(null);
  const [formError, setFormError] = React.useState(null);

  const event = SAMPLE_EVENT;

  const headcount = rsvps
    .filter((r) => r.response === "Yes")
    .reduce((sum, r) => sum + 1 + r.extra_guests, 0);

  const isAtCapacity = event.capacity != null && headcount >= event.capacity;
  const isClosed = !event.rsvps_open;
  const spotsRemaining =
    event.capacity != null ? Math.max(0, event.capacity - headcount) : null;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSuccessMsg(null);
    setFormError(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};

    if (!form.name.trim()) {
      errs.name = "Your name is required.";
    }
    if (!form.email.trim()) {
      errs.email = "Your email is required.";
    } else if (!isValidEmail(form.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (isClosed) {
      setFormError("RSVPs are closed for this event.");
      return;
    }

    const email = form.email.trim().toLowerCase();
    const existingIdx = rsvps.findIndex(
      (r) => r.guest_email.toLowerCase() === email
    );
    const isYes = form.response === "Yes";

    if (isYes && event.capacity != null) {
      const existingContrib =
        existingIdx >= 0 && rsvps[existingIdx].response === "Yes"
          ? 1 + rsvps[existingIdx].extra_guests
          : 0;
      const newHeadcount =
        headcount - existingContrib + 1 + parseInt(form.extraGuests, 10);
      if (newHeadcount > event.capacity) {
        setFormError(
          "This event is full — no more Yes responses are accepted. You can still RSVP as No or Maybe."
        );
        return;
      }
    }

    const now = new Date().toISOString();
    const rsvpData = {
      guest_name: form.name.trim(),
      guest_email: form.email.trim(),
      response: form.response,
      extra_guests: form.response === "Yes" ? parseInt(form.extraGuests, 10) : 0,
      answered_at: now,
    };

    if (existingIdx >= 0) {
      const updated = rsvps.slice();
      updated[existingIdx] = {
        ...updated[existingIdx],
        ...rsvpData,
        updated_at: now,
      };
      setRsvps(updated);
    } else {
      setRsvps([...rsvps, rsvpData]);
    }

    setSuccessMsg(
      "Your RSVP has been recorded. Submit again with the same email to update your answer."
    );
    setFormError(null);
    setErrors({});
  }

  /* ---- Shared inline styles ---- */

  const pageStyle = {
    backgroundColor: brand.backgroundColor,
    fontFamily: brand.fontBody,
    minHeight: "100vh",
    color: brand.primaryColor,
    WebkitFontSmoothing: "antialiased",
  };

  const containerStyle = {
    maxWidth: "560px",
    margin: "0 auto",
    padding: "48px 20px 64px",
  };

  const h1Style = {
    fontSize: "26px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
    margin: "0 0 12px 0",
    color: brand.primaryColor,
  };

  const metaStyle = {
    fontSize: "13px",
    lineHeight: 1.5,
    color: brand.neutralColor,
    margin: "0 0 16px 0",
    fontVariantNumeric: "tabular-nums",
  };

  const descStyle = {
    fontSize: "15px",
    lineHeight: 1.6,
    color: brand.primaryColor,
    margin: "0 0 28px 0",
  };

  const ruleStyle = {
    borderTop: `2px solid ${brand.primaryColor}`,
    margin: "0 0 28px 0",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: brand.neutralColor,
    display: "block",
    marginBottom: "6px",
  };

  const inputBase = {
    width: "100%",
    padding: "9px 12px",
    fontSize: "14px",
    fontFamily: brand.fontBody,
    color: brand.primaryColor,
    backgroundColor: brand.backgroundColor,
    border: `2px solid ${brand.primaryColor}`,
    borderRadius: brand.radius,
    boxSizing: "border-box",
  };

  const errorTextStyle = {
    fontSize: "12px",
    color: brand.accentColor,
    margin: "5px 0 0 0",
    lineHeight: 1.4,
  };

  const helperTextStyle = {
    fontSize: "12px",
    color: brand.neutralColor,
    margin: "5px 0 0 0",
    lineHeight: 1.4,
  };

  const formContainerStyle = {
    border: `2px solid ${brand.primaryColor}`,
    borderRadius: brand.radius,
    padding: "24px 20px",
    backgroundColor: brand.backgroundColor,
  };

  const formHeadingStyle = {
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: brand.primaryColor,
    margin: "0 0 4px 0",
  };

  const fieldSpacing = { marginBottom: "18px" };

  const buttonStyle = {
    width: "100%",
    padding: "11px 20px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: brand.fontBody,
    color: brand.backgroundColor,
    backgroundColor: brand.primaryColor,
    border: `2px solid ${brand.primaryColor}`,
    borderRadius: brand.radius,
    cursor: "pointer",
    transition: "background-color 0.12s ease, color 0.12s ease",
    minHeight: "44px",
  };

  const noticeBase = {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "12px 14px",
    fontSize: "13px",
    lineHeight: 1.5,
    borderRadius: brand.radius,
  };

  const fullNoticeStyle = {
    ...noticeBase,
    border: `2px solid ${brand.accentColor}`,
    color: brand.accentColor,
    backgroundColor: brand.backgroundColor,
    marginBottom: "20px",
  };

  const closedNoticeStyle = {
    ...noticeBase,
    border: `2px solid ${brand.accentColor}`,
    color: brand.accentColor,
    backgroundColor: brand.backgroundColor,
    marginBottom: "20px",
  };

  const formErrorStyle = {
    ...noticeBase,
    border: `2px solid ${brand.accentColor}`,
    color: brand.accentColor,
    backgroundColor: brand.backgroundColor,
    marginBottom: "16px",
  };

  const successStyle = {
    ...noticeBase,
    border: `2px solid ${brand.primaryColor}`,
    color: brand.primaryColor,
    backgroundColor: brand.backgroundColor,
    marginTop: "16px",
  };

  /* ---- Not-found state ---- */

  if (!eventFound) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div
            data-wf="b-8-0"
            style={{ borderTop: `2px solid ${brand.primaryColor}`, paddingTop: "40px" }}
          >
            <Empty
              title="Event not found"
              description="This event could not be found. Please check your link and try again."
            />
          </div>
        </div>
      </div>
    );
  }

  /* ---- Main render ---- */

  const yesOptions = [0, 1, 2, 3, 4, 5];

  return (
    <div style={pageStyle}>
      <style>{`
        .rsvp-input:focus-visible,
        .rsvp-select:focus-visible {
          outline: none;
          border-color: ${brand.accentColor};
        }
        .rsvp-button:focus-visible {
          outline: 2px solid ${brand.accentColor};
          outline-offset: 2px;
        }
        .rsvp-button:hover {
          background-color: ${brand.neutralColor};
          border-color: ${brand.neutralColor};
        }
        .fade-in {
          animation: rsvpFadeIn 0.18s ease-out;
        }
        @keyframes rsvpFadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .row-enter {
          animation: rsvpRowEnter 0.15s ease-out;
        }
        @keyframes rsvpRowEnter {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fade-in, .row-enter { animation: none; }
          .rsvp-button { transition: none; }
        }
      `}</style>

      <div style={containerStyle}>
        {/* Row 1 — Title */}
        <h1 data-wf="b-0-0" style={h1Style}>
          {event.title}
        </h1>

        {/* Row 2 — Date / time / location */}
        <p data-wf="b-1-0" style={metaStyle}>
          Saturday, 15 March 2026 &middot; 09:00 UTC &middot; Bear Mountain Trailhead
        </p>

        {/* Row 3 — Description */}
        <p data-wf="b-2-0" style={descStyle}>
          {event.description}
        </p>

        <div style={ruleStyle} />

        {/* Row 7 — RSVPs closed notice (conditional) */}
        {isClosed && (
          <div data-wf="b-6-0" style={closedNoticeStyle} role="alert">
            <AlertCircle size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: "1px" }} />
            <span>
              RSVPs are closed — this event has already started or the organiser has closed
              responses.
            </span>
          </div>
        )}

        {/* Row 8 — Event full notice (conditional) */}
        {isAtCapacity && !isClosed && (
          <div data-wf="b-7-0" style={fullNoticeStyle} role="status">
            <AlertCircle size={16} aria-hidden="true" style={{ flexShrink: 0, marginTop: "1px" }} />
            <span>
              This event is full — no more Yes responses are accepted. You can still RSVP as No or
              Maybe.
            </span>
          </div>
        )}

        {/* Row 4 — RSVP form */}
        <form
          data-wf="b-3-0"
          onSubmit={handleSubmit}
          style={formContainerStyle}
          aria-labelledby="rsvp-heading"
        >
          <h2 id="rsvp-heading" style={formHeadingStyle}>
            RSVP
          </h2>

          {/* Capacity helper text */}
          {event.capacity != null && (
            <p style={helperTextStyle}>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{headcount}</span> of{" "}
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{event.capacity}</span> spots
              confirmed
              {spotsRemaining != null && spotsRemaining > 0
                ? " · " + spotsRemaining + " remaining"
                : ""}
            </p>
          )}

          {/* Your Name */}
          <div style={{ ...fieldSpacing, marginTop: "18px" }}>
            <Label htmlFor="rsvp-name" style={labelStyle}>
              Your Name
            </Label>
            <Input
              id="rsvp-name"
              data-wf="i-3-0-0"
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              style={inputBase}
              className="rsvp-input"
              maxLength={120}
              autoComplete="name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "rsvp-name-error" : undefined}
            />
            {errors.name && (
              <p id="rsvp-name-error" style={errorTextStyle} role="alert">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div style={fieldSpacing}>
            <Label htmlFor="rsvp-email" style={labelStyle}>
              Email
            </Label>
            <Input
              id="rsvp-email"
              data-wf="i-3-0-1"
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              style={inputBase}
              className="rsvp-input"
              autoComplete="email"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "rsvp-email-error" : undefined}
            />
            {errors.email && (
              <p id="rsvp-email-error" style={errorTextStyle} role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Response */}
          <div style={fieldSpacing}>
            <Label htmlFor="rsvp-response" style={labelStyle}>
              Response (Yes / No / Maybe)
            </Label>
            <Select
              id="rsvp-response"
              data-wf="i-3-0-2"
              value={form.response}
              onChange={(e) => updateField("response", e.target.value)}
              style={inputBase}
              className="rsvp-select"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Maybe">Maybe</option>
            </Select>
          </div>

          {/* Extra Guests */}
          <div style={{ marginBottom: "20px" }}>
            <Label htmlFor="rsvp-extra" style={labelStyle}>
              Extra Guests (0-5, Yes only)
            </Label>
            <Select
              id="rsvp-extra"
              data-wf="i-3-0-3"
              value={form.extraGuests}
              onChange={(e) => updateField("extraGuests", e.target.value)}
              style={{
                ...inputBase,
                ...(form.response !== "Yes"
                  ? { opacity: 0.4, cursor: "not-allowed" }
                  : {}),
              }}
              className="rsvp-select"
              disabled={form.response !== "Yes"}
            >
              {yesOptions.map((n) => (
                <option key={n} value={String(n)}>
                  {n}
                </option>
              ))}
            </Select>
            {form.response !== "Yes" && (
              <p style={helperTextStyle}>
                Extra guests are only applicable when your response is Yes.
              </p>
            )}
          </div>

          {/* Inline form error (capacity / closed) */}
          {formError && (
            <div style={formErrorStyle} role="alert">
              <AlertCircle
                size={16}
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: "1px" }}
              />
              <span>{formError}</span>
            </div>
          )}

          {/* Row 5 — Submit button */}
          <div data-wf="b-4-0">
            <button type="submit" className="rsvp-button" style={buttonStyle}>
              Submit RSVP
            </button>
          </div>
        </form>

        {/* Row 6 — Success message (conditional) */}
        {successMsg && (
          <div data-wf="b-5-0" style={successStyle} className="fade-in" role="status">
            <CheckCircle
              size={16}
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: "1px" }}
            />
            <span>{successMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
