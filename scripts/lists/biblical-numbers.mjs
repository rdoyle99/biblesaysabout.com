/* Biblical numbers: how often each number word 1-10, 12, 40, 70, 666 and 1,000 appears in the KJV and the WEB, the
   book where it is most frequent, the key verses each number is known for (every one checked against both texts), the
   phrases behind the famous numbers ("the third day", "forty days", "a thousand years"), the most frequent number word
   in the Bible, and how many of the big numbers are census totals.
   The counts use the same word rules as the /words pages (lib/data/bible-words.json); the build stops if seven, twelve,
   forty or 666 disagree with those pages, or if a cited verse lacks the words its row relies on.
   Writes lib/data/lists/biblical-numbers.json. Run: node scripts/lists/biblical-numbers.mjs */
import fs from "fs";
import path from "path";
import { must, mustWeb, countForms, countPhrase, fail, writeList, ROWS, norm, tokens, root, kjv } from "../lib/list-helpers.mjs";

/* ---------- the numbers and the forms counted for each ---------- */
// forms: the number word, its ordinal and its -fold form where English has one. The KJV also writes 70 as
// "threescore and ten", so that phrase is added to the KJV count for 70. 666 is counted as a phrase (as /words/666 does).
const NUMS = [
  { n: 1, slug: "one", forms: ["one", "first"] },
  { n: 2, slug: "two", forms: ["two", "second", "twofold"] },
  { n: 3, slug: "three", forms: ["three", "third", "threefold"] },
  { n: 4, slug: "four", forms: ["four", "fourth", "fourfold"] },
  { n: 5, slug: "five", forms: ["five", "fifth", "fivefold"] },
  { n: 6, slug: "six", forms: ["six", "sixth", "sixfold"] },
  { n: 7, slug: "seven", forms: ["seven", "seventh", "sevenfold"] },
  { n: 8, slug: "eight", forms: ["eight", "eighth", "eightfold"] },
  { n: 9, slug: "nine", forms: ["nine", "ninth"] },
  { n: 10, slug: "ten", forms: ["ten", "tenth", "tenfold"] },
  { n: 12, slug: "twelve", forms: ["twelve", "twelfth"] },
  { n: 40, slug: "forty", forms: ["forty", "fortieth"] },
  { n: 70, slug: "seventy", forms: ["seventy", "seventieth", "seventyfold"], kjvPhrase: /\bthreescore and ten\b/gi, kjvPhraseLabel: "threescore and ten" },
  { n: 666, slug: "666", phrase: { kjv: /\bsix hundred (?:and )?(?:threescore|sixty) and six\b/gi, web: /\bsix hundred sixty[- ]six\b/gi } },
  { n: 1000, slug: "thousand", forms: ["thousand", "thousands"] },
];

const VERSES = { kjv: ROWS.kjv.length, web: ROWS.web.length };
const revVerses = ROWS.kjv.filter((r) => r.book === "Revelation").length;

function byFormCounts(id, forms) {
  return Object.fromEntries(forms.map((f) => [f, countForms(id, [f]).total]).filter(([, c]) => c > 0));
}
function topBooks(byBook, k = 3) {
  return Object.entries(byBook)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([book, count]) => ({ book, count }));
}
function phraseByBook(id, re) {
  const byBook = {};
  let total = 0;
  let verses = 0;
  for (const r of ROWS[id]) {
    const m = norm(r.text).match(re);
    if (!m) continue;
    total += m.length;
    verses += 1;
    byBook[r.book] = (byBook[r.book] || 0) + m.length;
  }
  return { total, verses, byBook };
}

