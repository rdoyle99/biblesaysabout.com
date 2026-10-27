import { OG_VIDEOS } from "@/lib/og-video";
/* How many proverbs are there: chapters, verses and sections of Proverbs counted from the full KJV text (scripts/build-proverbs.mjs) */

import Link from "next/link";
import proverbs from "@/lib/data/proverbs.json";
import { getBook, getWord, bible, fmt, quoted, readingTime, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-proverbs-are-there`;
const DATE = proverbs.generated;
const P = getBook("proverbs");
const word = getWord("proverb");
const S = Object.fromEntries(proverbs.sections.map((s) => [s.id, s]));
const sortedCh = [...proverbs.perChapter].sort((a, b) => b.verses - a.verses || a.chapter - b.chapter);
const longest = sortedCh[0];
const shortest = sortedCh.at(-1);
const share = Math.round((proverbs.verses / 3000) * 100);

const TITLE = `How Many Proverbs Are There? ${fmt(proverbs.verses)} Verses in ${proverbs.chapters} Chapters`;
const ANSWER = `The Book of Proverbs has ${proverbs.chapters} chapters and ${fmt(proverbs.verses)} verses (${fmt(proverbs.words)} words in the King James Version). A proverb can run over more than one verse, so verses are what can be counted, not separate sayings. 1 Kings 4:32 says Solomon "spake three thousand proverbs": even if every verse in the book were one proverb, ${fmt(proverbs.verses)} is about ${share}% of that.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Proverbs has ${proverbs.chapters} chapters and ${fmt(proverbs.verses)} verses. ${fmt(proverbs.solomonNamed)} sit under headings naming Solomon; 1 Kings 4:32 says he spoke 3,000 proverbs. Counted from the full text.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many proverbs are in the Bible?", a: ANSWER },
  { q: "How many chapters are in Proverbs?", a: `${proverbs.chapters}, which fits reading one a day through a 31-day month. Chapter ${longest.chapter} is the longest (${longest.verses} verses) and chapter ${shortest.chapter} the shortest (${shortest.verses} verses).` },
  { q: "How many verses are in Proverbs?", a: `${fmt(proverbs.verses)} in the King James Version and ${fmt(P.verses.web)} in the World English Bible, with ${fmt(P.words.kjv)} and ${fmt(P.words.web)} words.` },
  { q: "How many proverbs did Solomon write?", a: `The text gives two figures to compare. 1 Kings 4:32 says he "spake three thousand proverbs". The Book of Proverbs has ${fmt(proverbs.verses)} verses, ${fmt(proverbs.solomonNamed)} of them in sections that open with his name (${S.intro.ref}, ${S.solomon1.ref} and ${S.hezekiah.ref}). Who wrote each saying is a question this page does not settle; it counts what the text says about itself.` },
  { q: "Who are the other voices in Proverbs?", a: `The book names "the words of the wise" (from ${S.wise1.ref.replace("Proverbs ", "")}, ${S.wise1.verses} verses, and ${S.wise2.ref.replace("Proverbs ", "")}, ${S.wise2.verses} verses), Agur (chapter 30, ${S.agur.verses} verses) and king Lemuel (chapter 31, ${S.lemuel.verses} verses).` },
  { q: "How long does it take to read Proverbs?", a: `About ${readingTime(P.readingMinutes)} at ${bible.readingWpm} words a minute, the average adult silent reading rate for English non-fiction (Brysbaert 2019).` },
  ...(word ? [{ q: "How many times does the word proverb appear in the Bible?", a: `"Proverb" and "proverbs" appear ${fmt(word.kjv.total)} times in the King James Version, in ${fmt(word.kjv.verses)} verses. See the full count by book on the proverb page.` }] : []),
];

