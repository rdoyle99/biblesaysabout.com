/* A ranked top-10 page (shortest/longest verse, chapter, book): server-rendered tables from lib/bookLists.js */

import Link from "next/link";
import { METHOD, SITE } from "@/lib/bibleData";
import { RANK_PAGES, RANK_DATE } from "@/lib/bookLists";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

export function rankMetadata(slug) {
  const p = RANK_PAGES[slug];
  const url = `${SITE}/${slug}`;
  return {
    title: { absolute: p.title },
    description: p.description,
    alternates: { canonical: url },
    openGraph: { title: p.title, url, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
  };
}

function RankTable({ t }) {
  const hasText = t.rows.some((r) => r.text);
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 font-semibold">#</th>
            {t.cols.map((c, i) => (
              <th key={c} className={`p-3 font-semibold ${i > 0 ? "text-right" : ""}`}>{c}</th>
            ))}
            {hasText ? <th className="p-3 font-semibold">Text</th> : null}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((r, i) => (
            <tr key={r.ref} className="border-b last:border-0 align-top">
              <td className="p-3 tabular-nums text-muted-foreground">{i + 1}</td>
              <td className="p-3 font-medium whitespace-nowrap">
                {r.href ? <Link href={r.href} className="underline underline-offset-2 hover:text-primary">{r.ref}</Link> : r.ref}
              </td>
              {[r.a, r.b, r.c, r.d].slice(0, t.cols.length - 1).map((v, j) => (
                <td key={j} className="p-3 text-right tabular-nums whitespace-nowrap">{v}</td>
              ))}
              {hasText ? <td className="p-3 text-muted-foreground leading-relaxed min-w-[16rem]">{r.text}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RankPage({ slug }) {
  const p = RANK_PAGES[slug];
  const url = `${SITE}/${slug}`;
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: p.h1, url },
    ]),
    generateDataArticleSchema({ headline: p.h1, description: p.answer, url, datePublished: RANK_DATE, dateModified: RANK_DATE }),
    generateFAQSchema(p.faqs)
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: p.h1 }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">{p.h1}</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{p.answer}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 22, 2026</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Every ranking below is counted from the full text of the King James Version and the World English Bible. Where they differ, each table says which.
              </p>
            </div>
            <StatTiles stats={p.tiles} />
          </div>
        </section>
        {p.tables.map((t, i) => (
          <Section key={t.id} id={t.id} title={t.title} intro={t.intro} muted={i % 2 === 1}>
            <RankTable t={t} />
          </Section>
        ))}
        <FaqSection title="Questions people ask" faqs={p.faqs} />
        <Section muted>
          <p className="mb-4">
            More counts:{" "}
            {p.related.map((r, i) => (
              <span key={r}>
                {i > 0 ? ", " : ""}
                <Link href={`/${r}`} className="underline underline-offset-2 hover:text-primary">{RANK_PAGES[r].h1.replace(/^What is the /, "the ").replace(/\?$/, "")}</Link>
              </span>
            ))}
            . See also{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>,{" "}
            <Link href="/books-of-the-bible-in-order" className="underline underline-offset-2 hover:text-primary">the books of the Bible in order</Link> and{" "}
            <Link href="/how-long-is-the-bible" className="underline underline-offset-2 hover:text-primary">how long the Bible is</Link>.
          </p>
          <MethodNote text={METHOD} date={RANK_DATE} />
        </Section>
      </div>
    </>
  );
}