const counts = {};
for (const num of NUMS) {
  const out = { n: num.n, slug: num.slug };
  for (const id of ["kjv", "web"]) {
    let total = 0;
    let verses = 0;
    let byBook = {};
    let byForm = {};
    if (num.phrase) {
      const p = phraseByBook(id, num.phrase[id]);
      total = p.total;
      verses = p.verses;
      byBook = p.byBook;
      byForm = { phrase: p.total };
    } else {
      const c = countForms(id, num.forms);
      total = c.total;
      verses = c.verses;
      byBook = { ...c.byBook };
      byForm = byFormCounts(id, num.forms);
      if (id === "kjv" && num.kjvPhrase) {
        const p = phraseByBook("kjv", num.kjvPhrase);
        total += p.total;
        byForm[num.kjvPhraseLabel] = p.total;
        for (const [b, k] of Object.entries(p.byBook)) byBook[b] = (byBook[b] || 0) + k;
        // verses holding either the word or the phrase
        const set = new Set(num.forms);
        const once = new RegExp(num.kjvPhrase.source, "i");
        verses = ROWS.kjv.filter((r) => tokens(r.text).some((t) => set.has(t)) || once.test(norm(r.text))).length;
      }
    }
    const tops = topBooks(byBook);
    const tied = Object.entries(byBook).filter(([, k]) => k === tops[0].count).map(([b]) => b);
    out[id] = { total, verses, byForm, top: tops[0], tied, top3: tops, books: Object.keys(byBook).length, revelation: byBook.Revelation || 0, byBook };
  }
  counts[num.slug] = out;
}

/* ---------- agree with the /words pages ---------- */
const WORDS = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-words.json"), "utf8")).words;
const wordPages = {};
for (const slug of ["seven", "twelve", "forty", "666", "forty-days"]) {
  const w = WORDS.find((x) => x.slug === slug);
  if (!w) continue;
  wordPages[slug] = { kjvTotal: w.kjv.total, webTotal: w.web.total, kjvExact: w.kjv.exact, webExact: w.web.exact, kjvForms: w.kjvForms };
  if (counts[slug]) {
    if (counts[slug].kjv.total !== w.kjv.total || counts[slug].web.total !== w.web.total)
      fail(`${slug}: this page counts KJV ${counts[slug].kjv.total} / WEB ${counts[slug].web.total}, /words/${slug} says ${w.kjv.total} / ${w.web.total}`);
  }
}
const sevenExact = { kjv: countForms("kjv", ["seven"]), web: countForms("web", ["seven"]) };
if (sevenExact.kjv.total !== wordPages.seven.kjvExact || sevenExact.web.total !== wordPages.seven.webExact) fail("bare 'seven' disagrees with /words/seven");

