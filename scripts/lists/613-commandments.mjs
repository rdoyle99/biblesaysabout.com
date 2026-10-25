/* The 613 commandments: where Maimonides' list draws them from in the Torah, counted from the list's own references,
   set against the full KJV and WEB text. Every count of the 613 comes from parsing the list; every verse the page
   quotes or names is checked with must()/mustWeb(), and the build stops when a verse lacks the words a row relies on.

   Source list: scripts/lists/data/613-maimonides-wikipedia-2026-10-25.txt, the raw wikitext of the Wikipedia article
   "613 commandments" (https://en.wikipedia.org/wiki/613_commandments, read 2026-10-25), section "Maimonides' list /
   Canonical order": 613 rows, each `#{{bibleverse|Ex.|12:2|HE}} &mdash; description`. Only the references are used;
   the descriptions (CC BY-SA) are matched against, never written out. References are in Hebrew verse numbering (HE);
   16 rows of the Ten Commandments use another scheme (TLT) with a "Yemenite" alternative.

   The 248 positive / 365 negative split is not computed here: it is the Talmud's count (Makkot 23b, Rabbi Simlai),
   read from the Sefaria API on 2026-10-25 and stored as constants below.

   Writes lib/data/lists/613-commandments.json. Run: node scripts/lists/613-commandments.mjs */
import fs from "fs";
import path from "path";
import { kjv, must, mustWeb, countForms, countPhrase, verseRows, fail, writeList, root } from "../lib/list-helpers.mjs";

const SRC = "scripts/lists/data/613-maimonides-wikipedia-2026-10-25.txt";
const lines = fs.readFileSync(path.join(root, SRC), "utf8").split("\n");

