/* VerseCard - Enhanced verse display component
 * Updated: Complete redesign with shadcn/ui, advanced microinteractions, favorites, and sharing
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { highlightKeywords } from "@/lib/highlightKeywords";
import { cn } from "@/lib/utils";

export default function VerseCard({
  verse,
  showAnimation = true,
  currentTopic = null,
  featured = false,
}) {
  const { text, reference, translation = "NIV", theme = "default" } = verse;
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if verse is favorited on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favoriteVerses") || "[]");
    setIsFavorite(favorites.some((v) => v.reference === reference));
  }, [reference]);

  // Handle favorite toggle
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favoriteVerses") || "[]");

    if (isFavorite) {
      const newFavorites = favorites.filter((v) => v.reference !== reference);
      localStorage.setItem("favoriteVerses", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } else {
      const newFavorites = [...favorites, { text, reference, translation, theme }];
      localStorage.setItem("favoriteVerses", JSON.stringify(newFavorites));
      setIsFavorite(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      toast.success("Added to favorites!");
    }
  };

  // Share content
  const shareText = `"${text}" - ${reference} (${translation})`;
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast.success("Verse copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy verse");
    }
  };

  const handleShare = (platform) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  // Theme-based gradient styles
  const themeGradients = {
    strength: "from-blue-500/10 to-indigo-500/5",
    love: "from-rose-500/10 to-pink-500/5",
    peace: "from-green-500/10 to-emerald-500/5",
    hope: "from-amber-500/10 to-yellow-500/5",
    faith: "from-purple-500/10 to-violet-500/5",
    anxiety: "from-teal-500/10 to-cyan-500/5",
    healing: "from-emerald-500/10 to-green-500/5",
    forgiveness: "from-rose-500/10 to-red-500/5",
    joy: "from-yellow-500/10 to-amber-500/5",
    prayer: "from-violet-500/10 to-purple-500/5",
    grace: "from-pink-500/10 to-purple-500/5",
    mercy: "from-purple-500/10 to-indigo-500/5",
    default: "from-slate-500/10 to-gray-500/5",
  };

  // Theme-based accent colors for the bottom bar
  const themeAccents = {
    strength: "from-blue-400 to-indigo-500",
    love: "from-rose-400 to-pink-500",
    peace: "from-green-400 to-emerald-500",
    hope: "from-amber-400 to-yellow-500",
    faith: "from-purple-400 to-violet-500",
    anxiety: "from-teal-400 to-cyan-500",
    healing: "from-emerald-400 to-green-500",
    forgiveness: "from-rose-400 to-red-500",
    joy: "from-yellow-400 to-amber-500",
    prayer: "from-violet-400 to-purple-500",
    grace: "from-pink-400 to-purple-500",
    mercy: "from-purple-400 to-indigo-500",
    default: "from-slate-400 to-gray-500",
  };

  const gradient = themeGradients[theme] || themeGradients.default;
  const accent = themeAccents[theme] || themeAccents.default;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "hover:shadow-xl hover:shadow-primary/5",
        showAnimation && "verse-card",
        featured && "border-2 border-primary/20"
      )}
    >
      {/* Gradient background overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          gradient
        )}
      />

      {/* Animated corner accent */}
      <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-gradient-to-br from-primary/10 to-transparent rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />

      <CardContent className={cn("relative p-6", featured && "p-8")}>
        {/* Header with actions */}
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant="secondary"
            className="text-xs font-medium opacity-80 group-hover:opacity-100 transition-opacity capitalize"
          >
            {theme}
          </Badge>

          {/* Action buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            {/* Favorite button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8",
                    isAnimating && "animate-bounce-subtle"
                  )}
                  onClick={toggleFavorite}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(
                      "h-4 w-4 transition-all duration-300",
                      isFavorite
                        ? "fill-rose-500 text-rose-500 scale-110"
                        : "text-muted-foreground hover:text-rose-500"
                    )}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isFavorite ? "Remove from favorites" : "Add to favorites"}
              </TooltipContent>
            </Tooltip>

            {/* Copy button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-muted-foreground hover:text-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{copied ? "Copied!" : "Copy verse"}</TooltipContent>
            </Tooltip>

            {/* Share dropdown */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-muted-foreground hover:text-foreground"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>Share verse</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share on X
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Share on Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Share on WhatsApp
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("pinterest")}>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                  Share on Pinterest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Verse text */}
        <blockquote
          className={cn(
            "scripture-text text-foreground mb-4 leading-relaxed transition-colors duration-300",
            featured ? "text-xl md:text-2xl" : "text-lg"
          )}
          dangerouslySetInnerHTML={{
            __html: `"${
              currentTopic ? highlightKeywords(text, currentTopic) : text
            }"`,
          }}
        />

        {/* Reference and translation */}
        <div className="flex items-center justify-between">
          <cite className="not-italic flex items-center space-x-2">
            <span className="font-semibold text-foreground">{reference}</span>
            <Badge variant="outline" className="text-xs">
              {translation}
            </Badge>
          </cite>
        </div>

        {/* Animated bottom accent bar */}
        {showAnimation && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500",
              accent
            )}
          />
        )}
      </CardContent>

      {/* Featured indicator */}
      {featured && (
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </Card>
  );
}
