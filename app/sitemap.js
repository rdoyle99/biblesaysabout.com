/* Sitemap - lastmod is each page's content date, never the build date */

import { getAllTopics, getVersesByTopic, topicCategories } from "@/lib/verses";
import { books, words, DATA_DATE, WORDS_DATE } from "@/lib/bibleData";
import { STATS_UPDATED } from "@/lib/bibleStats";
import { PLANS, PLAN_DATE } from "@/lib/readingPlan";
import { LIST_DATE, RANK_DATE, RANK_SLUGS } from "@/lib/bookLists";
import { getPageMeaning, NAMES_DATE } from "@/lib/bibleNames";
import { GOD_NAMES, NAMES_OF_GOD_DATE } from "@/lib/namesOfGod";

// data pages added 2026-10-22: fixed dates, never new Date()
const PROVERBS_DATE = "2026-10-22";
const TRIVIA_DATE = "2026-10-22";
// random verse tool and verse of the day, added 2026-10-23 (the verse changes daily; the page template does not)
const VERSE_TOOL_DATE = "2026-10-23";

const baseUrl = "https://www.biblesaysabout.com";

// Pages whose content is not generated from data: the date their copy last changed
const PAGE_DATES = {
  about: "2026-10-07",
  privacy: "2026-08-14",
  terms: "2026-08-14",
};

export default function sitemap() {
  const topics = getAllTopics().map((slug) => getVersesByTopic(slug));
  const newestTopic = topics.map((t) => t.dateModified).sort().at(-1);

  const staticPages = [
    { url: baseUrl, lastModified: newestTopic, priority: 1.0 },
    { url: `${baseUrl}/bible-statistics`, lastModified: STATS_UPDATED, priority: 0.9 },
    { url: `${baseUrl}/books-of-the-bible`, lastModified: DATA_DATE, priority: 0.9 },
    { url: `${baseUrl}/bible-by-the-numbers`, lastModified: DATA_DATE, priority: 0.9 },
    { url: `${baseUrl}/how-long-does-it-take-to-read-the-bible`, lastModified: DATA_DATE, priority: 0.9 },
    ...["books-of-the-bible-in-order", "old-testament-books-in-order", "new-testament-books-in-order", "how-long-is-the-bible"].map((slug) => ({ url: `${baseUrl}/${slug}`, lastModified: LIST_DATE, priority: 0.9 })),
    ...RANK_SLUGS.map((slug) => ({ url: `${baseUrl}/${slug}`, lastModified: RANK_DATE, priority: 0.8 })),
    { url: `${baseUrl}/words`, lastModified: WORDS_DATE, priority: 0.8 },
    { url: `${baseUrl}/bible-names`, lastModified: NAMES_DATE, priority: 0.8 },
    { url: `${baseUrl}/names-of-god`, lastModified: NAMES_OF_GOD_DATE, priority: 0.9 },
    { url: `${baseUrl}/bible-reading-plan`, lastModified: PLAN_DATE, priority: 0.9 },
    { url: `${baseUrl}/how-many-proverbs-are-there`, lastModified: PROVERBS_DATE, priority: 0.9 },
    { url: `${baseUrl}/bible-trivia-questions`, lastModified: TRIVIA_DATE, priority: 0.9 },
    { url: `${baseUrl}/random-bible-verse`, lastModified: VERSE_TOOL_DATE, priority: 0.9 },
    { url: `${baseUrl}/bible-verse-of-the-day`, lastModified: VERSE_TOOL_DATE, priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: PAGE_DATES.about, priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: PAGE_DATES.privacy, priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: PAGE_DATES.terms, priority: 0.3 },
  ];

  const categoryPages = Object.keys(topicCategories).map((category) => ({
    url: `${baseUrl}/topics/${category}`,
    lastModified: newestTopic,
    priority: 0.85,
  }));

  const topicPages = getAllTopics().map((slug, i) => ({
    url: `${baseUrl}/verses/${slug}`,
    lastModified: topics[i].dateModified,
    priority: 0.8,
  }));

  const bookPages = books.map((b) => ({
    url: `${baseUrl}/books/${b.slug}`,
    lastModified: DATA_DATE,
    priority: 0.7,
  }));

  const wordPages = words.map((w) => ({
    url: `${baseUrl}/words/${w.slug}`,
    lastModified: [getPageMeaning(w.slug) ? getPageMeaning(w.slug).date || NAMES_DATE : w.added || DATA_DATE, w.modified].filter(Boolean).sort().at(-1),
    priority: 0.7,
  }));

  const planPages = PLANS.map((p) => ({
    url: `${baseUrl}/bible-reading-plan/${p.slug}`,
    lastModified: PLAN_DATE,
    priority: 0.7,
  }));

  const godNamePages = GOD_NAMES.map((n) => ({
    url: `${baseUrl}/names-of-god/${n.slug}`,
    lastModified: NAMES_OF_GOD_DATE,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...topicPages, ...bookPages, ...wordPages, ...planPages, ...godNamePages];
}
