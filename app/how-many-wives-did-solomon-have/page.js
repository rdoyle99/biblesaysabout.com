import { OG_VIDEOS } from "@/lib/og-video";
/* How many wives did Solomon have: 1 Kings 11:3 in the KJV and WEB, the two women the Bible ties to him by name,
   the nations and gods of 1 Kings 11, and the men with more than one wife in the Bible, every verse checked.
   Counted by scripts/lists/how-many-wives-did-solomon-have.mjs. */

import Link from "next/link";
import DATA from "@/lib/data/lists/how-many-wives-did-solomon-have.json";
import { getWord, fmt, METHOD, SITE } from "@/lib/bibleData";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, Section, FaqSection, MethodNote } from "@/components/DataBits";

const URL = `${SITE}/how-many-wives-did-solomon-have`;
const W = DATA.words;
const joinAnd = (a) => (a.length < 2 ? a.join("") : `${a.slice(0, -1).join(", ")} and ${a.at(-1)}`);
const link = "underline underline-offset-2 hover:text-primary";
const men = [...DATA.men].sort((a, b) => (typeof b.wives === "number" ? b.wives : 0) - (typeof a.wives === "number" ? a.wives : 0));
const rehoboam = DATA.men.find((m) => m.man === "Rehoboam");
const WIVES_NOTE = {
  David: "named; 2 Samuel 5:13 adds \"more\"",
  Abraham: "Sarah, Hagar, Keturah",
  Jacob: "Leah, Rachel, Bilhah, Zilpah",
  Esau: "Adah, Aholibamah, Bashemath",
  Ashur: "Helah, Naarah",
  Gideon: "70 sons (Judges 8:30)",
};

const TITLE = `How Many Wives Did Solomon Have? ${DATA.wives} (1 Kings 11:3)`;
const ANSWER = `Solomon had ${DATA.wives} wives and ${DATA.concubines} concubines, ${fmt(DATA.women)} women in all. 1 Kings 11:3 says "he had seven hundred wives, princesses, and three hundred concubines: and his wives turned away his heart." The Bible names only one of the wives, Naamah the Ammonitess, and calls another "the daughter of Pharaoh" without a name.`;

export const metadata = {
  title: { absolute: TITLE },
  description: `Solomon had ${DATA.wives} wives and ${DATA.concubines} concubines (1 Kings 11:3). Who they were, where they came from, their gods, and other men with many wives.`,
  alternates: { canonical: URL },
  openGraph: { videos: OG_VIDEOS, title: TITLE, url: URL, type: "article", images: [{ url: "/opengraph-image", width: 1200, height: 630 }] },
};

const faqs = [
  { q: "How many wives and concubines did Solomon have?", a: `${DATA.wives} wives and ${DATA.concubines} concubines, according to 1 Kings 11:3. The wives are called "princesses", women of royal birth, many of them from marriages with other nations.` },
  { q: "Who was Solomon's first wife?", a: `Probably Naamah the Ammonitess, the mother of Rehoboam. Rehoboam was ${DATA.rehoboamAge} when he began to reign (1 Kings 14:21) and Solomon reigned ${DATA.reign} years (1 Kings 11:42), so Rehoboam was born before Solomon became king. The first marriage the Bible tells of is later, to Pharaoh's daughter: Solomon "made affinity with Pharaoh king of Egypt, and took Pharaoh's daughter" (1 Kings 3:1). Her name is never given, and Naamah is the only wife of Solomon the Bible names.` },
  { q: "Why did Solomon have so many wives?", a: `The Bible does not give a reason. It says he "loved many strange women" from Egypt, Moab, Ammon, Edom, Sidon and the Hittites (1 Kings 11:1), nations Israel had been told not to marry into (1 Kings 11:2). Deuteronomy 17:17 had warned that a king should not "multiply wives to himself, that his heart turn not away".` },
  { q: "Did Solomon's wives turn him away from God?", a: `Yes, by the Bible's account: "when Solomon was old, that his wives turned away his heart after other gods" (1 Kings 11:4). He built places of worship for Chemosh of Moab and Molech of Ammon (1 Kings 11:7), and "the LORD was angry with Solomon" (1 Kings 11:9).` },
  { q: "Who had the most wives in the Bible?", a: `Solomon, with ${DATA.wives}. Next is his son Rehoboam, with ${rehoboam.wives} wives and ${rehoboam.concubines} concubines (2 Chronicles 11:21). David has eight wives named across 1 and 2 Samuel.` },
];

