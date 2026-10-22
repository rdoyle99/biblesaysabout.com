/* Ordered book lists and ranked top-10 pages: every number is read from lib/data (counted from the full KJV and WEB text) */

import rankings from "./data/bible-rankings.json";
import { books, bible, totals, fmt, readingTime, SITE, READING_WPM } from "./bibleData";

export const LIST_DATE = "2026-10-22";
export const RANK_DATE = rankings.generated > "2026-10-22" ? rankings.generated : "2026-10-22";

const between = (from, to) => books.slice(books.findIndex((b) => b.name === from), books.findIndex((b) => b.name === to) + 1);

export const OT_GROUPS = [
  { id: "law", label: "Law (the Pentateuch)", note: "Genesis to Deuteronomy", list: between("Genesis", "Deuteronomy") },
  { id: "history", label: "History", note: "Joshua to Esther", list: between("Joshua", "Esther") },
  { id: "poetry", label: "Poetry and wisdom", note: "Job to Song of Solomon", list: between("Job", "Song of Solomon") },
  { id: "major-prophets", label: "Major prophets", note: "Isaiah to Daniel", list: between("Isaiah", "Daniel") },
  { id: "minor-prophets", label: "Minor prophets", note: "Hosea to Malachi", list: between("Hosea", "Malachi") },
];
export const NT_GROUPS = [
  { id: "gospels", label: "Gospels", note: "Matthew to John", list: between("Matthew", "John") },
  { id: "acts", label: "History", note: "Acts", list: between("Acts", "Acts") },
  { id: "pauls-letters", label: "Epistles: Paul's letters", note: "Romans to Philemon", list: between("Romans", "Philemon") },
  { id: "general-letters", label: "Epistles: general letters", note: "Hebrews to Jude", list: between("Hebrews", "Jude") },
  { id: "prophecy", label: "Prophecy", note: "Revelation", list: between("Revelation", "Revelation") },
];

const sum = (list, t = "kjv") => list.reduce((s, b) => s + b.words[t], 0);

const R = rankings;
const k = R.kjv;
const w = R.web;
const same = (a, b) => a.ref === b.ref;
const wordsOf = (n) => `${n} word${n === 1 ? "" : "s"}`;

/* ---- books by size ---- */
const byKjv = [...books].sort((a, b) => b.words.kjv - a.words.kjv || a.order - b.order);
const byWeb = [...books].sort((a, b) => b.words.web - a.words.web || a.order - b.order);
const byVersesAsc = [...books].sort((a, b) => a.verses.kjv - b.verses.kjv || a.words.kjv - b.words.kjv);
const bookRow = (b) => ({ ref: b.name, href: `/books/${b.slug}`, a: fmt(b.words.kjv), b: fmt(b.words.web), c: b.chapters, d: fmt(b.verses.kjv) });
const bookCols = ["Book", "Words (KJV)", "Words (WEB)", "Chapters", "Verses (KJV)"];
const longB = byKjv[0];
const longBWeb = byWeb[0];
const shortB = byKjv.at(-1);
const shortBWeb = byWeb.at(-1);
const shortB2 = byKjv.at(-2);
const longB2 = byKjv[1];
const fewestVerses = byVersesAsc[0];
const titlesFlip = longB2.slug === "psalms" && longB2.words.kjv + bible.psalmTitleWords > longB.words.kjv;

/* ---- tables for verses and chapters ---- */
const verseRows = (list) => list.map((v) => ({ ref: v.ref, a: v.words, b: v.letters, text: v.text }));
const verseCols = ["Verse", "Words", "Letters"];
const chapterRows = (list) => list.map((c) => ({ ref: c.ref, a: c.verses, b: fmt(c.words) }));
const chapterCols = ["Chapter", "Verses", "Words"];

const note = (a, b, unit) =>
  same(a, b) ? `${a.ref} in both the King James Version and the World English Bible.` : `${a.ref} in the King James Version and ${b.ref} in the World English Bible (${unit}).`;

