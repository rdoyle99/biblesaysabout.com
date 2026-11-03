import { OG_VIDEOS } from "@/lib/og-video";
/* How old was Jesus when he died: the three verses that give Jesus an age, the Passovers John names, the
   historians' dates for the birth (6 to 4 BC) and the crucifixion (AD 30 or 33), and every "passover" in the Gospels.
   Counted by scripts/lists/how-old-was-jesus-when-he-died.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-old-was-jesus-when-he-died.json";
import { getWord, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-old-was-jesus-when-he-died`;
const D = DATA.dating;
const P = DATA.passover;
const A = DATA.anchors;
const X = DATA.extra;
const link = "underline underline-offset-2 hover:text-primary";
const GOSPELS = ["Matthew", "Mark", "Luke", "John"];
const ageVerse = (ref) => DATA.ages.find((a) => a.ref === ref);

const TITLE = `How Old Was Jesus When He Died? About ${D.low} to ${D.high} Years`;
const ANSWER = `The Bible never gives Jesus' age at his death. Luke 3:23 says he was "about thirty" when his ministry began, and John names ${DATA.namedPassovers} Passovers after that, which gives the traditional answer of ${D.tradition}. Most historians date his birth to 6 to 4 BC and the crucifixion to AD 30 or 33, so he was about ${D.low} to ${D.high}.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The Bible gives no age at death. Luke 3:23 says "about thirty", John names ${DATA.namedPassovers} Passovers: the traditional ${D.tradition}. Historians' dates give ${D.low} to ${D.high}.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How old was Jesus when he died?", a: `No verse says. The traditional answer is ${D.tradition}: he was "about thirty years of age" when he began (Luke 3:23, KJV), and John names ${DATA.namedPassovers} Passovers in the ministry that followed (John 2:13, 6:4, 11:55). With a birth in 6 to 4 BC and a death in AD 30 or 33, the dates historians use, he was between ${D.low} and ${D.high}.` },
  { q: "How many years did Jesus live?", a: `About ${D.low} to ${D.high} years on the dates most historians accept. Counting from 4 BC to AD 30 gives ${D.grid.find((g) => g.bc === 4).ages.find((a) => a.ad === 30).years} years, and from 6 BC to AD 33 gives ${D.grid.find((g) => g.bc === 6).ages.find((a) => a.ad === 33).years}, because the calendar goes from 1 BC straight to AD 1 with no year zero.` },
  { q: "Was Jesus 33 when he died?", a: `Maybe. ${D.tradition} is what you get by adding about three years of ministry, from John's three Passovers, to the "about thirty" of Luke 3:23. On the historians' dates he was ${D.tradition} only if he was born in 4 BC and died in AD 30; the other pairings give ${D.low + 1} to ${D.high}.` },
  { q: "Why do people say Jesus was born before 1 AD?", a: `Matthew 2:1 says Jesus was born "in the days of Herod the king", and Matthew 2:19 says the family returned "when Herod was dead". Most historians date Herod's death to 4 BC, so the birth falls about 6 to 4 BC. The AD count, worked out by the monk Dionysius Exiguus in the 500s, put it a few years too late.` },
  { q: "How long was Jesus' ministry?", a: `About three years if you follow John, who names ${DATA.namedPassovers} Passovers (John 2:13, 6:4, 11:55) and an unnamed "feast of the Jews" (John 5:1). Matthew, Mark and Luke name a Passover during the ministry only in its last week (Matthew 26, Mark 14, Luke 22), so their accounts could fit in about a year.` },
  { q: "What does John 8:57 say about Jesus' age?", a: `"Thou art not yet fifty years old, and hast thou seen Abraham?" (John 8:57, KJV). His opponents say it near the end of his ministry. It only says he was under fifty. It is one of the ${DATA.ages.length} verses in the Gospels that give Jesus an age.` },
];

export default function HowOldWasJesusWhenHeDied() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How old was Jesus when he died?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How old was Jesus when he died?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const thirty = ageVerse("Luke 3:23");
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How old was Jesus when he died?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How old was Jesus when he died?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated November 2, 2026. Every verse on this page is checked in both the King James Version and the World English Bible. The dates for Herod, Pilate and the crucifixion come from the historians named under Sources.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Traditional age", value: D.tradition, note: "about 30 + 3 Passovers" },
                { label: "Range on historians' dates", value: `${D.low} to ${D.high}`, note: "born 6 to 4 BC, died AD 30 or 33" },
                { label: "Verses that give Jesus an age", value: DATA.ages.length, note: "12, about 30, under 50" },
                { label: "Passovers John names", value: DATA.namedPassovers, note: "plus 1 unnamed feast" },
              ]}
            />
          </div>
        </section>

        <Section id="verses" title="Every verse that gives Jesus an age" intro={`Only ${DATA.ages.length} verses in the four Gospels give Jesus an age, and none of them is at his death. The other ${DATA.otherAgeVerses.length} Gospel verses with an age in them are about other people.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Age</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">KJV</th>
                  <th className="p-3 font-semibold">When</th>
                </tr>
              </thead>
              <tbody>
                {DATA.ages.map((a) => (
                  <tr key={a.ref} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium whitespace-nowrap">{a.age}</td>
                    <td className="p-3 whitespace-nowrap">{a.ref}</td>
                    <td className="p-3 italic">{a.kjv}</td>
                    <td className="p-3 text-muted-foreground">{a.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The verse that matters most is Luke 3:23. The KJV reads: &quot;{thirty.kjv}&quot; The World English Bible: &quot;{thirty.web}&quot;</p>
          <p className="mt-3 leading-relaxed">
            Luke dates the start of John the Baptist&apos;s preaching to &quot;the fifteenth year of the reign of Tiberius Caesar, Pontius Pilate being governor of Judaea&quot; (Luke 3:1), and Jesus is baptized soon after. Counted from Augustus&apos;s death in AD 14, as the Roman historians count it, that is AD 28 or 29.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The other age verses: {DATA.otherAgeVerses.map((o) => `${o.ref} (${o.who})`).join("; ")}. Found by a search of the four Gospels in the KJV for &quot;years old&quot;, &quot;years of age&quot; and &quot;of age&quot;; the build stops if a new one turns up.
          </p>
        </Section>

        <Section id="passovers" title={`Why the traditional answer is ${D.tradition}`} intro={`The number ${D.tradition} is added up, not stated: about thirty at the start, plus the ${DATA.namedPassovers} Passovers John names during the ministry. Passover came once a year, so ${DATA.namedPassovers} of them mean at least two years, more with the months before the first one, which is why the ministry is usually given as about three years.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Feast</th>
                  <th className="p-3 font-semibold">Verse</th>
                  <th className="p-3 font-semibold">WEB</th>
                  <th className="p-3 font-semibold">What happens</th>
                </tr>
              </thead>
              <tbody>
                {DATA.feasts.map((f) => (
                  <tr key={f.ref} className={`border-b last:border-0 align-top${f.named ? "" : " text-muted-foreground"}`}>
                    <td className="p-3 tabular-nums">{f.n ?? "?"}</td>
                    <td className="p-3 font-medium">{f.name}</td>
                    <td className="p-3 whitespace-nowrap">{f.ref}</td>
                    <td className="p-3 italic">{f.web}</td>
                    <td className="p-3">{f.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The last Passover is the week of the cross. Jesus comes to Bethany &quot;six days before the passover&quot; (John 12:1), and he is sentenced on &quot;the preparation of the passover, and about the sixth hour&quot; (John 19:14). Mark adds that it was &quot;the preparation, that is, the day before the sabbath&quot; (Mark 15:42), a Friday. John also names a Feast of Tabernacles (John 7:2) and the Feast of the Dedication, &quot;and it was winter&quot; (John 10:22) between the second and third Passovers.
          </p>
          <p className="mt-3 leading-relaxed">
            Matthew, Mark and Luke tell it differently. Every Passover they name falls in the last week ({GOSPELS.slice(0, 3).map((b) => `${b} ${P.synoptic[b].chapters.filter((c) => c !== 2).join(" and ")}`).join(", ")}), apart from Luke&apos;s story of Jesus at twelve (Luke 2:41-42). Taken alone, their accounts could fit the ministry into about a year, which is why the count of three years rests on John.
          </p>
        </Section>

        <Section id="dates" title="How many years did Jesus live? The historians' dates" intro="The Gospels tie the birth and the death to rulers whose years are known from Roman and Jewish history. That gives a range, not a single number.">
          <p className="leading-relaxed">
            <strong>The birth.</strong> Matthew says Jesus &quot;was born in Bethlehem of Judaea in the days of Herod the king&quot; (Matthew 2:1) and that Herod killed the boys &quot;from two years old and under&quot; (Matthew 2:16). The family came back from Egypt &quot;when Herod was dead&quot; (Matthew 2:19). Most historians date Herod&apos;s death to 4 BC, and a minority to 1 BC. So most scholars place the birth between 6 and 4 BC. Our calendar&apos;s year 1 came from Dionysius Exiguus, a monk of the 500s, and it put the birth a few years after Herod&apos;s death.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>The death.</strong> Jesus was crucified under &quot;Pontius Pilate the governor&quot; (Matthew 27:2), who governed Judaea from about AD 26 to 36, with &quot;Caiaphas, which was the high priest that same year&quot; (John 18:13). The day was a Friday at Passover. Astronomers working out the Jewish calendar find two Fridays in Pilate&apos;s term that fit: 7 April AD 30 and 3 April AD 33. Those are the two years most often given.
          </p>
          <div className="mt-5 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Born</th>
                  {D.death.map((ad) => (
                    <th key={ad} className="p-3 font-semibold text-right">Died AD {ad}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {D.grid.map((g) => (
                  <tr key={g.bc} className="border-b last:border-0">
                    <td className="p-3 font-medium">{g.bc} BC</td>
                    {g.ages.map((a) => (
                      <td key={a.ad} className="p-3 text-right tabular-nums">{a.years} years</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Each cell is the number of years from the birth year to the death year. There is no year zero: 1 BC is followed by AD 1, so 4 BC to AD 30 is 4 + 30 - 1 = {D.grid.find((g) => g.bc === 4).ages.find((a) => a.ad === 30).years} years. The months are unknown, so any cell can be a year less. The youngest case is {D.low}, the oldest {D.high}, and the traditional {D.tradition} sits at the young end. A death in AD 30 fits a ministry that began in AD 28 or 29 only if it lasted a year or two; AD 33 leaves room for John&apos;s three Passovers.
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Where this does not settle it: Luke&apos;s &quot;about thirty&quot; may be a round number (the same Gospel uses exact ages elsewhere, like &quot;twelve years old&quot;). A minority of scholars count Tiberius&apos;s fifteenth year from AD 12, when he began to rule with Augustus, which moves Luke 3:1 to AD 26 or 27. In John 2:20 the temple has been &quot;forty and six years&quot; in building at the first Passover; scholars use it to date that first Passover to around AD 27.
          </p>
        </Section>

        <Section id="counts" title='"Passover" in the four Gospels' intro={`The word "passover" appears ${P.kjv.total} times in the four Gospels in the KJV and ${P.web.total} in the WEB. John has the most, ${P.kjv.byBook.John.uses}, because it is the Gospel that names a Passover at the start, middle and end of the ministry.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Gospel</th>
                  <th className="p-3 font-semibold text-right">KJV uses</th>
                  <th className="p-3 font-semibold text-right">KJV verses</th>
                  <th className="p-3 font-semibold text-right">WEB uses</th>
                </tr>
              </thead>
              <tbody>
                {GOSPELS.map((b) => (
                  <tr key={b} className="border-b last:border-0">
                    <td className="p-3 font-medium">
                      {b}
                    </td>
                    <td className="p-3 text-right tabular-nums">{P.kjv.byBook[b].uses}</td>
                    <td className="p-3 text-right tabular-nums">{P.kjv.byBook[b].verses}</td>
                    <td className="p-3 text-right tabular-nums">{P.web.byBook[b].uses}</td>
                  </tr>
                ))}
                <tr className="font-semibold">
                  <td className="p-3">All four</td>
                  <td className="p-3 text-right tabular-nums">{P.kjv.total}</td>
                  <td className="p-3 text-right tabular-nums">{GOSPELS.reduce((s, b) => s + P.kjv.byBook[b].verses, 0)}</td>
                  <td className="p-3 text-right tabular-nums">{P.web.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            In the whole Bible &quot;passover&quot; appears {P.kjv.bible} times in the KJV and {P.web.bible} in the WEB, so about a third of the uses are in the Gospels. The full count is on the {wordLink("passover", "Passover word page")}.
          </p>
        </Section>

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, checked by scripts/lists/how-old-was-jesus-when-he-died.mjs against the text at github.com/seven1m/open-bibles (read {DATA.generated}).</li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Date_of_the_birth_of_Jesus" className={link} rel="noopener">Wikipedia, Date of the birth of Jesus</a> and <a href="https://www.britannica.com/biography/Jesus" className={link} rel="noopener">Encyclopaedia Britannica, Jesus</a>: most scholars place the birth between 6 and 4 BC (read November 2, 2026).
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Herod_the_Great" className={link} rel="noopener">Wikipedia, Herod the Great</a>: Herod died in 4 BC (Schürer) or 1 BC (Steinmann) (read November 2, 2026).
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Pontius_Pilate" className={link} rel="noopener">Wikipedia, Pontius Pilate</a>: governor of Judaea from 26 to 36/37, after Josephus, Antiquities 18.4.2 (read November 2, 2026).
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Chronology_of_Jesus" className={link} rel="noopener">Wikipedia, Chronology of Jesus</a> and <a href="https://en.wikipedia.org/wiki/Crucifixion_of_Jesus" className={link} rel="noopener">Crucifixion of Jesus</a>: the Fridays of 7 April AD 30 and 3 April AD 33, the fifteenth year of Tiberius counted from AD 14 (read November 2, 2026).
            </li>
            <li>
              <a href="https://en.wikipedia.org/wiki/Ministry_of_Jesus" className={link} rel="noopener">Wikipedia, Ministry of Jesus</a> and <a href="https://en.wikipedia.org/wiki/Dionysius_Exiguus" className={link} rel="noopener">Dionysius Exiguus</a>: the temple incident dated around AD 27; how the AD count was set in the 500s (read November 2, 2026).
            </li>
            <li>
              <a href="https://ehrmanblog.org/how-old-was-jesus/" className={link} rel="noopener">Bart Ehrman, How Old Was Jesus?</a>: the New Testament never says 33; Luke&apos;s &quot;about 30&quot; and John&apos;s three Passovers give it (read November 2, 2026).
            </li>
          </ul>
        </Section>

        <FaqSection title="Questions about Jesus' age" faqs={faqs} />

        <Section>
          <p className="mb-4">
            Read the Gospels&apos; numbers on <Link href="/books/luke" className={link}>Luke</Link> and <Link href="/books/john" className={link}>John</Link>, and see {wordLink("jesus", "how many times Jesus is named")}. More on his life: <Link href="/miracles-of-jesus" className={link}>the miracles of Jesus</Link>, <Link href="/parables-of-jesus" className={link}>his parables</Link> and <Link href="/twelve-apostles" className={link}>the twelve apostles</Link>. Other ages in the Bible are on <Link href="/how-old-was-methuselah" className={link}>how old was Methuselah</Link>, and more counts are on <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