// ---- parse the canonical-order section ----
const start = lines.findIndex((l) => l.startsWith("===Canonical order==="));
const end = lines.findIndex((l, i) => i > start && l.startsWith("|}"));
if (start < 0 || end < 0) fail("canonical order section not found");
const BOOK = { Gen: "Genesis", Ex: "Exodus", Lev: "Leviticus", Num: "Numbers", Deut: "Deuteronomy" };
const rows = [];
for (let i = start; i < end; i++) {
  const l = lines[i];
  if (!l.startsWith("#")) continue;
  const m = l.match(/^#\{\{bibleverse\|(Gen|Ex|Lev|Num|Deut)\.\|\|?(\d+):(\d+)(?:-(\d+))?\|(HE|TLT)\}\}/);
  if (!m) fail(`unparsed row at line ${i + 1}: ${l}`);
  const alt = l.match(/Yemenite→\{\{bibleverse\|\w+\.\|\|?(\d+):(\d+)\|HE\}\}/);
  rows.push({
    line: i + 1,
    book: BOOK[m[1]],
    ch: +m[2],
    v: +m[3],
    vEnd: m[4] ? +m[4] : +m[3],
    scheme: m[5],
    alt: alt ? { ch: +alt[1], v: +alt[2] } : null,
    desc: l.split("&mdash;")[1] || "", // matched only, never printed
  });
}
if (rows.length !== 613) fail(`expected 613 rows, parsed ${rows.length}`);
const tlt = rows.filter((r) => r.scheme === "TLT");
if (tlt.length !== 16) fail(`expected 16 TLT rows, got ${tlt.length}`);
if (tlt.some((r) => !r.alt)) fail("a TLT row lacks its Yemenite alternative");
if (tlt.some((r) => !((r.book === "Exodus" && r.ch === 20) || (r.book === "Deuteronomy" && r.ch === 5)))) fail("a TLT row outside Exodus 20 / Deuteronomy 5");

// ---- Hebrew to KJV numbering in the Torah ----
// Known chapter-boundary shifts; each is checked below against the KJV's own chapter lengths and a needle.
function heToKjv(book, ch, v) {
  const s = (c, n) => ({ ch: c, v: n });
  if (book === "Genesis" && ch === 32) return v === 1 ? s(31, 55) : s(32, v - 1);
  if (book === "Exodus" && ch === 7 && v >= 26) return s(8, v - 25);
  if (book === "Exodus" && ch === 8) return s(8, v + 4);
  if (book === "Exodus" && ch === 21 && v === 37) return s(22, 1);
  if (book === "Exodus" && ch === 22) return s(22, v + 1);
  if (book === "Leviticus" && ch === 5 && v >= 20) return s(6, v - 19);
  if (book === "Leviticus" && ch === 6) return s(6, v + 7);
  if (book === "Numbers" && ch === 17) return v <= 15 ? s(16, v + 35) : s(17, v - 15);
  if (book === "Numbers" && ch === 30) return v === 1 ? s(29, 40) : s(30, v - 1);
  if (book === "Deuteronomy" && ch === 13) return v === 1 ? s(12, 32) : s(13, v - 1);
  if (book === "Deuteronomy" && ch === 23) return v === 1 ? s(22, 30) : s(23, v - 1);
  if (book === "Deuteronomy" && ch === 28 && v === 69) return s(29, 1);
  if (book === "Deuteronomy" && ch === 29) return s(29, v + 1);
  return s(ch, v);
}
const KJV_LEN = [
  ["Genesis", 31, 55], ["Genesis", 32, 32], ["Exodus", 8, 32], ["Exodus", 22, 31], ["Leviticus", 5, 19], ["Leviticus", 6, 30],
  ["Numbers", 16, 50], ["Numbers", 17, 13], ["Numbers", 29, 40], ["Numbers", 30, 16], ["Deuteronomy", 12, 32], ["Deuteronomy", 13, 18],
  ["Deuteronomy", 22, 30], ["Deuteronomy", 23, 25], ["Deuteronomy", 29, 29],
];
for (const [b, c, n] of KJV_LEN) {
  const got = verseRows("kjv", b, c, c).length;
  if (got !== n) fail(`KJV ${b} ${c} has ${got} verses, the shift table assumes ${n}`);
}
// a needle at each shift the list actually uses
must("Genesis 32:32", "eat not of the sinew which shrank"); // HE 32:33
must("Exodus 22:1", "If a man shall steal an ox"); // HE 21:37
must("Leviticus 6:2", "lie unto his neighbour"); // HE 5:21
must("Numbers 30:2", "If a man vow a vow"); // HE 30:3
must("Deuteronomy 12:32", "thou shalt not add thereto, nor diminish from it"); // HE 13:1
must("Deuteronomy 22:30", "A man shall not take his father's wife"); // HE 23:1
must("Deuteronomy 23:18", "the hire of a whore"); // HE 23:19
must("Deuteronomy 23:21", "thou shalt not slack to pay it"); // HE 23:22

let shifted = 0;
for (const r of rows) {
  if (r.scheme === "TLT") {
    r.kjv = { ch: r.ch, v: null }; // chapter only: the verse depends on the scheme
    continue;
  }
  const k = heToKjv(r.book, r.ch, r.v);
  if (!kjv.get(`${r.book} ${k.ch}:${k.v}`)) fail(`${r.book} ${r.ch}:${r.v} (HE) maps to ${r.book} ${k.ch}:${k.v}, not in the KJV`);
  if (k.ch !== r.ch || k.v !== r.v) shifted += 1;
  r.kjv = k;
}

// ---- counts by book ----
const TORAH = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"];
const booksJson = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-books.json"), "utf8")).books;
const byBook = TORAH.map((name) => {
  const b = booksJson.find((x) => x.name === name);
  const rs = rows.filter((r) => r.book === name);
  const chCount = {};
  rs.forEach((r) => (chCount[r.kjv.ch] = (chCount[r.kjv.ch] || 0) + 1));
  const top = Object.entries(chCount).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0];
  return {
    name,
    slug: b.slug,
    count: rs.length,
    wordsKjv: b.words.kjv,
    chapters: b.chapters,
    chaptersWithAny: Object.keys(chCount).length,
    per1000: Math.round((rs.length / b.words.kjv) * 1000 * 10) / 10,
    topChapter: { ch: +top[0], count: top[1] },
  };
});
if (byBook.reduce((s, b) => s + b.count, 0) !== 613) fail("book counts do not sum to 613");
const shortest = [...byBook].sort((a, b) => a.wordsKjv - b.wordsKjv)[0];
const most = [...byBook].sort((a, b) => b.count - a.count)[0];
if (shortest.name !== "Leviticus" || most.name !== "Leviticus") fail("Leviticus is no longer both the shortest Torah book and the one with most commandments");
const torahWords = byBook.reduce((s, b) => s + b.wordsKjv, 0);
const torahChapters = byBook.reduce((s, b) => s + b.chapters, 0);
const chaptersWithAny = byBook.reduce((s, b) => s + b.chaptersWithAny, 0);

