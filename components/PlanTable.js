/* Server-rendered day-by-day plan table, in blocks of 30 days (the first block open) so the text is in the HTML */

import { minutesLabel } from "@/lib/readingPlan";

const BLOCK = 30;

export default function PlanTable({ plan }) {
  const blocks = [];
  for (let i = 0; i < plan.length; i += BLOCK) blocks.push(plan.slice(i, i + BLOCK));
  return (
    <div className="space-y-3">
      {blocks.map((rows, bi) => (
        <details key={bi} open={bi === 0 || blocks.length === 1} className="rounded-xl border bg-card group">
          <summary className="cursor-pointer select-none p-4 font-semibold flex items-center justify-between">
            <span>
              Days {rows[0].day} to {rows[rows.length - 1].day}
            </span>
            <span className="text-sm font-normal text-muted-foreground">{rows[0].ref.split(";")[0]} onward</span>
          </summary>
          <div className="overflow-x-auto border-t">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold">Day</th>
                  <th className="p-3 font-semibold">Reading</th>
                  <th className="p-3 font-semibold text-right">Words</th>
                  <th className="p-3 font-semibold text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.day} className="border-b last:border-0">
                    <td className="p-3 tabular-nums">{d.day}</td>
                    <td className="p-3">{d.ref}</td>
                    <td className="p-3 text-right tabular-nums">{d.words.toLocaleString("en-US")}</td>
                    <td className="p-3 text-right tabular-nums whitespace-nowrap">{minutesLabel(d.minutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ))}
    </div>
  );
}
