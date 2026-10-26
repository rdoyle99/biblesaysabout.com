/* Are the seven deadly sins in the Bible: counts "deadly" and "deadly sin" in the KJV and WEB, counts each of the seven
   (pride, greed, lust, envy, gluttony, wrath, sloth) as a word family in both texts, reads Proverbs 6:16-19 item by item,
   counts the entries of seven New Testament vice lists from the verse text and marks which of the seven each list names.
   Every row that cites a verse is checked against that verse in BOTH translations (must / mustWeb), so a wrong reference
   or a list entry that is not in the text stops the build.
   Writes lib/data/lists/seven-deadly-sins-in-the-bible.json. Run: node scripts/lists/seven-deadly-sins-in-the-bible.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList, tokens, kjv, web } from "../lib/list-helpers.mjs";

const GENERATED = "2026-10-26";
const only = (book) => (r) => r.book === book;

/* ---------- 1. is the phrase in the Bible? ---------- */
const deadly = { kjv: countForms("kjv", ["deadly"]), web: countForms("web", ["deadly"]) };
const deadlySin = { kjv: countPhrase("kjv", /\bdeadly sins?\b/gi), web: countPhrase("web", /\bdeadly sins?\b/gi) };
const sevenDeadly = { kjv: countPhrase("kjv", /\bseven deadly\b/gi), web: countPhrase("web", /\bseven deadly\b/gi) };
if (deadlySin.kjv.total || deadlySin.web.total || sevenDeadly.kjv.total || sevenDeadly.web.total) fail("a 'deadly sin' phrase was found; the page says there is none");
// what "deadly" describes in each KJV verse: [ref, the KJV words, what it is]
const DEADLY_KJV = [
  ["1 Samuel 5:11", "a deadly destruction", "the destruction in Ekron while the ark of God was there"],
  ["Psalms 17:9", "my deadly enemies", "the psalmist's enemies"],
  ["Ezekiel 30:24", "a deadly wounded man", "Pharaoh, whose arms God breaks"],
  ["Mark 16:18", "any deadly thing", "anything believers drink"],
  ["James 3:8", "full of deadly poison", "the tongue"],
  ["Revelation 13:3", "his deadly wound was healed", "the beast's wound"],
  ["Revelation 13:12", "whose deadly wound was healed", "the beast's wound"],
];
const deadlyRows = DEADLY_KJV.map(([ref, words, what]) => {
  must(ref, words);
  return { ref, kjv: words, what, web: tokens(web.get(ref)).includes("deadly") };
});
const kjvDeadlyRefs = countPhrase("kjv", /\bdeadly\b/gi).refs;
if (kjvDeadlyRefs.join("|") !== DEADLY_KJV.map((r) => r[0]).join("|")) fail(`KJV 'deadly' verses changed: ${kjvDeadlyRefs.join("; ")}`);
const webDeadlyRefs = countPhrase("web", /\bdeadly\b/gi).refs;
// no verse that says "deadly" also says "sin", in either translation
for (const [id, refs] of [["kjv", kjvDeadlyRefs], ["web", webDeadlyRefs]]) {
  for (const ref of refs) if (tokens((id === "kjv" ? kjv : web).get(ref)).some((t) => t === "sin" || t === "sins")) fail(`${ref} (${id}) has deadly and sin together`);
}
must("1 Samuel 5:10", "the ark of God to Ekron");
must("Ezekiel 30:24", "I will break Pharaoh's arms");
must("Mark 16:18", "if they drink any deadly thing");
must("Revelation 13:3", "the beast");
must("Proverbs 8:12", "I wisdom");
must("James 3:8", "the tongue can no man tame", "an unruly evil, full of deadly poison");
mustWeb("James 3:8", "the tongue", "deadly poison");
const mortal = { kjv: countPhrase("kjv", /\b(mortal|venial|capital) sins?\b/gi).total, web: countPhrase("web", /\b(mortal|venial|capital) sins?\b/gi).total };
if (mortal.kjv || mortal.web) fail("a mortal / venial / capital sin phrase was found");

