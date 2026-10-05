/* How many times a word is in the Bible: every match in the full KJV and WEB text, by form, book and testament */

import { notFound } from "next/navigation";
import Link from "next/link";
import { words, getWord, books, fmt, headline, quoted, plural, METHOD, DATA_DATE, SITE } from "@/lib/bibleData";
import { getVersesByTopic } from "@/lib/verses";
import { generateBreadcrumbSchema, generateFAQSchema, generateDataArticleSchema, combineSchemas } from "@/lib/schema";
import { JsonLd, Breadcrumbs, StatTiles, BarRows, VerseQuote, FaqSection, Section, MethodNote } from "@/components/DataBits";
import AmazonPicks from "@/components/AmazonPicks";

const bookSlug = Object.fromEntries(books.map((b) => [b.name, b.slug]));
const times = (n) => `${fmt(n)} time${n === 1 ? "" : "s"}`;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const OG_IMAGE = { url: "/opengraph-image", width: 1200, height: 630 };

export function generateStaticParams() {
  return words.map((w) => ({ word: w.slug }));
}

function topicName(slug) {
  const t = getVersesByTopic(slug);
  return t ? t.title.replace(/^Bible Verses About /, "").replace(/ \(\d+\+? Verses\)$/, "") : slug;
}

function booksSentence(word, topBooks, mainName, nBooks) {
  if (!topBooks.length) return "";
  const lead = `${cap(word)} appears in ${plural(nBooks, "book", "books")} of the 66 in the ${mainName}.`;
  const top = topBooks[0][1];
  const tiedTop = topBooks.filter(([, n]) => n === top).map(([b]) => b);
  if (top === 1) return `${lead} It is used once each in ${tiedTop.join(", ").replace(/, ([^,]*)$/, " and $1")}.`;
  if (tiedTop.length > 1) return `${lead} ${tiedTop.join(", ").replace(/, ([^,]*)$/, " and $1")} share the most, ${fmt(top)} each.`;
  const rest = topBooks.slice(1, 3).map(([b, n]) => `${b} (${fmt(n)})`);
  return `${lead} ${topBooks[0][0]} has the most (${fmt(top)})${rest.length ? `, then ${rest.join(" and ")}` : ""}.`;
}

function titleFor(w) {
  const h = headline(w);
  if (w.slug === "fear-not") return `How Many Times Does the Bible Say Fear Not? ${h.n} (${h.translation})`;
  if (w.kind === "phrase") return `How Many Times Is "${cap(w.word)}" in the Bible? ${fmt(h.n)} (${h.translation})`;
  return `How Many Times Is ${cap(w.word)} Mentioned in the Bible? ${fmt(h.n)} (${h.translation})`;
}

function questionFor(w) {
  if (w.slug === "fear-not") return "How many times does the Bible say fear not?";
  if (w.kind === "phrase") return `How many times is "${w.word}" in the Bible?`;
  return `How many times is ${w.word} mentioned in the Bible?`;
}

function answerFor(w) {
  const k = w.kjv;
  const wb = w.web;
  const label = w.kind === "phrase" ? `The phrase "${w.word}"` : `The word ${w.word}`;
  const kjvForms = Object.entries(k.byForm).filter(([, n]) => n).map(([f, n]) => [k.display[f] || f, n]);
  const webForms = Object.entries(wb.byForm).filter(([, n]) => n).map(([f, n]) => [wb.display[f] || f, n]);
  const parts = [];
  if (w.kind === "phrase" && !w.exactHeadline) {
    parts.push(
      `${label} appears ${times(k.total)} in the King James Version, in ${plural(k.verses, "verse", "verses")}` +
        (kjvForms.length > 1 ? ` (${kjvForms.map(([f, n]) => `${f} ${fmt(n)}`).join(", ")}).` : ".")
    );
    parts.push(
      `The World English Bible has it ${times(wb.total)}` +
        (webForms.length > 1 ? ` (${webForms.map(([f, n]) => `${f} ${fmt(n)}`).join(", ")}).` : ".")
    );
  } else if (k.exact > 0) {
    parts.push(`${label}${w.kjvLabel ? ` (spelled ${w.kjvLabel} in the KJV)` : ""} appears ${times(k.exact)} in the King James Version, in ${plural(k.exactVerses, "verse", "verses")}.`);
    if (k.total !== k.exact)
      parts.push(
        `Counting ${w.kind === "phrase" ? "the related wordings" : "every form"} (${kjvForms.map(([f]) => f).join(", ")}), it appears ${times(k.total)} in ${plural(k.verses, "verse", "verses")} across ${k.books} of the 66 books.`
      );
    else parts.push(`It is found in ${k.books} of the 66 books.`);
    if (w.kind === "phrase")
      parts.push(`The World English Bible words it differently: ${webForms.map(([f, n]) => `${f} ${fmt(n)}`).join(", ")}.`);
    else if (wb.exact === 0)
      parts.push(
        webForms.length
          ? `The World English Bible never uses the word ${w.word}; it has ${webForms.map(([f, n]) => `${f} ${fmt(n)}`).join(", ")} instead.`
          : `The World English Bible never uses the word ${w.word}.`
      );
    else parts.push(`The World English Bible uses ${w.word} ${times(wb.exact)}${wb.total !== wb.exact ? ` (${fmt(wb.total)} with every form)` : ""}.`);
  } else {
    parts.push(`${label} does not appear in the King James Version.`);
    parts.push(
      `The World English Bible uses it ${times(wb.exact)}` +
        (wb.total !== wb.exact ? `, and ${times(wb.total)} counting ${webForms.map(([f]) => f).join(", ")}.` : ".")
    );
  }
  return parts.join(" ");
}

