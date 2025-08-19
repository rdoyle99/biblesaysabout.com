import { notFound } from "next/navigation";
import { getVersesByTopic, getAllTopics } from "../../../lib/verses";
import VerseCard from "../../../components/VerseCard";
import AllTopicsSection from "../../../components/AllTopicsSection";

// Generate static params for all topics
export async function generateStaticParams() {
  const topics = getAllTopics();
  return topics.map((topic) => ({
    topic: topic,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const topicData = getVersesByTopic(params.topic);
  
  if (!topicData) {
    return {
      title: "Topic Not Found - Bible Says About",
      description: "The requested Bible verse topic was not found.",
    };
  }

  const canonicalUrl = `https://biblesaysabout.com/verses/${params.topic}`;
  
  return {
    title: `${topicData.title} - Bible Says About`,
    description: topicData.description,
    keywords: topicData.keywords.join(", "),
    openGraph: {
      title: topicData.title,
      description: topicData.description,
      type: "article",
      url: canonicalUrl,
      siteName: "Bible Says About",
      images: [
        {
          url: `/api/og?topic=${params.topic}`,
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
      images: [`/api/og?topic=${params.topic}`],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default function TopicPage({ params }) {
  const topicData = getVersesByTopic(params.topic);
  
  if (!topicData) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": topicData.title,
    "description": topicData.description,
    "author": {
      "@type": "Organization",
      "name": "Bible Says About"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bible Says About",
      "logo": {
        "@type": "ImageObject",
        "url": "https://biblesaysabout.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://biblesaysabout.com/verses/${params.topic}`
    },
    "articleSection": "Bible Verses",
    "keywords": topicData.keywords.join(", "),
    "about": {
      "@type": "Thing",
      "name": topicData.title
    }
  };

  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-white bg-grid">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-slate-50/50 to-white/80 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {topicData.title}
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {topicData.description}
              </p>
            </div>
          </div>
        </div>

        {/* Verses Grid */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topicData.verses.map((verse, index) => (
              <VerseCard
                key={`${verse.reference}-${index}`}
                verse={verse}
                showAnimation={true}
                currentTopic={params.topic}
              />
            ))}
          </div>
        </div>

        {/* All Topics Section */}
        <AllTopicsSection currentTopic={params.topic} />
      </main>
    </>
  );
}