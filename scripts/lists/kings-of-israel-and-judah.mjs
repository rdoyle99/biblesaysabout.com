/* The kings of Israel and Judah in order: the united kingdom (Saul, David, Solomon), the 19 kings of the northern
   kingdom of Israel and the 20 rulers of Judah (19 kings and Queen Athaliah). Each row carries the reign length the
   Bible gives, the verdict the text gives and how the reign ended, every one checked against the KJV verse it cites
   (and every reign length against the WEB too). The build stops on any mismatch.
   Writes lib/data/lists/kings-of-israel-and-judah.json. Run: node scripts/lists/kings-of-israel-and-judah.mjs */
import { must, mustWeb, countForms, countPhrase, verseRows, fail, writeList } from "../lib/list-helpers.mjs";

// length: [number, unit]; units: years | months | days
// verdict: right | not | none. The quote is the KJV needle and is printed on the page.
// end kinds: natural (slept with his fathers / died), killed (put to death by his own people or a rival),
// battle (died in war with a foreign power), suicide, captive (taken away by a foreign king), illness (a fall or disease).
const row = (name, aka, length, lenRef, lenNeedle, webNeedle, verdict, vRef, vQuote, end, endText, endRef, ...endNeedles) => ({
  name, aka, length, lenRef, lenNeedle, webNeedle, verdict, vRef, vQuote, end, endText, endRef, endNeedles,
});

const UNITED = [
  row("Saul", null, [40, "years"], "Acts 13:21", "by the space of forty years", "for forty years",
    "not", "1 Samuel 15:23", "thou hast rejected the word of the LORD",
    "suicide", "Fell on his own sword after defeat by the Philistines", "1 Samuel 31:4", "Saul took a sword, and fell upon it"),
  row("David", null, [40, "years"], "1 Kings 2:11", "forty years: seven years reigned he in Hebron, and thirty and three years reigned he in Jerusalem", "forty years",
    "right", "1 Kings 15:5", "David did that which was right in the eyes of the LORD",
    "natural", "Slept with his fathers", "1 Kings 2:10", "David slept with his fathers"),
  row("Solomon", null, [40, "years"], "1 Kings 11:42", "the time that Solomon reigned in Jerusalem over all Israel was forty years", "forty years",
    "not", "1 Kings 11:6", "Solomon did evil in the sight of the LORD",
    "natural", "Slept with his fathers", "1 Kings 11:43", "Solomon slept with his fathers"),
];

