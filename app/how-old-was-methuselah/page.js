import { OG_VIDEOS } from "@/lib/og-video";
/* How old was Methuselah: Genesis 5:27 in the KJV and WEB, the sum that puts his death in the year of the flood,
   and every person the Bible gives an age at death or a whole lifespan for, sorted longest first.
   Counted by scripts/lists/how-old-was-methuselah.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-old-was-methuselah.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-old-was-methuselah`;
const S = DATA.sum;
const T = DATA.timeline;
const A = DATA.averages;
const L = DATA.limits;
const W = DATA.words;
const N = DATA.noah;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const byName = Object.fromEntries(DATA.table.map((r) => [r.name, r]));
const LINE = ["Adam", "Seth", "Enos", "Cainan", "Mahalaleel", "Jared", "Enoch", "Methuselah", "Lamech", "Noah", "Shem", "Arphaxad", "Salah", "Eber", "Peleg", "Reu", "Serug", "Nahor", "Terah", "Abraham", "Isaac", "Jacob", "Joseph"];
const under = DATA.limits.under120;

const TITLE = `How Old Was Methuselah? ${DATA.methuselah} Years (Genesis 5:27)`;
const ANSWER = `Methuselah was ${DATA.methuselah} years old when he died, the longest life recorded in the Bible. Genesis 5:27 says "all the days of Methuselah were nine hundred sixty and nine years: and he died." By the Bible's own numbers he died in the year of the flood. He was ${S.atLamech} when his son Lamech was born, Lamech was ${S.lamechAtNoah} when Noah was born, and Noah was ${S.noahAtFlood} when the flood came: ${S.atLamech} + ${S.lamechAtNoah} + ${S.noahAtFlood} = ${S.methAtFlood}.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Methuselah lived ${DATA.methuselah} years (Genesis 5:27), the longest life in the Bible. The sum that puts his death in the flood year, plus ${DATA.counts.people} lifespans in a table.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How old was Methuselah when he died?", a: `He was ${DATA.methuselah} years old (Genesis 5:27). He was ${S.atLamech} when his son Lamech was born (Genesis 5:25) and lived ${S.afterLamech} more years after that (Genesis 5:26). The King James Version and the World English Bible give the same number.` },
  { q: "Who was the oldest person in the Bible?", a: `Methuselah, at ${DATA.methuselah}. Next is his grandfather Jared at ${DATA.runnerUp.age} (${DATA.runnerUp.ref}), ${DATA.runnerUp.gap} years short, then Noah at ${N.age} (Genesis 9:29). All ${DATA.counts.over900} people who passed 900 were born before the flood.` },
  { q: "Did Methuselah die in the flood?", a: `The Bible does not say how he died. Its numbers put his death in the year of the flood: ${S.atLamech} (Genesis 5:25) + ${S.lamechAtNoah} (5:28) + ${S.noahAtFlood} (7:6) = ${S.methAtFlood}, his full age. He is not among the eight people who entered the ark: Noah, his wife, his three sons and their wives (Genesis 7:13, 1 Peter 3:20).` },
  { q: "How old was Noah?", a: `Noah was ${N.atSons} when his sons Shem, Ham and Japheth are named (Genesis 5:32), ${N.atFlood} when the flood came (Genesis 7:6), and lived ${N.after} years after it (Genesis 9:28). "All the days of Noah were nine hundred and fifty years: and he died" (Genesis 9:29).` },
  { q: "Who was Methuselah's father, and who was his grandson?", a: `His father was Enoch, who "walked with God: and he was not; for God took him" (Genesis 5:24). His son was Lamech and his grandson was Noah (Genesis 5:25-29). This is a different line from Cain's family in Genesis 4:17-18, which also has an Enoch, a Methusael and a Lamech.` },
  { q: "How old was Adam when he died?", a: `Adam was ${byName.Adam.age}: "all the days that Adam lived were nine hundred and thirty years: and he died" (Genesis 5:5). Adding up the ages in Genesis 5, Methuselah was ${T.methAtAdamDeath} when Adam died.` },
];

export default function HowOldWasMethuselah() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How old was Methuselah?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How old was Methuselah?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How old was Methuselah?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How old was Methuselah?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every age on this page is read from the verse in both the King James Version and the World English Bible, and the two must agree. Name counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Methuselah's age", value: DATA.methuselah, note: "Genesis 5:27" },
                { label: "Years past Jared", value: DATA.runnerUp.gap, note: `the next longest, ${DATA.runnerUp.age}` },
                { label: "Lifespans in the Bible", value: DATA.counts.people, note: `${DATA.counts.stated} stated, ${DATA.counts.computed} added up` },
                { label: "Lived past 900", value: DATA.counts.over900, note: "all born before the flood" },
              ]}
            />
          </div>
        </section>

        <Section id="verse" title="The verse: Genesis 5:27" intro="Methuselah's age is given once, in the genealogy from Adam to Noah. Both translations give the same number.">
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{DATA.key.kjv} <span className="not-italic text-sm text-muted-foreground">(Genesis 5:27, KJV)</span></blockquote>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{DATA.key.web} <span className="not-italic text-sm text-muted-foreground">(Genesis 5:27, WEB)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            The two verses before it give the same total in two parts. &quot;Methuselah lived an hundred eighty and seven years, and begat Lamech&quot; (Genesis 5:25), then lived &quot;after he begat Lamech seven hundred eighty and two years&quot; (Genesis 5:26). That is {S.atLamech} + {S.afterLamech} = {DATA.methuselah}. His name appears in {W.refsKjv.length} verses of the King James Version. It is spelled {W.methuselahKjv} times as &quot;Methuselah&quot; (Genesis 5 and 1 Chronicles 1:3) and once as &quot;Mathusala&quot;, the King James spelling in Luke&apos;s list of the ancestors of Jesus (Luke 3:37). The World English Bible spells it &quot;Methuselah&quot; all {W.methuselahWeb} times.
          </p>
        </Section>

        <Section id="flood" title="Did Methuselah die in the flood?" intro="The Bible never says how Methuselah died. Its numbers do say when." muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Step</th>
                  <th className="p-3 font-semibold text-right">Years</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Methuselah&apos;s age when Lamech was born</td>
                  <td className="p-3 text-right tabular-nums">{S.atLamech}</td>
                  <td className="p-3 whitespace-nowrap">Genesis 5:25</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Lamech&apos;s age when Noah was born</td>
                  <td className="p-3 text-right tabular-nums">+ {S.lamechAtNoah}</td>
                  <td className="p-3 whitespace-nowrap">Genesis 5:28-29</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Noah&apos;s age when the flood came</td>
                  <td className="p-3 text-right tabular-nums">+ {S.noahAtFlood}</td>
                  <td className="p-3 whitespace-nowrap">Genesis 7:6, 7:11</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Methuselah&apos;s age in the year of the flood</td>
                  <td className="p-3 text-right font-semibold tabular-nums">= {S.methAtFlood}</td>
                  <td className="p-3 whitespace-nowrap">his full age, Genesis 5:27</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            So Methuselah was {S.methAtNoahBirth} when his grandson Noah was born, and he reached {DATA.methuselah} in the year Noah reached {S.noahAtFlood}, the year &quot;the flood of waters was upon the earth&quot; (Genesis 7:6). The ages are given in whole years, so the text cannot tell us whether he died before the rain began or in it. He was not on the ark. Genesis 7:13 names who went in: Noah, Shem, Ham and Japheth, Noah&apos;s wife and the three wives of his sons, &quot;eight souls&quot; in 1 Peter 3:20.
          </p>
          <p className="mt-3 leading-relaxed">
            His son died first. Lamech lived {DATA.lamech.afterNoah} years after Noah was born (Genesis 5:30), so he died {DATA.lamech.beforeFlood} years before the flood, at {DATA.lamech.age} (Genesis 5:31). Methuselah outlived his son and lived into the year of the flood.
          </p>
        </Section>

        <Section id="table" title="How old was everyone in the Bible when they died?" intro={`These are the ${DATA.counts.people} people the Bible gives an age at death or a whole lifespan for, longest first. For ${DATA.counts.stated} of them a verse states it. For the ${DATA.counts.computed} men of Genesis 11, from Shem to Nahor, the Bible gives their age when a son was born and the years they lived after, and the table adds the two.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Person</th>
                  <th className="p-3 font-semibold text-right">Age</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {DATA.table.map((r, i) => (
                  <tr key={r.name} className={`border-b last:border-0 align-top${r.name === "Methuselah" ? " bg-primary/5" : ""}`}>
                    <td className="p-3 tabular-nums text-muted-foreground">{i + 1}</td>
                    <td className="p-3 font-medium">
                      {wordLink(r.name.toLowerCase(), r.name)}
                      {r.webName ? <span className="block text-xs font-normal text-muted-foreground">WEB: {r.webName}</span> : null}
                    </td>
                    <td className="p-3 text-right tabular-nums">{r.age}</td>
                    <td className="p-3 whitespace-nowrap">{r.ref}</td>
                    <td className="p-3 text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Job is not in the table because his full age is never given. After his trials &quot;lived Job an hundred and forty years&quot; (Job 42:16), and then he &quot;died, being old and full of days&quot; (Job 42:17). Sarah is the only woman on the list. Enoch&apos;s {DATA.enoch.age} years are his time on earth: Genesis 5:24 says &quot;God took him&quot;, not that he died.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            How the list was made: a search of the full King James text for the phrases the Bible uses for a lifespan (&quot;the days of ... were&quot;, &quot;the years of the life of&quot;, &quot;the whole age of&quot;, &quot;old when he died&quot;, &quot;died, being&quot;, &quot;was he when he died&quot;) plus the Genesis 11 genealogy. &quot;All the days of ... were&quot; alone appears {W.allTheDaysOf.total} times, all in Genesis 5 and 9. The kings of Israel and Judah are left out: the Bible gives a king&apos;s age when he began to reign and the length of his reign, and the sum is an estimate, not a stated age.
          </p>
        </Section>

        <Section id="lifespans" title="How long did people live in the Bible?" intro={`The nine men of Genesis 5 who died (Enoch left out) lived ${Math.round(A.preAvg)} years on average. Abraham, Isaac, Jacob and Joseph averaged ${Math.round(A.patAvg)}, about a sixth as long.`} muted>
          <BarRows rows={LINE.map((n) => ({ label: n, value: byName[n].age, href: getWord(n.toLowerCase()) ? `/words/${n.toLowerCase()}` : undefined }))} unit=" yrs" labelWidth="w-28" />
          <p className="mt-5 leading-relaxed">
            The bars follow the family line from Adam to Joseph in order. From Adam to Noah, {DATA.counts.over900} of the ten lives pass 900 years. After the flood the numbers fall step by step: Noah&apos;s son Shem lived {DATA.shem}, and seven generations later Nahor, Abraham&apos;s grandfather, lived {DATA.nahor}. By the time of Jacob, the old man tells Pharaoh that his {L.jacobAt} years &quot;have not attained unto the days of the years of the life of my fathers&quot; (Genesis 47:9).
          </p>
          <p className="mt-3 leading-relaxed">
            Two verses speak of a limit. Before the flood God says of man &quot;his days shall be an hundred and twenty years&quot; (Genesis 6:3); the verse does not say whether that is the length of a life or the time left before the flood. Moses died at exactly {L.gen63} (Deuteronomy 34:7). Of the {DATA.counts.people} people in the table, {L.reached120} lived {L.gen63} years or more; only {joinAnd(under.map((u) => `${u.name} (${u.age})`))} fell short. Psalm 90:10 sets the ordinary span lower: &quot;The days of our years are threescore years and ten; and if by reason of strength they be fourscore years&quot;, that is {L.ps70} or {L.ps80}.
          </p>
        </Section>

        <Section id="enoch" title="Enoch, the father who did not die">
          <p className="leading-relaxed">
            Methuselah&apos;s father Enoch was {T.begat.find((b) => b.son === "Methuselah").years} when Methuselah was born (Genesis 5:21), and &quot;walked with God after he begat Methuselah three hundred years&quot; (Genesis 5:22). His whole time on earth was {DATA.enoch.age} years, and then: &quot;Enoch walked with God: and he was not; for God took him&quot; (Genesis 5:24). The World English Bible reads &quot;he was not found&quot;. Hebrews 11:5 explains it: &quot;By faith Enoch was translated that he should not see death.&quot; Jude 14 calls him &quot;the seventh from Adam&quot;, which makes Methuselah the eighth.
          </p>
          <p className="mt-3 leading-relaxed">
            So the man with the longest life in the Bible was the son of a man the Bible says did not see death. Later Elijah is taken up too: he &quot;went up by a whirlwind into heaven&quot; (2 Kings 2:11). Adding the ages in Genesis 5 from Adam to Enoch, Methuselah was born {T.methBornYear} years after Adam&apos;s creation, was {T.methAtAdamDeath} years old when Adam died at {byName.Adam.age}, and died {T.floodYear} years after Adam&apos;s creation, the year of the flood.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Genesis 4 has a different family with similar names. Cain&apos;s son was also called Enoch (Genesis 4:17), and Cain&apos;s line runs to &quot;Methusael&quot; and his son Lamech, the first man the Bible says took two wives (Genesis 4:18-19). Methuselah, son of Enoch and grandfather of Noah, comes from Seth&apos;s line in Genesis 5.
          </p>
        </Section>

        <FaqSection title="Questions about Methuselah's age" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every age in the table and every count on this page, read and added up by scripts/lists/how-old-was-methuselah.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}). Each age is parsed from the number words in both translations, and the build stops if they disagree.</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read about <Link href="/books/genesis" className={link}>Genesis</Link>, where every age before Moses is given. Word counts: {wordLink("methuselah", "Methuselah")}, {wordLink("enoch", "Enoch")}, {wordLink("noah", "Noah")} and {wordLink("flood", "flood")}. Sarah is one of <Link href="/women-of-the-bible" className={link}>the women of the Bible</Link>, and Levi heads one of <Link href="/twelve-tribes-of-israel" className={link}>the twelve tribes of Israel</Link>. Lamech of Genesis 4 appears on <Link href="/how-many-wives-did-solomon-have" className={link}>how many wives Solomon had</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
