/**
 * Women of the Bible: 45 named women, how often the KJV names each, the first verse that names her, the book that
 * names her most and a one-line identification checked against its verse. Shared names (Deborah, Tamar, Mary, Rahab,
 * Gomer, Athaliah, Puah ...) are counted for this woman only, by a stated rule, and the other bearer is checked too.
 *
 *   node scripts/lists/women-of-the-bible.mjs   # writes lib/data/lists/women-of-the-bible.json
 *
 * Name rule: a spelling is counted as a whole word, with or without a possessive 's, and not when it is part of a
 * hyphenated compound (Baal-tamar and Hazezon-tamar are places, not Tamar). Case is ignored.
 */
import fs from "fs";
import path from "path";
import { kjv, web, must, mustWeb, countForms, ROWS, tokens, norm, fail, writeList, verseRows, root } from "../lib/list-helpers.mjs";

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const nameRe = (s) => new RegExp(`(?<![A-Za-z'-])${esc(s)}(?:'s|')?(?![A-Za-z-])`, "gi");

/** count each spelling of a name in the KJV, verse by verse, under an optional verse filter */
function countName(spellings, filter = () => true) {
  const res = spellings.map((s) => [s, nameRe(s)]);
  const bySpelling = Object.fromEntries(spellings.map((s) => [s, 0]));
  const byBook = new Map();
  const refs = [];
  let total = 0, ot = 0, nt = 0, first = null;
  for (const r of ROWS.kjv) {
    if (!filter(r)) continue;
    const t = norm(r.text);
    let n = 0;
    for (const [s, re] of res) {
      const m = t.match(re)?.length || 0;
      bySpelling[s] += m;
      n += m;
    }
    if (!n) continue;
    total += n;
    if (r.testament === "OT") ot += n; else nt += n;
    byBook.set(r.book, (byBook.get(r.book) || 0) + n);
    refs.push(r.ref);
    first ||= r.ref;
  }
  const top = [...byBook.entries()].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  const tied = [...byBook.entries()].filter(([, n]) => n === top[1]).map(([b]) => b);
  return { total, verses: refs.length, ot, nt, books: byBook.size, bySpelling, first, top: { book: top[0], count: top[1], tied }, refs };
}

const inBook = (...books) => (r) => books.includes(r.book);
const notRefs = (...refs) => (r) => !refs.includes(r.ref);
const inChapters = (...pairs) => (r) => pairs.some(([b, c]) => r.book === b && (c === undefined || r.ch === c));

