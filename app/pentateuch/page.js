import { OG_VIDEOS } from "@/lib/og-video";
/* The Pentateuch: the five books of Moses (Genesis to Deuteronomy) with chapters, verses and words in the KJV and WEB,
   their share of the Old Testament and the Bible, a key verse per book and the Mosaic authorship question.
   Counted by scripts/lists/pentateuch.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/pentateuch.json";
import { getWord, fmt, readingTime, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/pentateuch`;
const rows = DATA.rows;
const T = DATA.totals;
const OT = DATA.ot;
const B = DATA.bible;
const S = DATA.share;
const M = DATA.moses;
const D = DATA.death;
const names = rows.map((r) => r.name);
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const pct = (a, b) => Math.round((100 * a) / b);
const clean = (t) => t.replace(/^[“‘]/, "").replace(/[”’]$/, "");
const byName = (n) => rows.find((r) => r.name === n);
const auth = (ref) => DATA.authorship.find((a) => a.ref === ref);
const numbersVsExodus = byName("Numbers").wordsKjv - byName("Exodus").wordsKjv;

const MW_URL = "https://www.merriam-webster.com/dictionary/Pentateuch";
const ODYSSEY_URL = "https://www.bibleodyssey.org/articles/the-torah-the-pentateuch/";
const SEFARIA_URL = "https://www.sefaria.org/Bava_Batra.14b";
const DH_URL = "https://en.wikipedia.org/wiki/Documentary_hypothesis";
const TORAH_URL = "https://en.wikipedia.org/wiki/Torah";
const MJL_URL = "https://www.myjewishlearning.com/article/the-torah/";
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = "What Is the Pentateuch? The 5 Books of Moses, Counted";
const ANSWER = `The Pentateuch is the first five books of the Bible: ${joinAnd(names)}. Jews call them the Torah, and tradition credits them to Moses. The name is Greek for "five scrolls". Together they hold ${T.chapters} chapters, ${fmt(T.versesKjv)} verses and ${fmt(T.wordsKjv)} King James words: ${S.otWordsKjv}% of the Old Testament in 5 of its ${OT.books} books.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Pentateuch is Genesis to Deuteronomy, the Torah. Chapters, verses and words for each book in the KJV and WEB, and who wrote it.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 5 books of the Pentateuch?", a: `${joinAnd(names)}, the first five books of every Jewish and Christian Bible, in that order. They are also called the Torah, the Law and the five books of Moses.` },
  { q: "What does Pentateuch mean?", a: `"Five books" or "five scrolls". Merriam-Webster traces the word through Late Latin pentateuchus to the Greek pentateuchos, from penta- (five) and teuchos, a word for a tool or vessel that came to mean a book. Bible Odyssey says the name came from the collection's five books, or scrolls.` },
  { q: "Is the Pentateuch the same as the Torah?", a: `In this sense, yes: the same five books. "Torah" is Hebrew for instruction or teaching, and Jewish usage can also stretch it to all of Jewish teaching. "Pentateuch" only ever means the five books.` },
  { q: "Did Moses write the Pentateuch?", a: `Jewish and Christian tradition says so, and the books say Moses wrote down laws and events (${auth("Exodus 24:4").ref}, ${auth("Deuteronomy 31:9").ref}). Most modern scholars think the books were put together from several sources over centuries. One passage of the Talmud (Bava Batra 14b) gives the last ${D.verses} verses, which tell of Moses' death, to Joshua.` },
  { q: "Which book of the Pentateuch is the longest?", a: `${DATA.longest.name}, with ${byName(DATA.longest.name).chapters} chapters and ${fmt(DATA.longest.wordsKjv)} KJV words. Numbers is second by words (${fmt(byName("Numbers").wordsKjv)}), ${fmt(numbersVsExodus)} ahead of Exodus. ${DATA.shortest.name} is the shortest at ${fmt(DATA.shortest.wordsKjv)}.` },
  { q: "How long does it take to read the Pentateuch?", a: `About ${readingTime(T.readingMinutes)} at the reading pace this site uses for every book. A chapter a day takes ${T.chapters} days, a little over six months.` },
];

export default function Pentateuch() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Books of the Bible", url: `${SITE}/books-of-the-bible` },
      { name: "Pentateuch", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The Pentateuch: the five books of Moses, counted from the text", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Books of the Bible", href: "/books-of-the-bible" }, { name: "Pentateuch" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The Pentateuch: the Five Books of Moses</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated November 2, 2026. Chapters, verses and words are counted from the full text of the King James Version and the World English Bible; the WEB, a modern public-domain translation, has {fmt(T.wordsWeb)} words in the same five books.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Books", value: rows.length, note: `of ${OT.books} in the Old Testament` },
                { label: "Chapters", value: T.chapters, note: `${S.otChapters}% of the Old Testament's ${OT.chapters}` },
                { label: "KJV words", value: fmt(T.wordsKjv), note: `${S.otWordsKjv}% of the Old Testament, ${S.bibleWordsKjv}% of the Bible` },
                { label: `"Moses", KJV`, value: M.kjvPent, note: `of his ${M.kjv} mentions in the whole Bible` },
              ]}
            />
          </div>
        </section>

        <Section id="books" title="The five books, sized" intro={`The five books are ${pct(5, OT.books)}% of the Old Testament's books but ${S.otWordsKjv}% of its words, because each one is long. ${DATA.longest.name} alone is the ${DATA.longest.otRank}th-longest book of the Old Testament, and even ${DATA.shortest.name}, the shortest of the five, ranks ${DATA.shortest.otRank}th of ${OT.books}.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold text-right">Chapters</th>
                  <th className="p-3 font-semibold text-right">Verses</th>
                  <th className="p-3 font-semibold text-right">KJV words</th>
                  <th className="p-3 font-semibold text-right">WEB words</th>
                  <th className="p-3 font-semibold text-right">Share of OT words</th>
                  <th className="p-3 font-semibold text-right">Share of Bible words</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.slug} className="border-b last:border-0">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium"><Link href={`/books/${r.slug}`} className={link}>{r.name}</Link></td>
                    <td className="p-3 text-right tabular-nums">{r.chapters}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.versesKjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.wordsKjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.wordsWeb)}</td>
                    <td className="p-3 text-right tabular-nums">{((100 * r.wordsKjv) / OT.wordsKjv).toFixed(1)}%</td>
                    <td className="p-3 text-right tabular-nums">{((100 * r.wordsKjv) / B.wordsKjv).toFixed(1)}%</td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3" />
                  <td className="p-3">All five</td>
                  <td className="p-3 text-right tabular-nums">{T.chapters}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(T.versesKjv)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(T.wordsKjv)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(T.wordsWeb)}</td>
                  <td className="p-3 text-right tabular-nums">{S.otWordsKjv}%</td>
                  <td className="p-3 text-right tabular-nums">{S.bibleWordsKjv}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Verses are the same in both translations ({fmt(T.versesKjv)}). The shares use the King James count: {fmt(OT.wordsKjv)} words in the Old Testament and {fmt(B.wordsKjv)} in the Bible. By verses the five books are {S.otVersesKjv}% of the Old Testament and {S.bibleVersesKjv}% of the Bible.
          </p>
          <div className="mt-6">
            <BarRows rows={rows.map((r) => ({ label: r.name, value: r.wordsKjv }))} labelWidth="w-28" />
          </div>
          <p className="mt-4 leading-relaxed">
            One surprise in the counts: Numbers is longer than Exodus by {fmt(numbersVsExodus)} King James words, though Exodus is the better-known book. The World English Bible gives the same order ({fmt(byName("Numbers").wordsWeb)} to {fmt(byName("Exodus").wordsWeb)}).
          </p>
        </Section>

        <Section id="each-book" title="What each book covers" intro="Each book in a sentence or two, with its Hebrew name (taken from a word in its opening line) and one well-known verse, quoted from both translations." muted>
          <div className="space-y-4">
            {rows.map((r) => (
              <div key={r.slug} className="rounded-xl border bg-card p-5">
                <h3 className="text-lg font-semibold mb-1">{r.n}. {r.name} <span className="font-normal text-muted-foreground">(Hebrew {r.hebrew}, &quot;{r.hebrewMeaning}&quot;)</span></h3>
                <p className="leading-relaxed mb-3">{r.covers} {r.chapters} chapters, about {readingTime(r.readingMinutes)} to read.</p>
                <blockquote className="border-l-4 border-l-primary/60 pl-4 text-sm leading-relaxed">
                  <p>&quot;{clean(r.key.kjv)}&quot; <span className="text-muted-foreground">({r.key.ref}, KJV)</span></p>
                  <p className="mt-1">&quot;{clean(r.key.web)}&quot; <span className="text-muted-foreground">(WEB)</span></p>
                </blockquote>
              </div>
            ))}
          </div>
        </Section>

        <Section id="name" title="Why it is called the Pentateuch">
          <p className="leading-relaxed">
            The word is Greek. <a href={MW_URL} className={link} rel="noopener">Merriam-Webster</a> traces it through Late Latin <em>pentateuchus</em> to Greek <em>pentateuchos</em>: <em>penta-</em>, five, and <em>teuchos</em>, a word for a tool or vessel that came to mean a book. Writing for the Society of Biblical Literature&apos;s <a href={ODYSSEY_URL} className={link} rel="noopener">Bible Odyssey</a>, Christophe Nihan and Julia Rhyder say that because the collection comprises &quot;five books, or scrolls&quot;, it &quot;came to be known as the Pentateuch in antiquity&quot;, and that the books were translated from Hebrew into Greek in the third century BCE.
          </p>
          <p className="mt-3 leading-relaxed">
            The older name is Hebrew: Torah, which means instruction or teaching more than law. The phrase &quot;the law of Moses&quot; appears {DATA.lawOfMoses.kjv} times in the King James Version, first in {DATA.lawOfMoses.firstKjv}, and Jesus uses the phrase in {auth("Luke 24:44").ref} for the first part of the Hebrew scriptures: &quot;{clean(auth("Luke 24:44").kjv).slice(clean(auth("Luke 24:44").kjv).indexOf("all things")).replace(/\.$/, "")}&quot;. In synagogues the Torah is read through in 54 weekly portions, according to <a href={MJL_URL} className={link} rel="noopener">My Jewish Learning</a>.
          </p>
        </Section>

        <Section id="author" title="Who wrote the Pentateuch?" intro="Two answers, held by different readers. Both are stated here as their holders state them." muted>
          <h3 className="text-lg font-semibold mb-2">The tradition: Moses</h3>
          <p className="leading-relaxed">
            Jewish and Christian tradition credits the five books to Moses, and the books themselves say he wrote: &quot;{clean(auth("Exodus 24:4").kjv).split(",")[0]}&quot; ({auth("Exodus 24:4").ref}) and &quot;{clean(auth("Deuteronomy 31:9").kjv).split(",")[0]}&quot; ({auth("Deuteronomy 31:9").ref}). Later books call them &quot;the book of the law of Moses&quot; ({auth("Nehemiah 8:1").ref}), and in {auth("Mark 12:26").ref} Jesus quotes the burning bush as &quot;in the book of Moses&quot;. {wordLink("moses", "Moses")} is named {M.kjvPent} times in these five books, {pct(M.kjvPent, M.kjv)}% of his {M.kjv} mentions in the King James Version.
          </p>
          <p className="mt-3 leading-relaxed">
            The tradition had its own puzzle. Deuteronomy ends with Moses&apos; death: &quot;{clean(D.kjv)}&quot; ({D.ref}). The Babylonian Talmud answers it in <a href={SEFARIA_URL} className={link} rel="noopener">Bava Batra 14b</a>: &quot;Moses wrote his own book&quot;, and &quot;Joshua wrote his own book and eight verses in the Torah, which describe the death of Moses&quot;. Those are {D.first} to {D.last}, the last {D.verses} verses of the Pentateuch.
          </p>
          <h3 className="text-lg font-semibold mt-6 mb-2">Modern scholarship: several sources over centuries</h3>
          <p className="leading-relaxed">
            Most modern scholars read the five books as the work of many hands. The best-known model, the <a href={DH_URL} className={link} rel="noopener">documentary hypothesis</a> linked to Julius Wellhausen in the 1800s, splits them into four sources, called J, E, D and P, joined by later editors. That four-source model was the majority view for most of the 1900s and has since lost its consensus; scholars now argue over supplementary and fragment models as well. Nihan and Rhyder sum up the current view at Bible Odyssey: the Pentateuch is &quot;the result of a long compositional and editorial process&quot; that ran from the Neo-Assyrian to the Persian period, roughly the 900s to the 300s BCE.
          </p>
          <p className="mt-3 leading-relaxed">
            Conservative scholars answer that the books&apos; own claims and the New Testament&apos;s references point to Moses, with small later additions such as the account of his death. This page does not decide between the two; it counts the text both sides read. Who wrote the rest of the Bible, book by book, is on <Link href="/how-many-authors-wrote-the-bible" className={link}>how many authors wrote the Bible</Link>.
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every count and quoted verse on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/build-bible-stats.mjs and scripts/lists/pentateuch.mjs, which checks each quoted verse in both translations (read and counted {DATA.generated}).</li>
            <li><a href={MW_URL} className={link} rel="noopener">Merriam-Webster, &quot;Pentateuch&quot;</a>: the word&apos;s Greek and Latin origin (read 2026-11-02).</li>
            <li><a href={ODYSSEY_URL} className={link} rel="noopener">Christophe Nihan and Julia Rhyder, &quot;The Torah/The Pentateuch&quot;, Bible Odyssey (Society of Biblical Literature)</a>: the name, the Greek translation, the scholarly view of how the books were composed (read 2026-11-02).</li>
            <li><a href={SEFARIA_URL} className={link} rel="noopener">Babylonian Talmud, Bava Batra 14b, William Davidson translation (Sefaria)</a>: Moses and Joshua as writers (read 2026-11-02).</li>
            <li><a href={DH_URL} className={link} rel="noopener">&quot;Documentary hypothesis&quot;, Wikipedia</a>: Wellhausen, the four sources and the loss of consensus after the 1970s (read 2026-11-02).</li>
            <li><a href={TORAH_URL} className={link} rel="noopener">&quot;Torah&quot;, Wikipedia</a>: the Hebrew names of the five books (read 2026-11-02).</li>
            <li><a href={MJL_URL} className={link} rel="noopener">My Jewish Learning, &quot;The Torah&quot;</a>: the 54 weekly portions (read 2026-11-02).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about the Pentateuch" faqs={faqs} />

        <Section>
          <p className="mb-4">
            Every book in order is on <Link href="/old-testament-books-in-order" className={link}>the Old Testament books in order</Link> and <Link href="/books-of-the-bible" className={link}>the books of the Bible</Link>. From these five books: <Link href="/ten-plagues-of-egypt" className={link}>the ten plagues of Egypt</Link> (Exodus) and <Link href="/613-commandments" className={link}>the 613 commandments</Link>, the rabbis&apos; count of the Torah&apos;s laws.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
