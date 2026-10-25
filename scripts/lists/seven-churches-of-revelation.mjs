/* The seven churches of Revelation: the seven letters of Revelation 2-3 in the order of Revelation 1:11, each letter's
   range, verses and words (KJV and WEB), how Jesus is described at the opening and where that title comes from in
   Revelation 1, what is praised, what is rebuked, the promise "to him that overcometh", the key phrase, and how often
   each city is named in the rest of the Bible. Every row is checked against the verse it cites; the build stops when a
   needle is missing. Writes lib/data/lists/seven-churches-of-revelation.json.
   Run: node scripts/lists/seven-churches-of-revelation.mjs */
import { must, mustWeb, countForms, countPhrase, verseRows, tokens, norm, fail, writeList, ROWS, BOOKS } from "../lib/list-helpers.mjs";

const order = {
  kjv: must("Revelation 1:11", "send it unto the seven churches which are in Asia", "unto Ephesus, and unto Smyrna, and unto Pergamos, and unto Thyatira, and unto Sardis, and unto Philadelphia, and unto Laodicea"),
  web: mustWeb("Revelation 1:11", "send to the seven assemblies", "Ephesus, Smyrna, Pergamum, Thyatira, Sardis, Philadelphia, and to Laodicea"),
};
const mystery = {
  kjv: must("Revelation 1:20", "The seven stars are the angels of the seven churches", "the seven candlesticks which thou sawest are the seven churches"),
  web: mustWeb("Revelation 1:20", "The seven stars are the angels of the seven assemblies", "The seven lamp stands are seven assemblies"),
};
const asia = must("Revelation 1:4", "John to the seven churches which are in Asia");

/* [name (KJV), WEB name, chapter, first verse, last verse, opening needles KJV, opening needle WEB,
    jesus: [short KJV phrase, echo ref, echo needle],
    praise: [summary, ref, needle] | null, rebuke: [summary, ref, needle] | null,
    promise: [summary, ref, needle (must hold "overcometh")], key: [phrase, ref]] */