/* also: other people, places or things with the same name, each checked: [ref, needle, description] */
const W = [
  { key: "eve", name: "Eve", sp: ["Eve"], who: ["Adam's wife, \"the mother of all living\"", "Genesis 3:20", "Adam called his wife's name Eve", "mother of all living"], word: "eve" },
  { key: "sarah", name: "Sarah (Sarai)", sp: ["Sarai", "Sarah", "Sara"], who: ["Abraham's wife; God renamed her from Sarai to Sarah", "Genesis 17:15", "As for Sarai thy wife", "Sarah shall her name be"], word: "sarah",
    filter: notRefs("Numbers 26:46"), rule: "leaves out Numbers 26:46, where Sarah is Asher's daughter",
    also: [["Numbers 26:46", "the daughter of Asher was Sarah", "Asher's daughter"]] },
  { key: "hagar", name: "Hagar", sp: ["Hagar", "Agar"], who: ["Sarai's Egyptian handmaid", "Genesis 16:1", "handmaid, an Egyptian, whose name was Hagar"], word: "hagar" },
  { key: "rebekah", name: "Rebekah", sp: ["Rebekah", "Rebecca"], who: ["Isaac's wife", "Genesis 24:67", "took Rebekah, and she became his wife"], word: "rebekah" },
  { key: "leah", name: "Leah", sp: ["Leah"], who: ["Laban's elder daughter", "Genesis 29:16", "the name of the elder was Leah"], word: "leah" },
  { key: "rachel", name: "Rachel", sp: ["Rachel", "Rahel"], who: ["Laban's daughter, given to Jacob as his wife", "Genesis 29:28", "gave him Rachel his daughter to wife"], word: "rachel" },
  { key: "bilhah", name: "Bilhah", sp: ["Bilhah"], who: ["Rachel's handmaid, mother of Dan and Naphtali", "Genesis 35:25", "sons of Bilhah, Rachel's handmaid; Dan, and Naphtali"], word: "bilhah",
    filter: notRefs("1 Chronicles 4:29"), rule: "leaves out 1 Chronicles 4:29, a place name",
    also: [["1 Chronicles 4:29", "And at Bilhah, and at Ezem", "a place"]] },
  { key: "dinah", name: "Dinah", sp: ["Dinah"], who: ["Daughter of Leah and Jacob", "Genesis 34:1", "Dinah the daughter of Leah, which she bare unto Jacob"], word: "dinah" },
  { key: "tamar-judah", name: "Tamar (Judah's daughter-in-law)", sp: ["Tamar", "Thamar"], who: ["Wife of Judah's son Er", "Genesis 38:6", "took a wife for Er his firstborn, whose name was Tamar"], word: "tamar",
    filter: inChapters(["Genesis", 38], ["Ruth", 4], ["1 Chronicles", 2], ["Matthew", 1]), rule: "counts Genesis 38, Ruth 4, 1 Chronicles 2 and Matthew 1 only",
    also: [["2 Samuel 13:1", "sister, whose name was Tamar", "David's daughter, also in this table"], ["2 Samuel 14:27", "one daughter, whose name was Tamar", "Absalom's daughter"], ["Ezekiel 47:19", "from Tamar even to the waters of strife", "a place on the south side"]] },
  { key: "tamar-david", name: "Tamar (David's daughter)", sp: ["Tamar"], who: ["Sister of Absalom, a son of David", "2 Samuel 13:1", "Absalom the son of David had a fair sister, whose name was Tamar"],
    filter: inChapters(["2 Samuel", 13], ["1 Chronicles", 3]), rule: "counts 2 Samuel 13 and 1 Chronicles 3 only" },
  { key: "puah", name: "Puah", sp: ["Puah"], who: ["One of the two Hebrew midwives in Egypt", "Exodus 1:15", "Hebrew midwives", "Shiphrah", "the other Puah"],
    filter: inBook("Exodus"), rule: "counts Exodus only",
    also: [["Judges 10:1", "there arose to defend Israel Tola the son of Puah", "the father of Tola, who arose to defend Israel"], ["1 Chronicles 7:1", "sons of Issachar were, Tola, and Puah", "a son of Issachar"]] },
  { key: "jochebed", name: "Jochebed", sp: ["Jochebed"], who: ["Amram's wife, mother of Aaron and Moses", "Exodus 6:20", "Amram took him Jochebed", "she bare him Aaron and Moses"] },
  { key: "miriam", name: "Miriam", sp: ["Miriam"], who: ["A prophetess, the sister of Aaron", "Exodus 15:20", "Miriam the prophetess, the sister of Aaron"], word: "miriam",
    filter: notRefs("1 Chronicles 4:17"), rule: "leaves out 1 Chronicles 4:17, another Miriam",
    also: [["1 Chronicles 4:17", "she bare Miriam, and Shammai", "a child in a family list"]] },
  { key: "zipporah", name: "Zipporah", sp: ["Zipporah"], who: ["Moses' wife", "Exodus 18:2", "Zipporah, Moses' wife"] },
  { key: "rahab", name: "Rahab", sp: ["Rahab", "Rachab"], who: ["A harlot of Jericho who lodged Joshua's spies", "Joshua 2:1", "even Jericho", "harlot's house, named Rahab"], word: "rahab",
    filter: (r) => r.book !== "Psalms" && r.book !== "Isaiah", rule: "leaves out Psalms and Isaiah, where Rahab is not the woman of Jericho",
    also: [["Psalms 87:4", "mention of Rahab and Babylon", "Philistia, and Tyre, with Ethiopia", "listed with Babylon, Philistia, Tyre and Ethiopia"], ["Psalms 89:10", "broken Rahab in pieces", "a defeated enemy"], ["Isaiah 51:9", "cut Rahab, and wounded the dragon", "set beside the dragon"]] },
  { key: "deborah", name: "Deborah", sp: ["Deborah"], who: ["A prophetess who judged Israel", "Judges 4:4", "Deborah, a prophetess", "she judged Israel"], word: "deborah",
    filter: inBook("Judges"), rule: "counts Judges only",
    also: [["Genesis 35:8", "Deborah Rebekah's nurse died", "Rebekah's nurse"]] },
  { key: "jael", name: "Jael", sp: ["Jael"], who: ["Heber's wife, who killed Sisera with a tent nail", "Judges 4:21-22", "Jael Heber's wife took a nail of the tent", "Sisera lay dead"] },
  { key: "delilah", name: "Delilah", sp: ["Delilah"], who: ["The woman of the valley of Sorek whom Samson loved", "Judges 16:4-6", "valley of Sorek, whose name was Delilah", "Delilah said to Samson"], word: "delilah" },
  { key: "naomi", name: "Naomi", sp: ["Naomi"], who: ["Elimelech's wife", "Ruth 1:2", "the name of his wife Naomi"], word: "naomi" },
  { key: "orpah", name: "Orpah", sp: ["Orpah"], who: ["A woman of Moab who married one of Naomi's two sons", "Ruth 1:3-4", "her two sons", "women of Moab; the name of the one was Orpah"] },
  { key: "ruth", name: "Ruth", sp: ["Ruth"], who: ["Clave to her mother-in-law when Orpah went back", "Ruth 1:14-15", "Orpah kissed her mother in law; but Ruth clave unto her", "thy sister in law is gone back"], word: "ruth" },
  { key: "hannah", name: "Hannah", sp: ["Hannah"], who: ["Mother of Samuel", "1 Samuel 1:20", "after Hannah had conceived", "called his name Samuel"], word: "hannah" },
  { key: "michal", name: "Michal", sp: ["Michal"], who: ["Saul's daughter, given to David as his wife", "1 Samuel 18:27", "Saul gave him Michal his daughter to wife"], word: "michal" },
  { key: "abigail", name: "Abigail", sp: ["Abigail"], who: ["Nabal's widow, one of David's two wives", "1 Samuel 30:5", "David's two wives", "Abigail the wife of Nabal"], word: "abigail",
    filter: notRefs("2 Samuel 17:25", "1 Chronicles 2:16", "1 Chronicles 2:17"), rule: "leaves out 2 Samuel 17:25 and 1 Chronicles 2:16-17, David's sister",
    also: [["1 Chronicles 2:15-16", "David the seventh", "sisters were Zeruiah, and Abigail", "a sister of David"]] },
  { key: "bathsheba", name: "Bathsheba", sp: ["Bath-sheba"], who: ["David's wife, mother of Solomon", "2 Samuel 12:24", "Bath-sheba his wife", "Solomon"],
},
  { key: "abishag", name: "Abishag", sp: ["Abishag"], who: ["A Shunammite brought to King David in his old age", "1 Kings 1:1-3", "king David was old", "Abishag a Shunammite"] },
  { key: "jezebel", name: "Jezebel", sp: ["Jezebel"], who: ["Wife of King Ahab", "1 Kings 21:25", "Ahab", "Jezebel his wife"], word: "jezebel",
    filter: (r) => r.testament === "OT", rule: "counts the Old Testament only",
    also: [["Revelation 2:18-20", "Thyatira", "that woman Jezebel, which calleth herself a prophetess", "a woman in the church at Thyatira"]] },
  { key: "athaliah", name: "Athaliah", sp: ["Athaliah"], who: ["Ahaziah's mother, who then reigned over the land", "2 Kings 11:1-3", "Athaliah the mother of Ahaziah", "Athaliah did reign over the land"], word: "athaliah",
    filter: notRefs("1 Chronicles 8:26", "Ezra 8:7"), rule: "leaves out 1 Chronicles 8:26 and Ezra 8:7",
    also: [["1 Chronicles 8:26-27", "Athaliah", "the sons of Jeroham", "one of the sons of Jeroham"], ["Ezra 8:7", "Jeshaiah the son of Athaliah", "the parent of Jeshaiah"]] },
  { key: "huldah", name: "Huldah", sp: ["Huldah"], who: ["A prophetess in Jerusalem whom Hilkiah the priest went to", "2 Kings 22:14", "Hilkiah the priest", "went unto Huldah the prophetess", "dwelt in Jerusalem"] },
  { key: "esther", name: "Esther (Hadassah)", sp: ["Esther", "Hadassah"], who: ["Made queen in place of Vashti", "Esther 2:17", "made her queen instead of Vashti"], word: "esther" },
  { key: "vashti", name: "Vashti", sp: ["Vashti"], who: ["Queen of King Ahasuerus", "Esther 1:9", "Vashti the queen", "king Ahasuerus"], word: "vashti" },
  { key: "gomer", name: "Gomer", sp: ["Gomer"], who: ["Hosea's wife, the daughter of Diblaim", "Hosea 1:2-3", "said to Hosea, Go, take unto thee a wife", "Gomer the daughter of Diblaim"],
    filter: inBook("Hosea"), rule: "counts Hosea only",
    also: [["Genesis 10:2", "The sons of Japheth; Gomer", "a son of Japheth"]] },
  { key: "elisabeth", name: "Elisabeth", sp: ["Elisabeth"], who: ["Wife of Zacharias, mother of John", "Luke 1:13", "Zacharias", "thy wife Elisabeth shall bear thee a son", "his name John"] },
  { key: "mary-mother", name: "Mary, mother of Jesus", sp: ["Mary"], who: ["Wife of Joseph, mother of Jesus", "Matthew 1:16", "Joseph the husband of Mary, of whom was born Jesus"], word: "mary",
    filter: (r) => inChapters(["Matthew", 1], ["Matthew", 2], ["Luke", 1], ["Luke", 2])(r) || ["Matthew 13:55", "Mark 6:3", "Acts 1:14"].includes(r.ref),
    rule: "counts Matthew 1-2, Luke 1-2, Matthew 13:55, Mark 6:3 and Acts 1:14" },
  { key: "anna", name: "Anna", sp: ["Anna"], who: ["A prophetess of the tribe of Aser", "Luke 2:36", "Anna, a prophetess", "tribe of Aser"] },
  { key: "mary-magdalene", name: "Mary Magdalene", sp: ["Magdalene"], who: ["The first the risen Jesus appeared to, in Mark's account", "Mark 16:9", "appeared first to Mary Magdalene"], word: "magdalene",
    rule: "counts the word Magdalene, which always follows her name Mary" },
  { key: "mary-bethany", name: "Mary of Bethany", sp: ["Mary"], who: ["Martha's sister, who sat at Jesus' feet", "Luke 10:39", "sister called Mary, which also sat at Jesus' feet"],
    filter: inChapters(["Luke", 10], ["John", 11], ["John", 12]), rule: "counts Luke 10 and John 11-12" },
  { key: "martha", name: "Martha", sp: ["Martha"], who: ["Received Jesus into her house", "Luke 10:38", "a certain woman named Martha received him into her house"], word: "martha" },
  { key: "salome", name: "Salome", sp: ["Salome"], who: ["Looked on from afar with Mary Magdalene", "Mark 15:40", "women looking on afar off", "Mary Magdalene", "Salome"] },
  { key: "herodias", name: "Herodias", sp: ["Herodias"], who: ["Philip's wife, for whose sake Herod imprisoned John", "Matthew 14:3", "Herod had laid hold on John", "Herodias' sake, his brother Philip's wife"] },
  { key: "dorcas", name: "Dorcas (Tabitha)", sp: ["Tabitha", "Dorcas"], who: ["A disciple at Joppa, full of good works", "Acts 9:36", "Joppa", "named Tabitha, which by interpretation is called Dorcas", "full of good works"] },
  { key: "lydia", name: "Lydia", sp: ["Lydia"], who: ["A seller of purple from Thyatira", "Acts 16:14", "named Lydia, a seller of purple, of the city of Thyatira"],
    filter: inBook("Acts"), rule: "counts Acts only",
    also: [["Ezekiel 30:5", "Libya, and Lydia", "listed with Ethiopia and Libya"]] },
  { key: "priscilla", name: "Priscilla (Prisca)", sp: ["Priscilla", "Prisca"], who: ["Wife of Aquila", "Acts 18:2", "named Aquila", "with his wife Priscilla"], word: "priscilla" },
  { key: "phebe", name: "Phebe", sp: ["Phebe"], who: ["A servant of the church at Cenchrea", "Romans 16:1", "Phebe our sister, which is a servant of the church which is at Cenchrea"] },
  { key: "sapphira", name: "Sapphira", sp: ["Sapphira"], who: ["Wife of Ananias", "Acts 5:1", "Ananias, with Sapphira his wife"] },
];

