import { OG_VIDEOS } from "@/lib/og-video";
/* The twelve apostles: the four lists (Matthew 10, Mark 3, Luke 6, Acts 1) side by side with each name's position read
   from the verse text, the other names and family the Bible gives, the apostles beyond the twelve, the books that name
   their writer, and counts of "apostle", "disciple", "the twelve" and "Peter" from the full KJV and WEB.
   Counted by scripts/lists/twelve-apostles.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/twelve-apostles.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/twelve-apostles`;
const W = DATA.words;
const O = DATA.observations;
const link = "underline underline-offset-2 hover:text-primary";
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const ORD = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"];
const A = Object.fromEntries(DATA.apostles.map((a) => [a.id, a]));
const SHORT = { peter: "Peter", andrew: "Andrew", jamesZ: "James son of Zebedee", john: "John", philip: "Philip", bartholomew: "Bartholomew", thomas: "Thomas", matthew: "Matthew", jamesA: "James son of Alphaeus", thaddaeus: "Thaddaeus", simonZ: "Simon the Zealot", judasI: "Judas Iscariot" };
const WORD_SLUG = { peter: "peter", andrew: "andrew", jamesZ: "james", john: "john", philip: "philip", bartholomew: "bartholomew", thomas: "thomas", matthew: "matthew", jamesA: "james", simonZ: "simon", judasI: "judas" };
const fixed = O.samePosKjv.filter((s) => s.id !== "judasI");
const placesOf = (id) => {
  const by = {};
  for (const l of DATA.lists) if (l.kjv[id]) (by[l.kjv[id].pos] ||= []).push(l.label.split(" ")[0]);
  return `${SHORT[id]} is ${joinAnd(Object.entries(by).map(([p, ls]) => `${ORD[p]} in ${joinAnd(ls)}`))}`;
};
const fixedText = joinAnd(fixed.map((s) => `${SHORT[s.id]} ${ORD[s.pos]}`));
const matthewOrder = DATA.ids.map((id) => SHORT[id]);
const paulN = DATA.paulLetters.length;
const peter = W.peterKjv;
const IBH_URL = "https://biblehub.com/interlinear/luke/6-16.htm";
const CE_URL = "https://www.newadvent.org/cathen/02313c.htm";
const EUS_URL = "https://www.newadvent.org/fathers/250103.htm";

const TITLE = "The 12 Apostles of Jesus: Names From All 4 Bible Lists";
const ANSWER = `Jesus chose 12 apostles: ${joinAnd(["Simon Peter", "his brother Andrew", "James the son of Zebedee", "his brother John", "Philip", "Bartholomew", "Thomas", "Matthew the tax collector", "James the son of Alphaeus", "Thaddaeus", "Simon the Canaanite", "Judas Iscariot"])}, in the order of Matthew 10:2-4. Luke 6:13 says he chose them from his disciples, "whom also he named apostles". After Judas Iscariot betrayed Jesus and died, Matthias was chosen to take his place (Acts 1:26).`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The 12 apostles in Matthew, Mark, Luke and Acts side by side: their other names, brothers and trades, who replaced Judas, and how often each is named.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "Who were the 12 apostles?", a: `${joinAnd(matthewOrder)}, in the order of Matthew 10:2-4. Mark 3:16-19 and Luke 6:14-16 give the same men, and Acts 1:13 repeats the list after Judas Iscariot's death with eleven names. Where Matthew and Mark have Thaddaeus, Luke and Acts have "Judas the brother of James" (the World English Bible says "son of James").` },
  { q: "What is the difference between a disciple and an apostle?", a: `The twelve were disciples first and apostles second. Luke 6:13 shows the order: Jesus "called unto him his disciples: and of them he chose twelve, whom also he named apostles." Mark 3:14 gives the purpose: "that they should be with him, and that he might send them forth to preach." In the King James Version "disciple" or "disciples" appears ${W.discipleKjv.total} times, all but one of them in the Gospels and Acts, and never in the letters. "Apostle" or "apostles" appears ${W.apostleKjv.total} times, ${W.apostleKjv.top.count} of them in Acts and none in the Gospel of John.` },
  { q: "Who replaced Judas as an apostle?", a: `Matthias. The apostles put forward two men who had been with them from the baptism of John, "Joseph called Barsabas, who was surnamed Justus, and Matthias" (Acts 1:23). Then they prayed and cast lots: "the lot fell upon Matthias; and he was numbered with the eleven apostles" (Acts 1:26). He is named ${W.matthiasKjv.total === 2 ? "twice" : `${W.matthiasKjv.total} times`} in the Bible, both times in Acts 1.` },
  { q: "Was Paul one of the twelve apostles?", a: `No. Paul calls himself "called to be an apostle" (Romans 1:1), but he was not one of the twelve. He lists Jesus appearing to "Cephas, then of the twelve" and then "last of all ... of me also, as of one born out of due time", and calls himself "the least of the apostles" (1 Corinthians 15:5-9). Matthias, not Paul, filled Judas's place (Acts 1:26).` },
  { q: "Which apostle wrote the most books of the Bible?", a: `Paul, by the Bible's own openings: ${paulN} letters, Romans to Philemon, begin with his name, and ${DATA.paulApostleOpenings} of them call him an apostle in the first verse. Among the twelve, Peter is the only one named as a writer and called an apostle in the same breath (1 Peter 1:1, 2 Peter 1:1). Revelation names its writer John but does not call him an apostle, and the Gospel of John and the three letters of John give no writer by name.` },
  { q: "How did the apostles die?", a: `The Bible tells the deaths of two of the twelve. Judas Iscariot "went and hanged himself" (Matthew 27:5; Acts 1:18 adds that "falling headlong, he burst asunder"). Herod "killed James the brother of John with the sword" (Acts 12:2). Jesus foretells Peter's death in John 21:18-19 but the Bible does not tell it. The Bible does not say how the others died.` },
];

export default function TwelveApostles() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The twelve apostles", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The twelve apostles of Jesus: the names in all four Bible lists", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const bookLink = (slug, label) => <Link href={`/books/${slug}`} className={link}>{label}</Link>;
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The twelve apostles" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The twelve apostles of Jesus</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. The four lists are read from the King James Version and the World English Bible, and every position, name and count on this page is computed from the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Apostles chosen", value: DATA.count, note: "\"whom also he named apostles\", Luke 6:13" },
                { label: "Lists in the Bible", value: DATA.lists.length, note: "Acts 1:13 names eleven" },
                { label: `"Peter" in the KJV`, value: peter.total, note: "more than any other of the twelve" },
                { label: `"The twelve" on its own`, value: W.theTwelveKjv.total, note: "KJV, as a name for the group" },
              ]}
            />
          </div>
        </section>

        <Section id="lists" title="The four lists side by side" intro={`The Bible names the twelve four times. The table follows Matthew's order; each cell gives the apostle's place in that list and the King James wording.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Apostle</th>
                  {DATA.lists.map((l) => (
                    <th key={l.id} className="p-3 font-semibold whitespace-nowrap">{l.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DATA.ids.map((id) => (
                  <tr key={id} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{SHORT[id]}</td>
                    {DATA.lists.map((l) => (
                      <td key={l.id} className="p-3">
                        {l.kjv[id] ? (
                          <>
                            <span className="tabular-nums font-semibold mr-1">{l.kjv[id].pos}.</span>
                            {l.kjv[id].as}
                          </>
                        ) : (
                          <span className="text-muted-foreground">not listed</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 leading-relaxed">
            Some places never change: {fixedText} in all four lists. Judas Iscariot is last in all three Gospel lists and is missing from Acts 1:13, which comes after his death. The names also fall into three groups of four that never mix. Places 1 to 4 always hold {joinAnd(O.groups[0].members.map((id) => SHORT[id]))}, led by {SHORT[O.groups[0].headedBy[0]]}. Places 5 to 8 always hold {joinAnd(O.groups[1].members.map((id) => SHORT[id]))}, led by {SHORT[O.groups[1].headedBy[0]]}. Places 9 to 12 hold {SHORT[O.groups[2].headedBy[0]]} first, then Thaddaeus (Judas of James in Luke and Acts) and Simon the Zealot, tenth and eleventh in either order, and Judas Iscariot last. Only the order inside a group moves: {placesOf("andrew")}, and {placesOf("thomas")}.
          </p>
          <h3 className="text-lg font-semibold mt-8 mb-3">Where the King James and the World English Bible differ</h3>
          <ul className="list-disc pl-5 space-y-2 leading-relaxed">
            {DATA.diffs.map((d) => (
              <li key={d.ref + d.kjv}>
                {d.ref}: KJV &quot;{d.kjv}&quot;, WEB &quot;{d.web}&quot;.
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            The Acts 1:13 order follows each translation: the King James has Peter, James, John; the World English Bible has Peter, John, James. Every other position is the same in both.
          </p>
        </Section>

        <Section id="thaddaeus" title="Thaddaeus, Lebbaeus, or Judas the brother of James?" muted>
          <p className="leading-relaxed">
            The lists point to one man with three names, though the Bible never says so in words. Matthew 10:3 has &quot;Lebbaeus, whose surname was Thaddaeus&quot;; Mark 3:18 has &quot;Thaddaeus&quot;. Luke 6:16 and Acts 1:13 have no Thaddaeus, and instead name &quot;Judas the brother of James&quot; in the King James Version, or &quot;Judas the son of James&quot; in the World English Bible. Match the lists name for name and Thaddaeus and Judas of James are left over, the one name each pair of lists has that the other pair lacks. So the lists read as one man under more than one name.
          </p>
          <p className="mt-3 leading-relaxed">
            The translations differ because the Greek of Luke 6:16 says only <em>Ioudan Iakōbou</em>, &quot;Judas of James&quot;, with no word for brother or son. <a href={IBH_URL} className={link} rel="noopener">Bible Hub&apos;s interlinear for Luke 6:16</a> prints the King James &quot;the brother&quot; in brackets as a supplied word. John&apos;s Gospel has a Judas who is &quot;not Iscariot&quot; speak once (John 14:22), without saying more about him.
          </p>
        </Section>

        <Section id="each" title="Each apostle: other names, family and work" intro={`The Bible gives some of the twelve a second name, a brother or a trade, and says almost nothing about others. The count column is the King James Version, given only for names no one else in the Bible bears.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Apostle</th>
                  <th className="p-3 font-semibold">Also called</th>
                  <th className="p-3 font-semibold">Family and work</th>
                  <th className="p-3 font-semibold text-right">Named (KJV)</th>
                  <th className="p-3 font-semibold">Verses</th>
                </tr>
              </thead>
              <tbody>
                {DATA.apostles.map((a) => (
                  <tr key={a.id} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{WORD_SLUG[a.id] ? wordLink(WORD_SLUG[a.id], a.name) : a.name}</td>
                    <td className="p-3">{a.also}</td>
                    <td className="p-3">{a.family}</td>
                    <td className="p-3 text-right tabular-nums">{a.countKjv ? fmt(a.countKjv) : <span className="text-xs text-muted-foreground">shared name</span>}</td>
                    <td className="p-3 text-xs text-muted-foreground">{a.refs.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
            Counts: Peter takes in &quot;Peter&quot; and &quot;Peter&apos;s&quot; (Cephas and Simon are separate); Thaddaeus takes in &quot;Lebbaeus&quot;. &quot;Shared name&quot; means other men in the Bible have the name too (John the Baptist, Philip the evangelist, Simon of Cyrene and others), so a count would not be his alone.
          </p>
          <p className="mt-5 leading-relaxed">
            <strong>Two pairs of brothers.</strong> Simon Peter and Andrew, and James and John the sons of Zebedee. All four were fishermen: Jesus found the first two &quot;casting a net into the sea: for they were fishers&quot; and the second two &quot;in a ship with Zebedee their father, mending their nets&quot; (Matthew 4:18-21). Jesus surnamed James and John &quot;Boanerges, which is, The sons of thunder&quot; (Mark 3:17). Peter, James and John are the three he took with him when others stayed behind (Mark 5:37; Matthew 17:1).
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Matthew and Levi.</strong> Matthew 9:9 tells of a man &quot;named Matthew, sitting at the receipt of custom&quot; whom Jesus told &quot;Follow me&quot;. Mark 2:14 and Luke 5:27 tell the same call with the name Levi, and Matthew 10:3 calls him &quot;Matthew the publican&quot;, a tax collector. Mark 2:14 calls Levi &quot;the son of Alphaeus&quot;, the same father&apos;s name as James, the ninth apostle. The Bible does not say whether it is the same Alphaeus.
          </p>
          <p className="mt-3 leading-relaxed">
            <strong>Bartholomew and Nathanael.</strong> Bartholomew is named {DATA.onlyInLists.bartholomew} times in the Bible, once in each list, and nowhere else. John&apos;s Gospel never names him; it names Nathanael {W.nathanaelKjv} times, a man Philip brought to Jesus (John 1:45) and who was with the disciples at the sea after the resurrection (John 21:2). No other book names Nathanael. The{" "}
            <a href={CE_URL} className={link} rel="noopener">Catholic Encyclopedia</a> says &quot;many scholars&quot; identify the two, because the name Bartholomew means &quot;son of Talmai&quot; and may not be his own first name, and because it is coupled with Philip&apos;s in the lists of Matthew and Luke. It calls this &quot;chain of circumstantial evidence&quot; &quot;ingenious and pretty strong&quot;. The Bible itself never says they are the same man.
          </p>
        </Section>

        <Section id="peter" title="Peter, the most-named of the twelve" muted>
          <p className="leading-relaxed">
            &quot;Peter&quot; appears {fmt(peter.total)} times in the King James Version ({fmt(W.peterWeb.total)} in the World English Bible), {peter.top.count} of them in Acts. No other of the twelve comes close: every &quot;John&quot; in the Bible together, John the Baptist included, comes to {fmt(DATA.rivals.John)}, and every &quot;Simon&quot; to {fmt(DATA.rivals.Simon)}. He goes by three names: Simon, Peter and Cephas. Jesus told him &quot;thou shalt be called Cephas, which is by interpretation, A stone&quot; (John 1:42); &quot;Cephas&quot; appears {W.cephasKjv.total} times, {W.cephasKjv.top.count} of them in {W.cephasKjv.top.book}. The full &quot;Simon Peter&quot; appears {W.simonPeterKjv.total} times.
          </p>
          <p className="mt-3 leading-relaxed">
            Paul, who was not one of the twelve, is named just as often: &quot;Paul&quot; appears {fmt(W.paulKjv.total)} times in the King James Version, the same as Peter, and {fmt(W.paulWeb.total)} in the World English Bible, {W.paulKjv.top.count} of them in Acts. The two split Acts between them. Peter is named {W.peterActsKjv.early} times in chapters 1 to 12 and {W.peterActsKjv.late === 1 ? "once" : `${W.peterActsKjv.late} times`} after. Paul, called Saul until Acts 13:9, is named {W.paulActsKjv.early === 0 ? "only from chapter 13 on" : `${W.paulActsKjv.early} times before chapter 13`}, {W.paulActsKjv.late} times.
          </p>
        </Section>

        <Section id="disciple-apostle" title="Disciple or apostle? What the counts show" intro={`Luke 6:13 draws the line: Jesus "called unto him his disciples: and of them he chose twelve, whom also he named apostles." The two words are used in different parts of the New Testament.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Word (all forms)</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                  <th className="p-3 font-semibold">Most in</th>
                  <th className="p-3 font-semibold">Where</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b align-top">
                  <td className="p-3 font-medium">{wordLink("disciple", "disciple, disciples")}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(W.discipleKjv.total)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(W.discipleWeb.total)}</td>
                  <td className="p-3">{W.discipleKjv.top.book} ({W.discipleKjv.top.count})</td>
                  <td className="p-3">The Gospels and Acts only, plus Isaiah 8:16; never in the letters or Revelation</td>
                </tr>
                <tr className="border-b align-top">
                  <td className="p-3 font-medium">{wordLink("apostle", "apostle, apostles")}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(W.apostleKjv.total)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(W.apostleWeb.total)}</td>
                  <td className="p-3">{W.apostleKjv.top.book} ({W.apostleKjv.top.count})</td>
                  <td className="p-3">{W.apostleKjv.books} books in the KJV; only {W.apostleGospelsKjv.total} times in the Gospels (Matthew {W.apostleGospelsKjv.byBook.Matthew}, Mark {W.apostleGospelsKjv.byBook.Mark}, Luke {W.apostleGospelsKjv.byBook.Luke}), never in John</td>
                </tr>
                <tr className="align-top">
                  <td className="p-3 font-medium">&quot;the twelve&quot; on its own</td>
                  <td className="p-3 text-right tabular-nums">{W.theTwelveKjv.total}</td>
                  <td className="p-3 text-right tabular-nums">{W.theTwelveWeb.total}</td>
                  <td className="p-3">Mark ({W.theTwelveKjvByBook.Mark})</td>
                  <td className="p-3">The Gospels, {joinAnd(W.theTwelveKjv.refs.filter((r) => !/^(Matthew|Mark|Luke|John) /.test(r)))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The four Gospels use &quot;disciple&quot; or &quot;disciples&quot; {W.discipleGospelsKjv} times and &quot;apostle&quot; or &quot;apostles&quot; {W.apostleGospelsKjv.total}, and John&apos;s Gospel never uses &quot;apostle&quot; at all. Acts uses both about equally ({W.discipleKjv.byBook.Acts} and {W.apostleKjv.byBook.Acts}). After Acts, &quot;disciple&quot; never appears again, while &quot;apostle&quot; runs on through the letters and Revelation. The exact phrase &quot;twelve apostles&quot; appears only {W.twelveApostlesKjv.total} times: {joinAnd(W.twelveApostlesKjv.refs)}. &quot;The twelve&quot; is counted where it is the group&apos;s name, as in &quot;one of the twelve&quot;, and not where a noun follows (the twelve tribes, the twelve apostles).
          </p>
        </Section>

        <Section id="beyond" title="After Judas: Matthias, Paul and the other apostles" muted intro={`With Judas gone, the Gospels and Acts speak of "the eleven" (Matthew 28:16; Acts 2:14). Acts 1:21-22 sets the rule for his replacement: a man who had "companied with us all the time", beginning from the baptism of John, to be "a witness with us of his resurrection".`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Apostle</th>
                  <th className="p-3 font-semibold">What the Bible says</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.beyond.map((b) => (
                  <tr key={b.who} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{b.who === "Paul" ? wordLink("paul", "Paul") : b.who === "Barnabas" ? wordLink("barnabas", "Barnabas") : b.who}</td>
                    <td className="p-3">{b.what}</td>
                    <td className="p-3 whitespace-nowrap">{b.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Matthias is the only one of these counted among the twelve. Paul says he did not go up to Jerusalem &quot;to them which were apostles before me&quot; (Galatians 1:17), and places himself after the twelve, &quot;as of one born out of due time&quot; (1 Corinthians 15:8). So the Bible calls more than twelve men apostles, but the twelve stay twelve.
          </p>
        </Section>

        <Section id="deaths" title="How did the apostles die?">
          <p className="leading-relaxed">
            The Bible tells the deaths of two of the twelve. Judas Iscariot &quot;went and hanged himself&quot; (Matthew 27:5), and Acts 1:18 says that &quot;falling headlong, he burst asunder in the midst&quot;. Herod the king &quot;killed James the brother of John with the sword&quot; (Acts 12:2). Jesus foretells Peter&apos;s death, &quot;signifying by what death he should glorify God&quot; (John 21:19), but the Bible does not tell it. The Bible does not say how the other apostles died.
          </p>
        </Section>

        <Section id="thrones" title="Twelve thrones and twelve foundations" muted>
          <p className="leading-relaxed">
            Jesus promised the twelve a place in the age to come: &quot;ye also shall sit upon twelve thrones, judging the twelve tribes of Israel&quot; (Matthew 19:28; compare Luke 22:30). In John&apos;s vision of the new Jerusalem, &quot;the wall of the city had twelve foundations, and in them the names of the twelve apostles of the Lamb&quot; (Revelation 21:14). The gates of the same city carry the names of <Link href="/twelve-tribes-of-israel" className={link}>the twelve tribes of Israel</Link> (Revelation 21:12).
          </p>
        </Section>

        <Section id="writers" title="Which apostles wrote books of the Bible?" intro={`Peter is the only one of the twelve whom a book names as its writer and calls an apostle (1 Peter 1:1, 2 Peter 1:1). James, Jude and Revelation name a James, a Jude and a John without saying they were of the twelve. Paul, an apostle but not one of the twelve, is named as the writer of more books than anyone: his name opens ${paulN} letters, Romans to Philemon, and ${DATA.paulApostleOpenings} of them call him an apostle in the first verse. The other books that say who wrote them:`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Book</th>
                  <th className="p-3 font-semibold">Writer, in the book&apos;s own words</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.writers.map((w) => (
                  <tr key={w.book} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{bookLink(w.book.toLowerCase().replace(/ /g, "-"), w.book)}</td>
                    <td className="p-3">{w.writer}</td>
                    <td className="p-3 whitespace-nowrap">{w.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Matthew, Mark, Luke, Acts, Hebrews and 1 John name no writer. Later writers fill the gaps. The church historian Eusebius wrote in his <a href={EUS_URL} className={link} rel="noopener">Church History (book 3, chapter 24)</a> that &quot;of all the disciples of the Lord, only Matthew and John have left us written memorials&quot;. He adds that John&apos;s Gospel and first letter were accepted without dispute while the other two letters were disputed and opinions on Revelation were &quot;still divided&quot;.
          </p>
        </Section>

        <FaqSection title="Questions about the twelve apostles" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every list position and every count on this page, from the text at github.com/seven1m/open-bibles, counted by scripts/lists/twelve-apostles.mjs (read and counted {DATA.generated}).</li>
            <li><a href={IBH_URL} className={link} rel="noopener">Bible Hub, Luke 6:16 interlinear</a>: the Greek &quot;Ioudan Iakōbou&quot; and the King James &quot;the brother&quot; marked as supplied (read 2026-10-25).</li>
            <li><a href={CE_URL} className={link} rel="noopener">Catholic Encyclopedia (1907), &quot;St. Bartholomew&quot;</a>, New Advent: the identification of Bartholomew with Nathanael and its reasons (read 2026-10-25).</li>
            <li><a href={EUS_URL} className={link} rel="noopener">Eusebius, Church History, book 3, chapters 24-25</a>, New Advent: the tradition on what Matthew and John wrote (read 2026-10-25).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read the lists in {bookLink("matthew", "Matthew")}, {bookLink("mark", "Mark")}, {bookLink("luke", "Luke")} and {bookLink("acts", "Acts")}. Word counts: {wordLink("peter", "Peter")}, {wordLink("apostle", "apostle")}, {wordLink("disciple", "disciple")}, {wordLink("judas", "Judas")}, {wordLink("thomas", "Thomas")} and {wordLink("twelve", "twelve")}. What the twelve saw and heard is on <Link href="/miracles-of-jesus" className={link}>the miracles of Jesus</Link> and <Link href="/parables-of-jesus" className={link}>the parables of Jesus</Link>; the titles they used for him are on <Link href="/names-of-jesus" className={link}>the names of Jesus</Link>. The books they and Paul wrote are on <Link href="/new-testament-books-in-order" className={link}>the New Testament books in order</Link>. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
