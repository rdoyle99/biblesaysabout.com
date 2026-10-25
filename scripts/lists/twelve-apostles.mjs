/* The twelve apostles: the four lists (Matthew 10:2-4, Mark 3:16-19, Luke 6:14-16, Acts 1:13) read from the KJV and WEB,
   each apostle's position in each list computed from where his name sits in the verse text, the other names and
   family the Bible gives, the apostles outside the twelve, the books that name their writer, and word counts from the
   full text. Every row is checked against its verse; the build stops when a needle is missing.
   Writes lib/data/lists/twelve-apostles.json. Run: node scripts/lists/twelve-apostles.mjs */
import { kjv, web, norm, must, mustWeb, countForms, countPhrase, fail, writeList, ROWS } from "../lib/list-helpers.mjs";

const BIBLE = { kjv, web };

// ---- the four lists -------------------------------------------------------------------------------------------
// An entry is a needle, or [what the cell shows, a longer needle that starts with it]. Position = where the needle
// sits in the passage; each needle must occur exactly once, so the order is read from the text, not typed in.
const LISTS = [
  {
    id: "matthew", ref: "Matthew 10:2-4", label: "Matthew 10:2-4",
    kjv: {
      peter: "Simon, who is called Peter", andrew: "Andrew his brother", jamesZ: "James the son of Zebedee", john: "John his brother",
      philip: "Philip", bartholomew: "Bartholomew", thomas: "Thomas", matthew: "Matthew the publican",
      jamesA: "James the son of Alphaeus", thaddaeus: "Lebbaeus, whose surname was Thaddaeus", simonZ: "Simon the Canaanite", judasI: "Judas Iscariot",
    },
    web: {
      peter: "Simon, who is called Peter", andrew: "Andrew, his brother", jamesZ: "James the son of Zebedee", john: "John, his brother",
      philip: "Philip", bartholomew: "Bartholomew", thomas: "Thomas", matthew: "Matthew the tax collector",
      jamesA: "James the son of Alphaeus", thaddaeus: "Lebbaeus, who was also called Thaddaeus", simonZ: "Simon the Canaanite", judasI: "Judas Iscariot",
    },
  },
  {
    id: "mark", ref: "Mark 3:16-19", label: "Mark 3:16-19",
    kjv: {
      peter: "Simon he surnamed Peter", jamesZ: "James the son of Zebedee", john: "John the brother of James", andrew: "Andrew",
      philip: "Philip", bartholomew: "Bartholomew", matthew: "Matthew", thomas: "Thomas",
      jamesA: "James the son of Alphaeus", thaddaeus: "Thaddaeus", simonZ: "Simon the Canaanite", judasI: "Judas Iscariot",
    },
    web: {
      peter: "Simon (to whom he gave the name Peter)", jamesZ: "James the son of Zebedee", john: "John, the brother of James", andrew: "Andrew",
      philip: "Philip", bartholomew: "Bartholomew", matthew: "Matthew", thomas: "Thomas",
      jamesA: "James, the son of Alphaeus", thaddaeus: "Thaddaeus", simonZ: "Simon the Zealot", judasI: "Judas Iscariot",
    },
  },
  {
    id: "luke", ref: "Luke 6:14-16", label: "Luke 6:14-16",
    kjv: {
      peter: "Simon, (whom he also named Peter,)", andrew: "Andrew his brother", jamesZ: ["James", "James and John"], john: ["John", "John, Philip"],
      philip: ["Philip", "Philip and Bartholomew"], bartholomew: "Bartholomew", matthew: ["Matthew", "Matthew and Thomas"], thomas: ["Thomas", "Thomas, James"],
      jamesA: "James the son of Alphaeus", simonZ: "Simon called Zelotes", thaddaeus: "Judas the brother of James", judasI: "Judas Iscariot",
    },
    web: {
      peter: "Simon, whom he also named Peter", andrew: "Andrew, his brother", jamesZ: ["James", "James; John"], john: ["John", "John; Philip"],
      philip: ["Philip", "Philip; Bartholomew"], bartholomew: "Bartholomew", matthew: "Matthew", thomas: ["Thomas", "Thomas; James"],
      jamesA: "James, the son of Alphaeus", simonZ: "Simon, who was called the Zealot", thaddaeus: "Judas the son of James", judasI: "Judas Iscariot",
    },
  },
  {
    id: "acts", ref: "Acts 1:13", label: "Acts 1:13",
    kjv: {
      peter: ["Peter", "Peter, and James"], jamesZ: ["James", "James, and John"], john: ["John", "John, and Andrew"], andrew: ["Andrew", "Andrew, Philip"],
      philip: ["Philip", "Philip, and Thomas"], thomas: ["Thomas", "Thomas, Bartholomew"], bartholomew: ["Bartholomew", "Bartholomew, and Matthew"], matthew: ["Matthew", "Matthew, James"],
      jamesA: "James the son of Alphaeus", simonZ: "Simon Zelotes", thaddaeus: "Judas the brother of James",
    },
    web: {
      peter: ["Peter", "Peter, John"], john: ["John", "John, James"], jamesZ: ["James", "James, Andrew"], andrew: ["Andrew", "Andrew, Philip"],
      philip: ["Philip", "Philip, Thomas"], thomas: ["Thomas", "Thomas, Bartholomew"], bartholomew: ["Bartholomew", "Bartholomew, Matthew"], matthew: ["Matthew", "Matthew, James"],
      jamesA: "James the son of Alphaeus", simonZ: "Simon the Zealot", thaddaeus: "Judas the son of James",
    },
  },
];
const IDS = ["peter", "andrew", "jamesZ", "john", "philip", "bartholomew", "thomas", "matthew", "jamesA", "thaddaeus", "simonZ", "judasI"];

