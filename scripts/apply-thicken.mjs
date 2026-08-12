#!/usr/bin/env node
/**
 * Merge seo/thicken-raw/*.json into existing topics in lib/verses.js
 * Dedupes by reference, keeps existing verses first, appends new ones.
 * Updates title/description/keywords to match new counts.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const versesPath = path.join(root, "lib", "verses.js");
const rawDir = path.join(root, "seo", "thicken-raw");

const { versesData } = require(versesPath);
let src = fs.readFileSync(versesPath, "utf8");

function displayName(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bGods\b/, "God's");
}

function versesArrayJs(slug, verses) {
  return verses
    .map(
      (v) =>
        `      { text: ${JSON.stringify(v.text)}, reference: ${JSON.stringify(v.reference)}, translation: ${JSON.stringify(v.translation || "WEB")}, theme: ${JSON.stringify(slug)} }`
    )
    .join(",\n");
}

function findTopicBlock(src, slug) {
  const markers = [`  "${slug}": {`, `  ${slug}: {`];
  let start = -1;
  for (const m of markers) {
    const i = src.indexOf(m);
    if (i !== -1) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;
  const metaAt = src.indexOf("// Topic metadata");
  if (metaAt !== -1 && start > metaAt) return null;

  // Find matching closing of this topic object: verses: [ ... ] then }
  const from = src.slice(start);
  const versesStart = from.indexOf("verses: [");
  if (versesStart === -1) return null;
  let i = start + versesStart + "verses: [".length;
  let depth = 1;
  while (i < src.length && depth > 0) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") depth--;
    i++;
  }
  // after ], expect whitespace and }
  const afterArr = src.slice(i).match(/^\s*\}/);
  if (!afterArr) return null;
  const end = i + afterArr[0].length;
  return { start, end, block: src.slice(start, end) };
}

const files = fs.existsSync(rawDir)
  ? fs.readdirSync(rawDir).filter((f) => f.endsWith(".json"))
  : [];

let updated = 0;
for (const file of files) {
  const incoming = JSON.parse(fs.readFileSync(path.join(rawDir, file), "utf8"));
  const slug = incoming.slug;
  const existing = versesData[slug];
  if (!existing) {
    console.log("skip unknown", slug);
    continue;
  }
  const byRef = new Map();
  for (const v of existing.verses || []) {
    byRef.set((v.reference || "").toLowerCase(), v);
  }
  let added = 0;
  for (const v of incoming.verses || []) {
    const k = (v.reference || "").toLowerCase();
    if (!byRef.has(k)) {
      byRef.set(k, { ...v, theme: slug });
      added++;
    }
  }
  const merged = [...byRef.values()];
  if (added === 0 && merged.length === (existing.verses || []).length) {
    console.log(`no change ${slug} (${merged.length})`);
    // still retitle to exact count
  }

  const name = displayName(slug);
  const n = merged.length;
  const title = `Bible Verses About ${name} (${n}+ Verses)`;
  const description = `What does the Bible say about ${name.toLowerCase()}? Read ${n} carefully selected Bible verses about ${name.toLowerCase()}, with full scripture text you can save, share, and study.`;
  const keywords = [
    `bible verses about ${name.toLowerCase()}`,
    `what does the bible say about ${name.toLowerCase()}`,
    `${name.toLowerCase()} bible verses`,
    `scripture about ${name.toLowerCase()}`,
    `bible verses on ${name.toLowerCase()}`,
  ];

  const loc = findTopicBlock(src, slug);
  if (!loc) {
    console.log("block miss", slug);
    continue;
  }

  const key = slug.includes("-") || !/^[a-zA-Z_$][\w$]*$/.test(slug) ? `"${slug}"` : slug;
  // keep quoted style if original used quotes
  const usedQuoted = loc.block.trimStart().startsWith('"');
  const keyOut = usedQuoted ? `"${slug}"` : key.includes("-") ? `"${slug}"` : slug;

  const newBlock = `  ${keyOut}: {
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
    slug: ${JSON.stringify(slug)},
    keywords: ${JSON.stringify(keywords)},
    verses: [
${versesArrayJs(slug, merged)}
    ]
  }`;

  src = src.slice(0, loc.start) + newBlock + src.slice(loc.end);
  // update in-memory for subsequent
  versesData[slug].verses = merged;
  updated++;
  console.log(`${slug}: ${(existing.verses || []).length} → ${n} (+${added})`);
}

fs.writeFileSync(versesPath, src);
console.log(`Updated ${updated} topics`);
delete require.cache[require.resolve(versesPath)];
const v2 = require(versesPath);
const thin = Object.keys(v2.versesData).filter((t) => v2.versesData[t].verses.length < 20);
console.log("still thin:", thin.length, thin.join(", ") || "none");
console.log("total verses", Object.values(v2.versesData).reduce((s, t) => s + t.verses.length, 0));
