/**
 * Shared checks and counters for the list pages built from the full KJV and WEB text (scripts/lists/*.mjs).
 * The same rules as scripts/build-bible-lists.mjs: a claim that names a verse is checked against that verse's text,
 * and the build stops when a needle is missing, so a table cannot drift from the Bible it cites.
 *
 *   import { kjv, web, must, mustWeb, countForms, countPhrase, verseRows, writeList } from "../lib/list-helpers.mjs";
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./bible-source.mjs";

export const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const kjv = await loadBible("kjv");
export const web = await loadBible("web");
export const BIBLE = { kjv, web };
export { BOOKS };

export const norm = (t) => (t || "").replace(/[’‘]/g, "'");
export const tokens = (t) => norm(t).toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g) || [];
export const fail = (msg) => {
  console.error("BUILD STOPPED: " + msg);
  process.exit(1);
};

/** every verse of a translation in canonical order: { book, bi, ch, v, ref, text, testament } */
function flatten(bible) {
  const rows = [];
  bible.books.forEach((b, bi) => {
    b.chapters.forEach((vs, ch) => {
      if (!vs) return;
      vs.forEach((text, v) => {
        if (text) rows.push({ book: BOOKS[bi][0], bi, ch, v, ref: `${BOOKS[bi][0]} ${ch}:${v}`, text, testament: BOOKS[bi][3] });
      });
    });
  });
  return rows;
}
export const ROWS = { kjv: flatten(kjv), web: flatten(web) };

/** the reference's KJV text (a single verse or a range in one chapter) must contain every needle, case-insensitive */
export function must(ref, ...needles) {
  const text = norm(kjv.get(ref) || "");
  if (!text) fail(`${ref} not found in the KJV`);
  for (const n of needles) if (!text.toLowerCase().includes(norm(n).toLowerCase())) fail(`${ref} (KJV) lacks "${n}": ${text}`);
  return kjv.get(ref);
}
export function mustWeb(ref, ...needles) {
  const text = norm(web.get(ref) || "");
  if (!text) fail(`${ref} not found in the WEB`);
  for (const n of needles) if (!text.toLowerCase().includes(norm(n).toLowerCase())) fail(`${ref} (WEB) lacks "${n}": ${text}`);
  return web.get(ref);
}
export const wordCount = (ref, id = "kjv") => tokens(BIBLE[id].get(ref) || "").length;

/** verses of one book (optionally chapters from..to) in a translation */
export const verseRows = (id, book, fromCh = 1, toCh = 999) => ROWS[id].filter((r) => r.book === book && r.ch >= fromCh && r.ch <= toCh);

/** count whole-word forms: total, verses and books holding them, the book with most (ties listed), the first verse */
export function countForms(id, forms, filter = () => true) {
  const set = new Set(forms.map((f) => f.toLowerCase()));
  let total = 0;
  let verses = 0;
  const byBook = new Map();
  let first = null;
  for (const r of ROWS[id]) {
    if (!filter(r)) continue;
    const n = tokens(r.text).filter((t) => set.has(t)).length;
    if (!n) continue;
    total += n;
    verses += 1;
    byBook.set(r.book, (byBook.get(r.book) || 0) + n);
    first ||= r.ref;
  }
  const top = [...byBook.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const tied = [...byBook.entries()].filter(([, n]) => n === top[1]).map(([b]) => b);
  return { total, verses, books: byBook.size, top: { book: top[0], count: top[1], tied }, first, byBook: Object.fromEntries(byBook) };
}

/** count a phrase (a regex with the g flag over normalised verse text), with the verse list */
export function countPhrase(id, re, filter = () => true) {
  let total = 0;
  const refs = [];
  for (const r of ROWS[id]) {
    if (!filter(r)) continue;
    const m = norm(r.text).match(re);
    if (m) {
      total += m.length;
      refs.push(r.ref);
    }
  }
  return { total, refs };
}

/** write lib/data/lists/<slug>.json */
export function writeList(slug, data) {
  const dir = path.join(root, "lib/data/lists");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 1) + "\n");
  console.log(`wrote lib/data/lists/${slug}.json`);
}
