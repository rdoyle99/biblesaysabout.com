#!/usr/bin/env node
/**
 * Expand a topic: scrape OpenBible refs → fetch WEB text from bible-api.com
 * Usage: node scripts/expand-topic.mjs <openbible-slug> [our-slug] [limit]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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
  const encoded = encodeURIComponent(ref);
  const url = `https://bible-api.com/${encoded}?translation=web`;
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BibleSaysAboutBot/1.0 (+https://biblesaysabout.com)" },
      });
      if (res.status === 429 || res.status === 503) {
        await sleep(1500 * (i + 1));
        continue;
      }
      if (!res.ok) return null;
      const data = await res.json();
      if (!data?.text) return null;
      const text = data.text.replace(/\s+/g, " ").trim();
      if (!text || text.length < 10) return null;
      return {
        text,
        reference: data.reference || ref,
        translation: "WEB",
      };
    } catch {
      await sleep(800 * (i + 1));
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
    _source: { openbible: openSlug, translation: "WEB", fetchedAt: new Date().toISOString() },
  };
}

async function main() {
  const openSlug = process.argv[2];
  const ourSlug = (process.argv[3] || openSlug).replace(/_/g, "-");
  const limit = Math.min(parseInt(process.argv[4] || "22", 10), 40);
  if (!openSlug) {
    console.error("Usage: node scripts/expand-topic.mjs <openbible-slug> [our-slug] [limit]");
    process.exit(1);
  }

  console.error(`Scraping openbible: ${openSlug}…`);
  const refs = await scrapeOpenBible(openSlug);
  console.error(`Found ${refs.length} refs, need ${limit}…`);

  const verses = [];
  let attempts = 0;
  for (const ref of refs) {
    if (verses.length >= limit) break;
    if (attempts > limit * 3) break; // don't thrash forever
    attempts++;
    const v = await fetchVerse(ref);
    if (v) {
      verses.push(v);
      process.stderr.write(".");
    } else {
      process.stderr.write("x");
    }
    await sleep(350);
  }
  process.stderr.write("\n");

  if (verses.length < 8) {
    console.error(`Too few verses (${verses.length}) for ${ourSlug}`);
    process.exit(2);
  }

  const topic = buildTopic(ourSlug, openSlug, verses);
  const outDir = path.join(root, "seo", "batch-raw");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${ourSlug}.json`);
  fs.writeFileSync(outPath, JSON.stringify(topic, null, 2));
  console.error(`Wrote ${outPath} (${verses.length} verses)`);
  console.log(JSON.stringify({ slug: ourSlug, count: verses.length, title: topic.title }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
