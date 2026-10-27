import { OG_VIDEOS } from "@/lib/og-video";
/* Biblical numbers: what 1-10, 12, 40, 70, 666 and 1,000 mean in the Bible. How often each number word appears in the
   KJV and the WEB, where it is most frequent, the verses each number is known for, and the symbolic readings of
   E. W. Bullinger (1894), Easton's Bible Dictionary (1897) and the International Standard Bible Encyclopedia (1915),
   attributed to them. Counted and checked by scripts/lists/biblical-numbers.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/biblical-numbers.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/biblical-numbers`;
const link = "underline underline-offset-2 hover:text-primary";
const row = Object.fromEntries(DATA.table.map((r) => [r.slug, r]));
const K = DATA.key;
const P = DATA.phrases;
const L = DATA.limits;
const B = DATA.bullinger;
const pct = (a, b) => `${Math.round((a / b) * 100)}%`;
const pct1 = (a, b) => `${((a / b) * 100).toFixed(1)}%`;
const keyCount = Object.values(K).flat().length;
const label = (n) => (n === 1000 ? "1,000" : String(n));

const BULL_URL = "https://archive.org/details/number-in-scripture";
const BULL_TXT = "https://archive.org/download/number-in-scripture/Number%20in%20Scripture_djvu.txt";
const EASTON_URL = "https://www.biblestudytools.com/dictionaries/eastons-bible-dictionary/seven.html";
const EASTON_N_URL = "https://www.ccel.org/e/easton/ebd/ebd/T0002700.html";
const ISBE_URL = "https://www.biblestudytools.com/dictionary/number/";
const MILL_URL = "https://en.wikipedia.org/wiki/Millennialism";

const s7 = row.seven;
const s40 = row.forty;
const s12 = row.twelve;
const s3 = row.three;
const s8 = row.eight;
const revShareSevens = pct(DATA.sevenInRev.kjv, DATA.sevenExact.kjv);
const revShareVerses = pct1(DATA.revVerses, DATA.verses.kjv);

const TITLE = "Biblical Numbers and Their Meanings: 3, 7, 12, 40 Counted";
const ANSWER = `Numbers like 3, 7, 12 and 40 recur across the Bible. In the King James Version, counting ordinals such as seventh, seven appears ${s7.kjv} times, twelve ${s12.kjv} and forty ${s40.kjv}. The text ties them to real things: the seventh day of rest, the twelve tribes, forty days of rain. The Bible never defines what a number means; the symbolic meanings come from interpreters.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Seven, seventh and sevenfold: ${s7.kjv} times in the KJV; forty, ${s40.kjv}. What 1 to 10, 12, 40, 70, 666 and 1,000 mean in the text, and what interpreters read into them.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What does the number 7 mean in the Bible?", a: `The Bible ties seven first to the week: God "rested on the seventh day" and "blessed the seventh day, and sanctified it" (Genesis 2:2-3). Revelation is full of sevens: seven churches, seals, trumpets and bowls. Easton's Bible Dictionary (1897) says seven "has been called the symbol of perfection, and also the symbol of rest", and E. W. Bullinger (1894) calls it "the great number of spiritual perfection". Seven, seventh and sevenfold appear ${s7.kjv} times in the King James Version.` },
  { q: "What does the number 8 mean in the Bible?", a: `The Bible gives eight no stated meaning. Its best-known eights are the "eight souls" saved in the ark (1 Peter 3:20) and circumcision on the eighth day (Genesis 17:12, Luke 2:21). Bullinger reads eight as "the number specially associated with Resurrection and Regeneration, and the beginning of a new era or order", because it follows a completed seven. Eight and eighth appear ${s8.kjv} times in the King James Version.` },
  { q: "What does the number 40 mean in the Bible?", a: `Forty marks a long stretch of testing or waiting: the flood rain of "forty days and forty nights" (Genesis 7:12) and Moses on the mountain (Exodus 24:18). So do Israel's forty years in the wilderness (Numbers 14:33-34) and Jesus' fast (Matthew 4:2). Bullinger reads forty as "a period of probation, trial, and chastisement". The International Standard Bible Encyclopedia (1915) adds that it "can hardly be supposed" each of these was exactly forty, and treats forty partly as a round number for a generation.` },
  { q: "What is God's number in the Bible?", a: `The Bible does not name a number as God's. Interpreters point to different ones. Bullinger writes that "three denotes divine perfection" and seven "spiritual perfection", and Easton's Bible Dictionary calls seven "the symbol of perfection". Bullinger also ties one to God, from Deuteronomy 6:4: "The LORD our God is one LORD." These are readings, not statements of the text.` },
  { q: "Which number appears most in the Bible?", a: `"One" is the most frequent number word: ${fmt(L.oneBare)} times in the King James Version, though many of those are not counts ("every one", "one another"). Among words that are always numbers, "two" leads with ${fmt(DATA.ranking.kjv.find((x) => x.word === "two").count)}, then "hundred" (${DATA.ranking.kjv.find((x) => x.word === "hundred").count}) and "thousand" (${DATA.ranking.kjv.find((x) => x.word === "thousand").count}).` },
  { q: "What does 666 mean in the Bible?", a: `Revelation 13:18 calls 666 "the number of the beast: for it is the number of a man". It is the only verse that gives it a meaning. The same number appears three more times as an ordinary amount: Solomon's yearly gold (1 Kings 10:14, 2 Chronicles 9:13) and a family of returning exiles (Ezra 2:13). The International Standard Bible Encyclopedia names "Nero Caesar" in Hebrew letters as "the best solution"; Bullinger expected it to fit a future Antichrist.` },
];

/* Copy for each number. lead: the first sentence answers the H2. */
function counts(r, extra = "") {
  const forms = r.forms.map((f) => (f.endsWith(" (KJV)") ? `"${f.slice(0, -6)}" (KJV only)` : `"${f}"`)).join(", ");
  const top = r.tied.length > 1 ? `${r.tied.length} books tie with ${r.top.count} each` : `${r.top.book} has the most (${r.top.count})`;
  return `Counted: ${forms}. The King James Version has ${fmt(r.kjv)} in ${fmt(r.kjvVerses)} verses and the World English Bible ${fmt(r.web)}; ${top}.${extra ? " " + extra : ""}`;
}

