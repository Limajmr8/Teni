# BAZAR Implementation Plan — Strategy → Code

## Phase 1: Database Schema Extension (NOW)
New migration: `supabase/migrations/20260501000000_heritage_logistics_credit.sql`

New tables:
- `artisan_profiles` — extends seller_profiles for heritage sellers
- `heritage_products` — GI-tagged, story-driven product listings
- `heritage_collections` — curated gift boxes / bundles
- `sumo_syndicate_counters` — syndicate counter locations & operators
- `lorry_receipts` — digital LR with tracking checkpoints
- `lr_checkpoints` — checkpoint-based parcel tracking
- `parcel_insurance` — insurance records per LR
- `artisan_analytics` — monthly computed credit scoring data
- `artisan_credit_scores` — proprietary BAZAR credit scores

## Phase 2: Heritage Marketplace Web (THIS WEEK)
Route group: `apps/web/src/app/heritage/`

Pages:
- `/heritage` — Heritage Gallery landing page (premium design)
- `/heritage/[slug]` — Individual heritage product with artisan story
- `/heritage/artisan/[id]` — Artisan profile page (QR destination)
- `/heritage/collections` — Curated gift box bundles

## Phase 3: BAZAR Verified QR System
Route: `apps/web/src/app/verify/[code]/page.tsx`

## Phase 4: Sumo Syndicate Digital LR Module
Route group: `apps/web/src/app/logistics/`

## Execution Order
1. Database migration for all new tables
2. Heritage Marketplace pages (premium design)
3. Artisan QR verification page
4. Sumo LR counter dashboard
