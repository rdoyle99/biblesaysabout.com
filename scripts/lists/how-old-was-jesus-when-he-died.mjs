/* How old was Jesus when he died: the three verses that give Jesus an age (Luke 2:42, Luke 3:23, John 8:57), the
   Passovers the Gospel of John names, the dating anchors the Gospels give (Herod, Tiberius, Pilate), and every use
   of "passover" in the four Gospels, counted in the KJV and the WEB.
   Every quoted verse is checked in BOTH translations and the build stops when a needle is missing. The outside dates
   (Herod's death, Pilate's years, the two crucifixion years) are sourced on the page, not computed from the text.
   Writes lib/data/lists/how-old-was-jesus-when-he-died.json. Run: node scripts/lists/how-old-was-jesus-when-he-died.mjs */
import { must, mustWeb, countForms, fail, writeList, ROWS, norm } from "../lib/list-helpers.mjs";

/** a verse in both translations: returns { ref, kjv, web } after checking each needle list */
function both(ref, kjvNeedles, webNeedles) {
  const k = must(ref, ...kjvNeedles);
  const w = mustWeb(ref, ...webNeedles);
  return { ref, kjv: norm(k), web: norm(w) };
}

/* ---------- every verse that gives Jesus an age ---------- */
const AGES = [
  { age: "twelve", value: 12, when: "His family's Passover trip to Jerusalem; he stays behind in the temple", ...both("Luke 2:42", ["when he was twelve years old", "after the custom of the feast"], ["When he was twelve years old"]) },
  { age: "about thirty", value: 30, when: "When he began his ministry, after his baptism", ...both("Luke 3:23", ["Jesus himself began to be about thirty years of age"], ["was about thirty years old"]) },
  { age: "not yet fifty", value: null, when: "His opponents in the temple, near the end of his ministry", ...both("John 8:57", ["Thou art not yet fifty years old", "hast thou seen Abraham"], ["You are not yet fifty years old"]) },
];

// Check the claim that no other verse gives Jesus an age: every verse in the Gospels that has "years old" or
// "years of age" must be on the list or be about someone else (these are read and named here, so a new one stops the build).
const GOSPELS = ["Matthew", "Mark", "Luke", "John"];
const OTHER_AGE_VERSES = {
  "Matthew 2:16": "the boys Herod killed, two years old and under",
  "Mark 5:42": "Jairus's daughter, twelve years old",
  "Luke 8:42": "Jairus's daughter, about twelve",
  "John 9:21": "the man born blind (\"he is of age\")",
  "John 9:23": "the man born blind (\"he is of age\")",
};
const ageRe = /\byears? (old|of age)\b|\bof (the )?age\b/i; // KJV only: the WEB's "end of the age" is not an age
const kjvAgeVerses = ROWS.kjv.filter((r) => GOSPELS.includes(r.book) && ageRe.test(r.text)).map((r) => r.ref);
for (const ref of kjvAgeVerses) {
  if (AGES.some((a) => a.ref === ref)) continue;
  if (!OTHER_AGE_VERSES[ref]) fail(`${ref} (KJV) has an age phrase that is not on the list: ${ROWS.kjv.find((r) => r.ref === ref).text}`);
}
for (const ref of Object.keys(OTHER_AGE_VERSES)) if (!kjvAgeVerses.includes(ref)) fail(`${ref} is listed as another age verse but has no age phrase in the KJV`);

/* ---------- the Passovers and feasts John names during the ministry ---------- */
const FEASTS = [
  { n: 1, name: "Passover", named: true, note: "Jesus clears the temple; the first Passover of the ministry", ...both("John 2:13", ["the Jews' passover was at hand", "Jesus went up to Jerusalem"], ["The Passover of the Jews was at hand", "Jesus went up to Jerusalem"]) },
  { n: null, name: "a feast of the Jews", named: false, note: "not named; some count it as a fourth Passover, most read it as another feast", ...both("John 5:1", ["there was a feast of the Jews", "Jesus went up to Jerusalem"], ["there was a feast of the Jews", "Jesus went up to Jerusalem"]) },
  { n: 2, name: "Passover", named: true, note: "near the feeding of the five thousand", ...both("John 6:4", ["the passover, a feast of the Jews, was nigh"], ["the Passover, the feast of the Jews, was at hand"]) },
  { n: 3, name: "Passover", named: true, note: "the last Passover, the week of the crucifixion", ...both("John 11:55", ["the Jews' passover was nigh at hand"], ["the Passover of the Jews was at hand"]) },
];
const namedPassovers = FEASTS.filter((f) => f.named).length;
if (namedPassovers !== 3) fail(`expected 3 named Passovers in John, got ${namedPassovers}`);

// supporting verses for the last Passover and the other feasts John names
const extra = {
  john121: both("John 12:1", ["six days before the passover came to Bethany"], ["Six days before the Passover, Jesus came to Bethany"]),
  john1914: both("John 19:14", ["it was the preparation of the passover", "about the sixth hour"], ["the Preparation Day of the Passover", "about the sixth hour"]),
  john72: both("John 7:2", ["the Jews' feast of tabernacles was at hand"], ["the Feast of Booths, was at hand"]),
  john1022: both("John 10:22", ["the feast of the dedication", "it was winter"], ["the Feast of the Dedication"]),
  mark1542: both("Mark 15:42", ["the preparation, that is, the day before the sabbath"], ["the Preparation Day, that is, the day before the Sabbath"]),
  mark1534: both("Mark 15:34", ["at the ninth hour Jesus cried with a loud voice"], ["At the ninth hour Jesus cried with a loud voice"]),
  luke241: both("Luke 2:41", ["his parents went to Jerusalem every year at the feast of the passover"], ["His parents went every year to Jerusalem at the feast of the Passover"]),
  john220: both("John 2:20", ["Forty and six years was this temple in building"], ["It took forty-six years to build this temple"]),
};

