import { OG_VIDEOS } from "@/lib/og-video";
/* Gifts of the Spirit: every gift in the five New Testament lists (Romans 12, 1 Corinthians 12 twice, Ephesians 4,
   1 Peter 4) in the KJV and WEB, grouped into distinct gifts by one printed rule, the nine of 1 Corinthians 12:8-10,
   and the seven of Isaiah 11:2 as the Catechism lists them. Counted by scripts/lists/gifts-of-the-spirit.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/gifts-of-the-spirit.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/gifts-of-the-spirit`;
const L = Object.fromEntries(DATA.lists.map((l) => [l.id, l]));
const nine = L.cor12a.items;
const W = DATA.words;
const I = DATA.isaiah;
const link = "underline underline-offset-2 hover:text-primary";
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const nineKjv = joinAnd(nine.map((g) => g.kjv.replace(/^the /, "")));
const multi = DATA.distinct.filter((r) => r.lists.length > 1).sort((a, b) => b.lists.length - a.lists.length);
const prophecy = DATA.distinct.find((r) => r.group === "prophecy");
const CATECHISM_URL = "https://www.vatican.va/archive/ENG0015/__P67.HTM";

const TITLE = "Gifts of the Spirit: All 9, Plus Every List in the Bible";
const ANSWER = `The nine gifts of the Spirit are listed in 1 Corinthians 12:8-10: ${nineKjv} (King James Version). Paul names other gifts in Romans 12:6-8, 1 Corinthians 12:28 and Ephesians 4:11, and Peter in 1 Peter 4:10-11. Across those five lists there are ${DATA.entries} entries and ${DATA.distinct.length} different gifts by this page's rule.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 9 gifts of the Spirit in 1 Corinthians 12 (KJV and WEB), all ${DATA.distinct.length} gifts across the five New Testament lists, and the 7 gifts of Isaiah 11:2.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 9 gifts of the Holy Spirit?", a: `1 Corinthians 12:8-10 lists them: ${nineKjv}. The World English Bible says "languages" where the King James Version says "tongues".` },
  { q: "What are the 7 gifts of the Holy Spirit?", a: `That list comes from Isaiah 11:2, not from Paul. The Catechism of the Catholic Church (paragraph 1831) names ${joinAnd(I.catechism)}. Isaiah 11:2 in the King James Version names six: ${joinAnd(I.kjvList)}. The seventh, piety, comes from the old Greek and Latin translations of Isaiah, which put "piety" where the King James Version has the first "fear of the LORD", and the Catechism calls might "fortitude".` },
  { q: "How many spiritual gifts are there?", a: `No verse gives a total. The five New Testament lists hold ${DATA.entries} entries. Joining entries that use the same English word or its root, such as prophecy and prophets, leaves ${DATA.distinct.length} different gifts. ${prophecy.name} is the only one in four of the five lists.` },
  { q: "Where are the spiritual gifts listed in the Bible?", a: `In five places: ${DATA.lists.map((l) => `${l.title} (${l.items.length})`).join(", ")}. "Spiritual gift" or "spiritual gifts" appears ${W.spiritualGiftsKjv.total} times in the King James Version, in ${joinAnd(W.spiritualGiftsKjv.refs)}.` },
  { q: "What is the difference between the gifts and the fruit of the Spirit?", a: `The gifts differ from one believer to another: the Spirit gives them "to every man severally as he will" (1 Corinthians 12:11). The fruit of the Spirit in Galatians 5:22-23 is one list of nine qualities, starting with love. Paul says even "the gift of prophecy" without charity is nothing (1 Corinthians 13:2).` },
];

export default function GiftsOfTheSpirit() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Gifts of the Spirit", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Gifts of the Spirit: all 9, plus every list in the Bible", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Gifts of the Spirit" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Gifts of the Spirit</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every wording below is checked against its verse in the King James Version and the World English Bible, and word counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Gifts in 1 Corinthians 12:8-10", value: nine.length, note: "the list usually meant by \"the 9 gifts\"" },
                { label: "Entries in all five lists", value: DATA.entries, note: DATA.lists.map((l) => l.items.length).join(" + ") },
                { label: "Different gifts", value: DATA.distinct.length, note: "joining the same English word or root" },
                { label: `"Gift" or "gifts" (KJV)`, value: W.giftKjv.total, note: `${W.giftKjvNt.total} in the New Testament` },
              ]}
            />
          </div>
        </section>

        <Section id="nine" title="The 9 gifts of the Spirit in 1 Corinthians 12" intro={`Paul gives this list after saying there are "diversities of gifts, but the same Spirit" (1 Corinthians 12:4). The two translations word ${nine.filter((g) => g.kjv.replace(/^the /, "") !== g.web.replace(/^the /, "")).length} of the nine differently.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">King James Version</th>
                  <th className="p-3 font-semibold">World English Bible</th>
                </tr>
              </thead>
              <tbody>
                {nine.map((g, i) => (
                  <tr key={g.group} className="border-b last:border-0">
                    <td className="p-3 tabular-nums">{i + 1}</td>
                    <td className="p-3 font-medium">{g.kjv}</td>
                    <td className="p-3">{g.web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <blockquote className="mt-5 border-l-4 pl-4 italic leading-relaxed">{DATA.nineText.kjv} <span className="not-italic text-sm text-muted-foreground">(1 Corinthians 12:8-10, KJV)</span></blockquote>
        </Section>

        <Section id="all" title={`All ${DATA.distinct.length} gifts across the five lists`} intro={`Each row is one gift and the lists that name it, with the King James wording from each. Of the ${DATA.distinct.length}, ${multi.length} are in more than one list.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Gift</th>
                  <th className="p-3 font-semibold">KJV wording, by list</th>
                  <th className="p-3 font-semibold text-right">Lists</th>
                </tr>
              </thead>
              <tbody>
                {DATA.distinct.map((r, i) => (
                  <tr key={r.group} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{i + 1}</td>
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3">{r.wordings.map((w) => <span key={w.list} className="block">&quot;{w.kjv}&quot; ({w.list}) </span>)}</td>
                    <td className="p-3 text-right tabular-nums">{r.lists.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed">
            Two entries count as one gift when the King James Version uses the same word or its root: prophecy and prophets, &quot;he that teacheth&quot; and teachers, ministry and &quot;if any man minister&quot;. Every other entry is its own gift, so &quot;he that ruleth&quot; (Romans 12:8) and &quot;governments&quot; (1 Corinthians 12:28) are two rows, and so are pastors and teachers in Ephesians 4:11. The interpretation of tongues stays apart from tongues, because the gift it names is interpretation. A reader who joins more of them gets a smaller total.
          </p>
        </Section>

        <Section id="lists" title="The five lists, verse by verse" intro="The lists are worded in different ways. Romans 12 and 1 Peter 4 mostly name what a person does (&quot;he that giveth&quot;, &quot;if any man speak&quot;), 1 Corinthians 12:8-10 names what &quot;is given by the Spirit&quot;, and 1 Corinthians 12:28 and Ephesians 4:11 name people, starting with apostles and prophets.">
          <BarRows rows={DATA.lists.map((l) => ({ label: l.title, value: l.items.length }))} labelWidth="w-48" />
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {DATA.lists.map((l) => (
              <div key={l.id} className="rounded-xl border bg-card p-4">
                <h3 className="font-semibold mb-2">{l.title}</h3>
                <p className="text-sm leading-relaxed"><span className="font-medium">KJV:</span> {l.items.map((g) => g.kjv).join("; ")}.</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground"><span className="font-medium">WEB:</span> {l.items.map((g) => g.web).join("; ")}.</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed">
            {prophecy.name} is the only gift in four lists ({joinAnd(prophecy.lists)}). Teaching is in three. {(() => { const two = joinAnd(multi.filter((r) => r.lists.length === 2).map((r) => r.name.toLowerCase())); return two.charAt(0).toUpperCase() + two.slice(1); })()} are in two each. Right after the second Corinthians list, Paul asks &quot;Are all apostles?&quot; through &quot;do all interpret?&quot; (1 Corinthians 12:29-30), each expecting the answer no.
          </p>
        </Section>

        <Section id="seven" title="The 7 gifts of the Holy Spirit (Isaiah 11:2)" muted>
          <p className="leading-relaxed">
            The list of seven comes from a prophecy about the Messiah, not from Paul. The{" "}
            <a href={CATECHISM_URL} className={link} rel="noopener">Catechism of the Catholic Church, paragraph 1831</a>, names {joinAnd(I.catechism)}, and cites Isaiah 11:1-2.
          </p>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{I.kjv} <span className="not-italic text-sm text-muted-foreground">(Isaiah 11:2, KJV)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            The King James Version names six in that verse: {joinAnd(I.kjvList)}. The World English Bible has the same six, with &quot;the fear of Yahweh&quot;. The seventh comes from the old Greek and Latin translations of Isaiah, the Septuagint and the Vulgate: they put piety where the Hebrew of verse 2 has the fear of the LORD, and keep fear for verse 3, where the King James Version repeats &quot;the fear of the LORD&quot;. The Catechism also calls might &quot;fortitude&quot;.
          </p>
        </Section>

        <Section id="words" title="How often does the Bible say gift?" intro={`"Gift" or "gifts" appears ${W.giftKjv.total} times in the King James Version and ${W.giftWeb.total} times in the World English Bible.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>{["Count", "KJV", "WEB"].map((h) => <th key={h} className="p-3 font-semibold text-right first:text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  ["gift, gifts (whole Bible)", W.giftKjv.total, W.giftWeb.total],
                  ["gift, gifts (New Testament)", W.giftKjvNt.total, W.giftWebNt.total],
                  ["\"spiritual gift(s)\"", W.spiritualGiftsKjv.total, W.spiritualGiftsWeb.total],
                ].map(([label, k, w]) => (
                  <tr key={label} className="border-b last:border-0">
                    <td className="p-3 font-medium">{label}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(k)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(w)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The King James Version says &quot;spiritual gift&quot; or &quot;spiritual gifts&quot; in {joinAnd(W.spiritualGiftsKjv.refs)} (the singular only in Romans 1:11). The World English Bible has it in {joinAnd(W.spiritualGiftsWeb.refs)}; at 1 Corinthians 12:1 it reads &quot;spiritual things&quot;. Not every gift is a gift of the Spirit: most of the Old Testament uses are presents, offerings and bribes (&quot;a gift destroyeth the heart&quot;, Ecclesiastes 7:7). In Acts 2:38 the Spirit is the gift itself, &quot;the gift of the Holy Ghost&quot;.
          </p>
        </Section>

        <FaqSection title="Questions about the gifts of the Spirit" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/gifts-of-the-spirit.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
            <li><a href={CATECHISM_URL} className={link} rel="noopener">Catechism of the Catholic Church</a>, paragraph 1831, the seven gifts (vatican.va, read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            The nine qualities of Galatians 5 are on <Link href="/fruit-of-the-spirit" className={link}>the fruit of the Spirit</Link>, and Ephesians 6 on <Link href="/armor-of-god" className={link}>the armor of God</Link>. Jesus&apos; own works are counted on <Link href="/miracles-of-jesus" className={link}>the miracles of Jesus</Link>. Read about <Link href="/books/1-corinthians" className={link}>1 Corinthians</Link> and <Link href="/books/romans" className={link}>Romans</Link>, or the word counts for {wordLink("wisdom", "wisdom")}, {wordLink("faith", "faith")} and {wordLink("holy-spirit", "the Holy Spirit")}. Every title the Bible gives the Spirit is on <Link href="/names-of-the-holy-spirit" className={link}>the names of the Holy Spirit</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
