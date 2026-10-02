/* Default social image for every page without its own */

import { ImageResponse } from "next/og";
import { getAllTopics, getTotalVerseCount } from "@/lib/verses";

export const alt = "Bible Says About: Bible verses by topic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const topics = getAllTopics().length;
  const verses = getTotalVerseCount().toLocaleString("en-US");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0f172a", color: "#f8fafc", padding: 72 }}>
        <div style={{ fontSize: 32, color: "#94a3b8" }}>biblesaysabout.com</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>What does the Bible say about it?</div>
          <div style={{ fontSize: 36, color: "#cbd5e1", marginTop: 24 }}>{`${verses} verses across ${topics} topics, plus Bible facts counted from the full text`}</div>
        </div>
      </div>
    ),
    size
  );
}
