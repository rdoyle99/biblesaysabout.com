import { OG_VIDEOS } from "@/lib/og-video";
/* Random Bible verse generator: the topic-list pool (lib/verseTool.js) or the whole KJV/WEB text (/api/random-verse).
 * Rebuilt hourly so the verse a crawler sees without JavaScript changes too. */

import Link from "next/link";
import RandomVerseTool from "@/components/RandomVerseTool";
import { topicPool, everydayPool, EVERYDAY_TOPICS, EXCLUDED_COUNT, poolTopics, bookNames, bibleVerseCount, randomTopicVerse, bookOdds, poolByBook, DATA_GENERATED, POOL_UPDATED, longDate } from "@/lib/verseTool";
import { bible, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

export const revalidate = 3600;

const URL = `${SITE}/random-bible-verse`;
const POOL = topicPool.length;
const EVERYDAY = everydayPool.length;
const KJV = bibleVerseCount.kjv;
const WEB = bibleVerseCount.web;
const odds = bookOdds();
const otVerses = odds.filter((b) => b.testament === "OT").reduce((s, b) => s + b.verses, 0);
const otShare = Math.round((otVerses / KJV) * 100);
const top = odds[0];
const smallest = odds.at(-1);
const poolBooks = poolByBook();
const poolTop = poolBooks[0];
const poolOt = topicPool.filter((e) => odds.find((b) => b.name === e.book)?.testament === "OT").length;
const poolOtShare = Math.round((poolOt / POOL) * 100);
const multiTopic = topicPool.filter((e) => e.topics.length >= 3).length;
const pct = (x) => `${(x * 100).toFixed(x < 0.01 ? 2 : 1)}%`;

const TITLE = "Random Bible Verse Generator (KJV and WEB)";
const ANSWER = `Press the button for a random Bible verse. By default it draws from ${fmt(EVERYDAY)} encouraging verses (hope, strength, peace, comfort and ${EVERYDAY_TOPICS.length - 4} more everyday topics). Switch to all ${fmt(POOL)} verses on our ${poolTopics.length} topic lists or to all ${fmt(KJV)} verses of the King James Version (${fmt(WEB)} in the World English Bible), and narrow the draw to one topic, testament or book. Each verse comes in the WEB and the KJV.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Free random Bible verse generator: ${fmt(EVERYDAY)} encouraging verses, ${fmt(POOL)} on ${poolTopics.length} topics, or all ${fmt(KJV)} KJV verses. Filter by topic or book.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  {
    q: "How does the random Bible verse generator work?",
    a: `Each press asks the server for one verse picked with equal odds from the pool you chose: ${fmt(EVERYDAY)} encouraging verses, all ${fmt(POOL)} verses on our topic lists, or every one of the ${fmt(KJV)} verses in the King James Version. Filters narrow the pool first, then one verse is drawn from what is left.`,
  },
  {
    q: "Is every verse in the Bible equally likely?",
    a: `In whole-Bible mode, yes: each of the ${fmt(KJV)} KJV verses has a 1 in ${fmt(KJV)} chance. That makes long books more likely: ${top.name} holds ${fmt(top.verses)} verses, so ${pct(top.share)} of draws land there, while ${smallest.name} (${fmt(smallest.verses)} verses) comes up ${pct(smallest.share)} of the time.`,
  },
  {
    q: "Why draw from the topic lists instead of the whole Bible?",
    a: `Only ${pct(POOL / KJV)} of the ${fmt(KJV)} KJV verses are on our topic lists, so a whole-Bible draw usually lands outside them, and the verses outside them include genealogies, censuses and temple measurements. The topic lists hold verses people look up for a reason, so a draw from them is more likely to be a verse you can use today. The default, encouraging verses, keeps to the ${EVERYDAY_TOPICS.length} everyday topics such as strength, anxiety, love and grief and leaves out lists on sin and disputed questions, plus ${EXCLUDED_COUNT} verses we read by hand and dropped because they read as judgment or need their surrounding verses. ${fmt(multiTopic)} of the ${fmt(POOL)} topic-list verses sit on three or more of our lists.`,
  },
  {
    q: "Which Bible translation does the generator use?",
    a: "The World English Bible (WEB) and the King James Version (KJV). Both are in the public domain, so the full text can be shown and copied. Use the WEB/KJV buttons to switch.",
  },
  {
    q: "Is this the same as a verse of the day?",
    a: "No. This page gives a new verse every time you press the button. The verse of the day is one verse for everyone, chosen by the date and changed at midnight Eastern Time.",
  },
  {
    q: "Can I get a random verse from one book or testament?",
    a: `Yes. Pick a testament or a book and the draw stays inside it. The Old Testament holds ${otShare}% of all KJV verses, so an unfiltered whole-Bible draw lands there about ${otShare} times in 100.`,
  },
];

export default function RandomBibleVerse() {
  const v = randomTopicVerse({ set: "everyday" });
  const initial = { ...v, topics: v.topicLinks };
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Random Bible verse", url: URL },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Random Bible Verse Generator",
      url: URL,
      applicationCategory: "ReferenceApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description: ANSWER,
    },
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Random Bible verse" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Random Bible verse generator</h1>
            <p className="text-lg md:text-xl leading-relaxed mb-2">{ANSWER}</p>
            <p className="text-sm text-muted-foreground mb-6">Free, no sign-up. Updated {longDate(POOL_UPDATED).replace(/^\w+, /, "")}, when the topic lists last changed; every count on this page is computed from the full text when the site is built.</p>
            <RandomVerseTool
              initial={initial}
              topics={poolTopics}
              books={bookNames}
              everydaySize={EVERYDAY}
              poolSize={POOL}
              bibleSize={KJV}
            />
            <p className="mt-3 text-sm text-muted-foreground">
              Want one verse a day instead? See the <Link href="/bible-verse-of-the-day" className="underline underline-offset-2">Bible verse of the day</Link>.
            </p>
          </div>
        </section>

        <Section id="numbers" title="The generator in numbers" intro="Every figure is counted from the verse text and our topic lists when the site is built.">
          <StatTiles
            stats={[
              { label: "Encouraging verses", value: fmt(EVERYDAY), note: `${EVERYDAY_TOPICS.length} everyday topics; ${fmt(POOL)} on all ${poolTopics.length} lists` },
              { label: "Verses in the whole Bible", value: fmt(KJV), note: `KJV; ${fmt(WEB)} in the WEB` },
              { label: "Odds of any one verse", value: `1 in ${fmt(KJV)}`, note: "whole-Bible mode" },
              { label: "Old Testament share", value: `${otShare}%`, note: `${poolOtShare}% of the topic-list verses` },
            ]}
          />
        </Section>

        <Section
          id="odds"
          muted
          title="Where a whole-Bible draw lands"
          intro={`Every verse has the same chance, so a book's odds equal its share of the ${fmt(KJV)} KJV verses. ${top.name} alone is ${pct(top.share)} of the Bible; the ten longest books hold ${pct(odds.slice(0, 10).reduce((s, b) => s + b.share, 0))} of all verses.`}
        >
          <BarRows rows={odds.slice(0, 15).map((b) => ({ label: b.name, value: b.verses, href: `/books/${b.slug}`, display: pct(b.share) }))} />
          <p className="mt-4 text-sm text-muted-foreground">
            The rarest draws: {odds.slice(-3).reverse().map((b, i) => (
              <span key={b.slug}>
                {i ? ", " : ""}
                <Link href={`/books/${b.slug}`} className="underline underline-offset-2">{b.name}</Link> ({fmt(b.verses)} verses, {pct(b.share)})
              </span>
            ))}. All 66 books: <Link href="/books-of-the-bible" className="underline underline-offset-2">books of the Bible</Link>.
          </p>
        </Section>

        <Section
          id="topic-lists"
          title="Where the topic-list verses come from"
          intro={`The ${fmt(POOL)} topic-list verses lean toward the books people quote most. ${poolTop.name} supplies ${fmt(poolTop.count)} of them (${pct(poolTop.count / POOL)}), against ${pct(odds.find((b) => b.name === poolTop.name).share)} of the whole Bible.`}
        >
          <BarRows rows={poolBooks.slice(0, 12).map((b) => ({ label: b.name, value: b.count, href: `/books/${b.slug}` }))} />
          <p className="mt-4 text-sm text-muted-foreground">
            Browse the lists themselves: <Link href="/topics/emotions" className="underline underline-offset-2">topics by category</Link>, or start with{" "}
            <Link href="/verses/strength" className="underline underline-offset-2">strength</Link>,{" "}
            <Link href="/verses/anxiety" className="underline underline-offset-2">anxiety</Link> and{" "}
            <Link href="/verses/love" className="underline underline-offset-2">love</Link>.
          </p>
        </Section>

        <FaqSection title="Questions about the random verse generator" faqs={faqs} />

        <Section id="method" muted title="How the verses and counts were gathered">
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Topic-list verses are the single-verse cards on our topic pages (passages of two or more verses are left out), each checked word for word against the World English Bible source file, with the King James text beside it; a verse on several lists counts once. Encouraging verses are the whole-sentence verses (none that start or end mid-sentence) on at least one of {EVERYDAY_TOPICS.length} everyday topics: {EVERYDAY_TOPICS.join(", ").replace(/-/g, " ")}. We then dropped {EXCLUDED_COUNT} verses that read as judgment on the wicked, narrative asides or half an argument. Whole-Bible draws read the full public-domain KJV and WEB text (the files bible-api.com serves, github.com/seven1m/open-bibles). The draw uses the server's random number generator with equal odds for every verse left after the filters.
          </p>
          <MethodNote text={METHOD} date={DATA_GENERATED} />
          <p className="mt-3 text-xs text-muted-foreground">Cite this: Random Bible Verse Generator, biblesaysabout.com, {URL}, verse counts as of {DATA_GENERATED}.</p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>
              World English Bible, public domain: <a href="https://github.com/seven1m/open-bibles/blob/master/eng-web.usfx.xml" className="underline underline-offset-2">eng-web.usfx.xml</a> (the file bible-api.com serves), read October 23, 2026.
            </li>
            <li>
              King James Version, public domain: <a href="https://github.com/seven1m/open-bibles/blob/master/eng-kjv.osis.xml" className="underline underline-offset-2">eng-kjv.osis.xml</a>, read October 23, 2026.
            </li>
            <li>
              Verse and book counts: <Link href="/bible-by-the-numbers" className="underline underline-offset-2">the Bible by the numbers</Link>, counted by us from those two files.
            </li>
          </ul>
        </Section>
      </div>
    </>
  );
}
