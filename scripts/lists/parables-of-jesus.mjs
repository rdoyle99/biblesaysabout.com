/**
 * Parables of Jesus: one row per story or extended comparison Jesus tells in Matthew, Mark and Luke, with every
 * Gospel reference, the KJV word count of each telling, and the verse (if any) where the Gospel itself calls that
 * story a parable. Also counts the words "parable" and "parables" by book in the KJV and the WEB.
 * Every reference is checked against the KJV text of its first verse; the build stops on a miss.
 *
 *   node scripts/lists/parables-of-jesus.mjs   ->  lib/data/lists/parables-of-jesus.json
 */
import { kjv, web, must, mustWeb, countForms, fail, writeList, wordCount, BOOKS } from "../lib/list-helpers.mjs";

const GOSPELS = ["Matthew", "Mark", "Luke"];
const first = (ref) => ref.replace(/-\d+$/, ""); // "Matthew 13:3-9" -> "Matthew 13:3"

// [name, { Gospel: [[ref, needle from the first verse], ...] }, label verse naming it a parable or null]
const TABLE = [
  ["The sower", { Matthew: [["Matthew 13:3-9", "a sower went forth to sow"]], Mark: [["Mark 4:3-9", "there went out a sower to sow"]], Luke: [["Luke 8:5-8", "A sower went out to sow"]] }, ["Matthew 13:18", "the parable of the sower"]],
  ["The wheat and the tares", { Matthew: [["Matthew 13:24-30", "sowed good seed in his field"]] }, ["Matthew 13:36", "the parable of the tares"]],
  ["The mustard seed", { Matthew: [["Matthew 13:31-32", "grain of mustard seed"]], Mark: [["Mark 4:30-32", "Whereunto shall we liken the kingdom of God"]], Luke: [["Luke 13:18-19", "Unto what is the kingdom of God like"]] }, ["Matthew 13:31", "Another parable"]],
  ["The leaven", { Matthew: [["Matthew 13:33", "like unto leaven"]], Luke: [["Luke 13:20-21", "Whereunto shall I liken the kingdom of God"]] }, ["Matthew 13:33", "Another parable"]],
  ["The hidden treasure", { Matthew: [["Matthew 13:44", "treasure hid in a field"]] }, null],
  ["The pearl of great price", { Matthew: [["Matthew 13:45-46", "seeking goodly pearls"]] }, null],
  ["The net", { Matthew: [["Matthew 13:47-50", "like unto a net"]] }, null],
  ["The lost sheep", { Matthew: [["Matthew 18:12-14", "an hundred sheep"]], Luke: [["Luke 15:4-7", "having an hundred sheep"]] }, ["Luke 15:3", "he spake this parable"]],
  ["The unforgiving servant", { Matthew: [["Matthew 18:23-35", "take account of his servants"]] }, null],
  ["The labourers in the vineyard", { Matthew: [["Matthew 20:1-16", "hire labourers into his vineyard"]] }, null],
  ["The two sons", { Matthew: [["Matthew 21:28-32", "A certain man had two sons"]] }, null],
  ["The wicked husbandmen", { Matthew: [["Matthew 21:33-41", "planted a vineyard"]], Mark: [["Mark 12:1-9", "planted a vineyard"]], Luke: [["Luke 20:9-16", "planted a vineyard"]] }, ["Matthew 21:33", "Hear another parable"]],
  ["The marriage feast", { Matthew: [["Matthew 22:2-14", "made a marriage for his son"]] }, ["Matthew 22:1", "by parables"]],
  ["The budding fig tree", { Matthew: [["Matthew 24:32-33", "a parable of the fig tree"]], Mark: [["Mark 13:28-29", "a parable of the fig tree"]], Luke: [["Luke 21:29-31", "Behold the fig tree"]] }, ["Matthew 24:32", "learn a parable of the fig tree"]],
  ["The faithful and wise servant", { Matthew: [["Matthew 24:45-51", "a faithful and wise servant"]], Luke: [["Luke 12:42-48", "faithful and wise steward"]] }, null],
  ["The ten virgins", { Matthew: [["Matthew 25:1-13", "ten virgins"]] }, null],
  ["The talents", { Matthew: [["Matthew 25:14-30", "delivered unto them his goods"]] }, null],
  ["The sheep and the goats", { Matthew: [["Matthew 25:31-46", "When the Son of man shall come in his glory"]] }, null],
  ["The growing seed", { Mark: [["Mark 4:26-29", "cast seed into the ground"]] }, null],
  ["The doorkeeper", { Mark: [["Mark 13:34-37", "commanded the porter to watch"]] }, null],
  ["The good Samaritan", { Luke: [["Luke 10:30-37", "went down from Jerusalem to Jericho"]] }, null],
  ["The friend at midnight", { Luke: [["Luke 11:5-8", "at midnight"]] }, null],
  ["The rich fool", { Luke: [["Luke 12:16-21", "The ground of a certain rich man"]] }, ["Luke 12:16", "he spake a parable"]],
  ["The watchful servants", { Luke: [["Luke 12:35-38", "Let your loins be girded about"]] }, ["Luke 12:41", "speakest thou this parable"]],
  ["The barren fig tree", { Luke: [["Luke 13:6-9", "had a fig tree planted in his vineyard"]] }, ["Luke 13:6", "He spake also this parable"]],
  ["The places at the wedding", { Luke: [["Luke 14:8-11", "sit not down in the highest room"]] }, ["Luke 14:7", "he put forth a parable"]],
  ["The great supper", { Luke: [["Luke 14:16-24", "made a great supper"]] }, null],
  ["The tower builder", { Luke: [["Luke 14:28-30", "intending to build a tower"]] }, null],
  ["The king going to war", { Luke: [["Luke 14:31-32", "going to make war against another king"]] }, null],
  ["The lost coin", { Luke: [["Luke 15:8-10", "ten pieces of silver"]] }, null],
  ["The prodigal son", { Luke: [["Luke 15:11-32", "A certain man had two sons"]] }, null],
  ["The unjust steward", { Luke: [["Luke 16:1-8", "which had a steward"]] }, null],
  ["The rich man and Lazarus", { Luke: [["Luke 16:19-31", "clothed in purple and fine linen"]] }, null],
  ["The unprofitable servants", { Luke: [["Luke 17:7-10", "having a servant plowing"]] }, null],
  ["The unjust judge", { Luke: [["Luke 18:2-8", "a judge, which feared not God"]] }, ["Luke 18:1", "he spake a parable"]],
  ["The Pharisee and the publican", { Luke: [["Luke 18:10-14", "Two men went up into the temple to pray"]] }, ["Luke 18:9", "he spake this parable"]],
  ["The pounds", { Luke: [["Luke 19:12-27", "A certain nobleman went into a far country"]] }, ["Luke 19:11", "spake a parable"]],
  ["The two debtors", { Luke: [["Luke 7:41-42", "two debtors"]] }, null],
  ["The lamp under a bushel", { Matthew: [["Matthew 5:15", "put it under a bushel"]], Mark: [["Mark 4:21", "put under a bushel"]], Luke: [["Luke 8:16", "lighted a candle"], ["Luke 11:33", "neither under a bushel"]] }, null],
  ["New cloth on an old garment", { Matthew: [["Matthew 9:16", "new cloth unto an old garment"]], Mark: [["Mark 2:21", "new cloth on an old garment"]], Luke: [["Luke 5:36", "a piece of a new garment upon an old"]] }, ["Luke 5:36", "he spake also a parable"]],
  ["New wine in old bottles", { Matthew: [["Matthew 9:17", "new wine into old bottles"]], Mark: [["Mark 2:22", "new wine into old bottles"]], Luke: [["Luke 5:37-39", "new wine into old bottles"]] }, null],
  ["The wise and foolish builders", { Matthew: [["Matthew 7:24-27", "built his house upon a rock"]], Luke: [["Luke 6:47-49", "I will shew you to whom he is like"]] }, null],
  ["The children in the marketplace", { Matthew: [["Matthew 11:16-17", "children sitting in the markets"]], Luke: [["Luke 7:31-32", "Whereunto then shall I liken the men of this generation"]] }, null],
];

