import { OG_VIDEOS } from "@/lib/og-video";
/* The kings of Israel and Judah in order: Saul, David and Solomon, the 19 kings of the northern kingdom and the
   20 rulers of Judah, with the reign length, the verdict and the end of each reign as the Bible gives them.
   Every row is checked against the KJV verse it cites by scripts/lists/kings-of-israel-and-judah.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/kings-of-israel-and-judah.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/kings-of-israel-and-judah`;
const S = DATA.stats;
const W = DATA.words;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const first = (l) => l[0].name;
const last = (l) => l.at(-1).name;
const VERDICT = { right: "Right", not: "Not right", none: "No verdict" };

const TITLE = `Kings of Israel in Order: All ${S.rulers} Rulers, Israel and Judah`;
const ANSWER = `The kings of Israel in order, after the kingdom split, were ${joinAnd(DATA.israel.map((r) => r.name))}: ${DATA.israel.length} kings. Before them ${joinAnd(DATA.united.map((r) => r.name))} ruled all Israel, and Judah had ${DATA.judah.length} rulers from ${first(DATA.judah)} to ${last(DATA.judah)}, ${S.judahKings} kings and one queen, Athaliah: ${S.rulers} rulers in all. The text says ${S.judahRight} of Judah's kings did right in the sight of the LORD. It says that of none of Israel's.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `All ${S.rulers} rulers of Israel and Judah in order, Saul to Zedekiah: how long each reigned, the Bible's verdict and how each reign ended, every verse checked.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many kings did Israel have?", a: `After the kingdom split, the northern kingdom of Israel had ${DATA.israel.length} kings, from ${first(DATA.israel)} to ${last(DATA.israel)}. Before the split, ${DATA.united.length} kings ruled over all Israel: ${joinAnd(DATA.united.map((r) => r.name))}. Judah, the southern kingdom, had ${DATA.judah.length} rulers. Together that is ${S.rulers}.` },
  { q: "How many kings are in the Bible?", a: `Israel and Judah had ${S.kingsOnly} kings and one ruling queen, ${S.rulers} rulers in all. The Bible also names many kings of other nations, such as the Pharaohs of Egypt and Nebuchadnezzar of Babylon, and this page does not count them. The word "king" appears ${fmt(W.kingKjv.total)} times in the King James Version and ${fmt(W.kingWeb.total)} times in the World English Bible.` },
  { q: "Who was the first king of Israel?", a: `Saul, of the tribe of Benjamin. Samuel presented him to the people, who shouted "God save the king" (1 Samuel 10:24), and they "made Saul king before the LORD in Gilgal" (1 Samuel 11:15). Acts 13:21 gives his reign as forty years. The first king of the northern kingdom, after the split, was Jeroboam (1 Kings 12:20).` },
  { q: "Who was the best king of Judah?", a: `The text praises two above the rest. Of Hezekiah: "after him was none like him among all the kings of Judah, nor any that were before him" (2 Kings 18:5), for his trust in the LORD. Of Josiah: "like unto him was there no king before him, that turned to the LORD with all his heart" (2 Kings 23:25), for keeping the law of Moses. Of the kings before the split, David is the one later kings are measured against: Asa did right "as did David his father" (1 Kings 15:11).` },
  { q: "Who reigned the longest?", a: `Manasseh of Judah, ${S.longest.text} (${S.longest.ref}). The longest reign in the northern kingdom was ${S.israelLongest}'s, ${DATA.israel.find((r) => r.name === S.israelLongest).lengthText} (2 Kings 14:23). The shortest was Zimri's, ${S.shortest.text} (${S.shortest.ref}).` },
  { q: "Was there a queen who ruled Israel or Judah?", a: `One. Athaliah, the mother of King Ahaziah of Judah, took the throne when her son was killed and "destroyed all the seed royal" (2 Kings 11:1). One grandson, Joash, was hidden from her, and she reigned ${DATA.judah.find((r) => r.name === "Athaliah").lengthText} (2 Kings 11:3) until she was slain (2 Kings 11:16). Jezebel was a king's wife, married to Ahab (1 Kings 16:31), and never ruled in her own name.` },
];

function KingTable({ rows, caption }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Ruler</th>
            <th className="p-3 font-semibold">Reigned</th>
            <th className="p-3 font-semibold">The text&apos;s verdict</th>
            <th className="p-3 font-semibold">How the reign ended</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name + r.order} className="border-b last:border-0 align-top">
              <td className="p-3 tabular-nums text-muted-foreground">{r.order}</td>
              <td className="p-3 font-medium">
                {getWord(r.name.toLowerCase()) ? <Link href={`/words/${r.name.toLowerCase()}`} className={link}>{r.name}</Link> : r.name}
                {r.aka ? <span className="block text-xs font-normal text-muted-foreground">also {r.aka.name} ({r.aka.ref})</span> : null}
              </td>
              <td className="p-3 whitespace-nowrap">
                {r.lengthText}
                <span className="block text-xs text-muted-foreground">{r.lenRef}</span>
              </td>
              <td className="p-3 min-w-[14rem]">
                <span className="font-medium">{VERDICT[r.verdict]}</span>
                {r.vQuote ? (
                  <span className="block text-xs text-muted-foreground">
                    &quot;{r.vQuote}&quot; {r.vRef}
                  </span>
                ) : (
                  <span className="block text-xs text-muted-foreground">none given in the text</span>
                )}
              </td>
              <td className="p-3 min-w-[12rem]">
                {r.endText}
                <span className="block text-xs text-muted-foreground">{r.endRef}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KingsOfIsraelAndJudah() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "Kings of Israel and Judah in order", url: URL },
    ]),
    generateDataArticleSchema({ headline: "The kings of Israel and Judah in order", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  const zimri = DATA.israel.find((r) => r.name === "Zimri");
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "Kings of Israel and Judah in order" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">The kings of Israel and Judah in order</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every reign length, verdict and ending is checked against the verse it cites in the King James Version, and every reign length against the World English Bible too. Word counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Rulers", value: S.rulers, note: `${DATA.united.length} united, ${DATA.israel.length} Israel, ${DATA.judah.length} Judah` },
                { label: "Judah's kings who did right", value: `${S.judahRight} of ${S.judahKings}`, note: "Israel's: none" },
                { label: "Longest reign", value: S.longest.text, note: `${S.longest.name}, ${S.longest.ref}` },
                { label: "Israel's kings killed by the next king", value: `${S.israelKilled} of ${DATA.israel.length}`, note: "Nadab to Pekah" },
              ]}
            />
          </div>
        </section>

        <Section id="united" title="The united kingdom: Saul, David and Solomon" intro="The first three kings ruled over all Israel, the twelve tribes together. Each reigned forty years by the Bible's count.">
          <KingTable rows={DATA.united} caption="Kings of the united kingdom of Israel" />
          <p className="mt-4 leading-relaxed">
            Saul&apos;s forty years come from Paul&apos;s sermon in Acts 13:21. The verse in 1 Samuel that should give the length of his reign is unclear. The King James Version reads &quot;Saul reigned one year; and when he had reigned two years over Israel&quot; (1 Samuel 13:1). The World English Bible fills in different numbers: &quot;Saul was thirty years old when he became king, and he reigned over Israel forty-two years.&quot; After Saul died, his son Ish-bosheth &quot;reigned two years&quot; over Israel while Judah followed David (2 Samuel 2:10). He is not counted in the usual list.
          </p>
          <p className="mt-3 leading-relaxed">
            David&apos;s forty years split into two parts. &quot;In Hebron he reigned over Judah seven years and six months: and in Jerusalem he reigned thirty and three years over all Israel and Judah&quot; (2 Samuel 5:5).
          </p>
        </Section>

        <Section id="split" title="Why there are two lists" muted>
          <p className="leading-relaxed">
            The kingdom split when Solomon&apos;s son Rehoboam took the throne. The prophet Ahijah had told Jeroboam that God would &quot;rend the kingdom out of the hand of Solomon, and will give ten tribes to thee&quot; (1 Kings 11:31). When Rehoboam refused to lighten the people&apos;s load, the northern tribes made Jeroboam &quot;king over all Israel: there was none that followed the house of David, but the tribe of Judah only&quot; (1 Kings 12:20). From then on &quot;Israel&quot; in Kings usually means the northern kingdom, and Judah is the southern one, ruled from Jerusalem by David&apos;s line.
          </p>
        </Section>

        <Section id="israel" title={`The ${DATA.israel.length} kings of Israel in order`} intro={`The northern kingdom, from ${first(DATA.israel)} to ${last(DATA.israel)}. Jeroboam ruled from Shechem (1 Kings 12:25), the next kings from Tirzah (1 Kings 15:33), and from Omri's reign on the kings ruled from Samaria, the city Omri built (1 Kings 16:24).`}>
          <KingTable rows={DATA.israel} caption="Kings of the northern kingdom of Israel" />
          <p className="mt-4 leading-relaxed">
            Not one of Israel&apos;s kings is said to have done right. The usual verdict is that he &quot;did that which was evil in the sight of the LORD&quot; and &quot;departed not from the sins of Jeroboam&quot;. Jehu comes closest to praise: God tells him &quot;thou hast done well in executing that which is right in mine eyes&quot; for wiping out Ahab&apos;s house (2 Kings 10:30). But the next verse says he still kept to the sins of Jeroboam. Shallum, who reigned a month, is the only king of Israel given no verdict at all.
          </p>
          <p className="mt-3 leading-relaxed">
            Israel changed hands by murder again and again. Of its {DATA.israel.length} kings, {S.israelKilled} were killed, and each time the killer took the throne: {joinAnd(DATA.usurpers.map((u) => `${u.killer} killed ${u.victim}`))}. Zimri lasted {zimri.lengthText}, then &quot;burnt the king&apos;s house over him with fire, and died&quot; (1 Kings 16:18). After him the people split between Omri and Tibni the son of Ginath, until &quot;Tibni died, and Omri reigned&quot; (1 Kings 16:21-22). Tibni is not counted as a king.
          </p>
          <p className="mt-3 leading-relaxed">
            The kingdom ended under Hoshea. &quot;In the ninth year of Hoshea the king of Assyria took Samaria, and carried Israel away into Assyria&quot; (2 Kings 17:6). &quot;There was none left but the tribe of Judah only&quot; (2 Kings 17:18).
          </p>
        </Section>

        <Section id="judah" title={`The ${DATA.judah.length} rulers of Judah in order`} intro={`The southern kingdom, from ${first(DATA.judah)} to ${last(DATA.judah)}: ${S.judahKings} kings of David's line and one queen.`} muted>
          <KingTable rows={DATA.judah} caption="Kings and the queen of Judah" />
          <p className="mt-4 leading-relaxed">
            Athaliah broke the line. When her son Ahaziah was killed she &quot;destroyed all the seed royal&quot; (2 Kings 11:1), but Ahaziah&apos;s sister Jehosheba hid his young son Joash in the house of the LORD for six years (2 Kings 11:2-3). At seven he was crowned (2 Kings 11:21) and Athaliah was slain. Several kings carry two names in the text, shown under each name in the table: Abijam is Abijah in Chronicles, Azariah is also called Uzziah, and Jehoiachin appears as Jeconiah and Coniah. Pharaoh Necho renamed Eliakim as Jehoiakim, and the king of Babylon renamed Mattaniah as Zedekiah.
          </p>
          <p className="mt-3 leading-relaxed">
            Jerusalem fell in Zedekiah&apos;s eleventh year (2 Kings 25:2). The king of Babylon&apos;s men &quot;burnt the house of the LORD, and the king&apos;s house, and all the houses of Jerusalem&quot; and broke down its walls (2 Kings 25:9-10). Zedekiah was blinded and taken to Babylon (2 Kings 25:7): &quot;So Judah was carried away out of their land&quot; (2 Kings 25:21). The last verses of 2 Kings turn to the earlier captive king, Jehoiachin. In the thirty-seventh year of his captivity he was let out of prison and &quot;did eat bread continually before&quot; the king of Babylon &quot;all the days of his life&quot; (2 Kings 25:27-30).
          </p>
        </Section>

        <Section id="verdicts" title="Good kings and bad kings" intro={`The phrase "right in the sight of the LORD" (or "in the eyes of the LORD") appears in ${W.rightFormula.total} verses of 1 and 2 Kings and 2 Chronicles. Every one is about David or a king of Judah.`}>
          <p className="leading-relaxed">
            The {S.judahRight} kings of Judah the text says did right are {joinAnd(S.judahRightNames)}. Most come with a limit. Asa and Jehoshaphat left the high places standing (1 Kings 15:14, 22:43). Jehoash did right only &quot;all his days wherein Jehoiada the priest instructed him&quot; (2 Kings 12:2). Amaziah did right &quot;yet not like David his father&quot; (2 Kings 14:3). Ahaz is the one king the phrase is used of in the negative: he &quot;did not that which was right in the sight of the LORD his God&quot; (2 Kings 16:2).
          </p>
          <p className="mt-3 leading-relaxed">
            Two kings get more than the formula. Hezekiah trusted the LORD &quot;so that after him was none like him among all the kings of Judah, nor any that were before him&quot; (2 Kings 18:5). Josiah turned to the LORD &quot;with all his heart, and with all his soul, and with all his might&quot;, and &quot;neither after him arose there any like him&quot; (2 Kings 23:25). Manasseh, Hezekiah&apos;s son, reigned longest and is judged harshly in Kings. 2 Chronicles adds that when he was taken to Babylon in chains he &quot;humbled himself greatly before the God of his fathers&quot;, and &quot;then Manasseh knew that the LORD he was God&quot; (2 Chronicles 33:12-13).
          </p>
        </Section>

        <Section id="years" title="How long did the kingdoms last?" muted>
          <p className="leading-relaxed">
            Add up the reigns as the Bible gives them and Israel&apos;s {DATA.israel.length} kings come to {S.israelYears} years, plus {joinAnd(S.israelShort)}. Judah&apos;s {DATA.judah.length} rulers come to {S.judahYears} years, plus {joinAnd(S.judahShort)}.
          </p>
          <p className="mt-3 leading-relaxed">
            Those sums are not how long the kingdoms lasted, because some reigns overlapped. The text shows it twice. When Azariah became a leper, &quot;Jotham the king&apos;s son was over the house, judging the people of the land&quot; (2 Kings 15:5) while his father was still king. And Jehoram of Judah began to reign with &quot;Jehoshaphat being then king of Judah&quot; (2 Kings 8:16).
          </p>
          <p className="mt-3 leading-relaxed">
            This page gives no BC dates. The Bible dates each reign against the other kingdom&apos;s, as in &quot;In the third year of Asa king of Judah began Baasha&quot; (1 Kings 15:33), not against a calendar used today. Dates in years BC come from outside the text, so they are left off rather than given without a source.
          </p>
        </Section>

        <Section id="words" title={`"King" in the Bible`}>
          <p className="leading-relaxed">
            &quot;King&quot; appears {fmt(W.kingKjv.total)} times in the King James Version, in {fmt(W.kingKjv.verses)} verses across {W.kingKjv.books} books, and {fmt(W.kingWeb.total)} times in the World English Bible. {W.kingKjv.top.book} has the most, {W.kingKjv.top.count} in the KJV. Counting &quot;kings&quot; and &quot;king&apos;s&quot; too, the KJV has {fmt(W.kingAllKjv.total)} and the WEB {fmt(W.kingAllWeb.total)}. The phrase the history uses to close most reigns, &quot;slept with his fathers&quot;, appears {W.sleptKjv.total} times in the KJV. &quot;Queen&quot; appears {W.queenKjv.total} times in the KJV, {W.queenKjv.top.count} of them in {W.queenKjv.top.book}.
          </p>
        </Section>

        <FaqSection title="Questions about the kings of Israel and Judah" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every reign length, verdict and ending, and every count on this page, checked and counted by scripts/lists/kings-of-israel-and-judah.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            The reigns are told in <Link href="/books/1-kings" className={link}>1 Kings</Link> and <Link href="/books/2-kings" className={link}>2 Kings</Link>, and Judah&apos;s again in <Link href="/books/1-chronicles" className={link}>1 Chronicles</Link> and <Link href="/books/2-chronicles" className={link}>2 Chronicles</Link>. Saul&apos;s and David&apos;s stories are in <Link href="/books/1-samuel" className={link}>1 Samuel</Link> and <Link href="/books/2-samuel" className={link}>2 Samuel</Link>. Related lists: <Link href="/twelve-tribes-of-israel" className={link}>the twelve tribes of Israel</Link>, <Link href="/major-and-minor-prophets" className={link}>the major and minor prophets</Link>, who spoke to many of these kings, and <Link href="/how-many-wives-did-solomon-have" className={link}>how many wives Solomon had</Link>. Word counts: {wordLink("king", "king")}, {wordLink("david", "David")}, {wordLink("solomon", "Solomon")}, {wordLink("jerusalem", "Jerusalem")} and {wordLink("samaria", "Samaria")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
