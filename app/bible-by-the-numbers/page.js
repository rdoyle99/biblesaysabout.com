/* The Bible by the numbers: verses, chapters, words, and the longest, shortest and middle verse and chapter */

import Link from "next/link";
import { books, bible, totals, fmt, METHOD, DATA_DATE, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import AmazonPicks from "@/components/AmazonPicks";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, VerseQuote, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/bible-by-the-numbers`;
const k = bible.kjv;
const w = bible.web;
const TITLE = `How Many Verses in the Bible? ${fmt(k.verses)} Verses, ${fmt(k.words)} Words`;
const psalms = books.find((b) => b.slug === "psalms");
const kjvShortest = k.shortestVerses.map((v) => `${v.ref} ("${v.text}")`).join(" and ");
const middle = k.middleVerses.map((v) => v.ref).join(" and ");

const ANSWER = `The King James Bible has ${fmt(k.verses)} verses in ${fmt(k.chapters)} chapters, and ${fmt(k.words)} words. The shortest verse is John 11:35, "Jesus wept." The longest is ${k.longestVerse.ref} at ${k.longestVerse.words} words. ${k.longestChapter.ref} is the longest chapter (${k.longestChapter.verses} verses) and ${k.shortestChapter.ref} the shortest (${k.shortestChapter.verses}). The middle verses are ${middle}.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Bible has ${fmt(k.verses)} verses, ${fmt(k.chapters)} chapters and ${fmt(k.words)} words (KJV). The shortest, longest and middle verse and chapter, counted from the full text.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  {
    q: "How many verses are in the Bible?",
    a: `${fmt(k.verses)} in the King James Version: ${fmt(totals.otVerses)} in the Old Testament and ${fmt(totals.ntVerses)} in the New. The World English Bible numbers ${fmt(w.verses)}, because it prints ${bible.webMissing.length} verses as footnotes (${bible.webMissing.join(", ")}) and numbers the closing doxology of Romans as 14:24-26.`,
  },
  {
    q: "How many chapters are in the Bible?",
    a: `${fmt(k.chapters)}: ${fmt(totals.otChapters)} in the Old Testament and ${fmt(totals.ntChapters)} in the New Testament. Psalms alone has ${psalms.chapters}.`,
  },
  {
    q: "How many words are in the Bible?",
    a: `${fmt(k.words)} words in the King James Version and ${fmt(w.words)} in the World English Bible, counting verse text only. Published counts differ by a few thousand depending on the edition and on whether psalm titles and hyphenated names count as one word.`,
  },
  {
    q: "What is the shortest verse in the Bible?",
    a: `John 11:35, "Jesus wept." It is two words in the KJV and the World English Bible. In the KJV, 1 Thessalonians 5:16 ("Rejoice evermore.") is also two words but has more letters.`,
  },
  {
    q: "What is the longest verse in the Bible?",
    a: `${k.longestVerse.ref}, at ${k.longestVerse.words} words in the King James Version (${w.longestVerse.words} in the World English Bible). It records the king's scribes writing Mordecai's decree to the 127 provinces from India to Ethiopia, each in its own script and language.`,
  },
  {
    q: "What is the middle verse of the Bible?",
    a: `The KJV has an even number of verses (${fmt(k.verses)}), so two verses share the middle: ${middle} (verses ${fmt(k.middleVerses[0].position)} and ${fmt(k.middleVerses[1].position)}). Psalm 118:8 is often called the middle verse, but it is verse ${fmt(bible.psalm118v8Position)}.`,
  },
  {
    q: "What is the longest and shortest chapter in the Bible?",
    a: `${k.longestChapter.ref} is the longest, with ${k.longestChapter.verses} verses. ${k.shortestChapter.ref} is the shortest, with ${k.shortestChapter.verses}. ${k.middleChapters[0].ref} is also the middle chapter of the Bible: chapter ${fmt(k.middleChapters[0].position)} of ${fmt(k.chapters)}.`,
  },
];