const rows = TABLE.map(([name, by, label], i) => {
  const refs = {};
  const tellings = [];
  for (const g of GOSPELS) {
    for (const [ref, needle] of by[g] || []) {
      if (!ref.startsWith(g + " ")) fail(`${name}: ${ref} filed under ${g}`);
      must(first(ref), needle);
      if (!kjv.get(ref) || !web.get(ref)) fail(`${name}: ${ref} missing a verse`);
      const words = wordCount(ref);
      (refs[g] ||= []).push({ ref, words });
      tellings.push({ gospel: g, ref, words });
    }
  }
  if (label) must(label[0], label[1], "parable");
  const main = [...tellings].sort((a, b) => b.words - a.words)[0];
  return { n: i + 1, name, refs, gospels: GOSPELS.filter((g) => refs[g]), main, label: label ? label[0] : null };
});

const only = (g) => rows.filter((r) => r.gospels.length === 1 && r.gospels[0] === g).map((r) => r.name);
const byLength = [...rows].sort((a, b) => b.main.words - a.main.words);
const totals = {
  count: rows.length,
  byGospel: Object.fromEntries(GOSPELS.map((g) => [g, rows.filter((r) => r.refs[g]).length])),
  allThree: rows.filter((r) => r.gospels.length === 3).map((r) => r.name),
  onlyMatthew: only("Matthew"),
  onlyMark: only("Mark"),
  onlyLuke: only("Luke"),
  labeled: rows.filter((r) => r.label).length,
  mainWords: rows.reduce((s, r) => s + r.main.words, 0),
};
const longest = byLength[0];
const shortest = byLength.at(-1);
if (byLength[1].main.words === longest.main.words) fail("tie for longest parable");

