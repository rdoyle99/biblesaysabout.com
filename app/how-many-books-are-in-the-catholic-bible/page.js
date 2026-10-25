import { OG_VIDEOS } from "@/lib/og-video";
/* How many books are in the Catholic Bible: 73 (46 + 27) in the USCCB's order, the seven deuterocanonical books and the
   additions to Esther and Daniel counted from the World English Bible, the Catholic, Protestant and Greek Orthodox lists
   side by side, and the Apocrypha the King James Version carries.
   Counted by scripts/lists/how-many-books-are-in-the-catholic-bible.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-many-books-are-in-the-catholic-bible.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-books-are-in-the-catholic-bible`;
const link = "underline underline-offset-2 hover:text-primary";
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const W = DATA.words;
const SEVEN = DATA.deutero.map((d) => d.name);
const ESTHER = DATA.additions[0];
const SONG = DATA.additions[1];
const DANIEL_ADDS = DATA.additions.slice(1);
const SECTIONS = [...new Set(DATA.catholicOt.map((b) => b.section))];
const ORTHO = Object.fromEntries(DATA.other.map((o) => [o.name, o]));

const SRC = {
  usccb: "https://bible.usccb.org/bible",
  usccbDan: "https://bible.usccb.org/bible/daniel/13",
  trent: "https://history.hanover.edu/texts/trent/ct04.html",
  deut: "https://en.wikipedia.org/wiki/Deuterocanonical_books",
  canon: "https://en.wikipedia.org/wiki/Biblical_canon",
  luther: "https://en.wikipedia.org/wiki/Luther_Bible",
  kjv: "https://en.wikipedia.org/wiki/King_James_Version",
  ow: "https://orthodoxwiki.org/Old_Testament_Canon",
};

const TITLE = `How Many Books Are in the Catholic Bible? ${DATA.total} (Full List)`;
const ANSWER = `The Catholic Bible has ${DATA.total} books: ${DATA.ot} in the Old Testament and ${DATA.nt} in the New. The ${DATA.extra} that Protestant Bibles do not count are ${joinAnd(SEVEN)}, and Catholic editions of Esther and Daniel include the Greek additions. Protestant Bibles have ${DATA.protestant.total} books, with the same ${DATA.nt} in the New Testament.`;
const OWNED = `By our count of the World English Bible text, the ${DATA.extra} deuterocanonical books and the additions to Esther and Daniel come to ${fmt(W.extraWeb)} words, ${W.pctOfNt}% of the length of the whole New Testament (${fmt(W.ntWeb)} words). They make a ${DATA.total}-book Bible ${W.pctLonger}% longer than a ${DATA.protestant.total}-book one.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Catholic Bible has ${DATA.total} books: ${DATA.ot} Old Testament, ${DATA.nt} New. The ${DATA.extra} deuterocanonical books counted, the Apocrypha, and Catholic, Protestant and Orthodox lists.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many books are in the Catholic Bible?", a: `${DATA.total}: ${DATA.ot} in the Old Testament and ${DATA.nt} in the New Testament, the list the US Conference of Catholic Bishops gives on its Books of the Bible page. Baruch counts as one book with the Letter of Jeremiah as its chapter 6.` },
  { q: "What are the books of the Apocrypha?", a: `In the King James Version the Apocrypha is ${DATA.kjv.books} books: ${joinAnd(DATA.kjv.list.map((b) => b.name))}. ${DATA.kjv.catholicRows} of them are books or parts of books in the Catholic Bible; ${joinAnd(DATA.kjv.notCatholic)} are not. Protestants call the Catholic deuterocanonical books the Apocrypha.` },
  { q: "Why do Catholic Bibles have 73 books and Protestant Bibles 66?", a: `The ${DATA.extra} extra books are in the Septuagint, the Greek Old Testament, but not in the Hebrew Bible (Wikipedia, "Deuterocanonical books"). The Catholic Church set out its list of books, with these seven in it, at the Council of Trent on April 8, 1546. Protestant churches kept the books of the Hebrew Bible, which they count as ${DATA.protestant.ot}. Both have the same ${DATA.nt} New Testament books.` },
  { q: "Did the 1611 King James Bible include the Apocrypha?", a: `Yes. Wikipedia's article on the King James Version says the 1611 edition had 80 books: 39 Old Testament, 14 Apocrypha and 27 New Testament, and that the first editions bound without the Apocrypha date from 1666. The standard 1769 text still carries all ${DATA.kjv.books} books, ${fmt(DATA.kjv.words)} words by our count, printed between Malachi and Matthew.` },
  { q: "What is the longest deuterocanonical book?", a: `${DATA.longest.name}, with ${DATA.longest.chapters} chapters and ${fmt(DATA.longest.words)} words in the World English Bible. That is longer than any New Testament book (the longest, ${DATA.longestNt.name}, has ${fmt(DATA.longestNt.words)} words in the same translation). The shortest of the ${DATA.extra} is ${DATA.shortest.name}, ${fmt(DATA.shortest.words)} words.` },
  { q: "Do Orthodox Bibles have more books than Catholic Bibles?", a: `Yes. Greek Orthodox Bibles have all ${DATA.extra} Catholic deuterocanonical books and add 1 Esdras, 3 Maccabees and Psalm 151, with 4 Maccabees in an appendix and the Prayer of Manasseh also printed, according to Wikipedia's "Biblical canon" table and OrthodoxWiki. Other Orthodox churches differ in the details.` },
];

export default function CatholicBibleBooks() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many books are in the Catholic Bible?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many books are in the Catholic Bible?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const yes = (v) => (v ? "Yes" : "No");
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many books are in the Catholic Bible?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many books are in the Catholic Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. The book list is the USCCB&apos;s. Chapters, verses and words are counted from the World English Bible, which prints the deuterocanonical books, and from the King James Version&apos;s Apocrypha.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Books in a Catholic Bible", value: DATA.total, note: `${DATA.ot} Old Testament + ${DATA.nt} New` },
                { label: "Deuterocanonical books", value: DATA.extra, note: `${DATA.total} minus ${DATA.protestant.total}` },
                { label: "Words they add (WEB)", value: fmt(W.extraWeb), note: `with the Esther and Daniel additions; ${W.pctOfNt}% of the New Testament` },
                { label: `Longest: ${DATA.longest.name}`, value: fmt(DATA.longest.words), note: `words (WEB), ${DATA.longest.chapters} chapters` },
              ]}
            />
          </div>
        </section>

        <Section id="deuterocanon" title="What are the deuterocanonical books?">
          <p className="leading-relaxed mb-4">
            The deuterocanonical books are the {DATA.extra} Old Testament books in Catholic Bibles that are not in the Hebrew Bible: {joinAnd(SEVEN)}. The name means &quot;second canon&quot;; Wikipedia&apos;s &quot;Deuterocanonical books&quot; article dates the term to 1566 and the theologian Sixtus of Siena. Protestants call the same books the Apocrypha. The table counts each one in the World English Bible (WEB), with the King James Version (KJV) word count beside it.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold text-right">Chapters</th>
                  <th className="p-3 font-semibold text-right">Verses (WEB)</th>
                  <th className="p-3 font-semibold text-right">Words (WEB)</th>
                  <th className="p-3 font-semibold text-right">Words (KJV)</th>
                  <th className="p-3 font-semibold">What it is</th>
                </tr>
              </thead>
              <tbody>
                {DATA.deutero.map((d) => (
                  <tr key={d.name} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium whitespace-nowrap">
                      {d.name}
                      {d.kjvName !== d.name ? <span className="block text-xs text-muted-foreground font-normal">KJV: {d.kjvName}</span> : null}
                    </td>
                    <td className="p-3 text-right tabular-nums">{d.chapters}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(d.verses)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(d.words)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(d.wordsKjv)}</td>
                    <td className="p-3">{d.summary} <span className="text-xs text-muted-foreground whitespace-nowrap">({d.ref})</span></td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3">All {DATA.extra}</td>
                  <td className="p-3 text-right tabular-nums">{DATA.deuteroTotal.chapters}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(DATA.deuteroTotal.verses)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(DATA.deuteroTotal.words)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(DATA.deuteroTotal.wordsKjv)}</td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed font-medium">{OWNED}</p>
          <p className="mt-3 leading-relaxed">
            {DATA.longest.name} is the longest of the {DATA.extra} at {fmt(DATA.longest.words)} words (WEB), longer than {DATA.longestNt.name}, the longest New Testament book ({fmt(DATA.longestNt.words)} words in the WEB). Set among all {DATA.protestant.total} books of the Protestant Bible, it would rank {DATA.longest.rankAmong67}th by length (WEB words). {DATA.shortest.name} is the shortest, {fmt(DATA.shortest.words)} words. The writer of {DATA.longest.name} signs his name near the end: &quot;{DATA.quotes.sirach50.kjv}&quot; ({DATA.longest.name} 50:27, KJV). The writer of 2 Maccabees closes with an apology: &quot;{DATA.quotes.macc15.web}&quot; (2 Maccabees 15:38, WEB).
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Verse counts are the same in both translations except {DATA.longest.name}: the KJV has text at {DATA.sirachGaps.kjvOnly.length} verse numbers where the WEB has none (among them 26:{DATA.sirachGaps.kjvOnly.filter((r) => r.startsWith("26:")).map((r) => r.slice(3)).join(", ")}), and the WEB has one, {DATA.sirachGaps.webOnly.join(", ")}, that the KJV lacks, so the KJV counts {fmt(DATA.longest.versesKjv)} verses to the WEB&apos;s {fmt(DATA.longest.verses)}. Baruch&apos;s count includes chapter 6, the Letter of Jeremiah, which the KJV prints as &quot;the Epistle of Jeremy&quot;. Jeremiah&apos;s own book is at <Link href="/books/jeremiah" className={link}>Jeremiah</Link>; {wordLink("baruch", "Baruch")} is also named there as his scribe.
          </p>
        </Section>

        <Section id="additions" title="What are the additions to Esther and Daniel?" muted>
          <p className="leading-relaxed mb-4">
            They are passages from the Greek Old Testament that Catholic Bibles print inside <Link href="/books/esther" className={link}>Esther</Link> and <Link href="/books/daniel" className={link}>Daniel</Link>: five passages in Esther as the WEB sets them out, and three in Daniel. They are not counted as separate books, so they do not change the total of {DATA.total}. The USCCB&apos;s Bible prints Susanna and Bel and the Dragon as Daniel chapters 13 and 14, with a note that they were never part of the Hebrew Bible and were in the Septuagint. The WEB places the Song of the Three in Daniel 3 after verse 23, where the three men are thrown into the furnace.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Addition</th>
                  <th className="p-3 font-semibold">Where it goes</th>
                  <th className="p-3 font-semibold text-right">Verses (KJV)</th>
                  <th className="p-3 font-semibold text-right">Words (WEB)</th>
                  <th className="p-3 font-semibold text-right">Words (KJV)</th>
                </tr>
              </thead>
              <tbody>
                {DATA.additions.map((a) => (
                  <tr key={a.name} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">
                      {a.name}
                      <span className="block text-xs text-muted-foreground font-normal">KJV: {a.kjvName}</span>
                    </td>
                    <td className="p-3">{a.where}</td>
                    <td className="p-3 text-right tabular-nums">{a.versesKjv}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(a.words)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(a.wordsKjv)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3" colSpan={3}>All additions</td>
                  <td className="p-3 text-right tabular-nums">{fmt(DATA.additionsTotal.words)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(DATA.additionsTotal.wordsKjv)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed">
            The Esther additions change the book most. Esther as translated from the Hebrew never uses the words &quot;God&quot; or &quot;Lord&quot;: {DATA.esther.hebrewGodOrLord.kjv} times in the KJV and {DATA.esther.hebrewGodOrLord.web} in the WEB. The {fmt(ESTHER.words)} words of the Greek additions say &quot;God&quot; {DATA.esther.additionsGod} times and &quot;Lord&quot; {DATA.esther.additionsLord} times (WEB). The KJV prints them on their own, as &quot;The Rest of Esther&quot;, chapters {ESTHER.kjvChapters}; the WEB translates the whole Greek Esther ({fmt(DATA.esther.greekWords)} words, against {fmt(DATA.esther.hebrewWords)} for the Hebrew) and brackets the additions.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The WEB numbers the Song of the Three 1 to {SONG.versesNumbered} but has no verse {joinAnd(SONG.skipped.map(String))}, so it holds {SONG.verses} verses to the KJV&apos;s {SONG.versesKjv}. The three Daniel additions together are {fmt(DANIEL_ADDS.reduce((n, a) => n + a.words, 0))} words in the WEB.
          </p>
        </Section>

        <Section id="compare" title="Catholic vs Protestant vs Orthodox: which books does each Bible have?">
          <p className="leading-relaxed mb-4">
            Protestant Bibles have {DATA.protestant.total} books, Catholic Bibles {DATA.total}, and Orthodox Bibles more again. All three share the same {DATA.nt} New Testament books and the {DATA.protestant.ot} books of the Hebrew Bible; the difference is in the books below. The Greek Orthodox column follows Wikipedia&apos;s &quot;Biblical canon&quot; table and OrthodoxWiki&apos;s &quot;Old Testament Canon&quot;; where they differ, on where the Prayer of Manasseh is printed, the cell gives both. Russian, Georgian, Armenian, Coptic and Ethiopian churches each differ in the details.
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold">Protestant ({DATA.protestant.total})</th>
                  <th className="p-3 font-semibold">Catholic ({DATA.total})</th>
                  <th className="p-3 font-semibold">Greek Orthodox</th>
                  <th className="p-3 font-semibold">KJV Apocrypha</th>
                  <th className="p-3 font-semibold text-right">Words (WEB)</th>
                </tr>
              </thead>
              <tbody>
                {DATA.deutero.map((d) => (
                  <tr key={d.name} className="border-b last:border-0">
                    <td className="p-3 font-medium">{d.name}</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">{d.name === "Baruch" ? "Yes (Letter of Jeremiah apart)" : "Yes"}</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3 text-right tabular-nums">{fmt(d.words)}</td>
                  </tr>
                ))}
                {DATA.additions.map((a) => (
                  <tr key={a.name} className="border-b last:border-0">
                    <td className="p-3 font-medium">{a.name}</td>
                    <td className="p-3">No</td>
                    <td className="p-3">Yes, inside {a.name === "Additions to Esther" ? "Esther" : "Daniel"}</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3">Yes</td>
                    <td className="p-3 text-right tabular-nums">{fmt(a.words)}</td>
                  </tr>
                ))}
                {DATA.other.map((o) => (
                  <tr key={o.name} className="border-b last:border-0">
                    <td className="p-3 font-medium">{o.name}</td>
                    <td className="p-3">No</td>
                    <td className="p-3">{yes(o.catholic)}</td>
                    <td className="p-3">{o.greek.charAt(0).toUpperCase() + o.greek.slice(1)}</td>
                    <td className="p-3">{yes(o.kjv)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(o.words)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            &quot;No&quot; in the Protestant column means the book is not part of the {DATA.protestant.total}; some Protestant Bibles still print these books in a separate Apocrypha section, as the King James Version did. 1 Esdras ({fmt(ORTHO["1 Esdras"].words)} words in the WEB), 2 Esdras and the Prayer of Manasseh are in that Apocrypha but not in the Catholic {DATA.total}. Wikipedia&apos;s &quot;Biblical canon&quot; article gives the Anglican position from Article VI of the Thirty-Nine Articles: the Apocrypha are &quot;read for example of life&quot; but not used &quot;to establish any doctrine&quot;.
          </p>
        </Section>

        <Section id="why" title="Why do Catholic and Protestant Bibles have different books?" muted>
          <p className="leading-relaxed">
            The two traditions settled on different Old Testaments. The {DATA.extra} deuterocanonical books are in the Septuagint, the Greek translation of the Old Testament used by the early church, but not in the Hebrew Bible, as Wikipedia&apos;s &quot;Deuterocanonical books&quot; article sets out. The Catholic Church holds them to be Scripture; Protestant churches keep to the books of the Hebrew Bible. Wikipedia&apos;s &quot;Biblical canon&quot; article notes that the 24 books of the Jewish Tanakh are divided into {DATA.protestant.ot} in Protestant Bibles and, with the deuterocanonical works, {DATA.ot} in Catholic ones.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>The Council of Trent, 1546.</strong> At its fourth session, on April 8, 1546, the council set down its list of the sacred books. Among them are &quot;Tobias, Judith, Esther&quot;, &quot;Wisdom, Ecclesiasticus&quot;, &quot;Jeremias, with Baruch&quot; and &quot;two books of the Machabees, the first and the second&quot;, and the decree adds that the books are to be received &quot;entire with all their parts, as they have been used to be read in the Catholic Church, and as they are contained in the old Latin vulgate edition&quot; (Waterworth&apos;s 1848 translation). Wikipedia&apos;s &quot;Deuterocanonical books&quot; article lists earlier councils that named these books, from Rome in 382 to Florence in 1442.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Luther&apos;s Bible, 1534.</strong> According to Wikipedia&apos;s &quot;Luther Bible&quot; article, Martin Luther did not drop the books from his complete German Bible of 1534. He gathered them in a section between the Old and New Testaments under the title &quot;Apocrypha: These Books Are Not Held Equal to the Scriptures, but Are Useful and Good to Read&quot;. Wikipedia&apos;s &quot;King James Version&quot; article says Protestant Bibles of the 1500s generally followed that layout, and the King James Version of 1611 did the same.
          </p>
        </Section>

        <Section id="kjv" title="Did the 1611 King James Bible include the Apocrypha?">
          <p className="leading-relaxed">
            Yes. Wikipedia&apos;s &quot;King James Version&quot; article says the 1611 edition had 80 books: 39 in the Old Testament, 14 in the Apocrypha and 27 in the New. The same article dates the first King James Bibles bound without the Apocrypha to 1666, and says the British and Foreign Bible Society stopped funding Bibles that included those books in 1826; with the rise of the Bible societies, most editions have left them out.
          </p>
          <p className="mt-3 leading-relaxed">
            The King James text this site counts from is the standard 1769 text, &quot;with Apocrypha/Deuterocanon&quot;, and it still carries all {DATA.kjv.books} books, printed between Malachi and Matthew: {fmt(DATA.kjv.chapters)} chapters, {fmt(DATA.kjv.verses)} verses and {fmt(DATA.kjv.words)} words by our count (the {DATA.protestant.total} books come to {fmt(DATA.kjv.words66)}). {DATA.kjv.catholicRows} of the {DATA.kjv.books} are Catholic books or additions; {joinAnd(DATA.kjv.notCatholic)} are not in the Catholic Bible.
          </p>
          <ol className="mt-4 grid gap-1 sm:grid-cols-2 list-decimal pl-5 text-sm">
            {DATA.kjv.list.map((b) => (
              <li key={b.id}>
                {b.name} <span className="text-muted-foreground">({fmt(b.words)} words{b.catholic ? "" : ", not in the Catholic Bible"})</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="order" title="What order are the books of the Catholic Old Testament in?" muted>
          <p className="leading-relaxed mb-4">
            The Catholic Old Testament runs from Genesis to Malachi in {DATA.ot} books, in {SECTIONS.length} groups as the USCCB&apos;s list sets them out. The {DATA.protestant.ot} books Protestants share keep their usual order; the {DATA.extra} deuterocanonical books (in bold) are placed among them, with Tobit, Judith and the Maccabees beside Esther, Wisdom and Sirach after the Song of Songs, and Baruch after Lamentations. The Protestant order is on <Link href="/old-testament-books-in-order" className={link}>the Old Testament books in order</Link>.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {SECTIONS.map((s) => (
              <div key={s} className="rounded-xl border bg-card p-4">
                <h3 className="font-semibold mb-2">{s}</h3>
                <ol className="text-sm space-y-0.5">
                  {DATA.catholicOt.filter((b) => b.section === s).map((b) => (
                    <li key={b.name}>
                      <span className="tabular-nums text-muted-foreground mr-2">{b.n}.</span>
                      {b.deutero ? <strong>{b.name}</strong> : b.name}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-relaxed">
            The New Testament is the same {DATA.nt} books, Matthew to Revelation, in every one of these Bibles. Baruch sits with the prophets in Catholic Bibles; the Protestant split into major and minor prophets is on <Link href="/major-and-minor-prophets" className={link}>the major and minor prophets</Link>.
          </p>
        </Section>

        <FaqSection title="Questions about the Catholic Bible's books" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The World English Bible (with the deuterocanonical books) and the King James Version (1769 standard text, with the Apocrypha), both public domain: every verse quoted and every chapter, verse and word count on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/lists/how-many-books-are-in-the-catholic-bible.mjs (read and counted {DATA.generated}).</li>
            <li><a href={SRC.usccb} className={link} rel="noopener">USCCB, Books of the Bible</a>: the {DATA.total} book names and their order and groups (read 2026-10-25).</li>
            <li><a href={SRC.usccbDan} className={link} rel="noopener">USCCB, Daniel chapter 13</a>: Susanna and Bel and the Dragon as Daniel 13 and 14, and the note on their history (read 2026-10-25; the book names only, no text quoted).</li>
            <li><a href={SRC.trent} className={link} rel="noopener">Council of Trent, fourth session (April 8, 1546), decree concerning the canonical Scriptures</a>, J. Waterworth&apos;s translation (1848), Hanover Historical Texts Project (read 2026-10-25).</li>
            <li><a href={SRC.deut} className={link} rel="noopener">Wikipedia, &quot;Deuterocanonical books&quot;</a>: the term and Sixtus of Siena, the Septuagint, the earlier councils (read 2026-10-25).</li>
            <li><a href={SRC.canon} className={link} rel="noopener">Wikipedia, &quot;Biblical canon&quot;</a>: the comparison table of churches, the 24-book Tanakh, the Anglican position (read 2026-10-25).</li>
            <li><a href={SRC.ow} className={link} rel="noopener">OrthodoxWiki, &quot;Old Testament Canon&quot;</a>: the Greek Orthodox Old Testament list and appendix (read 2026-10-25).</li>
            <li><a href={SRC.luther} className={link} rel="noopener">Wikipedia, &quot;Luther Bible&quot;</a>: the 1534 Bible and its Apocrypha section (read 2026-10-25).</li>
            <li><a href={SRC.kjv} className={link} rel="noopener">Wikipedia, &quot;King James Version&quot;</a>: the 80 books of 1611, the 1666 editions and the 1826 decision (read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            The {DATA.protestant.total} books with their chapters, verses and words are on <Link href="/books-of-the-bible" className={link}>the books of the Bible</Link>, and the longest of them on <Link href="/longest-book-in-the-bible" className={link}>the longest book in the Bible</Link>. Word counts: {wordLink("wisdom", "wisdom")} and {wordLink("god", "God")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
