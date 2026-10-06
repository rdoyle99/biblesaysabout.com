#!/usr/bin/env node
/**
 * What a Bible name means, from Hitchcock's Bible Names Dictionary (1869, public domain), the CCEL edition as
 * mirrored by github.com/neuu-org/bible-dictionary-dataset (data/00_raw/ccel/xml/hitchcock_bible_names.xml).
 *
 *   node scripts/build-bible-names.mjs     # writes lib/data/bible-names.json
 *
 * One entry per name page in lib/data/bible-words.json (kind "name"). A name Hitchcock lists more than once keeps
 * every entry; "same as X" entries are resolved one step. Pages with 30+ impressions in the 28 days before
 * 2026-10-06 are held (HOLD) until their own 28-day window ends, so their grade stays readable; the hub lists them.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = "https://raw.githubusercontent.com/neuu-org/bible-dictionary-dataset/HEAD/data/00_raw/ccel/xml/hitchcock_bible_names.xml";
const DATE = "2026-10-06";
const HOLD = new Set(["god", "lord", "jesus", "christ", "satan", "israel", "joshua", "daniel", "john", "james", "ruth", "esther", "job", "jonah", "isaiah", "jeremiah"]);
const SKIP = new Set(["antichrist", "god", "lord", "yahweh"]); // not a name Hitchcock explains, or not in his list

const xml = await (await fetch(SRC)).text();
const strip = (s) =>
  s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
const H = new Map();
for (const m of xml.matchAll(/<term id="[^"]*">([\s\S]*?)<\/term>\s*<def id="[^"]*">([\s\S]*?)<\/def>/g)) {
  const k = strip(m[1]).toLowerCase();
  if (!H.has(k)) H.set(k, []);
  H.get(k).push(strip(m[2]));
}

const wordsData = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-words.json"), "utf8"));
const out = {};
for (const w of wordsData.words) {
  if (w.kind !== "name" || SKIP.has(w.slug)) continue;
  const raw = H.get(w.word.toLowerCase());
  if (!raw) continue;
  const entries = [];
  for (const d of raw) {
    const same = d.match(/^(?:[A-Za-z]+, )?same as ([A-Za-z]+)$/);
    if (same) {
      const target = H.get(same[1].toLowerCase());
      if (!target) continue;
      entries.push({ meaning: target[0], via: same[1] });
    } else entries.push({ meaning: d.replace(/^or [A-Za-z]+, /, "") });
  }
  if (entries.length) out[w.slug] = { term: w.word, entries, held: HOLD.has(w.slug) };
}
fs.writeFileSync(
  path.join(root, "lib/data/bible-names.json"),
  JSON.stringify({ generated: DATE, source: "Hitchcock's Bible Names Dictionary (1869), public domain", names: out }, null, 1) + "\n"
);
console.log(`${Object.keys(out).length} names with a meaning, ${Object.values(out).filter((n) => n.held).length} held`);
