import { OG_VIDEOS } from "@/lib/og-video";
/* How tall was Goliath: 1 Samuel 17:4 in the KJV and WEB (six cubits and a span), the shorter reading of four cubits
   and a span (Septuagint, 4QSam(a), Josephus), both converted at a common and a royal cubit, his armor in kilograms,
   and every person the Bible gives a height or size for. Counted by scripts/lists/how-tall-was-goliath.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-tall-was-goliath.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-tall-was-goliath`;
const SIX = DATA.six;
const FOUR = DATA.four;
const A = DATA.assumptions;
const W = DATA.words;
const WT = DATA.weights;
const link = "underline underline-offset-2 hover:text-primary";
const hgt = (r) => `${r.ft} ft ${r.in} in`;
const row = (reading, cubit) => DATA.table.find((t) => t.reading === reading && t.cubit === cubit);
const SIX_ROYAL = row("six", "royal");
const FOUR_ROYAL = row("four", "royal");
const EGYPT_IN = 5 * A.commonCubitIn;
const EGYPT = { ft: Math.floor(EGYPT_IN / 12), in: EGYPT_IN % 12, m: Math.round(5 * A.commonCubitCm) / 100 };

const TITLE = `How Tall Was Goliath? ${hgt(SIX)} or ${hgt(FOUR)} (1 Samuel 17:4)`;
const ANSWER = `Goliath was "six cubits and a span" tall, about ${hgt(SIX)} (${SIX.m.toFixed(2)} m), in the Hebrew text that the King James Version and the World English Bible translate (1 Samuel 17:4). The Greek Septuagint, a Dead Sea Scroll of Samuel and Josephus read "four cubits and a span", about ${hgt(FOUR)} (${FOUR.m.toFixed(2)} m).`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Goliath stood six cubits and a span, about ${hgt(SIX)}, in the KJV and WEB. Why older copies say ${hgt(FOUR)}, his armor in pounds, and every height the Bible gives.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How tall was Goliath in feet?", a: `About ${hgt(SIX)} by the Hebrew text of 1 Samuel 17:4, "six cubits and a span", taking a cubit as about ${A.commonCubitIn} inches and a span as half a cubit. The Septuagint, the Dead Sea Scroll 4QSam(a) and Josephus give "four cubits and a span", about ${hgt(FOUR)}. With the longer Egyptian royal cubit the two readings come to ${hgt(SIX_ROYAL)} and ${hgt(FOUR_ROYAL)}.` },
  { q: "How tall was Goliath compared to David?", a: `The Bible never gives David's height. It says only that David was a youth (1 Samuel 17:33, 42) and that Saul, the king, stood a head and shoulders above everyone (1 Samuel 9:2). At ${hgt(SIX)} Goliath would be taller than anyone measured in modern times; at ${hgt(FOUR)} he would be a very tall man by today's standard, not a giant.` },
  { q: "Why do some Bibles say Goliath was 6 feet 9 inches?", a: `Because they follow, or footnote, the older witnesses. The Septuagint (Codex Vaticanus), the Dead Sea Scroll 4QSam(a) and Josephus (Antiquities 6.171) read "four cubits and a span". The Masoretic Hebrew text, the Latin Vulgate, the Syriac and the Aramaic Targum read "six". The NET Bible follows the shorter reading ("close to seven feet tall"); the CSB prints "nine feet, nine inches tall" and the ESV prints six with a footnote.` },
  { q: "Was Goliath taller than the tallest man ever measured?", a: `On the six-cubit reading, yes. Robert Wadlow, the tallest man with medical evidence, measured ${DATA.wadlow.cm / 100} m (8 ft 11.1 in) in 1940, per Guinness World Records. Six cubits and a span at ${A.commonCubitIn} inches is ${SIX.m.toFixed(2)} m, about ${DATA.wadlow.vsSix.in} inches more. Four cubits and a span is well inside today's human range.` },
  { q: "How much did Goliath's armor weigh?", a: `His coat of mail weighed "five thousand shekels of brass" (1 Samuel 17:5) and his spear head "six hundred shekels of iron" (17:7). At ${A.shekelG} grams a shekel that is about ${WT.coat.kg} kg (${WT.coat.lb} lb) for the coat and ${WT.spearhead.kg} kg (${WT.spearhead.lb} lb) for the spear head.` },
  { q: "Did Goliath have brothers?", a: `Yes. 1 Chronicles 20:5 says Elhanan "slew Lahmi the brother of Goliath the Gittite". 2 Samuel 21:22 names four men "born to the giant in Gath" who fell to David and his servants: Ishbi-benob, Saph, Goliath's brother and a man with six fingers on each hand and six toes on each foot.` },
];

export default function HowTallWasGoliath() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How tall was Goliath?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How tall was Goliath?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How tall was Goliath?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How tall was Goliath?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated November 2, 2026. Every verse on this page is checked in both the King James Version and the World English Bible, and the heights are worked out from the cubit lengths stated below.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Hebrew text (KJV, WEB)", value: hgt(SIX), note: "six cubits and a span" },
                { label: "Septuagint, Dead Sea Scroll", value: hgt(FOUR), note: "four cubits and a span" },
                { label: "His coat of mail", value: `${WT.coat.lb} lb`, note: "5,000 shekels of brass" },
                { label: "People given a height in numbers", value: DATA.numericPeople, note: "in the whole Bible" },
              ]}
            />
          </div>
        </section>

        <Section id="verse" title="The verse: 1 Samuel 17:4" intro="Goliath's height is given once, when he walks out to challenge Israel's army. The two translations on this site read the same.">
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{DATA.key.kjv} <span className="not-italic text-sm text-muted-foreground">(1 Samuel 17:4, KJV)</span></blockquote>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{DATA.key.web} <span className="not-italic text-sm text-muted-foreground">(1 Samuel 17:4, WEB)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            A cubit is the length of a forearm, from the elbow to the tip of the middle finger. A span, the width of a spread hand, is half a cubit: the Hebrew units run 1 cubit (amah) = 2 spans (zeret) = 6 handbreadths. So &quot;six cubits and a span&quot; is six and a half forearms. With the usual figure of about {A.commonCubitIn} inches ({A.commonCubitCm} cm) for a cubit, that is {SIX.inches} inches, or {hgt(SIX)}. Goliath came from Gath, one of the five Philistine cities with Ashdod, Gaza, Ashkelon and Ekron (1 Samuel 6:17). The verse calls him a &quot;champion&quot;: the man who fights alone for his army, as he says himself, &quot;choose you a man for you, and let him come down to me&quot; (17:8).
          </p>
        </Section>

        <Section id="table" title="Goliath's height in feet and metres" intro="Two things change the answer: which ancient copy of 1 Samuel you read, and how long you take a cubit to be. This table works out all four." muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Reading</th>
                  <th className="p-3 font-semibold">Cubit used</th>
                  <th className="p-3 font-semibold text-right">Feet</th>
                  <th className="p-3 font-semibold text-right">Metres</th>
                </tr>
              </thead>
              <tbody>
                {DATA.table.map((t) => (
                  <tr key={`${t.reading}-${t.cubit}`} className={`border-b last:border-0${t.reading === "six" && t.cubit === "common" ? " bg-primary/5" : ""}`}>
                    <td className="p-3 font-medium">{t.label}</td>
                    <td className="p-3">
                      {t.cubitName}
                      <span className="block text-xs text-muted-foreground">{t.cubitCm} cm</span>
                    </td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{hgt(t)}</td>
                    <td className="p-3 text-right tabular-nums">{t.m.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The common cubit of about {A.commonCubitIn} inches is the figure most Bible references use. The royal cubit is longer by one handbreadth (7 instead of 6); the surviving Egyptian royal cubit rod of Maya measures {A.royalCubitCm} cm ({A.royalCubitIn} inches). The Bible itself knows two cubits: Deuteronomy 3:11 measures Og&apos;s bed &quot;after the cubit of a man&quot;, and Ezekiel 40:5 uses a cubit &quot;and an hand breadth&quot;. No verse says which one 1 Samuel 17 means, so every figure on this page is an estimate. The two readings differ by two whole cubits, {DATA.gapIn} inches at the common cubit.
          </p>
          <p className="mt-3 leading-relaxed">
            For scale, Robert Wadlow, the tallest man with medical evidence, measured {DATA.wadlow.cm / 100} m (8 ft 11.1 in) in 1940, according to Guinness World Records. The Hebrew reading puts Goliath about {DATA.wadlow.vsSix.in} inches above him. The Greek reading puts him at {hgt(FOUR)}, tall for any age but not beyond anyone alive today.
          </p>
        </Section>

        <Section id="readings" title="Was Goliath 9 feet 9 or 6 feet 9?" intro="The difference is a single number word, six or four, and the ancient copies split.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Reading</th>
                  <th className="p-3 font-semibold">Where it is found</th>
                </tr>
              </thead>
              <tbody>
                {DATA.readings.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium whitespace-nowrap">{r.label}</td>
                    <td className="p-3">{r.witnesses}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The King James Version (1611) and the World English Bible translate the Masoretic Text, the Hebrew text copied by Jewish scribes in the Middle Ages. It reads six. The Septuagint, the Greek translation made before the time of Jesus, reads four in its main manuscripts. So does 4QSam(a), the large scroll of Samuel found at Qumran and dated to the first century BC, the oldest Hebrew copy of the verse we have. Josephus, writing in the first century AD, says Goliath was &quot;of four cubits and a span in tallness&quot; (Antiquities 6.171).
          </p>
          <p className="mt-3 leading-relaxed">
            Scholars disagree about which came first. One view is that a scribe&apos;s eye slipped from &quot;four cubits&quot; in verse 4 to the &quot;six hundred shekels&quot; of the spear head in verse 7 and wrote six. The other is that a later copyist lowered the number to make the story easier to believe. The Dead Sea Scroll is fragmentary at this spot: most of 1 Samuel 17:1-4 is reconstructed, though the word for four can be read. Modern Bibles split too. The NET Bible gives the shorter height, &quot;close to seven feet tall&quot;. The CSB gives &quot;nine feet, nine inches tall&quot;, and the ESV prints six with a footnote that the Septuagint, a Dead Sea Scroll and Josephus have four.
          </p>
        </Section>

        <Section id="armor" title="How heavy was Goliath's armor?" intro="1 Samuel 17:5-7 lists his gear piece by piece, and two of the pieces have weights." muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Item</th>
                  <th className="p-3 font-semibold text-right">Shekels</th>
                  <th className="p-3 font-semibold text-right">Kilograms</th>
                  <th className="p-3 font-semibold text-right">Pounds</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {[WT.coat, WT.spearhead, WT.ishbiSpear].map((w) => (
                  <tr key={w.ref} className="border-b last:border-0">
                    <td className="p-3">{w.what}</td>
                    <td className="p-3 text-right tabular-nums">{fmt(w.shekels)}</td>
                    <td className="p-3 text-right tabular-nums">{w.kg}</td>
                    <td className="p-3 text-right tabular-nums">{w.lb}</td>
                    <td className="p-3 whitespace-nowrap">{w.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The weights assume a shekel of {A.shekelG} grams, from a two-shekel stone weight of 23 grams found near the Temple area in Jerusalem and dated to the First Temple period; shekels varied by place and time. Besides the coat and spear, Goliath wore &quot;an helmet of brass&quot; and &quot;greaves of brass upon his legs&quot;, carried &quot;a target of brass between his shoulders&quot; (the WEB reads &quot;a brass javelin&quot;), and the staff of his spear was &quot;like a weaver&apos;s beam&quot;. A shield bearer walked in front of him (1 Samuel 17:7).
          </p>
          <p className="mt-3 leading-relaxed">
            David met all of this with a sling and &quot;five smooth stones out of the brook&quot; (1 Samuel 17:40). One stone &quot;sunk into his forehead; and he fell upon his face to the earth&quot; (17:49). David then cut off Goliath&apos;s head with Goliath&apos;s own sword, because &quot;there was no sword in the hand of David&quot; (17:50-51). That sword turns up again at Nob, kept by the priest &quot;wrapped in a cloth behind the ephod&quot; (1 Samuel 21:9).
          </p>
        </Section>

        <Section id="heights" title="Who else does the Bible give a height for?" intro={`We searched all ${DATA.scan.verses} King James verses with a height phrase ("cubits high", "whose height was", "great stature", "little of stature"). Only ${DATA.numericPeople} people get a height in numbers: Goliath, and an Egyptian killed by Benaiah, one of David's mighty men.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Person</th>
                  <th className="p-3 font-semibold">What the Bible says</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.people.map((p) => (
                  <tr key={p.ref} className={`border-b last:border-0 align-top${p.numeric ? " bg-primary/5" : ""}`}>
                    <td className="p-3 font-medium">{p.who}</td>
                    <td className="p-3">{p.size}</td>
                    <td className="p-3 whitespace-nowrap">{p.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The Egyptian of 1 Chronicles 11:23 was &quot;a man of great stature, five cubits high&quot;, about {EGYPT.ft} ft {EGYPT.in} in ({EGYPT.m.toFixed(2)} m) at the common cubit, and he too carried &quot;a spear like a weaver&apos;s beam&quot;. Og&apos;s iron bed was nine cubits by four, about 13 feet 6 inches by 6 feet, but the Bible gives the bed, not the man. Saul stood &quot;from his shoulders and upward&quot; above everyone (1 Samuel 9:2, 10:23), and the Bible gives no number. The other {DATA.scan.things.length} height verses are about things: Temple pillars and cherubim, Haman&apos;s gallows &quot;fifty cubits high&quot; (Esther 7:9) and Nebuchadnezzar&apos;s golden image of threescore cubits (Daniel 3:1).
          </p>
        </Section>

        <Section id="giants" title="Goliath's family: the giants of Gath" intro={`2 Samuel 21:22 says "These four were born to the giant in Gath, and fell by the hand of David, and by the hand of his servants." 1 Chronicles 20:4-8 tells the same battles.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Giant</th>
                  <th className="p-3 font-semibold">Killed by</th>
                  <th className="p-3 font-semibold">Note</th>
                  <th className="p-3 font-semibold">Verses</th>
                </tr>
              </thead>
              <tbody>
                {DATA.gath.map((g) => (
                  <tr key={g.ref} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">
                      {g.name}
                      {g.webName ? <span className="block text-xs font-normal text-muted-foreground">WEB: {g.webName}</span> : null}
                    </td>
                    <td className="p-3">{g.killedBy}</td>
                    <td className="p-3 text-muted-foreground">{g.note}</td>
                    <td className="p-3 whitespace-nowrap">
                      {g.ref}
                      {g.chronRef ? <span className="block">{g.chronRef}</span> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            2 Samuel 21:19 is the verse readers stumble on. Both translations say Elhanan killed Goliath&apos;s brother; the parallel in 1 Chronicles 20:5 names him, &quot;Lahmi the brother of Goliath the Gittite&quot;. Many scholars read 2 Samuel 21:19 as an older tradition in which Elhanan, not David, killed Goliath himself; others follow Chronicles and take the victim to be Goliath&apos;s brother.
          </p>
          <p className="mt-3 leading-relaxed">
            The word &quot;giant&quot; itself depends on the translation. The King James Version says giant or giants {W.giantKjv} times in {W.giantKjvVerses} verses across {W.giantKjvBooks} books, from Genesis 6:4 (&quot;There were giants in the earth in those days&quot;) to Job 16:14. The World English Bible uses it only {W.giantWeb} times, all in the Gath passages and Job, and elsewhere keeps the Hebrew names: Rephaim ({W.rephaimWeb} times) and Nephilim ({W.nephilimWeb}). The spies who saw &quot;the sons of Anak&quot; said &quot;we were in our own sight as grasshoppers&quot; (Numbers 13:33).
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, read by scripts/lists/how-tall-was-goliath.mjs from the text at github.com/seven1m/open-bibles (read {DATA.generated}). The build stops if a quoted phrase is missing from either translation.</li>
            <li>Josephus, Antiquities of the Jews 6.9.1 (6.171), William Whiston&apos;s translation: <a href="https://www.ccel.org/ccel/josephus/complete.ii.vii.ix.html" className={link} rel="noopener">Christian Classics Ethereal Library</a>, &quot;of four cubits and a span in tallness&quot; (read 2026-11-02).</li>
            <li>The witnesses for six and four: John D. Meade and Peter J. Gurry, <a href="https://www.crossway.org/articles/how-tall-was-goliath-a-textual-dilemma/" className={link} rel="noopener">&quot;How Tall Was Goliath? A Textual Dilemma&quot;</a>, Crossway (read 2026-11-02), and <a href="https://en.wikipedia.org/wiki/Goliath" className={link} rel="noopener">Wikipedia, Goliath</a> (read 2026-11-02). The state of 4QSam(a) at 1 Samuel 17:1-4: <a href="https://petergoeman.com/how-tall-was-goliath-9-feet-or-6-feet/" className={link} rel="noopener">Peter Goeman</a> (read 2026-11-02).</li>
            <li>Units: <a href="https://en.wikipedia.org/wiki/Ancient_Hebrew_units_of_measurement" className={link} rel="noopener">Wikipedia, Ancient Hebrew units of measurement</a> (1 cubit = 2 spans = 6 handbreadths); <a href="https://en.wikipedia.org/wiki/Cubit" className={link} rel="noopener">Wikipedia, Cubit</a> (royal cubit of 7 palms; Maya&apos;s rod, 52.3 cm); <a href="https://en.wikipedia.org/wiki/Shekel" className={link} rel="noopener">Wikipedia, Shekel</a> (the 23 g two-shekel weight, 11.5 g a shekel). All read 2026-11-02.</li>
            <li>Robert Wadlow: <a href="https://www.guinnessworldrecords.com/records/hall-of-fame/robert-wadlow-tallest-man-ever" className={link} rel="noopener">Guinness World Records</a>, 2.72 m (8 ft 11.1 in), measured 27 June 1940 (read 2026-11-02).</li>
          </ul>
        </Section>

        <FaqSection title="Questions about Goliath's height" faqs={faqs} />

        <Section>
          <p className="mb-4">
            The story is in <Link href="/books/1-samuel" className={link}>1 Samuel</Link>, chapter 17. Word counts: {wordLink("goliath", "Goliath")}, {wordLink("giants", "giants")}, {wordLink("david", "David")}, {wordLink("saul", "Saul")}, {wordLink("og", "Og")}, {wordLink("gath", "Gath")} and {wordLink("philistines", "Philistines")}. Another number people ask about: <Link href="/how-old-was-methuselah" className={link}>how old Methuselah was</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