const SECTIONS = [
  {
    slug: "one",
    q: "What does the number 1 mean in the Bible?",
    lead: `The Bible uses one for unity: "The LORD our God is one LORD" (Deuteronomy 6:4) and husband and wife "shall be one flesh" (Genesis 2:24).`,
    count: counts(row.one, `Many uses of "one" are not counts at all: in the KJV "every one" appears ${DATA.oneIdioms.kjv.everyOne} times and "one another" ${DATA.oneIdioms.kjv.oneAnother}. Numbers leads because of chapter 7, where twelve leaders each bring "one silver charger" and "one silver bowl" (Numbers 7:13), ${L.oneNum7} uses of "one" in one chapter.`),
    readings: [`E. W. Bullinger, in Number in Scripture (1894): "In all languages it is the symbol of unity." He reads Deuteronomy 6:4 as a verse that "excludes absolutely another Lord".`],
  },
  {
    slug: "two",
    q: "What does the number 2 mean in the Bible?",
    lead: `Two in the Bible is the number of pairs and of witnesses: the animals came into the ark "two of every sort" (Genesis 6:19). A charge stood "at the mouth of two witnesses, or at the mouth of three" (Deuteronomy 19:15).`,
    count: counts(row.two),
    readings: [`Bullinger finds in two "this fundamental idea of division or difference", which may be for good or for evil depending on the passage.`],
  },
  {
    slug: "three",
    q: "What does the number 3 mean in the Bible?",
    lead: `Three is the number of the third day. Jonah was in the fish "three days and three nights" (Jonah 1:17), and Jesus said the Son of man would be "three days and three nights in the heart of the earth" (Matthew 12:40). Paul writes that he "rose again the third day" (1 Corinthians 15:4).`,
    count: counts(s3, `"The third day" appears ${P.thirdDay.kjv} times in the KJV, ${DATA.thirdDayNT.kjv} of them in the New Testament, and "three days" ${P.threeDays.kjv} times.`),
    readings: [`Bullinger: "Three denotes divine perfection". The International Standard Bible Encyclopedia (ISBE, 1915) says three was "regarded as symbolic of a complete and ordered whole", the number in which "beginning, middle and end are most distinctly marked".`],
  },
  {
    slug: "four",
    q: "What does the number 4 mean in the Bible?",
    lead: `Four goes with the whole earth in the Bible: Eden's river parts into "four heads" (Genesis 2:10), and Revelation's angels stand "on the four corners of the earth, holding the four winds" (Revelation 7:1).`,
    count: counts(row.four),
    readings: [`Bullinger calls four "emphatically the number of Creation". ISBE reads it as "a symbol of completeness of range", from the four points of the compass.`],
  },
  {
    slug: "five",
    q: "What does the number 5 mean in the Bible?",
    lead: `The Bible gives five no stated meaning; its famous fives are David's "five smooth stones" (1 Samuel 17:40), the "five loaves, and two fishes" (Matthew 14:17) and the five wise and five foolish virgins (Matthew 25:2).`,
    count: counts(row.five),
    readings: [`Bullinger: "five is therefore the number of GRACE". ISBE is plainer: five "came readily into the mind as the half of 10".`],
  },
  {
    slug: "six",
    q: "What does the number 6 mean in the Bible?",
    lead: `Six is tied in the text to work and to the making of man: God made man on "the sixth day" (Genesis 1:27-31), and the law says "Six days shalt thou labour" (Exodus 20:9).`,
    count: counts(row.six),
    readings: [`Bullinger: six "is the number of imperfection; the human number", which he connects to 666.`],
  },
  {
    slug: "seven",
    q: "What does the number 7 mean in the Bible?",
    lead: `Seven is the number of the finished week: God "rested on the seventh day" and "blessed the seventh day, and sanctified it" (Genesis 2:2-3), and Revelation is full of sevens.`,
    count: counts(s7, `The bare word "seven" appears ${DATA.sevenExact.kjv} times, and ${DATA.sevenInRev.kjv} of them (${revShareSevens}) are in Revelation, a book with ${revShareVerses} of the Bible's verses; in the KJV, Revelation and Genesis tie for the most uses of the bare word. "Seven days" appears ${P.sevenDays.kjv} times and "the seventh day" ${P.seventhDay.kjv}.`),
    readings: [
      `Easton's Bible Dictionary (1897): "This number has been called the symbol of perfection, and also the symbol of rest." It adds that "the division of time into weeks of seven days each accounts for many instances".`,
      `Bullinger: "the great number of spiritual perfection". ISBE says seven is "referred to in one way or another in nearly 600 passages", and of Revelation's writer: "There cannot be a shadow of doubt that 7 for him expressed fullness, completeness."`,
    ],
  },
  {
    slug: "eight",
    q: "What does the number 8 mean in the Bible?",
    lead: `The Bible gives eight no stated meaning; its best-known eights are the "eight souls" saved in the ark (1 Peter 3:20) and circumcision at "eight days old" (Genesis 17:12), as with Jesus (Luke 2:21).`,
    count: counts(s8, `"The eighth day" appears ${P.eighthDay.kjv} times. The KJV calls Noah "the eighth person" (2 Peter 2:5); the WEB reads "Noah with seven others". Nehemiah leads because of its register of families who came back from exile: ${L.eightNeh7} of its ${L.eightNeh} are in chapter 7.`),
    readings: [`Bullinger: eight "is the number specially associated with Resurrection and Regeneration, and the beginning of a new era or order". He points to Noah stepping out "on to a new earth" with eight people. The text itself does not call eight a number of new beginnings.`],
  },
  {
    slug: "nine",
    q: "What does the number 9 mean in the Bible?",
    lead: `The Bible gives nine no stated meaning; its best-known use is "the ninth hour", when Jesus cried out on the cross (Matthew 27:46). In Acts 3:1 the ninth hour is "the hour of prayer".`,
    count: counts(row.nine, `Of ten healed lepers Jesus asked "where are the nine?" (Luke 17:17), and Deuteronomy 3:11 gives Og's iron bed as "nine cubits" long.`),
    readings: [`Bullinger calls nine "the number of finality or judgment", the last of the single digits.`],
  },
  {
    slug: "ten",
    q: "What does the number 10 mean in the Bible?",
    lead: `Ten is the number of the commandments: Moses "wrote upon the tables the words of the covenant, the ten commandments" (Exodus 34:28).`,
    count: counts(row.ten, `"Ten commandments" appears ${P.tenCommandments.kjv} times. The phrase "ten plagues" is in neither translation: the ten come from counting the plagues in Exodus 7-12. The two counts differ partly because the KJV's "tenth deal" is often "tenths" in the WEB.`),
    readings: [`ISBE: ten is "a favorite symbolic number suggestive of a rounded total". Bullinger reads it as "the perfection of Divine order".`],
  },
  {
    slug: "twelve",
    q: "What does the number 12 mean in the Bible?",
    lead: `Twelve is the number of the tribes and the apostles: "All these are the twelve tribes of Israel" (Genesis 49:28), "the names of the twelve apostles are these" (Matthew 10:2). The new Jerusalem has twelve gates and twelve foundations with their names (Revelation 21:12-14).`,
    count: counts(s12, `1 Chronicles leads because of its rosters: ${L.twelve1Chr} of its ${L.twelve1ChrAll} are in chapters 24-27 ("the twelfth to Jakim", "the twelfth captain for the twelfth month"). Revelation has ${s12.revelation.kjv}, counting the twelve thousand sealed from each tribe (Revelation 7:5-8).`),
    readings: [`ISBE: "Israelite predilection for 12 was entirely due to the traditional belief that the nation consisted of 12 tribes", so far as its author knew. Bullinger calls twelve the number of "governmental perfection".`],
  },
  {
    slug: "forty",
    q: "What does the number 40 mean in the Bible?",
    lead: `Forty in the Bible is a long stretch of testing or waiting: the flood rain fell "forty days and forty nights" (Genesis 7:12), and Moses stayed on the mountain as long (Exodus 24:18). Israel wandered "forty years" (Numbers 14:33-34), and Jesus fasted "forty days and forty nights" (Matthew 4:2).`,
    count: counts(s40, `"Forty days" appears ${P.fortyDays.kjv} times, "forty years" ${P.fortyYears.kjv} and the full "forty days and forty nights" ${P.fortyDaysAndNights.kjv}. Numbers 14:34 sets the rule for the wilderness: "each day for a year".`),
    readings: [
      `Bullinger links forty with "a period of probation, trial, and chastisement".`,
      `ISBE reads many forties as round numbers: of the flood, the fasts, the reigns and the wilderness, "it can hardly be supposed that the number in each of these cases ... was exactly 40". It suggests the idea "that 40 years constituted a generation".`,
    ],
  },
  {
    slug: "seventy",
    q: "What does the number 70 mean in the Bible?",
    lead: `Seventy is seven times ten, and the Bible uses it for the exile, the elders and the seventy Jesus sent out. Judah would serve Babylon "seventy years" (Jeremiah 25:11), Daniel hears of "Seventy weeks" (Daniel 9:24), Moses gathers "seventy men of the elders" (Numbers 11:16) and Jesus appoints "other seventy" (Luke 10:1).`,
    count: counts(row.seventy, `The WEB count is higher because the KJV often writes the seventies with "threescore": Psalm 90:10's "threescore years and ten" is the WEB's "seventy", and "threescore and twelve" is "seventy-two" (Numbers 31:38). Jesus' answer on forgiveness is "Until seventy times seven" (Matthew 18:22).`),
    readings: [`Bullinger: seventy "signifies perfect spiritual order carried out with all spiritual power and significance".`],
  },
  {
    slug: "666",
    q: "What does 666 mean in the Bible?",
    lead: `666 is "the number of the beast" in Revelation 13:18, the one verse that gives it a meaning: "it is the number of a man; and his number is Six hundred threescore and six."`,
    count: `Counted as a phrase: "six hundred threescore and six" and its KJV variants, "six hundred sixty-six" in the WEB. Both translations have ${row["666"].kjv}, one in each of four books. The other three are ordinary amounts: Solomon's gold "in one year" (1 Kings 10:14, 2 Chronicles 9:13) and "the children of Adonikam" who came back from exile (Ezra 2:13).`,
    readings: [
      `ISBE calls Revelation 13:18 the only clear case of gematria (letters read as numbers) in Scripture, and says "Nero Caesar" spelled in Hebrew letters, which adds to 666, "seems to be the best solution". The same article notes that some manuscripts read 616.`,
      `Bullinger expected the number to fit a future figure: "When the name of Antichrist is known its gematria will doubtless be found to be the number 666." He called 666 "the trinity of human perfection; the perfection of imperfection", and said most lists of names that add to 666 "are ridiculous".`,
    ],
  },
  {
    slug: "thousand",
    q: "What does the number 1,000 mean in the Bible?",
    lead: `A thousand in the Bible is often a figure for a great amount or a long time. God owns "the cattle upon a thousand hills" (Psalm 50:10), and "a thousand years in thy sight are but as yesterday" (Psalm 90:4; 2 Peter 3:8). Revelation 20 names a thousand-year reign.`,
    count: counts(row.thousand, `"Thousand years" appears ${P.thousandYears.kjv} times, ${DATA.thousandYearsRev20.kjv} of them in Revelation 20:2-7. Many of the others are tallies of people and goods (see the limits below).`),
    readings: [
      `ISBE: a thousand is "very often a literal number, but in not a few cases indefinite", citing Psalm 50:10 and 90:4. Bullinger's book has no chapter on 1,000.`,
      `On Revelation 20, Wikipedia's "Millennialism" article sums up three main Christian readings: premillennialism places Christ's return before the thousand years, postmillennialism after them, and amillennialism takes the thousand years as "metaphorically described". This page takes no side.`,
    ],
  },
];

