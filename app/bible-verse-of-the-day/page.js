/* Bible verse of the day: one verse a day for everyone, picked by the New York date from the topic-list pool
 * (lib/verseTool.js). Rendered on each request, so the page rolls over at midnight ET with no one touching it.
 * /api/votd reports the same verse for the data-status check. */

import Link from "next/link";
import { verseOfTheDay, todayKey, longDate, shiftKey, everydayPool, EVERYDAY_TOPICS, EXCLUDED_COUNT, POOL_UPDATED } from "@/lib/verseTool";
import { fmt, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection } from "@/components/DataBits";

// Rendered on every request: a cached copy would keep showing yesterday's verse after midnight in New York
export const dynamic = "force-dynamic";

const URL = `${SITE}/bible-verse-of-the-day`;
const POOL = everydayPool.length;
const TITLE = "Bible Verse of the Day: Today's Verse in the WEB and KJV";

export async function generateMetadata() {
  const v = verseOfTheDay(todayKey());
  return {
    title: { absolute: TITLE },
    description: `Today's Bible verse is ${v.reference}. One verse a day from ${fmt(POOL)} encouraging verses, in the WEB and the KJV, new at midnight Eastern Time.`,
    alternates: { canonical: URL },
    openGraph: { title: TITLE, url: URL, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default function BibleVerseOfTheDay() {
  const key = todayKey();
  const v = verseOfTheDay(key);
  const week = [1, 2, 3, 4, 5, 6].map((d) => verseOfTheDay(shiftKey(key, -d)));
  const cycleYears = (POOL / 365).toFixed(1);
  const ANSWER = `The Bible verse of the day for ${longDate(key)} is ${v.reference}: ${v.web} (World English Bible). A new verse starts at midnight Eastern Time. Each day's verse comes from ${fmt(POOL)} verses on our lists for hope, strength, peace, comfort and ${EVERYDAY_TOPICS.length - 4} other everyday topics, and none repeats until every one has had its day, about ${cycleYears} years.`;

  const faqs = [
    { q: "What is the Bible verse of the day today?", a: ANSWER },
    {
      q: "How is the verse of the day chosen?",
      a: `The ${fmt(POOL)} single verses on our ${EVERYDAY_TOPICS.length} everyday topic lists (hope, strength, peace, comfort and the like; not the lists on sin or disputed questions) are walked in a fixed shuffled order, one per day, keyed to the date in New York. Everyone who opens this page on the same day sees the same verse, and a verse only comes back after all ${fmt(POOL)} have been used.`,
    },
    {
      q: "Which translation is the verse of the day in?",
      a: "The World English Bible (WEB), with the King James Version (KJV) below it. Both are public domain, so the verse can be copied and shared freely.",
    },
    {
      q: "Is this the same verse as YouVersion or Bible Gateway?",
      a: "No. Each site picks its own verse of the day. Ours is drawn from the verses on our topic lists, so it links to the topic it belongs to for more verses on the same theme.",
    },
    {
      q: "Can I get a different verse right now?",
      a: "Yes. The random Bible verse generator gives a new verse every time you press the button, from our topic lists or from the whole Bible.",
    },
  ];

  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible verse of the day", url: URL },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      url: URL,
      dateModified: key,
      mainEntity: {
        "@type": "Quotation",
        text: v.web,
        name: v.reference,
        isPartOf: { "@type": "Book", name: "World English Bible" },
      },
    },
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible verse of the day" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight text-balance">Bible verse of the day</h1>
            <p className="text-lg leading-relaxed mb-6">
              Updated {longDate(key)}: today's verse is {v.reference}. It changes at midnight Eastern Time, and today is day {fmt(v.cycleDay + 1)} of a {fmt(POOL)}-day rotation drawn from our everyday topic lists.
            </p>
            <div className="rounded-xl border bg-card p-5 md:p-7">
              <blockquote className="border-l-4 border-l-primary/60 pl-4">
                <p className="scripture-text text-2xl md:text-3xl leading-relaxed">{v.web}</p>
                <footer className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{v.reference}</span> (World English Bible)
                </footer>
              </blockquote>
              <div className="mt-5 rounded-lg bg-muted/40 p-4">
                <p className="leading-relaxed">{v.kjv}</p>
                <p className="mt-2 text-sm text-muted-foreground">{v.reference} (King James Version)</p>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                This verse is on our list{v.topicLinks.length > 1 ? "s" : ""} for{" "}
                {v.topicLinks.map((t, i) => (
                  <span key={t.slug}>
                    {i ? (i === v.topicLinks.length - 1 ? " and " : ", ") : ""}
                    <Link href={`/verses/${t.slug}`} className="underline underline-offset-2 hover:text-foreground">
                      {t.title}
                    </Link>
                  </span>
                ))}
                . {v.bookSlug ? (
                  <>
                    More about the book: <Link href={`/books/${v.bookSlug}`} className="underline underline-offset-2 hover:text-foreground">{v.book}</Link>.
                  </>
                ) : null}
              </p>
            </div>
            <p className="mt-6 text-lg leading-relaxed">{ANSWER}</p>
          </div>
        </section>

        <Section id="this-week" title="Verses from the past week" intro="The six days before today, newest first. The same date always gives the same verse.">
          <ul className="space-y-3">
            {week.map((d) => (
              <li key={d.date} className="rounded-xl border bg-card p-4">
                <div className="text-xs text-muted-foreground mb-1">{longDate(d.date)}</div>
                <p className="leading-relaxed">{d.web}</p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">{d.reference}</span>
                  {d.topicLinks[0] ? (
                    <>
                      {" · "}
                      <Link href={`/verses/${d.topicLinks[0].slug}`} className="underline underline-offset-2 text-muted-foreground hover:text-foreground">
                        {d.topicLinks[0].title}
                      </Link>
                    </>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="numbers" muted title="The rotation in numbers">
          <StatTiles
            stats={[
              { label: "Verses in the rotation", value: fmt(POOL), note: `from ${EVERYDAY_TOPICS.length} everyday topic lists` },
              { label: "Days before a repeat", value: fmt(POOL), note: `about ${cycleYears} years` },
              { label: "Today's verse returns", value: longDate(v.nextRepeat).replace(/^\w+, /, ""), note: "the next time it comes up" },
              { label: "Lists today's verse is on", value: v.topicLinks.length, note: "topics that use it" },
            ]}
          />
          <p className="mt-6 text-sm text-muted-foreground">
            Want a verse right now instead of tomorrow's? Try the <Link href="/random-bible-verse" className="underline underline-offset-2">random Bible verse generator</Link>.
          </p>
        </Section>

        <FaqSection title="Questions about the verse of the day" faqs={faqs} />

        <Section id="method" title="How the verse is picked">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The rotation holds every single-verse card on our {EVERYDAY_TOPICS.length} everyday topic pages ({fmt(POOL)} verses, a verse on several lists counted once; passages of two or more verses, and verses that start or end mid-sentence, are left out), each checked word for word against the World English Bible source file, with the King James text beside it. Day numbers count from January 1, 2026, in New York time; each day steps through the list by a fixed stride that visits every verse once before any repeats. The page is generated fresh on each visit, so it changes the moment the New York date does. We read the pool by hand and dropped {EXCLUDED_COUNT} verses that read as judgment on the wicked, narrative asides or half an argument. Topic lists last changed {POOL_UPDATED}.
          </p>
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
