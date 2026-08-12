# SEO.md — biblesaysabout.com

**Domain:** https://www.biblesaysabout.com · **DR:** 0.6 (2026-08-12) · **Plan:** Lite Ahrefs  
**Pattern:** pSEO topic pages = `bible verses about {topic}` + `what does the bible say about {topic}`

## Reality check (2026-08-12)

| Metric | Value |
|--------|-------|
| Topics live | 53 → target 200 |
| Verses | ~1,442 real (NIV/NLT/ESV + WEB public domain) |
| Organic visitors YTD (Simple Analytics) | ~445 |
| Money keyword pattern | `bible verses about X` (KD often 0–15) |
| SERP proof | DR 7 site ranks #4 for "bible verses about anxiety" |

This niche is unusually soft on domain authority. List pages with real verse text win. Head terms (love 51k, strength 38k, healing 20k) are winnable long-term; mid/long-tail (grief, mothers, hard times) can move faster.

## Keyword universe formula

```
{bible verses about | what does the bible say about | scripture about | bible verses on | verses for}
×
{topic}
```

Optional modifiers later (do not explode filters): `for anxiety`, `for women`, `short`, `kjv`, `nlt`.

### Unique data moat (every page)

Per topic, surface first-party numbers from our corpus:

1. Verse count on this page  
2. OT vs NT split  
3. Most-cited book on this page  
4. Related topics from same category  

These are the extractable stats AI/Google can quote. Never invent counts.

## Target engines

| Engine | Path |
|--------|------|
| Google | Classic on-page + internal links + sitemap lastmod |
| Bing / ChatGPT | IndexNow on publish; Bing Webmaster when account ready |
| Perplexity | Freshness (refresh lastmod when batch ships); answer-first blocks |
| AI Overviews | Entity coverage in titles/H1; listicle format already matches |

## Publish velocity

- **Max ~25–30 new topic pages / week** (young domain; playbook §4).  
- Batch-generate anytime; ship in weekly waves.  
- Never publish thin siblings of the same cluster in one dump without internal links.

## Page template requirements (ship checklist)

- [ ] Title: `Bible Verses About {Topic} ({N}+ Verses)` (primary money pattern)  
- [ ] H1 matches title intent  
- [ ] Answer-first summary in first paragraph (works quoted alone)  
- [ ] ≥8 real verses with full text (target 15–25)  
- [ ] ≥3 unique data points (count, OT/NT, top book)  
- [ ] Related topics (same category + cross-links)  
- [ ] FAQ with topic-specific answers (not pure template fluff)  
- [ ] SSR: `curl -s URL | grep "unique stat"` works without JS  
- [ ] In sitemap same day; linked from home category + related pages  

## Title strategy (important)

| Pattern | Example volume (US) | Role |
|---------|---------------------|------|
| `bible verses about {x}` | love 51k, strength 38k | **Primary title/H1** |
| `what does the bible say about {x}` | lower volume, more editorial | Description + FAQ H2 |
| `verses for {x}` / `{x} bible verses` | secondary | Keywords array / body |

Old titles led with "What Does the Bible Say About…" — fine as brand, weaker for volume. New + refreshed pages lead with "Bible Verses About…".

## Batch 2 priority (missing pages, Ahrefs 2026-08-12)

| Topic slug | Seed keyword vol | KD | Status |
|------------|------------------|-----|--------|
| relationships | 11,000 | 10 | ship |
| children | 2,800 | 1 | ship |
| death | 2,600 | 4 | ship |
| encouragement | 2,300 | 14 | ship |
| grief | 2,200 | 1 | ship |
| mothers | 1,800 | 0 | ship |
| giving | 1,700 | 4 | ship |
| temptation | 1,300 | 0 | ship |
| baptism | 1,300 | 2 | ship |
| christmas | 1,200 | 1 | ship |
| leadership | 1,200 | 1 | ship |
| repentance | 1,100 | 0 | ship |
| fathers | 1,100 | 1 | ship |
| rest | 1,000 | 0 | ship |
| gods-love | 1,000 | 1 | ship |
| hell | 900 | 0 | ship |
| new-beginnings | 900 | 1 | ship |
| stress | 800 | 10 | ship |
| justice | 800 | 7 | ship |
| hard-times | 700 | 0 | ship |

Est. combined seed volume for batch 2: **~36k+/mo** (plus long-tails per page).

## Already live head terms (protect / thicken)

love 51k · strength 38k · healing 20k · faith 9.3k · anxiety 7k · marriage 5.1k · forgiveness 4.8k · peace 3.7k · hope 3.4k · prayer 2.8k · fear 2.4k · anger 1.8k · money 1.7k · depression 1.6k

Thin pages (<20 verses): expand before chasing new KD-hard heads.

## Architecture

```
/                         hub (SSR preferred long-term; currently client)
/verses/{topic}           pSEO leaf (SSG)
/topics/{category}        category hub (planned)
/search                   utility
/sitemap.xml              all topics + hubs
```

Internal links: home → category → topic; topic → related topics; every new page linked the day it ships.

## Data pipeline

```
scripts/expand-topic.mjs
  → OpenBible topic refs (community votes = ranking signal for relevance)
  → bible-api.com WEB (public domain text)
  → seo/batch-raw/{slug}.json
  → merge into lib/verses.js + topicMetadata
```

**Never fabricate verse text.** WEB only for new batches unless a licensed translation is added later.

## Share-of-voice prompt set (weekly, 10 prompts)

1. bible verses about anxiety  
2. bible verses about love  
3. bible verses about strength  
4. bible verses for grief  
5. what does the bible say about tattoos  
6. bible verses about friendship  
7. bible verses about death  
8. bible verses about mothers  
9. encouraging bible verses for hard times  
10. bible verses about healing  

Re-check Google + ChatGPT + Perplexity. Log first citation date in progress log.

## Links / authority (later, not day-1)

- Free profiles + sameAs on About (when About exists)  
- One data study/quarter once we have enough structure (e.g. "most shared verses by topic from our corpus")  
- YouTube: verse-of-the-day clips (strongest AI mention signal) — Ryan gate  
- No bought links, no guest-post markets, no parasite SEO  

## Monetization hooks (SEO-neutral)

- Email capture already in footer  
- Ad slots behind config flag after AdSense  
- Affiliate study-Bible slots per category  

## Ops

- GSC property: confirm www + non-www coverage  
- Bing Webmaster + IndexNow key  
- Simple Analytics live  
- Ahrefs units: check before bulk keyword pulls  

## Progress log

- 2026-08-12: SEO.md created; Ahrefs seed research; expand-topic pipeline; batch 2 shipped (+20 topics → 73 total / 1,882 verses); category hubs; answer-first stats on topic pages; build green (91 routes).
- 2026-08-12 (pm): Batch 3 (+20) → **93 topics / 3,004 verses**. Thickened all thin pages (0 under 20 verses). Full retitle to `Bible Verses About X`. Sitemap auto-includes all topics + 6 category hubs.
