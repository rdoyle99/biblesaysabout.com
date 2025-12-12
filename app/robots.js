/* Robots - Search engine crawling rules
 * Updated: Optimized for SEO with sitemap reference
 */

export default function robots() {
  const baseUrl = "https://biblesaysabout.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