function readList(list, tr) {
  const text = norm(BIBLE[tr].get(list.ref) || "");
  if (!text) fail(`${list.ref} not found in ${tr}`);
  const found = Object.entries(list[tr]).map(([id, e]) => {
    const [show, needle] = Array.isArray(e) ? e : [e, e];
    if (!needle.startsWith(show)) fail(`${list.ref} ${id}: "${needle}" does not start with "${show}"`);
    const at = text.indexOf(norm(needle));
    if (at < 0) fail(`${list.ref} (${tr}) lacks "${needle}": ${text}`);
    if (text.lastIndexOf(norm(needle)) !== at) fail(`${list.ref} (${tr}): "${needle}" occurs more than once`);
    return { id, show, at };
  });
  found.sort((a, b) => a.at - b.at);
  // the cells must not overlap: each name starts after the previous one ends
  for (let i = 1; i < found.length; i++) if (found[i].at < found[i - 1].at + found[i - 1].show.length) fail(`${list.ref} (${tr}): ${found[i - 1].id} and ${found[i].id} overlap`);
  const expected = list.id === "acts" ? 11 : 12;
  if (found.length !== expected) fail(`${list.ref} (${tr}) should list ${expected}, got ${found.length}`);
  return Object.fromEntries(found.map((f, i) => [f.id, { pos: i + 1, as: f.show }]));
}

const lists = LISTS.map((l) => ({ id: l.id, ref: l.ref, label: l.label, kjv: readList(l, "kjv"), web: readList(l, "web") }));
// the heads of the passages: Matthew calls them apostles, Luke says Jesus named them apostles, Acts 1:13 has no Judas Iscariot
must("Matthew 10:2", "the names of the twelve apostles are these; The first, Simon");
mustWeb("Matthew 10:2", "the names of the twelve apostles are these. The first, Simon");
must("Luke 6:13", "of them he chose twelve, whom also he named apostles");
mustWeb("Luke 6:13", "he chose twelve, whom he also named apostles");
must("Mark 3:14", "he ordained twelve, that they should be with him, and that he might send them forth to preach");
mustWeb("Mark 3:14", "He appointed twelve, that they might be with him");
if (lists.find((l) => l.id === "acts").kjv.judasI) fail("Acts 1:13 should not name Judas Iscariot");

// ---- order observations, computed ----------------------------------------------------------------------------
const posIn = (l, tr, id) => l[tr][id]?.pos ?? null;
const samePosAll = (tr) => IDS.filter((id) => lists.every((l) => !l[tr][id] || l[tr][id].pos === lists[0][tr][id].pos) && lists.every((l) => l[tr][id] || l.id === "acts"))
  .map((id) => ({ id, pos: lists[0][tr][id].pos }));
