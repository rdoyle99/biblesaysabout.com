/* How many years did Noah build the ark: the window Genesis gives (Noah 500 at 5:32, 600 at 7:6 and 7:11, the 120 years
   of 6:3, Shem's age at 11:10), the flood calendar from the dated verses (7:11 to 8:14) with the day count under each
   calendar assumption, the ark's size (6:15-16), who and what went aboard (6:19-7:15), Noah after the flood (9:28-29),
   and how often "ark" means Noah's ark, Moses' basket or the ark of the covenant in the KJV (the WEB says "ship").
   Every number is read from the verse in BOTH translations: the KJV and WEB number words are parsed to an integer and
   must equal the value the row uses, so a typo or a wrong verse stops the build.
   Writes lib/data/lists/how-many-years-did-noah-build-the-ark.json. Run: node scripts/lists/how-many-years-did-noah-build-the-ark.mjs */
import fs from "fs";
import path from "path";
import { must, mustWeb, countForms, fail, writeList, ROWS, norm, tokens, root } from "../lib/list-helpers.mjs";

/* ---------- number words to integers: the parser from how-old-was-methuselah.mjs, plus the ordinals the flood dates use
   (KJV "six hundredth and first", "seven and twentieth"; WEB "six hundred first", "twenty-seventh") ---------- */
const UNITS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, score: 20, threescore: 60, fourscore: 80 };
const ORDINALS = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12, seventeenth: 17, twentieth: 20, thirtieth: 30 };
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
    } else if (t === "hundred" || t === "hundredth") {
      total += (cur || 1) * 100;
      cur = 0;
      seen = true;
    } else if (t in UNITS) {
      cur += UNITS[t];
      seen = true;
    } else if (t in ORDINALS) {
      cur += ORDINALS[t];
      seen = true;
    } else fail(`number phrase "${phrase}" has an unknown word "${t}"`);
  });
  if (!seen) fail(`no number in "${phrase}"`);
  return total + cur;
}
/** the verse must hold the phrase in both translations, and the number words in braces must parse to the value in both:
    num(500, "Genesis 5:32", "{five hundred} years old", "{five hundred} years old") */
const numPart = (p) => (p.match(/\{([^}]+)\}/) || [null, p])[1];
const plain = (p) => p.replace(/[{}]/g, "");
function num(value, ref, kjvPhrase, webPhrase, ...kjvExtra) {
  must(ref, plain(kjvPhrase), ...kjvExtra);
  mustWeb(ref, plain(webPhrase));
  const k = parseNumber(numPart(kjvPhrase));
  const w = parseNumber(numPart(webPhrase));
  if (k !== value || w !== value) fail(`${ref}: row says ${value}, KJV "${kjvPhrase}" = ${k}, WEB "${webPhrase}" = ${w}`);
  return value;
}

