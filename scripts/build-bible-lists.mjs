#!/usr/bin/env node
/**
 * Four list pages counted from the full KJV and WEB text (.cache/bible via scripts/lib/bible-source.mjs):
 * fruit of the Spirit, the armor of God, the twelve tribes of Israel and the ten plagues of Egypt.
 *
 *   node scripts/build-bible-lists.mjs     # writes lib/data/bible-lists.json
 *
 * Every claim that names a verse is checked against that verse's KJV text (and the WEB text where a column shows it);
 * the script stops if a word is missing, so a table cannot drift from the Bible it cites. Numbers are never typed in:
 * word counts are token counts, census figures are parsed out of the verse's spelled-out number.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const kjv = await loadBible("kjv");
const web = await loadBible("web");
const DATE = "2026-10-24";

const norm = (t) => t.replace(/[’‘]/g, "'");
const tokens = (t) => norm(t).toLowerCase().match(/[a-z]+(?:'[a-z]+)*/g) || [];
const fail = (msg) => {
  console.error("BUILD STOPPED: " + msg);
  process.exit(1);
};

/** every verse of a translation in canonical order: { book, bi, ch, v, ref, text } */
function flatten(bible) {
  const rows = [];
  bible.books.forEach((b, bi) => {
    b.chapters.forEach((vs, ch) => {
      if (!vs) return;
      vs.forEach((text, v) => {
        if (text) rows.push({ book: BOOKS[bi][0], bi, ch, v, ref: `${BOOKS[bi][0]} ${ch}:${v}`, text });
      });
    });
  });
  return rows;
}
const ROWS = { kjv: flatten(kjv), web: flatten(web) };
const BIBLE = { kjv, web };

/** verse-level check: the reference's KJV text must contain every needle */
function must(ref, ...needles) {
  const text = norm(kjv.get(ref) || "");
  if (!text) fail(`${ref} not found in the KJV`);
  for (const n of needles) if (!text.toLowerCase().includes(norm(n).toLowerCase())) fail(`${ref} (KJV) lacks "${n}": ${text}`);
  return kjv.get(ref);
}
function mustWeb(ref, ...needles) {
  const text = norm(web.get(ref) || "");
  if (!text) fail(`${ref} not found in the WEB`);
  for (const n of needles) if (!text.toLowerCase().includes(norm(n).toLowerCase())) fail(`${ref} (WEB) lacks "${n}": ${text}`);
  return web.get(ref);
}
const words = (ref, id = "kjv") => tokens(BIBLE[id].get(ref) || "").length;

/** count whole-word forms: total, verses and books holding them, the book with most, the first verse */
function countForms(id, forms) {
  const set = new Set(forms.map((f) => f.toLowerCase()));
  let total = 0;
  let verses = 0;
  const byBook = new Map();
  let first = null;
  for (const r of ROWS[id]) {
    const n = tokens(r.text).filter((t) => set.has(t)).length;
    if (!n) continue;
    total += n;
    verses += 1;
    byBook.set(r.book, (byBook.get(r.book) || 0) + n);
    first ||= r.ref;
  }
  const top = [...byBook.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const tied = [...byBook.entries()].filter(([, n]) => n === top[1]).map(([b]) => b);
  return { total, verses, books: byBook.size, top: { book: top[0], count: top[1], tied }, first };
}
/** count a phrase (regex over normalised verse text), with the verse list */
function countPhrase(id, re) {
  let total = 0;
  const refs = [];
  for (const r of ROWS[id]) {
    const m = norm(r.text).match(re);
    if (m) {
      total += m.length;
      refs.push(r.ref);
    }
  }
  return { total, refs };
}

// ---------------------------------------------------------------- spelled-out numbers (KJV and WEB)
const UNITS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, threescore: 60, fourscore: 80 };
function parseSpelled(phrase) {
  const ts = phrase.toLowerCase().replace(/-/g, " ").split(/\s+/).filter((t) => t && t !== "and");
  let total = 0;
  let cur = 0;
  for (const t of ts) {
    if (UNITS[t]) cur += UNITS[t];
    else if (TENS[t]) cur += TENS[t];
    else if (t === "a") cur += 0;
    else if (t === "hundred") cur = (cur || 1) * 100;
    else if (t === "thousand") {
      total += (cur || 1) * 1000;
      cur = 0;
    } else return NaN;
  }
  return total + cur;
}
/** the figure a census verse gives: the words between "were" and the end, e.g. "forty and six thousand and five hundred" */
function censusFigure(text) {
  const re = /((?:(?:and|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|threescore|fourscore|hundred|thousand)[\s-]*)+)$/i;
  for (const sent of norm(text).split(/\.\s+/)) {
    const m = sent.replace(/\.$/, "").match(re);
    if (m && /thousand/i.test(m[1])) return parseSpelled(m[1]);
  }
  const mid = norm(text).match(/\bwere ((?:(?:and|a|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|threescore|fourscore|hundred|thousand)[\s-]*)+)[,.]/i);
  return mid && /thousand/i.test(mid[1]) ? parseSpelled(mid[1]) : NaN;
}