/* ---------- key verses: each must hold the words its row relies on, in both translations ---------- */
function quote(ref, needle) {
  const text = norm(kjv.get(ref) || "");
  const i = text.toLowerCase().indexOf(norm(needle).toLowerCase());
  return text.slice(i, i + needle.length);
}
// [ref, KJV needle, WEB needle, what it is]
const KEY = {
  one: [
    ["Deuteronomy 6:4", "The LORD our God is one LORD", "Yahweh is one", "God is one"],
    ["Genesis 2:24", "they shall be one flesh", "they will be one flesh", "marriage: one flesh"],
    ["Ephesians 4:5", "One Lord, one faith, one baptism", "one Lord, one faith, one baptism", "one Lord, one faith, one baptism"],
  ],
  two: [
    ["Genesis 6:19", "two of every sort shalt thou bring into the ark", "two of every sort", "two of every kind into the ark"],
    ["Deuteronomy 19:15", "at the mouth of two witnesses", "At the mouth of two witnesses", "two or three witnesses"],
    ["Luke 10:1", "sent them two and two", "two by two", "the seventy sent out in pairs"],
  ],
  three: [
    ["Jonah 1:17", "three days and three nights", "three days and three nights", "Jonah in the fish"],
    ["Matthew 12:40", "three days and three nights in the heart of the earth", "three days and three nights in the heart of the earth", "Jesus points to Jonah"],
    ["1 Corinthians 15:4", "he rose again the third day", "raised on the third day", "raised on the third day"],
    ["Hosea 6:2", "in the third day he will raise us up", "On the third day he will raise us up", "the third day in Hosea"],
  ],
  four: [
    ["Genesis 2:10", "four heads", "four rivers", "the four rivers of Eden"],
    ["Ezekiel 1:6", "four faces", "four faces", "Ezekiel's living creatures, four faces and four wings"],
    ["Revelation 7:1", "four angels standing on the four corners of the earth, holding the four winds", "four angels standing at the four corners of the earth, holding the four winds", "four corners and four winds"],
  ],
  five: [
    ["1 Samuel 17:40", "five smooth stones", "five smooth stones", "David's five stones"],
    ["Matthew 14:17", "five loaves, and two fishes", "five loaves and two fish", "five loaves and two fish"],
    ["Matthew 25:2", "five of them were wise, and five were foolish", "Five of them were foolish, and five were wise", "five wise and five foolish virgins"],
  ],
  six: [
    ["Genesis 1:31", "the sixth day", "a sixth day", "man made on the sixth day (Genesis 1:27-31)"],
    ["Exodus 20:9", "Six days shalt thou labour", "You shall labor six days", "six days of work"],
    ["1 Samuel 17:4", "six cubits and a span", "six cubits and a span", "Goliath's height"],
  ],
  seven: [
    ["Genesis 2:2", "on the seventh day God ended his work", "On the seventh day God finished his work", "God rests on the seventh day"],
    ["Genesis 2:3", "God blessed the seventh day, and sanctified it", "God blessed the seventh day, and made it holy", "the seventh day blessed"],
    ["Revelation 1:11", "send it unto the seven churches which are in Asia", "send to the seven assemblies", "the seven churches"],
    ["Revelation 5:1", "sealed with seven seals", "sealed shut with seven seals", "the seven seals"],
    ["Revelation 8:2", "to them were given seven trumpets", "seven trumpets were given to them", "the seven trumpets"],
    ["Revelation 15:7", "seven golden vials full of the wrath of God", "seven golden bowls full of the wrath of God", "the seven bowls (KJV: vials)"],
    ["Matthew 18:22", "Until seventy times seven", "until seventy times seven", "forgive seventy times seven"],
  ],
  eight: [
    ["1 Peter 3:20", "eight souls were saved by water", "eight souls, were saved through water", "eight people in the ark"],
    ["Genesis 17:12", "he that is eight days old shall be circumcised", "He who is eight days old will be circumcised", "circumcision at eight days"],
    ["Luke 2:21", "when eight days were accomplished for the circumcising of the child, his name was called JESUS", "When eight days were fulfilled for the circumcision of the child, his name was called Jesus", "Jesus circumcised and named"],
  ],
  nine: [
    ["Luke 17:17", "where are the nine", "But where are the nine", "the nine lepers who did not return"],
    ["Matthew 27:46", "about the ninth hour Jesus cried with a loud voice", "About the ninth hour Jesus cried with a loud voice", "the ninth hour on the cross"],
    ["Acts 3:1", "the hour of prayer, being the ninth hour", "the hour of prayer, the ninth hour", "the hour of prayer"],
  ],
  ten: [
    ["Exodus 34:28", "the ten commandments", "the ten commandments", "the Ten Commandments"],
    ["Genesis 18:32", "Peradventure ten shall be found there", "What if ten are found there", "ten righteous in Sodom"],
    ["Matthew 25:1", "ten virgins", "ten virgins", "the ten virgins"],
    ["Luke 17:12", "ten men that were lepers", "ten men who were lepers", "the ten lepers"],
  ],
  twelve: [
    ["Genesis 49:28", "All these are the twelve tribes of Israel", "All these are the twelve tribes of Israel", "the twelve tribes"],
    ["Matthew 10:2", "the names of the twelve apostles are these", "the names of the twelve apostles are these", "the twelve apostles"],
    ["Revelation 21:12", "had twelve gates", "having twelve gates", "the twelve gates of the new Jerusalem"],
    ["Revelation 21:14", "twelve foundations, and in them the names of the twelve apostles of the Lamb", "twelve foundations, and on them twelve names of the twelve Apostles of the Lamb", "the twelve foundations"],
  ],
  forty: [
    ["Genesis 7:12", "the rain was upon the earth forty days and forty nights", "It rained on the earth forty days and forty nights", "the flood rain"],
    ["Exodus 24:18", "Moses was in the mount forty days and forty nights", "Moses was on the mountain forty days and forty nights", "Moses on the mountain"],
    ["Numbers 14:33", "your children shall wander in the wilderness forty years", "wanderers in the wilderness forty years", "Israel's forty years in the wilderness"],
    ["Numbers 14:34", "each day for a year", "for every day a year", "a year for each day of the spying"],
    ["Matthew 4:2", "when he had fasted forty days and forty nights", "When he had fasted forty days and forty nights", "Jesus' fast in the wilderness"],
    ["Acts 1:3", "being seen of them forty days", "over a period of forty days", "forty days before the ascension"],
  ],
  seventy: [
    ["Jeremiah 25:11", "serve the king of Babylon seventy years", "serve the king of Babylon seventy years", "seventy years of exile"],
    ["Daniel 9:24", "Seventy weeks are determined upon thy people", "Seventy weeks are decreed on your people", "Daniel's seventy weeks"],
    ["Numbers 11:16", "Gather unto me seventy men of the elders of Israel", "Gather to me seventy men of the elders of Israel", "the seventy elders"],
    ["Luke 10:1", "the Lord appointed other seventy also", "the Lord also appointed seventy others", "the seventy sent by Jesus"],
    ["Psalms 90:10", "threescore years and ten", "seventy", "a lifetime of seventy years"],
  ],
  666: [
    ["Revelation 13:18", "count the number of the beast: for it is the number of a man; and his number is Six hundred threescore and six", "His number is six hundred sixty-six", "the number of the beast"],
    ["1 Kings 10:14", "six hundred threescore and six talents of gold", "six hundred sixty-six talents of gold", "Solomon's gold in one year"],
    ["2 Chronicles 9:13", "six hundred and threescore and six talents of gold", "six hundred sixty-six talents of gold", "the same gold, in Chronicles"],
    ["Ezra 2:13", "The children of Adonikam, six hundred sixty and six", "The children of Adonikam, six hundred sixty-six", "a family that returned from exile"],
  ],
  thousand: [
    ["Revelation 20:2", "bound him a thousand years", "bound him for a thousand years", "Satan bound a thousand years"],
    ["Revelation 20:4", "reigned with Christ a thousand years", "reigned with Christ for a thousand years", "the saints reign a thousand years"],
    ["Psalms 90:4", "a thousand years in thy sight are but as yesterday", "a thousand years in your sight are just like yesterday", "a thousand years like yesterday"],
    ["2 Peter 3:8", "one day is with the Lord as a thousand years, and a thousand years as one day", "one day is with the Lord as a thousand years, and a thousand years as one day", "a day as a thousand years"],
    ["Psalms 50:10", "the cattle upon a thousand hills", "the livestock on a thousand hills", "the cattle on a thousand hills"],
  ],
};
const key = {};
let checks = 0;
for (const [slug, rows] of Object.entries(KEY)) {
  key[slug] = rows.map(([ref, kn, wn, what]) => {
    must(ref, kn);
    mustWeb(ref, wn);
    checks += 2;
    return { ref, what, kjv: quote(ref, kn), web: wn };
  });
}
// supporting checks used in the copy
must("Genesis 1:27", "God created man in his own image");
must("Deuteronomy 3:11", "nine cubits was the length thereof");
mustWeb("Deuteronomy 3:11", "Nine cubits was its length");
must("Revelation 16:1", "pour out the vials of the wrath of God");
mustWeb("Revelation 16:1", "pour out the seven bowls of the wrath of God");
must("Revelation 1:20", "The seven stars are the angels of the seven churches");
must("2 Peter 2:5", "saved Noah the eighth person");
mustWeb("2 Peter 2:5", "preserved Noah with seven others");
must("Leviticus 12:3", "in the eighth day the flesh of his foreskin shall be circumcised");
must("Mark 8:31", "after three days rise again");
must("Luke 24:46", "to rise from the dead the third day");
must("Revelation 7:4", "an hundred and forty and four thousand");
must("Revelation 7:5", "Of the tribe of Juda were sealed twelve thousand");
must("Revelation 13:17", "the number of his name");
must("Genesis 4:24", "Lamech seventy and sevenfold");
must("1 Kings 19:8", "forty days and forty nights unto Horeb");
must("Jonah 3:4", "Yet forty days, and Nineveh shall be overthrown");
must("Exodus 20:10", "the seventh day is the sabbath of the LORD thy God");
must("Leviticus 25:8", "seven times seven years", "forty and nine years");
must("Revelation 21:21", "the twelve gates were twelve pearls");
must("Numbers 31:38", "threescore and twelve");
mustWeb("Numbers 31:38", "seventy-two");
mustWeb("Psalms 90:10", "The days of our years are seventy");

