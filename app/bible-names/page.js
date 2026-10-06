/* Bible names and places with Hitchcock's meaning and our KJV/WEB count, joined from two sources */

import Link from "next/link";
import { getWord, fmt, headline, METHOD, SITE } from "@/lib/bibleData";
import { allMeanings, NAMES_DATE, NAMES_NOTE, NAMES_SOURCE } from "@/lib/bibleNames";
import { generateBreadcrumbSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, BarRows, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/bible-names`;

const rows = allMeanings()
  .map((m) => {
    const w = getWord(m.slug);
    return w ? { ...m, w, h: headline(w) } : null;
  })
  .filter(Boolean);
const sorted = [...rows].sort((a, b) => a.term.localeCompare(b.term));
const top = [...rows].sort((a, b) => b.h.n - a.h.n).slice(0, 12);
const TITLE = `Bible Names and Their Meanings: ${rows.length} Names and Places With Counts`;
const DESCRIPTION = `What ${rows.length} Bible names and places mean (Noah, Jacob, Ruth, Jordan, Eden) from Hitchcock's 1869 dictionary, with how many times each appears in the KJV and World English Bible.`;
const ANSWER = `${rows.length} of the names and places we count have a meaning in Hitchcock's Bible Names Dictionary (1869). ${top[0].term} is the most used (${fmt(top[0].h.n)} times in the ${top[0].h.name}), and it means "${top[0].main.meaning}". ${top[1].term} comes next (${fmt(top[1].h.n)} times, "${top[1].main.meaning}"). Each name below links to its full count by book.`;

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function BibleNames() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible Word Counts", url: `${SITE}/words` },
      { name: "Bible Names and Meanings", url: URL },
    ]),
    generateDataArticleSchema({ headline: "What do Bible names mean?", description: ANSWER, url: URL, datePublished: NAMES_DATE, dateModified: NAMES_DATE })
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible Word Counts", href: "/words" }, { name: "Bible Names and Meanings" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">What do Bible names mean?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-4 text-sm text-muted-foreground">{NAMES_NOTE}</p>
            </div>
          </div>
        </section>

        <Section title="The most used names and places, with their meanings" intro="Times each appears in the text, headline count from the page for that name.">
          <BarRows rows={top.map((r) => ({ label: `${r.term}: ${r.main.meaning}`, value: r.h.n, href: `/words/${r.slug}` }))} labelWidth="w-48 md:w-72" />
        </Section>

        <Section title={`All ${rows.length} names and places`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Meaning (Hitchcock, 1869)</th>
                  <th className="p-3 font-semibold text-right">Times in the Bible</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.slug} className="border-b last:border-0 align-top">
                    <td className="p-3 whitespace-nowrap">
                      <Link href={`/words/${r.slug}`} className="underline underline-offset-2 hover:text-primary">
                        {r.term}
                      </Link>
                    </td>
                    <td className="p-3">
                      {r.main.meaning}
                      {r.main.via ? <span className="text-muted-foreground"> (same name as {r.main.via})</span> : null}
                      {r.others.length ? <span className="text-muted-foreground"> (another {r.term}: {r.others.map((o) => o.meaning).join("; ")})</span> : null}
                    </td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">
                      {fmt(r.h.n)} <span className="text-xs text-muted-foreground">{r.h.translation}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            The count is the exact name in the King James Version, or the World English Bible when the KJV never uses it. Source for meanings: {NAMES_SOURCE}.
          </p>
        </Section>

        <Section>
          <p className="mb-4">
            Want counts for words rather than names? See{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">
              how many times every word appears in the Bible
            </Link>
            , or the{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              Bible by the numbers
            </Link>
            .
          </p>
          <MethodNote text={METHOD} date={NAMES_DATE} />
        </Section>
      </div>
    </>
  );
}