/* ---------- Noah's ages: the window ---------- */
const atSons = num(500, "Genesis 5:32", "{five hundred} years old", "{five hundred} years old", "begat Shem, Ham, and Japheth");
mustWeb("Genesis 5:32", "became the father of Shem, Ham, and Japheth");
const atFlood = num(600, "Genesis 7:6", "{six hundred} years old", "{six hundred} years old", "when the flood of waters was upon the earth");
const floodYear = num(600, "Genesis 7:11", "In the {six hundredth} year of Noah", "In the {six hundredth} year of Noah");
if (floodYear !== atFlood) fail("Genesis 7:6 and 7:11 should both give 600");
const gen63 = num(120, "Genesis 6:3", "{an hundred and twenty} years", "{one hundred twenty} years", "his days shall be");
const shemAt = num(100, "Genesis 11:10", "{an hundred} years old", "{one hundred} years old", "Shem was", "two years after the flood");
const shemAfter = num(2, "Genesis 11:10", "{two} years after the flood", "{two} years after the flood");
const shemLife = shemAt + num(500, "Genesis 11:11", "{five hundred} years", "{five hundred} years", "Shem lived after he begat Arphaxad");
if (shemLife !== 600) fail(`Shem should total 600, got ${shemLife}`);
const noahAtShemFromStart = atFlood + shemAfter - shemAt; // "after the flood" counted from its start in year 600
const noahAtShemFromEnd = atFlood + 1 + shemAfter - shemAt; // or from its end in year 601 (Genesis 8:13)
const shemAtFlood = atFlood - noahAtShemFromStart;
// the command names the sons' wives, and the sons are already named before it
const command = {
  gen614: must("Genesis 6:14", "Make thee an ark of gopher wood"),
  gen614web: mustWeb("Genesis 6:14", "Make a ship of gopher wood"),
  gen618: must("Genesis 6:18", "thou, and thy sons, and thy wife, and thy sons", "wives with thee"),
  gen618web: mustWeb("Genesis 6:18", "you, your sons, your wife, and your sons", "wives with you"),
  gen610: must("Genesis 6:10", "Noah begat three sons, Shem, Ham, and Japheth"),
  gen622: must("Genesis 6:22", "Thus did Noah; according to all that God commanded him, so did he"),
  gen622web: mustWeb("Genesis 6:22", "Thus Noah did. He did all that God commanded him"),
  gen75: must("Genesis 7:5", "Noah did according unto all that the LORD commanded him"),
  heb117: must("Hebrews 11:7", "By faith Noah", "prepared an ark to the saving of his house"),
  heb117web: mustWeb("Hebrews 11:7", "prepared a ship for the saving of his house"),
  pet320: must("1 Peter 3:20", "the longsuffering of God waited in the days of Noah, while the ark was a preparing"),
  pet320web: mustWeb("1 Peter 3:20", "God waited patiently in the days of Noah, while the ship was being built"),
  pet25: must("2 Peter 2:5", "a preacher of righteousness"),
};
const windowRows = [
  { reading: "Genesis 6:3 as a countdown to the flood, with the command given when the 120 years began", years: gen63, from: atFlood - gen63, to: atFlood, refs: "Genesis 6:3, 7:6" },
  { reading: "The command came after Noah's sons were born (Genesis 5:32 names them at 500)", years: atFlood - atSons, from: atSons, to: atFlood, refs: "Genesis 5:32, 7:6" },
  { reading: "Counting from Shem's birth by Genesis 11:10 (100 years old two years after the flood)", years: shemAtFlood, from: noahAtShemFromStart, to: atFlood, refs: "Genesis 11:10, 7:6" },
];

/* ---------- the flood calendar (year of Noah's life, month, day) ---------- */
// [label, ref, year, month, day, kjv phrases, web phrases]
const DATES = [
  ["The fountains break open and Noah's family goes in", "Genesis 7:11", 600, 2, 17, ["{six hundredth} year", "the {second} month", "the {seventeenth} day"], ["{six hundredth} year", "the {second} month", "the {seventeenth} day"]],
  ["The ark comes to rest on the mountains of Ararat", "Genesis 8:4", 600, 7, 17, ["the {seventh} month", "the {seventeenth} day"], ["the {seventh} month", "the {seventeenth} day"]],
  ["The tops of the mountains are seen", "Genesis 8:5", 600, 10, 1, ["the {tenth} month", "the {first} day"], ["the {tenth} month", "the {first} day"]],
  ["The waters are dried up; Noah removes the covering", "Genesis 8:13", 601, 1, 1, ["the {six hundredth and first} year", "the {first} month", "the {first} day"], ["the {six hundred first} year", "the {first} month", "the {first} day"]],
  ["The earth is dry; God tells Noah to go out (8:15-18)", "Genesis 8:14", 601, 2, 27, ["the {second} month", "the {seven and twentieth} day"], ["the {second} month", "the {twenty-seventh} day"]],
];
const index30 = (y, m, d) => (y * 12 + (m - 1)) * 30 + (d - 1); // day number if every month has 30 days
const start = index30(600, 2, 17);
const calendar = DATES.map(([label, ref, y, m, d, kp, wp]) => {
  const parts = kp.length === 2 ? [m, d] : [y, m, d]; // 8:4, 8:5 and 8:14 give month and day; the year follows from the verses before
  parts.forEach((v, i) => num(v, ref, kp[i], wp[i]));
  return { label, ref, year: y, month: m, day: d, dayOf30: index30(y, m, d) - start };
});
must("Genesis 7:13", "In the selfsame day entered Noah");
mustWeb("Genesis 7:13", "In the same day Noah");
must("Genesis 8:4", "upon the mountains of Ararat");
must("Genesis 8:13", "Noah removed the covering of the ark");
must("Genesis 8:16", "Go forth of the ark");
must("Genesis 8:18", "And Noah went forth");

