/* Social image for a topic page: the title and the first verse */

import { ImageResponse } from "next/og";
import { getAllTopics, getVersesByTopic } from "@/lib/verses";

export const alt = "Bible verses by topic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllTopics().map((topic) => ({ topic }));
}

export default async function Image({ params }) {
  const { topic } = await params;
  const data = getVersesByTopic(topic);
  const verse = data?.verses?.[0];
  const text = verse ? (verse.text.length > 180 ? `${verse.text.slice(0, 177).trimEnd()}...` : verse.text) : "";
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0f172a", color: "#f8fafc", padding: 72 }}>
        <div style={{ fontSize: 30, color: "#94a3b8" }}>biblesaysabout.com</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>{data?.title || "Bible Verses"}</div>
          {verse ? (
            <div style={{ fontSize: 32, color: "#cbd5e1", marginTop: 28, lineHeight: 1.35 }}>{`"${text}" ${verse.reference}`}</div>
          ) : null}
        </div>
      </div>
    ),
    size
  );
}
