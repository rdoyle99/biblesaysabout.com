/* Homepage - Main landing page
 * Updated: Complete redesign with shadcn/ui, advanced animations, and engagement features
 */

"use client";

import {useState, useEffect} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {
  getAllTopics,
  getTopicMetadata,
  getCategorizedTopics,
  getVerseOfTheDay,
  getTotalVerseCount,
  getVersesByTopic,
} from "@/lib/verses";
import VerseCard from "@/components/VerseCard";

export default function Home() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [verseOfTheDay, setVerseOfTheDay] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Featured rotating topics
  const rotatingTopics = [
    {name: "Strength", slug: "strength"},
    {name: "Love", slug: "love"},
    {name: "Peace", slug: "peace"},
    {name: "Hope", slug: "hope"},
    {name: "Faith", slug: "faith"},
    {name: "Joy", slug: "joy"},
  ];

  const allTopics = getAllTopics();
  const categories = getCategorizedTopics();
  const totalVerses = getTotalVerseCount();

  // Initialize verse of the day on mount
  useEffect(() => {
    setMounted(true);
    setVerseOfTheDay(getVerseOfTheDay());
  }, []);

  // Rotate topics every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopicIndex((prev) => (prev + 1) % rotatingTopics.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentTopic = rotatingTopics[currentTopicIndex];
  const currentTopicData = getVersesByTopic(currentTopic.slug);
  const currentTopicMeta = getTopicMetadata(currentTopic.slug);

  // Featured verses for the hero section
  const featuredVerse = currentTopicData?.verses[0];

  // Popular topics with their metadata
  const popularTopics = [
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
  ].map((slug) => ({
    slug,
    ...getTopicMetadata(slug),
    data: getVersesByTopic(slug),
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated badge */}
            <div className="inline-flex items-center space-x-2 mb-6 animate-fade-in">
              <Badge variant="secondary" className="px-3 py-1">
                <span className="animate-pulse-soft">✨</span>
                <span className="ml-2">
                  {allTopics.length} Topics • {totalVerses}+ Verses
                </span>
              </Badge>
            </div>

            {/* Main heading with rotating topic */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up">
              What Does the Bible Say About{" "}
              <span
                key={currentTopic.slug}
                className={`inline-block gradient-text bg-gradient-to-r ${currentTopicMeta.color} animate-rolodex-bounce`}
              >
                {currentTopic.name}?
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
              Discover meaningful Bible verses organized by topic. Find
              strength, hope, love, and guidance through God's Word for every
              season of life.
            </p>

            {/* Featured verse card */}
            {featuredVerse && mounted && (
              <div className="max-w-2xl mx-auto mb-8 animate-fade-in-up delay-200">
                <VerseCard
                  verse={{...featuredVerse, theme: currentTopic.slug}}
                  showAnimation={true}
                  featured={true}
                />
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Button size="lg" asChild className="group">
                <Link href={`/verses/${currentTopic.slug}`}>
                  Explore {currentTopic.name} Verses
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#topics">Browse All Topics</Link>
              </Button>
            </div>

            {/* Topic indicators */}
            <div className="flex items-center justify-center gap-2 mt-8 animate-fade-in delay-500">
              {rotatingTopics.map((topic, index) => (
                <button
                  key={topic.slug}
                  onClick={() => setCurrentTopicIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentTopicIndex
                      ? "w-8 bg-primary"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Switch to ${topic.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verse of the Day Section */}
      <section id="verse-of-day" className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              📖 Daily Inspiration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Verse of the Day
            </h2>
            <p className="text-muted-foreground">
              Start your day with God's Word
            </p>
          </div>

          {verseOfTheDay && mounted && (
            <Card className="overflow-hidden border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-3xl">
                      {getTopicMetadata(verseOfTheDay.topic).icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <blockquote className="scripture-text text-xl md:text-2xl text-foreground mb-4 leading-relaxed">
                      "{verseOfTheDay.text}"
                    </blockquote>
                    <div className="flex flex-wrap items-center gap-3">
                      <cite className="not-italic">
                        <span className="font-semibold">
                          {verseOfTheDay.reference}
                        </span>
                        <Badge variant="secondary" className="ml-2">
                          {verseOfTheDay.translation}
                        </Badge>
                      </cite>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/verses/${verseOfTheDay.topic}`}>
                          More{" "}
                          {verseOfTheDay.topic.charAt(0).toUpperCase() +
                            verseOfTheDay.topic.slice(1)}{" "}
                          Verses →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Popular Topics Section */}
      <section id="topics" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              🔥 Most Searched
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Popular Bible Verse Topics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular collections of Bible verses organized by
              the topics that matter most to you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {popularTopics.map((topic, index) => (
              <Link
                key={topic.slug}
                href={`/verses/${topic.slug}`}
                className="group"
                style={{animationDelay: `${index * 50}ms`}}
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50 animate-fade-in-up">
                  <CardHeader className="pb-2">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white text-2xl mb-3 transition-transform group-hover:scale-110`}
                    >
                      {topic.icon}
                    </div>
                    <CardTitle className="text-lg capitalize">
                      {topic.slug}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 text-sm">
                      {topic.data?.description?.split(".")[0]}.
                    </CardDescription>
                    <div className="mt-3 flex items-center text-sm text-muted-foreground">
                      <span>{topic.data?.verses?.length || 0} verses</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-16 md:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              📚 Organized for You
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Browse by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find verses organized by life areas and spiritual themes.
            </p>
          </div>

          <Tabs defaultValue="faith" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8 h-auto bg-transparent">
              {Object.entries(categories).map(([key, category]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(categories).map(([key, category]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {category.topics.map((topic) => {
                        const meta = getTopicMetadata(topic);
                        return (
                          <Tooltip key={topic}>
                            <TooltipTrigger asChild>
                              <Link href={`/verses/${topic}`}>
                                <Badge
                                  variant="secondary"
                                  className="px-4 py-2 text-base cursor-pointer hover:bg-secondary/80 transition-all hover:scale-105"
                                >
                                  <span className="mr-2">{meta.icon}</span>
                                  <span className="capitalize">{topic}</span>
                                </Badge>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Explore {topic} verses</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* All Topics Grid */}
      <section id="all-topics" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              📖 Complete Collection
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              All Bible Verse Topics
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our complete collection of {allTopics.length} topics with{" "}
              {totalVerses}+ carefully curated Bible verses.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {allTopics.map((topic, index) => {
              const meta = getTopicMetadata(topic);
              return (
                <Link
                  key={topic}
                  href={`/verses/${topic}`}
                  className="group"
                  style={{animationDelay: `${index * 20}ms`}}
                >
                  <Card className="h-full text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/50 animate-fade-in">
                    <CardContent className="p-4">
                      <div className="text-2xl mb-2 transition-transform group-hover:scale-110">
                        {meta.icon}
                      </div>
                      <span className="text-sm font-medium capitalize block group-hover:text-primary transition-colors">
                        {topic}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands who find daily inspiration and strength through God's
            Word. Discover the perfect verse for every moment in your life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/verses/strength">
                Find Strength in Scripture
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/verses/peace">Discover Peace</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {allTopics.length}+
              </div>
              <div className="text-muted-foreground">Topics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {totalVerses}+
              </div>
              <div className="text-muted-foreground">Curated Verses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                6
              </div>
              <div className="text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                ∞
              </div>
              <div className="text-muted-foreground">Inspiration</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