// stated intervals
const rain = num(40, "Genesis 7:12", "{forty} days and forty nights", "{forty} days and forty nights", "the rain was upon the earth");
num(40, "Genesis 7:4", "{forty} days and forty nights", "{forty} days and forty nights", "I will cause it to rain");
const floodForty = num(40, "Genesis 7:17", "{forty} days", "{forty} days", "the flood was forty days upon the earth");
const warning = num(7, "Genesis 7:4", "For yet {seven} days", "In {seven} days");
num(7, "Genesis 7:10", "after {seven} days", "After the {seven} days");
const prevailed = num(150, "Genesis 7:24", "{an hundred and fifty} days", "{one hundred fifty} days", "the waters prevailed upon the earth");
num(150, "Genesis 8:3", "the {hundred and fifty} days", "{one hundred fifty} days", "the waters were abated");
const windowWait = num(40, "Genesis 8:6", "at the end of {forty} days", "At the end of {forty} days", "Noah opened the window of the ark");
must("Genesis 8:7", "he sent forth a raven");
must("Genesis 8:8", "he sent forth a dove");
const dove1 = num(7, "Genesis 8:10", "yet other {seven} days", "yet another {seven} days", "again he sent forth the dove");
const dove2 = num(7, "Genesis 8:12", "yet other {seven} days", "yet another {seven} days", "returned not again");
must("Genesis 8:11", "in her mouth was an olive leaf");
const depth = num(15, "Genesis 7:20", "{Fifteen} cubits upward", "{fifteen} cubits higher", "the mountains were covered");

const byRef = Object.fromEntries(calendar.map((c) => [c.ref, c]));
// the one check the text gives on month length: 2/17 to 7/17 is five months, and the waters prevail 150 days
const fiveMonths = byRef["Genesis 8:4"].dayOf30;
if (fiveMonths !== prevailed) fail(`2/17 to 7/17 under 30-day months is ${fiveMonths} days, but Genesis 7:24 says ${prevailed}`);
const days30 = byRef["Genesis 8:14"].dayOf30; // 12 months x 30 + 10
if (days30 !== 12 * 30 + 10) fail(`expected 370, got ${days30}`);
const raven = byRef["Genesis 8:5"].dayOf30 + windowWait; // 40 days after the mountain tops, if the 40 count from 8:5
// one calendar year plus 10 days: the day count depends on the length of the year (outside figures, sourced on the page)
const LUNAR = 354;
const SOLAR = 365;
const aboard = {
  thirty: { elapsed: 360 + 10, inclusive: 360 + 11 },
  lunar: { elapsed: LUNAR + 10, inclusive: LUNAR + 11 },
  solar: { elapsed: SOLAR + 10, inclusive: SOLAR + 11 },
};
const noahAtExit = num(601, "Genesis 8:13", "the {six hundredth and first} year", "the {six hundred first} year");

