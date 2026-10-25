import { OG_VIDEOS } from "@/lib/og-video";
/* How many children did David have: the four lists of David's sons read from the KJV (with the WEB spellings), the
   Jerusalem sons side by side, Tamar, the child who died, what became of each son, David's wives and concubines, and why
   Solomon and not the eldest became king. Counted by scripts/lists/how-many-children-did-david-have.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-many-children-did-david-have.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-children-did-david-have`;
const T = DATA.totals;
const W = DATA.words;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const bathSons = DATA.jerusalem.filter((r) => r.bathsheba).map((r) => r.chr3);

const TITLE = `How Many Children Did David Have? ${T.namedSons} Sons and Tamar`;
const ANSWER = `David had at least ${T.namedSons} named sons and one named daughter, Tamar. 1 Chronicles 3:1-9 lists ${T.hebron} sons born in Hebron and ${T.jerusalemChr3} in Jerusalem, "beside the sons of the concubines, and Tamar their sister" (KJV). A son of Bathsheba died as an infant and is never named. The Bible names ${T.wivesNamed} of David's wives, plus ${T.concubinesCounted} concubines.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `David had ${T.namedSons} named sons and a daughter, Tamar (1 Chronicles 3:1-9), and ${T.wivesNamed} named wives. Every son in order, his mother, and what became of him.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many sons did David have?", a: `${T.namedSons} sons are named in 1 Chronicles 3:1-8 (KJV): ${T.hebron} born in Hebron and ${T.jerusalemChr3} in Jerusalem. One more, Jerimoth, is called "the son of David" in 2 Chronicles 11:18 but is in none of the lists, and Bathsheba's first son died unnamed. 1 Chronicles 3:9 leaves out "the sons of the concubines", so the full number is not given.` },
  { q: "How many wives did David have?", a: `The Bible names ${T.wivesNamed}: Michal, Ahinoam, Abigail, Maacah, Haggith, Abital, Eglah and Bathsheba. 2 Samuel 5:13 says he took "more concubines and wives out of Jerusalem" without naming them, and 2 Samuel 15:16 counts ${T.concubinesCounted} concubines.` },
  { q: "Who was David's firstborn son?", a: `Amnon, the son of Ahinoam the Jezreelitess (2 Samuel 3:2). He raped his sister Tamar, and two years later Absalom had him killed (2 Samuel 13:23-29).` },
  { q: "How many sons did David have with Bathsheba?", a: `${T.bathshebaTotal}. The first died "on the seventh day" (2 Samuel 12:18) and is never named. 1 Chronicles 3:5 lists four more "of Bath-shua the daughter of Ammiel": ${joinAnd(bathSons)}.` },
  { q: "Did David have daughters?", a: `Yes. Tamar is the only one named (2 Samuel 13:1; 1 Chronicles 3:9). 2 Samuel 5:13 says "there were yet sons and daughters born to David" in Jerusalem, and 2 Samuel 13:18 mentions "the king's daughters that were virgins", so there were others the Bible does not name.` },
  { q: "Why did Solomon become king instead of Adonijah?", a: `David had sworn to Bathsheba that "Solomon thy son shall reign after me" (1 Kings 1:17, 1:30), and 1 Chronicles 28:5 says God "hath chosen Solomon my son". Adonijah, the fourth son and the oldest the story still mentions, declared himself king, but Nathan and Bathsheba went to David, and Solomon was anointed while David was alive (1 Kings 1:39). Adonijah later said "the kingdom was mine... for it was his from the LORD" (1 Kings 2:15).` },
];

const cell = (name, webName) =>
  name ? (
    <>
      {name}
      {webName && webName !== name ? <span className="block text-xs text-muted-foreground">WEB: {webName}</span> : null}
    </>
  ) : (
    <span className="text-muted-foreground">not listed</span>
  );

export default function DavidChildren() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many children did David have?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many children did David have?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many children did David have?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many children did David have?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every name on this page is read from the King James Version and checked against the World English Bible spelling. Word counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Sons named", value: T.namedSons, note: "1 Chronicles 3:1-8, KJV" },
                { label: "Daughter named", value: T.daughtersNamed, note: "Tamar, 1 Chronicles 3:9" },
                { label: "Wives named", value: T.wivesNamed, note: "1 and 2 Samuel, KJV" },
                { label: `"David" in the KJV`, value: fmt(W.davidKjv.total), note: `${fmt(W.davidWeb.total)} in the WEB` },
              ]}
            />
          </div>
        </section>

        <Section id="hebron" title="Who were David's sons born in Hebron?" intro={`Six sons were born to David in Hebron, each to a different mother, in the seven years and six months he reigned there (2 Samuel 3:2-5; 1 Chronicles 3:1-4). Both lists number them, from "the firstborn" to "the sixth".`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">Son (2 Samuel 3)</th>
                  <th className="p-3 font-semibold">Son (1 Chronicles 3)</th>
                  <th className="p-3 font-semibold">Mother</th>
                </tr>
              </thead>
              <tbody>
                {DATA.hebron.map((h) => (
                  <tr key={h.order} className="border-b last:border-0 align-top">
                    <td className="p-3 tabular-nums">{h.order}</td>
                    <td className="p-3 font-medium">{getWord(h.sam.toLowerCase()) ? <Link href={`/words/${h.sam.toLowerCase()}`} className={link}>{h.sam}</Link> : h.sam}</td>
                    <td className="p-3">{h.chr}{h.chr !== h.sam ? <span className="block text-xs text-muted-foreground">a different name</span> : null}</td>
                    <td className="p-3">{h.mother}{h.note ? <span className="block text-xs text-muted-foreground">{h.note}</span> : null}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The two lists agree on every son but the second. Abigail&apos;s son is Chileab in 2 Samuel 3:3 and Daniel in 1 Chronicles 3:1, and nothing more is told of him under either name: &quot;Chileab&quot; appears nowhere else in the Bible. 1 Chronicles 3:2 spells Absalom&apos;s mother Maachah. Read the narrative in <Link href="/books/2-samuel" className={link}>2 Samuel</Link> and the genealogy in <Link href="/books/1-chronicles" className={link}>1 Chronicles</Link>.
          </p>
        </Section>

        <Section id="jerusalem" title="Who were David's sons born in Jerusalem?" intro={`${T.jerusalemChr3} sons born in Jerusalem are named in 1 Chronicles 3:5-8 and again in 1 Chronicles 14:4-7; 2 Samuel 5:14-16 names ${T.jerusalemSam5} of them. The lists agree on the order but spell ${T.spellingRows} of the ${T.jerusalemChr3} names differently (KJV).`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">#</th>
                  <th className="p-3 font-semibold">2 Samuel 5:14-16</th>
                  <th className="p-3 font-semibold">1 Chronicles 3:5-8</th>
                  <th className="p-3 font-semibold">1 Chronicles 14:4-7</th>
                  <th className="p-3 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {DATA.jerusalem.map((r) => {
                  const differ = new Set([r.sam, r.chr3, r.chr14].filter(Boolean)).size > 1;
                  const note = [r.bathsheba ? "Bathsheba's son (1 Chronicles 3:5)" : null, !r.sam ? "only in Chronicles" : null, differ ? "spelled differently" : null].filter(Boolean).join("; ");
                  return (
                    <tr key={r.row} className="border-b last:border-0 align-top">
                      <td className="p-3 tabular-nums">{r.row}</td>
                      <td className="p-3">{cell(r.sam, r.web.sam)}</td>
                      <td className="p-3">{cell(r.chr3, r.web.chr3)}</td>
                      <td className="p-3">{cell(r.chr14, r.web.chr14)}</td>
                      <td className="p-3 text-xs text-muted-foreground">{note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            1 Chronicles 3 does its own sum: {joinAnd(bathSons)} are &quot;four, of Bath-shua the daughter of Ammiel&quot; (3:5), and the rest end with &quot;Eliphelet, nine&quot; (3:8). Six from Hebron, four and nine make {T.namedSons}. Two names come twice in that list, {joinAnd(T.repeated)}, so the {T.namedSons} sons carry {T.distinctNames} different names. 2 Samuel 5 leaves out the first {joinAnd(T.onlyInChronicles)}, which is why it has {T.jerusalemSam5} names to Chronicles&apos; {T.jerusalemChr3}. The Bible does not say why.
          </p>
          <p className="mt-3 leading-relaxed">
            The Jerusalem lists, unlike the Hebron ones, give no &quot;firstborn&quot; or &quot;second&quot;, so they may not be in birth order. Solomon is listed fourth of Bathsheba&apos;s sons, but 2 Samuel 12:24 tells of his birth straight after the death of her first child. Both lists open by saying there were daughters too: &quot;there were yet sons and daughters born to David&quot; (2 Samuel 5:13), and &quot;David begat more sons and daughters&quot; (1 Chronicles 14:3).
          </p>
        </Section>

        <Section id="total" title="How many children did David have in all?" intro={`The Bible identifies ${T.identified} of David's children by name or by story: ${T.namedSons} sons in 1 Chronicles 3, Tamar, the child of Bathsheba who died, and Jerimoth. It never gives a full total.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Children</th>
                  <th className="p-3 font-semibold text-right">Count</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="p-3">Sons born in Hebron</td><td className="p-3 text-right tabular-nums">{T.hebron}</td><td className="p-3">1 Chronicles 3:1-4</td></tr>
                <tr className="border-b"><td className="p-3">Sons born in Jerusalem (four of Bathsheba, nine more)</td><td className="p-3 text-right tabular-nums">{T.jerusalemChr3}</td><td className="p-3">1 Chronicles 3:5-8</td></tr>
                <tr className="border-b"><td className="p-3">Daughter: Tamar</td><td className="p-3 text-right tabular-nums">{T.daughtersNamed}</td><td className="p-3">1 Chronicles 3:9</td></tr>
                <tr className="border-b"><td className="p-3">Bathsheba&apos;s first son, who died unnamed</td><td className="p-3 text-right tabular-nums">{T.diedUnnamed}</td><td className="p-3">2 Samuel 12:18</td></tr>
                <tr className="border-b"><td className="p-3">Jerimoth, named in none of the lists</td><td className="p-3 text-right tabular-nums">{T.jerimoth}</td><td className="p-3">2 Chronicles 11:18</td></tr>
                <tr className="border-b font-semibold"><td className="p-3">Children the Bible identifies</td><td className="p-3 text-right tabular-nums">{T.identified}</td><td className="p-3"></td></tr>
                <tr className="border-b"><td className="p-3">Sons of the concubines</td><td className="p-3 text-right">not counted</td><td className="p-3">1 Chronicles 3:9</td></tr>
                <tr><td className="p-3">Other daughters</td><td className="p-3 text-right">not counted</td><td className="p-3">2 Samuel 5:13; 13:18</td></tr>
              </tbody>
            </table>
          </div>
          <blockquote className="mt-5 border-l-4 pl-4 italic leading-relaxed">{DATA.quotes.verse9.kjv} <span className="not-italic text-sm text-muted-foreground">(1 Chronicles 3:9, KJV)</span></blockquote>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{DATA.quotes.verse9.web} <span className="not-italic text-sm text-muted-foreground">(1 Chronicles 3:9, WEB)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            Jerimoth appears once as David&apos;s son: Rehoboam married &quot;Mahalath the daughter of Jerimoth the son of David&quot; (2 Chronicles 11:18). He is not in any of the four lists, and the Bible does not name his mother. Michal, Saul&apos;s daughter, &quot;had no child unto the day of her death&quot; (2 Samuel 6:23). 2 Samuel 21:8 speaks of &quot;the five sons of Michal the daughter of Saul, whom she brought up for Adriel&quot; (KJV; the WEB has &quot;whom she bore to Adriel&quot;), but Adriel was the husband of her older sister Merab (1 Samuel 18:19), and none of the five is called David&apos;s son.
          </p>
        </Section>

        <Section id="bathsheba" title="How many sons did David have with Bathsheba?" intro={`David had ${T.bathshebaTotal} sons with Bathsheba: the first, who died, and the four that 1 Chronicles 3:5 lists "of Bath-shua the daughter of Ammiel": ${joinAnd(bathSons)}.`} muted>
          <p className="leading-relaxed">
            She was &quot;Bath-sheba, the daughter of Eliam, the wife of Uriah the Hittite&quot; (2 Samuel 11:3). After Uriah&apos;s death &quot;she became his wife, and bare him a son&quot; (2 Samuel 11:27). The next son was Solomon: &quot;she bare a son, and he called his name Solomon: and the LORD loved him&quot;, and through the prophet Nathan he was also named Jedidiah (2 Samuel 12:24-25). 1 Chronicles 3:5 calls her Bath-shua and her father Ammiel. Two of her sons lead to Jesus: Matthew&apos;s genealogy runs through Solomon (&quot;Solomon of her that had been the wife of Urias&quot;, Matthew 1:6) and Luke&apos;s through Nathan (Luke 3:31). Her name, spelled Bath-sheba, appears {W.bathshebaKjv} times in the King James Version and {W.bathshebaWeb} times as Bathsheba in the WEB.
          </p>
        </Section>

        <Section id="died" title="What happened to the child who died?" intro="Bathsheba's first son by David died &quot;on the seventh day&quot; of the illness the prophet Nathan had foretold, and the Bible never gives his name.">
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{DATA.quotes.died.kjv} <span className="not-italic text-sm text-muted-foreground">(2 Samuel 12:18, KJV)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            Nathan told David that &quot;the child also that is born unto thee shall surely die&quot; (2 Samuel 12:14), and the next verse says &quot;the LORD struck the child that Uriah&apos;s wife bare unto David, and it was very sick&quot;. While the child lived, David &quot;fasted, and went in, and lay all night upon the earth&quot; (12:16). When he died, David washed, worshipped and ate (12:20). His reason: &quot;{DATA.quotes.goTo}&quot; (2 Samuel 12:23, KJV).
          </p>
        </Section>

        <Section id="tamar" title="Who was David's daughter Tamar?" intro="Tamar is the only daughter of David the Bible names; 2 Samuel 13:1 calls her Absalom's sister." muted>
          <p className="leading-relaxed">
            Her brother Amnon, David&apos;s firstborn, raped her (2 Samuel 13:14). She wore &quot;a garment of divers colours&quot;, which the text explains: &quot;with such robes were the king&apos;s daughters that were virgins apparelled&quot; (13:18). Afterwards &quot;Tamar remained desolate in her brother Absalom&apos;s house&quot; (13:20). David &quot;was very wroth&quot; (13:21), but the text records nothing he did. Absalom said nothing to Amnon for &quot;two full years&quot;, then had his servants kill him at a sheep-shearing feast (13:22-29). Absalom later named his only daughter Tamar (2 Samuel 14:27). &quot;Tamar&quot; appears {W.tamarKjv} times in the King James Version ({W.tamarWeb} in the WEB), {W.tamar2SamKjv} of them in 2 Samuel; the rest are mostly Judah&apos;s daughter-in-law in Genesis 38 and a place named in Ezekiel. More women of the Bible are on <Link href="/women-of-the-bible" className={link}>the women of the Bible</Link>.
          </p>
        </Section>

        <Section id="fates" title="What happened to David's sons?" intro={`${T.killed.length} of David's sons were killed (${joinAnd(T.killed)}), one became king, and for most of the rest the Bible records only a name.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Son</th>
                  <th className="p-3 font-semibold">What the Bible records</th>
                  <th className="p-3 font-semibold">Verses</th>
                </tr>
              </thead>
              <tbody>
                {DATA.fates.map((f) => (
                  <tr key={f.son} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium whitespace-nowrap">{f.son}</td>
                    <td className="p-3">{f.text}</td>
                    <td className="p-3 text-xs">{f.refs.length ? f.refs.join("; ") : "2 Samuel 3; 1 Chronicles 3"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Absalom&apos;s death brought the cry &quot;O my son Absalom, my son, my son Absalom! would God I had died for thee&quot; (2 Samuel 18:33). The other Jerusalem sons, from Shobab to the last Eliphelet, appear only in the lists. 2 Samuel 8:18 says &quot;David&apos;s sons were chief rulers&quot; (KJV; the WEB has &quot;chief ministers&quot;) without naming them. Word counts: {wordLink("absalom", "Absalom")} ({W.absalomKjv} times in the KJV, {W.absalomWeb} in the WEB), {wordLink("adonijah", "Adonijah")}, {wordLink("solomon", "Solomon")} and {wordLink("nathan", "Nathan")}.
          </p>
        </Section>

        <Section id="wives" title="How many wives did David have?" intro={`The Bible names ${T.wivesNamed} wives of David, and says he took "more concubines and wives out of Jerusalem" (2 Samuel 5:13) without naming them. ${T.concubinesCounted} concubines are counted in 2 Samuel 15:16.`} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Wife</th>
                  <th className="p-3 font-semibold">Who she was</th>
                  <th className="p-3 font-semibold">Verses</th>
                </tr>
              </thead>
              <tbody>
                {DATA.wives.map((w) => (
                  <tr key={w.name} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium whitespace-nowrap">{getWord(w.name.toLowerCase()) ? <Link href={`/words/${w.name.toLowerCase()}`} className={link}>{w.name}</Link> : w.name}</td>
                    <td className="p-3">{w.text}</td>
                    <td className="p-3 text-xs">{w.refs.join("; ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            The {T.concubinesCounted} concubines are the women David &quot;left ... to keep the house&quot; when he fled Absalom (2 Samuel 15:16). Absalom went in to them &quot;in the sight of all Israel&quot; (16:22), and when David came back he kept them shut up &quot;unto the day of their death, living in widowhood&quot; (20:3). Through Nathan, God also tells David &quot;I gave thee ... thy master&apos;s wives into thy bosom&quot; (2 Samuel 12:8), meaning Saul&apos;s, though none of them is named as David&apos;s wife.
          </p>
          <p className="mt-3 leading-relaxed">
            Two women are often counted by mistake. Merab, Saul&apos;s elder daughter, was promised to David, but &quot;she was given unto Adriel the Meholathite to wife&quot; (1 Samuel 18:19). Abishag the Shunammite cared for David when he was old, &quot;but the king knew her not&quot; (1 Kings 1:4), and after his death Adonijah asked to marry her (1 Kings 2:17). David&apos;s son Solomon went far past him, with {T.solomonWives} wives (1 Kings 11:3): see <Link href="/how-many-wives-did-solomon-have" className={link}>how many wives Solomon had</Link>.
          </p>
        </Section>

        <Section id="king" title="Which son became king, and why not the eldest?" intro={`Solomon became king, though all ${T.hebron} sons born in Hebron were older than him: David had sworn to Bathsheba that Solomon would reign after him, and the Bible says God chose him.`}>
          <p className="leading-relaxed">
            By the end of David&apos;s life the first and third sons, Amnon and Absalom, were dead, and the second, Chileab, is never mentioned again. That left Adonijah, the fourth: &quot;his mother bare him after Absalom&quot; (1 Kings 1:6). When &quot;king David was old and stricken in years&quot; (1 Kings 1:1), Adonijah said &quot;I will be king&quot; (1:5) and held a feast to which he did not invite &quot;Solomon his brother&quot; (1:10). The prophet Nathan sent Bathsheba to remind David of his oath, &quot;Assuredly Solomon thy son shall reign after me&quot; (1:17), and David kept it: Zadok the priest anointed Solomon the same day (1:30, 1:39).
          </p>
          <p className="mt-3 leading-relaxed">
            The reason the Bible gives is God&apos;s choice. David tells &quot;all the princes of Israel&quot; (1 Chronicles 28:1): &quot;{DATA.quotes.king.chosen}&quot; (1 Chronicles 28:5, KJV). Adonijah himself admitted it to Bathsheba: &quot;Thou knowest that the kingdom was mine ... howbeit the kingdom is turned about, and is become my brother&apos;s: for it was his from the LORD&quot; (1 Kings 2:15). Solomon called him &quot;mine elder brother&quot; (1 Kings 2:22) and had him put to death after he asked for Abishag. The kings who followed are on <Link href="/kings-of-israel-and-judah" className={link}>the kings of Israel and Judah</Link>, and the story is told in <Link href="/books/1-kings" className={link}>1 Kings</Link>.
          </p>
        </Section>

        <Section id="son-of-david" title="How many times is Jesus called the son of David?" intro={`The New Testament calls Jesus, or the Christ, "son of David" ${W.jesusSonOfDavidKjv} times in the King James Version and ${W.jesusSonOfDavidWeb} times in the WEB.`} muted>
          <p className="leading-relaxed">
            The phrase &quot;son of David&quot; comes {W.sonOfDavidNtKjv} times in the King James New Testament. Two are about other men: the angel calls Joseph &quot;thou son of David&quot; (Matthew 1:20), and Luke&apos;s genealogy has &quot;Nathan, which was the son of David&quot; (Luke 3:31). The other {W.jesusSonOfDavidKjv} are {joinAnd(W.jesusRefs)}. {W.mercy} of them are cries for mercy, such as the blind men&apos;s &quot;Have mercy on us, O Lord, thou Son of David&quot; (Matthew 20:30). The WEB has one fewer because in Matthew 22:42 the answer reads &quot;Of David&quot;. Across the whole Bible the phrase appears {W.sonOfDavidKjv} times in the KJV and {W.sonOfDavidWeb} in the WEB.
          </p>
          <p className="mt-3 leading-relaxed">
            David himself is named {fmt(W.davidKjv.total)} times in the King James Version ({fmt(W.davidWeb.total)} in the WEB), more often than the name Jesus ({fmt(W.jesusKjv)}) or Moses ({fmt(W.mosesKjv)}), and {W.davidKjv.top.count} of those are in {W.davidKjv.top.book}. See the word count for {wordLink("david", "David")}.
          </p>
        </Section>

        <FaqSection title="Questions about David's children and wives" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted, every name in the tables and every count on this page, read and counted by scripts/lists/how-many-children-did-david-have.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            David marries Michal, Abigail and Ahinoam in <Link href="/books/1-samuel" className={link}>1 Samuel</Link>. Word counts: {wordLink("david", "David")}, {wordLink("tamar", "Tamar")}, {wordLink("michal", "Michal")} and {wordLink("abigail", "Abigail")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
