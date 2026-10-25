/* Gifts of the Spirit: every gift named in the five New Testament lists (Romans 12, 1 Corinthians 12 twice,
   Ephesians 4, 1 Peter 4), each wording checked against the KJV and WEB verse it comes from, grouped into distinct
   gifts by one printed rule, plus Isaiah 11:2 and counts of "gift(s)" and "spiritual gifts".
   Writes lib/data/lists/gifts-of-the-spirit.json. Run: node scripts/lists/gifts-of-the-spirit.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

// [id, title, KJV passage (checked for the whole list), WEB passage, [[group, KJV wording, WEB wording], ...]]
// group rule: two entries are one gift when the KJV uses the same word or its root (prophecy and prophets,
// teacheth and teachers, ministry and ministereth); every other entry is its own gift.
const LISTS = [
  ["rom12", "Romans 12:6-8", "Romans 12:6-8", "Romans 12:6-8", [
    ["prophecy", "prophecy", "prophecy"],
    ["ministry", "ministry", "service"],
    ["teaching", "he that teacheth", "he who teaches"],
    ["exhortation", "he that exhorteth", "he who exhorts"],
    ["giving", "he that giveth", "he who gives"],
    ["leading", "he that ruleth", "he who rules"],
    ["mercy", "he that sheweth mercy", "he who shows mercy"],
  ]],
  ["cor12a", "1 Corinthians 12:8-10", "1 Corinthians 12:8-10", "1 Corinthians 12:8-10", [
    ["wisdom", "the word of wisdom", "the word of wisdom"],
    ["knowledge", "the word of knowledge", "the word of knowledge"],
    ["faith", "faith", "faith"],
    ["healing", "the gifts of healing", "gifts of healings"],
    ["miracles", "the working of miracles", "workings of miracles"],
    ["prophecy", "prophecy", "prophecy"],
    ["discerning", "discerning of spirits", "discerning of spirits"],
    ["tongues", "divers kinds of tongues", "different kinds of languages"],
    ["interpretation", "the interpretation of tongues", "the interpretation of languages"],
  ]],
  ["cor12b", "1 Corinthians 12:28", "1 Corinthians 12:28", "1 Corinthians 12:28", [
    ["apostles", "apostles", "apostles"],
    ["prophecy", "prophets", "prophets"],
    ["teaching", "teachers", "teachers"],
    ["miracles", "miracles", "miracle workers"],
    ["healing", "gifts of healings", "gifts of healings"],
    ["helps", "helps", "helps"],
    ["governments", "governments", "governments"],
    ["tongues", "diversities of tongues", "various kinds of languages"],
  ]],
  ["eph4", "Ephesians 4:11", "Ephesians 4:11", "Ephesians 4:11", [
    ["apostles", "apostles", "apostles"],
    ["prophecy", "prophets", "prophets"],
    ["evangelists", "evangelists", "evangelists"],
    ["pastors", "pastors", "shepherds"],
    ["teaching", "teachers", "teachers"],
  ]],
  ["pet4", "1 Peter 4:10-11", "1 Peter 4:10-11", "1 Peter 4:10-11", [
    ["speaking", "If any man speak", "If anyone speaks"],
    ["ministry", "if any man minister", "If anyone serves"],
  ]],
];

const NAMES = {
  prophecy: "Prophecy", ministry: "Serving (ministry)", teaching: "Teaching", exhortation: "Exhortation (encouraging)",
  giving: "Giving", leading: "Leading (ruling)", mercy: "Showing mercy", wisdom: "Word of wisdom", knowledge: "Word of knowledge",
  faith: "Faith", healing: "Healing", miracles: "Working of miracles", discerning: "Discerning of spirits", tongues: "Tongues",
  interpretation: "Interpretation of tongues", apostles: "Apostles", helps: "Helps", governments: "Governments (administration)",
  evangelists: "Evangelists", pastors: "Pastors (shepherds)", speaking: "Speaking",
};

const lists = LISTS.map(([id, title, kref, wref, items]) => {
  for (const [g, k, w] of items) {
    if (!NAMES[g]) fail(`no name for group ${g}`);
    must(kref, k);
    mustWeb(wref, w);
  }
  return { id, title, ref: kref, items: items.map(([group, kjv, web]) => ({ group, kjv, web })) };
});

// one row per distinct gift, in order of first appearance, with the lists that name it
const order = [];
const rows = {};
for (const l of lists)
  for (const it of l.items) {
    if (!rows[it.group]) {
      rows[it.group] = { group: it.group, name: NAMES[it.group], lists: [], wordings: [] };
      order.push(it.group);
    }
    if (!rows[it.group].lists.includes(l.title)) rows[it.group].lists.push(l.title);
    rows[it.group].wordings.push({ list: l.title, kjv: it.kjv, web: it.web });
  }
const distinct = order.map((g) => rows[g]);
const entries = lists.reduce((n, l) => n + l.items.length, 0);
const inMost = [...distinct].sort((a, b) => b.lists.length - a.lists.length);

// the nine of 1 Corinthians 12:8-10, the list most people mean by "the 9 gifts of the Spirit"
const nineText = { kjv: must("1 Corinthians 12:8-10", "word of wisdom", "interpretation of tongues"), web: mustWeb("1 Corinthians 12:8-10", "word of wisdom", "interpretation of languages") };

// Isaiah 11:2, the verse behind the "seven gifts of the Holy Spirit" (Catechism of the Catholic Church 1831)
const isaiahKjv = must("Isaiah 11:2", "the spirit of wisdom and understanding", "the spirit of counsel and might", "the spirit of knowledge and of the fear of the LORD");
const isaiahWeb = mustWeb("Isaiah 11:2", "the spirit of wisdom and understanding", "the spirit of counsel and might", "the spirit of knowledge and of the fear of Yahweh");
const ISAIAH_KJV = ["wisdom", "understanding", "counsel", "might", "knowledge", "the fear of the LORD"];
const CATECHISM = ["wisdom", "understanding", "counsel", "fortitude", "knowledge", "piety", "fear of the Lord"];

// words
const words = {
  giftKjv: countForms("kjv", ["gift", "gifts"]),
  giftWeb: countForms("web", ["gift", "gifts"]),
  giftKjvNt: countForms("kjv", ["gift", "gifts"], (r) => r.testament === "NT"),
  giftWebNt: countForms("web", ["gift", "gifts"], (r) => r.testament === "NT"),
  spiritualGiftsKjv: countPhrase("kjv", /spiritual gifts?/gi),
  spiritualGiftsWeb: countPhrase("web", /spiritual gifts?/gi),
  giftsCor: countForms("kjv", ["gift", "gifts"], (r) => r.book === "1 Corinthians"),
};

const checks = {
  diversities: must("1 Corinthians 12:4", "diversities of gifts, but the same Spirit"),
  severally: must("1 Corinthians 12:11", "dividing to every man severally as he will"),
  questions: must("1 Corinthians 12:29-30", "Are all apostles", "do all interpret"),
  bestGifts: must("1 Corinthians 12:31", "covet earnestly the best gifts"),
  charity: must("1 Corinthians 13:2", "though I have the gift of prophecy", "have not charity"),
  cor141: must("1 Corinthians 14:1", "desire spiritual gifts", "rather that ye may prophesy"),
  cor121Kjv: must("1 Corinthians 12:1", "spiritual gifts"),
  cor121Web: mustWeb("1 Corinthians 12:1", "spiritual things"),
  pet410: must("1 Peter 4:10", "every man hath received the gift"),
  rom126: must("Romans 12:6", "gifts differing according to the grace"),
  eph48: must("Ephesians 4:8", "gave gifts unto men"),
  fruit: must("Galatians 5:22", "the fruit of the Spirit is love"),
  acts238: must("Acts 2:38", "the gift of the Holy Ghost"),
  isaiah113: must("Isaiah 11:3", "fear of the LORD"),
  rom111: must("Romans 1:11", "some spiritual gift,"),
  bribe: must("Ecclesiastes 7:7", "a gift destroyeth the heart"),
};
// the page says the singular "spiritual gift" is only in Romans 1:11
if (countPhrase("kjv", /spiritual gift\b/gi).refs.join() !== "Romans 1:11") fail("singular spiritual gift is no longer only Romans 1:11");

if (distinct.length < 18) fail(`only ${distinct.length} distinct gifts`);
if (lists.find((l) => l.id === "cor12a").items.length !== 9) fail("1 Corinthians 12:8-10 should list nine");

writeList("gifts-of-the-spirit", {
  generated: "2026-10-25",
  lists,
  distinct,
  entries,
  nineText,
  isaiah: { kjv: isaiahKjv, web: isaiahWeb, kjvList: ISAIAH_KJV, catechism: CATECHISM },
  words,
  checks: Object.keys(checks),
});

console.log(`lists ${lists.map((l) => `${l.title} ${l.items.length}`).join(" | ")}; entries ${entries}; distinct ${distinct.length}`);
console.log("in most lists:", inMost.slice(0, 6).map((r) => `${r.name} ${r.lists.length}`).join(", "));
console.log("gift(s) KJV", words.giftKjv.total, "NT", words.giftKjvNt.total, "| WEB", words.giftWeb.total, "NT", words.giftWebNt.total, "| 1 Cor KJV", words.giftsCor.total);
console.log("spiritual gift(s) KJV", words.spiritualGiftsKjv.refs.join(", "), "| WEB", words.spiritualGiftsWeb.refs.join(", "));
