/* Search Page - Full search experience
 * Created: Dedicated search page with filtering and results
 * Server wrapper: resolves the popular topic icons on the server. The client
 * component (components/SearchClient.js) fetches results from /api/search.
 */

import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";
import { getTopicSummary } from "@/lib/topic-index";

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

export default function SearchPage() {
  const popularTopics = POPULAR_TOPICS.map((slug) => ({
    slug,
    icon: getTopicSummary(slug).icon,
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SearchClient popularTopics={popularTopics} />
    </Suspense>
  );
}
