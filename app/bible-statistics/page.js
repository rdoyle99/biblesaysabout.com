/* Bible Reading Statistics — linkbait reference page.
 * Every stat is sourced to a named research organization in lib/bibleStats.js.
 * Fully server-rendered: charts are plain HTML/CSS bars, no client JS.
 */

import Link from "next/link";
import {
  statSections,
  totalStatCount,
  sourceOrgs,
  STATS_UPDATED,
  bibleUserTrend,
  generationUse,
  literalismTrend,
  translationStatus,
  regionUse,
} from "@/lib/bibleStats";
import { generateBreadcrumbSchema, combineSchemas } from "@/lib/schema";

const PAGE_URL = "https://www.biblesaysabout.com/bible-statistics";

export const metadata = {
  title: "Bible Reading Statistics 2026 (65 Stats)",
  description: `${totalStatCount} Bible reading statistics for 2026, every one sourced to Pew Research, Barna, American Bible Society, Lifeway, Gallup, Wycliffe, United Bible Societies, or YouVersion. Reading habits, translation counts, engagement trends, demographics, and app usage.`,
  keywords: [
    "bible reading statistics",
    "bible statistics 2026",
    "how many people read the bible",
    "bible translation statistics",
    "state of the bible 2026",
    "bible engagement statistics",
    "youversion statistics",
    "bible ownership statistics",
  ].join(", "),
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Bible Reading Statistics 2026 (65 Stats)",
    description: `${totalStatCount} verified Bible reading, translation, and engagement statistics with a linked source on every number.`,
    type: "article",
    url: PAGE_URL,
    siteName: "Bible Says About",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bible Reading Statistics 2026 (65 Stats)",
    description: `${totalStatCount} verified Bible statistics with a linked source on every number.`,
  },
};

const faqs = [
  {
    q: "How many people read the Bible daily?",
    a: "Just 9% of Americans read the Bible every day, according to the American Bible Society's State of the Bible 2025. Among Protestant churchgoers specifically the figure is far higher: Lifeway Research found 31% read the Bible daily in 2026, up from 16% in 2007.",
  },
  {
    q: "What percentage of Americans own a Bible?",
    a: "77% of Americans say they personally own a Bible (American Bible Society, 2025). At the household level Barna Group has measured 88% of American households owning at least one Bible, with an average of 4.7 Bibles per household.",
  },
  {
    q: "How many languages has the Bible been translated into?",
    a: "The full Bible exists in 805 languages, the New Testament in 1,842 more, and Scripture portions in another 1,520 (Wycliffe Bible Translators UK, 2026). 3,229 of the world's 7,396 living languages still have no Scripture at all.",
  },
  {
    q: "Is Bible reading going up or down?",
    a: "Both, depending on the window. Bible use collapsed from 50% of U.S. adults in 2021 to 38% in 2024, then rebounded to 41% in 2025 (American Bible Society). Barna measured an even sharper rebound, from a 25-year low of 30% in 2024 to 42% in 2025, driven by Gen Z and Millennials.",
  },
  {
    q: "Which generation reads the Bible most?",
    a: "Boomers and older adults, at 46% Bible use in 2025, versus 36% of Gen Z adults (American Bible Society). But the growth is inverted: Barna found Gen Z Bible reading jumped from 30% to 49% and Millennials from 34% to 50% between 2024 and 2025.",
  },
  {
    q: "How many people use Bible apps?",
    a: "The YouVersion Bible App has passed one billion device installs and set a single-day record of 19 million users on November 2, 2025. Two-thirds of U.S. Bible Users access Scripture digitally at least some of the time, and 62% of those use a Bible app (American Bible Society, 2025).",
  },
  {
    q: "Do Americans believe the Bible is literally true?",
    a: "A record-low 20% of Americans say the Bible is the literal word of God, down from around 40% in the early 1980s. 49% call it the inspired word of God not to be taken entirely literally, and a record-high 29% call it a collection of fables and moral precepts recorded by man (Gallup, 2022).",
  },
  {
    q: "Where do these Bible statistics come from?",
    a: `Every statistic on this page is attributed to a named research organization with a direct link to its published source: ${sourceOrgs.join(", ")}. No figure on this page is estimated, modeled, or rounded from memory.`,
  },
];