/* ---------- phrases behind the famous numbers ---------- */
const P = (re) => ({ kjv: countPhrase("kjv", re), web: countPhrase("web", re) });
const phrases = {
  thirdDay: P(/\bthird day\b/gi),
  threeDays: P(/\bthree days\b/gi),
  fortyDays: P(/\bforty days\b/gi),
  fortyYears: P(/\bforty years\b/gi),
  fortyDaysAndNights: P(/\bforty days and forty nights\b/gi),
  seventhDay: P(/\bseventh day\b/gi),
  sevenDays: P(/\bseven days\b/gi),
  eighthDay: P(/\beighth day\b/gi),
  twelveTribes: P(/\btwelve tribes\b/gi),
  seventyYears: { kjv: countPhrase("kjv", /\b(?:seventy years|threescore (?:years )?and ten years|threescore years and ten)\b/gi), web: countPhrase("web", /\bseventy years\b/gi) },
  thousandYears: P(/\bthousand years\b/gi),
  tenCommandments: P(/\bten commandments\b/gi),
  tenPlagues: P(/\bten plagues\b/gi),
  sevenChurches: { kjv: countPhrase("kjv", /\bseven churches\b/gi), web: countPhrase("web", /\bseven assemblies\b/gi) },
  sevenTimesSeven: P(/\bseventy times seven\b/gi),
};
const thirdDayNT = { kjv: countPhrase("kjv", /\bthird day\b/gi, (r) => r.testament === "NT"), web: countPhrase("web", /\bthird day\b/gi, (r) => r.testament === "NT") };
const thousandYearsRev20 = { kjv: countPhrase("kjv", /\bthousand years\b/gi, (r) => r.book === "Revelation" && r.ch === 20), web: countPhrase("web", /\bthousand years\b/gi, (r) => r.book === "Revelation" && r.ch === 20) };
if (thousandYearsRev20.kjv.total !== 6 || thousandYearsRev20.web.total !== 6) fail(`Revelation 20 "thousand years": KJV ${thousandYearsRev20.kjv.total}, WEB ${thousandYearsRev20.web.total}, expected 6`);
if (phrases.fortyDays.kjv.total !== wordPages["forty-days"].kjvTotal || phrases.fortyDays.web.total !== wordPages["forty-days"].webTotal) fail("'forty days' disagrees with /words/forty-days");
if (phrases.tenPlagues.kjv.total !== 0 || phrases.tenPlagues.web.total !== 0) fail("'ten plagues' was expected to be absent from both texts");
const sevenInRev = { kjv: countForms("kjv", ["seven"], (r) => r.book === "Revelation").total, web: countForms("web", ["seven"], (r) => r.book === "Revelation").total };