/* ---------- 2. the seven as words ---------- */
// [key, name, KJV/WEB forms counted, the noun itself, Latin-tradition note, key verse, kjv needles, web needles, verses topic slug, word slug]
const SINS = [
  {
    key: "pride", name: "Pride", forms: ["pride", "proud", "proudly"], noun: "pride",
    ref: "Proverbs 16:18", kjvNeed: ["Pride goeth before destruction", "an haughty spirit before a fall"], webNeed: ["Pride goes before destruction", "a haughty spirit before a fall"],
    topic: "pride", word: "pride",
  },
  {
    key: "greed", name: "Greed", forms: ["greed", "greedy", "greedily", "greediness", "covet", "coveted", "coveteth", "coveting", "covetings", "covetous", "covetousness"], noun: "greed",
    ref: "Luke 12:15", kjvNeed: ["beware of covetousness", "consisteth not in the abundance"], webNeed: ["Keep yourselves from covetousness", "doesn't consist of the abundance"],
    topic: "money", word: "money",
  },
  {
    key: "lust", name: "Lust", forms: ["lust", "lusts", "lusted", "lusteth", "lusting", "lustful", "lustfully", "lustfulness"], noun: "lust",
    ref: "Matthew 5:28", kjvNeed: ["looketh on a woman to lust after her"], webNeed: ["gazes at a woman to lust after her"],
    topic: "lust", word: "lust",
  },
  {
    key: "envy", name: "Envy", forms: ["envy", "envies", "envied", "enviest", "envieth", "envying", "envyings", "envious"], noun: "envy",
    ref: "Proverbs 14:30", kjvNeed: ["envy the rottenness of the bones"], webNeed: ["envy rots the bones"],
    topic: "jealousy", word: "envy",
  },
  {
    key: "gluttony", name: "Gluttony", forms: ["glutton", "gluttons", "gluttonous", "gluttony"], noun: "gluttony",
    ref: "Proverbs 23:21", kjvNeed: ["the drunkard and the glutton shall come to poverty"], webNeed: ["the drunkard and the glutton shall become poor"],
    topic: "gluttony", word: null,
  },
  {
    key: "wrath", name: "Wrath", forms: ["wrath", "wraths", "wrathful", "wroth", "anger", "angered", "angry"], noun: "wrath",
    ref: "Ephesians 4:26", kjvNeed: ["Be ye angry, and sin not", "upon your wrath"], webNeed: ["Be angry, and don't sin", "on your wrath"],
    topic: "anger", word: "wrath",
  },
  {
    key: "sloth", name: "Sloth", forms: ["sloth", "slothful", "slothfulness", "sluggard", "sluggish", "lazy", "laziness"], noun: "sloth",
    ref: "Proverbs 6:6", kjvNeed: ["Go to the ant, thou sluggard"], webNeed: ["Go to the ant, you sluggard"],
    topic: "laziness", word: null,
  },
];
const sins = SINS.map((s) => {
  const k = countForms("kjv", s.forms);
  const w = countForms("web", s.forms);
  const nounK = countForms("kjv", [s.noun]).total;
  const nounW = countForms("web", [s.noun]).total;
  const keyKjv = must(s.ref, ...s.kjvNeed);
  const keyWeb = mustWeb(s.ref, ...s.webNeed);
  // the key verse must hold a word of the family in both translations
  for (const [id, text] of [["KJV", keyKjv], ["WEB", keyWeb]]) if (!tokens(text).some((t) => s.forms.includes(t))) fail(`${s.ref} (${id}) has no word from the ${s.key} family`);
  const formsK = Object.fromEntries(s.forms.map((f) => [f, countForms("kjv", [f]).total]).filter(([, n]) => n));
  const formsW = Object.fromEntries(s.forms.map((f) => [f, countForms("web", [f]).total]).filter(([, n]) => n));
  return {
    key: s.key, name: s.name, forms: s.forms, noun: s.noun,
    kjv: { total: k.total, verses: k.verses, books: k.books, top: k.top, forms: formsK, ot: countForms("kjv", s.forms, (r) => r.testament === "OT").total },
    web: { total: w.total, verses: w.verses, books: w.books, top: w.top, forms: formsW, ot: countForms("web", s.forms, (r) => r.testament === "OT").total },
    nounKjv: nounK, nounWeb: nounW,
    proverbs: { kjv: countForms("kjv", s.forms, only("Proverbs")).total, web: countForms("web", s.forms, only("Proverbs")).total },
    ref: s.ref, keyKjv, keyWeb, topic: s.topic, word: s.word,
  };
});
const byKey = Object.fromEntries(sins.map((s) => [s.key, s]));
const nounsAbsentKjv = sins.filter((s) => s.nounKjv === 0).map((s) => s.noun);
const nounsAbsentWeb = sins.filter((s) => s.nounWeb === 0).map((s) => s.noun);
if (nounsAbsentKjv.join() !== "greed,gluttony,sloth") fail(`nouns absent from the KJV changed: ${nounsAbsentKjv}`);
if (nounsAbsentWeb.join() !== "gluttony,sloth") fail(`nouns absent from the WEB changed: ${nounsAbsentWeb}`);