const CHURCHES = [
  {
    name: "Ephesus", web: "Ephesus", ch: 2, from: 1, to: 7,
    open: "Unto the angel of the church of Ephesus write", openWeb: "To the angel of the assembly in Ephesus write",
    jesus: ["he that holdeth the seven stars in his right hand, who walketh in the midst of the seven golden candlesticks", "Revelation 1:16", "in his right hand seven stars"],
    praise: ["Hard work and patience; tested false apostles and found them liars; hates the deeds of the Nicolaitanes", "Revelation 2:2", "hast tried them which say they are apostles, and are not, and hast found them liars", "Revelation 2:6", "thou hatest the deeds of the Nicolaitanes"],
    rebuke: ["Has left its first love", "Revelation 2:4", "thou hast left thy first love"],
    promise: ["To eat of the tree of life in the paradise of God", "Revelation 2:7", "To him that overcometh will I give to eat of the tree of life"],
    key: ["thou hast left thy first love", "Revelation 2:4"],
  },
  {
    name: "Smyrna", web: "Smyrna", ch: 2, from: 8, to: 11,
    open: "unto the angel of the church in Smyrna write", openWeb: "To the angel of the assembly in Smyrna write",
    jesus: ["the first and the last, which was dead, and is alive", "Revelation 1:17", "I am the first and the last"],
    praise: ["Poor in tribulation, but rich; slandered by \"the synagogue of Satan\"", "Revelation 2:9", "I know thy works, and tribulation, and poverty, (but thou art rich)"],
    rebuke: null,
    promise: ["Shall not be hurt of the second death", "Revelation 2:11", "He that overcometh shall not be hurt of the second death"],
    key: ["be thou faithful unto death, and I will give thee a crown of life", "Revelation 2:10"],
  },
  {
    name: "Pergamos", web: "Pergamum", ch: 2, from: 12, to: 17,
    open: "to the angel of the church in Pergamos write", openWeb: "To the angel of the assembly in Pergamum write",
    jesus: ["he which hath the sharp sword with two edges", "Revelation 1:16", "a sharp twoedged sword"],
    praise: ["Holds fast his name where \"Satan's seat is\"; did not deny the faith when Antipas was killed", "Revelation 2:13", "thou holdest fast my name, and hast not denied my faith", "Revelation 2:13", "Antipas was my faithful martyr"],
    rebuke: ["Tolerates the doctrine of Balaam and of the Nicolaitanes", "Revelation 2:14", "them that hold the doctrine of Balaam", "Revelation 2:15", "the doctrine of the Nicolaitanes"],
    promise: ["Hidden manna and a white stone with a new name written on it", "Revelation 2:17", "To him that overcometh will I give to eat of the hidden manna, and will give him a white stone"],
    key: ["where Satan's seat is", "Revelation 2:13"],
  },
  {
    name: "Thyatira", web: "Thyatira", ch: 2, from: 18, to: 29,
    open: "unto the angel of the church in Thyatira write", openWeb: "To the angel of the assembly in Thyatira write",
    jesus: ["the Son of God, who hath his eyes like unto a flame of fire, and his feet are like fine brass", "Revelation 1:14", "his eyes were as a flame of fire", "Revelation 1:15", "his feet like unto fine brass"],
    praise: ["Charity, service, faith and patience, with more works at the last than at the first", "Revelation 2:19", "charity, and service, and faith, and thy patience", "Revelation 2:19", "the last to be more than the first"],
    rebuke: ["Allows \"that woman Jezebel\", a self-styled prophetess, to teach", "Revelation 2:20", "thou sufferest that woman Jezebel, which calleth herself a prophetess"],
    promise: ["Power over the nations, and the morning star", "Revelation 2:26-28", "he that overcometh", "to him will I give power over the nations", "I will give him the morning star"],
    key: ["thou sufferest that woman Jezebel", "Revelation 2:20"],
  },
  {
    name: "Sardis", web: "Sardis", ch: 3, from: 1, to: 6,
    open: "unto the angel of the church in Sardis write", openWeb: "to the angel of the assembly in Sardis write",
    jesus: ["he that hath the seven Spirits of God, and the seven stars", "Revelation 1:4", "the seven Spirits which are before his throne"],
    praise: ["Only a few names \"which have not defiled their garments\"", "Revelation 3:4", "Thou hast a few names even in Sardis which have not defiled their garments"],
    rebuke: ["Has a name for being alive but is dead; its works are not perfect", "Revelation 3:1", "thou hast a name that thou livest, and art dead", "Revelation 3:2", "I have not found thy works perfect before God"],
    promise: ["Clothed in white; name kept in the book of life", "Revelation 3:5", "He that overcometh, the same shall be clothed in white raiment", "I will not blot out his name out of the book of life"],
    key: ["thou hast a name that thou livest, and art dead", "Revelation 3:1"],
  },
  {
    name: "Philadelphia", web: "Philadelphia", ch: 3, from: 7, to: 13,
    open: "to the angel of the church in Philadelphia write", openWeb: "To the angel of the assembly in Philadelphia write",
    jesus: ["he that is holy, he that is true, he that hath the key of David", "Isaiah 22:22", "the key of the house of David"],
    praise: ["Has a little strength, kept his word and did not deny his name", "Revelation 3:8", "thou hast a little strength, and hast kept my word, and hast not denied my name"],
    rebuke: null,
    promise: ["A pillar in the temple of God, with God's name, the new Jerusalem and his new name written on him", "Revelation 3:12", "Him that overcometh will I make a pillar in the temple of my God"],
    key: ["I have set before thee an open door, and no man can shut it", "Revelation 3:8"],
  },
  {
    name: "Laodicea", web: "Laodicea", ch: 3, from: 14, to: 22,
    open: "unto the angel of the church of the Laodiceans write", openWeb: "To the angel of the assembly in Laodicea write",
    jesus: ["the Amen, the faithful and true witness, the beginning of the creation of God", "Revelation 1:5", "the faithful witness"],
    praise: null,
    rebuke: ["Lukewarm, neither cold nor hot; says \"I am rich\" but is \"wretched, and miserable, and poor, and blind, and naked\"", "Revelation 3:16", "because thou art lukewarm, and neither cold nor hot", "Revelation 3:17", "thou art wretched, and miserable, and poor, and blind, and naked"],
    promise: ["To sit with him on his throne", "Revelation 3:21", "To him that overcometh will I grant to sit with me in my throne"],
    key: ["Behold, I stand at the door, and knock", "Revelation 3:20"],
  },
];