/* ---------- most frequent number word ---------- */
const CARDINALS = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred", "thousand", "score", "threescore", "fourscore"];
const ranking = {};
for (const id of ["kjv", "web"]) ranking[id] = CARDINALS.map((w) => ({ word: w, count: countForms(id, [w]).total })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count);
// how much of "one" is a pronoun phrase rather than a count
const oneIdioms = {};
for (const id of ["kjv", "web"]) {
  const r = (re) => countPhrase(id, re).total;
  oneIdioms[id] = { oneAnother: r(/\bone another\b/gi), everyOne: r(/\bevery one\b/gi), theOne: r(/\bthe one\b/gi), noOne: id === "web" ? r(/\bno one\b/gi) : r(/\bno one\b/gi), anyOne: r(/\bany one\b/gi) };
}

/* ---------- limits: the big numbers are mostly tallies ---------- */
const thou = counts.thousand.kjv;
const tallyBooks = ["Numbers", "1 Chronicles", "2 Chronicles"];
const thouTally = tallyBooks.reduce((s, b) => s + (thou.byBook[b] || 0), 0);
const census = countForms("kjv", ["thousand", "thousands"], (r) => r.book === "Numbers" && [1, 2, 26].includes(r.ch)).total;
const censusWeb = countForms("web", ["thousand", "thousands"], (r) => r.book === "Numbers" && [1, 2, 26].includes(r.ch)).total;
must("Numbers 1:46", "six hundred thousand and three thousand and five hundred and fifty");
must("Numbers 26:51", "six hundred thousand and a thousand seven hundred and thirty");
const twelveNum7 = countForms("kjv", ["twelve", "twelfth"], (r) => r.book === "Numbers" && r.ch === 7).total;
must("Numbers 7:87", "twelve bullocks, the rams twelve, the lambs of the first year twelve");
const sevenLev = counts.seven.kjv.byBook.Leviticus;
// "one" leads in Numbers because of Numbers 7: twelve princes each bring "one silver charger ... one silver bowl"
const oneNum7 = countForms("kjv", ["one"], (r) => r.book === "Numbers" && r.ch === 7).total;
must("Numbers 7:13", "one silver charger", "one silver bowl of seventy shekels");
must("Numbers 7:78", "On the twelfth day");
must("Numbers 7:84", "twelve chargers of silver, twelve silver bowls");
// Leviticus leads for seven through its seven-day laws; Nehemiah leads for eight through the list of returning families (chapter 7)
const sevenDaysLev = countPhrase("kjv", /\bseven days\b/gi, (r) => r.book === "Leviticus").total;
const eightNeh7 = countForms("kjv", ["eight", "eighth"], (r) => r.book === "Nehemiah" && r.ch === 7).total;
must("Nehemiah 7:5", "a register of the genealogy of them which came up at the first");
// 1 Chronicles leads for twelve because of its rosters of priests, singers and army courses (chapters 24-27)
const twelve1Chr = countForms("kjv", ["twelve", "twelfth"], (r) => r.book === "1 Chronicles" && r.ch >= 24 && r.ch <= 27).total;
must("1 Chronicles 24:12", "the twelfth to Jakim");
must("1 Chronicles 25:19", "The twelfth to Hashabiah");
must("1 Chronicles 27:15", "The twelfth captain for the twelfth month");

