/* Saved verses live in the visitor's browser, so the page has nothing for search engines to index */

export const metadata = {
  title: "Your Saved Verses",
  robots: { index: false, follow: true },
  alternates: { canonical: "https://www.biblesaysabout.com/favorites" },
};

export default function FavoritesLayout({ children }) {
  return children;
}
