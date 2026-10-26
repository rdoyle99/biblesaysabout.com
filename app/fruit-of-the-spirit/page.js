import { OG_VIDEOS } from "@/lib/og-video";
/* Fruit of the Spirit: the nine in Galatians 5:22-23 in the KJV and the WEB, how often each word appears, and the
   17 works of the flesh in the verses before them. Counted by scripts/build-bible-lists.mjs. */

import Link from "next/link";
import { LISTS, LISTS_DATE, joinList } from "@/lib/bibleLists";
import { getWord, getBook, fmt, METHOD, SITE } from "@/lib/bibleData";
import { getAllTopics } from "@/lib/verses";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/fruit-of-the-spirit`;
const F = LISTS.fruit;
const rows = F.rows;
const byCount = [...rows].sort((a, b) => b.kjvCount.total - a.kjvCount.total);
const most = byCount[0];
const fewest = byCount.at(-1);
const topics = new Set(getAllTopics());
const TOPIC = { love: "love", joy: "joy", peace: "peace", longsuffering: "patience", gentleness: "kindness", faith: "faith", temperance: "self-control" };
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const kjvList = rows.map((r) => r.kjv).join(", ");
const webList = rows.map((r) => r.web).join(", ");

const TITLE = "Fruit of the Spirit: All 9, With Verses and Word Counts";
const ANSWER = `The fruit of the Spirit is nine qualities listed in Galatians 5:22-23. The King James Version names them as ${kjvList}. The World English Bible words the same list as ${webList}. Fruit is singular in both texts, and the verses just before it name ${F.works.kjv.length} works of the flesh.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 9 fruits of the Spirit in Galatians 5:22-23 (KJV and WEB), the Greek word for each, and how often each appears: ${most.kjv} ${most.kjvCount.total} times, ${fewest.kjv} ${fewest.kjvCount.total}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 9 fruits of the Spirit?", a: `Galatians 5:22-23 lists ${kjvList} in the King James Version. In the World English Bible the list reads ${webList}.` },
  { q: "Where is the fruit of the Spirit in the Bible?", a: `Galatians 5:22-23 holds the list. The phrase "fruit of the Spirit" appears ${F.phrase.kjv.total} times in the King James Version, in ${joinList(F.phrase.kjv.refs)}. The second one, Ephesians 5:9, lists a different set: goodness, righteousness and truth.` },
  { q: "Is it fruit or fruits of the Spirit?", a: `Both translations write "fruit", singular, and then give the list. The same passage uses "works", plural, for the flesh: ${F.works.kjv.length} of them in the King James Version.` },
  { q: "Why do the lists differ between Bible versions?", a: `The Greek has nine words, and translators choose different English for some of them. The King James "longsuffering" is "patience" in the World English Bible, "gentleness" (Greek chrēstotēs) becomes "kindness", "meekness" (prautēs) becomes "gentleness", and "temperance" becomes "self-control". So "gentleness" names a different Greek word in each translation.` },
  { q: "Which fruit of the Spirit is mentioned most in the Bible?", a: `Counting the exact word, ${most.kjv} appears ${fmt(most.kjvCount.total)} times in the King James Version, more than any other word on the list. ${cap(fewest.kjv)} appears ${fewest.kjvCount.total} times, in ${fewest.kjvCount.verses} verses.` },
];

