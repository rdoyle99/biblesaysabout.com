import { OG_VIDEOS } from "@/lib/og-video";
/* How many authors wrote the Bible: what each book's own text says about its writer, the traditional list, and the
   share of the Bible each traditional author's books fill, counted from the full KJV text (scripts/build-authors.mjs) */

import Link from "next/link";
import authors from "@/lib/data/authors.json";
import { getWord, fmt, quoted, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-authors-wrote-the-bible`;
const DATE = authors.generated;
const C = authors.counts;
const PS = authors.psalms;
const PL = authors.paulVsLuke;
const book = (name) => authors.books.find((b) => b.name === name);
const pct = (n, d) => ((n / d) * 100).toFixed(1);
const share1 = (n) => Number(n).toFixed(1);
const moses = authors.byAuthor.find((a) => a.author === "Moses");
const pentateuch = moses.words - book("Job").words;
const UNDISPUTED = ["Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Philippians", "1 Thessalonians", "Philemon"];
const undisputedWords = UNDISPUTED.reduce((a, n) => a + book(n).words, 0);
const silentBooks = authors.books.filter((b) => !b.text);
const ntTradition = [...new Set(authors.books.filter((b) => b.testament === "NT").flatMap((b) => b.tradition).filter((n) => n !== "unknown"))];
const GQ = authors.traditionSource;

const TITLE = `How Many Authors Wrote the Bible? ${C.named} of 66 Books Name One`;
const ANSWER = `Tradition counts about 40 authors, but the Bible gives no total. In the King James Version, ${C.named} of its 66 books name a writer or speaker in their own verses (${C.namedPeople} different people), and ${C.silent} books never say who wrote them. The common Protestant list names ${C.traditionNames} people; the books name ${C.extraFromText} more, which makes ${C.traditionPlusText}.`;

const KIND = {
  opens: "Names the writer or speaker in its opening",
  part: "Says a named person wrote part of it",
  title: "Names the writer by a title only",
  unnamed: "Writer says \"I\" but gives no name",
  psalms: "Psalm titles name writers",
};

export const metadata = {
  title: { absolute: TITLE },
  description: `${C.named} of the 66 books name their writer (${C.namedPeople} people) and ${C.silent} say nothing. Tradition counts about 40 authors; Moses' books fill ${moses.share}% of the KJV.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many authors wrote the Bible?", a: ANSWER },
  { q: "Who wrote the most books of the Bible?", a: `Paul, by the traditional count: ${PL.paulBooks} New Testament letters open with his name, from Romans to Philemon (scholars accept seven of them as his, see below). By words, Moses comes first: the five books of the Law, plus Job, which GotQuestions.org also gives to him, fill ${fmt(moses.words)} words, ${moses.share}% of the King James Version (${pct(pentateuch, authors.totalWords)}% without Job).` },
  { q: "Did Luke or Paul write more of the New Testament?", a: `Luke, by words, if tradition is right about both. The Gospel of Luke and Acts hold ${fmt(PL.luke)} KJV words, ${PL.lukeNtShare}% of the New Testament. Paul's ${PL.paulBooks} letters hold ${fmt(PL.paul)}, ${share1(PL.paulNtShare)}%. Neither book of Luke names its writer. Acts 1:1 links them, since "the former treatise" went to the same Theophilus as Luke 1:3, and tradition credits both to Luke.` },
  { q: "Which books of the Bible don't say who wrote them?", a: `${C.silent} books: ${silentBooks.map((b) => b.name).join(", ")}. Together they hold ${fmt(C.silentWords)} words, ${C.silentShare}% of the King James Version. Their usual authors come from later tradition.` },
  { q: "How many people wrote the New Testament?", a: `Tradition names ${ntTradition.length}: ${ntTradition.join(", ")}, with the writer of Hebrews unknown. The New Testament text itself names ${["Paul", "James", "Peter", "Jude", "John"].length} of them in its letters and Revelation; the four Gospels and Acts never name their writers.` },
  { q: "Who wrote the Psalms?", a: `The psalm titles name a person for ${PS.withName} of the 150 psalms. The counts are ${PS.byName.map((p) => `${p.who} ${p.psalms}`).join(", ")}, and Psalm 88 names both Heman and the sons of Korah. The other ${PS.untitledOrUnnamed} psalms have no title or a title with no name.` },
];

const textCell = (b) => {
  if (!b.text) return <span className="text-muted-foreground">Says nothing about its writer</span>;
  if (b.text.kind === "psalms") return <span>Titles name David in {PS.byName[0].psalms} psalms and 6 others in {PS.withName - PS.byName[0].psalms}</span>;
  return (
    <span>
      {KIND[b.text.kind]}: {b.text.kind === "unnamed" ? b.text.who : <strong className="font-semibold">{b.text.who}</strong>} ({b.text.ref})
    </span>
  );
};

