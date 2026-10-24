import { OG_VIDEOS } from "@/lib/og-video";
/* The twelve tribes of Israel: the twelve sons and their mothers, the two censuses in Numbers, the different lists in
   Genesis, Numbers and Revelation. Counted by scripts/build-bible-lists.mjs. */

import Link from "next/link";
import { LISTS, LISTS_DATE, joinList } from "@/lib/bibleLists";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { getMeaning, NAMES_SOURCE } from "@/lib/bibleNames";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/twelve-tribes-of-israel`;
const T = LISTS.tribes;
const S = T.summary;
const sons = T.sons;
const jsons = T.josephSons;
const census = [...sons.filter((r) => r.census1), ...jsons].map((r) => ({ ...r, diff: r.census2 - r.census1, pct: ((r.census2 - r.census1) / r.census1) * 100 }));
const byChange = [...census].sort((a, b) => a.pct - b.pct);
const lowest = byChange[0];
const highest = byChange.at(-1);
const biggest2 = [...census].sort((a, b) => b.census2 - a.census2)[0];
const smallest2 = [...census].sort((a, b) => a.census2 - b.census2)[0];
const tribeOf = [...sons, ...jsons].filter((r) => r.tribeOfKjv).sort((a, b) => b.tribeOfKjv - a.tribeOfKjv);
const pc = (n) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const mother = (m) => sons.filter((r) => r.mother === m).map((r) => r.name);
const rank2 = (name) => [...census].sort((a, b) => b.census2 - a.census2).findIndex((r) => r.name === name) + 1;
const ordinal = (n) => ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"][n];
const meaningOf = (slug) => getMeaning(slug)?.main.meaning || null;

const TITLE = "The 12 Tribes of Israel: Names, Mothers, Census Counts";
const ANSWER = `The twelve tribes of Israel are named for the twelve sons of Jacob: Reuben, Simeon, Levi, Judah, Dan, Naphtali, Gad, Asher, Issachar, Zebulun, Joseph and Benjamin (Genesis 35:22-26). Four mothers bore them: Leah six sons, Rachel two, Bilhah two and Zilpah two. The lists of tribes later in the Bible change the names: Joseph's place is taken by his sons Ephraim and Manasseh, and Levi gets no land.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 12 tribes of Israel: each son's mother, birth verse and meaning, and the two censuses in Numbers (${fmt(S.total1)} men, then ${fmt(S.total2)}). Simeon fell ${Math.abs(lowest.pct).toFixed(0)}%.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 12 tribes of Israel?", a: ANSWER },
  { q: "How many tribes of Israel are there?", a: `Twelve, if you count by Jacob's sons (Genesis 35:22). The tribe lists in the Bible use ${S.tribeNames} different names, though. Joseph's two sons Ephraim and Manasseh are each counted as a tribe (Joshua 14:4: "the children of Joseph were two tribes"). Levi is sometimes left out because the Levites received no land (Joshua 13:14).` },
  { q: "Which tribe was the largest?", a: `Judah, in both counts: ${fmt(census.find((r) => r.name === "Judah").census1)} men in Numbers 1 and ${fmt(census.find((r) => r.name === "Judah").census2)} in Numbers 26. The smallest was Manasseh in the first census (${fmt(census.find((r) => r.name === "Manasseh").census1)}) and Simeon in the second (${fmt(census.find((r) => r.name === "Simeon").census2)}).` },
  { q: "Why is Dan missing from Revelation 7?", a: `Revelation 7:5-8 seals twelve thousand from each of twelve tribes and leaves out ${joinList(S.revMissing)}. It lists Joseph and Manasseh in their place and Levi, who is absent from the censuses. The chapter gives no reason for the changes.` },
  { q: "What happened to the ten lost tribes?", a: `The Bible text has no "lost tribes". The King James Version never uses the phrase and "ten tribes" appears ${S.tenTribes.kjv.total} times, both in 1 Kings 11, where God promises Jeroboam ten tribes. After the kingdom split, 1 Kings 12:20 says only the tribe of Judah followed David's house, with Benjamin joining in verse 21. 2 Kings 17:6 says the king of Assyria took Samaria and carried Israel away, and 2 Kings 17:18 says "there was none left but the tribe of Judah only".` },
  { q: "Who were the mothers of the twelve tribes?", a: `Leah bore ${joinList(mother("Leah"))}; Rachel bore ${joinList(mother("Rachel"))}; Bilhah, Rachel's servant, bore ${joinList(mother("Bilhah"))}; and Zilpah, Leah's servant, bore ${joinList(mother("Zilpah"))} (Genesis 35:23-26).` },
];

