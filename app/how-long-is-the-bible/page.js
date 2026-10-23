/* How long is the Bible: words, pages and hours, computed from the full KJV and WEB text */

import Link from "next/link";
import { books, otBooks, ntBooks, bible, totals, fmt, readingTime, METHOD, SITE } from "@/lib/bibleData";
import { HOW_LONG as H, LIST_DATE } from "@/lib/bookLists";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-long-is-the-bible`;
const STUDY = "https://doi.org/10.1016/j.jml.2019.104047";
const k = bible.kjv;
const w = bible.web;
const sum = (list, t = "kjv") => list.reduce((s, b) => s + b.words[t], 0);
const pages = (n) => Math.round(n / H.PAGE);
const hours = (min) => (min / 60).toFixed(1);

const TITLE = `How Long Is the Bible? ${fmt(k.words)} Words, ${fmt(H.kPages)} Pages, ${Math.round(H.kSilent / 60)} Hours`;
const ANSWER = `The King James Bible is ${fmt(k.words)} words, ${fmt(k.verses)} verses and ${fmt(k.chapters)} chapters. At ${H.PAGE} words a page that is about ${fmt(H.kPages)} pages. It takes about ${hours(H.kSilent)} hours to read silently (${H.SILENT} words a minute) or ${hours(H.kAloud)} hours aloud (${H.ALOUD} words a minute). The World English Bible is shorter: ${fmt(w.words)} words, about ${fmt(H.wPages)} pages.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Bible is ${fmt(k.words)} words in the KJV (${fmt(w.words)} in the WEB), about ${fmt(H.kPages)} pages at ${H.PAGE} words a page, ${hours(H.kSilent)} hours to read. Counted from the full text.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const rows = [
  { label: "Whole Bible", list: books },
  { label: "Old Testament", list: otBooks },
  { label: "New Testament", list: ntBooks },
];

const faqs = [
  { q: "How long is the Bible?", a: ANSWER },
  { q: "How many words are in the Bible?", a: `${fmt(k.words)} in the King James Version and ${fmt(w.words)} in the World English Bible, counting verse text only (${fmt(sum(otBooks))} KJV words in the Old Testament and ${fmt(sum(ntBooks))} in the New). Counts you see elsewhere differ by a few thousand depending on the edition and on whether psalm titles (${fmt(bible.psalmTitleWords)} words) and hyphenated names count.` },
  { q: "How many pages are in the Bible?", a: `There is no single answer, because a printed Bible's page count depends on its type size, margins and notes. At the common convention of ${H.PAGE} words a page, the KJV text is about ${fmt(H.kPages)} pages and the WEB about ${fmt(H.wPages)}.` },
  { q: "How many verses and chapters are in the Bible?", a: `${fmt(k.verses)} verses and ${fmt(k.chapters)} chapters in the KJV (${fmt(w.verses)} verses in the WEB, which leaves ${bible.webMissing.filter((r) => !r.startsWith("Romans ")).join(", ")} to footnotes and numbers the closing doxology of Romans as 14:24-26).` },
  { q: "How long does it take to read the Bible out loud?", a: `About ${readingTime(H.kAloud)} at ${H.ALOUD} words a minute, the average adult reading-aloud rate (Brysbaert 2019).` },
  { q: "Why are the KJV and WEB different lengths?", a: `The two translate the same books with different wording: the KJV uses ${fmt(k.words - w.words)} more words (${((k.words / w.words - 1) * 100).toFixed(1)}% more) over ${fmt(k.verses)} verses.` },
];

export default function HowLongIsTheBible() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How long is the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How long is the Bible?", description: ANSWER, url: URL, datePublished: LIST_DATE, dateModified: LIST_DATE }),
    generateFAQSchema(faqs)
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How long is the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How long is the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 22, 2026</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Reading rates from{" "}
                <a href={STUDY} className="underline underline-offset-2" rel="noopener">Brysbaert (2019)</a>: adults read English non-fiction silently at {H.SILENT} words a minute and aloud at {H.ALOUD}. Pages are words divided by {H.PAGE}, a stated convention, not a printed count.
              </p>
            </div>
            <StatTiles
              stats={[
                { label: "Words (KJV)", value: fmt(k.words), note: `${fmt(w.words)} in the WEB` },
                { label: "Pages at 250 words", value: fmt(H.kPages), note: `${fmt(H.wPages)} for the WEB` },
                { label: "Hours, silent", value: hours(H.kSilent), note: `at ${H.SILENT} words a minute` },
                { label: "Hours, aloud", value: hours(H.kAloud), note: `at ${H.ALOUD} words a minute` },
              ]}
            />
          </div>
        </section>

        <Section id="words" title="How many words, pages and hours" intro="Verse text only. KJV and World English Bible counts side by side.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Part</th>
                  <th className="p-3 font-semibold text-right">Words (KJV)</th>
                  <th className="p-3 font-semibold text-right">Words (WEB)</th>
                  <th className="p-3 font-semibold text-right">Pages (KJV)</th>
                  <th className="p-3 font-semibold text-right">Silent (KJV)</th>
                  <th className="p-3 font-semibold text-right">Aloud (KJV)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b last:border-0">
                    <td className="p-3">{r.label}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(sum(r.list))}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(sum(r.list, "web"))}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(pages(sum(r.list)))}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(sum(r.list) / H.SILENT)}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(sum(r.list) / H.ALOUD)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="by-book" title="Length of every book" intro="All 66 books in canon order, with pages at 250 words and reading time at 238 words a minute." muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold text-right">Words (KJV)</th>
                  <th className="p-3 font-semibold text-right">Words (WEB)</th>
                  <th className="p-3 font-semibold text-right">Pages</th>
                  <th className="p-3 font-semibold text-right whitespace-nowrap">Silent</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.slug} className="border-b last:border-0">
                    <td className="p-3 tabular-nums text-muted-foreground">{b.order}</td>
                    <td className="p-3"><Link href={`/books/${b.slug}`} className="underline underline-offset-2 hover:text-primary">{b.name}</Link></td>
                    <td className="p-3 text-right tabular-nums">{fmt(b.words.kjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(b.words.web)}</td>
                    <td className="p-3 text-right tabular-nums">{b.words.kjv / H.PAGE < 1 ? "under 1" : fmt(pages(b.words.kjv))}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{readingTime(b.words.kjv / H.SILENT)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <FaqSection title="Questions about the length of the Bible" faqs={faqs} />

        <Section muted>
          <p className="mb-4">
            To plan your own pace use the{" "}
            <Link href="/how-long-does-it-take-to-read-the-bible" className="underline underline-offset-2 hover:text-primary">Bible reading time calculator</Link>
            ; for lists see{" "}
            <Link href="/books-of-the-bible-in-order" className="underline underline-offset-2 hover:text-primary">the books of the Bible in order</Link>,{" "}
            <Link href="/longest-book-in-the-bible" className="underline underline-offset-2 hover:text-primary">the longest book</Link> and{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={LIST_DATE} />
        </Section>
      </div>
    </>
  );
}
