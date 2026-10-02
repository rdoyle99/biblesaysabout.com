/* Books of the Bible: all 66 books with chapters, verses, words and reading time, counted from the full text */

import Link from "next/link";
import { books, otBooks, ntBooks, bible, totals, fmt, readingTime, METHOD, DATA_DATE, READING_WPM, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, FaqSection, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/books-of-the-bible`;
const TITLE = "How Many Books Are in the Bible? 66 Books, Listed and Counted";

const byKjvWords = [...books].sort((a, b) => b.words.kjv - a.words.kjv);
const byWebWords = [...books].sort((a, b) => b.words.web - a.words.web);
const byVerses = [...books].sort((a, b) => b.verses.kjv - a.verses.kjv);
const byChapters = [...books].sort((a, b) => b.chapters - a.chapters);
const longestKjv = byKjvWords[0];
const longestWeb = byWebWords[0];
const shortestKjv = byKjvWords.at(-1);
const shortestWeb = byWebWords.at(-1);
const fewestVerses = byVerses.at(-1);
const singleChapter = books.filter((b) => b.chapters === 1);

const ANSWER = `The Protestant Bible has ${totals.books} books: ${totals.ot} in the Old Testament and ${totals.nt} in the New Testament. Together they hold ${fmt(totals.chapters)} chapters and ${fmt(bible.kjv.verses)} verses. Catholic Bibles have 73 books, adding Tobit, Judith, Wisdom, Sirach, Baruch and 1 and 2 Maccabees.`;

const runnerUp = byKjvWords[1];
const margin = longestKjv.words.kjv - runnerUp.words.kjv;
const titlesFlip = runnerUp.slug === "psalms" && runnerUp.words.kjv + bible.psalmTitleWords > longestKjv.words.kjv;
const longestLine =
  `By word count the longest book is ${longestKjv.name}: ${fmt(longestKjv.words.kjv)} words in the King James Version, ${fmt(margin)} more than ${runnerUp.name} (${fmt(runnerUp.words.kjv)}).` +
  (titlesFlip ? ` Count the ${fmt(bible.psalmTitleWords)} words of the psalm titles and Psalms is longer.` : "") +
  (longestWeb.slug !== longestKjv.slug ? ` In the World English Bible ${longestWeb.name} is longest (${fmt(longestWeb.words.web)} words).` : "");
const longestAnswer = `${longestLine} ${byChapters[0].name} has the most chapters (${byChapters[0].chapters}) and the most verses (${fmt(byVerses[0].verses.kjv)}).`;
const shortestAnswer = `${shortestKjv.name} is the shortest book by word count, ${fmt(shortestKjv.words.kjv)} words in the KJV${shortestWeb.slug === shortestKjv.slug ? "" : ` (in the World English Bible it is ${shortestWeb.name}, ${fmt(shortestWeb.words.web)} words)`}. ${fewestVerses.name} has the fewest verses: ${fewestVerses.verses.kjv}.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Bible has 66 books: 39 Old Testament and 27 New Testament. Every book with its chapters, verses, word count and reading time, plus the longest and shortest.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many books are in the Bible?", a: ANSWER },
  {
    q: "How many books are in the Old Testament?",
    a: `${totals.ot} books, from Genesis to Malachi, with ${fmt(totals.otChapters)} chapters and ${fmt(totals.otVerses)} verses (KJV).`,
  },
  {
    q: "How many books are in the New Testament?",
    a: `${totals.nt} books, from Matthew to Revelation, with ${fmt(totals.ntChapters)} chapters and ${fmt(totals.ntVerses)} verses (KJV).`,
  },
  { q: "What is the longest book in the Bible?", a: longestAnswer },
  { q: "What is the shortest book in the Bible?", a: shortestAnswer },
  {
    q: "Which books of the Bible have only one chapter?",
    a: `${singleChapter.length} books: ${singleChapter.map((b) => b.name).join(", ")}.`,
  },
  {
    q: "Why do Catholic Bibles have more books?",
    a: "Catholic Bibles include seven books from the Greek Old Testament that Protestant Bibles leave out or print separately as the Apocrypha: Tobit, Judith, Wisdom, Sirach, Baruch, 1 Maccabees and 2 Maccabees. Catholic editions of Esther and Daniel are also longer.",
  },
];

