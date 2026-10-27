import { OG_VIDEOS } from "@/lib/og-video";
/* Bible trivia questions and answers: every answer is a count from the full KJV and WEB text, linked to the page that holds the data */

import Link from "next/link";
import { books, otBooks, ntBooks, bible, totals, getWord, fmt, SITE, METHOD, DATA_DATE } from "@/lib/bibleData";
import { HOW_LONG as H, OT_GROUPS, NT_GROUPS, LIST_DATE } from "@/lib/bookLists";
import rankings from "@/lib/data/bible-rankings.json";
import proverbs from "@/lib/data/proverbs.json";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/bible-trivia-questions`;
const DATE = LIST_DATE > DATA_DATE ? LIST_DATE : DATA_DATE;
const k = bible.kjv;
const w = bible.web;
const kr = rankings.kjv;

const byWords = [...books].sort((a, b) => b.words.kjv - a.words.kjv || a.order - b.order);
const byChapters = [...books].sort((a, b) => b.chapters - a.chapters || a.order - b.order);
const byVerses = [...books].sort((a, b) => b.verses.kjv - a.verses.kjv || a.order - b.order);
const fewestVerses = [...books].sort((a, b) => a.verses.kjv - b.verses.kjv || a.order - b.order);
const oneChapter = books.filter((b) => b.chapters === 1);
const list = (xs) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs.at(-1)}`);
const wd = (slug) => getWord(slug);
const head = (slug) => {
  const x = wd(slug);
  return x ? { n: x.kjv.exact, total: x.kjv.total, verses: x.kjv.exactVerses, web: x.web.total, x } : null;
};

// the people and cities with a word page: which is named most
const PEOPLE = ["david", "jesus", "moses", "abraham", "paul", "peter", "solomon", "joseph", "jacob", "saul", "aaron", "joshua", "samuel", "isaac", "adam", "noah", "elijah", "daniel", "john", "mary"];
const CITIES = ["jerusalem", "babylon", "damascus", "jericho", "samaria", "nineveh", "bethlehem", "nazareth", "hebron", "bethel", "shechem", "antioch", "corinth", "ephesus", "rome", "athens", "tyre", "sidon", "gaza", "capernaum", "bethany", "philippi", "joppa"];
const ranked = (slugs) => slugs.map((s) => wd(s)).filter(Boolean).sort((a, b) => b.kjv.total - a.kjv.total);
const people = ranked(PEOPLE);
const cities = ranked(CITIES);
const jesus = head("jesus");
const god = head("god");
const lord = head("lord");
const love = head("love");
const fearNot = head("fear-not");
const selah = head("selah");
const easter = head("easter");
const verily = head("verily-verily");
const noGod = books.filter((b) => !wd("god").kjv.byBook.some(([n]) => n === b.name));
const jesusTop = [...wd("jesus").kjv.byBook].sort((a, b) => b[1] - a[1]);
const ps = books.find((b) => b.slug === "psalms");
const prov = books.find((b) => b.slug === "proverbs");