/* ---------- Bullinger's 1894 counts of seven (Old Testament) beside ours ---------- */
const ot = (r) => r.testament === "OT";
const bullinger = {
  his: { seven: 287, seventh: 98, sevenfold: 7, seventy: 56 },
  ours: {
    kjv: { seven: countForms("kjv", ["seven"], ot).total, seventh: countForms("kjv", ["seventh"], ot).total, sevenfold: countForms("kjv", ["sevenfold"], ot).total, seventy: countForms("kjv", ["seventy"], ot).total },
    web: { seven: countForms("web", ["seven"], ot).total, seventh: countForms("web", ["seventh"], ot).total, sevenfold: countForms("web", ["sevenfold"], ot).total, seventy: countForms("web", ["seventy"], ot).total },
  },
};

/* ---------- table ---------- */
const table = NUMS.map((num) => {
  const c = counts[num.slug];
  return {
    n: num.n,
    slug: num.slug,
    forms: num.phrase ? ["six hundred threescore and six (KJV)", "six hundred sixty-six (WEB)"] : num.forms.filter((f) => c.kjv.byForm[f] || c.web.byForm[f]).concat(num.kjvPhrase ? [`${num.kjvPhraseLabel} (KJV)`] : []),
    kjv: c.kjv.total,
    web: c.web.total,
    kjvVerses: c.kjv.verses,
    webVerses: c.web.verses,
    kjvByForm: c.kjv.byForm,
    webByForm: c.web.byForm,
    top: c.kjv.top,
    tied: c.kjv.tied,
    webTop: c.web.top,
    top3: c.kjv.top3,
    books: c.kjv.books,
    revelation: { kjv: c.kjv.revelation, web: c.web.revelation },
  };
});
const sum = (k) => table.reduce((s, r) => s + r[k], 0);
const notOne = table.filter((r) => r.n !== 1).sort((a, b) => b.kjv - a.kjv);