// wrath split: the wrath words and the anger words, and how often the KJV ties them to God
const wrathOnly = { kjv: countForms("kjv", ["wrath", "wraths", "wrathful", "wroth"]).total, web: countForms("web", ["wrath", "wraths", "wrathful", "wroth"]).total };
const angerOnly = { kjv: countForms("kjv", ["anger", "angered", "angry"]).total, web: countForms("web", ["anger", "angered", "angry"]).total };
if (wrathOnly.kjv + angerOnly.kjv !== byKey.wrath.kjv.total) fail("wrath split does not add up (KJV)");
const angerOfTheLord = countPhrase("kjv", /\bthe anger of the LORD\b/gi); // capitals ignored, as the method says (2 verses open "The anger")
const wrathOfGod = countPhrase("kjv", /\bthe wrath of God\b/gi); // Psalms 78:31 opens "The wrath of God"
must("Numbers 11:10", "the anger of the LORD");
must("John 3:36", "the wrath of God");
// sloth: share in Proverbs
must("Proverbs 6:9", "O sluggard");
must("Ecclesiastes 10:18", "slothfulness");
// greed: the tenth commandment and 1 Timothy 6:10
const tenth = { kjv: must("Exodus 20:17", "Thou shalt not covet"), web: mustWeb("Exodus 20:17", "You shall not covet") };
const tim610 = { kjv: must("1 Timothy 6:10", "the love of money is the root of all evil"), web: mustWeb("1 Timothy 6:10", "the love of money is a root of all kinds of evil", "greed") };
// gluttony: the drunkard pairing, and Titus 1:12 where only the WEB says gluttons
must("Deuteronomy 21:20", "he is a glutton, and a drunkard");
mustWeb("Deuteronomy 21:20", "He is a glutton and a drunkard");
must("Matthew 11:19", "Behold a man gluttonous, and a winebibber");
must("Titus 1:12", "slow bellies");
mustWeb("Titus 1:12", "idle gluttons");
must("Proverbs 28:7", "a companion of riotous men");
mustWeb("Proverbs 28:7", "a companion of gluttons");
const webOnlyGlutton = countPhrase("web", /\bglutton(?:s|ous)?\b/gi).refs.filter((r) => !countPhrase("kjv", /\bglutton(?:s|ous)?\b/gi).refs.includes(r));
if (webOnlyGlutton.join("|") !== "Proverbs 28:7|Titus 1:12") fail(`WEB-only glutton verses changed: ${webOnlyGlutton}`);
must("Philippians 3:19", "whose God is their belly");
// pride: the verses that tie it to God's opposition
const prideVerses = {
  james46: { kjv: must("James 4:6", "God resisteth the proud, but giveth grace unto the humble"), web: mustWeb("James 4:6", "God resists the proud, but gives grace to the humble") },
  prov813: { kjv: must("Proverbs 8:13", "pride, and arrogancy", "do I hate"), web: mustWeb("Proverbs 8:13", "I hate pride, arrogance") },
  john216: { kjv: must("1 John 2:16", "the lust of the flesh, and the lust of the eyes, and the pride of life"), web: mustWeb("1 John 2:16", "the lust of the flesh, the lust of the eyes, and the pride of life") },
};
// envy: Proverbs 27:4 where the WEB says jealousy
must("Proverbs 27:4", "who is able to stand before envy");
mustWeb("Proverbs 27:4", "who is able to stand before jealousy");
const jealous = { kjv: countForms("kjv", ["jealous", "jealousy", "jealousies"]).total, web: countForms("web", ["jealous", "jealousy", "jealousies"]).total };

