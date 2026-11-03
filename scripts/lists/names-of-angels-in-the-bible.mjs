/* Names of angels in the Bible: the angels the 66-book Bible names (Michael, Gabriel, and Abaddon/Apollyon, the angel of
   the abyss), the names readers often add (Lucifer, Satan), the names found only outside the KJV and WEB (Raphael, Uriel),
   and the kinds and titles of angels (angel, archangel, cherubim, seraphim, watchers, the angel of the LORD), each
   counted in the KJV and the WEB. Every quoted verse is checked in both translations and every count is computed here,
   so a wrong reference or a changed source text stops the build.
   Writes lib/data/lists/names-of-angels-in-the-bible.json. Run: node scripts/lists/names-of-angels-in-the-bible.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList, ROWS, norm } from "../lib/list-helpers.mjs";

const verse = (ref, kjvNeedle, webNeedle) => ({ ref, kjv: must(ref, kjvNeedle).trim(), web: mustWeb(ref, webNeedle).trim(), kjvPhrase: kjvNeedle, webPhrase: webNeedle });
const versesOf = (id, re) => ROWS[id].filter((r) => re.test(norm(r.text))).map((r) => r.ref);
const same = (a, b, what) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${what}: KJV ${JSON.stringify(a)} vs WEB ${JSON.stringify(b)}`);
  return a;
};

/* ---------- Michael: 15 verses name a Michael; 5 are the angel ---------- */
const MICHAEL_ANGEL = ["Daniel 10:13", "Daniel 10:21", "Daniel 12:1", "Jude 1:9", "Revelation 12:7"];
const michaelAll = same(versesOf("kjv", /\bMichael\b/), versesOf("web", /\bMichael\b/), "Michael verses");
const michaelMen = michaelAll.filter((r) => !MICHAEL_ANGEL.includes(r));
if (michaelAll.length !== 15 || michaelMen.length !== 10) fail(`Michael: ${michaelAll.length} verses, ${michaelMen.length} men`);
const michael = [
  verse("Daniel 10:13", "Michael, one of the chief princes, came to help me", "Michael, one of the chief princes, came to help me"),
  verse("Daniel 10:21", "Michael your prince", "Michael your prince"),
  verse("Daniel 12:1", "Michael stand up, the great prince", "Michael will stand up, the great prince"),
  verse("Jude 1:9", "Michael the archangel", "Michael, the archangel"),
  verse("Revelation 12:7", "Michael and his angels fought against the dragon", "Michael and his angels made war on the dragon"),
];
// the ten other Michaels are men in genealogies and lists
must("Numbers 13:13", "Michael");
must("2 Chronicles 21:2", "Michael", "the sons of Jehoshaphat");
must("Ezra 8:8", "Michael");

/* ---------- Gabriel: 4 verses, all the angel ---------- */
const gabrielAll = same(versesOf("kjv", /\bGabriel\b/), versesOf("web", /\bGabriel\b/), "Gabriel verses");
const gabriel = [
  verse("Daniel 8:16", "Gabriel, make this man to understand the vision", "Gabriel, make this man understand the vision"),
  verse("Daniel 9:21", "the man Gabriel", "the man Gabriel"),
  verse("Luke 1:19", "I am Gabriel, that stand in the presence of God", "I am Gabriel, who stands in the presence of God"),
  verse("Luke 1:26", "the angel Gabriel was sent from God", "the angel Gabriel was sent from God"),
];
must("Luke 1:18", "Zacharias said unto the angel");
mustWeb("Luke 1:18", "Zacharias said to the angel");
must("Luke 1:27", "Mary");
must("Genesis 18:2", "three men");
must("Genesis 19:1", "two angels");
must("Revelation 2:1", "the angel of the church of Ephesus");
must("Exodus 25:18", "mercy seat");
must("Exodus 14:19", "the angel of God");
mustWeb("Exodus 14:19", "the angel of God");
if (gabrielAll.join() !== gabriel.map((v) => v.ref).join()) fail(`Gabriel verses ${gabrielAll.join("; ")}`);

/* ---------- Abaddon / Apollyon, the angel of the abyss ---------- */
const abaddon = verse("Revelation 9:11", "the angel of the bottomless pit, whose name in the Hebrew tongue is Abaddon", "the angel of the abyss. His name in Hebrew is “Abaddon”");
mustWeb("Revelation 9:11", "Apollyon");
must("Revelation 9:11", "Apollyon");
const abaddonKjv = versesOf("kjv", /\bAbaddon\b/);
const abaddonWeb = versesOf("web", /\bAbaddon\b/);
const apollyon = same(versesOf("kjv", /\bApollyon\b/), versesOf("web", /\bApollyon\b/), "Apollyon verses");
const abaddonPlace = abaddonWeb.filter((r) => r !== "Revelation 9:11");
for (const r of abaddonPlace) must(r, "destruction"); // the KJV reads "destruction" where the WEB keeps the Hebrew name

