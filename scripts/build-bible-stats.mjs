#!/usr/bin/env node
/**
 * Count the Bible: books, chapters, verses, words, reading time and word frequencies, computed from the full text of
 * the King James Version (1769) and the World English Bible (both public domain, the files bible-api.com serves).
 *
 *   node scripts/build-bible-stats.mjs     # writes lib/data/bible-books.json and lib/data/bible-words.json
 *
 * Method (shown on the pages): verse text only, no headings or psalm titles; a word is a run of letters with inner
 * apostrophes ("LORD'S" is one word); matching ignores case; a phrase matches consecutive words inside one verse.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS, parseReference } from "./lib/bible-source.mjs";
import { WORDS } from "./bible-words.config.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "lib", "data");
const READING_WPM = 238; // Brysbaert 2019 meta-analysis: average silent reading rate for English non-fiction

const kjv = await loadBible("kjv");
const web = await loadBible("web");
const { versesData } = await import(path.join(root, "lib", "verses.js"));

const tokens = (text) => (text.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || []);
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const ref = (book, ch, v) => `${book === "Psalms" ? "Psalm" : book} ${ch}:${v}`;

// every verse in canon order, per translation
function flatten(bible) {
  const rows = [];
  bible.books.forEach((b, bi) => {
    b.chapters.forEach((verses, ch) => {
      if (!verses) return;
      verses.forEach((text, v) => {
        if (text) rows.push({ bi, book: BOOKS[bi][0], ch, v, text, words: tokens(text) });
      });
    });
  });
  return rows;
}
const rows = { kjv: flatten(kjv), web: flatten(web) };

// which verses our topic pages already use, keyed "Book ch:v" -> [topic slugs]
const curated = new Map();
for (const [slug, t] of Object.entries(versesData)) {
  for (const v of t.verses) {
    const r = parseReference(v.reference);
    if (!r) continue;
    for (let n = r.from; n <= r.to; n++) {
      const k = `${r.book} ${r.chapter}:${n}`;
      if (!curated.has(k)) curated.set(k, []);
      if (!curated.get(k).includes(slug)) curated.get(k).push(slug);
    }
  }
}

// ---------- books ----------
function bookStats(id) {
  const all = rows[id];
  return BOOKS.map(([name], bi) => {
    const vs = all.filter((r) => r.bi === bi);
    const chapters = [...new Set(vs.map((r) => r.ch))].sort((a, b) => a - b);
    const perChapter = chapters.map((c) => vs.filter((r) => r.ch === c).length);
    const words = vs.reduce((s, r) => s + r.words.length, 0);
    const byLen = [...vs].sort((a, b) => b.words.length - a.words.length || a.ch - b.ch || a.v - b.v);
    const shortest = [...vs].sort((a, b) => a.words.length - b.words.length || a.ch - b.ch || a.v - b.v)[0];
    return {
      chapters: chapters.length,
      verses: vs.length,
      words,
      perChapter,
      longestVerse: { ref: ref(name, byLen[0].ch, byLen[0].v), words: byLen[0].words.length, text: byLen[0].text },
      shortestVerse: { ref: ref(name, shortest.ch, shortest.v), words: shortest.words.length, text: shortest.text },
      first: { ref: ref(name, vs[0].ch, vs[0].v), text: vs[0].text },
      last: { ref: ref(name, vs.at(-1).ch, vs.at(-1).v), text: vs.at(-1).text },
    };
  });
}
const kb = bookStats("kjv");
const wb = bookStats("web");

const books = BOOKS.map(([name, , , testament], i) => {
  const k = kb[i];
  const w = wb[i];
  const longestCh = k.perChapter.indexOf(Math.max(...k.perChapter)) + 1;
  const shortestCh = k.perChapter.indexOf(Math.min(...k.perChapter)) + 1;
  const used = [...curated.entries()].filter(([key]) => key.startsWith(`${name} `));
  const topicCounts = {};
  for (const [, slugs] of used) for (const s of slugs) topicCounts[s] = (topicCounts[s] || 0) + 1;
  return {
    name,
    slug: slugify(name),
    order: i + 1,
    testament,
    chapters: k.chapters,
    verses: { kjv: k.verses, web: w.verses },
    words: { kjv: k.words, web: w.words },
    readingMinutes: Math.round(k.words / READING_WPM),
    perChapter: k.perChapter,
    longestChapter: { chapter: longestCh, verses: k.perChapter[longestCh - 1] },
    shortestChapter: { chapter: shortestCh, verses: k.perChapter[shortestCh - 1] },
    longestVerse: { kjv: k.longestVerse, web: w.longestVerse },
    shortestVerse: { kjv: k.shortestVerse, web: w.shortestVerse },
    first: { kjv: k.first, web: w.first },
    last: { kjv: k.last, web: w.last },
    curatedVerses: used.length,
    curatedTopics: Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).map(([slug, n]) => ({ slug, verses: n })),
  };
});

// whole-Bible facts
function totals(id) {
  const all = rows[id];
  const words = all.reduce((s, r) => s + r.words.length, 0);
  const sorted = [...all].sort((a, b) => b.words.length - a.words.length);
  const minLen = Math.min(...all.map((r) => r.words.length));
  const shortestAll = all.filter((r) => r.words.length === minLen);
  const n = all.length;
  const midIdx = n % 2 ? [(n - 1) / 2] : [n / 2 - 1, n / 2];
  const chapterList = [];
  for (const r of all) {
    const last = chapterList.at(-1);
    if (!last || last.book !== r.book || last.ch !== r.ch) chapterList.push({ book: r.book, ch: r.ch, verses: 1 });
    else last.verses++;
  }
  const c = chapterList.length;
  const midCh = c % 2 ? [(c - 1) / 2] : [c / 2 - 1, c / 2];
  const longestCh = [...chapterList].sort((a, b) => b.verses - a.verses)[0];
  const shortestCh = [...chapterList].sort((a, b) => a.verses - b.verses)[0];
  return {
    verses: n,
    words,
    chapters: c,
    readingHours: +(words / READING_WPM / 60).toFixed(1),
    longestVerse: { ref: ref(sorted[0].book, sorted[0].ch, sorted[0].v), words: sorted[0].words.length, text: sorted[0].text },
    shortestVerses: shortestAll.map((r) => ({ ref: ref(r.book, r.ch, r.v), words: r.words.length, text: r.text })),
    middleVerses: midIdx.map((i) => ({ ref: ref(all[i].book, all[i].ch, all[i].v), position: i + 1, text: all[i].text })),
    middleChapters: midCh.map((i) => ({ ref: `${chapterList[i].book === "Psalms" ? "Psalm" : chapterList[i].book} ${chapterList[i].ch}`, position: i + 1, verses: chapterList[i].verses })),
    longestChapter: { ref: `${longestCh.book === "Psalms" ? "Psalm" : longestCh.book} ${longestCh.ch}`, verses: longestCh.verses },
    shortestChapter: { ref: `${shortestCh.book === "Psalms" ? "Psalm" : shortestCh.book} ${shortestCh.ch}`, verses: shortestCh.verses },
  };
}
// verses the WEB leaves out of the numbered text (it keeps them as footnotes)
const webKeys = new Set(rows.web.map((r) => `${r.bi}:${r.ch}:${r.v}`));
const webMissing = rows.kjv.filter((r) => !webKeys.has(`${r.bi}:${r.ch}:${r.v}`)).map((r) => ref(r.book, r.ch, r.v));
const kjvKeys = new Set(rows.kjv.map((r) => `${r.bi}:${r.ch}:${r.v}`));
const webExtra = rows.web.filter((r) => !kjvKeys.has(`${r.bi}:${r.ch}:${r.v}`)).map((r) => ref(r.book, r.ch, r.v));
// Psalm 118:8 is often called the middle verse of the Bible; record where it really falls
const psalmsIdx = BOOKS.findIndex((b) => b[0] === "Psalms");
const ps118v8 = rows.kjv.findIndex((r) => r.bi === psalmsIdx && r.ch === 118 && r.v === 8) + 1;

const kjvXml = fs.readFileSync(path.join(root, ".cache", "bible", "eng-kjv.osis.xml"), "utf8");
const psalmTitleWords = [...kjvXml.matchAll(/<title type="psalm"[^>]*>([\s\S]*?)<\/title>/g)]
  .map((m) => tokens(m[1].replace(/<[^>]+>/g, " ")).length)
  .filter((n) => n > 1) // skip the one-word Hebrew letter headings of Psalm 119
  .reduce((a, b) => a + b, 0);

// the books data is a pure function of the two texts, so its as-of date only moves when the texts or the method do
const prevBooks = fs.existsSync(path.join(outDir, "bible-books.json")) ? JSON.parse(fs.readFileSync(path.join(outDir, "bible-books.json"), "utf8")) : null;
const today = new Date().toISOString().slice(0, 10);
const bible = {
  psalmTitleWords,
  generated: prevBooks ? prevBooks.bible.generated : today,
  readingWpm: READING_WPM,
  sources: {
    kjv: "King James Version (1769), public domain, eng-kjv.osis.xml from github.com/seven1m/open-bibles",
    web: "World English Bible, public domain, eng-web.usfx.xml from github.com/seven1m/open-bibles",
  },
  kjv: totals("kjv"),
  web: totals("web"),
  webMissing,
  webExtra,
  psalm118v8Position: ps118v8,
  deuterocanon: { books: ["Tobit", "Judith", "Esther (Greek)", "Wisdom", "Sirach", "Baruch", "1 Maccabees", "2 Maccabees"] },
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "bible-books.json"), JSON.stringify({ bible, books }));

// ---------- words ----------
function countWord(id, entry) {
  const forms = entry.forms.map((f) => f.toLowerCase().split(/\s+/));
  const excluded = (entry.exclude || []).map((f) => f.toLowerCase().split(/\s+/));
  const byForm = Object.fromEntries(entry.forms.map((f) => [f, 0]));
  const byCase = {};
  const casing = Object.fromEntries(entry.forms.map((f) => [f, {}]));
  const byBook = {};
  let total = 0;
  let ot = 0;
  let nt = 0;
  const hits = [];
  for (const r of rows[id]) {
    const lw = r.words.map((w) => w.toLowerCase());
    let inVerse = 0;
    forms.forEach((parts, fi) => {
      for (let i = 0; i + parts.length <= lw.length; i++) {
        if (parts.every((p, j) => lw[i + j] === p) && !excluded.some((ex) => ex.every((p, j) => lw[i + j] === p))) {
          inVerse++;
          byForm[entry.forms[fi]]++;
          const original = r.words.slice(i, i + parts.length).join(" ");
          if (entry.cases) byCase[original] = (byCase[original] || 0) + 1;
          const c = casing[entry.forms[fi]];
          c[original] = (c[original] || 0) + 1;
        }
      }
    });
    if (!inVerse) continue;
    total += inVerse;
    byBook[r.book] = (byBook[r.book] || 0) + inVerse;
    if (BOOKS[r.bi][3] === "OT") ot += inVerse;
    else nt += inVerse;
    hits.push({ key: `${r.book} ${r.ch}:${r.v}`, ref: ref(r.book, r.ch, r.v), n: inVerse, text: r.text });
  }
  const headParts = forms[0];
  const exact = byForm[entry.forms[0]];
  const exactVerses = rows[id].filter((r) => {
    const lw = r.words.map((w) => w.toLowerCase());
    for (let i = 0; i + headParts.length <= lw.length; i++) if (headParts.every((p, j) => lw[i + j] === p)) return true;
    return false;
  }).length;
  const most = [...hits].sort((a, b) => b.n - a.n)[0] || null;
  const tied = most ? hits.filter((h) => h.n === most.n && h.ref !== most.ref).map((h) => h.ref) : [];
  return {
    total,
    exact,
    exactVerses,
    verses: hits.length,
    ot,
    nt,
    books: Object.keys(byBook).length,
    byForm,
    byCase: entry.cases ? byCase : undefined,
    // how a form is printed when it is a proper noun (Sheol, Yahweh): the casing used 80%+ of the time
    display: Object.fromEntries(
      Object.entries(casing).map(([f, c]) => {
        const [top, n] = Object.entries(c).sort((a, b) => b[1] - a[1])[0] || [f, 0];
        const all = Object.values(c).reduce((x, y) => x + y, 0);
        const headWord = !entry.cases ? false : f.startsWith(entry.forms[0].split(" ")[0]);
        return [f, !headWord && all && n / all >= 0.8 ? top : f];
      })
    ),
    byBook: BOOKS.map(([b]) => [b, byBook[b] || 0]).filter(([, n]) => n),
    first: hits[0] ? { ref: hits[0].ref, text: hits[0].text } : null,
    last: hits.length ? { ref: hits.at(-1).ref, text: hits.at(-1).text } : null,
    mostInVerse: most && most.n > 1 ? { ref: most.ref, n: most.n, text: most.text, tied: tied.slice(0, 5), tiedCount: tied.length } : null,
    hitKeys: hits.map((h) => h.key),
    headPhrase: headParts.join(" "),
  };
}

// a word page keeps the date it first shipped; only new words get today's date (sitemap lastmod follows content)
const prevWords = fs.existsSync(path.join(outDir, "bible-words.json")) ? JSON.parse(fs.readFileSync(path.join(outDir, "bible-words.json"), "utf8")) : null;
const addedOn = new Map((prevWords ? prevWords.words : []).map((w) => [w.slug, w.added || prevWords.generated]));
const words = [];
for (const entry of WORDS) {
  const k = countWord("kjv", entry);
  const w = countWord("web", entry.web ? { ...entry, forms: entry.web } : entry);
  // verses on our topic pages that contain the word in the WEB text we display
  const curatedHits = w.hitKeys
    .filter((key) => curated.has(key))
    .map((key) => {
      const r = rows.web.find((x) => `${x.book} ${x.ch}:${x.v}` === key);
      return { ref: ref(r.book, r.ch, r.v), text: r.text, topics: curated.get(key) };
    });
  const kSet = new Set(k.hitKeys);
  const wSet = new Set(w.hitKeys);
  const onlyKjv = k.hitKeys.filter((x) => !wSet.has(x));
  const onlyWeb = w.hitKeys.filter((x) => !kSet.has(x));
  const sample = (keys, id) =>
    keys.slice(0, 3).map((key) => {
      const r = rows[id].find((x) => `${x.book} ${x.ch}:${x.v}` === key);
      const other = rows[id === "kjv" ? "web" : "kjv"].find((x) => `${x.book} ${x.ch}:${x.v}` === key);
      return { ref: ref(r.book, r.ch, r.v), [id]: r.text, [id === "kjv" ? "web" : "kjv"]: other ? other.text : null };
    });
  delete k.hitKeys;
  delete w.hitKeys;
  words.push({
    slug: entry.slug,
    added: addedOn.get(entry.slug) || today,
    word: entry.word,
    kind: entry.kind || "word",
    exactHeadline: entry.exactHeadline || false,
    kjvLabel: entry.kjvLabel || null,
    topic: entry.topic || (versesData[entry.slug] ? entry.slug : null),
    related: entry.related || [],
    note: entry.note || null,
    kjvForms: entry.forms,
    webForms: entry.web || entry.forms,
    kjv: k,
    web: w,
    onlyKjv: { count: onlyKjv.length, examples: sample(onlyKjv, "kjv") },
    onlyWeb: { count: onlyWeb.length, examples: sample(onlyWeb, "web") },
    // verses on the word's own topic page first, then the ones our topics share most
    curated: [...curatedHits]
      .sort((a, b) => b.topics.includes(entry.topic || entry.slug) - a.topics.includes(entry.topic || entry.slug) || b.topics.length - a.topics.length)
      .slice(0, 12),
    curatedCount: curatedHits.length,
  });
}
fs.writeFileSync(path.join(outDir, "bible-words.json"), JSON.stringify({ generated: today, words }));

console.log("KJV", bible.kjv.verses, "verses", bible.kjv.words, "words", bible.kjv.chapters, "chapters", bible.kjv.readingHours, "h");
console.log("WEB", bible.web.verses, "verses", bible.web.words, "words", bible.web.readingHours, "h; WEB omits", webMissing.length, webMissing.join(", "));
console.log("WEB extra", webExtra, "Psalm 118:8 position", ps118v8);
console.log("WEB shortest", bible.web.shortestVerses.map((s) => s.ref + " " + s.text), "WEB longest", bible.web.longestVerse.ref, bible.web.longestVerse.words);
console.log("middle verses", bible.kjv.middleVerses.map((m) => m.ref), "middle chapters", bible.kjv.middleChapters.map((m) => m.ref));
console.log("longest verse", bible.kjv.longestVerse.ref, bible.kjv.longestVerse.words, "shortest", bible.kjv.shortestVerses.map((s) => s.ref + " " + s.text));
console.log("longest chapter", bible.kjv.longestChapter, "shortest", bible.kjv.shortestChapter);
const byWords = [...books].sort((a, b) => b.words.kjv - a.words.kjv);
console.log("longest books", byWords.slice(0, 3).map((b) => `${b.name} ${b.words.kjv}`), "shortest", byWords.slice(-3).map((b) => `${b.name} ${b.words.kjv} words ${b.verses.kjv} verses`));
for (const w of words) console.log(`${w.slug}: KJV ${w.kjv.exact}/${w.kjv.total} in ${w.kjv.verses} verses · WEB ${w.web.exact}/${w.web.total} · curated ${w.curatedCount}`);
