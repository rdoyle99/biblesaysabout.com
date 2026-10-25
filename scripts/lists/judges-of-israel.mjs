/* The judges of Israel in order: the twelve the Book of Judges names (Othniel to Samson), Barak beside Deborah,
   Abimelech (a ruler the text never calls a judge), and Eli and Samuel from 1 Samuel. Each row carries the tribe
   where the text gives it, the oppressor and the years of oppression, the years of rest or of judging, and the key
   verses, every one checked against the KJV (and the year figures against the WEB too). Every number of years is
   read from the verse's own number words by a small parser ("fourscore", "twenty and three", "twenty-three") and
   the build stops if the parsed number disagrees with the table.
   Writes lib/data/lists/judges-of-israel.json. Run: node scripts/lists/judges-of-israel.mjs */
import { must, mustWeb, countForms, countPhrase, verseRows, fail, writeList } from "../lib/list-helpers.mjs";

// ---- number words, KJV and WEB: "fourscore" 80, "threescore and ten" 70, "twenty and three" 23, "twenty-three" 23,
// "four hundred and eightieth" 480, "an hundred and ten" 110, "forty and two thousand" 42000
const UNITS = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, twentieth: 20, thirtieth: 30, fortieth: 40, fiftieth: 50, sixtieth: 60, seventieth: 70, eightieth: 80, ninetieth: 90 };
export function parseNumber(phrase) {
  const words = phrase.toLowerCase().replace(/-/g, " ").split(/\s+/).filter((w) => w && w !== "and");
  let total = 0;
  let cur = 0;
  for (const w of words) {
    const score = w.match(/^([a-z]+)score$/);
    if (w === "score") cur = (cur || 1) * 20;
    else if (score && UNITS[score[1]]) cur += UNITS[score[1]] * 20;
    else if (UNITS[w] !== undefined) cur += UNITS[w];
    else if (TENS[w] !== undefined) cur += TENS[w];
    else if (ORD[w] !== undefined) cur += ORD[w];
    else if (w === "hundred" || w === "hundredth") cur = (cur || 1) * 100;
    else if (w === "thousand") {
      total += (cur || 1) * 1000;
      cur = 0;
    } else fail(`number parser: unknown word "${w}" in "${phrase}"`);
  }
  return total + cur;
}
for (const [p, n] of [["fourscore", 80], ["threescore and ten", 70], ["twenty and three", 23], ["twenty-three", 23], ["four hundred and eightieth", 480], ["an hundred and ten", 110], ["four hundred fifty", 450], ["forty and two thousand", 42000], ["ninety and eight", 98]]) {
  if (parseNumber(p) !== n) fail(`number parser: "${p}" gave ${parseNumber(p)}, expected ${n}`);
}

/** a figure of years: the KJV verse must hold ctx, ctx must hold "<kjvWords> year", the WEB verse "<webWords> year",
 *  and both number phrases must parse to value */
function years(ref, ctx, kjvWords, value, webWords) {
  must(ref, ctx);
  if (!ctx.toLowerCase().includes(`${kjvWords} year`)) fail(`${ref}: context "${ctx}" lacks "${kjvWords} year"`);
  mustWeb(ref, `${webWords} year`);
  const k = parseNumber(kjvWords);
  const w = parseNumber(webWords);
  if (k !== value) fail(`${ref}: KJV "${kjvWords}" parses to ${k}, the table says ${value}`);
  if (w !== value) fail(`${ref}: WEB "${webWords}" parses to ${w}, the table says ${value}`);
  return { years: value, ref, kjv: `${kjvWords} years`, web: `${webWords} years` };
}

