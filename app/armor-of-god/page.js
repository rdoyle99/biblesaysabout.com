import { OG_VIDEOS } from "@/lib/og-video";
/* Armor of God: the six pieces in Ephesians 6:13-18 (KJV and WEB), how often each piece is named across the Bible,
   and the other passages that borrow the same pieces. Counted by scripts/build-bible-lists.mjs. */

import Link from "next/link";
import { LISTS, LISTS_DATE } from "@/lib/bibleLists";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/armor-of-god`;
const A = LISTS.armor;
const rows = A.rows;
const byCount = [...rows].sort((a, b) => b.kjv.total - a.kjv.total);
const sword = rows.find((r) => r.noun === "sword");
const helmet = rows.find((r) => r.noun === "helmet");
const shield = rows.find((r) => r.noun === "shield");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const TITLE = "Armor of God: The 6 Pieces, Verses and Word Counts";
const ANSWER = `The armor of God is six pieces Paul names in Ephesians 6:13-18. They are the belt of truth, the breastplate of righteousness, shoes of the gospel of peace, the shield of faith, the helmet of salvation and the sword of the Spirit, which is the word of God. He ends with prayer. The phrase "whole armour of God" appears ${A.phrase.kjv.total} times in the King James Version, in Ephesians 6:11 and 6:13.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The six pieces of the armor of God in Ephesians 6, in the KJV and WEB, with how often the Bible names each one: sword ${sword.kjv.total} times, shield ${shield.kjv.total}, helmet ${helmet.kjv.total}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 6 pieces of the armor of God?", a: `Ephesians 6:14-17 names them in order: the belt of truth, the breastplate of righteousness, shoes that carry the gospel of peace, the shield of faith, the helmet of salvation and the sword of the Spirit. Verse 18 adds praying always in the Spirit.` },
  { q: "Where is the armor of God in the Bible?", a: `Ephesians 6:10-18. The words "the whole armour of God" are in verse 11 and again in verse 13 of the King James Version. The World English Bible says "the whole armor of God" in the same two verses.` },
  { q: "Which piece of the armor is a weapon?", a: `The sword of the Spirit is the only offensive weapon in the list; the belt, breastplate, shoes, shield and helmet cover the body. Paul explains the sword in the same verse: it "is the word of God". Hebrews 4:12 uses the same pair: the word of God is "sharper than any twoedged sword".` },
  { q: "Did Paul invent the armor of God?", a: `Pieces of it appear earlier. Isaiah 59:17 has the LORD putting on righteousness as a breastplate and a helmet of salvation on his head. 1 Thessalonians 5:8, also by Paul, has a breastplate of faith and love and a helmet that is the hope of salvation.` },
  { q: "Is it armor or armour?", a: `Both. "Armour" is the King James Version's spelling and appears ${A.armourWord.kjv.total} times in it. "Armor" is the World English Bible's spelling, ${A.armourWord.web.total} times.` },
];

