/* The days of creation: Genesis 1:1 to 2:3 day by day in the KJV and WEB, what each day makes, its verses and word counts,
   and the refrains counted per day ("God said", "it was good", "evening and morning", "after his kind").
   Every quoted phrase is checked against its verse in BOTH translations, and each day's range must open with the verse that
   starts it and close with its "evening and morning" line (the seventh day has none, and the build checks that too).
   Writes lib/data/lists/days-of-creation.json. Run: node scripts/lists/days-of-creation.mjs */
import { must, mustWeb, fail, writeList, verseRows, tokens, norm } from "../lib/list-helpers.mjs";

/* ---------- the days: ranges, what is made, and the phrase in each translation that says so ---------- */
const DAYS = [
  {
    n: 1, ch: 1, from: 3, to: 5, made: "Light, separated from darkness: day and night", short: "Light",
    kjv: [["Genesis 1:3", "Let there be light: and there was light"], ["Genesis 1:5", "God called the light Day, and the darkness he called Night"]],
    web: [["Genesis 1:3", "Let there be light"], ["Genesis 1:5", "God called the light “day”, and the darkness he called “night”"]],
  },
  {
    n: 2, ch: 1, from: 6, to: 8, made: "The sky: the firmament (KJV) or expanse (WEB) between the waters above and below", short: "Sky",
    kjv: [["Genesis 1:6", "Let there be a firmament in the midst of the waters"], ["Genesis 1:8", "God called the firmament Heaven"]],
    web: [["Genesis 1:6", "Let there be an expanse in the middle of the waters"], ["Genesis 1:8", "God called the expanse “sky”"]],
  },
  {
    n: 3, ch: 1, from: 9, to: 13, made: "Dry land and seas, then grass, seed plants and fruit trees", short: "Land, seas and plants",
    kjv: [["Genesis 1:9", "let the dry land appear"], ["Genesis 1:10", "the gathering together of the waters called he Seas"], ["Genesis 1:11", "Let the earth bring forth grass, the herb yielding seed, and the fruit tree"]],
    web: [["Genesis 1:9", "let the dry land appear"], ["Genesis 1:10", "the gathering together of the waters he called “seas”"], ["Genesis 1:11", "Let the earth yield grass, herbs yielding seeds, and fruit trees"]],
  },
  {
    n: 4, ch: 1, from: 14, to: 19, made: "The sun, moon and stars: \"two great lights\" and the stars, for signs, seasons, days and years", short: "Sun, moon and stars",
    kjv: [["Genesis 1:14", "Let there be lights in the firmament of the heaven", "for signs, and for seasons, and for days, and years"], ["Genesis 1:16", "God made two great lights", "he made the stars also"]],
    web: [["Genesis 1:14", "Let there be lights in the expanse of the sky"], ["Genesis 1:16", "God made the two great lights", "He also made the stars"]],
  },
  {
    n: 5, ch: 1, from: 20, to: 23, made: "Sea creatures and birds, blessed to be fruitful and multiply", short: "Sea creatures and birds",
    kjv: [["Genesis 1:21", "God created great whales", "every winged fowl after his kind"], ["Genesis 1:22", "Be fruitful, and multiply, and fill the waters in the seas"]],
    web: [["Genesis 1:21", "God created the large sea creatures", "every winged bird after its kind"], ["Genesis 1:22", "Be fruitful, and multiply, and fill the waters in the seas"]],
  },
  {
    n: 6, ch: 1, from: 24, to: 31, made: "Land animals (cattle, creeping things, wild beasts), then man and woman in God's image, given plants for food", short: "Land animals and people",
    kjv: [["Genesis 1:24", "cattle, and creeping thing, and beast of the earth"], ["Genesis 1:27", "So God created man in his own image", "male and female created he them"], ["Genesis 1:29", "every herb bearing seed"]],
    web: [["Genesis 1:24", "livestock, creeping things, and animals of the earth"], ["Genesis 1:27", "God created man in his own image", "male and female he created them"], ["Genesis 1:29", "every herb yielding seed"]],
  },
  {
    n: 7, ch: 2, from: 1, to: 3, made: "Nothing new: God finished his work, rested, and blessed the seventh day and made it holy", short: "Rest",
    kjv: [["Genesis 2:2", "on the seventh day God ended his work", "he rested on the seventh day from all his work"], ["Genesis 2:3", "God blessed the seventh day, and sanctified it"]],
    web: [["Genesis 2:2", "On the seventh day God finished his work", "he rested on the seventh day from all his work"], ["Genesis 2:3", "God blessed the seventh day, and made it holy"]],
  },
];

const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth"];
const inRange = (d) => (r) => r.ch === d.ch && r.v >= d.from && r.v <= d.to;
const count = (text, re) => (norm(text).match(re) || []).length;