const SECTIONS = [
  {
    id: "size",
    title: "How big is the Bible? (size questions)",
    qs: [
      { q: "How many books are in the Bible?", a: `${totals.books}: ${totals.ot} in the Old Testament and ${totals.nt} in the New Testament, in the 66-book Protestant canon.`, href: "/books-of-the-bible-in-order", link: "All 66 books in order" },
      { q: "How many chapters are in the Bible?", a: `${fmt(k.chapters)}: ${fmt(totals.otChapters)} in the Old Testament and ${fmt(totals.ntChapters)} in the New.`, href: "/bible-by-the-numbers", link: "Bible by the numbers" },
      { q: "How many verses are in the Bible?", a: `${fmt(k.verses)} in the King James Version (${fmt(totals.otVerses)} Old Testament, ${fmt(totals.ntVerses)} New Testament). The World English Bible numbers ${fmt(w.verses)}, because it leaves ${bible.webMissing.filter((r) => !r.startsWith("Romans ")).join(", ")} to footnotes and numbers the closing doxology of Romans as 14:24-26.`, href: "/bible-by-the-numbers", link: "Verse counts and the WEB difference" },
      { q: "How many words are in the Bible?", a: `${fmt(k.words)} in the King James Version and ${fmt(w.words)} in the World English Bible, verse text only.`, href: "/how-long-is-the-bible", link: "How long is the Bible" },
      { q: "How many pages are in the Bible?", a: `About ${fmt(H.kPages)} at ${H.PAGE} words a page. That page size is a stated convention, not a printed count: real Bibles vary with type size and notes.`, href: "/how-long-is-the-bible", link: "Words, pages and hours" },
      { q: "How long does it take to read the whole Bible?", a: `About ${(H.kSilent / 60).toFixed(1)} hours silently at ${H.SILENT} words a minute, or ${(H.kAloud / 60).toFixed(1)} hours aloud at ${H.ALOUD}.`, href: "/how-long-does-it-take-to-read-the-bible", link: "Reading time calculator" },
    ],
  },
  {
    id: "books",
    title: "Books of the Bible trivia",
    qs: [
      { q: "What is the longest book of the Bible?", a: `By words, ${byWords[0].name}: ${fmt(byWords[0].words.kjv)} words in the KJV, ahead of ${byWords[1].name} (${fmt(byWords[1].words.kjv)}).`, href: "/longest-book-in-the-bible", link: "Longest book, ranked" },
      { q: "What is the shortest book of the Bible?", a: `By words, ${byWords.at(-1).name}: ${fmt(byWords.at(-1).words.kjv)} words in the KJV. By verses it is ${fewestVerses[0].name} with ${fewestVerses[0].verses.kjv}.`, href: "/shortest-book-in-the-bible", link: "Shortest book, ranked" },
      { q: "Which book of the Bible has the most chapters?", a: `${byChapters[0].name}, with ${byChapters[0].chapters}. It also has the most verses (${fmt(byVerses[0].verses.kjv)}).`, href: `/books/${byChapters[0].slug}`, link: `${byChapters[0].name} by the numbers` },
      { q: "Which books of the Bible have only one chapter?", a: `${oneChapter.length} books: ${list(oneChapter.map((b) => b.name))}.`, href: "/books-of-the-bible-in-order", link: "Every book with its chapters" },
      { q: "What is the first book and the last book of the Bible?", a: `${books[0].name} is first and ${books.at(-1).name} is last. The Old Testament runs from ${otBooks[0].name} to ${otBooks.at(-1).name}, and the New Testament from ${ntBooks[0].name} to ${ntBooks.at(-1).name}.`, href: "/books-of-the-bible-in-order", link: "Books of the Bible in order" },
      { q: "How many books are in each section of the Old Testament?", a: OT_GROUPS.map((g) => `${g.label} ${g.list.length}`).join(", ") + ".", href: "/old-testament-books-in-order", link: "Old Testament books in order" },
      { q: "How many books are in each section of the New Testament?", a: NT_GROUPS.map((g) => `${g.label} ${g.list.length}`).join(", ") + ".", href: "/new-testament-books-in-order", link: "New Testament books in order" },
      { q: "Which books of the Bible never use the word God?", a: noGod.length ? `${list(noGod.map((b) => b.name))} in the King James Version (the word God, gods and God's counted together).` : "None: every book uses it at least once.", href: "/words/god", link: "God by book" },
      { q: "How many chapters and verses are in Proverbs?", a: `${proverbs.chapters} chapters and ${fmt(proverbs.verses)} verses. 1 Kings 4:32 says Solomon spoke 3,000 proverbs.`, href: "/how-many-proverbs-are-there", link: "How many proverbs are there" },
      { q: "How many chapters and verses are in Psalms?", a: `${ps.chapters} chapters and ${fmt(ps.verses.kjv)} verses, the most of any book. Its longest chapter, ${ps.longestChapter.chapter === 119 ? "Psalm 119" : `Psalm ${ps.longestChapter.chapter}`}, has ${ps.longestChapter.verses} verses.`, href: "/books/psalms", link: "Psalms by the numbers" },
    ],
  },
  {
    id: "verses",
    title: "Longest, shortest and middle: verse and chapter trivia",
    qs: [
      { q: "What is the shortest verse in the Bible?", a: `${k.shortestVerses[0].ref}, "${k.shortestVerses[0].text}" It is ${k.shortestVerses[0].words} words. ${k.shortestVerses[1].ref} ("${k.shortestVerses[1].text}") is also ${k.shortestVerses[1].words} words in the KJV, but longer in letters.`, href: "/shortest-verse-in-the-bible", link: "Ten shortest verses, ranked" },
      { q: "What is the longest verse in the Bible?", a: `${k.longestVerse.ref}, at ${k.longestVerse.words} words in the KJV (${w.longestVerse.words} in the WEB).`, href: "/longest-verse-in-the-bible", link: "Ten longest verses, ranked" },
      { q: "What is the longest chapter in the Bible?", a: `${k.longestChapter.ref}, with ${k.longestChapter.verses} verses. ${kr.longestChapters[1].ref} is second with ${kr.longestChapters[1].verses}.`, href: "/longest-chapter-in-the-bible", link: "Ten longest chapters, ranked" },
      { q: "What is the shortest chapter in the Bible?", a: `${k.shortestChapter.ref}, with ${k.shortestChapter.verses} verses and ${kr.shortestChapters[0].words} words.`, href: "/shortest-chapter-in-the-bible", link: "Ten shortest chapters, ranked" },
      { q: "What is the longest chapter in the New Testament?", a: `By verses, ${kr.ntLongestChapter.ref}, with ${kr.ntLongestChapter.verses} (${fmt(kr.ntLongestChapter.words)} words in the KJV).`, href: "/longest-chapter-in-the-bible", link: "Longest chapters" },
      { q: "What is the longest verse in the New Testament?", a: `${kr.ntLongestVerse.ref}, at ${kr.ntLongestVerse.words} words.`, href: "/longest-verse-in-the-bible", link: "Longest verses" },
      { q: "What is the middle verse of the Bible?", a: `The KJV has an even number of verses (${fmt(k.verses)}), so two share the middle: ${k.middleVerses.map((v) => v.ref).join(" and ")}. Psalm 118:8, often called the middle verse, is verse number ${fmt(bible.psalm118v8Position)}.`, href: "/bible-by-the-numbers", link: "Middle verse and chapter" },
      { q: "What is the middle chapter of the Bible?", a: `${k.middleChapters[0].ref}, chapter number ${k.middleChapters[0].position} of ${fmt(k.chapters)}.${k.middleChapters[0].ref === k.shortestChapter.ref ? " It is also the shortest chapter in the Bible." : ""}`, href: "/bible-by-the-numbers", link: "Middle verse and chapter" },
    ],
  },
  {
    id: "words",
    title: "Names and words: how many times is it in the Bible?",
    qs: [
      jesus && { q: "How many times is Jesus mentioned in the Bible?", a: `${fmt(jesus.n)} times in the KJV, in ${fmt(jesus.verses)} verses. The book that uses the name most is ${jesusTop[0][0]} (${jesusTop[0][1]}), then ${jesusTop[1][0]} (${jesusTop[1][1]}).`, href: "/words/jesus", link: "Jesus by book" },
      god && { q: "How many times is God in the Bible?", a: `${fmt(god.n)} times for the word God in the KJV (${fmt(god.total)} with gods and God's), ignoring capital letters.`, href: "/words/god", link: "God, god and GOD counted" },
      lord && { q: "How many times is LORD in the Bible?", a: `${fmt(lord.n)} times for Lord and LORD together in the KJV (${fmt(lord.total)} with lords and Lord's). Where the KJV prints LORD in capitals it stands for God's personal name.`, href: "/words/lord", link: "Lord by book and case" },
      people.length && { q: "Which person is named most often in the Bible?", a: `Of the ${people.length} people with a word page here, ${people[0].word} (${fmt(people[0].kjv.total)} in the KJV), then ${people[1].word} (${fmt(people[1].kjv.total)}) and ${people[2].word} (${fmt(people[2].kjv.total)}). Every spelling and possessive is counted.`, href: `/words/${people[0].slug}`, link: `${people[0].word} by book` },
      cities.length && { q: "Which city is mentioned most in the Bible?", a: `Of the ${cities.length} cities with a word page here, ${cities[0].word} (${fmt(cities[0].kjv.total)} in the KJV), then ${cities[1].word} (${fmt(cities[1].kjv.total)}) and ${cities[2].word} (${fmt(cities[2].kjv.total)}).`, href: `/words/${cities[0].slug}`, link: `${cities[0].word} by book` },
      love && { q: "How many times is love in the Bible?", a: `${fmt(love.n)} times for the exact word love in the KJV, and ${fmt(love.total)} counting loved, loveth, loving and the other forms.`, href: "/words/love", link: "Love by book" },
      fearNot && { q: "Does the Bible say \"fear not\" 365 times?", a: `Not by our count. The exact phrase "fear not" appears ${fmt(fearNot.n)} times in the KJV, and ${fmt(fearNot.total)} times counting "fear ye not", "fear thou not" and "be not afraid".`, href: "/words/fear-not", link: "Every fear-not phrase counted" },
      selah && { q: "How many times does Selah appear in the Bible?", a: `${fmt(selah.n)} times in the KJV, in ${fmt(selah.verses)} verses.`, href: "/words/selah", link: "Selah by book" },
      verily && { q: "How many times does \"verily, verily\" appear?", a: `${fmt(verily.n)} times in the KJV, all in the Gospel of John. The World English Bible does not double the word.`, href: "/words/verily-verily", link: "Verily, verily counted" },
      easter && { q: "How many times is Easter in the Bible?", a: `${fmt(easter.n)} time in the KJV (Acts 12:4, where the Greek word is pascha, the Passover). The World English Bible has none.`, href: "/words/easter", link: "Easter in the KJV" },
    ].filter(Boolean),
  },
];