// ---------------------------------------------------------------- 1. fruit of the Spirit
const FRUIT = [
  { kjv: "love", web: "love", greek: "ἀγάπη", translit: "agapē" },
  { kjv: "joy", web: "joy", greek: "χαρά", translit: "chara" },
  { kjv: "peace", web: "peace", greek: "εἰρήνη", translit: "eirēnē" },
  { kjv: "longsuffering", web: "patience", greek: "μακροθυμία", translit: "makrothymia" },
  { kjv: "gentleness", web: "kindness", greek: "χρηστότης", translit: "chrēstotēs" },
  { kjv: "goodness", web: "goodness", greek: "ἀγαθωσύνη", translit: "agathōsynē" },
  { kjv: "faith", web: "faith", greek: "πίστις", translit: "pistis" },
  { kjv: "meekness", web: "gentleness", greek: "πραΰτης", translit: "prautēs" },
  { kjv: "temperance", web: "self-control", greek: "ἐγκράτεια", translit: "enkrateia" },
];
const fruitKjvText = must("Galatians 5:22-23", "love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance").replace(", Meekness,", ", meekness,"); // verse 23 starts with a capital; joined, it is mid-sentence
const fruitWebText = mustWeb("Galatians 5:22-23", "love, joy, peace, patience, kindness, goodness, faith, gentleness");
mustWeb("Galatians 5:22-23", "self-control");
const fruit = FRUIT.map((f, i) => {
  const k = countForms("kjv", [f.kjv]);
  const w = f.web.includes("-") ? (() => {
    const c = countPhrase("web", new RegExp(`\\b${f.web}\\b`, "gi"));
    return { total: c.total, verses: c.refs.length, books: 0, top: { book: null, count: 0 }, first: c.refs[0] };
  })() : countForms("web", [f.web]);
  return { n: i + 1, ...f, kjvCount: k, webCount: w };
});
const phraseFruit = { kjv: countPhrase("kjv", /fruit of the spirit/gi), web: countPhrase("web", /fruit of the spirit/gi) };
const splitList = (text, after, before) => {
  const t = norm(text);
  const s = t.indexOf(after) + after.length;
  const e = t.indexOf(before, s);
  return t.slice(s, e).split(/[,;:]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
};
const worksKjv = splitList(must("Galatians 5:19-21", "Adultery", "revellings"), "which are these;", ", and such like");
const worksWeb = splitList(mustWeb("Galatians 5:19-21", "adultery", "orgies"), "which are:", ", and things like these");
if (worksKjv.length !== 17 || worksWeb.length !== 17) fail(`works of the flesh: expected 17 and 17, got ${worksKjv.length} and ${worksWeb.length}`);
must("Ephesians 5:9", "fruit of the Spirit", "goodness and righteousness and truth");
must("1 Corinthians 13:13", "faith, hope, charity");

// ---------------------------------------------------------------- 2. the armor of God
const ARMOR = [
  { piece: "Belt of truth", ref: "Ephesians 6:14", kjvPhrase: "loins girt about with truth", webPhrase: "belt of truth", forms: ["girdle", "girdles"], noun: "girdle" },
  { piece: "Breastplate of righteousness", ref: "Ephesians 6:14", kjvPhrase: "breastplate of righteousness", webPhrase: "breastplate of righteousness", forms: ["breastplate", "breastplates"], noun: "breastplate" },
  { piece: "Shoes of the gospel of peace", ref: "Ephesians 6:15", kjvPhrase: "feet shod with the preparation of the gospel of peace", webPhrase: "feet with the preparation of the Good News of peace", forms: ["shoe", "shoes"], noun: "shoe" },
  { piece: "Shield of faith", ref: "Ephesians 6:16", kjvPhrase: "shield of faith", webPhrase: "shield of faith", forms: ["shield", "shields"], noun: "shield" },
  { piece: "Helmet of salvation", ref: "Ephesians 6:17", kjvPhrase: "helmet of salvation", webPhrase: "helmet of salvation", forms: ["helmet", "helmets"], noun: "helmet" },
  { piece: "Sword of the Spirit", ref: "Ephesians 6:17", kjvPhrase: "sword of the Spirit, which is the word of God", webPhrase: "sword of the Spirit, which is the word of God", forms: ["sword", "swords"], noun: "sword" },
];
const armor = ARMOR.map((a, i) => {
  must(a.ref, a.kjvPhrase);
  mustWeb(a.ref, a.webPhrase);
  return { n: i + 1, ...a, kjv: countForms("kjv", a.forms) };
});
must("Ephesians 6:11", "whole armour of God");
must("Ephesians 6:18", "Praying always");
must("Exodus 28:15", "breastplate of judgment");
must("Genesis 15:1", "I am thy shield");
must("1 Samuel 17:5", "helmet of brass");
must("Genesis 3:24", "flaming sword");
const armorPhrase = { kjv: countPhrase("kjv", /whole armou?r of god/gi), web: countPhrase("web", /whole armou?r of god/gi) };
const armourWord = { kjv: countForms("kjv", ["armour", "armours"]), web: countForms("web", ["armor", "armors"]) };
const armorXref = [
  { ref: "Isaiah 59:17", note: "The LORD puts on righteousness as a breastplate and a helmet of salvation.", needles: ["breastplate", "helmet of salvation"] },
  { ref: "1 Thessalonians 5:8", note: "Paul's breastplate is faith and love, and the helmet is the hope of salvation.", needles: ["breastplate of faith and love", "helmet", "hope of salvation"] },
  { ref: "2 Corinthians 6:7", note: "The armour of righteousness on the right hand and on the left.", needles: ["armour of righteousness"] },
  { ref: "Romans 13:12", note: "The armour of light, put on in place of the works of darkness.", needles: ["armour of light"] },
  { ref: "Hebrews 4:12", note: "The word of God is sharper than any twoedged sword, the same pair the armor passage joins.", needles: ["word of God", "twoedged sword"] },
].map((x) => ({ ...x, kjvText: must(x.ref, ...x.needles), webText: web.get(x.ref) }));

// ---------------------------------------------------------------- 3. the twelve tribes
// [slug, KJV name, mother, birth verse, blessing in Genesis 49, census verse in Numbers 1, census verse in Numbers 26]
const SONS = [
  ["reuben", "Reuben", "Leah", "Genesis 29:32", "Genesis 49:3-4", "Numbers 1:21", "Numbers 26:7"],
  ["simeon", "Simeon", "Leah", "Genesis 29:33", "Genesis 49:5-7", "Numbers 1:23", "Numbers 26:14"],
  ["levi", "Levi", "Leah", "Genesis 29:34", "Genesis 49:5-7", null, null],
  ["judah", "Judah", "Leah", "Genesis 29:35", "Genesis 49:8-12", "Numbers 1:27", "Numbers 26:22"],
  ["dan", "Dan", "Bilhah", "Genesis 30:6", "Genesis 49:16-18", "Numbers 1:39", "Numbers 26:43"],
  ["naphtali", "Naphtali", "Bilhah", "Genesis 30:8", "Genesis 49:21", "Numbers 1:43", "Numbers 26:50"],
  ["gad", "Gad", "Zilpah", "Genesis 30:11", "Genesis 49:19", "Numbers 1:25", "Numbers 26:18"],
  ["asher", "Asher", "Zilpah", "Genesis 30:13", "Genesis 49:20", "Numbers 1:41", "Numbers 26:47"],
  ["issachar", "Issachar", "Leah", "Genesis 30:18", "Genesis 49:14-15", "Numbers 1:29", "Numbers 26:25"],
  ["zebulun", "Zebulun", "Leah", "Genesis 30:20", "Genesis 49:13", "Numbers 1:31", "Numbers 26:27"],
  ["joseph", "Joseph", "Rachel", "Genesis 30:24", "Genesis 49:22-26", null, null],
  ["benjamin", "Benjamin", "Rachel", "Genesis 35:18", "Genesis 49:27", "Numbers 1:37", "Numbers 26:41"],
];
const JOSEPH_SONS = [
  ["ephraim", "Ephraim", "Genesis 41:52", "Numbers 1:33", "Numbers 26:37"],
  ["manasseh", "Manasseh", "Genesis 41:51", "Numbers 1:35", "Numbers 26:34"],
];
const KJV_REV = { Juda: "Judah", Aser: "Asher", Nepthalim: "Naphtali", Manasses: "Manasseh", Zabulon: "Zebulun" };
const tribeOf = (name, id = "kjv") => {
  const c = countPhrase(id, new RegExp(`\\btribes? of (?:the (?:children|sons) of )?${name}\\b`, "gi"));
  return c.total;
};
const censusParse = (ref, name) => {
  const k = kjv.get(ref);
  const m = ref.match(/^(.+ \d+):(\d+)$/);
  const around = [0, 1, 2].map((d) => kjv.get(`${m[1]}:${+m[2] - d}`) || "").join(" ");
  if (name !== "numbered" && name !== "Levites" && !around.toLowerCase().includes(name.toLowerCase())) fail(`${ref} and the two verses before it never name ${name}`);
  const a = censusFigure(k);
  const b = censusFigure(web.get(ref));
  if (!Number.isFinite(a)) fail(`could not read the figure in ${ref} (KJV): ${k}`);
  if (a !== b) fail(`KJV and WEB disagree on ${ref}: ${a} vs ${b}`);
  return a;
};
let sum1 = 0;
let sum2 = 0;
const tribeRows = [];
for (const [slug, name, mother, birth, blessing, c1, c2] of SONS) {
  must(birth, name === "Benjamin" ? "Benjamin" : name);
  must(blessing.split("-")[0].replace(/:\d+$/, ":" + blessing.split(":")[1].split("-")[0]), name === "Simeon" || name === "Levi" ? "Simeon and Levi" : name);
  const row = { slug, name, mother, birth, blessing, tribeOfKjv: tribeOf(name) };
  if (c1) {
    row.census1 = censusParse(c1, name);
    row.census2 = censusParse(c2, name);
    row.census1Ref = c1;
    row.census2Ref = c2;
  }
  tribeRows.push(row);
}
const joseph = tribeRows.find((r) => r.slug === "joseph");
const josephSons = JOSEPH_SONS.map(([slug, name, birth, c1, c2]) => {
  must(birth, name);
  const row = { slug, name, birth, tribeOfKjv: tribeOf(name), census1: censusParse(c1, name), census2: censusParse(c2, name), census1Ref: c1, census2Ref: c2 };
  return row;
});
for (const r of tribeRows) if (r.census1) { sum1 += r.census1; sum2 += r.census2; }
for (const r of josephSons) { sum1 += r.census1; sum2 += r.census2; }
const total1 = censusParse("Numbers 1:46", "numbered");
const total2 = censusParse("Numbers 26:51", "numbered");
if (sum1 !== total1) fail(`Numbers 1 tribes add to ${sum1}, the verse says ${total1}`);
if (sum2 !== total2) fail(`Numbers 26 tribes add to ${sum2}, the verse says ${total2}`);
const levites1 = censusParse("Numbers 3:39", "Levites");
const levites2 = censusParse("Numbers 26:62", "numbered");
must("Genesis 35:22", "sons of Jacob were twelve");
must("Genesis 48:5", "Ephraim and Manasseh", "mine");
must("Numbers 1:49", "Levi");
must("Numbers 1:47", "Levites");
must("Joshua 14:4", "children of Joseph were two tribes", "Manasseh and Ephraim");
must("Joshua 13:14", "tribe of Levi he gave none inheritance");
must("1 Kings 12:20", "none that followed the house of David, but the tribe of Judah only");
must("1 Kings 12:21", "house of Judah", "tribe of Benjamin");
must("2 Kings 17:6", "king of Assyria took Samaria", "carried Israel away");
must("2 Kings 17:18", "none left but the tribe of Judah only");
must("1 Kings 11:31", "ten tribes");
const tenTribes = { kjv: countPhrase("kjv", /\bten tribes\b/gi), web: countPhrase("web", /\bten tribes\b/gi) };
const lostTribes = { kjv: countPhrase("kjv", /\blost tribes\b/gi), web: countPhrase("web", /\blost tribes\b/gi) };
// Revelation 7 reads: the tribes sealed, in order, and who is missing
const revText = kjv.get("Revelation 7:5-8");
const revList = [...norm(revText).matchAll(/tribe of (\w+) were sealed/g)].map((m) => KJV_REV[m[1]] || m[1]);
if (revList.length !== 12) fail("Revelation 7:5-8 should list 12 tribes, found " + revList.length);
const allNames = [...SONS.map((s) => s[1]), "Ephraim", "Manasseh"];
const revMissing = allNames.filter((n) => !revList.includes(n));
must("Revelation 7:4", "hundred and forty and four thousand");
// Numbers 1 order
const num1Order = [];
for (let v = 5; v <= 15; v++) num1Order.push(norm(kjv.get(`Numbers 1:${v}`)));
const censusOrderFirst = "Reuben,Simeon,Gad,Judah,Issachar,Zebulun,Ephraim,Manasseh,Benjamin,Dan,Asher,Naphtali";
const censusOrderNum1 = [1, 2, 3, 4].length && tribeRows.length ? censusOrderFirst.split(",") : [];
// verify the order of the Numbers 1 census by verse number
const n1 = [...tribeRows.filter((r) => r.census1), ...josephSons].sort((a, b) => Number(a.census1Ref.split(":")[1]) - Number(b.census1Ref.split(":")[1])).map((r) => r.name);
if (n1.join(",") !== censusOrderFirst) fail("Numbers 1 order changed: " + n1.join(","));
const tribesSummary = {
  tenTribes,
  lostTribes,
  sons: 12,
  total1,
  total2,
  levites1,
  levites2,
  change: total2 - total1,
  changePct: Number((((total2 - total1) / total1) * 100).toFixed(2)),
  revList,
  revMissing,
  tribeNames: allNames.length,
};

// ---------------------------------------------------------------- 4. the ten plagues
// [number, name, KJV label, passage parts, warning phrase (null = none), who hardened, magicians, Goshen, phrase to check in the first verse]
const PL = [
  { n: 1, name: "Water to blood", kjvName: "blood", parts: ["Exodus 7:14-25"], warned: ["Exodus 7:15", "Get thee unto Pharaoh in the morning"], begins: "river", key: ["Exodus 7:20", "all the waters that were in the river were turned to blood"], magicians: ["Exodus 7:22", "magicians of Egypt did so"], harden: ["Exodus 7:22", "Pharaoh's heart was hardened", "unspecified"], goshen: null },
  { n: 2, name: "Frogs", kjvName: "frogs", parts: ["Exodus 8:1-15"], warned: ["Exodus 8:1", "Go unto Pharaoh"], begins: "palace", key: ["Exodus 8:6", "frogs came up, and covered the land of Egypt"], magicians: ["Exodus 8:7", "magicians did so with their enchantments"], harden: ["Exodus 8:15", "he hardened his heart", "Pharaoh"], goshen: null },
  { n: 3, name: "Lice", kjvName: "lice", parts: ["Exodus 8:16-19"], warned: null, key: ["Exodus 8:17", "all the dust of the land became lice"], magicians: ["Exodus 8:18", "they could not"], harden: ["Exodus 8:19", "Pharaoh's heart was hardened", "unspecified"], goshen: null },
  { n: 4, name: "Flies", kjvName: "swarms of flies", parts: ["Exodus 8:20-32"], warned: ["Exodus 8:20", "Rise up early in the morning"], begins: "river", key: ["Exodus 8:24", "grievous swarm of flies"], magicians: null, harden: ["Exodus 8:32", "Pharaoh hardened his heart", "Pharaoh"], goshen: ["Exodus 8:22", "sever in that day the land of Goshen"] },
  { n: 5, name: "Livestock disease", kjvName: "murrain", webName: "pestilence", parts: ["Exodus 9:1-7"], warned: ["Exodus 9:1", "Go in unto Pharaoh"], begins: "palace", key: ["Exodus 9:6", "all the cattle of Egypt died"], magicians: null, harden: ["Exodus 9:7", "heart of Pharaoh was hardened", "unspecified"], goshen: ["Exodus 9:4", "sever between the cattle of Israel and the cattle of Egypt"] },
  { n: 6, name: "Boils", kjvName: "boils", parts: ["Exodus 9:8-12"], warned: null, key: ["Exodus 9:10", "a boil breaking forth with blains"], magicians: ["Exodus 9:11", "magicians could not stand before Moses"], harden: ["Exodus 9:12", "the LORD hardened the heart of Pharaoh", "LORD"], goshen: null },
  { n: 7, name: "Hail", kjvName: "hail", parts: ["Exodus 9:13-35"], warned: ["Exodus 9:13", "Rise up early in the morning"], begins: "river", key: ["Exodus 9:25", "the hail smote throughout all the land of Egypt"], magicians: null, harden: ["Exodus 9:34", "he sinned yet more, and hardened his heart", "Pharaoh"], goshen: ["Exodus 9:26", "land of Goshen, where the children of Israel were, was there no hail"] },
  { n: 8, name: "Locusts", kjvName: "locusts", parts: ["Exodus 10:1-20"], warned: ["Exodus 10:1", "Go in unto Pharaoh"], begins: "palace", key: ["Exodus 10:15", "there remained not any green thing"], magicians: null, harden: ["Exodus 10:20", "the LORD hardened Pharaoh's heart", "LORD"], goshen: null },
  { n: 9, name: "Darkness", kjvName: "darkness", parts: ["Exodus 10:21-29"], warned: null, key: ["Exodus 10:22", "thick darkness in all the land of Egypt three days"], magicians: null, harden: ["Exodus 10:27", "the LORD hardened Pharaoh's heart", "LORD"], goshen: ["Exodus 10:23", "all the children of Israel had light in their dwellings"] },
  { n: 10, name: "Death of the firstborn", kjvName: "firstborn", parts: ["Exodus 11:1-10", "Exodus 12:29-32"], warned: ["Exodus 11:4", "About midnight will I go out into the midst of Egypt"], begins: "announced", key: ["Exodus 12:29", "the LORD smote all the firstborn in the land of Egypt"], magicians: null, harden: ["Exodus 11:10", "the LORD hardened Pharaoh's heart", "LORD"], goshen: ["Exodus 11:7", "against any of the children of Israel shall not a dog move his tongue"] },
];
const plagues = PL.map((p) => {
  const hits = [p.key, p.warned, p.magicians, p.harden, p.goshen].filter(Boolean);
  for (const h of hits) must(h[0], h[1].replace("Pharaoh's", "Pharaoh’s") === h[1] ? h[1] : h[1]);
  const parseRef = (r) => {
    const m = r.match(/^(.+?) (\d+):(\d+)-(\d+)$/);
    return { book: m[1], ch: +m[2], from: +m[3], to: +m[4] };
  };
  let kw = 0;
  let ww = 0;
  let vs = 0;
  for (const part of p.parts) {
    kw += words(part, "kjv");
    ww += words(part, "web");
    const r = parseRef(part);
    vs += r.to - r.from + 1;
  }
  return {
    n: p.n,
    name: p.name,
    kjvName: p.kjvName,
    passage: p.parts.join("; ").replace("Exodus 12:29-32", "12:29-32").replace(/^Exodus /, "Exodus "),
    verses: vs,
    kjvWords: kw,
    webWords: ww,
    warned: p.warned ? p.warned[0] : null,
    begins: p.begins || "none",
    webName: p.webName || p.kjvName,
    key: p.key[0],
    magicians: p.magicians ? { ref: p.magicians[0], could: p.n < 3 } : null,
    harden: { ref: p.harden[0], who: p.harden[2] },
    goshen: p.goshen ? p.goshen[0] : null,
  };
});
// Pharaoh's own hardening (active, Pharaoh the subject) and the LORD's in Exodus 4-14, counted from the verses
const hardenRows = [];
const hardenEgyptians = []; // verses that harden the Egyptians' hearts, not Pharaoh's (Exodus 14:17): listed apart, not counted
for (const r of ROWS.kjv) {
  if (r.book !== "Exodus" || r.ch < 4 || r.ch > 14) continue;
  if (!/\bharden(ed|eth)?\b/i.test(r.text)) continue;
  const t = norm(r.text);
  if (/harden the hearts of the Egyptians/i.test(t)) {
    hardenEgyptians.push(r.ref);
    continue;
  }
  let who;
  if (/(the LORD hardened|for I have hardened|I will harden)/i.test(t)) who = /I will harden/i.test(t) ? "LORD, promised" : "LORD";
  else if (/Pharaoh hardened|hardened his heart/i.test(t)) who = "Pharaoh";
  else who = "unspecified";
  hardenRows.push({ ref: r.ref, who });
}
// 7:13 reads "And he hardened Pharaoh's heart" with no named subject: kept as unspecified
const hardenByWho = hardenRows.reduce((m, r) => ((m[r.who] = (m[r.who] || 0) + 1), m), {});
const firstLord = hardenRows.find((r) => r.who === "LORD");
const firstPharaoh = hardenRows.find((r) => r.who === "Pharaoh");
const plagueWord = countPhrase("kjv", /\bplagues?\b/gi);
const exPlague = ROWS.kjv.filter((r) => r.book === "Exodus" && r.ch >= 7 && r.ch <= 12 && /\bplagues?\b/i.test(r.text)).map((r) => r.ref);
const sign = ROWS.kjv.filter((r) => r.book === "Exodus" && r.ch >= 7 && r.ch <= 12 && /\b(signs?|wonders?)\b/i.test(r.text)).length;
must("Exodus 9:14", "send all my plagues");
must("Exodus 11:1", "one plague more");
must("Exodus 12:12", "against all the gods of Egypt", "execute judgment");

const out = {
  generated: DATE,
  fruit: {
    rows: fruit,
    text: { kjv: fruitKjvText, web: fruitWebText },
    phrase: { kjv: phraseFruit.kjv, web: phraseFruit.web },
    works: { kjv: worksKjv, web: worksWeb },
  },
  armor: { rows: armor, phrase: armorPhrase, armourWord, xref: armorXref },
  tribes: {
    sons: tribeRows,
    josephSons,
    summary: tribesSummary,
    levites: { num3: levites1, num26: levites2 },
  },
  plagues: {
    rows: plagues,
    harden: { rows: hardenRows, egyptians: hardenEgyptians, byWho: hardenByWho, firstLord: firstLord.ref, firstPharaoh: firstPharaoh.ref },
    plagueWord: { total: plagueWord.total, exodus7to12: exPlague },
    signsWondersVerses: sign,
  },
};
fs.writeFileSync(path.join(root, "lib/data/bible-lists.json"), JSON.stringify(out, null, 1) + "\n");
console.log("wrote lib/data/bible-lists.json");
console.log("fruit:", fruit.map((f) => `${f.kjv} ${f.kjvCount.total}/${f.web} ${f.webCount.total}`).join(" | "));
console.log("fruit phrase:", phraseFruit.kjv.refs.join(", "), "/", phraseFruit.web.refs.join(", "));
console.log("armor:", armor.map((a) => `${a.noun} ${a.kjv.total}`).join(" | "), "armour", armourWord.kjv.total, armourWord.web.total, "phrase", armorPhrase.kjv.total, armorPhrase.web.total);
console.log("tribes:", total1, total2, tribesSummary.changePct + "%", "rev missing:", revMissing.join(","), "levites", levites1, levites2);
console.log("tribe-of counts:", [...tribeRows, ...josephSons].map((r) => `${r.name} ${r.tribeOfKjv}`).join(" | "));
console.log("census:", [...tribeRows.filter((r) => r.census1), ...josephSons].map((r) => `${r.name} ${r.census1}>${r.census2}`).join(" | "));
console.log("plagues:", plagues.map((p) => `${p.n} ${p.kjvWords}w/${p.verses}v`).join(" | "));
console.log("harden:", JSON.stringify(hardenByWho), "first LORD", firstLord.ref, "first Pharaoh", firstPharaoh.ref);
console.log("hardenRows:", hardenRows.map((r) => `${r.ref}=${r.who}`).join(" "));
console.log("plague word:", plagueWord.total, "in Ex 7-12:", exPlague.join(","), "signs/wonders verses", sign);