if (new Set(W.map((w) => w.key)).size !== W.length) fail("duplicate key");
const words = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-words.json"), "utf8")).words;

const rows = W.map((w, i) => {
  const c = countName(w.sp, w.filter);
  if (!c.total) fail(`${w.name}: no verses`);
  // the first verse that names her, and each listed spelling, are in the text
  must(c.first, ...[w.sp.find((s) => nameRe(s).test(norm(kjv.get(c.first))))].filter(Boolean));
  for (const s of w.sp) if (!c.bySpelling[s]) fail(`${w.name}: spelling ${s} never counted`);
  const [whoText, whoRef, ...needles] = w.who;
  must(whoRef, ...needles);
  const also = (w.also || []).map(([ref, ...rest]) => {
    const desc = rest.pop();
    must(ref, ...rest);
    if (w.filter && ref.includes("-") === false && c.refs.includes(ref)) fail(`${w.name}: ${ref} is another bearer but was counted`);
    return { ref, desc };
  });
  const all = countName(w.sp); // the name with no rule: every bearer
  // compare with the /words page when one exists for this name
  let wordPage = null;
  const wp = w.word && words.find((x) => x.slug === w.word);
  if (w.word && !wp) fail(`no /words/${w.word} entry`);
  if (wp) {
    // count exactly the forms the /words page counts, then name every difference from this row's name count
    const exact = (f) => ROWS.kjv.reduce((n, r) => n + (norm(r.text).match(new RegExp(`(?<![A-Za-z'-])${esc(f)}(?![A-Za-z'-])`, "gi"))?.length || 0), 0);
    const same = wp.kjvForms.reduce((n, f) => n + exact(f), 0);
    if (same !== wp.kjv.total) fail(`${w.name}: counted ${same} for ${wp.kjvForms.join("+")}, /words/${w.word} says ${wp.kjv.total}`);
    const forms = new Set(wp.kjvForms);
    const diff = [];
    for (const s of w.sp) {
      const lc = s.toLowerCase();
      if (!forms.has(lc)) diff.push({ what: s, count: all.bySpelling[s] });
      else if (!forms.has(lc + "'s")) {
        const pos = exact(s + "'s");
        if (pos) diff.push({ what: `${s}'s`, count: pos });
      }
    }
    if (wp.kjv.total + diff.reduce((n, d) => n + d.count, 0) !== all.total) fail(`${w.name}: /words difference does not add up`);
    wordPage = { slug: w.word, total: wp.kjv.total, diff };
  }
  const t = ROWS.kjv.find((r) => r.ref === c.first).testament;
  const { refs, ...count } = c;
  // where each rarer spelling occurs (three verses or fewer), for the notes under the table
  const spellingRefs = Object.fromEntries(w.sp.slice(1).filter((s) => c.bySpelling[s] <= 3).map((s) => [s, c.refs.filter((ref) => nameRe(s).test(norm(kjv.get(ref))))]));
  return { n: i + 1, spellingRefs, key: w.key, name: w.name, spellings: w.sp, count, nameTotal: all.total, rule: w.rule || null, firstTestament: t,
    who: { text: whoText, ref: whoRef }, also, wordPage };
});

