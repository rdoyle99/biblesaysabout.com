import { OG_VIDEOS } from "@/lib/og-video";
/* How many years did Noah build the ark: the window Genesis gives (500 at 5:32, 600 at 7:6, the 120 years of 6:3),
   who reads it which way, the flood calendar and the day count under each calendar assumption, the ark's size,
   who went aboard, and how often "ark" means Noah's ark. Counted by scripts/lists/how-many-years-did-noah-build-the-ark.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-many-years-did-noah-build-the-ark.json";
import { getWord, fmt, ordinal, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-years-did-noah-build-the-ark`;
const N = DATA.noah;
const I = DATA.intervals;
const Z = DATA.size;
const A = DATA.ark;
const Q = DATA.quotes;
const link = "underline underline-offset-2 hover:text-primary";
const READ = "read 2026-10-26";
const SRC = {
  aig: "https://answersingenesis.org/bible-timeline/how-long-did-it-take-for-noah-to-build-the-ark/",
  gqBuild: "https://www.gotquestions.org/how-long-did-it-take-Noah-to-build-the-ark.html",
  gqAboard: "https://www.gotquestions.org/how-long-was-Noah-on-the-ark.html",
  atri: "https://blog.atriresearch.org/articles/how-long-did-it-take-to-build-the-ark",
  bh63: "https://biblehub.com/commentaries/genesis/6-3.htm",
  wFlood: "https://en.wikipedia.org/wiki/Genesis_flood_narrative",
  wLunar: "https://en.wikipedia.org/wiki/Lunar_calendar",
  wTropical: "https://en.wikipedia.org/wiki/Tropical_year",
  wUnits: "https://en.wikipedia.org/wiki/Biblical_and_Talmudic_units_of_measurement",
  wArk: "https://en.wikipedia.org/wiki/Noah%27s_Ark",
  lht: "https://lifehopeandtruth.com/bible/blog/the-arks-dimensions/",
};
const ext = (href, label) => (
  <a href={href} className={link} rel="noopener">
    {label}
  </a>
);
const MAX_SONS = N.atFlood - N.atSons;
const cal = Object.fromEntries(DATA.calendar.map((c) => [c.ref, c]));

const TITLE = "How Many Years Did Noah Build the Ark? 75, 100 or 120?";
const ANSWER = `The Bible never says how long Noah took to build the ark. It gives a window. Noah was ${N.atSons} when his sons are named (Genesis 5:32) and ${N.atFlood} when the flood came (Genesis 7:6). That allows at most ${MAX_SONS} years if the work began after their births, or ${DATA.gen63} if Genesis 6:3 is a countdown. Shorter figures are estimates.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Genesis never dates the start of the ark. Noah was ${N.atSons} at 5:32 and ${N.atFlood} at the flood: a ${MAX_SONS}-year window, ${DATA.gen63} by one reading of 6:3. Then ${I.days30} days aboard.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How long did it take Noah to build the ark?", a: `The Bible does not say. It gives Noah's age as ${N.atSons} when his sons are named (Genesis 5:32) and ${N.atFlood} when the flood came (Genesis 7:6), so the work fits in ${MAX_SONS} years if it began after the sons were born. Readers who take Genesis 6:3 as a countdown allow up to ${DATA.gen63}. Answers in Genesis puts the maximum at about 75 years, and GotQuestions.org gives 100 to 120. All of these are readings of the same verses, not a stated figure.` },
  { q: "How old was Noah when he built the ark?", a: `The text gives his age at the end, not the start: he was ${N.atFlood} when the flood came (Genesis 7:6, 7:11). If the work began after his sons were born he was between ${N.atSons} and ${N.atFlood} while building; on the countdown reading of Genesis 6:3 the start could be as early as ${N.atFlood - DATA.gen63}. He lived ${N.after} more years after the flood and died at ${N.died} (Genesis 9:28-29).` },
  { q: "How long was Noah on the ark?", a: `One year and ten days by the dates. He went in on the 17th day of the 2nd month of his ${ordinal(N.atFlood)} year (Genesis 7:11, 7:13). The earth was dry on the 27th day of the 2nd month of his ${ordinal(N.atExit)} year (Genesis 8:14), and after that God told him to go out (Genesis 8:15-18). With 30-day months that is ${DATA.aboard.thirty.elapsed} days (${DATA.aboard.thirty.inclusive} counting both the first and last day). On a ${DATA.calendarYears.lunar}-day lunar year it is ${DATA.aboard.lunar.elapsed} (${DATA.aboard.lunar.inclusive}).` },
  { q: "How big was Noah's ark?", a: `${Z.cubits.len} cubits long, ${Z.cubits.wid} wide and ${Z.cubits.hgt} high (Genesis 6:15), with three decks and a door in the side (Genesis 6:16). At an 18-inch cubit that is ${Z.feet18.len} by ${Z.feet18.wid} by ${Z.feet18.hgt} feet. The cubit's length is an assumption: at the longer Biblical cubits of 49.5 or 52.5 cm the ark would be ${Z.alt[0].lenFt} or ${Z.alt[1].lenFt} feet long.` },
  { q: "Did Noah build the ark alone?", a: `The text names no helpers and no workers. God speaks to Noah ("Make thee an ark of gopher wood", Genesis 6:14), and the report is "Thus did Noah; according to all that God commanded him, so did he" (Genesis 6:22). Hebrews 11:7 says Noah "prepared an ark to the saving of his house". Whether his sons or anyone else worked on it is not said.` },
  { q: "How many people were on Noah's ark?", a: `${DATA.people} people: Noah, his wife, his sons Shem, Ham and Japheth, and their three wives (Genesis 7:13). 1 Peter 3:20 says "eight souls were saved by water". Methuselah, Noah's grandfather, was not one of them; by the Bible's numbers he died in the year of the flood.` },
];

export default function HowManyYearsDidNoahBuildTheArk() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many years did Noah build the ark?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many years did Noah build the ark?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const Quote = ({ k, refText }) => (
    <>
      <blockquote className="border-l-4 pl-4 italic leading-relaxed">{Q[k].kjv} <span className="not-italic text-sm text-muted-foreground">({refText}, KJV)</span></blockquote>
      <blockquote className="mt-3 border-l-4 pl-4 italic leading-relaxed">{Q[k].web} <span className="not-italic text-sm text-muted-foreground">({refText}, WEB)</span></blockquote>
    </>
  );
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many years did Noah build the ark?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many years did Noah build the ark?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 26, 2026. Method: every age, date and measurement on this page is read from the verse in both the King James Version and the World English Bible, and the number words in the two must agree. Word counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Years from 5:32 to the flood", value: MAX_SONS, note: `Noah ${N.atSons} to ${N.atFlood}` },
                { label: "Years in Genesis 6:3", value: DATA.gen63, note: "read two ways" },
                { label: "Days aboard", value: DATA.aboard.thirty.elapsed, note: "30-day months, 7:11 to 8:14" },
                { label: "Feet long", value: Z.feet18.len, note: `${Z.cubits.len} cubits at 18 inches` },
              ]}
            />
          </div>
        </section>

        <Section id="text" title="What does the Bible say about how long Noah built the ark?" intro="No verse says when Noah started building or how long it took. What Genesis gives is Noah's age at two points and a command with no date on it.">
          <Quote k="gen532" refText="Genesis 5:32" />
          <div className="mt-4" />
          <Quote k="gen76" refText="Genesis 7:6" />
          <p className="mt-4 leading-relaxed">
            Between those two verses God tells Noah to build the ark (Genesis 6:14-16). He also says who will go into it: &quot;thou, and thy sons, and thy wife, and thy sons&apos; wives with thee&quot; (Genesis 6:18). The work itself gets one sentence: &quot;Thus did Noah; according to all that God commanded him, so did he&quot; (Genesis 6:22). The flood began &quot;in the six hundredth year of Noah&apos;s life&quot; (Genesis 7:11), so the ark was finished by the time Noah was {N.atFlood}. The New Testament adds that God waited &quot;while the ark was a preparing&quot; (1 Peter 3:20), without a length.
          </p>
          <p className="mt-3 leading-relaxed">
            Genesis 5:32 may be when Noah began to have sons rather than one birth date for all three. Genesis 11:10 says Shem was {N.shemAt} &quot;two years after the flood&quot;. That puts his birth in Noah&apos;s {ordinal(N.noahAtShemFromStart)} or {ordinal(N.noahAtShemFromEnd)} year, depending on whether you count from the flood&apos;s start or its end. So Shem was about {N.shemAtFlood} when the flood came.
          </p>
        </Section>

        <Section id="window" title="How many years could Noah have spent building the ark?" intro={`The longest figure commonly drawn from the verses is ${DATA.gen63} years, and most readings give ${MAX_SONS} or fewer. Each figure below rests on a different assumption about when the command came.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Most years</th>
                  <th className="p-3 font-semibold">Noah&apos;s age</th>
                  <th className="p-3 font-semibold">The reading behind it</th>
                  <th className="p-3 font-semibold">Who gives it</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b align-top">
                  <td className="p-3 font-semibold tabular-nums">{DATA.windowRows[0].years}</td>
                  <td className="p-3 tabular-nums whitespace-nowrap">{DATA.windowRows[0].from} to {DATA.windowRows[0].to}</td>
                  <td className="p-3">Genesis 6:3&apos;s {DATA.gen63} years are a countdown to the flood, and Noah was told to build when it began.</td>
                  <td className="p-3">GotQuestions.org gives 100 to 120 years. Keil and Delitzsch date the 6:3 sentence to Noah&apos;s 480th year.</td>
                </tr>
                <tr className="border-b align-top">
                  <td className="p-3 font-semibold tabular-nums">{DATA.windowRows[1].years}</td>
                  <td className="p-3 tabular-nums whitespace-nowrap">{DATA.windowRows[1].from} to {DATA.windowRows[1].to}</td>
                  <td className="p-3">The command came after the sons of Genesis 5:32 were born (Genesis 6:10 names them just before it).</td>
                  <td className="p-3">GotQuestions.org: &quot;could not have been more than 100 years&quot; by Genesis 5:32 and 7:6.</td>
                </tr>
                <tr className="border-b align-top">
                  <td className="p-3 font-semibold tabular-nums">{DATA.windowRows[2].years}</td>
                  <td className="p-3 tabular-nums whitespace-nowrap">{DATA.windowRows[2].from} to {DATA.windowRows[2].to}</td>
                  <td className="p-3">As above, counting from Shem&apos;s birth by Genesis 11:10.</td>
                  <td className="p-3">Our arithmetic from the verses; ATRI also puts Shem at about 98 at the flood.</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 font-semibold tabular-nums">about 75</td>
                  <td className="p-3 tabular-nums whitespace-nowrap">about 525 to 600</td>
                  <td className="p-3">The sons were already married when God spoke (Genesis 6:18 mentions their wives), and married at 20 or older.</td>
                  <td className="p-3">Answers in Genesis (Tim Chaffey): &quot;about 75 years maximum&quot;, perhaps 20-25. ATRI: &quot;50-75 years and perhaps less&quot;.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The first three numbers are subtraction from the verses. The fourth adds a guess the text does not make: the age at which Shem, Ham and Japheth married. Tim Chaffey of Answers in Genesis (July 25, 2025) assumes Ham was born around Noah&apos;s 505th year and married at 20 or later, which leaves about 75 years, and he adds that the build may have taken far less. The John Ankerberg Show staff at ATRI (August 15, 2019) reach 50 to 75 years the same way. GotQuestions.org (updated June 6, 2024) gives 100 to 120 years, and says either Genesis 5:32 or 7:6 rounds Noah&apos;s age, or God set the 120 years and told Noah 20 years later.
          </p>
        </Section>

        <Section id="genesis-6-3" title="What do the 120 years of Genesis 6:3 mean?" intro="Commentators read them two ways: a limit on how long a person lives, or the time left before the flood. Only the second makes them a building window.">
          <Quote k="gen63" refText="Genesis 6:3" />
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold mb-2">A limit on a lifespan</h3>
              <p className="text-sm leading-relaxed">Ellicott&apos;s Commentary for English Readers reads the verse as &quot;the Divine determination to shorten human life&quot;. The Cambridge Bible for Schools and Colleges paraphrases it as &quot;Mortal life, therefore, shall be limited to 120 years&quot;. On this reading the verse says nothing about the ark.</p>
            </div>
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold mb-2">A countdown to the flood</h3>
              <p className="text-sm leading-relaxed">Keil and Delitzsch read it as &quot;a respite of 120 years&quot; for the human race, made known to Noah &quot;in his 480th year&quot;. Gill&apos;s Exposition calls it &quot;the space that God would give for repentance&quot; and ties it to the &quot;longsuffering of God&quot; in 1 Peter 3:20.</p>
            </div>
          </div>
          <p className="mt-4 leading-relaxed">
            Each reading has a difficulty the commentators raise themselves. Against the lifespan reading, people after the flood still lived far past 120: Noah&apos;s son Shem lived {N.shemLife} years (Genesis 11:10-11). Against the countdown, Genesis puts only {MAX_SONS} years between Noah at {N.atSons} and the flood; Gill, following Jarchi, answers that the decree was given 20 years before Japheth was born and is told out of order. And even on the countdown reading, Answers in Genesis notes, &quot;nothing in this verse or its immediate context says that this is when Noah started building the ark&quot;. The ark is first mentioned eleven verses later, in Genesis 6:14. All quotations in this section are from the commentaries collected on Bible Hub and from the Answers in Genesis article, linked under Sources.
          </p>
        </Section>

        <Section id="age" title="How old was Noah when he built the ark?" intro={`Between ${N.atSons} and ${N.atFlood} on most readings, and done by ${N.atFlood}: Genesis gives his age at the flood, not at the start of the work.`} muted>
          <p className="leading-relaxed">
            Noah was {N.atFlood} when the flood came (Genesis 7:6, 7:11) and {N.atExit} when the waters had dried (Genesis 8:13). &quot;Noah lived after the flood three hundred and fifty years&quot; (Genesis 9:28), and &quot;all the days of Noah were nine hundred and fifty years: and he died&quot; (Genesis 9:29): {N.atFlood} + {N.after} = {N.died}. His grandfather Methuselah was not aboard. By the ages in Genesis 5, Methuselah was {DATA.methuselah.atNoahBirth} when Noah was born and reached {DATA.methuselah.age} in the year of the flood, as worked out on <Link href="/how-old-was-methuselah" className={link}>how old Methuselah was</Link>.
          </p>
        </Section>

        <Section id="aboard" title="How long was Noah on the ark?" intro={`One year and ten days by the dates in Genesis, which is ${DATA.aboard.thirty.elapsed} days if every month has 30 days. Genesis dates five events by Noah's year, the month and the day.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Event</th>
                  <th className="p-3 font-semibold">Year / month / day</th>
                  <th className="p-3 font-semibold text-right">Day (30-day months)</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.calendar.map((c) => (
                  <tr key={c.ref} className="border-b last:border-0 align-top">
                    <td className="p-3">{c.label}</td>
                    <td className="p-3 tabular-nums whitespace-nowrap">{c.year} / {c.month} / {c.day}</td>
                    <td className="p-3 text-right tabular-nums">{c.dayOf30}</td>
                    <td className="p-3 whitespace-nowrap">{c.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The text gives its own check on the month length. From the 17th of the 2nd month to the 17th of the 7th, when the ark rested on Ararat, is five months, and Genesis 7:24 says &quot;the waters prevailed upon the earth an hundred and fifty days&quot;. That fits 30-day months exactly: five months of 30 days is {I.fiveMonths}. The other stated spans are a {I.warning}-day wait before the rain (Genesis 7:4, 7:10) and rain for {I.rain} days and nights (Genesis 7:12). After the mountaintops appeared, Noah waited {I.windowWait} days, opened the window and sent the raven (Genesis 8:6-7), which is day {I.raven} if the {I.windowWait} days count from the 1st of the 10th month. Two waits of {I.dove1} days come between the doves (Genesis 8:10, 8:12). The gap between the raven and the first dove is not given. More on the number in <Link href="/words/forty-days" className={link}>forty days in the Bible</Link>.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Calendar assumption</th>
                  <th className="p-3 font-semibold text-right">Days elapsed</th>
                  <th className="p-3 font-semibold text-right">Counting both ends</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">12 months of 30 days ({DATA.calendarYears.thirty}-day year), as Genesis 7:24 and 8:4 imply</td>
                  <td className="p-3 text-right tabular-nums font-semibold">{DATA.aboard.thirty.elapsed}</td>
                  <td className="p-3 text-right tabular-nums">{DATA.aboard.thirty.inclusive}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">A lunar year of {DATA.calendarYears.lunar} days</td>
                  <td className="p-3 text-right tabular-nums">{DATA.aboard.lunar.elapsed}</td>
                  <td className="p-3 text-right tabular-nums">{DATA.aboard.lunar.inclusive}</td>
                </tr>
                <tr>
                  <td className="p-3">A solar year of {DATA.calendarYears.solar} days</td>
                  <td className="p-3 text-right tabular-nums">{DATA.aboard.solar.elapsed}</td>
                  <td className="p-3 text-right tabular-nums">{DATA.aboard.solar.inclusive}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The day count is one year plus ten days, so it depends on how long the year was, which Genesis does not say. GotQuestions.org gives &quot;about 370 days&quot;. Wikipedia&apos;s article on the Genesis flood narrative reports one scholarly solution to the &quot;one year and 11 days&quot;: a lunar calendar of 354 days plus 11 days, which matches a solar year of 365. A lunar year of twelve months is about 354 days (Wikipedia, &quot;Lunar calendar&quot;); a solar year is about 365.24 days (Wikipedia, &quot;Tropical year&quot;).
          </p>
        </Section>

        <Section id="size" title="How big was Noah's ark?" intro={`${Z.cubits.len} cubits long, ${Z.cubits.wid} wide and ${Z.cubits.hgt} high (Genesis 6:15). At 18 inches to the cubit, that is ${Z.feet18.len} by ${Z.feet18.wid} by ${Z.feet18.hgt} feet.`} muted>
          <Quote k="gen615" refText="Genesis 6:15" />
          <div className="mt-5 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Cubit assumed</th>
                  <th className="p-3 font-semibold text-right">Length</th>
                  <th className="p-3 font-semibold">Where the cubit length comes from</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b align-top">
                  <td className="p-3 tabular-nums">18 inches (45.7 cm)</td>
                  <td className="p-3 text-right tabular-nums whitespace-nowrap">{Z.feet18.len} ft ({Z.meters18.len} m)</td>
                  <td className="p-3">Life, Hope &amp; Truth: &quot;The general consensus among scholars is that a biblical cubit is equivalent to 18 inches&quot;.</td>
                </tr>
                {Z.alt.map((a) => (
                  <tr key={a.cm} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{a.cm} cm ({a.inches} in)</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{a.lenFt} ft ({a.lenM} m)</td>
                    <td className="p-3">Wikipedia, &quot;Biblical and Talmudic units of measurement&quot;: scholars are uncertain whether the Biblical cubit was 49.5 or 52.5 cm.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The cubit is the one number on this page that the Bible does not supply, so every figure in feet is an assumption. Wikipedia&apos;s Noah&apos;s Ark article gives about 134 by 22 by 13 metres (440 by 72 by 43 feet). Whatever the cubit, the proportions come from the text: the ark is {Z.ratioLW} times as long as it is wide and {Z.ratioLH} times as long as it is high. As a plain box at 18 inches to the cubit it would hold {fmt(Z.boxCubicFeet18)} cubic feet, an upper bound since the text gives no hull shape.
          </p>
          <p className="mt-3 leading-relaxed">
            Genesis 6:14-16 adds the rest of the plan: gopher wood, rooms, pitch &quot;within and without&quot;, a door &quot;in the side thereof&quot;, and &quot;lower, second, and third stories&quot; (the WEB says &quot;levels&quot;), so three decks and one door. The KJV of 6:16 says &quot;A window shalt thou make to the ark&quot;; the WEB reads &quot;a roof&quot; there. Both translations later call it &quot;the window&quot; Noah had made (Genesis 8:6). The waters prevailed &quot;fifteen cubits upward&quot; (WEB: &quot;fifteen cubits higher&quot;) and &quot;the mountains were covered&quot; (Genesis 7:20); the verse does not say whether the {Z.depthAboveMountains} cubits are measured from the peaks.
          </p>
        </Section>

        <Section id="aboard-who" title="Who and what went on the ark?" intro={`${DATA.people} people: Noah, his wife, Shem, Ham, Japheth and their three wives (Genesis 7:13). 1 Peter 3:20 counts "eight souls".`}>
          <p className="leading-relaxed">
            Of animals, the first command is &quot;two of every sort ... male and female&quot; (Genesis 6:19-20). Genesis 7:2-3 then makes an exception for clean animals and for birds, and here the translations word it differently:
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">KJV</th>
                  <th className="p-3 font-semibold">WEB</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b align-top">
                  <td className="p-3 whitespace-nowrap">Genesis 7:2 (animals)</td>
                  <td className="p-3">{DATA.animals.clean.kjv}</td>
                  <td className="p-3">{DATA.animals.clean.web}</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 whitespace-nowrap">Genesis 7:3 (birds)</td>
                  <td className="p-3">{DATA.animals.birds.kjv}</td>
                  <td className="p-3">{DATA.animals.birds.web}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The KJV&apos;s &quot;by sevens&quot; does not say on its face whether that means seven animals or seven pairs; the WEB reads &quot;seven pairs&quot; and &quot;seven and seven&quot;. The Bible gives no total number of animals. Noah was also told to take &quot;of all food that is eaten&quot; for the family and the animals (Genesis 6:21).
          </p>
        </Section>

        <Section id="word-ark" title="How many times is Noah's ark mentioned in the Bible?" intro={`${A.noah} times in the King James Version: ${A.noahGenesis} in Genesis 6-9 and ${A.noahNT} in the New Testament. The KJV uses "ark" ${A.kjvTotal} times in all, for three different things.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Which ark</th>
                  <th className="p-3 font-semibold text-right">KJV &quot;ark&quot;</th>
                  <th className="p-3 font-semibold">WEB word</th>
                  <th className="p-3 font-semibold">Where</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b align-top">
                  <td className="p-3">Noah&apos;s ark</td>
                  <td className="p-3 text-right tabular-nums">{A.noah}</td>
                  <td className="p-3">&quot;ship&quot;, {A.webShipNoah} times</td>
                  <td className="p-3">Genesis 6-9 ({A.noahGenesis}); {A.ntRefs.join(", ")}</td>
                </tr>
                <tr className="border-b align-top">
                  <td className="p-3">The basket for the baby Moses</td>
                  <td className="p-3 text-right tabular-nums">{A.basket}</td>
                  <td className="p-3">&quot;basket&quot;</td>
                  <td className="p-3">Exodus 2:3, 2:5 (&quot;an ark of bulrushes&quot;)</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3">The ark of the covenant</td>
                  <td className="p-3 text-right tabular-nums">{A.covenant}</td>
                  <td className="p-3">&quot;ark&quot;, {A.webTotal} times</td>
                  <td className="p-3">Exodus to Revelation 11:19</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            So in the World English Bible every &quot;ark&quot; is the ark of the covenant: the WEB calls Noah&apos;s vessel a ship (&quot;Make a ship of gopher wood&quot;, Genesis 6:14). The covenant count differs by one because 2 Chronicles 5:9 has &quot;ark&quot; twice in the KJV and once in the WEB. These totals match the word page for {wordLink("ark", "ark")}. Noah himself is named {DATA.name.kjv} times in each translation ({DATA.name.kjvNoe} of the KJV&apos;s are the New Testament spelling &quot;Noe&quot;), {DATA.name.floodKjv} of them in Genesis 6-9; the same totals are on the {wordLink("noah", "Noah")} page. Counted over the full KJV and WEB text as whole words; &quot;Noah&apos;s&quot; counts as a mention of Noah.
          </p>
        </Section>

        <Section id="limits" title="What the text does not tell us" intro="Genesis gives ages and dates, not a construction schedule. Any figure shorter than the window is a guess layered on the verses.">
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li>The command in Genesis 6:13-21 has no date. Its place after Genesis 5:32 in the book does not by itself prove it came later in time; Gill, for one, says the 6:3 decree is told out of order.</li>
            <li>Genesis 6:18 mentions the sons&apos; wives as people who will enter the ark. Whether the sons were married when God spoke is an inference, and it is the step that turns {MAX_SONS} years into about 75.</li>
            <li>Ages are given in whole years, so every span in years on this page is good to about a year either way.</li>
            <li>The text names no workers, tools or crew, and says nothing of how many hours or years the building took.</li>
            <li>Feet and metres depend on the cubit, which the Bible does not define, and the day count aboard depends on the calendar, which it does not name.</li>
          </ul>
          <p className="mt-4 leading-relaxed">
            The rest of the account is in <Link href="/books/genesis" className={link}>Genesis</Link>, which gives every age from Adam to Joseph.
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every age, date, interval and measurement in cubits, and every count on this page, read by scripts/lists/how-many-years-did-noah-build-the-ark.mjs from the text at github.com/seven1m/open-bibles ({READ}). Each number is parsed from the number words in both translations, and the build stops if they disagree.</li>
            <li>{ext(SRC.aig, "Answers in Genesis, Tim Chaffey, \"How Long Did It Take for Noah to Build the Ark?\" (July 25, 2025)")}: the maximum of about 75 years, the 20-25 year suggestion, Ham at about 505 and marriage at 20, and the remark on Genesis 6:3 ({READ}).</li>
            <li>{ext(SRC.gqBuild, "GotQuestions.org, \"How long did it take Noah to build the ark?\" (updated June 6, 2024)")}: 100 to 120 years, &quot;could not have been more than 100 years&quot;, and the rounding or 20-years-later explanations ({READ}).</li>
            <li>{ext(SRC.gqAboard, "GotQuestions.org, \"How long was Noah on the ark?\" (updated June 10, 2024)")}: &quot;about 370 days&quot; ({READ}).</li>
            <li>{ext(SRC.atri, "ATRI (The John Ankerberg Show staff), \"How Long Did It Take to Build the Ark?\" (August 15, 2019)")}: 50 to 75 years, and Shem about 98 at the flood ({READ}).</li>
            <li>{ext(SRC.bh63, "Bible Hub, Genesis 6:3 commentaries")}: Ellicott&apos;s Commentary for English Readers and the Cambridge Bible for Schools and Colleges (lifespan reading); Keil and Delitzsch and Gill&apos;s Exposition (countdown reading, the 480th year, the decree told out of order) ({READ}).</li>
            <li>{ext(SRC.wFlood, "Wikipedia, \"Genesis flood narrative\"")}: the &quot;one year and 11 days&quot; and the 354 + 11 = 365 lunar and solar solution ({READ}).</li>
            <li>{ext(SRC.wLunar, "Wikipedia, \"Lunar calendar\"")}: a lunar year of twelve months is about 354 days ({READ}).</li>
            <li>{ext(SRC.wTropical, "Wikipedia, \"Tropical year\"")}: a solar year of about 365.24 days ({READ}).</li>
            <li>{ext(SRC.lht, "Life, Hope & Truth, \"The Ark's Dimensions\"")}: the 18-inch cubit and 450 by 75 by 45 feet ({READ}).</li>
            <li>{ext(SRC.wUnits, "Wikipedia, \"Biblical and Talmudic units of measurement\"")}: the Biblical cubit as 49.5 or 52.5 cm ({READ}).</li>
            <li>{ext(SRC.wArk, "Wikipedia, \"Noah's Ark\"")}: about 134 by 22 by 13 metres, 440 by 72 by 43 feet ({READ}).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about Noah and the ark" faqs={faqs} />

        <Section>
          <p className="mb-4">
            More counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