// short sayings this page leaves out of the table, each checked
const LEFT_OUT = [
  ["The blind leading the blind", [["Luke 6:39", "Can the blind lead the blind"]], "Luke 6:39 calls it a parable"],
  ["The strong man bound", [["Matthew 12:29", "strong man"], ["Mark 3:27", "strong man"], ["Luke 11:21", "strong man armed"]], "Mark 3:23 says he spoke in parables"],
  ["What defiles a man", [["Matthew 15:11", "defileth a man"]], "Matthew 15:15 and Mark 7:17 call it a parable"],
  ["Physician, heal thyself", [["Luke 4:23", "Physician, heal thyself"]], "the KJV calls it a proverb, the WEB a parable"],
  ["The householder's treasure", [["Matthew 13:52", "things new and old"]], "one verse"],
  ["The thief in the night", [["Matthew 24:43", "the thief would come"], ["Luke 12:39", "the thief would come"]], "two verses"],
  ["The children of the bridechamber", [["Matthew 9:15", "children of the bridechamber"], ["Mark 2:19", "children of the bridechamber"], ["Luke 5:34", "children of the bridechamber"]], "a question, not a story"],
  ["The unclean spirit that returns", [["Matthew 12:43-45", "unclean spirit"], ["Luke 11:24-26", "unclean spirit"]], "a warning about one man"],
  ["The sheepfold", [["John 10:1-5", "into the sheepfold"]], "John 10:6 calls it a parable; John is outside the table"],
].map(([name, refs, why]) => {
  refs.forEach(([ref, needle]) => must(first(ref), needle));
  return { name, refs: refs.map(([r]) => r), why };
});
must("Mark 3:23", "in parables");
must("Matthew 15:15", "Declare unto us this parable");
must("Mark 7:17", "concerning the parable");
mustWeb("Luke 4:23", "this parable", "Physician");
must("Luke 4:23", "this proverb");

