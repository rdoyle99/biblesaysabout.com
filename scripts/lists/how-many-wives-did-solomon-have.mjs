/* How many wives did Solomon have: 1 Kings 11:3 and every other verse about Solomon's wives, the two women named,
   the nations and gods of 1 Kings 11, and a table of the men with more than one wife in the Bible, every number
   checked against the KJV (and the WEB for the key verses).
   Writes lib/data/lists/how-many-wives-did-solomon-have.json. Run: node scripts/lists/how-many-wives-did-solomon-have.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

const key = {
  kjv: must("1 Kings 11:3", "seven hundred wives, princesses, and three hundred concubines", "his wives turned away his heart"),
  web: mustWeb("1 Kings 11:3", "seven hundred wives, princesses, and three hundred concubines"),
};
const WIVES = 700;
const CONCUBINES = 300;

const nations = {
  kjv: must("1 Kings 11:1", "loved many strange women, together with the daughter of Pharaoh", "Moabites, Ammonites, Edomites, Zidonians, and Hittites"),
  list: ["Egypt (Pharaoh's daughter)", "Moab", "Ammon", "Edom", "Sidon (Zidonians)", "the Hittites"],
};

// [who, what the Bible says, refs with needles]
const NAMED = [
  ["Pharaoh's daughter", "The first marriage the Bible tells of, an alliance with Egypt made after Solomon took the throne. Her name is never given. Pharaoh gave the city of Gezer to her as a present, and Solomon built her a house of her own.", [
    ["1 Kings 3:1", "took Pharaoh's daughter"], ["1 Kings 9:16", "a present unto his daughter, Solomon's wife"], ["1 Kings 7:8", "an house for Pharaoh's daughter"]]],
  ["Naamah the Ammonitess", "The mother of Rehoboam, the son who became king after Solomon. She is the only wife of Solomon the Bible names.", [
    ["1 Kings 14:21", "his mother's name was Naamah an Ammonitess"], ["2 Chronicles 12:13", "Naamah an Ammonitess"]]],
];

const GODS = [
  ["Ashtoreth", "the Zidonians", "1 Kings 11:5", "Ashtoreth the goddess of the Zidonians"],
  ["Milcom", "the Ammonites", "1 Kings 11:5", "Milcom the abomination of the Ammonites"],
  ["Chemosh", "Moab", "1 Kings 11:7", "Chemosh, the abomination of Moab"],
  ["Molech", "the children of Ammon", "1 Kings 11:7", "Molech, the abomination of the children of Ammon"],
];
for (const [, , ref, needle] of GODS) must(ref, needle);

// [man, wives (number or text), concubines, ref, needles...]
// rule: every man the Bible gives a number of wives for, plus the best-known men with more than one wife named
// (Abraham, Jacob, Esau, David). The genealogies of 1 Chronicles name a few more (Shaharaim, checked below).
const MEN = [
  ["Solomon", WIVES, CONCUBINES, "1 Kings 11:3", "seven hundred wives", "three hundred concubines"],
  ["Rehoboam", 18, 60, "2 Chronicles 11:21", "eighteen wives, and threescore concubines"],
  ["Abijah", 14, null, "2 Chronicles 13:21", "married fourteen wives"],
  ["David", 8, 10, "2 Samuel 15:16", "ten women, which were concubines"],
  ["Abraham", 3, null, "Genesis 25:1", "took a wife, and her name was Keturah"],
  ["Jacob", 4, null, "Genesis 30:4", "Bilhah her handmaid to wife"],
  ["Esau", 3, null, "Genesis 36:2-3", "Esau took his wives", "Adah", "Aholibamah", "Bashemath"],
  ["Lamech", 2, null, "Genesis 4:19", "Lamech took unto him two wives"],
  ["Elkanah", 2, null, "1 Samuel 1:2", "he had two wives"],
  ["Joash", 2, null, "2 Chronicles 24:3", "Jehoiada took for him two wives"],
  ["Ashur", 2, null, "1 Chronicles 4:5", "Ashur the father of Tekoa had two wives, Helah and Naarah"],
  ["Gideon", "many", 1, "Judges 8:30-31", "for he had many wives", "his concubine that was in Shechem"],
];
const men = MEN.map(([man, wives, concubines, ref, ...needles]) => {
  must(ref, ...needles);
  return { man, wives, concubines, ref };
});

// David's eight named wives
const DAVID = [
  ["Michal", "1 Samuel 18:27", "Saul gave him Michal his daughter to wife"],
  ["Ahinoam", "2 Samuel 3:2", "Ahinoam the Jezreelitess"],
  ["Abigail", "2 Samuel 3:3", "Abigail"],
  ["Maacah", "2 Samuel 3:3", "Maacah"],
  ["Haggith", "2 Samuel 3:4", "Haggith"],
  ["Abital", "2 Samuel 3:4", "Abital"],
  ["Eglah", "2 Samuel 3:5", "Eglah David's wife"],
  ["Bathsheba", "2 Samuel 11:27", "she became his wife"],
];
for (const [, ref, needle] of DAVID) must(ref, needle);
if (DAVID.length !== 8) fail("David should have eight named wives");
must("2 Samuel 5:13", "more concubines and wives out of Jerusalem");

// Abraham's three and Jacob's four, by name
must("Genesis 16:3", "gave her to her husband Abram to be his wife");
must("Genesis 29:28", "he gave him Rachel his daughter to wife also");
must("Genesis 30:9", "gave her Jacob to wife");
must("Genesis 26:34", "Judith", "Bashemath");
must("Genesis 28:9", "Mahalath");
must("1 Chronicles 8:8-9", "Hushim and Baara were his wives", "Hodesh his wife");
must("Genesis 25:6", "the concubines, which Abraham had");

const checks = {
  deut: must("Deuteronomy 17:17", "Neither shall he multiply wives to himself, that his heart turn not away"),
  oldAge: must("1 Kings 11:4", "when Solomon was old, that his wives turned away his heart after other gods"),
  warned: must("1 Kings 11:2", "Ye shall not go in to them"),
  burned: must("1 Kings 11:8", "all his strange wives, which burnt incense and sacrificed unto their gods"),
  angry: must("1 Kings 11:9", "the LORD was angry with Solomon"),
  nehemiah: must("Nehemiah 13:26", "Did not Solomon king of Israel sin by these things", "outlandish women cause to sin"),
  song: must("Song of Solomon 6:8", "threescore queens, and fourscore concubines, and virgins without number"),
  daughters: must("1 Kings 4:11", "Taphath the daughter of Solomon") && must("1 Kings 4:15", "Basmath the daughter of Solomon"),
  rehoboam: must("1 Kings 11:43", "Rehoboam his son reigned in his stead"),
  forty: must("1 Kings 11:42", "forty years"),
  rend: must("1 Kings 11:11", "I will surely rend the kingdom from thee") && must("1 Kings 11:12", "in thy days I will not do it"),
  officers: must("1 Kings 4:7", "twelve officers"),
  pharaohEgypt: must("1 Kings 3:1", "made affinity with Pharaoh king of Egypt"),
  throne: must("1 Kings 2:12", "Then sat Solomon upon the throne"),
  rehoboamAge: must("1 Kings 14:21", "Rehoboam was forty and one years old when he began to reign"),
  threeGods: must("1 Kings 11:33", "Ashtoreth", "Chemosh", "Milcom the god of the children of Ammon"),
};

const words = {
  solomonKjv: countForms("kjv", ["solomon", "solomon's"]),
  solomonWeb: countForms("web", ["solomon", "solomon's"]),
  wivesKjv: countForms("kjv", ["wives"]),
  concubineKjv: countForms("kjv", ["concubine", "concubines"]),
  concubineWeb: countForms("web", ["concubine", "concubines"]),
  sevenHundredWives: countPhrase("kjv", /seven hundred wives/gi),
};

writeList("how-many-wives-did-solomon-have", {
  generated: "2026-10-25",
  wives: WIVES,
  concubines: CONCUBINES,
  women: WIVES + CONCUBINES,
  key,
  nations,
  named: NAMED.map(([who, text, refs]) => {
    refs.forEach(([ref, ...n]) => must(ref, ...n));
    return { who, text, refs: refs.map(([r]) => r) };
  }),
  gods: GODS.map(([god, people, ref]) => ({ god, people, ref })),
  men,
  rehoboamAge: 41,
  reign: 40,
  david: DAVID.map(([name, ref]) => ({ name, ref })),
  words,
  checks: Object.keys(checks),
});

console.log("men:", men.map((m) => `${m.man} ${m.wives}/${m.concubines ?? "-"}`).join(", "));
console.log("Solomon KJV", words.solomonKjv.total, "top", words.solomonKjv.top, "| WEB", words.solomonWeb.total);
console.log("wives KJV", words.wivesKjv.total, "| concubine(s) KJV", words.concubineKjv.total, "WEB", words.concubineWeb.total, "| 'seven hundred wives'", words.sevenHundredWives.refs);