// lines quoted in the notes under each key verse
must("James 1:14", "every man is tempted, when he is drawn away of his own lust");
must("James 1:20", "the wrath of man worketh not the righteousness of God");
must("Psalms 78:18", "asking meat for their lust");
mustWeb("Psalms 78:18", "according to their desire");
must("Exodus 15:9", "my lust shall be satisfied upon them");
mustWeb("Exodus 15:9", "My desire shall be satisfied");
must("Ecclesiastes 10:18", "By much slothfulness the building decayeth");
if (byKey.wrath.web.forms.wroth) fail("the WEB now has 'wroth'");
// every KJV glutton verse pairs eating with drink
const gluttonRefs = countPhrase("kjv", /\bglutton(?:s|ous)?\b/gi).refs;
for (const ref of gluttonRefs) if (!/drunkard|winebibber/i.test(kjv.get(ref))) fail(`${ref} has a glutton word without drunkard or winebibber`);
if (gluttonRefs.length !== byKey.gluttony.kjv.verses) fail("glutton verse list does not match the count");
// the verse-level references the vice-list paragraph names
must("Mark 7:22", "pride", "lasciviousness");
mustWeb("Mark 7:22", "pride", "lustful desires");
must("Romans 1:30", "proud");
mustWeb("Romans 1:30", "haughty");
must("2 Timothy 3:2", "covetous", "proud");
mustWeb("2 Timothy 3:2", "lovers of money", "arrogant");
must("Galatians 5:20", "wrath");
mustWeb("Galatians 5:20", "outbursts of anger");
must("Galatians 5:19", "lasciviousness");
mustWeb("Galatians 5:19", "lustfulness");
// the x, x+1 pattern of Proverbs 6:16 again in Proverbs 30
must("Proverbs 30:18", "three things", "yea, four");

/* ---------- 3. Proverbs 6:16-19 ---------- */
const prov6 = {
  kjv: must("Proverbs 6:16-19", "These six things doth the LORD hate: yea, seven are an abomination unto him"),
  web: mustWeb("Proverbs 6:16-19", "There are six things which Yahweh hates; yes, seven which are an abomination to him"),
};
// [n, KJV, WEB, ref, which of the seven deadly sins the words name (by our word families), note]
const HATES = [
  [1, "A proud look", "haughty eyes", "Proverbs 6:17", "pride", "the only item that uses a word from one of the seven families (KJV \"proud\")"],
  [2, "a lying tongue", "a lying tongue", "Proverbs 6:17", null, ""],
  [3, "hands that shed innocent blood", "hands that shed innocent blood", "Proverbs 6:17", null, ""],
  [4, "An heart that deviseth wicked imaginations", "a heart that devises wicked schemes", "Proverbs 6:18", null, ""],
  [5, "feet that be swift in running to mischief", "feet that are swift in running to mischief", "Proverbs 6:18", null, ""],
  [6, "A false witness that speaketh lies", "a false witness who utters lies", "Proverbs 6:19", null, ""],
  [7, "he that soweth discord among brethren", "he who sows discord among brothers", "Proverbs 6:19", null, ""],
];
const allForms = Object.fromEntries(sins.map((s) => [s.key, s.forms]));
const familyOf = (text) => Object.entries(allForms).filter(([, f]) => tokens(text).some((t) => f.includes(t))).map(([k]) => k);
const hates = HATES.map(([n, k, w, ref, sin, note]) => {
  must(ref, k);
  mustWeb(ref, w);
  const fam = [...new Set([...familyOf(k), ...familyOf(w)])];
  if ((fam[0] || null) !== sin || fam.length > 1) fail(`Proverbs 6 item ${n}: expected ${sin}, the words give ${fam.join(",") || "none"}`);
  return { n, kjv: k, web: w, ref, sin, note };
});
if (hates.length !== 7) fail("Proverbs 6:16-19 should have seven items");
const sevenAbom = countPhrase("kjv", /\bseven abominations\b/gi);
must("Proverbs 26:25", "seven abominations in his heart");

