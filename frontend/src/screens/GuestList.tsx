// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Switch, Table, THead, TBody, TR, TH, TD } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Filter, Download, ArrowLeft } = Icons;

const EVENT_TITLE = "Saturday Hike";
const EVENT_CAPACITY = 20;

const SAMPLE_RSVPS = [
  { guest_name: "Maya Lindqvist", guest_email: "maya.lindqvist@gmail.com", response: "Yes", extra_guests: 1, answered_at: "2026-11-15T09:32:00Z" },
  { guest_name: "Tom Bridgeman", guest_email: "t.bridgeman@protonmail.com", response: "Yes", extra_guests: 0, answered_at: "2026-11-15T14:18:00Z" },
  { guest_name: "Priya Anand", guest_email: "priya.anand@outlook.com", response: "Yes", extra_guests: 1, answered_at: "2026-11-16T08:05:00Z" },
  { guest_name: "Daniel Osei", guest_email: "daniel.osei@fastmail.com", response: "Yes", extra_guests: 0, answered_at: "2026-11-16T11:47:00Z" },
  { guest_name: "Hannah Müller", guest_email: "h.mueller@gmx.de", response: "Yes", extra_guests: 2, answered_at: "2026-11-16T19:22:00Z" },
  { guest_name: "Sofie Eklund", guest_email: "sofie.eklund@icloud.com", response: "Yes", extra_guests: 2, answered_at: "2026-11-17T07:14:00Z" },
  { guest_name: "James Whitfield", guest_email: "j.whitfield@protonmail.com", response: "No", extra_guests: 0, answered_at: "2026-11-15T10:41:00Z" },
  { guest_name: "Carla Rossi", guest_email: "carla.rossi@gmail.com", response: "Maybe", extra_guests: 0, answered_at: "2026-11-16T13:55:00Z" },
  { guest_name: "Liam O'Brien", guest_email: "liam.obrien@yahoo.com", response: "No", extra_guests: 0, answered_at: "2026-11-17T16:30:00Z" },
  { guest_name: "Yuki Tanaka", guest_email: "y.tanaka@kagoya.jp", response: "Maybe", extra_guests: 0, answered_at: "2026-11-18T09:08:00Z" },
];

function formatUTC(iso) {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const mins = String(d.getUTCMinutes()).padStart(2, "0");
  return day + "/" + month + "/" + d.getUTCFullYear() + " " + hours + ":" + mins + " UTC";
}

