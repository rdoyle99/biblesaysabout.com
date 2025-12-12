/* Header - Site navigation with search and mobile menu
 * Updated: Complete redesign with shadcn/ui, search command palette, and mobile sheet
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getAllTopics, getTopicMetadata, searchVerses } from "@/lib/verses";

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const topics = getAllTopics();
  const popularTopics = ["strength", "love", "peace", "hope", "anxiety", "faith"];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle keyboard shortcut for search
  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Search handler
  useEffect(() => {
    if (searchQuery.length > 2) {
      const results = searchVerses(searchQuery, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectTopic = (topic) => {
    router.push(`/verses/${topic}`);
    setSearchOpen(false);
    setIsOpen(false);
  };

  const handleSelectVerse = (verse) => {
    router.push(`/verses/${verse.topic}`);
    setSearchOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-sm border-b"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm transition-transform group-hover:scale-105">
            BS
          </div>
          <span className="text-lg font-bold text-foreground hidden sm:inline-block">
            Bible Says About
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#topics">Topics</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/#verse-of-day">Verse of the Day</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/favorites">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Favorites
            </Link>
          </Button>
        </div>

        {/* Search and Mobile Menu */}
        <div className="flex items-center space-x-2">
          {/* Search Button */}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2 text-muted-foreground"
            onClick={() => setSearchOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-sm">Search verses...</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setSearchOpen(true)}
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
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
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Navigation</h3>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/#topics");
                        setIsOpen(false);
                      }}
                    >
                      All Topics
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/#verse-of-day");
                        setIsOpen(false);
                      }}
                    >
                      Verse of the Day
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        router.push("/favorites");
                        setIsOpen(false);
                      }}
                    >
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
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      My Favorites
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Popular Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map((topic) => {
                      const meta = getTopicMetadata(topic);
                      return (
                        <Badge
                          key={topic}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80 transition-colors"
                          onClick={() => handleSelectTopic(topic)}
                        >
                          <span className="mr-1">{meta.icon}</span>
                          {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:rpdoyle1@gmail.com">Send Email</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Search Command Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput
          placeholder="Search topics or verses..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {searchQuery.length <= 2 && (
            <>
              <CommandGroup heading="Popular Topics">
                {popularTopics.map((topic) => {
                  const meta = getTopicMetadata(topic);
                  return (
                    <CommandItem
                      key={topic}
                      onSelect={() => handleSelectTopic(topic)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{meta.icon}</span>
                      <span className="capitalize">{topic}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandGroup heading="All Topics">
                {topics.filter((t) => !popularTopics.includes(t)).slice(0, 10).map((topic) => {
                  const meta = getTopicMetadata(topic);
                  return (
                    <CommandItem
                      key={topic}
                      onSelect={() => handleSelectTopic(topic)}
                      className="cursor-pointer"
                    >
                      <span className="mr-2">{meta.icon}</span>
                      <span className="capitalize">{topic}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {searchQuery.length > 2 && (
            <>
              <CommandGroup heading="Topics">
                {topics
                  .filter((topic) =>
                    topic.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 5)
                  .map((topic) => {
                    const meta = getTopicMetadata(topic);
                    return (
                      <CommandItem
                        key={topic}
                        onSelect={() => handleSelectTopic(topic)}
                        className="cursor-pointer"
                      >
                        <span className="mr-2">{meta.icon}</span>
                        <span className="capitalize">{topic}</span>
                      </CommandItem>
                    );
                  })}
              </CommandGroup>
              {searchResults.length > 0 && (
                <CommandGroup heading="Verses">
                  {searchResults.map((verse, index) => (
                    <CommandItem
                      key={`${verse.reference}-${index}`}
                      onSelect={() => handleSelectVerse(verse)}
                      className="cursor-pointer flex flex-col items-start"
                    >
                      <span className="text-sm font-medium">{verse.reference}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {verse.text}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
