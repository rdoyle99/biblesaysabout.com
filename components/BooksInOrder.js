/* Books of the Bible in order: the ordered table (chapters, verses, KJV words, reading time) grouped by section */

import Link from "next/link";
import { books, otBooks, ntBooks, bible, totals, fmt, readingTime, METHOD, SITE, READING_WPM } from "@/lib/bibleData";
import { OT_GROUPS, NT_GROUPS, LIST_DATE } from "@/lib/bookLists";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

const list = (arr) => arr.map((b) => b.name).join(", ");
const sum = (arr, f) => arr.reduce((s, b) => s + f(b), 0);
const names = (arr) => `${arr[0].name} to ${arr.at(-1).name}`;

const MODES = {
  all: {
    slug: "books-of-the-bible-in-order",
    title: `Books of the Bible in Order: All ${totals.books} Books Listed (OT and NT)`,
    h1: "Books of the Bible in order",
    set: books,
    groups: [...OT_GROUPS, ...NT_GROUPS],
    answer: `The ${totals.books} books of the Bible in order run from Genesis to Revelation: ${totals.ot} Old Testament books (${names(otBooks)}) followed by ${totals.nt} New Testament books (${names(ntBooks)}). This is the Protestant order; together they hold ${fmt(totals.chapters)} chapters and ${fmt(bible.kjv.verses)} verses. The table gives each book's number, chapters, verses, King James word count and reading time.`,
    description: `All ${totals.books} books of the Bible in order, Genesis to Revelation, grouped by Law, History, Poetry, Prophets, Gospels and Epistles, with chapters, verses and reading time.`,
  },
  ot: {
    slug: "old-testament-books-in-order",
    title: `Old Testament Books in Order: All ${totals.ot} Books Listed`,
    h1: "Old Testament books in order",
    set: otBooks,
    groups: OT_GROUPS,
    answer: `The ${totals.ot} books of the Old Testament in order are ${list(otBooks)}. They split into five groups: the Law (${OT_GROUPS[0].list.length} books), History (${OT_GROUPS[1].list.length}), Poetry and wisdom (${OT_GROUPS[2].list.length}), the major prophets (${OT_GROUPS[3].list.length}) and the minor prophets (${OT_GROUPS[4].list.length}). Together they hold ${fmt(totals.otChapters)} chapters, ${fmt(totals.otVerses)} verses and ${fmt(totals.otWords)} words in the KJV.`,
    description: `The ${totals.ot} Old Testament books in order, Genesis to Malachi, grouped by Law, History, Poetry and Prophets, with chapters, verses, words and reading time for each.`,
  },
  nt: {
    slug: "new-testament-books-in-order",
    title: `New Testament Books in Order: All ${totals.nt} Books Listed`,
    h1: "New Testament books in order",
    set: ntBooks,
    groups: NT_GROUPS,
    answer: `The ${totals.nt} books of the New Testament in order are ${list(ntBooks)}. They are the four Gospels, Acts, ${NT_GROUPS[2].list.length} letters of Paul, ${NT_GROUPS[3].list.length} general letters and Revelation. Together they hold ${fmt(totals.ntChapters)} chapters, ${fmt(totals.ntVerses)} verses and ${fmt(totals.ntWords)} words in the KJV.`,
    description: `The ${totals.nt} New Testament books in order, Matthew to Revelation, grouped by Gospels, Acts, Epistles and Revelation, with chapters, verses and reading time.`,
  },
};