// table order: the order in which the KJV first names each woman
const pos = new Map(ROWS.kjv.map((r, i) => [r.ref, i]));
rows.sort((a, b) => pos.get(a.count.first) - pos.get(b.count.first));
rows.forEach((r, i) => (r.n = i + 1));

// women the text describes without a name (for the limits section)
const unnamed = [
  ["Genesis 19:26", "his wife looked back", "Lot's wife"],
  ["Exodus 2:5", "daughter of Pharaoh", "Pharaoh's daughter"],
  ["1 Kings 10:1", "queen of Sheba", "the queen of Sheba"],
  ["John 4:7", "a woman of Samaria", "the woman of Samaria"],
].map(([ref, needle, desc]) => (must(ref, needle), { ref, desc }));

// named women this table leaves out, and a name not added to a row
const leftOut = [
  ["Exodus 1:15", "Shiphrah", "Shiphrah"],
  ["Genesis 25:1", "her name was Keturah", "Keturah"],
  ["Genesis 29:24", "Zilpah his maid", "Zilpah"],
  ["Luke 8:3", "Joanna the wife of Chuza", "Joanna"],
].map(([ref, needle, desc]) => (must(ref, needle), { ref, desc }));
must("1 Chronicles 3:5", "Solomon", "Bath-shua the daughter of Ammiel");