// ---- the rows. kind: judge (one of the twelve of the Book of Judges) | partner (Barak) | ruler (Abimelech) | samuel (1 Samuel)
// tribe: [label, ref, KJV needle] or [label, null] when the text names a place but no tribe
// oppressor: [who, ref, ctx, kjvWords, value, webWords] | null
// rule: [kind (rest | quietness | judged | reigned), ref, ctx, kjvWords, value, webWords] | null
// story: [fromCh, fromV, toCh, toV] in Judges: our ranges, from the verse that opens the judge's episode (usually "did evil")
// to the judge's death, burial or the rest that closes it | null
const J = [
  {
    name: "Othniel", kind: "judge", book: "Judges", chapters: "3:7-11",
    tribe: ["Judah (Caleb's younger brother; Caleb was of Judah)", "Numbers 13:6", "Of the tribe of Judah, Caleb the son of Jephunneh"],
    oppressor: ["Chushan-rishathaim, king of Mesopotamia", "Judges 3:8", "the children of Israel served Chushan-rishathaim eight years", "eight", 8, "eight"],
    rule: ["rest", "Judges 3:11", "the land had rest forty years", "forty", 40, "forty"],
    key: [["Judges 3:9", "Othniel the son of Kenaz, Caleb's younger brother"], ["Judges 3:10", "he judged Israel"], ["Judges 1:13", "Othniel the son of Kenaz, Caleb's younger brother"]],
    web: ["Judges 3:9", "Othniel the son of Kenaz, Caleb's younger brother"],
    text: "The first judge. The Spirit of the LORD came on him and he defeated the king of Mesopotamia; earlier he had taken the city of Kirjath-sepher and married Caleb's daughter Achsah.",
    story: [3, 7, 3, 11],
  },
  {
    name: "Ehud", kind: "judge", book: "Judges", chapters: "3:12-30",
    tribe: ["Benjamin", "Judges 3:15", "Ehud the son of Gera, a Benjamite"],
    oppressor: ["Eglon, king of Moab", "Judges 3:14", "served Eglon the king of Moab eighteen years", "eighteen", 18, "eighteen"],
    rule: ["rest", "Judges 3:30", "the land had rest fourscore years", "fourscore", 80, "eighty"],
    key: [["Judges 3:15", "a man lefthanded"], ["Judges 3:21", "took the dagger from his right thigh, and thrust it into his belly"]],
    web: ["Judges 3:15", "a left-handed man"],
    text: "A left-handed man who brought Eglon a present, then killed him with a dagger in his private room. The 80 years of rest after him are the longest rest in the book.",
    story: [3, 12, 3, 30],
  },
  {
    name: "Shamgar", kind: "judge", book: "Judges", chapters: "3:31",
    tribe: ["Not given (\"the son of Anath\")", null],
    oppressor: null,
    rule: null,
    key: [["Judges 3:31", "Shamgar the son of Anath, which slew of the Philistines six hundred men with an ox goad: and he also delivered Israel"], ["Judges 5:6", "In the days of Shamgar the son of Anath"]],
    web: ["Judges 3:31", "six hundred men of the Philistines with an ox goad"],
    text: "One verse: he killed 600 Philistines with an ox goad and \"also delivered Israel\". No years are given, and Deborah's song names him once more (Judges 5:6).",
    story: [3, 31, 3, 31],
  },
  {
    name: "Deborah", kind: "judge", book: "Judges", chapters: "4-5",
    tribe: ["Not given (she lived in mount Ephraim)", null],
    oppressor: ["Jabin, king of Canaan, and his captain Sisera", "Judges 4:3", "twenty years he mightily oppressed the children of Israel", "twenty", 20, "twenty"],
    rule: ["rest", "Judges 5:31", "And the land had rest forty years", "forty", 40, "forty"],
    key: [["Judges 4:4", "Deborah, a prophetess, the wife of Lapidoth, she judged Israel at that time"], ["Judges 4:5", "the children of Israel came up to her for judgment"], ["Judges 5:7", "I arose a mother in Israel"]],
    web: ["Judges 4:4", "Deborah, a prophetess, the wife of Lappidoth, judged Israel at that time"],
    text: "A prophetess, and the only woman among the judges. Israel came to her for judgment under a palm tree between Ramah and Bethel; she sent Barak against Sisera, and Jael killed Sisera with a tent nail.",
    story: [4, 1, 5, 31],
  },
  {
    name: "Barak", kind: "partner", book: "Judges", chapters: "4-5",
    tribe: ["Naphtali (from Kedesh-naphtali)", "Judges 4:6", "Barak the son of Abinoam out of Kedesh-naphtali"],
    oppressor: null,
    rule: null,
    key: [["Judges 4:8", "If thou wilt go with me, then I will go"], ["Judges 5:1", "Then sang Deborah and Barak the son of Abinoam"], ["Hebrews 11:32", "Barak"]],
    web: ["Judges 4:8", "If you will go with me, then I will go"],
    text: "Deborah's commander, who would not go to battle without her. The text never says he judged Israel, but Hebrews 11:32 names him beside Gideon, Samson and Jephthah.",
    story: null,
  },
  {
    name: "Gideon", kind: "judge", book: "Judges", chapters: "6-8",
    tribe: ["Manasseh (the family of Abiezer)", "Judges 6:15", "my family is poor in Manasseh"],
    oppressor: ["Midian", "Judges 6:1", "the LORD delivered them into the hand of Midian seven years", "seven", 7, "seven"],
    rule: ["quietness", "Judges 8:28", "the country was in quietness forty years in the days of Gideon", "forty", 40, "forty"],
    key: [["Judges 6:11", "his son Gideon threshed wheat by the winepress"], ["Judges 7:7", "By the three hundred men that lapped will I save you"], ["Judges 8:23", "I will not rule over you, neither shall my son rule over you: the LORD shall rule over you"], ["Judges 6:32", "he called him Jerubbaal"]],
    web: ["Judges 8:23", "I will not rule over you, neither shall my son rule over you. Yahweh shall rule over you"],
    text: "Also called Jerubbaal. He tested God with a fleece, beat Midian with 300 men, and refused to rule over Israel. The gold ephod he made later \"became a snare unto Gideon, and to his house\".",
    story: [6, 1, 8, 32],
  },
  {
    name: "Abimelech", kind: "ruler", book: "Judges", chapters: "9",
    tribe: ["Manasseh (Gideon's son, by a concubine in Shechem)", "Judges 8:31", "his concubine that was in Shechem, she also bare him a son, whose name he called Abimelech"],
    oppressor: null,
    rule: ["reigned", "Judges 9:22", "When Abimelech had reigned three years over Israel", "three", 3, "three"],
    key: [["Judges 9:5", "slew his brethren the sons of Jerubbaal, being threescore and ten persons, upon one stone"], ["Judges 9:6", "made Abimelech king"], ["Judges 9:53", "a certain woman cast a piece of a millstone upon Abimelech's head"]],
    web: ["Judges 9:22", "Abimelech was prince over Israel three years"],
    text: "Not called a judge. He killed 70 of his brothers, was made king by the men of Shechem, and at Thebez a woman cast a piece of a millstone on his head; his armourbearer finished him.",
    story: [9, 1, 9, 57],
  },
  {
    name: "Tola", kind: "judge", book: "Judges", chapters: "10:1-2",
    tribe: ["Issachar", "Judges 10:1", "Tola the son of Puah, the son of Dodo, a man of Issachar"],
    oppressor: null,
    rule: ["judged", "Judges 10:2", "he judged Israel twenty and three years", "twenty and three", 23, "twenty-three"],
    key: [["Judges 10:1", "there arose to defend Israel Tola"], ["Judges 10:2", "was buried in Shamir"]],
    web: ["Judges 10:2", "He judged Israel twenty-three years"],
    text: "Rose \"to defend Israel\" after Abimelech. He lived and was buried in Shamir in mount Ephraim.",
    story: [10, 1, 10, 2],
  },
  {
    name: "Jair", kind: "judge", book: "Judges", chapters: "10:3-5",
    tribe: ["Not given (\"a Gileadite\", east of the Jordan)", null],
    oppressor: null,
    rule: ["judged", "Judges 10:3", "judged Israel twenty and two years", "twenty and two", 22, "twenty-two"],
    key: [["Judges 10:3", "Jair, a Gileadite"], ["Judges 10:4", "thirty sons that rode on thirty ass colts, and they had thirty cities"]],
    web: ["Judges 10:3", "he judged Israel twenty-two years"],
    text: "He had 30 sons who rode 30 donkey colts and held 30 towns in Gilead, called Havoth-jair.",
    story: [10, 3, 10, 5],
  },
  {
    name: "Jephthah", kind: "judge", book: "Judges", chapters: "10:6-12:7",
    tribe: ["Not given (\"the Gileadite\", east of the Jordan)", null],
    oppressor: ["Ammon (with the Philistines in the west)", "Judges 10:8", "eighteen years, all the children of Israel that were on the other side Jordan", "eighteen", 18, "eighteen"],
    rule: ["judged", "Judges 12:7", "Jephthah judged Israel six years", "six", 6, "six"],
    key: [["Judges 11:1", "Jephthah the Gileadite was a mighty man of valour, and he was the son of an harlot"], ["Judges 11:31", "I will offer it up for a burnt offering"], ["Judges 11:34", "she was his only child"]],
    web: ["Judges 12:7", "Jephthah judged Israel six years"],
    text: "The son of a harlot, driven out by his brothers and then called back to lead Gilead against Ammon. He vowed a burnt offering of whatever came out of his house first, and his only daughter came out to meet him.",
    story: [10, 6, 12, 7],
  },
  {
    name: "Ibzan", kind: "judge", book: "Judges", chapters: "12:8-10",
    tribe: ["Not given (\"of Bethlehem\"; the text does not say which Bethlehem)", null],
    oppressor: null,
    rule: ["judged", "Judges 12:9", "he judged Israel seven years", "seven", 7, "seven"],
    key: [["Judges 12:8", "Ibzan of Bethlehem judged Israel"], ["Judges 12:9", "thirty sons, and thirty daughters"]],
    web: ["Judges 12:9", "He judged Israel seven years"],
    text: "He had 30 sons and 30 daughters, married all 60 outside his clan, and was buried at Bethlehem.",
    story: [12, 8, 12, 10],
  },
  {
    name: "Elon", kind: "judge", book: "Judges", chapters: "12:11-12",
    tribe: ["Zebulun", "Judges 12:11", "Elon, a Zebulonite"],
    oppressor: null,
    rule: ["judged", "Judges 12:11", "he judged Israel ten years", "ten", 10, "ten"],
    key: [["Judges 12:12", "was buried in Aijalon in the country of Zebulun"]],
    web: ["Judges 12:11", "he judged Israel ten years"],
    text: "Two verses: he judged ten years and was buried in Aijalon in Zebulun.",
    story: [12, 11, 12, 12],
  },
  {
    name: "Abdon", kind: "judge", book: "Judges", chapters: "12:13-15",
    tribe: ["Ephraim (a Pirathonite, buried \"in the land of Ephraim\")", "Judges 12:15", "buried in Pirathon in the land of Ephraim"],
    oppressor: null,
    rule: ["judged", "Judges 12:14", "he judged Israel eight years", "eight", 8, "eight"],
    key: [["Judges 12:13", "Abdon the son of Hillel, a Pirathonite"], ["Judges 12:14", "forty sons and thirty nephews, that rode on threescore and ten ass colts"]],
    web: ["Judges 12:14", "He judged Israel eight years"],
    text: "He had 40 sons and 30 grandsons (\"nephews\" in the KJV) who rode 70 donkey colts.",
    story: [12, 13, 12, 15],
  },
  {
    name: "Samson", kind: "judge", book: "Judges", chapters: "13-16",
    tribe: ["Dan", "Judges 13:2", "a certain man of Zorah, of the family of the Danites, whose name was Manoah"],
    oppressor: ["the Philistines", "Judges 13:1", "the LORD delivered them into the hand of the Philistines forty years", "forty", 40, "forty"],
    rule: ["judged", "Judges 16:31", "And he judged Israel twenty years", "twenty", 20, "twenty"],
    key: [["Judges 13:5", "the child shall be a Nazarite unto God from the womb: and he shall begin to deliver Israel out of the hand of the Philistines"], ["Judges 15:20", "he judged Israel in the days of the Philistines twenty years"], ["Judges 16:30", "the dead which he slew at his death were more than they which he slew in his life"]],
    web: ["Judges 15:20", "He judged Israel twenty years in the days of the Philistines"],
    text: "A Nazarite from birth, he killed a lion bare-handed and a thousand men with a jawbone. Delilah learned the secret of his hair; blinded and bound, he pulled down the house where the Philistines were sacrificing to Dagon, on them and on himself.",
    story: [13, 1, 16, 31],
  },
  {
    name: "Eli", kind: "samuel", book: "1 Samuel", chapters: "1-4",
    tribe: ["Levi (a priest; God chose his father's house \"out of all the tribes of Israel to be my priest\")", "1 Samuel 2:28", "did I choose him out of all the tribes of Israel to be my priest"],
    oppressor: null,
    rule: ["judged", "1 Samuel 4:18", "And he had judged Israel forty years", "forty", 40, "forty"],
    key: [["1 Samuel 1:9", "Eli the priest sat upon a seat by a post of the temple of the LORD"], ["1 Samuel 4:15", "Eli was ninety and eight years old"], ["1 Samuel 4:18", "he fell from off the seat backward by the side of the gate, and his neck brake, and he died"]],
    web: ["1 Samuel 4:18", "He had judged Israel forty years"],
    text: "The priest at Shiloh, under whom the boy Samuel served. He died at 98 when he heard the Philistines had taken the ark of God.",
    story: null,
  },
  {
    name: "Samuel", kind: "samuel", book: "1 Samuel", chapters: "1-25",
    tribe: ["Ephraim by home (mount Ephraim); 1 Chronicles 6:33 lists him among the Levites, a Kohathite", "1 Samuel 1:1", "of mount Ephraim, and his name was Elkanah"],
    oppressor: null,
    rule: null,
    key: [["1 Samuel 7:15", "Samuel judged Israel all the days of his life"], ["1 Samuel 7:16", "in circuit to Bethel, and Gilgal, and Mizpeh"], ["1 Samuel 8:5", "make us a king to judge us like all the nations"], ["1 Samuel 10:1", "Samuel took a vial of oil, and poured it upon his head"]],
    web: ["1 Samuel 7:15", "Samuel judged Israel all the days of his life"],
    text: "The last judge, and a prophet. He judged Israel all his life on a yearly circuit; when the people asked for a king he anointed Saul. No number of years is given.",
    story: null,
  },
];

