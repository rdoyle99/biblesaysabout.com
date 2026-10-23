#!/usr/bin/env node
/**
 * Who wrote the Bible, counted from the full KJV text (.cache/bible via scripts/lib/bible-source.mjs).
 *
 *   node scripts/build-authors.mjs     # writes lib/data/authors.json
 *
 * Three readings per book, kept apart on purpose:
 *  - text: what the book's own verses say about who wrote it or whose words it records. Each claim names a verse
 *    and a word that must appear in that verse's KJV text; the script stops if it doesn't, so the table can't drift.
 *    kinds: "opens" (the first verse or greeting names the person: "The words of Amos", "Paul, an apostle"),
 *    "title" (named by a title only: "the Preacher", "the elder"), "part" (a verse says a named person wrote part of
 *    it: "Moses wrote all the words of the LORD"), "unnamed" (the writer speaks as "I" but never gives a name),
 *    null (the text says nothing about its writer).
 *  - kjvTitle: the heading the 1769 KJV prints over the book ("The First Book of Moses, called Genesis"). Headings are
 *    not verse text; they carry the translators' tradition.
 *  - tradition: the attribution GotQuestions.org lists (www.gotquestions.org/Bible-authors.html, read 2026-10-23),
 *    the common Protestant reference list.
 * Words are KJV verse words (scripts/build-bible-stats.mjs method), grouped by tradition.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadBible, BOOKS } from "./lib/bible-source.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const kjv = await loadBible("kjv");
const xml = fs.readFileSync(path.join(root, ".cache/bible/eng-kjv.osis.xml"), "utf8");
const tokens = (t) => t.replace(/’/g, "'").match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || [];
const idx = (name) => BOOKS.findIndex((b) => b[0] === name);
const verse = (book, c, v) => kjv.books[idx(book)].chapters[c]?.[v];

// [book, text claim or null, tradition (GotQuestions), note]
// text claim: { kind, who, ref: [chapter, verse], match }
const T = (kind, who, c, v, match) => ({ kind, who, ref: [c, v], match: match || who.split(" ").at(-1) });
const ROWS = [
  ["Genesis", null, ["Moses"]],
  ["Exodus", T("part", "Moses", 24, 4, "Moses wrote"), ["Moses"]],
  ["Leviticus", null, ["Moses"]],
  ["Numbers", T("part", "Moses", 33, 2, "Moses wrote"), ["Moses"]],
  ["Deuteronomy", T("part", "Moses", 31, 9, "Moses wrote"), ["Moses"], "Deuteronomy 34 reports Moses' death and burial."],
  ["Joshua", T("part", "Joshua", 24, 26, "Joshua wrote"), ["Joshua"]],
  ["Judges", null, ["Samuel", "Nathan", "Gad"]],
  ["Ruth", null, ["Samuel", "Nathan", "Gad"]],
  ["1 Samuel", null, ["Samuel", "Nathan", "Gad"], "1 Chronicles 29:29 names the books of Samuel the seer, Nathan the prophet and Gad the seer as records of David's reign."],
  ["2 Samuel", null, ["Samuel", "Nathan", "Gad"]],
  ["1 Kings", null, ["Jeremiah"]],
  ["2 Kings", null, ["Jeremiah"]],
  ["1 Chronicles", null, ["Ezra"]],
  ["2 Chronicles", null, ["Ezra"]],
  ["Ezra", null, ["Ezra"], "Ezra 7:27 to 9:15 is told in the first person by the scribe the chapter has just named."],
  ["Nehemiah", T("opens", "Nehemiah", 1, 1), ["Ezra"], "GotQuestions lists Ezra for Nehemiah; the book opens \"The words of Nehemiah\"."],
  ["Esther", null, ["Mordecai"]],
  ["Job", null, ["Moses"]],
  ["Psalms", "psalms", ["David", "and others"]],
  ["Proverbs", T("opens", "Solomon", 1, 1), ["Solomon"], "Proverbs 30:1 opens the words of Agur and 31:1 the words of king Lemuel."],
  ["Ecclesiastes", T("title", "the Preacher, the son of David", 1, 1, "Preacher"), ["Solomon"]],
  ["Song of Solomon", T("opens", "Solomon", 1, 1), ["Solomon"]],
  ["Isaiah", T("opens", "Isaiah", 1, 1), ["Isaiah"]],
  ["Jeremiah", T("opens", "Jeremiah", 1, 1), ["Jeremiah"], "Jeremiah 36:4 says Baruch wrote Jeremiah's words from his mouth."],
  ["Lamentations", null, ["Jeremiah"]],
  ["Ezekiel", T("opens", "Ezekiel", 1, 3), ["Ezekiel"]],
  ["Daniel", T("part", "Daniel", 7, 1, "he wrote the dream"), ["Daniel"]],
  ["Hosea", T("opens", "Hosea", 1, 1), ["Hosea"]],
  ["Joel", T("opens", "Joel", 1, 1), ["Joel"]],
  ["Amos", T("opens", "Amos", 1, 1), ["Amos"]],
  ["Obadiah", T("opens", "Obadiah", 1, 1), ["Obadiah"]],
  ["Jonah", null, ["Jonah"], "The book tells Jonah's story in the third person."],
  ["Micah", T("opens", "Micah", 1, 1), ["Micah"]],
  ["Nahum", T("opens", "Nahum", 1, 1), ["Nahum"]],
  ["Habakkuk", T("opens", "Habakkuk", 1, 1), ["Habakkuk"]],
  ["Zephaniah", T("opens", "Zephaniah", 1, 1), ["Zephaniah"]],
  ["Haggai", T("opens", "Haggai", 1, 1), ["Haggai"]],
  ["Zechariah", T("opens", "Zechariah", 1, 1), ["Zechariah"]],
  ["Malachi", T("opens", "Malachi", 1, 1), ["Malachi"]],
  ["Matthew", null, ["Matthew"]],
  ["Mark", null, ["Mark"]],
  ["Luke", T("unnamed", "a writer who says \"it seemed good to me also\"", 1, 3, "seemed good to me"), ["Luke"]],
  ["John", T("unnamed", "\"the disciple which testifieth of these things, and wrote these things\"", 21, 24, "wrote these things"), ["John"]],
  ["Acts", T("unnamed", "the writer of \"the former treatise\"", 1, 1, "former treatise"), ["Luke"]],
  ["Romans", T("opens", "Paul", 1, 1), ["Paul"]],
  ["1 Corinthians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["2 Corinthians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Galatians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Ephesians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Philippians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Colossians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["1 Thessalonians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["2 Thessalonians", T("opens", "Paul", 1, 1), ["Paul"]],
  ["1 Timothy", T("opens", "Paul", 1, 1), ["Paul"]],
  ["2 Timothy", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Titus", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Philemon", T("opens", "Paul", 1, 1), ["Paul"]],
  ["Hebrews", null, ["unknown"], "GotQuestions: \"most likely Paul, Luke, Barnabas, or Apollos\"."],
  ["James", T("opens", "James", 1, 1), ["James"]],
  ["1 Peter", T("opens", "Peter", 1, 1), ["Peter"]],
  ["2 Peter", T("opens", "Simon Peter", 1, 1), ["Peter"]],
  ["1 John", null, ["John"]],
  ["2 John", T("title", "the elder", 1, 1, "elder"), ["John"]],
  ["3 John", T("title", "the elder", 1, 1, "elder"), ["John"]],
  ["Jude", T("opens", "Jude", 1, 1), ["Jude"]],
  ["Revelation", T("opens", "John", 1, 1, "his servant John"), ["John"], "Revelation 1:4 and 1:9 name John again (\"I John\")."],
];
if (ROWS.length !== 66 || ROWS.some((r, i) => r[0] !== BOOKS[i][0])) throw new Error("rows must follow the 66 books in order");

// KJV book headings (main titles), in book order, skipping the Apocrypha the OSIS file also carries
const mains = [...xml.matchAll(/<div type="book" osisID="([^"]+)"[^>]*>\s*<title type="main"[^>]*>([^<]*)<\/title>/g)];
const kjvTitle = Object.fromEntries(mains.map((m) => [m[1], m[2].trim()]));

// Psalm titles: which psalms carry a heading that names a person
const psTitles = {};
// (a "Book II".."Book V" marker can sit between the chapter tag and the title: Psalms 42, 73, 90, 107)
for (const m of xml.matchAll(/<chapter osisRef="Ps\.(\d+)"[^>]*\/>((?:(?!<verse)[\s\S])*?)<title type="psalm"[^>]*>([\s\S]*?)<\/title>/g)) psTitles[+m[1]] = m[3].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
for (const n of Object.keys(psTitles)) if (/^[A-Z]+\.$/.test(psTitles[n])) delete psTitles[n]; // Psalm 119's ALEPH is an acrostic letter, not a title
const PS_NAMES = [
  ["David", /\bDavid\b/],
  ["Asaph", /\bAsaph\b/],
  ["the sons of Korah", /\bsons of Korah\b/],
  ["Solomon", /\bSolomon\b/],
  ["Moses", /\bMoses\b/],
  ["Heman the Ezrahite", /\bHeman\b/],
  ["Ethan the Ezrahite", /\bEthan\b/],
];
const psalmsNamed = PS_NAMES.map(([who, re]) => {
  const list = Object.entries(psTitles).filter(([, t]) => re.test(t)).map(([n]) => +n);
  return { who, psalms: list.length, list };
});
const psalmsWithName = new Set(psalmsNamed.flatMap((p) => p.list));
const psalmsTitled = Object.keys(psTitles).length;

const bookWords = (bi) => kjv.books[bi].chapters.reduce((a, vs) => a + (vs ? vs.reduce((b, t) => b + (t ? tokens(t).length : 0), 0) : 0), 0);
const total = kjv.books.reduce((a, _, bi) => a + bookWords(bi), 0);

const books = ROWS.map(([name, text, tradition, note], bi) => {
  const osis = BOOKS[bi][2];
  const words = bookWords(bi);
  let claim = null;
  if (text === "psalms") {
    claim = { kind: "psalms", who: "David and 6 others in the psalm titles" };
  } else if (text) {
    const t = verse(name, ...text.ref);
    if (!t || !t.toLowerCase().includes(text.match.toLowerCase())) throw new Error(`${name} ${text.ref.join(":")} does not contain "${text.match}": ${t}`);
    claim = { kind: text.kind, who: text.who, ref: `${name} ${text.ref[0]}:${text.ref[1]}`, quote: t };
  }
  return { name, slug: name.toLowerCase().replace(/ /g, "-"), testament: BOOKS[bi][3], words, kjvTitle: kjvTitle[osis] || null, text: claim, tradition, note: note || null };
});

// Counts
const kindCount = (k) => books.filter((b) => b.text?.kind === k).length;
const named = books.filter((b) => ["opens", "part"].includes(b.text?.kind));
const namedPeople = [...new Set(named.map((b) => (b.text.who === "Simon Peter" ? "Peter" : b.text.who)))];
const silent = books.filter((b) => !b.text);
const silentWords = silent.reduce((a, b) => a + b.words, 0);
const titleNames = books.filter((b) => b.kjvTitle && !b.text && /\b(Moses|Samuel|Jeremiah|Matthew|Mark|Luke|John|Paul)\b/.test(b.kjvTitle));

// Words by traditional author (GotQuestions list); shared books (Samuel/Nathan/Gad) count once under the group
const groups = {};
for (const b of books) {
  const key = b.tradition.join(" ");
  const label = key === "Samuel Nathan Gad" ? "Samuel, Nathan and Gad" : key === "David and others" ? "David and others (Psalms)" : key === "unknown" ? "Unknown (Hebrews)" : key;
  (groups[label] ||= { author: label, books: [], words: 0 });
  groups[label].books.push(b.name);
  groups[label].words += b.words;
}
const byAuthor = Object.values(groups)
  .map((g) => ({ ...g, share: +((g.words / total) * 100).toFixed(1) }))
  .sort((a, b) => b.words - a.words);
const ntTotal = books.filter((b) => b.testament === "NT").reduce((a, b) => a + b.words, 0);
const ntShare = (label) => +((groups[label].words / ntTotal) * 100).toFixed(1);

// The traditional list's distinct names, then the other people the text itself names as writers or speakers
const traditionNames = [...new Set(books.flatMap((b) => b.tradition).filter((n) => !["and others", "unknown"].includes(n)))];
const extraFromText = ["Nehemiah", "Asaph", "the sons of Korah", "Heman the Ezrahite", "Ethan the Ezrahite", "Agur", "Lemuel"].filter((n) => !traditionNames.includes(n));

const out = {
  generated: "2026-10-23",
  source: "King James Version (1769), public domain, eng-kjv.osis.xml from github.com/seven1m/open-bibles; counted by scripts/build-authors.mjs",
  traditionSource: { name: "GotQuestions.org, Who were the authors of the books of the Bible?", url: "https://www.gotquestions.org/Bible-authors.html", read: "2026-10-23" },
  totalWords: total,
  ntWords: ntTotal,
  counts: {
    books: 66,
    opens: kindCount("opens"),
    part: kindCount("part"),
    title: kindCount("title"),
    unnamed: kindCount("unnamed"),
    psalms: 1,
    silent: silent.length,
    named: named.length,
    namedPeople: namedPeople.length,
    silentWords,
    silentShare: +((silentWords / total) * 100).toFixed(1),
    traditionNames: traditionNames.length,
    extraFromText: extraFromText.length,
    traditionPlusText: traditionNames.length + extraFromText.length,
  },
  namedPeople,
  traditionNames,
  extraFromText,
  psalms: { titled: psalmsTitled, withName: psalmsWithName.size, untitledOrUnnamed: 150 - psalmsWithName.size, byName: psalmsNamed },
  kjvTitleAttributions: titleNames.map((b) => ({ book: b.name, kjvTitle: b.kjvTitle })),
  byAuthor,
  paulVsLuke: { paul: groups.Paul.words, luke: groups.Luke.words, paulNtShare: ntShare("Paul"), lukeNtShare: ntShare("Luke"), paulBooks: groups.Paul.books.length, lukeBooks: groups.Luke.books.length },
  books,
};
fs.writeFileSync(path.join(root, "lib/data/authors.json"), JSON.stringify(out, null, 1) + "\n");
console.log(JSON.stringify({ ...out.counts, psalms: out.psalms.withName, psalmNames: psalmsNamed.map((p) => `${p.who} ${p.psalms}`).join(", "), top: byAuthor.slice(0, 6).map((a) => `${a.author} ${a.words} ${a.share}%`), paulVsLuke: out.paulVsLuke, titleNames: out.kjvTitleAttributions.length, traditionNames, extraFromText }, null, 1));