/* ---------- dating anchors in the Gospels ---------- */
const ANCHORS = {
  herodBirth: both("Matthew 2:1", ["Jesus was born in Bethlehem of Judaea in the days of Herod the king"], ["Jesus was born in Bethlehem of Judea in the days of King Herod"]),
  herodBoys: both("Matthew 2:16", ["from two years old and under"], ["from two years old and under"]),
  herodDead: both("Matthew 2:19", ["when Herod was dead"], ["when Herod was dead"]),
  tiberius: both("Luke 3:1", ["in the fifteenth year of the reign of Tiberius Caesar", "Pontius Pilate being governor of Judaea"], ["in the fifteenth year of the reign of Tiberius Caesar", "Pontius Pilate being governor of Judea"]),
  johnBaptist: both("Luke 3:2", ["the word of God came unto John the son of Zacharias in the wilderness"], ["the word of God came to John"]),
  pilate: both("Matthew 27:2", ["delivered him to Pontius Pilate the governor"], ["delivered him up to Pontius Pilate, the governor"]),
  caiaphas: both("John 18:13", ["Caiaphas, which was the high priest that same year"], ["Caiaphas, who was high priest that year"]),
};

/* ---------- "passover" in the four Gospels, KJV and WEB ---------- */
const inGospel = (b) => (r) => r.book === b;
const passover = {};
for (const id of ["kjv", "web"]) {
  passover[id] = { total: 0, byBook: {} };
  for (const b of GOSPELS) {
    const c = countForms(id, ["passover", "passovers"], inGospel(b));
    passover[id].byBook[b] = { uses: c.total, verses: c.verses };
    passover[id].total += c.total;
  }
  const whole = countForms(id, ["passover", "passovers"]);
  passover[id].bible = whole.total;
  passover[id].bibleVerses = whole.verses;
}
const johnTop = GOSPELS.every((b) => passover.kjv.byBook.John.uses >= passover.kjv.byBook[b].uses);
// Matthew, Mark and Luke: every "passover" verse is the last week (Matthew 26, Mark 14, Luke 22) or, in Luke, Jesus at twelve (Luke 2)
const SYN_LAST = { Matthew: [26], Mark: [14], Luke: [2, 22] };
const synoptic = {};
for (const [b, chs] of Object.entries(SYN_LAST)) {
  const refs = ROWS.kjv.filter((r) => r.book === b && /\bpassover\b/i.test(r.text));
  for (const r of refs) if (!chs.includes(r.ch)) fail(`${r.ref} names a Passover outside the last week: ${r.text}`);
  synoptic[b] = { chapters: [...new Set(refs.map((r) => r.ch))], verses: refs.length };
}

/* ---------- the dating math: years from birth to death with no year zero ---------- */
// Outside sources (named on the page): Herod died 4 BC (most historians; some say 1 BC), so the birth falls about
// 6-4 BC; the two crucifixion years most cited within Pilate's term (AD 26-36) are AD 30 and AD 33.
const span = (bc, ad) => bc + ad - 1; // 1 BC is followed by AD 1, so 4 BC to AD 30 is 33 years
const BIRTH = [6, 5, 4];
const DEATH = [30, 33];
const grid = BIRTH.map((bc) => ({ bc, ages: DEATH.map((ad) => ({ ad, years: span(bc, ad) })) }));
const all = grid.flatMap((g) => g.ages.map((a) => a.years));
const low = Math.min(...all);
const high = Math.max(...all);
if (low !== 33 || high !== 38) fail(`expected the range 33-38, got ${low}-${high}`);
// the tradition: about 30 at the start (Luke 3:23) plus three Passovers in John
const tradition = 30 + namedPassovers;

writeList("how-old-was-jesus-when-he-died", {
  generated: "2026-11-02",
  ages: AGES,
  otherAgeVerses: Object.entries(OTHER_AGE_VERSES).map(([ref, who]) => ({ ref, who })),
  kjvAgeVerseCount: kjvAgeVerses.length,
  feasts: FEASTS,
  namedPassovers,
  extra,
  anchors: ANCHORS,
  passover: { ...passover, johnTop, synoptic },
  dating: { birth: BIRTH, death: DEATH, grid, low, high, tradition },
});

console.log("age verses:", AGES.map((a) => `${a.ref} ${a.age}`).join("; "), "| other Gospel age verses:", kjvAgeVerses.length - AGES.length);
console.log("John names", namedPassovers, "Passovers + 1 unnamed feast (5:1)");
console.log("passover KJV", JSON.stringify(passover.kjv.byBook), "total", passover.kjv.total, "bible", passover.kjv.bible);
console.log("passover WEB", JSON.stringify(passover.web.byBook), "total", passover.web.total, "bible", passover.web.bible);
console.log("range", low, "-", high, "| tradition", tradition);