// verse counts for the story ranges, KJV and WEB
function storyVerses(id, [fc, fv, tc, tv]) {
  return verseRows(id, "Judges", fc, tc).filter((r) => (r.ch > fc || r.v >= fv) && (r.ch < tc || r.v <= tv)).length;
}

const by = (name) => rows.find((r) => r.name === name);
const rows = J.map((r, i) => {
  if (r.tribe[1]) must(r.tribe[1], r.tribe[2]);
  for (const [ref, ...n] of r.key) must(ref, ...n);
  mustWeb(...r.web);
  const oppressor = r.oppressor ? { who: r.oppressor[0], ...years(...r.oppressor.slice(1)) } : null;
  const rule = r.rule ? { kind: r.rule[0], ...years(...r.rule.slice(1)) } : null;
  const verses = r.story ? storyVerses("kjv", r.story) : null;
  const versesWeb = r.story ? storyVerses("web", r.story) : null;
  if (verses !== versesWeb) fail(`${r.name}: story verse count differs, KJV ${verses} WEB ${versesWeb}`);
  return {
    seq: i + 1,
    name: r.name,
    kind: r.kind,
    book: r.book,
    chapters: r.chapters,
    tribe: r.tribe[0],
    tribeRef: r.tribe[1],
    oppressor,
    rule,
    key: r.key.map(([ref]) => ref),
    quote: r.key[0][1],
    quoteRef: r.key[0][0],
    text: r.text,
    verses,
  };
});

