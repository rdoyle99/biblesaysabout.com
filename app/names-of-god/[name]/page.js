import { OG_VIDEOS } from "@/lib/og-video";
/* One name of God: Hebrew, Strong's meaning, and where it appears, counted from the full KJV and WEB text */

import { notFound } from "next/navigation";
import Link from "next/link";
import { books, fmt, SITE } from "@/lib/bibleData";
import { getVersesByTopic } from "@/lib/verses";
import { NAMES_METHOD, GOD_NAMES, getGodName, STRONGS_READ, TR_NAME, TR_SHORT, NAMES_OF_GOD_DATE, STRONGS_SOURCE, STRONGS_NOTE } from "@/lib/namesOfGod";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, VerseQuote, FaqSection, Section, MethodNote } from "@/components/DataBits";

const bookSlug = Object.fromEntries(books.map((b) => [b.name, b.slug]));
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };
const times = (n) => `${fmt(n)} time${n === 1 ? "" : "s"}`;
const inVerses = (n) => `${fmt(n)} verse${n === 1 ? "" : "s"}`;

export function generateStaticParams() {
  return GOD_NAMES.map((n) => ({ name: n.slug }));
}

/** "A (KJV) or B (WEB)" -> the part for one translation; other labels pass through */
function labelFor(label, tr) {
  const m = label.match(/^(.*) \(KJV\) or (.*) \(WEB\)$/);
  return m ? m[tr === "kjv" ? 1 : 2] : label;
}

/** the first search with matches, KJV first */
function headline(n) {
  for (const [key, s] of Object.entries(n.searches)) {
    for (const tr of ["kjv", "web"]) if (s[tr] && s[tr].n > 0) return { key, tr, s, stat: s[tr] };
  }
  return null;
}

function titleFor(n) {
  return `${n.name} Meaning: What the Name Means in the Bible`;
}

function strongsList(n) {
  return n.strongs.map((s) => `${s.n} (${s.tl})`).join(" and ");
}

function answerFor(n, h) {
  const parts = [`${n.name} (Hebrew ${n.hebrew}) means ${n.literal}.`];
  parts.push(`Strong's Hebrew dictionary lists it as ${strongsList(n)}.`);
  if (h) {
    const st = h.stat;
    parts.push(
      st.ot > 0 && st.nt > 0
        ? `In the ${TR_NAME[h.tr]} Old Testament, ${labelFor(h.s.label, h.tr)} appears ${times(st.ot)} in ${inVerses(st.otVerses)}. Its ${fmt(st.nt)} New Testament uses translate Greek words, not the Hebrew ${n.name}.`
        : `In the ${TR_NAME[h.tr]} text, ${labelFor(h.s.label, h.tr)} appears ${times(st.n)} in ${inVerses(st.verses)}.`
    );
  } else {
    parts.push("Neither the KJV nor the World English Bible prints it as a name.");
  }
  return parts.join(" ");
}

function firstLine(n) {
  return n.first.ref ? `The first verse in the ${TR_NAME[n.first.tr]} text that matches is ${n.first.ref}.` : "";
}

function descFor(n, h) {
  const base = `${n.name} (${n.hebrew}) means "${n.short}". Strong's ${n.strongs.map((s) => s.n).join(" + ")}, first at ${n.first.ref}`;
  const split = h && h.stat.ot > 0 && h.stat.nt > 0;
  const tail = h ? (split ? `, ${times(h.stat.ot)} in the ${TR_SHORT[h.tr]} Old Testament.` : `, ${times(h.stat.n)} counted in the ${TR_SHORT[h.tr]}.`) : ", with every verse.";
  const d = base + tail;
  return d.length <= 158 ? d : base + ".";
}

export async function generateMetadata({ params }) {
  const { name } = await params;
  const n = getGodName(name);
  if (!n) return { title: "Name Not Found" };
  const url = `${SITE}/names-of-god/${n.slug}`;
  const title = titleFor(n);
  const description = descFor(n, headline(n));
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { videos: OG_VIDEOS, title, description, url, type: "article", images: [OG_IMAGE] },
  };
}

function topicName(slug) {
  const t = getVersesByTopic(slug);
  return t ? t.title.replace(/^Bible Verses About /, "").replace(/ \(\d+\+? Verses\)$/, "") : slug;
}

function Cell({ s }) {
  if (!s) return <span className="text-muted-foreground">not searched</span>;
  const split = s.ot > 0 && s.nt > 0 ? ` (${fmt(s.ot)} OT, ${fmt(s.nt)} NT)` : "";
  return (
    <>
      {fmt(s.n)}
      <span className="block text-xs text-muted-foreground">
        {inVerses(s.verses)}
        {split}
      </span>
    </>
  );
}