// Revelation 1:11 names them in this order, and the letters run in the same order
const listed = norm(order.kjv);
let at = -1;
for (const c of CHURCHES) {
  const i = listed.indexOf(c.name);
  if (i <= at) fail(`${c.name} is out of the Revelation 1:11 order`);
  at = i;
}

/** pairs of [ref, needle] from a flat [summary?, ref, needle, ref, needle...] tail */
const pairs = (a) => {
  const out = [];
  for (let i = 0; i < a.length; i += 2) out.push([a[i], a[i + 1]]);
  return out;
};

const letterText = (id, c) => verseRows(id, "Revelation", c.ch, c.ch).filter((r) => r.v >= c.from && r.v <= c.to);

const rows = CHURCHES.map((c, i) => {
  const range = `Revelation ${c.ch}:${c.from}-${c.to}`;
  // the letter opens with "unto the angel of the church in/of ... write" and the next letter's opening is outside the range
  must(`Revelation ${c.ch}:${c.from}`, c.open, "These things saith");
  mustWeb(`Revelation ${c.ch}:${c.from}`, c.openWeb);
  const kv = letterText("kjv", c);
  const wv = letterText("web", c);
  if (kv.length !== c.to - c.from + 1) fail(`${range}: expected ${c.to - c.from + 1} KJV verses, found ${kv.length}`);
  if (kv.slice(1).some((r) => /unto the angel of the church/i.test(r.text))) fail(`${range} holds the start of another letter`);
  const kText = kv.map((r) => r.text).join(" ");
  const wText = wv.map((r) => r.text).join(" ");
  // each letter closes with the hearing formula
  if (!/He that hath an ear, let him hear what the Spirit saith unto the churches/i.test(norm(kText))) fail(`${range} lacks "He that hath an ear"`);
  // the opening title, checked in the letter's first verse
  must(`Revelation ${c.ch}:${c.from}`, c.jesus[0]);
  const echoes = pairs(c.jesus.slice(1)).map(([ref, n]) => (must(ref, n), { ref, text: n }));
  const praise = c.praise ? { text: c.praise[0], refs: pairs(c.praise.slice(1)).map(([ref, n]) => (must(ref, n), ref)) } : null;
  const rebuke = c.rebuke ? { text: c.rebuke[0], refs: pairs(c.rebuke.slice(1)).map(([ref, n]) => (must(ref, n), ref)) } : null;
  const [pText, pRef, ...pNeedles] = c.promise;
  must(pRef, ...pNeedles);
  if (!pNeedles.some((n) => /overcometh/i.test(n))) fail(`${c.name}: the promise needle must hold "overcometh"`);
  must(c.key[1], c.key[0]);
  // order of the two closing lines: the hearing formula before or after the promise
  const earAt = norm(kText).search(/He that hath an ear/i);
  const overAt = norm(kText).search(/overcometh/i);
  if (earAt < 0 || overAt < 0) fail(`${c.name}: closing lines not found`);
  return {
    n: i + 1,
    name: c.name,
    web: c.web,
    range,
    ch: c.ch,
    from: c.from,
    to: c.to,
    verses: kv.length,
    wordsKjv: tokens(kText).length,
    wordsWeb: tokens(wText).length,
    jesus: c.jesus[0],
    echoes,
    praise,
    rebuke,
    promise: { text: pText, ref: pRef },
    key: { text: c.key[0], ref: c.key[1] },
    againstThee: (norm(kText).match(/against thee/gi) || []).length,
    repent: tokens(kText).filter((t) => ["repent", "repented", "repentance"].includes(t)).length,
    earFirst: earAt < overAt,
  };
});