// ---- chapters with the most (KJV numbering) ----
const chMap = new Map();
for (const r of rows) {
  const key = `${r.book} ${r.kjv.ch}`;
  chMap.set(key, (chMap.get(key) || 0) + 1);
}
const order = (ref) => TORAH.indexOf(ref.replace(/ \d+$/, "")) * 1000 + +ref.match(/\d+$/)[0];
const ranked = [...chMap.entries()].sort((a, b) => b[1] - a[1] || order(a[0]) - order(b[0]));
const cutoff = ranked[9][1]; // the top 10, plus any chapter tied with the 10th
const topChapters = ranked
  .filter(([, n]) => n >= cutoff)
  .map(([ref, count]) => {
    const [book, ch] = [ref.replace(/ \d+$/, ""), +ref.match(/\d+$/)[0]];
    return { ref, book, ch, count, versesKjv: verseRows("kjv", book, ch, ch).length };
  });
// the Hebrew-numbered ranking, to say whether the shift changes the top 10
const heMap = new Map();
rows.forEach((r) => heMap.set(`${r.book} ${r.ch}`, (heMap.get(`${r.book} ${r.ch}`) || 0) + 1));
const topHebrew = [...heMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([ref, count]) => ({ ref, count }));

// Leviticus 19 in detail: distinct verses cited
const lev19 = rows.filter((r) => r.book === "Leviticus" && r.kjv.ch === 19);
const lev19Verses = new Set();
lev19.forEach((r) => {
  for (let v = r.v; v <= r.vEnd; v++) lev19Verses.add(v);
});
must("Leviticus 19:2", "Ye shall be holy: for I the LORD your God am holy");
must("Leviticus 19:18", "thou shalt love thy neighbour as thyself");
// what the page says each top chapter is about
must("Leviticus 19:9", "thou shalt not wholly reap the corners of thy field"); // gleaning
must("Leviticus 19:13", "the wages of him that is hired"); // wages
must("Leviticus 19:36", "Just balances, just weights"); // honest weights
must("Leviticus 19:32", "rise up before the hoary head"); // respect for the old
must("Leviticus 18:6", "None of you shall approach to any that is near of kin to him"); // forbidden unions
must("Leviticus 23:2", "the feasts of the LORD"); // calendar of feasts
must("Leviticus 25:4", "a sabbath of rest unto the land"); // sabbath year
must("Leviticus 25:10", "it shall be a jubile unto you"); // jubilee
must("Genesis 32:24", "there wrestled a man with him until the breaking of the day");
if (lev19.length < 1.9 * ranked[1][1]) fail("Leviticus 19 is no longer nearly twice the next chapter");
const steal = rows.filter((r) => r.book === "Leviticus" && r.ch === 19 && r.v === 11 && /steal/i.test(r.desc));
if (steal.length !== 1) fail("expected the property-theft row at Leviticus 19:11");
must("Leviticus 19:11", "Ye shall not steal");

