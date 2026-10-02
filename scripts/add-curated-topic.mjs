#!/usr/bin/env node
/**
 * Add (or replace) a hand-curated topic from a spec file: refs chosen by a person, text from the local WEB source.
 * Used for topics where OpenBible's community list doesn't fit (e.g. suicide: comfort verses only, crisis help first).
 *
 *   node scripts/add-curated-topic.mjs seo/topics/suicide.json   # then: node scripts/clean-verses.mjs --write
 *
 * Spec: slug, title, description, keywords, refs[], meta {icon, color, category}, and optional page fields the topic
 * template reads: notice {title, lines[], links[]}, summary, faqs [{q, a}] ("@summary" reuses the summary), sensitive.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, parseReference } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const versesPath = path.join(root, "lib", "verses.js");
const spec = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const TODAY = new Date().toISOString().slice(0, 10);
const web = await loadBible("web");

const verses = spec.refs.map((ref) => {
  const r = parseReference(ref);
  const text = r && web.get(r);
  if (!text) throw new Error(`no WEB text for ${ref}`);
  return { text, reference: ref, translation: "WEB", theme: spec.slug };
});

const { versesData, topicMetadata } = await import(versesPath);
const prev = versesData[spec.slug];
const topic = {
  title: spec.title,
  description: spec.description,
  slug: spec.slug,
  keywords: spec.keywords,
  ...(spec.sensitive ? { sensitive: true } : {}),
  ...(spec.notice ? { notice: spec.notice } : {}),
  ...(spec.summary ? { summary: spec.summary } : {}),
  ...(spec.versesHeading ? { versesHeading: spec.versesHeading } : {}),
  ...(spec.faqs ? { faqs: spec.faqs.map((f) => ({ q: f.q, a: f.a === "@summary" ? spec.summary : f.a })) } : {}),
  datePublished: prev?.datePublished || TODAY,
  dateModified: TODAY,
  verses,
};

let src = fs.readFileSync(versesPath, "utf8");
const start = src.indexOf("export const versesData = {");
const end = src.indexOf("// Topic metadata for enhanced display");
const data = { ...versesData, [spec.slug]: topic };
src = src.slice(0, start) + `export const versesData = ${JSON.stringify(data, null, 2)};\n\n` + src.slice(end);
if (!topicMetadata[spec.slug]) {
  const m = spec.meta;
  src = src.replace(
    "export const topicMetadata = {\n",
    `export const topicMetadata = {\n  "${spec.slug}": { icon: "${m.icon}", color: "${m.color}", category: "${m.category}" },\n`
  );
}
fs.writeFileSync(versesPath, src);
console.log(`${prev ? "replaced" : "added"} ${spec.slug}: ${verses.length} verses`);