writeList("biblical-numbers", {
  generated: "2026-10-26",
  verses: VERSES,
  revVerses,
  table,
  totals: { kjv: sum("kjv"), web: sum("web") },
  mostAfterOne: { slug: notOne[0].slug, n: notOne[0].n, kjv: notOne[0].kjv, web: notOne[0].web },
  key,
  checks,
  phrases: Object.fromEntries(Object.entries(phrases).map(([k, v]) => [k, { kjv: v.kjv.total, web: v.web.total, kjvRefs: v.kjv.refs.length <= 12 ? v.kjv.refs : undefined }])),
  thirdDayNT: { kjv: thirdDayNT.kjv.total, web: thirdDayNT.web.total },
  thousandYearsRev20: { kjv: thousandYearsRev20.kjv.total, refs: thousandYearsRev20.kjv.refs },
  sevenInRev,
  sevenExact: { kjv: sevenExact.kjv.total, web: sevenExact.web.total, kjvTop: sevenExact.kjv.top, webTop: sevenExact.web.top },
  ranking: { kjv: ranking.kjv.slice(0, 8), web: ranking.web.slice(0, 8) },
  oneIdioms,
  limits: { thousandKjv: thou.total, tallyBooks, thousandInTallyBooks: thouTally, census, censusWeb, twelveNum7, twelveKjv: counts.twelve.kjv.total, sevenLev, sevenDaysLev, eightNeh7, eightNeh: counts.eight.kjv.byBook.Nehemiah, oneNum7, oneKjvNumbers: counts.one.kjv.byBook.Numbers, oneBare: counts.one.kjv.byForm.one, twelve1Chr, twelve1ChrAll: counts.twelve.kjv.byBook["1 Chronicles"], sevenKjv: counts.seven.kjv.total },
  bullinger,
  wordPages,
});

for (const r of table) console.log(String(r.n).padStart(4), r.slug.padEnd(9), "KJV", String(r.kjv).padStart(5), "WEB", String(r.web).padStart(5), "| top", r.top.book, r.top.count, r.tied.length > 1 ? `(tied ${r.tied.join(", ")})` : "", "| WEB top", r.webTop.book, r.webTop.count, "| Rev", r.revelation.kjv, JSON.stringify(r.kjvByForm));
console.log("ranking KJV", ranking.kjv.slice(0, 8).map((x) => `${x.word} ${x.count}`).join(", "));
console.log("ranking WEB", ranking.web.slice(0, 8).map((x) => `${x.word} ${x.count}`).join(", "));
console.log("one idioms", JSON.stringify(oneIdioms));
console.log("phrases", JSON.stringify(Object.fromEntries(Object.entries(phrases).map(([k, v]) => [k, [v.kjv.total, v.web.total]]))));
console.log("third day NT", thirdDayNT.kjv.total, thirdDayNT.web.total, "| seven in Rev", sevenInRev, "of", sevenExact.kjv.total, sevenExact.web.total, "| Rev verses", revVerses, "of", VERSES.kjv);
console.log("thousand", thou.total, "in Numbers+Chronicles", thouTally, "census chapters", census, censusWeb, "| twelve in Num 7", twelveNum7, "| seven in Leviticus", sevenLev);
console.log("Bullinger OT seven/seventh/sevenfold/seventy", JSON.stringify(bullinger));
console.log("checks", checks);
