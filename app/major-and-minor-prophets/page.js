import { OG_VIDEOS } from "@/lib/og-video";
/* Major and minor prophets: the 17 prophetic books (Isaiah to Malachi) with chapters, verses, KJV words, reading time
   and the "thus saith the LORD" count per book, from the full KJV and WEB text.
   Counted by scripts/lists/major-and-minor-prophets.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/major-and-minor-prophets.json";
import { getWord, fmt, readingTime, READING_WPM, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/major-and-minor-prophets`;
const rows = DATA.rows;
const T = DATA.totals;
const W = DATA.words;
const major = rows.filter((r) => r.group === "major");
const minor = rows.filter((r) => r.group === "minor");
const names = (rs) => rs.map((r) => r.name);
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const pct = (a, b) => Math.round((100 * a) / b);
const isaiah = rows.find((r) => r.name === "Isaiah");
const L = DATA.longest;
const AUGUSTINE_URL = "https://www.newadvent.org/fathers/120118.htm";
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = "Major and Minor Prophets: All 17 Books, Sized From the Text";
const ANSWER = `The ${major.length} major prophets are ${joinAnd(names(major))}. The ${minor.length} minor prophets are ${joinAnd(names(minor))}. "Major" and "minor" describe length, not importance: the major prophets hold ${fmt(T.major.wordsKjv)} words in the King James Version, and all ${minor.length} minor prophets together hold ${fmt(T.minor.wordsKjv)}, fewer than Isaiah alone (${fmt(isaiah.wordsKjv)}).`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The ${major.length} major and ${minor.length} minor prophets in order, with chapters, verses, KJV words and reading time for each book, and why they are called major and minor.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "Who are the 5 major prophets?", a: `${joinAnd(names(major))}. Lamentations is counted with them because it has long been credited to Jeremiah, who "lamented for Josiah" (2 Chronicles 35:25), and English Bibles place it right after his book. The book itself names no author.` },
  { q: "Who are the 12 minor prophets?", a: `${joinAnd(names(minor))}, in the order of English Bibles. Together they have ${T.minor.chapters} chapters and ${fmt(T.minor.verses)} verses.` },
  { q: "Why are they called major and minor prophets?", a: `Because of length. Augustine, writing in the 400s, says the twelve "are called the minor from the brevity of their writings" (City of God, book 18, chapter 29). The longest minor prophet, ${[...minor].sort((a, b) => b.wordsKjv - a.wordsKjv)[0].name}, has ${fmt([...minor].sort((a, b) => b.wordsKjv - a.wordsKjv)[0].wordsKjv)} KJV words; the shortest major prophet, Lamentations, has ${fmt(rows.find((r) => r.name === "Lamentations").wordsKjv)}.` },
  { q: "Which prophet book is the longest?", a: `${L.name}, with ${fmt(L.wordsKjv)} words in the King James Version. It is the longest book in the whole Bible by words, but only just: ${L.next.name} has ${fmt(L.next.wordsKjv)}, ${fmt(L.wordsKjv - L.next.wordsKjv)} fewer. The World English Bible gives the same order (${fmt(L.wordsWeb)} to ${fmt(L.next.wordsWeb)}). ${DATA.mostChapters} has more chapters (${rows.find((r) => r.name === DATA.mostChapters).chapters}).` },
  { q: "Which is the shortest book of the prophets?", a: `${DATA.shortest.name}, with ${DATA.shortest.verses} verses in one chapter. It is also the shortest book in the Old Testament.` },
];

export default function MajorAndMinorProphets() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Books of the Bible", url: `${SITE}/books-of-the-bible` },
      { name: "Major and minor prophets", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Major and minor prophets: all 17 books, sized from the text", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const table = (rs, label) => (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">{label}</th>
            <th className="p-3 font-semibold text-right">Chapters</th>
            <th className="p-3 font-semibold text-right">Verses</th>
            <th className="p-3 font-semibold text-right">KJV words</th>
            <th className="p-3 font-semibold text-right">Reading time</th>
            <th className="p-3 font-semibold text-right">&quot;Thus saith the LORD&quot;</th>
          </tr>
        </thead>
        <tbody>
          {rs.map((r) => (
            <tr key={r.slug} className="border-b last:border-0">
              <td className="p-3 tabular-nums">{r.n}</td>
              <td className="p-3 font-medium"><Link href={`/books/${r.slug}`} className={link}>{r.name}</Link></td>
              <td className="p-3 text-right tabular-nums">{r.chapters}</td>
              <td className="p-3 text-right tabular-nums">{fmt(r.verses)}</td>
              <td className="p-3 text-right tabular-nums">{fmt(r.wordsKjv)}</td>
              <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(r.readingMinutes)}</td>
              <td className="p-3 text-right tabular-nums">{r.thusSaith}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Books of the Bible", href: "/books-of-the-bible" }, { name: "Major and minor prophets" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The Major and Minor Prophets</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Chapters, verses and words are counted from the full text of the King James Version, and reading time assumes {READING_WPM} words a minute, the rate the rest of this site uses.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Prophetic books", value: rows.length, note: `${major.length} major, ${minor.length} minor` },
                { label: "Major prophets, KJV words", value: fmt(T.major.wordsKjv), note: `${pct(T.major.wordsKjv, T.major.wordsKjv + T.minor.wordsKjv)}% of the 17 books` },
                { label: "Minor prophets, KJV words", value: fmt(T.minor.wordsKjv), note: `fewer than Isaiah's ${fmt(isaiah.wordsKjv)}` },
                { label: `"Thus saith the LORD"`, value: T.major.thusSaith + T.minor.thusSaith, note: `of ${T.thusSaithBible} in the whole KJV` },
              ]}
            />
          </div>
        </section>

        <Section id="major" title={`The ${major.length} major prophets`} intro={`Books 23 to 27 of the Old Testament: ${T.major.chapters} chapters and ${fmt(T.major.verses)} verses. ${L.name} is the longest book in the Bible by words in both translations, ${fmt(L.wordsKjv - L.next.wordsKjv)} King James words ahead of ${L.next.name}.`}>
          {table(major, "Major prophet")}
        </Section>

        <Section id="minor" title={`The ${minor.length} minor prophets`} intro={`Books 28 to 39, the last twelve books of the Old Testament: ${T.minor.chapters} chapters and ${fmt(T.minor.verses)} verses in all. ${DATA.shortest.name}, at ${DATA.shortest.verses} verses, is the shortest book in the Old Testament.`} muted>
          {table(minor, "Minor prophet")}
        </Section>

        <Section id="size" title="Why major and minor? The sizes side by side" intro={`The five major prophets hold ${pct(T.major.wordsKjv, T.major.wordsKjv + T.minor.wordsKjv)}% of the words in these 17 books. The twelve minor prophets together are shorter than Isaiah alone: ${fmt(T.minor.wordsKjv)} words to ${fmt(isaiah.wordsKjv)}.`}>
          <BarRows rows={[...rows].sort((a, b) => b.wordsKjv - a.wordsKjv).map((r) => ({ label: r.name, value: r.wordsKjv, href: `/books/${r.slug}` }))} labelWidth="w-28" />
          <p className="mt-5 leading-relaxed">
            The names go back at least to Augustine. In{" "}
            <a href={AUGUSTINE_URL} className={link} rel="noopener">City of God, book 18, chapter 29</a>, he says the twelve &quot;are called the minor from the brevity of their writings, as compared with those who are called the greater prophets because they published larger volumes.&quot; Lamentations is shorter than {[...minor].filter((r) => r.wordsKjv > rows.find((x) => x.name === "Lamentations").wordsKjv).length} of the minor prophets, but it is grouped with the major ones because it has long been credited to Jeremiah and English Bibles place it right after his book. The Bible ties Jeremiah to laments in 2 Chronicles 35:25: &quot;Jeremiah lamented for Josiah&quot;.
          </p>
        </Section>

        <Section id="thus-saith" title={'Who says "thus saith the LORD" most?'} intro={`The phrase appears ${T.thusSaithBible} times in the King James Version, and these 17 books hold ${T.major.thusSaith + T.minor.thusSaith} of them, ${T.major.thusSaith} in the major prophets.`} muted>
          <BarRows rows={DATA.mostThus.map((r) => ({ label: r.name, value: r.n }))} labelWidth="w-28" />
          <p className="mt-5 leading-relaxed">
            The count takes in both ways the King James Version prints it: &quot;Thus saith the LORD&quot; ({T.thusLordCaps} times) and &quot;Thus saith the Lord GOD&quot; ({T.thusLordGod}). Ezekiel almost always uses the second form, {T.thusLordGodEzekiel} of its {rows.find((r) => r.name === "Ezekiel").thusSaith}. The phrase never appears in {DATA.noThus.length} of the books: {joinAnd(DATA.noThus)}. Several of them use other openings. Hosea and Joel begin with &quot;The word of the LORD that came&quot;, and Jonah is mostly a story about a prophet rather than his sayings. The World English Bible renders the phrase &quot;Yahweh says&quot;. The full count by book is on {wordLink("thus-saith-the-lord", "thus saith the Lord")}.
          </p>
        </Section>

        <Section id="hebrew" title="The same books in the Hebrew Bible" >
          <p className="leading-relaxed">
            The major and minor split belongs to the order of English Bibles. The Hebrew Bible counts the twelve minor prophets as one book, called the Twelve, and places Lamentations and Daniel among the Writings rather than the Prophets. When Stephen quotes Amos in Acts 7:42, he cites it as &quot;written in the book of the prophets&quot;. Jesus calls Daniel a prophet in Matthew 24:15, &quot;spoken of by Daniel the prophet&quot;.
          </p>
          <p className="mt-3 leading-relaxed">
            &quot;Prophet&quot; or &quot;prophets&quot; appears {fmt(W.prophetKjv.total)} times in the King James Version and {fmt(W.prophetWeb.total)} in the World English Bible. Amos, one of the twelve, told the priest at Bethel &quot;I was no prophet, neither was I a prophet&apos;s son&quot; (Amos 7:14). Malachi, the last book of the Old Testament, closes with a promise to send &quot;Elijah the prophet&quot; (Malachi 4:5).
          </p>
        </Section>

        <FaqSection title="Questions about the major and minor prophets" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every count on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/build-bible-stats.mjs and scripts/lists/major-and-minor-prophets.mjs (read and counted {DATA.generated}).</li>
            <li><a href={AUGUSTINE_URL} className={link} rel="noopener">Augustine, City of God, book 18, chapter 29</a>, translated by Marcus Dods (New Advent, read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Every book in order is on <Link href="/old-testament-books-in-order" className={link}>the Old Testament books in order</Link> and <Link href="/books-of-the-bible" className={link}>the books of the Bible</Link>. Read about <Link href="/books/isaiah" className={link}>Isaiah</Link>, <Link href="/books/jeremiah" className={link}>Jeremiah</Link> and <Link href="/books/jonah" className={link}>Jonah</Link>, or the word counts for {wordLink("prophet", "prophet")}, {wordLink("daniel", "Daniel")} and {wordLink("jonah", "Jonah")}. The shortest books are on <Link href="/shortest-book-in-the-bible" className={link}>the shortest book in the Bible</Link>, and the kings these prophets spoke to are on <Link href="/kings-of-israel-and-judah" className={link}>the kings of Israel and Judah in order</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
