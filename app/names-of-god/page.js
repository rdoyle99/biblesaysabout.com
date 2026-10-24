import { OG_VIDEOS } from "@/lib/og-video";
/* Names of God hub: every name with its Hebrew, Strong's meaning and first verse */

import Link from "next/link";
import { fmt, SITE } from "@/lib/bibleData";
import { NAMES_METHOD, GOD_NAMES, getGodName, NAMES_OF_GOD_DATE, STRONGS_SOURCE, STRONGS_NOTE } from "@/lib/namesOfGod";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, FaqSection, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/names-of-god`;
const TITLE = `Names of God and Their Meanings: ${GOD_NAMES.length} Hebrew Names Explained`;
const lord = getGodName("jehovah").searches.LORD.kjv.n;
const yahweh = getGodName("yahweh").searches.yahweh.web.n;
const DESCRIPTION = `What Elohim, Adonai, El Shaddai, Jehovah Jireh and ${GOD_NAMES.length - 4} more names of God mean in Hebrew, with Strong's numbers, first verse and KJV and WEB counts.`;
const ANSWER = `The Bible gives God many names, and ${GOD_NAMES.length} of the best known are explained here: Elohim ("God"), Adonai ("my Lord"), El Shaddai ("God Almighty"), Jehovah or Yahweh (the personal name, ${fmt(yahweh)} times in the World English Bible and printed LORD ${fmt(lord)} times in the KJV) and compounds such as Jehovah Jireh ("the LORD will provide"). Each name below has its Hebrew, Strong's meaning, first verse and a count from the full text.`;

const FAQS = [
  {
    q: "What are the names of God in the Bible?",
    a: `The main ones are Elohim (God), Adonai (my Lord), El Shaddai (God Almighty), El Elyon (God Most High), El Roi (the God who sees me), El Olam (the everlasting God) and the personal name Yahweh, written Jehovah in some Bibles. Compound names such as Jehovah Jireh, Jehovah Nissi, Jehovah Shalom, Jehovah Tsidkenu, Jehovah Shammah and Jehovah Sabaoth join the personal name to a second word.`,
  },
  {
    q: "What is the difference between Elohim, Adonai and Yahweh?",
    a: "Elohim is a general word for God. Adonai is a title meaning my Lord, which Jewish readers say aloud in place of the name. Yahweh (YHWH) is the personal name God gives Moses in Exodus 3, printed LORD in capitals in the KJV.",
  },
  {
    q: "Are Jehovah Rapha and Jehovah Jireh names in the Bible?",
    a: "Jehovah Jireh is printed once, in Genesis 22:14. Jehovah Rapha is not printed in either the KJV or the World English Bible; it is a name drawn from Exodus 15:26, \"I am the LORD that healeth thee\".",
  },
];

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, description: DESCRIPTION, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

export default function NamesOfGod() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Names of God", url: URL },
    ]),
    generateDataArticleSchema({ headline: "What are the names of God and what do they mean?", description: ANSWER, url: URL, datePublished: NAMES_OF_GOD_DATE, dateModified: NAMES_OF_GOD_DATE }),
    generateFAQSchema(FAQS)
  );
  const groups = [
    { title: "Core names and titles", match: (n) => ["elohim", "adonai", "jehovah", "yahweh", "el-shaddai"].includes(n.slug) },
    { title: "Jehovah (Yahweh) compound names", match: (n) => n.slug.startsWith("jehovah-") },
    { title: "El names", match: (n) => n.slug.startsWith("el-") && n.slug !== "el-shaddai" },
  ];

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Names of God" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Names of God and Their Meanings</h1>
            <p className="text-sm text-muted-foreground mb-4">Updated October 22, 2026. Counts from the full KJV and World English Bible text.</p>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
            </div>
            <StatTiles
              stats={[
                { label: "Names explained", value: String(GOD_NAMES.length), note: "each with its own page" },
                { label: "LORD in the KJV", value: fmt(lord), note: `capitals mark the name YHWH; ${fmt(getGodName("jehovah").searches.GOD.kjv.n)} more print as GOD after Lord` },
                { label: "Yahweh in the WEB", value: fmt(yahweh), note: "the same name, written out; the KJV and WEB count it differently" },
                { label: "Jehovah in the KJV", value: fmt(getGodName("jehovah").searches.jehovah.kjv.n), note: "the only places it prints the form" },
              ]}
            />
          </div>
        </section>

        {groups.map((g, gi) => {
          const rows = GOD_NAMES.filter(g.match);
          return (
            <Section key={g.title} title={g.title} muted={gi % 2 === 1}>
              <div className="overflow-x-auto rounded-xl border bg-card">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="p-3 font-semibold">Name</th>
                      <th className="p-3 font-semibold">Hebrew</th>
                      <th className="p-3 font-semibold">Meaning</th>
                      <th className="p-3 font-semibold">Strong&apos;s</th>
                      <th className="p-3 font-semibold">First verse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.slug} className="border-b last:border-0 align-top">
                        <td className="p-3 whitespace-nowrap">
                          <Link href={`/names-of-god/${r.slug}`} className="font-medium underline underline-offset-2 hover:text-primary">
                            {r.name}
                          </Link>
                        </td>
                        <td className="p-3 whitespace-nowrap" lang="he">{r.hebrew}</td>
                        <td className="p-3">{r.short}</td>
                        <td className="p-3 whitespace-nowrap">{r.strongs.map((s) => s.n).join(" + ")}</td>
                        <td className="p-3 whitespace-nowrap">{r.first.ref}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          );
        })}

        <FaqSection title="Common questions" faqs={FAQS} />

        <Section muted>
          <h2 className="text-2xl font-bold mb-3">Sources</h2>
          <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
            Meanings: {STRONGS_SOURCE}. {STRONGS_NOTE} First verse is the first match in the text we searched for each name (see its page for the exact wording).
          </p>
          <p className="mb-4">
            More: <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">Bible names and their meanings</Link>,{" "}
            <Link href="/words/god" className="underline underline-offset-2 hover:text-primary">how many times God is in the Bible</Link>,{" "}
            <Link href="/names-of-jesus" className="underline underline-offset-2 hover:text-primary">the names and titles of Jesus</Link> and{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">every word count</Link>.
          </p>
          <MethodNote text={NAMES_METHOD} date={NAMES_OF_GOD_DATE} />
        </Section>
      </div>
    </>
  );
}