// the twelve of the Book of Judges, in order, and the numbering the page prints
const TWELVE = ["Othniel", "Ehud", "Shamgar", "Deborah", "Gideon", "Tola", "Jair", "Jephthah", "Ibzan", "Elon", "Abdon", "Samson"];
const twelve = rows.filter((r) => r.kind === "judge");
if (twelve.map((r) => r.name).join() !== TWELVE.join()) fail(`the twelve changed: ${twelve.map((r) => r.name).join(", ")}`);
let n = 0;
for (const r of rows) r.order = r.kind === "judge" ? ++n : r.kind === "samuel" ? ++n : null;
if (rows.find((r) => r.name === "Samuel").order !== 14) fail("Samuel should be number 14");

// order in the text: each judge comes after the one before it
must("Judges 3:31", "after him was Shamgar");
must("Judges 4:1", "when Ehud was dead");
must("Judges 10:1", "after Abimelech there arose to defend Israel Tola");
must("Judges 10:3", "after him arose Jair");
must("Judges 12:8", "after him Ibzan");
must("Judges 12:11", "after him Elon");
must("Judges 12:13", "after him Abdon");

// "judged Israel": the people it is said of. Ehud, Shamgar and Gideon (and Barak) are never said to have judged Israel.
const judgedIsraelKjv = countPhrase("kjv", /judged (?:the children of )?Israel/gi);
const judgedIsraelWeb = countPhrase("web", /judged (?:the children of )?Israel/gi);
const JUDGED = {
  "Judges 3:10": "Othniel", "Judges 4:4": "Deborah", "Judges 10:2": "Tola", "Judges 10:3": "Jair", "Judges 12:7": "Jephthah",
  "Judges 12:8": "Ibzan", "Judges 12:9": "Ibzan", "Judges 12:11": "Elon", "Judges 12:13": "Abdon", "Judges 12:14": "Abdon",
  "Judges 15:20": "Samson", "Judges 16:31": "Samson", "1 Samuel 4:18": "Eli", "1 Samuel 7:6": "Samuel", "1 Samuel 7:15": "Samuel",
  "1 Samuel 7:16": "Samuel", "1 Samuel 7:17": "Samuel", "2 Kings 23:22": null,
};
for (const c of [judgedIsraelKjv, judgedIsraelWeb]) if (c.refs.join("|") !== Object.keys(JUDGED).join("|")) fail(`"judged Israel" verses changed: ${c.refs.join(", ")}`);
must("2 Kings 23:22", "the days of the judges that judged Israel");
const judgedPeople = [...new Set(Object.values(JUDGED).filter(Boolean))];
const neverJudged = rows.filter((r) => !judgedPeople.includes(r.name)).map((r) => r.name);
if (neverJudged.join() !== "Ehud,Shamgar,Barak,Gideon,Abimelech") fail(`never "judged Israel": ${neverJudged}`);
for (const r of rows) r.judgedIsrael = judgedPeople.includes(r.name);
// what the text calls the three instead
const deliverers = {
  ehud: must("Judges 3:15", "the LORD raised them up a deliverer, Ehud"),
  shamgar: must("Judges 3:31", "he also delivered Israel"),
  gideon: must("Judges 6:14", "thou shalt save Israel from the hand of the Midianites"),
};

