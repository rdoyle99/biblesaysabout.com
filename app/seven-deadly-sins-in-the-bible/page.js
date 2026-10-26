import { OG_VIDEOS } from "@/lib/og-video";
/* Are the seven deadly sins in the Bible: the phrase counted ("deadly" and "deadly sin" in the KJV and WEB), where the
   list came from (Cassian, Gregory the Great, Aquinas, the Catechism), each of the seven as a word family in both texts,
   Proverbs 6:16-19 item by item, seven New Testament vice lists and which of the seven they name, and 1 John 5:16-17.
   Counted by scripts/lists/seven-deadly-sins-in-the-bible.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/seven-deadly-sins-in-the-bible.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/seven-deadly-sins-in-the-bible`;
const D = DATA.deadly;
const S = Object.fromEntries(DATA.sins.map((s) => [s.key, s]));
const M = Object.fromEntries(DATA.matrix.map((r) => [r.key, r]));
const P6 = DATA.prov6;
const T = DATA.totals;
const W = DATA.wrath;
const J = DATA.john516;
const link = "underline underline-offset-2 hover:text-primary";
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const flat = (t) => t.toLowerCase().replace(/[’‘]/g, "'").replace(/[^a-z' ]/g, "").replace(/\s+/g, " ").trim();
const topBook = (c) => (c.top.tied.length > 1 ? `${joinAnd(c.top.tied)} (${c.top.count} each)` : `${c.top.book} (${c.top.count})`);
const short = (ref) => ref.replace("1 Corinthians", "1 Cor.").replace("2 Timothy", "2 Tim.").replace("Galatians", "Gal.").replace("Colossians", "Col.").replace("Revelation", "Rev.");

const SRC = {
  ccc1866: "https://www.vatican.va/archive/ENG0015/__P6D.HTM",
  ccc1854: "https://www.vatican.va/archive/ENG0015/__P6C.HTM",
  gregory: "https://web.archive.org/web/20240331170416/https://www.lectionarycentral.com/GregoryMoralia/BOOK%20XXXI.doc",
  cassian: "https://www.newadvent.org/fathers/350705.htm",
  aquinas: "https://www.newadvent.org/summa/2084.htm",
  evagrius: "https://en.wikipedia.org/wiki/Evagrius_Ponticus",
  cassianWiki: "https://en.wikipedia.org/wiki/John_Cassian",
  moralia: "https://en.wikipedia.org/wiki/Moralia_in_Job",
};

/* the lists as each writer gives them (read 2026-10-26 from the sources above) */
const TRADITION = [
  { who: "Evagrius Ponticus", work: "the eight evil thoughts (as Wikipedia gives them)", n: 8, items: ["gluttony", "lust", "greed", "sadness", "acedia", "anger", "vainglory", "pride"], href: SRC.evagrius },
  { who: "John Cassian", work: "Institutes, book 5, chapter 1: \"the eight principal faults\"", n: 8, items: ["gluttony", "fornication", "covetousness", "anger", "dejection", "accidie", "vainglory", "pride"], href: SRC.cassian },
  { who: "Gregory the Great", work: "Moralia in Job, book 31, chapter 45: \"seven principal vices\" from pride, \"the queen of sins\"", n: 7, items: ["vain glory", "envy", "anger", "melancholy", "avarice", "gluttony", "lust"], href: SRC.gregory },
  { who: "Thomas Aquinas", work: "Summa Theologiae I-II, question 84, article 4: \"seven capital vices\", pride \"queen of them all\"", n: 7, items: ["vainglory", "envy", "anger", "sloth", "covetousness", "gluttony", "lust"], href: SRC.aquinas },
  { who: "Catechism of the Catholic Church", work: "paragraph 1866: the \"capital sins\"", n: 7, items: ["pride", "avarice", "envy", "wrath", "lust", "gluttony", "sloth or acedia"], href: SRC.ccc1866 },
];

