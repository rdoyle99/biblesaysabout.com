/* Bible reading time calculator: pick a passage, a pace and minutes a day; see total time, days and finish date */

"use client";

import { useEffect, useMemo, useState } from "react";

const PACES = [
  { label: "Average silent reading (238 words a minute)", wpm: 238 },
  { label: "Reading aloud (183 words a minute)", wpm: 183 },
  { label: "Slower reader (175 words a minute)", wpm: 175 },
  { label: "Faster reader (300 words a minute)", wpm: 300 },
];

function duration(minutes) {
  const m = Math.max(1, Math.round(minutes));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} h ${r} min` : `${h} h`;
}

export default function ReadingCalculator({ selections }) {
  const [selection, setSelection] = useState(selections[0].id);
  const [translation, setTranslation] = useState("kjv");
  const [wpm, setWpm] = useState(238);
  const [perDay, setPerDay] = useState(15);
  // the finish date depends on the reader's today, so it is filled in after hydration
  const [today, setToday] = useState(null);
  useEffect(() => setToday(new Date()), []);

  const result = useMemo(() => {
    const s = selections.find((x) => x.id === selection) || selections[0];
    const words = s.words[translation];
    const pace = Math.min(Math.max(Number(wpm) || 0, 50), 1000);
    const daily = Math.min(Math.max(Number(perDay) || 0, 1), 600);
    const minutes = words / pace;
    const days = Math.ceil(minutes / daily);
    let finish = null;
    if (today) {
      const d = new Date(today);
      d.setDate(d.getDate() + days - 1);
      finish = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
    return {
      s,
      words,
      minutes,
      days,
      finish,
      chaptersPerDay: s.chapters / days,
    };
  }, [selection, translation, wpm, perDay, selections, today]);

  const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="rounded-xl border bg-card p-5 md:p-6">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          What you want to read
          <select className={`${inputClass} mt-1`} value={selection} onChange={(e) => setSelection(e.target.value)}>
            {selections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Translation
          <select className={`${inputClass} mt-1`} value={translation} onChange={(e) => setTranslation(e.target.value)}>
            <option value="kjv">King James Version</option>
            <option value="web">World English Bible</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Reading pace (words a minute)
          <input
            className={`${inputClass} mt-1`}
            type="number"
            inputMode="numeric"
            min={50}
            max={1000}
            value={wpm}
            onChange={(e) => setWpm(e.target.value)}
          />
          <span className="mt-2 flex flex-wrap gap-2">
            {PACES.map((p) => (
              <button
                key={p.wpm}
                type="button"
                onClick={() => setWpm(p.wpm)}
                className={`rounded-full border px-3 py-1 text-xs touch-manipulation ${Number(wpm) === p.wpm ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                title={p.label}
              >
                {p.wpm}
              </button>
            ))}
          </span>
        </label>
        <label className="block text-sm font-medium">
          Minutes a day
          <input
            className={`${inputClass} mt-1`}
            type="number"
            inputMode="numeric"
            min={1}
            max={600}
            value={perDay}
            onChange={(e) => setPerDay(e.target.value)}
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3" aria-live="polite">
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="text-2xl font-bold tabular-nums">{duration(result.minutes)}</div>
          <div className="text-xs text-muted-foreground">total reading time</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="text-2xl font-bold tabular-nums">{result.days.toLocaleString("en-US")}</div>
          <div className="text-xs text-muted-foreground">days at {Number(perDay) || 0} min a day</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="text-2xl font-bold tabular-nums">{result.chaptersPerDay < 1 ? result.chaptersPerDay.toFixed(2) : result.chaptersPerDay.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">chapters a day</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="text-base font-bold">{result.finish || `${result.days.toLocaleString("en-US")} days from today`}</div>
          <div className="text-xs text-muted-foreground">finish date if you start today</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        {result.s.label}: {result.words.toLocaleString("en-US")} words and {result.s.chapters.toLocaleString("en-US")} chapters in the{" "}
        {translation === "kjv" ? "King James Version" : "World English Bible"}.
      </p>
    </div>
  );
}
