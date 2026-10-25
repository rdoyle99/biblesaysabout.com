/* How old was Methuselah: Genesis 5:27 in the KJV and WEB, the sum that puts his death in the year of the flood
   (Genesis 5:25, 5:28, 7:6), and a table of everyone the Bible gives an age at death or a whole lifespan for.
   Each age is read from the verse in BOTH translations: the number words in the KJV and in the WEB are parsed to an
   integer and must equal the value in the row, so a typo in the table or a wrong verse stops the build.
   Writes lib/data/lists/how-old-was-methuselah.json. Run: node scripts/lists/how-old-was-methuselah.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList, ROWS, norm } from "../lib/list-helpers.mjs";

/* ---------- number words to integers (KJV "an hundred threescore and fifteen", WEB "one hundred seventy-five") ---------- */
const UNITS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, score: 20, threescore: 60, fourscore: 80 };
function parseNumber(phrase) {
  const toks = norm(phrase).toLowerCase().replace(/-/g, " ").match(/[a-z]+/g) || [];
  let total = 0;
  let cur = 0;
  let seen = false;
  toks.forEach((t, i) => {
    if (t === "and") return;
    if ((t === "an" || t === "a") && toks[i + 1] === "hundred") {
      cur += 1;
      seen = true;
    } else if (t === "hundred") {
      total += (cur || 1) * 100;
      cur = 0;
      seen = true;
    } else if (t in UNITS) {
      cur += UNITS[t];
      seen = true;
    } else fail(`number phrase "${phrase}" has an unknown word "${t}"`);
  });
  if (!seen) fail(`no number in "${phrase}"`);
  return total + cur;
}
/** the verse must hold the number phrase in both translations, and both phrases must parse to the value */
function age(value, ref, kjvPhrase, webPhrase, ...kjvExtra) {
  must(ref, kjvPhrase, ...kjvExtra);
  mustWeb(ref, webPhrase);
  const k = parseNumber(kjvPhrase);
  const w = parseNumber(webPhrase);
  if (k !== value || w !== value) fail(`${ref}: row says ${value}, KJV "${kjvPhrase}" = ${k}, WEB "${webPhrase}" = ${w}`);
  return value;
}

/* ---------- Methuselah ---------- */
const key = {
  kjv: must("Genesis 5:27", "all the days of Methuselah were nine hundred sixty and nine years: and he died"),
  web: mustWeb("Genesis 5:27", "All the days of Methuselah were nine hundred sixty-nine years, then he died"),
};
const METHUSELAH = age(969, "Genesis 5:27", "nine hundred sixty and nine", "nine hundred sixty-nine");

// the flood-year sum: Methuselah at Lamech's birth + Lamech at Noah's birth + Noah at the flood
const atLamech = age(187, "Genesis 5:25", "an hundred eighty and seven", "one hundred eighty-seven", "Methuselah lived", "begat Lamech");
const afterLamech = age(782, "Genesis 5:26", "seven hundred eighty and two", "seven hundred eighty-two", "after he begat Lamech");
const lamechAtNoah = age(182, "Genesis 5:28", "an hundred eighty and two", "one hundred eighty-two", "Lamech lived", "begat a son");
must("Genesis 5:29", "called his name Noah");
const noahAtFlood = age(600, "Genesis 7:6", "six hundred", "six hundred", "Noah was six hundred years old when the flood of waters was upon the earth");
must("Genesis 7:11", "In the six hundredth year of Noah's life");
mustWeb("Genesis 7:11", "In the six hundredth year of Noah's life");
if (atLamech + afterLamech !== METHUSELAH) fail(`Genesis 5:25 + 5:26 = ${atLamech + afterLamech}, not ${METHUSELAH}`);
const methAtNoahBirth = atLamech + lamechAtNoah;
const methAtFlood = methAtNoahBirth + noahAtFlood;
if (methAtFlood !== METHUSELAH) fail(`187 + 182 + 600 = ${methAtFlood}, expected ${METHUSELAH}`);