function BookTable({ list }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Book</th>
            <th className="p-3 font-semibold text-right">Chapters</th>
            <th className="p-3 font-semibold text-right">Verses</th>
            <th className="p-3 font-semibold text-right">Words (KJV)</th>
            <th className="p-3 font-semibold text-right whitespace-nowrap">Reading time</th>
          </tr>
        </thead>
        <tbody>
          {list.map((b) => (
            <tr key={b.slug} className="border-b last:border-0">
              <td className="p-3 tabular-nums text-muted-foreground">{b.order}</td>
              <td className="p-3">
                <Link href={`/books/${b.slug}`} className="underline underline-offset-2 hover:text-primary">
                  {b.name}
                </Link>
              </td>
              <td className="p-3 text-right tabular-nums">{b.chapters}</td>
              <td className="p-3 text-right tabular-nums">{fmt(b.verses.kjv)}</td>
              <td className="p-3 text-right tabular-nums">{fmt(b.words.kjv)}</td>
              <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(b.readingMinutes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BooksOfTheBible() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Books of the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many books are in the Bible?", description: ANSWER, url: URL, datePublished: DATA_DATE, dateModified: DATA_DATE }),
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Books of the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">
              How many books are in the Bible?
            </h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Every count below comes from the full text of the King James Version and the World English Bible.
                Catholic canon:{" "}
                <a href="https://bible.usccb.org/bible" className="underline underline-offset-2" rel="noopener">
                  USCCB
                </a>
                .
              </p>
            </div>
            <StatTiles
              stats={[
                { label: "Books", value: totals.books, note: `${totals.ot} OT, ${totals.nt} NT` },
                { label: "Chapters", value: fmt(totals.chapters), note: `${fmt(totals.otChapters)} OT, ${fmt(totals.ntChapters)} NT` },
                { label: "Verses (KJV)", value: fmt(bible.kjv.verses), note: `${fmt(totals.otVerses)} OT, ${fmt(totals.ntVerses)} NT` },
                { label: "Words (KJV)", value: fmt(bible.kjv.words), note: `about ${Math.round(bible.kjv.readingHours)} hours to read` },
              ]}
            />
          </div>
        </section>

        <Section
          id="old-testament"
          title={`The ${totals.ot} books of the Old Testament`}
          intro={`From Genesis to Malachi: ${fmt(totals.otChapters)} chapters, ${fmt(totals.otVerses)} verses and ${fmt(totals.otWords)} words in the KJV, ${Math.round((totals.otWords / bible.kjv.words) * 100)}% of the whole Bible. Reading times assume ${READING_WPM} words a minute.`}
        >
          <BookTable list={otBooks} />
        </Section>

        <Section
          id="new-testament"
          title={`The ${totals.nt} books of the New Testament`}
          intro={`From Matthew to Revelation: ${fmt(totals.ntChapters)} chapters, ${fmt(totals.ntVerses)} verses and ${fmt(totals.ntWords)} words in the KJV.`}
          muted
        >
          <BookTable list={ntBooks} />
        </Section>

        <Section id="longest" title="What is the longest book in the Bible?" intro={longestAnswer}>
          <BarRows rows={byKjvWords.slice(0, 10).map((b) => ({ label: b.name, value: b.words.kjv, href: `/books/${b.slug}` }))} />
          <p className="mt-3 text-xs text-muted-foreground">Words in the King James Version, top 10 of 66.</p>
        </Section>

        <Section id="shortest" title="What is the shortest book in the Bible?" intro={shortestAnswer} muted>
          <BarRows rows={byKjvWords.slice(-10).reverse().map((b) => ({ label: b.name, value: b.words.kjv, href: `/books/${b.slug}` }))} />
          <p className="mt-3 text-xs text-muted-foreground">
            Words in the King James Version, the 10 shortest books. {singleChapter.length} books have a single chapter:{" "}
            {singleChapter.map((b) => b.name).join(", ")}.
          </p>
        </Section>

        <FaqSection title="Questions about the books of the Bible" faqs={faqs.filter((f) => ![ANSWER, longestAnswer, shortestAnswer].includes(f.a))} />

        <Section muted>
          <p className="mb-4">
            More counts:{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              the longest, shortest and middle verse and chapter
            </Link>
            ,{" "}
            <Link href="/how-long-does-it-take-to-read-the-bible" className="underline underline-offset-2 hover:text-primary">
              how long it takes to read the Bible
            </Link>{" "}
            and{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">
              how many times a word appears in the Bible
            </Link>
            .
          </p>
          <MethodNote text={METHOD} date={DATA_DATE} />
        </Section>
      </div>
    </>
  );
}
