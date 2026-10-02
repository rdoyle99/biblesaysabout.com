/* Organization logo for structured data (512x512 PNG) */

import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#f8fafc", fontSize: 220, fontWeight: 700, borderRadius: 96 }}>
        BS
      </div>
    ),
    { width: 512, height: 512 }
  );
}
