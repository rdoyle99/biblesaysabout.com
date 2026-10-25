import { OG_VIDEOS } from "@/lib/og-video";
/* The ten plagues of Egypt in order: passage, length, how each began, what the magicians did, where Israel was
   spared, and who the text says hardened Pharaoh's heart. Counted by scripts/build-bible-lists.mjs. */

import Link from "next/link";
import { LISTS, LISTS_DATE, joinList } from "@/lib/bibleLists";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/ten-plagues-of-egypt`;
const P = LISTS.plagues;
const rows = P.rows;
const H = P.harden;
const totalWords = rows.reduce((s, r) => s + r.kjvWords, 0);
const longest = [...rows].sort((a, b) => b.kjvWords - a.kjvWords)[0];
const shortest = [...rows].sort((a, b) => a.kjvWords - b.kjvWords)[0];
const refsBy = (who) => H.rows.filter((r) => r.who === who).map((r) => r.ref.replace("Exodus ", ""));
const pharaohRefs = refsBy("Pharaoh");
const lordRefs = refsBy("LORD");
const promiseRefs = refsBy("LORD, promised");
const unsetRefs = refsBy("unspecified");
const num = (n) => ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"][n];
const begins = {
  river: "Moses meets Pharaoh at the river in the morning",
  palace: "Moses is sent in to Pharaoh",
  none: "No warning",
  announced: "Announced before Moses leaves Pharaoh",
};
const groupNo = rows.filter((r) => r.begins === "none").map((r) => r.n);
const spared = rows.filter((r) => r.goshen).map((r) => r.n);
const magicCopied = rows.filter((r) => r.magicians?.could).map((r) => r.n);
const magicFailed = rows.filter((r) => r.magicians && !r.magicians.could).map((r) => r.n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const TITLE = "The 10 Plagues of Egypt in Order, With Bible Verses";
const ANSWER = `The ten plagues of Egypt, in the order Exodus 7:14 to 12:32 gives them, are water turned to blood, frogs, lice, flies, the death of livestock, boils, hail, locusts, darkness and the death of the firstborn. The text says Pharaoh hardened his own heart ${num(pharaohRefs.length)} times, in the plagues of frogs, flies and hail. The first time it says the LORD hardened it is Exodus ${H.firstLord.replace("Exodus ", "")}, with the sixth plague.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 10 plagues of Egypt in order with their Exodus verses, what the magicians did, where Israel was spared, and the ${H.rows.length} verses on who hardened Pharaoh's heart.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "What are the 10 plagues of Egypt in order?", a: `${rows.map((r) => `${r.n}. ${r.name}`).join("; ")}. Exodus 7:14 begins the first and Exodus 12:29 records the last.` },
  { q: "Who hardened Pharaoh's heart?", a: `The text gives both answers. Pharaoh hardens his own heart in ${joinList(pharaohRefs.map((r) => "Exodus " + r))}. The LORD hardens it in ${joinList(lordRefs.map((r) => "Exodus " + r))}, and he says he will in ${joinList(promiseRefs.map((r) => "Exodus " + r))}. In ${num(unsetRefs.length)} more verses the heart "was hardened" with no one named as the cause.` },
  { q: "Which plagues did the Egyptian magicians copy?", a: `The magicians copied the first two, blood (Exodus 7:22) and frogs (Exodus 8:7). With the lice they "could not" (Exodus 8:18), and by the boils they "could not stand before Moses" (Exodus 9:11).` },
  { q: "Which plagues did the Israelites not suffer?", a: `The text says Israel was spared in plagues ${joinList(spared.map(String))}: flies (Exodus 8:22), livestock (9:4), hail (9:26), darkness (10:23) and the firstborn (11:7). For blood, frogs, lice, boils and locusts it does not say either way.` },
  { q: "Does the Bible call them the ten plagues?", a: `Not in those words. "Plague" appears in only ${P.plagueWord.exodus7to12.length} verses of Exodus 7 to 12 (${P.plagueWord.exodus7to12.join(", ").replaceAll("Exodus ", "")}); "signs" or "wonders" appears in ${P.signsWondersVerses} verses of those chapters. Exodus 11:1 calls the last "one plague more", but no verse in Exodus 7 to 12 numbers the plagues as ten.` },
  { q: "Why did God send the plagues?", a: `Exodus 12:12 gives one reason in the text: "against all the gods of Egypt I will execute judgment: I am the LORD". Exodus 9:14 gives another, "that thou mayest know that there is none like me in all the earth".` },
];