export default async function GodNamePage({ params }) {
  const { name } = await params;
  const n = getGodName(name);
  if (!n) notFound();
  const url = `${SITE}/names-of-god/${n.slug}`;
  const h = headline(n);
  const answer = answerFor(n, h);
  const searchRows = Object.entries(n.searches).map(([key, s]) => ({ key, ...s }));
  const related = n.related.map(getGodName).filter(Boolean);
  const keyVerses = n.verses.filter((v) => v.ref !== n.first.ref);
  const topBooks = h ? [...h.stat.byBook].sort((a, b) => b[1] - a[1]).slice(0, 8) : [];
  const otherTr = h ? (h.tr === "kjv" ? "web" : "kjv") : null;
  const other = h && h.s[otherTr] ? h.s[otherTr] : null;

  const tiles = [];
  if (h) tiles.push({ label: labelFor(h.s.label, h.tr), value: fmt(h.stat.n), note: `${TR_SHORT[h.tr]}, in ${inVerses(h.stat.verses)}` });
  else tiles.push({ label: "Printed as a name", value: "0", note: "in the KJV or the World English Bible" });
  if (other) tiles.push({ label: labelFor(h.s.label, otherTr), value: fmt(other.n), note: `${TR_SHORT[otherTr]}, in ${inVerses(other.verses)}` });
  else if (searchRows[1]) {
    const s2 = searchRows[1];
    const tr2 = s2.kjv ? "kjv" : "web";
    tiles.push({ label: labelFor(s2.label, tr2), value: fmt(s2[tr2].n), note: `${TR_SHORT[tr2]}, in ${inVerses(s2[tr2].verses)}` });
  } else tiles.push({ label: "Hebrew words", value: String(n.strongs.length), note: n.strongs.map((s) => s.n).join(", ") });
  tiles.push({ label: "Strong's number", value: n.strongs.map((s) => s.n).join(" + "), note: n.translit.split(" (")[0] });
  tiles.push({ label: "First verse", value: n.first.ref ?? "none", note: TR_SHORT[n.first.tr] + " text" });

  const faqs = [
    ...n.faq.map(([q, a]) => ({ q, a })),
    {
      q: h ? `How many times is ${n.name} in the Bible?` : `Is ${n.name} printed as a name in the Bible?`,
      a: h
        ? `Searching the full ${TR_NAME[h.tr]} text for ${labelFor(h.s.label, h.tr)} finds ${times(h.stat.n)} in ${inVerses(h.stat.verses)}${h.stat.nt > 0 && h.stat.ot > 0 ? `: ${fmt(h.stat.ot)} in the Old Testament, where it translates ${n.name}, and ${fmt(h.stat.nt)} in the New, where it translates Greek` : ""}.${other ? ` The ${TR_NAME[otherTr]} has ${times(other.n)}.` : ""} English Bibles translate Hebrew names, so a count in English counts the translation, not the Hebrew word.`
        : `No. We searched the full text of the King James Version and the World English Bible for the name and found 0 matches in each. The name comes from ${n.verses[0].ref}.`,
    },
  ];

  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Names of God", url: `${SITE}/names-of-god` },
      { name: n.name, url },
    ]),
    generateDataArticleSchema({ headline: titleFor(n), description: answer, url, datePublished: NAMES_OF_GOD_DATE, dateModified: NAMES_OF_GOD_DATE }),
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Names of God", href: "/names-of-god" }, { name: n.name }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">{titleFor(n)}</h1>
            <p className="text-sm text-muted-foreground mb-4">Updated October 22, 2026. Counts from the full KJV and World English Bible text.</p>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{answer}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{firstLine(n)}</p>
            </div>
            <StatTiles stats={tiles} />
          </div>
        </section>

        <Section title={`What ${n.name} means`} intro={n.why}>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <tbody>
                <tr className="border-b">
                  <th className="p-3 font-semibold w-40">Hebrew</th>
                  <td className="p-3 text-lg" lang="he" dir="rtl" style={{ textAlign: "left" }}>{n.hebrew}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-semibold">Transliteration</th>
                  <td className="p-3">{n.translit}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-semibold">Literal meaning</th>
                  <td className="p-3">{n.literal}</td>
                </tr>
                <tr className="border-b">
                  <th className="p-3 font-semibold">English Bibles print it as</th>
                  <td className="p-3">{n.english}</td>
                </tr>
                <tr>
                  <th className="p-3 font-semibold">Strong's</th>
                  <td className="p-3">
                    {n.strongs.map((s) => (
                      <p key={s.n} className="mb-1 last:mb-0">
                        <span className="font-medium">{s.n}</span> {s.heb} ({s.tl}): {s.gloss}
                      </p>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Source: {STRONGS_SOURCE}. {STRONGS_NOTE}
          </p>
        </Section>

        <Section title={`Where ${n.name} appears in the Bible`} intro={n.use} muted>
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">English text searched</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                </tr>
              </thead>
              <tbody>
                {searchRows.map((s) => (
                  <tr key={s.key} className="border-b last:border-0 align-top">
                    <td className="p-3">{s.label}</td>
                    <td className="p-3 text-right tabular-nums"><Cell s={s.kjv} /></td>
                    <td className="p-3 text-right tabular-nums"><Cell s={s.web} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {topBooks.length > 1 ? (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">
                Books with the most matches ({TR_SHORT[h.tr]}: {labelFor(h.s.label, h.tr)})
              </h3>
              <BarRows rows={topBooks.map(([b, c]) => ({ label: b, value: c, href: bookSlug[b] ? `/books/${bookSlug[b]}` : undefined }))} />
              {h.stat.books > topBooks.length ? <p className="mt-3 text-sm text-muted-foreground">Found in {h.stat.books} books in all.</p> : null}
            </div>
          ) : null}
          {h && h.stat.refs.length ? (
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              {h.stat.verses > h.stat.refs.length ? `First ${h.stat.refs.length} of ${fmt(h.stat.verses)} verses` : `All ${fmt(h.stat.verses)} verse${h.stat.verses === 1 ? "" : "s"}`} ({TR_SHORT[h.tr]}, {labelFor(h.s.label, h.tr)}): {h.stat.refs.join(", ")}.
            </p>
          ) : null}
        </Section>

        <Section title={`First use of ${n.name}`}>
          <div className="space-y-4">
            {n.first.kjv ? <VerseQuote reference={n.first.ref} text={n.first.kjv} translation="KJV" /> : null}
            {n.first.web ? <VerseQuote reference={n.first.ref} text={n.first.web} translation="WEB" /> : null}
            {keyVerses.map((v) => (
              <div key={v.ref} className="space-y-4">
                <VerseQuote reference={v.ref} text={v.kjv} translation="KJV" />
                <VerseQuote reference={v.ref} text={v.web} translation="WEB" />
              </div>
            ))}
          </div>
        </Section>

        <Section title={`Names related to ${n.name}`} muted>
          <ul className="grid sm:grid-cols-2 gap-3">
            {related.map((r) => (
              <li key={r.slug} className="rounded-xl border bg-card p-4">
                <Link href={`/names-of-god/${r.slug}`} className="font-semibold underline underline-offset-2 hover:text-primary">
                  {r.name}
                </Link>
                <span className="block text-sm text-muted-foreground mt-1">{r.hebrew}: {r.short}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            See all names:{" "}
            <Link href="/names-of-god" className="font-medium underline underline-offset-2 hover:text-primary">
              the names of God and their meanings
            </Link>
            .
          </p>
        </Section>

        <FaqSection title="Common questions" faqs={faqs} />

        <Section>
          <h2 className="text-2xl font-bold mb-3">Sources</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Source: {n.strongs.map((x) => x.n).join(", ")} via biblehub.com/hebrew, read {STRONGS_READ}. Hebrew meanings: {STRONGS_SOURCE}. Verse text: King James Version and World English Bible, public domain. Counts: Bible Says About, {NAMES_OF_GOD_DATE}.
          </p>
          <p className="mb-4">
            Verses on our topic pages:{" "}
            {n.topics.map((t, i) => (
              <span key={t}>
                {i ? ", " : ""}
                <Link href={`/verses/${t}`} className="underline underline-offset-2 hover:text-primary">
                  Bible verses about {topicName(t).toLowerCase()}
                </Link>
              </span>
            ))}
            . Word counts:{" "}
            <Link href="/words/god" className="underline underline-offset-2 hover:text-primary">
              God
            </Link>
            ,{" "}
            <Link href="/words/lord" className="underline underline-offset-2 hover:text-primary">
              Lord
            </Link>{" "}
            and{" "}
            <Link href="/bible-names" className="underline underline-offset-2 hover:text-primary">
              Bible names and their meanings
            </Link>
            .
          </p>
          <MethodNote text={NAMES_METHOD} date={NAMES_OF_GOD_DATE} />
        </Section>
      </div>
    </>
  );
}