// Lamech died 5 years before the flood: he lived 595 years after Noah was born (5:30), Noah was 600 at the flood
const lamechAfterNoah = age(595, "Genesis 5:30", "five hundred ninety and five", "five hundred ninety-five", "after he begat Noah");
const lamechBeforeFlood = noahAtFlood - lamechAfterNoah;

// Year of the world (years after Adam's creation) from the Genesis 5 "lived X years and begat" verses
const BEGAT = [
  ["Adam", "Seth", 130, "Genesis 5:3", "an hundred and thirty", "one hundred thirty"],
  ["Seth", "Enos", 105, "Genesis 5:6", "an hundred and five", "one hundred five"],
  ["Enos", "Cainan", 90, "Genesis 5:9", "ninety", "ninety"],
  ["Cainan", "Mahalaleel", 70, "Genesis 5:12", "seventy", "seventy"],
  ["Mahalaleel", "Jared", 65, "Genesis 5:15", "sixty and five", "sixty-five"],
  ["Jared", "Enoch", 162, "Genesis 5:18", "an hundred sixty and two", "one hundred sixty-two"],
  ["Enoch", "Methuselah", 65, "Genesis 5:21", "sixty and five", "sixty-five"],
];
for (const [father, son, n, ref, kp, wp] of BEGAT) age(n, ref, kp, wp, `${father} lived`, father === "Adam" ? "called his name Seth" : `begat ${son}`);
const methBornYear = BEGAT.reduce((s, b) => s + b[2], 0); // Methuselah born this many years after Adam's creation
const floodYear = methBornYear + METHUSELAH;

/* ---------- the table: everyone the Bible gives an age at death or a whole lifespan for ---------- */
// [name, WEB spelling or null, value, ref, kjv phrase, web phrase, kjv context needle, note]
const STATED = [
  ["Adam", null, 930, "Genesis 5:5", "nine hundred and thirty", "nine hundred thirty", "all the days that Adam lived", ""],
  ["Seth", null, 912, "Genesis 5:8", "nine hundred and twelve", "nine hundred twelve", "all the days of Seth", ""],
  ["Enos", "Enosh", 905, "Genesis 5:11", "nine hundred and five", "nine hundred five", "all the days of Enos", ""],
  ["Cainan", "Kenan", 910, "Genesis 5:14", "nine hundred and ten", "nine hundred ten", "all the days of Cainan", ""],
  ["Mahalaleel", "Mahalalel", 895, "Genesis 5:17", "eight hundred ninety and five", "eight hundred ninety-five", "all the days of Mahalaleel", ""],
  ["Jared", null, 962, "Genesis 5:20", "nine hundred sixty and two", "nine hundred sixty-two", "all the days of Jared", ""],
  ["Enoch", null, 365, "Genesis 5:23", "three hundred sixty and five", "three hundred sixty-five", "all the days of Enoch", "did not die: \"God took him\" (5:24)"],
  ["Methuselah", null, 969, "Genesis 5:27", "nine hundred sixty and nine", "nine hundred sixty-nine", "all the days of Methuselah", "the longest life in the Bible"],
  ["Lamech", null, 777, "Genesis 5:31", "seven hundred seventy and seven", "seven hundred seventy-seven", "all the days of Lamech", "Noah's father"],
  ["Noah", null, 950, "Genesis 9:29", "nine hundred and fifty", "nine hundred fifty", "all the days of Noah", "600 at the flood (7:6)"],
  ["Terah", null, 205, "Genesis 11:32", "two hundred and five", "two hundred five", "the days of Terah", "Abraham's father"],
  ["Abraham", null, 175, "Genesis 25:7", "an hundred threescore and fifteen", "one hundred seventy-five", "Abraham's life", ""],
  ["Sarah", null, 127, "Genesis 23:1", "an hundred and seven and twenty", "one hundred twenty-seven", "the years of the life of Sarah", "the only woman in this list"],
  ["Ishmael", null, 137, "Genesis 25:17", "an hundred and thirty and seven", "one hundred thirty-seven", "the years of the life of Ishmael", ""],
  ["Isaac", null, 180, "Genesis 35:28", "an hundred and fourscore", "one hundred eighty", "the days of Isaac", ""],
  ["Jacob", null, 147, "Genesis 47:28", "an hundred forty and seven", "one hundred forty-seven", "the whole age of Jacob", ""],
  ["Joseph", null, 110, "Genesis 50:26", "an hundred and ten", "one hundred ten", "Joseph died", ""],
  ["Levi", null, 137, "Exodus 6:16", "an hundred thirty and seven", "one hundred thirty-seven", "the years of the life of Levi", ""],
  ["Kohath", null, 133, "Exodus 6:18", "an hundred thirty and three", "one hundred thirty-three", "the years of the life of Kohath", ""],
  ["Amram", null, 137, "Exodus 6:20", "an hundred and thirty and seven", "a hundred and thirty-seven", "the years of the life of Amram", "father of Moses and Aaron"],
  ["Aaron", null, 123, "Numbers 33:39", "an hundred and twenty and three", "one hundred twenty-three", "when he died in mount Hor", ""],
  ["Moses", null, 120, "Deuteronomy 34:7", "an hundred and twenty", "one hundred twenty", "old when he died", ""],
  ["Joshua", null, 110, "Joshua 24:29", "an hundred and ten", "one hundred ten", "died, being", "also Judges 2:8"],
  ["Eli", null, 98, "1 Samuel 4:15", "ninety and eight", "ninety-eight", "Eli was", "died the same day (4:18)"],
  ["Jehoiada", null, 130, "2 Chronicles 24:15", "an hundred and thirty", "one hundred thirty", "when he died", "the priest"],
];
const stated = STATED.map(([name, webName, value, ref, kp, wp, ctx, note]) => {
  age(value, ref, kp, wp, ctx);
  return { name, webName, age: value, ref, computed: false, note };
});
// supporting checks for the notes
must("Genesis 5:24", "Enoch walked with God: and he was not; for God took him");
must("Judges 2:8", "died, being an hundred and ten years old");
must("1 Samuel 4:18", "his neck brake, and he died");
must("Genesis 50:22", "Joseph lived an hundred and ten years");

