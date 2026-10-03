#!/usr/bin/env node
/**
 * KJV word count of every chapter, for the reading plans (lib/readingPlan.js). Same tokenizer as build-bible-stats.mjs.
 *   node scripts/build-chapter-words.mjs   # writes lib/data/bible-chapter-words.json
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = (text) => (text.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || []);
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const kjv = await loadBible("kjv");
const stats = JSON.parse(fs.readFileSync(path.join(root, "lib", "data", "bible-books.json"), "utf8"));

const books = kjv.books.map((b, bi) => {
  const chapters = [];
  b.chapters.forEach((verses, ch) => {
    if (verses) chapters[ch - 1] = verses.reduce((s, t) => s + (t ? tokens(t).length : 0), 0);
  });
  return { name: BOOKS[bi][0], slug: slugify(BOOKS[bi][0]), testament: BOOKS[bi][3], words: chapters };
});
const total = books.reduce((s, b) => s + b.words.reduce((a, n) => a + n, 0), 0);
if (total !== stats.bible.kjv.words) throw new Error(`total ${total} != ${stats.bible.kjv.words}`);
const out = { generated: stats.bible.generated, translation: "KJV", total, books };
fs.writeFileSync(path.join(root, "lib", "data", "bible-chapter-words.json"), JSON.stringify(out));
console.log(`chapters ${books.reduce((s, b) => s + b.words.length, 0)}, words ${total}`);