// "Eve" as an ordinary word: every KJV verse with the token eve must be one of the four that name Adam's wife
const eve = countForms("kjv", ["eve"]);
const eveRefs = ROWS.kjv.filter((r) => tokens(r.text).includes("eve")).map((r) => r.ref);
const EVE_OK = { "Genesis 3:20": "Adam", "Genesis 4:1": "Adam knew Eve", "2 Corinthians 11:3": "serpent beguiled Eve", "1 Timothy 2:13": "Adam was first formed, then Eve" };
for (const r of eveRefs) EVE_OK[r] ? must(r, EVE_OK[r]) : fail(`eve as another word at ${r}`);

// the daughter of Herodias who danced is not named
for (const ref of ["Matthew 14:6", "Mark 6:22"]) {
  must(ref, "daughter of", "Herodias", "danced");
  if (/salome/i.test(kjv.get(ref))) fail(`${ref} names Salome`);
}
const salome = rows.find((r) => r.key === "salome").count;
if (salome.books !== 1 || salome.top.book !== "Mark") fail("Salome outside Mark");

// the other Marys, each checked
const otherMarys = [
  ["Mark 15:40", "Mary the mother of James the less and of Joses", "the mother of James the less and of Joses"],
  ["John 19:25", "Mary the wife of Cleophas", "the wife of Cleophas"],
  ["Acts 12:12", "Mary the mother of John, whose surname was Mark", "the mother of John Mark"],
  ["Romans 16:6", "Greet Mary", "a woman greeted at Rome"],
].map(([ref, needle, desc]) => (must(ref, needle), { ref, desc }));
const maryAll = countName(["Mary"]);

