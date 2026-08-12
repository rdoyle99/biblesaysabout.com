# GOAL: 200 topics, an email list, first revenue

**Set:** 2026-06-10 · **Status: ACTIVE (portfolio /loop)** · Part of the 5-site portfolio — see `~/codingprojects/PORTFOLIO.md`

Healthiest site in the portfolio: live, fast, real curated content, excellent SEO plumbing. It just has nothing to sell and too few pages. Scale the content surface, build an audience, turn on monetization.

## Success Metric
- **200 topic pages live** (from 42) — same quality bar: real verses, real references
- **100+ email subscribers** (Verse of the Day / topic digests)
- First $ (AdSense or affiliate) once accounts exist — interim: ad slots + affiliate placements built and behind a config flag

## Current State (audited 2026-06-10)
- LIVE at https://www.biblesaysabout.com (Vercel, repo `rdoyle99/biblesaysabout.com`, push = deploy)
- Next.js 15 app router + shadcn. Data: `lib/verses.js` — 42 topics, 1,000+ real verses (NIV/NLT/ESV/etc), 6 categories. All static, `generateStaticParams`
- SEO already strong: sitemap, robots, BreadcrumbList/Article/FAQPage/CollectionPage JSON-LD, good internal linking
- **Zero monetization, zero email capture, no blog.** FAQ sections are templated/generic
- Routes: `/`, `/verses/[topic]` ×42, `/search`, `/favorites`, `/privacy`, `/terms`

## Phase Plan

### Phase 1 — Topic expansion 38 → 200 (the growth lever; real pre-expansion count was 38, not 42)
- [x] Batch 1 (2026-06-10): +15 topics, 258 verses — ALL fetched from bible-api.com (WEB translation, public domain), zero fabricated text. 53 topics / 1,442 verses now. Agent pattern works; repeat.
- [x] Batch 2 (2026-08-12): +20 high-volume topics (relationships, grief, death, mothers, children, encouragement, …) via `scripts/expand-topic.mjs` (OpenBible refs → WEB text). ~73 topics / ~1,880 verses. SEO.md + category hubs + answer-first stats on topic pages.
- [ ] Batch 3-10: ~15-20 topics/week toward 200 (next: demons, idolatry, fear-of-god, hospitality, modesty, persecution, revenge, wealth, widows/orphans, creation, end-times, sleep, waiting, letting-go…)
- [x] Internal links: related topics per page; category hub routes `/topics/[category]`; sitemap includes hubs

### Phase 2 — Email capture ✅ 2026-06-10
- [x] Footer form on every page ("A verse for your week, every week") → `/api/subscribe` → shared `email_subscribers` (source=biblesays); Vercel env set
- [ ] Weekly send mechanism (needs decision; list is collecting meanwhile)
- [ ] Optional gated PDF ("50 verses for anxiety") generated from existing data

### Phase 3 — Monetization (build now, flip on when accounts exist)
- [ ] Ad slot components (after verse grid, mid-list) behind config flag → enable when AdSense approved
- [ ] Affiliate slots: study-bible recommendations per category → enable when Amazon Associates exists

### Phase 4 — Long-form
- [ ] Category hub pages with editorial intros; a few long-form guides targeting informational queries

## Needs Ryan
- AdSense account + approval (loop will prep the site and flag when ready)
- Amazon Associates account (for affiliate links)

## Progress Log
- 2026-08-12: pSEO push. Ahrefs research (KD soft niche; DR7 ranks anxiety #4). SEO.md, expand pipeline, batch 2 (+20 topics), topic page unique stats, category hubs. DR still 0.6 — content surface is the lever.
- 2026-06-10: Audited, GOAL set.
