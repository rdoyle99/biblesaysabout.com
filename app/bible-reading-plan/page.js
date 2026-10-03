/* Bible reading plan generator and the plan pages: whole chapters of the KJV split into days of equal length */

import Link from "next/link";
import { fmt, SITE } from "@/lib/bibleData";
import { PLANS, SCOPES, buildPlan, planStats, minutesLabel, PLAN_DATE, PLAN_METHOD } from "@/lib/readingPlan";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import AmazonPicks from "@/components/AmazonPicks";
import ReadingPlanGenerator from "@/components/ReadingPlanGenerator";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/bible-reading-plan`;
const year = planStats(buildPlan("bible", 365));
const ninety = planStats(buildPlan("bible", 90));
const nt90 = planStats(buildPlan("nt", 90));

const TITLE = "Bible Reading Plan Generator: Any Length, Day by Day";
const ANSWER = `Reading the whole Bible in a year takes about ${minutesLabel(year.avgMinutes)} a day: ${fmt(year.avgWords)} words, or ${year.minChapters} to ${year.maxChapters} chapters, on each of 365 days. In 90 days it is ${minutesLabel(ninety.avgMinutes)} a day. The New Testament alone takes ${minutesLabel(nt90.avgMinutes)} a day for 90 days. The generator below builds a plan for any section and any number of days, with days of about equal length counted from the King James text.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Build a Bible reading plan for any book, any number of days. Read the Bible in a year in ${minutesLabel(year.avgMinutes)} a day, or the New Testament in 30 or 90 days. Free, with dates.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How long does it take to read the Bible in a year?", a: `${minutesLabel(year.avgMinutes)} a day at the average silent reading speed of 238 words a minute. The 365-day plan below averages ${fmt(year.avgWords)} words and about ${(1189 / 365).toFixed(1)} chapters a day, from ${year.lightest.ref} (the lightest day, ${fmt(year.minWords)} words) to ${year.heaviest.ref} (the heaviest, ${fmt(year.maxWords)}).` },
  { q: "How do you make a Bible reading plan?", a: "Choose what to read, how many days you have and a start date. The generator splits whole chapters of the King James Version into days of about equal length, so a day with long chapters has fewer of them. Copy the plan as text or print it." },
  { q: "Is it better to read the Bible in order or by topic?", a: "Reading in order, Genesis to Revelation, shows the story as it unfolds, and the plans here use that order. If you want a theme instead, our topic pages collect verses on subjects like faith, hope and forgiveness." },
  { q: "What is the easiest way to read the Bible in 90 days?", a: `Plan for about ${minutesLabel(ninety.avgMinutes)} a day, ${ninety.minChapters} to ${ninety.maxChapters} chapters. That is a heavy load: the 90-day Bible plan averages ${fmt(ninety.avgWords)} words a day. Many readers choose the New Testament in 90 days instead, at ${minutesLabel(nt90.avgMinutes)} a day.` },
  { q: "Where should a new reader start?", a: "The Gospel of Mark is the shortest Gospel, and the four Gospels take about 30 days at 2,800 words, roughly 12 minutes, a day. Many readers then continue through Acts and the letters." },
];

export default function ReadingPlanHub() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible reading plans", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Bible reading plan generator", description: ANSWER, url: URL, datePublished: PLAN_DATE, dateModified: PLAN_DATE }),
    { "@context": "https://schema.org", "@type": "WebApplication", name: "Bible reading plan generator", url: URL, applicationCategory: "EducationalApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible reading plans" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Bible reading plan generator</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
            </div>
            <StatTiles
              stats={[
                { label: "In a year", value: `${minutesLabel(year.avgMinutes)}/day`, note: `${fmt(year.avgWords)} words, 365 days` },
                { label: "In 90 days", value: `${minutesLabel(ninety.avgMinutes)}/day`, note: `${fmt(ninety.avgWords)} words a day` },
                { label: "New Testament, 90 days", value: `${minutesLabel(nt90.avgMinutes)}/day`, note: `${fmt(nt90.avgWords)} words a day` },
                { label: "Chapters in the Bible", value: "1,189", note: "790,325 KJV words" },
              ]}
            />
          </div>
        </section>

        <Section title="Make your plan" intro="Pick a section, how many days you want, and a start date. The plan keeps whole chapters together and balances the days by word count.">
          <ReadingPlanGenerator />
        </Section>

        <Section title="Ready-made plans" intro="Each plan has its own page with every day's reading, the word count and the time it takes." muted>
          <ul className="grid sm:grid-cols-2 gap-3">
            {PLANS.map((p) => {
              const s = planStats(buildPlan(p.scope, p.days));
              return (
                <li key={p.slug}>
                  <Link href={`/bible-reading-plan/${p.slug}`} className="block h-full rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-colors">
                    <span className="font-semibold">{p.name}</span>
                    <span className="block text-sm text-muted-foreground mt-1">
                      {SCOPES[p.scope].label}, {p.days} days: {minutesLabel(s.avgMinutes)} a day, {fmt(s.avgWords)} words
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Section>

        <FaqSection title="Bible reading plans: common questions" faqs={faqs} />

        <AmazonPicks
          title="Tools for a reading plan"
          items={[
            { label: "One-year Bibles", query: "one year bible", note: "The whole Bible in 365 daily readings" },
            { label: "Bible reading plan journals", query: "bible reading plan journal", note: "Track each day's reading" },
            { label: "Audio Bibles", query: "KJV audio bible", note: "Listen on a commute or a walk" },
          ]}
        />

        <Section muted>
          <p className="mb-4">
            Want the time for a single book? See{" "}
            <Link href="/how-long-does-it-take-to-read-the-bible" className="underline underline-offset-2 hover:text-primary">
              how long it takes to read the Bible
            </Link>
            , or browse{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">
              all 66 books
            </Link>
            .
          </p>
          <MethodNote text={PLAN_METHOD} date={PLAN_DATE} />
        </Section>
      </div>
    </>
  );
}
