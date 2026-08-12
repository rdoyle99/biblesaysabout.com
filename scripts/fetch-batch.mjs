#!/usr/bin/env node
/**
 * Fetch one or more topics into seo/batch-raw (or seo/thicken-raw)
 * Usage:
 *   node scripts/fetch-batch.mjs --mode new --out seo/batch3-raw relationships:relationships ...
 *   node scripts/fetch-batch.mjs --mode thicken --out seo/thicken-raw anger prayer friendship
 *   node scripts/fetch-batch.mjs --mode thicken --out seo/thicken-raw --from-file seo/thin-list.txt
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const args = process.argv.slice(2);
function flag(name, def) {
  const i = args.indexOf(name);
  if (i === -1) return def;
  return args[i + 1] ?? def;
}
const mode = flag("--mode", "new");
const outRel = flag("--out", mode === "thicken" ? "seo/thicken-raw" : "seo/batch3-raw");
const limit = parseInt(flag("--limit", mode === "thicken" ? "28" : "22"), 10);
const outDir = path.join(root, outRel);
fs.mkdirSync(outDir, { recursive: true });

let items = [];
const fromFile = flag("--from-file", null);
if (fromFile) {
  items = fs
    .readFileSync(path.join(root, fromFile), "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.includes(":")) {
        const [open, our] = line.split(":");
        return { open, our };
      }
      return { open: line.replace(/-/g, "_"), our: line };
    });
} else {
  // remaining non-flag args
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      i++;
      continue;
    }
    const line = args[i];
    if (line.includes(":")) {
      const [open, our] = line.split(":");
      items.push({ open, our });
    } else {
      items.push({ open: line.replace(/-/g, "_"), our: line });
    }
  }
}

function normalizeRef(ref) {
  return ref.replace(/–/g, "-").replace(/\s+/g, " ").trim();
}

async function scrapeOpenBible(slug) {
  const url = `https://www.openbible.info/topics/${slug}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "BibleSaysAboutBot/1.0 (+https://biblesaysabout.com)" },
  });
  if (!res.ok) throw new Error(`OpenBible ${slug}: ${res.status}`);
  const html = await res.text();
  const refs = [...html.matchAll(/class="bibleref"[^>]*>([^<]+)<\/a>/g)].map((m) =>
    normalizeRef(m[1])
  );
  const seen = new Set();
  return refs.filter((r) => {
    const k = r.toLowerCase();
    if (seen.has(k) || !/\d+:\d+/.test(r)) return false;
    seen.add(k);
    return true;
  });
}

async function fetchVerse(ref, retries = 3) {
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=web`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BibleSaysAboutBot/1.0 (+https://biblesaysabout.com)" },
      });
      if (res.status === 429 || res.status === 503) {
        await sleep(2000 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.text) return null;
      const text = data.text.replace(/\s+/g, " ").trim();
      if (text.length < 10) return null;
      return { text, reference: data.reference || ref, translation: "WEB" };
    } catch {
      await sleep(1000 * (i + 1));
    }
  }
  return null;
}

function displayName(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bGods\b/, "God's");
}

function buildTopic(ourSlug, openSlug, verses) {
  const name = displayName(ourSlug);
  const count = verses.length;
  return {
    title: `Bible Verses About ${name} (${count}+ Verses)`,
    description: `What does the Bible say about ${name.toLowerCase()}? Read ${count} carefully selected Bible verses about ${name.toLowerCase()}, with full scripture text you can save, share, and study.`,
    slug: ourSlug,
    keywords: [
      `bible verses about ${name.toLowerCase()}`,
      `what does the bible say about ${name.toLowerCase()}`,
      `${name.toLowerCase()} bible verses`,
      `scripture about ${name.toLowerCase()}`,
      `bible verses on ${name.toLowerCase()}`,
    ],
    verses: verses.map((v) => ({ ...v, theme: ourSlug })),
    _source: { openbible: openSlug, translation: "WEB", fetchedAt: new Date().toISOString(), mode },
  };
}

async function processOne({ open, our }) {
  const outPath = path.join(outDir, `${our}.json`);
  if (fs.existsSync(outPath)) {
    const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
    if ((existing.verses?.length || 0) >= Math.min(limit, 20)) {
      console.log(`skip ${our} (already ${existing.verses.length})`);
      return;
    }
  }
  console.log(`=== ${our} (openbible: ${open}) ===`);
  let refs;
  try {
    refs = await scrapeOpenBible(open);
  } catch (e) {
    console.error(`FAIL scrape ${our}:`, e.message);
    return;
  }
  console.log(`  refs: ${refs.length}`);
  const verses = [];
  let attempts = 0;
  for (const ref of refs) {
    if (verses.length >= limit) break;
    if (attempts > limit * 3) break;
    attempts++;
    const v = await fetchVerse(ref);
    if (v) {
      verses.push(v);
      process.stdout.write(".");
    } else process.stdout.write("x");
    await sleep(320);
  }
  console.log("");
  if (verses.length < 8) {
    console.error(`  too few: ${verses.length}`);
    return;
  }
  const topic = buildTopic(our, open, verses);
  fs.writeFileSync(outPath, JSON.stringify(topic, null, 2));
  console.log(`  wrote ${outPath} (${verses.length})`);
}

for (const item of items) {
  await processOne(item);
  await sleep(1500);
}
console.log("DONE", items.length, "items →", outDir);
