/* Schema - Structured data generators for SEO
 * Created: JSON-LD schema markup for Bible verses, topics, and site
 */

export const SITE_URL = "https://www.biblesaysabout.com";
export const ORG_ID = `${SITE_URL}/#organization`;
const orgRef = { "@id": ORG_ID };

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article schema for topic pages
 */
export function generateArticleSchema(topicData, topic) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topicData.title,
    description: topicData.description,
    author: orgRef,
    publisher: orgRef,
    datePublished: topicData.datePublished,
    dateModified: topicData.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/verses/${topic}`,
    },
    articleSection: "Bible Verses",
    keywords: topicData.keywords?.join(", ") || "",
    about: {
      "@type": "Thing",
      name: topicData.title,
    },
  };
}

/**
 * Generate Article schema for a data page (books, word counts, reference pages)
 */
export function generateDataArticleSchema({ headline, description, url, datePublished, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: orgRef,
    publisher: orgRef,
    datePublished,
    dateModified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

/**
 * Generate CollectionPage schema for topic pages
 */
export function generateCollectionSchema(topicData, topic) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: topicData.title,
    description: topicData.description,
    url: `https://www.biblesaysabout.com/verses/${topic}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: topicData.verses?.length || 0,
      itemListElement: topicData.verses?.slice(0, 10).map((verse, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Quotation",
          text: verse.text,
          creator: {
            "@type": "Book",
            name: "The Bible",
          },
          spokenByCharacter: verse.reference,
        },
      })),
    },
  };
}

/**
 * Generate individual Quote schema for a verse
 */
export function generateQuoteSchema(verse) {
  const book = verse.reference.split(" ")[0];

  return {
    "@context": "https://schema.org",
    "@type": "Quotation",
    text: verse.text,
    creator: {
      "@type": "Book",
      name: "The Bible",
    },
    isPartOf: {
      "@type": "Book",
      name: book,
    },
    spokenByCharacter: verse.reference,
  };
}

/**
 * Generate FAQ schema from the exact question/answer pairs rendered on the page
 * @param {Array<{ q: string, a: string }>} faqs
 */
export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * Generate HowTo schema for finding verses
 */
export function generateHowToSchema(topic) {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Find Bible Verses About ${capitalizedTopic}`,
    description: `Learn how to discover and study Bible verses about ${topic} for spiritual growth and encouragement.`,
    step: [
      {
        "@type": "HowToStep",
        name: "Browse the Collection",
        text: `Explore our curated collection of Bible verses about ${topic}.`,
      },
      {
        "@type": "HowToStep",
        name: "Read and Reflect",
        text: "Take time to read each verse and reflect on its meaning in your life.",
      },
      {
        "@type": "HowToStep",
        name: "Save Your Favorites",
        text: "Click the heart icon to save verses to your favorites for easy access.",
      },
      {
        "@type": "HowToStep",
        name: "Share with Others",
        text: "Share meaningful verses with friends and family on social media.",
      },
    ],
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bible Says About",
    url: "https://www.biblesaysabout.com",
    description:
      "Discover what the Bible says about any topic with our comprehensive collection of curated Bible verses.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.biblesaysabout.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generate Organization schema (sitewide; other schemas reference it by ORG_ID)
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Bible Says About",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Bible verses by topic and Bible facts counted from the full text of the King James Version and the World English Bible.",
  };
}

/**
 * Combine multiple schemas into a graph
 */
export function combineSchemas(...schemas) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
