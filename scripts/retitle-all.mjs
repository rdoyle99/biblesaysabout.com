#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const versesPath = path.join(root, "lib", "verses.js");
let src = fs.readFileSync(versesPath, "utf8");
const { versesData } = require(versesPath);

function displayName(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bGods\b/, "God's");
}

let changed = 0;
// Process longest slugs first so "self-control" doesn't partial-match wrong
const slugs = Object.keys(versesData).sort((a, b) => b.length - a.length);

for (const slug of slugs) {
  const data = versesData[slug];
  const n = data.verses?.length || 0;
  const name = displayName(slug);
  const newTitle = `Bible Verses About ${name} (${n}+ Verses)`;
  const newDesc = `What does the Bible say about ${name.toLowerCase()}? Read ${n} carefully selected Bible verses about ${name.toLowerCase()}, with full scripture text you can save, share, and study.`;
  const newKeywords = [
    `bible verses about ${name.toLowerCase()}`,
    `what does the bible say about ${name.toLowerCase()}`,
    `${name.toLowerCase()} bible verses`,
    `scripture about ${name.toLowerCase()}`,
    `bible verses on ${name.toLowerCase()}`,
  ];

  const startMarkers = [`  "${slug}": {`, `  ${slug}: {`];
  let start = -1;
  for (const m of startMarkers) {
    const i = src.indexOf(m);
    if (i !== -1) {
      start = i;
      break;
    }
  }
  if (start === -1) {
    console.log("miss", slug);
    continue;
  }
  // Only rewrite within versesData: stop before topicMetadata
  const metaAt = src.indexOf("// Topic metadata");
  if (metaAt !== -1 && start > metaAt) continue;

  const slice = src.slice(start, start + 2500);
  const titleM = slice.match(/title:\s*"(?:\\.|[^"\\])*"/);
  const descM = slice.match(/description:\s*"(?:\\.|[^"\\])*"/);
  const kwM = slice.match(/keywords:\s*\[[^\]]*\]/);
  if (!titleM || !descM || !kwM) {
    console.log("fields miss", slug, { title: !!titleM, desc: !!descM, kw: !!kwM });
    continue;
  }
  let block = slice;
  const newBlock = block
    .replace(titleM[0], `title: ${JSON.stringify(newTitle)}`)
    .replace(descM[0], `description: ${JSON.stringify(newDesc)}`)
    .replace(kwM[0], `keywords: ${JSON.stringify(newKeywords)}`);
  if (newBlock !== block) {
    src = src.slice(0, start) + newBlock + src.slice(start + block.length);
    changed++;
  }
}

fs.writeFileSync(versesPath, src);
// clear require cache and verify
delete require.cache[require.resolve(versesPath)];
const v2 = require(versesPath);
const stillOld = Object.values(v2.versesData).filter((d) => d.title.startsWith("What Does")).length;
const newStyle = Object.values(v2.versesData).filter((d) => d.title.startsWith("Bible Verses About")).length;
console.log({ changed, stillOld, newStyle, total: Object.keys(v2.versesData).length });
// sample
console.log("sample", v2.versesData.love.title, v2.versesData.anger.title, v2.versesData.prayer.title);
