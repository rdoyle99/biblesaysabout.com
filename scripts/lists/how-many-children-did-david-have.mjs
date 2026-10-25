/* How many children did David have: the four lists of David's sons (2 Samuel 3:2-5, 2 Samuel 5:13-16, 1 Chronicles 3:1-9,
   1 Chronicles 14:3-7) read name by name from the KJV (and the WEB spellings), the Jerusalem sons side by side across the
   three lists that name them, Tamar, the son of Bathsheba who died, David's wives and concubines, what became of each son,
   and the counts of "David" and "son of David". Every name and every claim is checked against the verse it cites.
   Writes lib/data/lists/how-many-children-did-david-have.json. Run: node scripts/lists/how-many-children-did-david-have.mjs */
import { kjv, web, norm, must, mustWeb, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

/** read a list of names from a verse range, in order: each name must be found after the one before it */
function readList(id, ref, names) {
  const bible = id === "kjv" ? kjv : web;
  const text = norm(bible.get(ref) || "");
  if (!text) fail(`${ref} not found in the ${id.toUpperCase()}`);
  let at = 0;
  for (const n of names) {
    const re = new RegExp(`\\b${n}\\b`, "g");
    re.lastIndex = at;
    const m = re.exec(text);
    if (!m) fail(`${ref} (${id.toUpperCase()}) lacks "${n}" after offset ${at}: ${text}`);
    at = m.index + n.length;
  }
  return names;
}

// ---- the six sons born in Hebron: [order, 2 Samuel 3 name, 1 Chronicles 3 name, mother (KJV), mother note]
const HEBRON = [
  [1, "Amnon", "Amnon", "Ahinoam the Jezreelitess", "the firstborn"],
  [2, "Chileab", "Daniel", "Abigail", "\"the wife of Nabal the Carmelite\" (2 Samuel 3:3), \"the Carmelitess\" (1 Chronicles 3:1)"],
  [3, "Absalom", "Absalom", "Maacah", "\"the daughter of Talmai king of Geshur\""],
  [4, "Adonijah", "Adonijah", "Haggith", ""],
  [5, "Shephatiah", "Shephatiah", "Abital", ""],
  [6, "Ithream", "Ithream", "Eglah", "\"David's wife\" (2 Samuel 3:5)"],
];
const ORD = ["firstborn", "second", "third", "fourth", "fifth", "sixth"];
readList("kjv", "2 Samuel 3:2-5", HEBRON.flatMap(([i, s, , m]) => [ORD[i - 1], s, m.split(" ")[0]]));
readList("kjv", "1 Chronicles 3:1-3", HEBRON.flatMap(([i, , c, m]) => [ORD[i - 1], c, m === "Maacah" ? "Maachah" : m.split(" ")[0]]));
readList("web", "2 Samuel 3:2-5", HEBRON.flatMap(([, s, , m]) => [s, m.split(" ")[0]]));
readList("web", "1 Chronicles 3:1-3", HEBRON.flatMap(([, , c, m]) => [c, m.split(" ")[0]]));
must("2 Samuel 3:2", "unto David were sons born in Hebron", "his firstborn was Amnon, of Ahinoam the Jezreelitess");
must("2 Samuel 3:3", "Chileab, of Abigail the wife of Nabal the Carmelite", "Absalom the son of Maacah the daughter of Talmai king of Geshur");
must("2 Samuel 3:4", "Adonijah the son of Haggith", "Shephatiah the son of Abital");
must("2 Samuel 3:5", "Ithream, by Eglah David's wife", "These were born to David in Hebron");
must("1 Chronicles 3:1", "the second Daniel, of Abigail the Carmelitess");
const chr3Six = must("1 Chronicles 3:4", "These six were born unto him in Hebron", "seven years and six months", "thirty and three years");
if (HEBRON.length !== 6) fail("2 Samuel 3:2-5 should name six sons");
if (new Set(HEBRON.map((h) => h[3])).size !== 6) fail("the six Hebron sons should have six different mothers");

// ---- the sons born in Jerusalem, one row per son, aligned across the three lists (null = not in that list).
// [2 Samuel 5:14-16, 1 Chronicles 3:5-8, 1 Chronicles 14:4-7, WEB spellings where they differ {sam, chr3, chr14}, Bathsheba's?]
const JERUSALEM = [
  ["Shammuah", "Shimea", "Shammua", { sam: "Shammua" }, true],
  ["Shobab", "Shobab", "Shobab", {}, true],
  ["Nathan", "Nathan", "Nathan", {}, true],
  ["Solomon", "Solomon", "Solomon", {}, true],
  ["Ibhar", "Ibhar", "Ibhar", {}, false],
  ["Elishua", "Elishama", "Elishua", {}, false],
  [null, "Eliphelet", "Elpalet", { chr14: "Elpelet" }, false],
  [null, "Nogah", "Nogah", {}, false],
  ["Nepheg", "Nepheg", "Nepheg", {}, false],
  ["Japhia", "Japhia", "Japhia", {}, false],
  ["Elishama", "Elishama", "Elishama", {}, false],
  ["Eliada", "Eliada", "Beeliada", {}, false],
  ["Eliphalet", "Eliphelet", "Eliphalet", { sam: "Eliphelet", chr14: "Eliphelet" }, false],
];
const col = (i) => JERUSALEM.map((r) => r[i]).filter(Boolean);
const webCol = (i, k) => JERUSALEM.filter((r) => r[i]).map((r) => r[3][k] || r[i]);
const sam5 = readList("kjv", "2 Samuel 5:14-16", col(0));
const chr3 = readList("kjv", "1 Chronicles 3:5-8", col(1));
const chr14 = readList("kjv", "1 Chronicles 14:4-7", col(2));
readList("web", "2 Samuel 5:14-16", webCol(0, "sam"));
readList("web", "1 Chronicles 3:5-8", webCol(1, "chr3"));
readList("web", "1 Chronicles 14:4-7", webCol(2, "chr14"));
if (sam5.length !== 11) fail(`2 Samuel 5:14-16 should name 11 sons, got ${sam5.length}`);
if (chr3.length !== 13) fail(`1 Chronicles 3:5-8 should name 13 sons, got ${chr3.length}`);
if (chr14.length !== 13) fail(`1 Chronicles 14:4-7 should name 13 sons, got ${chr14.length}`);
must("2 Samuel 5:14", "these be the names of those that were born unto him in Jerusalem");
must("1 Chronicles 14:4", "these are the names of his children which he had in Jerusalem");
// the text's own counts in 1 Chronicles 3: four of Bath-shua, then nine
must("1 Chronicles 3:5", "Shimea, and Shobab, and Nathan, and Solomon, four, of Bath-shua the daughter of Ammiel");
mustWeb("1 Chronicles 3:5", "four, of Bathshua the daughter of Ammiel");
must("1 Chronicles 3:8", "Eliphelet, nine");
const bathshebaSons = JERUSALEM.filter((r) => r[4]).map((r) => r[1]);
const nine = chr3.slice(4);
if (bathshebaSons.length !== 4) fail("1 Chronicles 3:5 says four of Bath-shua");
if (nine.length !== 9) fail(`1 Chronicles 3:6-8 should name nine, got ${nine.length}`);
const namedSons = HEBRON.length + chr3.length;
if (namedSons !== 6 + 4 + 9) fail("1 Chronicles 3 counts 6 + 4 + 9");
if (namedSons !== 19) fail(`1 Chronicles 3 should name 19 sons, got ${namedSons}`);
const chr3Names = [...HEBRON.map((h) => h[2]), ...chr3];
const distinct = new Set(chr3Names).size;
const repeated = [...new Set(chr3Names.filter((n, i) => chr3Names.indexOf(n) !== i))];
if (distinct !== 17 || repeated.join() !== "Elishama,Eliphelet") fail(`1 Chronicles 3 repeats Elishama and Eliphelet: ${distinct} ${repeated}`);
const onlyChr = JERUSALEM.filter((r) => !r[0]).map((r) => r[1]);
if (onlyChr.join() !== "Eliphelet,Nogah") fail("2 Samuel 5 should lack the first Eliphelet and Nogah");
const spellingRows = JERUSALEM.filter((r) => new Set(r.slice(0, 3).filter(Boolean)).size > 1).length;

const verse9 = {
  kjv: must("1 Chronicles 3:9", "These were all the sons of David, beside the sons of the concubines, and Tamar their sister"),
  web: mustWeb("1 Chronicles 3:9", "besides the sons of the concubines; and Tamar was their sister"),
};
const more = {
  sam: must("2 Samuel 5:13", "more concubines and wives out of Jerusalem", "there were yet sons and daughters born to David"),
  samWeb: mustWeb("2 Samuel 5:13", "more concubines and wives for himself out of Jerusalem", "more sons and daughters were born to David"),
  chr: must("1 Chronicles 14:3", "David took more wives at Jerusalem: and David begat more sons and daughters"),
};

// ---- Bathsheba's sons: the child who died, then Solomon, then the four of 1 Chronicles 3:5
const died = {
  kjv: must("2 Samuel 12:18", "on the seventh day, that the child died"),
  web: mustWeb("2 Samuel 12:18", "On the seventh day, the child died"),
};
must("2 Samuel 11:27", "she became his wife, and bare him a son");
must("2 Samuel 12:14", "the child also that is born unto thee shall surely die");
must("2 Samuel 12:15", "the LORD struck the child that Uriah's wife bare unto David, and it was very sick");
must("2 Samuel 12:22", "While the child was yet alive, I fasted and wept");
must("2 Samuel 12:16", "David fasted", "lay all night upon the earth");
must("2 Samuel 12:20", "David arose from the earth, and washed", "he did eat");
must("2 Samuel 11:26", "Uriah her husband was dead, she mourned for her husband");
const goTo = must("2 Samuel 12:23", "I shall go to him, but he shall not return to me");
mustWeb("2 Samuel 12:23", "I will go to him, but he will not return to me");
must("2 Samuel 12:24", "she bare a son, and he called his name Solomon: and the LORD loved him");
must("2 Samuel 12:25", "he called his name Jedidiah, because of the LORD");
must("2 Samuel 11:3", "Bath-sheba, the daughter of Eliam, the wife of Uriah the Hittite");
must("Matthew 1:6", "David the king begat Solomon of her that had been the wife of Urias");
must("1 Kings 1:11", "Bath-sheba the mother of Solomon");
const bathshebaTotal = 1 + bathshebaSons.length;

// ---- Tamar
const tamar = {
  sister: must("2 Samuel 13:1", "Absalom the son of David had a fair sister, whose name was Tamar; and Amnon the son of David loved her"),
  forced: must("2 Samuel 13:14", "being stronger than she, forced her"),
  robes: must("2 Samuel 13:18", "with such robes were the king's daughters that were virgins apparelled"),
  desolate: must("2 Samuel 13:20", "So Tamar remained desolate in her brother Absalom's house"),
  desolateWeb: mustWeb("2 Samuel 13:20", "So Tamar remained desolate in her brother Absalom's house"),
  wroth: must("2 Samuel 13:21", "when king David heard of all these things, he was very wroth"),
  hated: must("2 Samuel 13:22", "Absalom hated Amnon, because he had forced his sister Tamar"),
  twoYears: must("2 Samuel 13:23", "after two full years", "Absalom invited all the king's sons"),
  niece: must("2 Samuel 14:27", "unto Absalom there were born three sons, and one daughter, whose name was Tamar"),
};

// ---- a son of David named outside the four lists
const jerimoth = { kjv: must("2 Chronicles 11:18", "Mahalath the daughter of Jerimoth the son of David"), web: mustWeb("2 Chronicles 11:18", "Jerimoth the son of David") };
for (const l of [HEBRON.map((h) => h[1]), HEBRON.map((h) => h[2]), sam5, chr3, chr14]) if (l.includes("Jerimoth")) fail("Jerimoth should be in none of the lists");

// ---- Michal, Merab, Abishag
const michal = {
  noChild: must("2 Samuel 6:23", "Michal the daughter of Saul had no child unto the day of her death"),
  noChildWeb: mustWeb("2 Samuel 6:23", "Michal the daughter of Saul had no child to the day of her death"),
  despised: must("2 Samuel 6:16", "she despised him in her heart"),
  phalti: must("1 Samuel 25:44", "Saul had given Michal his daughter, David's wife, to Phalti"),
  back: must("2 Samuel 3:15", "took her from her husband, even from Phaltiel"),
  adriel: must("2 Samuel 21:8", "the five sons of Michal the daughter of Saul, whom she brought up for Adriel"),
  adrielWeb: mustWeb("2 Samuel 21:8", "the five sons of Michal the daughter of Saul, whom she bore to Adriel"),
};
const merab = {
  promised: must("1 Samuel 18:17", "my elder daughter Merab, her will I give thee to wife"),
  given: must("1 Samuel 18:19", "she was given unto Adriel the Meholathite to wife"),
};
const abishag = {
  found: must("1 Kings 1:3", "found Abishag a Shunammite"),
  knewNot: must("1 Kings 1:4", "the king knew her not"),
  knewNotWeb: mustWeb("1 Kings 1:4", "the king didn't know her intimately"),
  asked: must("1 Kings 2:17", "that he give me Abishag the Shunammite to wife"),
};

// ---- David's wives: [name, how the Bible introduces her, refs with needles]
const WIVES = [
  ["Michal", "Saul's younger daughter. Saul later gave her to Phalti, and David took her back. She had no child.", [
    ["1 Samuel 14:49", "the name of the firstborn Merab, and the name of the younger Michal"], ["1 Samuel 18:27", "Saul gave him Michal his daughter to wife"], ["1 Samuel 25:44", "Michal his daughter, David's wife"], ["2 Samuel 6:23", "had no child"]]],
  ["Ahinoam of Jezreel", "Mother of Amnon, the firstborn.", [["1 Samuel 25:43", "David also took Ahinoam of Jezreel"], ["2 Samuel 3:2", "Amnon, of Ahinoam the Jezreelitess"]]],
  ["Abigail", "Widow of Nabal the Carmelite. Mother of Chileab (Daniel in 1 Chronicles).", [["1 Samuel 25:38", "the LORD smote Nabal, that he died"], ["1 Samuel 25:42", "became his wife"], ["2 Samuel 3:3", "Chileab, of Abigail"]]],
  ["Maacah", "Daughter of Talmai king of Geshur. Mother of Absalom, whose sister was Tamar.", [["2 Samuel 3:3", "Absalom the son of Maacah the daughter of Talmai king of Geshur"], ["2 Samuel 13:1", "Absalom the son of David had a fair sister, whose name was Tamar"]]],
  ["Haggith", "Mother of Adonijah.", [["2 Samuel 3:4", "Adonijah the son of Haggith"]]],
  ["Abital", "Mother of Shephatiah.", [["2 Samuel 3:4", "Shephatiah the son of Abital"]]],
  ["Eglah", "Mother of Ithream, called \"David's wife\".", [["2 Samuel 3:5", "Ithream, by Eglah David's wife"]]],
  ["Bathsheba", "Wife of Uriah the Hittite, then David's wife. Mother of Solomon and three more sons, and of the child who died. Called Bath-shua in 1 Chronicles 3:5.", [
    ["2 Samuel 11:3", "Bath-sheba"], ["2 Samuel 11:27", "she became his wife"], ["1 Chronicles 3:5", "Bath-shua"]]],
];
const wives = WIVES.map(([name, text, refs]) => {
  refs.forEach(([ref, ...n]) => must(ref, ...n));
  return { name, text, refs: refs.map(([r]) => r) };
});
if (wives.length !== 8) fail("David should have eight named wives");
const concubines = {
  ten: must("2 Samuel 15:16", "the king left ten women, which were concubines, to keep the house"),
  absalom: must("2 Samuel 16:22", "Absalom went in unto his father's concubines in the sight of all Israel"),
  ward: must("2 Samuel 20:3", "the ten women his concubines", "shut up unto the day of their death, living in widowhood"),
  saulsWives: must("2 Samuel 12:8", "thy master's wives into thy bosom"),
  saul: must("2 Samuel 12:7", "I delivered thee out of the hand of Saul"),
};
const CONCUBINES = 10;

// ---- what became of each son: [son, outcome, refs with needles]
const FATES = [
  ["Amnon", "Killed by Absalom's servants, on Absalom's order, two years after he raped Tamar.", [
    ["2 Samuel 13:28", "Smite Amnon; then kill him"], ["2 Samuel 13:29", "the servants of Absalom did unto Amnon as Absalom had commanded"], ["2 Samuel 13:32", "Amnon only is dead"]]],
  ["Chileab (Daniel)", "Nothing more is recorded after the two lists of Hebron sons.", []],
  ["Absalom", "Fled to Geshur for three years, came back, made himself king in Hebron and drove David out of Jerusalem. Caught by his head in an oak and killed by Joab and ten of Joab's armour-bearers.", [
    ["2 Samuel 13:38", "was there three years"], ["2 Samuel 15:10", "Absalom reigneth in Hebron"], ["2 Samuel 15:14", "let us flee; for we shall not else escape from Absalom"], ["2 Samuel 18:9", "his head caught hold of the oak"],
    ["2 Samuel 18:14", "thrust them through the heart of Absalom"], ["2 Samuel 18:15", "ten young men that bare Joab's armour"]]],
  ["Adonijah", "Declared \"I will be king\" while David was old. Spared by Solomon, then put to death on Solomon's order after he asked for Abishag as his wife.", [
    ["1 Kings 1:5", "I will be king"], ["1 Kings 1:52", "If he will shew himself a worthy man"], ["1 Kings 2:17", "Abishag the Shunammite to wife"],
    ["1 Kings 2:25", "he fell upon him that he died"]]],
  ["Shephatiah", "Nothing more is recorded.", []],
  ["Ithream", "Nothing more is recorded.", []],
  ["Solomon", "Anointed king by Zadok while David was still alive, and reigned 40 years. Matthew's genealogy of Jesus runs through him.", [
    ["1 Kings 1:39", "anointed Solomon"], ["1 Kings 11:42", "forty years"], ["Matthew 1:6", "David the king begat Solomon"]]],
  ["Nathan", "Luke's genealogy of Jesus runs through him.", [["Luke 3:31", "which was the son of Nathan, which was the son of David"]]],
];
const fates = FATES.map(([son, text, refs]) => {
  refs.forEach(([ref, ...n]) => must(ref, ...n));
  return { son, text, refs: refs.map(([r]) => r) };
});
// "nothing more": the name does not appear outside its lists (Daniel and Nathan are other men's names too, so Chileab only)
const LISTS = new Set(["2 Samuel 3", "1 Chronicles 3", "2 Samuel 5", "1 Chronicles 14"]);
const outside = (name) => countForms("kjv", [name.toLowerCase()], (r) => !LISTS.has(`${r.book} ${r.ch}`)).total;
const silent = { chileab: outside("Chileab"), ithream: outside("Ithream") };
if (silent.chileab !== 0 || silent.ithream !== 0) fail(`Chileab and Ithream should appear only in the lists: ${JSON.stringify(silent)}`);

// ---- which son became king, and why not the eldest
const king = {
  mine: must("1 Kings 2:15", "Thou knowest that the kingdom was mine", "it was his from the LORD"),
  mineWeb: mustWeb("1 Kings 2:15", "the kingdom was mine", "it was his from Yahweh"),
  afterAbsalom: must("1 Kings 1:6", "his father had not displeased him at any time", "his mother bare him after Absalom"),
  feast: must("1 Kings 1:9", "Adonijah slew sheep and oxen and fat cattle", "called all his brethren the king's sons"),
  notCalled: must("1 Kings 1:10", "Solomon his brother, he called not"),
  nathan: must("1 Kings 1:13", "Go and get thee in unto king David"),
  assembled: must("1 Chronicles 28:1", "David assembled all the princes of Israel"),
  counsel: must("1 Kings 1:12", "save thine own life, and the life of thy son Solomon"),
  swore: must("1 Kings 1:17", "thou swarest by the LORD thy God unto thine handmaid, saying, Assuredly Solomon thy son shall reign after me"),
  promise: must("1 Kings 1:30", "Assuredly Solomon thy son shall reign after me, and he shall sit upon my throne in my stead"),
  promiseWeb: mustWeb("1 Kings 1:30", "Assuredly Solomon your son shall reign after me"),
  chosen: must("1 Chronicles 28:5", "of all my sons, (for the LORD hath given me many sons,) he hath chosen Solomon my son"),
  chosenWeb: mustWeb("1 Chronicles 28:5", "Of all my sons (for Yahweh has given me many sons), he has chosen Solomon my son"),
  name: must("1 Chronicles 22:9", "his name shall be Solomon"),
  elder: must("1 Kings 2:22", "he is mine elder brother"),
  throne: must("1 Kings 2:12", "Then sat Solomon upon the throne of David his father"),
  old: must("1 Kings 1:1", "king David was old and stricken in years"),
  mourn: must("2 Samuel 18:33", "O my son Absalom, my son, my son Absalom! would God I had died for thee"),
  noSon: must("2 Samuel 18:18", "I have no son to keep my name in remembrance"),
  chiefRulers: must("2 Samuel 8:18", "David's sons were chief rulers"),
  reign: must("2 Samuel 5:4", "thirty years old when he began to reign, and he reigned forty years"),
};

// ---- counts
const NT = (r) => r.testament === "NT";
const sonNt = { kjv: countPhrase("kjv", /\bson of David\b/gi, NT), web: countPhrase("web", /\bson of David\b/gi, NT) };
const NOT_JESUS = ["Matthew 1:20", "Luke 3:31"]; // Joseph; Nathan in Luke's genealogy
must("Matthew 1:20", "Joseph, thou son of David");
for (const r of NOT_JESUS) if (!sonNt.kjv.refs.includes(r)) fail(`${r} should say "son of David" in the KJV`);
const jesusRefs = sonNt.kjv.refs.filter((r) => !NOT_JESUS.includes(r));
const jesusRefsWeb = sonNt.web.refs.filter((r) => !NOT_JESUS.includes(r));
const webMissing = jesusRefs.filter((r) => !jesusRefsWeb.includes(r));
if (webMissing.join() !== "Matthew 22:42") fail(`the WEB should lack only Matthew 22:42: ${webMissing}`);
mustWeb("Matthew 22:42", "Of David");
must("Matthew 1:1", "Jesus Christ, the son of David");
must("Matthew 20:30", "two blind men", "Have mercy on us, O Lord, thou Son of David");
const mercy = jesusRefs.filter((r) => /mercy/i.test(kjv.get(r))).length;
if (mercy * 2 <= jesusRefs.length) fail(`most "son of David" verses about Jesus should be cries for mercy: ${mercy}/${jesusRefs.length}`);

const words = {
  davidKjv: countForms("kjv", ["david", "david's"]),
  davidWeb: countForms("web", ["david", "david's"]),
  jesusKjv: countForms("kjv", ["jesus", "jesus'"]).total,
  mosesKjv: countForms("kjv", ["moses", "moses'"]).total,
  absalomKjv: countForms("kjv", ["absalom", "absalom's"]).total,
  absalomWeb: countForms("web", ["absalom", "absalom's"]).total,
  tamarKjv: countForms("kjv", ["tamar"]).total,
  tamar2SamKjv: countForms("kjv", ["tamar"]).byBook["2 Samuel"],
  tamar2SamWeb: countForms("web", ["tamar"]).byBook["2 Samuel"],
  tamarWeb: countForms("web", ["tamar"]).total,
  bathshebaKjv: countPhrase("kjv", /\bBath-sheba\b/gi).total,
  bathshebaWeb: countPhrase("web", /\bBathsheba\b/gi).total,
  sonOfDavidKjv: countPhrase("kjv", /\bson of David\b/gi).total,
  sonOfDavidWeb: countPhrase("web", /\bson of David\b/gi).total,
  sonOfDavidNtKjv: sonNt.kjv.total,
  sonOfDavidNtWeb: sonNt.web.total,
  jesusSonOfDavidKjv: jesusRefs.length,
  jesusSonOfDavidWeb: jesusRefsWeb.length,
  jesusRefs,
  mercy,
  sonsOfDavid: countPhrase("kjv", /\bsons of David\b/gi),
};
if (words.davidKjv.total <= words.jesusKjv || words.davidKjv.total <= words.mosesKjv) fail("David should be named more often than Jesus and Moses in the KJV");
if (words.jesusSonOfDavidKjv !== 14) fail(`Jesus (or the Christ) should be called son of David 14 times in the KJV NT, got ${words.jesusSonOfDavidKjv}`);

must("1 Kings 11:3", "he had seven hundred wives");
// sons whose violent deaths the Bible tells (each fate row above carries the verse of the killing)
const KILLED = [["Amnon", "2 Samuel 13:29"], ["Absalom", "2 Samuel 18:15"], ["Adonijah", "1 Kings 2:25"]];
for (const [son, ref] of KILLED) if (!fates.find((f) => f.son === son)?.refs.includes(ref)) fail(`${son}'s fate should cite ${ref}`);

const totals = {
  solomonWives: 700,
  killed: KILLED.map(([s]) => s),
  namedSons: namedSons, // 1 Chronicles 3:1-8
  hebron: HEBRON.length,
  jerusalemChr3: chr3.length,
  jerusalemSam5: sam5.length,
  jerusalemChr14: chr14.length,
  bathshebaSonsListed: bathshebaSons.length,
  bathshebaTotal,
  nine: nine.length,
  distinctNames: distinct,
  repeated,
  onlyInChronicles: onlyChr,
  spellingRows,
  daughtersNamed: 1,
  diedUnnamed: 1,
  jerimoth: 1,
  identified: namedSons + 1 + 1 + 1, // 19 sons, Tamar, the child who died, Jerimoth
  wivesNamed: wives.length,
  concubinesCounted: CONCUBINES,
};

writeList("how-many-children-did-david-have", {
  generated: "2026-10-25",
  totals,
  hebron: HEBRON.map(([order, sam, chr, mother, note]) => ({ order, sam, chr, mother, note })),
  jerusalem: JERUSALEM.map(([sam, chr3n, chr14n, w, bath], i) => ({ row: i + 1, sam, chr3: chr3n, chr14: chr14n, web: w, bathsheba: bath })),
  quotes: { verse9, more, died, goTo, chr3Six, jerimoth, michal, merab, abishag, tamar, king, concubines },
  wives,
  fates,
  silent,
  words,
});

console.log("named sons (1 Chronicles 3):", namedSons, "= 6 Hebron +", bathshebaSons.length, "of Bath-shua +", nine.length, "| distinct names", distinct, "repeated", repeated.join(", "));
console.log("Jerusalem lists: 2 Samuel 5", sam5.length, "| 1 Chronicles 3", chr3.length, "| 1 Chronicles 14", chr14.length, "| rows with spelling differences", spellingRows, "| only in Chronicles", onlyChr.join(", "));
console.log("children identified:", totals.identified, "| wives named", wives.length, "| concubines", CONCUBINES);
console.log("David KJV", words.davidKjv.total, "top", words.davidKjv.top, "| WEB", words.davidWeb.total, "| Jesus KJV", words.jesusKjv, "| Moses KJV", words.mosesKjv);
console.log("son of David: KJV", words.sonOfDavidKjv, "WEB", words.sonOfDavidWeb, "| NT KJV", words.sonOfDavidNtKjv, "of Jesus", words.jesusSonOfDavidKjv, "| NT WEB", words.sonOfDavidNtWeb, "of Jesus", words.jesusSonOfDavidWeb);