export default function TenPlagues() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The ten plagues of Egypt", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The 10 plagues of Egypt in order, with Bible verses", description: ANSWER, url: URL, datePublished: LISTS_DATE, dateModified: LISTS_DATE }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className="underline underline-offset-2 hover:text-primary">{label}</Link> : label);
  const heartCell = (r) => {
    const who = r.harden.who === "LORD" ? "The LORD hardened it" : r.harden.who === "Pharaoh" ? "Pharaoh hardened it" : "\"Was hardened\", no one named";
    return `${who} (${r.harden.ref.replace("Exodus ", "")})`;
  };
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The ten plagues of Egypt" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The 10 plagues of Egypt</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 24, 2026. Verses are quoted from the King James Version, with the World English Bible's wording where it differs. Word counts are of the verses in each passage.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Plagues", value: rows.length, note: "Exodus 7:14 to 12:32" },
                { label: "Words in the ten accounts", value: fmt(totalWords), note: "King James Version" },
                { label: "Times Pharaoh hardens his own heart", value: pharaohRefs.length, note: `Exodus ${pharaohRefs.join(", ")}` },
                { label: "First time the LORD is said to harden it", value: H.firstLord.replace("Exodus ", ""), note: "the sixth plague" },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="The plagues in order" intro="Each row gives the passage, how long the King James account is, how Moses was sent, what the magicians did, whether the text says Israel was spared, and what the text says about Pharaoh's heart at the end of it.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Plague</th>
                  <th className="p-3 font-semibold">Passage</th>
                  <th className="p-3 font-semibold text-right">Words</th>
                  <th className="p-3 font-semibold">How it begins</th>
                  <th className="p-3 font-semibold">Magicians</th>
                  <th className="p-3 font-semibold">Israel spared</th>
                  <th className="p-3 font-semibold">Pharaoh's heart</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.n} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{r.n}</td>
                    <td className="p-3 font-medium">{r.name}{r.webName !== r.kjvName ? <span className="block text-xs font-normal text-muted-foreground">KJV "{r.kjvName}", WEB "{r.webName}"</span> : null}</td>
                    <td className="p-3 whitespace-nowrap">{r.passage}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(r.kjvWords)}</td>
                    <td className="p-3">{begins[r.begins]}{r.warned ? ` (${r.warned.replace("Exodus ", "")})` : ""}</td>
                    <td className="p-3">{r.magicians ? (r.magicians.could ? "Did the same" : "Could not") : "Not mentioned"} {r.magicians ? `(${r.magicians.ref.replace("Exodus ", "")})` : ""}</td>
                    <td className="p-3">{r.goshen ? `Yes (${r.goshen.replace("Exodus ", "")})` : "Not stated"}</td>
                    <td className="p-3">{heartCell(r)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The KJV and WEB use the same names except for the fifth plague, which the King James calls a "murrain" and the World English Bible a "pestilence" (Exodus 9:3). The last plague is told in two places: the warning in Exodus 11:1-10 and the event in Exodus 12:29-32, so its word count adds both. The Passover instructions in between (Exodus 12:1-28) are not counted.
          </p>
        </Section>

        <Section id="length" title="How long each account is" intro={`${longest.name} has the longest account at ${fmt(longest.kjvWords)} words and ${shortest.name.toLowerCase()} the shortest at ${fmt(shortest.kjvWords)}.`} muted>
          <BarRows rows={rows.map((r) => ({ label: `${r.n}. ${r.name}`, value: r.kjvWords }))} labelWidth="w-48" />
          <p className="mt-5 leading-relaxed">
            The ten accounts total {fmt(totalWords)} King James words. Hail and locusts take {fmt(rows[6].kjvWords + rows[7].kjvWords)} of them, {((rows[6].kjvWords + rows[7].kjvWords) / totalWords * 100).toFixed(0)}%, because Pharaoh bargains with Moses in both. The three plagues with no warning (lice, boils and darkness) are short.
          </p>
        </Section>

        <Section id="three-sets" title="Three sets of three, then the last">
          <p className="leading-relaxed mb-3">
            By the verses, the first nine split into three sets by how Moses is sent. In plagues 1, 4 and 7 he meets Pharaoh at the river in the morning (Exodus 7:15, 8:20, 9:13). In plagues 2, 5 and 8 he is told to go in to Pharaoh (Exodus 8:1, 9:1, 10:1). Plagues {joinList(groupNo.map(String))}, lice, boils and darkness, come with no warning. The tenth stands apart: it is announced as "one plague more" (Exodus 11:1) and strikes at midnight.
          </p>
          <p className="leading-relaxed">
            The text also separates Israel from Egypt from the fourth plague on. Israel is spared in plagues {joinList(spared.map(String))}. The magicians go from matching Moses in the first two plagues ({joinList(magicCopied.map(String))}) to failing at the lice ({joinList(magicFailed.slice(0, 1).map(String))}) and then to standing helpless in the boils ({joinList(magicFailed.slice(1).map(String))}).
          </p>
        </Section>

        <Section id="heart" title="Who hardened Pharaoh's heart?" intro={`${H.rows.length} verses in Exodus 4 to 14 speak of Pharaoh's heart being hardened. They split ${num(pharaohRefs.length)} for Pharaoh, ${num(lordRefs.length)} for the LORD as a past event, ${num(promiseRefs.length)} as a promise and ${num(unsetRefs.length)} with no one named.`} muted>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">Pharaoh hardens his own heart ({pharaohRefs.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Exodus {pharaohRefs.join(", ")}: the frogs, the flies and the hail. In each case Pharaoh sees relief and goes back on his word.</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">The LORD hardens it ({lordRefs.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Exodus {lordRefs.join(", ")}: the boils, the locusts (10:1 before them and 10:20 after), the darkness, the last plague and the pursuit at the sea.</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">The LORD says he will ({promiseRefs.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Exodus {promiseRefs.join(", ")}: before Moses goes to Egypt, before the signs begin, and before the crossing. Exodus {H.egyptians.map((r) => r.replace("Exodus ", "")).join(", ")} is left out of the counts because it says the LORD will harden the hearts of the Egyptians, not Pharaoh's.</p>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold mb-2">"Was hardened," no one named ({unsetRefs.length})</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">Exodus {unsetRefs.join(", ")}: the blood, the lice, the livestock, and after the hail. The King James Version of 7:13 reads "he hardened Pharaoh's heart" without saying who "he" is.</p>
            </div>
          </div>
          <p className="mt-5 leading-relaxed">
            Read in order, the verses follow a pattern. The LORD promises it twice before the first plague (4:21, 7:3). Pharaoh is the one who hardens his heart in the second, fourth and seventh plagues. The first verse that names the LORD as the one who hardened it is in the sixth, and after the hail (9:34) every verse that names who did it says the LORD (10:1, 10:20, 10:27, 11:10, 14:8). Readers disagree about what this means for Pharaoh's choice, and the verses above are the evidence both sides cite.
          </p>
        </Section>

        <Section id="limits" title="Where the text is silent">
          <p className="leading-relaxed">The columns say "not mentioned" or "not stated" when the passage does not speak to that point, which does not mean it did not happen. The three sets of three are a reading of how Moses is sent in each passage, and other lists of the plagues group them differently. The word counts include everything in the verses, such as speeches and instructions, not only the plague itself.</p>
        </Section>

        <FaqSection title="Questions about the ten plagues" faqs={faqs} />

        <Section id="sources" title="Sources" muted>
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse and count on this page, read by scripts/build-bible-lists.mjs from the text at github.com/seven1m/open-bibles (read and counted {LISTS_DATE}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Count the words yourself on {wordLink("blood", "blood")}, {wordLink("darkness", "darkness")} and {wordLink("plague", "plague")}. See <Link href="/twelve-tribes-of-israel" className="underline underline-offset-2 hover:text-primary">the twelve tribes of Israel</Link>, <Link href="/books/exodus" className="underline underline-offset-2 hover:text-primary">the book of Exodus</Link>, <Link href="/words/moses" className="underline underline-offset-2 hover:text-primary">how many times Moses is mentioned</Link>, <Link href="/613-commandments" className="underline underline-offset-2 hover:text-primary">the 613 commandments of the Law</Link>, and <Link href="/bible-by-the-numbers" className="underline underline-offset-2 hover:text-primary">the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={LISTS_DATE} />
        </Section>
      </div>
    </>
  );
}
