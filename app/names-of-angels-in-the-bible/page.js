import { OG_VIDEOS } from "@/lib/og-video";
/* Names of angels in the Bible: Michael and Gabriel, the only holy angels the 66 books name; Abaddon/Apollyon, the angel
   of the abyss; Lucifer and Satan, the names readers add; Raphael and Uriel, named only outside the KJV and WEB; and the
   kinds of angels (archangel, cherubim, seraphim, watchers, the angel of the LORD), each counted in the KJV and WEB.
   Counted by scripts/lists/names-of-angels-in-the-bible.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/names-of-angels-in-the-bible.json";
import { getWord, fmt, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/names-of-angels-in-the-bible`;
const C = DATA.counts;
const A = C.angel;
const M = C.michael;
const L = DATA.angelOfLord;
const N = (name) => DATA.names.find((r) => r.name === name);
const K = (name) => DATA.kinds.find((r) => r.name === name);
const andList = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const STATUS = { named: "Named in the Bible", readings: "Readings differ", outside: "Outside the 66 books" };

const SRC = {
  mikael: "https://biblehub.com/hebrew/4317.htm",
  gabriel: "https://biblehub.com/hebrew/1403.htm",
  abaddon: "https://biblehub.com/hebrew/11.htm",
  helel: "https://biblehub.com/hebrew/1966.htm",
  satan: "https://biblehub.com/hebrew/7854.htm",
  malak: "https://biblehub.com/hebrew/4397.htm",
  aggelos: "https://biblehub.com/greek/32.htm",
  archaggelos: "https://biblehub.com/greek/743.htm",
  raphaelCE: "https://www.newadvent.org/cathen/12640b.htm",
  tobit: "https://en.wikipedia.org/wiki/Book_of_Tobit",
  uriel: "https://en.wikipedia.org/wiki/Uriel",
  esdras: "https://en.wikipedia.org/wiki/2_Esdras",
  michaelWiki: "https://en.wikipedia.org/wiki/Michael_(archangel)",
  lucifer: "https://en.wikipedia.org/wiki/Lucifer",
  angelOfLord: "https://en.wikipedia.org/wiki/Angel_of_the_Lord",
  shem: "https://en.wikipedia.org/wiki/Shem_HaMephorash",
};

const METHOD_TEXT =
  "Counted by Bible Says About from the full public-domain text of the King James Version (1769 edition) and the World English Bible, verse text only, 66 books. A count is every whole-word use in a verse, so a verse with two uses counts twice; \"angel\" includes angel, angels and angel's. Name rows count the verses that hold the name. Books outside the 66 (Tobit, 2 Esdras, 1 Enoch) are not in either text and are described from the sources listed.";

const TITLE = "Names of Angels in the Bible: Only 2 Holy Angels Are Named";
const ANSWER = `The Bible names only two holy angels: Michael, the archangel (Daniel, Jude, Revelation), and Gabriel, who brings messages to Daniel, Zechariah and Mary. A third name belongs to the angel of the abyss, Abaddon or Apollyon (Revelation 9:11). Raphael and Uriel are named only in Tobit, 2 Esdras and 1 Enoch, outside the 66 books.`;
const OWNED = `By Bible Says About's count of both full texts (November 2, 2026), the word angel appears ${A.kjv.total} times in the King James Version and ${A.web.total} in the World English Bible, most in ${A.kjv.top.book} (${A.kjv.top.count} KJV). The name Michael is in ${M.all} verses, but only ${M.angel} of them are the angel; the other ${M.men} are men in Israel's lists.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Only Michael and Gabriel are named. The angel of the abyss, Lucifer, Raphael and Uriel explained, with KJV and WEB counts: angel appears ${A.kjv.total} times (KJV).`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  {
    q: "What are the names of the angels in the Bible?",
    a: `The 66-book Bible names two holy angels, Michael and Gabriel, and gives the angel of the bottomless pit the names Abaddon (Hebrew) and Apollyon (Greek) in Revelation 9:11. Raphael is named in the Book of Tobit and Uriel in 2 Esdras and 1 Enoch; those books are in some Catholic and Orthodox Bibles, not in the King James Version's 66 books or the World English Bible counted here.`,
  },
  {
    q: "How many angels are named in the Bible?",
    a: `Two holy angels by name, Michael and Gabriel, plus Abaddon/Apollyon, the angel of the abyss, for three names given to angels in the 66 books. Michael appears in ${M.angel} verses as the angel (Daniel 10:13, 10:21 and 12:1, Jude 9, Revelation 12:7) and Gabriel in 4 (Daniel 8:16 and 9:21, Luke 1:19 and 1:26).`,
  },
  {
    q: "Is Lucifer an angel's name in the Bible?",
    a: `Lucifer appears once, in the King James Version of Isaiah 14:12, "O Lucifer, son of the morning". The World English Bible reads "morning star, son of the dawn". The chapter is a taunt "against the king of Babylon" (Isaiah 14:4). Wikipedia notes that Lucifer was the Roman name for the morning star and that Christian tradition later made it a name for the devil.`,
  },
  {
    q: "Who are the seven archangels?",
    a: `The Bible's 66 books call only Michael an archangel, and use the word just twice (1 Thessalonians 4:16 and Jude 9). The list of seven comes from 1 Enoch, which names Uriel, Raphael, Raguel, Michael, Sariel, Gabriel and Remiel, per Wikipedia's article on Michael. In Tobit 12:15, Raphael calls himself one of the seven who stand before the Lord.`,
  },
  {
    q: "What are the 72 names of angels?",
    a: `They are not in the Bible. The 72 three-letter names come from Kabbalah: Wikipedia's article on the Shem HaMephorash says they are derived from Exodus 14:19-21, three Hebrew verses read letter by letter. Those verses name no angel; the only angel in them is "the angel of God" (Exodus 14:19). The 66 books name two holy angels, Michael and Gabriel.`,
  },
  {
    q: "What is the difference between cherubim and seraphim?",
    a: `Cherubim guard the way to the tree of life (Genesis 3:24), are shaped in gold on the ark's cover and carry God's throne in Ezekiel's visions; the word appears ${K("Cherub, cherubim").kjv} times in the KJV. Seraphim appear only in Isaiah 6:2 and 6:6, six-winged beings above the throne who cry "Holy, holy, holy". Neither word is a personal name.`,
  },
  {
    q: "How many times is angel mentioned in the Bible?",
    a: `${A.kjv.total} times in the King James Version (${A.kjv.ot} Old Testament, ${A.kjv.nt} New) and ${A.web.total} in the World English Bible, counting angel, angels and angel's. ${A.kjv.top.book} has the most, ${A.kjv.top.count} in the KJV. The phrase "the angel of the LORD" adds ${L.kjv.total} KJV uses, which the WEB writes as "Yahweh's angel" in the Old Testament.`,
  },
];

export default function NamesOfAngels() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Names of angels in the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Names of angels in the Bible: who is named, where, and how often", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const bookLink = (slug, label) => <Link href={`/books/${slug}`} className={link}>{label}</Link>;
  const ext = (href, label) => <a href={href} className={link} rel="noopener">{label}</a>;
  const quotes = (vs) => (
    <div className="mt-4 space-y-3">
      {vs.map((v) => (
        <div key={v.ref} className="rounded-xl border bg-card p-4">
          <div className="font-semibold">{v.ref}</div>
          <p className="mt-1 text-sm leading-relaxed">KJV: {v.kjv}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">WEB: {v.web}</p>
        </div>
      ))}
    </div>
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Names of angels in the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Names of Angels in the Bible</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Updated November 2, 2026. Counts are from the King James Version (KJV) and the World English Bible (WEB), 66 books. Every use of the word, verse by verse, is on the word page for {wordLink("angels", "angels")}.
              </p>
            </div>
            <StatTiles
              stats={[
                { label: "Holy angels named", value: C.holyNamed, note: "Michael and Gabriel" },
                { label: "\"Angel\" (KJV)", value: A.kjv.total, note: `${A.kjv.ot} Old Testament, ${A.kjv.nt} New` },
                { label: "\"Angel\" (WEB)", value: A.web.total, note: `most in ${A.web.top.book} (${A.web.top.count})` },
                { label: "Michael verses", value: M.all, note: `${M.angel} the angel, ${M.men} men` },
              ]}
            />
          </div>
        </section>

        <Section
          id="names"
          title="Every name the Bible gives an angel, and the names readers add"
          intro={`The table lists ${DATA.names.length} names: the ${C.namedInCanon} the 66 books give to angels, the 2 that readers often take as angels' names, and the 2 that are found only in books outside the 66. Counts are verses that hold the name.`}
        >
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Where</th>
                </tr>
              </thead>
              <tbody>
                {DATA.names.map((r) => (
                  <tr key={r.n} className="border-b last:border-0 align-top">
                    <td className="p-3 min-w-[16rem]">
                      <div className="font-medium">{r.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Meaning: {r.meaning}. Called {r.title}. {r.note}
                      </div>
                    </td>
                    <td className="p-3">{STATUS[r.status]}</td>
                    <td className="p-3 text-right tabular-nums">{r.kjv}</td>
                    <td className="p-3 text-right tabular-nums">{r.web}</td>
                    <td className="p-3 min-w-[9rem]">{r.refs.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Satan&apos;s row counts every verse with the word ({fmt(C.satan.kjv)} KJV, most in {C.satan.kjvTop.book}), not only those about angels. Meanings are from Strong&apos;s Hebrew entries on Bible Hub for {ext(SRC.mikael, "Michael")}, {ext(SRC.gabriel, "Gabriel")}, {ext(SRC.abaddon, "Abaddon")}, {ext(SRC.helel, "helel")} and {ext(SRC.satan, "satan")}, and Wikipedia for Raphael and Uriel.
          </p>
        </Section>

        <Section id="michael" title="Michael: the archangel, in 5 of the 15 Michael verses" muted>
          <p className="leading-relaxed">
            Michael is the only angel the Bible calls an archangel (Jude 9). His name means &quot;who is like God?&quot;, and {ext(SRC.mikael, "Strong's Hebrew 4317")} gives it as &quot;the name of an archangel and of nine Israelites&quot;. Daniel calls him &quot;one of the chief princes&quot;, &quot;your prince&quot; and &quot;the great prince which standeth for the children of thy people&quot;. Jude has him dispute with the devil over the body of Moses, and in Revelation he and his angels fight the dragon.
          </p>
          <p className="mt-4 leading-relaxed font-medium">{OWNED}</p>
          {quotes(DATA.michael)}
          <p className="mt-4 leading-relaxed">
            The other {M.men} Michael verses are {andList(M.menRefs)}: fathers and sons in tribal lists, a son of King Jehoshaphat (2 Chronicles 21:2) and a returning exile&apos;s father (Ezra 8:8). Every use is on the word page for {wordLink("michael", "Michael")}, and the book page for {bookLink("daniel", "Daniel")} has the chapters.
          </p>
        </Section>

        <Section id="gabriel" title="Gabriel: four verses, two books">
          <p className="leading-relaxed">
            Gabriel appears in 4 verses in both translations, every one about the angel. In Daniel he explains visions; in Luke he tells Zechariah that he &quot;stand[s] in the presence of God&quot; and is sent to Mary in Nazareth. Luke 1:26 is the only verse that calls him &quot;the angel Gabriel&quot;; Daniel 9:21 calls him &quot;the man Gabriel&quot;. {ext(SRC.gabriel, "Strong's Hebrew 1403")} gives the name&apos;s meaning as &quot;man of God&quot;; it is also often read as &quot;God is my strength&quot;.
          </p>
          {quotes(DATA.gabriel)}
          <p className="mt-4 leading-relaxed">Every use is on the word page for {wordLink("gabriel", "Gabriel")}; his announcements open {bookLink("luke", "the Gospel of Luke")}.</p>
        </Section>

        <Section id="abaddon" title="Abaddon and Apollyon: the angel of the abyss" muted>
          <p className="leading-relaxed">
            Revelation 9:11 gives the third name the Bible attaches to an angel: the king of the locusts is &quot;the angel of the bottomless pit&quot; (WEB &quot;the angel of the abyss&quot;), named Abaddon in Hebrew and Apollyon in Greek. {ext(SRC.abaddon, "Strong's Hebrew 11")} defines abaddon as &quot;a perishing&quot;, and the King James Version translates the same Hebrew word &quot;destruction&quot; elsewhere. The World English Bible keeps the name Abaddon as a place in {andList(C.abaddon.place)}, so it has {C.abaddon.web.length} Abaddon verses to the KJV&apos;s {C.abaddon.kjv.length}.
          </p>
          {quotes([DATA.abaddon])}
        </Section>

        <Section id="lucifer-and-satan" title="Lucifer and Satan: is either an angel's name?">
          <p className="leading-relaxed">
            Lucifer is in one verse of the King James Version and none of the World English Bible. Isaiah 14:12 is addressed in the chapter to &quot;the king of Babylon&quot; (14:4). {ext(SRC.helel, "Strong's Hebrew 1966")} gives the Hebrew word, helel, as &quot;morning star&quot; or &quot;shining one&quot;, and {ext(SRC.lucifer, "Wikipedia's article on Lucifer")} says Lucifer was the Roman name for the morning star and later became a Christian name for the devil. Both readings are held: some read the verse only of the king, others of Satan&apos;s fall as well.
          </p>
          {quotes([DATA.lucifer])}
          <p className="mt-4 leading-relaxed">
            Satan means adversary ({ext(SRC.satan, "Strong's Hebrew 7854")}). The Bible never calls him an angel by name, but Revelation 12:9 says &quot;his angels were cast out with him&quot;, and 2 Corinthians 11:14 says he is &quot;transformed into an angel of light&quot;. See the word pages for {wordLink("satan", "Satan")}, {wordLink("devil", "devil")} and {wordLink("lucifer", "Lucifer")}.
          </p>
          {quotes([DATA.satanRev, DATA.angelOfLight])}
        </Section>

        <Section id="raphael-and-uriel" title="Raphael and Uriel: named outside the 66 books" muted>
          <p className="leading-relaxed">
            Raphael is named in the Book of Tobit, where he travels with Tobias as a man named Azarias and then reveals himself, in the words of the {ext(SRC.raphaelCE, "Catholic Encyclopedia")}, as &quot;the angel Raphael, one of the seven, who stand before the Lord&quot; (Tobit 12:15). {ext(SRC.tobit, "Wikipedia")} says Tobit is deuterocanonical for Catholic and Orthodox Christians and Apocrypha for Protestants, so it is not among the 66 books counted here.
          </p>
          <p className="mt-4 leading-relaxed">
            Uriel is the angel sent to answer Ezra in 2 Esdras (4:1, 5:20 and 10:28, per {ext(SRC.uriel, "Wikipedia's Uriel article")}). {ext(SRC.esdras, "Wikipedia's 2 Esdras article")} says Catholics and Protestants count that book among the Apocrypha, while the Ethiopian Orthodox Church has it in its canon. 1 Enoch lists seven archangels, Uriel, Raphael, Raguel, Michael, Sariel, Gabriel and Remiel, according to {ext(SRC.michaelWiki, "Wikipedia's Michael article")}; of these only Michael and Gabriel are in the 66 books.
          </p>
        </Section>

        <Section
          id="kinds"
          title="Kinds of angels: archangel, cherubim, seraphim, watchers"
          intro="Besides names, the Bible uses words for kinds of heavenly beings. None of these is a personal name; each is counted below in both translations."
        >
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Word</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Key verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.kinds.map((k) => (
                  <tr key={k.name} className="border-b last:border-0 align-top">
                    <td className="p-3 min-w-[16rem]">
                      <div className="font-medium">{k.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {k.what}
                        {k.note ? ` ${k.note}.` : ""}
                      </div>
                    </td>
                    <td className="p-3 text-right tabular-nums">{fmt(k.kjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(k.web)}</td>
                    <td className="p-3 whitespace-nowrap">{k.key.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Both words for angel mean messenger: Hebrew {ext(SRC.malak, "malak")} and Greek {ext(SRC.aggelos, "angelos")}, which Strong&apos;s also gives for human messengers. Archangel, Greek archangelos, is &quot;a chief angel&quot; ({ext(SRC.archaggelos, "Strong's Greek 743")}). The King James Version spells the plural &quot;cherubims&quot; {C.cherubimsKjv} times, a double plural the WEB writes as cherubim. The watchers appear only in {andList(C.watcherRefs)}. Every cherubim verse is on the word page for {wordLink("cherubim", "cherubim")}.
          </p>
        </Section>

        <Section id="angel-of-the-lord" title="Who is the angel of the LORD?" muted>
          <p className="leading-relaxed">
            The angel of the LORD is an unnamed figure who speaks as God in several scenes: he finds Hagar, speaks from the burning bush, and tells Manoah his name is &quot;secret&quot; (WEB &quot;incomprehensible&quot;). The King James Version has the phrase {L.kjv.total} times, {L.kjv.ot} in the Old Testament and {L.kjv.nt} in the New; the World English Bible writes &quot;Yahweh&apos;s angel&quot; {L.web.yahweh} times in the Old Testament and &quot;an angel of the Lord&quot; or &quot;the angel of the Lord&quot; {L.web.lordNT} times in the New. {ext(SRC.angelOfLord, "Wikipedia's article")} gives the range of readings: some take him as a created angel, others as an appearance of God, and some as Christ before his birth.
          </p>
          {quotes(L.verses)}
        </Section>

        <Section id="limits" title="What do these counts leave out?">
          <p className="leading-relaxed">
            The counts match English words, so they miss angels described without the word, such as the three men who visit Abraham in Genesis 18 (two of them are called angels in Genesis 19:1) and the &quot;man clothed in linen&quot; of Daniel 10:5. They also include uses that may mean human messengers: the &quot;angel of the church&quot; in each of Revelation 2 and 3 is read as an angel by some and as a church leader by others. Whether the angel of the LORD is an angel, and whether Isaiah 14 is about Satan, are questions of interpretation that a count cannot settle.
          </p>
        </Section>

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/names-of-angels-in-the-bible.mjs (read and counted {DATA.generated}).</li>
            <li>Bible Hub, Strong&apos;s Hebrew {ext(SRC.mikael, "4317 Mikael")}, {ext(SRC.gabriel, "1403 Gabriel")}, {ext(SRC.abaddon, "11 abaddon")}, {ext(SRC.helel, "1966 helel")}, {ext(SRC.satan, "7854 satan")} and {ext(SRC.malak, "4397 malak")}, and Strong&apos;s Greek {ext(SRC.aggelos, "32 angelos")} and {ext(SRC.archaggelos, "743 archangelos")}: meanings of the names and words (read 2026-11-02).</li>
            <li>{ext(SRC.raphaelCE, "Catholic Encyclopedia, \"St. Raphael the Archangel\"")} (New Advent): Tobit 12:15 (read 2026-11-02).</li>
            <li>Wikipedia, {ext(SRC.tobit, "\"Book of Tobit\"")}, {ext(SRC.esdras, "\"2 Esdras\"")}, {ext(SRC.uriel, "\"Uriel\"")}, {ext(SRC.michaelWiki, "\"Michael (archangel)\"")}, {ext(SRC.lucifer, "\"Lucifer\"")} and {ext(SRC.angelOfLord, "\"Angel of the Lord\"")} and {ext(SRC.shem, "\"Shem HaMephorash\"")}: canon status, Uriel in 2 Esdras, the seven archangels of 1 Enoch, the Roman morning star, the readings of the angel of the LORD, the 72 names of Kabbalah (read 2026-11-02).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about the names of angels" faqs={faqs} />

        <Section>
          <p className="mb-4">
            The companion lists are <Link href="/names-of-god" className={link}>the names of God</Link>, <Link href="/names-of-jesus" className={link}>the names of Jesus</Link> and <Link href="/names-of-the-holy-spirit" className={link}>the names of the Holy Spirit</Link>. Book pages: {bookLink("revelation", "Revelation")}. Word counts: {wordLink("heaven", "heaven")} and {wordLink("dragon", "dragon")}. More counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD_TEXT} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