/* ---------- 4. the New Testament vice lists ---------- */
// entries as the verse lists them, in both translations; every entry must be in the verse text
const LISTS = [
  {
    ref: "Mark 7:21-22", speaker: "Jesus", setting: "what comes out of the heart and defiles",
    kjv: ["evil thoughts", "adulteries", "fornications", "murders", "Thefts", "covetousness", "wickedness", "deceit", "lasciviousness", "an evil eye", "blasphemy", "pride", "foolishness"],
    web: ["evil thoughts", "adulteries", "sexual sins", "murders", "thefts", "covetings", "wickedness", "deceit", "lustful desires", "an evil eye", "blasphemy", "pride", "foolishness"],
  },
  {
    ref: "Romans 1:29-31", speaker: "Paul", setting: "those given over to a reprobate mind",
    kjv: ["unrighteousness", "fornication", "wickedness", "covetousness", "maliciousness", "envy", "murder", "debate", "deceit", "malignity", "whisperers", "Backbiters", "haters of God", "despiteful", "proud", "boasters", "inventors of evil things", "disobedient to parents", "Without understanding", "covenantbreakers", "without natural affection", "implacable", "unmerciful"],
    web: ["unrighteousness", "sexual immorality", "wickedness", "covetousness", "malice", "envy", "murder", "strife", "deceit", "evil habits", "secret slanderers", "backbiters", "hateful to God", "insolent", "haughty", "boastful", "inventors of evil things", "disobedient to parents", "without understanding", "covenant breakers", "without natural affection", "unforgiving", "unmerciful"],
  },
  {
    ref: "1 Corinthians 6:9-10", speaker: "Paul", setting: "who shall not inherit the kingdom of God",
    kjv: ["fornicators", "idolaters", "adulterers", "effeminate", "abusers of themselves with mankind", "thieves", "covetous", "drunkards", "revilers", "extortioners"],
    web: ["sexually immoral", "idolaters", "adulterers", "male prostitutes", "homosexuals", "thieves", "covetous", "drunkards", "slanderers", "extortionists"],
  },
  {
    ref: "Galatians 5:19-21", speaker: "Paul", setting: "the works of the flesh",
    kjv: ["Adultery", "fornication", "uncleanness", "lasciviousness", "Idolatry", "witchcraft", "hatred", "variance", "emulations", "wrath", "strife", "seditions", "heresies", "Envyings", "murders", "drunkenness", "revellings"],
    web: ["adultery", "sexual immorality", "uncleanness", "lustfulness", "idolatry", "sorcery", "hatred", "strife", "jealousies", "outbursts of anger", "rivalries", "divisions", "heresies", "envy", "murders", "drunkenness", "orgies"],
  },
  {
    ref: "Colossians 3:5", speaker: "Paul", setting: "what to put to death",
    kjv: ["fornication", "uncleanness", "inordinate affection", "evil concupiscence", "covetousness"],
    web: ["sexual immorality", "uncleanness", "depraved passion", "evil desire", "covetousness"],
  },
  {
    ref: "2 Timothy 3:2-5", speaker: "Paul", setting: "people in the last days",
    kjv: ["lovers of their own selves", "covetous", "boasters", "proud", "blasphemers", "disobedient to parents", "unthankful", "unholy", "Without natural affection", "trucebreakers", "false accusers", "incontinent", "fierce", "despisers of those that are good", "Traitors", "heady", "highminded", "lovers of pleasures more than lovers of God", "Having a form of godliness"],
    web: ["lovers of self", "lovers of money", "boastful", "arrogant", "blasphemers", "disobedient to parents", "unthankful", "unholy", "without natural affection", "unforgiving", "slanderers", "without self-control", "fierce", "not lovers of good", "traitors", "headstrong", "conceited", "lovers of pleasure rather than lovers of God", "holding a form of godliness"],
  },
  {
    ref: "Revelation 21:8", speaker: "the one on the throne", setting: "whose part is the lake of fire, the second death",
    kjv: ["the fearful", "unbelieving", "the abominable", "murderers", "whoremongers", "sorcerers", "idolaters", "all liars"],
    web: ["the cowardly", "unbelieving", "sinners", "abominable", "murderers", "sexually immoral", "sorcerers", "idolaters", "all liars"],
  },
];
const lists = LISTS.map((L) => {
  must(L.ref, ...L.kjv);
  mustWeb(L.ref, ...L.web);
  const hits = {};
  for (const s of sins) {
    const k = L.kjv.filter((e) => tokens(e).some((t) => s.forms.includes(t)));
    const w = L.web.filter((e) => tokens(e).some((t) => s.forms.includes(t)));
    if (k.length || w.length) hits[s.key] = { kjv: k, web: w };
  }
  return { ref: L.ref, speaker: L.speaker, setting: L.setting, kjv: L.kjv, web: L.web, entriesKjv: L.kjv.length, entriesWeb: L.web.length, hits };
});
// expected entry counts, so a dropped or doubled entry stops the build
const EXPECT = { "Mark 7:21-22": [13, 13], "Romans 1:29-31": [23, 23], "1 Corinthians 6:9-10": [10, 10], "Galatians 5:19-21": [17, 17], "Colossians 3:5": [5, 5], "2 Timothy 3:2-5": [19, 19], "Revelation 21:8": [8, 9] };
for (const l of lists) {
  const [k, w] = EXPECT[l.ref];
  if (l.entriesKjv !== k || l.entriesWeb !== w) fail(`${l.ref}: ${l.entriesKjv}/${l.entriesWeb} entries, expected ${k}/${w}`);
}
const totalKjv = lists.reduce((s, l) => s + l.entriesKjv, 0);
const totalWeb = lists.reduce((s, l) => s + l.entriesWeb, 0);
const matrix = sins.map((s) => {
  const inLists = lists.filter((l) => l.hits[s.key]).map((l) => l.ref);
  const kjvOnly = lists.filter((l) => l.hits[s.key] && !l.hits[s.key].web.length).map((l) => l.ref);
  const webOnly = lists.filter((l) => l.hits[s.key] && !l.hits[s.key].kjv.length).map((l) => l.ref);
  return { key: s.key, name: s.name, lists: inLists.length, refs: inLists, kjvOnly, webOnly };
});
const m = Object.fromEntries(matrix.map((r) => [r.key, r]));
if (m.greed.lists !== 5 || m.pride.lists !== 3 || m.envy.lists !== 2 || m.lust.lists !== 2 || m.wrath.lists !== 1 || m.gluttony.lists || m.sloth.lists) fail(`vice-list matrix changed: ${matrix.map((r) => r.key + " " + r.lists).join(", ")}`);
const listsWithNone = lists.filter((l) => !Object.keys(l.hits).length).map((l) => l.ref);
// Colossians 3:8, three verses on, has anger and wrath
const col38 = { kjv: must("Colossians 3:8", "anger, wrath, malice"), web: mustWeb("Colossians 3:8", "anger, wrath, malice") };
// drunkenness, the vice the lists pair with excess, is not gluttony by our families
const drunk = lists.filter((l) => l.kjv.some((e) => /drunk/i.test(e))).map((l) => l.ref);
// Galatians 5:22-23 follows the works of the flesh
const fruit = { kjv: must("Galatians 5:22-23", "But the fruit of the Spirit is love, joy, peace", "temperance"), web: mustWeb("Galatians 5:22-23", "But the fruit of the Spirit is love, joy, peace", "self-control") };
const fruitCount = 9;
mustWeb("Galatians 5:22-23", "love", "joy", "peace", "patience", "kindness", "goodness", "faith", "gentleness", "self-control");