const all = SECTIONS.flatMap((s) => s.qs);
const total = all.length;
const TITLE = `Bible Trivia Questions and Answers: ${total} Counted Facts`;
const ANSWER = `${total} Bible trivia questions with answers counted from the full text of the King James Version and World English Bible: the Bible has ${fmt(k.verses)} verses in ${fmt(k.chapters)} chapters and ${totals.books} books, the shortest verse is ${k.shortestVerses[0].ref} ("${k.shortestVerses[0].text}") and the longest chapter is ${k.longestChapter.ref}. Each answer links to the page with the data.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `${total} Bible trivia questions and answers on books, chapters, verses and how often names appear, every answer counted from the text and linked to its data.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function BibleTrivia() {
  let n = 0;
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Bible trivia questions", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Bible trivia questions and answers", description: ANSWER, url: URL, datePublished: DATE, dateModified: DATE }),
    generateFAQSchema(all.map((x) => ({ q: x.q, a: x.a })))
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Bible trivia questions" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Bible trivia questions and answers</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 22, 2026. Each number here is a count from the text, and the link under each answer opens the page with the full data.</p>
            </div>
          </div>
        </section>

        {SECTIONS.map((s, i) => (
          <Section key={s.id} id={s.id} title={s.title} muted={i % 2 === 1}>
            <ol className="space-y-4">
              {s.qs.map((x) => {
                n += 1;
                return (
                  <li key={x.q} className="rounded-xl border bg-card p-5">
                    <h3 className="text-lg font-semibold mb-2">
                      <span className="text-muted-foreground tabular-nums">{n}. </span>
                      {x.q}
                    </h3>
                    <p className="leading-relaxed">{x.a}</p>
                    <p className="mt-2 text-sm">
                      <Link href={x.href} className="underline underline-offset-2 hover:text-primary">{x.link}</Link>
                    </p>
                  </li>
                );
              })}
            </ol>
          </Section>
        ))}

        <Section muted>
          <p className="mb-4">
            Want the numbers behind these answers? See{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>,{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">how many times each word appears</Link> and{" "}
            <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">what Bible names mean</Link>.
          </p>
          <MethodNote text={METHOD} date={DATE} />
        </Section>
      </div>
    </>
  );
}
