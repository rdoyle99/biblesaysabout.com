/* How tall was Goliath: 1 Samuel 17:4-7 in the KJV and WEB (six cubits and a span, the armor and spear weights), the
   shorter reading of four cubits and a span (Septuagint, 4QSam(a), Josephus), converted at a common and a royal cubit,
   plus every person the Bible gives a height or a size for, and the giants of 2 Samuel 21 and 1 Chronicles 20.
   Every verse is checked in BOTH translations and the build stops on a missing phrase; the "giant" counts and the
   height scan run over the full text. Writes lib/data/lists/how-tall-was-goliath.json.
   Run: node scripts/lists/how-tall-was-goliath.mjs */
import { must, mustWeb, countForms, fail, writeList, ROWS, norm } from "../lib/list-helpers.mjs";

/* ---------- the verses ---------- */
const key = {
  kjv: must("1 Samuel 17:4", "named Goliath, of Gath, whose height was six cubits and a span"),
  web: mustWeb("1 Samuel 17:4", "named Goliath, of Gath, whose height was six cubits and a span"),
};
const armor = {
  coat: { kjv: must("1 Samuel 17:5", "the weight of the coat was five thousand shekels of brass"), web: mustWeb("1 Samuel 17:5", "the weight of the coat was five thousand shekels of brass") },
  greaves: { kjv: must("1 Samuel 17:6", "greaves of brass upon his legs", "a target of brass between his shoulders"), web: mustWeb("1 Samuel 17:6", "brass shin armor on his legs", "a brass javelin between his shoulders") },
  spear: { kjv: must("1 Samuel 17:7", "the staff of his spear was like a weaver", "six hundred shekels of iron"), web: mustWeb("1 Samuel 17:7", "like a weaver", "six hundred shekels of iron") },
};
const fight = {
  stones: must("1 Samuel 17:40", "five smooth stones out of the brook"),
  forehead: must("1 Samuel 17:49", "the stone sunk into his forehead"),
  noSword: must("1 Samuel 17:50", "there was no sword in the hand of David"),
  head: must("1 Samuel 17:51", "took his sword", "cut off his head therewith"),
  sword: must("1 Samuel 21:9", "The sword of Goliath the Philistine", "valley of Elah"),
};
mustWeb("1 Samuel 17:49", "The stone sank into his forehead");
mustWeb("1 Samuel 17:51", "cut off his head with it");

/* ---------- the numbers: cubits and spans to feet and metres ---------- */
// Assumptions (sourced on the page): a span is half a cubit (Ancient Hebrew units: 1 amah = 2 zeret); the common
// cubit is about 18 inches (45.72 cm), the figure GotQuestions, Barnes and Crossway use; the royal cubit is the
// Egyptian royal cubit rod of Maya, 52.3 cm (Wikipedia, Cubit). A shekel is 11.5 g (a two-shekel First Temple
// weight of 23 g, Wikipedia, Shekel).
const CM_PER_IN = 2.54;
const CUBITS = [
  { id: "common", name: "Common cubit", cm: 18 * CM_PER_IN, note: "about 18 inches, elbow to fingertip" },
  { id: "royal", name: "Royal cubit", cm: 52.3, note: "Egyptian royal cubit rod of Maya, 52.3 cm" },
];
const SPAN = 0.5; // a span is half a cubit
const READINGS = [
  { id: "six", cubits: 6, label: "Six cubits and a span", witnesses: "Masoretic Hebrew text (KJV, WEB and most English Bibles), Latin Vulgate, Syriac Peshitta, Aramaic Targum" },
  { id: "four", cubits: 4, label: "Four cubits and a span", witnesses: "Septuagint (Greek) Codex Vaticanus and Lucianic manuscripts, the Dead Sea Scroll 4QSam(a), Josephus (Antiquities 6.171)" },
];
const ftIn = (cm) => {
  const inches = Math.round(cm / CM_PER_IN);
  return { ft: Math.floor(inches / 12), in: inches % 12, inches };
};
const table = [];
for (const r of READINGS) {
  for (const c of CUBITS) {
    const cm = (r.cubits + SPAN) * c.cm;
    table.push({ reading: r.id, label: r.label, cubit: c.id, cubitName: c.name, cubitCm: Math.round(c.cm * 10) / 10, cm: Math.round(cm), m: Math.round(cm) / 100, ...ftIn(cm) });
  }
}
const row = (reading, cubit) => table.find((t) => t.reading === reading && t.cubit === cubit);
const SIX = row("six", "common");
const FOUR = row("four", "common");
if (SIX.ft !== 9 || SIX.in !== 9) fail(`six cubits and a span at 18 in should be 9 ft 9 in, got ${SIX.ft} ft ${SIX.in} in`);
if (FOUR.ft !== 6 || FOUR.in !== 9) fail(`four cubits and a span at 18 in should be 6 ft 9 in, got ${FOUR.ft} ft ${FOUR.in} in`);
const gapIn = SIX.inches - FOUR.inches; // two cubits
if (gapIn !== 36) fail(`the two readings should differ by two cubits (36 in), got ${gapIn}`);

