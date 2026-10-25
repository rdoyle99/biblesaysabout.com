import { OG_VIDEOS } from "@/lib/og-video";
/* The 613 commandments: the Talmud's 248 positive and 365 negative, where Maimonides' list draws them from in the
   five books of Moses (book, chapter, per 1,000 KJV words), the Ten Commandments within it, Rabbi Simlai's reductions,
   and what the Bible itself counts. Counted by scripts/lists/613-commandments.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/613-commandments.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/613-commandments`;
const T = DATA.talmud;
const W = DATA.words;
const TEN = DATA.ten;
const B = Object.fromEntries(DATA.byBook.map((b) => [b.name, b]));
const lev19 = DATA.lev19;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const share = (n) => (n / DATA.total < 0.01 ? "under 1%" : `${Math.round((100 * n) / DATA.total)}%`);
const byCount = [...DATA.byBook].sort((a, b) => b.count - a.count);
const WIKI_URL = "https://en.wikipedia.org/wiki/613_commandments";
const SEFARIA_URL = "https://www.sefaria.org/Makkot.23b.18";
const SEFARIA_24A_URL = "https://www.sefaria.org/Makkot.24a.17";
const JEWFAQ_URL = "https://www.jewfaq.org/613_commandments";
const link = "underline underline-offset-2 hover:text-primary";

const TITLE = `The ${DATA.total} Commandments, Counted Book by Book in the Torah`;
const ANSWER = `Jewish tradition counts ${DATA.total} commandments in the five books of Moses: ${T.positive} positive commands and ${T.negative} prohibitions, a count recorded in the Talmud (Makkot 23b). In Maimonides' list, ${byCount[0].name} supplies ${byCount[0].count} of them, ${joinAnd(byCount.slice(1).map((b) => `${b.name} ${b.count}`))}. The number ${DATA.total} itself never appears in the Bible.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The ${DATA.total} commandments are ${T.positive} positive and ${T.negative} negative (Talmud, Makkot 23b). Which Torah books and chapters they come from, counted from Maimonides' list.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 613 commandments?", a: `They are the laws Jewish tradition finds in the Torah, the five books of Moses. The Talmud says "613 mitzvot" were "stated to Moses in the Torah" (Makkot 23b). The best-known list is Maimonides'. In Torah order it begins with Genesis 1:28, "Be fruitful, and multiply", and ends with Deuteronomy 32:38, read as a ban on wine poured out to idols.` },
  { q: "How many of the 613 commandments are positive and negative?", a: `There are ${T.positive} positive and ${T.negative} negative. Rabbi Simlai in the Talmud matches the ${T.negative} prohibitions to the days of the solar year and the ${T.positive} positive commands to the limbs of the human body (Makkot 23b). The split is the tradition's count, not something the Bible states.` },
  { q: "Which books of the Bible do the 613 commandments come from?", a: `All five books of Moses. In Maimonides' list, ${joinAnd(byCount.map((b) => `${b.name} has ${b.count}`))}. Leviticus is the densest: ${B.Leviticus.per1000} commandments for every 1,000 King James words, and Leviticus 19 alone has ${lev19.count}.` },
  { q: "Are the Ten Commandments part of the 613?", a: `Yes. Of the ${DATA.total}, ${TEN.ex20Decalogue} cite the Ten Commandments in Exodus 20, with one verse yielding two. Adultery is listed at Leviticus 18:20 instead, and Deuteronomy 5:21 adds one more on desire. The Talmud counts the first two, "I am the LORD thy God" and "Thou shalt have no other gods before me", as the two Israel heard from God directly.` },
  { q: "Do Christians keep the 613 commandments?", a: `The New Testament speaks to the question in a few places. Jesus names loving God (Deuteronomy 6:5) and loving one's neighbor (Leviticus 19:18) as the two greatest commandments and says "On these two commandments hang all the law and the prophets" (Matthew 22:40). The council in Jerusalem asked Gentile believers for "no greater burden than these necessary things": to abstain from food offered to idols, blood, things strangled, and fornication (Acts 15:28-29). Paul writes that "love is the fulfilling of the law" (Romans 13:10).` },
  { q: "Does the Bible say there are 613 commandments?", a: `No. The phrase "six hundred and thirteen" appears ${W.six13Kjv} times in the King James Version and the World English Bible. The Talmud ties the number to Deuteronomy 33:4, "Moses commanded us a law": the Hebrew word Torah adds up to ${T.torahGematria}, and the first two of the Ten Commandments make ${DATA.total}.` },
];

export default function SixHundredThirteenCommandments() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The 613 commandments", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The 613 commandments, counted book by book in the Torah", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The 613 commandments" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The 613 commandments</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. The book and chapter counts are ours, from the {DATA.total} references in Maimonides&apos; list. Verses are quoted from the King James Version and checked against it, and word counts cover the full King James Version and World English Bible.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Commandments", value: DATA.total, note: `${T.positive} positive, ${T.negative} negative` },
                { label: "From Leviticus", value: B.Leviticus.count, note: `${share(B.Leviticus.count)} of the list` },
                { label: "In Leviticus 19", value: lev19.count, note: `from ${lev19.versesCited} of its ${lev19.versesKjv} verses` },
                { label: `"Commandment(s)" in the KJV`, value: W.commandKjv, note: `${W.commandKjvTorah} of them in the Torah` },
              ]}
            />
          </div>
        </section>

        <Section id="books" title="Where the 613 commandments come from, book by book" intro={`Every one of the ${DATA.total} comes from the five books of Moses. Leviticus and Deuteronomy together supply ${B.Leviticus.count + B.Deuteronomy.count}, ${share(B.Leviticus.count + B.Deuteronomy.count)} of the list. Genesis supplies only ${B.Genesis.count}.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold text-right">Commandments</th>
                  <th className="p-3 font-semibold text-right">Share</th>
                  <th className="p-3 font-semibold text-right">KJV words</th>
                  <th className="p-3 font-semibold text-right">Per 1,000 words</th>
                  <th className="p-3 font-semibold">Chapter with most</th>
                </tr>
              </thead>
              <tbody>
                {DATA.byBook.map((b) => (
                  <tr key={b.name} className="border-b last:border-0">
                    <td className="p-3 font-medium"><Link href={`/books/${b.slug}`} className={link}>{b.name}</Link></td>
                    <td className="p-3 text-right tabular-nums">{b.count}</td>
                    <td className="p-3 text-right tabular-nums">{share(b.count)}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(b.wordsKjv)}</td>
                    <td className="p-3 text-right tabular-nums">{b.per1000}</td>
                    <td className="p-3 whitespace-nowrap">{b.count > 2 ? `${b.name} ${b.topChapter.ch} (${b.topChapter.count})` : "Genesis 1, 32 (1 each)"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Leviticus is the shortest of the five books by words but has the most commandments: {B.Leviticus.per1000} for every 1,000 King James words, against {B.Deuteronomy.per1000} in Deuteronomy, {B.Exodus.per1000} in Exodus and {B.Numbers.per1000} in Numbers. Of the {DATA.torahChapters} chapters in the Torah, {DATA.chaptersWithAny} hold at least one commandment. Genesis has only two. The first is having children, from &quot;Be fruitful, and multiply&quot; (Genesis 1:28). The second is not eating the sinew of the thigh, after Jacob wrestled through the night (Genesis 32:24): &quot;Therefore the children of Israel eat not of the sinew which shrank&quot; (Genesis 32:32, numbered 32:33 in Hebrew Bibles).
          </p>
        </Section>

        <Section id="chapters" title="The chapters with the most commandments" intro={`Leviticus 19, the chapter that opens "Ye shall be holy: for I the LORD your God am holy", has ${lev19.count} commandments drawn from ${lev19.versesCited} of its ${lev19.versesKjv} verses, nearly twice as many as any other chapter.`} muted>
          <BarRows rows={DATA.topChapters.map((c) => ({ label: c.ref, value: c.count }))} labelWidth="w-36" />
          <p className="mt-5 leading-relaxed">
            Leviticus 19 is where &quot;thou shalt love thy neighbour as thyself&quot; stands (verse 18), beside laws on gleaning, wages, honest weights and respect for the old. Leviticus 18 is the chapter of forbidden unions, Leviticus 23 the calendar of feasts, and Leviticus 25 the sabbath year and the jubilee. Chapters here follow the King James numbering. In Hebrew Bibles a few Torah chapters break in different places, and {DATA.shifted} of the {DATA.total} references carry a different chapter or verse number there. The {DATA.tltRows} references from Exodus 20 and Deuteronomy 5, the chapters of the Ten Commandments, are numbered more than one way even among Hebrew editions, so this page places them by chapter only.
          </p>
        </Section>

        <Section id="count" title={`${T.positive} positive and ${T.negative} negative: where the number comes from`}>
          <p className="leading-relaxed">
            The count comes from the Talmud, not the Bible. In tractate Makkot 23b, Rabbi Simlai teaches that {DATA.total} commandments were given to Moses, &quot;365 prohibitions corresponding to the number of days in the solar year, and 248 positive mitzvot corresponding to the number of a person&apos;s limbs.&quot; Rav Hamnuna then points to Deuteronomy 33:4, &quot;Moses commanded us a law&quot;. The letters of the Hebrew word Torah add up to {T.torahGematria}, the commandments taught through Moses, and the first two of the Ten Commandments, heard from God himself, bring the total to {DATA.total}.
          </p>
          <p className="mt-3 leading-relaxed">
            The Talmud gives the total but no list. Later rabbis drew up lists of their own. The best-known is Maimonides&apos;, which Judaism 101 calls probably the most widely accepted, though not the only one. It is the list counted on this page, using the verse references as Wikipedia gives them. Each commandment is placed at one verse, the first the list cites for it.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Who</th>
                  <th className="p-3 font-semibold text-right">Reduced to</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">KJV words</th>
                </tr>
              </thead>
              <tbody>
                {DATA.reductions.map((r) => (
                  <tr key={r.ref} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{r.who}</td>
                    <td className="p-3 text-right tabular-nums">{r.n}</td>
                    <td className="p-3 whitespace-nowrap">{r.ref}</td>
                    <td className="p-3 italic">&quot;{r.quote}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The same passage goes on (Makkot 23b-24a): David reduced the {DATA.total} to eleven in Psalm 15, Isaiah to six, Micah to three, Isaiah again to two, and Amos to one, &quot;Seek ye me, and ye shall live&quot;. A rabbi objects to Amos, and the Talmud settles on Habakkuk 2:4, &quot;the just shall live by his faith&quot;. Paul quotes the same line in Romans 1:17.
          </p>
        </Section>

        <Section id="ten" title="Are the Ten Commandments part of the 613?" intro={`Yes. Maimonides' list cites Exodus 20 ${TEN.ex20} times: ${TEN.ex20Decalogue} from the Ten Commandments and ${TEN.ex20Altar} from the laws that follow them.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Commandment (our summary)</th>
                  <th className="p-3 font-semibold">KJV verse</th>
                  <th className="p-3 font-semibold text-right">In the 613</th>
                </tr>
              </thead>
              <tbody>
                {TEN.decalogue.map((d) => (
                  <tr key={d.summary} className="border-b last:border-0">
                    <td className="p-3">{d.summary}</td>
                    <td className="p-3 whitespace-nowrap">{d.ref}</td>
                    <td className="p-3 text-right tabular-nums">{d.rows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            &quot;Thou shalt not commit adultery&quot; (Exodus 20:14) is the one of the ten the list places elsewhere, at Leviticus 18:20. The tenth gets a second row from its repetition in Deuteronomy 5:21, &quot;Neither shalt thou desire thy neighbour&apos;s wife&quot;. The list reads &quot;Thou shalt not steal&quot; as a ban on kidnapping and places theft of property at Leviticus 19:11. The three laws after the ten are: no gods of silver or gold beside God (Exodus 20:23), which the list reads as a ban on making human figures even for decoration; no altar of hewn stone (20:25); and no steps up to the altar (20:26).
          </p>
          <p className="mt-3 leading-relaxed">
            The Bible itself uses the words &quot;ten commandments&quot; three times, in both translations: {joinAnd(W.tenCommandmentsKjv)}. Deuteronomy 4:13 says God &quot;declared unto you his covenant, which he commanded you to perform, even ten commandments; and he wrote them upon two tables of stone.&quot;
          </p>
        </Section>

        <Section id="examples" title="Examples from the list" intro="A sample from across the five books, in our own words, with the King James verse each is drawn from. Where Hebrew Bibles number the verse differently, the Hebrew reference is given too.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Commandment (our summary)</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">KJV words</th>
                </tr>
              </thead>
              <tbody>
                {DATA.examples.map((e) => (
                  <tr key={e.kjvRef + e.summary} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{e.summary}</td>
                    <td className="p-3 whitespace-nowrap">
                      {e.kjvRef}
                      {e.heRef !== e.kjvRef ? <span className="block text-xs text-muted-foreground">Hebrew {e.heRef.replace(/^.+ /, "")}</span> : null}
                    </td>
                    <td className="p-3 italic">&quot;{e.quote}&quot;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Not all of the {DATA.total} can be kept today. Judaism 101 (jewfaq.org) notes that the ones that cannot be observed mostly concern the Temple, its sacrifices and services, because the Temple no longer stands, and criminal procedure, because the ancient state of Israel no longer exists.
          </p>
        </Section>

        <Section id="bible" title="What the Bible itself counts" muted>
          <p className="leading-relaxed">
            &quot;Commandment&quot; or &quot;commandments&quot; appears {W.commandKjv} times in the King James Version, in {W.commandKjvVerses} verses, and {W.commandWeb} times in the World English Bible. Only {W.commandKjvTorah} of the King James uses fall in the five books of Moses ({W.commandWebTorah} in the WEB), where the laws themselves are written. {W.commandKjvTop.book} has the most of any book, {W.commandKjvTop.count}. The phrase &quot;six hundred and thirteen&quot; appears in neither translation.
          </p>
          <p className="mt-3 leading-relaxed">
            Asked &quot;which is the great commandment in the law?&quot;, Jesus answered with two of the {DATA.total}: &quot;Thou shalt love the Lord thy God with all thy heart&quot;, from Deuteronomy 6:5. The second was &quot;Thou shalt love thy neighbour as thyself&quot;, from Leviticus 19:18. &quot;On these two commandments hang all the law and the prophets&quot; (Matthew 22:36-40). Paul quotes several of the Ten Commandments and sums them up the same way: &quot;love is the fulfilling of the law&quot; (Romans 13:9-10).
          </p>
        </Section>

        <FaqSection title="Questions about the 613 commandments" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every word count on this page, from the text at github.com/seven1m/open-bibles, checked and counted by scripts/lists/613-commandments.mjs (read and counted {DATA.generated}).</li>
            <li><a href={WIKI_URL} className={link} rel="noopener">Wikipedia, &quot;613 commandments&quot;</a>, section &quot;Maimonides&apos; list, canonical order&quot;: the {DATA.total} verse references counted by book and chapter on this page (read 2026-10-25). Only the references are used; the summaries are our own.</li>
            <li><a href={SEFARIA_URL} className={link} rel="noopener">Babylonian Talmud, Makkot 23b</a> and <a href={SEFARIA_24A_URL} className={link} rel="noopener">24a</a>, William Davidson Edition English translation, on Sefaria: Rabbi Simlai&apos;s {DATA.total}, {T.negative} and {T.positive}, Rav Hamnuna&apos;s {T.torahGematria} plus {T.fromGod}, and the reductions to eleven, six, three, two and one (read 2026-10-25).</li>
            <li><a href={JEWFAQ_URL} className={link} rel="noopener">Judaism 101, &quot;A List of the 613 Mitzvot&quot;</a>: Maimonides&apos; list as the most widely accepted but not the only one, and the commandments that cannot be observed today (read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read the books the commandments come from: <Link href="/books/exodus" className={link}>Exodus</Link>, <Link href="/books/leviticus" className={link}>Leviticus</Link>, <Link href="/books/numbers" className={link}>Numbers</Link> and <Link href="/books/deuteronomy" className={link}>Deuteronomy</Link>, and where they sit on <Link href="/old-testament-books-in-order" className={link}>the Old Testament books in order</Link>. The events around them are on <Link href="/ten-plagues-of-egypt" className={link}>the ten plagues of Egypt</Link> and <Link href="/twelve-tribes-of-israel" className={link}>the twelve tribes of Israel</Link>. Word counts: {wordLink("moses", "Moses")}, {wordLink("sabbath", "sabbath")} and {wordLink("love", "love")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
