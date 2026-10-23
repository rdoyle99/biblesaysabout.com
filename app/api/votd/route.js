/* GET /api/votd: today's verse of the day (New York date) and where it sits in the rotation.
 * The heartbeat for the verse-of-the-day data asset: the SEO run reads it to prove the page rolled over. */

import { NextResponse } from "next/server";
import { verseOfTheDay, todayKey } from "@/lib/verseTool";

export const dynamic = "force-dynamic";

export function GET() {
  const v = verseOfTheDay(todayKey());
  return NextResponse.json(
    {
      date: v.date,
      reference: v.reference,
      web: v.web,
      kjv: v.kjv,
      topics: v.topicLinks.map((t) => t.slug),
      rotation_index: v.index,
      pool_size: v.poolSize,
      next_repeat: v.nextRepeat,
      generated_at: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } }
  );
}