// Robert Wadlow, the tallest man with medical evidence: 2.72 m, 8 ft 11.1 in (Guinness World Records, 27 June 1940)
const WADLOW_CM = 272;
const vsWadlow = { cm: SIX.cm - WADLOW_CM, in: Math.round((SIX.cm - WADLOW_CM) / CM_PER_IN) };

const SHEKEL_G = 11.5;
const LB_PER_KG = 2.20462;
const weight = (shekels) => {
  const kg = (shekels * SHEKEL_G) / 1000;
  return { shekels, kg: Math.round(kg * 10) / 10, lb: Math.round(kg * LB_PER_KG) };
};
const weights = {
  coat: { ...weight(5000), what: "coat of mail, brass", ref: "1 Samuel 17:5" },
  spearhead: { ...weight(600), what: "spear head, iron", ref: "1 Samuel 17:7" },
  ishbiSpear: { ...weight(300), what: "Ishbi-benob's spear, brass", ref: "2 Samuel 21:16" },
};

/* ---------- every person the Bible gives a height or size for ---------- */
// The scan below lists every KJV verse with a height phrase; the rows are the ones about a person, and the build
// stops if a row's verse is not in the scan, so the list cannot claim a verse the scan did not find.
const HEIGHT_RE = /(cubits? high|whose height was|height was|great stature|little of stature|higher than any of the people|cubit of a man)/i;
const scan = ROWS.kjv.filter((r) => HEIGHT_RE.test(norm(r.text))).map((r) => r.ref);
const PEOPLE = [
  { who: "Goliath of Gath", ref: "1 Samuel 17:4", size: "six cubits and a span", kjv: "whose height was six cubits and a span", web: "whose height was six cubits and a span", numeric: true },
  { who: "An Egyptian killed by Benaiah", ref: "1 Chronicles 11:23", size: "five cubits high", kjv: "a man of great stature, five cubits high", web: "a man of great stature, five cubits high", numeric: true },
  { who: "Og, king of Bashan", ref: "Deuteronomy 3:11", size: "his iron bed: nine cubits by four", kjv: "nine cubits was the length thereof, and four cubits the breadth of it, after the cubit of a man", web: "Nine cubits was its length, and four cubits its width, after the cubit of a man", numeric: false },
  { who: "Saul", ref: "1 Samuel 9:2", size: "a head and shoulders above everyone", kjv: "from his shoulders and upward he was higher than any of the people", web: "From his shoulders and upward he was taller than any of the people", numeric: false },
  { who: "The man with 24 fingers and toes", ref: "2 Samuel 21:20", size: "\"a man of great stature\"", kjv: "a man of great stature, that had on every hand six fingers", web: "a man of great stature, who had six fingers on every hand", numeric: false },
  { who: "The people of Canaan", ref: "Numbers 13:32", size: "\"men of a great stature\"", kjv: "men of a great stature", web: "men of great stature", numeric: false },
  { who: "The Amorite", ref: "Amos 2:9", size: "\"like the height of the cedars\"", kjv: "whose height was like the height of the cedars", web: "whose height was like the height of the cedars", numeric: false },
  { who: "Zacchaeus", ref: "Luke 19:3", size: "\"little of stature\" (WEB: short)", kjv: "he was little of stature", web: "because he was short", numeric: false },
];
for (const p of PEOPLE) {
  must(p.ref, p.kjv);
  mustWeb(p.ref, p.web);
  if (!scan.includes(p.ref)) fail(`${p.ref} is not in the height scan`);
}
must("1 Samuel 10:23", "he was higher than any of the people from his shoulders and upward");
must("Numbers 13:33", "we were in our own sight as grasshoppers");
mustWeb("Numbers 13:33", "the Nephilim, the sons of Anak");
const numeric = PEOPLE.filter((p) => p.numeric);
if (numeric.length !== 2) fail(`expected 2 people with a height in numbers, got ${numeric.length}`);
// the other scan hits are things, not people: temple pillars and cherubim, Haman's gallows, Nebuchadnezzar's image
const thingHits = scan.filter((ref) => !PEOPLE.some((p) => p.ref === ref) && ref !== "1 Samuel 10:23" && ref !== "1 Chronicles 20:6"); // 20:6 is the same man as 2 Samuel 21:20
must("Esther 7:9", "the gallows fifty cubits high");
must("Daniel 3:1", "an image of gold, whose height was threescore cubits");
must("1 Kings 6:23", "two cherubims of olive tree, each ten cubits high");