// Genesis 11: years before the son + years after; the total is not stated, so it is computed
// [name, WEB spelling, before, ref before, kjv, web, after, ref after, kjv, web, son]
const LINE = [
  ["Shem", null, 100, "Genesis 11:10", "an hundred", "one hundred", 500, "Genesis 11:11", "five hundred", "five hundred", "Arphaxad"],
  ["Arphaxad", "Arpachshad", 35, "Genesis 11:12", "five and thirty", "thirty-five", 403, "Genesis 11:13", "four hundred and three", "four hundred three", "Salah"],
  ["Salah", "Shelah", 30, "Genesis 11:14", "thirty", "thirty", 403, "Genesis 11:15", "four hundred and three", "four hundred three", "Eber"],
  ["Eber", null, 34, "Genesis 11:16", "four and thirty", "thirty-four", 430, "Genesis 11:17", "four hundred and thirty", "four hundred thirty", "Peleg"],
  ["Peleg", null, 30, "Genesis 11:18", "thirty", "thirty", 209, "Genesis 11:19", "two hundred and nine", "two hundred nine", "Reu"],
  ["Reu", null, 32, "Genesis 11:20", "two and thirty", "thirty-two", 207, "Genesis 11:21", "two hundred and seven", "two hundred seven", "Serug"],
  ["Serug", null, 30, "Genesis 11:22", "thirty", "thirty", 200, "Genesis 11:23", "two hundred", "two hundred", "Nahor"],
  ["Nahor", null, 29, "Genesis 11:24", "nine and twenty", "twenty-nine", 119, "Genesis 11:25", "an hundred and nineteen", "one hundred nineteen", "Terah"],
];
const line = LINE.map(([name, webName, before, refB, kb, wb, after, refA, ka, wa, son]) => {
  age(before, refB, kb, wb, `${name} `, `begat ${son}`);
  age(after, refA, ka, wa, `${name} lived after he begat ${son}`);
  const [, chB, vB] = refB.match(/(\d+):(\d+)/);
  const vA = refA.split(":")[1];
  return { name, webName, age: before + after, ref: `Genesis ${chB}:${vB}-${vA}`, computed: true, note: `${before} + ${after}, computed` };
});
must("Genesis 11:10", "two years after the flood");