export async function generateMetadata({ params }) {
  const { word } = await params;
  const w = getWord(word);
  if (!w) return { title: "Word Not Found" };
  const url = `${SITE}/words/${w.slug}`;
  const title = titleFor(w);
  const h = headline(w);
  const other = h.translation === "KJV" ? w.web : w.kjv;
  const otherN = w.kind === "phrase" ? other.total : other.exact;
  const description =
    w.kind === "phrase"
      ? `${cap(w.word)} appears ${times(h.n)} in the ${h.name} (${plural(h.verses, "verse", "verses")}). Every wording counted in the KJV and World English Bible, by book, with first and last mention.`
      : `${cap(w.word)} appears ${times(h.n)} in the ${h.name} (${plural(h.verses, "verse", "verses")}) and ${times(otherN)} in the ${h.translation === "KJV" ? "World English Bible" : "KJV"}. Counts by form and book, first and last mention.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", images: [OG_IMAGE] },
  };
}

export default async function WordPage({ params }) {
  const { word } = await params;
  const w = getWord(word);
  if (!w) notFound();
  const url = `${SITE}/words/${w.slug}`;
  const k = w.kjv;
  const wb = w.web;
  const h = headline(w);
  const answer = answerFor(w);
  const main = h.translation === "KJV" ? k : wb;
  const mainName = h.translation === "KJV" ? "King James Version" : "World English Bible";
  const topicData = w.topic ? getVersesByTopic(w.topic) : null;
  const book = books.find((b) => b.slug === w.slug) || null;
  const topBooks = [...main.byBook].sort((a, b) => b[1] - a[1]);
  const formRows = [...new Set([...w.kjvForms, ...w.webForms])]
    .map((f) => ({ form: (k.byForm[f] ? k.display[f] : wb.display[f]) || f, kjv: k.byForm[f] ?? null, web: wb.byForm[f] ?? null }))
    .filter((r) => r.kjv || r.web);
  const idx = words.findIndex((x) => x.slug === w.slug);
  const related = (w.related || []).map(getWord).filter(Boolean);
  const neighbors = [...related, ...[...words.slice(idx + 1), ...words.slice(0, idx)].filter((x) => !related.includes(x))].slice(0, 8);
  const curated = [...w.curated].sort((a, b) => (b.topics.includes(w.topic) - a.topics.includes(w.topic)) || b.topics.length - a.topics.length);

  const faqs = [
    { q: questionFor(w), a: answer },
    {
      q: `How many times is ${w.word} in the Old Testament and the New Testament?`,
      a: `In the ${mainName}, counting every form, ${fmt(main.ot)} of the ${plural(main.total, "use is", "uses are")} in the Old Testament and ${fmt(main.nt)} in the New Testament. ${booksSentence(w.word, topBooks, mainName, main.books)}`,
    },
  ];
  if (main.first)
    faqs.push({
      q: `Where is ${w.word} first mentioned in the Bible?`,
      a: `The first use in the ${mainName} is ${main.first.ref}: ${quoted(main.first.text)} The last is ${main.last.ref}.`,
    });
  if (w.slug === "fear-not")
    faqs.push({
      q: "Does the Bible say fear not 365 times?",
      a: `No. The exact words "fear not" appear ${times(k.exact)} in the King James Version. Adding ${Object.entries(k.byForm).filter(([f, n]) => n && f !== "fear not").map(([f]) => f).join(", ").replace(/, ([^,]*)$/, " and $1")} brings it to ${fmt(k.total)}. In the World English Bible, ${Object.entries(wb.byForm).filter(([, n]) => n).map(([f]) => f).join(" and ")} add up to ${fmt(wb.total)}. None of these reaches 365.`,
    });

  const schema = combineSchemas(
    generateBreadcrumbSchema([
      { name: "Home", url: SITE },
      { name: "Bible Word Counts", url: `${SITE}/words` },
      { name: cap(w.word), url },
    ]),
    generateDataArticleSchema({ headline: questionFor(w), description: answer, url, datePublished: w.added || DATA_DATE, dateModified: w.added || DATA_DATE }),
    generateFAQSchema(faqs)
  );

  return (
    <>
      <JsonLd data={schema} />
      <div className="min-h-screen">
        <section className="bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Bible Word Counts", href: "/words" }, { name: cap(w.word) }]} />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight text-balance">{questionFor(w)}</h1>
            <div className="rounded-xl border bg-card p-5 md:p-6 mb-6">
              <p className="text-lg md:text-xl leading-relaxed font-medium">{answer}</p>
              {w.note ? <p className="mt-4 text-muted-foreground leading-relaxed">{w.note}</p> : null}
            </div>
            <StatTiles
              stats={[
                { label: `${w.kind === "phrase" ? "Uses" : "Exact word"} (${h.translation})`, value: fmt(h.n), note: `in ${plural(h.verses, "verse", "verses")}` },
                { label: "Every form (KJV)", value: fmt(k.total), note: `in ${plural(k.verses, "verse", "verses")}` },
                { label: "Every form (WEB)", value: fmt(wb.total), note: `in ${plural(wb.verses, "verse", "verses")}` },
                { label: "Books", value: `${main.books} of 66`, note: `${fmt(main.ot)} OT uses, ${fmt(main.nt)} NT uses` },
              ]}
            />
          </div>
        </section>

        <Section
          title={`${cap(w.word)} in the King James Version and the World English Bible`}
          intro={`Each form of ${w.word} counted in each translation.`}
        >
          <div className="overflow-x-auto rounded-xl border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Form</th>
                  <th className="p-3 font-semibold text-right">KJV</th>
                  <th className="p-3 font-semibold text-right">WEB</th>
                </tr>
              </thead>
              <tbody>
                {formRows.map((r) => (
                  <tr key={r.form} className="border-b last:border-0">
                    <td className="p-3">{r.form}</td>
                    <td className="p-3 text-right tabular-nums">{r.kjv === null ? "not counted" : fmt(r.kjv)}</td>
                    <td className="p-3 text-right tabular-nums">{r.web === null ? "not counted" : fmt(r.web)}</td>
                  </tr>
                ))}
                <tr className="bg-muted/30 font-semibold">
                  <td className="p-3">Total</td>
                  <td className="p-3 text-right tabular-nums">{fmt(k.total)}</td>
                  <td className="p-3 text-right tabular-nums">{fmt(wb.total)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {k.byCase && Object.keys(k.byCase).length > 1 ? (
            <p className="mt-4 text-sm text-muted-foreground">
              By capitalization in the KJV:{" "}
              {Object.entries(k.byCase)
                .sort((a, b) => b[1] - a[1])
                .map(([f, n]) => `${f} ${fmt(n)}`)
                .join(", ")}
              .
            </p>
          ) : null}
        </Section>

        {topBooks.length ? (
          <Section
            title={`Which books mention ${w.word} most`}
            intro={booksSentence(w.word, topBooks, mainName, main.books)}
            muted
          >
            <BarRows rows={topBooks.slice(0, 15).map(([b, n]) => ({ label: b, value: n, href: `/books/${bookSlug[b]}` }))} />
            {topBooks.length > 15 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Also in: {topBooks.slice(15).map(([b, n]) => `${b} (${n})`).join(", ")}.
              </p>
            ) : null}
          </Section>
        ) : null}

        {main.first ? (
          <Section title={`First and last mention of ${w.word}`}>
            <div className="space-y-4">
              <VerseQuote reference={main.first.ref} text={main.first.text} translation={h.translation} />
              {main.last.ref !== main.first.ref ? <VerseQuote reference={main.last.ref} text={main.last.text} translation={h.translation} /> : null}
              {main.mostInVerse ? (
                <>
                  <p className="text-muted-foreground">
                    {`The verse that uses it most is ${main.mostInVerse.ref}, ${main.mostInVerse.n} times${
                      main.mostInVerse.tiedCount
                        ? ` (tied with ${main.mostInVerse.tied.join(", ")}${main.mostInVerse.tiedCount > main.mostInVerse.tied.length ? ` and ${main.mostInVerse.tiedCount - main.mostInVerse.tied.length} more` : ""})`
                        : ""
                    }:`}
                  </p>
                  <VerseQuote reference={main.mostInVerse.ref} text={main.mostInVerse.text} translation={h.translation} />
                </>
              ) : null}
            </div>
          </Section>
        ) : null}

        {w.onlyKjv.count + w.onlyWeb.count > 0 ? (
          <Section
            title="Where the two translations differ"
            intro={`${plural(w.onlyKjv.count, "verse matches", "verses match")} in the KJV but not in the World English Bible, and ${plural(w.onlyWeb.count, "verse matches", "verses match")} only in the World English Bible, usually because the other translation chose a different word there.`}
            muted
          >
            <div className="space-y-6">
              {[
                ...w.onlyKjv.examples.slice(0, 2).map((ex) => ({ ...ex, side: "KJV only" })),
                ...w.onlyWeb.examples.slice(0, 2).map((ex) => ({ ...ex, side: "World English Bible only" })),
              ].map((ex) => (
                <div key={ex.ref} className="grid md:grid-cols-2 gap-3">
                  <p className="md:col-span-2 text-sm font-medium">
                    {ex.ref}: counted in the {ex.side}
                  </p>
                  <VerseQuote reference={ex.ref} text={ex.kjv || "(not in this translation)"} translation="KJV" />
                  <VerseQuote reference={ex.ref} text={ex.web || "(not in this translation)"} translation="WEB" />
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {w.curated.length ? (
          <Section
            title={`Verses with ${w.word} on our topic pages`}
            intro={`${plural(w.curatedCount, "verse that uses", "verses that use")} ${w.word} in the World English Bible ${w.curatedCount === 1 ? "is" : "are"} in our topic collections.`}
          >
            <div className="space-y-4">
              {curated.map((c) => (
                <div key={c.ref}>
                  <VerseQuote reference={c.ref} text={c.text} translation="WEB" />
                  <p className="mt-1 text-sm text-muted-foreground">
                    On:{" "}
                    {c.topics.slice(0, 4).map((t, i) => (
                      <span key={t}>
                        {i ? ", " : ""}
                        <Link href={`/verses/${t}`} className="underline underline-offset-2 hover:text-primary">
                          {topicName(t)}
                        </Link>
                      </span>
                    ))}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        <FaqSection title="Common questions" faqs={faqs.slice(1)} />

        <AmazonPicks
          title="Look up any word yourself"
          items={[
            { label: "Strong's Exhaustive Concordance", query: "Strong's Exhaustive Concordance of the Bible", note: "Every word of the KJV, with the Hebrew and Greek behind it" },
            { label: "Bible dictionaries", query: "bible dictionary", note: "What a word meant to its first readers" },
            { label: "KJV study Bibles", query: "KJV study Bible", note: "Notes, cross references and maps" },
          ]}
        />

        <Section muted>
          {book ? (
            <p className="mb-4">
              {w.word} is also the name of a book of the Bible. See its{" "}
              <Link href={`/books/${book.slug}`} className="font-medium underline underline-offset-2 hover:text-primary">
                {book.chapters} chapters, {fmt(book.verses.kjv)} verses and reading time
              </Link>
              .
            </p>
          ) : null}
          {topicData ? (
            <p className="mb-4">
              Read the full collection:{" "}
              <Link href={`/verses/${w.topic}`} className="font-medium underline underline-offset-2 hover:text-primary">
                {topicData.title}
              </Link>
              .
            </p>
          ) : null}
          <p className="mb-4">
            More word counts:{" "}
            {neighbors.map((n, i) => (
              <span key={n.slug}>
                {i ? ", " : ""}
                <Link href={`/words/${n.slug}`} className="underline underline-offset-2 hover:text-primary">
                  {n.word}
                </Link>
              </span>
            ))}
            , or{" "}
            <Link href="/words" className="underline underline-offset-2 hover:text-primary">
              all {words.length} words
            </Link>
            .
          </p>
          <MethodNote text={METHOD} date={w.added || DATA_DATE} />
        </Section>
      </div>
    </>
  );
}