const gospels = lists.filter((l) => l.id !== "acts");
const lastInGospels = IDS.filter((id) => gospels.every((l) => l.kjv[id]?.pos === 12));
const groups = [1, 2, 3].map((g) => {
  const sets = lists.map((l) => IDS.filter((id) => l.kjv[id] && Math.ceil(l.kjv[id].pos / 4) === g).sort());
  const union = [...new Set(sets.flat())].sort();
  const same = sets.every((s) => s.every((id) => union.includes(id))) && gospels.every((l, i) => sets[i].length === 4 && sets[i].join() === sets[0].join());
  const head = [...new Set(lists.map((l) => IDS.find((id) => l.kjv[id]?.pos === (g - 1) * 4 + 1)))];
  return { group: g, members: union, sameInAll: same, headedBy: head };
});
// where the WEB order differs from the KJV order
const orderDiffs = [];
for (const l of lists) for (const id of IDS) if (l.kjv[id] && l.web[id] && l.kjv[id].pos !== l.web[id].pos) orderDiffs.push({ list: l.ref, id, kjv: l.kjv[id].pos, web: l.web[id].pos });
const shifts = IDS.map((id) => {
  const ps = lists.map((l) => l.kjv[id]?.pos).filter(Boolean);
  return { id, min: Math.min(...ps), max: Math.max(...ps) };
});

