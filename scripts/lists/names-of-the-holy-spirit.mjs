#!/usr/bin/env node
/**
 * Names and titles of the Holy Spirit: how often each phrase appears in the KJV and the WEB, Old and New Testament, a
 * checked key verse in each translation, plus Holy Ghost vs Holy Spirit, "ghost" outside "Holy Ghost", capital Spirit vs
 * lower-case spirit, the Comforter verses, the seven Spirits of Revelation and the pictures the Bible uses for the Spirit.
 *
 *   node scripts/lists/names-of-the-holy-spirit.mjs     # writes lib/data/lists/names-of-the-holy-spirit.json
 *
 * Rules: a name is a regex over normalised verse text (curly apostrophes made straight), counted once per occurrence.
 * Matching ignores capitals unless a row says capitals decide ("the Spirit" standing alone, "seven Spirits"). Where the
 * WEB words a name differently (God's Spirit, Yahweh's Spirit, Counselor, promised Holy Spirit) the WEB column counts the
 * WEB's own wording, given in the row. Each row's key verse is checked against both texts and must be among the counted
 * KJV verses. The page prints numbers only from this file's JSON; EXPECT below stops the build if the headline counts move.
 */
import fs from "fs";
import path from "path";
import { kjv, web, must, mustWeb, ROWS, norm, fail, writeList, countPhrase, root } from "../lib/list-helpers.mjs";

const BIBLE = { kjv, web };

/* the headline numbers as the page copy states them; the build stops if the text gives anything else */
const EXPECT = { holyGhostKjv: 90, holySpiritKjv: 7, holySpiritKjvOT: 3, holySpiritWeb: 96, holyGhostWeb: 0, rows: 27 };

