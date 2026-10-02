/* Search results pages are thin and endless; keep them out of the index but let crawlers follow the links */

export const metadata = {
  title: "Search Bible Verses",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.biblesaysabout.com/search" },
};

export default function SearchLayout({ children }) {
  return children;
}