// ---- the Ten Commandments in the list ----
const ex20 = rows.filter((r) => r.book === "Exodus" && r.ch === 20);
const deut5 = rows.filter((r) => r.book === "Deuteronomy" && r.ch === 5);
// a row belongs to the Ten Commandments passage when its verse (in either scheme) falls before the altar laws
const inDecalogue = (r) => (r.scheme === "TLT" ? r.v <= 15 && r.alt.v <= 14 : r.v <= 17);
const ex20Decalogue = ex20.filter(inDecalogue);
const ex20Altar = ex20.filter((r) => !inDecalogue(r));
// [our summary, KJV ref, needle, matcher on the list's own description]
const DECALOGUE = [
  ["Know that God exists", "Exodus 20:2", "I am the LORD thy God", /know there is a God/i],
  ["Have no other gods", "Exodus 20:3", "Thou shalt have no other gods before me", /other gods besides/i],
  ["Make no carved image", "Exodus 20:4", "any graven image", /graven image/i],
  ["Do not bow down to idols (two rows)", "Exodus 20:5", "Thou shalt not bow down thyself to them", /worship idols/i, 2],
  ["Do not take God's name in vain", "Exodus 20:7", "Thou shalt not take the name of the LORD thy God in vain", /in vain/i],
  ["Keep the Sabbath holy", "Exodus 20:8", "Remember the sabbath day, to keep it holy", /sanctify the day/i],
  ["Do no work on the Sabbath", "Exodus 20:10", "in it thou shalt not do any work", /seventh day/i],
  ["Honor father and mother", "Exodus 20:12", "Honour thy father and thy mother", /father or mother/i],
  ["Do not murder", "Exodus 20:13", "Thou shalt not kill", /^\s*Not to murder/i],
  ["Do not steal (read as kidnapping)", "Exodus 20:15", "Thou shalt not steal", /kidnap/i],
  ["Do not bear false witness", "Exodus 20:16", "Thou shalt not bear false witness", /testify falsely/i],
  ["Do not covet", "Exodus 20:17", "Thou shalt not covet", /covet/i],
];
const decalogue = DECALOGUE.map(([summary, ref, needle, re, n = 1]) => {
  must(ref, needle);
  const hits = ex20Decalogue.filter((r) => re.test(r.desc));
  if (hits.length !== n) fail(`Ten Commandments row "${summary}": expected ${n} list rows in Exodus 20, found ${hits.length}`);
  return { summary, ref, rows: n };
});
if (decalogue.reduce((s, d) => s + d.rows, 0) !== ex20Decalogue.length) fail("Exodus 20 rows not all accounted for");
must("Exodus 20:14", "Thou shalt not commit adultery");
const adultery = rows.filter((r) => /someone else's wife/i.test(r.desc));
if (adultery.length !== 1 || adultery[0].book !== "Leviticus" || adultery[0].ch !== 18 || adultery[0].v !== 20) fail("adultery row not at Leviticus 18:20");
must("Leviticus 18:20", "thou shalt not lie carnally with thy neighbour's wife");
if (deut5.length !== 1 || !/desire/i.test(deut5[0].desc)) fail("expected one Deuteronomy 5 row, on desire");
must("Deuteronomy 5:21", "Neither shalt thou desire thy neighbour's wife");
const ALTAR = [
  ["Make no figures of silver or gold beside God", "Exodus 20:23", "Ye shall not make with me gods of silver"],
  ["Build no altar of hewn stone", "Exodus 20:25", "thou shalt not build it of hewn stone"],
  ["Go up to the altar by no steps", "Exodus 20:26", "Neither shalt thou go up by steps unto mine altar"],
];
ALTAR.forEach(([, ref, n]) => must(ref, n));
if (ex20Altar.length !== ALTAR.length) fail(`expected ${ALTAR.length} altar rows in Exodus 20, got ${ex20Altar.length}`);

// ---- examples, in our own words; each must be a row of the list at that Hebrew reference ----
// [our summary, Hebrew ref as the list cites it, KJV ref, KJV needle]
const EXAMPLES = [
  ["Have children", "Genesis 1:28", "Genesis 1:28", "Be fruitful, and multiply"],
  ["Do not eat the sinew of the thigh", "Genesis 32:33", "Genesis 32:32", "eat not of the sinew which shrank"],
  ["Set the calendar by the new month", "Exodus 12:2", "Exodus 12:2", "This month shall be unto you the beginning of months"],
  ["Do not commit adultery", "Leviticus 18:20", "Leviticus 18:20", "thou shalt not lie carnally with thy neighbour's wife"],
  ["Do not hold back a worker's wages overnight", "Leviticus 19:13", "Leviticus 19:13", "the wages of him that is hired shall not abide with thee all night"],
  ["Do not trip up the blind", "Leviticus 19:14", "Leviticus 19:14", "nor put a stumblingblock before the blind"],
  ["Love your neighbor", "Leviticus 19:18", "Leviticus 19:18", "thou shalt love thy neighbour as thyself"],
  ["Rise for the elderly", "Leviticus 19:32", "Leviticus 19:32", "Thou shalt rise up before the hoary head"],
  ["Wear fringes on your garments", "Numbers 15:38", "Numbers 15:38", "fringes in the borders of their garments"],
  ["Love God", "Deuteronomy 6:5", "Deuteronomy 6:5", "thou shalt love the LORD thy God with all thine heart"],
  ["Bind the words on your hand and head", "Deuteronomy 6:8", "Deuteronomy 6:8", "bind them for a sign upon thine hand"],
  ["Write them on your doorposts", "Deuteronomy 6:9", "Deuteronomy 6:9", "write them upon the posts of thy house"],
  ["Put a railing around your roof", "Deuteronomy 22:8", "Deuteronomy 22:8", "make a battlement for thy roof"],
  ["Pay what you vowed", "Deuteronomy 23:22", "Deuteronomy 23:21", "thou shalt not slack to pay it"],
  ["Write out a Torah scroll", "Deuteronomy 31:19", "Deuteronomy 31:19", "write ye this song for you"],
];
const examples = EXAMPLES.map(([summary, heRef, kjvRef, needle]) => {
  const m = heRef.match(/^(.+) (\d+):(\d+)$/);
  const hit = rows.find((r) => r.book === m[1] && r.ch === +m[2] && r.v <= +m[3] && r.vEnd >= +m[3] && r.scheme === "HE");
  if (!hit) fail(`no list row at ${heRef} (HE)`);
  const k = heToKjv(m[1], +m[2], +m[3]);
  if (`${m[1]} ${k.ch}:${k.v}` !== kjvRef) fail(`${heRef} (HE) maps to ${m[1]} ${k.ch}:${k.v}, example says ${kjvRef}`);
  must(kjvRef, needle);
  return { summary, heRef, kjvRef, quote: needle };
});
if (examples.length > 15) fail("keep examples to 15 or fewer");
const first = rows[0];
const last = rows[rows.length - 1];
if (`${first.book} ${first.ch}:${first.v}` !== "Genesis 1:28") fail("first row is not Genesis 1:28");
if (`${last.book} ${last.ch}:${last.v}` !== "Deuteronomy 32:38") fail(`last row is ${last.book} ${last.ch}:${last.v}`);
must("Deuteronomy 32:38", "drank the wine of their drink offerings");

// ---- the traditional count: Talmud, Makkot 23b-24a (Sefaria API, William Davidson Edition English, read 2026-10-25) ----
// "Rabbi Simlai taught: There were 613 mitzvot stated to Moses in the Torah, consisting of 365 prohibitions corresponding
//  to the number of days in the solar year, and 248 positive mitzvot corresponding to the number of a person's limbs."
const TALMUD = { total: 613, negative: 365, positive: 248, torahGematria: 611, fromGod: 2 };
if (TALMUD.positive + TALMUD.negative !== TALMUD.total) fail("248 + 365 should be 613");
if (TALMUD.torahGematria + TALMUD.fromGod !== TALMUD.total) fail("611 + 2 should be 613");
// Torah in Hebrew letters: tav 400, vav 6, resh 200, he 5
if (400 + 6 + 200 + 5 !== TALMUD.torahGematria) fail("Torah gematria");
must("Deuteronomy 33:4", "Moses commanded us a law, even the inheritance of the congregation of Jacob");
// Rabbi Simlai's reductions (Makkot 24a), each verse checked in the KJV
const REDUCTIONS = [
  ["David", "Psalm 15", 11, "Psalms 15:1", "LORD, who shall abide in thy tabernacle?"],
  ["Isaiah", "Isaiah 33:15", 6, "Isaiah 33:15", "He that walketh righteously, and speaketh uprightly"],
  ["Micah", "Micah 6:8", 3, "Micah 6:8", "to do justly, and to love mercy, and to walk humbly with thy God"],
  ["Isaiah", "Isaiah 56:1", 2, "Isaiah 56:1", "Keep ye judgment, and do justice"],
  ["Amos", "Amos 5:4", 1, "Amos 5:4", "Seek ye me, and ye shall live"],
  ["Habakkuk", "Habakkuk 2:4", 1, "Habakkuk 2:4", "the just shall live by his faith"],
];
const reductions = REDUCTIONS.map(([who, ref, n, checkRef, needle]) => ({ who, ref, n, quote: must(checkRef, needle) && needle }));
must("Psalms 15:5", "He that doeth these things shall never be moved");
must("Romans 1:17", "The just shall live by faith");

// ---- what the Bible itself counts ----
const torahOnly = (r) => r.bi < 5;
const words = {
  commandKjv: countForms("kjv", ["commandment", "commandments"]),
  commandWeb: countForms("web", ["commandment", "commandments"]),
  commandKjvTorah: countForms("kjv", ["commandment", "commandments"], torahOnly),
  commandWebTorah: countForms("web", ["commandment", "commandments"], torahOnly),
  commandmentsKjv: countForms("kjv", ["commandments"]),
  six13Kjv: countPhrase("kjv", /six hundred (and )?thirteen/gi),
  six13Web: countPhrase("web", /six hundred (and )?thirteen/gi),
  tenCommandmentsKjv: countPhrase("kjv", /ten commandments/gi),
  tenCommandmentsWeb: countPhrase("web", /ten commandments/gi),
};
if (words.six13Kjv.total || words.six13Web.total) fail(`"six hundred thirteen" found: ${words.six13Kjv.refs} ${words.six13Web.refs}`);
const TEN = [
  ["Exodus 34:28", "the ten commandments", "the ten commandments"],
  ["Deuteronomy 4:13", "even ten commandments", "the ten commandments"],
  ["Deuteronomy 10:4", "the ten commandments", "the ten commandments"],
];
must("Deuteronomy 4:13", "he declared unto you his covenant, which he commanded you to perform, even ten commandments; and he wrote them upon two tables of stone");
TEN.forEach(([ref, k, w]) => {
  must(ref, k);
  mustWeb(ref, w);
});
if (words.tenCommandmentsKjv.refs.join("|") !== TEN.map((t) => t[0]).join("|")) fail(`"ten commandments" KJV verses: ${words.tenCommandmentsKjv.refs}`);
if (words.tenCommandmentsWeb.refs.join("|") !== TEN.map((t) => t[0]).join("|")) fail(`"ten commandments" WEB verses: ${words.tenCommandmentsWeb.refs}`);

const nt = {
  great: must("Matthew 22:36", "which is the great commandment in the law"),
  first: must("Matthew 22:37", "Thou shalt love the Lord thy God with all thy heart"),
  second: must("Matthew 22:39", "Thou shalt love thy neighbour as thyself"),
  hang: must("Matthew 22:40", "On these two commandments hang all the law and the prophets"),
  acts28: must("Acts 15:28", "to lay upon you no greater burden than these necessary things"),
  acts29: must("Acts 15:29", "abstain from meats offered to idols, and from blood, and from things strangled, and from fornication"),
  rom9: must("Romans 13:9", "Thou shalt not commit adultery, Thou shalt not kill, Thou shalt not steal", "Thou shalt not covet", "Thou shalt love thy neighbour as thyself"),
  rom10: must("Romans 13:10", "love is the fulfilling of the law"),
};
mustWeb("Matthew 22:40", "These two commandments");
must("Deuteronomy 6:4", "Hear, O Israel: The LORD our God is one LORD");

writeList("613-commandments", {
  generated: "2026-10-25",
  source: { file: SRC, url: "https://en.wikipedia.org/wiki/613_commandments", read: "2026-10-25" },
  total: rows.length,
  talmud: TALMUD,
  byBook,
  torahWords,
  torahChapters,
  chaptersWithAny,
  shifted,
  tltRows: tlt.length,
  topChapters,
  topHebrew,
  lev19: { count: lev19.length, versesCited: lev19Verses.size, versesKjv: verseRows("kjv", "Leviticus", 19, 19).length },
  ten: { ex20: ex20.length, ex20Decalogue: ex20Decalogue.length, ex20Altar: ex20Altar.length, deut5: deut5.length, decalogue, altar: ALTAR.map(([summary, ref]) => ({ summary, ref })) },
  examples,
  first: { ref: "Genesis 1:28" },
  last: { ref: "Deuteronomy 32:38" },
  reductions,
  words: {
    commandKjv: words.commandKjv.total,
    commandKjvVerses: words.commandKjv.verses,
    commandKjvTop: words.commandKjv.top,
    commandWeb: words.commandWeb.total,
    commandKjvTorah: words.commandKjvTorah.total,
    commandWebTorah: words.commandWebTorah.total,
    commandmentsKjv: words.commandmentsKjv.total,
    six13Kjv: words.six13Kjv.total,
    six13Web: words.six13Web.total,
    tenCommandmentsKjv: words.tenCommandmentsKjv.refs,
    tenCommandmentsWeb: words.tenCommandmentsWeb.refs,
  },
  checks: Object.keys(nt),
});

console.log("rows", rows.length, "| TLT", tlt.length, "| refs that shift HE->KJV", shifted);
console.log("by book:", byBook.map((b) => `${b.name} ${b.count} (${b.per1000}/1k words, top ch ${b.topChapter.ch}: ${b.topChapter.count}, ${b.chaptersWithAny}/${b.chapters} ch)`).join("; "));
console.log("top chapters (KJV):", topChapters.map((c) => `${c.ref} ${c.count}/${c.versesKjv}v`).join(", "));
console.log("top chapters (HE):", topHebrew.map((c) => `${c.ref} ${c.count}`).join(", "));
console.log("Lev 19:", lev19.length, "rows from", lev19Verses.size, "of", verseRows("kjv", "Leviticus", 19, 19).length, "verses");
console.log("Exodus 20:", ex20.length, "=", ex20Decalogue.length, "Ten Commandments +", ex20Altar.length, "altar | Deut 5:", deut5.length);
console.log("commandment(s) KJV", words.commandKjv.total, "in", words.commandKjv.verses, "verses, top", words.commandKjv.top, "| WEB", words.commandWeb.total);
console.log("Torah only: KJV", words.commandKjvTorah.total, "WEB", words.commandWebTorah.total, "| 'commandments' KJV", words.commandmentsKjv.total);
console.log("'six hundred thirteen':", words.six13Kjv.total, words.six13Web.total, "| 'ten commandments' KJV", words.tenCommandmentsKjv.refs, "WEB", words.tenCommandmentsWeb.refs);
console.log("Torah words", torahWords, "chapters", torahChapters, "with a commandment", chaptersWithAny);
