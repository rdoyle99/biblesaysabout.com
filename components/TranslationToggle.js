/* Switch every verse on the page between the World English Bible and the King James Version.
 * Both texts are in the HTML; this only flips data-translation on <html> (CSS in globals.css shows one),
 * and remembers the choice in localStorage. app/layout.js applies the saved choice before first paint.
 */

"use client";

import { useEffect, useState } from "react";

const OPTIONS = [
  { id: "web", label: "WEB", title: "World English Bible" },
  { id: "kjv", label: "KJV", title: "King James Version" },
];

export default function TranslationToggle() {
  const [active, setActive] = useState("web");

  useEffect(() => {
    setActive(document.documentElement.dataset.translation === "kjv" ? "kjv" : "web");
  }, []);

  const choose = (id) => {
    setActive(id);
    document.documentElement.dataset.translation = id;
    try {
      localStorage.setItem("translation", id);
    } catch {}
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
      <span className="text-sm text-muted-foreground">Translation:</span>
      <div role="group" aria-label="Bible translation" className="inline-flex rounded-full border p-1 bg-card">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => choose(o.id)}
            aria-pressed={active === o.id}
            title={o.title}
            className={`rounded-full px-4 py-1.5 text-sm font-medium touch-manipulation transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              active === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.title} ({o.label})
          </button>
        ))}
      </div>
    </div>
  );
}