// refrains: one regex per translation (case-insensitive; "God said" also catches "God said unto them" / "God said to them")
const REFRAINS = {
  said: { kjv: /\bGod said\b/gi, web: /\bGod said\b/gi },
  good: { kjv: /\bit was (very )?good\b/gi, web: /\bit was (very )?good\b/gi },
  eveningMorning: { kjv: /the evening and the morning were/gi, web: /there was evening and there was morning/gi },
  kind: { kjv: /\bafter (his|their) kind\b/gi, web: /\bafter (its|their) kind\b/gi },
  wasSo: { kjv: /\band it was so\b/gi, web: /\band it was so\b/gi },
};

const days = DAYS.map((d) => {
  for (const [ref, ...needles] of d.kjv) must(ref, ...needles);
  for (const [ref, ...needles] of d.web) mustWeb(ref, ...needles);
  const k = verseRows("kjv", "Genesis", d.ch, d.ch).filter(inRange(d));
  const w = verseRows("web", "Genesis", d.ch, d.ch).filter(inRange(d));
  if (k.length !== d.to - d.from + 1 || w.length !== k.length) fail(`day ${d.n}: verse count KJV ${k.length}, WEB ${w.length}, expected ${d.to - d.from + 1}`);
  const kt = k.map((r) => r.text).join(" ");
  const wt = w.map((r) => r.text).join(" ");
  const last = `Genesis ${d.ch}:${d.to}`;
  if (d.n <= 6) {
    // the day closes with its own evening-and-morning line: KJV "the first day", WEB "the first day" or "a second day"
    must(last, `the evening and the morning were the ${ORD[d.n]} day`);
    mustWeb(last, "There was evening and there was morning", `${d.n === 1 ? "the" : "a"} ${ORD[d.n]} day`);
    if (d.n > 1) must(`Genesis 1:${d.from}`, "God said");
  } else if (count(kt, REFRAINS.eveningMorning.kjv) || count(wt, REFRAINS.eveningMorning.web)) fail("day 7 should have no evening-and-morning line");
  const refr = Object.fromEntries(Object.entries(REFRAINS).map(([key, re]) => [key, { kjv: count(kt, re.kjv), web: count(wt, re.web) }]));
  for (const [key, v] of Object.entries(refr)) if (v.kjv !== v.web) console.warn(`note: day ${d.n} ${key} KJV ${v.kjv} vs WEB ${v.web}`);
  return {
    n: d.n,
    short: d.short,
    made: d.made,
    passage: d.from === d.to ? `Genesis ${d.ch}:${d.from}` : `Genesis ${d.ch}:${d.from}-${d.to}`,
    verses: k.length,
    kjvWords: tokens(kt).length,
    webWords: tokens(wt).length,
    refrains: refr,
    kjvQuote: { ref: d.kjv[0][0], text: d.kjv[0][1] },
    webQuote: { ref: d.web[0][0], text: d.web[0][1] },
  };
});

/* ---------- the opening (1:1-2), before the first day ---------- */
const opening = {
  kjv: must("Genesis 1:1", "In the beginning God created the heaven and the earth"),
  kjv2: must("Genesis 1:2", "without form, and void"),
  web: mustWeb("Genesis 1:1", "In the beginning, God created the heavens and the earth"),
  web2: mustWeb("Genesis 1:2", "formless and empty"),
};
const openK = verseRows("kjv", "Genesis", 1, 1).filter((r) => r.v <= 2);
const openW = verseRows("web", "Genesis", 1, 1).filter((r) => r.v <= 2);
const openingWords = { kjv: tokens(openK.map((r) => r.text).join(" ")).length, web: tokens(openW.map((r) => r.text).join(" ")).length };

/* ---------- totals and the shape of the week ---------- */
const sum = (f) => days.reduce((s, d) => s + f(d), 0);
const totals = {
  verses: sum((d) => d.verses) + openK.length,
  kjvWords: sum((d) => d.kjvWords) + openingWords.kjv,
  webWords: sum((d) => d.webWords) + openingWords.web,
  said: { kjv: sum((d) => d.refrains.said.kjv), web: sum((d) => d.refrains.said.web) },
  good: { kjv: sum((d) => d.refrains.good.kjv), web: sum((d) => d.refrains.good.web) },
  eveningMorning: { kjv: sum((d) => d.refrains.eveningMorning.kjv), web: sum((d) => d.refrains.eveningMorning.web) },
  kind: { kjv: sum((d) => d.refrains.kind.kjv), web: sum((d) => d.refrains.kind.web) },
  wasSo: { kjv: sum((d) => d.refrains.wasSo.kjv), web: sum((d) => d.refrains.wasSo.web) },
};
if (totals.eveningMorning.kjv !== 6 || totals.eveningMorning.web !== 6) fail(`evening and morning should close six days: KJV ${totals.eveningMorning.kjv}, WEB ${totals.eveningMorning.web}`);
// "very good" only on day 6
must("Genesis 1:31", "it was very good");
mustWeb("Genesis 1:31", "it was very good");
const noGood = days.filter((d) => d.n <= 6 && d.refrains.good.kjv === 0).map((d) => d.n);
const sixDays = days.filter((d) => d.n <= 6);
const longest = [...days].sort((a, b) => b.kjvWords - a.kjvWords)[0];
const shortest = [...days].sort((a, b) => a.kjvWords - b.kjvWords)[0];
const forming = days.filter((d) => d.n <= 3);
const filling = days.filter((d) => d.n >= 4 && d.n <= 6);
const half = { formingKjv: forming.reduce((s, d) => s + d.kjvWords, 0), fillingKjv: filling.reduce((s, d) => s + d.kjvWords, 0) };
const day6Share = longest.kjvWords / sum((d) => d.kjvWords);