export default function ArmorOfGod() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Armor of God", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Armor of God: the 6 pieces, verses and word counts", description: ANSWER, url: URL, datePublished: LISTS_DATE, dateModified: LISTS_DATE }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className="underline underline-offset-2 hover:text-primary">{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Armor of God" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Armor of God</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Verses are quoted from the King James Version and the World English Bible. Counts are of every form of the noun in the King James Version, singular and plural.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Pieces of armor", value: rows.length, note: "Ephesians 6:14-17" },
                { label: `Times "sword" appears (KJV)`, value: fmt(sword.kjv.total), note: "words sword and swords" },
                { label: `Times "shield" appears (KJV)`, value: shield.kjv.total, note: `${cap(shield.kjv.top.book)} has ${shield.kjv.top.count}` },
                { label: `Times "helmet" appears (KJV)`, value: helmet.kjv.total, note: `first in 1 Samuel 17:5` },
              ]}
            />
          </div>
        </section>

        <Section id="pieces" title="The six pieces, verse by verse" intro="Ephesians 6:13-18 in the King James Version and the World English Bible. The last column counts how often the Bible names the piece as an object, in all 66 books.">
          <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4 mb-3">
            <p className="leading-relaxed">Wherefore take unto you the whole armour of God, that ye may be able to withstand in the evil day, and having done all, to stand. Stand therefore, having your loins girt about with truth, and having on the breastplate of righteousness; And your feet shod with the preparation of the gospel of peace; Above all, taking the shield of faith, wherewith ye shall be able to quench all the fiery darts of the wicked. And take the helmet of salvation, and the sword of the Spirit, which is the word of God: Praying always with all prayer and supplication in the Spirit.</p>
            <footer className="mt-2 text-sm text-muted-foreground">Ephesians 6:13-18 (KJV, shortened at verse 18)</footer>
          </blockquote>
          <div className="overflow-x-auto rounded-xl border bg-card mt-6">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Piece</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">Wording in each translation</th>
                  <th className="p-3 font-semibold text-right">KJV count of the noun</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium">{r.piece}</td>
                    <td className="p-3 whitespace-nowrap">{r.ref}</td>
                    <td className="p-3 text-muted-foreground">KJV: "{r.kjvPhrase}". WEB: "{r.webPhrase}".</td>
                    <td className="p-3 text-right tabular-nums">{r.kjv.total} <span className="text-muted-foreground">({r.forms.join(", ")})</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The King James Version has no noun for the first piece: Paul has the loins "girt about with truth", so the count above is of "girdle" and "girdles" in the rest of the Bible. The World English Bible translates it as a belt. Shoes are the same: Ephesians 6:15 says the feet are "shod", and the count is of "shoe" and "shoes" elsewhere.
          </p>
        </Section>

        <Section id="counts" title="Which piece does the Bible name most?" intro={`The King James Version names a sword ${fmt(sword.kjv.total)} times and a helmet ${helmet.kjv.total} times.`} muted>
          <BarRows rows={byCount.map((r) => ({ label: cap(r.noun), value: r.kjv.total }))} labelWidth="w-32" />
          <p className="mt-5 leading-relaxed">
            The sword has {fmt(sword.kjv.total)} mentions, from Genesis 3:24, where a flaming sword guards Eden, to Revelation. The most are in {sword.kjv.top.book}, with {sword.kjv.top.count}. {wordLink("sword", "The sword page")} counts its forms separately. The shield comes next at {shield.kjv.total}, most often in the Psalms ({shield.kjv.top.count}), where God himself is the shield, as in Genesis 15:1: "I am thy shield". The helmet, the piece named least, is first worn by Goliath in 1 Samuel 17:5.
          </p>
          <p className="mt-3 leading-relaxed">
            Breastplate is named {rows.find((r) => r.noun === "breastplate").kjv.total} times, and {rows.find((r) => r.noun === "breastplate").kjv.top.count} of them are in {rows.find((r) => r.noun === "breastplate").kjv.top.book}, where it is the priest's breastplate of judgment. In Ephesians the word means a soldier's armor.
          </p>
        </Section>

        <Section id="other-passages" title="Other verses that use the same pieces">
          <div className="space-y-3">
            {A.xref.map((x) => (
              <div key={x.ref} className="rounded-xl border bg-card p-4">
                <div className="font-semibold">{x.ref}</div>
                <p className="mt-1 text-sm leading-relaxed">{x.kjvText}</p>
                <p className="mt-1 text-sm text-muted-foreground">{x.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Verses above are the King James text. "Armour" appears {A.armourWord.kjv.total} times in the King James Version and "armor" {A.armourWord.web.total} times in the World English Bible.
          </p>
        </Section>

        <Section id="limits" title="What these counts leave out">
          <p className="leading-relaxed">The counts cover the nouns in English, so a verse that describes a shield without using the word is not counted. They also do not show what Paul meant by each piece; Ephesians 6 does not explain the belt, breastplate or shoes beyond the word beside each. For the meaning of each piece, the cross references above are the best evidence the text itself gives.</p>
        </Section>

        <FaqSection title="Questions about the armor of God" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/build-bible-lists.mjs from the text at github.com/seven1m/open-bibles (read and counted {LISTS_DATE}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Paul's other long list is <Link href="/fruit-of-the-spirit" className="underline underline-offset-2 hover:text-primary">the fruit of the Spirit</Link>. See <Link href="/books/ephesians" className="underline underline-offset-2 hover:text-primary">how long Ephesians is</Link>, or{" "}
            <Link href="/verses/spiritual-warfare" className="underline underline-offset-2 hover:text-primary">Bible verses about spiritual warfare</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={LISTS_DATE} />
        </Section>
      </div>
    </>
  );
}
