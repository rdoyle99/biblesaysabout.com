/* Miracles of Jesus: one row per miracle story Jesus performs in the four Gospels, every Gospel reference checked
   against the KJV text, plus counts of "miracle(s)", "sign(s)" and "healed" in the KJV and WEB Gospels.
   Writes lib/data/lists/miracles-of-jesus.json. Run: node scripts/lists/miracles-of-jesus.mjs */
import { must, mustWeb, countForms, countPhrase, fail, writeList } from "../lib/list-helpers.mjs";

const GOSPELS = ["Matthew", "Mark", "Luke", "John"];
const TYPES = ["healing", "casting out a demon", "raising the dead", "over nature"];

// [name, type, { Gospel: [[ref, ...needles], ...] }, note?]
// type rule, applied in order: the person was dead -> raising the dead; a devil or unclean spirit is cast out ->
// casting out a demon; a sickness or injury of the body is cured -> healing; anything else -> over nature.
const LIST = [
  ["Water turned into wine at Cana", "over nature", { John: [["John 2:1-11", "water that was made wine", "This beginning of miracles"]] }],
  ["The nobleman's son healed", "healing", { John: [["John 4:46-54", "nobleman", "Thy son liveth", "the second miracle"]] }],
  ["The first great catch of fish", "over nature", { Luke: [["Luke 5:1-11", "great multitude of fishes", "Simon"]] }],
  ["The man with an unclean spirit in the Capernaum synagogue", "casting out a demon", { Mark: [["Mark 1:21-28", "Capernaum", "unclean spirit"]], Luke: [["Luke 4:31-37", "Capernaum", "unclean devil"]] }],
  ["Peter's mother-in-law healed of a fever", "healing", { Matthew: [["Matthew 8:14-15", "wife's mother", "fever"]], Mark: [["Mark 1:29-31", "Simon's wife's mother", "fever"]], Luke: [["Luke 4:38-39", "Simon's wife's mother", "great fever"]] }],
  ["A leper cleansed", "healing", { Matthew: [["Matthew 8:1-4", "leper", "be thou clean"]], Mark: [["Mark 1:40-45", "leper", "be thou clean"]], Luke: [["Luke 5:12-16", "full of leprosy", "be thou clean"]] }],
  ["The paralysed man let down through the roof", "healing", { Matthew: [["Matthew 9:1-8", "sick of the palsy", "take up thy bed"]], Mark: [["Mark 2:1-12", "uncovered the roof", "palsy"]], Luke: [["Luke 5:17-26", "through the tiling", "palsy"]] }],
  ["The centurion's servant healed", "healing", { Matthew: [["Matthew 8:5-13", "centurion", "servant was healed"]], Luke: [["Luke 7:1-10", "centurion's servant", "found the servant whole"]] }],
  ["The widow's son raised at Nain", "raising the dead", { Luke: [["Luke 7:11-17", "Nain", "widow", "he that was dead sat up"]] }],
  ["The storm calmed", "over nature", { Matthew: [["Matthew 8:23-27", "great calm", "the winds and the sea obey him"]], Mark: [["Mark 4:35-41", "Peace, be still", "great calm"]], Luke: [["Luke 8:22-25", "there was a calm", "the winds and water"]] }],
  ["The demons sent into the swine (Gadarenes)", "casting out a demon", { Matthew: [["Matthew 8:28-34", "Gergesenes", "swine"]], Mark: [["Mark 5:1-20", "Gadarenes", "Legion", "swine"]], Luke: [["Luke 8:26-39", "Gadarenes", "Legion", "swine"]] }],
  ["Jairus' daughter raised", "raising the dead", { Matthew: [["Matthew 9:18-26", "ruler", "the maid arose"]], Mark: [["Mark 5:21-43", "Jairus", "Talitha cumi"]], Luke: [["Luke 8:40-56", "Jairus", "Maid, arise"]] }],
  ["The woman with an issue of blood", "healing", { Matthew: [["Matthew 9:20-22", "issue of blood", "hem of his garment"]], Mark: [["Mark 5:25-34", "issue of blood", "twelve years"]], Luke: [["Luke 8:43-48", "issue of blood", "twelve years"]] }],
  ["Two blind men healed in Galilee", "healing", { Matthew: [["Matthew 9:27-31", "two blind men", "their eyes were opened"]] }],
  ["A mute man possessed with a devil", "casting out a demon", { Matthew: [["Matthew 9:32-34", "dumb man possessed with a devil", "the dumb spake"]] }],
  ["A blind and mute man possessed with a devil", "casting out a demon", { Matthew: [["Matthew 12:22-23", "blind, and dumb", "devil"]], Luke: [["Luke 11:14", "casting out a devil", "dumb"]] }],
  ["The man at the pool of Bethesda", "healing", { John: [["John 5:1-15", "Bethesda", "thirty and eight years", "take up thy bed"]] }],
  ["The man with a withered hand", "healing", { Matthew: [["Matthew 12:9-14", "withered", "Stretch forth thine hand"]], Mark: [["Mark 3:1-6", "withered hand", "Stretch forth thine hand"]], Luke: [["Luke 6:6-11", "withered", "Stretch forth thy hand"]] }],
  ["The feeding of the five thousand", "over nature", { Matthew: [["Matthew 14:13-21", "five loaves", "five thousand"]], Mark: [["Mark 6:30-44", "five loaves", "five thousand"]], Luke: [["Luke 9:10-17", "five loaves", "five thousand"]], John: [["John 6:1-14", "five barley loaves", "five thousand"]] }],
  ["Jesus walks on the water", "over nature", { Matthew: [["Matthew 14:22-33", "walking on the sea"]], Mark: [["Mark 6:45-52", "walking upon the sea"]], John: [["John 6:16-21", "walking on the sea"]] }],
  ["The Syrophoenician (Canaanite) woman's daughter", "casting out a demon", { Matthew: [["Matthew 15:21-28", "woman of Canaan", "devil"]], Mark: [["Mark 7:24-30", "Syrophenician", "devil"]] }],
  ["A deaf man with a speech impediment", "healing", { Mark: [["Mark 7:31-37", "deaf", "Ephphatha"]] }],
  ["The feeding of the four thousand", "over nature", { Matthew: [["Matthew 15:32-39", "seven loaves", "four thousand"]], Mark: [["Mark 8:1-10", "seven loaves", "four thousand"]] }],
  ["The blind man at Bethsaida", "healing", { Mark: [["Mark 8:22-26", "Bethsaida", "men as trees"]] }],
  ["The man born blind", "healing", { John: [["John 9:1-7", "blind from his birth", "Siloam"]] }],
  ["The boy with a demon", "casting out a demon", { Matthew: [["Matthew 17:14-18", "lunatick", "devil"]], Mark: [["Mark 9:14-29", "dumb spirit", "come out of him"]], Luke: [["Luke 9:37-43", "only child", "unclean spirit"]] }],
  ["The coin in the fish's mouth", "over nature", { Matthew: [["Matthew 17:24-27", "tribute", "piece of money"]] }],
  ["The woman bent over for eighteen years", "healing", { Luke: [["Luke 13:10-17", "eighteen years", "bowed together"]] }],
  ["The man with dropsy", "healing", { Luke: [["Luke 14:1-6", "dropsy", "healed him"]] }],
  ["Lazarus raised", "raising the dead", { John: [["John 11:1-44", "Lazarus, come forth", "four days"]] }],
  ["Ten lepers cleansed", "healing", { Luke: [["Luke 17:11-19", "ten men that were lepers", "Samaritan"]] }],
  ["Blind Bartimaeus (two blind men at Jericho in Matthew)", "healing", { Matthew: [["Matthew 20:29-34", "Jericho", "two blind men"]], Mark: [["Mark 10:46-52", "Jericho", "Bartimaeus"]], Luke: [["Luke 18:35-43", "Jericho", "blind man"]] }],
  ["The fig tree withered", "over nature", { Matthew: [["Matthew 21:18-22", "fig tree", "withered away"]], Mark: [["Mark 11:12-14", "fig tree", "No man eat fruit of thee"], ["Mark 11:20-21", "fig tree", "withered away"]] }],
  ["The servant's ear healed (Malchus)", "healing", { Luke: [["Luke 22:50-51", "right ear", "touched his ear, and healed him"]] }],
  ["The catch of 153 fish", "over nature", { John: [["John 21:1-14", "full of great fishes, and hundred and fifty and three", "Cast the net on the right side"]] }],
];

