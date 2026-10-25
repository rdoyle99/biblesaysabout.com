/* How many books are in the Catholic Bible: the 73-book list (46 + 27) in the USCCB's order, the seven
   deuterocanonical books and the Greek additions to Esther and Daniel counted (chapters, verses, words) from the
   World English Bible, which prints them, and the Apocrypha the King James file carries, counted from the KJV.
   scripts/lib/bible-source.mjs loads only the 66 books, so the extra books are read here straight from the cached
   USFX (WEB) and OSIS (KJV) files with the same regexes and the same clean-up.
   Writes lib/data/lists/how-many-books-are-in-the-catholic-bible.json.
   Run: node scripts/lists/how-many-books-are-in-the-catholic-bible.mjs */
import fs from "fs";
import path from "path";
import { root, tokens, norm, must, countForms, fail, writeList, ROWS, BOOKS } from "../lib/list-helpers.mjs";

const CACHE = path.join(root, ".cache", "bible");
// word counts use scripts/build-bible-stats.mjs's tokenizer (only the right quote folds to an apostrophe), so the 66-book
// totals here equal the ones lib/data/bible-books.json prints across the site
const wtok = (text) => text.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];
const clean = (s) =>
  s
    .replace(/<(f|x|note|title|d|s|rdg)\b[^>]*?\/>/g, "")
    .replace(/<(f|x|note|title|rdg)\b[^>]*>[\s\S]*?<\/\1>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();

/* ---------- read every book in the two files, the 66 and the rest ---------- */
function readUsfx() {
  const xml = fs.readFileSync(path.join(CACHE, "eng-web.usfx.xml"), "utf8");
  const out = {};
  const order = [];
  for (const bm of xml.matchAll(/<book id="([A-Z0-9]{3})">([\s\S]*?)<\/book>/g)) {
    const body = bm[2].replace(/<(s|d)\b[^>]*>[\s\S]*?<\/\1>/g, "");
    const parts = body.split(/<c id="(\d+)"\/>/);
    const chapters = {};
    for (let i = 1; i < parts.length; i += 2) {
      const verses = {};
      for (const vm of parts[i + 1].matchAll(/<v id="(\d+)[^"]*"\/>([\s\S]*?)(?=<ve\/>|<v id=|$)/g)) verses[+vm[1]] = clean(vm[2]);
      chapters[+parts[i]] = verses;
    }
    out[bm[1]] = chapters;
    order.push(bm[1]);
  }
  return { books: out, order };
}
function readOsis() {
  const xml = fs.readFileSync(path.join(CACHE, "eng-kjv.osis.xml"), "utf8");
  const order = [...xml.matchAll(/<div type="book" osisID="([^"]+)"/g)].map((m) => m[1]);
  const body = xml.replace(/<title\b[^>]*>[\s\S]*?<\/title>/g, "");
  const out = {};
  for (const vm of body.matchAll(/<verse[^>]*osisID="([1-4]?[A-Za-z]+)\.(\d+)\.(\d+)"[^>]*sID="[^"]*"[^>]*\/>([\s\S]*?)<verse[^>]*eID=/g)) {
    ((out[vm[1]] ||= {})[+vm[2]] ||= {})[+vm[3]] = clean(vm[4]);
  }
  const description = (xml.match(/<description[^>]*>([^<]+)<\/description>/) || [])[1] || "";
  return { books: out, order, description };
}
const WEB = readUsfx();
const KJV = readOsis();

function stats(book) {
  if (!book) return null;
  let chapters = 0;
  let verses = 0;
  let words = 0;
  // a verse counts when it has text: the WEB keeps an empty marker where its Greek text omits a verse the KJV prints
  for (const vs of Object.values(book)) {
    const texts = Object.values(vs).filter(Boolean);
    if (!texts.length) continue;
    chapters += 1;
    verses += texts.length;
    for (const t of texts) words += wtok(t).length;
  }
  return { chapters, verses, words };
}
const add = (...s) => s.reduce((a, b) => ({ chapters: a.chapters + b.chapters, verses: a.verses + b.verses, words: a.words + b.words }), { chapters: 0, verses: 0, words: 0 });
const webVerse = (id, c, v) => WEB.books[id]?.[c]?.[v] || null;
const kjvVerse = (id, c, v) => KJV.books[id]?.[c]?.[v] || null;
/** a verse of an extra book must hold every needle (case-insensitive), in the WEB or the KJV */
function mustX(which, id, c, v, ...needles) {
  const text = norm(which === "web" ? webVerse(id, c, v) : kjvVerse(id, c, v));
  if (!text) fail(`${id} ${c}:${v} not found in the ${which.toUpperCase()}`);
  for (const n of needles) if (!text.toLowerCase().includes(norm(n).toLowerCase())) fail(`${id} ${c}:${v} (${which.toUpperCase()}) lacks "${n}": ${text}`);
  return which === "web" ? webVerse(id, c, v) : kjvVerse(id, c, v);
}

/* ---------- the 66 books: the count the site already prints must come out the same here ---------- */
const OT66 = BOOKS.filter((b) => b[3] === "OT");
const NT27 = BOOKS.filter((b) => b[3] === "NT");
if (OT66.length !== 39) fail(`expected 39 Old Testament books in BOOKS, got ${OT66.length}`);
if (NT27.length !== 27) fail(`expected 27 New Testament books in BOOKS, got ${NT27.length}`);
if (OT66.length + NT27.length !== 66) fail("39 + 27 should be 66");
const wordsOf = (id, filter) => ROWS[id].filter(filter).reduce((n, r) => n + wtok(r.text).length, 0);
const webOtWords = wordsOf("web", (r) => r.testament === "OT");
const webNtWords = wordsOf("web", (r) => r.testament === "NT");
const kjvOtWords = wordsOf("kjv", (r) => r.testament === "OT");
const kjvNtWords = wordsOf("kjv", (r) => r.testament === "NT");
// second derivation: the per-book counts in lib/data/bible-books.json (scripts/build-bible-stats.mjs)
const bookData = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-books.json"), "utf8"));
const bookArr = Array.isArray(bookData) ? bookData : bookData.books;
const sumWords = (t, id) => bookArr.filter((b) => b.testament === t).reduce((n, b) => n + b.words[id], 0);
if (sumWords("NT", "web") !== webNtWords) fail(`WEB New Testament words ${webNtWords} differ from bible-books.json ${sumWords("NT", "web")}`);
if (sumWords("OT", "web") !== webOtWords) fail(`WEB Old Testament words ${webOtWords} differ from bible-books.json ${sumWords("OT", "web")}`);
if (sumWords("NT", "kjv") !== kjvNtWords) fail(`KJV New Testament words differ from bible-books.json`);
const webBookWords = Object.fromEntries(BOOKS.map(([name]) => [name, wordsOf("web", (r) => r.book === name)]));
const ntByWords = NT27.map(([name]) => ({ name, words: webBookWords[name] })).sort((a, b) => b.words - a.words);
const allByWords = BOOKS.map(([name]) => ({ name, words: webBookWords[name] })).sort((a, b) => b.words - a.words);

/* ---------- the Catholic Old Testament, in the order of the USCCB's "Books of the Bible" page (read 2026-10-25) ---------- */
// [name as the USCCB lists it, USCCB section, name in BOOKS (null for a deuterocanonical book)]
const CATHOLIC_OT = [
  ["Genesis", "The Pentateuch", "Genesis"], ["Exodus", "The Pentateuch", "Exodus"], ["Leviticus", "The Pentateuch", "Leviticus"],
  ["Numbers", "The Pentateuch", "Numbers"], ["Deuteronomy", "The Pentateuch", "Deuteronomy"],
  ["Joshua", "Historical books", "Joshua"], ["Judges", "Historical books", "Judges"], ["Ruth", "Historical books", "Ruth"],
  ["1 Samuel", "Historical books", "1 Samuel"], ["2 Samuel", "Historical books", "2 Samuel"], ["1 Kings", "Historical books", "1 Kings"],
  ["2 Kings", "Historical books", "2 Kings"], ["1 Chronicles", "Historical books", "1 Chronicles"], ["2 Chronicles", "Historical books", "2 Chronicles"],
  ["Ezra", "Historical books", "Ezra"], ["Nehemiah", "Historical books", "Nehemiah"],
  ["Tobit", "Biblical novellas", null], ["Judith", "Biblical novellas", null], ["Esther", "Biblical novellas", "Esther"],
  ["1 Maccabees", "Biblical novellas", null], ["2 Maccabees", "Biblical novellas", null],
  ["Job", "Wisdom books", "Job"], ["Psalms", "Wisdom books", "Psalms"], ["Proverbs", "Wisdom books", "Proverbs"],
  ["Ecclesiastes", "Wisdom books", "Ecclesiastes"], ["Song of Songs", "Wisdom books", "Song of Solomon"],
  ["Wisdom", "Wisdom books", null], ["Sirach", "Wisdom books", null],
  ["Isaiah", "Prophetic books", "Isaiah"], ["Jeremiah", "Prophetic books", "Jeremiah"], ["Lamentations", "Prophetic books", "Lamentations"],
  ["Baruch", "Prophetic books", null], ["Ezekiel", "Prophetic books", "Ezekiel"], ["Daniel", "Prophetic books", "Daniel"],
  ["Hosea", "Prophetic books", "Hosea"], ["Joel", "Prophetic books", "Joel"], ["Amos", "Prophetic books", "Amos"],
  ["Obadiah", "Prophetic books", "Obadiah"], ["Jonah", "Prophetic books", "Jonah"], ["Micah", "Prophetic books", "Micah"],
  ["Nahum", "Prophetic books", "Nahum"], ["Habakkuk", "Prophetic books", "Habakkuk"], ["Zephaniah", "Prophetic books", "Zephaniah"],
  ["Haggai", "Prophetic books", "Haggai"], ["Zechariah", "Prophetic books", "Zechariah"], ["Malachi", "Prophetic books", "Malachi"],
];
const protoInCatholic = CATHOLIC_OT.filter((b) => b[2]).map((b) => b[2]);
const deuteroNames = CATHOLIC_OT.filter((b) => !b[2]).map((b) => b[0]);
if (CATHOLIC_OT.length !== 46) fail(`the Catholic Old Testament should have 46 books, the list has ${CATHOLIC_OT.length}`);
if (deuteroNames.length !== 7) fail(`expected 7 deuterocanonical books, got ${deuteroNames.length}`);
if (protoInCatholic.length !== 39 || new Set(protoInCatholic).size !== 39) fail("the Catholic list should hold each of the 39 Protestant Old Testament books once");
for (const [name] of OT66) if (!protoInCatholic.includes(name)) fail(`${name} missing from the Catholic Old Testament list`);
const CATHOLIC_TOTAL = CATHOLIC_OT.length + NT27.length;
if (CATHOLIC_TOTAL !== 73) fail(`46 + 27 should be 73, got ${CATHOLIC_TOTAL}`);
if (CATHOLIC_TOTAL - BOOKS.length !== 7) fail("73 - 66 should be 7");
// the Protestant order of the 39 survives inside the Catholic list except where the USCCB groups Esther with the novellas
const moved = protoInCatholic.filter((n, i) => {
  const before = protoInCatholic.slice(0, i);
  return before.some((b) => OT66.findIndex((x) => x[0] === b) > OT66.findIndex((x) => x[0] === n));
});

/* ---------- the seven deuterocanonical books, counted ---------- */
// [name, KJV Apocrypha name, WEB usfx ids, KJV osis ids, a one-line summary, a checked verse in the WEB and the KJV]
const DEUTERO = [
  ["Tobit", "Tobit", ["TOB"], ["Tob"], "An Israelite exile in Nineveh is blinded; the angel Raphael, sent to heal him, travels with his son Tobias.",
    [["TOB", 12, 15, "I am Raphael, one of the seven holy angels"], ["TOB", 1, 3, "to Nineveh"], ["TOB", 2, 10, "white films came over my eyes"], ["TOB", 3, 17, "Raphael also was sent to heal", "Tobias the son of Tobit"]], ["Tob", 12, 15, "I am Raphael"]],
  ["Judith", "Judith", ["JDT"], ["Jdt"], "Judith, a widow, goes into the camp of Holofernes, Nebuchadnezzar's general, and beheads him.",
    [["JDT", 13, 8, "took away his head from him"], ["JDT", 8, 4, "Judith was a widow"], ["JDT", 2, 4, "Holofernes the chief captain of his army"]], ["Jdt", 13, 8, "took away his head from him"]],
  ["Wisdom", "Wisdom of Solomon", ["WIS"], ["Wis"], "Teaching on wisdom in the voice of a king who prays for it; the KJV calls it the Wisdom of Solomon.",
    [["WIS", 9, 7, "to be king of your people"], ["WIS", 9, 4, "Give me wisdom"]], ["Wis", 9, 7, "a king of thy people"]],
  ["Sirach", "Ecclesiasticus", ["SIR"], ["Sir"], "Proverbs and teaching signed by Jesus the son of Sirach of Jerusalem; also called Ecclesiasticus.",
    [["SIR", 50, 27, "Jesus, the son of Sirach", "of Jerusalem"]], ["Sir", 50, 27, "Jesus the son of Sirach of Jerusalem"]],
  ["Baruch", "Baruch, with the Epistle of Jeremy", ["BAR", "LJE"], ["Bar", "EpJer"], "Words of Baruch, Jeremiah's scribe, written in Babylon; chapter 6 is the Letter of Jeremiah.",
    [["BAR", 1, 1, "Baruch the son of Nerias", "wrote in Babylon"], ["LJE", 6, 1, "Jeremy sent to them"]], ["Bar", 1, 1, "Baruch"]],
  ["1 Maccabees", "1 Maccabees", ["1MA"], ["1Macc"], "The revolt led by Judas Maccabaeus in the time of Antiochus Epiphanes, and the eight-day rededication of the altar.",
    [["1MA", 4, 59, "by the space of eight days", "Chislev"], ["1MA", 1, 10, "Antiochus Epiphanes"], ["1MA", 3, 1, "Judas, who was called Maccabaeus"]], ["1Macc", 4, 59, "by the space of eight days"]],
  ["2 Maccabees", "2 Maccabees", ["2MA"], ["2Macc"], "A second account of the revolt, with the seven brothers and their mother who chose death over breaking the law.",
    [["2MA", 7, 1, "seven kindred also with their mother"], ["2MA", 7, 2, "ready to die rather than transgress the laws"], ["2MA", 2, 19, "Judas Maccabaeus"]], ["2Macc", 7, 1, "seven brethren with their mother"]],
];
// Baruch as Jeremiah's scribe, in the 66-book text
must("Jeremiah 36:26", "Baruch the scribe");
must("Jeremiah 36:4", "Baruch the son of Neriah", "Baruch wrote from the mouth of Jeremiah");
if (DEUTERO.length !== 7) fail("DEUTERO should hold 7 books");
for (const d of DEUTERO) if (!deuteroNames.includes(d[0])) fail(`${d[0]} is not one of the USCCB's deuterocanonical books`);
// the Letter of Jeremiah is chapter 6 of Baruch in both files
if (!WEB.books.LJE?.[6]) fail("the WEB should number the Letter of Jeremiah as chapter 6");
if (!KJV.books.EpJer?.[6]) fail("the KJV should number the Epistle of Jeremy as chapter 6");

const deutero = DEUTERO.map(([name, kjvName, webIds, kjvIds, summary, webChecks, k]) => {
  const w = webChecks[0];
  const ws = add(...webIds.map((id) => stats(WEB.books[id])));
  const ks = add(...kjvIds.map((id) => stats(KJV.books[id])));
  if (!ws.words || !ks.words) fail(`${name}: no text found`);
  if (ws.chapters !== ks.chapters) fail(`${name}: WEB has ${ws.chapters} chapters, KJV ${ks.chapters}`);
  webChecks.forEach((c) => mustX("web", ...c));
  mustX("kjv", ...k);
  return { name, kjvName, chapters: ws.chapters, verses: ws.verses, versesKjv: ks.verses, words: ws.words, wordsKjv: ks.words, summary, ref: `${name} ${w[1]}:${w[2]}` };
});
const dt = deutero.reduce((a, d) => ({ chapters: a.chapters + d.chapters, verses: a.verses + d.verses, words: a.words + d.words, wordsKjv: a.wordsKjv + d.wordsKjv }), { chapters: 0, verses: 0, words: 0, wordsKjv: 0 });
const byWords = [...deutero].sort((a, b) => b.words - a.words);
const longest = byWords[0];
const shortest = byWords.at(-1);
if (longest.name !== "Sirach") fail(`expected Sirach to be the longest deuterocanonical book, got ${longest.name}`);
if (longest.chapters !== 51) fail(`Sirach should have 51 chapters, got ${longest.chapters}`);
// the verse numbers the KJV prints in Sirach that the WEB does not
const sirachGaps = [];
for (const [c, vs] of Object.entries(KJV.books.Sir)) for (const [v, t] of Object.entries(vs)) if (t && !WEB.books.SIR[c]?.[v]) sirachGaps.push(`${c}:${v}`);
const sirachExtraWeb = [];
for (const [c, vs] of Object.entries(WEB.books.SIR)) for (const [v, t] of Object.entries(vs)) if (t && !KJV.books.Sir[c]?.[v]) sirachExtraWeb.push(`${c}:${v}`);
if (longest.versesKjv - longest.verses !== sirachGaps.length - sirachExtraWeb.length) fail(`Sirach verse gap arithmetic is off: ${longest.versesKjv} ${longest.verses} ${sirachGaps} / ${sirachExtraWeb}`);
const sirachRankAll = [...allByWords, { name: "Sirach", words: longest.words }].sort((a, b) => b.words - a.words).findIndex((b) => b.name === "Sirach") + 1;
if (longest.words <= ntByWords[0].words) fail(`Sirach (${longest.words}) is not longer than ${ntByWords[0].name} (${ntByWords[0].words})`);

/* ---------- the additions to Esther and Daniel ---------- */
// Esther: the WEB prints the whole Greek Esther (ESG) with the additions in [square brackets]
const esgBrackets = [];
{
  let open = null;
  let buf = "";
  for (const [c, vs] of Object.entries(WEB.books.ESG)) {
    for (const [v, t] of Object.entries(vs)) {
      for (const ch of t) {
        if (ch === "[") {
          if (open) fail("nested bracket in Greek Esther");
          open = `${c}:${v}`;
          buf = "";
        } else if (ch === "]") {
          if (!open) fail("unopened bracket in Greek Esther");
          esgBrackets.push({ at: open, text: buf });
          open = null;
        } else if (open) buf += ch;
      }
      if (open) buf += " ";
    }
  }
  if (open) fail("an Esther addition never closes");
}
if (esgBrackets.length !== 5) fail(`expected 5 bracketed additions in the WEB's Greek Esther, got ${esgBrackets.length}`);
const estherAddWords = esgBrackets.reduce((n, b) => n + wtok(b.text).length, 0);
const godIn = (text) => tokens(text).filter((t) => ["god", "god's"].includes(t.toLowerCase())).length;
const lordIn = (text) => tokens(text).filter((t) => ["lord", "lord's"].includes(t.toLowerCase())).length;
const estherAddGod = esgBrackets.reduce((n, b) => n + godIn(b.text), 0);
const estherAddLord = esgBrackets.reduce((n, b) => n + lordIn(b.text), 0);
const hebrewEstherGod = {
  kjv: countForms("kjv", ["god", "god's", "lord", "lord's"], (r) => r.book === "Esther").total,
  web: countForms("web", ["god", "god's", "lord", "lord's"], (r) => r.book === "Esther").total,
};
if (hebrewEstherGod.kjv !== 0 || hebrewEstherGod.web !== 0) fail(`Hebrew Esther should never say God or Lord; KJV ${hebrewEstherGod.kjv}, WEB ${hebrewEstherGod.web}`);
const kjvRestOfEsther = stats(KJV.books.EsthGr);
mustX("kjv", "EsthGr", 10, 4, "Mardocheus");

const ADDITIONS = [
  { name: "Prayer of Azariah and Song of the Three", kjvName: "The Song of the Three Holy Children", web: "S3Y", kjv: "PrAzar", where: "Daniel 3, after verse 23", check: [["S3Y", 1, 2, "Azarias stood, and prayed"], ["PrAzar", 1, 2, "Azarias stood up, and prayed"]] },
  { name: "Susanna", kjvName: "The History of Susanna", web: "SUS", kjv: "Sus", where: "Daniel 13 in Catholic Bibles", check: [["SUS", 1, 2, "whose name was Susanna"], ["Sus", 1, 2, "Susanna"]] },
  { name: "Bel and the Dragon", kjvName: "Bel and the Dragon", web: "BEL", kjv: "Bel", where: "Daniel 14 in Catholic Bibles", check: [["BEL", 1, 3, "an idol, called Bel"], ["Bel", 1, 3, "Bel"]] },
];
const additions = [
  { name: "Additions to Esther", kjvName: "The Rest of Esther", where: "five passages; the WEB brackets them in " + esgBrackets.map((b) => b.at).join(", "), verses: null, versesKjv: kjvRestOfEsther.verses, words: estherAddWords, wordsKjv: kjvRestOfEsther.words, kjvChapters: "10:4 to 16:24" },
  ...ADDITIONS.map((a) => {
    mustX("web", ...a.check[0]);
    mustX("kjv", ...a.check[1]);
    const w = stats(WEB.books[a.web]);
    const k = stats(KJV.books[a.kjv]);
    const maxV = Math.max(...Object.keys(WEB.books[a.web][1]).map(Number));
    const empty = Object.values(WEB.books[a.web][1]).filter((t) => !t).length;
    const skipped = [];
    for (let v = 1; v <= maxV; v++) if (!WEB.books[a.web][1][v]) skipped.push(v);
    if (w.verses + skipped.length !== maxV) fail(`${a.name}: verse numbers do not add up`);
    return { name: a.name, kjvName: a.kjvName, where: a.where, verses: w.verses, versesNumbered: maxV, emptyMarkers: empty, skipped, versesKjv: k.verses, words: w.words, wordsKjv: k.words };
  }),
];
// the WEB places the Song after Daniel 3:23 and sets Susanna and Bel apart (its own introductions)
{
  const xml = fs.readFileSync(path.join(CACHE, "eng-web.usfx.xml"), "utf8");
  const s3y = xml.match(/<book id="S3Y">([\s\S]*?)<c id="1"\/>/)[1];
  if (!/third Chapter of DANIEL/.test(s3y) || !/Verse 23/.test(s3y)) fail("the WEB's note on where the Song of the Three goes has changed");
  const sus = xml.match(/<book id="SUS">([\s\S]*?)<c id="1"\/>/)[1];
  if (!/not in the Hebrew/.test(sus)) fail("the WEB's note on Susanna has changed");
}
if (KJV.books.Esth[10][4]) fail("the KJV's Hebrew Esther should end at 10:3");
if (Object.keys(KJV.books.Esth[10]).length !== 3) fail("Hebrew Esther 10 should have 3 verses in the KJV");
const addTotal = additions.reduce((n, a) => n + a.words, 0);
const addTotalKjv = additions.reduce((n, a) => n + a.wordsKjv, 0);

/* ---------- the owned stat: how long the Catholic extras are ---------- */
const extraWords = dt.words + addTotal;
const protestantWords = webOtWords + webNtWords;
const catholicWords = protestantWords + extraWords;
const pctOfNt = Math.round((extraWords / webNtWords) * 100);
const pctLonger = Math.round((extraWords / protestantWords) * 1000) / 10;
if (!(extraWords > 100000 && extraWords < webNtWords)) fail(`unexpected size of the deuterocanon: ${extraWords}`);

/* ---------- books beyond the Catholic 73 (Orthodox and the KJV Apocrypha), counted from the WEB ---------- */
// greek: the Greek Orthodox canon, per Wikipedia's "Biblical canon" table and OrthodoxWiki "Old Testament Canon" (read 2026-10-25)
const OTHER = [
  ["1 Esdras", "1ES", "1Esd", { catholic: false, greek: "yes", kjv: true }],
  ["Prayer of Manasseh", "MAN", "PrMan", { catholic: false, greek: "carried (Odes or appendix)", kjv: true }],
  ["Psalm 151", "PS2", null, { catholic: false, greek: "yes, with the Psalms", kjv: false }],
  ["3 Maccabees", "3MA", null, { catholic: false, greek: "yes", kjv: false }],
  ["4 Maccabees", "4MA", null, { catholic: false, greek: "appendix", kjv: false }],
  ["2 Esdras", "2ES", "2Esd", { catholic: false, greek: "no", kjv: true }],
];
const other = OTHER.map(([name, w, k, flags]) => {
  const s = stats(WEB.books[w]);
  if (!s?.words) fail(`${name} missing from the WEB`);
  return { name, ...flags, chapters: s.chapters, verses: s.verses, words: s.words, wordsKjv: k ? stats(KJV.books[k]).words : null };
});
mustX("web", "PS2", 151, 1, "I was small among my brothers");
mustX("web", "MAN", 1, 1, "O LORD Almighty");
mustX("web", "1ES", 1, 1, "Josias held the passover");

/* ---------- the KJV file: which Apocrypha it carries, and where ---------- */
const APOC_KJV = ["1Esd", "2Esd", "Tob", "Jdt", "EsthGr", "Wis", "Sir", "Bar", "EpJer", "PrAzar", "Sus", "Bel", "PrMan", "1Macc", "2Macc"];
const kjvIds66 = new Set(BOOKS.map((b) => b[2]));
const kjvExtra = KJV.order.filter((id) => !kjvIds66.has(id));
if (kjvExtra.length !== 15 || !APOC_KJV.every((id) => kjvExtra.includes(id))) fail(`unexpected KJV Apocrypha divisions: ${kjvExtra.join(", ")}`);
// counted as the 1611 contents list counts them, the Epistle of Jeremy inside Baruch (chapter 6): 14 books
const KJV_BOOKS = kjvExtra.length - 1;
if (KJV_BOOKS !== 14) fail("the KJV Apocrypha should count as 14 books with the Epistle of Jeremy inside Baruch");
const malIdx = KJV.order.indexOf("Mal");
const matIdx = KJV.order.indexOf("Matt");
if (!kjvExtra.every((id) => KJV.order.indexOf(id) > malIdx && KJV.order.indexOf(id) < matIdx)) fail("the KJV Apocrypha should sit between Malachi and Matthew");
if (!/1769/.test(KJV.description) || !/Apocrypha/.test(KJV.description)) fail(`the KJV file description changed: ${KJV.description}`);
const kjvApoc = add(...kjvExtra.map((id) => stats(KJV.books[id])));
const kjvApocCatholic = deutero.reduce((n, d) => n + d.wordsKjv, 0) + addTotalKjv;
const KJV_NAMES = {
  "1Esd": "1 Esdras", "2Esd": "2 Esdras", Tob: "Tobit", Jdt: "Judith", EsthGr: "The Rest of Esther", Wis: "The Wisdom of Solomon",
  Sir: "Ecclesiasticus", Bar: "Baruch (with the Epistle of Jeremy)", PrAzar: "The Song of the Three Holy Children", Sus: "Susanna",
  Bel: "Bel and the Dragon", PrMan: "The Prayer of Manasses", "1Macc": "1 Maccabees", "2Macc": "2 Maccabees",
};
const kjvList = kjvExtra.filter((id) => id !== "EpJer").map((id) => ({ id, name: KJV_NAMES[id], words: id === "Bar" ? stats(KJV.books.Bar).words + stats(KJV.books.EpJer).words : stats(KJV.books[id]).words }));
if (kjvList.length !== 14) fail("kjvList should have 14 rows");
// of the 14, the ones outside the Catholic 73
const NOT_CATHOLIC = ["1Esd", "2Esd", "PrMan"];
for (const id of NOT_CATHOLIC) if (!kjvList.some((b) => b.id === id)) fail(`${id} missing from the KJV Apocrypha`);
kjvList.forEach((b) => (b.catholic = !NOT_CATHOLIC.includes(b.id)));
const kjvCatholicRows = kjvList.filter((b) => b.catholic).length;
if (kjvCatholicRows !== 11) fail(`expected 11 KJV Apocrypha books to be Catholic deuterocanon or additions, got ${kjvCatholicRows}`);

/* ---------- verses quoted on the page ---------- */
const quotes = {
  sirach50: { web: mustX("web", "SIR", 50, 27, "Jesus, the son of Sirach"), kjv: mustX("kjv", "Sir", 50, 27, "Jesus the son of Sirach") },
  macc15: { web: mustX("web", "2MA", 15, 38, "if I have written well"), kjv: mustX("kjv", "2Macc", 15, 38, "if I have done well") },
};

writeList("how-many-books-are-in-the-catholic-bible", {
  generated: "2026-10-25",
  total: CATHOLIC_TOTAL,
  ot: CATHOLIC_OT.length,
  nt: NT27.length,
  protestant: { total: BOOKS.length, ot: OT66.length, nt: NT27.length },
  extra: CATHOLIC_TOTAL - BOOKS.length,
  catholicOt: CATHOLIC_OT.map(([name, section, proto], i) => ({ n: i + 1, name, section, deutero: !proto, protestantName: proto })),
  movedFromProtestantOrder: moved,
  deutero,
  deuteroTotal: dt,
  longest: { name: longest.name, words: longest.words, chapters: longest.chapters, verses: longest.verses, versesKjv: longest.versesKjv, rankAmong67: sirachRankAll },
  shortest: { name: shortest.name, words: shortest.words, chapters: shortest.chapters },
  sirachGaps: { kjvOnly: sirachGaps, webOnly: sirachExtraWeb },
  longestNt: ntByWords[0],
  additions,
  additionsTotal: { words: addTotal, wordsKjv: addTotalKjv },
  esther: { hebrewGodOrLord: hebrewEstherGod, additionsGod: estherAddGod, additionsLord: estherAddLord, greekWords: stats(WEB.books.ESG).words, hebrewWords: webBookWords.Esther, brackets: esgBrackets.map((b) => ({ at: b.at, words: wtok(b.text).length })) },
  words: {
    extraWeb: extraWords,
    ntWeb: webNtWords,
    otWeb: webOtWords,
    protestantWeb: protestantWords,
    catholicWeb: catholicWords,
    pctOfNt,
    pctLonger,
  },
  other,
  kjv: {
    description: KJV.description,
    divisions: kjvExtra.length,
    books: KJV_BOOKS,
    catholicRows: kjvCatholicRows,
    notCatholic: kjvList.filter((b) => !b.catholic).map((b) => b.name),
    list: kjvList,
    chapters: kjvApoc.chapters,
    verses: kjvApoc.verses,
    words: kjvApoc.words,
    wordsCatholicParts: kjvApocCatholic,
    words66: kjvOtWords + kjvNtWords,
  },
  quotes,
});

console.log("Catholic", CATHOLIC_TOTAL, "=", CATHOLIC_OT.length, "+", NT27.length, "| Protestant", BOOKS.length, "| moved:", moved.join(", "));
console.log("deutero:", deutero.map((d) => `${d.name} ${d.chapters}ch ${d.verses}v ${d.words}w (KJV ${d.wordsKjv})`).join("; "));
console.log("deutero total WEB", dt, "| additions", additions.map((a) => `${a.name} ${a.words}`).join(", "), "=", addTotal);
console.log(`extra ${extraWords} words = ${pctOfNt}% of NT ${webNtWords}; Catholic Bible ${catholicWords} vs 66 ${protestantWords} (+${pctLonger}%)`);
console.log("longest NT", ntByWords[0], "| Sirach rank among the 66 + Sirach:", sirachRankAll, "| Sirach gaps", sirachGaps.length, sirachExtraWeb.length);
console.log("Esther: Hebrew God/Lord", hebrewEstherGod, "additions God", estherAddGod, "Lord", estherAddLord);
console.log("KJV apocrypha", KJV_BOOKS, "books,", kjvApoc, "| other:", other.map((o) => `${o.name} ${o.words}`).join(", "));
