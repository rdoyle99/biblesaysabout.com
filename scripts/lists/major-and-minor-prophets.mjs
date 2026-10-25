/* Major and minor prophets: the 17 prophetic books at the end of the Old Testament in English Bibles, with chapters,
   verses and words from the full KJV and WEB text (lib/data/bible-books.json), the "thus saith the LORD" count per
   book, and the opening verse that names each prophet, checked against the KJV.
   Writes lib/data/lists/major-and-minor-prophets.json. Run: node scripts/lists/major-and-minor-prophets.mjs */
import fs from "fs";
import path from "path";
import { root, must, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

const BOOKS_JSON = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-books.json"), "utf8"));

// [book, group, opening reference, needles that name the prophet there]
const LIST = [
  ["Isaiah", "major", "Isaiah 1:1", "Isaiah the son of Amoz"],
  ["Jeremiah", "major", "Jeremiah 1:1", "Jeremiah the son of Hilkiah"],
  ["Lamentations", "major", "Lamentations 1:1", "How doth the city sit solitary"],
  ["Ezekiel", "major", "Ezekiel 1:3", "Ezekiel the priest, the son of Buzi"],
  ["Daniel", "major", "Daniel 1:6", "Daniel"],
  ["Hosea", "minor", "Hosea 1:1", "Hosea, the son of Beeri"],
  ["Joel", "minor", "Joel 1:1", "Joel the son of Pethuel"],
  ["Amos", "minor", "Amos 1:1", "Amos, who was among the herdmen of Tekoa"],
  ["Obadiah", "minor", "Obadiah 1:1", "The vision of Obadiah"],
  ["Jonah", "minor", "Jonah 1:1", "Jonah the son of Amittai"],
  ["Micah", "minor", "Micah 1:1", "Micah the Morasthite"],
  ["Nahum", "minor", "Nahum 1:1", "Nahum the Elkoshite"],
  ["Habakkuk", "minor", "Habakkuk 1:1", "Habakkuk the prophet"],
  ["Zephaniah", "minor", "Zephaniah 1:1", "Zephaniah the son of Cushi"],
  ["Haggai", "minor", "Haggai 1:1", "Haggai the prophet"],
  ["Zechariah", "minor", "Zechariah 1:1", "Zechariah, the son of Berechiah"],
  ["Malachi", "minor", "Malachi 1:1", "by Malachi"],
];

const rows = LIST.map(([name, group, ref, ...needles], i) => {
  const b = BOOKS_JSON.books.find((x) => x.name === name);
  if (!b) fail(`${name} not in bible-books.json`);
  must(ref, ...needles);
  const thus = countPhrase("kjv", /thus saith the lord/gi, (r) => r.book === name).total;
  return {
    n: i + 1,
    name,
    slug: b.slug,
    group,
    order: b.order,
    chapters: b.chapters,
    verses: b.verses.kjv,
    wordsKjv: b.words.kjv,
    wordsWeb: b.words.web,
    readingMinutes: b.readingMinutes,
    opening: ref,
    thusSaith: thus,
  };
});

const sum = (rs, k) => rs.reduce((n, r) => n + r[k], 0);
const major = rows.filter((r) => r.group === "major");
const minor = rows.filter((r) => r.group === "minor");
const ot = BOOKS_JSON.books.filter((b) => b.testament === "OT");
const byWords = [...rows].sort((a, b) => b.wordsKjv - a.wordsKjv);
const byVerses = [...rows].sort((a, b) => a.verses - b.verses);
const allBooks = [...BOOKS_JSON.books].sort((a, b) => b.words.kjv - a.words.kjv);
const otShortest = [...ot].sort((a, b) => a.verses.kjv - b.verses.kjv)[0];

const totals = {
  major: { books: major.length, chapters: sum(major, "chapters"), verses: sum(major, "verses"), wordsKjv: sum(major, "wordsKjv"), thusSaith: sum(major, "thusSaith") },
  minor: { books: minor.length, chapters: sum(minor, "chapters"), verses: sum(minor, "verses"), wordsKjv: sum(minor, "wordsKjv"), thusSaith: sum(minor, "thusSaith") },
  otWordsKjv: ot.reduce((n, b) => n + b.words.kjv, 0),
  thusSaithBible: countPhrase("kjv", /thus saith the lord/gi).total,
  // the count above takes in both KJV printings: "Thus saith the LORD" and "Thus saith the Lord GOD"
  thusLordCaps: countPhrase("kjv", /[Tt]hus saith the LORD\b/g).total,
  thusLordGod: countPhrase("kjv", /[Tt]hus saith the Lord GOD/g).total,
  thusLordGodEzekiel: countPhrase("kjv", /[Tt]hus saith the Lord GOD/g, (r) => r.book === "Ezekiel").total,
};
if (totals.thusLordCaps + totals.thusLordGod !== totals.thusSaithBible) fail("thus saith the LORD / Lord GOD split does not add up");

const words = {
  prophetKjv: countForms("kjv", ["prophet", "prophets"]),
  prophetWeb: countForms("web", ["prophet", "prophets"]),
  prophetessKjv: countForms("kjv", ["prophetess"]),
};

const checks = {
  hosea11: must("Hosea 1:1", "Uzziah, Jotham, Ahaz, and Hezekiah"),
  isaiah11: must("Isaiah 1:1", "Uzziah, Jotham, Ahaz, and Hezekiah"),
  jonah: must("Jonah 3:4", "Yet forty days, and Nineveh shall be overthrown"),
  matt1240: must("Matthew 12:40", "Jonas was three days and three nights"),
  acts742: must("Acts 7:42", "the book of the prophets"),
  luke2444: must("Luke 24:44", "the law of Moses, and in the prophets, and in the psalms"),
  dan92: must("Daniel 9:2", "the word of the LORD came to Jeremiah the prophet"),
  matt2415: must("Matthew 24:15", "Daniel the prophet"),
  mal45: must("Malachi 4:5", "Elijah the prophet"),
  amos714: must("Amos 7:14", "I was no prophet"),
  amos525: must("Amos 5:25", "in the wilderness forty years"),
  acts742amos: must("Acts 7:42", "in the wilderness"),
  lament: must("2 Chronicles 35:25", "Jeremiah lamented for Josiah", "written in the lamentations"),
  lam: must("Lamentations 1:1", "How doth the city sit solitary"),
  hoseaOpen: must("Hosea 1:1", "The word of the LORD that came unto Hosea"),
  joelOpen: must("Joel 1:1", "The word of the LORD that came to Joel"),
};

if (rows.length !== 17 || major.length !== 5 || minor.length !== 12) fail("expected 5 major and 12 minor");
// the books must be the 23rd to 39th books, in order
rows.forEach((r, i) => { if (r.order !== 23 + i) fail(`${r.name} is book ${r.order}, expected ${23 + i}`); });

writeList("major-and-minor-prophets", {
  generated: "2026-10-25",
  rows,
  totals,
  longest: {
    name: byWords[0].name,
    wordsKjv: byWords[0].wordsKjv,
    wordsWeb: byWords[0].wordsWeb,
    rankAll: allBooks.findIndex((b) => b.name === byWords[0].name) + 1,
    rankAllWeb: [...BOOKS_JSON.books].sort((a, b) => b.words.web - a.words.web).findIndex((b) => b.name === byWords[0].name) + 1,
    // the next-longest book in the whole Bible, so the margin is on the page
    next: { name: allBooks[1].name, wordsKjv: allBooks[1].words.kjv, wordsWeb: allBooks[1].words.web },
  },
  mostChapters: [...rows].sort((a, b) => b.chapters - a.chapters)[0].name,
  shortest: { name: byVerses[0].name, verses: byVerses[0].verses, otShortest: otShortest.name },
  mostThus: [...rows].sort((a, b) => b.thusSaith - a.thusSaith).slice(0, 3).map((r) => ({ name: r.name, n: r.thusSaith })),
  noThus: rows.filter((r) => r.thusSaith === 0).map((r) => r.name),
  words,
  checks: Object.keys(checks),
});

console.log("major", totals.major, "| minor", totals.minor, "| OT words", totals.otWordsKjv, "| thus saith Bible", totals.thusSaithBible);
console.log("longest", byWords[0].name, byWords[0].wordsKjv, "rank in Bible", allBooks.findIndex((b) => b.name === byWords[0].name) + 1, "| shortest", byVerses[0].name, byVerses[0].verses, "OT shortest", otShortest.name);
console.log("thus saith:", rows.map((r) => `${r.name} ${r.thusSaith}`).join(", "));
console.log("prophet(s) KJV", words.prophetKjv.total, "WEB", words.prophetWeb.total, "prophetess", words.prophetessKjv.total);