/* ---------- Lucifer: KJV Isaiah 14:12 only ---------- */
const lucifer = verse("Isaiah 14:12", "O Lucifer, son of the morning", "morning star, son of the dawn");
const luciferKjv = versesOf("kjv", /\bLucifer\b/);
const luciferWeb = versesOf("web", /\bLucifer\b/);
if (luciferKjv.join() !== "Isaiah 14:12" || luciferWeb.length) fail(`Lucifer KJV ${luciferKjv} WEB ${luciferWeb}`);
must("Isaiah 14:4", "take up this proverb against the king of Babylon");
mustWeb("Isaiah 14:4", "take up this parable against the king of Babylon");

/* ---------- Satan and his angels ---------- */
const satanRev = verse("Revelation 12:9", "his angels were cast out with him", "his angels were thrown down with him");
must("Revelation 12:9", "called the Devil, and Satan");
const angelOfLight = verse("2 Corinthians 11:14", "Satan himself is transformed into an angel of light", "Satan masquerades as an angel of light");
const satan = { kjv: countForms("kjv", ["satan"]), web: countForms("web", ["satan"]) };

/* ---------- kinds and titles ---------- */
const testamentSplit = (id, forms) => ({
  total: countForms(id, forms).total,
  verses: countForms(id, forms).verses,
  ot: countForms(id, forms, (r) => r.testament === "OT").total,
  nt: countForms(id, forms, (r) => r.testament === "NT").total,
  top: countForms(id, forms).top,
  first: countForms(id, forms).first,
});
const ANGEL = ["angel", "angels", "angel's"];
const CHERUB = ["cherub", "cherubim", "cherubims", "cherubim's"];
const SERAPH = ["seraphim", "seraphims"];
const kinds = {
  angel: { kjv: testamentSplit("kjv", ANGEL), web: testamentSplit("web", ANGEL) },
  angelSingular: { kjv: countForms("kjv", ["angel", "angel's"]).total, web: countForms("web", ["angel", "angel's"]).total },
  angelPlural: { kjv: countForms("kjv", ["angels"]).total, web: countForms("web", ["angels"]).total },
  cherub: { kjv: testamentSplit("kjv", CHERUB), web: testamentSplit("web", CHERUB) },
  seraphim: { kjv: testamentSplit("kjv", SERAPH), web: testamentSplit("web", SERAPH) },
  archangel: { kjv: testamentSplit("kjv", ["archangel"]), web: testamentSplit("web", ["archangel"]) },
  watchers: {
    kjv: countForms("kjv", ["watcher", "watchers"], (r) => r.book === "Daniel"),
    web: countForms("web", ["watcher", "watchers"], (r) => r.book === "Daniel"),
  },
};
const archRefs = same(versesOf("kjv", /\barchangel\b/i), versesOf("web", /\barchangel\b/i), "archangel verses");
if (archRefs.join() !== "1 Thessalonians 4:16,Jude 1:9") fail(`archangel verses ${archRefs.join("; ")}`);
const seraphRefs = same(versesOf("kjv", /\bseraphims?\b/i), versesOf("web", /\bseraphims?\b/i), "seraphim verses");
if (seraphRefs.join() !== "Isaiah 6:2,Isaiah 6:6") fail(`seraphim verses ${seraphRefs.join("; ")}`);
const cherubimsKjv = countForms("kjv", ["cherubims"]).total; // the KJV's double plural
const watcherRefs = same(
  ROWS.kjv.filter((r) => r.book === "Daniel" && /\bwatchers?\b/i.test(r.text)).map((r) => r.ref),
  ROWS.web.filter((r) => r.book === "Daniel" && /\bwatchers?\b/i.test(r.text)).map((r) => r.ref),
  "watcher verses in Daniel"
);