const rows = LIST.map(([name, type, refsBy], i) => {
  if (!TYPES.includes(type)) fail(`bad type ${type}`);
  const refs = {};
  for (const g of GOSPELS) {
    if (!refsBy[g]) continue;
    refs[g] = refsBy[g].map(([ref, ...needles]) => {
      if (!ref.startsWith(g + " ")) fail(`${ref} filed under ${g}`);
      must(ref, ...needles);
      return ref;
    });
  }
  return { n: i + 1, name, type, gospels: GOSPELS.filter((g) => refs[g]), refs };
});

// computed from the table
const perGospel = Object.fromEntries(GOSPELS.map((g) => [g, rows.filter((r) => r.refs[g]).length]));
const perType = Object.fromEntries(TYPES.map((t) => [t, rows.filter((r) => r.type === t).length]));
const inAllFour = rows.filter((r) => r.gospels.length === 4).map((r) => r.name);
const inOne = rows.filter((r) => r.gospels.length === 1);
const onlyIn = Object.fromEntries(GOSPELS.map((g) => [g, inOne.filter((r) => r.gospels[0] === g).map((r) => r.name)]));
const byGospelCount = Object.fromEntries([1, 2, 3, 4].map((k) => [k, rows.filter((r) => r.gospels.length === k).length]));