export default function TwelveTribes() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The twelve tribes of Israel", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The 12 tribes of Israel: names, mothers and census counts", description: ANSWER, url: URL, datePublished: LISTS_DATE, dateModified: LISTS_DATE }),
    generateFAQSchema(faqs)
  );
  const nameLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className="underline underline-offset-2 hover:text-primary">{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The twelve tribes of Israel" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The 12 tribes of Israel</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Every census figure below is read out of the King James Version verse that gives it and matches the World English Bible. Name meanings are from {NAMES_SOURCE}.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Men counted, Numbers 1", value: fmt(S.total1), note: "age 20 and up, Levi not included" },
                { label: "Men counted, Numbers 26", value: fmt(S.total2), note: `${fmt(Math.abs(S.change))} fewer, ${S.changePct}%` },
                { label: `${lowest.name}, first to second count`, value: pc(lowest.pct), note: `${fmt(lowest.census1)} to ${fmt(lowest.census2)}` },
                { label: `${highest.name}, first to second count`, value: pc(highest.pct), note: `${fmt(highest.census1)} to ${fmt(highest.census2)}` },
              ]}
            />
          </div>
        </section>

        <Section id="sons" title="The twelve sons of Jacob, in birth order" intro="Genesis 29 and 30 record the births, and Genesis 35:22-26 lists all twelve with their mothers. Each row names the verse where the son is born.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Tribe</th>
                  <th className="p-3 font-semibold">Mother</th>
                  <th className="p-3 font-semibold">Born</th>
                  <th className="p-3 font-semibold">Name means</th>
                  <th className="p-3 font-semibold">Jacob's blessing</th>
                </tr>
              </thead>
              <tbody>
                {sons.map((r, i) => (
                  <tr key={r.slug} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{i + 1}</td>
                    <td className="p-3 font-medium">{nameLink(r.slug, r.name)}</td>
                    <td className="p-3">{r.mother}</td>
                    <td className="p-3 whitespace-nowrap">{r.birth}</td>
                    <td className="p-3 text-muted-foreground">{meaningOf(r.slug) || ""}</td>
                    <td className="p-3 whitespace-nowrap">{r.blessing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Meanings are the traditional ones from {NAMES_SOURCE} (1869, public domain); modern scholars often read names differently. Simeon and Levi share one blessing in Genesis 49:5-7. Ephraim and Manasseh, Joseph's sons, are born in Genesis 41:50-52, and Genesis 48:5 has Jacob take them as his own.
          </p>
        </Section>

        <Section id="census" title="The two censuses: how each tribe changed" intro={`Numbers 1 counts the men able to go to war in the second year after the exodus, and Numbers 26 counts them again near the end of the wilderness years. ${lowest.name} lost the most and ${highest.name} gained the most.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Tribe</th>
                  <th className="p-3 font-semibold text-right">Numbers 1</th>
                  <th className="p-3 font-semibold text-right">Numbers 26</th>
                  <th className="p-3 font-semibold text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                {census.map((r) => (
                  <tr key={r.slug} className="border-b last:border-0">
                    <td className="p-3 font-medium">{nameLink(r.slug, r.name)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.census1)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.census2)}</td>
                    <td className="p-3 text-right tabular-nums">{pc(r.pct)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right tabular-nums">{fmt(S.total1)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(S.total2)}</td>
                  <td className="p-3 text-right tabular-nums">{pc(S.changePct)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The twelve figures in each census add up to the total the verse gives (Numbers 1:46 and 26:51), which is how this table was checked. Joseph appears as his two sons Ephraim and Manasseh. The Levites were counted apart: {fmt(T.levites.num3)} males a month old and up in Numbers 3:39 and {fmt(T.levites.num26)} in Numbers 26:62, because "there was no inheritance given them among the children of Israel".
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">Men counted in Numbers 26, by tribe</h3>
            <BarRows rows={[...census].sort((a, b) => b.census2 - a.census2).map((r) => ({ label: r.name, value: r.census2 }))} labelWidth="w-28" />
          </div>
          <p className="mt-5 leading-relaxed">
            Judah was the largest tribe both times. {smallest2.name} was the smallest in the second count at {fmt(smallest2.census2)}, and the biggest drop of any tribe was {lowest.name}'s, from {fmt(lowest.census1)} to {fmt(lowest.census2)}. {highest.name} grew from {fmt(highest.census1)} to {fmt(highest.census2)}, which moved it from the smallest tribe in Numbers 1 to the {ordinal(rank2(highest.name))} largest in Numbers 26. The total moved only {fmt(Math.abs(S.change))} men, so the tribes traded places, not size.
          </p>
        </Section>

        <Section id="lists" title="Why the tribe lists in the Bible do not match">
          <p className="leading-relaxed mb-4">
            Three lists give three different twelves. Genesis 35:22-26 names the twelve sons. The census in Numbers 1 leaves out Levi and names Ephraim and Manasseh in place of Joseph. Revelation 7:5-8 seals twelve thousand from each of twelve tribes, in this order: {joinList(S.revList)}. It leaves out {joinList(S.revMissing)}. In all, {S.tribeNames} different names appear across the lists.
          </p>
          <p className="leading-relaxed">
            Joshua 14:4 explains the first change: "the children of Joseph were two tribes, Manasseh and Ephraim", and Joshua 13:14 explains the second: "unto the tribe of Levi he gave none inheritance". Revelation 7 does not say why Dan and Ephraim are absent. The King James Version also spells five names differently there: Juda, Aser, Nepthalim, Manasses and Zabulon.
          </p>
          <div className="mt-6">
            <h3 className="font-semibold mb-3">How often the Bible says "tribe of" each name (KJV)</h3>
            <BarRows rows={tribeOf.map((r) => ({ label: r.name, value: r.tribeOfKjv }))} labelWidth="w-28" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Counts of "tribe of", "tribes of" and "tribe of the children of" followed by the name. {tribeOf[0].name} leads with {tribeOf[0].tribeOfKjv}.
            </p>
          </div>
        </Section>

        <Section id="limits" title="What the censuses do and do not show">
          <p className="leading-relaxed">Each census counts men of fighting age, so the figures say little about women, children or the Levites, who were counted apart. The Bible gives no reason for most of the changes between the two counts, and nothing on this page claims one. Numbers 1:1 dates the first count to the second month of the second year after the exodus. Numbers 26:1 places the second "after the plague" in the plains of Moab, so the years between them are not stated.</p>
        </Section>

        <FaqSection title="Questions about the twelve tribes" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse and figure on this page, read by scripts/build-bible-lists.mjs from the text at github.com/seven1m/open-bibles (read and counted {LISTS_DATE}).</li>
            <li>{NAMES_SOURCE}, public domain: the traditional meaning of each name (read {LISTS_DATE}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Every tribe name has a count page, such as {nameLink("judah", "Judah")}, {nameLink("benjamin", "Benjamin")} and {nameLink("levi", "Levi")}. See <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">Bible names and their meanings</Link>, <Link href="/ten-plagues-of-egypt" className="underline underline-offset-2 hover:text-primary">the ten plagues of Egypt</Link>, <Link href="/books/numbers" className="underline underline-offset-2 hover:text-primary">the book of Numbers</Link>, and <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={LISTS_DATE} />
        </Section>
      </div>
    </>
  );
}