// Rahab as a name for Egypt, in the WEB
mustWeb("Isaiah 30:7", "Egypt", "called her Rahab");
const rahabWeb = mustWeb("Isaiah 30:7");

// woman and women
const ww = (id) => ({ woman: countForms(id, ["woman", "woman's"]), women: countForms(id, ["women", "women's"]) });
const womanCounts = { kjv: ww("kjv"), web: ww("web") };
for (const id of ["kjv", "web"]) for (const k of ["woman", "women"]) {
  const c = womanCounts[id][k];
  (id === "kjv" ? must : mustWeb)(c.first, k);
}
const slim = (c) => ({ total: c.total, verses: c.verses, top: c.top, first: c.first });

// the two books named for women
const bookStats = ["Ruth", "Esther"].map((b) => {
  const vs = verseRows("kjv", b);
  const chapters = new Set(vs.map((r) => r.ch)).size;
  const kjvWords = vs.reduce((s, r) => s + tokens(r.text).length, 0);
  const webWords = verseRows("web", b).reduce((s, r) => s + tokens(r.text).length, 0);
  return { book: b, slug: b.toLowerCase(), chapters, verses: vs.length, kjvWords, webWords };
});
const booksJson = JSON.parse(fs.readFileSync(path.join(root, "lib/data/bible-books.json"), "utf8"));
const bookList = Array.isArray(booksJson) ? booksJson : booksJson.books;
for (const b of bookStats) {
  const j = bookList.find((x) => x.slug === b.slug);
  if (j.chapters !== b.chapters || j.words.kjv !== b.kjvWords) fail(`${b.book}: ${b.chapters}/${b.kjvWords} vs books page ${j.chapters}/${j.words.kjv}`);
}
must("Ruth 1:4", "the other Ruth");
must("Esther 2:7", "Hadassah, that is, Esther");

