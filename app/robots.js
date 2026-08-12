/* Robots - Search engine crawling rules
 * Updated: Optimized for SEO with sitemap reference
 */

export default function robots() {
  const baseUrl = "https://biblesaysabout.com";

  // Retrieval bots need allow for AI citations; training bots left unrestricted for now
  const allowAll = {
    allow: "/",
    disallow: ["/api/", "/private/"],
  };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