// ---- the apostles, row by row ---------------------------------------------------------------------------------
// [id, name, also called, family and work, [ref, kjv needles...] pairs]. `counts` names a word only this apostle bears.
const APOSTLES = [
  ["peter", "Simon Peter", "Simon; Cephas, \"a stone\" (John 1:42); Simon Barjona (Matthew 16:17)", "Brother of Andrew; a fisherman; married (Matthew 8:14)", [
    ["John 1:42", "thou shalt be called Cephas, which is by interpretation, A stone"], ["Matthew 16:17", "Simon Barjona"], ["Matthew 4:18", "Simon called Peter, and Andrew his brother, casting a net into the sea: for they were fishers"],
    ["Matthew 8:14", "Peter's house, he saw his wife's mother"], ["Mark 3:16", "Simon he surnamed Peter"]], ["peter", "peter's"]],
  ["andrew", "Andrew", "", "Brother of Simon Peter; a fisherman; from Bethsaida (John 1:44)", [
    ["John 1:40", "Andrew, Simon Peter's brother"], ["Matthew 4:18", "Andrew his brother"], ["John 1:44", "Philip was of Bethsaida, the city of Andrew and Peter"]], ["andrew"]],
  ["jamesZ", "James, son of Zebedee", "Boanerges, \"the sons of thunder\", with John (Mark 3:17)", "Brother of John; a fisherman, partner with Simon (Luke 5:10); killed by Herod (Acts 12:2)", [
    ["Mark 3:17", "James the son of Zebedee, and John the brother of James; and he surnamed them Boanerges, which is, The sons of thunder"], ["Matthew 4:21", "James the son of Zebedee, and John his brother, in a ship with Zebedee their father, mending their nets"],
    ["Luke 5:10", "the sons of Zebedee, which were partners with Simon"], ["Acts 12:2", "he killed James the brother of John with the sword"]], null],
  ["john", "John, son of Zebedee", "Boanerges, with James (Mark 3:17)", "Brother of James; a fisherman", [
    ["Mark 3:17", "John the brother of James"], ["Matthew 4:21", "John his brother"], ["Mark 1:20", "they left their father Zebedee in the ship with the hired servants"]], null],
  ["philip", "Philip", "", "From Bethsaida; brought Nathanael to Jesus (John 1:45)", [
    ["John 1:43", "findeth Philip, and saith unto him, Follow me"], ["John 1:44", "Philip was of Bethsaida"], ["John 1:45", "Philip findeth Nathanael"]], null],
  ["bartholomew", "Bartholomew", "", "Named only in the four lists", [
    ["Matthew 10:3", "Philip, and Bartholomew"], ["Mark 3:18", "Bartholomew"], ["Luke 6:14", "Bartholomew"], ["Acts 1:13", "Bartholomew"]], ["bartholomew"]],
  ["thomas", "Thomas", "Didymus (John 11:16, 20:24, 21:2)", "Would not believe until he saw the print of the nails (John 20:25)", [
    ["John 11:16", "Thomas, which is called Didymus"], ["John 20:24", "Thomas, one of the twelve, called Didymus"], ["John 20:25", "Except I shall see in his hands the print of the nails"], ["John 20:28", "My Lord and my God"]], ["thomas"]],
  ["matthew", "Matthew", "Levi, in the same call story (Mark 2:14, Luke 5:27)", "A tax collector, \"Matthew the publican\" (Matthew 10:3)", [
    ["Matthew 10:3", "Matthew the publican"], ["Matthew 9:9", "a man, named Matthew, sitting at the receipt of custom"], ["Mark 2:14", "Levi the son of Alphaeus sitting at the receipt of custom"], ["Luke 5:27", "a publican, named Levi, sitting at the receipt of custom"]], ["matthew"]],
  ["jamesA", "James, son of Alphaeus", "", "Called by this name only in the four lists", [
    ["Matthew 10:3", "James the son of Alphaeus"], ["Mark 3:18", "James the son of Alphaeus"], ["Luke 6:15", "James the son of Alphaeus"], ["Acts 1:13", "James the son of Alphaeus"]], null],
  ["thaddaeus", "Thaddaeus", "Lebbaeus (Matthew 10:3); Judas the brother of James (Luke 6:16, Acts 1:13; WEB: son of James)", "John 14:22 has a \"Judas ... not Iscariot\" speaking to Jesus", [
    ["Matthew 10:3", "Lebbaeus, whose surname was Thaddaeus"], ["Mark 3:18", "Thaddaeus"], ["Luke 6:16", "Judas the brother of James"], ["Acts 1:13", "Judas the brother of James"], ["John 14:22", "Judas saith unto him, not Iscariot"]], ["thaddaeus", "lebbaeus"]],
  ["simonZ", "Simon the Zealot", "Simon the Canaanite (Matthew 10:4, Mark 3:18); Simon Zelotes (Luke 6:15, Acts 1:13)", "Called by these names only in the four lists", [
    ["Matthew 10:4", "Simon the Canaanite"], ["Mark 3:18", "Simon the Canaanite"], ["Luke 6:15", "Simon called Zelotes"], ["Acts 1:13", "Simon Zelotes"]], null],
  ["judasI", "Judas Iscariot", "Son of Simon (John 6:71)", "Kept the money bag (John 12:6); betrayed Jesus for thirty pieces of silver (Matthew 26:15)", [
    ["John 6:71", "Judas Iscariot the son of Simon"], ["John 12:6", "had the bag"], ["Matthew 26:14-15", "one of the twelve, called Judas Iscariot", "thirty pieces of silver"], ["Matthew 27:5", "went and hanged himself"]], null],
];
// "Named only in the four lists": the name (or name with father) must occur exactly four times in the KJV
const onlyInLists = {
  bartholomew: countForms("kjv", ["bartholomew"]).total,
  jamesA: countPhrase("kjv", /\bJames the son of Alphaeus\b/g).total,
};
if (onlyInLists.bartholomew !== 4 || onlyInLists.jamesA !== 4) fail(`only-in-lists counts are not 4: ${JSON.stringify(onlyInLists)}`);
// Simon the Zealot: Canaanite/Zelotes only in the four lists (KJV)
const simonZNames = countForms("kjv", ["canaanite", "zelotes"]);
const simonZRefs = countPhrase("kjv", /\bSimon (the Canaanite|called Zelotes|Zelotes)\b/g);
if (simonZRefs.total !== 4) fail(`Simon the Canaanite/Zelotes should be named 4 times, got ${simonZRefs.total} ${simonZRefs.refs}`);
const apostles = APOSTLES.map(([id, name, also, family, refs, forms]) => {
  refs.forEach(([ref, ...n]) => must(ref, ...n));
  const row = { id, name, also, family, refs: refs.map(([r]) => r) };
  if (forms) {
    row.countKjv = countForms("kjv", forms).total;
    row.countWeb = countForms("web", forms).total;
    row.countForms = forms;
  }
  row.positions = Object.fromEntries(lists.map((l) => [l.id, posIn(l, "kjv", id)]));
  return row;
});
const peterRow = apostles.find((a) => a.id === "peter");
// Mark and Luke tell Levi's call with the same "Follow me" as Matthew 9:9
must("Matthew 9:9", "Follow me. And he arose, and followed him");
must("Mark 2:14", "Follow me. And he arose and followed him");
must("Luke 5:27", "Follow me");
mustWeb("Matthew 10:3", "Matthew the tax collector");

