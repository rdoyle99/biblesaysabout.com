/* Favorites Page - User's saved Bible verses
 * Created: Page to display and manage favorited verses
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VerseCard from "@/components/VerseCard";
import { toast } from "sonner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const stored = JSON.parse(localStorage.getItem("favoriteVerses") || "[]");
    setFavorites(stored);
  };

  const clearAllFavorites = () => {
    localStorage.setItem("favoriteVerses", JSON.stringify([]));
    setFavorites([]);
    toast.success("All favorites cleared");
  };

  const exportFavorites = () => {
    const text = favorites
      .map((v) => `"${v.text}" - ${v.reference} (${v.translation})`)
      .join("\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-favorite-verses.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Favorites exported!");
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Favorites</span>
          </nav>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white text-3xl mb-6">
              ❤️
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Your Favorite Verses
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {favorites.length === 0
                ? "Start saving verses by clicking the heart icon on any verse card."
                : `You have ${favorites.length} saved verse${favorites.length === 1 ? "" : "s"}.`}
            </p>

            {favorites.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button variant="outline" onClick={exportFavorites}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export Favorites
                </Button>
                <Button variant="ghost" onClick={clearAllFavorites}>
                  Clear All
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Favorites Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {favorites.length === 0 ? (
            <Card className="max-w-md mx-auto text-center">
              <CardHeader>
                <CardTitle>No Favorites Yet</CardTitle>
                <CardDescription>
                  Browse our Bible verse collections and save the ones that
                  speak to you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/#topics">Browse Topics</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {favorites.map((verse, index) => (
                <div
                  key={`${verse.reference}-${index}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <VerseCard
                    verse={verse}
                    showAnimation={true}
                    currentTopic={verse.theme}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {favorites.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Discover More Verses</h2>
            <p className="text-muted-foreground mb-6">
              Continue exploring our collection of Bible verses on various topics.
            </p>
            <Button asChild>
              <Link href="/#topics">Browse All Topics</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}

