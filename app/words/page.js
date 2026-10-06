/* Bible word counts: how many times each word appears in the full KJV and WEB text */

import Link from "next/link";
import { words, fmt, headline, METHOD, WORDS_DATE, SITE, bible } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, BarRows, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/words`;
const TITLE = `How Many Times Is a Word in the Bible? Counts for ${Math.floor(words.length / 50) * 50}+ Words`;
const get = (slug) => words.find((w) => w.slug === slug);
const love = get("love");
const fearNot = get("fear-not");
const hell = get("hell");

const ANSWER = `We counted every use of ${words.length} words, names and phrases in the full text of the King James Version and the World English Bible. Love appears ${fmt(love.kjv.exact)} times in the KJV, Jesus ${fmt(get("jesus").kjv.exact)}, and "fear not" ${fmt(fearNot.kjv.exact)} (not 365). Some words depend on the translation: the KJV uses hell ${fmt(hell.kjv.exact)} times, the World English Bible not once.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `How many times is love, God, Jesus, faith or fear not in the Bible? Counts for ${words.length} words in the KJV and World English Bible, by book and testament.`,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function WordsIndex() {
  const sorted = [...words].sort((a, b) => a.word.localeCompare(b.word));
  const top = [...words].filter((w) => w.kind !== "phrase").sort((a, b) => b.kjv.total - a.kjv.total).slice(0, 20);
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible Word Counts", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many times is a word in the Bible?", description: ANSWER, url: URL, datePublished: WORDS_DATE, dateModified: WORDS_DATE })
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible Word Counts" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many times is a word in the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                The headline count is the exact word in the KJV (for a phrase like Holy Spirit, every wording together), or the World English
                Bible when the KJV never uses the word. The KJV has {fmt(bible.kjv.words)} words in all. Each page shows the count by form, book and testament, the first and last
                mention, and where the two translations differ.
              </p>
            </div>
          </div>
        </section>

        <Section title="The most frequent words on our list" intro="Every form counted (for example love, loved, loveth), King James Version.">
          <BarRows rows={top.map((w) => ({ label: w.word, value: w.kjv.total, href: `/words/${w.slug}` }))} />
        </Section>

        <Section title={`All ${words.length} words and phrases`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Word</th>
                  <th className="p-3 font-semibold text-right">Headline count</th>
                  <th className="p-3 font-semibold text-right">Every form (KJV)</th>
                  <th className="p-3 font-semibold text-right">Every form (WEB)</th>
                  <th className="p-3 font-semibold">Most in</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((w) => {
                  const h = headline(w);
                  const main = h.translation === "KJV" ? w.kjv : w.web;
                  const topBook = [...main.byBook].sort((a, b) => b[1] - a[1])[0];
                  return (
                    <tr key={w.slug} className="border-b last:border-0">
                      <td className="p-3">
                        <Link href={`/words/${w.slug}`} className="underline underline-offset-2 hover:text-primary">
                          {w.word}
                        </Link>
                      </td>
                      <td className="p-3 text-right tabular-nums whitespace-nowrap">
                        {fmt(h.n)} <span className="text-xs text-muted-foreground">{h.translation}</span>
                      </td>
                      <td className="p-3 text-right tabular-nums">{fmt(w.kjv.total)}</td>
                      <td className="p-3 text-right tabular-nums">{fmt(w.web.total)}</td>
                      <td className="p-3 whitespace-nowrap">{topBook ? topBook[0] : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section>
          <p className="mb-4">
            Looking for verses on a theme rather than a word? Browse{" "}
            <Link href="/#all-topics" className="underline underline-offset-2 hover:text-primary">
              Bible verses by topic
            </Link>
            , see{" "}
            <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">
              what Bible names mean
            </Link>
            , or the{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              the Bible by the numbers
            </Link>
            .
          </p>
          <MethodNote text={METHOD} date={WORDS_DATE} />
        </Section>
      </div>
    </>
  );
}