/* ---------- the ark ---------- */
const len = num(300, "Genesis 6:15", "{three hundred} cubits", "{three hundred} cubits", "The length of the ark");
const wid = num(50, "Genesis 6:15", "{fifty} cubits", "{fifty} cubits", "the breadth of it");
const hgt = num(30, "Genesis 6:15", "{thirty} cubits", "{thirty} cubits", "the height of it");
mustWeb("Genesis 6:15", "The length of the ship", "its width", "its height");
const decks = num(3, "Genesis 6:16", "and {third} stories", "and {third} levels", "lower, second, and third stories");
mustWeb("Genesis 6:16", "lower, second, and third levels");
const doorK = must("Genesis 6:16", "the door of the ark shalt thou set in the side thereof");
mustWeb("Genesis 6:16", "You shall set the door of the ship in its side");
must("Genesis 6:16", "A window shalt thou make to the ark");
mustWeb("Genesis 6:16", "You shall make a roof in the ship");
mustWeb("Genesis 8:6", "the window of the ship which he had made");
must("Genesis 6:14", "rooms shalt thou make in the ark", "pitch it within and without with pitch");
const CUBIT_IN = 18; // an assumption: the page names the source and shows other lengths
const ft = (c, inches = CUBIT_IN) => (c * inches) / 12;
const size = {
  cubits: { len, wid, hgt },
  feet18: { len: ft(len), wid: ft(wid), hgt: ft(hgt) },
  meters18: { len: +(len * 0.4572).toFixed(1), wid: +(wid * 0.4572).toFixed(1), hgt: +(hgt * 0.4572).toFixed(1) },
  boxCubicFeet18: ft(len) * ft(wid) * ft(hgt),
  ratioLW: len / wid,
  ratioLH: len / hgt,
  // the two lengths Wikipedia's "Biblical and Talmudic units of measurement" gives for the Biblical cubit (49.5 or 52.5 cm)
  alt: [49.5, 52.5].map((cm) => ({ cm, inches: +(cm / 2.54).toFixed(2), lenM: +(len * cm / 100).toFixed(1), lenFt: Math.round((len * cm) / 30.48) })),
  decks,
  doors: 1,
  depthAboveMountains: depth,
};
if (size.feet18.len !== 450 || size.feet18.wid !== 75 || size.feet18.hgt !== 45) fail("18-inch conversion should be 450 x 75 x 45 feet");
void doorK;

/* ---------- who and what went aboard ---------- */
const g713 = must("Genesis 7:13", "Noah, and Shem, and Ham, and Japheth, the sons of Noah, and Noah", "wife, and the three wives of his sons");
mustWeb("Genesis 7:13", "Noah, and Shem, Ham, and Japheth", "wife and the three wives of his sons");
const wives = num(3, "Genesis 7:13", "the {three} wives", "the {three} wives");
const people = 1 + 3 + 1 + wives; // Noah, three named sons, his wife, three wives
const souls = num(8, "1 Peter 3:20", "{eight} souls", "{eight} souls");
if (people !== souls) fail(`Genesis 7:13 gives ${people}, 1 Peter 3:20 gives ${souls}`);
must("2 Peter 2:5", "saved Noah the eighth person");
mustWeb("2 Peter 2:5", "preserved Noah with seven others");
void g713;
const animals = {
  every: num(2, "Genesis 6:19", "{two} of every sort", "{two} of every sort", "they shall be male and female"),
  every620: num(2, "Genesis 6:20", "{two} of every sort", "{two} of every sort"),
  clean: { kjv: must("Genesis 7:2", "Of every clean beast thou shalt take to thee by sevens, the male and his female"), web: mustWeb("Genesis 7:2", "You shall take seven pairs of every clean animal with you, the male and his female") },
  unclean: { kjv: must("Genesis 7:2", "of beasts that are not clean by two, the male and his female"), web: mustWeb("Genesis 7:2", "Of the animals that are not clean, take two, the male and his female") },
  birds: { kjv: must("Genesis 7:3", "Of fowls also of the air by sevens, the male and the female"), web: mustWeb("Genesis 7:3", "Also of the birds of the sky, seven and seven, male and female") },
  went: { kjv: must("Genesis 7:9", "There went in two and two unto Noah into the ark"), web: mustWeb("Genesis 7:9", "went by pairs to Noah into the ship") },
};
mustWeb("Genesis 7:2", "seven pairs");
must("Genesis 6:21", "take thou unto thee of all food that is eaten");

/* ---------- Noah after the flood ---------- */
const after = num(350, "Genesis 9:28", "{three hundred and fifty} years", "{three hundred fifty} years", "Noah lived after the flood");
const died = num(950, "Genesis 9:29", "{nine hundred and fifty} years", "{nine hundred fifty} years", "all the days of Noah");
if (atFlood + after !== died) fail(`600 + 350 should be 950, got ${atFlood + after}`);

