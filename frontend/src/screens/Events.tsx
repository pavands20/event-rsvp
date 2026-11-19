// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch } from "@/lib/api";

const { Button, Empty } = UI;

const { Plus } = Icons;

type EventCounts = { yes: number; no: number; maybe: number };
type EventListItem = {
  id: string;
  title: string;
  start_at: string;
  capacity: number | null;
  counts: EventCounts;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso: string) {
  var d = new Date(iso);
  return (
    String(d.getUTCDate()).padStart(2, "0") +
    " " +
    MONTHS[d.getUTCMonth()] +
    " " +
    d.getUTCFullYear()
  );
}

function fmtTime(iso: string) {
  var d = new Date(iso);
  return (
    String(d.getUTCHours()).padStart(2, "0") +
    ":" +
    String(d.getUTCMinutes()).padStart(2, "0") +
    " UTC"
  );
}

function hexToRgba(hex: string, alpha: number) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
}

export default function Screen() {
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<EventListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    apiFetch<EventListItem[]>("/events")
      .then((data) => {
        if (!active) return;
        if (Array.isArray(data)) {
          setEvents(data);
          setError("");
        } else {
          setEvents([]);
          setError("Could not load events.");
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load events.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  var NOW = new Date();
  var obsidian = brand.primaryColor;
  var accent = brand.accentColor;
  var neutral = brand.neutralColor;
  var bg = brand.backgroundColor;

  var upcoming = events
    .filter(function (e) {
      return new Date(e.start_at) >= NOW;
    })
    .sort(function (a, b) {
      return new Date(a.start_at).getTime() - new Date(b.start_at).getTime();
    });

  var past = events
    .filter(function (e) {
      return new Date(e.start_at) < NOW;
    })
    .sort(function (a, b) {
      return new Date(b.start_at).getTime() - new Date(a.start_at).getTime();
    });

  var hasEvents = events.length > 0;

  var headerLabel = {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "11px",
    fontWeight: 600,
    color: neutral,
    fontFamily: brand.fontBody,
  };

  var microLabel = {
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontSize: "10px",
    fontWeight: 600,
    fontFamily: brand.fontBody,
  };

  var countCell = {
    padding: "10px 12px",
    textAlign: "center",
    fontSize: "14px",
    fontVariantNumeric: "tabular-nums",
    fontWeight: 500,
    fontFamily: brand.fontBody,
    verticalAlign: "top",
  };

  function renderRow(e: EventListItem, isPast: boolean) {
    // The list endpoint returns counts but not headcount; treat the Yes count
    // as the confirmed headcount for the "Full" indicator.
    var headcount = e.counts.yes;
    var isFull = e.capacity != null && headcount >= e.capacity;
    var textColor = isPast ? neutral : obsidian;
    return (
      <tr
        key={e.id}
        className="evt-row"
        tabIndex={0}
        role="button"
        aria-label={
          "Open " +
          e.title +
          ", " +
          fmtDate(e.start_at) +
          ". " +
          e.counts.yes +
          " yes, " +
          e.counts.no +
          " no, " +
          e.counts.maybe +
          " maybe."
        }
        onClick={function () {
          navigate("event-editor");
        }}
        onKeyDown={function (ev) {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            navigate("event-editor");
          }
        }}
        style={{ borderBottom: "1px solid " + hexToRgba(obsidian, 0.08) }}
      >
        <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: textColor,
              fontVariantNumeric: "tabular-nums",
              fontFamily: brand.fontBody,
            }}
          >
            {fmtDate(e.start_at)}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: neutral,
              fontVariantNumeric: "tabular-nums",
              fontFamily: brand.fontBody,
              marginTop: "1px",
            }}
          >
            {fmtTime(e.start_at)}
          </div>
        </td>
        <td style={{ padding: "10px 16px", verticalAlign: "top" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: textColor,
              fontFamily: brand.fontBody,
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {e.title}
          </div>
          {isFull && (
            <span
              style={Object.assign({}, microLabel, {
                color: accent,
                marginTop: "4px",
                display: "inline-block",
              })}
            >
              Full
            </span>
          )}
        </td>
        <td style={Object.assign({}, countCell, { color: textColor })}>{e.counts.yes}</td>
        <td style={Object.assign({}, countCell, { color: textColor })}>{e.counts.no}</td>
        <td style={Object.assign({}, countCell, { color: textColor })}>{e.counts.maybe}</td>
      </tr>
    );
  }

  return (
    <div
      style={{
        "--hover-bg": hexToRgba(obsidian, 0.04),
        "--focus-color": obsidian,
        maxWidth: "960px",
        margin: "0 auto",
        padding: "32px 24px",
        fontFamily: brand.fontBody,
        color: obsidian,
      }}
    >
      <style>{`
        .evt-row { transition: background-color 0.12s ease; cursor: pointer; }
        .evt-row:hover { background-color: var(--hover-bg); }
        .evt-row:focus-visible { outline: 2px solid var(--focus-color); outline-offset: -2px; }
        .evt-btn:focus-visible { outline: 2px solid var(--focus-color); outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { .evt-row { transition: none; } }
      `}</style>

      {/* Row 1: Page title */}
      <div data-wf="b-0-0">
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: obsidian,
            margin: 0,
            lineHeight: 1.2,
            fontFamily: brand.fontHeading,
          }}
        >
          My Events
        </h1>
        <p
          style={{
            fontSize: "11px",
            color: neutral,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginTop: "8px",
            marginBottom: 0,
            fontFamily: brand.fontBody,
          }}
        >
          {upcoming.length} upcoming · {past.length} past · All times in UTC
        </p>
      </div>

      {/* Row 2: Create Event button */}
      <div data-wf="b-1-0" style={{ marginTop: "24px" }}>
        <Button
          data-wf="b-1-0"
          className="evt-btn"
          onClick={function () {
            navigate("event-editor");
          }}
          style={{
            backgroundColor: obsidian,
            color: bg,
            borderRadius: brand.radius,
            border: "none",
            padding: "9px 18px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: brand.fontBody,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            lineHeight: 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Plus aria-hidden="true" style={{ width: "15px", height: "15px" }} />
          Create Event
        </Button>
      </div>

      {/* Row 3: Loading state */}
      {loading && (
        <div data-wf="b-2-0" style={{ marginTop: "24px", padding: "24px 0" }}>
          <p style={{ fontSize: "14px", color: neutral, fontFamily: brand.fontBody }}>
            Loading your events…
          </p>
        </div>
      )}

      {/* Row 4: Error state */}
      {!loading && error && (
        <div
          data-wf="b-2-1"
          role="alert"
          style={{
            marginTop: "24px",
            border: "2px solid " + accent,
            borderRadius: brand.radius,
            padding: "16px",
            color: accent,
            fontSize: "14px",
            fontFamily: brand.fontBody,
          }}
        >
          <Icons.AlertCircle
            size={16}
            aria-hidden="true"
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {error}
        </div>
      )}

      {/* Row 5: Table */}
      {!loading && !error && hasEvents && (
        <div data-wf="b-2-2" style={{ marginTop: "24px", overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "2px solid " + obsidian,
              fontFamily: brand.fontBody,
              tableLayout: "fixed",
            }}
          >
            <caption
              style={{
                position: "absolute",
                width: "1px",
                height: "1px",
                padding: 0,
                margin: "-1px",
                overflow: "hidden",
                clip: "rect(0 0 0 0)",
                border: 0,
              }}
            >
              Your events with RSVP counts, upcoming first then past
            </caption>
            <colgroup>
              <col style={{ width: "140px" }} />
              <col />
              <col style={{ width: "56px" }} />
              <col style={{ width: "56px" }} />
              <col style={{ width: "66px" }} />
            </colgroup>
            <thead>
              <tr style={{ borderBottom: "2px solid " + obsidian }}>
                <th
                  data-wf="i-2-0-0"
                  style={Object.assign({}, headerLabel, { textAlign: "left", padding: "8px 16px" })}
                >
                  Date
                </th>
                <th
                  data-wf="i-2-0-1"
                  style={Object.assign({}, headerLabel, { textAlign: "left", padding: "8px 16px" })}
                >
                  Title
                </th>
                <th
                  data-wf="i-2-0-2"
                  style={Object.assign({}, headerLabel, {
                    textAlign: "center",
                    padding: "8px 12px",
                  })}
                >
                  Yes
                </th>
                <th
                  data-wf="i-2-0-3"
                  style={Object.assign({}, headerLabel, {
                    textAlign: "center",
                    padding: "8px 12px",
                  })}
                >
                  No
                </th>
                <th
                  data-wf="i-2-0-4"
                  style={Object.assign({}, headerLabel, {
                    textAlign: "center",
                    padding: "8px 12px",
                  })}
                >
                  Maybe
                </th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map(function (e) {
                return renderRow(e, false);
              })}
              {upcoming.length > 0 && past.length > 0 && (
                <tr style={{ borderTop: "2px solid " + obsidian }}>
                  <td
                    colSpan={5}
                    style={Object.assign({}, microLabel, { color: neutral, padding: "6px 16px" })}
                  >
                    Past Events
                  </td>
                </tr>
              )}
              {past.map(function (e) {
                return renderRow(e, true);
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Row 6: Empty state */}
      {!loading && !error && !hasEvents && (
        <div
          data-wf="b-3-0"
          style={{
            marginTop: "24px",
            border: "2px solid " + obsidian,
            borderRadius: brand.radius,
            padding: "48px 32px",
          }}
        >
          <Empty
            title="You have no events yet"
            description="Click 'Create Event' to publish your first event and start collecting RSVPs."
          />
        </div>
      )}
    </div>
  );
}