export default function BibleByTheNumbers() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "The Bible by the Numbers", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The Bible by the numbers", description: ANSWER, url: URL, datePublished: DATA_DATE, dateModified: DATA_DATE }),
    generateFAQSchema(faqs)
  );
  const longestChapters = books
    .flatMap((b) => b.perChapter.map((n, i) => ({ label: `${b.name === "Psalms" ? "Psalm" : b.name} ${i + 1}`, value: n, href: `/books/${b.slug}` })))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "The Bible by the Numbers" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The Bible by the numbers</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
            </div>
            <StatTiles
              stats={[
                { label: "Verses (KJV)", value: fmt(k.verses), note: `WEB: ${fmt(w.verses)}` },
                { label: "Chapters", value: fmt(k.chapters), note: `${fmt(totals.otChapters)} OT, ${fmt(totals.ntChapters)} NT` },
                { label: "Words (KJV)", value: fmt(k.words), note: `WEB: ${fmt(w.words)}` },
                { label: "Books", value: totals.books, note: `${totals.ot} OT, ${totals.nt} NT` },
              ]}
            />
          </div>
        </section>

        <Section id="verses" title={faqs[0].q} intro={faqs[0].a}>
          <BarRows
            labelWidth="w-40"
            rows={[...books]
              .sort((a, b) => b.verses.kjv - a.verses.kjv)
              .slice(0, 10)
              .map((b) => ({ label: b.name, value: b.verses.kjv, href: `/books/${b.slug}` }))}
          />
          <p className="mt-3 text-xs text-muted-foreground">The 10 books with the most verses (KJV).</p>
        </Section>

        <Section id="words" title={faqs[2].q} intro={faqs[2].a} muted>
          <p className="text-muted-foreground">
            The Old Testament holds {fmt(totals.otWords)} of the KJV&apos;s words ({Math.round((totals.otWords / k.words) * 100)}%) and the New
            Testament {fmt(totals.ntWords)}. See{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">
              every book&apos;s word count
            </Link>{" "}
            or{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">
              how often a single word appears
            </Link>
            .
          </p>
        </Section>

        <Section id="shortest-verse" title={faqs[3].q} intro={faqs[3].a}>
          <div className="space-y-4">
            <VerseQuote reference="John 11:35" text="Jesus wept." translation="KJV" />
            <p className="text-sm text-muted-foreground">
              Every two-word verse: KJV {kjvShortest}; World English Bible {w.shortestVerses.map((v) => `${v.ref} ("${v.text}")`).join(", ")}.
            </p>
          </div>
        </Section>

        <Section id="longest-verse" title={faqs[4].q} intro={faqs[4].a} muted>
          <VerseQuote reference={k.longestVerse.ref} text={k.longestVerse.text} translation="KJV" />
        </Section>

        <Section id="middle-verse" title={faqs[5].q} intro={faqs[5].a}>
          <div className="space-y-4">
            {k.middleVerses.map((v) => (
              <VerseQuote key={v.ref} reference={v.ref} text={v.text} translation="KJV" />
            ))}
          </div>
        </Section>

        <Section id="chapters" title={faqs[1].q} intro={faqs[1].a} muted />

        <Section id="longest-chapter" title={faqs[6].q} intro={faqs[6].a}>
          <BarRows labelWidth="w-36" rows={longestChapters} />
          <p className="mt-3 text-xs text-muted-foreground">The 10 longest chapters by verse count (KJV).</p>
        </Section>

        <AmazonPicks
          title="Go deeper"
          items={[
            { label: "Bible handbooks", query: "bible handbook", note: "A guide to every book of the Bible" },
            { label: "Strong's Exhaustive Concordance", query: "Strong's Exhaustive Concordance of the Bible", note: "Every word of the KJV, indexed" },
            { label: "KJV study Bibles", query: "KJV study Bible", note: "Notes, cross references and maps" },
          ]}
        />

        <Section muted>
          <MethodNote text={METHOD} date={DATA_DATE} />
        </Section>
      </div>
    </>
  );
}
