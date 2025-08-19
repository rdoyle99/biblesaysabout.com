import Link from "next/link";

export default function AllTopicsSection({ currentTopic = null }) {
  const allTopics = [
    { name: "Strength", icon: "💪", slug: "strength" },
    { name: "Love", icon: "❤️", slug: "love" },
    { name: "Peace", icon: "🕊️", slug: "peace" },
    { name: "Hope", icon: "🌟", slug: "hope" },
    { name: "Faith", icon: "✝️", slug: "faith" },
    { name: "Anxiety", icon: "🤗", slug: "anxiety" },
    { name: "Healing", icon: "🩹", slug: "healing" },
    { name: "Forgiveness", icon: "🤝", slug: "forgiveness" },
    { name: "Comfort", icon: "🫂", slug: "comfort" },
    { name: "Wisdom", icon: "🦉", slug: "wisdom" },
    { name: "Guidance", icon: "🧭", slug: "guidance" },
    { name: "Gratitude", icon: "🙏", slug: "gratitude" },
    { name: "Protection", icon: "🛡️", slug: "protection" },
    { name: "Blessings", icon: "✨", slug: "blessings" },
    { name: "Provision", icon: "🍞", slug: "provision" },
    { name: "Depression", icon: "🌅", slug: "depression" },
    { name: "Worry", icon: "😌", slug: "worry" },
    { name: "Fear", icon: "🦁", slug: "fear" },
    { name: "Marriage", icon: "💑", slug: "marriage" },
    { name: "Trust", icon: "🤲", slug: "trust" }
  ];

  return (
    <div className="py-16 bg-slate-50 bg-grid-small border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Complete Bible Verse Collection
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of Bible verses organized by the topics that matter most in your spiritual journey.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {allTopics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/verses/${topic.slug}`}
              className={`group block rounded-lg p-4 border transition-all duration-200 ${
                currentTopic === topic.slug
                  ? 'bg-blue-50 border-blue-200 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{topic.icon}</div>
                <h3 className={`text-sm font-medium ${
                  currentTopic === topic.slug
                    ? 'text-blue-900'
                    : 'text-slate-900 group-hover:text-slate-700'
                }`}>
                  {topic.name}
                </h3>
                {currentTopic === topic.slug && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">Current</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}