const WORD_PAGE = { seven: "seven", twelve: "twelve", forty: "forty", 666: "666" };
const NEXT = {
  three: <>Every verse that names <Link href="/words/jonah" className={link}>Jonah</Link>.</>,
  seven: <><Link href="/seven-churches-of-revelation" className={link}>The seven churches of Revelation</Link> compares all seven letters.</>,
  ten: <><Link href="/ten-plagues-of-egypt" className={link}>The ten plagues of Egypt</Link> lists all ten with their verses.</>,
  twelve: <><Link href="/twelve-tribes-of-israel" className={link}>The twelve tribes of Israel</Link> and <Link href="/twelve-apostles" className={link}>the twelve apostles</Link>, every name with its verses.</>,
  forty: <>All {P.fortyDays.kjv} verses with <Link href="/words/forty-days" className={link}>&quot;forty days&quot;</Link>.</>,
  eight: <>Who the eight in the ark were: <Link href="/how-old-was-methuselah" className={link}>how old was Methuselah</Link>.</>,
};

export default function BiblicalNumbers() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Biblical numbers", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Biblical numbers and their meanings", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const two = DATA.ranking.kjv.find((x) => x.word === "two");
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Biblical numbers" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Biblical numbers and what they mean</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 26, 2026. Every count on this page is taken from the full text of the King James Version and the World English Bible, and every verse quoted is checked against both. The meanings are attributed to the writers who proposed them.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Seven in the KJV", value: s7.kjv, note: "with seventh and sevenfold; WEB " + s7.web },
                { label: "Sevens in Revelation", value: revShareSevens, note: `of the word "seven", in ${revShareVerses} of the verses` },
                { label: "\"Forty days\"", value: P.fortyDays.kjv, note: `KJV and WEB; "forty years" ${P.fortyYears.kjv}` },
                { label: "Commonest number word", value: "one", note: `${fmt(L.oneBare)} in the KJV; then two, ${fmt(two.count)}` },
              ]}
            />
          </div>
        </section>

        <Section id="table" title="How often does each number appear in the Bible?" intro={`Each number is counted as a word, with its ordinal and its -fold form where English has one (seven, seventh, sevenfold), every time it appears, including inside larger numbers such as "an hundred and forty and four". The top book is from the King James Version.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Number</th>
                  <th className="p-3 font-semibold">Words counted</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Most in (KJV)</th>
                </tr>
              </thead>
              <tbody>
                {DATA.table.map((r) => (
                  <tr key={r.slug} className="border-b last:border-0 align-top">
                    <td className="p-3 font-semibold tabular-nums"><a href={`#n-${r.slug}`} className={link}>{label(r.n)}</a></td>
                    <td className="p-3">{r.forms.join(", ")}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.kjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.web)}</td>
                    <td className="p-3">{r.tied.length > 1 ? `${r.tied.length} books, ${r.top.count} each` : `${r.top.book} (${r.top.count})`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Seven, twelve, forty and 666 match their word pages, which count the same forms:{" "}
            <Link href="/words/seven" className={link}>seven</Link>, <Link href="/words/twelve" className={link}>twelve</Link>, <Link href="/words/forty" className={link}>forty</Link> and <Link href="/words/666" className={link}>666</Link>. For 70 the KJV count adds the phrase &quot;threescore and ten&quot;. The two translations differ where they word a number differently, as with the KJV&apos;s &quot;threescore&quot; and &quot;tenth deal&quot;.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Method: whole-word matches over every verse of the KJV ({fmt(DATA.verses.kjv)} verses) and the WEB ({fmt(DATA.verses.web)}), capital letters ignored; a hyphenated number such as forty-two counts its parts. The build checks each of the {keyCount} key verses below in both texts and stops if one lacks the words it is quoted for.</p>
        </Section>

        {SECTIONS.map((s, i) => {
          const r = row[s.slug];
          return (
            <Section key={s.slug} id={`n-${s.slug}`} title={s.q} muted={i % 2 === 0}>
              <p className="leading-relaxed">{s.lead}</p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed">
                {K[s.slug].map((v) => (
                  <li key={v.ref + v.what} className="rounded-lg border bg-card px-4 py-2">
                    <span className="font-medium">{v.what}:</span> &quot;{v.kjv}&quot; <span className="text-muted-foreground whitespace-nowrap">({v.ref}, KJV)</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.count}</p>
              <h3 className="mt-5 font-semibold">What interpreters read into {label(r.n)}</h3>
              {s.readings.map((t) => (
                <p key={t} className="mt-2 leading-relaxed">{t}</p>
              ))}
              {WORD_PAGE[s.slug] || NEXT[s.slug] ? (
                <p className="mt-3 text-sm">
                  {WORD_PAGE[s.slug] ? <>Every verse, book by book: <Link href={`/words/${WORD_PAGE[s.slug]}`} className={link}>{s.slug === "666" ? "666" : `the word ${s.slug}`}</Link>. </> : null}
                  {NEXT[s.slug] || null}
                </p>
              ) : null}
            </Section>
          );
        })}

        <Section id="gods-number" title="What is God's number in the Bible?">
          <p className="leading-relaxed">
            The Bible does not name any number as God&apos;s. The idea comes from interpreters, and they do not agree on one. Bullinger writes that &quot;three denotes divine perfection&quot; and &quot;seven denotes spiritual perfection&quot;. Easton&apos;s Bible Dictionary says seven &quot;has been called the symbol of perfection&quot;. Bullinger ties one to God as well (&quot;So with the Deity&quot;), from Deuteronomy 6:4: &quot;The LORD our God is one LORD&quot;. What the text does show is that seven is tied to God&apos;s own rest (Genesis 2:2-3), and the Sabbath commandment repeats it: &quot;the seventh day is the sabbath of the LORD thy God&quot; (Exodus 20:10).
          </p>
        </Section>

        <Section id="most" title="Which number appears most in the Bible?" muted>
          <p className="leading-relaxed">
            &quot;One&quot; is the most frequent number word in the Bible, {fmt(L.oneBare)} times in the King James Version, but it is also a pronoun, so many of those are not counts. Of the words that are always numbers, &quot;two&quot; comes first. The top eight cardinal number words in the KJV:
          </p>
          <ol className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {DATA.ranking.kjv.map((x, i) => (
              <li key={x.word} className="rounded-lg border bg-card px-3 py-2">
                <span className="text-muted-foreground">{i + 1}.</span> {x.word} <span className="tabular-nums font-semibold">{fmt(x.count)}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">Bare words only, no ordinals. &quot;Hundred&quot; and &quot;thousand&quot; rank high because of the Bible&apos;s tallies of people, animals and money. In the WEB the order is {DATA.ranking.web.slice(0, 5).map((x) => x.word).join(", ")}.</p>
        </Section>

        <Section id="limits" title="What can a count tell you, and what can't it?">
          <p className="leading-relaxed">
            A count measures how often a word appears, not what it means. Reading meanings into numbers is interpretation; the Bible itself never sets out a number code. Many of the Bible&apos;s numbers are ordinary records, and the books where they cluster show it.
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-2 leading-relaxed">
            <li>Of the KJV&apos;s {fmt(L.thousandKjv)} uses of &quot;thousand&quot;, {L.thousandInTallyBooks} ({pct(L.thousandInTallyBooks, L.thousandKjv)}) are in Numbers and 1 and 2 Chronicles, books of census lists and army rolls. Numbers 1, 2 and 26, the two wilderness censuses, hold {L.census} on their own, down to totals such as &quot;six hundred thousand and three thousand and five hundred and fifty&quot; (Numbers 1:46).</li>
            <li>&quot;One&quot; leads in Numbers because the same gift list repeats for twelve days in chapter 7 ({L.oneNum7} uses in that chapter), and twelve leads in 1 Chronicles because of rosters of priests, singers and army courses.</li>
            <li>Leviticus has the most sevens ({L.sevenLev}), in its laws: &quot;seven days&quot; alone appears {L.sevenDaysLev} times there. Revelation&apos;s sevens are fewer but packed into a short book.</li>
            <li>Counts depend on the text and the method. Bullinger wrote in 1894 that &quot;seven&quot; occurs {B.his.seven} times in the Old Testament, &quot;seventh&quot; {B.his.seventh} and &quot;seventy&quot; {B.his.seventy}, and drew meaning from those totals being multiples of seven. The King James Old Testament has {B.ours.kjv.seven}, {B.ours.kjv.seventh} and {B.ours.kjv.seventy}. He does not say which text he counted.</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            The older reference works say as much. ISBE accepts that some numbers carry symbolic weight but warns that &quot;some writers have gone too far in their speculations on the subject&quot;. It adds that &quot;there are many places in which the round and the symbolic uses of a number cannot be sharply distinguished.&quot; Easton notes that seven is also &quot;used for any round number&quot;. Read the meanings above as one tradition of reading, set beside the verses so you can check them.
          </p>
        </Section>

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every count, quotation and verse reference on this page, counted and checked by scripts/lists/biblical-numbers.mjs from the text at github.com/seven1m/open-bibles (counted {DATA.generated}).</li>
            <li>E. W. Bullinger, <a href={BULL_URL} className={link}>Number in Scripture: Its Supernatural Design and Spiritual Significance</a> (London, 1894), scan at the Internet Archive (<a href={BULL_TXT} className={link}>full text</a>). Supports the readings of 1 to 10, 12, 40, 70 and 666 quoted above, and his Old Testament counts of seven. Read 2026-10-26.</li>
            <li>M. G. Easton, <a href={EASTON_URL} className={link}>Easton&apos;s Bible Dictionary (1897), entry &quot;Seven&quot;</a>, at Bible Study Tools: seven as &quot;the symbol of perfection, and also the symbol of rest&quot;, and its use as a round number. Easton&apos;s has no general entry for &quot;Number&quot; (see <a href={EASTON_N_URL} className={link}>its N entries at the Christian Classics Ethereal Library</a>). Read 2026-10-26.</li>
            <li>William Taylor Smith, <a href={ISBE_URL} className={link}>&quot;Number&quot;, International Standard Bible Encyclopedia (1915)</a>, at Bible Study Tools: the readings of 3, 4, 5, 7, 10, 12, 40 and 1,000, round numbers, gematria, Nero Caesar and the 616 reading of Revelation 13:18. Read 2026-10-26.</li>
            <li><a href={MILL_URL} className={link}>Wikipedia, &quot;Millennialism&quot;</a>: the three main Christian readings of Revelation 20&apos;s thousand years. Read 2026-10-26.</li>
          </ul>
        </Section>

        <FaqSection title="Questions about numbers in the Bible" faqs={faqs} />

        <Section>
          <p className="mb-4">
            More counts from the same two texts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>. The books where the numbers cluster have their own pages: <Link href="/books/revelation" className={link}>Revelation</Link>, <Link href="/books/leviticus" className={link}>Leviticus</Link> and <Link href="/books/numbers" className={link}>Numbers</Link>. The seventh day has a word page too, <Link href="/words/sabbath" className={link}>sabbath</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
