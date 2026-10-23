/* Random verse and verse of the day. Server only: imports lib/verses.js (and, for whole-Bible draws, the full text in
 * lib/data/bible-text.json through lib/bibleText.js, which only the API route loads).
 *
 * Two pools:
 * - "topics": every single-verse card on the topic pages (WEB text checked by scripts/clean-verses.mjs, KJV attached),
 *   one entry per reference with the topics it appears on.
 * - "bible": every verse of the full KJV and WEB text (scripts/build-bible-text.mjs).
 * The verse of the day walks the topics pool in a fixed shuffled order keyed to the date in New York, so no verse
 * repeats until the whole pool has been used.
 */

import { versesData } from "@/lib/verses";
import booksData from "@/lib/data/bible-books.json";

export const TIME_ZONE = "America/New_York";
const BOOK_ORDER = Object.fromEntries(booksData.books.map((b, i) => [b.name, i]));
const TESTAMENT = Object.fromEntries(booksData.books.map((b) => [b.name, b.testament]));
const BOOK_SLUG = Object.fromEntries(booksData.books.map((b) => [b.name, b.slug]));
const ALIAS = { Psalm: "Psalms", "Song of Songs": "Song of Solomon" };

function parseRef(ref) {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (!m) return null;
  const book = ALIAS[m[1]] || m[1];
  if (BOOK_ORDER[book] === undefined) return null;
  return { book, chapter: +m[2], verse: +m[3] };
}

// "Bible Verses for a Birthday (23 Verses)" or "What Does the Bible Say About Lying? 28 Verses" -> "Birthday", "Lying"
function titleOf(slug) {
  const t = versesData[slug].title
    .replace(/^(Bible Verses (About|For|on)|What Does the Bible Say About)\s+(a |an |the )?/i, "")
    .replace(/\??\s*\(?\d+ Verses( of Hope)?\)?$/i, "")
    .trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/** "Psalms", 23, 1 -> "Psalm 23:1"; other books keep their name */
export function refName(book, chapter, verse) {
  return `${book === "Psalms" ? "Psalm" : book} ${chapter}:${verse}`;
}

/** The topics pool, sorted in Bible order so it only changes when the topic pages change */
export const topicPool = (() => {
  const byRef = new Map();
  for (const [slug, data] of Object.entries(versesData)) {
    for (const v of data.verses) {
      const p = parseRef(v.reference);
      if (!p || !v.text || !v.kjv) continue;
      if (v.text.length < 30 || v.text.length > 320) continue;
      const key = refName(p.book, p.chapter, p.verse);
      if (!byRef.has(key)) byRef.set(key, { reference: key, ...p, web: v.text, kjv: v.kjv, topics: [] });
      const e = byRef.get(key);
      if (!e.topics.includes(slug)) e.topics.push(slug);
    }
  }
  return [...byRef.values()].sort(
    (a, b) => BOOK_ORDER[a.book] - BOOK_ORDER[b.book] || a.chapter - b.chapter || a.verse - b.verse
  );
})();

/** Topics whose verses suit a verse of the day: comfort, hope and everyday faith, not the doctrine or sin lists */
export const EVERYDAY_TOPICS = [
  "hope", "faith", "guidance", "protection", "blessings", "provision", "trust", "prayer", "salvation", "grace", "mercy",
  "gods-love", "new-beginnings", "worship", "holy-spirit", "identity-in-christ", "eternal-life", "faithfulness", "freedom",
  "love", "forgiveness", "kindness", "family", "friendship", "compassion", "unity", "strength", "wisdom", "patience",
  "humility", "courage", "contentment", "perseverance", "purpose", "truth", "serving-others", "healing", "rest", "peace",
  "anxiety", "comfort", "gratitude", "joy", "thanksgiving", "encouragement", "worry", "fear", "hard-times", "stress",
  "loneliness", "grief",
];

// A verse that reads as a whole sentence on its own: starts with a capital or an opening quote, ends a sentence
const standsAlone = (text) => /^[“"‘A-Z]/.test(text) && /[.!?”’"]$/.test(text.trim());

/** Verses that sit on an everyday topic list but read badly as a verse of the day: judgment on nations or the wicked,
 * narrative asides, a rebuke or a line that needs its neighbours. Left out of the encouraging pool only (they stay on the
 * topic pages and in the "all topic lists" and whole-Bible draws). Reviewed by hand against the full pool, 2026-10-23. */
const NOT_FOR_A_DAILY_VERSE = new Set([
  "Deuteronomy 31:3", "Deuteronomy 33:27", "Ruth 3:10", "2 Kings 2:2", "Esther 4:14", "Job 2:11", "Job 30:27",
  "Psalm 27:2", "Psalm 27:12", "Psalm 31:23", "Psalm 34:16", "Psalm 34:21", "Psalm 37:9", "Psalm 37:17", "Psalm 41:9",
  "Psalm 46:8", "Psalm 68:6", "Psalm 125:5",
  "Proverbs 8:36", "Proverbs 10:1", "Proverbs 10:28", "Proverbs 20:18", "Proverbs 24:10", "Proverbs 30:6",
  "Daniel 4:37", "Daniel 12:2", "Hosea 6:1", "Amos 3:3", "Malachi 2:16",
  "Matthew 6:7", "Matthew 6:15", "Matthew 12:25", "Matthew 17:20", "Matthew 25:46",
  "Luke 3:14", "John 3:18", "Acts 28:2",
  "Romans 2:4", "Romans 11:22", "1 Corinthians 11:3", "1 Corinthians 15:33",
  "Hebrews 4:11", "Hebrews 10:38", "James 4:4", "1 Timothy 5:8", "1 Peter 3:12", "1 Peter 5:8",
  "1 John 1:6", "1 John 4:20", "2 John 1:12",
]);

/** Whole-sentence verses on at least one everyday topic, minus the list above: the verse-of-the-day rotation and the
 * tool's default draw */
export const everydayPool = topicPool.filter(
  (e) => e.topics.some((t) => EVERYDAY_TOPICS.includes(t)) && standsAlone(e.web) && !NOT_FOR_A_DAILY_VERSE.has(e.reference)
);

/** How many everyday-topic verses were hand-removed from the encouraging pool */
export const EXCLUDED_COUNT = NOT_FOR_A_DAILY_VERSE.size;

export const bibleVerseCount = {
  kjv: booksData.bible.kjv.verses,
  web: booksData.bible.web.verses,
};

/** Topics that have at least one verse in the pool, with how many */
export const poolTopics = (() => {
  const n = {};
  for (const e of topicPool) for (const t of e.topics) n[t] = (n[t] || 0) + 1;
  return Object.entries(n)
    .map(([slug, count]) => ({ slug, title: titleOf(slug), count }))
    .sort((a, b) => a.title.localeCompare(b.title));
})();

export function bookSlug(name) {
  return BOOK_SLUG[name];
}

function decorate(e) {
  return {
    ...e,
    bookSlug: BOOK_SLUG[e.book],
    testament: TESTAMENT[e.book],
    topicLinks: e.topics.map((slug) => ({ slug, title: titleOf(slug) })),
  };
}

/** "2026-10-23" for the current date in New York */
export function todayKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function longDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function dayNumber(key) {
  const [y, m, d] = key.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 0, 1)) / 86400000);
}