// ---- the cycle
const J_ = (r) => r.book === "Judges";
const cycle = {
  didEvilKjv: countPhrase("kjv", /did evil (?:again )?in the sight of the LORD/g, J_),
  didEvilWeb: countPhrase("web", /did that which was evil in Yahweh's sight/g, J_),
  didEvilAllKjv: countPhrase("kjv", /did evil (?:again )?in the sight of the LORD/g),
  criedKjv: countPhrase("kjv", /cried unto the LORD/g, J_),
  criedWeb: countPhrase("web", /cried to Yahweh/g, J_),
  restKjv: countPhrase("kjv", /the land had rest/g, J_),
  restWeb: countPhrase("web", /the land had rest/gi, J_),
  spiritKjv: countPhrase("kjv", /Spirit of the LORD/g, J_),
  spiritWeb: countPhrase("web", /Yahweh's Spirit|Spirit of Yahweh/g, J_),
  noKingKjv: countPhrase("kjv", /there was no king in Israel/g),
  noKingWeb: countPhrase("web", /there was no king in Israel/g),
  rightEyesKjv: countPhrase("kjv", /right in his own eyes/g, J_),
};
const EVIL = "Judges 2:11|Judges 3:7|Judges 3:12|Judges 4:1|Judges 6:1|Judges 10:6|Judges 13:1";
if (cycle.didEvilKjv.refs.join("|") !== EVIL || cycle.didEvilWeb.refs.join("|") !== EVIL) fail(`"did evil" verses in Judges changed: ${cycle.didEvilKjv.refs}`);
const NOKING = "Judges 17:6|Judges 18:1|Judges 19:1|Judges 21:25";
if (cycle.noKingKjv.refs.join("|") !== NOKING || cycle.noKingWeb.refs.join("|") !== NOKING) fail(`"no king in Israel" verses changed: ${cycle.noKingKjv.refs}`);
if (cycle.rightEyesKjv.refs.join("|") !== "Judges 17:6|Judges 21:25") fail("right in his own eyes verses changed");
// the WEB says "the land had rest" at Judges 8:28 where the KJV says "the country was in quietness"
if (cycle.restKjv.total !== 3 || cycle.restWeb.total !== 4 || !cycle.restWeb.refs.includes("Judges 8:28")) fail(`"the land had rest": KJV ${cycle.restKjv.refs} WEB ${cycle.restWeb.refs}`);
const cycleVerses = {
  sin: must("Judges 2:11", "the children of Israel did evil in the sight of the LORD, and served Baalim"),
  sold: must("Judges 3:8", "the anger of the LORD was hot against Israel, and he sold them into the hand of Chushan-rishathaim"),
  cry: must("Judges 3:9", "when the children of Israel cried unto the LORD, the LORD raised up a deliverer"),
  raised: must("Judges 2:16", "Nevertheless the LORD raised up judges, which delivered them out of the hand of those that spoiled them"),
  raisedWeb: mustWeb("Judges 2:16", "Yahweh raised up judges, who saved them out of the hand of those who plundered them"),
  relapse: must("Judges 2:19", "when the judge was dead, that they returned, and corrupted themselves more than their fathers"),
  rest: must("Judges 3:11", "And the land had rest forty years"),
  generation: must("Judges 2:10", "there arose another generation after them, which knew not the LORD"),
  joshua: must("Judges 2:8", "Joshua the son of Nun, the servant of the LORD, died"),
  afterJoshua: must("Judges 1:1", "Now after the death of Joshua"),
  noKing: must("Judges 21:25", "In those days there was no king in Israel: every man did that which was right in his own eyes"),
  noKingWeb: mustWeb("Judges 21:25", "In those days there was no king in Israel. Everyone did that which was right in his own eyes"),
};

// ---- how long: the sum of every figure, with the cross-checks
const judgesRows = rows.filter((r) => r.book === "Judges");
const oppressionYears = judgesRows.reduce((s, r) => s + (r.oppressor?.years || 0), 0);
const ruleYears = judgesRows.reduce((s, r) => s + (r.rule?.years || 0), 0);
const judgesTotal = oppressionYears + ruleYears;
const eli = rows.find((r) => r.name === "Eli").rule.years;
const withEli = judgesTotal + eli;
if (oppressionYears !== 111) fail(`oppression years ${oppressionYears}`);
if (ruleYears !== 299) fail(`rest and rule years ${ruleYears}`);
if (judgesTotal !== 410) fail(`Judges total ${judgesTotal}`);
const kings61 = must("1 Kings 6:1", "in the four hundred and eightieth year after the children of Israel were come out of the land of Egypt, in the fourth year of Solomon's reign over Israel");
mustWeb("1 Kings 6:1", "In the four hundred and eightieth year after the children of Israel had come out of the land of Egypt");
const fromExodus = parseNumber("four hundred and eightieth");
const acts1320 = must("Acts 13:20", "he gave unto them judges about the space of four hundred and fifty years, until Samuel the prophet");
const acts1320Web = mustWeb("Acts 13:20", "After these things he gave them judges until Samuel the prophet");
const acts1319Web = mustWeb("Acts 13:19", "he gave them their land for an inheritance, for about four hundred fifty years");
const acts450 = parseNumber("four hundred and fifty");
if (acts450 !== parseNumber("four hundred fifty")) fail("Acts 13 450 differs between KJV and WEB");
if (acts450 !== withEli) fail(`Judges plus Eli is ${withEli}, not ${acts450}`);
// 1 Kings 6:1 laid end to end: wilderness 40 (Acts 13:18), judges and Eli, Saul 40 (Acts 13:21), David 40 (1 Kings 2:11)
const wilderness = years("Acts 13:18", "about the time of forty years suffered he their manners in the wilderness", "forty", 40, "forty").years;
const saul = years("Acts 13:21", "by the space of forty years", "forty", 40, "forty").years;
const david = years("1 Kings 2:11", "the days that David reigned over Israel were forty years", "forty", 40, "forty").years;
const endToEnd = wilderness + withEli + saul + david;
const overBy = endToEnd - fromExodus;
if (endToEnd !== 570 || overBy !== 90) fail(`end to end ${endToEnd}, over by ${overBy}`);
// Jephthah's "three hundred years" (Judges 11:26) against every figure in Judges before his own six years
const jeph = years("Judges 11:26", "in all the cities that be along by the coasts of Arnon, three hundred years", "three hundred", 300, "three hundred");
const jIdx = rows.findIndex((r) => r.name === "Jephthah");
const beforeJephthah = rows.slice(0, jIdx).filter((r) => r.book === "Judges").reduce((s, r) => s + (r.oppressor?.years || 0) + (r.rule?.years || 0), 0) + rows[jIdx].oppressor.years;
if (beforeJephthah !== 319) fail(`figures before Jephthah ${beforeJephthah}`);
// overlaps the text itself shows
const overlaps = {
  samson: must("Judges 15:20", "he judged Israel in the days of the Philistines twenty years"),
  twoFronts: must("Judges 10:7", "he sold them into the hands of the Philistines, and into the hands of the children of Ammon"),
  eastOnly: must("Judges 10:8", "on the other side Jordan in the land of the Amorites, which is in Gilead"),
  ruth: must("Ruth 1:1", "in the days when the judges ruled"),
  ruthWeb: mustWeb("Ruth 1:1", "In the days when the judges judged"),
};
const samsonInPhilistine = rows.find((r) => r.name === "Samson");
if (samsonInPhilistine.rule.years >= samsonInPhilistine.oppressor.years) fail("Samson's years should fit inside the Philistine years");

// tribes, of the twelve (Barak, Abimelech, Eli and Samuel apart)
const TRIBE_OF = { Othniel: "Judah", Ehud: "Benjamin", Shamgar: null, Deborah: null, Gideon: "Manasseh", Tola: "Issachar", Jair: null, Jephthah: null, Ibzan: null, Elon: "Zebulun", Abdon: "Ephraim", Samson: "Dan" };
const tribes = Object.values(TRIBE_OF).filter(Boolean);
const gileadites = ["Jair", "Jephthah"];
for (const g of gileadites) if (!rows.find((r) => r.name === g).tribe.includes("Gileadite")) fail(`${g} should be a Gileadite`);
const tribeStats = { named: tribes.length, list: tribes, none: Object.keys(TRIBE_OF).filter((k) => !TRIBE_OF[k]), gileadites };
if (new Set(tribes).size !== tribes.length) fail("two of the twelve share a tribe; the page says no tribe repeats");

// major and minor (a later convention: the Bible has neither label); minor = the six with a few verses each
const MINOR = ["Shamgar", "Tola", "Jair", "Ibzan", "Elon", "Abdon"];
const MAJOR = TWELVE.filter((x) => !MINOR.includes(x));
const minorVerses = rows.filter((r) => MINOR.includes(r.name)).reduce((s, r) => s + r.verses, 0);
const longestStory = [...rows].filter((r) => r.verses && r.kind === "judge").sort((a, b) => b.verses - a.verses)[0];
if (minorVerses !== 14) fail(`minor judges' verses ${minorVerses}`);
if (longestStory.name !== "Gideon" || longestStory.verses !== 97) fail(`longest story ${longestStory.name} ${longestStory.verses}`);
for (const m of MINOR) if (rows.find((r) => r.name === m).verses > 3) fail(`${m} has more than 3 verses`);
for (const m of MAJOR) if (rows.find((r) => r.name === m).verses < 5) fail(`${m} has fewer than 5 verses`);

// other verses the page quotes
const checks = {
  deborahWoman: must("Judges 4:9", "the LORD shall sell Sisera into the hand of a woman"),
  jael: must("Judges 4:21", "Jael Heber's wife took a nail of the tent"),
  palm: must("Judges 4:5", "she dwelt under the palm tree of Deborah between Ramah and Bethel in mount Ephraim"),
  gideonRule: must("Judges 8:22", "Rule thou over us, both thou, and thy son"),
  ephod: must("Judges 8:27", "which thing became a snare unto Gideon, and to his house"),
  fleece: must("Judges 6:37", "I will put a fleece of wool in the floor"),
  seventySons: must("Judges 8:30", "Gideon had threescore and ten sons of his body begotten: for he had many wives"),
  abimelechDies: must("Judges 9:54", "Draw thy sword, and slay me, that men say not of me, A woman slew him"),
  abimelechSeventy: must("Judges 9:56", "in slaying his seventy brethren"),
  thebez: must("Judges 9:50", "Then went Abimelech to Thebez"),
  shibboleth: must("Judges 12:6", "Say now Shibboleth"),
  jawbone: must("Judges 15:15", "slew a thousand men therewith"),
  delilah: must("Judges 16:4", "whose name was Delilah"),
  nazarite: must("Judges 16:17", "I have been a Nazarite unto God from my mother's womb"),
  lion: must("Judges 14:6", "the Spirit of the LORD came mightily upon him, and he rent him"),
  dagon: must("Judges 16:23", "Dagon their god"),
  achsah: must("Judges 1:13", "he gave him Achsah his daughter to wife"),
  kirjathSepher: must("Judges 1:12", "He that smiteth Kirjath-sepher"),
  othnielSpirit: must("Judges 3:10", "the Spirit of the LORD came upon him, and he judged Israel"),
  eglon: must("Judges 3:20", "I have a message from God unto thee"),
  eliShiloh: must("1 Samuel 1:9", "in Shiloh"),
  ark: must("1 Samuel 4:17", "the ark of God is taken"),
  samuelProphet: must("1 Samuel 3:20", "Samuel was established to be a prophet of the LORD"),
  samuelSons: must("1 Samuel 8:1", "he made his sons judges over Israel"),
  joelAbiah: must("1 Samuel 8:2", "Joel", "Abiah: they were judges in Beer-sheba"),
  sonsBribes: must("1 Samuel 8:3", "his sons walked not in his ways, but turned aside after lucre, and took bribes"),
  samuelKohath: must("1 Chronicles 6:33", "Of the sons of the Kohathites"),
  samuelKohathWeb: mustWeb("1 Chronicles 6:33", "the son of Samuel"),
  samuelLevi: must("1 Chronicles 6:28", "the sons of Samuel"),
  elkanahWeb: mustWeb("1 Samuel 1:1", "an Ephraimite"),
  elkanahKjv: must("1 Samuel 1:1", "an Ephrathite"),
  samuelList: must("1 Samuel 12:11", "the LORD sent Jerubbaal, and Bedan, and Jephthah, and Samuel"),
  hebrews: must("Hebrews 11:32", "Gedeon, and of Barak, and of Samson, and of Jephthae; of David also, and Samuel"),
  hebrewsWeb: mustWeb("Hebrews 11:32", "Gideon, Barak, Samson, Jephthah, David, Samuel"),
  samsonPhilistines: must("Judges 16:30", "Let me die with the Philistines"),
  kirjath: must("1 Samuel 7:2", "while the ark abode in Kirjath-jearim, that the time was long; for it was twenty years"),
  philistinesSubdued: must("1 Samuel 7:13", "the Philistines were subdued", "all the days of Samuel"),
  saulAnointed: must("1 Samuel 10:1", "the LORD hath anointed thee to be captain over his inheritance"),
  mosesJudged: must("Exodus 18:13", "Moses sat to judge the people"),
  kingToJudge: mustWeb("1 Samuel 8:5", "Now make us a king to judge us like all the nations"),
  othnielFirst: must("Judges 3:9", "the LORD raised up a deliverer to the children of Israel, who delivered them, even Othniel"),
  deborahWeb: mustWeb("Judges 4:4", "judged Israel at that time"),
  ammonite: must("Judges 11:32", "So Jephthah passed over unto the children of Ammon to fight against them; and the LORD delivered them into his hands"),
  blinded: must("Judges 16:21", "put out his eyes", "bound him with fetters of brass"),
  thrustOut: must("Judges 11:2", "they thrust out Jephthah"),
  gileadHead: must("Judges 11:11", "the people made him head and captain over them"),
  samuelServed: must("1 Samuel 2:11", "the child did minister unto the LORD before Eli the priest"),
  tower: must("Judges 9:51", "there was a strong tower within the city"),
  spiritMove: must("Judges 13:25", "the Spirit of the LORD began to move him"),
  houseFull: must("Judges 16:27", "the house was full of men and women; and all the lords of the Philistines were there"),
  lastVerse: (() => {
    const last = verseRows("kjv", "Judges").at(-1).ref;
    if (last !== "Judges 21:25") fail(`Judges ends at ${last}`);
    return last;
  })(),
  judgesWordInJudges: (() => {
    const refs = verseRows("kjv", "Judges").filter((r) => /\bjudges\b/i.test(r.text)).map((r) => r.ref).join("|");
    if (refs !== "Judges 2:16|Judges 2:17|Judges 2:18") fail(`"judges" in Judges: ${refs}`);
    return refs;
  })(),
  longestRest: (() => {
    const max = Math.max(...rows.filter((r) => r.rule).map((r) => r.rule.years));
    if (max !== 80 || by("Ehud").rule.years !== 80) fail(`longest rest ${max}`);
    return max;
  })(),
  spiritRefs: (() => {
    if (cycle.spiritKjv.refs.join("|") !== "Judges 3:10|Judges 6:34|Judges 11:29|Judges 13:25|Judges 14:6|Judges 14:19|Judges 15:14") fail(`Spirit verses ${cycle.spiritKjv.refs}`);
    return cycle.spiritKjv.total;
  })(),
  eliAge: years("1 Samuel 4:15", "Eli was ninety and eight years old", "ninety and eight", 98, "ninety-eight").years,
};
const ephraimites = parseNumber("forty and two thousand");
must("Judges 12:6", "forty and two thousand");
mustWeb("Judges 12:6", "forty-two thousand");
if (ephraimites !== parseNumber("forty-two thousand")) fail("Judges 12:6 number differs");
const jephthahShort = must("Judges 12:7", "Jephthah judged Israel six years");

// ---- words
const inBook = (b) => (r) => r.book === b;
const words = {
  judgeKjv: countForms("kjv", ["judge"]),
  judgeWeb: countForms("web", ["judge"]),
  judgedKjv: countForms("kjv", ["judged"]),
  judgedWeb: countForms("web", ["judged"]),
  judgesKjv: countForms("kjv", ["judges"]),
  judgesWeb: countForms("web", ["judges"]),
  allFormsKjv: countForms("kjv", ["judge", "judged", "judges", "judgeth", "judging", "judge's"]),
  allFormsWeb: countForms("web", ["judge", "judged", "judges", "judgeth", "judging", "judge's"]),
  delivererKjv: countForms("kjv", ["deliverer"], inBook("Judges")),
  saviorWeb: countForms("web", ["savior"], inBook("Judges")),
};
const names = {};
for (const nm of ["Othniel", "Ehud", "Shamgar", "Deborah", "Barak", "Gideon", "Abimelech", "Tola", "Jair", "Jephthah", "Ibzan", "Elon", "Abdon", "Samson"]) {
  const k = countForms("kjv", [nm.toLowerCase(), nm.toLowerCase() + "'s"], inBook("Judges"));
  const w = countForms("web", [nm.toLowerCase(), nm.toLowerCase() + "'s"], inBook("Judges"));
  names[nm] = { kjv: k.total, web: w.total };
}
for (const nm of ["Eli", "Samuel"]) {
  const k = countForms("kjv", [nm.toLowerCase(), nm.toLowerCase() + "'s"], inBook("1 Samuel"));
  const w = countForms("web", [nm.toLowerCase(), nm.toLowerCase() + "'s"], inBook("1 Samuel"));
  names[nm] = { kjv: k.total, web: w.total, book: "1 Samuel" };
}
const mostNamed = Object.entries(names).filter(([, v]) => !v.book).sort((a, b) => b[1].kjv - a[1].kjv);
// Abimelech (40) is named more than any judge in Judges; Gideon and Samson tie on 39 / 38
if (mostNamed[0][0] !== "Abimelech") fail(`most named in Judges is ${mostNamed[0][0]}`);

const slim = (c) => ({ total: c.total, verses: c.verses, books: c.books, top: c.top, inJudges: c.byBook["Judges"] || 0, in1Samuel: c.byBook["1 Samuel"] || 0 });

writeList("judges-of-israel", {
  generated: "2026-10-25",
  rows,
  twelve: TWELVE,
  count: TWELVE.length,
  first: TWELVE[0],
  lastInJudges: TWELVE.at(-1),
  woman: "Deborah",
  major: MAJOR,
  minor: MINOR,
  minorVerses,
  longestStory: { name: longestStory.name, verses: longestStory.verses },
  samsonVerses: rows.find((r) => r.name === "Samson").verses,
  years: {
    oppression: oppressionYears,
    rule: ruleYears,
    judgesTotal,
    eli,
    withEli,
    acts450,
    fromExodus,
    wilderness,
    saul,
    david,
    endToEnd,
    overBy,
    jephthah300: jeph.years,
    beforeJephthah,
  },
  quotes: {
    kings61,
    acts1320,
    acts1320Web,
    acts1319Web,
    jephthahShort,
  },
  judgedIsrael: {
    kjv: judgedIsraelKjv.total,
    kjvVerses: judgedIsraelKjv.refs.length,
    web: judgedIsraelWeb.total,
    people: judgedPeople,
    never: neverJudged,
    refs: JUDGED,
  },
  cycle: Object.fromEntries(Object.entries(cycle).map(([k, v]) => [k, { total: v.total, refs: v.refs }])),
  tribes: tribeStats,
  ephraimites,
  eliAge: checks.eliAge,
  words: Object.fromEntries(Object.entries(words).map(([k, v]) => [k, slim(v)])),
  names,
  checks: [...Object.keys(checks), ...Object.keys(cycleVerses), ...Object.keys(overlaps), ...Object.keys(deliverers)],
});

console.log("order:", rows.map((r) => `${r.order ?? "-"} ${r.name}${r.oppressor ? ` [${r.oppressor.years} opp]` : ""}${r.rule ? ` [${r.rule.years} ${r.rule.kind}]` : ""}${r.verses ? ` (${r.verses} vv)` : ""}`).join(" | "));
console.log(`years: oppression ${oppressionYears} + rest/rule ${ruleYears} = ${judgesTotal} in Judges; + Eli ${eli} = ${withEli} (Acts 13:20 KJV ${acts450}); end to end with wilderness, Saul, David ${endToEnd} vs 1 Kings 6:1 ${fromExodus} (over by ${overBy}); before Jephthah ${beforeJephthah} vs Judges 11:26 ${jeph.years}`);
console.log(`"judged Israel" KJV ${judgedIsraelKjv.total} in ${judgedIsraelKjv.refs.length} verses, WEB ${judgedIsraelWeb.total}; said of ${judgedPeople.length}: ${judgedPeople.join(", ")}; never: ${neverJudged.join(", ")}`);
console.log(`cycle: did evil KJV ${cycle.didEvilKjv.total} WEB ${cycle.didEvilWeb.total} (whole Bible KJV ${cycle.didEvilAllKjv.total}); cried ${cycle.criedKjv.total}/${cycle.criedWeb.total}; rest ${cycle.restKjv.total}/${cycle.restWeb.total}; Spirit ${cycle.spiritKjv.total}/${cycle.spiritWeb.total}; no king ${cycle.noKingKjv.total}/${cycle.noKingWeb.total}`);
console.log(`words: judge KJV ${words.judgeKjv.total} WEB ${words.judgeWeb.total}; judged ${words.judgedKjv.total}/${words.judgedWeb.total} (Judges ${words.judgedKjv.byBook["Judges"]}); judges ${words.judgesKjv.total}/${words.judgesWeb.total}; all forms ${words.allFormsKjv.total}/${words.allFormsWeb.total}`);
console.log(`minor judges ${minorVerses} verses; longest ${longestStory.name} ${longestStory.verses}; tribes ${tribes.join(", ")}; names in Judges ${mostNamed.map(([k, v]) => `${k} ${v.kjv}/${v.web}`).join(", ")}`);
