/* Search API - Server-side topic and verse search
 * Created: Keeps lib/verses.js out of the client bundle. The header search
 * dialog and the /search page call this instead of searching in the browser.
 * GET /api/search?q=love&limit=20 -> { topics: [...], verses: [...] }
 */

import { NextResponse } from "next/server";
import { getAllTopics, getVersesByTopic, searchVerses } from "@/lib/verses";
import { getTopicSummary } from "@/lib/topic-index";

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

const CACHE_CONTROL = "public, s-maxage=3600, stale-while-revalidate=86400";

function respond(body) {
  return NextResponse.json(body, {
    headers: { "Cache-Control": CACHE_CONTROL },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().slice(0, MAX_QUERY_LENGTH);
  const requestedLimit = parseInt(searchParams.get("limit"), 10);
  const limit = Math.min(
    Math.max(Number.isNaN(requestedLimit) ? DEFAULT_LIMIT : requestedLimit, 1),
    MAX_LIMIT
  );

  if (query.length < MIN_QUERY_LENGTH) {
    return respond({ topics: [], verses: [] });
  }

  const lowerQuery = query.toLowerCase();

  // Topics match on slug or keyword
  const topics = getAllTopics()
    .filter(
      (topic) =>
        topic.toLowerCase().includes(lowerQuery) ||
        getVersesByTopic(topic)?.keywords?.some((k) =>
          k.toLowerCase().includes(lowerQuery)
        )
    )
    .map(getTopicSummary);

  // Verses match on text or reference; send only what VerseCard renders
  const verses = searchVerses(query, limit).map(
    ({ text, reference, translation, theme, topic, topicTitle }) => ({
      text,
      reference,
      translation,
      theme,
      topic,
      topicTitle,
    })
  );

  return respond({ topics, verses });
}