const table = [...stated, ...line].sort((a, b) => b.age - a.age);
if (table[0].name !== "Methuselah") fail(`longest life should be Methuselah, got ${table[0].name}`);
const runnerUp = table[1];

// Job: 140 years after his trials; his whole age is not given
const job = age(140, "Job 42:16", "an hundred and forty", "one hundred forty", "After this lived Job");
must("Job 42:17", "So Job died, being old and full of days");

/* ---------- stats ---------- */
const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const byName = Object.fromEntries(table.map((r) => [r.name, r]));
const PRE = ["Adam", "Seth", "Enos", "Cainan", "Mahalaleel", "Jared", "Methuselah", "Lamech", "Noah"]; // Genesis 5 men who died (Enoch left out: God took him)
const PATRIARCHS = ["Abraham", "Isaac", "Jacob", "Joseph"];
const preAvg = avg(PRE.map((n) => byName[n].age));
const patAvg = avg(PATRIARCHS.map((n) => byName[n].age));
const over900 = table.filter((r) => r.age >= 900).map((r) => r.name);

const limits = {
  gen63: must("Genesis 6:3", "his days shall be an hundred and twenty years"),
  gen63web: mustWeb("Genesis 6:3", "his days will be one hundred twenty years"),
  ps9010: must("Psalms 90:10", "threescore years and ten", "fourscore years"),
  ps9010web: mustWeb("Psalms 90:10", "seventy", "eighty years"),
  jacob479: must("Genesis 47:9", "an hundred and thirty years", "have not attained unto the days of the years of the life of my fathers"),
};
const gen63 = parseNumber("an hundred and twenty");
const ps70 = parseNumber("threescore and ten");
const ps80 = parseNumber("fourscore");
const reached120 = table.filter((r) => r.age >= gen63).length;
if (byName.Moses.age !== gen63) fail("Moses should be 120");

// Enoch and the flood
const enoch = {
  heb115: must("Hebrews 11:5", "Enoch was translated that he should not see death"),
  heb115web: mustWeb("Hebrews 11:5", "so that he wouldn't see death"),
  jude14: must("Jude 1:14", "Enoch also, the seventh from Adam"),
  gen522: must("Genesis 5:22", "Enoch walked with God after he begat Methuselah three hundred years"),
  gen524web: mustWeb("Genesis 5:24", "Enoch walked with God, and he was not found, for God took him"),
};
const ark = {
  gen713: must("Genesis 7:13", "Noah, and Shem, and Ham, and Japheth", "Noah's wife, and the three wives of his sons"),
  pet320: must("1 Peter 3:20", "eight souls were saved by water"),
};
must("Genesis 5:32", "Noah was five hundred years old: and Noah begat Shem, Ham, and Japheth");
const noahAtSons = parseNumber("five hundred");
const noahAfter = age(350, "Genesis 9:28", "three hundred and fifty", "three hundred fifty", "Noah lived after the flood");
if (noahAtFlood + noahAfter !== byName.Noah.age) fail("Noah 600 + 350 should equal 950");

// Methuselah's life overlapped Adam's, and Noah's
const adamDiedYear = byName.Adam.age;
const methAtAdamDeath = adamDiedYear - methBornYear;
if (methAtAdamDeath <= 0) fail("Methuselah should be born before Adam died");

// the other line: Cain's descendants have a Methusael, an Enoch and a Lamech too (no ages given)
const cainLine = {
  gen417: must("Genesis 4:17", "Cain knew his wife; and she conceived, and bare Enoch"),
  gen418: must("Genesis 4:18", "Mehujael begat Methusael: and Methusael begat Lamech"),
  gen418web: mustWeb("Genesis 4:18", "Methushael became the father of Lamech"),
  gen419: must("Genesis 4:19", "Lamech took unto him two wives"),
  elijah: must("2 Kings 2:11", "Elijah went up by a whirlwind into heaven"),
  luke323: must("Luke 3:23", "Jesus himself began to be about thirty years of age"),
  noahLine: must("Genesis 5:29", "called his name Noah"),
};
const under120 = table.filter((r) => r.age < gen63).map((r) => ({ name: r.name, age: r.age }));

