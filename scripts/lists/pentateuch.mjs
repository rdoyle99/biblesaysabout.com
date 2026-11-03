/* The Pentateuch: the five books of Moses (Genesis to Deuteronomy) with chapters, verses and words in the KJV and WEB
   (lib/data/bible-books.json), their share of the Old Testament and of the whole Bible, one key verse per book and the
   verses behind the Mosaic authorship tradition, each checked in BOTH translations, plus the "Moses" and "law of Moses"
   counts. A wrong verse, a missing needle or a total that does not add up stops the build.
   Writes lib/data/lists/pentateuch.json. Run: node scripts/lists/pentateuch.mjs */
import fs from "fs";
import path from "path";
import { root, kjv, web, must, mustWeb, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

const BOOKS_JSON = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-books.json"), "utf8"));
const PENT = new Set(["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]);

/** a verse the page quotes: the KJV and the WEB must both hold their needle */
function both(ref, kjvNeedle, webNeedle) {
  must(ref, kjvNeedle);
  mustWeb(ref, webNeedle);
  return { ref, kjv: kjv.get(ref), web: web.get(ref) };
}

// [book, Hebrew name (its opening word or phrase, transliterated), what it covers, key verse]
const LIST = [
  ["Genesis", "Bereshit", "In the beginning", "Creation, the flood, and the families of Abraham, Isaac, Jacob and Joseph, ending with Israel's sons in Egypt.",
    both("Genesis 1:1", "In the beginning God created the heaven and the earth", "In the beginning, God created the heavens and the earth")],
  ["Exodus", "Shemot", "Names", "Israel's slavery in Egypt, Moses, the plagues and the escape, the Ten Commandments at Sinai, and the building of the tabernacle.",
    both("Exodus 20:3", "Thou shalt have no other gods before me", "You shall have no other gods before me")],
  ["Leviticus", "Vayikra", "And he called", "The laws for offerings, priests, clean and unclean food, the Day of Atonement and holy living.",
    both("Leviticus 19:18", "thou shalt love thy neighbour as thyself", "you shall love your neighbor as yourself")],
  ["Numbers", "Bamidbar", "In the wilderness", "Two counts of the tribes, and the forty years between Sinai and the edge of Canaan.",
    both("Numbers 6:24", "The LORD bless thee, and keep thee", "Yahweh bless you, and keep you")],
  ["Deuteronomy", "Devarim", "Words", "Moses' farewell speeches on the plains of Moab, the law restated, and his death on Mount Nebo.",
    both("Deuteronomy 6:4", "Hear, O Israel: The LORD our God is one LORD", "Hear, Israel: Yahweh is our God. Yahweh is one")],
];

const ot = BOOKS_JSON.books.filter((b) => b.testament === "OT");
const all = BOOKS_JSON.books;
const sum = (rs, f) => rs.reduce((n, r) => n + f(r), 0);

const rows = LIST.map(([name, hebrew, hebrewMeaning, covers, key], i) => {
  const b = all.find((x) => x.name === name);
  if (!b) fail(`${name} not in bible-books.json`);
  if (b.order !== i + 1) fail(`${name} is book ${b.order}, expected ${i + 1}`);
  return {
    n: i + 1,
    name,
    slug: b.slug,
    hebrew,
    hebrewMeaning,
    covers,
    chapters: b.chapters,
    versesKjv: b.verses.kjv,
    versesWeb: b.verses.web,
    wordsKjv: b.words.kjv,
    wordsWeb: b.words.web,
    readingMinutes: b.readingMinutes,
    key,
  };
});

const T = {
  chapters: sum(rows, (r) => r.chapters),
  versesKjv: sum(rows, (r) => r.versesKjv),
  versesWeb: sum(rows, (r) => r.versesWeb),
  wordsKjv: sum(rows, (r) => r.wordsKjv),
  wordsWeb: sum(rows, (r) => r.wordsWeb),
  readingMinutes: sum(rows, (r) => r.readingMinutes),
};
const OT = {
  books: ot.length,
  chapters: sum(ot, (b) => b.chapters),
  versesKjv: sum(ot, (b) => b.verses.kjv),
  versesWeb: sum(ot, (b) => b.verses.web),
  wordsKjv: sum(ot, (b) => b.words.kjv),
  wordsWeb: sum(ot, (b) => b.words.web),
};
const BIBLE = {
  books: all.length,
  chapters: BOOKS_JSON.bible.kjv.chapters,
  versesKjv: BOOKS_JSON.bible.kjv.verses,
  versesWeb: BOOKS_JSON.bible.web.verses,
  wordsKjv: BOOKS_JSON.bible.kjv.words,
  wordsWeb: BOOKS_JSON.bible.web.words,
};
if (OT.books !== 39) fail(`expected 39 Old Testament books, got ${OT.books}`);
if (sum(all, (b) => b.words.kjv) !== BIBLE.wordsKjv) fail("book KJV words do not add up to the Bible total");
if (sum(all, (b) => b.verses.web) !== BIBLE.versesWeb) fail("book WEB verses do not add up to the Bible total");

const pct1 = (a, b) => Math.round((1000 * a) / b) / 10;
const share = {
  otWordsKjv: pct1(T.wordsKjv, OT.wordsKjv),
  otWordsWeb: pct1(T.wordsWeb, OT.wordsWeb),
  otVersesKjv: pct1(T.versesKjv, OT.versesKjv),
  otChapters: pct1(T.chapters, OT.chapters),
  bibleWordsKjv: pct1(T.wordsKjv, BIBLE.wordsKjv),
  bibleWordsWeb: pct1(T.wordsWeb, BIBLE.wordsWeb),
  bibleVersesKjv: pct1(T.versesKjv, BIBLE.versesKjv),
  bibleChapters: pct1(T.chapters, BIBLE.chapters),
};

// how many of the other 34 Old Testament books are longer than the shortest book of the five
const byWords = [...rows].sort((a, b) => b.wordsKjv - a.wordsKjv);
const shortestOfFive = byWords.at(-1);
const otRank = (name) => [...ot].sort((a, b) => b.words.kjv - a.words.kjv).findIndex((b) => b.name === name) + 1;

// the verses the Mosaic authorship tradition rests on, and the one the Talmud answers (Bava Batra 14b-15a)
const authorship = [
  both("Exodus 24:4", "Moses wrote all the words of the LORD", "Moses wrote all Yahweh's words"),
  both("Deuteronomy 31:9", "Moses wrote this law", "Moses wrote this law"),
  both("Nehemiah 8:1", "the book of the law of Moses", "the book of the law of Moses"),
  both("Mark 12:26", "in the book of Moses", "in the book of Moses"),
  both("Luke 24:44", "the law of Moses, and in the prophets, and in the psalms", "the law of Moses, the prophets, and the psalms"),
  both("John 1:17", "the law was given by Moses", "the law was given through Moses"),
];
const death = both("Deuteronomy 34:5", "So Moses the servant of the LORD died there", "So Moses the servant of Yahweh died there");
const deathEnd = { first: "Deuteronomy 34:5", last: "Deuteronomy 34:12" };
must("Deuteronomy 34:12", "Moses shewed in the sight of all Israel");
// Deuteronomy 34 has 12 verses; the Talmud's "last eight verses" are 34:5-12, from Moses' death on
const dt = all.find((b) => b.name === "Deuteronomy");
if (dt.perChapter[33] !== 12) fail(`Deuteronomy 34 has ${dt.perChapter[33]} verses, expected 12`);

// "Moses" in the five books and in the whole Bible; "law of Moses"
const inPent = (r) => PENT.has(r.book);
const moses = {
  kjv: countForms("kjv", ["moses"]),
  web: countForms("web", ["moses"]),
  kjvPent: countForms("kjv", ["moses"], inPent).total,
  webPent: countForms("web", ["moses"], inPent).total,
};
const lawOfMoses = {
  kjv: countPhrase("kjv", /law of Moses/g),
  web: countPhrase("web", /law of Moses/g),
};
if (moses.kjvPent > moses.kjv.total || moses.webPent > moses.web.total) fail("Moses count in the five books exceeds the Bible count");

writeList("pentateuch", {
  generated: "2026-11-02",
  rows,
  totals: T,
  ot: OT,
  bible: BIBLE,
  share,
  longest: { name: byWords[0].name, wordsKjv: byWords[0].wordsKjv, otRank: otRank(byWords[0].name) },
  shortest: { name: shortestOfFive.name, wordsKjv: shortestOfFive.wordsKjv, otRank: otRank(shortestOfFive.name) },
  authorship,
  death: { ...death, ...deathEnd, verses: 8 },
  moses: { kjv: moses.kjv.total, web: moses.web.total, kjvPent: moses.kjvPent, webPent: moses.webPent, topBook: moses.kjv.top.book, topCount: moses.kjv.top.count },
  lawOfMoses: { kjv: lawOfMoses.kjv.total, web: lawOfMoses.web.total, firstKjv: lawOfMoses.kjv.refs[0] },
});