/* ---------- agree with /how-old-was-methuselah ---------- */
const meth = JSON.parse(fs.readFileSync(path.join(root, "lib/data/lists/how-old-was-methuselah.json"), "utf8"));
if (meth.sum.noahAtFlood !== atFlood || meth.sum.methAtFlood !== meth.methuselah) fail("disagrees with how-old-was-methuselah.json on the flood year");
const methuselah = { age: meth.methuselah, floodYearOfWorld: meth.timeline.floodYear, noahBornYearOfWorld: meth.timeline.floodYear - atFlood, atNoahBirth: meth.sum.methAtNoahBirth };

/* ---------- "ark" in the KJV, split by which ark; "ship" for Noah's ark in the WEB ---------- */
const NT_NOAH = ["Matthew 24:38", "Luke 17:27", "Hebrews 11:7", "1 Peter 3:20"];
must("Matthew 24:38", "Noe entered into the ark");
must("Luke 17:27", "Noe entered into the ark");
mustWeb("Matthew 24:38", "Noah entered into the ship");
mustWeb("Luke 17:27", "Noah entered into the ship");
const inFlood = (r) => r.book === "Genesis" && r.ch >= 6 && r.ch <= 9;
const isNoah = (r) => inFlood(r) || NT_NOAH.includes(r.ref);
const isBasket = (r) => r.book === "Exodus" && r.ch === 2;
const arkAll = countForms("kjv", ["ark"]);
const arkNoah = countForms("kjv", ["ark"], isNoah);
const arkNoahGen = countForms("kjv", ["ark"], inFlood);
const arkBasket = countForms("kjv", ["ark"], isBasket);
const arkCovenant = countForms("kjv", ["ark"], (r) => !isNoah(r) && !isBasket(r));
const arkGenOther = countForms("kjv", ["ark"], (r) => r.book === "Genesis" && !inFlood(r));
if (arkGenOther.total) fail("KJV has 'ark' in Genesis outside chapters 6-9");
if (arkNoah.total + arkBasket.total + arkCovenant.total !== arkAll.total) fail("ark split does not add up");
const NT_NOAH_REFS = ROWS.kjv.filter((r) => r.testament === "NT" && /\bark\b/i.test(r.text) && isNoah(r)).map((r) => r.ref);
if (NT_NOAH_REFS.length !== NT_NOAH.length) fail(`NT Noah ark verses: ${NT_NOAH_REFS.join(", ")}`);
const webArk = countForms("web", ["ark"]);
const webArkNoah = countForms("web", ["ark"], isNoah);
const webShipNoah = countForms("web", ["ship"], isNoah);
const webShipGen = countForms("web", ["ship"], inFlood);
if (webArkNoah.total) fail("WEB uses 'ark' for Noah's ark somewhere");
// the covenant total in the WEB versus the KJV (the WEB has no "ark" in Exodus 2: it says "basket")
mustWeb("Exodus 2:3", "papyrus basket");
must("Exodus 2:3", "an ark of bulrushes");
const covDiffRefs = (() => {
  const k = new Map(ROWS.kjv.filter((r) => !isNoah(r) && !isBasket(r)).map((r) => [r.ref, tokens(r.text).filter((t) => t === "ark").length]));
  const w = new Map(ROWS.web.filter((r) => !isNoah(r) && !isBasket(r)).map((r) => [r.ref, tokens(r.text).filter((t) => t === "ark").length]));
  const out = [];
  for (const ref of new Set([...k.keys(), ...w.keys()])) if ((k.get(ref) || 0) !== (w.get(ref) || 0)) out.push({ ref, kjv: k.get(ref) || 0, web: w.get(ref) || 0 });
  return out;
})();

// Noah's name, to agree with /words/noah
const noahKjv = countForms("kjv", ["noah", "noah's", "noe"]);
const noeKjv = countForms("kjv", ["noe"]);
const noahWeb = countForms("web", ["noah", "noah's"]);
const noahFloodKjv = countForms("kjv", ["noah", "noah's", "noe"], inFlood);
const noahFloodWeb = countForms("web", ["noah", "noah's"], inFlood);
const words = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-words.json"), "utf8")).words;
const wNoah = words.find((w) => w.slug === "noah");
const wArk = words.find((w) => w.slug === "ark");
if (wNoah.kjv.total !== noahKjv.total || wNoah.web.total !== noahWeb.total) fail(`Noah: ours ${noahKjv.total}/${noahWeb.total}, /words/noah ${wNoah.kjv.total}/${wNoah.web.total}`);
if (wArk.kjv.total !== arkAll.total || wArk.web.total !== webArk.total) fail(`ark: ours ${arkAll.total}/${webArk.total}, /words/ark ${wArk.kjv.total}/${wArk.web.total}`);

