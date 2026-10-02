#!/usr/bin/env node
/**
 * Make every verse on the site World English Bible (public domain) text, checked word for word against the full WEB
 * source bible-api.com serves, attach the King James Version text of the same reference (for the KJV toggle), and drop
 * passages that are whole chapters rather than verses.
 *
 *   node scripts/clean-verses.mjs            # dry run: prints what would change
 *   node scripts/clean-verses.mjs --write    # rewrites the versesData block of lib/verses.js + writes a change log
 *
 * Rules, in order, per topic (the list order is the relevance order, so earlier entries win):
 *   1. a reference that spans chapters or more than MAX_SPAN verses is dropped (chapter dumps, not verses)
 *   2. non-WEB text (NIV, NKJV, ESV, NLT, NASB) is replaced by the WEB text of the same reference
 *   3. WEB text that differs from the source is replaced by the source text
 *   4. an entry that overlaps a verse already on the page is dropped
 *   5. kjv = the KJV text of the same reference (left off when the KJV numbers it differently)
 * Titles and descriptions get the new count; dateModified moves only for topics whose verses changed.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, parseReference } from "./lib/bible-source.mjs";

const MAX_SPAN = 12;
const TODAY = new Date().toISOString().slice(0, 10);
const write = process.argv.includes("--write");
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const versesPath = path.join(root, "lib", "verses.js");
const datesPath = path.join(root, "seo", "topic-dates.json");

const { versesData } = await import(versesPath);
const web = await loadBible("web");
const kjv = await loadBible("kjv");
const dates = fs.existsSync(datesPath) ? JSON.parse(fs.readFileSync(datesPath, "utf8")) : {};

const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();
const displayRef = (r) =>
  `${r.book === "Psalms" ? "Psalm" : r.book} ${r.chapter}:${r.from}${r.to !== r.from ? `-${r.to}` : ""}`;

const log = [];
const summary = { kjvMissing: 0, topics: 0, changedTopics: 0, replaced: 0, corrected: 0, droppedLong: 0, droppedOverlap: 0, droppedMissing: 0 };
const out = {};

for (const [slug, topic] of Object.entries(versesData)) {
  summary.topics++;
  const covered = new Set();
  const kept = [];
  let changed = false;
  for (const v of topic.verses) {
    const crossChapter = /\d+:\d+\s*[-–]\s*\d+:\d+/.test(v.reference);
    const r = crossChapter ? null : parseReference(v.reference);
    if (crossChapter || (r && r.to - r.from + 1 > MAX_SPAN)) {
      summary.droppedLong++;
      log.push({ slug, action: "drop-long", reference: v.reference, translation: v.translation, chars: v.text.length });
      changed = true;
      continue;
    }
    const src = r && web.get(r);
    if (!src) {
      summary.droppedMissing++;
      log.push({ slug, action: "drop-missing", reference: v.reference, translation: v.translation });
      changed = true;
      continue;
    }
    const keys = [];
    for (let n = r.from; n <= r.to; n++) keys.push(`${r.book} ${r.chapter}:${n}`);
    if (keys.some((k) => covered.has(k))) {
      summary.droppedOverlap++;
      log.push({ slug, action: "drop-overlap", reference: v.reference, translation: v.translation });
      changed = true;
      continue;
    }
    keys.forEach((k) => covered.add(k));
    const reference = displayRef(r);
    const kjvText = kjv.get(r) || undefined;
    const entry = { ...v, reference, translation: "WEB", text: src, kjv: kjvText };
    if (v.kjv !== kjvText) changed = true;
    if (v.translation !== "WEB") {
      summary.replaced++;
      log.push({ slug, action: "replace", reference, from: v.translation, before: v.text, after: src });
      changed = true;
    } else if (norm(v.text) !== norm(src)) {
      summary.corrected++;
      log.push({ slug, action: "correct", reference, before: v.text, after: src });
      changed = true;
    }
    if (!kjvText) summary.kjvMissing++;
    kept.push(entry);
  }

  const n = kept.length;
  const oldN = topic.verses.length;
  const swapCount = (s) =>
    (s || "")
      .replace(/\(\d+\+? Verses\)/, `(${n} Verses)`)
      .replace(new RegExp(`\\b${oldN}\\b`, "g"), String(n));
  const d = dates[slug] || {};
  out[slug] = {
    ...topic,
    title: swapCount(topic.title),
    description: swapCount(topic.description),
    datePublished: topic.datePublished || d.created || TODAY,
    dateModified: changed ? TODAY : topic.dateModified || d.contentUpdated || d.created || TODAY,
    verses: kept,
  };
  if (changed) summary.changedTopics++;
  if (n < 12) console.log(`WARN ${slug}: only ${n} verses left`);
}

console.log(summary);
const counts = Object.entries(out).map(([s, t]) => [s, t.verses.length]).sort((a, b) => a[1] - b[1]);
console.log("smallest", counts.slice(0, 8).map((c) => c.join(":")).join(" "));
console.log("total verses", counts.reduce((s, c) => s + c[1], 0));

const byTopic = {};
for (const l of log) if (l.action === "drop-overlap") byTopic[l.slug] = (byTopic[l.slug] || 0) + 1;
console.log("overlap drops by topic", Object.entries(byTopic).sort((a, b) => b[1] - a[1]).slice(0, 12).map((e) => e.join(":")).join(" "));

if (write) {
  const src = fs.readFileSync(versesPath, "utf8");
  const start = src.indexOf("export const versesData = {");
  const end = src.indexOf("// Topic metadata for enhanced display");
  if (start < 0 || end < 0) throw new Error("versesData markers not found");
  const block = `export const versesData = ${JSON.stringify(out, null, 2)};\n\n`;
  fs.writeFileSync(versesPath, src.slice(0, start) + block + src.slice(end));
  // never overwrite an earlier run's before/after log
  let logName = `clean-verses-${TODAY}.json`;
  for (let i = 2; fs.existsSync(path.join(root, "seo", logName)); i++) logName = `clean-verses-${TODAY}-${i}.json`;
  fs.writeFileSync(path.join(root, "seo", logName), JSON.stringify({ summary, log }, null, 1));
  console.log(`wrote lib/verses.js and seo/${logName}`);
}
