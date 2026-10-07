/* About: the facts page. Every statement here is read from the data files or from the site's own source notes. */

import Link from "next/link";
import { totals, bible, words, fmt, METHOD, SITE, DATA_DATE } from "@/lib/bibleData";
import { allMeanings, NAMES_SOURCE } from "@/lib/bibleNames";
import { getAllTopics, getTotalVerseCount } from "@/lib/verses";
import { generateBreadcrumbSchema, combineSchemas, ORG_ID } from "@/lib/schema";
import { JsonLd, Breadcrumbs, Section, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/about`;
export const ABOUT_DATE = "2026-10-07";
const CONTACT = "rpdoyle1@gmail.com";

const topicCount = getAllTopics().length;
const verseCount = getTotalVerseCount();
const nameCount = allMeanings().length;

const TITLE = "About Bible Says About: Sources, Method and Contact";
const DESCRIPTION = "A free site of Bible verses by topic and Bible facts counted from the full text. Where the text, counts and name meanings come from, and how to report an error.";
const ENTITY = "Bible Says About is a free website of Bible verses by topic and Bible facts counted from the full text of the King James Version and the World English Bible.";

export const metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const facts = [
  ["Name", "Bible Says About"],
  ["What it is", "A free website of Bible verses by topic and Bible facts counted from the full text"],
  ["Started", "August 2025"],
  ["Based in", "Florida, US"],
  ["On the site now", `${fmt(topicCount)} topic pages with ${fmt(verseCount)} verses, counts for ${fmt(totals.books)} books and ${fmt(totals.chapters)} chapters, ${fmt(words.length)} word and name pages`],
  ["Translations quoted", "World English Bible (default) and King James Version, both public domain"],
  ["Cost", "Free to read, no account needed"],
  ["Contact", CONTACT],
  ["Last updated", "October 7, 2026"],
];

export default function About() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "About", url: URL },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: TITLE,
      url: URL,
      description: DESCRIPTION,
      dateModified: ABOUT_DATE,
      about: { "@id": ORG_ID },
    }
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">About Bible Says About</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ENTITY}</p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                It started in August 2025 and is based in Florida, US. Every count on the books, word and numbers pages is computed from the source
                text and names the translation it was counted in.
              </p>
            </div>
          </div>
        </section>

        <Section title="The facts" muted>
          <dl className="grid grid-cols-1 md:grid-cols-[12rem_1fr] gap-x-6 gap-y-3 rounded-xl border bg-card p-5 md:p-6">
            {facts.map(([k, v]) => (
              <div key={k} className="contents">
                <dt className="font-semibold">{k}</dt>
                <dd className="text-muted-foreground">
                  {k === "Contact" ? (
                    <a href={`mailto:${CONTACT}`} className="underline underline-offset-2 hover:text-primary">
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Where the text comes from">
          <p className="leading-relaxed mb-4">
            Every verse on the site is quoted from the World English Bible or the King James Version, both public domain. Each quotation is
            checked word for word against the full text of the translation, taken from the{" "}
            <a href="https://github.com/seven1m/open-bibles" rel="noopener" className="underline underline-offset-2 hover:text-primary">
              open-bibles project
            </a>
            . We do not quote the NIV, ESV, NLT, NKJV or NASB, which are licensed.
          </p>
          <p className="leading-relaxed">
            The verse lists on the topic pages pick which verses to show using{" "}
            <a href="https://www.openbible.info/topics/" rel="noopener" className="underline underline-offset-2 hover:text-primary">
              OpenBible.info
            </a>{" "}
            topical data (CC BY), then print the text from the translations above. Pick a translation with the toggle on any{" "}
            <Link href="/verses/love" className="underline underline-offset-2 hover:text-primary">
              topic page
            </Link>
            .
          </p>
        </Section>

        <Section title="How the numbers are counted" muted>
          <p className="leading-relaxed mb-4">
            The Bible has {fmt(totals.books)} books, {fmt(totals.chapters)} chapters and {fmt(bible.kjv.verses)} verses in the King James Version
            ({fmt(bible.web.verses)} in the World English Bible). The counts on the{" "}
            <Link href="/books-of-the-bible" className="underline underline-offset-2 hover:text-primary">
              books page
            </Link>
            , the{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">
              Bible by the numbers
            </Link>{" "}
            and the{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">
              word counts
            </Link>{" "}
            come from running a script over the complete text of both translations, so anyone can repeat them.
          </p>
          <MethodNote text={METHOD} date={DATA_DATE} />
        </Section>

        <Section title="Sources">
          <ul className="space-y-3 leading-relaxed">
            <li>
              <a href="https://github.com/seven1m/open-bibles" rel="noopener" className="underline underline-offset-2 hover:text-primary">
                open-bibles (KJV and WEB text files)
              </a>
              : the text every verse and every count is checked against. Read October 7, 2026.
            </li>
            <li>
              <a href="https://www.openbible.info/topics/" rel="noopener" className="underline underline-offset-2 hover:text-primary">
                OpenBible.info topics
              </a>
              : which verses belong to a topic, licensed CC BY. Read October 7, 2026.
            </li>
            <li>
              <a href="https://www.ccel.org/ccel/hitchcock" rel="noopener" className="underline underline-offset-2 hover:text-primary">
                {NAMES_SOURCE}
              </a>
              : the meaning of {fmt(nameCount)} names and places on the{" "}
              <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">
                Bible names page
              </Link>
              . It is an 1869 reference in the public domain, so some meanings are traditional readings that modern scholars dispute. Read
              October 7, 2026.
            </li>
            <li>
              <a href="https://doi.org/10.1016/j.jml.2019.104047" rel="noopener" className="underline underline-offset-2 hover:text-primary">
                Brysbaert, M. (2019), Journal of Memory and Language 109
              </a>
              : adults read English non-fiction silently at {bible.readingWpm} words a minute, which sets the reading times on the{" "}
              <Link href="/how-long-does-it-take-to-read-the-bible" className="underline underline-offset-2 hover:text-primary">
                reading time calculator
              </Link>
              . Read October 7, 2026.
            </li>
            <li>
              The reading figures on the{" "}
              <Link href="/bible-statistics" className="underline underline-offset-2 hover:text-primary">
                Bible reading statistics
              </Link>{" "}
              page each link to the group that published them, with the year.
            </li>
          </ul>
        </Section>

        <Section title="Money and corrections" muted>
          <p className="leading-relaxed mb-4">
            Some pages link to Bible study resources on Amazon. If the site earns a commission from those links, the page says so, and the
            links are marked sponsored.
          </p>
          <p className="leading-relaxed">
            If a count, a quotation or a name meaning looks wrong, email{" "}
            <a href={`mailto:${CONTACT}`} className="underline underline-offset-2 hover:text-primary">
              {CONTACT}
            </a>
            . We check it against the source text and fix the page, and each data page shows the date its numbers were compiled.
          </p>
        </Section>
      </div>
    </>
  );
}
