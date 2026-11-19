// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Input, Textarea, Label, Badge } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Edit } = Icons;

const SAMPLE_EVENT = {
  title: "Q4 Engineering All-Hands",
  description:
    "Quarterly review and roadmap presentation for the full engineering organisation. Light refreshments provided. Badge sign-in required at the lobby desk — please arrive 10 minutes early.",
  startAt: "2026-12-04T18:00",
  location: "Floor 4 Conference Room, 200 Market Street",
  capacity: "80",
  publicToken: "x7K2mP9qR4vB8nL2wY6",
  rsvpsOpen: true,
};

export default function Screen() {
  const navigate = useNavigate();
  const [form, setForm] = React.useState({
    title: SAMPLE_EVENT.title,
    description: SAMPLE_EVENT.description,
    startAt: SAMPLE_EVENT.startAt,
    location: SAMPLE_EVENT.location,
    capacity: SAMPLE_EVENT.capacity,
  });
  const [errors, setErrors] = React.useState({});
  const [saving, setSaving] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [rsvpsOpen, setRsvpsOpen] = React.useState(SAMPLE_EVENT.rsvpsOpen);
  const [rsvpToggling, setRsvpToggling] = React.useState(false);

  const publicToken = SAMPLE_EVENT.publicToken;
  const eventStart = new Date("2026-12-04T18:00:00Z");
  const now = new Date("2026-11-19T00:00:00Z");
  const eventPassed = eventStart < now;

  const cancelRef = React.useRef(null);

  React.useEffect(() => {
    if (deleteOpen && cancelRef.current) cancelRef.current.focus();
  }, [deleteOpen]);

  React.useEffect(() => {
    if (!deleteOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setDeleteOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [deleteOpen]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate() {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = "Title is required.";
    } else if (form.title.length > 120) {
      errs.title = "Title must be 120 characters or fewer.";
    }
    if (form.description && form.description.length > 2000) {
      errs.description = "Description must be 2000 characters or fewer.";
    }
    if (!form.startAt) {
      errs.startAt = "Date and time are required.";
    } else {
      const d = new Date(form.startAt + ":00Z");
      if (isNaN(d.getTime()) || d <= now) {
        errs.startAt = "Date and time must be in the future.";
      }
    }
    if (!form.location.trim()) {
      errs.location = "Location is required.";
    } else if (form.location.length > 200) {
      errs.location = "Location must be 200 characters or fewer.";
    }
    if (form.capacity) {
      const cap = Number(form.capacity);
      if (!Number.isInteger(cap) || cap < 1 || cap > 1000) {
        errs.capacity = "Capacity must be a whole number between 1 and 1000.";
      }
    }
    return errs;
  }

  function handleSave(e) {
    if (e) e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSaving(true);
      setTimeout(() => navigate("events"), 600);
    }
  }

  function handleRsvpToggle() {
    if (eventPassed || rsvpToggling) return;
    setRsvpToggling(true);
    setTimeout(() => {
      setRsvpsOpen((prev) => !prev);
      setRsvpToggling(false);
    }, 350);
  }

  const inputBase = {
    border: "2px solid " + brand.primaryColor,
    borderRadius: brand.radius + "px",
    fontFamily: brand.fontBody,
  };
  const inputErr = {
    border: "2px solid " + brand.accentColor,
    borderRadius: brand.radius + "px",
    fontFamily: brand.fontBody,
  };

  const btnPrimary = {
    backgroundColor: saving ? brand.neutralColor : brand.primaryColor,
    color: brand.backgroundColor,
    border: "2px solid " + brand.primaryColor,
    borderRadius: brand.radius + "px",
    fontFamily: brand.fontBody,
  };
  const btnOutline = {
    backgroundColor: brand.backgroundColor,
    color: brand.primaryColor,
    border: "2px solid " + brand.primaryColor,
    borderRadius: brand.radius + "px",
    fontFamily: brand.fontBody,
  };
  const btnDanger = {
    backgroundColor: brand.backgroundColor,
    color: brand.accentColor,
    border: "2px solid " + brand.accentColor,
    borderRadius: brand.radius + "px",
    fontFamily: brand.fontBody,
  };

  return (
    <div
      className="max-w-3xl mx-auto"
      style={{ fontFamily: brand.fontBody, padding: "32px 24px 64px" }}
    >
      <style>{`
        *:focus-visible {
          outline: 2px solid ${brand.accentColor};
          outline-offset: 2px;
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-panel { animation: modalIn 200ms ease-out; }
        .modal-overlay { animation: overlayIn 150ms ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .modal-panel, .modal-overlay { animation: none; }
          * { transition: none !important; }
        }
        .num { font-variant-numeric: tabular-nums; }
      `}</style>

      {/* Row 1 — Page title */}
      <div data-wf="b-0-0" style={{ marginBottom: "32px" }}>
        <h1
          className="num"
          style={{
            fontSize: "32px",
            fontWeight: 700,
            color: brand.primaryColor,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          Edit Event
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: brand.neutralColor,
            marginTop: "6px",
            marginBottom: 0,
          }}
        >
          Update details, manage RSVP status, or remove this event permanently.
        </p>
      </div>

      {/* Row 2 — Form */}
      <form
        data-wf="b-1-0"
        onSubmit={handleSave}
        style={{ marginBottom: "32px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Title */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <Label
                htmlFor="title"
                className="num"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  color: brand.neutralColor,
                }}
              >
                Title
              </Label>
              <span
                className="num"
                style={{ fontSize: "11px", color: brand.neutralColor }}
              >
                {form.title.length} / 120
              </span>
            </div>
            <Input
              id="title"
              data-wf="i-1-0-0"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              maxLength={120}
              style={errors.title ? inputErr : inputBase}
              className="w-full"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
            />
            {errors.title && (
              <p
                id="title-error"
                style={{
                  fontSize: "12px",
                  color: brand.accentColor,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.AlertCircle size={12} aria-hidden="true" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <Label
                htmlFor="description"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  color: brand.neutralColor,
                }}
              >
                Description (optional)
              </Label>
              <span
                className="num"
                style={{ fontSize: "11px", color: brand.neutralColor }}
              >
                {form.description.length} / 2000
              </span>
            </div>
            <Textarea
              id="description"
              data-wf="i-1-0-1"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              maxLength={2000}
              rows={4}
              style={errors.description ? inputErr : inputBase}
              className="w-full resize-y"
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "desc-error" : undefined}
            />
            {errors.description && (
              <p
                id="desc-error"
                style={{
                  fontSize: "12px",
                  color: brand.accentColor,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.AlertCircle size={12} aria-hidden="true" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <Label
              htmlFor="startAt"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                color: brand.neutralColor,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Date &amp; Time (UTC)
            </Label>
            <Input
              id="startAt"
              data-wf="i-1-0-2"
              type="datetime-local"
              value={form.startAt}
              onChange={(e) => updateField("startAt", e.target.value)}
              style={errors.startAt ? inputErr : inputBase}
              className="w-full sm:w-auto"
              aria-invalid={!!errors.startAt}
              aria-describedby={
                errors.startAt ? "startAt-error" : "startAt-help"
              }
            />
            {errors.startAt ? (
              <p
                id="startAt-error"
                style={{
                  fontSize: "12px",
                  color: brand.accentColor,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.AlertCircle size={12} aria-hidden="true" />
                {errors.startAt}
              </p>
            ) : (
              <p
                id="startAt-help"
                style={{ fontSize: "12px", color: brand.neutralColor, marginTop: "6px" }}
              >
                Times are stored and displayed in UTC. RSVPs close automatically
                once this time passes.
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <Label
                htmlFor="location"
                style={{
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                  color: brand.neutralColor,
                }}
              >
                Location
              </Label>
              <span
                className="num"
                style={{ fontSize: "11px", color: brand.neutralColor }}
              >
                {form.location.length} / 200
              </span>
            </div>
            <Input
              id="location"
              data-wf="i-1-0-3"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              maxLength={200}
              style={errors.location ? inputErr : inputBase}
              className="w-full"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "location-error" : undefined}
            />
            {errors.location && (
              <p
                id="location-error"
                style={{
                  fontSize: "12px",
                  color: brand.accentColor,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.AlertCircle size={12} aria-hidden="true" />
                {errors.location}
              </p>
            )}
          </div>

          {/* Capacity */}
          <div>
            <Label
              htmlFor="capacity"
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                color: brand.neutralColor,
                display: "block",
                marginBottom: "6px",
              }}
            >
              Capacity (optional)
            </Label>
            <Input
              id="capacity"
              data-wf="i-1-0-4"
              type="number"
              min={1}
              max={1000}
              step={1}
              value={form.capacity}
              onChange={(e) => updateField("capacity", e.target.value)}
              placeholder="No limit"
              style={errors.capacity ? inputErr : inputBase}
              className="num w-32"
              aria-invalid={!!errors.capacity}
              aria-describedby={
                errors.capacity ? "capacity-error" : "capacity-help"
              }
            />
            {errors.capacity ? (
              <p
                id="capacity-error"
                style={{
                  fontSize: "12px",
                  color: brand.accentColor,
                  marginTop: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.AlertCircle size={12} aria-hidden="true" />
                {errors.capacity}
              </p>
            ) : (
              <p
                id="capacity-help"
                style={{ fontSize: "12px", color: brand.neutralColor, marginTop: "6px" }}
              >
                Whole number between 1 and 1000. Leave blank for no limit.
              </p>
            )}
          </div>
        </div>

        {/* Hidden submit so Enter in any field saves */}
        <button type="submit" className="sr-only" aria-label="Save event" tabIndex={-1}>
          Save
        </button>
      </form>

      {/* Row 3 — Save button */}
      <div data-wf="b-2-0" style={{ marginBottom: "32px" }}>
        <button
          data-wf="b-2-0"
          onClick={handleSave}
          disabled={saving}
          className="num"
          style={{
            ...btnPrimary,
            padding: "12px 32px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            minHeight: "44px",
            cursor: saving ? "wait" : "pointer",
            transition: "background-color 150ms ease",
          }}
        >
          {saving ? "Saving…" : "Save Event"}
        </button>
      </div>

      {/* Row 4 — Public link */}
      <div data-wf="b-3-0" style={{ marginBottom: "32px" }}>
        <div
          style={{
            border: "2px solid " + brand.primaryColor,
            borderRadius: brand.radius + "px",
            padding: "16px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
              color: brand.neutralColor,
              display: "block",
              marginBottom: "6px",
            }}
          >
            Public Link
          </span>
          <p style={{ fontSize: "14px", color: brand.primaryColor, margin: 0, lineHeight: 1.5 }}>
            <span
              className="num"
              style={{
                fontFamily:
                  'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              eventrsvp.app/e/{publicToken}
            </span>
            {" — "}
            <span style={{ color: brand.neutralColor }}>
              share this with your guests so they can RSVP.
            </span>
          </p>
        </div>
      </div>

      {/* Row 5 — Action buttons */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3"
        style={{ gap: "12px", marginBottom: "24px" }}
      >
        <button
          data-wf="b-4-0"
          onClick={() => navigate("guest-list")}
          style={{
            ...btnOutline,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "background-color 150ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.backgroundColor)}
        >
          <Icons.Users size={14} aria-hidden="true" />
          View Guest List
        </button>

        <button
          data-wf="b-4-1"
          onClick={handleRsvpToggle}
          disabled={eventPassed || rsvpToggling}
          className="num"
          style={{
            backgroundColor: brand.backgroundColor,
            color: eventPassed ? brand.neutralColor : brand.primaryColor,
            border: "2px solid " + (eventPassed ? brand.neutralColor : brand.primaryColor),
            borderRadius: brand.radius + "px",
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: eventPassed || rsvpToggling ? "not-allowed" : "pointer",
            opacity: eventPassed ? 0.55 : 1,
            transition: "background-color 150ms ease",
            fontFamily: brand.fontBody,
          }}
          onMouseEnter={(e) => {
            if (!eventPassed && !rsvpToggling)
              e.currentTarget.style.backgroundColor = "#f5f5f5";
          }}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = brand.backgroundColor)
          }
        >
          {rsvpToggling
            ? "Updating…"
            : eventPassed
            ? "RSVPs Closed"
            : rsvpsOpen
            ? "Close RSVPs"
            : "Reopen RSVPs"}
        </button>

        <button
          data-wf="b-4-2"
          onClick={() => setDeleteOpen(true)}
          style={{
            ...btnDanger,
            padding: "12px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
            transition: "background-color 150ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff5f0")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.backgroundColor)}
        >
          <Icons.Trash size={14} aria-hidden="true" />
          Delete Event
        </button>
      </div>

      {/* RSVP status indicator */}
      <div style={{ marginBottom: "32px" }}>
        <span
          className="num"
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: brand.neutralColor,
          }}
        >
          RSVP Status:{" "}
        </span>
        <span
          className="num"
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 700,
            color: eventPassed || !rsvpsOpen ? brand.accentColor : brand.primaryColor,
          }}
        >
          {eventPassed
            ? "Closed — event has started"
            : rsvpsOpen
            ? "Open"
            : "Closed — manually closed"}
        </span>
      </div>

      {/* Row 6 — Delete confirmation modal */}
      {deleteOpen && (
        <div
          className="modal-overlay"
          data-wf="b-5-0"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17, 17, 17, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 50,
          }}
          onClick={() => setDeleteOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div
            className="modal-panel"
            style={{
              maxWidth: "420px",
              width: "100%",
              backgroundColor: brand.backgroundColor,
              border: "2px solid " + brand.primaryColor,
              borderRadius: brand.radius + "px",
              padding: "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-dialog-title"
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: brand.primaryColor,
                margin: "0 0 12px 0",
                letterSpacing: "-0.01em",
              }}
            >
              Delete this event?
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: brand.neutralColor,
                margin: "0 0 24px 0",
                lineHeight: 1.5,
              }}
            >
              This permanently removes the event and all its RSVPs. This cannot
              be undone.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                data-wf="i-5-0-0"
                ref={cancelRef}
                onClick={() => setDeleteOpen(false)}
                style={{
                  ...btnOutline,
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = brand.backgroundColor)}
              >
                <Icons.X size={14} aria-hidden="true" />
                Cancel
              </button>
              <button
                data-wf="i-5-0-1"
                onClick={() => navigate("events")}
                style={{
                  backgroundColor: brand.accentColor,
                  color: brand.backgroundColor,
                  border: "2px solid " + brand.accentColor,
                  borderRadius: brand.radius + "px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  transition: "background-color 150ms ease",
                  fontFamily: brand.fontBody,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <Icons.Check size={14} aria-hidden="true" />
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
