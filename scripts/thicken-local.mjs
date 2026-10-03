#!/usr/bin/env node
/**
 * Thicken an existing topic: take OpenBible's ranked refs, keep the ones the topic lacks, and take the text from the
 * local WEB source (no bible-api round trip). Appends up to the target count; then run clean-verses.mjs --write
 * (drops overlaps, adds KJV, fixes counts in titles, moves dateModified).
 *
 *   node scripts/thicken-local.mjs <slug> [openbible-slug] [target=40]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, parseReference } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const versesPath = path.join(root, "lib", "verses.js");
const [slug, openSlug = slug, targetArg] = process.argv.slice(2);
const target = +targetArg || 40;
const web = await loadBible("web");
const { versesData } = await import(versesPath);
const topic = versesData[slug];
if (!topic) throw new Error(`unknown topic ${slug}`);

const res = await fetch(`https://www.openbible.info/topics/${openSlug}`, { headers: { "User-Agent": "BibleSaysAboutBot/1.0 (+https://www.biblesaysabout.com)" } });
if (!res.ok) throw new Error(`OpenBible ${openSlug}: ${res.status}`);
const html = await res.text();
const refs = [...html.matchAll(/class="bibleref"[^>]*>([^<]+)<\/a>/g)].map((m) => m[1].replace(/–/g, "-").replace(/\s+/g, " ").trim());

const have = new Set(topic.verses.map((v) => v.reference.toLowerCase()));
const added = [];
for (const ref of refs) {
  if (topic.verses.length + added.length >= target) break;
  if (have.has(ref.toLowerCase())) continue;
  const r = parseReference(ref);
  const text = r && web.get(r);
  if (!text) continue;
  have.add(ref.toLowerCase());
  added.push({ text, reference: ref, translation: "WEB", theme: slug });
}

let src = fs.readFileSync(versesPath, "utf8");
const start = src.indexOf("export const versesData = {");
const end = src.indexOf("// Topic metadata for enhanced display");
const data = { ...versesData, [slug]: { ...topic, verses: [...topic.verses, ...added] } };
src = src.slice(0, start) + `export const versesData = ${JSON.stringify(data, null, 2)};\n\n` + src.slice(end);
fs.writeFileSync(versesPath, src);
console.log(`${slug}: ${topic.verses.length} -> ${topic.verses.length + added.length} (OpenBible listed ${refs.length})`);
