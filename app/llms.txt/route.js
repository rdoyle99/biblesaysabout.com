/* llms.txt - the site map for AI agents, built from the same list as sitemap.xml so new pages appear on their own */

import sitemap from "../sitemap";
import { getVersesByTopic } from "@/lib/verses";
import { words, books } from "@/lib/bibleData";
import { GOD_NAMES } from "@/lib/namesOfGod";
import { PLANS } from "@/lib/readingPlan";

export const revalidate = 3600;

const SITE = "https://www.biblesaysabout.com";

const SMALL = new Set(["a", "and", "by", "in", "is", "it", "of", "the", "to"]);

function titleCase(slug) {
  return slug
    .split("-")
    .map((w, i) => (/^\d/.test(w) || (i > 0 && SMALL.has(w)) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function nameFor(path) {
  const [section, slug] = path.split("/").filter(Boolean);
  if (!section) return "Home: Bible verses by topic";
  if (section === "verses" && slug) return getVersesByTopic(slug)?.title || `Bible verses about ${titleCase(slug)}`;
  if (section === "topics" && slug) return `${titleCase(slug)} topics`;
  if (section === "words" && slug) {
    const w = words.find((x) => x.slug === slug);
    return w ? `How many times is ${w.kind === "phrase" ? `"${w.word}"` : w.word} in the Bible` : titleCase(slug);
  }
  if (section === "books" && slug) {
    const b = books.find((x) => x.slug === slug);
    return b ? `The Book of ${b.name}: chapters, verses and words` : titleCase(slug);
  }
  if (section === "names-of-god" && slug) return GOD_NAMES.find((n) => n.slug === slug)?.name || titleCase(slug);
  if (section === "bible-reading-plan" && slug) return PLANS.find((p) => p.slug === slug)?.name || titleCase(slug);
  return titleCase(section);
}

const GROUPS = [
  ["Bible facts, lists and tools", (p) => p.split("/").filter(Boolean).length <= 1 && !["about", "privacy", "terms"].includes(p.replace(/^\//, ""))],
  ["Topic categories", (p) => p.startsWith("/topics/")],
  ["Bible verses by topic", (p) => p.startsWith("/verses/")],
  ["Books of the Bible", (p) => p.startsWith("/books/")],
  ["Word counts", (p) => p.startsWith("/words/")],
  ["Names of God", (p) => p.startsWith("/names-of-god/")],
  ["Reading plans", (p) => p.startsWith("/bible-reading-plan/")],
  ["About", (p) => ["/about", "/privacy", "/terms"].includes(p)],
];

export function GET() {
  const paths = sitemap().map((e) => e.url.replace(SITE, "") || "/");
  const out = [
    "# Bible Says About",
    "",
    "> Bible Says About is a free website of Bible verses by topic and Bible facts counted from the full text of the King James Version and the World English Bible.",
    "",
    "Verse text on topic pages is the World English Bible (public domain), with a KJV toggle. Word counts, book statistics and lists are computed from the full KJV and WEB text; each page names the translation and the counting method. Free to read, no account needed.",
    "",
    `- [Plans and access (JSON)](${SITE}/.well-known/biblesays-plans.json): what the site offers and what it costs (nothing)`,
    `- [About and sources](${SITE}/about): where the text, counts and name meanings come from, and how to report an error`,
  ];
  for (const [heading, match] of GROUPS) {
    const list = paths.filter(match);
    if (!list.length) continue;
    out.push("", `## ${heading}`, "");
    for (const p of list) out.push(`- [${nameFor(p)}](${SITE}${p === "/" ? "" : p})`);
  }
  return new Response(out.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