/* ---------- the giants of Gath: 2 Samuel 21:15-22 and 1 Chronicles 20:4-8 ---------- */
const GATH = [
  { name: "Ishbi-benob", webName: "Ishbibenob", ref: "2 Samuel 21:16", kjv: "Ishbi-benob, which was of the sons of the giant", web: "Ishbibenob, who was of the sons of the giant", killedBy: "Abishai (2 Samuel 21:17)", note: "spear of 300 shekels of brass", chron: null },
  { name: "Saph", webName: null, ref: "2 Samuel 21:18", kjv: "Sibbechai the Hushathite slew Saph", web: "Sibbecai the Hushathite killed Saph", killedBy: "Sibbechai the Hushathite", note: "called Sippai in 1 Chronicles 20:4", chron: { ref: "1 Chronicles 20:4", kjv: "Sibbechai the Hushathite slew Sippai, that was of the children of the giant", web: "Sibbecai the Hushathite killed Sippai, of the sons of the giant" } },
  { name: "Goliath's brother (Lahmi)", webName: null, ref: "2 Samuel 21:19", kjv: "slew the brother of Goliath the Gittite, the staff of whose spear was like a weaver", web: "killed Goliath the Gittite’s brother, the staff of whose spear was like a weaver", killedBy: "Elhanan", note: "named Lahmi in 1 Chronicles 20:5; his spear staff is also \"like a weaver's beam\"", chron: { ref: "1 Chronicles 20:5", kjv: "Elhanan the son of Jair slew Lahmi the brother of Goliath the Gittite", web: "Elhanan the son of Jair killed Lahmi the brother of Goliath the Gittite" } },
  { name: "The man with six fingers and six toes", webName: null, ref: "2 Samuel 21:20", kjv: "on every hand six fingers, and on every foot six toes, four and twenty in number", web: "six fingers on every hand, and six toes on every foot, twenty four in count", killedBy: "Jonathan, son of David's brother Shimeah (2 Samuel 21:21)", note: "\"a man of great stature\"", chron: { ref: "1 Chronicles 20:6", kjv: "whose fingers and toes were four and twenty", web: "twenty-four fingers and toes" } },
];
for (const g of GATH) {
  must(g.ref, g.kjv);
  mustWeb(g.ref, g.web);
  if (g.chron) {
    must(g.chron.ref, g.chron.kjv);
    mustWeb(g.chron.ref, g.chron.web);
  }
}
must("2 Samuel 21:17", "Abishai");
must("2 Samuel 21:21", "Jonathan the son of Shimeah the brother of David slew him");
const four = { kjv: must("2 Samuel 21:22", "These four were born to the giant in Gath"), web: mustWeb("2 Samuel 21:22", "These four were born to the giant in Gath") };
must("1 Chronicles 20:8", "These were born unto the giant in Gath");
must("1 Samuel 17:23", "the Philistine of Gath, Goliath by name");