/* ---------- 5. the sin unto death ---------- */
const john516 = {
  kjv: must("1 John 5:16-17", "There is a sin unto death", "there is a sin not unto death"),
  web: mustWeb("1 John 5:16-17", "There is a sin leading to death", "there is a sin not leading to death"),
};
const sinUntoDeath = countPhrase("kjv", /\bsin (?:which is )?(?:not )?unto death\b/gi);
const sinLeadingToDeath = countPhrase("web", /\bsin (?:not )?leading to death\b/gi);
if (sinUntoDeath.refs.join("|") !== "Romans 6:16|1 John 5:16|1 John 5:17") fail(`'sin unto death' verses changed: ${sinUntoDeath.refs}`);
must("Romans 6:16", "of sin unto death");
const john516Phrase = countPhrase("kjv", /\bsin (?:which is )?(?:not )?unto death\b/gi, (r) => r.book === "1 John");
const rom623 = { kjv: must("Romans 6:23", "the wages of sin is death"), web: mustWeb("Romans 6:23", "the wages of sin is death") };
must("Mark 3:29", "blaspheme against the Holy Ghost hath never forgiveness");

writeList("seven-deadly-sins-in-the-bible", {
  generated: GENERATED,
  deadly: {
    kjv: deadly.kjv.total, web: deadly.web.total, kjvVerses: deadly.kjv.verses, webVerses: deadly.web.verses,
    deadlySinKjv: deadlySin.kjv.total, deadlySinWeb: deadlySin.web.total, sevenDeadlyKjv: sevenDeadly.kjv.total, sevenDeadlyWeb: sevenDeadly.web.total,
    rows: deadlyRows, webRefs: webDeadlyRefs, mortalVenialCapital: mortal,
  },
  sins,
  nounsAbsentKjv, nounsAbsentWeb,
  wrath: { wrathOnly, angerOnly, angerOfTheLord: angerOfTheLord.total, wrathOfGod: wrathOfGod.total },
  jealous,
  gluttonRefs,
  tenth, tim610, prideVerses,
  prov6: { ...prov6, items: hates, overlap: hates.filter((h) => h.sin).map((h) => h.sin), sevenAbominations: sevenAbom.total },
  lists, totals: { kjv: totalKjv, web: totalWeb, lists: lists.length }, matrix, listsWithNone, drunk, col38,
  fruit: { ...fruit, count: fruitCount },
  john516: { ...john516, phraseKjv: john516Phrase.total, phraseWeb: sinLeadingToDeath.total },
  rom623,
});

