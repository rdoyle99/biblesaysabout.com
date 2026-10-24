import { OG_VIDEOS } from "@/lib/og-video";
/* Names of Jesus: 25 New Testament names and titles, 3 marked Old Testament prophecy rows and the seven "I am" sayings
   in John, each counted in the KJV and WEB. Counted by scripts/lists/names-of-jesus.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/names-of-jesus.json";
import { getWord, fmt, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/names-of-jesus`;
const rows = DATA.rows;
const nt = rows.filter((r) => !r.prophecy);
const prophecy = rows.filter((r) => r.prophecy);
const R = (name) => rows.find((r) => r.name === name);
const jesus = R("Jesus");
const christ = R("Christ");
const som = R("Son of man");
const S = DATA.sonOfMan;
const C = DATA.counts;
const byCount = [...nt].sort((a, b) => b.kjv.total - a.kjv.total).slice(0, 12);
const top = (x) => `${x.top.tied.join(", ")} (${x.top.count})`;
const short = (ref) => ref.replace(/^Revelation /, "Rev. ");
const link = "underline underline-offset-2 hover:text-primary";
const METHOD_TEXT =
  "Counted by Bible Says About from the full public-domain text of the King James Version (1769 edition) and the World English Bible, verse text only. A phrase is a run of words matched in each verse and counted once per occurrence; possessives count. Matching ignores capital letters except where a row says capitals decide.";

const TITLE = `Names of Jesus: ${C.total} Titles With Verses and Counts`;
const ANSWER = `The names of Jesus in the New Testament include Jesus, Christ, Lord Jesus, the Son of man, the Son of God, the Lamb of God, the Word, Emmanuel and Messias. The King James Version prints "Jesus" ${fmt(jesus.kjv.total)} times in the New Testament and "Son of man" ${som.kjv.total} times. This page lists ${C.total} names and titles, including the seven "I am" sayings in John.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `${C.total} names and titles of Jesus with KJV and WEB counts: Jesus ${fmt(jesus.kjv.total)} times in the New Testament, Christ ${christ.kjv.total}, Son of man ${som.kjv.total}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the names of Jesus in the Bible?", a: `The table above has ${C.ntRows} from the New Testament, among them Jesus, Christ, Lord Jesus, Son of man, Son of God, Son of David, Lamb of God, the Word, Emmanuel, Rabbi, Master, King of the Jews and Alpha and Omega. It adds ${C.prophecyRows} marked Old Testament prophecies and the ${C.iamRows} "I am" sayings in John.` },
  { q: "How many times is Jesus mentioned in the Bible?", a: `The name Jesus appears ${fmt(jesus.kjv.total)} times in the King James New Testament and ${fmt(jesus.web.total)} times in the World English Bible, leaving out the verses where it names someone else. Neither translation prints the name in the Old Testament.` },
  { q: "Which Gospel uses \"Son of man\" the most?", a: `${S.top}, with ${S.gospels.find((g) => g.book === S.top).kjv} of the ${som.kjv.total} times in the King James New Testament. Ezekiel has "son of man" ${S.ezekiel.kjv} times, but there it is said to the prophet, so it is not counted here.` },
  { q: "What are the 7 \"I am\" sayings of Jesus?", a: `In John's Gospel Jesus says: ${DATA.iam.map((s) => `"${s.saying}" (${s.ref})`).join(", ")}.` },
  { q: "Is the word Messiah in the New Testament?", a: `The King James Version spells it Messias, in John 1:41 and 4:25, and prints Messiah only in Daniel 9:25-26. The World English Bible uses Messiah in John and "the Anointed One" in Daniel. John 1:41 explains the word as "the Christ".` },
  { q: "What does Emmanuel mean?", a: `Matthew 1:23 gives the meaning: "God with us". The King James Version spells it Emmanuel there and Immanuel in Isaiah 7:14 and 8:8. The World English Bible spells it Immanuel in all three verses.` },
];

export default function NamesOfJesus() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Names of Jesus", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Names of Jesus: titles, verses and counts", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const row = (r) => (
    <tr key={r.n} className="border-b last:border-0 align-top">
      <td className="p-3 tabular-nums">{r.n}</td>
      <td className="p-3 min-w-[16rem]">
        <div className="font-medium">{r.name}</div>
        <div className="text-xs text-muted-foreground mt-1">KJV: "{r.kjvPhrase}"{r.webPhrase ? `. WEB: "${r.webPhrase}"` : ""}. {r.note}</div>
      </td>
      <td className="p-3 text-right tabular-nums">{fmt(r.kjv.total)}</td>
      <td className="p-3 text-right tabular-nums">{fmt(r.web.total)}</td>
      <td className="p-3 whitespace-nowrap">{short(r.kjv.first)}</td>
      <td className="p-3">{top(r.kjv)}</td>
      <td className="p-3 whitespace-nowrap">{short(r.check)}</td>
    </tr>
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Names of Jesus" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Names of Jesus</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Counts are from the King James Version and the World English Bible, New Testament only unless a row is marked as prophecy. A phrase is counted once per occurrence, and verses where it names someone else are left out by reference.</p>
            </div>
            <StatTiles
              stats={[
                { label: `Times "Jesus" appears (KJV NT)`, value: fmt(jesus.kjv.total), note: `${jesus.kjv.top.book} has ${jesus.kjv.top.count}` },
                { label: `Times "Christ" appears (KJV NT)`, value: christ.kjv.total, note: `${christ.kjv.top.book} has ${christ.kjv.top.count}` },
                { label: `"Son of man" (KJV NT)`, value: som.kjv.total, note: `${S.top} has ${som.kjv.top.count}` },
                { label: "Names and titles listed", value: C.total, note: `${C.ntRows} NT, ${C.prophecyRows} prophecy, ${C.iamRows} "I am"` },
              ]}
            />
          </div>
        </section>

        <Section id="names" title="The names and titles of Jesus, with counts" intro={`The table lists ${C.ntRows} New Testament names and titles of Jesus and ${C.prophecyRows} Old Testament prophecies, marked below. "Most in" is the book with the highest King James count; the last column is a verse where the title is used of Jesus.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Name or title</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">First verse</th>
                  <th className="p-3 font-semibold">Most in</th>
                  <th className="p-3 font-semibold">Used of Jesus</th>
                </tr>
              </thead>
              <tbody>
                {nt.map(row)}
                <tr className="border-b bg-muted/40">
                  <td colSpan={7} className="p-3 text-xs font-semibold uppercase tracking-wide">Old Testament prophecy, counted in the Old Testament. The verse in the last column is the prophecy itself.</td>
                </tr>
                {prophecy.map(row)}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">The WEB column counts the WEB's own wording where it differs, shown after "WEB:" in the row. Rows overlap: a verse with "Lord Jesus Christ" counts under Jesus, Christ, Jesus Christ and Lord Jesus.</p>
        </Section>

        <Section id="rules" title="How this page decides what to count" muted>
          <p className="leading-relaxed">Most rows count a name only where it refers to Jesus, by the rule written beside the row; high priest and Saviour are raw counts. Choosing which titles are names of Jesus is a judgment: this page lists a title when a New Testament verse uses it of him, plus three marked prophecies. Old Testament names of God are on <Link href="/names-of-god" className={link}>the names of God page</Link>.</p>
          <ul className="mt-4 list-disc pl-5 space-y-2 leading-relaxed">
            <li>Jesus: {fmt(DATA.jesusRaw.kjv)} matches in the KJV New Testament, less {DATA.jesusRaw.kjv - jesus.kjv.total} in verses that name someone else. Those are Jesus called Justus (Colossians 4:11), the sorcerer Bar-jesus (Acts 13:6) and Joshua in Acts 7:45 and Hebrews 4:8, where the WEB prints Joshua.</li>
            <li>Christ: the {christ.kjv.total} includes the {R("Jesus Christ").kjv.total} "Jesus Christ" and {R("Christ Jesus").kjv.total} "Christ Jesus" rows. Those phrases are not extra mentions on top of it.</li>
            <li>Son of man: New Testament only. Ezekiel has "son of man" {S.ezekiel.kjv} times, where it addresses the prophet, as in Ezekiel 2:1.</li>
            <li>Rabbi and Master: only where someone speaks to or about Jesus. Rabbi is {DATA.rabbiRaw.kjv} raw matches in the KJV and {R("Rabbi").kjv.total} after that rule. Master is counted with a capital M in the four Gospels.</li>
            <li>Lord alone is left out. The KJV New Testament prints it {fmt(DATA.lordRaw.kjv)} times, for God, for Jesus and for masters in the parables, as in Matthew 18:26. No simple rule separates them. Lord Jesus is counted instead.</li>
          </ul>
        </Section>

        <Section id="most-used" title="Which name of Jesus appears most?" intro={`Jesus is the most-used name, ${fmt(jesus.kjv.total)} times in the King James New Testament, then Christ at ${christ.kjv.total}. These are the ${byCount.length} highest counts from the table.`}>
          <BarRows rows={byCount.map((r) => ({ label: r.name, value: r.kjv.total }))} labelWidth="w-40" />
          <p className="mt-5 leading-relaxed">
            {wordLink("jesus", "Jesus")} is used most in {jesus.kjv.top.book} ({jesus.kjv.top.count} times). {wordLink("christ", "Christ")} is used most in {christ.kjv.top.book} ({christ.kjv.top.count}), and "Jesus Christ" most in {R("Jesus Christ").kjv.top.book} ({R("Jesus Christ").kjv.top.count}). High priest and Saviour are raw counts: most "high priest" verses are about the high priest in Jerusalem, and {DATA.highPriestHebrews} are in Hebrews.
          </p>
        </Section>

        <Section id="son-of-man" title="Which Gospel uses Son of man most?" intro={`${S.top} does, with ${S.gospels.find((g) => g.book === S.top).kjv} of the ${som.kjv.total} times the King James New Testament prints "Son of man".`} muted>
          <BarRows rows={S.gospels.map((g) => ({ label: g.book, value: g.kjv }))} labelWidth="w-24" />
          <p className="mt-5 leading-relaxed">The four Gospels hold {S.gospelTotal} of the {som.kjv.total}. The other {S.outsideGospels} are {S.outsideRefs.join(", ")}. The World English Bible prints "Son of Man" with a capital S {som.web.total} times. It uses a small s in a few verses, such as Revelation 1:13, and those are not counted for the WEB.</p>
        </Section>

        <Section id="i-am" title={`The ${C.iamRows} "I am" sayings in John`} intro={`The ${C.iamRows} sayings below are verses in John where Jesus says "I am the" and a title. ${DATA.iam.filter((s) => s.kjv > 1).length} of them come more than once, counting the short forms noted on each card.`}>
          <div className="space-y-3">
            {DATA.iam.map((s) => (
              <div key={s.ref} className="rounded-xl border bg-card p-4">
                <div className="font-semibold">{s.n}. "{s.saying}" <span className="font-normal text-muted-foreground">({s.ref}; said {s.kjv === 1 ? "once" : `${s.kjv} times`} in John, KJV)</span></div>
                <p className="mt-1 text-sm leading-relaxed">KJV: {s.kjvText}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">WEB: {s.webText}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.also}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">See the words {wordLink("bread", "bread")}, {wordLink("light", "light")}, {wordLink("resurrection", "resurrection")} and {wordLink("vine", "vine")} for every verse that uses them. Variants such as "I am the living bread" (John 6:51) are not counted on the cards.</p>
        </Section>

        <Section id="limits" title="What these counts leave out" muted>
          <p className="leading-relaxed">The counts find titles by their words in English, so a verse that refers to Jesus as "he" or "the man" is not counted. Raw rows such as high priest and Saviour include other people and God. The list itself is a choice: other phrases, such as the Holy One of God or the bridegroom, could be added by the same rule. Of the three prophecy rows, Isaiah 7:14 is the one Matthew 1:23 quotes. "Prince of Peace" never appears in the New Testament, and the KJV New Testament never prints "Messiah".</p>
        </Section>

        <FaqSection title="Questions about the names of Jesus" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/names-of-jesus.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            The companion list is <Link href="/names-of-god" className={link}>the names of God</Link>. See also <Link href="/parables-of-jesus" className={link}>the parables of Jesus</Link>, <Link href="/miracles-of-jesus" className={link}>the miracles of Jesus</Link> and <Link href="/women-of-the-bible" className={link}>women of the Bible</Link>. Book pages: <Link href="/books/matthew" className={link}>Matthew</Link>, <Link href="/books/john" className={link}>John</Link>, <Link href="/books/hebrews" className={link}>Hebrews</Link>, <Link href="/books/revelation" className={link}>Revelation</Link> and <Link href="/books/isaiah" className={link}>Isaiah</Link>. More counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD_TEXT} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
