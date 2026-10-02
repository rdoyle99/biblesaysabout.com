/* Server-rendered building blocks for the Bible-by-the-numbers pages: no client JS */

import Link from "next/link";

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6">
      {items.map((item, i) => (
        <span key={item.name} className="flex items-center gap-2">
          {i > 0 ? <span>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-foreground">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function StatTiles({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border bg-card p-4">
          <div className="text-2xl md:text-3xl font-bold tabular-nums">{s.value}</div>
          <div className="text-sm font-medium mt-1">{s.label}</div>
          {s.note ? <div className="text-xs text-muted-foreground mt-1">{s.note}</div> : null}
        </div>
      ))}
    </div>
  );
}

/** rows: [{ label, value, href?, display? }] drawn as horizontal bars scaled to the largest value */
export function BarRows({ rows, unit = "", labelWidth = "w-36" }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <div className={`${labelWidth} shrink-0 truncate`}>
            {r.href ? (
              <Link href={r.href} className="hover:text-primary hover:underline underline-offset-2">
                {r.label}
              </Link>
            ) : (
              r.label
            )}
          </div>
          <div className="flex-1 h-4 rounded bg-muted overflow-hidden">
            <div className="h-full rounded bg-primary/70" style={{ width: `${Math.max(1, (r.value / max) * 100)}%` }} />
          </div>
          <div className="w-20 shrink-0 text-right tabular-nums text-muted-foreground">
            {r.display ?? r.value.toLocaleString("en-US")}
            {unit}
          </div>
        </div>
      ))}
    </div>
  );
}

export function VerseQuote({ reference, text, translation }) {
  return (
    <blockquote className="rounded-xl border border-l-4 border-l-primary/60 bg-card p-4">
      <p className="leading-relaxed">{text}</p>
      <footer className="mt-2 text-sm text-muted-foreground">
        {reference}
        {translation ? ` (${translation})` : ""}
      </footer>
    </blockquote>
  );
}

export function FaqSection({ title, faqs }) {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-semibold mb-2">{f.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Section({ id, title, intro, muted, children }) {
  return (
    <section id={id} className={muted ? "py-10 md:py-14 bg-muted/30" : "py-10 md:py-14"}>
      <div className="max-w-4xl mx-auto px-4">
        {title ? <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2> : null}
        {intro ? <p className="text-muted-foreground mb-6 leading-relaxed">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function MethodNote({ text, date }) {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      {text} Data compiled {date}.
    </p>
  );
}