console.log("deadly KJV", deadly.kjv.total, "in", deadly.kjv.verses, "verses; WEB", deadly.web.total, "| 'deadly sin(s)'", deadlySin.kjv.total, deadlySin.web.total, "| mortal/venial/capital sin", mortal.kjv, mortal.web);
for (const s of sins) console.log(s.name.padEnd(9), "KJV", s.kjv.total, `(${s.kjv.top.book} ${s.kjv.top.count}${s.kjv.top.tied.length > 1 ? " tied " + s.kjv.top.tied.join("/") : ""})`, "WEB", s.web.total, `(${s.web.top.book} ${s.web.top.count}${s.web.top.tied.length > 1 ? " tied " + s.web.top.tied.join("/") : ""})`, "noun", s.nounKjv, s.nounWeb, "Proverbs", s.proverbs.kjv, s.proverbs.web);
console.log("nouns absent KJV:", nounsAbsentKjv.join(", "), "| WEB:", nounsAbsentWeb.join(", "));
console.log("wrath words", wrathOnly, "anger words", angerOnly, "'the anger of the LORD'", angerOfTheLord.total, "'the wrath of God'", wrathOfGod.total, "| jealous family", jealous);
console.log("vice lists", lists.map((l) => `${l.ref} ${l.entriesKjv}/${l.entriesWeb}`).join("; "), "| total", totalKjv, totalWeb);
console.log("matrix", matrix.map((r) => `${r.key} ${r.lists}${r.kjvOnly.length ? " kjvOnly:" + r.kjvOnly.join("/") : ""}${r.webOnly.length ? " webOnly:" + r.webOnly.join("/") : ""}`).join(", "), "| none:", listsWithNone.join(", "));
console.log("sin unto death (KJV, 1 John)", john516Phrase.total, "| sin leading to death (WEB)", sinLeadingToDeath.total, sinLeadingToDeath.refs.join("; "));