export function shiftKey(key, days) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// A step coprime with the pool size visits every verse once per cycle
function step(n) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  let s = Math.floor(n * 0.618) | 1;
  while (gcd(s, n) !== 1) s += 2;
  return s;
}

/** The verse of the day for a date key, with its place in the rotation */
export function verseOfTheDay(key = todayKey()) {
  const n = everydayPool.length;
  const day = dayNumber(key);
  const index = (((day * step(n)) % n) + n) % n;
  const cycleDay = ((day % n) + n) % n;
  return { date: key, index, cycleDay, poolSize: n, nextRepeat: shiftKey(key, n), ...decorate(everydayPool[index]) };
}

/** A random verse from the everyday pool (default) or every topic list ("topics"), filtered by topic slug,
 * testament "OT" | "NT" or book name */
export function randomTopicVerse({ set = "everyday", topic, testament, book } = {}) {
  const pool = (set === "topics" ? topicPool : everydayPool).filter(
    (e) =>
      (!topic || e.topics.includes(topic)) &&
      (!book || e.book === book) &&
      (!testament || TESTAMENT[e.book] === testament)
  );
  if (!pool.length) return null;
  return decorate(pool[Math.floor(Math.random() * pool.length)]);
}

/** Share of all KJV verses each book holds: the odds a whole-Bible draw lands there */
export function bookOdds() {
  const total = booksData.bible.kjv.verses;
  return booksData.books
    .map((b) => ({ name: b.name, slug: b.slug, testament: b.testament, verses: b.verses.kjv, share: b.verses.kjv / total }))
    .sort((a, b) => b.verses - a.verses);
}

/** How many pool verses come from each book */
export function poolByBook() {
  const n = {};
  for (const e of topicPool) n[e.book] = (n[e.book] || 0) + 1;
  return Object.entries(n)
    .map(([name, count]) => ({ name, slug: BOOK_SLUG[name], count }))
    .sort((a, b) => b.count - a.count);
}

export const bookNames = booksData.books.map((b) => ({ name: b.name, testament: b.testament }));
export const DATA_GENERATED = booksData.bible.generated;
/** The newest topic-page edit: when the pool last changed */
export const POOL_UPDATED = Object.values(versesData)
  .map((d) => d.dateModified || d.datePublished || "")
  .sort()
  .at(-1);

export { decorate };
