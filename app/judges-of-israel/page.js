import { OG_VIDEOS } from "@/lib/og-video";
/* The judges of Israel in order: the 12 of the Book of Judges (Othniel to Samson), Barak and Abimelech in their places,
   and Eli and Samuel from 1 Samuel, with each one's tribe, oppressor, years and key verses. The cycle phrases, the
   "judged Israel" verses, the sum of the years and the cross-checks with 1 Kings 6:1 and Acts 13:20 are all computed
   by scripts/lists/judges-of-israel.mjs from the KJV and WEB text. */

import Link from "next/link";
import DATA from "@/lib/data/lists/judges-of-israel.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote, BarRows } from "@/components/DataBits";

const URL = `${SITE}/judges-of-israel`;
const Y = DATA.years;
const C = DATA.cycle;
const JI = DATA.judgedIsrael;
const W = DATA.words;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const by = (name) => DATA.rows.find((r) => r.name === name);
const RULE = { rest: "rest", quietness: "quietness", judged: "judged Israel", reigned: "reigned" };
const ROLE = { partner: "with Deborah", ruler: "not a judge" };
const rounds = DATA.rows.filter((r) => r.oppressor);
const gideon = DATA.longestStory;
const wiki = "https://en.wikipedia.org/wiki/Hebrew_Bible_judges";
const wikiBook = "https://en.wikipedia.org/wiki/Book_of_Judges";

const TITLE = `Judges of Israel in Order: All ${DATA.count} Judges (and Eli, Samuel)`;
const ANSWER = `The Book of Judges names ${DATA.count} judges of Israel. In order: ${joinAnd(DATA.twelve)}. ${DATA.first} was the first (Judges 3:9) and ${DATA.woman} the only woman (Judges 4:4). ${DATA.lastInJudges} is the last in Judges; 1 Samuel adds two more, Eli and Samuel, the last judge.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `The ${DATA.count} judges of Israel in order, Othniel to Samson, plus Eli and Samuel: each one's tribe, oppressor and years, checked against the KJV and WEB.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many judges were in the Bible?", a: `The Book of Judges tells of ${DATA.count}: ${joinAnd(DATA.twelve)}. 1 Samuel adds Eli, who "had judged Israel forty years" (1 Samuel 4:18), and Samuel, who "judged Israel all the days of his life" (1 Samuel 7:15), for 14 in all. The Bible never states the number itself; the ${DATA.count} is a count of the leaders the book tells of in turn. Barak fought beside Deborah and Abimelech ruled for ${by("Abimelech").rule.years} years, but neither is said to have judged Israel.` },
  { q: "Who was the first judge of Israel?", a: `${DATA.first}, the son of Kenaz and Caleb's younger brother. After eight years under the king of Mesopotamia, "the LORD raised up a deliverer to the children of Israel, who delivered them, even Othniel" (Judges 3:9), and "he judged Israel" (Judges 3:10). The land then had rest ${by("Othniel").rule.years} years.` },
  { q: "Who was the only female judge in the Bible?", a: `Deborah. "Deborah, a prophetess, the wife of Lapidoth, she judged Israel at that time" (Judges 4:4, KJV), and "the children of Israel came up to her for judgment" (Judges 4:5). She called Barak to fight Sisera and told him the LORD would "sell Sisera into the hand of a woman" (Judges 4:9). After the victory the land had rest ${by("Deborah").rule.years} years.` },
  { q: "Who was the last judge of Israel?", a: `Samuel. Samson is the last judge in the Book of Judges, and Eli and Samuel follow in 1 Samuel. When Samuel was old, the people asked him to "make us a king to judge us like all the nations" (1 Samuel 8:5), and he anointed Saul (1 Samuel 10:1). His sons Joel and Abiah were "judges in Beer-sheba" (1 Samuel 8:2), but they "took bribes" (1 Samuel 8:3), and this page does not count them among the judges of Israel.` },
  { q: "How long did the judges rule?", a: `Added end to end, the years in the Book of Judges come to ${Y.judgesTotal} (${Y.oppression} under oppressors, ${Y.rule} of rest or rule), and ${Y.withEli} with Eli's ${Y.eli}. Acts 13:20 in the KJV says God "gave unto them judges about the space of four hundred and fifty years". Some periods overlapped: Samson "judged Israel in the days of the Philistines twenty years" (Judges 15:20), inside the Philistines' ${by("Samson").oppressor.years}.` },
  { q: "Was Abimelech a judge?", a: `No. Abimelech, Gideon's son by a concubine in Shechem, was made king by the men of Shechem (Judges 9:6) after he killed 70 of his brothers "upon one stone" (Judges 9:5). He "reigned three years over Israel" (Judges 9:22) and at Thebez a woman cast a piece of a millstone on his head (Judges 9:53). The text never says he judged or delivered Israel, though his name appears ${DATA.names.Abimelech.kjv} times in Judges (KJV), more than any judge's.` },
];