// Smyrna and Philadelphia: no rebuke; check the letters lack "against thee" and any call to repent
for (const r of rows) {
  if (!r.rebuke && (r.againstThee || r.repent)) fail(`${r.name} has no rebuke row but its letter says "against thee" or "repent"`);
}
if (rows.filter((r) => !r.rebuke).map((r) => r.name).join() !== "Smyrna,Philadelphia") fail("the no-rebuke churches should be Smyrna and Philadelphia");
if (rows.filter((r) => !r.praise).map((r) => r.name).join() !== "Laodicea") fail("the no-praise church should be Laodicea");

// the letters together fill Revelation 2 and 3 exactly
const ch23 = verseRows("kjv", "Revelation", 2, 3);
const totalVerses = rows.reduce((s, r) => s + r.verses, 0);
if (totalVerses !== ch23.length) fail(`letters cover ${totalVerses} verses, Revelation 2-3 has ${ch23.length}`);
const totalKjv = rows.reduce((s, r) => s + r.wordsKjv, 0);
const totalWeb = rows.reduce((s, r) => s + r.wordsWeb, 0);
if (totalKjv !== ch23.reduce((s, r) => s + tokens(r.text).length, 0)) fail("letter word counts do not add up to Revelation 2-3");

const byKjv = [...rows].sort((a, b) => b.wordsKjv - a.wordsKjv);
const byWeb = [...rows].sort((a, b) => b.wordsWeb - a.wordsWeb);
byKjv.forEach((r, i) => (r.rankKjv = i + 1));
byWeb.forEach((r, i) => (r.rankWeb = i + 1));
const longest = byKjv[0];
const shortest = byKjv.at(-1);
if (byWeb[0].name !== longest.name || byWeb.at(-1).name !== shortest.name) console.warn("NOTE: WEB longest/shortest differ from KJV");

const earFirst = rows.filter((r) => r.earFirst).map((r) => r.name);
const overFirst = rows.filter((r) => !r.earFirst).map((r) => r.name);

// counts over the full text
const isRev = (r) => r.book === "Revelation";
const isRev23 = (r) => r.book === "Revelation" && (r.ch === 2 || r.ch === 3);
const ear = {
  kjv: countPhrase("kjv", /He that hath an ear, let him hear what the Spirit saith unto the churches/gi),
  web: countPhrase("web", /He who has an ear, let him hear what the Spirit says to the assemblies/gi),
};
if (ear.kjv.total !== 7 || !ear.kjv.refs.every((r) => /^Revelation [23]:/.test(r))) fail(`"He that hath an ear" expected 7 times in Revelation 2-3: ${ear.kjv.refs}`);
const know = {
  kjv: countPhrase("kjv", /I know thy works/gi),
  web: countPhrase("web", /I know your works/gi),
};
// "I know thy works": once in each letter and nowhere else
if (know.kjv.total !== rows.length || rows.some((r) => know.kjv.refs.filter((ref) => { const [c, v] = ref.split(" ")[1].split(":").map(Number); return c === r.ch && v >= r.from && v <= r.to; }).length !== 1)) fail(`"I know thy works" is not once per letter: ${know.kjv.refs}`);
const overcometh = {
  kjv: countForms("kjv", ["overcometh"]),
  rev23: countForms("kjv", ["overcometh"], isRev23),
  web: countForms("web", ["overcomes"]),
};
must("Revelation 21:7", "He that overcometh shall inherit all things");
const CHURCH = ["church", "churches", "church's"];
const church = {
  kjv: countForms("kjv", CHURCH),
  nt: countForms("kjv", CHURCH, (r) => r.testament === "NT"),
  rev: countForms("kjv", CHURCH, isRev),
  rev23: countForms("kjv", CHURCH, isRev23),
  ot: countForms("kjv", CHURCH, (r) => r.testament === "OT"),
  webAssembly: countForms("web", ["assembly", "assemblies"], isRev),
};
const churchRank = Object.entries(church.nt.byBook).sort((a, b) => b[1] - a[1]);
must("Revelation 22:16", "testify unto you these things in the churches");

