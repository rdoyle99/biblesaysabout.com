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

### Phase 1 — Topic expansion 42 → 200 (the growth lever)
- [ ] Build target list of ~160 new "what does the bible say about X" topics from search-demand patterns (debt, tattoos, dreams, divorce, fasting, anger, jealousy, hard work, rest, alcohol, …)
- [ ] Expand `lib/verses.js` in batches (~20/iteration): REAL verses with correct references only — verify references against the actual bible text; no fabricated quotes, cite translation. Unique intro + unique FAQs per topic
- [ ] Internal links: related topics per page, category hubs updated; sitemap picks them up automatically

### Phase 2 — Email capture
- [ ] "Daily verse in your inbox" form (homepage + topic pages) → API route → Supabase (shared `email_subscribers` w/ `source` column) — no vendor account needed
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
- 2026-06-10: Audited, GOAL set.