/* ---------- words ---------- */
const giantKjv = countForms("kjv", ["giant", "giants"]);
const giantWeb = countForms("web", ["giant", "giants"]);
const goliathKjv = countForms("kjv", ["goliath"]);
const goliathWeb = countForms("web", ["goliath"]);
const rephaimWeb = countForms("web", ["rephaim"]);
const nephilimWeb = countForms("web", ["nephilim"]);
const giantRefsKjv = ROWS.kjv.filter((r) => /\bgiants?\b/i.test(r.text)).map((r) => r.ref);
const giantRefsWeb = ROWS.web.filter((r) => /\bgiants?\b/i.test(r.text)).map((r) => r.ref);
const goliathRefs = ROWS.kjv.filter((r) => /\bgoliath\b/i.test(r.text)).map((r) => r.ref);
if (goliathKjv.total !== goliathWeb.total) fail(`Goliath: KJV ${goliathKjv.total} vs WEB ${goliathWeb.total}`);
must("Genesis 6:4", "There were giants in the earth in those days");
mustWeb("Genesis 6:4", "The Nephilim were in the earth in those days");
must("Deuteronomy 2:11", "Which also were accounted giants");
mustWeb("Deuteronomy 2:11", "These also are considered to be Rephaim");

writeList("how-tall-was-goliath", {
  generated: "2026-11-02",
  key,
  armor,
  fight: Object.keys(fight),
  assumptions: { spanPerCubit: SPAN, commonCubitIn: 18, commonCubitCm: Math.round(18 * CM_PER_IN * 10) / 10, royalCubitCm: 52.3, royalCubitIn: Math.round((52.3 / CM_PER_IN) * 10) / 10, shekelG: SHEKEL_G },
  readings: READINGS,
  table,
  six: SIX,
  four: FOUR,
  gapIn,
  wadlow: { cm: WADLOW_CM, ft: 8, in: 11.1, vsSix: vsWadlow },
  weights,
  people: PEOPLE.map(({ who, ref, size, numeric: n }) => ({ who, ref, size, numeric: n })),
  numericPeople: numeric.length,
  scan: { verses: scan.length, things: thingHits },
  gath: GATH.map(({ name, webName, ref, killedBy, note, chron }) => ({ name, webName, ref, killedBy, note, chronRef: chron ? chron.ref : null })),
  fourOfGath: four.kjv,
  words: {
    giantKjv: giantKjv.total,
    giantKjvVerses: giantKjv.verses,
    giantKjvBooks: giantKjv.books,
    giantWeb: giantWeb.total,
    giantWebVerses: giantWeb.verses,
    giantRefsKjv,
    giantRefsWeb,
    rephaimWeb: rephaimWeb.total,
    nephilimWeb: nephilimWeb.total,
    goliath: goliathKjv.total,
    goliathRefs,
  },
});

console.log("readings:", table.map((t) => `${t.label} @ ${t.cubitName}: ${t.ft} ft ${t.in} in (${t.m} m)`).join(" | "));
console.log("weights:", Object.values(weights).map((w) => `${w.what} ${w.shekels} sh = ${w.kg} kg / ${w.lb} lb`).join(" | "));
console.log("height scan", scan.length, "verses; people", PEOPLE.length, "numeric", numeric.length, "; things", thingHits.join("; "));
console.log("giant(s) KJV", giantKjv.total, "in", giantKjv.verses, "verses,", giantKjv.books, "books | WEB", giantWeb.total, "in", giantWeb.verses, "| WEB Rephaim", rephaimWeb.total, "Nephilim", nephilimWeb.total);
console.log("Goliath", goliathKjv.total, goliathRefs.join("; "), "| six vs Wadlow +", vsWadlow.in, "in");