// ---- translation differences, each checked in both texts ------------------------------------------------------
const DIFFS = [
  { ref: "Luke 6:16", kjv: "Judas the brother of James", web: "Judas the son of James" },
  { ref: "Acts 1:13", kjv: "Judas the brother of James", web: "Judas the son of James" },
  { ref: "Mark 3:18", kjv: "Simon the Canaanite", web: "Simon the Zealot" },
  { ref: "Matthew 10:3", kjv: "Matthew the publican", web: "Matthew the tax collector" },
  { ref: "Matthew 10:3", kjv: "Lebbaeus, whose surname was Thaddaeus", web: "Lebbaeus, who was also called Thaddaeus" },
  { ref: "Acts 1:13", kjv: "Peter, and James, and John", web: "Peter, John, James" },
  { ref: "John 6:71", kjv: "Judas Iscariot the son of Simon", web: "Judas, the son of Simon Iscariot" },
];
for (const d of DIFFS) {
  must(d.ref, d.kjv);
  mustWeb(d.ref, d.web);
  if (norm(web.get(d.ref)).includes(d.kjv) && d.kjv !== d.web) fail(`${d.ref}: WEB also has "${d.kjv}"`);
}
// Bible Hub interlinear (read 2026-10-25): Luke 6:16 Greek "Ioudan Iakobou", Judas of James, the KJV's "the brother" in brackets as supplied

// ---- beyond the twelve: replacement, other apostles, deaths ---------------------------------------------------
const BEYOND = [
  { who: "Matthias", what: "Chosen by lot to take Judas Iscariot's place, \"numbered with the eleven apostles\"", ref: "Acts 1:26", needles: ["the lot fell upon Matthias; and he was numbered with the eleven apostles"] },
  { who: "Paul", what: "\"Called to be an apostle\"; he calls himself \"the least of the apostles\" (1 Corinthians 15:9)", ref: "Romans 1:1", needles: ["Paul, a servant of Jesus Christ, called to be an apostle"] },
  { who: "Barnabas", what: "Called an apostle with Paul: \"the apostles, Barnabas and Paul\"", ref: "Acts 14:14", needles: ["the apostles, Barnabas and Paul"] },
  { who: "James the Lord's brother", what: "Paul says \"other of the apostles saw I none, save James the Lord's brother\"", ref: "Galatians 1:19", needles: ["other of the apostles saw I none, save James the Lord's brother"] },
];
for (const b of BEYOND) must(b.ref, ...b.needles);
const replace = {
  two: must("Acts 1:23", "Joseph called Barsabas, who was surnamed Justus, and Matthias"),
  rule: must("Acts 1:21-22", "companied with us all the time", "Beginning from the baptism of John", "a witness with us of his resurrection"),
  fell: must("Acts 1:25", "from which Judas by transgression fell"),
};
must("1 Corinthians 15:9", "I am the least of the apostles");
must("1 Corinthians 15:8", "one born out of due time");
must("1 Corinthians 15:5", "he was seen of Cephas, then of the twelve");
must("Galatians 1:17", "them which were apostles before me");
must("Galatians 1:1", "Paul, an apostle");
const DEATHS = [
  { who: "Judas Iscariot", ref: "Matthew 27:5", needle: "went and hanged himself", also: "Acts 1:18", alsoNeedle: "falling headlong, he burst asunder in the midst" },
  { who: "James, son of Zebedee", ref: "Acts 12:2", needle: "he killed James the brother of John with the sword", also: "Acts 12:1", alsoNeedle: "Herod the king stretched forth his hands" },
];
for (const d of DEATHS) must(d.ref, d.needle) && must(d.also, d.alsoNeedle);
must("John 21:18-19", "signifying by what death he should glorify God");
// the three Jesus took apart: Peter, James and John
must("Mark 5:37", "save Peter, and James, and John the brother of James");
must("Matthew 17:1", "Jesus taketh Peter, James, and John his brother");
const eleven = {
  matthew: must("Matthew 28:16", "the eleven disciples went away into Galilee"),
  acts: must("Acts 2:14", "Peter, standing up with the eleven"),
};

// thrones and foundations
const future = {
  thrones: must("Matthew 19:28", "ye also shall sit upon twelve thrones, judging the twelve tribes of Israel"),
  thronesLuke: must("Luke 22:30", "sit on thrones judging the twelve tribes of Israel"),
  foundations: must("Revelation 21:14", "the wall of the city had twelve foundations, and in them the names of the twelve apostles of the Lamb"),
  gates: must("Revelation 21:12", "twelve gates", "names of the twelve tribes of the children of Israel"),
  foundationsWeb: mustWeb("Revelation 21:14", "twelve foundations, and on them twelve names of the twelve Apostles of the Lamb"),
};

