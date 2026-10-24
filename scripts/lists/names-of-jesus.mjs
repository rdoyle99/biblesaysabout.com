#!/usr/bin/env node
/**
 * Names and titles of Jesus: how often each phrase appears in the KJV and WEB New Testament, its first verse, the book
 * that uses it most, and a checked verse where it names Jesus. Old Testament prophecy rows are counted in the OT and
 * marked. Also the seven "I am" sayings in John and "Son of man" by Gospel.
 *
 *   node scripts/lists/names-of-jesus.mjs     # writes lib/data/lists/names-of-jesus.json
 *
 * Rules: a phrase is a regex over normalised verse text, counted once per occurrence (possessives included). Where the
 * KJV and WEB print a title with a capital and use the same words in lower case for someone else, the match is
 * case-sensitive (Son of man, Son of God, Word, Lamb, Master). Verses where the phrase names someone other than Jesus are
 * excluded by reference, and each exclusion is checked against that verse's text.
 */
import { kjv, web, must, mustWeb, ROWS, norm, fail, writeList } from "../lib/list-helpers.mjs";

const GOSPELS = ["Matthew", "Mark", "Luke", "John"];
const BIBLE = { kjv, web };

/** count a phrase in one translation; scope NT or OT, optional book list, excluded refs */
function count(id, re, { scope = "NT", books = null, exclude = [] } = {}) {
  const ex = new Set(exclude.map((e) => e.ref));
  for (const e of exclude) {
    const t = norm(BIBLE[id].get(e.ref) || "");
    if (!(t.match(new RegExp(re.source, re.flags)) || []).length) fail(`${e.ref} (${id}) is excluded from ${re} but does not contain it`);
    (id === "kjv" ? must : mustWeb)(e.ref, ...e.needles);
  }
  let total = 0;
  const byBook = new Map();
  const refs = [];
  for (const r of ROWS[id]) {
    if (r.testament !== scope || (books && !books.includes(r.book)) || ex.has(r.ref)) continue;
    const n = (norm(r.text).match(new RegExp(re.source, re.flags)) || []).length;
    if (!n) continue;
    total += n;
    refs.push(r.ref);
    byBook.set(r.book, (byBook.get(r.book) || 0) + n);
  }
  const sorted = [...byBook.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted[0] || [null, 0];
  const tied = sorted.filter(([, n]) => n === top[1]).map(([b]) => b);
  return { total, verses: refs.length, first: refs[0] || null, top: { book: top[0], count: top[1], tied }, byBook: Object.fromEntries(byBook), refs };
}
const notCounted = (res, ref, why) => {
  if (res.refs.includes(ref)) fail(`${ref} should not be counted (${why})`);
};

const X = (ref, needles, why) => ({ ref, needles, why });
const gospelsOnly = { books: GOSPELS };

/* name, KJV wording, regexes, exclusions, and a verse (with needles) where the text uses the title of Jesus */
const DEFS = [
  { name: "Jesus", kjvPhrase: "Jesus", re: /\bJesus\b/gi,
    exKjv: [X("Colossians 4:11", ["Jesus, which is called Justus"], "Jesus called Justus, Paul's fellow worker"), X("Acts 7:45", ["brought in with Jesus"], "Joshua (the WEB prints Joshua)"), X("Hebrews 4:8", ["if Jesus had given them rest"], "Joshua (the WEB prints Joshua)"), X("Acts 13:6", ["whose name was Bar-jesus"], "Bar-jesus, the sorcerer")],
    exWeb: [X("Colossians 4:11", ["Jesus who is called Justus"], "Jesus called Justus"), X("Acts 13:6", ["whose name was Bar Jesus"], "Bar Jesus, the sorcerer")],
    check: ["Matthew 1:21", "call his name JESUS"],
    note: "Jesus' (possessive) is counted. Left out: Colossians 4:11 (Jesus called Justus), the sorcerer Bar-jesus (Acts 13:6) and, in the KJV only, Acts 7:45 and Hebrews 4:8, where the WEB reads Joshua." },
  { name: "Christ", kjvPhrase: "Christ", re: /\bChrist\b/gi, check: ["Matthew 16:16", "Thou art the Christ"],
    note: "Includes every Jesus Christ and Christ Jesus below, and Christ's. It also counts the title in questions and in warnings about false claims, as in Matthew 24:5." },
  { name: "Jesus Christ", kjvPhrase: "Jesus Christ", re: /\bJesus Christ\b/gi, check: ["Matthew 1:1", "Jesus Christ, the son of David"], note: "Also counted under Jesus and under Christ." },
  { name: "Christ Jesus", kjvPhrase: "Christ Jesus", re: /\bChrist Jesus\b/gi, check: ["1 Timothy 1:15", "Christ Jesus came into the world to save sinners"], note: "Also counted under Jesus and under Christ." },
  { name: "Lord Jesus", kjvPhrase: "Lord Jesus", re: /\bLord Jesus\b/g, check: ["Acts 7:59", "Lord Jesus, receive my spirit"], note: "Includes Lord Jesus Christ." },
  { name: "Son of man", kjvPhrase: "the Son of man", re: /\bSon of man\b/g, webRe: /\bSon of Man\b/g, webPhrase: "the Son of Man", check: ["Matthew 8:20", "Jesus saith", "the Son of man hath not where to lay his head"],
    note: "Counted where the translation prints Son with a capital S, so Hebrews 2:6, quoting Psalm 8, is not counted. Ezekiel's son of man is the prophet and is counted separately below." },
  { name: "Son of God", kjvPhrase: "the Son of God", re: /\bSon of God\b/g, check: ["Mark 1:1", "Jesus Christ, the Son of God"],
    note: "Capital S only, so Luke 3:38, where Adam is \"the son of God\", is not counted. Includes the tempter's \"If thou be the Son of God\" (Matthew 4:3)." },
  { name: "Son of David", kjvPhrase: "thou Son of David", re: /\bson of David\b/gi,
    exKjv: [X("Matthew 1:20", ["Joseph, thou son of David"], "Joseph"), X("Luke 3:31", ["son of Nathan, which was the son of David"], "Nathan")],
    exWeb: [X("Matthew 1:20", ["Joseph, son of David"], "Joseph"), X("Luke 3:31", ["son of Nathan, the son of David"], "Nathan")],
    check: ["Matthew 9:27", "when Jesus departed", "Thou Son of David"], note: "Left out: Matthew 1:20 (said to Joseph) and Luke 3:31 (Nathan, in the family line)." },
  { name: "Lamb of God", kjvPhrase: "the Lamb of God", re: /\bLamb of God\b/g, check: ["John 1:29", "seeth Jesus", "Behold the Lamb of God"], note: "John the Baptist says it twice, in John 1:29 and 1:36." },
  { name: "the Lamb", kjvPhrase: "the Lamb", re: /\bLamb\b/g, books: ["Revelation"], check: ["Revelation 5:12", "Worthy is the Lamb that was slain"],
    note: "Capital-L Lamb in Revelation only. Revelation 13:11, where a beast has \"two horns like a lamb\", is lower case and not counted." },
  { name: "the Word", kjvPhrase: "the Word", re: /\bWord\b/g,
    exWeb: [X("2 Timothy 2:15", ["the Word of Truth"], "the message"), X("1 Peter 2:2", ["milk of the Word"], "the message"), X("1 Peter 3:1", ["don't obey the Word"], "the message"), X("Revelation 1:9", ["God's Word"], "the message"), X("Revelation 6:9", ["for the Word of God"], "the message")],
    check: ["John 1:14", "the Word was made flesh"],
    note: "Capital-W Word as a title: John 1:1 (three times), 1:14, 1 John 1:1 and Revelation 19:13. The KJV also has 1 John 5:7, which the WEB lacks. The WEB's capital Word for God's message (five verses) is not counted." },
  { name: "Emmanuel", kjvPhrase: "Emmanuel", re: /\bEmmanuel\b/g, webRe: /\bImmanuel\b/g, webPhrase: "Immanuel", check: ["Matthew 1:23", "Emmanuel", "God with us"], checkWeb: ["Matthew 1:23", "Immanuel"], note: "Matthew explains the name: \"God with us\"." },
  { name: "Messias (Messiah)", kjvPhrase: "Messias", re: /\bMessias\b/g, webRe: /\bMessiah\b/g, webPhrase: "Messiah", check: ["John 1:41", "We have found the Messias", "the Christ"], checkWeb: ["John 1:41", "We have found the Messiah"], note: "John 1:41 says the word means \"the Christ\"." },
  { name: "Rabbi", kjvPhrase: "Rabbi", re: /\bRabbi\b/g,
    exKjv: [X("Matthew 23:7", ["to be called of men, Rabbi, Rabbi"], "the scribes' greeting"), X("Matthew 23:8", ["be not ye called Rabbi"], "disciples told not to take it"), X("John 3:26", ["they came unto John", "Rabbi"], "said to John the Baptist")],
    exWeb: [X("Matthew 23:7", ["Rabbi, Rabbi"], "the scribes' greeting"), X("Matthew 23:8", ["don't you be called 'Rabbi"], "disciples told not to take it"), X("John 3:26", ["They came to John", "Rabbi"], "said to John the Baptist")],
    check: ["John 1:49", "Rabbi, thou art the Son of God"], note: "Only where someone speaks to Jesus. Left out: Matthew 23:7-8, where Jesus warns against the title, and John 3:26, said to John the Baptist." },
  { name: "Rabboni", kjvPhrase: "Rabboni", re: /\bRabboni\b/g, check: ["John 20:16", "Jesus saith unto her", "Rabboni"], note: "The WEB also has it at Mark 10:51, where the KJV reads Lord." },
  { name: "Master", kjvPhrase: "Master", re: /\bMaster\b/g, webRe: /\bTeacher\b/g, webPhrase: "Teacher", ...gospelsOnly,
    exKjv: [X("Luke 3:12", ["publicans to be baptized", "Master"], "said to John the Baptist")], exWeb: [X("Luke 3:12", ["Tax collectors also came to be baptized", "Teacher"], "said to John the Baptist")],
    check: ["John 13:13", "Ye call me Master and Lord"],
    note: "Capital-M Master in the four Gospels only, less Luke 3:12, said to John the Baptist. The WEB column counts Teacher, its usual word in these verses." },
  { name: "Jesus of Nazareth", kjvPhrase: "Jesus of Nazareth", re: /\bJesus of Nazareth\b/gi, check: ["Acts 2:22", "Jesus of Nazareth, a man approved of God"], note: "The WEB often reads \"Jesus the Nazarene\" instead." },
  { name: "the Nazarene", kjvPhrase: "a Nazarene", re: /\bNazarene\b/g, check: ["Matthew 2:23", "He shall be called a Nazarene"], note: "Singular only; Acts 24:5's \"sect of the Nazarenes\" is not counted." },
  { name: "King of the Jews", kjvPhrase: "the King of the Jews", re: /\bKing of the Jews\b/gi, check: ["John 19:19", "JESUS OF NAZARETH THE KING OF THE JEWS"], note: "First in Matthew 2:2, where the wise men ask where he is." },
  { name: "King of kings and Lord of lords", kjvPhrase: "King of kings, and Lord of lords", re: /\bKing of kings\b/gi, check: ["Revelation 17:14", "the Lamb shall overcome them", "Lord of lords, and King of kings"],
    note: "1 Timothy 6:15 gives the same pair to \"the blessed and only Potentate\"; Revelation 17:14 gives it to the Lamb." },
  { name: "Alpha and Omega", kjvPhrase: "Alpha and Omega", re: /\bAlpha and Omega\b/g, webRe: /\bthe Alpha and the Omega\b/g, webPhrase: "the Alpha and the Omega", check: ["Revelation 22:13", "I am Alpha and Omega"],
    note: "Revelation 22:16 names the speaker: \"I Jesus\". Revelation 1:8 gives it to the Lord, \"the Almighty\". The WEB lacks it at 1:11." },
  { name: "the bright and morning star", kjvPhrase: "the bright and morning star", re: /\bmorning star\b/gi, check: ["Revelation 22:16", "I Jesus", "the bright and morning star"],
    note: "Counts \"morning star\". Revelation 2:28 promises \"the morning star\" to the faithful. The WEB also has it at 2 Peter 1:19, where the KJV reads \"day star\"." },
  { name: "the Lion of the tribe of Juda", kjvPhrase: "the Lion of the tribe of Juda", re: /\bLion of the tribe of Juda\b/g, webRe: /\bLion who is of the tribe of Judah\b/g, webPhrase: "the Lion who is of the tribe of Judah", check: ["Revelation 5:5", "the Lion of the tribe of Juda", "the Root of David"], note: "In the next verse John sees \"a Lamb as it had been slain\" (Revelation 5:6)." },
  { name: "high priest", kjvPhrase: "a great high priest", re: /\bhigh priest\b/gi, check: ["Hebrews 4:14", "a great high priest", "Jesus the Son of God"],
    note: "Raw count: most uses are the high priest in Jerusalem, such as Caiaphas (Matthew 26:3). Hebrews, the book that uses it most, gives it to Jesus." },
  { name: "Saviour", kjvPhrase: "a Saviour, which is Christ the Lord", re: /\bSaviour\b/g, webRe: /\bSavior\b/g, webPhrase: "Savior", check: ["Luke 2:11", "a Saviour, which is Christ the Lord"],
    note: "Raw count: some verses give the title to God, as Luke 1:47 (\"God my Saviour\") and Titus 1:3 (\"God our Saviour\")." },
  /* Old Testament prophecy rows, counted in the Old Testament */
  { name: "Immanuel", prophecy: true, kjvPhrase: "Immanuel", re: /\bImmanuel\b/g, scope: "OT", check: ["Isaiah 7:14", "a virgin shall conceive", "call his name Immanuel"],
    note: "Isaiah 7:14 and 8:8. Matthew 1:22-23 quotes the words of Isaiah 7:14 as fulfilled at the birth of Jesus." },
  { name: "Messiah", prophecy: true, kjvPhrase: "Messiah the Prince", re: /\bMessiah\b/g, webRe: /\bAnointed One\b/g, webPhrase: "the Anointed One", scope: "OT", books: ["Daniel"], check: ["Daniel 9:25", "unto the Messiah the Prince"], checkWeb: ["Daniel 9:25", "the Anointed One, the prince"],
    note: "Daniel 9:25-26 are the only verses where the KJV prints Messiah. The KJV New Testament spells it Messias, twice." },
  { name: "Wonderful, Counsellor, Prince of Peace", prophecy: true, kjvPhrase: "Wonderful, Counsellor, The mighty God, The everlasting Father, The Prince of Peace", re: /\bPrince of Peace\b/gi, scope: "OT", check: ["Isaiah 9:6", "unto us a child is born", "Wonderful, Counsellor", "The Prince of Peace"], checkWeb: ["Isaiah 9:6", "Wonderful, Counselor, Mighty God, Everlasting Father, Prince of Peace"],
    note: "Counts \"Prince of Peace\". The New Testament does not use the phrase." },
];

/* checks for verses the notes cite */
must("Matthew 24:5", "I am Christ");
must("Matthew 4:3", "when the tempter came to him");
must("Matthew 2:1", "wise men");
must("Matthew 1:23", "Behold, a virgin shall be with child");
must("John 4:25", "Messias cometh");
mustWeb("John 4:25", "Messiah comes");
must("Luke 3:38", "which was the son of Adam, which was the son of God");
must("Matthew 4:3", "If thou be the Son of God");
must("Hebrews 2:6", "or the son of man");
must("John 1:36", "Behold the Lamb of God");
must("Revelation 13:11", "two horns like a lamb");
must("John 1:1", "In the beginning was the Word", "the Word was God");
must("1 John 1:1", "the Word of life");
must("1 John 5:7", "the Father, the Word, and the Holy Ghost");
mustWeb("1 John 5:7", "For there are three who testify");
if (/\bWord\b/.test(web.get("1 John 5:7"))) fail("WEB 1 John 5:7 has Word");
must("Revelation 19:13", "The Word of God");
must("Mark 10:51", "Lord, that I might receive my sight");
mustWeb("Mark 10:51", "Rabboni");
mustWeb("Mark 10:47", "Jesus the Nazarene");
must("Acts 24:5", "sect of the Nazarenes");
must("Matthew 2:2", "born King of the Jews");
must("1 Timothy 6:15", "the blessed and only Potentate, the King of kings, and Lord of lords");
must("Revelation 1:8", "I am Alpha and Omega", "saith the Lord", "the Almighty");
must("Revelation 1:11", "I am Alpha and Omega");
if (/Alpha/.test(web.get("Revelation 1:11"))) fail("WEB Revelation 1:11 has Alpha");
must("Revelation 2:28", "I will give him the morning star");
must("2 Peter 1:19", "the day star");
mustWeb("2 Peter 1:19", "the morning star");
must("Revelation 5:6", "a Lamb as it had been slain");
must("Matthew 26:3", "the high priest, who was called Caiaphas");
must("Luke 1:47", "God my Saviour");
must("Titus 1:3", "God our Saviour");
must("Isaiah 8:8", "O Immanuel");
must("Matthew 1:22", "that it might be fulfilled which was spoken of the Lord by the prophet");
must("Daniel 9:26", "shall Messiah be cut off");
must("Matthew 1:20", "Joseph, thou son of David");
must("Ephesians 6:9", "your Master also is in heaven");
must("Colossians 4:1", "ye also have a Master in heaven");

const rows = DEFS.map((d, i) => {
  const scope = { scope: d.scope || "NT", books: d.books || null };
  const k = count("kjv", d.re, { ...scope, exclude: d.exKjv || [] });
  const w = count("web", d.webRe || d.re, { ...scope, exclude: d.exWeb || [] });
  must(d.check[0], ...d.check.slice(1));
  if (!k.refs.includes(d.check[0])) fail(`${d.name}: checked verse ${d.check[0]} is not among the counted KJV verses`);
  if (d.checkWeb) mustWeb(d.checkWeb[0], ...d.checkWeb.slice(1));
  if (!k.total) fail(`${d.name}: zero KJV count`);
  const strip = ({ refs, byBook, ...rest }) => rest;
  return {
    n: i + 1, name: d.name, prophecy: !!d.prophecy, scope: d.scope || "NT", books: d.books || null,
    kjvPhrase: d.kjvPhrase, webPhrase: d.webPhrase || null, kjv: strip(k), web: strip(w), webRefs: w.refs.length <= 6 ? w.refs : null,
    kjvRefs: k.refs.length <= 6 ? k.refs : null, check: d.check[0], checkText: kjv.get(d.check[0]), note: d.note,
    excluded: [...(d.exKjv || []).map((e) => ({ id: "kjv", ref: e.ref, why: e.why })), ...(d.exWeb || []).map((e) => ({ id: "web", ref: e.ref, why: e.why }))],
  };
});
const R = (name) => rows.find((r) => r.name === name);

/* spot checks on the counting rules */
const sonGod = count("kjv", /\bSon of God\b/g);
notCounted(sonGod, "Luke 3:38", "Adam, lower case");
notCounted(count("kjv", /\bSon of man\b/g), "Hebrews 2:6", "lower case quotation");
notCounted(count("kjv", /\bLamb\b/g, { books: ["Revelation"] }), "Revelation 13:11", "lower case lamb");
if (R("the Word").kjv.total !== 7) fail(`expected 7 capital Word in the KJV NT, got ${R("the Word").kjv.total}`);
if (R("Wonderful, Counsellor, Prince of Peace").kjv.first !== "Isaiah 9:6") fail("Prince of Peace not at Isaiah 9:6");
const princeNT = count("kjv", /\bPrince of Peace\b/gi).total + count("web", /\bPrince of Peace\b/gi).total;
if (princeNT) fail("Prince of Peace found in the NT");
const messiahNT = count("kjv", /\bMessiah\b/g).total;
if (messiahNT) fail("KJV NT has Messiah");
const messiahAllKjv = count("kjv", /\bMessiah\b/g, { scope: "OT" }).total;
if (messiahAllKjv !== R("Messiah").kjv.total) fail("KJV prints Messiah outside Daniel");
const immanuelVerses = count("kjv", /\bImmanuel\b/g, { scope: "OT" }).refs;
if (immanuelVerses.join() !== "Isaiah 7:14,Isaiah 8:8") fail(`Immanuel verses ${immanuelVerses}`);
const hpHeb = count("kjv", /\bhigh priest\b/gi).byBook.Hebrews;
const rabbiRaw = { kjv: count("kjv", /\bRabbi\b/g).total, web: count("web", /\bRabbi\b/g).total };
const jesusRaw = { kjv: count("kjv", /\bJesus\b/gi).total, web: count("web", /\bJesus\b/gi).total };
mustWeb("Acts 7:45", "brought in with Joshua");
mustWeb("Hebrews 4:8", "if Joshua had given them rest");

/* the seven I am sayings in John */
const IAM = [
  { saying: "I am the bread of life", webSaying: "I am the bread of life", ref: "John 6:35", re: /\bI am (?:the|that) bread of life\b/g, webRe: /\bI am the bread of life\b/g, also: "John 6:48 repeats it as \"I am that bread of life\"." },
  { saying: "I am the light of the world", webSaying: "I am the light of the world", ref: "John 8:12", re: /\bI am the light of the world\b/g, also: "John 9:5 repeats it. In Matthew 5:14 Jesus tells his listeners \"Ye are the light of the world\"." },
  { saying: "I am the door", webSaying: "I am the door", ref: "John 10:9", re: /\bI am the door\b/g, webRe: /\bI am the (?:sheep's )?door\b/g, also: "John 10:7 has \"I am the door of the sheep\"." },
  { saying: "I am the good shepherd", webSaying: "I am the good shepherd", ref: "John 10:11", re: /\bI am the good shepherd\b/g, also: "John 10:14 repeats it." },
  { saying: "I am the resurrection, and the life", webSaying: "I am the resurrection and the life", ref: "John 11:25", re: /\bI am the resurrection\b/g, also: "Said to Martha before Lazarus is raised." },
  { saying: "I am the way, the truth, and the life", webSaying: "I am the way, the truth, and the life", ref: "John 14:6", re: /\bI am the way, the truth, and the life\b/g, also: "Said to Thomas." },
  { saying: "I am the true vine", webSaying: "I am the true vine", ref: "John 15:1", re: /\bI am the (?:true )?vine\b/g, also: "John 15:5 repeats it as \"I am the vine\"." },
];
must("John 6:48", "I am that bread of life");
must("Matthew 5:14", "Ye are the light of the world");
must("John 10:7", "I am the door of the sheep");
must("John 10:14", "I am the good shepherd");
must("John 11:24", "Martha saith unto him");
must("John 11:43", "Lazarus, come forth");
must("John 14:5", "Thomas saith unto him");
must("John 15:5", "I am the vine");
const iam = IAM.map((s, i) => {
  must(s.ref, s.saying);
  const webText = mustWeb(s.ref, s.webSaying);
  const k = count("kjv", s.re, { books: ["John"] });
  const w = count("web", s.webRe || s.re, { books: ["John"] });
  if (!k.refs.includes(s.ref) || !w.refs.includes(s.ref)) fail(`${s.saying} not counted at ${s.ref}`);
  const all = count("kjv", s.re);
  if (all.total !== k.total) fail(`${s.saying} appears outside John`);
  return { n: i + 1, saying: s.saying, webSaying: s.webSaying, ref: s.ref, kjvText: kjv.get(s.ref), webText, kjv: k.total, kjvRefs: k.refs, web: w.total, also: s.also };
});
mustWeb("John 6:35", "I am the bread of life");
mustWeb("John 11:25", "I am the resurrection and the life");
mustWeb("John 15:1", "I am the true vine");

/* Son of man by Gospel, and Ezekiel's son of man (the prophet) */
const sonOfMan = GOSPELS.map((g) => ({ book: g, kjv: count("kjv", /\bSon of man\b/g, { books: [g] }).total, web: count("web", /\bSon of Man\b/g, { books: [g] }).total }));
const gospelTotal = sonOfMan.reduce((s, g) => s + g.kjv, 0);
const topGospel = [...sonOfMan].sort((a, b) => b.kjv - a.kjv)[0];
if (sonOfMan.filter((g) => g.kjv === topGospel.kjv).length > 1) fail("tie for Son of man by Gospel");
const ezekiel = { kjv: count("kjv", /\bson of man\b/gi, { scope: "OT", books: ["Ezekiel"] }).total, web: count("web", /\bson of man\b/gi, { scope: "OT", books: ["Ezekiel"] }).total };
must("Ezekiel 2:1", "Son of man, stand upon thy feet");
must("Matthew 18:26", "The servant therefore fell down", "Lord, have patience with me");
const jesusOT = { kjv: count("kjv", /\bJesus\b/gi, { scope: "OT" }).total, web: count("web", /\bJesus\b/gi, { scope: "OT" }).total };
const outsideRefs = count("kjv", /\bSon of man\b/g).refs.filter((r) => !GOSPELS.includes(r.replace(/ \d+:\d+$/, "")));
for (const r of outsideRefs) must(r, "Son of man");
mustWeb("Revelation 1:13", "like a son of man");
notCounted(count("web", /\bSon of Man\b/g), "Revelation 1:13", "WEB lower case");
mustWeb("Isaiah 7:14", "Immanuel");
mustWeb("Isaiah 8:8", "Immanuel");
mustWeb("John 1:41", "Messiah");
must("John 6:51", "I am the living bread");
if (jesusOT.kjv || jesusOT.web) fail("Jesus found in the OT");
const lordRaw = { kjv: count("kjv", /\bLord\b/g).total, web: count("web", /\bLord\b/g).total };

const nt = rows.filter((r) => !r.prophecy);
writeList("names-of-jesus", {
  generated: "2026-10-24",
  rows,
  iam,
  sonOfMan: { gospels: sonOfMan, gospelTotal, top: topGospel.book, ezekiel, outsideGospels: R("Son of man").kjv.total - gospelTotal, outsideRefs },
  jesusOT,
  jesusRaw,
  rabbiRaw,
  lordRaw,
  highPriestHebrews: hpHeb,
  counts: { ntRows: nt.length, prophecyRows: rows.length - nt.length, iamRows: iam.length, total: rows.length + iam.length },
});

console.log(`rows ${rows.length} (NT ${nt.length}) + I am ${iam.length} = ${rows.length + iam.length}`);
for (const r of rows) console.log(`${r.n}. ${r.name}: KJV ${r.kjv.total} (first ${r.kjv.first}, top ${r.kjv.top.tied.join("/")} ${r.kjv.top.count}) WEB ${r.web.total}${r.excluded.length ? " excl " + r.excluded.length : ""}`);
for (const s of iam) console.log(`${s.ref} ${s.saying}: KJV ${s.kjv} WEB ${s.web}`);
console.log("Son of man by Gospel (KJV):", sonOfMan.map((g) => `${g.book} ${g.kjv}/${g.web}`).join(", "), "| NT", R("Son of man").kjv.total, "| Ezekiel", ezekiel.kjv, ezekiel.web);
console.log("Jesus in OT", jesusOT, "Son of man outside Gospels", outsideRefs.join(", "));
console.log("Lord raw NT", lordRaw, "Jesus raw", jesusRaw, "Rabbi raw", rabbiRaw, "high priest in Hebrews", hpHeb);
