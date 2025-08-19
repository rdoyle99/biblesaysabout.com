import { getAllTopics } from '../lib/verses';

export default function sitemap() {
  const baseUrl = 'https://biblesaysabout.com';
  const topics = getAllTopics();
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
  
  // Dynamic verse topic pages
  const topicPages = topics.map((topic) => ({
    url: `${baseUrl}/verses/${topic}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  
  return [...staticPages, ...topicPages];
}