// ---- who wrote: the books that name their writer, from their own words -----------------------------------------
const PAUL_BOOKS = ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon"];
const paulLetters = PAUL_BOOKS.map((b) => {
  const t = must(`${b} 1:1`, "Paul");
  return { book: b, apostle: /\bapostle\b/i.test(t) };
});
const WRITERS = [
  { book: "1 Peter", ref: "1 Peter 1:1", needle: "Peter, an apostle of Jesus Christ", writer: "Peter, \"an apostle of Jesus Christ\"" },
  { book: "2 Peter", ref: "2 Peter 1:1", needle: "Simon Peter, a servant and an apostle of Jesus Christ", writer: "Simon Peter, \"a servant and an apostle\"" },
  { book: "James", ref: "James 1:1", needle: "James, a servant of God and of the Lord Jesus Christ", writer: "James, \"a servant of God\", without saying which James" },
  { book: "Jude", ref: "Jude 1:1", needle: "Jude, the servant of Jesus Christ, and brother of James", writer: "Jude, \"brother of James\"" },
  { book: "Revelation", ref: "Revelation 1:1", needle: "his servant John", writer: "John (Revelation 1:1, 1:4, 1:9, 22:8), not called an apostle" },
  { book: "2 John", ref: "2 John 1:1", needle: "The elder unto the elect lady", writer: "\"The elder\", no name" },
  { book: "3 John", ref: "3 John 1:1", needle: "The elder unto the wellbeloved Gaius", writer: "\"The elder\", no name" },
  { book: "John", ref: "John 21:24", needle: "This is the disciple which testifieth of these things, and wrote these things", writer: "\"the disciple\" whom Jesus loved (John 21:20, 24), no name" },
];
for (const w of WRITERS) must(w.ref, w.needle);
must("Revelation 1:4", "John to the seven churches");
must("Revelation 1:9", "I John, who also am your brother");
must("Revelation 22:8", "I John saw these things");
must("John 21:20", "the disciple whom Jesus loved");
for (const b of ["Hebrews", "Matthew", "Mark", "Luke", "Acts", "1 John"]) if (/\b(Paul|Peter|John|Matthew)\b/.test(kjv.get(`${b} 1:1`) || "")) fail(`${b} 1:1 names someone, check the "no writer named" claim`);
// none of the four Gospels, Acts or 1 John has the word "apostle" in the writer's name for himself; the Revelation writer never calls himself one
const revApostle = countForms("kjv", ["apostle"], (r) => r.book === "Revelation").total;
if (revApostle !== 0) fail(`Revelation uses the singular "apostle" ${revApostle} times`);

