/* Homepage - Main landing page
 * Updated: Server component. Computes everything the page renders and passes
 * it to components/HomeClient.js, so lib/verses.js never ships to the browser.
 */

import HomeClient from "@/components/HomeClient";
import { bible, totals, words } from "@/lib/bibleData";
import {
  getAllTopics,
  getTopicMetadata,
  getCategorizedTopics,
  getTotalVerseCount,
  getVersesByTopic,
} from "@/lib/verses";
import { verseOfTheDay } from "@/lib/verseTool";

// Regenerate hourly so the verse of the day rolls over
export const revalidate = 3600;

export const metadata = {
  title: { absolute: "Bible Verses by Topic: What Does the Bible Say About It?" },
  alternates: { canonical: "https://www.biblesaysabout.com" },
  openGraph: {
    title: "Bible Verses by Topic: What Does the Bible Say About It?",
    url: "https://www.biblesaysabout.com",
  },
};

// Featured rotating topics
const ROTATING_TOPICS = [
  {name: "Strength", slug: "strength"},
  {name: "Love", slug: "love"},
  {name: "Peace", slug: "peace"},
  {name: "Hope", slug: "hope"},
  {name: "Faith", slug: "faith"},
  {name: "Joy", slug: "joy"},
];

const POPULAR_TOPICS = [
  "strength",
  "love",
  "peace",
  "hope",
  "faith",
  "anxiety",
  "healing",
  "forgiveness",
  "prayer",
  "joy",
  "grace",
  "wisdom",
];

export default function Home() {
  const allTopics = getAllTopics();
  const categories = getCategorizedTopics();
  const totalVerses = getTotalVerseCount();

  // Hero rotation: color and the first verse of each featured topic
  const rotatingTopics = ROTATING_TOPICS.map(({name, slug}) => {
    const first = getVersesByTopic(slug)?.verses[0];
    return {
      name,
      slug,
      color: getTopicMetadata(slug).color,
      featuredVerse: first
        ? {text: first.text, reference: first.reference, translation: first.translation}
        : null,
    };
  });

  // Popular topic cards: metadata, first sentence of the description, count
  const popularTopics = POPULAR_TOPICS.map((slug) => {
    const meta = getTopicMetadata(slug);
    const data = getVersesByTopic(slug);
    return {
      slug,
      icon: meta.icon,
      color: meta.color,
      blurb: data?.description?.split(".")[0] ?? "",
      verseCount: data?.verses?.length || 0,
    };
  });

  // Icon lookup for every topic the page links to
  const topicIcons = {};
  for (const slug of allTopics) {
    topicIcons[slug] = getTopicMetadata(slug).icon;
  }
  for (const category of Object.values(categories)) {
    for (const slug of category.topics) {
      topicIcons[slug] = getTopicMetadata(slug).icon;
    }
  }

  // Same verse as /bible-verse-of-the-day (New York date)
  const votd = verseOfTheDay();
  const votdTopic = votd.topics[0];
  const verseOfTheDayCard = {
    text: votd.web,
    reference: votd.reference,
    translation: "WEB",
    topic: votdTopic,
    icon: getTopicMetadata(votdTopic).icon,
  };

  return (
    <HomeClient
      bibleNumbers={{
        books: totals.books,
        chapters: totals.chapters,
        verses: bible.kjv.verses,
        words: bible.kjv.words,
        hours: Math.round(bible.kjv.readingHours),
        wordPages: words.length,
      }}
      rotatingTopics={rotatingTopics}
      popularTopics={popularTopics}
      categories={categories}
      allTopics={allTopics}
      topicIcons={topicIcons}
      verseOfTheDay={verseOfTheDayCard}
      totalVerses={totalVerses}
    />
  );
}