writeList("how-many-years-did-noah-build-the-ark", {
  generated: "2026-10-26",
  noah: { atSons, atFlood, atExit: noahAtExit, after, died, noahAtShemFromStart, noahAtShemFromEnd, shemAtFlood, shemAt, shemAfter, shemLife },
  gen63,
  windowRows,
  calendar,
  intervals: { warning, rain, floodForty, prevailed, fiveMonths, windowWait, dove1, dove2, raven, days30 },
  aboard,
  calendarYears: { thirty: 360, lunar: LUNAR, solar: SOLAR },
  size,
  cubitInches: CUBIT_IN,
  people,
  souls,
  animals,
  methuselah,
  ark: {
    kjvTotal: arkAll.total,
    kjvVerses: arkAll.verses,
    noah: arkNoah.total,
    noahGenesis: arkNoahGen.total,
    noahNT: arkNoah.total - arkNoahGen.total,
    ntRefs: NT_NOAH_REFS,
    basket: arkBasket.total,
    covenant: arkCovenant.total,
    webTotal: webArk.total,
    webShipNoah: webShipNoah.total,
    webShipGenesis: webShipGen.total,
    covenantDiff: covDiffRefs,
  },
  name: { kjv: noahKjv.total, kjvNoe: noeKjv.total, web: noahWeb.total, kjvVerses: noahKjv.verses, webVerses: noahWeb.verses, books: noahKjv.books, floodKjv: noahFloodKjv.total, floodWeb: noahFloodWeb.total },
  quotes: {
    gen532: { kjv: must("Genesis 5:32"), web: mustWeb("Genesis 5:32") },
    gen63: { kjv: must("Genesis 6:3"), web: mustWeb("Genesis 6:3") },
    gen615: { kjv: must("Genesis 6:15"), web: mustWeb("Genesis 6:15") },
    gen618: { kjv: command.gen618, web: command.gen618web },
    gen622: { kjv: command.gen622, web: command.gen622web },
    gen76: { kjv: must("Genesis 7:6"), web: mustWeb("Genesis 7:6") },
    gen1110: { kjv: must("Genesis 11:10"), web: mustWeb("Genesis 11:10") },
    pet320: { kjv: command.pet320, web: command.pet320web },
  },
  checks: Object.keys(command),
});

console.log("window:", windowRows.map((w) => `${w.years} (${w.from}-${w.to})`).join(" | "), "| Noah at Shem's birth", noahAtShemFromStart, "or", noahAtShemFromEnd);
console.log("calendar:", calendar.map((c) => `${c.ref} ${c.year}/${c.month}/${c.day} day ${c.dayOf30}`).join("; "));
console.log("aboard 30-day", aboard.thirty, "lunar", aboard.lunar, "solar", aboard.solar, "| 2/17-7/17 =", fiveMonths, "= 7:24's", prevailed, "| raven day", raven);
console.log("size", size.feet18, size.meters18, "box ft3", size.boxCubicFeet18, "alt", JSON.stringify(size.alt));
console.log("people", people, "| Noah after", after, "died", died, "| Methuselah", JSON.stringify(methuselah));
console.log("ark KJV", arkAll.total, "= Noah", arkNoah.total, `(Gen ${arkNoahGen.total} + NT ${arkNoah.total - arkNoahGen.total})`, "+ basket", arkBasket.total, "+ covenant", arkCovenant.total, "| WEB ark", webArk.total, "ship (Noah)", webShipNoah.total, "diff", JSON.stringify(covDiffRefs));
console.log("Noah KJV", noahKjv.total, "(Noe", noeKjv.total, ") WEB", noahWeb.total, "| in Genesis 6-9 KJV", noahFloodKjv.total, "WEB", noahFloodWeb.total);
