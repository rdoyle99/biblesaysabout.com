"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import VerseCard from "../components/VerseCard";

export default function Home() {
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);

  // Rotating topics with their featured verses
  const rotatingTopics = [
    {
      name: "Love",
      slug: "love",
      verse: {
        text: "And now these three remain: faith, hope and love. But the greatest of these is love.",
        reference: "1 Corinthians 13:13",
        translation: "NIV",
        theme: "love",
      },
    },
    {
      name: "Strength",
      slug: "strength",
      verse: {
        text: "I can do all this through him who gives me strength.",
        reference: "Philippians 4:13",
        translation: "NIV",
        theme: "strength",
      },
    },
    {
      name: "Anxiety",
      slug: "anxiety",
      verse: {
        text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
        reference: "Philippians 4:6",
        translation: "NIV",
        theme: "anxiety",
      },
    },
    {
      name: "Hope",
      slug: "hope",
      verse: {
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
        reference: "Jeremiah 29:11",
        translation: "NIV",
        theme: "hope",
      },
    },
    {
      name: "Peace",
      slug: "peace",
      verse: {
        text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
        reference: "John 14:27",
        translation: "NIV",
        theme: "peace",
      },
    },
  ];

  // Rotate topics every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTopicIndex(
        (prevIndex) => (prevIndex + 1) % rotatingTopics.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentTopic = rotatingTopics[currentTopicIndex];

  // Popular topics
  const popularTopics = [
    {
      name: "Strength",
      slug: "strength",
      description: "Find courage and power through God's strength",
      icon: "💪",
      color: "from-blue-500 to-indigo-600",
    },
    {
      name: "Love",
      slug: "love",
      description: "Discover God's love and how to love others",
      icon: "❤️",
      color: "from-rose-500 to-pink-600",
    },
    {
      name: "Peace",
      slug: "peace",
      description: "Experience God's peace in troubled times",
      icon: "🕊️",
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Hope",
      slug: "hope",
      description: "Find hope and encouragement in God's promises",
      icon: "🌟",
      color: "from-amber-500 to-yellow-600",
    },
    {
      name: "Faith",
      slug: "faith",
      description: "Strengthen your faith and trust in God",
      icon: "✝️",
      color: "from-purple-500 to-violet-600",
    },
    {
      name: "Anxiety",
      slug: "anxiety",
      description: "Find peace and comfort in times of worry",
      icon: "🕊️",
      color: "from-green-500 to-teal-600",
    },
    {
      name: "Healing",
      slug: "healing",
      description: "Experience God's healing power and restoration",
      icon: "🩹",
      color: "from-emerald-500 to-green-600",
    },
    {
      name: "Forgiveness",
      slug: "forgiveness",
      description: "Learn about mercy, grace, and redemption",
      icon: "🤝",
      color: "from-rose-500 to-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-white bg-grid relative overflow-hidden">
      {/* Animated Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-50/50 via-white/80 to-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              What Does the Bible Say About{" "}
              <span
                key={currentTopic.name}
                className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500 animate-rolodex-bounce"
              >
                {currentTopic.name}?
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover meaningful Bible verses organized by topic. Find
              strength, hope, love, and guidance through God's Word.
            </p>

            {/* Featured Verse */}
            <div className="max-w-2xl mx-auto mb-12">
              <VerseCard
                key={`${currentTopic.slug}-${currentTopicIndex}`}
                verse={currentTopic.verse}
                showAnimation={true}
              />
            </div>

            <Link
              href={`/verses/${currentTopic.slug}`}
              key={`button-${currentTopic.slug}-${currentTopicIndex}`}
              className="inline-flex items-center px-8 py-4 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium text-lg animate-rolodex-bounce"
            >
              Explore {currentTopic.name} Verses
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="py-16 bg-white bg-grid">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Popular Bible Verse Topics
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Explore Bible verses organized by the topics that matter most to
              you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/verses/${topic.slug}`}
                className="group block"
              >
                <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group-hover:border-slate-300">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${topic.color} flex items-center justify-center text-white text-2xl mb-4`}
                  >
                    {topic.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-slate-700">
                    {topic.name}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {topic.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* All Topics Section */}
      <div id="all-topics" className="py-16 bg-slate-50 bg-grid">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Complete Bible Verse Collection
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Explore our comprehensive collection of Bible verses organized by
              the topics that matter most in your spiritual journey. We have
              more verses and better organization than any other site.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
              "Strength",
              "Love",
              "Peace",
              "Hope",
              "Faith",
              "Anxiety",
              "Healing",
              "Forgiveness",
              "Comfort",
              "Wisdom",
              "Guidance",
              "Gratitude",
              "Protection",
              "Blessings",
              "Provision",
              "Depression",
              "Worry",
              "Fear",
              "Marriage",
              "Trust",
            ].map((topic) => (
              <Link
                key={topic.toLowerCase()}
                href={`/verses/${topic.toLowerCase()}`}
                className="group block bg-white rounded-lg p-4 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {topic === "Strength" && "💪"}
                    {topic === "Love" && "❤️"}
                    {topic === "Peace" && "🕊️"}
                    {topic === "Hope" && "🌟"}
                    {topic === "Faith" && "✝️"}
                    {topic === "Anxiety" && "🤗"}
                    {topic === "Healing" && "🩹"}
                    {topic === "Forgiveness" && "🤝"}
                    {topic === "Comfort" && "🫂"}
                    {topic === "Wisdom" && "🦉"}
                    {topic === "Guidance" && "🧭"}
                    {topic === "Gratitude" && "🙏"}
                    {topic === "Protection" && "🛡️"}
                    {topic === "Blessings" && "✨"}
                    {topic === "Provision" && "🍞"}
                    {topic === "Depression" && "🌅"}
                    {topic === "Worry" && "😌"}
                    {topic === "Fear" && "🦁"}
                    {topic === "Marriage" && "💑"}
                    {topic === "Trust" && "🤲"}
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 group-hover:text-slate-700">
                    {topic}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands who find daily inspiration and strength through God's
            Word. Discover the perfect verse for every moment in your life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/verses/strength"
              className="inline-flex items-center px-8 py-4 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors duration-200 font-medium text-lg"
            >
              Find Strength in Scripture
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/verses/peace"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-slate-900 transition-colors duration-200 font-medium text-lg"
            >
              Discover Peace
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