const TITLE = "Are the Seven Deadly Sins in the Bible? What the Text Says";
const ANSWER = `No. The phrase "seven deadly sins" is not in the Bible. "Deadly" appears ${D.kjv} times in the King James Version and ${D.web} in the World English Bible, never beside "sin". The list of pride, greed, lust, envy, gluttony, wrath and sloth comes from church tradition, from monks' lists of eight evil thoughts to Pope Gregory the Great's seven.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `"Seven deadly sins" appears 0 times in the KJV and WEB. Each of the seven counted, Proverbs 6:16-19 item by item, and ${T.lists} New Testament vice lists.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "Are the seven deadly sins in the Bible?", a: `Not as a list, and not by that name. "Deadly sin" appears ${D.deadlySinKjv} times in the King James Version and ${D.deadlySinWeb} in the World English Bible. Each of the seven is condemned somewhere in the Bible under its own words, but no verse groups these seven together. The grouping comes from church writers, and the Catechism of the Catholic Church calls them the capital sins (paragraph 1866).` },
  { q: "Where in the Bible are the seven deadly sins?", a: `Nowhere as one passage. The nearest lists are Proverbs 6:16-19, the seven things the LORD hates, which shares only pride with the traditional seven, and the vice lists of the New Testament. Of the seven lists on this page, ${M.greed.lists} name greed (covetousness), ${M.pride.lists} name pride, ${M.envy.lists} name envy, ${M.lust.lists} use a lust word in the World English Bible, ${M.wrath.lists} names wrath, and none names gluttony or sloth.` },
  { q: "What are the 7 things God hates?", a: `Proverbs 6:16-19 in the King James Version: "A proud look, a lying tongue, and hands that shed innocent blood, An heart that deviseth wicked imaginations, feet that be swift in running to mischief, A false witness that speaketh lies, and he that soweth discord among brethren." The World English Bible says "haughty eyes" for "a proud look".` },
  { q: "What is the worst of the seven deadly sins?", a: `In the tradition, pride. Gregory the Great calls pride "the queen of sins" and "the root of all evil" from which the seven spring (Moralia in Job, book 31, chapter 45), and Thomas Aquinas, citing Gregory, calls it the "queen of them all". The Bible does not rank the seven, but "a proud look" is first of the things the LORD hates (Proverbs 6:17), and "God resisteth the proud" (James 4:6).` },
  { q: "Who made the list of seven deadly sins?", a: `No single author. John Cassian wrote of "eight principal faults" (Institutes, book 5). Gregory the Great named seven vices with pride as their root (Moralia in Job, book 31). Thomas Aquinas kept seven and put sloth where Gregory had melancholy. The Catechism of the Catholic Church says the capital sins were distinguished "following St. John Cassian and St. Gregory the Great" (paragraph 1866).` },
  { q: "What is the sin unto death in 1 John 5?", a: `1 John 5:16-17 says "There is a sin unto death" and "there is a sin not unto death" (World English Bible: "a sin leading to death"). John does not say which sin he means. The word there is death, not "deadly", and the passage does not mention the seven.` },
];

