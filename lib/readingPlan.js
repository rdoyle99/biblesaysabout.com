/* Reading plans: split the chapters of a section of the Bible into days of about equal length (KJV word count).
 * Pure functions, safe to import from client components. Data: lib/data/bible-chapter-words.json.
 */

import chapterData from "./data/bible-chapter-words.json";

export const WPM = 238; // Brysbaert 2019, average adult silent reading of English non-fiction

const inRange = (from, to) => {
  const a = chapterData.books.findIndex((b) => b.name === from);
  const z = chapterData.books.findIndex((b) => b.name === to);
  return chapterData.books.slice(a, z + 1);
};

export const SCOPES = {
  bible: { label: "The whole Bible", books: chapterData.books },
  ot: { label: "Old Testament", books: chapterData.books.filter((b) => b.testament === "OT") },
  nt: { label: "New Testament", books: chapterData.books.filter((b) => b.testament === "NT") },
  gospels: { label: "The four Gospels", books: inRange("Matthew", "John") },
  paul: { label: "Paul's letters (Romans to Philemon)", books: inRange("Romans", "Philemon") },
  psalms: { label: "Psalms", books: inRange("Psalms", "Psalms") },
  proverbs: { label: "Proverbs", books: inRange("Proverbs", "Proverbs") },
};

/** The plans that get their own page. */
export const PLANS = [
  { slug: "bible-in-a-year", scope: "bible", days: 365, name: "Read the Bible in a year", short: "Whole Bible, 365 days" },
  { slug: "bible-in-6-months", scope: "bible", days: 180, name: "Read the Bible in 6 months", short: "Whole Bible, 180 days" },
  { slug: "bible-in-90-days", scope: "bible", days: 90, name: "Read the Bible in 90 days", short: "Whole Bible, 90 days" },
  { slug: "new-testament-in-90-days", scope: "nt", days: 90, name: "Read the New Testament in 90 days", short: "New Testament, 90 days" },
  { slug: "new-testament-in-30-days", scope: "nt", days: 30, name: "Read the New Testament in 30 days", short: "New Testament, 30 days" },
  { slug: "old-testament-in-a-year", scope: "ot", days: 365, name: "Read the Old Testament in a year", short: "Old Testament, 365 days" },
  { slug: "gospels-in-30-days", scope: "gospels", days: 30, name: "Read the four Gospels in 30 days", short: "Matthew to John, 30 days" },
];

export function getPlan(slug) {
  return PLANS.find((p) => p.slug === slug) || null;
}

/** [{ book, slug, chapter, words }] in canon order for a scope */
export function chaptersFor(scope) {
  const out = [];
  for (const b of SCOPES[scope].books) {
    b.words.forEach((words, i) => out.push({ book: b.name, slug: b.slug, chapter: i + 1, words }));
  }
  return out;
}

/** Whole chapters only, in order; each chapter goes to the day its midpoint falls in, so days stay close to equal. */
export function buildPlan(scope, days) {
  const chapters = chaptersFor(scope);
  const total = chapters.reduce((s, c) => s + c.words, 0);
  const n = Math.max(1, Math.min(days, chapters.length));
  const target = total / n;
  const plan = Array.from({ length: n }, () => ({ chapters: [], words: 0 }));
  let before = 0;
  for (const c of chapters) {
    const d = Math.min(n - 1, Math.floor((before + c.words / 2) / target));
    plan[d].chapters.push(c);
    plan[d].words += c.words;
    before += c.words;
  }
  // a very long chapter can leave a day empty: pull the previous day's last chapter forward until none is
  for (let d = 0; d < n; d++) {
    if (plan[d].chapters.length) continue;
    let s = d - 1;
    while (s >= 0 && plan[s].chapters.length < 2) s--;
    if (s < 0) break;
    for (let k = s; k < d; k++) {
      const moved = plan[k].chapters.pop();
      plan[k].words -= moved.words;
      plan[k + 1].chapters.unshift(moved);
      plan[k + 1].words += moved.words;
    }
  }
  return plan.map((p, i) => ({ day: i + 1, ref: formatRef(p.chapters), words: p.words, minutes: p.words / WPM, chapters: p.chapters.length }));
}

/** "Genesis 1-3; Exodus 1" */
export function formatRef(chapters) {
  const parts = [];
  for (const c of chapters) {
    const last = parts[parts.length - 1];
    if (last && last.book === c.book && last.to === c.chapter - 1) last.to = c.chapter;
    else parts.push({ book: c.book, from: c.chapter, to: c.chapter });
  }
  return parts
    .map((p) => {
      const name = p.book === "Psalms" ? "Psalm" + (p.from === p.to ? "" : "s") : p.book;
      return p.from === p.to ? `${name} ${p.from}` : `${name} ${p.from}-${p.to}`;
    })
    .join("; ");
}

export function planStats(plan) {
  const words = plan.map((d) => d.words);
  const total = words.reduce((s, n) => s + n, 0);
  const chapters = plan.map((d) => d.chapters);
  const heaviest = plan.reduce((a, b) => (b.words > a.words ? b : a));
  const lightest = plan.reduce((a, b) => (b.words < a.words ? b : a));
  return {
    days: plan.length,
    total,
    avgWords: Math.round(total / plan.length),
    avgMinutes: total / plan.length / WPM,
    minWords: lightest.words,
    maxWords: heaviest.words,
    minChapters: Math.min(...chapters),
    maxChapters: Math.max(...chapters),
    heaviest,
    lightest,
  };
}

export const PLAN_DATE = "2026-10-03";
export const PLAN_METHOD =
  "Plans split whole chapters of the King James Version into days of about equal length. Words are counted from the full KJV text (apostrophes join a word, so LORD's is one word); minutes assume the average adult silent reading rate of 238 words a minute (Brysbaert 2019). A day is never shorter than one chapter or longer than the chapters that come nearest to the daily average.";

export function minutesLabel(m) {
  const r = Math.max(1, Math.round(m));
  return r < 60 ? `${r} min` : `${Math.floor(r / 60)} h ${r % 60 ? `${r % 60} min` : ""}`.trim();
}