/* ---------- the second account (Genesis 2:4-25) and the sabbath verses ---------- */
const second = {
  open: must("Genesis 2:4", "These are the generations of the heavens and of the earth when they were created"),
  openWeb: mustWeb("Genesis 2:4", "the generations of the heavens and of the earth when they were created"),
  man: must("Genesis 2:7", "the LORD God formed man of the dust of the ground"),
  garden: must("Genesis 2:8", "the LORD God planted a garden eastward in Eden"),
  woman: must("Genesis 2:22", "the rib, which the LORD God had taken from man, made he a woman"),
};
const secK = verseRows("kjv", "Genesis", 2, 2).filter((r) => r.v >= 4 && r.v <= 25);
const secW = verseRows("web", "Genesis", 2, 2).filter((r) => r.v >= 4 && r.v <= 25);
if (secK.length !== 22 || secW.length !== 22) fail(`Genesis 2:4-25 should be 22 verses: KJV ${secK.length}, WEB ${secW.length}`);
const secondWords = { kjv: tokens(secK.map((r) => r.text).join(" ")).length, web: tokens(secW.map((r) => r.text).join(" ")).length, verses: secK.length };
const lordGodKjv = count(secK.map((r) => r.text).join(" "), /\bLORD God\b/g);
const lordGodGen1 = count(verseRows("kjv", "Genesis", 1, 1).map((r) => r.text).join(" "), /\bLORD\b/g);

const sabbath = {
  ex2011: must("Exodus 20:11", "For in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day", "blessed the sabbath day, and hallowed it"),
  ex2011web: mustWeb("Exodus 20:11", "for in six days Yahweh made heaven and earth, the sea, and all that is in them, and rested the seventh day", "blessed the Sabbath day, and made it holy"),
  ex3117: must("Exodus 31:17", "in six days the LORD made heaven and earth, and on the seventh day he rested, and was refreshed"),
  heb44: must("Hebrews 4:4", "God did rest the seventh day from all his works"),
  heb44web: mustWeb("Hebrews 4:4", "God rested on the seventh day from all his works"),
};

writeList("days-of-creation", {
  generated: "2026-11-02",
  days,
  opening: { refs: "Genesis 1:1-2", verses: openK.length, words: openingWords, quote: opening },
  totals,
  noGood,
  longest: { n: longest.n, short: longest.short, kjvWords: longest.kjvWords, webWords: longest.webWords, share: day6Share },
  shortest: { n: shortest.n, short: shortest.short, kjvWords: shortest.kjvWords, webWords: shortest.webWords },
  half,
  second: { refs: "Genesis 2:4-25", ...secondWords, lordGodKjv, lordInGenesis1Kjv: lordGodGen1, quote: second },
  sabbath,
  sixDaysVerses: sixDays.reduce((s, d) => s + d.verses, 0),
});

console.log(days.map((d) => `day ${d.n} ${d.passage}: ${d.verses} v, ${d.kjvWords} KJV / ${d.webWords} WEB words; said ${d.refrains.said.kjv}/${d.refrains.said.web}, good ${d.refrains.good.kjv}/${d.refrains.good.web}, kind ${d.refrains.kind.kjv}/${d.refrains.kind.web}, so ${d.refrains.wasSo.kjv}/${d.refrains.wasSo.web}`).join("\n"));
console.log("opening", openingWords, "totals", JSON.stringify(totals));
console.log("no 'good' on day", noGood.join(","), "| longest day", longest.n, longest.kjvWords, `(${(day6Share * 100).toFixed(0)}% of the seven days)`, "| shortest", shortest.n, shortest.kjvWords);
console.log("forming days 1-3", half.formingKjv, "words, filling days 4-6", half.fillingKjv);
console.log("second account", secondWords, "'LORD God' in 2:4-25 (KJV)", lordGodKjv, "| 'LORD' in Genesis 1 (KJV)", lordGodGen1);
