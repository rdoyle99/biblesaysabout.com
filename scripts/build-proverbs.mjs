#!/usr/bin/env node
/**
 * Proverbs by the numbers, computed from the full KJV text (.cache/bible via scripts/lib/bible-source.mjs).
 *
 *   node scripts/build-proverbs.mjs     # writes lib/data/proverbs.json
 *
 * Sections are cut where the book itself announces a new one (the opening verse of each is quoted in the data):
 * 1:1 the proverbs of Solomon, 10:1 the proverbs of Solomon, 22:17 the words of the wise, 24:23 more sayings of the
 * wise, 25:1 more proverbs of Solomon copied out by the men of Hezekiah, 30:1 the words of Agur, 31:1 the words of
 * Lemuel. Counts are verses (a proverb can run over several verses, so verses are the unit that can be counted).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const kjv = await loadBible("kjv");
const idx = (name) => BOOKS.findIndex((b) => b[0] === name);
const verseText = (name, c, v) => kjv.books[idx(name)].chapters[c][v];
const tokens = (t) => t.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];
const P = idx("Proverbs");
const ch = kjv.books[P].chapters;
const rows = [];
ch.forEach((vs, c) => vs && vs.forEach((t, v) => t && rows.push({ c, v, t, w: tokens(t).length })));
const after = (r, c, v) => r.c > c || (r.c === c && r.v >= v);
const SECTIONS = [
  { id: "intro", from: [1, 1], to: [9, 18], label: "Instruction to a son (opens \"The proverbs of Solomon\")" },
  { id: "solomon1", from: [10, 1], to: [22, 16], label: "The proverbs of Solomon, first collection" },
  { id: "wise1", from: [22, 17], to: [24, 22], label: "The words of the wise" },
  { id: "wise2", from: [24, 23], to: [24, 34], label: "More sayings of the wise" },
  { id: "hezekiah", from: [25, 1], to: [29, 27], label: "More proverbs of Solomon, copied out by the men of Hezekiah" },
  { id: "agur", from: [30, 1], to: [30, 33], label: "The words of Agur" },
  { id: "lemuel", from: [31, 1], to: [31, 31], label: "The words of king Lemuel" },
].map((s) => {
  const rs = rows.filter((r) => after(r, ...s.from) && !after(r, s.to[0], s.to[1] + 1));
  return { ...s, ref: `Proverbs ${s.from[0]}:${s.from[1]}-${s.to[0] === s.from[0] ? "" : s.to[0] + ":"}${s.to[1]}`, verses: rs.length, words: rs.reduce((a, r) => a + r.w, 0), opener: verseText("Proverbs", ...s.from) };
});
if (SECTIONS.reduce((a, s) => a + s.verses, 0) !== rows.length) throw new Error("sections do not cover the book");
const k4 = { ref: "1 Kings 4:32", text: verseText("1 Kings", 4, 32) };
const eccl = { ref: "Ecclesiastes 12:9", text: verseText("Ecclesiastes", 12, 9) };
// the word "proverb(s)" in the text: where it is used
const hits = [];
kjv.books.forEach((b, bi) => b.chapters.forEach((vs, c) => vs && vs.forEach((t, v) => t && tokens(t).some((w) => /^proverbs?$/i.test(w)) && hits.push(`${BOOKS[bi][0]} ${c}:${v}`))));
const out = {
  generated: "2026-10-22",
  source: "King James Version (1769), public domain, counted by scripts/build-proverbs.mjs from .cache/bible/eng-kjv.osis.xml",
  chapters: ch.filter(Boolean).length,
  verses: rows.length,
  words: rows.reduce((a, r) => a + r.w, 0),
  perChapter: ch.map((vs, c) => (vs ? { chapter: c, verses: vs.filter(Boolean).length } : null)).filter(Boolean),
  sections: SECTIONS,
  solomonNamed: SECTIONS.filter((s) => ["intro", "solomon1", "hezekiah"].includes(s.id)).reduce((a, s) => a + s.verses, 0),
  kings432: k4,
  eccl129: eccl,
  versesUsingWordProverb: hits.length,
};
fs.writeFileSync(path.join(root, "lib/data/proverbs.json"), JSON.stringify(out, null, 1) + "\n");
console.log(out.chapters, out.verses, out.words, out.solomonNamed, SECTIONS.map((s) => s.ref + " " + s.verses).join(" | "), hits.length);