export default function SolomonWives() {
  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible by the numbers", url: `${SITE}/bible-by-the-numbers` },
      { name: "How many wives did Solomon have?", url: URL },
    ]),
    generateDataArticleSchema({ headline: "How many wives did Solomon have?", description: ANSWER, url: URL, datePublished: DATA.generated, dateModified: DATA.generated }),
    generateFAQSchema(faqs)
  );
  const wordLink = (slug, label) => (getWord(slug) ? <Link href={`/words/${slug}`} className={link}>{label}</Link> : label);
  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible by the numbers", href: "/bible-by-the-numbers" }, { name: "How many wives did Solomon have?" }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">How many wives did Solomon have?</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{ANSWER}</p>
              <p className="mt-3 text-sm text-muted-foreground">Updated October 25, 2026. Every verse on this page is checked against the King James Version, and the key verse against the World English Bible too. Word counts cover the full text of both.</p>
            </div>
            <StatTiles
              stats={[
                { label: "Wives", value: DATA.wives, note: "\"princesses\", 1 Kings 11:3" },
                { label: "Concubines", value: DATA.concubines, note: "1 Kings 11:3" },
                { label: "Wives named", value: 1, note: "Naamah, mother of Rehoboam" },
                { label: `"Solomon" in the KJV`, value: W.solomonKjv.total, note: `${W.solomonKjv.top.count} of them in ${W.solomonKjv.top.book}` },
              ]}
            />
          </div>
        </section>

        <Section id="verse" title="The verse: 1 Kings 11:3" intro="The number comes from a single verse, the only place the Bible counts Solomon's wives. Both translations give the same figures.">
          <blockquote className="border-l-4 pl-4 italic leading-relaxed">{DATA.key.kjv} <span className="not-italic text-sm text-muted-foreground">(1 Kings 11:3, KJV)</span></blockquote>
          <blockquote className="mt-4 border-l-4 pl-4 italic leading-relaxed">{DATA.key.web} <span className="not-italic text-sm text-muted-foreground">(1 Kings 11:3, WEB)</span></blockquote>
          <p className="mt-4 leading-relaxed">
            The verse sets the two groups apart: the concubines were secondary wives, ranked below the wives. &quot;Princesses&quot; marks the {DATA.wives} as women of rank. The one marriage the Bible describes was a treaty: Solomon &quot;made affinity with Pharaoh king of Egypt&quot; (1 Kings 3:1). The phrase &quot;seven hundred wives&quot; appears once in the Bible, in this verse.
          </p>
        </Section>

        <Section id="who" title="Who were Solomon's wives?" intro={`1 Kings 11:1 names where they came from, not who they were: "the daughter of Pharaoh, women of the Moabites, Ammonites, Edomites, Zidonians, and Hittites".`} muted>
          <div className="grid gap-4 md:grid-cols-2">
            {DATA.named.map((n) => (
              <div key={n.who} className="rounded-xl border bg-card p-4">
                <h3 className="font-semibold mb-1">{n.who}</h3>
                <p className="text-sm leading-relaxed">{n.text}</p>
                <p className="mt-2 text-xs text-muted-foreground">{n.refs.join("; ")}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed">
            The nations named are {joinAnd(DATA.nations.list)}. The Bible also names two of Solomon&apos;s daughters, Taphath and Basmath, each married to one of his officers (1 Kings 4:11, 4:15). It names one son, Rehoboam, who &quot;reigned in his stead&quot; (1 Kings 11:43). Rehoboam was {DATA.rehoboamAge} when he became king (1 Kings 14:21), after Solomon&apos;s {DATA.reign} years on the throne (1 Kings 11:42), so his mother Naamah was married to Solomon before he was king. The marriage to Pharaoh&apos;s daughter comes after he took the throne (1 Kings 2:12, 3:1).
          </p>
        </Section>

        <Section id="gods" title="The gods his wives brought" intro="1 Kings 11:4 says that when Solomon was old his wives turned his heart &quot;after other gods&quot;. Verses 5 to 7 give four names.">
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">God</th>
                  <th className="p-3 font-semibold">Of</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {DATA.gods.map((g) => (
                  <tr key={g.god} className="border-b last:border-0">
                    <td className="p-3 font-medium">{g.god}</td>
                    <td className="p-3">{g.people}</td>
                    <td className="p-3 whitespace-nowrap">{g.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            Milcom and Molech are both tied to the Ammonites (verses 5 and 7), and when the prophet Ahijah lists the gods Israel turned to, he names three: &quot;Ashtoreth the goddess of the Zidonians, Chemosh the god of the Moabites, and Milcom the god of the children of Ammon&quot; (1 Kings 11:33). Milcom and Molech may be one god under two names.
          </p>
          <p className="mt-3 leading-relaxed">
            He did the same &quot;for all his strange wives, which burnt incense and sacrificed unto their gods&quot; (1 Kings 11:8). The next verse says &quot;the LORD was angry with Solomon&quot;, and God tells him &quot;I will surely rend the kingdom from thee&quot;, though not in his own lifetime (1 Kings 11:11-12). Centuries later Nehemiah used him as the warning: &quot;Did not Solomon king of Israel sin by these things? ... even him did outlandish women cause to sin&quot; (Nehemiah 13:26).
          </p>
        </Section>

        <Section id="song" title="What about Song of Solomon 6:8?" muted>
          <p className="leading-relaxed">
            Song of Solomon 6:8 gives different numbers: &quot;There are threescore queens, and fourscore concubines, and virgins without number.&quot; That is 60 queens and 80 concubines. The verse is poetry, set in a love song, and does not say it is counting Solomon&apos;s household at any one time. 1 Kings 11:3 is the verse that gives his total, and the next verse places it &quot;when Solomon was old&quot;.
          </p>
        </Section>

        <Section id="others" title="Who else in the Bible had more than one wife?" intro={`Solomon's ${DATA.wives} is far beyond anyone else. His son Rehoboam is next, with ${rehoboam.wives} wives and ${rehoboam.concubines} concubines.`}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Man</th>
                  <th className="p-3 font-semibold text-right">Wives</th>
                  <th className="p-3 font-semibold text-right">Concubines</th>
                  <th className="p-3 font-semibold">Verse</th>
                </tr>
              </thead>
              <tbody>
                {men.map((m) => (
                  <tr key={m.man} className="border-b last:border-0 align-top">
                    <td className="p-3 font-medium">{getWord(m.man.toLowerCase()) ? <Link href={`/words/${m.man.toLowerCase()}`} className={link}>{m.man}</Link> : m.man}</td>
                    <td className="p-3 text-right">{typeof m.wives === "number" ? fmt(m.wives) : m.wives}{WIVES_NOTE[m.man] ? <span className="block text-xs text-muted-foreground">{WIVES_NOTE[m.man]}</span> : null}</td>
                    <td className="p-3 text-right tabular-nums">{m.concubines ?? ""}{m.man === "David" ? <span className="block text-xs text-muted-foreground">at least</span> : null}</td>
                    <td className="p-3 whitespace-nowrap">{m.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 leading-relaxed">
            David&apos;s eight named wives are {joinAnd(DATA.david.map((d) => d.name))} ({DATA.david.map((d) => d.ref).join("; ")}). His ten concubines are the ones he left to keep the house when he fled Jerusalem (2 Samuel 15:16). The first man in the Bible with two wives is Lamech, in Genesis 4:19. The Law&apos;s rule for kings is Deuteronomy 17:17: &quot;Neither shall he multiply wives to himself, that his heart turn not away.&quot;
          </p>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            The table lists every man the Bible gives a number of wives for, plus the best-known men with more than one wife named: Abraham, Jacob, Esau and David. The genealogies of 1 Chronicles name a few more, such as Shaharaim, whose wives were Hushim, Baara and Hodesh (1 Chronicles 8:8-9). A blank concubine cell means no number is given: Genesis 25:6 mentions &quot;the concubines, which Abraham had&quot; without counting them. &quot;Wives&quot; appears {W.wivesKjv.total} times in the King James Version, and &quot;concubine&quot; or &quot;concubines&quot; {W.concubineKjv.total} times in both translations.
          </p>
        </Section>

        <FaqSection title="Questions about Solomon's wives" faqs={faqs} />

        <Section id="sources" title="Sources">
          <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
            <li>The King James Version (1769) and the World English Bible, both public domain: every verse quoted and every count on this page, counted by scripts/lists/how-many-wives-did-solomon-have.mjs from the text at github.com/seven1m/open-bibles (read and counted {DATA.generated}).</li>
          </ul>
        </Section>

        <Section>
          <p className="mb-4">
            Read about <Link href="/books/1-kings" className={link}>1 Kings</Link>, where Solomon&apos;s reign is told, and <Link href="/books/song-of-solomon" className={link}>the Song of Solomon</Link>. The women the Bible does name are on <Link href="/women-of-the-bible" className={link}>the women of the Bible</Link>. Word counts: {wordLink("solomon", "Solomon")}, {wordLink("wife", "wife")} and {wordLink("david", "David")}. More counts are on{" "}
            <Link href="/bible-by-the-numbers" className={link}>the Bible by the numbers</Link>.
          </p>
          <MethodNote text={METHOD} date={DATA.generated} />
        </Section>
      </div>
    </>
  );
}
