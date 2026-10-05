/* Bible by the numbers: counts computed from the full KJV and WEB texts by scripts/build-bible-stats.mjs.
 * Server-only: never import this from a client component (the word data is ~600 KB).
 */

import booksData from "./data/bible-books.json";
import wordsData from "./data/bible-words.json";

export const SITE = "https://www.biblesaysabout.com";
export const DATA_DATE = booksData.bible.generated;
export const WORDS_DATE = wordsData.generated;
export const READING_WPM = booksData.bible.readingWpm;

export const bible = booksData.bible;
export const books = booksData.books;
export const words = wordsData.words;

export function getBook(slug) {
  return books.find((b) => b.slug === slug) || null;
}

export function getWord(slug) {
  return words.find((w) => w.slug === slug) || null;
}

export function getWordForTopic(topic) {
  return words.find((w) => w.topic === topic) || null;
}

export function fmt(n) {
  return Number(n).toLocaleString("en-US");
}

export function readingTime(minutes) {
  const m = Math.max(1, Math.round(minutes));
  if (m < 60) return `${m} minute${m === 1 ? "" : "s"}`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return `${h} hour${h === 1 ? "" : "s"}${r ? ` ${r} minute${r === 1 ? "" : "s"}` : ""}`;
}

export function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function rankBy(key) {
  const sorted = [...books].sort((a, b) => key(b) - key(a));
  return (slug) => sorted.findIndex((b) => b.slug === slug) + 1;
}

export const otBooks = books.filter((b) => b.testament === "OT");
export const ntBooks = books.filter((b) => b.testament === "NT");

export const totals = {
  books: books.length,
  ot: otBooks.length,
  nt: ntBooks.length,
  chapters: books.reduce((s, b) => s + b.chapters, 0),
  otChapters: otBooks.reduce((s, b) => s + b.chapters, 0),
  ntChapters: ntBooks.reduce((s, b) => s + b.chapters, 0),
  otVerses: otBooks.reduce((s, b) => s + b.verses.kjv, 0),
  ntVerses: ntBooks.reduce((s, b) => s + b.verses.kjv, 0),
  otWords: otBooks.reduce((s, b) => s + b.words.kjv, 0),
  ntWords: ntBooks.reduce((s, b) => s + b.words.kjv, 0),
};

export const METHOD =
  "Counted by Bible Says About from the full public-domain text of the King James Version (1769 edition) and the World English Bible. Verse text only: headings and psalm titles are left out. A word is a run of letters: a hyphenated name like Beer-sheba counts as two, and an apostrophe stays inside its word (LORD'S is one). Matching ignores capital letters.";

/** Wrap verse text in quotation marks unless it already opens with its own */
export function quoted(text) {
  return /^[“‘"']/.test(text) ? text : `"${text}"`;
}

export function plural(n, one, many) {
  return `${fmt(n)} ${n === 1 ? one : many}`;
}

/** The number a word page leads with: the exact word (or all forms of a phrase), KJV first, WEB when the KJV has none */
export function headline(w) {
  const all = w.kind === "phrase" && !w.exactHeadline;
  const pick = (t) => (all ? t.total : t.exact);
  if (pick(w.kjv) > 0) return { n: pick(w.kjv), verses: all ? w.kjv.verses : w.kjv.exactVerses, translation: "KJV", name: "King James Version" };
  return { n: pick(w.web), verses: all ? w.web.verses : w.web.exactVerses, translation: "WEB", name: "World English Bible" };
}
