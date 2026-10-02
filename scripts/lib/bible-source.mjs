/**
 * Full public-domain Bible texts for build scripts: the World English Bible (WEB) and the King James Version (KJV).
 * Source files are the ones bible-api.com serves (github.com/seven1m/open-bibles), so verse text matches what the
 * topic pipeline has always fetched. Downloaded once into .cache/bible/ (gitignored).
 *
 *   import { loadBible, BOOKS, parseReference } from "./lib/bible-source.mjs";
 *   const web = await loadBible("web");   // Map "John 3:16" -> text, plus web.books[i].chapters[c][v]
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE = path.join(__dirname, "..", "..", ".cache", "bible");

const SOURCES = {
  web: "https://raw.githubusercontent.com/seven1m/open-bibles/master/eng-web.usfx.xml",
  kjv: "https://raw.githubusercontent.com/seven1m/open-bibles/master/eng-kjv.osis.xml",
};

// 66-book Protestant canon: [name, usfx id, osis id, testament]
export const BOOKS = [
  ["Genesis", "GEN", "Gen", "OT"], ["Exodus", "EXO", "Exod", "OT"], ["Leviticus", "LEV", "Lev", "OT"],
  ["Numbers", "NUM", "Num", "OT"], ["Deuteronomy", "DEU", "Deut", "OT"], ["Joshua", "JOS", "Josh", "OT"],
  ["Judges", "JDG", "Judg", "OT"], ["Ruth", "RUT", "Ruth", "OT"], ["1 Samuel", "1SA", "1Sam", "OT"],
  ["2 Samuel", "2SA", "2Sam", "OT"], ["1 Kings", "1KI", "1Kgs", "OT"], ["2 Kings", "2KI", "2Kgs", "OT"],
  ["1 Chronicles", "1CH", "1Chr", "OT"], ["2 Chronicles", "2CH", "2Chr", "OT"], ["Ezra", "EZR", "Ezra", "OT"],
  ["Nehemiah", "NEH", "Neh", "OT"], ["Esther", "EST", "Esth", "OT"], ["Job", "JOB", "Job", "OT"],
  ["Psalms", "PSA", "Ps", "OT"], ["Proverbs", "PRO", "Prov", "OT"], ["Ecclesiastes", "ECC", "Eccl", "OT"],
  ["Song of Solomon", "SNG", "Song", "OT"], ["Isaiah", "ISA", "Isa", "OT"], ["Jeremiah", "JER", "Jer", "OT"],
  ["Lamentations", "LAM", "Lam", "OT"], ["Ezekiel", "EZK", "Ezek", "OT"], ["Daniel", "DAN", "Dan", "OT"],
  ["Hosea", "HOS", "Hos", "OT"], ["Joel", "JOL", "Joel", "OT"], ["Amos", "AMO", "Amos", "OT"],
  ["Obadiah", "OBA", "Obad", "OT"], ["Jonah", "JON", "Jonah", "OT"], ["Micah", "MIC", "Mic", "OT"],
  ["Nahum", "NAM", "Nah", "OT"], ["Habakkuk", "HAB", "Hab", "OT"], ["Zephaniah", "ZEP", "Zeph", "OT"],
  ["Haggai", "HAG", "Hag", "OT"], ["Zechariah", "ZEC", "Zech", "OT"], ["Malachi", "MAL", "Mal", "OT"],
  ["Matthew", "MAT", "Matt", "NT"], ["Mark", "MRK", "Mark", "NT"], ["Luke", "LUK", "Luke", "NT"],
  ["John", "JHN", "John", "NT"], ["Acts", "ACT", "Acts", "NT"], ["Romans", "ROM", "Rom", "NT"],
  ["1 Corinthians", "1CO", "1Cor", "NT"], ["2 Corinthians", "2CO", "2Cor", "NT"], ["Galatians", "GAL", "Gal", "NT"],
  ["Ephesians", "EPH", "Eph", "NT"], ["Philippians", "PHP", "Phil", "NT"], ["Colossians", "COL", "Col", "NT"],
  ["1 Thessalonians", "1TH", "1Thess", "NT"], ["2 Thessalonians", "2TH", "2Thess", "NT"],
  ["1 Timothy", "1TI", "1Tim", "NT"], ["2 Timothy", "2TI", "2Tim", "NT"], ["Titus", "TIT", "Titus", "NT"],
  ["Philemon", "PHM", "Phlm", "NT"], ["Hebrews", "HEB", "Heb", "NT"], ["James", "JAS", "Jas", "NT"],
  ["1 Peter", "1PE", "1Pet", "NT"], ["2 Peter", "2PE", "2Pet", "NT"], ["1 John", "1JN", "1John", "NT"],
  ["2 John", "2JN", "2John", "NT"], ["3 John", "3JN", "3John", "NT"], ["Jude", "JUD", "Jude", "NT"],
  ["Revelation", "REV", "Rev", "NT"],
];

const ALIASES = { Psalm: "Psalms", "Song of Songs": "Song of Solomon", Revelations: "Revelation" };

export function canonicalBook(name) {
  const n = name.replace(/\s+/g, " ").trim();
  return ALIASES[n] || n;
}

/** "Lamentations 3:21-23" -> { book, chapter, from, to } (single chapter only) */
export function parseReference(ref) {
  const m = ref.replace(/–/g, "-").match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!m) return null;
  return { book: canonicalBook(m[1]), chapter: +m[2], from: +m[3], to: m[4] ? +m[4] : +m[3] };
}

