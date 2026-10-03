/* Build a custom reading plan: pick a section, a number of days and a start date; copy it or print it */

"use client";

import { useEffect, useMemo, useState } from "react";
import { SCOPES, buildPlan, planStats, minutesLabel } from "@/lib/readingPlan";

const PRESETS = [30, 60, 90, 180, 365];

function iso(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function ReadingPlanGenerator() {
  const [scope, setScope] = useState("bible");
  const [days, setDays] = useState(365);
  const [start, setStart] = useState("");
  const [copied, setCopied] = useState(false);
  // the default start date is the reader's today, so it is set after hydration
  useEffect(() => setStart(iso(new Date())), []);

  const plan = useMemo(() => buildPlan(scope, Math.min(Math.max(Number(days) || 1, 1), 1200)), [scope, days]);
  const stats = useMemo(() => planStats(plan), [plan]);
  const dates = useMemo(() => {
    if (!start) return null;
    const [y, m, d] = start.split("-").map(Number);
    return plan.map((_, i) => new Date(y, m - 1, d + i).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }));
  }, [plan, start]);

  const asText = () => plan.map((p, i) => `Day ${p.day}${dates ? ` (${dates[i]})` : ""}: ${p.ref}`).join("\n");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(asText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the table is on the page */
    }
  };

  const inputClass = "w-full rounded-lg border bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  return (
    <div className="rounded-xl border bg-card p-5 md:p-6">
      <div className="grid md:grid-cols-3 gap-4">
        <label className="block text-sm font-medium">
          What to read
          <select className={`${inputClass} mt-1`} value={scope} onChange={(e) => setScope(e.target.value)}>
            {Object.entries(SCOPES).map(([id, s]) => (
              <option key={id} value={id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Days to finish
          <input className={`${inputClass} mt-1`} type="number" min="1" max="1200" inputMode="numeric" value={days} onChange={(e) => setDays(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Start date
          <input className={`${inputClass} mt-1`} type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {PRESETS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setDays(n)}
            className={`rounded-full border px-3 py-1 text-sm ${Number(days) === n ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"}`}
          >
            {n} days
          </button>
        ))}
      </div>

      <p className="mt-5 text-lg font-medium leading-relaxed" aria-live="polite">
        {stats.days} days: about {stats.avgWords.toLocaleString("en-US")} words a day, {minutesLabel(stats.avgMinutes)} of silent reading, {stats.minChapters === stats.maxChapters ? stats.minChapters : `${stats.minChapters} to ${stats.maxChapters}`} chapters a day.
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Lightest day {stats.minWords.toLocaleString("en-US")} words ({stats.lightest.ref}), heaviest {stats.maxWords.toLocaleString("en-US")} ({stats.heaviest.ref}).
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={copy} className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
          {copied ? "Copied" : "Copy plan as text"}
        </button>
        <button type="button" onClick={() => window.print()} className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-muted">
          Print
        </button>
      </div>

      <div className="mt-4 max-h-[28rem] overflow-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 border-b bg-muted">
            <tr>
              <th className="p-2 font-semibold">Day</th>
              <th className="p-2 font-semibold">Date</th>
              <th className="p-2 font-semibold">Reading</th>
              <th className="p-2 font-semibold text-right">Time</th>
            </tr>
          </thead>
          <tbody>
            {plan.map((p, i) => (
              <tr key={p.day} className="border-b last:border-0">
                <td className="p-2 tabular-nums">{p.day}</td>
                <td className="p-2 whitespace-nowrap text-muted-foreground">{dates ? dates[i] : ""}</td>
                <td className="p-2">{p.ref}</td>
                <td className="p-2 text-right tabular-nums whitespace-nowrap">{minutesLabel(p.minutes)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