export default function SevenDeadlySins() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Seven deadly sins in the Bible", url: URL },
    ]),
    generateDataArticleSchema({ headline: "Are the seven deadly sins in the Bible?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (slug && getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const order = ["greed", "pride", "envy", "lust", "wrath", "gluttony", "sloth"];
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Seven deadly sins in the Bible" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">Are the seven deadly sins in the Bible?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 26, 2026. Every count on this page is a whole-word count over the full text of the King James Version and the World English Bible, and every verse cited is checked against both before the page is built.</p>
            </div>
            <StatTiles
              stats={[
                { label: "\"Deadly sin\" in the Bible", value: D.deadlySinKjv, note: "KJV and WEB" },
                { label: "Of the seven names, not in the KJV", value: DATA.nounsAbsentKjv.length, note: joinAnd(DATA.nounsAbsentKjv) },
                { label: "Things the LORD hates", value: P6.items.length, note: "Proverbs 6:16-19; 1 is pride" },
                { label: "Vice lists naming greed", value: `${M.greed.lists} of ${T.lists}`, note: "the most of the seven" },
              ]}
            />
          </div>
        </section>

        <Section id="phrase" title="Is the phrase &quot;seven deadly sins&quot; in the Bible?" intro={`No: "seven deadly", "deadly sin" and "deadly sins" each appear ${D.sevenDeadlyKjv} times in both translations. The word "deadly" is there, ${D.kjv} times in the King James Version and ${D.web} in the World English Bible, and none of those verses uses the word "sin".`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">KJV words</th>
                  <th className="p-3 font-semibold">What is deadly</th>
                </tr>
              </thead>
              <tbody>
                {D.rows.map((r) => (
                  <tr key={r.ref} className="border-b last:border-0 align-top">
                    <td className="p-3 whitespace-nowrap">{r.ref}</td>
                    <td className="p-3">&quot;{r.kjv}&quot;</td>
                    <td className="p-3 text-muted-foreground">{r.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">KJV, whole-word matches of &quot;deadly&quot;. The World English Bible&apos;s {D.web} are in {joinAnd(D.webRefs)}.</p>
          <p className="mt-4 leading-relaxed">
            The closest a &quot;deadly&quot; verse comes to sin is James 3:8, where the tongue is &quot;an unruly evil, full of deadly poison&quot;. Later church terms are absent too: &quot;mortal sin&quot;, &quot;venial sin&quot; and &quot;capital sin&quot; appear {D.mortalVenialCapital.kjv} times in either translation. The Bible does call sin deadly in other words: &quot;the wages of sin is death&quot; (Romans 6:23, both translations).
          </p>
        </Section>

        <Section id="history" title="Where did the list of seven deadly sins come from?" intro="The list came from monks and church teachers, not from one book of the Bible. It began as eight and settled at seven." muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Writer</th>
                  <th className="p-3 font-semibold">Where</th>
                  <th className="p-3 font-semibold text-right">#</th>
                  <th className="p-3 font-semibold">The list, in that source&apos;s English</th>
                </tr>
              </thead>
              <tbody>
                {TRADITION.map((t) => (
                  <tr key={t.who} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{t.who}</td>
                    <td className="p-3 text-muted-foreground">
                      <a href={t.href} className={link} rel="noopener">{t.work}</a>
                    </td>
                    <td className="p-3 text-right tabular-nums">{t.n}</td>
                    <td className="p-3">{t.items.join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Wikipedia&apos;s article on Evagrius Ponticus, a monk who spent his last years in Egypt, says he drew up his list of eight evil thoughts in AD 375. The same article says his disciple John Cassian passed the eight on in the Latin world. Cassian&apos;s Institutes, which Wikipedia dates to about 420, name &quot;the eight principal faults&quot; in book 5. Wikipedia dates Gregory the Great&apos;s Moralia in Job to between 578 and 595. Gregory made the number seven by setting pride above the rest: &quot;when pride, the queen of sins, has fully possessed a conquered heart, she surrenders it immediately to seven principal sins, as if to some of her generals&quot;.
          </p>
          <p className="mt-3 leading-relaxed">
            Thomas Aquinas kept Gregory&apos;s seven with one change, sloth for melancholy, and, citing Gregory, called pride the &quot;queen of them all&quot;. The list most people know today is the one in the Catechism of the Catholic Church, paragraph 1866, read on vatican.va on October 26, 2026: the capital sins &quot;are called &apos;capital&apos; because they engender other sins, other vices. They are pride, avarice, envy, wrath, lust, gluttony, and sloth or acedia.&quot; It has pride where Gregory and Aquinas had vainglory, and its footnote points to the Moralia, book 31, chapter 45.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The sources use different English words for the same Latin and Greek terms (greed, covetousness and avarice; wrath and anger). The table copies each source&apos;s own words.
          </p>
        </Section>

        <Section id="each" title="What does the Bible say about each of the seven deadly sins?" intro={`The Bible names all seven vices, though not always with the same word. Pride and wrath words fill hundreds of verses; the gluttony words appear ${S.gluttony.kjv.total} times in the King James Version. Three of the seven names, ${joinAnd(DATA.nounsAbsentKjv)}, never appear in the King James Version as words, and the World English Bible has "greed" ${S.greed.nounWeb} times.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Sin</th>
                  <th className="p-3 font-semibold">Words counted</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Most in (KJV)</th>
                  <th className="p-3 font-semibold">Key verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.sins.map((s) => (
                  <tr key={s.key} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{wordLink(s.word === s.key ? s.word : null, s.name)}</td>
                    <td className="p-3 text-muted-foreground">{[...new Set([...Object.keys(s.kjv.forms), ...Object.keys(s.web.forms)])].join(", ")}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(s.kjv.total)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(s.web.total)}</td>
                    <td className="p-3">{topBook(s.kjv)}</td>
                    <td className="p-3 whitespace-nowrap">{s.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Whole-word matches of the forms listed, capitals ignored, in the full KJV and WEB text. A form is shown if either translation uses it.</p>

          <div className="mt-6 space-y-5">
            {DATA.sins.map((s) => (
              <div key={s.key}>
                <h3 className="text-lg font-semibold mb-1">{s.name}</h3>
                <blockquote className="border-l-4 pl-4 italic leading-relaxed">
                  {s.keyWeb} <span className="not-italic text-sm text-muted-foreground">({s.ref}, WEB)</span>
                </blockquote>
                {flat(s.keyKjv) !== flat(s.keyWeb) ? (
                  <p className="mt-1 pl-5 text-sm text-muted-foreground">KJV: {s.keyKjv}</p>
                ) : null}
                <p className="mt-2 leading-relaxed">{NOTES[s.key]}</p>
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mt-8 mb-2">What word counts cannot show</h3>
          <p className="leading-relaxed">
            The counts include every use, not only the sinful one. Many of the wrath and anger words describe God: &quot;the anger of the LORD&quot; alone appears {W.angerOfTheLord} times in the King James Version and &quot;the wrath of God&quot; {W.wrathOfGod} times. &quot;Lust&quot; in the King James Version can mean any strong desire: &quot;my lust shall be satisfied upon them&quot; says the enemy at the Red Sea (Exodus 15:9), where the World English Bible says &quot;desire&quot;. Word counts measure vocabulary, not teaching, and the two translations often choose different words for the same Hebrew or Greek: the World English Bible says &quot;angry&quot; {S.wrath.web.forms.angry} times to the King James Version&apos;s {S.wrath.kjv.forms.angry}, and drops &quot;wroth&quot; altogether.
          </p>
        </Section>

        <Section id="proverbs" title="What are the seven things God hates in Proverbs 6?" intro="Proverbs 6:16-19 lists seven things the LORD hates, and only the first, &quot;a proud look&quot;, is one of the seven deadly sins. The others are lying, violence, wicked plans, eagerness for mischief, false witness and stirring up discord." muted>
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{P6.web} <span className="not-italic text-sm text-muted-foreground">(Proverbs 6:16-19, WEB)</span></blockquote>
          <div className="mt-5 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">KJV</th>
                  <th className="p-3 font-semibold">WEB</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">Deadly sin?</th>
                </tr>
              </thead>
              <tbody>
                {P6.items.map((h) => (
                  <tr key={h.n} className={`border-b last:border-0 align-top${h.sin ? " bg-primary/5" : ""}`}>
                    <td className="p-3 tabular-nums text-muted-foreground">{h.n}</td>
                    <td className="p-3">{h.kjv}</td>
                    <td className="p-3">{h.web}</td>
                    <td className="p-3 whitespace-nowrap">{h.ref}</td>
                    <td className="p-3">{h.sin ? "pride" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">An item counts as one of the seven only if it uses a word from that sin&apos;s family in the table above, in either translation.</p>
          <p className="mt-4 leading-relaxed">
            The KJV opens &quot;These six things doth the LORD hate: yea, seven are an abomination unto him&quot;, one number and then the next, a pattern Proverbs 30 repeats (&quot;three things ... yea, four&quot;, Proverbs 30:18). None of the other six uses a word for anger, envy, greed or lust, so the table does not count them. Two chapters on, Wisdom says the same of pride: &quot;pride, and arrogancy, and the evil way, and the froward mouth, do I hate&quot; (Proverbs 8:13, KJV). Proverbs 26:25 speaks of &quot;seven abominations in his heart&quot; without listing them.
          </p>
        </Section>

        <Section id="vice-lists" title="Which of the seven deadly sins are in the New Testament vice lists?" intro={`Greed is in the most of them: ${M.greed.lists} of the ${T.lists} lists below name covetousness or the covetous. Gluttony and sloth are in none. Together the lists have ${T.kjv} entries in the King James Version and ${T.web} in the World English Bible.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">List</th>
                  <th className="p-3 font-semibold">Context</th>
                  <th className="p-3 font-semibold text-right">Entries KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Of the seven</th>
                </tr>
              </thead>
              <tbody>
                {DATA.lists.map((l) => (
                  <tr key={l.ref} className="border-b last:border-0 align-top">
                    <td className="p-3 whitespace-nowrap font-medium">{l.ref}</td>
                    <td className="p-3 text-muted-foreground">{l.speaker}: {l.setting}</td>
                    <td className="p-3 text-right tabular-nums">{l.entriesKjv}</td>
                    <td className="p-3 text-right tabular-nums">{l.entriesWeb}</td>
                    <td className="p-3">
                      {Object.keys(l.hits).length
                        ? Object.entries(l.hits)
                            .map(([k, h]) => `${k} (${[...h.kjv, ...h.web.filter((w) => !h.kjv.map(flat).includes(flat(w)))].map((e) => e.toLowerCase()).join(" / ")})`)
                            .join("; ")
                        : "none"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Entries counted from the verse text, one per item in the series. In 2 Timothy 3:2-5 the 19th is &quot;having a form of godliness&quot;; the World English Bible&apos;s Revelation 21:8 adds &quot;sinners&quot;, so it has {DATA.lists.at(-1).entriesWeb} to the KJV&apos;s {DATA.lists.at(-1).entriesKjv}. A list counts for one of the seven if an entry uses a word from that sin&apos;s family in either translation.</p>

          <h3 className="text-lg font-semibold mt-8 mb-3">How many of the {T.lists} lists name each sin</h3>
          <BarRows rows={order.map((k) => ({ label: S[k].name, value: M[k].lists, display: `${M[k].lists} of ${T.lists}` }))} labelWidth="w-24" />

          <p className="mt-5 leading-relaxed">
            Two of the matches depend on the translation. Pride is in Mark 7:22 in both, but in Romans 1:30 and 2 Timothy 3:2 only the King James Version says &quot;proud&quot;; the World English Bible says &quot;haughty&quot; and &quot;arrogant&quot;. Lust is the other way round: the World English Bible has &quot;lustful desires&quot; (Mark 7:22) and &quot;lustfulness&quot; (Galatians 5:19) where the King James Version has &quot;lasciviousness&quot;. Wrath appears once, in Galatians 5:20, though three verses after the Colossians list Paul adds &quot;anger, wrath, malice&quot; (Colossians 3:8). The lists name drunkenness ({joinAnd(DATA.drunk.map(short))}) but never gluttony. Revelation 21:8 names none of the seven.
          </p>
          <p className="mt-3 leading-relaxed">
            Galatians sets its list against a second one. Right after &quot;the works of the flesh&quot; comes <Link href="/fruit-of-the-spirit" className={link}>the fruit of the Spirit</Link>, nine qualities from love to self-control (Galatians 5:22-23). The coveting of the vice lists goes back to the tenth commandment, &quot;Thou shalt not covet&quot; (Exodus 20:17), which also stands among <Link href="/613-commandments" className={link}>the 613 commandments</Link>.
          </p>
        </Section>

        <Section id="sin-unto-death" title="Is the &quot;sin unto death&quot; one of the seven deadly sins?" intro="No. 1 John 5:16-17 speaks of a sin that leads to death, but it does not name the sin or connect it to any list." muted>
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{J.kjv} <span className="not-italic text-sm text-muted-foreground">(1 John 5:16-17, KJV)</span></blockquote>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{J.web} <span className="not-italic text-sm text-muted-foreground">(1 John 5:16-17, WEB)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            The phrase is &quot;sin unto death&quot; in the King James Version and &quot;sin leading to death&quot; in the World English Bible, {J.phraseKjv} times each across the two verses, counting the &quot;not&quot; forms. The text does not say which sin John means. The Catechism of the Catholic Church points to these verses in a footnote to paragraph 1854, where it says the distinction between mortal and venial sin is &quot;already evident in Scripture&quot; (read on vatican.va, October 26, 2026). Elsewhere Jesus names one sin that &quot;hath never forgiveness&quot;, blasphemy against the Holy Ghost (Mark 3:29, KJV); John does not say whether that is the sin he has in mind.
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/lists/seven-deadly-sins-in-the-bible.mjs (read and counted {DATA.generated}). The build stops if a cited verse lacks the words its row relies on.</li>
            <li><a href={SRC.ccc1866} className={link} rel="noopener">Catechism of the Catholic Church, paragraph 1866 (vatican.va)</a>: the seven capital sins, the quotation, and the footnote to the Moralia, book 31, chapter 45 (read 2026-10-26).</li>
            <li><a href={SRC.ccc1854} className={link} rel="noopener">Catechism of the Catholic Church, paragraph 1854 (vatican.va)</a>: mortal and venial sin &quot;already evident in Scripture&quot;, with its footnote to 1 John (read 2026-10-26).</li>
            <li><a href={SRC.gregory} className={link} rel="noopener">Gregory the Great, Moralia in Job, book 31</a>, in the English translation posted by Lectionary Central, archived copy: pride &quot;the queen of sins&quot; and the seven principal vices, chapter 45, section 87 (read 2026-10-26).</li>
            <li><a href={SRC.cassian} className={link} rel="noopener">John Cassian, Institutes, book 5 (New Advent)</a>, translated by Edgar C. S. Gibson (1894): the eight principal faults, chapter 1 (read 2026-10-26).</li>
            <li><a href={SRC.aquinas} className={link} rel="noopener">Thomas Aquinas, Summa Theologiae I-II, question 84 (New Advent)</a>, English Dominican translation (1920): the seven capital vices and pride as &quot;queen of them all&quot;, article 4 (read 2026-10-26).</li>
            <li><a href={SRC.evagrius} className={link} rel="noopener">Wikipedia, &quot;Evagrius Ponticus&quot;</a>: his eight evil thoughts, the date AD 375, and Cassian as his disciple (read 2026-10-26).</li>
            <li><a href={SRC.cassianWiki} className={link} rel="noopener">Wikipedia, &quot;John Cassian&quot;</a>: the Institutes written about 420 (read 2026-10-26).</li>
            <li><a href={SRC.moralia} className={link} rel="noopener">Wikipedia, &quot;Moralia in Job&quot;</a>: written between 578 and 595 (read 2026-10-26).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about the seven deadly sins" faqs={faqs} />

        <Section>
          <p className="mb-4">
            Verses by topic: <Link href="/verses/pride" className={link}>pride</Link>, <Link href="/verses/lust" className={link}>lust</Link>, <Link href="/verses/jealousy" className={link}>jealousy and envy</Link>, <Link href="/verses/anger" className={link}>anger</Link>, <Link href="/verses/gluttony" className={link}>gluttony</Link> and <Link href="/verses/laziness" className={link}>laziness</Link>. Word counts: {wordLink("sin", "sin")}, {wordLink("humility", "humility")} and {wordLink("anger", "anger")}. Most of the sloth verses are in <Link href="/books/proverbs" className={link}>Proverbs</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}

/* one short note per sin, built from the counts (shown under each key verse) */
const NOTES = {
  pride: `The pride words appear ${fmt(S.pride.kjv.total)} times in the King James Version, most in ${topBook(S.pride.kjv)}. "God resisteth the proud, but giveth grace unto the humble" (James 4:6), and 1 John 2:16 sets "the pride of life" beside "the lust of the flesh, and the lust of the eyes".`,
  greed: `The King James Version never uses the word "greed"; it says covet, covetousness and greedy, ${S.greed.kjv.total} times in all, most in ${topBook(S.greed.kjv)}. The tenth commandment is "Thou shalt not covet" (Exodus 20:17), and 1 Timothy 6:10 calls "the love of money" "the root of all evil" (World English Bible: "a root of all kinds of evil").`,
  lust: `${S.lust.kjv.total} uses in the King James Version, most in ${topBook(S.lust.kjv)}, which traces sin back to it: "every man is tempted, when he is drawn away of his own lust" (James 1:14). In the World English Bible the most are in ${topBook(S.lust.web)}.`,
  envy: `${S.envy.kjv.total} uses in the King James Version, most in ${topBook(S.envy.kjv)}. The translations often differ between envy and jealousy: "who is able to stand before envy?" (Proverbs 27:4, KJV) is "before jealousy" in the World English Bible, which has ${S.envy.web.total} envy words to the KJV's ${S.envy.kjv.total}.`,
  gluttony: `The word "gluttony" is in neither translation. "Glutton" and "gluttonous" appear ${S.gluttony.kjv.total} times in the King James Version, one each in ${joinAnd(S.gluttony.kjv.top.tied)}, and always with drinking: the rebellious son is "a glutton, and a drunkard" (Deuteronomy 21:20), and Jesus repeats the charge made against him, "Behold a man gluttonous, and a winebibber" (Matthew 11:19). The World English Bible has ${S.gluttony.web.total}: it adds Proverbs 28:7, "a companion of gluttons" (KJV: "of riotous men"), and Titus 1:12, "idle gluttons", where the KJV says "slow bellies".`,
  wrath: `${fmt(S.wrath.kjv.total)} uses in the King James Version (${fmt(W.wrathOnly.kjv)} wrath words and ${fmt(W.angerOnly.kjv)} anger words), most in ${topBook(S.wrath.kjv)}. Ephesians 4:26 does not forbid anger itself; it warns against sinning in it and letting it last. James 1:20 adds that "the wrath of man worketh not the righteousness of God".`,
  sloth: `The word "sloth" is in neither translation. Proverbs holds ${S.sloth.proverbs.kjv} of the King James Version's ${S.sloth.kjv.total} sloth words (mostly "slothful" and "sluggard") and ${S.sloth.proverbs.web} of the World English Bible's ${S.sloth.web.total}. "By much slothfulness the building decayeth" (Ecclesiastes 10:18, KJV).`,
};
