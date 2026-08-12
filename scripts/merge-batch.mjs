#!/usr/bin/env node
/**
 * Merge seo/batch-raw/*.json into lib/verses.js (versesData + topicMetadata)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const rawDir = path.join(root, "seo", "batch-raw");
const versesPath = path.join(root, "lib", "verses.js");

const META = {
  relationships: { icon: "💞", color: "from-pink-500 to-rose-600", category: "relationships" },
  children: { icon: "👶", color: "from-sky-400 to-blue-500", category: "relationships" },
  death: { icon: "🕯️", color: "from-slate-500 to-zinc-600", category: "emotions" },
  encouragement: { icon: "📣", color: "from-amber-500 to-orange-600", category: "emotions" },
  grief: { icon: "🖤", color: "from-slate-600 to-gray-700", category: "emotions" },
  mothers: { icon: "👩", color: "from-rose-400 to-pink-500", category: "relationships" },
  giving: { icon: "🎁", color: "from-emerald-500 to-green-600", category: "faith" },
  temptation: { icon: "⚠️", color: "from-orange-500 to-red-600", category: "personal-growth" },
  baptism: { icon: "💧", color: "from-blue-400 to-cyan-500", category: "faith" },
  christmas: { icon: "🎄", color: "from-red-500 to-green-600", category: "faith" },
  leadership: { icon: "👑", color: "from-amber-500 to-yellow-600", category: "personal-growth" },
  repentance: { icon: "🔄", color: "from-violet-500 to-purple-600", category: "faith" },
  fathers: { icon: "👨", color: "from-blue-500 to-indigo-600", category: "relationships" },
  rest: { icon: "😴", color: "from-indigo-400 to-violet-500", category: "health" },
  "gods-love": { icon: "💖", color: "from-rose-500 to-red-600", category: "faith" },
  hell: { icon: "🔥", color: "from-red-600 to-orange-700", category: "faith" },
  "new-beginnings": { icon: "🌱", color: "from-green-400 to-emerald-500", category: "faith" },
  stress: { icon: "😰", color: "from-yellow-500 to-amber-600", category: "emotions" },
  justice: { icon: "⚖️", color: "from-slate-500 to-blue-600", category: "life" },
  "hard-times": { icon: "⛈️", color: "from-gray-500 to-slate-600", category: "emotions" },
};

function topicJs(slug, data) {
  const verses = data.verses
    .map(
      (v) =>
        `      { text: ${JSON.stringify(v.text)}, reference: ${JSON.stringify(v.reference)}, translation: ${JSON.stringify(v.translation || "WEB")}, theme: ${JSON.stringify(slug)} }`
    )
    .join(",\n");
  return `  "${slug}": {
    title: ${JSON.stringify(data.title)},
    description: ${JSON.stringify(data.description)},
    slug: ${JSON.stringify(slug)},
    keywords: ${JSON.stringify(data.keywords)},
    verses: [
${verses}
    ]
  }`;
}

const files = fs.readdirSync(rawDir).filter((f) => f.endsWith(".json"));
let src = fs.readFileSync(versesPath, "utf8");

// Detect existing topic keys inside versesData only
const versesDataMatch = src.match(/export const versesData = \{([\s\S]*?)\};\n\n\/\/ Topic metadata/);
const versesBody = versesDataMatch ? versesDataMatch[1] : "";
const existing = new Set(
  [...versesBody.matchAll(/^\s+"?([\w-]+)"?:\s*\{/gm)].map((m) => m[1])
);

const blocks = [];
const metaLines = [];
let added = 0;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(rawDir, file), "utf8"));
  const slug = data.slug;
  if (existing.has(slug)) {
    console.log(`skip existing: ${slug}`);
    continue;
  }
  if (!data.verses?.length) {
    console.log(`skip empty: ${slug}`);
    continue;
  }
  blocks.push(topicJs(slug, data));
  const meta = META[slug] || { icon: "📖", color: "from-slate-500 to-gray-600", category: "faith" };
  metaLines.push(
    `  "${slug}": { icon: ${JSON.stringify(meta.icon)}, color: ${JSON.stringify(meta.color)}, category: ${JSON.stringify(meta.category)} }`
  );
  added++;
  console.log(`add ${slug} (${data.verses.length} verses)`);
}

if (!added) {
  console.log("Nothing to merge.");
  process.exit(0);
}

// Insert before closing of versesData: `};\n\n// Topic metadata`
const versesEnd = src.indexOf("};\n\n// Topic metadata");
if (versesEnd === -1) {
  console.error("Could not find versesData end marker");
  process.exit(1);
}
const insertBlock = ",\n" + blocks.join(",\n") + "\n";
src = src.slice(0, versesEnd) + insertBlock + src.slice(versesEnd);

// Insert metadata before closing of topicMetadata object
// Find `export const topicMetadata = {` ... last entry before `};`
const metaMarker = "export const topicMetadata = {";
const metaStart = src.indexOf(metaMarker);
if (metaStart === -1) {
  console.error("No topicMetadata");
  process.exit(1);
}
// find the }; after self-control line or end of object
const afterMeta = src.indexOf("};\n\n// Categories", metaStart);
if (afterMeta === -1) {
  console.error("No topicMetadata end");
  process.exit(1);
}
src = src.slice(0, afterMeta) + ",\n" + metaLines.join(",\n") + "\n" + src.slice(afterMeta);

fs.writeFileSync(versesPath, src);
console.log(`Merged ${added} topics into lib/verses.js`);