const sorted = [...rows].sort((a, b) => b.count.total - a.count.total);
const most = sorted[0];
if (sorted[1].count.total === most.count.total) fail("tie for most-named woman");
const split = {
  firstOT: rows.filter((r) => r.firstTestament === "OT").length,
  firstNT: rows.filter((r) => r.firstTestament === "NT").length,
  both: rows.filter((r) => r.count.ot && r.count.nt).map((r) => r.name),
};
// a row "shares" its name when the name, counted for everyone, has verses this row leaves out; every such row states its rule
const shared = rows.filter((r) => r.nameTotal > r.count.total).map((r) => r.key);
for (const r of rows) if (r.nameTotal > r.count.total && !r.rule) fail(`${r.name}: verses left out with no rule`);
// the order rule: within a verse that first names two women, the one named first comes first
for (let i = 1; i < rows.length; i++) {
  const [a, b] = [rows[i - 1], rows[i]];
  if (a.count.first !== b.count.first) continue;
  const t = norm(kjv.get(a.count.first));
  const at = (r) => Math.min(...r.spellings.map((s) => t.search(nameRe(s))).filter((x) => x >= 0));
  if (at(a) > at(b)) fail(`${a.name} and ${b.name} share ${a.count.first} but are out of order`);
}

writeList("women-of-the-bible", {
  generated: "2026-10-24",
  rule: "A name is counted as a whole word in the KJV, with or without a possessive, and not inside a hyphenated compound. Where another person, place or thing shares the name, the row counts her verses only, by the rule shown.",
  rows,
  most: { key: most.key, name: most.name, total: most.count.total, bySpelling: most.count.bySpelling },
  second: { name: sorted[1].name, total: sorted[1].count.total },
  split,
  shared,
  eve: { total: eve.total, refs: eveRefs },
  marys: { total: maryAll.total, verses: maryAll.verses, others: otherMarys },
  unnamed,
  leftOut,
  rahabWeb: { ref: "Isaiah 30:7", text: rahabWeb },
  woman: { kjv: { woman: slim(womanCounts.kjv.woman), women: slim(womanCounts.kjv.women) }, web: { woman: slim(womanCounts.web.woman), women: slim(womanCounts.web.women) } },
  books: bookStats,
});

console.log(`${rows.length} women: first named in OT ${split.firstOT}, NT ${split.firstNT}; named in both ${split.both.length} (${split.both.join(", ")})`);
console.log(`most named: ${most.name} ${most.count.total} ${JSON.stringify(most.count.bySpelling)}; next ${sorted[1].name} ${sorted[1].count.total}; Mary (all) ${maryAll.total}`);
console.log(`woman/women KJV ${womanCounts.kjv.woman.total}/${womanCounts.kjv.women.total}, WEB ${womanCounts.web.woman.total}/${womanCounts.web.women.total}; eve tokens ${eve.total}`);
console.log(bookStats.map((b) => `${b.book}: ${b.chapters} ch, ${b.verses} v, ${b.kjvWords} KJV words, ${b.webWords} WEB`).join("; "));
for (const r of rows) console.log(`  ${r.n}. ${r.name}: ${r.count.total} (name ${r.nameTotal}) first ${r.count.first}, top ${r.count.top.tied.join("/")} ${r.count.top.count}${r.wordPage?.diff.length ? " words+" + JSON.stringify(r.wordPage.diff) : ""}`);