export const RANK_PAGES = {
  "shortest-book-in-the-bible": {
    title: "Shortest Book in the Bible: Which Is It? (Counted, KJV and WEB)",
    h1: "What is the shortest book in the Bible?",
    answer: `By word count the shortest book in the Bible is ${shortB.name}: ${fmt(shortB.words.kjv)} words in the King James Version${shortBWeb.slug === shortB.slug ? " and " + fmt(shortB.words.web) + " in the World English Bible" : `, while in the World English Bible it is ${shortBWeb.name} (${fmt(shortBWeb.words.web)} words)`}. By verse count ${fewestVerses.name} is shortest, with ${fewestVerses.verses.kjv} verses. The next shortest by words is ${shortB2.name} (${fmt(shortB2.words.kjv)}).`,
    description: `${shortB.name} is the shortest book of the Bible by words (${fmt(shortB.words.kjv)} in the KJV). The ten shortest books ranked by words, verses and chapters, counted from the full text.`,
    tiles: [
      { label: "Shortest by words", value: shortB.name, note: `${fmt(shortB.words.kjv)} words (KJV)` },
      { label: "Fewest verses", value: fewestVerses.name, note: `${fewestVerses.verses.kjv} verses` },
      { label: "Books ranked", value: totals.books, note: "all 66" },
      { label: "Longest book", value: longB.name, note: `${fmt(longB.words.kjv)} words (KJV)` },
    ],
    tables: [
      { id: "ranking", title: "The 10 shortest books of the Bible, by words", intro: "Ranked by KJV word count. The WEB column is the World English Bible count for the same book.", cols: bookCols, rows: [...byKjv].reverse().slice(0, 10).map(bookRow), linkRef: true },
      { id: "by-verses", title: "The 10 shortest books by verses", intro: "Verse counts follow the KJV numbering.", cols: bookCols, rows: byVersesAsc.slice(0, 10).map(bookRow), linkRef: true },
    ],
    faqs: [
      { q: "What is the shortest book in the Bible?", a: `${shortB.name} by word count (${fmt(shortB.words.kjv)} words in the KJV). ${fewestVerses.name} has the fewest verses (${fewestVerses.verses.kjv}).` },
      { q: "Why do some sources say 3 John and others say Obadiah or 2 John?", a: `They measure different things. By verses, ${fewestVerses.name} has ${fewestVerses.verses.kjv}; by words in the KJV, ${shortB.name} has ${fmt(shortB.words.kjv)}. Chapters are no help: ${books.filter((b) => b.chapters === 1).length} books have a single chapter.` },
      { q: "Does the answer change between the KJV and the World English Bible?", a: shortBWeb.slug === shortB.slug ? `No. ${shortB.name} is shortest in both.` : `Yes. ${shortB.name} is shortest in the KJV and ${shortBWeb.name} in the WEB, because the two translations render the same text with different numbers of words.` },
      { q: "What is the longest book in the Bible?", a: `${longB.name} by words (${fmt(longB.words.kjv)} in the KJV).` },
    ],
    related: ["longest-book-in-the-bible", "shortest-chapter-in-the-bible", "shortest-verse-in-the-bible"],
  },
  "longest-book-in-the-bible": {
    title: "Longest Book in the Bible: Which Is It? (Counted, KJV and WEB)",
    h1: "What is the longest book in the Bible?",
    answer: `By word count the longest book in the Bible is ${longB.name}: ${fmt(longB.words.kjv)} words in the King James Version, ${fmt(longB.words.kjv - longB2.words.kjv)} more than ${longB2.name} (${fmt(longB2.words.kjv)}).${longBWeb.slug !== longB.slug ? ` In the World English Bible ${longBWeb.name} is longest (${fmt(longBWeb.words.web)} words).` : ""} ${[...books].sort((a, b) => b.chapters - a.chapters)[0].name} has the most chapters (${[...books].sort((a, b) => b.chapters - a.chapters)[0].chapters}) and the most verses (${fmt([...books].sort((a, b) => b.verses.kjv - a.verses.kjv)[0].verses.kjv)}).${titlesFlip ? ` Count the ${fmt(bible.psalmTitleWords)} words of the psalm titles and Psalms is longer.` : ""}`,
    description: `${longB.name} is the longest book of the Bible by words (${fmt(longB.words.kjv)} in the KJV). The ten longest books ranked by words, verses and chapters, counted from the full text.`,
    tiles: [
      { label: "Longest by words (KJV)", value: longB.name, note: `${fmt(longB.words.kjv)} words` },
      { label: "Longest by words (WEB)", value: longBWeb.name, note: `${fmt(longBWeb.words.web)} words` },
      { label: "Most chapters", value: [...books].sort((a, b) => b.chapters - a.chapters)[0].name, note: `${[...books].sort((a, b) => b.chapters - a.chapters)[0].chapters} chapters` },
      { label: "Shortest book", value: shortB.name, note: `${fmt(shortB.words.kjv)} words (KJV)` },
    ],
    tables: [
      { id: "ranking", title: "The 10 longest books of the Bible, by words (KJV)", intro: "Verse text only, headings and psalm titles left out.", cols: bookCols, rows: byKjv.slice(0, 10).map(bookRow), linkRef: true },
      { id: "ranking-web", title: "The 10 longest books in the World English Bible", intro: "Same count on the WEB text, which uses different wording and so different totals.", cols: bookCols, rows: byWeb.slice(0, 10).map(bookRow), linkRef: true },
    ],
    faqs: [
      { q: "What is the longest book in the Bible?", a: `${longB.name} by words (${fmt(longB.words.kjv)} in the KJV).` },
      { q: "Which book has the most chapters?", a: `${[...books].sort((a, b) => b.chapters - a.chapters)[0].name}, with ${[...books].sort((a, b) => b.chapters - a.chapters)[0].chapters} chapters.` },
      { q: "Is Psalms or Jeremiah longer?", a: `By words in the KJV, ${byKjv[0].name} (${fmt(byKjv[0].words.kjv)}) is ahead of ${byKjv[1].name} (${fmt(byKjv[1].words.kjv)}). Psalms has the most chapters and verses.${titlesFlip ? ` The psalm titles add ${fmt(bible.psalmTitleWords)} words, which would put Psalms first.` : ""}` },
      { q: "What is the longest book in the New Testament?", a: `${[...books].filter((b) => b.testament === "NT").sort((a, b) => b.words.kjv - a.words.kjv)[0].name} (${fmt([...books].filter((b) => b.testament === "NT").sort((a, b) => b.words.kjv - a.words.kjv)[0].words.kjv)} words, KJV).` },
    ],
    related: ["shortest-book-in-the-bible", "longest-chapter-in-the-bible", "longest-verse-in-the-bible"],
  },
  "shortest-verse-in-the-bible": {
    title: `Shortest Verse in the Bible: ${k.shortestVerses[0].ref} and the Next 9 (Ranked)`,
    h1: "What is the shortest verse in the Bible?",
    answer: `The shortest verse in the Bible is ${k.shortestVerses[0].ref}, "${k.shortestVerses[0].text}", ${wordsOf(k.shortestVerses[0].words)} in both the King James Version and the World English Bible. ${k.shortestVerses[1].ref} ("${k.shortestVerses[1].text}") also has ${wordsOf(k.shortestVerses[1].words)} in the KJV but more letters (${k.shortestVerses[1].letters} against ${k.shortestVerses[0].letters}). In the World English Bible ${w.shortestVerses[1].ref} ("${w.shortestVerses[1].text}") ties it at two words.`,
    description: `${k.shortestVerses[0].ref} ("${k.shortestVerses[0].text}") is the shortest verse in the Bible. The ten shortest verses ranked by words and letters from the full KJV and WEB text.`,
    tiles: [
      { label: "Shortest (KJV)", value: k.shortestVerses[0].ref, note: `${k.shortestVerses[0].words} words, ${k.shortestVerses[0].letters} letters` },
      { label: "Shortest (WEB)", value: w.shortestVerses[0].ref, note: `${w.shortestVerses[0].words} words, ${w.shortestVerses[0].letters} letters` },
      { label: "Verses ranked (KJV)", value: fmt(bible.kjv.verses), note: "every verse" },
      { label: "Longest verse", value: bible.kjv.longestVerse.ref, note: `${bible.kjv.longestVerse.words} words (KJV)` },
    ],
    tables: [
      { id: "kjv", title: "The 10 shortest verses, King James Version", intro: "Ranked by words, ties broken by letters, then canon order.", cols: verseCols, rows: verseRows(k.shortestVerses) },
      { id: "web", title: "The 10 shortest verses, World English Bible", intro: "The WEB words some verses differently, so the order moves.", cols: verseCols, rows: verseRows(w.shortestVerses) },
    ],
    faqs: [
      { q: "What is the shortest verse in the Bible?", a: `${k.shortestVerses[0].ref}, "${k.shortestVerses[0].text}" It is ${wordsOf(k.shortestVerses[0].words)} and ${k.shortestVerses[0].letters} letters.` },
      { q: `Is ${k.shortestVerses[1].ref} shorter than ${k.shortestVerses[0].ref}?`, a: `No. "${k.shortestVerses[1].text}" is also two words in the KJV, but it has ${k.shortestVerses[1].letters} letters to ${k.shortestVerses[0].ref}'s ${k.shortestVerses[0].letters}.` },
      { q: "Do the KJV and WEB give the same shortest verse?", a: note(k.shortestVerses[0], w.shortestVerses[0], "ranked by words then letters") + ` Ties at two words differ: the KJV has ${k.shortestVerses.filter((v) => v.words === 2).map((v) => v.ref).join(" and ")}; the WEB has ${w.shortestVerses.filter((v) => v.words === 2).map((v) => v.ref).join(", ")}.` },
      { q: "What is the longest verse in the Bible?", a: `${bible.kjv.longestVerse.ref}, ${bible.kjv.longestVerse.words} words in the KJV.` },
    ],
    related: ["longest-verse-in-the-bible", "shortest-chapter-in-the-bible", "shortest-book-in-the-bible"],
  },
  "longest-verse-in-the-bible": {
    title: `Longest Verse in the Bible: ${k.longestVerses[0].ref} and the Next 9 (Ranked)`,
    h1: "What is the longest verse in the Bible?",
    answer: `The longest verse in the Bible is ${k.longestVerses[0].ref}: ${k.longestVerses[0].words} words in the King James Version and ${w.longestVerses.find((v) => v.ref === k.longestVerses[0].ref)?.words ?? w.longestVerses[0].words} in the World English Bible. It records the king's scribes writing Mordecai's decree to the provinces. The runner-up in the KJV is ${k.longestVerses[1].ref} (${k.longestVerses[1].words} words); in the WEB it is ${w.longestVerses[1].ref} (${w.longestVerses[1].words}).`,
    description: `${k.longestVerses[0].ref} is the longest verse in the Bible (${k.longestVerses[0].words} words, KJV). The ten longest verses ranked by words from the full KJV and WEB text.`,
    tiles: [
      { label: "Longest (KJV)", value: k.longestVerses[0].ref, note: `${k.longestVerses[0].words} words` },
      { label: "Longest (WEB)", value: w.longestVerses[0].ref, note: `${w.longestVerses[0].words} words` },
      { label: "Verses ranked (KJV)", value: fmt(bible.kjv.verses), note: "every verse" },
      { label: "Shortest verse", value: k.shortestVerses[0].ref, note: `${k.shortestVerses[0].words} words` },
    ],
    tables: [
      { id: "kjv", title: "The 10 longest verses, King James Version", intro: "Ranked by words, ties broken by letters, then canon order.", cols: verseCols, rows: verseRows(k.longestVerses) },
      { id: "web", title: "The 10 longest verses, World English Bible", intro: "Different wording, different counts: the order below the top spot changes.", cols: verseCols, rows: verseRows(w.longestVerses) },
    ],
    faqs: [
      { q: "What is the longest verse in the Bible?", a: note(k.longestVerses[0], w.longestVerses[0], "by words") },
      { q: "What is the longest verse in the New Testament?", a: `${k.ntLongestVerse.ref}, ${k.ntLongestVerse.words} words in the KJV${same(k.ntLongestVerse, w.ntLongestVerse) ? ` (${w.ntLongestVerse.words} in the WEB)` : `; in the WEB it is ${w.ntLongestVerse.ref} (${w.ntLongestVerse.words})`}.` },
      { q: "How is the length counted?", a: "In words of verse text, using the same rule as every count on this site: a run of letters, hyphenated names as two words. Headings and psalm titles are left out." },
      { q: "What is the shortest verse in the Bible?", a: `${k.shortestVerses[0].ref}, "${k.shortestVerses[0].text}"` },
    ],
    related: ["shortest-verse-in-the-bible", "longest-chapter-in-the-bible", "longest-book-in-the-bible"],
  },
  "longest-chapter-in-the-bible": {
    title: `Longest Chapter in the Bible: ${k.longestChapters[0].ref} (${k.longestChapters[0].verses} Verses), Top 10`,
    h1: "What is the longest chapter in the Bible?",
    answer: `The longest chapter in the Bible is ${k.longestChapters[0].ref}, with ${k.longestChapters[0].verses} verses and ${fmt(k.longestChapters[0].words)} words in the King James Version (${fmt(w.longestChapters[0].words)} in the World English Bible). By verses the next longest is ${k.longestChapters[1].ref} (${k.longestChapters[1].verses}). ${k.longestChaptersByWords[1].ref} is second by words (${fmt(k.longestChaptersByWords[1].words)}).`,
    description: `${k.longestChapters[0].ref} is the longest chapter in the Bible (${k.longestChapters[0].verses} verses). The ten longest chapters ranked by verses and by words, counted from the full KJV and WEB text.`,
    tiles: [
      { label: "Longest chapter", value: k.longestChapters[0].ref, note: `${k.longestChapters[0].verses} verses` },
      { label: "Words in it (KJV)", value: fmt(k.longestChapters[0].words), note: `${fmt(w.longestChapters[0].words)} in the WEB` },
      { label: "Chapters ranked", value: fmt(bible.kjv.chapters), note: "every chapter" },
      { label: "Shortest chapter", value: k.shortestChapters[0].ref, note: `${k.shortestChapters[0].verses} verses` },
    ],
    tables: [
      { id: "kjv-verses", title: "The 10 longest chapters by verses, King James Version", intro: "Ranked by verse count, ties broken by words.", cols: chapterCols, rows: chapterRows(k.longestChapters) },
      { id: "kjv-words", title: "The 10 longest chapters by words, King James Version", intro: "A chapter with fewer verses can still hold more words.", cols: chapterCols, rows: chapterRows(k.longestChaptersByWords) },
      { id: "web", title: "The 10 longest chapters by verses, World English Bible", intro: "Verse counts match the KJV for these chapters; word counts differ.", cols: chapterCols, rows: chapterRows(w.longestChapters) },
    ],
    faqs: [
      { q: "What is the longest chapter in the Bible?", a: `${k.longestChapters[0].ref} in ${same(k.longestChapters[0], w.longestChapters[0]) ? "both the KJV and the WEB" : "the KJV"}: ${k.longestChapters[0].verses} verses, ${fmt(k.longestChapters[0].words)} words (KJV).` },
      { q: "What is the longest chapter in the New Testament?", a: `${k.ntLongestChapter.ref}, ${k.ntLongestChapter.verses} verses and ${fmt(k.ntLongestChapter.words)} words in the KJV${same(k.ntLongestChapter, w.ntLongestChapter) ? " (same in the WEB)" : `; in the WEB it is ${w.ntLongestChapter.ref}`}.` },
      { q: "Does the KJV or WEB change the answer?", a: same(k.longestChapters[0], w.longestChapters[0]) && same(k.longestChaptersByWords[0], w.longestChaptersByWords[0]) ? `No. ${k.longestChapters[0].ref} is first in both, by verses and by words.` : `Yes: ${note(k.longestChapters[0], w.longestChapters[0], "by verses")}` },
      { q: "What is the shortest chapter in the Bible?", a: `${k.shortestChapters[0].ref}, ${k.shortestChapters[0].verses} verses.` },
    ],
    related: ["shortest-chapter-in-the-bible", "longest-verse-in-the-bible", "longest-book-in-the-bible"],
  },
  "shortest-chapter-in-the-bible": {
    title: `Shortest Chapter in the Bible: ${k.shortestChapters[0].ref} (${k.shortestChapters[0].verses} Verses), Top 10`,
    h1: "What is the shortest chapter in the Bible?",
    answer: `The shortest chapter in the Bible is ${k.shortestChapters[0].ref}, with ${k.shortestChapters[0].verses} verses and ${k.shortestChapters[0].words} words in the King James Version (${w.shortestChapters[0].words} in the World English Bible). The next shortest by verses is ${k.shortestChapters[1].ref} (${k.shortestChapters[1].verses} verses, ${k.shortestChapters[1].words} words).`,
    description: `${k.shortestChapters[0].ref} is the shortest chapter in the Bible (${k.shortestChapters[0].verses} verses). The ten shortest chapters ranked by verses and words, counted from the full KJV and WEB text.`,
    tiles: [
      { label: "Shortest chapter", value: k.shortestChapters[0].ref, note: `${k.shortestChapters[0].verses} verses` },
      { label: "Words in it (KJV)", value: k.shortestChapters[0].words, note: `${w.shortestChapters[0].words} in the WEB` },
      { label: "Chapters ranked", value: fmt(bible.kjv.chapters), note: "every chapter" },
      { label: "Longest chapter", value: k.longestChapters[0].ref, note: `${k.longestChapters[0].verses} verses` },
    ],
    tables: [
      { id: "kjv", title: "The 10 shortest chapters, King James Version", intro: "Ranked by verse count, ties broken by words.", cols: chapterCols, rows: chapterRows(k.shortestChapters) },
      { id: "web", title: "The 10 shortest chapters, World English Bible", intro: "Same ranking on the WEB text.", cols: chapterCols, rows: chapterRows(w.shortestChapters) },
    ],
    faqs: [
      { q: "What is the shortest chapter in the Bible?", a: `${k.shortestChapters[0].ref}: ${k.shortestChapters[0].verses} verses, ${k.shortestChapters[0].words} words in the KJV.` },
      { q: "What is the shortest chapter in the New Testament?", a: `${k.ntShortestChapter.ref}, ${k.ntShortestChapter.verses} verses and ${k.ntShortestChapter.words} words in the KJV${same(k.ntShortestChapter, w.ntShortestChapter) ? " (same in the WEB)" : `; in the WEB it is ${w.ntShortestChapter.ref}`}.` },
      { q: "Do the KJV and WEB agree?", a: same(k.shortestChapters[0], w.shortestChapters[0]) ? `Yes on the top spot: ${k.shortestChapters[0].ref} in both.` : note(k.shortestChapters[0], w.shortestChapters[0], "by verses") },
      { q: "What is the longest chapter in the Bible?", a: `${k.longestChapters[0].ref} (${k.longestChapters[0].verses} verses).` },
    ],
    related: ["longest-chapter-in-the-bible", "shortest-verse-in-the-bible", "shortest-book-in-the-bible"],
  },
};
export const RANK_SLUGS = Object.keys(RANK_PAGES);

export const HOW_LONG = (() => {
  const SILENT = READING_WPM; // 238
  const ALOUD = 183;
  const PAGE = 250;
  const kw = bible.kjv.words;
  const ww = bible.web.words;
  return { SILENT, ALOUD, PAGE, kw, ww, kPages: Math.round(kw / PAGE), wPages: Math.round(ww / PAGE), kSilent: kw / SILENT, kAloud: kw / ALOUD, wSilent: ww / SILENT, wAloud: ww / ALOUD };
})();

export { sum, readingTime, SITE };
