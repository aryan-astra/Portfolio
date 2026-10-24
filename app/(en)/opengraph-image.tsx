import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Aryan Shukla — Builder. CSE @ SRMIST.";
export const dynamic = "force-static";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "72px 80px",
          fontFamily: "monospace",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          <span>aryans.is-a.dev</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 12,
                height: 12,
                background: "#ffffff",
                display: "block",
              }}
            />
            personal index
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 160,
              fontWeight: 700,
              letterSpacing: -4,
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            Aryan Shukla
          </div>
          <div
            style={{
              fontSize: 36,
              color: "#d1d5db",
              maxWidth: 900,
              lineHeight: 1.3,
            }}
          >
            Builder. CSE @ SRMIST. 300+ daily users on my projects.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#9ca3af",
            letterSpacing: 2,
          }}
        >
          <span>{"> _"}</span>
          <span>2026 · built in public</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
