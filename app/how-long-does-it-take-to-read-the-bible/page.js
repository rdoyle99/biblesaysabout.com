/* How long it takes to read the Bible: word counts from the full KJV and WEB text, timed at measured reading rates */

import Link from "next/link";
import { books, otBooks, ntBooks, bible, totals, fmt, readingTime, METHOD, DATA_DATE, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, FaqSection, Section, MethodNote } from "@/components/DataBits";
import ReadingCalculator from "@/components/ReadingCalculator";

const URL = `${SITE}/how-long-does-it-take-to-read-the-bible`;
const SILENT = 238; // Brysbaert 2019: adult silent reading, English non-fiction
const ALOUD = 183; // Brysbaert 2019: adult oral reading
const STUDY = "https://doi.org/10.1016/j.jml.2019.104047";

const sum = (list, t = "kjv") => list.reduce((s, b) => s + b.words[t], 0);
const chapters = (list) => list.reduce((s, b) => s + b.chapters, 0);
const range = (from, to) => books.slice(books.findIndex((b) => b.name === from), books.findIndex((b) => b.name === to) + 1);

const groups = [
  { id: "bible", label: "The whole Bible", list: books },
  { id: "ot", label: "Old Testament", list: otBooks },
  { id: "nt", label: "New Testament", list: ntBooks },
  { id: "torah", label: "The five books of Moses (Genesis to Deuteronomy)", list: range("Genesis", "Deuteronomy") },
  { id: "gospels", label: "The four Gospels (Matthew to John)", list: range("Matthew", "John") },
  { id: "paul", label: "Paul's letters (Romans to Philemon)", list: range("Romans", "Philemon") },
];

const selections = [
  ...groups.map((g) => ({ id: g.id, label: g.label, chapters: chapters(g.list), words: { kjv: sum(g.list), web: sum(g.list, "web") } })),
  ...books.map((b) => ({ id: b.slug, label: b.name, chapters: b.chapters, words: b.words })),
];

const k = bible.kjv;
const silentMin = k.words / SILENT;
const aloudMin = k.words / ALOUD;
const yearMin = silentMin / 365;
const yearChapters = totals.chapters / 365;
const fifteen = Math.ceil(silentMin / 15);

const TITLE = `How Long Does It Take to Read the Bible? About ${Math.round(silentMin / 60)} Hours`;
const ANSWER = `About ${Math.round(silentMin / 60)} hours. The King James Bible is ${fmt(k.words)} words, which takes ${readingTime(silentMin)} at the average adult silent reading pace of ${SILENT} words a minute, or ${readingTime(aloudMin)} read aloud at ${ALOUD}. To read it in a year, read ${Math.round(yearMin)} minutes a day, about ${yearChapters.toFixed(1)} chapters. At 15 minutes a day you finish in ${fifteen} days.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Bible takes about ${Math.round(silentMin / 60)} hours to read (${fmt(k.words)} words at ${SILENT} words a minute). Calculator for any book, pace and minutes a day, plus reading times for every book.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const groupTime = (list) => readingTime(sum(list) / SILENT);
const faqs = [
  { q: "How long does it take to read the Bible?", a: ANSWER },
  {
    q: "How long does it take to read the New Testament?",
    a: `About ${groupTime(ntBooks)} at ${SILENT} words a minute: ${fmt(sum(ntBooks))} words in the KJV. The Old Testament takes about ${groupTime(otBooks)}.`,
  },
  {
    q: "How many chapters a day do you need to read the Bible in a year?",
    a: `${fmt(totals.chapters)} chapters over 365 days is ${yearChapters.toFixed(2)} a day, so three chapters on most days and four on about one day in four. In time, that is about ${Math.round(yearMin)} minutes a day at an average pace.`,
  },
  {
    q: "How long does it take to read the Bible out loud?",
    a: `About ${readingTime(aloudMin)} at ${ALOUD} words a minute, the average adult reading-aloud rate. Audio Bibles vary with the narrator's pace.`,
  },
  {
    q: "How long does it take to read the Gospels?",
    a: `Matthew, Mark, Luke and John together are ${fmt(sum(range("Matthew", "John")))} words in the KJV, about ${groupTime(range("Matthew", "John"))} of reading. Mark, the shortest Gospel, takes about ${readingTime(books.find((b) => b.slug === "mark").words.kjv / SILENT)}.`,
  },
];

export default function ReadingTimePage() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "How Long Does It Take to Read the Bible?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How long does it take to read the Bible?", description: ANSWER, url: URL, datePublished: DATA_DATE, dateModified: DATA_DATE }),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Bible reading time calculator",
      url: URL,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible reading time" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How long does it take to read the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Reading rates from{" "}
                <a href={STUDY} className="underline underline-offset-2" rel="noopener">
                  Brysbaert (2019)
                </a>
                , a review of 190 studies of silent reading and 77 of reading aloud: adults read English non-fiction silently at {SILENT} words a
                minute (most between 175 and 300) and aloud at {ALOUD}.
              </p>
            </div>
            <StatTiles
              stats={[
                { label: "Silent reading", value: `${Math.round(silentMin / 60)} h`, note: `${fmt(k.words)} words at ${SILENT}/min` },
                { label: "Reading aloud", value: `${Math.round(aloudMin / 60)} h`, note: `at ${ALOUD} words a minute` },
                { label: "In a year", value: `${Math.round(yearMin)} min/day`, note: `${yearChapters.toFixed(1)} chapters a day` },
                { label: "15 minutes a day", value: `${fifteen} days`, note: "to finish the whole Bible" },
              ]}
            />
          </div>
        </section>

        <Section title="Bible reading time calculator" intro="Pick a book or section, your pace and how many minutes a day you can read.">
          <ReadingCalculator selections={selections} />
        </Section>

        <Section title="Reading time by section" muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Section</th>
                  <th className="p-3 font-semibold text-right">Chapters</th>
                  <th className="p-3 font-semibold text-right">Words (KJV)</th>
                  <th className="p-3 font-semibold text-right">Silent</th>
                  <th className="p-3 font-semibold text-right">Aloud</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.id} className="border-b last:border-0">
                    <td className="p-3">{g.label}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(chapters(g.list))}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(sum(g.list))}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(sum(g.list) / SILENT)}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(sum(g.list) / ALOUD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          title="How long each book takes to read"
          intro={`Minutes of silent reading at ${SILENT} words a minute, King James Version. Select a book for its chapters, verses and longest verse.`}
        >
          <BarRows
            labelWidth="w-36"
            rows={books.map((b) => ({ label: b.name, value: Math.max(1, Math.round(b.words.kjv / SILENT)), href: `/books/${b.slug}`, display: readingTime(b.words.kjv / SILENT).replace(/ minutes?/, " min").replace(/ hours?/, " h") }))}
          />
        </Section>

        <FaqSection title="Reading the Bible: common questions" faqs={faqs.slice(1)} />

        <Section muted>
          <p className="mb-4">
            See every book&apos;s chapters and verses on{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">
              how many books are in the Bible
            </Link>
            , or{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              the Bible by the numbers
            </Link>
            .
          </p>
          <MethodNote text={METHOD} date={DATA_DATE} />
        </Section>
      </div>
    </>
  );
}