// ---- counts from the full text ---------------------------------------------------------------------------------
const GOSPELS = new Set(["Matthew", "Mark", "Luke", "John"]);
const notGroupNoun = /\bthe twelve\b(?!\s+(apostles|tribes|disciples|patriarchs|gates)\b)/gi;
const words = {
  apostleKjv: countForms("kjv", ["apostle", "apostles", "apostle's", "apostles'"]),
  apostleWeb: countForms("web", ["apostle", "apostles", "apostle's", "apostles'"]),
  apostleGospelsKjv: countForms("kjv", ["apostle", "apostles", "apostle's", "apostles'"], (r) => GOSPELS.has(r.book)),
  apostleJohnKjv: countForms("kjv", ["apostle", "apostles"], (r) => r.book === "John").total,
  apostleJohnWeb: countForms("web", ["apostle", "apostles"], (r) => r.book === "John").total,
  discipleKjv: countForms("kjv", ["disciple", "disciples", "disciple's", "disciples'"]),
  discipleWeb: countForms("web", ["disciple", "disciples", "disciple's", "disciples'"]),
  peterKjv: countForms("kjv", ["peter", "peter's"]),
  peterWeb: countForms("web", ["peter", "peter's"]),
  cephasKjv: countForms("kjv", ["cephas"]),
  cephasWeb: countForms("web", ["cephas"]),
  paulKjv: countForms("kjv", ["paul", "paul's"]),
  paulWeb: countForms("web", ["paul", "paul's"]),
  johnKjv: countForms("kjv", ["john", "john's"]),
  jamesKjv: countForms("kjv", ["james", "james'"]),
  judasKjv: countForms("kjv", ["judas", "judas'"]),
  philipKjv: countForms("kjv", ["philip", "philip's"]),
  simonPeterKjv: countPhrase("kjv", /\bSimon Peter\b/g),
  theTwelveKjv: countPhrase("kjv", notGroupNoun, (r) => r.testament === "NT"),
  theTwelveWeb: countPhrase("web", notGroupNoun, (r) => r.testament === "NT"),
  twelveApostlesKjv: countPhrase("kjv", /\btwelve apostles\b/gi),
  twelveApostlesWeb: countPhrase("web", /\btwelve apostles\b/gi),
  twelveDisciplesKjv: countPhrase("kjv", /\btwelve disciples\b/gi),
  nathanaelOutsideJohn: countForms("kjv", ["nathanael"], (r) => r.book !== "John").total,
  nathanaelKjv: countForms("kjv", ["nathanael"]).total,
  bartholomewInJohn: countForms("kjv", ["bartholomew"], (r) => r.book === "John").total,
  matthiasKjv: countPhrase("kjv", /\bMatthias\b/g),
  discipleGospelsKjv: countForms("kjv", ["disciple", "disciples", "disciple's", "disciples'"], (r) => GOSPELS.has(r.book)).total,
  peterActsKjv: { early: countForms("kjv", ["peter", "peter's"], (r) => r.book === "Acts" && r.ch <= 12).total, late: countForms("kjv", ["peter", "peter's"], (r) => r.book === "Acts" && r.ch >= 13).total },
  paulActsKjv: { early: countForms("kjv", ["paul", "paul's"], (r) => r.book === "Acts" && r.ch <= 12).total, late: countForms("kjv", ["paul", "paul's"], (r) => r.book === "Acts" && r.ch >= 13).total },
};
if (words.matthiasKjv.total !== 2 || !words.matthiasKjv.refs.every((r) => r.startsWith("Acts 1:"))) fail(`Matthias: ${words.matthiasKjv.refs}`);
must("John 21:1", "sea of Tiberias");
must("Acts 13:9", "Saul, (who also is called Paul,)");
// the books said to name no writer: no "I Paul", "I John" and the like anywhere in them
for (const b of ["Matthew", "Mark", "Luke", "Acts", "Hebrews", "1 John"]) {
  const hit = ROWS.kjv.find((r) => r.book === b && /\bI,? (Paul|Peter|John|Matthew|Mark|Luke|James|Jude|Tertius)\b/.test(norm(r.text)));
  if (hit) fail(`${b} names a writer? ${hit.ref}: ${hit.text}`);
}
// "the twelve" must be in the Gospels, Acts and 1 Corinthians 15:5 only (the group of Jesus' twelve)
const twelveBooks = (refs) => [...new Set(refs.map((r) => r.replace(/ \d+:\d+$/, "")))];
for (const b of twelveBooks(words.theTwelveKjv.refs)) if (!["Matthew", "Mark", "Luke", "John", "Acts", "1 Corinthians"].includes(b)) fail(`"the twelve" standing alone in ${b}`);
words.theTwelveKjvByBook = Object.fromEntries(twelveBooks(words.theTwelveKjv.refs).map((b) => [b, words.theTwelveKjv.refs.filter((r) => r.startsWith(b + " ")).length]));
if (words.theTwelveKjv.refs.length !== words.theTwelveKjv.total) fail("a verse holds 'the twelve' twice; byBook would undercount");
// disciple never appears after Acts
const discipleBooks = Object.keys(words.discipleKjv.byBook);
const discipleAfterActs = discipleBooks.filter((b) => !["Isaiah", "Matthew", "Mark", "Luke", "John", "Acts"].includes(b));
if (discipleAfterActs.length) fail(`"disciple" after Acts in ${discipleAfterActs}`);
must("Isaiah 8:16", "seal the law among my disciples");
// Peter is named more often than any other of the twelve, even against counts that include other men of the same name
const rivals = { John: words.johnKjv.total, James: words.jamesKjv.total, Judas: words.judasKjv.total, Philip: words.philipKjv.total, Simon: countForms("kjv", ["simon", "simon's"]).total };
for (const [n, c] of Object.entries(rivals)) if (c >= words.peterKjv.total) fail(`${n} (${c}) is not below Peter (${words.peterKjv.total})`);
for (const a of apostles) if (a.countKjv && a.id !== "peter" && a.countKjv >= words.peterKjv.total) fail(`${a.name} beats Peter`);
// the page says Paul is named exactly as often as Peter in the KJV
if (words.paulKjv.total !== words.peterKjv.total) fail(`Paul ${words.paulKjv.total} vs Peter ${words.peterKjv.total}: fix the page wording`);
if (words.apostleJohnKjv !== 0) fail(`John's Gospel has "apostle" ${words.apostleJohnKjv} times in the KJV`);