const ISRAEL = [
  row("Jeroboam", null, [22, "years"], "1 Kings 14:20", "the days which Jeroboam reigned were two and twenty years", "twenty two years",
    "not", "1 Kings 14:9", "hast done evil above all that were before thee",
    "natural", "Slept with his fathers", "1 Kings 14:20", "he slept with his fathers"),
  row("Nadab", null, [2, "years"], "1 Kings 15:25", "reigned over Israel two years", "two years",
    "not", "1 Kings 15:26", "he did evil in the sight of the LORD",
    "killed", "Killed by Baasha at Gibbethon", "1 Kings 15:27", "Baasha smote him at Gibbethon"),
  row("Baasha", null, [24, "years"], "1 Kings 15:33", "twenty and four years", "twenty-four years",
    "not", "1 Kings 15:34", "he did evil in the sight of the LORD",
    "natural", "Slept with his fathers", "1 Kings 16:6", "Baasha slept with his fathers"),
  row("Elah", null, [2, "years"], "1 Kings 16:8", "two years", "two years",
    "not", "1 Kings 16:13", "the sins of Elah his son",
    "killed", "Killed by Zimri, his chariot captain, while drunk", "1 Kings 16:10", "Zimri went in and smote him, and killed him"),
  row("Zimri", null, [7, "days"], "1 Kings 16:15", "did Zimri reign seven days in Tirzah", "seven days",
    "not", "1 Kings 16:19", "doing evil in the sight of the LORD",
    "suicide", "Burned the king's house over himself", "1 Kings 16:18", "burnt the king's house over him with fire, and died"),
  row("Omri", null, [12, "years"], "1 Kings 16:23", "began Omri to reign over Israel, twelve years", "twelve years",
    "not", "1 Kings 16:25", "Omri wrought evil in the eyes of the LORD, and did worse than all that were before him",
    "natural", "Slept with his fathers", "1 Kings 16:28", "Omri slept with his fathers"),
  row("Ahab", null, [22, "years"], "1 Kings 16:29", "reigned over Israel in Samaria twenty and two years", "twenty-two years",
    "not", "1 Kings 16:30", "did evil in the sight of the LORD above all that were before him",
    "battle", "Hit by an arrow in battle with Syria", "1 Kings 22:34", "a certain man drew a bow at a venture, and smote the king of Israel"),
  row("Ahaziah", null, [2, "years"], "1 Kings 22:51", "reigned two years over Israel", "two years",
    "not", "1 Kings 22:52", "he did evil in the sight of the LORD",
    "illness", "Fell through a lattice and died of it, as Elijah foretold", "2 Kings 1:2-17", "Ahaziah fell down through a lattice", "So he died according to the word of the LORD which Elijah had spoken"),
  row("Jehoram", { name: "Joram", ref: "2 Kings 9:14", needle: "conspired against Joram" }, [12, "years"], "2 Kings 3:1", "reigned twelve years", "twelve years",
    "not", "2 Kings 3:2", "he wrought evil in the sight of the LORD; but not like his father",
    "killed", "Shot by Jehu", "2 Kings 9:24", "Jehu drew a bow with his full strength, and smote Jehoram"),
  row("Jehu", null, [28, "years"], "2 Kings 10:36", "twenty and eight years", "twenty-eight years",
    "not", "2 Kings 10:31", "he departed not from the sins of Jeroboam",
    "natural", "Slept with his fathers", "2 Kings 10:35", "Jehu slept with his fathers"),
  row("Jehoahaz", null, [17, "years"], "2 Kings 13:1", "reigned seventeen years", "seventeen years",
    "not", "2 Kings 13:2", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 13:9", "Jehoahaz slept with his fathers"),
  row("Jehoash", { name: "Joash", ref: "2 Kings 13:13", needle: "Joash slept with his fathers" }, [16, "years"], "2 Kings 13:10", "reigned sixteen years", "sixteen years",
    "not", "2 Kings 13:11", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 14:16", "Jehoash slept with his fathers"),
  row("Jeroboam II", null, [41, "years"], "2 Kings 14:23", "reigned forty and one years", "forty-one years",
    "not", "2 Kings 14:24", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 14:29", "Jeroboam slept with his fathers"),
  row("Zachariah", { name: "Zechariah (WEB)", ref: "2 Kings 15:8", web: true, needle: "Zechariah the son of Jeroboam" }, [6, "months"], "2 Kings 15:8", "reign over Israel in Samaria six months", "six months",
    "not", "2 Kings 15:9", "he did that which was evil in the sight of the LORD",
    "killed", "Killed by Shallum in front of the people", "2 Kings 15:10", "Shallum the son of Jabesh conspired against him, and smote him before the people, and slew him"),
  row("Shallum", null, [1, "months"], "2 Kings 15:13", "he reigned a full month in Samaria", "a month",
    "none", null, null,
    "killed", "Killed by Menahem", "2 Kings 15:14", "smote Shallum the son of Jabesh in Samaria, and slew him"),
  row("Menahem", null, [10, "years"], "2 Kings 15:17", "reigned ten years in Samaria", "ten years",
    "not", "2 Kings 15:18", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 15:22", "Menahem slept with his fathers"),
  row("Pekahiah", null, [2, "years"], "2 Kings 15:23", "reigned two years", "two years",
    "not", "2 Kings 15:24", "he did that which was evil in the sight of the LORD",
    "killed", "Killed by Pekah, one of his captains", "2 Kings 15:25", "Pekah the son of Remaliah, a captain of his, conspired against him"),
  row("Pekah", null, [20, "years"], "2 Kings 15:27", "reigned twenty years", "twenty years",
    "not", "2 Kings 15:28", "he did that which was evil in the sight of the LORD",
    "killed", "Killed by Hoshea", "2 Kings 15:30", "Hoshea the son of Elah made a conspiracy against Pekah"),
  row("Hoshea", null, [9, "years"], "2 Kings 17:1", "over Israel nine years", "nine years",
    "not", "2 Kings 17:2", "he did that which was evil in the sight of the LORD, but not as the kings of Israel that were before him",
    "captive", "Imprisoned by the king of Assyria", "2 Kings 17:4", "the king of Assyria shut him up, and bound him in prison"),
];

const JUDAH = [
  row("Rehoboam", null, [17, "years"], "1 Kings 14:21", "he reigned seventeen years in Jerusalem", "seventeen years",
    "not", "2 Chronicles 12:14", "he did evil, because he prepared not his heart to seek the LORD",
    "natural", "Slept with his fathers", "1 Kings 14:31", "Rehoboam slept with his fathers"),
  row("Abijam", { name: "Abijah", ref: "2 Chronicles 13:1", needle: "began Abijah to reign over Judah" }, [3, "years"], "1 Kings 15:2", "Three years reigned he in Jerusalem", "three years",
    "not", "1 Kings 15:3", "he walked in all the sins of his father",
    "natural", "Slept with his fathers", "1 Kings 15:8", "Abijam slept with his fathers"),
  row("Asa", null, [41, "years"], "1 Kings 15:10", "forty and one years reigned he in Jerusalem", "forty-one years",
    "right", "1 Kings 15:11", "Asa did that which was right in the eyes of the LORD",
    "natural", "Slept with his fathers", "1 Kings 15:24", "Asa slept with his fathers"),
  row("Jehoshaphat", null, [25, "years"], "1 Kings 22:42", "he reigned twenty and five years in Jerusalem", "twenty-five years",
    "right", "1 Kings 22:43", "doing that which was right in the eyes of the LORD",
    "natural", "Slept with his fathers", "1 Kings 22:50", "Jehoshaphat slept with his fathers"),
  row("Jehoram", { name: "Joram", ref: "2 Kings 8:24", needle: "Joram slept with his fathers" }, [8, "years"], "2 Kings 8:17", "he reigned eight years in Jerusalem", "eight years",
    "not", "2 Kings 8:18", "he did evil in the sight of the LORD",
    "illness", "Died of a disease of the bowels", "2 Chronicles 21:19", "his bowels fell out by reason of his sickness: so he died of sore diseases"),
  row("Ahaziah", null, [1, "years"], "2 Kings 8:26", "he reigned one year in Jerusalem", "one year",
    "not", "2 Kings 8:27", "did evil in the sight of the LORD",
    "killed", "Struck down on Jehu's order, died at Megiddo", "2 Kings 9:27", "Smite him also in the chariot", "he fled to Megiddo, and died there"),
  row("Athaliah", null, [6, "years"], "2 Kings 11:3", "six years. And Athaliah did reign over the land", "six years while Athaliah reigned",
    "none", null, null,
    "killed", "Slain by the captains on Jehoiada's order", "2 Kings 11:16", "there was she slain"),
  row("Jehoash", { name: "Joash", ref: "2 Kings 12:20", needle: "slew Joash in the house of Millo" }, [40, "years"], "2 Kings 12:1", "forty years reigned he in Jerusalem", "forty years",
    "right", "2 Kings 12:2", "Jehoash did that which was right in the sight of the LORD all his days wherein Jehoiada the priest instructed him",
    "killed", "Killed by his servants", "2 Kings 12:20", "his servants arose, and made a conspiracy, and slew Joash"),
  row("Amaziah", null, [29, "years"], "2 Kings 14:2", "reigned twenty and nine years in Jerusalem", "twenty-nine years",
    "right", "2 Kings 14:3", "he did that which was right in the sight of the LORD, yet not like David his father",
    "killed", "Killed by conspirators at Lachish", "2 Kings 14:19", "they sent after him to Lachish, and slew him there"),
  row("Azariah", { name: "Uzziah", ref: "2 Kings 15:13", needle: "Uzziah king of Judah" }, [52, "years"], "2 Kings 15:2", "he reigned two and fifty years in Jerusalem", "fifty-two years",
    "right", "2 Kings 15:3", "he did that which was right in the sight of the LORD",
    "natural", "A leper until he died; slept with his fathers", "2 Kings 15:7", "Azariah slept with his fathers"),
  row("Jotham", null, [16, "years"], "2 Kings 15:33", "he reigned sixteen years in Jerusalem", "sixteen years",
    "right", "2 Kings 15:34", "he did that which was right in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 15:38", "Jotham slept with his fathers"),
  row("Ahaz", null, [16, "years"], "2 Kings 16:2", "reigned sixteen years in Jerusalem", "sixteen years",
    "not", "2 Kings 16:2", "did not that which was right in the sight of the LORD his God",
    "natural", "Slept with his fathers", "2 Kings 16:20", "Ahaz slept with his fathers"),
  row("Hezekiah", null, [29, "years"], "2 Kings 18:2", "he reigned twenty and nine years in Jerusalem", "twenty-nine years",
    "right", "2 Kings 18:3", "he did that which was right in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 20:21", "Hezekiah slept with his fathers"),
  row("Manasseh", null, [55, "years"], "2 Kings 21:1", "reigned fifty and five years in Jerusalem", "fifty-five years",
    "not", "2 Kings 21:2", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 21:18", "Manasseh slept with his fathers"),
  row("Amon", null, [2, "years"], "2 Kings 21:19", "he reigned two years in Jerusalem", "two years",
    "not", "2 Kings 21:20", "he did that which was evil in the sight of the LORD",
    "killed", "Killed by his servants in his own house", "2 Kings 21:23", "the servants of Amon conspired against him, and slew the king in his own house"),
  row("Josiah", null, [31, "years"], "2 Kings 22:1", "he reigned thirty and one years in Jerusalem", "thirty-one years",
    "right", "2 Kings 22:2", "he did that which was right in the sight of the LORD",
    "battle", "Slain by Pharaoh Necho at Megiddo", "2 Kings 23:29", "he slew him at Megiddo"),
  row("Jehoahaz", { name: "Shallum", ref: "Jeremiah 22:11", needle: "Shallum the son of Josiah king of Judah, which reigned instead of Josiah his father" }, [3, "months"], "2 Kings 23:31", "he reigned three months in Jerusalem", "three months",
    "not", "2 Kings 23:32", "he did that which was evil in the sight of the LORD",
    "captive", "Taken to Egypt by Pharaoh Necho, died there", "2 Kings 23:34", "took Jehoahaz away: and he came to Egypt, and died there"),
  row("Jehoiakim", { name: "Eliakim", ref: "2 Kings 23:34", needles: ["made Eliakim the son of Josiah king", "turned his name to Jehoiakim"] }, [11, "years"], "2 Kings 23:36", "he reigned eleven years in Jerusalem", "eleven years",
    "not", "2 Kings 23:37", "he did that which was evil in the sight of the LORD",
    "natural", "Slept with his fathers", "2 Kings 24:6", "Jehoiakim slept with his fathers"),
  row("Jehoiachin", { name: "Jeconiah, Coniah", ref: "1 Chronicles 3:16; Jeremiah 22:24", multi: [["1 Chronicles 3:16", "Jeconiah his son"], ["Jeremiah 22:24", "Coniah the son of Jehoiakim king of Judah"]] }, [3, "months"], "2 Kings 24:8", "he reigned in Jerusalem three months", "three months",
    "not", "2 Kings 24:9", "he did that which was evil in the sight of the LORD",
    "captive", "Carried away to Babylon", "2 Kings 24:15", "he carried away Jehoiachin to Babylon"),
  row("Zedekiah", { name: "Mattaniah", ref: "2 Kings 24:17", needle: "made Mattaniah his father's brother king in his stead, and changed his name to Zedekiah" }, [11, "years"], "2 Kings 24:18", "he reigned eleven years in Jerusalem", "eleven years",
    "not", "2 Kings 24:19", "he did that which was evil in the sight of the LORD",
    "captive", "Blinded and carried to Babylon", "2 Kings 25:7", "put out the eyes of Zedekiah", "carried him to Babylon"),
];

function check(list, label) {
  return list.map((r, i) => {
    must(r.lenRef, r.lenNeedle);
    mustWeb(r.lenRef, r.webNeedle);
    if (r.verdict !== "none") must(r.vRef, r.vQuote);
    must(r.endRef, ...r.endNeedles);
    if (r.aka) {
      if (r.aka.multi) r.aka.multi.forEach(([ref, n]) => must(ref, n));
      else if (r.aka.needles) must(r.aka.ref, ...r.aka.needles);
      else if (r.aka.web) mustWeb(r.aka.ref, r.aka.needle);
      else must(r.aka.ref, r.aka.needle);
    }
    const [n, unit] = r.length;
    if (!["years", "months", "days"].includes(unit)) fail(`${label} ${r.name}: unit ${unit}`);
    return {
      order: i + 1,
      name: r.name,
      aka: r.aka ? { name: r.aka.name, ref: r.aka.ref } : null,
      length: n,
      unit,
      lengthText: `${n} ${n === 1 ? unit.replace(/s$/, "") : unit}`,
      lenRef: r.lenRef,
      lenQuote: r.lenNeedle,
      verdict: r.verdict,
      vRef: r.vRef,
      vQuote: r.vQuote,
      end: r.end,
      endText: r.endText,
      endRef: r.endRef,
    };
  });
}

const united = check(UNITED, "united");
const israel = check(ISRAEL, "Israel");
const judah = check(JUDAH, "Judah");
if (united.length !== 3) fail("united kingdom should have 3 kings");
if (israel.length !== 19) fail(`Israel should have 19 kings, has ${israel.length}`);
if (judah.length !== 20) fail(`Judah should have 20 rulers, has ${judah.length}`);

// the "right in the sight/eyes of the LORD" formula in the history books: every hit in 1-2 Kings and 2 Chronicles
// must belong to David or a king of Judah, never to a king of Israel
const rightFormula = countPhrase("kjv", /right in the (sight|eyes) of the LORD/g, (r) => ["1 Kings", "2 Kings", "2 Chronicles"].includes(r.book));
const EXPECT_RIGHT = {
  "1 Kings 15:5": "David", "1 Kings 15:11": "Asa", "1 Kings 22:43": "Jehoshaphat", "2 Kings 12:2": "Jehoash", "2 Kings 14:3": "Amaziah",
  "2 Kings 15:3": "Azariah", "2 Kings 15:34": "Jotham", "2 Kings 16:2": "Ahaz (did not)", "2 Kings 18:3": "Hezekiah", "2 Kings 22:2": "Josiah",
  "2 Chronicles 14:2": "Asa", "2 Chronicles 20:32": "Jehoshaphat", "2 Chronicles 24:2": "Joash", "2 Chronicles 25:2": "Amaziah",
  "2 Chronicles 26:4": "Uzziah", "2 Chronicles 27:2": "Jotham", "2 Chronicles 28:1": "Ahaz (did not)", "2 Chronicles 29:2": "Hezekiah", "2 Chronicles 34:2": "Josiah",
};
const gotRight = rightFormula.refs.join("|");
const wantRight = Object.keys(EXPECT_RIGHT).join("|");
if (gotRight !== wantRight) fail(`the "right in the sight of the LORD" verses changed: ${gotRight}`);
must("2 Chronicles 28:1", "he did not that which was right in the sight of the LORD");

// in Israel, every king who was killed was killed by the man who reigned next: [victim, killer, ref, needle]
const USURPERS = [
  ["Nadab", "Baasha", "1 Kings 15:28", "did Baasha slay him, and reigned in his stead"],
  ["Elah", "Zimri", "1 Kings 16:10", "Zimri went in and smote him, and killed him", "reigned in his stead"],
  ["Jehoram", "Jehu", "2 Kings 9:24", "Jehu drew a bow with his full strength, and smote Jehoram"],
  ["Zachariah", "Shallum", "2 Kings 15:10", "slew him, and reigned in his stead"],
  ["Shallum", "Menahem", "2 Kings 15:14", "slew him, and reigned in his stead"],
  ["Pekahiah", "Pekah", "2 Kings 15:25", "he killed him, and reigned in his room"],
  ["Pekah", "Hoshea", "2 Kings 15:30", "smote him, and slew him, and reigned in his stead"],
];
for (const [victim, killer, ref, ...n] of USURPERS) {
  must(ref, ...n);
  const i = israel.findIndex((r) => r.name === victim);
  if (i < 0 || israel[i].end !== "killed") fail(`${victim} should be marked killed`);
  if (israel[i + 1]?.name !== killer) fail(`${killer} should follow ${victim}`);
}
must("2 Kings 9:6", "I have anointed thee king over the people of the LORD, even over Israel");
if (israel.filter((r) => r.end === "killed").length !== USURPERS.length) fail("an Israel killing lacks a usurper row");

const tally = (list, f) => list.filter(f).length;
const sumYears = (list) => list.filter((r) => r.unit === "years").reduce((s, r) => s + r.length, 0);
const short = (list) => list.filter((r) => r.unit !== "years").map((r) => `${r.name} ${r.lengthText}`);
const inDays = (r) => r.length * { years: 365, months: 30, days: 1 }[r.unit];
const all = [...united, ...israel, ...judah];
const longest = [...all].sort((a, b) => inDays(b) - inDays(a))[0];
const shortest = [...all].sort((a, b) => inDays(a) - inDays(b))[0];
if (longest.name !== "Manasseh" || longest.length !== 55) fail(`longest reign is ${longest.name}`);
if (shortest.name !== "Zimri" || shortest.length !== 7) fail(`shortest reign is ${shortest.name}`);

const stats = {
  rulers: all.length,
  kingsOnly: all.length - 1,
  judahKings: judah.length - 1,
  judahRight: tally(judah, (r) => r.verdict === "right"),
  judahNot: tally(judah, (r) => r.verdict === "not"),
  israelRight: tally(israel, (r) => r.verdict === "right"),
  israelNot: tally(israel, (r) => r.verdict === "not"),
  israelNone: israel.filter((r) => r.verdict === "none").map((r) => r.name),
  judahRightNames: judah.filter((r) => r.verdict === "right").map((r) => r.name),
  israelKilled: tally(israel, (r) => r.end === "killed"),
  israelKilledNames: israel.filter((r) => r.end === "killed").map((r) => r.name),
  judahKilled: tally(judah, (r) => r.end === "killed"),
  judahKilledNames: judah.filter((r) => r.end === "killed").map((r) => r.name),
  israelNatural: tally(israel, (r) => r.end === "natural"),
  judahNatural: tally(judah, (r) => r.end === "natural"),
  israelYears: sumYears(israel),
  israelShort: short(israel),
  judahYears: sumYears(judah),
  judahShort: short(judah),
  longest: { name: longest.name, text: longest.lengthText, ref: longest.lenRef },
  shortest: { name: shortest.name, text: shortest.lengthText, ref: shortest.lenRef },
  israelLongest: [...israel].sort((a, b) => inDays(b) - inDays(a))[0].name,
};
if (stats.rulers !== 42) fail(`expected 42 rulers, got ${stats.rulers}`);
if (stats.israelRight !== 0) fail("a king of Israel is marked right");

// verses the page quotes beyond the table
const checks = {
  saulFirst: must("1 Samuel 10:24", "See ye him whom the LORD hath chosen", "God save the king"),
  saulGilgal: must("1 Samuel 11:15", "they made Saul king before the LORD in Gilgal"),
  saul13: must("1 Samuel 13:1", "Saul reigned one year; and when he had reigned two years over Israel"),
  saul13Web: mustWeb("1 Samuel 13:1", "Saul was thirty years old when he became king, and he reigned over Israel forty-two years"),
  saulDied: must("1 Chronicles 10:13", "So Saul died for his transgression"),
  ishbosheth: must("2 Samuel 2:10", "Ish-bosheth Saul's son was forty years old when he began to reign over Israel, and reigned two years"),
  davidHebron: must("2 Samuel 5:5", "In Hebron he reigned over Judah seven years and six months"),
  split: must("1 Kings 12:19", "So Israel rebelled against the house of David unto this day"),
  jeroboamMadeKing: must("1 Kings 12:20", "made him king over all Israel", "the tribe of Judah only"),
  tenTribes: must("1 Kings 11:31", "will give ten tribes to thee"),
  tibni: must("1 Kings 16:21", "half of the people followed Tibni the son of Ginath"),
  tibniDied: must("1 Kings 16:22", "so Tibni died, and Omri reigned"),
  omriSamaria: must("1 Kings 16:23", "six years reigned he in Tirzah"),
  shechem: must("1 Kings 12:25", "Then Jeroboam built Shechem in mount Ephraim, and dwelt therein"),
  baashaTirzah: must("1 Kings 15:33", "began Baasha the son of Ahijah to reign over all Israel in Tirzah"),
  omriBuilt: must("1 Kings 16:24", "he bought the hill Samaria", "called the name of the city which he built"),
  jehuPraise: must("2 Kings 10:30", "thou hast done well in executing that which is right in mine eyes"),
  jezebel: must("1 Kings 16:31", "he took to wife Jezebel the daughter of Ethbaal king of the Zidonians"),
  athaliahDestroyed: must("2 Kings 11:1", "Athaliah the mother of Ahaziah saw that her son was dead, she arose and destroyed all the seed royal"),
  joashHidden: must("2 Kings 11:2", "took Joash the son of Ahaziah and stole him"),
  joashSeven: must("2 Kings 11:21", "Seven years old was Jehoash when he began to reign"),
  azariahLeper: must("2 Kings 15:5", "a leper unto the day of his death", "Jotham the king's son was over the house, judging the people of the land"),
  jehoramWhile: must("2 Kings 8:16", "Jehoshaphat being then king of Judah, Jehoram the son of Jehoshaphat king of Judah began to reign"),
  synchronism: must("1 Kings 15:33", "In the third year of Asa king of Judah began Baasha"),
  hezekiah: must("2 Kings 18:5", "after him was none like him among all the kings of Judah, nor any that were before him"),
  josiah: must("2 Kings 23:25", "like unto him was there no king before him, that turned to the LORD with all his heart", "neither after him arose there any like him"),
  hezekiahWeb: mustWeb("2 Kings 18:5", "after him was no one like him among all the kings of Judah"),
  josiahWeb: mustWeb("2 Kings 23:25", "There was no king like him before him"),
  manassehRepent: must("2 Chronicles 33:12", "humbled himself greatly before the God of his fathers"),
  manassehKnew: must("2 Chronicles 33:13", "Then Manasseh knew that the LORD he was God"),
  samaria: must("2 Kings 17:6", "In the ninth year of Hoshea the king of Assyria took Samaria, and carried Israel away into Assyria"),
  samariaWeb: mustWeb("2 Kings 17:6", "In the ninth year of Hoshea the king of Assyria took Samaria"),
  israelRemoved: must("2 Kings 17:18", "there was none left but the tribe of Judah only"),
  siege: must("2 Kings 25:2", "the city was besieged unto the eleventh year of king Zedekiah"),
  burned: must("2 Kings 25:9", "he burnt the house of the LORD, and the king's house, and all the houses of Jerusalem"),
  walls: must("2 Kings 25:10", "brake down the walls of Jerusalem round about"),
  nineteenth: must("2 Kings 25:8", "the nineteenth year of king Nebuchadnezzar king of Babylon"),
  judahAway: must("2 Kings 25:21", "So Judah was carried away out of their land"),
  jehoiachinFreed: must("2 Kings 25:27", "the seven and thirtieth year of the captivity of Jehoiachin king of Judah", "did lift up the head of Jehoiachin king of Judah out of prison"),
  athaliahOmri: must("2 Kings 8:26", "his mother's name was Athaliah, the daughter of Omri king of Israel"),
  saulBenjamin: must("Acts 13:21", "a man of the tribe of Benjamin"),
  philistines: must("1 Samuel 31:1", "the Philistines fought against Israel"),
  ahijah: must("1 Kings 11:29", "the prophet Ahijah the Shilonite found him"),
  yoke: must("1 Kings 12:14", "My father made your yoke heavy, and I will add to your yoke"),
  samariaBuilt: must("1 Kings 16:24", "he bought the hill Samaria", "called the name of the city which he built"),
  syria: must("1 Kings 22:31", "the king of Syria commanded", "save only with the king of Israel"),
  elahDrunk: must("1 Kings 16:9", "his servant Zimri, captain of half his chariots, conspired against him", "drinking himself drunk"),
  jehuAhab: must("2 Kings 10:30", "hast done unto the house of Ahab according to all that was in mine heart"),
  davidMeasure: must("1 Kings 15:11", "as did David his father"),
  jehoshaphatHigh: must("1 Kings 22:43", "nevertheless the high places were not taken away"),
  athaliahOrder: must("2 Kings 11:15", "Jehoiada the priest commanded the captains of the hundreds"),
  jehoshebaSister: must("2 Kings 11:2", "Jehosheba, the daughter of king Joram, sister of Ahaziah"),
  hezekiahTrust: must("2 Kings 18:5", "He trusted in the LORD God of Israel"),
  josiahLaw: must("2 Kings 23:25", "with all his soul, and with all his might, according to all the law of Moses"),
  manassehBabylon: must("2 Chronicles 33:11", "bound him with fetters, and carried him to Babylon"),
  jehoiachinBread: must("2 Kings 25:29", "he did eat bread continually before him all the days of his life"),
  manassehAffliction: must("2 Chronicles 33:12", "when he was in affliction"),
  chaldees: must("2 Kings 25:10", "all the army of the Chaldees"),
  kingsEnds: (() => {
    const last = verseRows("kjv", "2 Kings").at(-1).ref;
    if (last !== "2 Kings 25:30") fail(`2 Kings ends at ${last}`);
    return must("2 Kings 25:30", "all the days of his life");
  })(),
  ahabDied: must("1 Kings 22:37", "So the king died, and was brought to Samaria"),
  ahaziahDied: must("2 Kings 1:17", "So he died according to the word of the LORD which Elijah had spoken"),
  jehoramBuried: must("2 Chronicles 21:20", "departed without being desired"),
  josiahJehoahaz: must("2 Kings 23:30", "took Jehoahaz the son of Josiah, and anointed him, and made him king in his father's stead"),
  athaliahSword: must("2 Kings 11:20", "they slew Athaliah with the sword beside the king's house"),
  asaHigh: must("1 Kings 15:14", "the high places were not removed"),
  tibniOmri: must("1 Kings 16:21", "half followed Omri"),
  zimriSevenWeb: mustWeb("1 Kings 16:15", "Zimri reigned seven days in Tirzah"),
  manassehWeb: mustWeb("2 Kings 21:1", "he reigned fifty-five years in Jerusalem"),
  sauls40Web: mustWeb("Acts 13:21", "for forty years"),
};

const words = {
  kingKjv: countForms("kjv", ["king"]),
  kingWeb: countForms("web", ["king"]),
  kingAllKjv: countForms("kjv", ["king", "kings", "king's", "kings'"]),
  kingAllWeb: countForms("web", ["king", "kings", "king's", "kings'"]),
  queenKjv: countForms("kjv", ["queen"]),
  sleptKjv: countPhrase("kjv", /slept with his fathers/gi),
  rightFormula: { total: rightFormula.total, refs: rightFormula.refs },
};

writeList("kings-of-israel-and-judah", {
  generated: "2026-10-25",
  united,
  israel,
  judah,
  stats,
  usurpers: USURPERS.map(([victim, killer, ref]) => ({ victim, killer, ref })),
  words: {
    kingKjv: { total: words.kingKjv.total, verses: words.kingKjv.verses, books: words.kingKjv.books, top: words.kingKjv.top },
    kingWeb: { total: words.kingWeb.total, verses: words.kingWeb.verses, books: words.kingWeb.books, top: words.kingWeb.top },
    kingAllKjv: { total: words.kingAllKjv.total, top: words.kingAllKjv.top },
    kingAllWeb: { total: words.kingAllWeb.total, top: words.kingAllWeb.top },
    queenKjv: { total: words.queenKjv.total, top: words.queenKjv.top },
    sleptKjv: { total: words.sleptKjv.total },
    rightFormula: words.rightFormula,
  },
  checks: Object.keys(checks),
});

console.log(`rulers ${stats.rulers} (united ${united.length}, Israel ${israel.length}, Judah ${judah.length})`);
console.log(`Judah right ${stats.judahRight}: ${stats.judahRightNames.join(", ")} | not ${stats.judahNot} | Israel right ${stats.israelRight}, not ${stats.israelNot}, no verdict ${stats.israelNone}`);
console.log(`killed: Israel ${stats.israelKilled} (${stats.israelKilledNames.join(", ")}), Judah ${stats.judahKilled} (${stats.judahKilledNames.join(", ")})`);
console.log(`years: Israel ${stats.israelYears} + ${stats.israelShort.join(", ")} | Judah ${stats.judahYears} + ${stats.judahShort.join(", ")}`);
console.log(`longest ${stats.longest.name} ${stats.longest.text} | shortest ${stats.shortest.name} ${stats.shortest.text} | Israel longest ${stats.israelLongest}`);
console.log(`"king" KJV ${words.kingKjv.total} (top ${words.kingKjv.top.book} ${words.kingKjv.top.count}) WEB ${words.kingWeb.total} (top ${words.kingWeb.top.book} ${words.kingWeb.top.count}); all forms KJV ${words.kingAllKjv.total} WEB ${words.kingAllWeb.total}; queen KJV ${words.queenKjv.total}; "slept with his fathers" ${words.sleptKjv.total}`);
console.log(`checked ${Object.keys(checks).length} extra verses`);