export default function FruitOfTheSpirit() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Fruit of the Spirit", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Fruit of the Spirit: all 9, with verses and word counts", description: ANSWER, url: URL, datePublished: LISTS_DATE, dateModified: LISTS_DATE }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className="underline underline-offset-2 hover:text-primary">{label}</Link> : label);
  const gal = getBook("galatians");
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Fruit of the Spirit" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Fruit of the Spirit</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Verses are quoted from the King James Version and the World English Bible. Word counts are of the exact word as the translation prints it in Galatians 5:22-23.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Fruits in the list", value: rows.length, note: "Galatians 5:22-23" },
                { label: "Works of the flesh", value: F.works.kjv.length, note: "Galatians 5:19-21" },
                { label: `Times "${most.kjv}" appears (KJV)`, value: fmt(most.kjvCount.total), note: "most of the nine" },
                { label: `Times "${fewest.kjv}" appears (KJV)`, value: fewest.kjvCount.total, note: `in ${fewest.kjvCount.verses} verses` },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="The nine fruits of the Spirit" intro="Galatians 5:22-23 in the King James Version, then the World English Bible, with the Greek word Paul wrote for each.">
          <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4 mb-3">
            <p className="leading-relaxed">{F.text.kjv}</p>
            <footer className="mt-2 text-sm text-muted-foreground">Galatians 5:22-23 (KJV)</footer>
          </blockquote>
          <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4 mb-6">
            <p className="leading-relaxed">{F.text.web}</p>
            <footer className="mt-2 text-sm text-muted-foreground">Galatians 5:22-23 (WEB)</footer>
          </blockquote>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">KJV</th>
                  <th className="p-3 font-semibold">WEB</th>
                  <th className="p-3 font-semibold">Greek</th>
                  <th className="p-3 font-semibold text-right">KJV count</th>
                  <th className="p-3 font-semibold text-right">WEB count</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b last:border-0">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium">{r.kjv}</td>
                    <td className="p-3">{r.web}</td>
                    <td className="p-3">{r.greek} <span className="text-muted-foreground">({r.translit})</span></td>
                    <td className="p-3 text-right tabular-nums">{r.kjvCount.total}</td>
                    <td className="p-3 text-right tabular-nums">{r.webCount.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The Greek words are the ones Biblehub's interlinear prints for Galatians 5:22-23 (read October 24, 2026). Counts are of the exact word: loved, loveth, joyful and similar forms are left out, and the {wordLink("love", "love")}, {wordLink("joy", "joy")} and {wordLink("peace", "peace")} pages count their forms separately. The World English Bible's "kindness" count includes every Old Testament use of the word, not only Galatians.
          </p>
        </Section>

        <Section id="how-often" title="How often each fruit appears in the Bible" intro={`Times the King James Version prints the word, in all 66 books. ${cap(most.kjv)} leads and ${fewest.kjv} is last.`} muted>
          <BarRows rows={byCount.map((r) => ({ label: cap(r.kjv), value: r.kjvCount.total, href: getWord(r.kjv) ? `/words/${r.kjv}` : undefined }))} labelWidth="w-32" />
          <p className="mt-5 leading-relaxed">
            {cap(most.kjv)} appears {fmt(most.kjvCount.total)} times in {most.kjvCount.verses} verses across {most.kjvCount.books} books, and its busiest {most.kjvCount.top.tied.length > 1 ? `books are ${joinList(most.kjvCount.top.tied)}, with ${most.kjvCount.top.count} each` : `book is ${most.kjvCount.top.book} with ${most.kjvCount.top.count}`}. At the other end, "{fewest.kjv}" appears {fewest.kjvCount.total} times and "{rows.find((r) => r.kjv === "gentleness").kjv}" also {rows.find((r) => r.kjv === "gentleness").kjvCount.total}. The word "temperance" first shows up in Acts 24:25, where Paul reasons with Felix about "righteousness, temperance, and judgment to come", and again in Galatians 5:23 and twice in 2 Peter 1:6.
          </p>
          <p className="mt-3 leading-relaxed">
            One of the nine is rare in the King James Version and common in the World English Bible, for a reason of translation. "Kindness" is the World English Bible's word for Galatians' <em>chrēstotēs</em> and it also fills the Old Testament, so it appears {fmt(rows.find((r) => r.kjv === "gentleness").webCount.total)} times there against {rows.find((r) => r.kjv === "gentleness").kjvCount.total} for the King James "gentleness". The counts are not a ranking of importance; they show how a translation spreads its words.
          </p>
        </Section>

        <Section id="flesh" title="The fruit and the works of the flesh" intro={`Paul sets the list against ${F.works.kjv.length} works of the flesh in the three verses before it, Galatians 5:19-21. One side is "works", plural, and the other is "fruit", singular.`}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">Works of the flesh, KJV ({F.works.kjv.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{F.works.kjv.map(cap).join(", ")}.</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">Fruit of the Spirit, KJV ({rows.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{rows.map((r) => cap(r.kjv)).join(", ")}.</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed">
            The World English Bible also counts {F.works.web.length} works of the flesh: {F.works.web.join(", ")}. Both translations end the fruit list with the same sentence, "against such there is no law" in the King James Version and "against such things there is no law" in the World English Bible. The seven deadly sins are a later church list, not one of Paul&apos;s; <Link href="/seven-deadly-sins-in-the-bible" className="underline underline-offset-2 hover:text-primary">the seven deadly sins in the Bible</Link> sets them beside this list and the other vice lists.
          </p>
        </Section>

        <Section id="phrase" title='Where "fruit of the Spirit" appears' muted>
          <p className="leading-relaxed">
            The exact phrase appears {F.phrase.kjv.total} times in the King James Version, in {joinList(F.phrase.kjv.refs)}, and {F.phrase.web.total} times in the World English Bible. Ephesians 5:9 reads "the fruit of the Spirit is in all goodness and righteousness and truth", which is a different list of three. So the nine in Galatians are the only list under that name with more than three items. 1 Corinthians 13:13 reads "faith, hope, charity": faith and love (the King James "charity") are on the Galatians list, and hope is not.
          </p>
          <p className="mt-3 leading-relaxed">
            Read the verses by theme on our pages for {["love", "joy", "peace", "patience", "kindness", "faith", "self-control"].filter((t) => topics.has(t)).map((t, i, a) => (
              <span key={t}>
                <Link href={`/verses/${t}`} className="underline underline-offset-2 hover:text-primary">{t}</Link>
                {i < a.length - 2 ? ", " : i === a.length - 2 ? ", and " : ""}
              </span>
            ))}. The chapter and verse counts for {gal ? <Link href="/books/galatians" className="underline underline-offset-2 hover:text-primary">Galatians</Link> : "Galatians"} are on its book page.
          </p>
        </Section>

        <Section id="limits" title="Limits of these counts">
          <p className="leading-relaxed">A word count shows how a translation uses a word, not how much the Bible teaches about it. Love, for example, is also written as loved, loveth and loving, none of which are in the table. A reader who studies one quality should use the topic pages linked above, which gather verses by meaning. The Greek words come from one interlinear and the translation choices are the translators', so a different version will give a different list of English words.</p>
        </Section>

        <FaqSection title="Questions about the fruit of the Spirit" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/build-bible-lists.mjs from the text at github.com/seven1m/open-bibles (read and counted {LISTS_DATE}).</li>
            <li><a href="https://biblehub.com/interlinear/galatians/5.htm" className="underline underline-offset-2 hover:text-primary" rel="noopener">Biblehub, Galatians 5 interlinear</a>: the Greek word behind each fruit (read {LISTS_DATE}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            More counts are on <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>. See{" "}
            <Link href="/armor-of-god" className="underline underline-offset-2 hover:text-primary">the armor of God</Link> and <Link href="/gifts-of-the-spirit" className="underline underline-offset-2 hover:text-primary">the gifts of the Spirit</Link>, two more lists from Paul's letters, or{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">how many times any word is mentioned in the Bible</Link>.
          </p>
          <MethodNote text={METHOD} date={LISTS_DATE} />
        </Section>
      </div>
    </>
  );
}
