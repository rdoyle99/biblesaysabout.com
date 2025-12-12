/* Search Page - Full search experience
 * Created: Dedicated search page with filtering and results
 */

"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VerseCard from "@/components/VerseCard";
import VerseCardSkeleton from "@/components/VerseCardSkeleton";
import {
  getAllTopics,
  getTopicMetadata,
  searchVerses,
  getVersesByTopic,
} from "@/lib/verses";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const allTopics = getAllTopics();

  // Search results
  const results = useMemo(() => {
    if (!query || query.length < 2) {
      return { topics: [], verses: [] };
    }

    setIsSearching(true);

    const lowerQuery = query.toLowerCase();

    // Search topics
    const matchingTopics = allTopics.filter(
      (topic) =>
        topic.toLowerCase().includes(lowerQuery) ||
        getVersesByTopic(topic)?.keywords?.some((k) =>
          k.toLowerCase().includes(lowerQuery)
        )
    );

    // Search verses
    const matchingVerses = searchVerses(query, 50);

    setIsSearching(false);

    return {
      topics: matchingTopics,
      verses: matchingVerses,
    };
  }, [query, allTopics]);

  // Update URL when query changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) {
      params.set("q", query);
    }
    const newUrl = query ? `/search?${params.toString()}` : "/search";
    router.replace(newUrl, { scroll: false });
  }, [query, router]);

  const totalResults = results.topics.length + results.verses.length;

  return (
    <div className="min-h-screen">
      {/* Search Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Search</span>
          </nav>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Search Bible Verses
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find verses by topic, reference, or keywords. Discover God's Word
              for every situation.
            </p>
          </div>

          {/* Search Input */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                type="text"
                placeholder="Search topics, verses, or references..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg"
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {!query || query.length < 2 ? (
            // No query - show popular topics
            <div>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Popular Topics
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
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
                ].map((topic) => {
                  const meta = getTopicMetadata(topic);
                  return (
                    <Link key={topic} href={`/verses/${topic}`}>
                      <Card className="h-full text-center hover:shadow-md hover:-translate-y-1 transition-all">
                        <CardContent className="p-4">
                          <div className="text-2xl mb-2">{meta.icon}</div>
                          <span className="text-sm font-medium capitalize">
                            {topic}
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            // Show results
            <div>
              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {isSearching ? (
                    "Searching..."
                  ) : (
                    <>
                      Found{" "}
                      <span className="font-semibold text-foreground">
                        {totalResults}
                      </span>{" "}
                      result{totalResults !== 1 ? "s" : ""} for "{query}"
                    </>
                  )}
                </p>
              </div>

              {totalResults === 0 ? (
                // No results
                <Card className="max-w-md mx-auto text-center">
                  <CardHeader>
                    <CardTitle>No Results Found</CardTitle>
                    <CardDescription>
                      Try a different search term or browse our topics.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <Link href="/#topics">Browse Topics</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                // Results tabs
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6">
                    <TabsTrigger value="all">
                      All ({totalResults})
                    </TabsTrigger>
                    <TabsTrigger value="topics">
                      Topics ({results.topics.length})
                    </TabsTrigger>
                    <TabsTrigger value="verses">
                      Verses ({results.verses.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-8">
                    {/* Topics */}
                    {results.topics.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Topics</h3>
                        <div className="flex flex-wrap gap-3">
                          {results.topics.map((topic) => {
                            const meta = getTopicMetadata(topic);
                            return (
                              <Link key={topic} href={`/verses/${topic}`}>
                                <Badge
                                  variant="secondary"
                                  className="px-4 py-2 text-base cursor-pointer hover:bg-secondary/80 transition-all hover:scale-105"
                                >
                                  <span className="mr-2">{meta.icon}</span>
                                  <span className="capitalize">{topic}</span>
                                </Badge>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Verses */}
                    {results.verses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Verses</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {results.verses.slice(0, 10).map((verse, index) => (
                            <VerseCard
                              key={`${verse.reference}-${index}`}
                              verse={verse}
                              showAnimation={true}
                              currentTopic={verse.topic}
                            />
                          ))}
                        </div>
                        {results.verses.length > 10 && (
                          <div className="text-center mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setActiveTab("verses")}
                            >
                              View All {results.verses.length} Verses
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="topics">
                    <div className="flex flex-wrap gap-3">
                      {results.topics.map((topic) => {
                        const meta = getTopicMetadata(topic);
                        const data = getVersesByTopic(topic);
                        return (
                          <Link key={topic} href={`/verses/${topic}`}>
                            <Card className="hover:shadow-md transition-all hover:-translate-y-1">
                              <CardContent className="p-4 flex items-center space-x-3">
                                <div
                                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-xl`}
                                >
                                  {meta.icon}
                                </div>
                                <div>
                                  <h4 className="font-medium capitalize">
                                    {topic}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {data?.verses?.length || 0} verses
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="verses">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.verses.map((verse, index) => (
                        <VerseCard
                          key={`${verse.reference}-${index}`}
                          verse={verse}
                          showAnimation={true}
                          currentTopic={verse.topic}
                        />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}

