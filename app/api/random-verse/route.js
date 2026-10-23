/* GET /api/random-verse?source=everyday|topics|bible&topic=<slug>&testament=OT|NT&book=<name>
 * One random verse in the WEB and the KJV for the tool on /random-bible-verse. */

import { NextResponse } from "next/server";
import { randomTopicVerse, bookNames } from "@/lib/verseTool";
import { randomBibleVerse } from "@/lib/bibleText";

export const dynamic = "force-dynamic";

const BOOKS = new Set(bookNames.map((b) => b.name));

export function GET(request) {
  const p = new URL(request.url).searchParams;
  const source = ["bible", "topics"].includes(p.get("source")) ? p.get("source") : "everyday";
  const testament = ["OT", "NT"].includes(p.get("testament")) ? p.get("testament") : undefined;
  const book = BOOKS.has(p.get("book")) ? p.get("book") : undefined;
  const topic = (p.get("topic") || "").replace(/[^a-z0-9-]/g, "") || undefined;
  const verse = source === "bible" ? randomBibleVerse({ testament, book }) : randomTopicVerse({ set: source, topic: source === "topics" ? topic : undefined, testament, book });
  if (!verse) {
    const hint =
      source === "everyday"
        ? "No encouraging verse matches those filters. Try \"All our topic lists\" or \"The whole Bible\"."
        : "No verse matches those filters. Try a different book, testament or topic.";
    return NextResponse.json({ error: hint }, { status: 404, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
  }
  return NextResponse.json(
    {
      source,
      reference: verse.reference,
      web: verse.web,
      kjv: verse.kjv,
      book: verse.book,
      bookSlug: verse.bookSlug,
      testament: verse.testament,
      topics: verse.topicLinks,
    },
    { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } }
  );
}