export default function HowManyAuthors() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many authors wrote the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many authors wrote the Bible?", description: ANSWER, url: URL, datePublished: DATE, dateModified: DATE }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className="underline underline-offset-2 hover:text-primary">{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many authors wrote the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many authors wrote the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 23, 2026. What is counted: the verses of the 66 books in the King James Version, read for any line that names who wrote or spoke the book. The traditional list is GotQuestions.org's, read {GQ.read}.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Books that name a writer", value: C.named, note: `${C.opens} in the opening, ${C.part} in a later verse` },
                { label: "People they name", value: C.namedPeople, note: "Moses to John" },
                { label: "Books that never say", value: C.silent, note: `${C.silentShare}% of the Bible's words` },
                { label: "Psalm titles that name someone", value: PS.withName, note: `of 150 psalms; David has ${PS.byName[0].psalms}` },
              ]}
            />
          </div>
        </section>

        <Section id="by-book" title="What each book says about who wrote it" intro={`Each row names the KJV verse it relies on, and the build script stops if the name isn't in that verse. The traditional author is the one GotQuestions.org lists for the book. Words are King James Version verse words.`}>
          <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
            A name in a book's opening says whose words or vision it is, not who held the pen: a prophet's opening names the man the word came to, and Jeremiah 36:4 has Baruch writing Jeremiah's words down. That is why {C.named} plus the {C.silent} silent books is not 66. The other {66 - C.named - C.silent} are Psalms (names only in the psalm titles), Ecclesiastes, 2 John and 3 John (a title only: "the Preacher", "the elder"), and Luke, John and Acts (a writer who says "I" without a name).
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold">What the book's own text says</th>
                  <th className="p-3 font-semibold">Traditional author</th>
                  <th className="p-3 font-semibold text-right">Words</th>
                </tr>
              </thead>
              <tbody>
                {authors.books.map((b) => (
                  <tr key={b.slug} className="border-b last:border-0 align-top">
                    <td className="p-3 whitespace-nowrap">
                      <Link href={`/books/${b.slug}`} className="underline underline-offset-2 hover:text-primary">{b.name}</Link>
                    </td>
                    <td className="p-3">
                      {textCell(b)}
                      {b.note ? <div className="mt-1 text-xs text-muted-foreground">{b.note}</div> : null}
                    </td>
                    <td className="p-3">{b.tradition.join(", ").replace(", and others", " and others")}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(b.words)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The book headings in the KJV are not verse text. In the public-domain KJV text counted here, {authors.kjvTitleAttributions.length} headings put a name on a book whose verses give none. They are {authors.kjvTitleAttributions.map((t) => `${t.book} ("${t.kjvTitle}")`).join(", ")}.
          </p>
        </Section>

        <Section id="where-40-comes-from" title="Where the number 40 comes from" intro="No verse counts the Bible's writers. The figure is a sum of tradition and the text." muted>
          <p className="leading-relaxed mb-4">
            GotQuestions.org says the Bible "was written by approximately 40 men of diverse backgrounds over the course of 1500 years," and lists an author for every book. That list holds {C.traditionNames} names, with Hebrews left unknown. They are {authors.traditionNames.join(", ")}. The books themselves name {C.extraFromText} more writers or speakers that the list folds into someone else: {authors.extraFromText.join(", ")}. Add them and the count is {C.traditionPlusText}. That sum is ours, one way to count and not a census: it counts the sons of Korah as one writer and leaves out people the text only mentions, such as Baruch, who wrote down Jeremiah's words.
          </p>
          <p className="leading-relaxed">
            Other lists land lower. OverviewBible counts 35 traditional authors and says "there really were around 40 authors of the Bible, but the Bible and tradition only call out around 35 by name." Its 35 include a few candidates for anonymous works (Moses, Ezra and Matthew), and it notes that somebody wrote Judges but we don't know who.
          </p>
        </Section>

        <Section id="most-words" title="Who wrote the most of the Bible?" intro={`Share of the King James Version's ${fmt(authors.totalWords)} words, grouped by the author tradition gives each book.`}>
          <BarRows rows={authors.byAuthor.slice(0, 12).map((a) => ({ label: a.author, value: a.words, display: `${share1(a.share)}%` }))} labelWidth="w-48" />
          <p className="mt-5 leading-relaxed">
            {wordLink("moses", "Moses")} leads with {moses.share}% because tradition gives him the five books of the Law and Job; the Law alone is {pct(pentateuch, authors.totalWords)}%. Exodus 24:4, Numbers 33:2 and Deuteronomy 31:9 each say "Moses wrote" a part: the words of the LORD, the stages of the march, this law. Deuteronomy 34 reports his death and burial. History.com notes that the Talmud answered this by saying Joshua likely wrote the verses about Moses' death, and that Joel Baden of Yale Divinity School calls that "one opinion among many."
          </p>
          <p className="mt-3 leading-relaxed">
            In the New Testament, Luke's two books, the Gospel and Acts, hold {fmt(PL.luke)} words ({PL.lukeNtShare}% of the New Testament). {wordLink("paul", "Paul")}'s {PL.paulBooks} letters hold {fmt(PL.paul)} ({share1(PL.paulNtShare)}%). On the traditional list, Paul wrote the most books and Luke the most words.
          </p>
        </Section>

        <Section id="psalms" title="Who wrote the Psalms?" intro={`${PS.titled} of the 150 psalms have a title in the KJV, and ${PS.withName} of those titles name a person.`} muted>
          <BarRows rows={PS.byName.map((p) => ({ label: p.who, value: p.psalms }))} labelWidth="w-44" />
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Psalm 88 names both the sons of Korah and Heman the Ezrahite, so the rows add to one more than {PS.withName}. Psalms 72 and 127 read "for Solomon" in the KJV, so a title that names someone is not always a claim about who wrote the psalm.
          </p>
        </Section>

        <Section id="what-scholars-say" title="What tradition and modern scholars say">
          <p className="leading-relaxed mb-4">
            The names on the Gospels come from early church writers. Irenaeus of Lyon said Matthew "issued a written Gospel among the Hebrews," Mark was "the disciple and interpreter of Peter," Luke "the companion of Paul," and John "the disciple of the Lord" (Against Heresies 3.1.1). The Gospel texts themselves name no writer, and The Conversation notes that they "weren't attributed to these figures until the second and third centuries."
          </p>
          <p className="leading-relaxed mb-4">
            Most modern scholars read the authorship differently. History.com reports that most scholars today agree the Old Testament's stories and laws were passed down orally and written down by different schools of authors, starting around the 7th century BC. It also reports that scholars agree on the authenticity of only seven letters as Paul's: {UNDISPUTED.join(", ")}. Those seven hold {fmt(undisputedWords)} KJV words, {pct(undisputedWords, authors.ntWords)}% of the New Testament, against {share1(PL.paulNtShare)}% for all {PL.paulBooks}.
          </p>
          <p className="leading-relaxed">
            So the count depends on the question. The text names {C.namedPeople} writers. Tradition names about 40. A historian can identify fewer, because many books passed through editors and scribes whose names were never recorded.
          </p>
          <p className="leading-relaxed mt-4">
            Tradition also answers a different question. GotQuestions.org says that, above the human writers, the Bible was written by God, who guided them while they used their own styles. The Bible says as much of itself: "All scripture is given by inspiration of God" (2 Timothy 3:16) and "holy men of God spake as they were moved by the Holy Ghost" (2 Peter 1:21). Counting the people does not settle that either way.
          </p>
        </Section>

        <FaqSection title="Questions about who wrote the Bible" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769), public domain: every verse quoted and every word count on this page, counted by scripts/build-authors.mjs from the text at github.com/seven1m/open-bibles (counted {DATE}).</li>
            <li><a href={GQ.url} className="underline underline-offset-2 hover:text-primary" rel="noopener">GotQuestions.org, Who were the authors of the books of the Bible?</a>: the traditional author column and the "approximately 40" figure (read {GQ.read}).</li>
            <li><a href="https://overviewbible.com/authors-who-wrote-bible/" className="underline underline-offset-2 hover:text-primary" rel="noopener">OverviewBible, Who Wrote the Bible? Meet the 35 (Traditional) Authors</a>: the count of 35 (read {GQ.read}).</li>
            <li><a href="https://www.newadvent.org/fathers/0103301.htm" className="underline underline-offset-2 hover:text-primary" rel="noopener">Irenaeus, Against Heresies 3.1</a> (New Advent translation): the second-century names on the four Gospels (read {GQ.read}).</li>
            <li><a href="https://theconversation.com/who-wrote-the-bible-214849" className="underline underline-offset-2 hover:text-primary" rel="noopener">The Conversation, Who wrote the Bible?</a>: when the Gospels were first attributed to Matthew, Mark, Luke and John (read {GQ.read}).</li>
            <li><a href="https://www.history.com/articles/who-wrote-the-bible" className="underline underline-offset-2 hover:text-primary" rel="noopener">History.com, Who Wrote the Bible?</a>: the modern scholarly view of the first five books and of Paul's seven undisputed letters (read {GQ.read}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            See every book's chapters and verses on{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">the books of the Bible</Link>, or put them in order with{" "}
            <Link href="/books-of-the-bible-in-order" className="underline underline-offset-2 hover:text-primary">the books of the Bible in order</Link>. Find{" "}
            <Link href="/longest-book-in-the-bible" className="underline underline-offset-2 hover:text-primary">the longest book in the Bible</Link>, or read who speaks in Proverbs on{" "}
            <Link href="/how-many-proverbs-are-there" className="underline underline-offset-2 hover:text-primary">how many proverbs are there</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATE} />
        </Section>
      </div>
    </>
  );
}