// "seven": Revelation against every other book, raw and per 1,000 words
const bookWords = (id) => {
  const m = new Map();
  for (const r of ROWS[id]) m.set(r.book, (m.get(r.book) || 0) + tokens(r.text).length);
  return m;
};
const sevenStats = (id) => {
  const c = countForms(id, ["seven"]);
  const words = bookWords(id);
  const ranked = Object.entries(c.byBook).sort((a, b) => b[1] - a[1]).map(([book, n]) => ({ book, n, per1000: Math.round((10000 * n) / words.get(book)) / 10 }));
  const dense = [...ranked].sort((a, b) => b.per1000 - a.per1000);
  const rev = ranked.find((x) => x.book === "Revelation");
  const ahead = ranked.filter((x) => x.n > rev.n).map((x) => x.book);
  const tied = ranked.filter((x) => x.n === rev.n && x.book !== "Revelation").map((x) => x.book);
  return { total: c.total, top: ranked.slice(0, 5), rev, revRank: ahead.length + 1, ahead, tied, densest: dense.slice(0, 3) };
};
const seven = { kjv: sevenStats("kjv"), web: sevenStats("web"), rev23: countForms("kjv", ["seven"], isRev23).total };

// the seven cities in the rest of the Bible
const CITY_FORMS = { Ephesus: ["ephesus"], Smyrna: ["smyrna"], Pergamos: ["pergamos", "pergamum"], Thyatira: ["thyatira"], Sardis: ["sardis"], Philadelphia: ["philadelphia"], Laodicea: ["laodicea", "laodiceans"] };
for (const r of rows) {
  const c = countForms("kjv", CITY_FORMS[r.name]);
  r.namedKjv = c.total;
  r.namedOutside = Object.entries(c.byBook).filter(([b]) => b !== "Revelation").map(([book, n]) => ({ book, n }));
}
const elsewhere = {
  ephesusArrive: must("Acts 19:1", "Paul having passed through the upper coasts came to Ephesus"),
  ephesusTwoYears: must("Acts 19:10", "two years", "all they which dwelt in Asia heard the word of the Lord Jesus"),
  ephesusElders: must("Acts 20:17", "he sent to Ephesus, and called the elders of the church"),
  ephesians: must("Ephesians 1:1", "to the saints which are at Ephesus"),
  lydia: must("Acts 16:14", "Lydia, a seller of purple, of the city of Thyatira"),
  philippi: must("Acts 16:12", "Philippi"),
  epaphras: must("Colossians 4:12", "Epaphras"),
  col21: must("Colossians 2:1", "them at Laodicea"),
  col413: must("Colossians 4:13", "them that are in Laodicea, and them in Hierapolis"),
  col415: must("Colossians 4:15", "Salute the brethren which are in Laodicea"),
  col416: must("Colossians 4:16", "cause that it be read also in the church of the Laodiceans", "read the epistle from Laodicea"),
};
mustWeb("Colossians 4:16", "read the letter from Laodicea");
if (BOOKS.some((b) => /laodic/i.test(b[0]))) fail("a book named for Laodicea is in the canon list");
must("Revelation 2:6", "Nicolaitanes");
const nicolaitanes = countForms("kjv", ["nicolaitanes"]);
const lukewarm = countForms("kjv", ["lukewarm"]);
const lukewarmWeb = countForms("web", ["lukewarm"]);
if (lukewarm.total !== 1 || lukewarmWeb.total !== 1 || lukewarm.first !== "Revelation 3:16") fail("lukewarm should appear once, in Revelation 3:16");
if (nicolaitanes.total !== 2 || nicolaitanes.byBook.Revelation !== 2) fail("Nicolaitanes should appear twice, both in Revelation 2");
mustWeb("Revelation 3:16", "because you are lukewarm");
mustWeb("Revelation 3:20", "I stand at the door and knock");
mustWeb("Revelation 2:4", "you left your first love");
mustWeb("Revelation 2:10", "Be faithful to death, and I will give you the crown of life");
const jezebel = must("1 Kings 16:31", "Jezebel the daughter of Ethbaal");
const balaam = must("Numbers 31:16", "through the counsel of Balaam");

