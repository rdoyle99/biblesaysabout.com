import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategorizedTopics,
  getTopicMetadata,
  getVersesByTopic,
  topicCategories,
} from "@/lib/verses";
import { generateBreadcrumbSchema, combineSchemas } from "@/lib/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export async function generateStaticParams() {
  return Object.keys(topicCategories).map((category) => ({ category }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const info = topicCategories[category];
  if (!info) return { title: "Category Not Found" };
  return {
    title: `${info.name} Bible Verses by Topic`,
    description: `${info.description}. Browse Bible verse collections in ${info.name.toLowerCase()}.`,
    alternates: { canonical: `https://www.biblesaysabout.com/topics/${category}` },
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cats = getCategorizedTopics();
  const data = cats[category];
  if (!data) notFound();

  const topics = (data.topics || []).map((slug) => {
    const meta = getTopicMetadata(slug);
    const verseData = getVersesByTopic(slug);
    return {
      slug,
      meta,
      count: verseData?.verses?.length || 0,
      title: verseData?.title || slug,
    };
  });

  const totalVerses = topics.reduce((s, t) => s + t.count, 0);
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: "https://www.biblesaysabout.com" },
    { name: data.name, url: `https://www.biblesaysabout.com/topics/${category}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combineSchemas(breadcrumb)) }}
      />
      <div className="min-h-screen">
        <section className="py-12 md:py-16 bg-gradient-to-b from-muted/40 to-background">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <nav className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <span className="text-foreground">{data.name}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {data.name} Bible Verses
            </h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
              {data.description}. This hub lists {topics.length} topics and {totalVerses} verses
              in our {data.name.toLowerCase()} collection.
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">{topics.length} topics</Badge>
              <Badge variant="outline">{totalVerses} verses</Badge>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics.map((t) => (
                <Link key={t.slug} href={`/verses/${t.slug}`} className="group">
                  <Card className="h-full transition-all hover:shadow-md hover:border-primary/40">
                    <CardContent className="p-5">
                      <div className="text-2xl mb-2">{t.meta.icon}</div>
                      <h2 className="font-semibold capitalize group-hover:text-primary mb-1">
                        {t.slug.replace(/-/g, " ")}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t.count} Bible verses
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10 border-t">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-bold mb-4">All categories</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(topicCategories).map(([slug, info]) => (
                <Link
                  key={slug}
                  href={`/topics/${slug}`}
                  className={`text-sm px-3 py-1.5 rounded-full border ${
                    slug === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-primary/50"
                  }`}
                >
                  {info.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