// why he speaks in parables
const why = [
  ["Matthew 13:10-13", "Matthew 13:10", "Why speakest thou unto them in parables", "Matthew 13:13", "Therefore speak I to them in parables"],
  ["Mark 4:10-12", "Mark 4:11", "all these things are done in parables", "Mark 4:12", "seeing they may see, and not perceive"],
  ["Luke 8:9-10", "Luke 8:9", "What might this parable be", "Luke 8:10", "but to others in parables"],
].map(([range, a, na, b, nb]) => {
  must(a, na);
  must(b, nb);
  return { ref: range, kjv: kjv.get(range), web: web.get(range), words: wordCount(range) };
});
must("Matthew 13:13", "Therefore speak I to them in parables: because they seeing see not; and hearing they hear not, neither do they understand.");
must("Matthew 13:34", "without a parable spake he not unto them");
must("Matthew 13:35", "I will open my mouth in parables");
must("Psalms 78:2", "I will open my mouth in a parable");
must("Mark 4:34", "without a parable spake he not unto them", "he expounded all things to his disciples");

// the words "parable" and "parables" by book
const FORMS = ["parable", "parables"];
const word = {
  kjv: countForms("kjv", FORMS),
  web: countForms("web", FORMS),
  kjvNT: countForms("kjv", FORMS, (r) => r.testament === "NT"),
  webNT: countForms("web", FORMS, (r) => r.testament === "NT"),
};
const john10_6 = { kjv: must("John 10:6", "This parable spake Jesus unto them"), web: mustWeb("John 10:6", "this parable") };
const john16 = { kjv: must("John 16:25", "in proverbs"), web: mustWeb("John 16:25", "figures of speech") };
const mark430 = { kjv: must("Mark 4:30", "with what comparison"), web: mustWeb("Mark 4:30", "with what parable") };
const webNames = { sower: mustWeb("Matthew 13:3", "a farmer went out to sow"), tares: mustWeb("Matthew 13:36", "the parable of the darnel weeds") };
if ((word.kjv.byBook.John || 0) !== 1) fail("expected one KJV use in John");
const wordBooks = BOOKS.map((b) => b[0])
  .filter((b) => word.kjv.byBook[b] || word.web.byBook[b])
  .map((book) => ({ book, kjv: word.kjv.byBook[book] || 0, web: word.web.byBook[book] || 0 }));
must("Matthew 25:32", "as a shepherd divideth his sheep from the goats");

writeList("parables-of-jesus", {
  generated: "2026-10-24",
  rule: "a story or extended comparison Jesus tells in Matthew, Mark or Luke; words are KJV tokens in the longest telling",
  rows,
  totals,
  longest: { name: longest.name, ...longest.main },
  shortest: { name: shortest.name, ...shortest.main },
  top10: byLength.slice(0, 10).map((r) => ({ name: r.name, ...r.main })),
  leftOut: LEFT_OUT,
  why,
  word,
  wordBooks,
  john10_6,
  john16,
  mark430,
  webNames,
});

console.log(`${totals.count} parables; Matthew ${totals.byGospel.Matthew}, Mark ${totals.byGospel.Mark}, Luke ${totals.byGospel.Luke}`);
console.log(`all three: ${totals.allThree.length} (${totals.allThree.join(", ")})`);
console.log(`only Matthew ${totals.onlyMatthew.length}, only Mark ${totals.onlyMark.length} (${totals.onlyMark.join(", ")}), only Luke ${totals.onlyLuke.length}`);
console.log(`called a parable in the text: ${totals.labeled}; longest ${longest.name} ${longest.main.ref} ${longest.main.words} words; shortest ${shortest.name} ${shortest.main.ref} ${shortest.main.words}`);
console.log(`top10: ${byLength.slice(0, 10).map((r) => `${r.name} ${r.main.words}`).join("; ")}`);
console.log(`"parable(s)" KJV ${word.kjv.total} (NT ${word.kjvNT.total}) ${JSON.stringify(word.kjv.byBook)}`);
console.log(`"parable(s)" WEB ${word.web.total} (NT ${word.webNT.total}) ${JSON.stringify(word.web.byBook)}`);
console.log(`John 10:6 WEB: ${john10_6.web}`);
