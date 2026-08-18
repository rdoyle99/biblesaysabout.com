/* Sitemap - Dynamic sitemap generation */

import { getAllTopics, topicCategories } from "@/lib/verses";

export default function sitemap() {
  const baseUrl = "https://www.biblesaysabout.com";
  const topics = getAllTopics();
  const currentDate = new Date().toISOString();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/bible-statistics`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const categoryPages = Object.keys(topicCategories).map((category) => ({
    url: `${baseUrl}/topics/${category}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const popularTopics = [
    "love",
    "strength",
    "healing",
    "faith",
    "anxiety",
    "relationships",
    "friendship",
    "prayer",
    "grief",
    "death",
    "children",
    "mothers",
    "encouragement",
    "peace",
    "hope",
  ];

  const topicPages = topics.map((topic) => ({
    url: `${baseUrl}/verses/${topic}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: popularTopics.includes(topic) ? 0.9 : 0.8,
  }));

  return [...staticPages, ...categoryPages, ...topicPages];
}