/* ---------- names ---------- */
const words = {
  methuselahKjv: countForms("kjv", ["methuselah"]),
  mathusalaKjv: countForms("kjv", ["mathusala"]),
  methuselahWeb: countForms("web", ["methuselah", "methuselah's"]),
  allTheDaysOf: countPhrase("kjv", /all the days of \w+ were/gi),
};
const methRefsKjv = ROWS.kjv.filter((r) => /\b(methuselah|mathusala)\b/i.test(r.text)).map((r) => r.ref);
const methRefsWeb = ROWS.web.filter((r) => /\bmethuselah\b/i.test(r.text)).map((r) => r.ref);
must("Luke 3:37", "Mathusala");
mustWeb("Luke 3:37", "Methuselah");
must("1 Chronicles 1:3", "Methuselah");
const methTotalKjv = words.methuselahKjv.total + words.mathusalaKjv.total;
if (methTotalKjv !== words.methuselahWeb.total) console.warn(`note: KJV ${methTotalKjv} vs WEB ${words.methuselahWeb.total}`);

writeList("how-old-was-methuselah", {
  generated: "2026-10-25",
  methuselah: METHUSELAH,
  key,
  sum: { atLamech, lamechAtNoah, noahAtFlood, methAtNoahBirth, methAtFlood, afterLamech },
  lamech: { age: byName.Lamech.age, afterNoah: lamechAfterNoah, beforeFlood: lamechBeforeFlood },
  timeline: { methBornYear, floodYear, methAtAdamDeath, begat: BEGAT.map(([f, s, n, ref]) => ({ father: f, son: s, years: n, ref })) },
  table,
  counts: { people: table.length, stated: stated.length, computed: line.length, over900: over900.length, over900Names: over900 },
  runnerUp: { name: runnerUp.name, age: runnerUp.age, ref: runnerUp.ref, gap: METHUSELAH - runnerUp.age },
  job,
  averages: { pre: PRE, preAvg, patriarchs: PATRIARCHS, patAvg, ratio: preAvg / patAvg },
  limits: { gen63, ps70, ps80, reached120, under120, jacobAt: parseNumber("an hundred and thirty") },
  noah: { age: byName.Noah.age, atSons: noahAtSons, atFlood: noahAtFlood, after: noahAfter },
  enoch: { age: byName.Enoch.age, walked: 300 },
  shem: byName.Shem.age,
  nahor: byName.Nahor.age,
  words: { methuselahKjv: words.methuselahKjv.total, mathusalaKjv: words.mathusalaKjv.total, methTotalKjv, methuselahWeb: words.methuselahWeb.total, refsKjv: methRefsKjv, refsWeb: methRefsWeb, allTheDaysOf: words.allTheDaysOf },
  checks: [...Object.keys(limits), ...Object.keys(enoch), ...Object.keys(ark), ...Object.keys(cainLine)],
});

console.log("table:", table.map((r) => `${r.name} ${r.age}${r.computed ? "*" : ""}`).join(", "));
console.log("people", table.length, "(stated", stated.length, "computed", line.length, ") over 900:", over900.join(", "));
console.log("sum", atLamech, "+", lamechAtNoah, "+", noahAtFlood, "=", methAtFlood, "| Lamech died", lamechBeforeFlood, "years before the flood");
console.log("Methuselah born year", methBornYear, "of the world; flood year", floodYear, "; Methuselah", methAtAdamDeath, "when Adam died");
console.log("avg pre-flood", preAvg.toFixed(1), "patriarchs", patAvg.toFixed(1), "ratio", (preAvg / patAvg).toFixed(2), "| reached 120:", reached120);
console.log("Methuselah KJV", words.methuselahKjv.total, "+ Mathusala", words.mathusalaKjv.total, "=", methTotalKjv, methRefsKjv.join("; "), "| WEB", words.methuselahWeb.total, methRefsWeb.join("; "));
console.log("'all the days of X were'", words.allTheDaysOf.total, words.allTheDaysOf.refs.join("; "));