export function booksInOrderMetadata(mode) {
  const m = MODES[mode];
  const url = `${SITE}/${m.slug}`;
  return {
    title: { absolute: m.title },
    description: m.description,
    alternates: { canonical: url },
    openGraph: { title: m.title, url, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

function Table({ rows, scope }) {
  const scoped = scope && scope.length < books.length;
  const scopeWords = scoped ? sum(scope, (b) => b.words.kjv) : 0;
  const sizeRank = (b) => [...scope].sort((x, y) => y.words.kjv - x.words.kjv).findIndex((x) => x.slug === b.slug) + 1;
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Book</th>
            {scoped ? <th className="p-3 font-semibold text-right whitespace-nowrap">Share of words</th> : null}
            {scoped ? <th className="p-3 font-semibold text-right whitespace-nowrap">Size rank</th> : null}
            <th className="p-3 font-semibold text-right">Chapters</th>
            <th className="p-3 font-semibold text-right">Verses</th>
            <th className="p-3 font-semibold text-right">Words (KJV)</th>
            <th className="p-3 font-semibold text-right whitespace-nowrap">Reading time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => (
            <tr key={b.slug} className="border-b last:border-0">
              <td className="p-3 tabular-nums text-muted-foreground">{b.order}</td>
              <td className="p-3">
                <Link href={`/books/${b.slug}`} className="underline underline-offset-2 hover:text-primary">{b.name}</Link>
              </td>
              {scoped ? <td className="p-3 text-right tabular-nums">{((b.words.kjv / scopeWords) * 100).toFixed(1)}%</td> : null}
              {scoped ? <td className="p-3 text-right tabular-nums">{sizeRank(b)} of {scope.length}</td> : null}
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

export default function BooksInOrder({ mode }) {
  const m = MODES[mode];
  const url = `${SITE}/${m.slug}`;
  const set = m.set;
  const setWords = sum(set, (b) => b.words.kjv);
  const faqs = [
    { q: `What are the ${mode === "all" ? "books of the Bible in order" : mode === "ot" ? "Old Testament books in order" : "New Testament books in order"}?`, a: mode === "all" ? `${totals.ot} Old Testament books from ${names(otBooks)}, then ${totals.nt} New Testament books from ${names(ntBooks)}. The full numbered table is above.` : `${list(set)}.` },
    { q: `How many books are in ${mode === "all" ? "the Bible" : mode === "ot" ? "the Old Testament" : "the New Testament"}?`, a: `${set.length} in the Protestant canon.${mode === "all" ? " Catholic Bibles have 73, adding Tobit, Judith, Wisdom, Sirach, Baruch and 1 and 2 Maccabees." : ""}` },
    { q: `How long does it take to read ${mode === "all" ? "the whole Bible" : mode === "ot" ? "the Old Testament" : "the New Testament"}?`, a: `${readingTime(setWords / READING_WPM)} at ${READING_WPM} words a minute (${fmt(setWords)} KJV words).` },
    { q: "Which book comes first and which last?", a: `${set[0].name} is first and ${set.at(-1).name} is last${mode === "all" ? "" : ` in the ${mode === "ot" ? "Old" : "New"} Testament`}; the ${mode === "all" ? "Bible" : mode === "ot" ? "Old Testament" : "New Testament"} runs ${set.length} books in all.` },
    { q: "Which books have only one chapter?", a: `${set.filter((b) => b.chapters === 1).map((b) => b.name).join(", ")}.` },
  ];
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Books of the Bible", url: `${SITE}/books-of-the-bible` },
      { name: m.h1, url },
    ]),
    generateDataArticleSchema({ headline: m.h1, description: m.answer, url, datePublished: LIST_DATE, dateModified: LIST_DATE }),
    generateFAQSchema(faqs)
  );
  const others = Object.entries(MODES).filter(([k]) => k !== mode);

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Books of the Bible", href: "/books-of-the-bible" }, { name: m.h1 }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">{m.h1}</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{m.answer}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 22, 2026</p>
            </div>
            <StatTiles
              stats={[
                { label: "Books", value: set.length },
                { label: "Chapters", value: fmt(sum(set, (b) => b.chapters)) },
                { label: "Verses (KJV)", value: fmt(sum(set, (b) => b.verses.kjv)) },
                { label: "Words (KJV)", value: fmt(setWords), note: `${readingTime(setWords / READING_WPM)} to read` },
              ]}
            />
          </div>
        </section>
        {m.groups.map((g, i) => (
          <Section
            key={g.id}
            id={g.id}
            title={`${g.label}: ${g.list.length} ${g.list.length === 1 ? "book" : "books"}`}
            intro={
              mode === "all"
                ? `${g.note}. ${fmt(sum(g.list, (b) => b.chapters))} chapters, ${fmt(sum(g.list, (b) => b.verses.kjv))} verses and ${fmt(sum(g.list, (b) => b.words.kjv))} words in the KJV. Reading times assume ${READING_WPM} words a minute.`
                : `${g.note}: ${Math.round((sum(g.list, (b) => b.words.kjv) / setWords) * 100)}% of the ${mode === "ot" ? "Old" : "New"} Testament's words, ${readingTime(sum(g.list, (b) => b.words.kjv) / READING_WPM)} start to finish. The largest book here is ${[...g.list].sort((a, b) => b.words.kjv - a.words.kjv)[0].name} and the smallest is ${[...g.list].sort((a, b) => a.words.kjv - b.words.kjv)[0].name}.`
            }
            muted={i % 2 === 1}
          >
            <Table rows={g.list} scope={set} />
          </Section>
        ))}
        <FaqSection title="Questions about the order of the books" faqs={faqs} />
        <Section muted>
          <p className="mb-4">
            Also see{" "}
            {others.map(([k, o], i) => (
              <span key={k}>
                {i > 0 ? ", " : ""}
                <Link href={`/${o.slug}`} className="underline underline-offset-2 hover:text-primary">{o.h1.toLowerCase()}</Link>
              </span>
            ))}
            ,{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">how many books are in the Bible</Link>,{" "}
            <Link href="/shortest-book-in-the-bible" className="underline underline-offset-2 hover:text-primary">the shortest book</Link>,{" "}
            <Link href="/longest-book-in-the-bible" className="underline underline-offset-2 hover:text-primary">the longest book</Link> and{" "}
            <Link href="/how-long-is-the-bible" className="underline underline-offset-2 hover:text-primary">how long the Bible is</Link>.
          </p>
          <MethodNote text={METHOD} date={LIST_DATE} />
        </Section>
      </div>
    </>
  );
}
