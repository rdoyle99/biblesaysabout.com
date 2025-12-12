/* Sitemap - Dynamic sitemap generation
 * Updated: Enhanced with all topics and proper priorities
 */

import { getAllTopics } from "@/lib/verses";

export default function sitemap() {
  const baseUrl = "https://biblesaysabout.com";
  const topics = getAllTopics();
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
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

  // Topic pages with varying priorities based on importance
  const popularTopics = ["strength", "love", "peace", "hope", "faith", "anxiety", "prayer", "healing"];
  
  const topicPages = topics.map((topic) => ({
    url: `${baseUrl}/verses/${topic}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: popularTopics.includes(topic) ? 0.9 : 0.8,
  }));

  return [...staticPages, ...topicPages];
}
