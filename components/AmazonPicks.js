/* A short row of Amazon links for going deeper (study Bibles, commentaries, devotionals). Server-rendered. */

import { amazonSearch, AMAZON_TAG, AMAZON_DISCLOSURE } from "@/lib/affiliate";

export default function AmazonPicks({ title, items }) {
  return (
    <section className="py-10 md:py-12 border-t">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-bold mb-4">{title}</h2>
        <ul className="grid sm:grid-cols-3 gap-3">
          {items.map((item) => (
            <li key={item.query}>
              <a
                href={amazonSearch(item.query)}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="block h-full rounded-xl border bg-card p-4 hover:border-primary/50 hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="font-medium">{item.label}</span>
                {item.note ? <span className="block text-sm text-muted-foreground mt-1">{item.note}</span> : null}
                <span className="block text-xs text-muted-foreground mt-2">On Amazon</span>
              </a>
            </li>
          ))}
        </ul>
        {AMAZON_TAG ? <p className="mt-3 text-xs text-muted-foreground">{AMAZON_DISCLOSURE}</p> : null}
      </div>
    </section>
  );
}
