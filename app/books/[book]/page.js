/* Book of the Bible: chapters, verses, words and reading time, counted from the full KJV and WEB text */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  books,
  getBook,
  getWord,
  bible,
  fmt,
  readingTime,
  ordinal,
  rankBy,
  totals,
  METHOD,
  DATA_DATE,
  READING_WPM,
  SITE,
} from "@/lib/bibleData";
import { getVersesByTopic } from "@/lib/verses";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, VerseQuote, FaqSection, Section, MethodNote } from "@/components/DataBits";
import AmazonPicks from "@/components/AmazonPicks";

const wordRank = rankBy((b) => b.words.kjv);
const chapterWord = (n) => (n === 1 ? "chapter" : "chapters");

export function generateStaticParams() {
  return books.map((b) => ({ book: b.slug }));
}

function facts(b) {
  const testamentName = b.testament === "OT" ? "Old Testament" : "New Testament";
  const inTestament = books.filter((x) => x.testament === b.testament);
  const posInTestament = inTestament.findIndex((x) => x.slug === b.slug) + 1;
  const rank = wordRank(b.slug);
  const webDiff = b.verses.web !== b.verses.kjv ? bible.webMissing.filter((r) => r.startsWith(`${b.name} `)) : [];
  return { testamentName, inTestament, posInTestament, rank, webDiff };
}

