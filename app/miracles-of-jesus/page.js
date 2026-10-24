import { OG_VIDEOS } from "@/lib/og-video";
/* Miracles of Jesus: one row per miracle story in the four Gospels, every reference checked against the KJV, with
   counts of "miracle", "sign" and "healed" in the KJV and WEB Gospels. Counted by scripts/lists/miracles-of-jesus.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/miracles-of-jesus.json";
import { getWord, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/miracles-of-jesus`;
const G = DATA.gospels;
const rows = DATA.rows;
const W = DATA.words;
const T = DATA.perType;
const refsOf = (r) => G.flatMap((g) => r.refs[g] || []).join("; ");
const row = (name) => rows.find((r) => r.name === name);
const num = (n) => ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n] ?? String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const allFour = DATA.inAllFour.map(lc).join(", ");
const five = row("The feeding of the five thousand");
const raised = rows.filter((r) => r.type === "raising the dead");
const byGospel = [...G].sort((a, b) => DATA.perGospel[b] - DATA.perGospel[a]);
const most = byGospel.filter((g) => DATA.perGospel[g] === DATA.perGospel[byGospel[0]]);
const fewest = byGospel[byGospel.length - 1];
const bigType = [...DATA.types].sort((a, b) => T[b] - T[a])[0];
const only = G.map((g) => `${g} ${DATA.onlyIn[g].length}`).join(", ");
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = `Miracles of Jesus: ${DATA.total} Gospel Stories, With Every Verse`;
const ANSWER = `The four Gospels tell ${DATA.total} separate miracle stories of Jesus by this page's count: ${T.healing} healings, ${T["casting out a demon"]} stories of casting out demons, ${T["raising the dead"]} raisings of the dead and ${T["over nature"]} miracles over nature. Only ${num(DATA.inAllFour.length)} is in all four Gospels: ${allFour}. Another ${DATA.inOneCount} appear in only one Gospel. No verse gives a total.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `A table of the ${DATA.total} miracles of Jesus in Matthew, Mark, Luke and John, with every verse, the type of each and which Gospels tell it.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many miracles did Jesus perform?", a: `The Gospels do not give a number. John 20:30 says Jesus did "many other signs" that "are not written in this book". Counting each story once, this page finds ${DATA.total} miracle stories across the four Gospels.` },
  { q: "What was Jesus' first miracle?", a: `John says it was water turned into wine at a wedding in Cana: "This beginning of miracles did Jesus in Cana of Galilee" (John 2:11, KJV). Only John tells this story.` },
  { q: "Which miracle is in all four Gospels?", a: `Only ${num(DATA.inAllFour.length)}: ${allFour}. It is at ${refsOf(five)}. Every other story in the table is in three Gospels or fewer.` },
  { q: "Who did Jesus raise from the dead?", a: `The Gospels tell ${num(raised.length)} stories: the widow's son at Nain (${refsOf(row("The widow's son raised at Nain"))}), Jairus' daughter (${refsOf(row("Jairus' daughter raised"))}) and Lazarus (${refsOf(row("Lazarus raised"))}).` },
  { q: "Why does the World English Bible say signs instead of miracles?", a: `It uses "sign" where the King James Version has "miracle", as in John 2:11, 4:54 and 6:14. "Miracle" or "miracles" is in John ${W.miracleKjv.byBook.John} times in the King James Version and ${W.miracleWeb.byBook.John} times in the World English Bible. "Sign" or "signs" is in John ${W.signKjv.byBook.John} times in the KJV and ${W.signWeb.byBook.John} in the WEB.` },
];

export default function MiraclesOfJesus() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Miracles of Jesus", url: URL },
    ]),
    generateDataArticleSchema({ headline: `Miracles of Jesus: ${DATA.total} Gospel stories, with every verse`, description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Miracles of Jesus" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Miracles of Jesus</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Every reference is checked against the King James Version, and word counts are from the King James Version and the World English Bible. A story told in more than one Gospel is one row, and a word count counts every form named.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Miracle stories", value: DATA.total, note: "rows in the table below" },
                { label: "In all four Gospels", value: DATA.inAllFour.length, note: allFour },
                { label: "In one Gospel only", value: DATA.inOneCount, note: only },
                { label: `"Healed" in the Gospels (KJV)`, value: W.healedKjv.total, note: `${W.healedKjv.byBook.Luke} of them in Luke` },
              ]}
            />
          </div>
        </section>

        <Section id="table" title="Every miracle of Jesus, with its verses" intro={`The table lists ${DATA.total} stories, each with every Gospel passage that tells it. Rows run in a rough order of events. That order is a judgment, because the Gospels do not always agree on it.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Miracle</th>
                  <th className="p-3 font-semibold">Type</th>
                  <th className="p-3 font-semibold">Verses</th>
                  <th className="p-3 font-semibold text-right">Gospels</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-muted-foreground">{r.type}</td>
                    <td className="p-3">{G.flatMap((g) => r.refs[g] || []).map((ref) => <span key={ref} className="block whitespace-nowrap">{ref} </span>)}</td>
                    <td className="p-3 text-right tabular-nums">{r.gospels.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="rule" title="What counts as a miracle on this list" muted>
          <p className="leading-relaxed">A row is one event the Gospels narrate in which Jesus himself does something beyond nature to a person or a thing. No verse numbers the miracles, so the list is a judgment. Summary verses are not counted as separate miracles, such as Matthew 4:24, "and he healed them", or Mark 1:34, "he healed many that were sick".</p>
          <p className="mt-3 leading-relaxed">The transfiguration (Matthew 17:2, "transfigured before them") and the resurrection (Matthew 28:6, "he is risen") are left out. Both happen to Jesus rather than being done by him, and this list counts what Jesus does. The coin in the fish's mouth is kept, though Matthew 17:27 gives only Jesus' word to Peter, "thou shalt find a piece of money", and does not tell the finding.</p>
          <p className="mt-3 leading-relaxed">Each row gets one type, by the first rule that fits. If the person was dead, it is raising the dead. If a devil or unclean spirit is cast out, it is casting out a demon, even when speech or sight returns too. If a sickness or injury is cured, it is a healing. Anything else is over nature.</p>
        </Section>

        <Section id="by-gospel" title="How many miracles are in each Gospel?" intro={`${most.join(" and ")} ${most.length > 1 ? "tie for" : "tells"} the most in this table, ${DATA.perGospel[most[0]]}${most.length > 1 ? " each" : ""}, and ${fewest} the fewest, ${DATA.perGospel[fewest]}.`}>
          <BarRows rows={byGospel.map((g) => ({ label: g, value: DATA.perGospel[g], href: `/books/${g.toLowerCase()}` }))} labelWidth="w-24" />
          <p className="mt-5 leading-relaxed">
            {DATA.byGospelCount[1]} stories are in one Gospel only, {DATA.byGospelCount[2]} are in two, {DATA.byGospelCount[3]} are in three and {DATA.byGospelCount[4]} is in all four. Counted by the Gospel that alone tells them: {only}. Of John's {DATA.perGospel.John}, {DATA.onlyIn.John.length} appear in no other Gospel.
          </p>
        </Section>

        <Section id="by-type" title="Healings, demons, the dead and nature" intro={`${cap(bigType)} is the largest group by this page's type rule, ${T[bigType]} of the ${DATA.total} rows.`} muted>
          <BarRows rows={DATA.types.map((t) => ({ label: cap(t), value: T[t] }))} labelWidth="w-44" />
          <p className="mt-5 leading-relaxed">The {num(raised.length)} raisings are the widow's son at Nain, Jairus' daughter and {wordLink("lazarus", "Lazarus")}. The over-nature group includes the storm, both feedings, the two catches of fish and the fig tree. The catch of 153 fish in John 21 comes after Jesus "was risen from the dead" (John 21:14).</p>
        </Section>

        <Section id="words" title="Does the Bible call them miracles or signs?" intro={`The King James Version says "miracle" or "miracles" ${W.miracleKjv.total} times in the Gospels; the World English Bible says it ${W.miracleWeb.total} time${W.miracleWeb.total === 1 ? "" : "s"}, in ${W.miracleRefsWeb.join(", ")}.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>{["Gospel", "miracle(s) KJV", "miracle(s) WEB", "sign(s) KJV", "sign(s) WEB", "healed KJV"].map((h) => <th key={h} className="p-3 font-semibold text-right first:text-left">{h}</th>)}</tr>
              </thead>
              <tbody>
                {G.map((g) => (
                  <tr key={g} className="border-b last:border-0">
                    <td className="p-3 font-medium">{g}</td>
                    {[W.miracleKjv, W.miracleWeb, W.signKjv, W.signWeb, W.healedKjv].map((c, i) => <td key={i} className="p-3 text-right tabular-nums">{c.byBook[g]}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">John numbers two of the miracles. John 2:11 in the KJV reads "{DATA.johnSigns.first.kjv}" The WEB has "{DATA.johnSigns.first.web}" John 4:54 calls the healing of the nobleman's son "the second miracle" in the KJV and "the second sign" in the WEB. No other miracle in John is numbered. John 21:14 calls the appearance at the catch of fish "the third time that Jesus shewed himself to his disciples", which counts his appearances after he rose.</p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Counts are whole words: "miracle" and "miracles" together, "sign" and "signs" together, and the single form "healed". Not every "sign" is a miracle of Jesus. In Matthew 12:38 the Pharisees ask for a sign, and in Matthew 26:48 Judas "gave them a sign". In the whole Bible, "miracle" or "miracles" is in the KJV {W.miracleKjvBible} times and the WEB {W.miracleWebBible}.</p>
        </Section>

        <Section id="limits" title="What these counts leave out" muted>
          <p className="leading-relaxed">The total depends on how parallel stories are joined. Matthew has two men among the Gergesenes (Matthew 8:28) and two blind men at Jericho (Matthew 20:30), where Mark and Luke have one; each is one row here. Luke 11:14 is paired with Matthew 12:22 because both are followed by the charge of casting out devils by Beelzebub.</p>
          <p className="mt-3 leading-relaxed">The servant's ear is cut off in all four Gospels (Matthew 26:51, Mark 14:47, Luke 22:50, John 18:10), but only Luke 22:51 says Jesus "healed him", so only Luke is listed. John is the one who names the servant Malchus. Miracles done by the disciples, as in Luke 10:17, or in Acts are not counted.</p>
        </Section>

        <FaqSection title="Questions about the miracles of Jesus" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/miracles-of-jesus.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Jesus' stories are counted on <Link href="/parables-of-jesus" className={link}>the parables of Jesus</Link>, and his titles on <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>. Read about{" "}
            <Link href="/books/john" className={link}>the Gospel of John</Link> and <Link href="/books/mark" className={link}>the Gospel of Mark</Link>, or the word counts for {wordLink("miracle", "miracle")} and {wordLink("healing", "healing")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
