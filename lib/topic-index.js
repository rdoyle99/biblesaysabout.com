/* Topic Index - Small, serializable topic summaries for UI props
 * Created: Lets server components and route handlers hand client components
 * only what they render (slug, icon, color, verse count) instead of letting
 * them import lib/verses.js, which would ship every verse to the browser.
 *
 * SERVER ONLY: this module imports lib/verses.js. Never import it from a
 * "use client" file, directly or through another client module.
 */

import { getAllTopics, getTopicMetadata, getVersesByTopic } from "@/lib/verses";

// Slug and icon for every topic (used by the header menu and search dialog)
export function getTopicList() {
  return getAllTopics().map((slug) => ({
    slug,
    icon: getTopicMetadata(slug).icon,
  }));
}

// Everything a topic card needs, without the verse array
export function getTopicSummary(slug) {
  const meta = getTopicMetadata(slug);
  const data = getVersesByTopic(slug);
  return {
    slug,
    icon: meta.icon,
    color: meta.color,
    verseCount: data?.verses?.length || 0,
  };
}
