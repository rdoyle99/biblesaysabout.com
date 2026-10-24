import { OG_VIDEOS } from "@/lib/og-video";
/* Parables of Jesus: one row per story or extended comparison in Matthew, Mark and Luke, every Gospel reference,
   KJV word counts, and the words "parable" and "parables" by book. Counted by scripts/lists/parables-of-jesus.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/parables-of-jesus.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/parables-of-jesus`;
const rows = DATA.rows;
const T = DATA.totals;
const L = DATA.longest;
const W = DATA.word;
const second = DATA.top10[1];
const john = DATA.wordBooks.find((b) => b.book === "John");
const GOSPELS = ["Matthew", "Mark", "Luke"];
const ch13 = rows.filter((r) => r.refs.Matthew?.some((x) => x.ref.startsWith("Matthew 13:"))).length;
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const join = (a) => (a.length < 3 ? a.join(" and ") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const short = (ref) => ref.replace(/^\S+ /, "");
const halves = (a) => [a.slice(0, Math.ceil(a.length / 2)), a.slice(Math.ceil(a.length / 2))].map((h) => join(h.map(lower)));
const lnk = "underline underline-offset-2 hover:text-primary";

const TITLE = `Parables of Jesus: ${T.count} Parables Listed by Gospel`;
const ANSWER = `This page lists ${T.count} parables of Jesus from Matthew, Mark and Luke. Luke has ${T.byGospel.Luke} of them, Matthew ${T.byGospel.Matthew} and Mark ${T.byGospel.Mark}. ${T.allThree.length} are told in all three Gospels and ${T.onlyLuke.length} only in Luke. The longest is ${lower(L.name)}, ${L.words} words in the King James Version (${L.ref}).`;

export const metadata = {
  title: { absolute: TITLE },
  description: `A table of ${T.count} parables of Jesus in Matthew, Mark and Luke, with every reference, KJV word counts, and the ${T.allThree.length} told in all three Gospels.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many parables did Jesus tell?", a: `No verse numbers them, so the total depends on the rule a list uses. This page counts ${T.count} in Matthew, Mark and Luke, using one rule: a story or extended comparison Jesus tells. Shorter sayings, such as the blind leading the blind, are listed separately and left out of the total.` },
  { q: "What is the longest parable of Jesus?", a: `${L.name}, ${L.ref}, at ${L.words} words in the King James Version. ${second.name} comes next at ${second.words} words (${second.ref}).` },
  { q: "Which parables are in all three Gospels?", a: `${T.allThree.length} of the ${T.count}: ${join(T.allThree.map(lower))}. They are told in Matthew, Mark and Luke.` },
  { q: "Are there parables in the Gospel of John?", a: `John uses the word only at John 10:6 (${john.kjv} in the King James Version, ${john.web} in the World English Bible). Both call the sheepfold saying in John 10:1-5 "this parable". This table covers Matthew, Mark and Luke only.` },
  { q: "Why did Jesus speak in parables?", a: `He answers the question in Matthew 13:13 (KJV): "Therefore speak I to them in parables: because they seeing see not; and hearing they hear not, neither do they understand." Mark 4:11-12 and Luke 8:10 give a similar answer.` },
];

export default function ParablesOfJesus() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Parables of Jesus", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Parables of Jesus: the list by Gospel, with verses and word counts", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={lnk}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Parables of Jesus" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Parables of Jesus</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. References and word counts are from the King James Version; the World English Bible is compared where it differs. A word count is every word in the passage, counted once per occurrence.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Parables in this list", value: T.count, note: "Matthew, Mark and Luke" },
                { label: "In all three Gospels", value: T.allThree.length, note: `${T.allThree[0]}, ${lower(T.allThree[1])} and more` },
                { label: "Only in Luke", value: T.onlyLuke.length, note: `of Luke's ${T.byGospel.Luke}` },
                { label: `"Parable" in the KJV`, value: W.kjv.total, note: `${W.kjvNT.total} in the New Testament` },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="The parables of Jesus, Gospel by Gospel" intro={`The table lists ${T.count} parables with every reference in Matthew, Mark and Luke. Words are the King James count for the longest telling, which is the reference shown in bold.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Parable</th>
                  {GOSPELS.map((g) => <th key={g} className="p-3 font-semibold">{g}</th>)}
                  <th className="p-3 font-semibold text-right">KJV words</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3">
                      <span className="font-medium">{r.name}</span>
                      {r.label ? <span className="block text-xs text-muted-foreground">called a parable in {r.label}</span> : null}
                    </td>
                    {GOSPELS.map((g) => (
                      <td key={g} className="p-3 whitespace-nowrap tabular-nums">
                        {(r.refs[g] || []).map((x) => <span key={x.ref} className={`block ${x.ref === r.main.ref ? "font-semibold" : ""}`}>{short(x.ref)} </span>)}
                        {r.refs[g] ? null : <span className="text-muted-foreground">-</span>}
                      </td>
                    ))}
                    <td className="p-3 text-right tabular-nums">{r.main.words}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Each reference runs from the verse where the story starts to its last line. Some end with a closing comment, as Matthew 20:16 does, and some stop before one, as Luke 16:8 does. A verse that only introduces the story is left out, and so are the explanations of the sower and the tares given later in Matthew 13. The Gospels call {T.labeled} of the {T.count} a parable in a verse at the start of the story or soon after it; that verse is shown under the name. The World English Bible names some differently: its Matthew 13:3 has "a farmer", and Matthew 13:36 calls the tares "darnel weeds".
          </p>
        </Section>

        <Section id="gospels" title="How many parables are in each Gospel?" intro={`Luke has the most, ${T.byGospel.Luke} of the ${T.count}. Matthew has ${T.byGospel.Matthew} and Mark ${T.byGospel.Mark}. A parable told in two or three Gospels counts once in each.`} muted>
          <BarRows rows={GOSPELS.map((g) => ({ label: g, value: T.byGospel[g], href: `/books/${g.toLowerCase()}` }))} labelWidth="w-24" />
          <p className="mt-5 leading-relaxed">
            {T.onlyLuke.length} are found only in Luke: {halves(T.onlyLuke)[0]}. The others only in Luke are {halves(T.onlyLuke)[1]}.
          </p>
          <p className="mt-3 leading-relaxed">
            {T.onlyMatthew.length} are found only in Matthew: {halves(T.onlyMatthew)[0]}. The others only in Matthew are {halves(T.onlyMatthew)[1]}. {ch13} of Matthew's {T.byGospel.Matthew} are in chapter 13. Mark has {T.onlyMark.length} of its own: {join(T.onlyMark.map(lower))}.
          </p>
        </Section>

        <Section id="longest" title="Which parable is the longest?" intro={`${L.name} is the longest, at ${L.words} King James words in ${L.ref}. These are the ten longest tellings.`}>
          <BarRows rows={DATA.top10.map((r) => ({ label: r.name, value: r.words }))} labelWidth="w-44" />
          <p className="mt-5 leading-relaxed">At the other end is {lower(DATA.shortest.name)}: even its longer telling, {DATA.shortest.ref}, has {DATA.shortest.words} words. The longest telling of each of the {T.count} parables adds up to {fmt(T.mainWords)} words.</p>
        </Section>

        <Section id="word" title={`How often does the Bible say "parable"?`} intro={`The King James Version uses "parable" or "parables" ${W.kjv.total} times, ${W.kjvNT.total} of them in the New Testament. The World English Bible has ${W.web.total}.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr><th className="p-3 font-semibold">Book</th><th className="p-3 font-semibold text-right">KJV</th><th className="p-3 font-semibold text-right">WEB</th></tr>
              </thead>
              <tbody>
                {DATA.wordBooks.map((b) => (
                  <tr key={b.book} className="border-b last:border-0"><td className="p-3">{b.book}</td><td className="p-3 text-right tabular-nums">{b.kjv}</td><td className="p-3 text-right tabular-nums">{b.web}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            John has the word {john.kjv} time in the KJV and {john.web} in the WEB, both at John 10:6, about the sheepfold saying of John 10:1-5. The KJV of John 10:6 reads "{DATA.john10_6.kjv}" The WEB reads "{DATA.john10_6.web}" Elsewhere John's Gospel says "proverbs" in the KJV and "figures of speech" in the WEB (John 16:25). Mark 4:30 asks "with what comparison" in the KJV and "with what parable" in the WEB. {wordLink("parable", "The parable word page")} counts the forms in more detail.
          </p>
        </Section>

        <Section id="why" title="Why Jesus spoke in parables">
          <p className="leading-relaxed mb-4">Jesus says the disciples are given to know the mysteries of the kingdom, and the others hear parables, because "they seeing see not" (Matthew 13:11-13). He says it when the disciples ask him, in Matthew 13, Mark 4 and Luke 8.</p>
          {DATA.why.map((w) => (
            <blockquote key={w.ref} className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4 mb-3">
              <p className="leading-relaxed">{w.kjv}</p>
              <footer className="mt-2 text-sm text-muted-foreground">{w.ref} (KJV)</footer>
            </blockquote>
          ))}
          <p className="mt-4 leading-relaxed">Matthew 13:34 adds that "without a parable spake he not unto them", and Matthew 13:35 gives the prophet's words "I will open my mouth in parables". Psalm 78:2 reads "I will open my mouth in a parable". Mark 4:34 says that when they were alone, "he expounded all things to his disciples."</p>
        </Section>

        <Section id="rule" title="How this page decided what counts as a parable" muted>
          <p className="leading-relaxed">This page counts a story or extended comparison Jesus tells in Matthew, Mark or Luke. No verse numbers the parables, so the total depends on which stories a list counts. It keeps three short ones, the lamp, the new cloth and the new wine, because each is told in all three Gospels. It includes the sheep and the goats, whose comparison is in Matthew 25:32: "as a shepherd divideth his sheep from the goats". These shorter sayings are left out:</p>
          <ul className="mt-3 list-disc pl-5 space-y-1.5 leading-relaxed">
            {DATA.leftOut.map((x) => <li key={x.name}><span className="font-medium">{x.name}</span> ({x.refs.join(", ")}): {x.why}.</li>)}
          </ul>
        </Section>

        <Section id="limits" title="What these counts leave out">
          <p className="leading-relaxed">The counts measure the English text, not the meaning. A different rule for what counts as a parable gives a different total, and a different start or end verse changes a word count. Similar stories are kept as separate rows: the great supper (Luke 14) and the marriage feast (Matthew 22), and the pounds (Luke 19) and the talents (Matthew 25). The table leaves out John and the Old Testament books that use the word.</p>
        </Section>

        <FaqSection title="Questions about the parables of Jesus" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/parables-of-jesus.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read the <Link href="/miracles-of-jesus" className={lnk}>miracles of Jesus</Link> and the <Link href="/names-of-jesus" className={lnk}>names of Jesus</Link>. See how long <Link href="/books/matthew" className={lnk}>Matthew</Link>, <Link href="/books/mark" className={lnk}>Mark</Link> and <Link href="/books/luke" className={lnk}>Luke</Link> are, or count {wordLink("parable", "the word parable")}. More counts are on <Link href="/bible-by-the-numbers" className={lnk}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