// the angel of the LORD: the KJV prints LORD (Old Testament) and Lord (New); the WEB writes "Yahweh's angel" in the Old
const aolK = countPhrase("kjv", /angel of the lord\b/gi);
const aolKot = countPhrase("kjv", /angel of the lord\b/gi, (r) => r.testament === "OT");
const aolKnt = countPhrase("kjv", /angel of the lord\b/gi, (r) => r.testament === "NT");
const yahwehW = countPhrase("web", /yahweh's angel|angel of yahweh/gi);
const aolWnt = countPhrase("web", /angel of the lord\b/gi, (r) => r.testament === "NT");
const aolWot = countPhrase("web", /angel of the lord\b/gi, (r) => r.testament === "OT");
const aogK = countPhrase("kjv", /angel of god\b/gi);
const aogW = countPhrase("web", /angel of god\b/gi);
const angelOfLord = {
  kjv: { total: aolK.total, verses: aolK.refs.length, ot: aolKot.total, nt: aolKnt.total },
  web: { yahweh: yahwehW.total, yahwehVerses: yahwehW.refs.length, lordNT: aolWnt.total, lordOT: aolWot.total },
  angelOfGod: { kjv: aogK.total, web: aogW.total },
  verses: [
    verse("Genesis 16:7", "the angel of the LORD found her", "Yahweh’s angel found her"),
    verse("Exodus 3:2", "the angel of the LORD appeared unto him in a flame of fire", "Yahweh’s angel appeared to him in a flame of fire"),
    verse("Judges 13:18", "Why askest thou thus after my name, seeing it is secret?", "Why do you ask about my name, since it is incomprehensible?"),
  ],
};

/* ---------- the kinds table ---------- */
const kindRows = [
  { name: "Angel, angels", what: "The general word: a messenger sent by God. The Hebrew malak and the Greek angelos both mean messenger.", kjv: kinds.angel.kjv.total, web: kinds.angel.web.total, key: verse("Hebrews 1:14", "ministering spirits", "serving spirits") },
  { name: "Archangel", what: "Chief angel. Only Michael is called one by name.", kjv: kinds.archangel.kjv.total, web: kinds.archangel.web.total, key: verse("1 Thessalonians 4:16", "the voice of the archangel", "the voice of the archangel") },
  { name: "Cherub, cherubim", what: "Guard the way to the tree of life, are shaped in gold on the ark's cover, and carry the throne in Ezekiel's visions.", kjv: kinds.cherub.kjv.total, web: kinds.cherub.web.total, key: verse("Genesis 3:24", "Cherubim, and a flaming sword", "cherubim at the east of the garden of Eden") },
  { name: "Seraphim", what: "Six-winged beings above the throne in Isaiah's vision, crying holy, holy, holy.", kjv: kinds.seraphim.kjv.total, web: kinds.seraphim.web.total, key: verse("Isaiah 6:2", "each one had six wings", "Each one had six wings") },
  { name: "Watchers (holy ones)", what: "Heavenly beings who decree Nebuchadnezzar's sentence in Daniel 4.", kjv: kinds.watchers.kjv.total, web: kinds.watchers.web.total, key: verse("Daniel 4:13", "a watcher and an holy one came down from heaven", "a watcher and a holy one came down from the sky") },
  { name: "The angel of the LORD", what: "Speaks as God in several scenes; readers differ on whether he is an angel or God himself.", kjv: angelOfLord.kjv.total, web: angelOfLord.web.yahweh + angelOfLord.web.lordNT + angelOfLord.web.lordOT, key: angelOfLord.verses[1], note: "WEB: \"Yahweh's angel\" in the Old Testament" },
];
must("Isaiah 6:3", "Holy, holy, holy");
must("Exodus 25:18", "two cherubims of gold");
must("Ezekiel 10:1", "cherubims");

/* ---------- the names table ---------- */
const nameRows = [
  { n: 1, name: "Michael", meaning: "Who is like God?", status: "named", title: "one of the chief princes; the archangel", kjv: michaelAll.length, web: michaelAll.length, angelVerses: MICHAEL_ANGEL.length, refs: MICHAEL_ANGEL, note: `${michaelAll.length} verses name a Michael in both translations; ${MICHAEL_ANGEL.length} are the angel and ${michaelMen.length} are men in lists and genealogies.` },
  { n: 2, name: "Gabriel", meaning: "God is my strength, or man of God", status: "named", title: "the angel who stands in the presence of God", kjv: gabrielAll.length, web: gabrielAll.length, angelVerses: gabrielAll.length, refs: gabrielAll, note: "Every Gabriel verse is the angel: twice in Daniel, twice in Luke 1." },
  { n: 3, name: "Abaddon (Apollyon)", meaning: "Destruction (Hebrew); Destroyer (Greek)", status: "named", title: "the angel of the bottomless pit (WEB: of the abyss)", kjv: abaddonKjv.length, web: abaddonWeb.length, angelVerses: 1, refs: ["Revelation 9:11"], note: `The angel's name is given once, in Revelation 9:11. The WEB also keeps Abaddon as a place in ${abaddonPlace.join(", ")}, where the KJV says "destruction".` },
  { n: 4, name: "Lucifer", meaning: "The Latin name of the morning star; the Hebrew helel means shining one", status: "readings", title: "son of the morning", kjv: luciferKjv.length, web: luciferWeb.length, angelVerses: 0, refs: ["Isaiah 14:12"], note: "KJV only. The verse is part of a taunt against the king of Babylon (Isaiah 14:4); Christian tradition later read it of the devil. The WEB says \"morning star\"." },
  { n: 5, name: "Satan", meaning: "Adversary", status: "readings", title: "the dragon, that old serpent, the devil", kjv: satan.kjv.total, web: satan.web.total, angelVerses: 0, refs: ["Revelation 12:9", "2 Corinthians 11:14"], note: "Never called an angel by name; Revelation 12:9 says \"his angels\" were cast out with him, and 2 Corinthians 11:14 says he poses as an angel of light." },
  { n: 6, name: "Raphael", meaning: "God has healed", status: "outside", title: "one of the seven holy angels", kjv: 0, web: 0, angelVerses: 0, refs: ["Tobit 12:15"], note: "In the Book of Tobit, part of Catholic and Orthodox Bibles; not in the KJV's 66 books or the WEB counted here." },
  { n: 7, name: "Uriel", meaning: "God is my light", status: "outside", title: "the angel sent to Ezra", kjv: 0, web: 0, angelVerses: 0, refs: ["2 Esdras 4:1", "1 Enoch 20"], note: "In 2 Esdras (Apocrypha) and 1 Enoch, which lists seven archangels; neither is in the 66 books." },
];
if (nameRows.filter((r) => r.status === "named").length !== 3) fail("named rows");

writeList("names-of-angels-in-the-bible", {
  generated: "2026-11-02",
  names: nameRows,
  kinds: kindRows.map((k) => ({ ...k, key: { ref: k.key.ref, kjv: k.key.kjv, web: k.key.web } })),
  counts: {
    namedInCanon: nameRows.filter((r) => r.status === "named").length,
    holyNamed: 2,
    angel: kinds.angel,
    angelSingular: kinds.angelSingular,
    angelPlural: kinds.angelPlural,
    cherubimsKjv,
    watcherRefs,
    michael: { all: michaelAll.length, angel: MICHAEL_ANGEL.length, men: michaelMen.length, menRefs: michaelMen },
    abaddon: { kjv: abaddonKjv, web: abaddonWeb, apollyon, place: abaddonPlace },
    satan: { kjv: satan.kjv.total, web: satan.web.total, kjvTop: satan.kjv.top },
  },
  michael: michael.map(({ kjvPhrase, webPhrase, ...v }) => v),
  gabriel: gabriel.map(({ kjvPhrase, webPhrase, ...v }) => v),
  abaddon: { ref: abaddon.ref, kjv: abaddon.kjv, web: abaddon.web },
  lucifer: { ref: lucifer.ref, kjv: lucifer.kjv, web: lucifer.web },
  satanRev: { ref: satanRev.ref, kjv: satanRev.kjv, web: satanRev.web },
  angelOfLight: { ref: angelOfLight.ref, kjv: angelOfLight.kjv, web: angelOfLight.web },
  angelOfLord: { ...angelOfLord, verses: angelOfLord.verses.map(({ kjvPhrase, webPhrase, ...v }) => v) },
});

console.log("Michael", michaelAll.length, "angel", MICHAEL_ANGEL.length, "men", michaelMen.join("; "));
console.log("Gabriel", gabrielAll.join("; "), "| Abaddon KJV", abaddonKjv, "WEB", abaddonWeb, "| Lucifer", luciferKjv);
console.log("angel(s) KJV", JSON.stringify(kinds.angel.kjv), "WEB", JSON.stringify(kinds.angel.web));
console.log("cherub KJV", kinds.cherub.kjv.total, "WEB", kinds.cherub.web.total, "(cherubims KJV", cherubimsKjv + ")", "| seraphim", kinds.seraphim.kjv.total, kinds.seraphim.web.total, "| archangel", archRefs, "| watchers", watcherRefs);
console.log("angel of the LORD KJV", JSON.stringify(angelOfLord.kjv), "WEB", JSON.stringify(angelOfLord.web), "angel of God", JSON.stringify(angelOfLord.angelOfGod));
console.log("Satan KJV", satan.kjv.total, "WEB", satan.web.total);
