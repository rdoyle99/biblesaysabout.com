import { OG_VIDEOS } from "@/lib/og-video";
/* Women of the Bible: 45 named women, who each one is, the first verse that names her and how often the KJV names
   her, with the rules for shared names. Counted by scripts/lists/women-of-the-bible.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/women-of-the-bible.json";
import { joinList } from "@/lib/bibleLists";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/women-of-the-bible`;
const rows = DATA.rows;
const N = rows.length;
const byKey = Object.fromEntries(rows.map((r) => [r.key, r]));
const byCount = [...rows].sort((a, b) => b.count.total - a.count.total);
const [first, second, third] = byCount;
const sarah = byKey.sarah.count.bySpelling;
const esther = byKey.esther.count.bySpelling;
const { split, woman: W, books, eve, marys } = DATA;
const [ruth, est] = books;
const shared = DATA.shared;
const wordDiffs = rows.filter((r) => r.wordPage && (r.wordPage.diff.length || r.count.total !== r.wordPage.total));
const mary = (k) => byKey[k].count.total;
const spells = (r) => r.spellings.map((s) => `${s} ${r.count.bySpelling[s]}`).join(", ");
const where = (r) => Object.entries(r.spellingRefs).map(([s, refs]) => `${s}: ${refs.join(", ")}`).join("; ");
const firstIn = (b) => rows.filter((r) => r.count.first.startsWith(b + " ")).length;
const maryRows = rows.filter((r) => r.key.startsWith("mary-")).length;
const rahabOther = byKey.rahab.also.map((a) => a.ref);
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = `Women of the Bible: ${N} Women, Verses and Name Counts`;
const ANSWER = `This page lists ${N} women of the Bible by name: ${split.firstOT} first named in the Old Testament and ${split.firstNT} in the New. They include Eve, Sarah, Rebekah, Rachel, Miriam, Deborah, Ruth, Hannah, Esther, Mary the mother of Jesus and Mary Magdalene. Of these women, the King James Version names Sarah most, ${first.count.total} times, counting her first name Sarai.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `${N} women of the Bible with who each was, the first verse that names her and her KJV count. Sarah is named ${first.count.total} times, Esther ${second.count.total}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many women are in the Bible?", a: `This page lists ${N} named women, ${split.firstOT} from the Old Testament and ${split.firstNT} from the New. It does not give a total for every woman the Bible names, because many names belong to more than one person. In ${shared.length} rows the name also belongs to another person, place or thing.` },
  { q: "Who is the most mentioned woman in the Bible?", a: `Sarah, of the ${N} women on this page. The King James Version names her ${first.count.total} times: Sarai ${sarah.Sarai}, Sarah ${sarah.Sarah} and Sara ${sarah.Sara}. ${second.name.split(" (")[0]} is next with ${second.count.total}, then ${third.name} with ${third.count.total}. The name Mary appears ${marys.total} times, but it belongs to several women.` },
  { q: "Which books of the Bible are named after women?", a: `There are ${books.length}: Ruth and Esther. Ruth has ${ruth.chapters} chapters and ${fmt(ruth.kjvWords)} words in the King James Version. Esther has ${est.chapters} chapters and ${fmt(est.kjvWords)} words.` },
  { q: `How many times does the Bible say "woman"?`, a: `The King James Version says "woman" ${W.kjv.woman.total} times and "women" ${W.kjv.women.total} times, counting the possessive forms. The World English Bible has "woman" ${W.web.woman.total} times and "women" ${W.web.women.total} times.` },
  { q: "How many Marys are in the Bible?", a: `The King James Version uses the name Mary ${marys.total} times. By this page's rules, ${mary("mary-mother")} name the mother of Jesus, ${mary("mary-magdalene")} name Mary Magdalene and ${mary("mary-bethany")} name Mary of Bethany. Other verses name Mary ${joinList(marys.others.map((m) => `${m.desc} (${m.ref})`))}.` },
  { q: "Is Eve mentioned in the New Testament?", a: `Yes, ${byKey.eve.count.nt} times. The KJV names Eve ${eve.total} times: ${joinList(eve.refs)}. The word "eve" never appears in it as an ordinary word.` },
];

export default function WomenOfTheBible() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Women of the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: TITLE, description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (slug && getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Women of the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Women of the Bible</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Name counts are from the King James Version. The World English Bible is added for the counts of "woman" and "women", the book word counts and one quotation. A name is counted as a whole word, with or without a possessive. Where a name is shared, only her verses are counted, by the rule in her row.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Women in this table", value: N, note: `${split.firstOT} Old Testament, ${split.firstNT} New` },
                { label: "Times Sarah is named (KJV)", value: first.count.total, note: `Sarai ${sarah.Sarai}, Sarah ${sarah.Sarah}, Sara ${sarah.Sara}` },
                { label: `Times "woman" appears (KJV)`, value: W.kjv.woman.total, note: `"women" ${W.kjv.women.total} more` },
                { label: "Books named for a woman", value: books.length, note: `Ruth ${ruth.chapters} chapters, Esther ${est.chapters}` },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="The women, in the order the Bible names them" intro={`The table lists ${N} women in the order the King James Version first names each one. Each line in the "Who she is" column is backed by the verse beside it.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Woman</th>
                  <th className="p-3 font-semibold">Who she is</th>
                  <th className="p-3 font-semibold">First named</th>
                  <th className="p-3 font-semibold text-right">KJV count</th>
                  <th className="p-3 font-semibold">Named most in</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium">{wordLink(r.wordPage?.slug, r.name)}</td>
                    <td className="p-3">
                      {r.who.text} <span className="text-muted-foreground whitespace-nowrap">({r.who.ref})</span>
                      {" "}{r.also.length ? <span className="block mt-1 text-xs text-muted-foreground">The name also names: {r.also.map((a) => `${a.desc} (${a.ref})`).join("; ")}.</span> : null}
                    </td>
                    <td className="p-3 whitespace-nowrap">{r.count.first}</td>
                    <td className="p-3 text-right tabular-nums">
                      {r.count.total}
                      {" "}{r.spellings.length > 1 ? <span className="block text-xs text-muted-foreground">{spells(r)}</span> : null}
                      {" "}{r.rule ? <span className="block text-xs text-muted-foreground">{r.rule}</span> : null}
                    </td>
                    <td className="p-3">{r.count.top.tied.join(", ")} <span className="text-muted-foreground">({r.count.top.count})</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Other spellings in the KJV: {rows.filter((r) => Object.keys(r.spellingRefs).length).map((r) => where(r)).join("; ")}. A name inside a hyphenated place name, such as Baal-tamar, is not counted.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">The /words pages count a name for everyone who bears it, in the forms listed there. Where this table differs:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground leading-relaxed">
            {wordDiffs.map((r) => (
              <li key={r.key}>
                {r.name}: {r.count.total} here, {r.wordPage.total} on <Link href={`/words/${r.wordPage.slug}`} className={link}>/words/{r.wordPage.slug}</Link>.
                {r.wordPage.diff.length ? ` This row adds ${r.wordPage.diff.map((d) => `${d.what} (${d.count})`).join(" and ")}.` : ""}
                {r.rule ? ` This row ${r.rule}.` : ""}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="most" title="Which woman does the Bible name most?" intro={`Of the women in this table, Sarah is named most: ${first.count.total} times in the King James Version, counting her first name Sarai.`} muted>
          <BarRows rows={byCount.slice(0, 15).map((r) => ({ label: r.key.startsWith("tamar") ? r.name : r.name.split(" (")[0], value: r.count.total }))} labelWidth="w-40" />
          <p className="mt-5 leading-relaxed">
            {byKey.sarah.count.top.count} of Sarah's {first.count.total} mentions are in {byKey.sarah.count.top.book}. Esther comes next with {second.count.total}: Esther {esther.Esther} and Hadassah {esther.Hadassah}, the other name Esther 2:7 gives her. {byKey.esther.count.top.count} of them are in the book of Esther. {third.name} is third with {third.count.total}. The name Mary appears {marys.total} times in all, but it belongs to several women, so the table gives it {maryRows} rows.
          </p>
        </Section>

        <Section id="shared" title="Names that belong to more than one person">
          <p className="mb-4 leading-relaxed">In {shared.length} rows the name also belongs to another person, place or thing, so those rows count only her verses. The rule for each is in the table. Deborah, for example, is first Rebekah's nurse in Genesis 35:8, and the count of {byKey.deborah.count.total} is of the judge in Judges.</p>
          <p className="mb-4 leading-relaxed">Rahab is the clearest case. In {joinList(rahabOther)} the KJV uses the name for something other than the woman of Jericho. The World English Bible makes it a name for Egypt in {DATA.rahabWeb.ref}: "{DATA.rahabWeb.text}"</p>
          <p className="leading-relaxed">Mary is split by passage. The mother of Jesus is counted in Matthew 1-2, Luke 1-2, Matthew 13:55, Mark 6:3 and Acts 1:14 ({mary("mary-mother")} times). Mary of Bethany is counted in Luke 10 and John 11-12 ({mary("mary-bethany")}). Mary Magdalene is counted by the word Magdalene ({mary("mary-magdalene")}). The KJV also names Mary {joinList(marys.others.map((m) => `${m.desc} (${m.ref})`))}.</p>
        </Section>

        <Section id="testaments" title="Old Testament and New Testament women" intro={`Of the ${N} women, ${split.firstOT} are first named in the Old Testament and ${split.firstNT} in the New.`} muted>
          <p className="leading-relaxed">{split.both.length} of them are named in both: {joinList(split.both)}. Eve, for one, is named {eve.total} times: {joinList(eve.refs)}. The word "eve" never appears in the KJV as an ordinary word.</p>
        </Section>

        <Section id="books" title="The two books named for women">
          <p className="leading-relaxed">{books.length} books of the Bible carry a woman's name: {wordLink("ruth", "Ruth")} and {wordLink("esther", "Esther")}. In the King James Version, <Link href="/books/ruth" className={link}>Ruth</Link> has {ruth.chapters} chapters, {ruth.verses} verses and {fmt(ruth.kjvWords)} words. <Link href="/books/esther" className={link}>Esther</Link> has {est.chapters} chapters, {est.verses} verses and {fmt(est.kjvWords)} words. The World English Bible has {fmt(ruth.webWords)} and {fmt(est.webWords)} words. Esther is also the book where the KJV says "women" most: {W.kjv.women.top.count} times.</p>
          <p className="mt-3 leading-relaxed">Across the Bible, the KJV says "woman" {W.kjv.woman.total} times, first in {W.kjv.woman.first}, and "women" {W.kjv.women.total} times. The World English Bible has {W.web.woman.total} and {W.web.women.total}. Both counts include the possessive forms.</p>
        </Section>

        <Section id="limits" title="What these counts leave out" muted>
          <p className="leading-relaxed">The table is a selection of named women, not every one. It leaves out other named women, such as {joinList(DATA.leftOut.map((u) => `${u.desc} (${u.ref})`))}. It also leaves out women the text never names: {joinList(DATA.unnamed.map((u) => `${u.desc} (${u.ref})`))}. Counts are of the name only, so "she" and "his wife" are not counted. Bath-shua in 1 Chronicles 3:5 is not added to Bathsheba's count. The rules for shared names are this page's judgment, and a different rule would give different counts.</p>
        </Section>

        <FaqSection title="Questions about the women of the Bible" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse cited and every count on this page, counted by scripts/lists/women-of-the-bible.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            What many Bible names mean is on <Link href="/bible-names" className={link}>Bible names and their meanings</Link>. For the Gospels, see <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>, <Link href="/parables-of-jesus" className={link}>the parables of Jesus</Link> and <Link href="/miracles-of-jesus" className={link}>the miracles of Jesus</Link>. Solomon&apos;s marriages are counted on <Link href="/how-many-wives-did-solomon-have" className={link}>how many wives did Solomon have</Link>. {firstIn("Genesis")} of the women above are first named in <Link href="/books/genesis" className={link}>Genesis</Link>, and {firstIn("Luke")} in <Link href="/books/luke" className={link}>Luke</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