function BarChart({ data, accent = "from-indigo-500 to-violet-600" }) {
  const max = Math.max(...data.points.map((p) => p.value));
  return (
    <figure className="rounded-xl border bg-card p-5 md:p-6">
      <figcaption className="text-sm font-medium text-foreground mb-4">
        {data.caption}
      </figcaption>
      <div className="space-y-3">
        {data.points.map((p) => (
          <div key={p.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs md:text-sm text-muted-foreground">
              {p.label}
            </span>
            <div className="flex-1 h-6 rounded-md bg-muted overflow-hidden">
              <div
                className={`h-full rounded-md bg-gradient-to-r ${accent}`}
                style={{ width: `${Math.max((p.value / max) * 100, 4)}%` }}
              />
            </div>
            <span className="w-24 shrink-0 text-right text-xs md:text-sm font-semibold tabular-nums">
              {p.value.toLocaleString()}
              {data.unit}
            </span>
          </div>
        ))}
      </div>
      <a
        href={data.source}
        rel="nofollow noopener"
        target="_blank"
        className="mt-4 inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        Source
      </a>
    </figure>
  );
}

export default function BibleStatisticsPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.biblesaysabout.com" },
    { name: "Bible Statistics", url: PAGE_URL },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bible Reading Statistics 2026",
    description: metadata.description,
    dateModified: STATS_UPDATED,
    author: {
      "@type": "Organization",
      name: "Bible Says About",
      url: "https://www.biblesaysabout.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Bible Says About",
      logo: {
        "@type": "ImageObject",
        url: "https://www.biblesaysabout.com/logo.png",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    citation: sourceOrgs.map((o) => ({ "@type": "Organization", name: o })),
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Bible Reading Statistics 2026",
    description: `${totalStatCount} Bible reading, ownership, translation, engagement, demographic, and app-usage statistics, each attributed to a named research organization.`,
    url: PAGE_URL,
    keywords: ["bible statistics", "bible reading", "scripture engagement"],
    creator: { "@type": "Organization", name: "Bible Says About" },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  const schema = combineSchemas(
    breadcrumbSchema,
    articleSchema,
    faqSchema,
    datasetSchema
  );

  const citationText = `Bible Says About (2026). "Bible Reading Statistics 2026." ${PAGE_URL}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="min-h-screen">
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="relative max-w-4xl mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-foreground">Bible Statistics</span>
            </nav>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight">
              Bible Reading Statistics 2026
            </h1>

            {/* Answer-first extractable block */}
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium text-foreground">
                Just 9% of Americans read the Bible every day and 38% never use it,
                while 77% still own one. Bible use fell from 50% of U.S. adults in
                2021 to a low of 38% in 2024, then rebounded to 41% in 2025. The
                full Bible now exists in 805 languages, with 3,229 of the world&apos;s
                7,396 living languages still having no Scripture at all. The
                YouVersion Bible App has passed one billion installs and set a
                single-day record of 19 million users on November 2, 2025.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Below: {totalStatCount} Bible statistics across{" "}
                {statSections.length} categories. Every number links to the research
                organization that published it. Sources:{" "}
                {sourceOrgs.join(", ")}. Last updated {STATS_UPDATED}.
              </p>
            </div>

            {/* Jump links */}
            <div className="flex flex-wrap gap-2">
              {statSections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="text-xs md:text-sm rounded-full border px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Charts */}
        <section className="py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Bible Statistics at a Glance
            </h2>
            <div className="space-y-6">
              <BarChart data={bibleUserTrend} />
              <BarChart
                data={generationUse}
                accent="from-emerald-500 to-teal-600"
              />
              <BarChart
                data={translationStatus}
                accent="from-amber-500 to-orange-600"
              />
              <BarChart data={regionUse} accent="from-sky-500 to-blue-600" />
              <BarChart
                data={literalismTrend}
                accent="from-rose-500 to-red-600"
              />
            </div>
          </div>
        </section>

        {/* Stat sections */}
        {statSections.map((section, si) => (
          <section
            key={section.id}
            id={section.id}
            className={si % 2 === 1 ? "py-10 md:py-14 bg-muted/30" : "py-10 md:py-14"}
          >
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {section.name}
              </h2>
              <p className="text-muted-foreground mb-6">{section.intro}</p>

              <div className="overflow-x-auto rounded-xl border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-3 font-semibold">Statistic</th>
                      <th className="p-3 font-semibold whitespace-nowrap">
                        Source
                      </th>
                      <th className="p-3 font-semibold whitespace-nowrap">Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.stats.map((st) => (
                      <tr key={st.claim} className="border-b last:border-0 align-top">
                        <td className="p-3 leading-relaxed">{st.claim}</td>
                        <td className="p-3 whitespace-nowrap">
                          <a
                            href={st.url}
                            rel="nofollow noopener"
                            target="_blank"
                            className="underline underline-offset-2 hover:text-primary"
                          >
                            {st.org}
                          </a>
                        </td>
                        <td className="p-3 whitespace-nowrap text-muted-foreground tabular-nums">
                          {st.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        ))}

        {/* Cite this page */}
        <section className="py-10 md:py-14 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Cite This Page</h2>
            <p className="text-muted-foreground mb-4">
              Free to reuse with attribution. If you quote a statistic, please cite
              both this page and the original research organization listed beside
              the number.
            </p>
            <div className="rounded-xl border bg-card p-4 md:p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  APA
                </p>
                <p className="text-sm break-words">{citationText}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  HTML link
                </p>
                <code className="block text-xs break-all bg-muted rounded p-3">
                  {`<a href="${PAGE_URL}">Bible Reading Statistics 2026 - Bible Says About</a>`}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 md:py-14">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Bible Statistics FAQ
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <div key={f.q} className="rounded-xl border bg-card p-5">
                  <h3 className="font-semibold text-lg mb-2">{f.q}</h3>
                  <p className="text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internal links */}
        <section className="py-10 md:py-14 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Read the Bible by Topic
            </h2>
            <p className="text-muted-foreground mb-6">
              Statistics say 51% of Americans wish they read the Bible more. These
              topic collections are a place to start.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "anxiety",
                "strength",
                "hope",
                "healing",
                "grief",
                "faith",
                "love",
                "peace",
                "depression",
                "prayer",
                "encouragement",
                "purpose",
              ].map((t) => (
                <Link
                  key={t}
                  href={`/verses/${t}`}
                  className="rounded-full border bg-card px-4 py-2 text-sm capitalize hover:bg-muted transition-colors"
                >
                  Bible verses about {t}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