/** count a regex in one translation, whole Bible or one testament, optional book list */
function count(id, re, { scope = null, books = null } = {}) {
  let total = 0;
  let ot = 0;
  let nt = 0;
  let lower = 0;
  const refs = [];
  const byBook = new Map();
  for (const r of ROWS[id]) {
    if ((scope && r.testament !== scope) || (books && !books.includes(r.book))) continue;
    const m = norm(r.text).match(new RegExp(re.source, re.flags)) || [];
    if (!m.length) continue;
    total += m.length;
    if (r.testament === "OT") ot += m.length;
    else nt += m.length;
    lower += m.filter((s) => /\bspirit/.test(s)).length;
    refs.push(r.ref);
    byBook.set(r.book, (byBook.get(r.book) || 0) + m.length);
  }
  const top = [...byBook.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const tied = [...byBook.entries()].filter(([, n]) => n === top[1]).map(([b]) => b);
  return { total, ot, nt, lower, verses: refs.length, first: refs[0] || null, top: { book: top[0], count: top[1], tied }, refs };
}

/*
 * name: the name as the KJV prints it. re: the KJV regex (webRe for the WEB if it words it differently).
 * key: [ref, ...KJV needles]; keyWeb: [ref, ...WEB needles] (same ref). readings: true where the verse does not itself say
 * whose spirit it is and readers differ on whether it names the Holy Spirit.
 */
const DEFS = [
  { name: "the Holy Ghost (Holy Spirit)", kjvPhrase: "the Holy Ghost; the Holy Spirit", webPhrase: "the Holy Spirit", re: /\bHoly (?:Ghost|Spirit)\b/gi, webRe: /\bHoly Spirit\b/gi,
    key: ["Matthew 28:19", "in the name of the Father, and of the Son, and of the Holy Ghost"], keyWeb: ["Matthew 28:19", "of the Son and of the Holy Spirit"],
    note: "The KJV column adds its Holy Ghost and Holy Spirit together; the split is in the section below. Psalm 51:11 (\"thy holy spirit\") is counted though the KJV prints both words in lower case." },
  { name: "the Spirit of God", kjvPhrase: "the Spirit of God", webPhrase: "the Spirit of God; God's Spirit", re: /\bSpirit of God\b/gi, webRe: /\b(?:Spirit of God|God's Spirit)\b/gi,
    key: ["Genesis 1:2", "the Spirit of God moved upon the face of the waters"], keyWeb: ["Genesis 1:2", "God's Spirit was hovering over the surface of the waters"],
    note: "Includes \"the holy Spirit of God\" (Ephesians 4:30). Raw count: Job 27:3, \"the spirit of God is in my nostrils\", is counted. \"Spirits of God\" (Revelation) is not." },
  { name: "the Spirit of the LORD", kjvPhrase: "the Spirit of the LORD; the Spirit of the Lord", webPhrase: "Yahweh's Spirit; the Spirit of the Lord", re: /\bSpirit of the Lord\b/gi, webRe: /\b(?:Spirit of the Lord|Spirit of Yahweh|Yahweh's Spirit)\b/gi,
    key: ["Judges 3:10", "the Spirit of the LORD came upon him"], keyWeb: ["Judges 3:10", "Yahweh's Spirit came on him"],
    note: "Where the KJV prints LORD in capitals the WEB prints Yahweh. Includes \"the Spirit of the Lord GOD\" (Isaiah 61:1). Raw count: Isaiah 40:7, \"the spirit of the LORD bloweth upon it\", is counted in the KJV; the WEB reads \"Yahweh's breath\" there." },
  { name: "the Spirit", kjvPhrase: "the Spirit", re: /\bthe Spirit\b(?! of\b)/g, caps: true,
    key: ["Acts 16:7", "but the Spirit suffered them not"], keyWeb: ["Acts 16:7", "but the Spirit didn't allow them"],
    note: "\"The Spirit\" standing alone, with a capital S and not followed by \"of\". The WEB prints the capital in more verses, including Old Testament ones (Numbers 11:25)." },
  { name: "the Spirit of Christ", kjvPhrase: "the Spirit of Christ", re: /\bSpirit of Christ\b/gi, key: ["Romans 8:9", "have not the Spirit of Christ"], keyWeb: ["Romans 8:9", "have the Spirit of Christ"],
    note: "Romans 8:9 uses \"the Spirit of God\" and \"the Spirit of Christ\" in one sentence. The other verse is 1 Peter 1:11." },
  { name: "the Spirit of Jesus Christ", kjvPhrase: "the Spirit of Jesus Christ", re: /\bSpirit of Jesus Christ\b/gi, key: ["Philippians 1:19", "the supply of the Spirit of Jesus Christ"], keyWeb: ["Philippians 1:19", "the supply of the Spirit of Jesus Christ"],
    note: "The only verse in either translation with \"Spirit of Jesus\"." },
  { name: "the Spirit of his Son", kjvPhrase: "the Spirit of his Son", re: /\bSpirit of his Son\b/gi, key: ["Galatians 4:6", "God hath sent forth the Spirit of his Son into your hearts"], keyWeb: ["Galatians 4:6", "God sent out the Spirit of his Son into your hearts"],
    note: "The same verse has the cry \"Abba, Father\", as Romans 8:15 does with the Spirit of adoption." },
  { name: "the Spirit of your Father", kjvPhrase: "the Spirit of your Father", re: /\bSpirit of your Father\b/gi, key: ["Matthew 10:20", "the Spirit of your Father which speaketh in you"], keyWeb: ["Matthew 10:20", "the Spirit of your Father who speaks in you"],
    note: "Said by Jesus when he sends out the twelve." },
  { name: "the Spirit of the living God", kjvPhrase: "the Spirit of the living God", re: /\bSpirit of the living God\b/gi, key: ["2 Corinthians 3:3", "written not with ink, but with the Spirit of the living God"], keyWeb: ["2 Corinthians 3:3", "with the Spirit of the living God"],
    note: "Paul sets it against ink and \"tables of stone\"." },
  { name: "the Spirit of our God", kjvPhrase: "the Spirit of our God", re: /\bSpirit of our God\b/gi, key: ["1 Corinthians 6:11", "by the Spirit of our God"], keyWeb: ["1 Corinthians 6:11", "in the Spirit of our God"],
    note: "Paired with \"the name of the Lord Jesus\" in the same clause." },
  { name: "the Spirit of truth", kjvPhrase: "the Spirit of truth", re: /\bSpirit of truth\b/gi, key: ["John 14:17", "Even the Spirit of truth"], keyWeb: ["John 14:17", "the Spirit of truth, whom the world can't receive"],
    note: "Three times in John 14 to 16, each beside the Comforter, and once in 1 John 4:6, printed lower case there against \"the spirit of error\"." },
  { name: "the Comforter", kjvPhrase: "the Comforter", webPhrase: "the Counselor", re: /\bComforter\b/g, webRe: /\bCounselor\b/g, books: ["John"],
    key: ["John 14:26", "the Comforter, which is the Holy Ghost"], keyWeb: ["John 14:26", "the Counselor, the Holy Spirit"],
    note: "Counted in John's Gospel only: the KJV's other Comforter verses (Ecclesiastes 4:1, Lamentations 1:9, 1:16) are about a human comforter. The same Greek word is \"advocate\" (KJV) and \"Counselor\" (WEB) in 1 John 2:1, used of Jesus Christ." },
  { name: "the Spirit of adoption", kjvPhrase: "the Spirit of adoption", re: /\bSpirit of adoption\b/gi, key: ["Romans 8:15", "ye have received the Spirit of adoption, whereby we cry, Abba, Father"], keyWeb: ["Romans 8:15", "you received the Spirit of adoption"],
    note: "Set against \"the spirit of bondage\" earlier in the verse." },
  { name: "the Spirit of life", kjvPhrase: "the Spirit of life", re: /\bSpirit of life\b/gi, key: ["Romans 8:2", "the law of the Spirit of life in Christ Jesus"], keyWeb: ["Romans 8:2", "the law of the Spirit of life in Christ Jesus"],
    note: "Raw count: the KJV's second is Revelation 11:11 (\"the Spirit of life from God\", WEB \"the breath of life\"); the WEB's second is Genesis 7:22 (\"the breath of the spirit of life\", KJV \"the breath of life\")." },
  { name: "the spirit of holiness", kjvPhrase: "the spirit of holiness", re: /\bspirit of holiness\b/gi, readings: true, key: ["Romans 1:4", "according to the spirit of holiness"], keyWeb: ["Romans 1:4", "according to the Spirit of holiness"],
    note: "The KJV prints spirit in lower case, the WEB with a capital. Readers differ on whether it names the Holy Spirit or describes Christ." },
  { name: "the holy Spirit of promise", kjvPhrase: "that holy Spirit of promise", webPhrase: "the promised Holy Spirit", re: /\bholy Spirit of promise\b/gi, webRe: /\bpromised Holy Spirit\b/gi,
    key: ["Ephesians 1:13", "ye were sealed with that holy Spirit of promise"], keyWeb: ["Ephesians 1:13", "you were sealed with the promised Holy Spirit"],
    note: "One of the KJV's seven \"Holy Spirit\" verses, so it is also in the first row." },
  { name: "the eternal Spirit", kjvPhrase: "the eternal Spirit", re: /\beternal Spirit\b/gi, key: ["Hebrews 9:14", "who through the eternal Spirit offered himself without spot to God"], keyWeb: ["Hebrews 9:14", "who through the eternal Spirit offered himself"],
    note: "The only verse with the phrase in either translation." },
  { name: "the Spirit of grace", kjvPhrase: "the Spirit of grace", re: /\bSpirit of grace\b/gi, scope: "NT", key: ["Hebrews 10:29", "hath done despite unto the Spirit of grace"], keyWeb: ["Hebrews 10:29", "has insulted the Spirit of grace"],
    note: "New Testament only; Zechariah 12:10 has its own row below." },
  { name: "the spirit of glory", kjvPhrase: "the spirit of glory and of God", re: /\bspirit of glory\b/gi, key: ["1 Peter 4:14", "the spirit of glory and of God resteth upon you"], keyWeb: ["1 Peter 4:14", "the Spirit of glory and of God rests on you"],
    note: "Lower case in the KJV, capital in the WEB." },
  { name: "the spirit of wisdom and revelation", kjvPhrase: "the spirit of wisdom and revelation", webPhrase: "a spirit of wisdom and revelation", re: /\bspirit of wisdom and revelation\b/gi, readings: true,
    key: ["Ephesians 1:17", "may give unto you the spirit of wisdom and revelation"], keyWeb: ["Ephesians 1:17", "may give to you a spirit of wisdom and revelation"],
    note: "Lower case in both translations. Readers differ on whether Paul prays for the Holy Spirit or for a wise frame of mind." },
  { name: "thy good spirit", kjvPhrase: "thy good spirit", webPhrase: "your good Spirit", re: /\bgood spirit\b/gi, key: ["Nehemiah 9:20", "Thou gavest also thy good spirit to instruct them"], keyWeb: ["Nehemiah 9:20", "You gave also your good Spirit to instruct them"],
    note: "Said to God in the Levites' prayer about the wilderness years. Lower case in the KJV, capital in the WEB." },
  { name: "the spirit of wisdom and understanding", kjvPhrase: "the spirit of wisdom and understanding", re: /\bspirit of wisdom and understanding\b/gi,
    key: ["Isaiah 11:2", "the spirit of the LORD shall rest upon him, the spirit of wisdom and understanding"], keyWeb: ["Isaiah 11:2", "Yahweh's Spirit will rest on him: the spirit of wisdom and understanding"],
    note: "Isaiah 11:2 names the spirit of the LORD and then three pairs; this row and the next two are those pairs. Exodus 28:3 and Deuteronomy 34:9 have \"spirit of wisdom\" without the pair." },
  { name: "the spirit of counsel and might", kjvPhrase: "the spirit of counsel and might", re: /\bspirit of counsel and might\b/gi, key: ["Isaiah 11:2", "the spirit of counsel and might"], keyWeb: ["Isaiah 11:2", "the spirit of counsel and might"],
    note: "Isaiah 11:2 only." },
  { name: "the spirit of knowledge and of the fear of the LORD", kjvPhrase: "the spirit of knowledge and of the fear of the LORD", webPhrase: "the spirit of knowledge and of the fear of Yahweh", re: /\bspirit of knowledge\b/gi,
    key: ["Isaiah 11:2", "the spirit of knowledge and of the fear of the LORD"], keyWeb: ["Isaiah 11:2", "the spirit of knowledge and of the fear of Yahweh"],
    note: "Isaiah 11:2 only. Counted as \"spirit of knowledge\"." },
  { name: "the spirit of judgment and the spirit of burning", kjvPhrase: "the spirit of judgment, and ... the spirit of burning", webPhrase: "the spirit of justice, and ... the spirit of burning", re: /\bspirit of burning\b/gi, readings: true,
    key: ["Isaiah 4:4", "by the spirit of judgment, and by the spirit of burning"], keyWeb: ["Isaiah 4:4", "by the spirit of justice, and by the spirit of burning"],
    note: "Counted as \"spirit of burning\". The verse does not say whose spirit; readers differ on whether it names God's Spirit." },
  { name: "the spirit of grace and of supplications", kjvPhrase: "the spirit of grace and of supplications", webPhrase: "the spirit of grace and of supplication", re: /\bspirit of grace and of supplications?\b/gi, readings: true,
    key: ["Zechariah 12:10", "I will pour upon the house of David", "the spirit of grace and of supplications"], keyWeb: ["Zechariah 12:10", "the spirit of grace and of supplication"],
    note: "God says \"I will pour\" it out. The verse does not say whose spirit; readers differ on whether it names God's Spirit." },
  { name: "the seven Spirits of God", kjvPhrase: "the seven Spirits", re: /\bseven Spirits\b/g, caps: true, readings: true,
    key: ["Revelation 1:4", "from the seven Spirits which are before his throne"], keyWeb: ["Revelation 1:4", "from the seven Spirits who are before his throne"],
    note: "Revelation 1:4, 3:1, 4:5 and 5:6, always with a capital S in both translations. Readings are described in the section below." },
];
if (DEFS.length !== EXPECT.rows) fail(`expected ${EXPECT.rows} rows, have ${DEFS.length}`);

/* checks for verses the notes cite */
must("Ephesians 4:30", "grieve not the holy Spirit of God");
mustWeb("Ephesians 4:30", "the Holy Spirit of God");
must("Job 27:3", "the spirit of God is in my nostrils");
must("Isaiah 61:1", "The Spirit of the Lord GOD is upon me");
mustWeb("Isaiah 61:1", "The Lord Yahweh's Spirit is on me");
must("Isaiah 40:7", "the spirit of the LORD bloweth upon it");
mustWeb("Isaiah 40:7", "Yahweh's breath blows on it");
mustWeb("Numbers 11:25", "the Spirit that was on him");
must("Numbers 11:25", "the spirit that was upon him");
must("Romans 8:9", "if so be that the Spirit of God dwell in you");
must("1 Peter 1:11", "the Spirit of Christ which was in them");
if (countPhrase("kjv", /\bSpirit of Jesus\b/gi).refs.join() !== "Philippians 1:19" || countPhrase("web", /\bSpirit of Jesus\b/gi).refs.join() !== "Philippians 1:19") fail("Spirit of Jesus outside Philippians 1:19");
must("Galatians 4:6", "crying, Abba, Father");
must("Matthew 10:5", "These twelve Jesus sent forth");
must("2 Corinthians 3:3", "not in tables of stone");
must("1 Corinthians 6:11", "in the name of the Lord Jesus");
must("1 John 4:6", "the spirit of truth, and the spirit of error");
must("Ecclesiastes 4:1", "they had no comforter");
must("Lamentations 1:9", "she had no comforter");
must("Lamentations 1:16", "the comforter that should relieve my soul is far from me");
must("1 John 2:1", "we have an advocate with the Father, Jesus Christ the righteous");
mustWeb("1 John 2:1", "we have a Counselor with the Father, Jesus Christ, the righteous");
must("Romans 8:15", "the spirit of bondage");
must("Revelation 11:11", "the Spirit of life from God entered into them");
mustWeb("Revelation 11:11", "the breath of life from God entered into them");
mustWeb("Genesis 7:22", "the breath of the spirit of life");
must("Genesis 7:22", "the breath of life");
must("Exodus 28:3", "the spirit of wisdom");
must("Deuteronomy 34:9", "the spirit of wisdom");
must("Nehemiah 9:21", "forty years");
for (const r of ["Revelation 3:1", "Revelation 4:5", "Revelation 5:6"]) { must(r, "seven Spirits of God"); mustWeb(r, "seven Spirits of God"); }

const strip = ({ refs, ...rest }) => rest;
const rows = DEFS.map((d, i) => {
  const opts = { scope: d.scope || null, books: d.books || null };
  const k = count("kjv", d.re, opts);
  const w = count("web", d.webRe || d.re, opts);
  const kjvText = must(d.key[0], ...d.key.slice(1));
  if (d.keyWeb[0] !== d.key[0]) fail(`${d.name}: KJV and WEB key verses differ`);
  const webText = mustWeb(d.keyWeb[0], ...d.keyWeb.slice(1));
  if (!k.refs.includes(d.key[0])) fail(`${d.name}: key verse ${d.key[0]} is not among the counted KJV verses`);
  if (!w.refs.includes(d.key[0])) fail(`${d.name}: key verse ${d.key[0]} is not among the counted WEB verses`);
  if (!k.total || !w.total) fail(`${d.name}: zero count`);
  const testament = k.ot && k.nt ? "Both" : k.ot ? "OT" : "NT";
  return {
    n: i + 1, name: d.name, kjvPhrase: d.kjvPhrase, webPhrase: d.webPhrase || null, testament, readings: !!d.readings, scope: d.scope || null, books: d.books || null,
    kjv: strip(k), web: strip(w), kjvRefs: k.refs.length <= 6 ? k.refs : null, webRefs: w.refs.length <= 6 ? w.refs : null,
    key: d.key[0], kjvText, webText, note: d.note, _kr: k.refs, _wr: w.refs,
  };
});
const R = (name) => rows.find((r) => r.name === name) || fail(`no row ${name}`);

/* row-specific checks on the counting rules */
if (R("the Spirit of truth")._kr.join() !== "John 14:17,John 15:26,John 16:13,1 John 4:6") fail("Spirit of truth verses moved");
if (R("the Comforter")._kr.join() !== "John 14:16,John 14:26,John 15:26,John 16:7") fail(`Comforter verses ${R("the Comforter")._kr}`);
if (R("the Comforter")._wr.join() !== R("the Comforter")._kr.join()) fail("WEB Counselor verses differ from KJV Comforter verses in John");
const comforterAll = countPhrase("kjv", /\bComforter\b/gi).refs.filter((r) => !r.startsWith("John "));
if (comforterAll.join() !== "Ecclesiastes 4:1,Lamentations 1:9,Lamentations 1:16") fail(`Comforter outside John: ${comforterAll}`);
if (R("the Spirit of life")._kr.join() !== "Romans 8:2,Revelation 11:11") fail("KJV Spirit of life verses");
if (R("the Spirit of life")._wr.join() !== "Genesis 7:22,Romans 8:2") fail("WEB Spirit of life verses");
if (R("the seven Spirits of God")._kr.join() !== "Revelation 1:4,Revelation 3:1,Revelation 4:5,Revelation 5:6") fail("seven Spirits verses");
if (R("the seven Spirits of God")._wr.join() !== R("the seven Spirits of God")._kr.join()) fail("WEB seven Spirits verses differ");
if (countPhrase("kjv", /\bseven spirits\b/gi).total !== 4) fail("lower-case seven spirits in the KJV");
if (R("the Spirit of grace").kjv.total !== 1) fail("Spirit of grace NT count");
for (const nm of ["the spirit of wisdom and understanding", "the spirit of counsel and might", "the spirit of knowledge and of the fear of the LORD"]) if (R(nm)._kr.join() !== "Isaiah 11:2" || R(nm)._wr.join() !== "Isaiah 11:2") fail(`${nm} outside Isaiah 11:2`);
if (R("the Spirit")._kr.some((r) => !/^\w/.test(r))) fail("bad ref");

/* Holy Ghost vs Holy Spirit */
const hgK = count("kjv", /\bHoly Ghost\b/gi);
const hsK = count("kjv", /\bHoly Spirit\b/gi);
const hsW = count("web", /\bHoly Spirit\b/gi);
const hgW = count("web", /\bHoly Ghost\b/gi);
const got = { holyGhostKjv: hgK.total, holySpiritKjv: hsK.total, holySpiritKjvOT: hsK.ot, holySpiritWeb: hsW.total, holyGhostWeb: hgW.total };
for (const [k, v] of Object.entries(got)) if (EXPECT[k] !== v) fail(`${k}: page copy says ${EXPECT[k]}, the text gives ${v}`);
if (hgK.ot) fail("Holy Ghost in the KJV Old Testament");
if (R("the Holy Ghost (Holy Spirit)").kjv.total !== hgK.total + hsK.total) fail("first row is not Holy Ghost + Holy Spirit");
for (const r of hsK.refs) must(r, "spirit");
/* the word page /words/holy-spirit counts the same thing: keep the two pages in step */
const wordsJson = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-words.json"), "utf8"));
const wp = wordsJson.words.find((w) => w.slug === "holy-spirit");
if (!wp) fail("no holy-spirit word page");
if (wp.kjv.byForm["holy ghost"] !== hgK.total || wp.kjv.byForm["holy spirit"] !== hsK.total || wp.web.total !== hsW.total) fail(`word page holy-spirit disagrees: ${JSON.stringify(wp.kjv.byForm)} WEB ${wp.web.total}`);
const kjvOnly = hgK.refs.concat(hsK.refs).filter((r) => !hsW.refs.includes(r));
const webOnly = hsW.refs.filter((r) => !hgK.refs.includes(r) && !hsK.refs.includes(r));
if (kjvOnly.join() !== "Matthew 12:31,1 John 5:7") fail(`KJV-only Holy Ghost verses ${kjvOnly}`);
if (webOnly.join() !== "Luke 10:21") fail(`WEB-only Holy Spirit verses ${webOnly}`);
must("Matthew 12:31", "the blasphemy against the Holy Ghost");
mustWeb("Matthew 12:31", "the blasphemy against the Spirit");
must("1 John 5:7", "the Father, the Word, and the Holy Ghost");
mustWeb("1 John 5:7", "For there are three who testify");
must("Luke 10:21", "Jesus rejoiced in spirit");
mustWeb("Luke 10:21", "Jesus rejoiced in the Holy Spirit");
must("Luke 11:13", "give the Holy Spirit to them that ask him");
must("Psalms 51:11", "take not thy holy spirit from me");
must("Isaiah 63:10", "vexed his holy Spirit");
must("Isaiah 63:11", "put his holy Spirit within him");
must("1 Thessalonians 4:8", "given unto us his holy Spirit");
const acts192 = (norm(kjv.get("Acts 19:2")).match(/Holy Ghost/g) || []).length;
if (acts192 !== 2) fail("Acts 19:2 should have Holy Ghost twice");
const hgTopBook = hgK.top;

/* "ghost" outside "Holy Ghost": in the KJV every other use is about dying; the WEB's two uses are a phantom */
const ghostK = count("kjv", /\bghost\b/gi);
const dyingRe = /\bup (?:of )?the ghost\b/gi;
const dying = count("kjv", dyingRe);
const otherGhost = ghostK.total - hgK.total;
if (otherGhost !== dying.total) fail(`KJV ghost outside Holy Ghost ${otherGhost} vs giving up the ghost ${dying.total}`);
const ghostW = count("web", /\bghost\b/gi);
if (ghostW.refs.join() !== "Matthew 14:26,Mark 6:49") fail(`WEB ghost verses ${ghostW.refs}`);
must("Matthew 14:26", "It is a spirit");
mustWeb("Matthew 14:26", "It's a ghost");
must("Mark 6:49", "supposed it had been a spirit");
mustWeb("Mark 6:49", "supposed that it was a ghost");
must("Matthew 27:50", "yielded up the ghost");
mustWeb("Matthew 27:50", "yielded up his spirit");
must("Genesis 25:8", "Abraham gave up the ghost");
mustWeb("Genesis 25:8", "Abraham gave up his spirit");
must("Job 11:20", "the giving up of the ghost");

/* capital Spirit vs lower-case spirit (singular), and verses where only the WEB capitalises */
const caps = {
  kjv: { cap: countPhrase("kjv", /\bSpirit\b/g).total, lower: countPhrase("kjv", /\bspirit\b/g).total },
  web: { cap: countPhrase("web", /\bSpirit\b/g).total, lower: countPhrase("web", /\bspirit\b/g).total },
};
let webCapOnly = 0;
let kjvCapOnly = 0;
const webCapOnlyOT = { n: 0 };
for (const r of ROWS.web) {
  const kt = norm(kjv.get(r.ref) || "");
  if (!kt) continue;
  const wCap = /\bSpirit\b/.test(norm(r.text));
  const kCap = /\bSpirit\b/.test(kt);
  if (wCap && !kCap && /\bspirit\b/.test(kt)) {
    webCapOnly++;
    if (r.testament === "OT") webCapOnlyOT.n++;
  }
  if (kCap && !wCap && /\bspirit\b/.test(norm(r.text))) kjvCapOnly++;
}
must("Joel 2:28", "I will pour out my spirit upon all flesh");
must("Acts 2:17", "I will pour out of my Spirit upon all flesh");
mustWeb("Joel 2:28", "I will pour out my Spirit on all flesh");
mustWeb("Acts 2:17", "I will pour out my Spirit on all flesh");
must("Genesis 6:3", "My spirit shall not always strive with man");
mustWeb("Genesis 6:3", "My Spirit will not strive with man forever");
const mySpirit = { kjv: countPhrase("kjv", /\bmy Spirit\b/g), web: countPhrase("web", /\bmy Spirit\b/g) };

/* Old and New Testament */
const byTestament = { OT: rows.filter((r) => r.testament === "OT").length, NT: rows.filter((r) => r.testament === "NT").length, Both: rows.filter((r) => r.testament === "Both").length };
const sog = R("the Spirit of God");
const sol = R("the Spirit of the LORD");

/* symbols: verses where the Bible sets the Spirit beside a picture, checked in both texts */
const SYMBOLS = [
  { symbol: "Dove", word: "dove", verses: [
    { ref: "Matthew 3:16", kjv: ["the Spirit of God descending like a dove"], web: ["the Spirit of God descending as a dove"] },
    { ref: "Luke 3:22", kjv: ["the Holy Ghost descended in a bodily shape like a dove"], web: ["the Holy Spirit descended in a bodily form like a dove"] },
  ], text: "At the baptism of Jesus. All four Gospels tell it (Mark 1:10, John 1:32), and these four are the only New Testament verses with \"dove\" in the singular, in either translation." },
  { symbol: "Fire", word: "fire", verses: [
    { ref: "Acts 2:3", kjv: ["cloven tongues like as of fire"], web: ["Tongues like fire appeared"] },
    { ref: "Luke 3:16", kjv: ["he shall baptize you with the Holy Ghost and with fire"], web: ["He will baptize you in the Holy Spirit and fire"] },
  ], text: "Tongues \"like as of fire\" sit on each disciple at Pentecost (Acts 2:3-4). John the Baptist pairs the Holy Ghost with fire; the KJV has the pair in Matthew 3:11 as well, where the WEB has the Holy Spirit alone. Revelation 4:5 calls seven lamps of fire \"the seven Spirits of God\"." },
  { symbol: "Wind", word: "wind", verses: [
    { ref: "John 3:8", kjv: ["The wind bloweth where it listeth", "so is every one that is born of the Spirit"], web: ["The wind blows where it wants to", "So is everyone who is born of the Spirit"] },
    { ref: "Acts 2:2", kjv: ["a rushing mighty wind"], web: ["the rushing of a mighty wind"] },
  ], text: "Jesus compares the Spirit to the wind in John 3:8; the sound \"as of a rushing mighty wind\" comes just before the believers are \"filled with the Holy Ghost\" (Acts 2:4)." },
  { symbol: "Breath", word: null, verses: [
    { ref: "John 20:22", kjv: ["he breathed on them, and saith unto them, Receive ye the Holy Ghost"], web: ["he breathed on them, and said to them", "Receive the Holy Spirit"] },
    { ref: "Job 33:4", kjv: ["The Spirit of God hath made me, and the breath of the Almighty hath given me life"], web: ["The Spirit of God has made me, and the breath of the Almighty gives me life"] },
  ], text: "Jesus breathes on the disciples as he gives the Spirit. Job sets \"the Spirit of God\" and \"the breath of the Almighty\" side by side." },
  { symbol: "Water", word: "water", verses: [
    { ref: "John 7:38", kjv: ["out of his belly shall flow rivers of living water"], web: ["from within him will flow rivers of living water"] },
    { ref: "John 7:39", kjv: ["But this spake he of the Spirit"], web: ["But he said this about the Spirit"] },
    { ref: "Isaiah 44:3", kjv: ["I will pour water upon him that is thirsty", "I will pour my spirit upon thy seed"], web: ["I will pour water on him who is thirsty", "I will pour my Spirit on your descendants"] },
  ], text: "John explains the \"rivers of living water\" as the Spirit. Isaiah 44:3 sets pouring water and pouring God's spirit in one verse." },
  { symbol: "Oil and anointing", word: "oil", verses: [
    { ref: "Acts 10:38", kjv: ["God anointed Jesus of Nazareth with the Holy Ghost and with power"], web: ["God anointed him with the Holy Spirit and with power"] },
    { ref: "1 John 2:27", kjv: ["the anointing which ye have received of him abideth in you"], web: ["the anointing which you received from him remains in you"] },
    { ref: "1 Samuel 16:13", kjv: ["Samuel took the horn of oil, and anointed him", "the Spirit of the LORD came upon David from that day forward"], web: ["Samuel took the horn of oil, and anointed him", "Yahweh's Spirit came mightily on David from that day forward"] },
  ], text: "Samuel anoints David with oil, and the Spirit of the LORD comes on him \"from that day forward\". In the New Testament the anointing is with the Holy Ghost itself (Acts 10:38; Luke 4:18 quoting Isaiah 61:1). 1 John 2:20 has \"an unction from the Holy One\" (WEB \"an anointing\")." },
  { symbol: "Seal", word: null, verses: [
    { ref: "Ephesians 1:13", kjv: ["ye were sealed with that holy Spirit of promise"], web: ["you were sealed with the promised Holy Spirit"] },
    { ref: "Ephesians 4:30", kjv: ["whereby ye are sealed unto the day of redemption"], web: ["in whom you were sealed for the day of redemption"] },
  ], text: "Paul says believers are sealed with the Spirit. 2 Corinthians 1:22 also says God \"hath also sealed us\"." },
  { symbol: "Earnest (down payment)", word: null, verses: [
    { ref: "2 Corinthians 1:22", kjv: ["Who hath also sealed us, and given the earnest of the Spirit in our hearts"], web: ["who also sealed us, and gave us the down payment of the Spirit in our hearts"] },
    { ref: "2 Corinthians 5:5", kjv: ["the earnest of the Spirit"], web: ["the down payment of the Spirit"] },
  ], text: "\"Earnest\" is the KJV's word for a deposit that promises the rest; the WEB says \"down payment\". Ephesians 1:14 calls the Spirit \"the earnest of our inheritance\" (WEB \"a pledge\")." },
];
must("Mark 1:10", "the Spirit like a dove descending upon him");
mustWeb("Mark 1:10", "the Spirit descending on him like a dove");
must("John 1:32", "I saw the Spirit descending from heaven like a dove");
mustWeb("John 1:32", "I have seen the Spirit descending like a dove");
const doveNT = { kjv: countPhrase("kjv", /\bdove\b/gi, (r) => r.testament === "NT"), web: countPhrase("web", /\bdove\b/gi, (r) => r.testament === "NT") };
for (const id of ["kjv", "web"]) {
  const singular = countPhrase(id, /\bdove\b/gi, (r) => r.testament === "NT").refs.join();
  if (singular !== "Matthew 3:16,Mark 1:10,Luke 3:22,John 1:32") fail(`${id} NT dove verses ${singular}`);
}
must("Acts 2:4", "they were all filled with the Holy Ghost");
must("Matthew 3:11", "he shall baptize you with the Holy Ghost, and with fire");
mustWeb("Matthew 3:11", "He will baptize you in the Holy Spirit.");
if (/fire/.test(web.get("Matthew 3:11"))) fail("WEB Matthew 3:11 has fire");
must("Revelation 4:5", "seven lamps of fire burning before the throne, which are the seven Spirits of God");
must("Luke 4:18", "The Spirit of the Lord is upon me, because he hath anointed me");
must("1 John 2:20", "ye have an unction from the Holy One");
mustWeb("1 John 2:20", "You have an anointing from the Holy One");
must("Ephesians 1:14", "the earnest of our inheritance");
mustWeb("Ephesians 1:14", "a pledge of our inheritance");
const symbols = SYMBOLS.map((s) => ({
  ...s,
  verses: s.verses.map((v) => ({ ref: v.ref, kjvText: must(v.ref, ...v.kjv), webPhrase: v.web.join(" ... "), webText: mustWeb(v.ref, ...v.web) })),
}));

/* the seven Spirits: the four verses, and the verses the readings point to */
const sevenSpirits = R("the seven Spirits of God")._kr || [];
must("Revelation 5:6", "having seven horns and seven eyes, which are the seven Spirits of God sent forth into all the earth");
must("Revelation 3:1", "he that hath the seven Spirits of God, and the seven stars");
must("Revelation 8:2", "I saw the seven angels which stood before God");
mustWeb("Revelation 8:2", "I saw the seven angels who stand before God");
must("Zechariah 4:2", "his seven lamps thereon");
must("Zechariah 4:10", "those seven; they are the eyes of the LORD, which run to and fro through the whole earth");
mustWeb("Zechariah 4:10", "These are Yahweh's eyes, which run back and forth through the whole earth");
must("Zechariah 4:6", "Not by might, nor by power, but by my spirit, saith the LORD of hosts");

/* verses the page copy leans on */
must("Judges 3:9", "Othniel");
must("Acts 2:14", "Peter, standing up with the eleven");
must("Acts 2:16", "spoken by the prophet Joel");
must("Luke 4:17", "the book of the prophet Esaias");
must("Luke 3:16", "John answered");
must("John 3:5", "Jesus answered");
must("John 20:20", "Then were the disciples glad");
must("Nehemiah 9:5", "Then the Levites");
must("Genesis 1:2", "the Spirit of God");
must("Acts 2:1", "the day of Pentecost");

/* the Comforter verses, quoted on the page */
const COMFORTER_WEB = { "John 14:16": "he will give you another Counselor", "John 14:26": "the Counselor, the Holy Spirit, whom the Father will send in my name", "John 15:26": "When the Counselor has come", "John 16:7": "the Counselor won't come to you" };
const comforter = R("the Comforter")._kr.map((ref) => ({ ref, kjvText: must(ref, "Comforter"), webPhrase: COMFORTER_WEB[ref] || fail(`no WEB phrase for ${ref}`), webText: mustWeb(ref, COMFORTER_WEB[ref]) }));
must("John 14:16", "he shall give you another Comforter, that he may abide with you for ever");
mustWeb("John 14:16", "he will give you another Counselor");
must("John 15:26", "the Comforter is come", "even the Spirit of truth, which proceedeth from the Father");
must("John 16:7", "if I go not away, the Comforter will not come unto you");
must("John 14:18", "I will not leave you comfortless");
mustWeb("John 14:18", "I will not leave you orphans");

writeList("names-of-the-holy-spirit", {
  generated: "2026-10-25",
  rows: rows.map(({ _kr, _wr, ...r }) => r),
  counts: { rows: rows.length, byTestament, readings: rows.filter((r) => r.readings).length },
  holy: {
    ghostKjv: hgK.total, ghostKjvVerses: hgK.verses, ghostTop: hgTopBook, spiritKjv: hsK.total, spiritKjvRefs: hsK.refs, spiritKjvOT: hsK.ot,
    spiritWeb: hsW.total, spiritWebVerses: hsW.verses, spiritWebOT: hsW.ot, ghostWeb: hgW.total, kjvOnly, webOnly, wordPage: "holy-spirit",
  },
  ghost: { kjvTotal: ghostK.total, otherKjv: otherGhost, dyingVerses: dying.verses, webTotal: ghostW.total, webRefs: ghostW.refs },
  caps: { ...caps, webCapOnly, webCapOnlyOT: webCapOnlyOT.n, kjvCapOnly, mySpirit: { kjv: mySpirit.kjv.total, web: mySpirit.web.total } },
  spiritOfGod: { kjvOT: sog.kjv.ot, kjvNT: sog.kjv.nt, webOT: sog.web.ot, webNT: sog.web.nt },
  spiritOfTheLord: { kjvOT: sol.kjv.ot, kjvNT: sol.kjv.nt, webOT: sol.web.ot, webNT: sol.web.nt, kjvTop: sol.kjv.top },
  doveNT: { kjv: doveNT.kjv.total, web: doveNT.web.total },
  comforter,
  comforterOutsideJohn: comforterAll,
  sevenSpirits,
  symbols,
});

console.log(`rows ${rows.length} (OT ${byTestament.OT}, NT ${byTestament.NT}, both ${byTestament.Both}; readings differ ${rows.filter((r) => r.readings).length})`);
for (const r of rows) console.log(`${r.n}. ${r.name} [${r.testament}]: KJV ${r.kjv.total} (OT ${r.kjv.ot} NT ${r.kjv.nt}, lower ${r.kjv.lower}) WEB ${r.web.total} (OT ${r.web.ot} NT ${r.web.nt}) key ${r.key}`);
console.log("Holy Ghost KJV", hgK.total, "in", hgK.verses, "verses, most in", hgTopBook, "| Holy Spirit KJV", hsK.total, hsK.refs.join("; "), "| WEB Holy Spirit", hsW.total, "OT", hsW.ot, "| KJV only", kjvOnly, "WEB only", webOnly);
console.log("ghost KJV", ghostK.total, "other", otherGhost, "dying verses", dying.verses, "| WEB ghost", ghostW.refs);
console.log("caps", JSON.stringify(caps), "webCapOnly", webCapOnly, "OT", webCapOnlyOT.n, "kjvCapOnly", kjvCapOnly, "my Spirit", mySpirit.kjv.total, mySpirit.web.total);
console.log("dove NT", doveNT.kjv.total, doveNT.web.total, "| comforter outside John", comforterAll.join("; "));
