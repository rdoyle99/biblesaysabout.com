#!/usr/bin/env node
/**
 * Ranked top-10 lists for the "shortest/longest verse/chapter/book" pages, computed from the full KJV and WEB text.
 *   node scripts/build-bible-rankings.mjs     # writes lib/data/bible-rankings.json
 * Same word rule as build-bible-stats.mjs (a run of letters, inner apostrophes stay). Verse ties: more words, then
 * more letters, then canon order. Chapter ties: canon order.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokens = (t) => t.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];
const letters = (t) => (t.match(/[A-Za-z]/g) || []).length;
const label = (book, ch, v) => `${book === "Psalms" ? "Psalm" : book} ${ch}${v ? ":" + v : ""}`;

function collect(bible) {
  const verses = [];
  const chapters = [];
  bible.books.forEach((b, bi) => {
    b.chapters.forEach((vs, ch) => {
      if (!vs) return;
      let n = 0;
      let w = 0;
      vs.forEach((text, v) => {
        if (!text) return;
        const words = tokens(text).length;
        n++;
        w += words;
        verses.push({ ref: label(BOOKS[bi][0], ch, v), words, letters: letters(text), text, bi, ch, v });
      });
      chapters.push({ ref: label(BOOKS[bi][0], ch), verses: n, words: w, bi, ch });
    });
  });
  return { verses, chapters };
}

const out = { generated: new Date().toISOString().slice(0, 10) };
for (const id of ["kjv", "web"]) {
  const { verses, chapters } = collect(await loadBible(id));
  const vs = (cmp) => [...verses].sort(cmp).slice(0, 10).map(({ ref, words, letters, text }) => ({ ref, words, letters, text }));
  const canon = (a, b) => a.bi - b.bi || a.ch - b.ch || (a.v || 0) - (b.v || 0);
  const cs = (cmp) => [...chapters].sort(cmp).slice(0, 10).map(({ ref, verses, words }) => ({ ref, verses, words }));
  const nt = (r) => BOOKS[r.bi][3] === "NT";
  const one = (list, cmp) => { const r = [...list].sort(cmp)[0]; return r.text !== undefined ? { ref: r.ref, words: r.words, letters: r.letters, text: r.text } : { ref: r.ref, verses: r.verses, words: r.words }; };
  out[id] = {
    ntLongestVerse: one(verses.filter(nt), (a, b) => b.words - a.words || b.letters - a.letters || canon(a, b)),
    ntLongestChapter: one(chapters.filter(nt), (a, b) => b.verses - a.verses || b.words - a.words || canon(a, b)),
    ntShortestChapter: one(chapters.filter(nt), (a, b) => a.verses - b.verses || a.words - b.words || canon(a, b)),
    shortestVerses: vs((a, b) => a.words - b.words || a.letters - b.letters || canon(a, b)),
    longestVerses: vs((a, b) => b.words - a.words || b.letters - a.letters || canon(a, b)),
    longestChapters: cs((a, b) => b.verses - a.verses || b.words - a.words || canon(a, b)),
    shortestChapters: cs((a, b) => a.verses - b.verses || a.words - b.words || canon(a, b)),
    longestChaptersByWords: cs((a, b) => b.words - a.words || canon(a, b)),
    shortestChaptersByWords: cs((a, b) => a.words - b.words || canon(a, b)),
  };
}
fs.writeFileSync(path.join(root, "lib", "data", "bible-rankings.json"), JSON.stringify(out, null, 1));
for (const id of ["kjv", "web"]) for (const [k, list] of Object.entries(out[id])) if (Array.isArray(list)) console.log(id, k, list.slice(0, 4).map((r) => `${r.ref} ${r.words ?? ""}/${r.verses ?? ""}`).join(" | "));