// computed from the text
const isGospel = (r) => GOSPELS.includes(r.book);
const pick = (c) => ({ total: c.total, verses: c.verses, byBook: Object.fromEntries(GOSPELS.map((g) => [g, c.byBook[g] || 0])) });
const words = {
  miracleKjv: pick(countForms("kjv", ["miracle", "miracles"], isGospel)),
  miracleWeb: pick(countForms("web", ["miracle", "miracles"], isGospel)),
  signKjv: pick(countForms("kjv", ["sign", "signs"], isGospel)),
  signWeb: pick(countForms("web", ["sign", "signs"], isGospel)),
  healedKjv: pick(countForms("kjv", ["healed"], isGospel)),
  miracleRefsKjv: countPhrase("kjv", /\bmiracles?\b/gi, isGospel).refs,
  miracleRefsWeb: countPhrase("web", /\bmiracles?\b/gi, isGospel).refs,
  miracleKjvBible: countForms("kjv", ["miracle", "miracles"]).total,
  miracleWebBible: countForms("web", ["miracle", "miracles"]).total,
};

const johnSigns = {
  first: { ref: "John 2:11", kjv: must("John 2:11", "This beginning of miracles"), web: mustWeb("John 2:11", "This beginning of his signs") },
  second: { ref: "John 4:54", kjv: must("John 4:54", "the second miracle"), web: mustWeb("John 4:54", "the second sign") },
  many: { ref: "John 20:30", kjv: must("John 20:30", "many other signs truly did Jesus") },
};
// verses the page cites outside the table
const cited = {
  transfiguration: must("Matthew 17:2", "transfigured"),
  risen: must("Matthew 28:6", "He is not here: for he is risen"),
  malchus: must("John 18:10", "Malchus", "right ear"),
  earMatthew: must("Matthew 26:51", "smote off his ear"),
  summary: must("Matthew 4:24", "he healed them"),
  summaryMark: must("Mark 1:34", "healed many that were sick"),
  gadareneTwo: must("Matthew 8:28", "two possessed with devils"),
  gadareneOne: must("Mark 5:2", "a man with an unclean spirit") && must("Luke 8:27", "a certain man"),
  jerichoOne: must("Mark 10:46", "blind Bartimaeus") && must("Luke 18:35", "a certain blind man"),
  earMark: must("Mark 14:47", "cut off his ear"),
  afterRisen: must("John 21:14", "risen from the dead"),
  markMightyWork: mustWeb("Mark 9:39", "mighty work"),
  john614: mustWeb("John 6:14", "the sign which Jesus did"),
  ruler: must("Matthew 9:18", "ruler"),
  signAsked: must("Matthew 12:38", "we would see a sign"),
  signJudas: must("Matthew 26:48", "gave them a sign"),
  beelzebub: must("Matthew 12:24", "Beelzebub") && must("Luke 11:15", "Beelzebub"),
  seventy: must("Luke 10:17", "devils are subject unto us"),
  printedAlone: must("Luke 22:50", "right ear") && must("Luke 22:51", "healed him") && must("Matthew 12:22", "blind, and dumb") && must("Matthew 20:30", "two blind men"),
  john614Kjv: must("John 6:14", "the miracle that Jesus did"),
};

if (rows.length < 30) fail("fewer than 30 rows");
if (inAllFour.length !== 1) console.warn("note: rows in all four Gospels:", inAllFour);

writeList("miracles-of-jesus", {
  generated: "2026-10-24",
  gospels: GOSPELS,
  types: TYPES,
  rows,
  total: rows.length,
  perGospel,
  perType,
  inAllFour,
  inOneCount: inOne.length,
  onlyIn,
  byGospelCount,
  words,
  johnSigns,
});

console.log(`rows ${rows.length}`, perGospel, perType);
console.log(`in all four: ${inAllFour.join("; ")}; in one Gospel only: ${inOne.length}`, byGospelCount);
console.log("miracle(s) KJV", words.miracleKjv.byBook, "WEB", words.miracleWeb.byBook);
console.log("sign(s) KJV", words.signKjv.byBook, "WEB", words.signWeb.byBook);
console.log("miracle verses KJV", words.miracleRefsKjv.join(", "), "| WEB", words.miracleRefsWeb.join(", "));
console.log("healed KJV", words.healedKjv.total, words.healedKjv.byBook, "| miracle(s) whole Bible KJV", words.miracleKjvBible, "WEB", words.miracleWebBible);
