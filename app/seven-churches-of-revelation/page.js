import { OG_VIDEOS } from "@/lib/og-video";
/* The seven churches of Revelation: the seven letters of Revelation 2-3 in the order of Revelation 1:11, with each
   letter's verses and words, how Jesus is described, what is praised and rebuked, the promise to the overcomer, and
   where the cities were. Counted and checked by scripts/lists/seven-churches-of-revelation.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/seven-churches-of-revelation.json";
import { getWord, fmt, books, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/seven-churches-of-revelation`;
const rows = DATA.rows;
const T = DATA.totals;
const S = DATA.seven;
const C = DATA.church;
const lowerFirst = (t) => t[0].toLowerCase() + t.slice(1);
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const by = (name) => rows.find((r) => r.name === name);
const names = joinAnd(rows.map((r) => r.name));
const noRebuke = rows.filter((r) => !r.rebuke).map((r) => r.name);
const noPraise = rows.filter((r) => !r.praise).map((r) => r.name);
const L = DATA.longest;
const Sh = DATA.shortest;
const laodicea = by("Laodicea");
const ephesus = by("Ephesus");
const thyatira = by("Thyatira");
const onlyRev = rows.filter((r) => !r.namedOutside.length).map((r) => r.name);
const WIKI_LIST = "https://en.wikipedia.org/wiki/Seven_churches_of_Asia";
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = "The 7 Churches of Revelation: All 7 Letters Compared";
const ANSWER = `The seven churches of Revelation are ${names}, the "seven churches which are in Asia" named in Revelation 1:11. Each gets its own letter from Jesus in Revelation 2 and 3, ${T.verses} verses in all. ${joinAnd(noRebuke)} are the only two with no rebuke, and ${noPraise[0]}, the "lukewarm" church, is the only one with no praise.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 7 churches of Revelation in order, with each letter's verses, words, praise, rebuke and promise checked against the KJV, and where the seven cities stood.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the seven churches of Revelation?", a: `${names}. Revelation 1:11 lists them in that order, and John is told to "send it unto the seven churches which are in Asia". The letters to them fill Revelation 2:1 to 3:22.` },
  { q: "Which churches had no rebuke?", a: `${joinAnd(noRebuke)}. Neither letter has the words "against thee" or any call to repent. Smyrna is told "be thou faithful unto death, and I will give thee a crown of life" (Revelation 2:10), and Philadelphia "thou hast a little strength, and hast kept my word" (Revelation 3:8).` },
  { q: "Which church was lukewarm?", a: `Laodicea: "because thou art lukewarm, and neither cold nor hot, I will spue thee out of my mouth" (Revelation 3:16). It is the only church with no word of praise, and "lukewarm" appears once in the whole Bible, in that verse, in both the King James Version and the World English Bible.` },
  { q: "What is the message to each of the seven churches?", a: rows.map((r) => `${r.name} (${r.range.replace("Revelation ", "")}): ${r.rebuke ? lowerFirst(r.rebuke.text).replace(/"/g, "'") : `no rebuke; "${r.key.text}"`}`).join(". ") + `. Every letter also holds a promise "to him that overcometh", from "the tree of life" for Ephesus to a seat on Jesus' throne for Laodicea.` },
  { q: "Where were the seven churches located?", a: `In "Asia" (Revelation 1:4). All seven cities stood in western Anatolia, in present-day Turkey. Today Ephesus lies at Selçuk, Smyrna is İzmir, Pergamos is by Bergama, Thyatira is Akhisar, Sardis is near Sart, Philadelphia is Alaşehir, and Laodicea's ruins are near Denizli, according to Wikipedia's articles on each city (read 2026-10-25).` },
  { q: "Which letter is the longest?", a: `${L.name}'s, at ${L.verses} verses and ${fmt(L.wordsKjv)} words in the King James Version. ${Sh.name}'s is the shortest, ${Sh.verses} verses and ${Sh.wordsKjv} words. The World English Bible gives the same longest and shortest.` },
];

export default function SevenChurches() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The seven churches of Revelation", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The seven churches of Revelation: all seven letters compared", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const yesNo = (v) => (v ? "Yes" : <span className="font-semibold">None</span>);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The seven churches of Revelation" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The Seven Churches of Revelation</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Quotations are from the King James Version. The World English Bible calls the churches &quot;assemblies&quot; and spells Pergamos as Pergamum. Every verse and word count is taken from the full text of both translations.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Churches", value: rows.length, note: "in the order of Revelation 1:11" },
                { label: "Verses of letters", value: T.verses, note: `${fmt(T.wordsKjv)} KJV words, Revelation 2-3` },
                { label: "Longest letter", value: L.name, note: `${L.wordsKjv} KJV words; ${Sh.name} shortest, ${Sh.wordsKjv}` },
                { label: `"I know thy works"`, value: DATA.know.kjv, note: "once per letter, nowhere else in the KJV" },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="The seven churches at a glance" intro={`In the order Revelation 1:11 names them, which is also the order of the letters. Words are counted in the King James Version; the rank runs from longest (1) to shortest (${rows.length}).`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Church</th>
                  <th className="p-3 font-semibold">Letter</th>
                  <th className="p-3 font-semibold text-right">Verses</th>
                  <th className="p-3 font-semibold text-right">KJV words</th>
                  <th className="p-3 font-semibold text-right">Rank</th>
                  <th className="p-3 font-semibold">Praise</th>
                  <th className="p-3 font-semibold">Rebuke</th>
                  <th className="p-3 font-semibold">Key phrase</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium"><a href={`#${r.name.toLowerCase()}`} className={link}>{r.name}</a>{r.web !== r.name ? <span className="block text-xs text-muted-foreground">WEB: {r.web}</span> : null}</td>
                    <td className="p-3 whitespace-nowrap">{r.range.replace("Revelation ", "Rev ")}</td>
                    <td className="p-3 text-right tabular-nums">{r.verses}</td>
                    <td className="p-3 text-right tabular-nums">{r.wordsKjv}</td>
                    <td className="p-3 text-right tabular-nums">{r.rankKjv}</td>
                    <td className="p-3">{yesNo(r.praise)}</td>
                    <td className="p-3">{yesNo(r.rebuke)}</td>
                    <td className="p-3">&quot;{r.key.text}&quot; <span className="text-xs text-muted-foreground whitespace-nowrap">{r.key.ref.replace("Revelation ", "")}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The seven letters fill Revelation 2 and 3 exactly: {T.verses} verses, {fmt(T.wordsKjv)} words in the King James Version and {fmt(T.wordsWeb)} in the World English Bible. {L.name}, the fourth letter, is the longest at {L.verses} verses. {Sh.name}, the second, is the shortest at {Sh.verses}. Revelation 1:20 explains the picture behind them: &quot;The seven stars are the angels of the seven churches: and the seven candlesticks which thou sawest are the seven churches.&quot;
          </p>
        </Section>

        <Section id="letters" title="The seven letters, one by one" intro={`Each letter opens "Unto the angel of the church ... write; These things saith", followed by a title for Jesus that mostly repeats words from Revelation 1.`} muted>
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.name} id={r.name.toLowerCase()} className="rounded-xl border bg-card p-5 scroll-mt-20">
                <h3 className="text-xl font-semibold mb-1">{r.n}. {r.name}{r.web !== r.name ? ` (${r.web})` : ""}</h3>
                <p className="text-sm text-muted-foreground mb-3">{r.range}, {r.verses} verses, {r.wordsKjv} KJV words</p>
                <dl className="grid gap-2 text-sm leading-relaxed md:grid-cols-[9rem_1fr]">
                  <dt className="font-semibold">Jesus is</dt>
                  <dd>&quot;{r.jesus}&quot; <span className="text-muted-foreground">(Revelation {r.ch}:{r.from}; compare {r.echoes.map((e) => `"${e.text}", ${e.ref}`).join("; ")})</span></dd>
                  <dt className="font-semibold">Praised for</dt>
                  <dd>{r.praise ? <>{r.praise.text} <span className="text-muted-foreground">({[...new Set(r.praise.refs)].join("; ")})</span></> : <span className="font-semibold">No praise.</span>}</dd>
                  <dt className="font-semibold">Rebuked for</dt>
                  <dd>{r.rebuke ? <>{r.rebuke.text} <span className="text-muted-foreground">({[...new Set(r.rebuke.refs)].join("; ")})</span></> : <span className="font-semibold">No rebuke.</span>}</dd>
                  <dt className="font-semibold">To him that overcometh</dt>
                  <dd>{r.promise.text} <span className="text-muted-foreground">({r.promise.ref})</span></dd>
                  <dt className="font-semibold">Key phrase</dt>
                  <dd>&quot;{r.key.text}&quot; <span className="text-muted-foreground">({r.key.ref})</span></dd>
                </dl>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed">
            Two Old Testament names come up in the letters. Pergamos is rebuked for holding &quot;the doctrine of Balaam&quot;, the prophet whose counsel led Israel into sin (Numbers 31:16; see {wordLink("balaam", "Balaam")}). Thyatira tolerates &quot;that woman Jezebel&quot;, a name taken from the queen of Ahab, &quot;Jezebel the daughter of Ethbaal&quot; (1 Kings 16:31; see {wordLink("jezebel", "Jezebel")}). The Nicolaitanes are named only twice in the Bible, both in these letters: Ephesus hates their deeds (2:6) and Pergamos has some who hold their doctrine (2:15). Philadelphia&apos;s title, &quot;he that hath the key of David&quot;, echoes Isaiah 22:22 rather than Revelation 1.
          </p>
        </Section>

        <Section id="pattern" title="The pattern every letter follows" intro="The seven letters are built on the same frame, and the counts show how closely.">
          <ul className="list-disc pl-5 space-y-3 leading-relaxed">
            <li>&quot;I know thy works&quot; appears {DATA.know.kjv} times in the King James Version, once in each letter and nowhere else in the Bible ({DATA.know.refs.map((r) => r.replace("Revelation ", "")).join(", ")}). The World English Bible&apos;s &quot;I know your works&quot; matches, {DATA.know.web} times.</li>
            <li>&quot;He that hath an ear, let him hear what the Spirit saith unto the churches&quot; is in every letter: {DATA.ear.kjv} times, all in Revelation 2 and 3.</li>
            <li>Every letter has a promise &quot;to him that overcometh&quot;. In the first three ({joinAnd(DATA.earFirst)}) the call to hear comes first and the promise last. In the last four ({joinAnd(DATA.overFirst)}) the order flips.</li>
            <li>&quot;Overcometh&quot; appears {DATA.overcometh.kjv} times in the King James Version: {DATA.overcometh.rev} in Revelation ({DATA.overcometh.rev23} in the letters, plus &quot;He that overcometh shall inherit all things&quot; in Revelation 21:7) and {DATA.overcometh.byBook["1 John"]} in 1 John.</li>
            <li>Only {joinAnd(rows.filter((r) => r.againstThee).map((r) => r.name))} hear the words &quot;against thee&quot; (&quot;I have somewhat against thee&quot;, &quot;I have a few things against thee&quot;). Sardis and Laodicea are rebuked without them.</li>
          </ul>
        </Section>

        <Section id="numbers" title={'"Seven" and "church" in Revelation'} intro={`Revelation ties ${joinAnd(S.kjv.tied)} for the most uses of "seven" in the King James Version, ${S.kjv.rev.n} each, and uses the word far more densely than any other book: seven churches, seven stars, seven candlesticks, seven Spirits. The five books with the most:`} muted>
          <BarRows rows={S.kjv.top.map((x) => ({ label: x.book, value: x.n, href: `/books/${books.find((b) => b.name === x.book)?.slug}` }))} labelWidth="w-28" />
          <p className="mt-5 leading-relaxed">
            In the King James Version the word &quot;seven&quot; appears {S.kjv.rev.n} times in Revelation and {S.kjv.tied.length ? `the same ${S.kjv.rev.n} times in ${joinAnd(S.kjv.tied)}` : "more than any other book"}, so Revelation ties for the most. In the World English Bible {joinAnd(S.web.ahead)} edges ahead, {S.web.top[0].n} to {S.web.rev.n}. Measured by length, Revelation has no rival: {S.kjv.rev.per1000} uses of &quot;seven&quot; per 1,000 words, against {S.kjv.densest[1].per1000} in {S.kjv.densest[1].book}, the next densest. The whole King James Version has {S.kjv.total} of them (see {wordLink("seven", "seven")}).
          </p>
          <p className="mt-3 leading-relaxed">
            &quot;Church&quot; or &quot;churches&quot; appears {C.kjv} times in the King James Version, all in the New Testament. Revelation has {C.rev}, {C.rev23} of them in the seven letters, behind {joinAnd(C.rank.slice(0, 2).map((x) => `${x.book} (${x.n})`))}. The last is Revelation 22:16: &quot;I Jesus have sent mine angel to testify unto you these things in the churches.&quot; The World English Bible never uses the word; it has &quot;assembly&quot; or &quot;assemblies&quot; {C.webAssemblyRev} times in Revelation (see {wordLink("church", "church")}).
          </p>
        </Section>

        <Section id="where" title="Where were the seven churches?" intro={`All seven cities stood in western Anatolia, in present-day Turkey. John writes "to the seven churches which are in Asia" (Revelation 1:4), and this Asia is not the continent. ${joinAnd(onlyRev)} are named only in Revelation; the other three appear elsewhere in the New Testament.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Church</th>
                  <th className="p-3 font-semibold text-right">Times named (KJV)</th>
                  <th className="p-3 font-semibold">Outside Revelation</th>
                  <th className="p-3 font-semibold">Site today</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{r.name === "Ephesus" ? wordLink("ephesus", "Ephesus") : r.name}</td>
                    <td className="p-3 text-right tabular-nums">{r.namedKjv}</td>
                    <td className="p-3">{r.namedOutside.length ? r.namedOutside.map((x) => `${x.book} ${x.n}`).join(", ") : "none"}</td>
                    <td className="p-3"><a href={r.modern.url} className={link} rel="noopener">{r.modern.place}</a>, Turkey<span className="block text-xs text-muted-foreground">{r.modern.note}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Ephesus is the best known: Paul &quot;came to Ephesus&quot; (Acts 19:1) and taught there for two years, &quot;so that all they which dwelt in Asia heard the word of the Lord Jesus&quot; (Acts 19:10). Later he called &quot;the elders of the church&quot; of Ephesus to meet him at Miletus (Acts 20:17), and his letter to the Ephesians is addressed &quot;to the saints which are at Ephesus&quot; (Ephesians 1:1). The city is named {ephesus.namedKjv} times in the King James Version, {ephesus.namedOutside.find((x) => x.book === "Acts").n} of them in Acts.
          </p>
          <p className="mt-3 leading-relaxed">
            Thyatira appears once outside Revelation: Lydia, &quot;a seller of purple, of the city of Thyatira&quot;, whom Paul met at Philippi (Acts 16:12-14). Laodicea appears {laodicea.namedOutside.find((x) => x.book === "Colossians").n} times in Colossians. Paul says Epaphras (Colossians 4:12) has &quot;a great zeal for you, and them that are in Laodicea, and them in Hierapolis&quot; (Colossians 4:13). He greets &quot;the brethren which are in Laodicea&quot; (4:15) and asks for his letter to be &quot;read also in the church of the Laodiceans; and that ye likewise read the epistle from Laodicea&quot; (4:16). No book of the Bible carries that name.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Laodicea&apos;s count includes &quot;Laodiceans&quot; (Revelation 3:14, Colossians 4:16). The modern sites come from Wikipedia&apos;s articles on each city and on <a href={WIKI_LIST} className={link} rel="noopener">the seven churches of Asia</a>, read 2026-10-25. The Bible itself gives no locations beyond &quot;Asia&quot;.
          </p>
        </Section>

        <FaqSection title="Questions about the seven churches" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, from the text at github.com/seven1m/open-bibles, counted and checked by scripts/lists/seven-churches-of-revelation.mjs (read and counted {DATA.generated}).</li>
            <li><a href={WIKI_LIST} className={link} rel="noopener">Wikipedia, Seven churches of Asia</a>: the cities lie in present-day Turkey (read 2026-10-25).</li>
            <li>Wikipedia city articles for the modern sites, each read 2026-10-25: {rows.map((r, i) => (
              <span key={r.name}>{i ? ", " : ""}<a href={r.modern.url} className={link} rel="noopener">{r.name === "Pergamos" ? "Pergamon" : r.name === "Philadelphia" ? "Alaşehir" : r.name === "Laodicea" ? "Laodicea on the Lycus" : r.name}</a></span>
            ))}.</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read about <Link href="/books/revelation" className={link}>the book of Revelation</Link>, <Link href="/books/acts" className={link}>Acts</Link>, <Link href="/books/ephesians" className={link}>Ephesians</Link> and <Link href="/books/colossians" className={link}>Colossians</Link>, or see where Revelation sits on <Link href="/new-testament-books-in-order" className={link}>the New Testament books in order</Link>. Jesus&apos; own teaching is on <Link href="/parables-of-jesus" className={link}>the parables of Jesus</Link>, and his titles, including several from these letters, on <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>. Word counts: {wordLink("seven", "seven")}, {wordLink("church", "church")}, {wordLink("repent", "repent")}, {wordLink("crown", "crown")} and {wordLink("satan", "Satan")}. More counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