export async function generateMetadata({ params }) {
  const { book } = await params;
  const b = getBook(book);
  if (!b) return { title: "Book Not Found" };
  const url = `${SITE}/books/${b.slug}`;
  const title =
    b.slug === "psalms"
      ? `How Many Psalms Are There? ${b.chapters} Psalms, ${fmt(b.verses.kjv)} Verses`
      : b.chapters === 1
        ? `How Many Verses in ${b.name}? ${b.verses.kjv} Verses, 1 Chapter`
        : `How Many Chapters in ${b.name}? ${b.chapters} Chapters, ${fmt(b.verses.kjv)} Verses`;
  const description = `${b.name} has ${b.chapters} ${chapterWord(b.chapters)}, ${fmt(b.verses.kjv)} verses and ${fmt(b.words.kjv)} words (KJV), about ${readingTime(b.readingMinutes)} of reading. Verses per chapter, longest verse, first and last verse.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default async function BookPage({ params }) {
  const { book } = await params;
  const b = getBook(book);
  if (!b) notFound();
  const { testamentName, inTestament, posInTestament, rank, webDiff } = facts(b);
  const url = `${SITE}/books/${b.slug}`;
  const prev = books[b.order - 2];
  const next = books[b.order];
  const mins = b.readingMinutes;

  const answer =
    `${b.name} has ${b.chapters} ${chapterWord(b.chapters)} and ${fmt(b.verses.kjv)} verses. ` +
    `The King James Version text of ${b.name} runs ${fmt(b.words.kjv)} words, about ${readingTime(mins)} of reading at ${READING_WPM} words a minute. ` +
    `It is book ${b.order} of the 66 books of the Bible (${ordinal(posInTestament)} of the ${inTestament.length} ${testamentName} books) and the ${ordinal(rank)} longest by word count.`;

  const longestCh = b.longestChapter;
  const shortestCh = b.shortestChapter;
  const chapterLine =
    b.chapters > 1
      ? `The longest chapter is ${b.name} ${longestCh.chapter} with ${longestCh.verses} verses; the shortest is ${b.name} ${shortestCh.chapter} with ${shortestCh.verses}.`
      : `${b.name} is a single chapter of ${b.verses.kjv} verses.`;

  const topicLinks = b.curatedTopics
    .slice(0, 12)
    .map((t) => ({ ...t, title: getVersesByTopic(t.slug)?.title?.replace(/ \(\d+\+? Verses\)$/, "") }))
    .filter((t) => t.title);

  const faqs = [
    {
      q: b.chapters === 1 ? `How many chapters are in ${b.name}?` : `How many chapters are in the book of ${b.name}?`,
      a: `${b.name} has ${b.chapters} ${chapterWord(b.chapters)}. ${chapterLine}`,
    },
    {
      q: `How many verses are in ${b.name}?`,
      a:
        `${b.name} has ${fmt(b.verses.kjv)} verses in the King James Version` +
        (webDiff.length
          ? ` and ${fmt(b.verses.web)} in the World English Bible, which moves ${webDiff.join(", ")} to a footnote.`
          : ", and the same number in the World English Bible."),
    },
    {
      q: `How long does it take to read ${b.name}?`,
      a: `About ${readingTime(mins)} at an average silent reading speed of ${READING_WPM} words a minute. The KJV text is ${fmt(b.words.kjv)} words and the World English Bible text is ${fmt(b.words.web)} words.`,
    },
    {
      q: `What is the longest verse in ${b.name}?`,
      a: `${b.longestVerse.kjv.ref} is the longest verse in ${b.name}, at ${b.longestVerse.kjv.words} words in the King James Version. The shortest is ${b.shortestVerse.kjv.ref} (${b.shortestVerse.kjv.words} words): "${b.shortestVerse.kjv.text}"`,
    },
  ];

  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Books of the Bible", url: `${SITE}/books-of-the-bible` },
      { name: b.name, url },
    ]),
    generateDataArticleSchema({
      headline: `${b.name} by the numbers`,
      description: answer,
      url,
      datePublished: DATA_DATE,
      dateModified: DATA_DATE,
    }),
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Books of the Bible", href: "/books-of-the-bible" },
                { name: b.name },
              ]}
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">
              {b.slug === "psalms"
                ? "How many psalms are in the Bible?"
                : b.chapters === 1
                  ? `How many verses are in ${b.name}?`
                  : `How many chapters are in ${b.name}?`}
            </h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{answer}</p>
            </div>
            <StatTiles
              stats={[
                { label: "Chapters", value: b.chapters, note: `of ${fmt(totals.chapters)} in the Bible` },
                { label: "Verses (KJV)", value: fmt(b.verses.kjv), note: `WEB: ${fmt(b.verses.web)}` },
                { label: "Words (KJV)", value: fmt(b.words.kjv), note: `${ordinal(rank)} longest of 66` },
                { label: "Reading time", value: readingTime(mins).replace(/ minutes?/, " min").replace(/ hours?/, " h"), note: `at ${READING_WPM} words a minute` },
              ]}
            />
          </div>
        </section>

        {b.chapters > 1 ? (
          <Section title={`Verses in each chapter of ${b.name}`} intro={chapterLine}>
            <BarRows
              labelWidth="w-24"
              rows={b.perChapter.map((n, i) => ({ label: `Chapter ${i + 1}`, value: n }))}
            />
          </Section>
        ) : null}

        <Section title={`Longest and shortest verse in ${b.name}`} muted>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Longest: {b.longestVerse.kjv.ref}, {b.longestVerse.kjv.words} words in the KJV.
            </p>
            <VerseQuote reference={b.longestVerse.kjv.ref} text={b.longestVerse.kjv.text} translation="KJV" />
            <p className="text-muted-foreground">
              Shortest: {b.shortestVerse.kjv.ref}, {b.shortestVerse.kjv.words} words in the KJV.
            </p>
            <VerseQuote reference={b.shortestVerse.kjv.ref} text={b.shortestVerse.kjv.text} translation="KJV" />
          </div>
        </Section>

        <Section title={`How ${b.name} begins and ends`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">First verse, {b.first.kjv.ref}</h3>
              <VerseQuote reference={b.first.kjv.ref} text={b.first.kjv.text} translation="KJV" />
              <VerseQuote reference={b.first.web.ref} text={b.first.web.text} translation="WEB" />
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold">Last verse, {b.last.kjv.ref}</h3>
              <VerseQuote reference={b.last.kjv.ref} text={b.last.kjv.text} translation="KJV" />
              <VerseQuote reference={b.last.web.ref} text={b.last.web.text} translation="WEB" />
            </div>
          </div>
        </Section>

        {topicLinks.length ? (
          <Section
            title={`${b.name} in our topic collections`}
            intro={`${b.curatedVerses} ${b.curatedVerses === 1 ? "verse" : "verses"} from ${b.name} ${b.curatedVerses === 1 ? "appears" : "appear"} on our Bible verse topic pages${topicLinks.length > 1 ? ", most often in these topics:" : ":"}`}
            muted
          >
            <ul className="grid sm:grid-cols-2 gap-2">
              {topicLinks.map((t) => (
                <li key={t.slug}>
                  <Link href={`/verses/${t.slug}`} className="hover:text-primary underline underline-offset-2">
                    {t.title}
                  </Link>{" "}
                  <span className="text-sm text-muted-foreground">
                    ({t.verses} from {b.name})
                  </span>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        <FaqSection title={`${b.name}: common questions`} faqs={faqs} />

        <AmazonPicks
          title={`Study ${b.name}`}
          items={[
            { label: `${b.name} commentaries`, query: `${b.name} bible commentary`, note: "Verse-by-verse explanation" },
            { label: `${b.name} Bible studies`, query: `${b.name} bible study`, note: "Guides for personal or group study" },
            { label: "KJV study Bibles", query: "KJV study Bible", note: "Notes, cross references and maps" },
          ]}
        />

        <Section muted>
          <div className="flex flex-wrap justify-between gap-4 mb-6">
            {prev ? (
              <Link href={`/books/${prev.slug}`} className="underline underline-offset-2 hover:text-primary">
                Previous book: {prev.name}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/books/${next.slug}`} className="underline underline-offset-2 hover:text-primary">
                Next book: {next.name}
              </Link>
            ) : null}
          </div>
          {getWord(b.slug) ? (
            <p className="mb-4">
              How often is the name mentioned? See{" "}
              <Link href={`/words/${b.slug}`} className="underline underline-offset-2 hover:text-primary">
                how many times {b.name} is mentioned in the Bible
              </Link>
              , counted in the KJV and the World English Bible.
            </p>
          ) : null}
          <p className="mb-4">
            Compare all 66 books on{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">
              how many books are in the Bible
            </Link>
            , see{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              the Bible by the numbers
            </Link>
            , or work out{" "}
            <Link href="/how-long-does-it-take-to-read-the-bible" className="underline underline-offset-2 hover:text-primary">
              how long it takes to read the Bible
            </Link>{" "}
            at your own pace.
          </p>
          <MethodNote text={METHOD} date={DATA_DATE} />
        </Section>
      </div>
    </>
  );
}