export default function JudgesOfIsrael() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "The judges of Israel", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The judges of Israel in order", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "The judges of Israel" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The judges of Israel in order</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="tldr text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every verse and every number of years on this page is checked against the King James Version, and every year figure against the World English Bible too. Word and phrase counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Judges in the Book of Judges", value: DATA.count, note: "plus Eli and Samuel in 1 Samuel" },
                { label: `"Judged Israel" in the KJV`, value: JI.kjv, note: `${JI.kjv - 1} of them said of ${JI.people.length} people (WEB: ${JI.web})` },
                { label: "Years given in Judges", value: Y.judgesTotal, note: `${Y.oppression} oppression + ${Y.rule} rest or rule; some overlap` },
                { label: `"Did evil (again) in the sight of the LORD"`, value: C.didEvilKjv.total, note: `times in Judges, KJV (WEB: ${C.didEvilWeb.total})` },
              ]}
            />
          </div>
        </section>

        <Section id="list" title="All the judges of Israel in order" intro={`Here are the ${DATA.count} judges of the Book of Judges in the order the text gives them, numbered 1 to ${DATA.count}, with Eli and Samuel from 1 Samuel as 13 and 14. Barak and Abimelech stand in their places without a number. Years are as the KJV gives them; scroll the table sideways on a phone.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">The judges of Israel in order, with tribe, oppressor, years and what the Bible records</caption>
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Judge and tribe</th>
                  <th className="p-3 font-semibold">Oppressor</th>
                  <th className="p-3 font-semibold">Rest or rule</th>
                  <th className="p-3 font-semibold">What the Bible records</th>
                </tr>
              </thead>
              <tbody>
                {DATA.rows.map((r) => (
                  <tr key={r.name} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums text-muted-foreground">{r.order ?? ""}</td>
                    <td className="p-3 min-w-[11rem]">
                      <span className="font-medium">{r.name}</span>
                      {ROLE[r.kind] ? <span className="text-xs text-muted-foreground"> ({ROLE[r.kind]})</span> : null}
                      <span className="block text-xs text-muted-foreground">{r.book} {r.chapters}</span>
                      <span className="block text-xs mt-1">{r.tribe}{r.tribeRef ? <span className="text-muted-foreground"> ({r.tribeRef})</span> : null}</span>
                    </td>
                    <td className="p-3 min-w-[10rem]">
                      {r.oppressor ? (
                        <>
                          {r.oppressor.who}
                          <span className="block text-xs text-muted-foreground">
                            {r.oppressor.years} years (KJV &quot;{r.oppressor.kjv}&quot;, {r.oppressor.ref})
                          </span>
                        </>
                      ) : (
                        <span className="text-muted-foreground">none given</span>
                      )}
                    </td>
                    <td className="p-3 min-w-[9rem]">
                      {r.rule ? (
                        <>
                          {r.rule.years} years, {RULE[r.rule.kind]}
                          <span className="block text-xs text-muted-foreground">
                            KJV &quot;{r.rule.kjv}&quot;, {r.rule.ref}
                          </span>
                        </>
                      ) : r.name === "Samuel" ? (
                        <span>&quot;all the days of his life&quot; <span className="block text-xs text-muted-foreground">1 Samuel 7:15; no number given</span></span>
                      ) : (
                        <span className="text-muted-foreground">no years given</span>
                      )}
                    </td>
                    <td className="p-3 min-w-[18rem]">
                      {r.text}
                      <span className="block text-xs text-muted-foreground mt-1">
                        &quot;{r.quote}&quot; ({r.quoteRef}{r.key.length > 1 ? `; also ${r.key.slice(1).join(", ")}` : ""})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The Bible never gives the number {DATA.count} itself. The count comes from the leaders the Book of <Link href="/books/judges" className={link}>Judges</Link> tells of one after another, each tied to the last by &quot;after him&quot; (Judges 3:31, 10:3, 12:8, 12:11, 12:13) or by the death of the one before (Judges 4:1).
          </p>
          <p className="mt-3 leading-relaxed">
            Our count of the phrase &quot;judged Israel&quot;, with &quot;judged the children of Israel&quot; at 1 Samuel 7:6, finds it {JI.kjv} times in {JI.kjvVerses} verses of the King James Version ({JI.web} in the World English Bible). All but one are said of {JI.people.length} people: {joinAnd(JI.people)}; the other, 2 Kings 23:22, looks back to &quot;the days of the judges that judged Israel&quot;. It is never said of Ehud, Shamgar or Gideon, three of the {DATA.count}. The text calls them deliverers instead: &quot;the LORD raised them up a deliverer, Ehud&quot; (Judges 3:15), Shamgar &quot;also delivered Israel&quot; (Judges 3:31), and Gideon is told &quot;thou shalt save Israel from the hand of the Midianites&quot; (Judges 6:14).
          </p>
        </Section>

        <Section id="cycle" title="What is the cycle of the judges?" muted>
          <p className="leading-relaxed">
            The cycle of the judges is a five-step round the Book of Judges tells six times: Israel does evil, God hands them to an oppressor, they cry to the LORD, he raises up a deliverer, and the land has rest until the judge dies (Judges 2:11-19). Chapter 2 states the pattern in advance: &quot;Nevertheless the LORD raised up judges, which delivered them out of the hand of those that spoiled them&quot; (Judges 2:16), and &quot;when the judge was dead, that they returned, and corrupted themselves more than their fathers&quot; (Judges 2:19).
          </p>
          <ul className="mt-4 list-disc pl-5 space-y-1.5 leading-relaxed">
            <li><span className="font-medium">Sin.</span> &quot;Did evil in the sight of the LORD&quot;, three times with &quot;again&quot;, appears {C.didEvilKjv.total} times in Judges, KJV: in the summary of the cycle and at the start of each of the six rounds ({C.didEvilKjv.refs.join(", ")}). The WEB&apos;s &quot;did that which was evil in Yahweh&apos;s sight&quot; stands in the same {C.didEvilWeb.total} verses.</li>
            <li><span className="font-medium">Oppression.</span> &quot;He sold them into the hand of Chushan-rishathaim&quot; (Judges 3:8): six oppressors in the table below.</li>
            <li><span className="font-medium">Cry.</span> &quot;Cried unto the LORD&quot; appears {C.criedKjv.total} times in Judges, KJV ({C.criedWeb.total} for the WEB&apos;s &quot;cried to Yahweh&quot;).</li>
            <li><span className="font-medium">Deliverer.</span> &quot;The LORD raised up a deliverer&quot; (Judges 3:9, 3:15). &quot;The Spirit of the LORD&quot; appears {C.spiritKjv.total} times in Judges, KJV, every time on a judge: Othniel, Gideon, Jephthah, and four times Samson ({C.spiritWeb.total} in the WEB, as &quot;Yahweh&apos;s Spirit&quot;).</li>
            <li><span className="font-medium">Rest.</span> &quot;The land had rest&quot; appears {C.restKjv.total} times in Judges, KJV, and {C.restWeb.total} in the WEB, which uses the same words at Judges 8:28 where the KJV has &quot;the country was in quietness&quot;.</li>
          </ul>
          <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">The six rounds of oppression and rest in Judges</caption>
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Oppressor</th>
                  <th className="p-3 font-semibold text-right">Years</th>
                  <th className="p-3 font-semibold">Deliverer</th>
                  <th className="p-3 font-semibold text-right">Rest or rule</th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) => (
                  <tr key={r.name} className="border-b last:border-0 align-top">
                    <td className="p-3">{r.oppressor.who}<span className="block text-xs text-muted-foreground">{r.oppressor.ref}</span></td>
                    <td className="p-3 text-right tabular-nums">{r.oppressor.years}</td>
                    <td className="p-3 font-medium">{r.name}</td>
                    <td className="p-3 text-right tabular-nums">{r.rule.years}<span className="block text-xs text-muted-foreground">{r.rule.ref}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The rounds stop after Samson. Chapters 17 to 21 have no judge, and their refrain is &quot;In those days there was no king in Israel&quot;: {C.noKingKjv.total} times, at {joinAnd(C.noKingKjv.refs)} (the same {C.noKingWeb.total} verses in the WEB). Judges 19:1 words it &quot;in those days, when there was no king in Israel&quot;. Twice it goes on &quot;every man did that which was right in his own eyes&quot; (Judges 17:6), and the second time is the last verse of the book (Judges 21:25).
          </p>
        </Section>

        <Section id="major-minor" title="Who were the major and minor judges?">
          <p className="leading-relaxed">
            The six major judges are {joinAnd(DATA.major)}, and the six minor judges are {joinAnd(DATA.minor)}. The labels are a later convention, not words the Bible uses: Wikipedia&apos;s article on the <a href={wiki} className={link}>Hebrew Bible judges</a> says the six are &quot;regarded as the major judges&quot; on the basis of the length of the narrative about them, and its article on the <a href={wikiBook} className={link}>Book of Judges</a> calls the other six &quot;brief glosses&quot;. The same kind of length label sorts <Link href="/major-and-minor-prophets" className={link}>the major and minor prophets</Link>.
          </p>
          <p className="mt-3 leading-relaxed">
            Our verse count bears the split out. The six minor judges get {DATA.minorVerses} verses of Judges between them in the KJV. {gideon.name}&apos;s story runs {gideon.verses} verses (Judges 6:1-8:32) and Samson&apos;s {DATA.samsonVerses} (Judges 13-16). Each range below runs from the verse that opens the judge&apos;s episode to the judge&apos;s death or the rest that closes it; the WEB gives the same counts.
          </p>
          <div className="mt-5">
            <BarRows rows={DATA.rows.filter((r) => r.verses).map((r) => ({ label: r.kind === "ruler" ? `${r.name} (not a judge)` : r.name, value: r.verses, display: `${r.verses} vv` }))} labelWidth="w-44" />
          </div>
        </Section>

        <Section id="how-long" title="How long did the judges rule?" muted>
          <p className="leading-relaxed">
            Added end to end, the years the Book of Judges gives come to {Y.judgesTotal}: {Y.oppression} years under oppressors and {Y.rule} of rest or rule (the {Y.rule} includes Abimelech&apos;s {by("Abimelech").rule.years}). Eli&apos;s {Y.eli} years (1 Samuel 4:18) bring it to {Y.withEli}, the figure in Acts 13:20 in the KJV: &quot;he gave unto them judges about the space of four hundred and fifty years, until Samuel the prophet.&quot; The World English Bible words the verses differently and ties the 450 years to the land: &quot;{DATA.quotes.acts1319Web}&quot; (Acts 13:19), then &quot;{DATA.quotes.acts1320Web}&quot; (Acts 13:20).
          </p>
          <p className="mt-3 leading-relaxed">
            The periods cannot all have run one after another. 1 Kings 6:1 puts the start of Solomon&apos;s temple &quot;in the four hundred and eightieth year after the children of Israel were come out of the land of Egypt&quot;, {Y.fromExodus} years. Lay the Bible&apos;s own figures end to end: {Y.wilderness} years in the wilderness (Acts 13:18), {Y.withEli} for the judges and Eli, {Y.saul} for Saul (Acts 13:21) and {Y.david} for David (1 Kings 2:11). That is {Y.endToEnd}, {Y.overBy} more than {Y.fromExodus}, before Joshua&apos;s years, Samuel&apos;s, or Solomon&apos;s first three are counted. Jephthah himself puts Israel&apos;s hold on the land by the Arnon at &quot;three hundred years&quot; (Judges 11:26); the figures in Judges up to his call add to {Y.beforeJephthah}.
          </p>
          <p className="mt-3 leading-relaxed">
            The text shows two overlaps itself. Samson &quot;judged Israel in the days of the Philistines twenty years&quot; (Judges 15:20), so his {by("Samson").rule.years} years sit inside the Philistines&apos; {by("Samson").oppressor.years} (Judges 13:1). And Judges 10:7 sells Israel to &quot;the Philistines, and into the hands of the children of Ammon&quot; at once, with Ammon&apos;s {by("Jephthah").oppressor.years} years falling on the tribes &quot;on the other side Jordan&quot; (Judges 10:8). Jephthah was made head over Gilead (Judges 11:11), east of the Jordan, so two judges could have led different tribes at the same time; the text does not say whether any did. This page gives no dates BC: the Bible counts from events like the Exodus and a king&apos;s reign, and any BC date for the judges comes from outside it. The Book of <Link href="/books/ruth" className={link}>Ruth</Link> is set in this period, &quot;in the days when the judges ruled&quot; (Ruth 1:1).
          </p>
        </Section>

        <Section id="tribes" title="Which tribe did each judge come from?">
          <p className="leading-relaxed">
            Seven of the {DATA.count} judges can be placed in a tribe from the text, and each is a different one: Judah (Othniel), Benjamin (Ehud), Manasseh (Gideon), Issachar (Tola), Zebulun (Elon), Ephraim (Abdon) and Dan (Samson). Five are named outright: Ehud &quot;a Benjamite&quot; (Judges 3:15), Gideon&apos;s family &quot;in Manasseh&quot; (Judges 6:15), Tola &quot;a man of Issachar&quot; (Judges 10:1), Elon &quot;a Zebulonite&quot; (Judges 12:11) and Samson&apos;s father &quot;of the family of the Danites&quot; (Judges 13:2). Two more, {joinAnd(DATA.tribes.gileadites)}, are called Gileadites, from the land east of the Jordan, with no tribe named. Shamgar, Deborah and Ibzan have no tribe given at all: Deborah lived &quot;between Ramah and Bethel in mount Ephraim&quot; (Judges 4:5), and Ibzan was &quot;of Bethlehem&quot; (Judges 12:8).
          </p>
          <p className="mt-3 leading-relaxed">
            The other two come by inference: Othniel was &quot;Caleb&apos;s younger brother&quot; (Judges 1:13), and Caleb was &quot;of the tribe of Judah&quot; (Numbers 13:6); Abdon was buried &quot;in Pirathon in the land of Ephraim&quot; (Judges 12:15). Outside the twelve, Barak came from Kedesh-naphtali (Judges 4:6), Eli was a priest, of the house God chose &quot;out of all the tribes of Israel to be my priest&quot; (1 Samuel 2:28), and Samuel&apos;s family lived in mount Ephraim (1 Samuel 1:1), though 1 Chronicles 6:33 lists him among the Levites, a Kohathite (&quot;Shemuel&quot; in the KJV). The KJV calls his father Elkanah &quot;an Ephrathite&quot;, the WEB &quot;an Ephraimite&quot;. See all twelve tribes on <Link href="/twelve-tribes-of-israel" className={link}>the twelve tribes of Israel</Link>.
          </p>
        </Section>

        <Section id="deborah" title="Who was the only woman judge?" muted>
          <p className="leading-relaxed">
            Deborah was the only woman judge: &quot;Deborah, a prophetess, the wife of Lapidoth, she judged Israel at that time&quot; (Judges 4:4, KJV). The text shows her settling cases: &quot;the children of Israel came up to her for judgment&quot; under her palm tree (Judges 4:5). Barak would not go to war without her (&quot;If thou wilt go with me, then I will go&quot;, Judges 4:8), and she told him the LORD would &quot;sell Sisera into the hand of a woman&quot; (Judges 4:9). That woman was Jael, who killed Sisera with a tent nail (Judges 4:21). In her song Deborah calls herself &quot;a mother in Israel&quot; (Judges 5:7). More of the women the Bible names are on <Link href="/women-of-the-bible" className={link}>the women of the Bible</Link>.
          </p>
        </Section>

        <Section id="eli-samuel" title="Who were the last judges, Eli and Samuel?">
          <p className="leading-relaxed">
            Eli and Samuel were the last two judges, and their stories are in <Link href="/books/1-samuel" className={link}>1 Samuel</Link>, not Judges. Eli was the priest at Shiloh; he &quot;had judged Israel forty years&quot; and died at {DATA.eliAge}, falling backward when he heard the ark of God was taken (1 Samuel 4:15-18). Samuel &quot;judged Israel all the days of his life&quot;, going on a yearly circuit to Bethel, Gilgal and Mizpeh (1 Samuel 7:15-16); the text gives no number of years. When he was old he made his sons Joel and Abiah judges, but they &quot;took bribes&quot; (1 Samuel 8:1-3), and the people asked for &quot;a king to judge us like all the nations&quot; (1 Samuel 8:5). Samuel anointed Saul, the first of <Link href="/kings-of-israel-and-judah" className={link}>the kings of Israel and Judah</Link>.
          </p>
          <p className="mt-3 leading-relaxed">
            The word &quot;judged&quot; appears {W.judgedKjv.total} times in the KJV ({W.judgedWeb.total} in the WEB), more in Judges ({W.judgedKjv.inJudges}) than in any other book. &quot;Judges&quot; appears only {W.judgesKjv.inJudges} times in the Book of Judges itself, KJV, all in chapter 2. Hebrews 11:32 names four of the judges, and Barak, among the people of faith: &quot;Gedeon, and of Barak, and of Samson, and of Jephthae; of David also, and Samuel&quot;.
          </p>
        </Section>

        <FaqSection title="Questions about the judges of Israel" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every number of years, and every count on this page, checked and counted by scripts/lists/judges-of-israel.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
            <li>
              Wikipedia, <a href={wiki} className={link}>&quot;Hebrew Bible judges&quot;</a>: the major and minor labels and the length of narrative behind them (read 2026-10-25).
            </li>
            <li>
              Wikipedia, <a href={wikiBook} className={link}>&quot;Book of Judges&quot;</a>: the six minor judges as &quot;brief glosses&quot; (read 2026-10-25).
            </li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read about the books: <Link href="/books/judges" className={link}>Judges</Link>, <Link href="/books/ruth" className={link}>Ruth</Link> and <Link href="/books/1-samuel" className={link}>1 Samuel</Link>. Word counts: {wordLink("judge", "judge")}, {wordLink("gideon", "Gideon")}, {wordLink("samson", "Samson")} and {wordLink("deborah", "Deborah")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
