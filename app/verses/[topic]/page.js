/* Topic Page - Individual Bible verse topic page
 * Updated: Enhanced SEO with schema markup, modern design, and engagement features
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import { getVersesByTopic, getAllTopics, getTopicMetadata, getRelatedTopics } from "@/lib/verses";
import { 
  generateArticleSchema, 
  generateBreadcrumbSchema, 
  generateFAQSchema,
  generateCollectionSchema,
  combineSchemas 
} from "@/lib/schema";
import VerseCard from "@/components/VerseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Generate static params for all topics
export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topic: topic,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { topic } = await params;
  const topicData = getVersesByTopic(topic);

  if (!topicData) {
    return {
      title: "Topic Not Found - Bible Says About",
      description: "The requested Bible verse topic was not found.",
    };
  }

  const canonicalUrl = `https://biblesaysabout.com/verses/${topic}`;
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  return {
    title: topicData.title,
    description: topicData.description,
    keywords: topicData.keywords?.join(", "),
    openGraph: {
      title: topicData.title,
      description: topicData.description,
      type: "article",
      url: canonicalUrl,
      siteName: "Bible Says About",
      images: [
        {
          url: `/api/og?topic=${topic}`,
          width: 1200,
          height: 630,
          alt: topicData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: topicData.title,
      description: topicData.description,
      images: [`/api/og?topic=${topic}`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    other: {
      "article:section": "Bible Verses",
      "article:tag": topicData.keywords?.slice(0, 5).join(", "),
    },
  };
}

export default async function TopicPage({ params }) {
  const { topic } = await params;
  const topicData = getVersesByTopic(topic);

  if (!topicData) {
    notFound();
  }

  const topicMeta = getTopicMetadata(topic);
  const relatedTopics = getRelatedTopics(topic, 6);
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://biblesaysabout.com" },
    { name: "Topics", url: "https://biblesaysabout.com/#topics" },
    { name: `${capitalizedTopic} Verses`, url: `https://biblesaysabout.com/verses/${topic}` },
  ]);

  const articleSchema = generateArticleSchema(topicData, topic);
  const faqSchema = generateFAQSchema(topic, topicData);
  const collectionSchema = generateCollectionSchema(topicData, topic);

  const combinedSchema = combineSchemas(
    breadcrumbSchema,
    articleSchema,
    faqSchema,
    collectionSchema
  );

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-muted/50 via-background to-background py-12 md:py-20">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
            <div className={`absolute top-20 right-20 w-72 h-72 rounded-full bg-gradient-to-br ${topicMeta.color} blur-3xl`} />
            <div className={`absolute bottom-20 left-20 w-64 h-64 rounded-full bg-gradient-to-br ${topicMeta.color} blur-3xl`} />
          </div>

          <div className="relative max-w-4xl mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/#topics" className="hover:text-foreground transition-colors">
                Topics
              </Link>
              <span>/</span>
              <span className="text-foreground capitalize">{topic}</span>
            </nav>

            <div className="text-center">
              {/* Topic icon */}
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${topicMeta.color} text-white text-4xl mb-6 shadow-lg`}>
                {topicMeta.icon}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                {topicData.title}
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 leading-relaxed">
                {topicData.description}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {topicData.verses.length} verses
                </Badge>
                <Badge variant="outline" className="text-sm capitalize">
                  {topicMeta.category.replace("-", " ")}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Verses Grid Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topicData.verses.map((verse, index) => (
                <div
                  key={`${verse.reference}-${index}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VerseCard
                    verse={{ ...verse, theme: topic }}
                    showAnimation={true}
                    currentTopic={topic}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Topics Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Related Topics
              </h2>
              <p className="text-muted-foreground">
                Continue exploring similar Bible verse collections
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {relatedTopics.map((relatedTopic) => {
                const meta = getTopicMetadata(relatedTopic);
                return (
                  <Link
                    key={relatedTopic}
                    href={`/verses/${relatedTopic}`}
                    className="group"
                  >
                    <Card className="h-full text-center transition-all duration-200 hover:shadow-md hover:-translate-y-1 hover:border-primary/50">
                      <CardContent className="p-4">
                        <div className="text-2xl mb-2 transition-transform group-hover:scale-110">
                          {meta.icon}
                        </div>
                        <span className="text-sm font-medium capitalize group-hover:text-primary transition-colors">
                          {relatedTopic}
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What does the Bible say about {topic}?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {topicData.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    What are the best Bible verses about {topic}?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Some of the most powerful verses about {topic} include{" "}
                    {topicData.verses.slice(0, 3).map((v, i) => (
                      <span key={v.reference}>
                        {v.reference}
                        {i < 2 ? ", " : ""}
                      </span>
                    ))}
                    . Browse our complete collection of {topicData.verses.length} verses above.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    How can I memorize Bible verses about {topic}?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Start by saving your favorite verses using the heart icon on each card. 
                    Read them daily, and use the share feature to create reminders. 
                    Focus on one verse at a time and meditate on its meaning in your life.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Find More Encouragement in Scripture
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Explore more topics and discover God's Word for every season of life.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/#topics">Browse All Topics</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link href="/#verse-of-day">Verse of the Day</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
