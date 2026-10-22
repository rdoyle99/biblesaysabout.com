#!/usr/bin/env node
/**
 * Names of God: counts, verses and first uses computed from the full KJV and WEB text.
 *   node scripts/build-names-of-god.mjs     # writes lib/data/names-of-god.json
 * Method: every verse is matched against each search pattern (case-insensitive only when the pattern says so).
 * Counts are matches, verses are verses with 1+ match. Lexicon data lives in names-of-god.config.mjs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";
import { NAMES } from "./names-of-god.config.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED = "2026-10-22";

const bibles = { kjv: await loadBible("kjv"), web: await loadBible("web") };
const refName = (b) => (b === "Psalms" ? "Psalm" : b);
const rows = {};
for (const id of ["kjv", "web"]) {
  rows[id] = [];
  bibles[id].books.forEach((bk, bi) =>
    bk.chapters.forEach((vs, ch) => vs && vs.forEach((text, v) => text && rows[id].push({ bi, book: BOOKS[bi][0], testament: BOOKS[bi][3], ch, v, text })))
  );
}

function run(id, pattern, flags = "", scope = null) {
  if (!pattern) return null;
  const re = new RegExp(pattern, "g" + flags);
  const out = { n: 0, verses: 0, ot: 0, nt: 0, otVerses: 0, ntVerses: 0, byBook: {}, refs: [], first: null, last: null };
  for (const r of rows[id]) {
    if (scope && `${r.book} ${r.ch}` !== scope) continue;
    const m = r.text.match(re);
    if (!m) continue;
    const ref = `${refName(r.book)} ${r.ch}:${r.v}`;
    out.n += m.length;
    out.verses++;
    out[r.testament === "OT" ? "ot" : "nt"] += m.length;
    out[r.testament === "OT" ? "otVerses" : "ntVerses"]++;
    out.byBook[r.book] = (out.byBook[r.book] || 0) + m.length;
    if (out.refs.length < 40) out.refs.push(ref);
    const hit = { ref, text: r.text };
    out.first ||= hit;
    out.last = hit;
  }
  out.byBook = Object.entries(out.byBook);
  out.books = out.byBook.length;
  return out;
}

const verseText = (ref) => {
  const m = ref.match(/^(.+?)\s+(\d+):(\d+)$/);
  const book = m[1] === "Psalm" ? "Psalms" : m[1];
  const o = {};
  for (const id of ["kjv", "web"]) o[id] = bibles[id].get({ book, chapter: +m[2], from: +m[3], to: +m[3] });
  return o;
};

const names = {};
for (const n of NAMES) {
  const searches = {};
  for (const s of n.searches) searches[s.key] = { label: s.label, scope: s.scope || null, kjv: run("kjv", s.kjv, s.flags, s.scope), web: run("web", s.web, s.flags, s.scope) };
  const f = searches[n.first.key][n.first.tr].first;
  const verses = n.verses.map((ref) => ({ ref, ...verseText(ref) }));
  for (const v of verses) if (!v.kjv || !v.web) throw new Error(`${n.slug}: no text for ${v.ref}`);
  const { searches: _s, first: _f, verses: _v, ...meta } = n;
  names[n.slug] = { ...meta, searches, first: { ref: f?.ref ?? null, tr: n.first.tr, ...(f ? verseText(f.ref) : {}) }, verses };
  console.log(n.slug.padEnd(18), Object.entries(searches).map(([k, s]) => `${k}: K${s.kjv?.n ?? "-"}/W${s.web?.n ?? "-"}`).join("  "), "first", f?.ref);
}
fs.writeFileSync(path.join(root, "lib", "data", "names-of-god.json"), JSON.stringify({ generated: GENERATED, order: NAMES.map((n) => n.slug), names }, null, 1));