async function download(id) {
  fs.mkdirSync(CACHE, { recursive: true });
  const file = path.join(CACHE, path.basename(SOURCES[id]));
  if (!fs.existsSync(file)) {
    const res = await fetch(SOURCES[id]);
    if (!res.ok) throw new Error(`download ${id}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file, "utf8");
}

const clean = (s) =>
  s
    .replace(/<(f|x|note|title|d|s|rdg)\b[^>]*?\/>/g, "")
    .replace(/<(f|x|note|title|rdg)\b[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

function parseUsfx(xml) {
  const byId = Object.fromEntries(BOOKS.map((b, i) => [b[1], i]));
  const books = BOOKS.map(() => ({ chapters: [] }));
  for (const bm of xml.matchAll(/<book id="([A-Z0-9]{3})">([\s\S]*?)<\/book>/g)) {
    const bi = byId[bm[1]];
    if (bi === undefined) continue;
    // drop section headings and psalm titles, which sit outside verse text
    const body = bm[2].replace(/<(s|d)\b[^>]*>[\s\S]*?<\/\1>/g, "");
    const parts = body.split(/<c id="(\d+)"\/>/);
    for (let i = 1; i < parts.length; i += 2) {
      const ch = +parts[i];
      const verses = [];
      for (const vm of parts[i + 1].matchAll(/<v id="(\d+)[^"]*"\/>([\s\S]*?)(?=<ve\/>|<v id=|$)/g)) {
        verses[+vm[1]] = clean(vm[2]);
      }
      books[bi].chapters[ch] = verses;
    }
  }
  return books;
}

function parseOsis(xml) {
  const byId = Object.fromEntries(BOOKS.map((b, i) => [b[2], i]));
  const books = BOOKS.map(() => ({ chapters: [] }));
  const body = xml.replace(/<title\b[^>]*>[\s\S]*?<\/title>/g, "");
  for (const vm of body.matchAll(/<verse[^>]*osisID="([1-3]?[A-Za-z]+)\.(\d+)\.(\d+)"[^>]*sID="[^"]*"[^>]*\/>([\s\S]*?)<verse[^>]*eID=/g)) {
    const bi = byId[vm[1]];
    if (bi === undefined) continue;
    const ch = +vm[2];
    (books[bi].chapters[ch] ||= [])[+vm[3]] = clean(vm[4]);
  }
  return books;
}

const cache = {};
export async function loadBible(id) {
  if (cache[id]) return cache[id];
  const xml = await download(id);
  const books = id === "web" ? parseUsfx(xml) : parseOsis(xml);
  const bible = { id, books };
  bible.get = (ref) => {
    const r = typeof ref === "string" ? parseReference(ref) : ref;
    if (!r) return null;
    const bi = BOOKS.findIndex((b) => b[0] === r.book);
    const ch = bi >= 0 ? books[bi].chapters[r.chapter] : null;
    if (!ch) return null;
    const out = [];
    for (let v = r.from; v <= r.to; v++) {
      if (!ch[v]) return null;
      out.push(ch[v]);
    }
    return out.join(" ");
  };
  cache[id] = bible;
  return bible;
}