writeList("twelve-apostles", {
  generated: "2026-10-25",
  count: 12,
  ids: IDS,
  lists,
  observations: { samePosKjv: samePosAll("kjv"), samePosWeb: samePosAll("web"), lastInGospels, groups, orderDiffs, shifts },
  apostles,
  onlyInLists,
  simonZRefs: simonZRefs.refs,
  diffs: DIFFS,
  beyond: BEYOND.map(({ who, what, ref }) => ({ who, what, ref })),
  deaths: DEATHS.map(({ who, ref, also }) => ({ who, ref, also })),
  paulLetters,
  paulApostleOpenings: paulLetters.filter((p) => p.apostle).length,
  writers: WRITERS.map(({ book, ref, writer }) => ({ book, ref, writer })),
  words,
  rivals,
  quotes: {
    luke613: must("Luke 6:13"),
    luke613Web: mustWeb("Luke 6:13"),
    rev2114: future.foundations,
    matt1928: future.thrones,
    acts126: must("Acts 1:26"),
  },
});

console.log("positions (KJV):");
for (const id of IDS) console.log(" ", id.padEnd(12), lists.map((l) => `${l.id}:${l.kjv[id]?.pos ?? "-"}${l.web[id] && l.web[id].pos !== l.kjv[id]?.pos ? `(web ${l.web[id].pos})` : ""}`).join("  "));
console.log("same position in all four (KJV):", samePosAll("kjv").map((s) => `${s.id}@${s.pos}`).join(", "), "| WEB:", samePosAll("web").map((s) => `${s.id}@${s.pos}`).join(", "));
console.log("last in the three Gospel lists:", lastInGospels);
console.log("groups of four:", groups.map((g) => `${g.group}: ${g.members.join("/")} same=${g.sameInAll} head=${g.headedBy}`).join(" | "));
console.log("WEB vs KJV order:", JSON.stringify(orderDiffs));
console.log("apostle(s) KJV", words.apostleKjv.total, "top", words.apostleKjv.top.book, words.apostleKjv.top.count, "books", words.apostleKjv.books, "| WEB", words.apostleWeb.total, words.apostleWeb.top.book, words.apostleWeb.top.count, "| Gospels KJV", JSON.stringify(words.apostleGospelsKjv.byBook), "| John", words.apostleJohnKjv, "/", words.apostleJohnWeb);
console.log("disciple(s) KJV", words.discipleKjv.total, "top", words.discipleKjv.top.book, words.discipleKjv.top.count, JSON.stringify(words.discipleKjv.byBook), "| WEB", words.discipleWeb.total, words.discipleWeb.top.book, words.discipleWeb.top.count);
console.log("Peter KJV", words.peterKjv.total, "WEB", words.peterWeb.total, "| Cephas", words.cephasKjv.total, words.cephasWeb.total, "| Paul", words.paulKjv.total, words.paulWeb.total, "| Simon Peter", words.simonPeterKjv.total, "| rivals", JSON.stringify(rivals));
console.log("names:", apostles.filter((a) => a.countKjv).map((a) => `${a.name} ${a.countKjv}/${a.countWeb}`).join(", "));
console.log("'the twelve' alone KJV", words.theTwelveKjv.total, JSON.stringify(words.theTwelveKjvByBook), "WEB", words.theTwelveWeb.total, "| 'twelve apostles'", words.twelveApostlesKjv.refs, "WEB", words.twelveApostlesWeb.refs, "| 'twelve disciples'", words.twelveDisciplesKjv.refs);
console.log("Paul letters", paulLetters.length, "with 'apostle' in 1:1:", paulLetters.filter((p) => p.apostle).map((p) => p.book).join(", "));
console.log("Nathanael outside John", words.nathanaelOutsideJohn, "Bartholomew in John", words.bartholomewInJohn, "| only in lists", JSON.stringify(onlyInLists), "| Simon Z", simonZRefs.refs);
