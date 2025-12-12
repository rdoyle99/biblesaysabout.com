/* Footer - Site footer with topic links and social
 * Updated: Enhanced design with topic categories and better organization
 */

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const popularTopics = [
    { name: "Strength", slug: "strength" },
    { name: "Love", slug: "love" },
    { name: "Peace", slug: "peace" },
    { name: "Hope", slug: "hope" },
    { name: "Faith", slug: "faith" },
    { name: "Anxiety", slug: "anxiety" },
  ];

  const moreTopics = [
    { name: "Healing", slug: "healing" },
    { name: "Forgiveness", slug: "forgiveness" },
    { name: "Wisdom", slug: "wisdom" },
    { name: "Prayer", slug: "prayer" },
    { name: "Grace", slug: "grace" },
    { name: "Joy", slug: "joy" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm">
                BS
              </div>
              <span className="text-lg font-bold">Bible Says About</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Discover what the Bible says about any topic. Explore curated verses 
              on strength, love, hope, and more to guide your spiritual journey.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="mailto:rpdoyle1@gmail.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email us"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Popular Topics */}
          <div>
            <h3 className="font-semibold mb-4">Popular Topics</h3>
            <ul className="space-y-2">
              {popularTopics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/verses/${topic.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                  >
                    {topic.name} Verses
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Topics */}
          <div>
            <h3 className="font-semibold mb-4">More Topics</h3>
            <ul className="space-y-2">
              {moreTopics.map((topic) => (
                <li key={topic.slug}>
                  <Link
                    href={`/verses/${topic.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                  >
                    {topic.name} Verses
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#all-topics"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  All Topics
                </Link>
              </li>
              <li>
                <Link
                  href="/#verse-of-day"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  Verse of the Day
                </Link>
              </li>
              <li>
                <Link
                  href="/#categories"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  Browse by Category
                </Link>
              </li>
              <li>
                <a
                  href="mailto:rpdoyle1@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-underline"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Bible Says About. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