export default function HowManyProverbs() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many proverbs are there", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many proverbs are there in the Bible?", description: ANSWER, url: URL, datePublished: DATE, dateModified: DATE }),
    generateFAQSchema(faqs)
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many proverbs are there" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many proverbs are there in the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 22, 2026. What is counted: verses of the Book of Proverbs, verse text only. Where a section starts is read from the book's own opening lines, quoted below.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Chapters", value: proverbs.chapters, note: "Proverbs 1 to 31" },
                { label: "Verses", value: fmt(proverbs.verses), note: `${fmt(P.verses.web)} in the WEB` },
                { label: "Words (KJV)", value: fmt(proverbs.words), note: `${fmt(P.words.web)} in the WEB` },
                { label: "Under Solomon's name", value: fmt(proverbs.solomonNamed), note: "verses in the three sections headed as his" },
              ]}
            />
          </div>
        </section>

        <Section id="sections" title="Verses in each section of Proverbs" intro="The book announces its own sections. Each row starts at a verse that says whose words follow, quoted here, and the verse counts add up to the whole book.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Section</th>
                  <th className="p-3 font-semibold">Verses</th>
                  <th className="p-3 font-semibold text-right">Count</th>
                  <th className="p-3 font-semibold text-right">Words</th>
                  <th className="p-3 font-semibold">Opening verse (KJV)</th>
                </tr>
              </thead>
              <tbody>
                {proverbs.sections.map((s) => (
                  <tr key={s.id} className="border-b last:border-0 align-top">
                    <td className="p-3">{s.label}</td>
                    <td className="p-3 whitespace-nowrap">{s.ref.replace("Proverbs ", "")}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(s.verses)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(s.words)}</td>
                    <td className="p-3 text-muted-foreground">{quoted(s.opener)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3" colSpan={2}>Whole book</td>
                  <td className="p-3 text-right tabular-nums">{fmt(proverbs.verses)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(proverbs.words)}</td>
                  <td className="p-3" />
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="three-thousand" title="Solomon's 3,000 proverbs against the 915 verses" intro={'1 Kings 4:32 gives the 3,000; Ecclesiastes 12:9 says the Preacher set in order "many proverbs".'} muted>
          <div className="space-y-3">
            <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4">
              <p className="leading-relaxed">{quoted(proverbs.kings432.text)}</p>
              <footer className="mt-2 text-sm text-muted-foreground">{proverbs.kings432.ref} (KJV)</footer>
            </blockquote>
            <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4">
              <p className="leading-relaxed">{quoted(proverbs.eccl129.text)}</p>
              <footer className="mt-2 text-sm text-muted-foreground">{proverbs.eccl129.ref} (KJV)</footer>
            </blockquote>
          </div>
          <p className="mt-4 leading-relaxed">
            The Book of Proverbs has {fmt(proverbs.verses)} verses, about {share}% of 3,000, and {fmt(proverbs.solomonNamed)} of them sit under headings that name Solomon. The count of verses is exact; how many separate sayings those verses hold is not something the text states, because some proverbs fill two or three verses and some verses hold two sayings.
          </p>
        </Section>

        <Section id="by-chapter" title="Verses in every chapter of Proverbs" intro="KJV verse counts per chapter, counted from the text.">
          <BarRows rows={proverbs.perChapter.map((c) => ({ label: `Proverbs ${c.chapter}`, value: c.verses }))} labelWidth="w-28" />
        </Section>

        <FaqSection title="Questions about the number of proverbs" faqs={faqs} />

        <Section muted>
          <p className="mb-4">
            Read the book itself on the{" "}
            <Link href="/books/proverbs" className="underline underline-offset-2 hover:text-primary">Proverbs book page</Link>
            {word ? (
              <>
                , count the word on the{" "}
                <Link href="/words/proverb" className="underline underline-offset-2 hover:text-primary">proverb word page</Link>
              </>
            ) : null}
            , browse{" "}
            <Link href="/verses/wisdom" className="underline underline-offset-2 hover:text-primary">Bible verses about wisdom</Link>
            , see{" "}
            <Link href="/how-many-authors-wrote-the-bible" className="underline underline-offset-2 hover:text-primary">who wrote each book of the Bible</Link>
            , or test yourself with{" "}
            <Link href="/bible-trivia-questions" className="underline underline-offset-2 hover:text-primary">Bible trivia questions counted from the text</Link>
            . More counts are on{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <p className="mb-3 text-xs text-muted-foreground">Sources: the King James Version (1769) and the World English Bible, both public domain. Section openers are quoted from the KJV text above; counts by scripts/build-proverbs.mjs.</p>
          <MethodNote text={METHOD} date={DATE} />
        </Section>
      </div>
    </>
  );
}
