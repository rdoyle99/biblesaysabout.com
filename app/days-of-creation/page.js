import { OG_VIDEOS } from "@/lib/og-video";
/* The days of creation: Genesis 1:1 to 2:3 day by day, what each day makes, its verses and King James and WEB word counts,
   the refrains counted per day, forming and filling, the seventh day and the sabbath, the second account, and the three
   common readings of the days. Counted by scripts/lists/days-of-creation.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/days-of-creation.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/days-of-creation`;
const D = DATA.days;
const T = DATA.totals;
const L = DATA.longest;
const S = DATA.shortest;
const H = DATA.half;
const SEC = DATA.second;
const link = "underline underline-offset-2 hover:text-primary";
const dayWords = D.reduce((s, d) => s + d.kjvWords, 0);
const pct = (x) => `${Math.round(x * 100)}%`;
const ord = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh"];
const day = (n) => D[n - 1];

const TITLE = "The 7 Days of Creation: What God Made Each Day (Genesis 1)";
const ANSWER = `The days of creation in Genesis 1:1 to 2:3 are: day 1, light; day 2, the sky; day 3, land, seas and plants; day 4, the sun, moon and stars; day 5, sea creatures and birds; day 6, land animals and people; day 7, God rests. Day 6 is the longest, ${L.kjvWords} of the ${fmt(dayWords)} King James words.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 7 days of creation in Genesis 1, day by day with verses: what God made each day, and how often "God said" (${T.said.kjv}) and "it was good" (${T.good.kjv}) appear.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What did God create on each day of creation?", a: D.map((d) => `Day ${d.n} (${d.passage}): ${d.made.charAt(0).toLowerCase() + d.made.slice(1)}`).join(". ") + "." },
  { q: "What was created on the first day?", a: `Light. "And God said, Let there be light: and there was light" (Genesis 1:3). God divided the light from the darkness and called them Day and Night (Genesis 1:4-5). The sun, moon and stars come later, on the fourth day (Genesis 1:14-19).` },
  { q: "How many days did creation take?", a: `Six days of making and a seventh of rest. Each of the first six days closes with "the evening and the morning were the ... day", and Exodus 20:11 says "in six days the LORD made heaven and earth, the sea, and all that in them is, and rested the seventh day".` },
  { q: "What did God do on the seventh day?", a: `He rested. "On the seventh day God ended his work which he had made; and he rested on the seventh day from all his work" (Genesis 2:2). He blessed the day and sanctified it (Genesis 2:3). It is the only day with no "evening and morning" line, and nothing new is made on it.` },
  { q: "Were the days of creation 24-hour days?", a: `Christians read them three main ways. The calendar-day view takes six 24-hour days (Answers in Genesis, the Institute for Creation Research). The day-age view takes each day as a long period (Reasons to Believe). The framework view reads the week as a literary structure (described by GotQuestions; BioLogos favors a literary reading). The text itself numbers the days and closes six of them with evening and morning.` },
  { q: "How could there be light before the sun?", a: `Genesis does not explain it: light is made on the first day (Genesis 1:3) and the "two great lights" on the fourth (Genesis 1:16). Readers who take the days as a framework read the order as arranged by theme, not by time, and The Thoughtful Catholic cites Thomas Aquinas for that pattern. Calendar-day readers keep the order as written.` },
];

export default function DaysOfCreation() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The days of creation", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The 7 days of creation: what God made each day", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The days of creation" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The days of creation</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated November 2, 2026. Every phrase quoted is checked against the verse in both the King James Version and the World English Bible, and every count is made from the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Days", value: D.length, note: "six of making, one of rest" },
                { label: "Times \"God said\"", value: T.said.kjv, note: "Genesis 1:3 to 1:29, KJV and WEB" },
                { label: "Times \"it was good\"", value: T.good.kjv, note: "the last \"very good\" (1:31)" },
                { label: "Day 6's share of the words", value: pct(L.share), note: `${L.kjvWords} of ${fmt(dayWords)} KJV words` },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="What God made on each day" intro={`The seven days run from Genesis 1:3 to 2:3. Genesis 1:1-2 comes first: God creates "the heaven and the earth", and the earth is "without form, and void" (the WEB says "formless and empty"). The days then give it form and fill it.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Day</th>
                  <th className="p-3 font-semibold">What was made</th>
                  <th className="p-3 font-semibold">Passage</th>
                  <th className="p-3 font-semibold text-right">Verses</th>
                  <th className="p-3 font-semibold text-right">KJV words</th>
                  <th className="p-3 font-semibold text-right">WEB words</th>
                  <th className="p-3 font-semibold text-right">"God said"</th>
                  <th className="p-3 font-semibold text-right">"It was good"</th>
                </tr>
              </thead>
              <tbody>
                {D.map((d) => (
                  <tr key={d.n} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums font-medium">{d.n}</td>
                    <td className="p-3">{d.made}</td>
                    <td className="p-3 whitespace-nowrap">{d.passage}</td>
                    <td className="p-3 text-right tabular-nums">{d.verses}</td>
                    <td className="p-3 text-right tabular-nums">{d.kjvWords}</td>
                    <td className="p-3 text-right tabular-nums">{d.webWords}</td>
                    <td className="p-3 text-right tabular-nums">{d.refrains.said.kjv}</td>
                    <td className="p-3 text-right tabular-nums">{d.refrains.good.kjv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Word counts are of the verses in each day's passage. The opening verses (Genesis 1:1-2, {DATA.opening.words.kjv} KJV words) belong to no day and are left out of the table. The KJV and WEB give the same refrain counts on every day.
          </p>
        </Section>

        <Section id="day-by-day" title="The days one by one" muted>
          <ol className="space-y-3 leading-relaxed">
            {D.map((d) => (
              <li key={d.n}>
                <span className="font-semibold">Day {d.n}: {d.short}.</span> "{d.kjvQuote.text}" ({d.kjvQuote.ref}, KJV). {d.n === 2 ? 'The WEB calls it an "expanse", and God names it "sky" (Genesis 1:8).' : null}
                {d.n === 5 ? ' The KJV\'s "great whales" are "large sea creatures" in the WEB (Genesis 1:21).' : null}
                {d.n === 6 ? ' This day has four of the ten "God said" lines, and it ends with "it was very good" (Genesis 1:31).' : null}
                {d.n === 7 ? ' God "blessed the seventh day, and sanctified it" (Genesis 2:3).' : null}
              </li>
            ))}
          </ol>
        </Section>

        <Section id="length" title="How long each day's account is" intro={`Day ${L.n} has ${L.kjvWords} King James words, more than days 1, 2 and 7 together (${day(1).kjvWords + day(2).kjvWords + day(7).kjvWords}). Day ${S.n} is the shortest at ${S.kjvWords}.`}>
          <BarRows rows={D.map((d) => ({ label: `Day ${d.n}: ${d.short}`, value: d.kjvWords }))} labelWidth="w-56" />
          <p className="mt-5 leading-relaxed">
            Most of day 6's length is about people: God's words "Let us make man in our image" (1:26), the creation of male and female (1:27), the blessing to fill the earth (1:28) and the gift of plants for food (1:29-30). In the WEB the days run {D.map((d) => d.webWords).join(", ")} words, and day 6 is again the longest.
          </p>
        </Section>

        <Section id="forming-filling" title="Forming and filling: days 1-3 and 4-6" muted>
          <p className="leading-relaxed mb-4">
            Many readers see the first three days making realms and the next three filling them. GotQuestions sets it out this way in its article on the framework view, and Ligonier describes the same parallel: light on day 1 and the lights that rule it on day 4; the waters and sky on day 2 and the sea creatures and birds on day 5; the land and plants on day 3 and the land animals and people on day 6. The pattern answers Genesis 1:2, where the earth is "without form" and "void".
          </p>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Forming</th>
                  <th className="p-3 font-semibold">Filling</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((n) => (
                  <tr key={n} className="border-b last:border-0">
                    <td className="p-3">Day {n}: {day(n).short} ({day(n).kjvWords} words)</td>
                    <td className="p-3">Day {n + 3}: {day(n + 3).short} ({day(n + 3).kjvWords} words)</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Counted, the filling days are more than twice as long: {H.fillingKjv} King James words against {H.formingKjv} for the forming days. Each filling day is longer than the day it fills.
          </p>
        </Section>

        <Section id="refrains" title="The repeated lines, counted">
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li><span className="font-medium">"God said": {T.said.kjv} times</span>, once on days 1, 2, 4 and 5, twice on day 3 and four times on day 6.</li>
            <li><span className="font-medium">"It was good": {T.good.kjv} times</span>, the last one "very good" (1:31). Day {DATA.noGood.join(", ")} is the only working day without it.</li>
            <li><span className="font-medium">"The evening and the morning": {T.eveningMorning.kjv} times</span>, closing days 1 to 6. The seventh day has none. The WEB writes "There was evening and there was morning", and numbers the days "the first day", then "a second day", "a third day" and on.</li>
            <li><span className="font-medium">"After his kind" (WEB "after its kind" or "after their kind"): {T.kind.kjv} times</span>, all on days 3, 5 and 6, for plants and animals.</li>
            <li><span className="font-medium">"And it was so": {T.wasSo.kjv} times</span>, on days 2, 3, 4 and 6.</li>
          </ul>
        </Section>

        <Section id="seventh-day" title="The seventh day and the sabbath" muted>
          <p className="leading-relaxed mb-3">
            Nothing is made on the seventh day. "Thus the heavens and the earth were finished" (Genesis 2:1), and God rested, blessed the day and sanctified it (2:2-3). The word "sabbath" does not appear in Genesis; the link is made in the commandment:
          </p>
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{DATA.sabbath.ex2011} <span className="not-italic text-sm text-muted-foreground">(Exodus 20:11, KJV)</span></blockquote>
          <p className="mt-3 leading-relaxed">
            Exodus 31:17 repeats it ("in six days the LORD made heaven and earth, and on the seventh day he rested, and was refreshed"), and Hebrews 4:4 quotes Genesis 2:2. See how often the Bible says {wordLink("sabbath", "sabbath")} and {wordLink("rest", "rest")}, and what <Link href="/biblical-numbers" className={link}>the number 7</Link> stands for elsewhere.
          </p>
        </Section>

        <Section id="second-account" title="The second account: Genesis 2:4-25">
          <p className="leading-relaxed">
            Genesis 2:4 starts again: "These are the generations of the heavens and of the earth when they were created". The next {SEC.verses} verses ({fmt(SEC.kjv)} KJV words) tell the making of the man and the woman in close-up: "the LORD God formed man of the dust of the ground" (2:7), planted a garden in {wordLink("eden", "Eden")} (2:8), and made the woman from the man's rib (2:22). Genesis 1 calls the Creator "God" and never "LORD"; Genesis 2:4-25 says "the LORD God" {SEC.lordGodKjv} times. This account has no numbered days.
          </p>
        </Section>

        <Section id="how-long" title="How long were the days?" muted>
          <p className="leading-relaxed mb-3">The text numbers the days and closes six of them with evening and morning. What that means for their length is read in three main ways, the three BioLogos lists as the most common among Christians today (Reasons to Believe lists a fourth, the analogical-day view):</p>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            <li><span className="font-medium">Calendar days.</span> Six 24-hour days followed by a day of rest. Answers in Genesis and the Institute for Creation Research hold this view; Ligonier notes the argument that "day" with an ordinal number means a solar day.</li>
            <li><span className="font-medium">Day-age.</span> Each day is a long but finite period. Reasons to Believe holds this view. Its supporters point out that the Hebrew word for day (yom) is sometimes used for a longer span of time (GotQuestions, "What is the Day-Age Theory?").</li>
            <li><span className="font-medium">Framework.</span> The week is a literary frame that groups the works by theme, which is where the forming and filling pattern comes from. GotQuestions describes it and argues against it; BioLogos favors a literary reading.</li>
          </ul>
          <p className="mt-3 leading-relaxed">This page counts what the text says and does not take a side.</p>
        </Section>

        <Section id="limits" title="Limits of the counts">
          <p className="leading-relaxed">Word counts depend on the translation (the WEB is shorter on every day) and count every word in a day's verses, including God's words and the closing lines. The day boundaries follow the "evening and morning" lines; Genesis 2:1-3 is counted as the seventh day because it is the only passage about it. The forming and filling pairs are a reading of the text, not words in it.</p>
        </Section>

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, read by scripts/lists/days-of-creation.mjs from the text at github.com/seven1m/open-bibles (counted {DATA.generated}). The build stops if a quoted phrase is missing from either translation.</li>
            <li><a href="https://www.gotquestions.org/framework-hypothesis.html" className={link} rel="noopener">GotQuestions, "What is the framework hypothesis?"</a>: days 1-3 as forming, days 4-6 as filling (read November 2, 2026).</li>
            <li><a href="https://learn.ligonier.org/devotionals/days-creation" className={link} rel="noopener">Ligonier Ministries, "The Days of Creation"</a>: the framework view and the ordinal-day argument (read November 2, 2026).</li>
            <li><a href="https://reasons.org/creation/universe/days-creation" className={link} rel="noopener">Reasons to Believe, "What Are the Days of Creation?"</a>: calendar-day, framework and day-age views (read November 2, 2026).</li>
            <li><a href="https://biologos.org/common-questions/how-long-are-the-days-of-genesis-1" className={link} rel="noopener">BioLogos, "How Long are the Days of Genesis 1?"</a>: the three readings and its literary view (read November 2, 2026).</li>
            <li><a href="https://answersingenesis.org/days-of-creation/" className={link} rel="noopener">Answers in Genesis, "Days of Creation"</a> and <a href="https://www.icr.org/topic/398" className={link} rel="noopener">the Institute for Creation Research, "Six Days of Creation"</a>: six 24-hour days (read November 2, 2026).</li>
            <li><a href="https://www.gotquestions.org/day-age-theory.html" className={link} rel="noopener">GotQuestions, "What is the Day-Age Theory?"</a>: the yom argument (read November 2, 2026).</li>
            <li><a href="https://thoughtfulcatholic.com/the-six-days-of-creation/" className={link} rel="noopener">The Thoughtful Catholic, "The Six Days of Creation"</a>: Aquinas and the framework pattern (read November 2, 2026).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about the days of creation" faqs={faqs} />

        <Section>
          <p className="mb-4">
            Read about <Link href="/books/genesis" className={link}>the book of Genesis</Link>. Count {wordLink("light", "light")}, {wordLink("heaven", "heaven")} and {wordLink("adam", "Adam")}. The ages in Genesis 5 start with Adam: see <Link href="/how-old-was-methuselah" className={link}>how old Methuselah was</Link>. More counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
