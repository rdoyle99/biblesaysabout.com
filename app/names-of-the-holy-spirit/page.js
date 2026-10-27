import { OG_VIDEOS } from "@/lib/og-video";
/* Names of the Holy Spirit: 27 names and titles, each counted in the KJV and WEB, with Holy Ghost vs Holy Spirit, the
   Comforter, the seven Spirits of Revelation and the pictures the Bible uses for the Spirit.
   Counted by scripts/lists/names-of-the-holy-spirit.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/names-of-the-holy-spirit.json";
import { getWord, fmt, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/names-of-the-holy-spirit`;
const rows = DATA.rows;
const C = DATA.counts;
const H = DATA.holy;
const G = DATA.ghost;
const K = DATA.caps;
const R = (name) => rows.find((r) => r.name === name);
const first = R("the Holy Ghost (Holy Spirit)");
const sog = R("the Spirit of God");
const sol = R("the Spirit of the LORD");
const alone = R("the Spirit");
const seven = R("the seven Spirits of God");
const comf = R("the Comforter");
const lowerRows = rows.filter((r) => r.kjv.lower === r.kjv.total);
const short = (ref) => ref.replace(/^Revelation /, "Rev. ").replace(/^Psalms /, "Psalm ").replace(/^(\d) Corinthians /, "$1 Cor. ");
const andList = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const refList = (refs) => andList(refs.map(short));
const revList = (refs) => `Revelation ${andList(refs.map((r) => r.replace(/^Revelation /, "")))}`;
const link = "underline underline-offset-2 hover:text-primary";
const TESTAMENT = { OT: "Old", NT: "New", Both: "Both" };

const SRC = {
  etym: "https://www.etymonline.com/word/ghost",
  etymArchive: "https://web.archive.org/web/20261010160018/https://www.etymonline.com/word/ghost",
  kjvWiki: "https://en.wikipedia.org/wiki/King_James_Version",
  luke1113: "https://biblehub.com/interlinear/luke/11-13.htm",
  matt2819: "https://biblehub.com/interlinear/matthew/28-19.htm",
  john38: "https://biblehub.com/interlinear/john/3-8.htm",
  g3875: "https://biblehub.com/greek/3875.htm",
  g4151: "https://biblehub.com/greek/4151.htm",
  rev14: "https://biblehub.com/commentaries/revelation/1-4.htm",
};

const METHOD_TEXT =
  "Counted by Bible Says About from the full public-domain text of the King James Version (1769 edition) and the World English Bible, verse text only. A name is a run of words matched in each verse and counted once per occurrence. Matching ignores capital letters except where a row says capitals decide; where the WEB words a name differently, the WEB column counts the WEB's own wording.";

const TITLE = `Names of the Holy Spirit: ${C.rows} Names and Titles in the Bible`;
const ANSWER = `The Bible calls the Holy Spirit the Spirit of God, the Spirit of the LORD, the Spirit of Christ, the Spirit of truth, the Comforter, the Spirit of adoption, the eternal Spirit and the seven Spirits of God. This page lists ${C.rows} names and titles. The King James Version says "Holy Ghost" ${H.ghostKjv} times and "Holy Spirit" ${H.spiritKjv} times.`;
const OWNED = `By Bible Says About's count of both full texts (October 25, 2026), the King James Version says "Holy Ghost" ${H.ghostKjv} times (most in ${H.ghostTop.book}, ${H.ghostTop.count}) and "Holy Spirit" only ${H.spiritKjv} times, ${H.spiritKjvOT} of them in the Old Testament. The World English Bible says "Holy Spirit" ${H.spiritWeb} times and never "Holy Ghost".`;

export const metadata = {
  title: { absolute: TITLE },
  description: `${C.rows} names and titles of the Holy Spirit with KJV and WEB counts and key verses. The KJV says Holy Ghost ${H.ghostKjv} times and Holy Spirit ${H.spiritKjv}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  {
    q: "What are the names of the Holy Spirit in the Bible?",
    a: `This page lists ${C.rows}, among them the Holy Ghost (Holy Spirit), the Spirit of God, the Spirit of the LORD, the Spirit of Christ, the Spirit of Jesus Christ, the Spirit of truth, the Comforter, the Spirit of adoption, the Spirit of life, the eternal Spirit, the Spirit of grace and the seven Spirits of God. By the King James count, ${C.byTestament.OT} are found only in the Old Testament, ${C.byTestament.NT} only in the New, and ${C.byTestament.Both} in both.`,
  },
  {
    q: "Why does the King James Bible say Holy Ghost instead of Holy Spirit?",
    a: `In older English, "ghost" meant a spirit or soul. The Online Etymology Dictionary says Old English gast meant "soul, spirit, life" in Biblical use, and that the sense "disembodied spirit of a dead person" is attested from the late 1300s. The King James Version uses both: "Holy Ghost" ${H.ghostKjv} times and "Holy Spirit" ${H.spiritKjv} times. Bible Hub's interlinears show the same two Greek words behind both, in Luke 11:13 (Holy Spirit) and Matthew 28:19 (Holy Ghost).`,
  },
  {
    q: "How many times is the Holy Spirit mentioned in the Bible?",
    a: `The phrase appears ${first.kjv.total} times in the King James Version (${H.ghostKjv} "Holy Ghost" and ${H.spiritKjv} "Holy Spirit", in ${first.kjv.verses} verses) and ${H.spiritWeb} times in the World English Bible. Other names add more: the KJV has "the Spirit of God" ${sog.kjv.total} times, "the Spirit of the LORD" ${sol.kjv.total} times and "the Spirit" standing alone ${alone.kjv.total} times.`,
  },
  {
    q: "What does Comforter mean in John 14?",
    a: `Comforter is the King James word for the Greek parakletos. Thayer's Greek Lexicon, on Bible Hub, defines it as "summoned, called to one's side, especially called to one's aid". Jesus uses it of the Holy Spirit in John 14:16, 14:26, 15:26 and 16:7, and the World English Bible translates it "Counselor" in all four. The fifth use, 1 John 2:1, is about Jesus Christ, where the KJV says "advocate".`,
  },
  {
    q: "What are the seven Spirits of God in Revelation?",
    a: `They are named in four verses, ${revList(DATA.sevenSpirits)}, and Revelation does not explain them beyond calling them seven lamps of fire (4:5) and the Lamb's seven eyes (5:6). Barnes' Notes says their meaning cannot be settled "with certainty". Matthew Poole's Commentary and the Jamieson-Fausset-Brown commentary read them as the one Holy Spirit; Poole also reports readers who take them as seven angels (Revelation 8:2).`,
  },
  {
    q: "What symbols does the Bible use for the Holy Spirit?",
    a: `The Bible uses ${DATA.symbols.length}: ${andList(DATA.symbols.map((s) => s.symbol.toLowerCase()))}. Each is tied to the Spirit in a verse: the dove at the baptism of Jesus (Matthew 3:16), tongues of fire at Pentecost (Acts 2:3), wind (John 3:8; Acts 2:2), breath (John 20:22), rivers of living water (John 7:38-39), anointing (Acts 10:38; 1 John 2:27), the seal (Ephesians 1:13) and the earnest (2 Corinthians 1:22).`,
  },
];

export default function NamesOfTheHolySpirit() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Names of the Holy Spirit", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Names of the Holy Spirit: names, titles, verses and counts", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const bookLink = (slug, label) => <Link href={`/books/${slug}`} className={link}>{label}</Link>;
  const ext = (href, label) => <a href={href} className={link} rel="noopener">{label}</a>;
  const row = (r) => (
    <tr key={r.n} className="border-b last:border-0 align-top">
      <td className="p-3 tabular-nums">{r.n}</td>
      <td className="p-3 min-w-[18rem]">
        <div className="font-medium">
          {r.name}
          {r.readings ? <span className="ml-2 rounded border px-1.5 py-0.5 text-xs font-normal text-muted-foreground">readings differ</span> : null}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          KJV: &quot;{r.kjvPhrase}&quot;{r.webPhrase ? <>. WEB: &quot;{r.webPhrase}&quot;</> : null}. {r.note}
        </div>
      </td>
      <td className="p-3">{TESTAMENT[r.testament]}</td>
      <td className="p-3 text-right tabular-nums">{fmt(r.kjv.total)}</td>
      <td className="p-3 text-right tabular-nums">{fmt(r.web.total)}</td>
      <td className="p-3 whitespace-nowrap">{short(r.key)}</td>
    </tr>
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Names of the Holy Spirit" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Names of the Holy Spirit</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Updated October 25, 2026. Counts are from the King James Version (KJV) and the World English Bible (WEB), whole Bible unless a row says otherwise. The bare count of the phrase, verse by verse, is on the word page for {wordLink("holy-spirit", "Holy Spirit")}; this page lists the names and titles.
              </p>
            </div>
            <StatTiles
              stats={[
                { label: `"Holy Ghost" (KJV)`, value: H.ghostKjv, note: `in ${H.ghostKjvVerses} verses; ${H.ghostTop.book} has ${H.ghostTop.count}` },
                { label: `"Holy Spirit" (KJV)`, value: H.spiritKjv, note: `${H.spiritKjvOT} in the Old Testament` },
                { label: `"Holy Spirit" (WEB)`, value: H.spiritWeb, note: `"Holy Ghost" ${H.ghostWeb} times` },
                { label: "Names and titles listed", value: C.rows, note: `${C.byTestament.OT} Old Testament only, ${C.byTestament.NT} New only, ${C.byTestament.Both} both (KJV)` },
              ]}
            />
          </div>
        </section>

        <Section
          id="names"
          title="Every name and title of the Holy Spirit, with counts"
          intro={`The table lists ${C.rows} names and titles the Bible gives the Holy Spirit, with how often each appears in the King James Version and the World English Bible and a key verse checked in both. ${C.readings} rows are marked "readings differ": the verse does not itself say whose spirit it is, and readers disagree on whether it names the Holy Spirit.`}
        >
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Name or title</th>
                  <th className="p-3 font-semibold">Testament (KJV)</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Key verse</th>
                </tr>
              </thead>
              <tbody>{rows.map(row)}</tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Rows overlap: Ephesians 4:30, &quot;the holy Spirit of God&quot;, counts under the first row and under the Spirit of God. &quot;Testament&quot; is where the King James Version uses the name. The Old Testament names of God are on <Link href="/names-of-god" className={link}>the names of God</Link>, and the titles of Jesus on <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>.
          </p>
        </Section>

        <Section id="holy-ghost-or-holy-spirit" title="Holy Ghost or Holy Spirit: why does the King James Version say Ghost?" muted>
          <p className="leading-relaxed">
            The King James Version says &quot;Holy Ghost&quot; because in its English &quot;ghost&quot; still meant a spirit or soul, not a phantom. The {ext(SRC.etym, "Online Etymology Dictionary")} entry for &quot;ghost&quot; says Old English <em>gast</em> meant &quot;soul, spirit, life&quot; in Biblical use, that in Christian writing it rendered Latin <em>spiritus</em>, &quot;a sense preserved in Holy Ghost&quot;, and that the sense &quot;disembodied spirit of a dead person&quot; is attested from the late 1300s. Wikipedia&apos;s {ext(SRC.kjvWiki, "King James Version")} article says the translation was published in 1611 and contains &quot;a large number of archaisms and false friends&quot;, words that look familiar but carry older meanings.
          </p>
          <p className="mt-4 leading-relaxed font-medium">{OWNED}</p>
          <p className="mt-4 leading-relaxed">
            The KJV&apos;s {H.spiritKjv} &quot;Holy Spirit&quot; verses are {refList(H.spiritKjvRefs)}. The Greek does not change between the two spellings: {ext(SRC.luke1113, "Bible Hub's interlinear for Luke 11:13")}, where the KJV says &quot;the Holy Spirit&quot;, has <em>Pneuma Hagion</em>, and {ext(SRC.matt2819, "its interlinear for Matthew 28:19")}, where the KJV says &quot;the Holy Ghost&quot;, has the same two words, <em>Hagiou Pneumatos</em>. Two verses have the phrase in the KJV but not the WEB: {refList(H.kjvOnly)}. The WEB reads &quot;the Spirit&quot; in Matthew 12:31, and its 1 John 5:7 lacks the KJV&apos;s &quot;the Father, the Word, and the Holy Ghost&quot;. One verse has it in the WEB only: {refList(H.webOnly)}, where the KJV says Jesus &quot;rejoiced in spirit&quot;.
          </p>
          <p className="mt-4 leading-relaxed">
            The King James Version itself shows the older meaning. It prints &quot;ghost&quot; {G.kjvTotal} times: {H.ghostKjv} in &quot;Holy Ghost&quot; and the other {G.otherKjv} in phrases about dying, as in &quot;Abraham gave up the ghost&quot; (Genesis 25:8) and Jesus &quot;yielded up the ghost&quot; (Matthew 27:50, WEB &quot;yielded up his spirit&quot;). The World English Bible uses &quot;ghost&quot; {G.webTotal} times, both in the modern sense: the disciples see Jesus walking on the sea and think he is a ghost ({refList(G.webRefs)}), where the KJV says &quot;a spirit&quot;. For every &quot;Holy Spirit&quot; verse, see {wordLink("holy-spirit", "the Holy Spirit word count")}.
          </p>
        </Section>

        <Section id="comforter" title="What does Comforter mean? The Paraclete in John">
          <p className="leading-relaxed">
            Comforter is the King James Version&apos;s word for the Greek <em>parakletos</em>, which {ext(SRC.g3875, "Thayer's Greek Lexicon on Bible Hub (Strong's 3875)")} defines as &quot;summoned, called to one&apos;s side, especially called to one&apos;s aid&quot;, and also &quot;one who pleads another&apos;s cause before a judge&quot;. Bible Hub notes the word occurs five times, all in John&apos;s writings: four times in John&apos;s Gospel for the Holy Spirit, and once in 1 John 2:1 for Jesus Christ, where the KJV says &quot;advocate&quot;. The World English Bible says &quot;Counselor&quot; in all five.
          </p>
          <div className="mt-5 space-y-3">
            {DATA.comforter.map((c) => (
              <div key={c.ref} className="rounded-xl border bg-card p-4">
                <div className="font-semibold">{c.ref}</div>
                <p className="mt-1 text-sm leading-relaxed">KJV: {c.kjvText}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">WEB: &quot;{c.webPhrase}&quot;</p>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-relaxed">
            John 14:16 calls him &quot;another Comforter&quot;, and two verses later Jesus says &quot;I will not leave you comfortless&quot; (WEB &quot;orphans&quot;). The King James Version also uses comforter in {refList(DATA.comforterOutsideJohn)}, for a human comforter; those {DATA.comforterOutsideJohn.length} are not counted in the table, which has {comf.kjv.total} for John. The four chapters are in {bookLink("john", "the Gospel of John")}.
          </p>
        </Section>

        <Section
          id="old-and-new-testament"
          title="Names of the Holy Spirit in the Old Testament and the New"
          intro={`The Old Testament mostly says "the Spirit of the LORD" and "the Spirit of God"; the New Testament adds the Holy Ghost, the Spirit of Christ, the Spirit of truth and the Comforter. By the King James count, ${C.byTestament.OT} of the ${C.rows} names are Old Testament only, ${C.byTestament.NT} New Testament only and ${C.byTestament.Both} appear in both.`}
          muted
        >
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>&quot;The Spirit of the LORD&quot;: {sol.kjv.ot} times in the King James Old Testament and {sol.kjv.nt} in the New, most in {sol.kjv.top.book} ({sol.kjv.top.count}), where it comes on the judges, as on Othniel in Judges 3:10. The World English Bible writes &quot;Yahweh&apos;s Spirit&quot; where the KJV prints LORD in capitals.</li>
            <li>&quot;The Spirit of God&quot;: {DATA.spiritOfGod.kjvOT} times in the King James Old Testament, from Genesis 1:2, and {DATA.spiritOfGod.kjvNT} in the New (WEB {DATA.spiritOfGod.webOT} and {DATA.spiritOfGod.webNT}, counting &quot;God&apos;s Spirit&quot;).</li>
            <li>&quot;Holy Spirit&quot; is in the Old Testament {H.spiritKjvOT} times, the same in both translations: Psalm 51:11 and Isaiah 63:10-11. &quot;Holy Ghost&quot; is never in the King James Old Testament; in the New, {bookLink("acts", "Acts")} has {H.ghostTop.count} of its {H.ghostKjv}, more than any other book.</li>
            <li>The Old Testament-only names include thy good spirit (Nehemiah 9:20) and the three pairs of Isaiah 11:2, the spirit of wisdom and understanding, of counsel and might, and of knowledge and of the fear of the LORD. Isaiah 4:4 and Zechariah 12:10 are marked &quot;readings differ&quot;. The book page for {bookLink("isaiah", "Isaiah")} has its chapters and counts.</li>
            <li>&quot;The Spirit&quot; standing alone with a capital S: {alone.kjv.ot} times in the King James Old Testament and {alone.kjv.nt} in the New. The World English Bible has it {alone.web.ot} times in the Old Testament, as in Numbers 11:25, because it capitalises verses the KJV prints with a small s.</li>
          </ul>
        </Section>

        <Section
          id="seven-spirits"
          title="What are the seven Spirits of God in Revelation?"
          intro={`The seven Spirits of God are named in four verses, ${revList(DATA.sevenSpirits)}, and Revelation does not explain them; commentators read them in more than one way.`}
        >
          <p className="leading-relaxed">
            Revelation 1:4 sends grace and peace &quot;from the seven Spirits which are before his throne&quot;, alongside God and Jesus Christ. Revelation 3:1 says Christ &quot;hath the seven Spirits of God, and the seven stars&quot;, the message to the church in Sardis (see <Link href="/seven-churches-of-revelation" className={link}>the seven churches of Revelation</Link>). Revelation 4:5 calls seven lamps of fire before the throne &quot;the seven Spirits of God&quot;, and Revelation 5:6 says the Lamb&apos;s seven eyes &quot;are the seven Spirits of God sent forth into all the earth&quot;. Zechariah 4 has seven lamps (4:2) and seven that &quot;are the eyes of the LORD, which run to and fro through the whole earth&quot; (4:10).
          </p>
          <p className="mt-4 leading-relaxed">The commentaries collected on {ext(SRC.rev14, "Bible Hub's page for Revelation 1:4")} give these readings:</p>
          <ul className="mt-3 list-disc pl-5 space-y-2 leading-relaxed">
            <li>Barnes&apos; Notes says &quot;it is still impossible to determine with certainty its meaning&quot;, and lists the main opinions, starting with the view that it refers to God himself.</li>
            <li>Matthew Poole&apos;s Commentary reports: &quot;Some think they are seven angels&quot;, pointing to the seven angels &quot;which stood before God&quot; in Revelation 8:2, and to Zechariah 4:2 and 4:10.</li>
            <li>Poole himself reads them as the Holy Ghost, &quot;who, though but one spiritual Being, yet exerteth his influence many ways&quot;. The Jamieson-Fausset-Brown commentary reads them as &quot;The Holy Spirit in His sevenfold (that is, perfect, complete, and universal) energy&quot;, and the Geneva Study Bible note reads &quot;from the Holy Spirit&quot;.</li>
          </ul>
          <p className="mt-4 leading-relaxed">The phrase has a capital S in all {seven.kjv.total} verses in both translations. The book page for {bookLink("revelation", "Revelation")} has its chapters and counts.</p>
        </Section>

        <Section
          id="symbols"
          title="What symbols does the Bible use for the Holy Spirit?"
          intro={`The Bible sets the Spirit beside ${DATA.symbols.length} pictures: ${andList(DATA.symbols.map((s) => s.symbol.toLowerCase()))}. Each card quotes the verses that make the link, in the King James Version with the World English Bible wording below.`}
          muted
        >
          <div className="space-y-3">
            {DATA.symbols.map((s) => (
              <div key={s.symbol} className="rounded-xl border bg-card p-4">
                <div className="font-semibold">{s.symbol}</div>
                {s.verses.map((v) => (
                  <div key={v.ref} className="mt-2">
                    <p className="text-sm leading-relaxed">
                      <span className="font-medium">{v.ref} (KJV):</span> {v.kjvText}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">WEB: &quot;{v.webPhrase}&quot;</p>
                  </div>
                ))}
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            In John 3:8 the same Greek word is translated both ways: {ext(SRC.john38, "Bible Hub's interlinear for John 3:8")} shows <em>pneuma</em> for &quot;wind&quot; at the start of the verse and <em>Pneumatos</em> for &quot;the Spirit&quot; at the end, and {ext(SRC.g4151, "its entry for Strong's 4151")} gives the word&apos;s first sense as &quot;a current of air, i.e. breath (blast) or a breeze&quot;. The Spirit&apos;s gifts are on <Link href="/gifts-of-the-spirit" className={link}>the gifts of the Spirit</Link> and its fruit on <Link href="/fruit-of-the-spirit" className={link}>the fruit of the Spirit</Link>.
          </p>
        </Section>

        <Section
          id="capital-s"
          title="Spirit or spirit: who decides the capital S?"
          intro={`The translators do: the capital S is their choice, not a fixed part of the name. The King James Version prints "Spirit" with a capital ${K.kjv.cap} times and "spirit" in lower case ${K.kjv.lower} times; the World English Bible prints ${K.web.cap} and ${K.web.lower}.`}
        >
          <p className="leading-relaxed">
            The same words can go either way in one translation. The King James Version prints Joel 2:28 as &quot;I will pour out my spirit upon all flesh&quot; and Peter&apos;s quotation of it in Acts 2:17 as &quot;I will pour out of my Spirit upon all flesh&quot;. The World English Bible capitalises both. In {K.webCapOnly} verses the World English Bible has a capital Spirit where the King James Version has only a small s ({K.webCapOnlyOT} of them in the Old Testament, such as Genesis 6:3, &quot;My spirit shall not always strive with man&quot;); the reverse happens in {K.kjvCapOnly} verses. &quot;My Spirit&quot; with a capital is {K.mySpirit.kjv} times in the KJV and {K.mySpirit.web} in the WEB. {lowerRows.length} rows in the table (numbers {andList(lowerRows.map((r) => r.n))}) are printed in lower case every time in the KJV. For every use of the word, see {wordLink("spirit", "spirit")}.
          </p>
        </Section>

        <Section id="limits" title="What do these counts leave out?" muted>
          <p className="leading-relaxed">
            They leave out every verse that refers to the Spirit by &quot;he&quot;, &quot;it&quot; or a lower-case &quot;my spirit&quot; without a title, since the counts match English words. Raw rows such as the Spirit of God and the Spirit of the LORD include a few verses where the words may mean breath, which the notes name. The list itself is a choice: this page includes a phrase when a verse uses it of God&apos;s Spirit, or when it is often read that way, and marks the second kind &quot;readings differ&quot;. Doctrines about the Spirit, such as the Trinity, are taught from these verses in different ways by different traditions, and are outside what a count can show.
          </p>
        </Section>

        <FaqSection title="Questions about the names of the Holy Spirit" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/lists/names-of-the-holy-spirit.mjs (read and counted {DATA.generated}).</li>
            <li>{ext(SRC.etym, "Online Etymology Dictionary, \"ghost (n.)\"")}: Old English gast, its Biblical sense and the late-1300s sense of a dead person&apos;s spirit (read 2026-10-25 from the {ext(SRC.etymArchive, "Internet Archive copy of October 10, 2026")}, as the live page refused automated reading).</li>
            <li>{ext(SRC.kjvWiki, "Wikipedia, \"King James Version\"")}: published in 1611; its archaisms and false friends (read 2026-10-25).</li>
            <li>{ext(SRC.luke1113, "Bible Hub, Luke 11:13 interlinear")} and {ext(SRC.matt2819, "Matthew 28:19 interlinear")}: the Greek behind &quot;Holy Spirit&quot; and &quot;Holy Ghost&quot; (read 2026-10-25).</li>
            <li>{ext(SRC.g3875, "Bible Hub, Strong's Greek 3875, parakletos")}: Thayer&apos;s definition and the five occurrences (read 2026-10-25).</li>
            <li>{ext(SRC.john38, "Bible Hub, John 3:8 interlinear")} and {ext(SRC.g4151, "Strong's Greek 4151, pneuma")}: wind and Spirit in John 3:8 (read 2026-10-25).</li>
            <li>{ext(SRC.rev14, "Bible Hub, commentaries on Revelation 1:4")}: Barnes&apos; Notes, Matthew Poole&apos;s Commentary, Jamieson-Fausset-Brown and the Geneva Study Bible on the seven Spirits (read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            The companion lists are <Link href="/names-of-god" className={link}>the names of God</Link> and <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>. What the Spirit gives is on <Link href="/gifts-of-the-spirit" className={link}>the gifts of the Spirit</Link> and <Link href="/fruit-of-the-spirit" className={link}>the fruit of the Spirit</Link>. Book pages: {bookLink("john", "John")}, {bookLink("acts", "Acts")}, {bookLink("isaiah", "Isaiah")} and {bookLink("revelation", "Revelation")}. Word counts: {wordLink("holy-spirit", "Holy Spirit")}, {wordLink("spirit", "spirit")}, {wordLink("dove", "dove")} and {wordLink("wind", "wind")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD_TEXT} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