// modern sites: Wikipedia articles read 2026-10-25 (named in the page's Sources)
const MODERN = {
  Ephesus: { place: "Selçuk, İzmir Province", note: "ruins at present-day Selçuk", url: "https://en.wikipedia.org/wiki/Ephesus" },
  Smyrna: { place: "İzmir", note: "the city's official name since 1930", url: "https://en.wikipedia.org/wiki/Smyrna" },
  Pergamos: { place: "Bergama", note: "northwest of the modern city of Bergama", url: "https://en.wikipedia.org/wiki/Pergamon" },
  Thyatira: { place: "Akhisar, Manisa Province", note: "now the city of Akhisar", url: "https://en.wikipedia.org/wiki/Thyatira" },
  Sardis: { place: "Sart, Manisa Province", note: "an archaeological site near the town of Sart", url: "https://en.wikipedia.org/wiki/Sardis" },
  Philadelphia: { place: "Alaşehir, Manisa Province", note: "called Philadelphia until 1390", url: "https://en.wikipedia.org/wiki/Ala%C5%9Fehir" },
  Laodicea: { place: "near Denizli", note: "ruins at Eskihisar, near Denizli", url: "https://en.wikipedia.org/wiki/Laodicea_on_the_Lycus" },
};
for (const r of rows) r.modern = MODERN[r.name];

writeList("seven-churches-of-revelation", {
  generated: "2026-10-25",
  order,
  mystery,
  asia,
  rows,
  totals: { verses: totalVerses, wordsKjv: totalKjv, wordsWeb: totalWeb },
  longest: { name: longest.name, wordsKjv: longest.wordsKjv, wordsWeb: longest.wordsWeb, verses: longest.verses },
  shortest: { name: shortest.name, wordsKjv: shortest.wordsKjv, wordsWeb: shortest.wordsWeb, verses: shortest.verses },
  webSameOrder: byWeb[0].name === longest.name && byWeb.at(-1).name === shortest.name,
  earFirst,
  overFirst,
  ear: { kjv: ear.kjv.total, web: ear.web.total, refs: ear.kjv.refs },
  know: { kjv: know.kjv.total, web: know.web.total, refs: know.kjv.refs },
  overcometh: { kjv: overcometh.kjv.total, rev: overcometh.kjv.byBook.Revelation, rev23: overcometh.rev23.total, byBook: overcometh.kjv.byBook, web: overcometh.web.total, webRev: overcometh.web.byBook.Revelation },
  church: { kjv: church.kjv.total, nt: church.nt.total, ot: church.ot.total, rev: church.rev.total, rev23: church.rev23.total, rank: churchRank.slice(0, 4).map(([book, n]) => ({ book, n })), webAssemblyRev: church.webAssembly.total },
  seven,
  nicolaitanes: nicolaitanes.total,
  lukewarm: { kjv: lukewarm.total, web: lukewarmWeb.total, refs: lukewarm.first },
  elsewhere: Object.keys(elsewhere),
  related: { jezebel: "1 Kings 16:31", balaam: "Numbers 31:16" },
});

console.log("letters:", rows.map((r) => `${r.name} ${r.range} ${r.verses}v ${r.wordsKjv}/${r.wordsWeb}w rank ${r.rankKjv}/${r.rankWeb} against:${r.againstThee} repent:${r.repent} named:${r.namedKjv} outside:${JSON.stringify(r.namedOutside)}`).join("\n  "));
console.log("total", totalVerses, "verses,", totalKjv, "KJV words,", totalWeb, "WEB words | longest", longest.name, "shortest", shortest.name, "| WEB same:", byWeb[0].name, byWeb.at(-1).name);
console.log("ear first:", earFirst.join(", "), "| overcometh first:", overFirst.join(", "));
console.log("ear", ear.kjv.total, ear.web.total, "| I know thy works", know.kjv.total, know.web.total, "| overcometh", overcometh.kjv.byBook, "web", overcometh.web.byBook);
console.log("church KJV", church.kjv.total, "NT", church.nt.total, "OT", church.ot.total, "Rev", church.rev.total, "Rev2-3", church.rev23.total, "rank", churchRank.slice(0, 4), "| WEB assembly(ies) in Rev", church.webAssembly.total);
console.log("seven KJV", JSON.stringify(seven.kjv), "\nseven WEB", JSON.stringify(seven.web), "\nseven in Rev 2-3", seven.rev23);
console.log("nicolaitanes", nicolaitanes.total, "lukewarm", lukewarm.total, lukewarmWeb.total);