export default function Screen() {
  const navigate = useNavigate();
  const [rsvps] = React.useState(SAMPLE_RSVPS);
  const [activeFilter, setActiveFilter] = React.useState("All");

  const headcount = rsvps
    .filter(function (r) { return r.response === "Yes"; })
    .reduce(function (sum, r) { return sum + 1 + r.extra_guests; }, 0);

  const filtered = activeFilter === "All"
    ? rsvps
    : rsvps.filter(function (r) { return r.response === activeFilter; });

  function handleDownloadCSV() {
    var rows = filtered.map(function (r) {
      return [
        r.guest_name,
        r.guest_email,
        r.response,
        String(r.extra_guests),
        formatUTC(r.answered_at),
      ];
    });
    var header = ["Name", "Email", "Response", "Extra Guests", "Answered At"];
    var csv = [header].concat(rows)
      .map(function (row) {
        return row.map(function (cell) {
          var c = String(cell);
          if (c.indexOf(",") !== -1 || c.indexOf('"') !== -1) {
            return '"' + c.replace(/"/g, '""') + '"';
          }
          return c;
        }).join(",");
      })
      .join("\n");
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "guest-list-saturday-hike.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  var labelStyle = {
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 600,
    color: brand.neutralColor,
  };

  var responseLabel = function (resp) {
    var baseStyle = {
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "0.02em",
      padding: "2px 8px",
      border: "2px solid " + brand.primaryColor,
      display: "inline-block",
      minWidth: "52px",
      textAlign: "center",
    };
    if (resp === "Yes") {
      return baseStyle;
    } else if (resp === "No") {
      return Object.assign({}, baseStyle, { color: brand.neutralColor, borderColor: brand.neutralColor });
    } else {
      return Object.assign({}, baseStyle, { color: brand.accentColor, borderColor: brand.accentColor });
    }
  };

  var isEmpty = rsvps.length === 0;
  var filterCount = function (key) {
    if (key === "All") return rsvps.length;
    return rsvps.filter(function (r) { return r.response === key; }).length;
  };

  return (
    <div style={{ fontFamily: brand.fontBody, color: brand.primaryColor, minHeight: "100%" }}>
      {/* Row 1: Page title */}
      <div data-wf="b-0-0" style={{ marginBottom: "8px" }}>
        <div style={labelStyle}>Guest List</div>
        <h1 style={{
          fontSize: "32px",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: "4px 0 0 0",
          color: brand.primaryColor,
        }}>
          {EVENT_TITLE}
        </h1>
      </div>

      {/* Row 2: Total headcount */}
      <div data-wf="b-1-0" style={{
        marginBottom: "24px",
        paddingBottom: "16px",
        borderBottom: "2px solid " + brand.primaryColor,
      }}>
        <span style={{
          fontSize: "14px",
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums",
        }}>
          Total headcount:{" "}
          <span style={{ fontSize: "20px", fontWeight: 700 }}>{headcount}</span>
        </span>
        <span style={{
          fontSize: "13px",
          color: brand.neutralColor,
          marginLeft: "8px",
        }}>
          (Yes answers plus their extra guests)
        </span>
        {EVENT_CAPACITY && (
          <span style={{
            fontSize: "13px",
            color: brand.neutralColor,
            marginLeft: "16px",
            fontVariantNumeric: "tabular-nums",
          }}>
            Capacity {headcount}/{EVENT_CAPACITY}
          </span>
        )}
      </div>

      {/* Row 3: Filter tabs */}
      <div data-wf="b-2-0" style={{ marginBottom: "0" }}>
        <div role="tablist" aria-label="Filter guests by response" style={{ display: "flex", borderBottom: "2px solid " + brand.primaryColor }}>
          {["All", "Yes", "No", "Maybe"].map(function (key) {
            var isActive = activeFilter === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                data-wf={"i-2-0-" + (["All", "Yes", "No", "Maybe"].indexOf(key))}
                onClick={function () { setActiveFilter(key); }}
                style={{
                  border: "none",
                  borderBottom: isActive ? "2px solid " + brand.accentColor : "2px solid transparent",
                  marginBottom: "-2px",
                  background: "transparent",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.01em",
                  color: isActive ? brand.primaryColor : brand.neutralColor,
                  fontVariantNumeric: "tabular-nums",
                  outlineOffset: "-4px",
                }}
              >
                {key}{" "}
                <span style={{
                  fontSize: "12px",
                  color: brand.neutralColor,
                  fontWeight: 400,
                }}>
                  ({filterCount(key)})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 4: Table */}
      <div data-wf="b-3-0" style={{ marginBottom: "24px" }}>
        {isEmpty ? (
          <div data-wf="b-5-0" style={{
            border: "2px solid " + brand.primaryColor,
            borderTop: "none",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: brand.primaryColor,
              marginBottom: "6px",
            }}>
              No responses yet
            </div>
            <div style={{
              fontSize: "14px",
              color: brand.neutralColor,
              maxWidth: "400px",
              margin: "0 auto",
              lineHeight: 1.5,
            }}>
              Share your public link to start collecting RSVPs.
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            border: "2px solid " + brand.primaryColor,
            borderTop: "none",
            padding: "48px 24px",
            textAlign: "center",
          }}>
            <div style={{
              fontSize: "15px",
              fontWeight: 600,
              color: brand.primaryColor,
              marginBottom: "6px",
            }}>
              No {activeFilter.toLowerCase()} responses
            </div>
            <div style={{
              fontSize: "14px",
              color: brand.neutralColor,
            }}>
              Switch to another tab to see other responses.
            </div>
          </div>
        ) : (
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontVariantNumeric: "tabular-nums",
            fontSize: "13px",
          }}>
            <THead>
              <TR style={{
                borderBottom: "2px solid " + brand.primaryColor,
                textAlign: "left",
              }}>
                <TH data-wf="i-3-0-0" style={{
                  padding: "10px 16px 10px 0",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: brand.neutralColor,
                  borderBottom: "2px solid " + brand.primaryColor,
                }}>Name</TH>
                <TH data-wf="i-3-0-1" style={{
                  padding: "10px 16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: brand.neutralColor,
                  borderBottom: "2px solid " + brand.primaryColor,
                }}>Email</TH>
                <TH data-wf="i-3-0-2" style={{
                  padding: "10px 16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: brand.neutralColor,
                  borderBottom: "2px solid " + brand.primaryColor,
                }}>Response</TH>
                <TH data-wf="i-3-0-3" style={{
                  padding: "10px 16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: brand.neutralColor,
                  borderBottom: "2px solid " + brand.primaryColor,
                  textAlign: "right",
                }}>Extra Guests</TH>
                <TH data-wf="i-3-0-4" style={{
                  padding: "10px 0 10px 16px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: brand.neutralColor,
                  borderBottom: "2px solid " + brand.primaryColor,
                  textAlign: "right",
                }}>Answered At</TH>
              </TR>
            </THead>
            <TBody>
              {filtered.map(function (r, idx) {
                return (
                  <TR
                    key={r.guest_email}
                    style={{
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                    }}
                  >
                    <TD style={{
                      padding: "12px 16px 12px 0",
                      fontWeight: 600,
                      color: brand.primaryColor,
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                    }}>
                      {r.guest_name}
                    </TD>
                    <TD style={{
                      padding: "12px 16px",
                      color: brand.neutralColor,
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                      fontSize: "13px",
                    }}>
                      {r.guest_email}
                    </TD>
                    <TD style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                    }}>
                      <span style={responseLabel(r.response)}>{r.response}</span>
                    </TD>
                    <TD style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: r.response === "Yes" ? brand.primaryColor : brand.neutralColor,
                      fontWeight: r.response === "Yes" ? 600 : 400,
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                    }}>
                      {r.response === "Yes" ? r.extra_guests : "—"}
                    </TD>
                    <TD style={{
                      padding: "12px 0 12px 16px",
                      textAlign: "right",
                      color: brand.neutralColor,
                      fontSize: "12px",
                      borderBottom: "1px solid rgba(17,17,17,0.10)",
                      whiteSpace: "nowrap",
                    }}>
                      {formatUTC(r.answered_at)}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </table>
        )}
      </div>

      {/* Row 5: Buttons */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <div data-wf="b-4-0" style={{ flex: "1 1 0", minWidth: "200px" }}>
          <Button
            onClick={handleDownloadCSV}
            disabled={isEmpty}
            style={{
              width: "100%",
              background: brand.primaryColor,
              color: brand.backgroundColor,
              border: "2px solid " + brand.primaryColor,
              borderRadius: brand.radius,
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: isEmpty ? "not-allowed" : "pointer",
              opacity: isEmpty ? 0.4 : 1,
              transition: "background 0.15s ease",
            }}
          >
            <Download style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} aria-hidden="true" />
            Download CSV{activeFilter !== "All" ? " (" + activeFilter + ")" : ""}
          </Button>
        </div>
        <div data-wf="b-4-1" style={{ flex: "1 1 0", minWidth: "200px" }}>
          <Button
            onClick={function () { navigate("event-editor"); }}
            style={{
              width: "100%",
              background: "transparent",
              color: brand.primaryColor,
              border: "2px solid " + brand.primaryColor,
              borderRadius: brand.radius,
              padding: "12px 24px",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              cursor: "pointer",
            }}
          >
            <ArrowLeft style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} aria-hidden="true" />
            Back to Event
          </Button>
        </div>
      </div>
    </div>
  );
}
