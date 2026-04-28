# BAZAR — Deferred / Future Features

This document tracks features that are intentionally deferred from the initial launch (Mokokchung v1). These should be revisited after validating core commerce loops.

---

## 🗓️ Wednesday Market Mode
- **Description**: Special surge/promotion mode every Wednesday inspired by Mokokchung's traditional Wednesday market. Shows a special banner, highlights local sellers, and potentially offers reduced delivery fees.
- **Why deferred**: Needs A/B testing framework and seller coordination before launch.
- **Implementation hint**: Use `isWednesdayMarketActive()` util already in `packages/shared`. Add config toggle `wednesday_market_enabled` in `config` table.

---

## 🌍 Multi-Town Expansion
- **Description**: Expand to other Nagaland towns (Kohima, Dimapur, Tuensang, Mon). Each town gets its own dark store, subdomain, and config.
- **Why deferred**: Operational complexity. Get Mokokchung right first.
- **Implementation hint**: `towns` table and `town_id` FK on all entities already supports multi-town. Add subdomain routing in Next.js middleware.

---

## 🗺️ Seller Delivery Zone Polygon
- **Description**: Let sellers draw a custom polygon on a map to define their delivery area, instead of just a radius.
- **Why deferred**: Complex UX; radius is good enough for v1.
- **Implementation hint**: `delivery_zone_polygon JSONB` column already in `seller_profiles`.

---

## 💬 In-App Chat (Buyer ↔ Seller)
- **Description**: Real-time chat between buyer and seller for order clarifications, availability queries.
- **Why deferred**: WhatsApp deep link is sufficient for v1.
- **Implementation hint**: Use Supabase Realtime channels. Add `chats` and `messages` tables.

---

## 🎙️ Voice Search in Local Languages
- **Description**: Search in Ao Naga or other local languages via voice input.
- **Why deferred**: Requires custom speech model or significant tuning of off-the-shelf.

---

## 📦 Subscription Box (Weekly Hamper)
- **Description**: Curated weekly grocery/local-product hampers that auto-order on a schedule.
- **Why deferred**: Requires recurring payment logic (Razorpay subscriptions).

---

## 🏆 Gamification / Seller Leaderboard
- **Description**: Public leaderboard of top-rated sellers, top buyers (by referrals), runner rankings.
- **Why deferred**: Data needed to make it meaningful.

---

## 🚚 Runner Batching (Multi-Drop)
- **Description**: Assign a runner multiple delivery orders in an optimized route.
- **Why deferred**: Requires route optimization (OSRM or Mapbox Directions Matrix API).

---

## 📊 Seller Analytics Dashboard
- **Description**: Revenue trends, best-selling products, buyer locality heatmap for sellers.
- **Why deferred**: Needs meaningful order volume first.

---

## 🔔 Push Notifications (FCM/APNs)
- **Description**: Native push notifications for order updates, story views, punch card rewards.
- **Why deferred**: Need to set up FCM project and APNs certificates. Currently using in-app + WhatsApp.

---

## 🌐 Progressive Web App (PWA)
- **Description**: Full offline support, install prompt, background sync.
- **Why deferred**: Basic PWA headers in place, full offline needs service worker strategy.

---

## 🧾 GST Invoice Generation
- **Description**: Auto-generate GST-compliant invoices for B2B sellers.
- **Why deferred**: Tax compliance varies; needs legal review for Nagaland.

---

## 🏘️ Town Ambassador Portal
- **Description**: Dedicated portal for town ambassadors to track referrals, earnings, and generate invite links.
- **Why deferred**: `town_ambassadors` table and commission rate already modeled. Needs frontend build.

---

## 🤝 Seller Co-op / Group Orders
- **Description**: Multiple buyers in a locality pool together to hit a seller's minimum order threshold.
- **Why deferred**: Novel UX; needs community testing.

---

## 🖨️ Warehouse Label Printing
- **Description**: Print QR-code labels for packed orders directly from the warehouse app.
- **Why deferred**: Needs printer hardware integration (ESC/POS or web printing API).

---

_Last updated: 2025_
