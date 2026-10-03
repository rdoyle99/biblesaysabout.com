/* One ready-made reading plan: every day's reading, computed from KJV chapter word counts */

import Link from "next/link";
import { notFound } from "next/navigation";
import { fmt, SITE } from "@/lib/bibleData";
import { PLANS, SCOPES, getPlan, buildPlan, planStats, minutesLabel, chaptersFor, PLAN_DATE, PLAN_METHOD } from "@/lib/readingPlan";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import PlanTable from "@/components/PlanTable";
import AmazonPicks from "@/components/AmazonPicks";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

export function generateStaticParams() {
  return PLANS.map((p) => ({ plan: p.slug }));
}

function compute(slug) {
  const p = getPlan(slug);
  if (!p) return null;
  const plan = buildPlan(p.scope, p.days);
  const s = planStats(plan);
  const chapters = chaptersFor(p.scope).length;
  const perDay = chapters / p.days;
  return { p, plan, s, chapters, perDay };
}

const HEADLINES = {
  "bible-in-a-year": "Bible reading plan: the whole Bible in a year",
  "bible-in-6-months": "Bible reading plan: the whole Bible in 6 months",
  "bible-in-90-days": "Bible reading plan: the whole Bible in 90 days",
  "new-testament-in-90-days": "Bible reading plan: the New Testament in 90 days",
  "new-testament-in-30-days": "Bible reading plan: the New Testament in 30 days",
  "old-testament-in-a-year": "Bible reading plan: the Old Testament in a year",
  "gospels-in-30-days": "Bible reading plan: the four Gospels in 30 days",
};

export async function generateMetadata({ params }) {
  const { plan: slug } = await params;
  const c = compute(slug);
  if (!c) return { title: "Plan not found" };
  const title = `${c.p.name}: Day-by-Day Plan (${minutesLabel(c.s.avgMinutes)} a Day)`;
  const url = `${SITE}/bible-reading-plan/${slug}`;
  return {
    title: { absolute: title },
    description: `${c.p.name}, every day listed: ${c.plan[0].ref} on day 1 to ${c.plan.at(-1).ref} on day ${c.p.days}. About ${fmt(c.s.avgWords)} words, ${minutesLabel(c.s.avgMinutes)}, a day.`,
    alternates: { canonical: url },
    openGraph: { title, url, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

export default async function PlanPage({ params }) {
  const { plan: slug } = await params;
  const c = compute(slug);
  if (!c) notFound();
  const { p, plan, s, chapters, perDay } = c;
  const url = `${SITE}/bible-reading-plan/${slug}`;
  const scopeLabel = SCOPES[p.scope].label;
  const first = plan[0];
  const last = plan.at(-1);
  const answer = `${p.name}: read about ${perDay.toFixed(1)} chapters a day, ${fmt(s.avgWords)} words or ${minutesLabel(s.avgMinutes)} of silent reading. ${scopeLabel} is ${chapters.toLocaleString("en-US")} chapters and ${fmt(s.total)} King James words, so ${p.days} days works out as ${s.minChapters} to ${s.maxChapters} chapters a day, whole chapters only. Day 1 is ${first.ref} and day ${p.days} is ${last.ref}. The lightest day is ${fmt(s.minWords)} words (day ${s.lightest.day}, ${s.lightest.ref}) and the heaviest ${fmt(s.maxWords)} words (day ${s.heaviest.day}, ${s.heaviest.ref}).`;

  const faqs = [
    { q: `How many chapters a day is the ${p.days}-day plan?`, a: `${perDay.toFixed(1)} on average: ${chapters.toLocaleString("en-US")} chapters over ${p.days} days. Days run from ${s.minChapters} to ${s.maxChapters} chapters because the plan balances the length of each day in words, not in chapters.` },
    { q: `How long does each day take?`, a: `${minutesLabel(s.avgMinutes)} on average at 238 words a minute, the average adult silent reading speed. The lightest day is about ${minutesLabel(s.lightest.minutes)} and the heaviest about ${minutesLabel(s.heaviest.minutes)}. Reading aloud at 183 words a minute adds about 30% to those times.` },
    { q: `What is the hardest day of this plan?`, a: `Day ${s.heaviest.day}, ${s.heaviest.ref}, at ${fmt(s.maxWords)} words (${minutesLabel(s.heaviest.minutes)}). The plan never splits a chapter, so a stretch of long chapters makes a long day.` },
    { q: `Can I start on any date?`, a: `Yes. The days are numbered, not dated. Pick any start day and count forward, or use the generator on the reading plan page to get a dated list you can copy or print.` },
  ];

  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible reading plans", url: `${SITE}/bible-reading-plan` },
      { name: p.name, url },
    ]),
    generateDataArticleSchema({ headline: HEADLINES[slug], description: answer, url, datePublished: PLAN_DATE, dateModified: PLAN_DATE }),
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible reading plans", href: "/bible-reading-plan" }, { name: p.name }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">{p.name}</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{answer}</p>
            </div>
            <StatTiles
              stats={[
                { label: "Per day", value: minutesLabel(s.avgMinutes), note: `${fmt(s.avgWords)} words` },
                { label: "Chapters a day", value: perDay.toFixed(1), note: `${s.minChapters} to ${s.maxChapters}` },
                { label: "Days", value: String(p.days), note: scopeLabel },
                { label: "Total words", value: fmt(s.total), note: "King James Version" },
              ]}
            />
          </div>
        </section>

        <Section title={`${p.name}: every day`} intro="Whole chapters in Bible order. Open a block of days to see the readings.">
          <PlanTable plan={plan} />
          <p className="mt-4 text-sm">
            Want a different length or a dated list?{" "}
            <Link href="/bible-reading-plan" className="underline underline-offset-2 hover:text-primary">
              Build your own plan
            </Link>
            .
          </p>
        </Section>

        <FaqSection title="About this plan" faqs={faqs} />

        <Section title="Other reading plans" muted>
          <ul className="grid sm:grid-cols-2 gap-2">
            {PLANS.filter((x) => x.slug !== slug).map((x) => (
              <li key={x.slug}>
                <Link href={`/bible-reading-plan/${x.slug}`} className="underline underline-offset-2 hover:text-primary">
                  {x.name}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <AmazonPicks
          title="Tools for a reading plan"
          items={[
            { label: "One-year Bibles", query: "one year bible", note: "The whole Bible in 365 daily readings" },
            { label: "Bible reading plan journals", query: "bible reading plan journal", note: "Track each day's reading" },
            { label: "Audio Bibles", query: "KJV audio bible", note: "Listen on a commute or a walk" },
          ]}
        />

        <Section>
          <MethodNote text={PLAN_METHOD} date={PLAN_DATE} />
        </Section>
      </div>
    </>
  );
}
