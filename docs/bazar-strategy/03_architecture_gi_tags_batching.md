# BAZAR STRATEGIC ANALYSIS — PART 3: ARCHITECTURE DECISIONS 4–5

## DECISION 4: GI TAG ACQUISITION STRATEGY

### Nagaland Products with EXISTING GI Tags (Immediately Usable)

| Product | GI Tag Status | BAZAR Leverage |
|---|---|---|
| **Naga Mircha (King Chili)** | ✅ Registered | Hero product. Highest recognition. Use on every marketing asset. |
| **Naga Tree Tomato** | ✅ Registered | Niche, high-value for foodies. Good for preserves/chutneys. |
| **Chakhesang Shawls** | ✅ Registered | Premium textile. ₹3,000–₹15,000 price point. High margin. |
| **Naga Cucumber** | ✅ Registered | Lower margin, but "organic NE produce" positioning works. |

**24 additional products identified for GI application** (handloom + crafts from various tribes). These are IN PIPELINE, not registered. Timeline: 2–4 years minimum.

### Immediate Strategy: Leverage Existing 4 GI Tags Hard

1. **Naga Mircha** → BAZAR's anchor product. Every heritage box includes king chili products. Position as "the world's hottest heritage chili, GI-certified."
2. **Chakhesang Shawls** → highest AOV item. Photography-heavy storytelling. Target Delhi/Bangalore gift market.
3. **Build product bundles around GI-tagged anchors**: "Naga Heritage Box" containing GI-tagged King Chili sauce + non-GI smoked pork + non-GI bamboo shoot pickle. The GI tag on the chili legitimizes the entire box.

### Interim Authenticity for Non-GI Products

**"BAZAR Verified" Authenticity System — launch in 30 days:**

```
3-Layer Verification:

Layer 1: QR Code → Artisan Profile
  - Scan QR on product → opens artisan profile page
  - Photo, village, tribe, craft history
  - "Meet Imna, a 3rd-generation Ao Naga weaver from Ungma village"
  - Production photos/video
  - GPS coordinates of workshop

Layer 2: Physical Seal
  - Custom wax seal or holographic sticker on packaging
  - Unique serial number linked to QR
  - Tamper-evident (broken seal = not authentic)
  - Cost: ₹3–₹5 per seal (holographic sticker from Madurai printers)

Layer 3: Blockchain-Lite Provenance (Phase 2)
  - Each product gets a provenance record on Supabase
  - Artisan → BAZAR QC → Packaging → Shipping → Delivery
  - Not actual blockchain (overkill) — just an immutable audit log
  - Exportable as "Certificate of Authenticity" PDF
```

### Defense Against SE Asian Knockoffs (Post-IMT Highway)

**Without waiting for new GI tags:**

1. **"BAZAR Verified" becomes the quality mark** — build brand trust now so that by 2029 when highway opens, BAZAR certification means something
2. **GI tags on existing products act as legal defense** — GI tag infringement is actionable under India's GI Act, 1999. If SE Asian knockoff "Naga King Chili" enters India, the GI holder can sue.
3. **APEDA NPOP certification for organic products** — organic certification is a technical barrier that cheap knockoffs can't easily replicate
4. **Artisan-linked storytelling** — each BAZAR product has a human face and a village attached. Knockoffs can't fake this at scale.
5. **Lobby (via Agriculture Dept. connection) for faster GI processing for the 24 pipeline products** — government connection is most valuable here

### GI Tag Prioritization for New Applications

If BAZAR does invest in new GI applications, prioritize by revenue potential:

| Product | Revenue Potential | Competition Risk | Priority |
|---|---|---|---|
| Naga Smoked Pork | Very High | Medium (SE Asian smoked meats) | **P0** |
| Ao Naga Shawl / Tsüngkotepsu | High | Low | P1 |
| Naga Axone (Fermented Soybean) | Medium | High (cheaper versions exist) | P1 |
| Naga Bamboo Shoot Pickles | Medium | High | P2 |
| Angami Naga Wood Carving | Low-Medium | Low | P2 |

---

## DECISION 5: SCHEDULED BATCHING ARCHITECTURE

### Batching Algorithm

```
Three-Dimensional Batching:

Dimension 1: TIME WINDOW
  - Orders accumulate in windows: 9am, 12pm, 3pm, 6pm
  - Window closes 30 min before scheduled delivery
  - Example: 12pm batch = all orders placed 9:31am–11:30am

Dimension 2: LOCALITY CLUSTERING  
  - Within each time window, group orders by delivery zone
  - Zones defined by: ward/colony in towns, village for rural
  - Use k-means clustering on delivery coordinates
  - Max cluster radius: 2km urban, 5km semi-urban
  - Min orders per cluster to dispatch: 3 (urban), 2 (semi-urban)

Dimension 3: MINIMUM ORDER THRESHOLD
  - Batch dispatches when ANY condition is met:
    a. Time window closes (guaranteed dispatch)
    b. 8+ orders in a single cluster (early dispatch)
    c. Combined order value > ₹5,000 in a cluster
  - If fewer than minimum orders at window close:
    merge with next window (buyer notified)
```

### Implementation

```javascript
// Simplified batching engine (runs on Supabase Edge Function)

interface Order {
  id: string;
  lat: number;
  lng: number;
  placedAt: Date;
  value: number;
  zone: string;
}

interface Batch {
  id: string;
  window: '9am' | '12pm' | '3pm' | '6pm';
  zone: string;
  orders: Order[];
  dispatchAt: Date;
  runnerId?: string;
}

function createBatches(pendingOrders: Order[], windowEnd: Date): Batch[] {
  // 1. Group by zone
  const zoneGroups = groupBy(pendingOrders, 'zone');
  
  // 2. For each zone, check dispatch conditions
  const batches: Batch[] = [];
  for (const [zone, orders] of Object.entries(zoneGroups)) {
    if (orders.length >= MIN_ORDERS || 
        sumBy(orders, 'value') >= MIN_VALUE ||
        isWindowClosing(windowEnd)) {
      batches.push({
        id: generateBatchId(),
        window: getCurrentWindow(),
        zone,
        orders,
        dispatchAt: windowEnd
      });
    }
  }
  
  // 3. Orphan orders (below threshold) → merge to next window
  // Notify affected buyers
  return batches;
}
```

### Runner Routing (Multi-Drop Optimization)

**Algorithm: VROOM (Vehicle Routing Open-source Optimization Machine)**
- Open source, production-grade
- Uses OSRM (Open Source Routing Machine) as routing backend
- Handles: time windows, vehicle capacity, multi-drop optimization
- Integration via **vroom-express** (Node.js HTTP API wrapper)

```
Architecture:
  BAZAR Backend → vroom-express API → VROOM engine → OSRM
  
  Input: Runner start location + all delivery points in batch
  Output: Optimized route sequence + estimated time per stop
  
  Hosted: Self-hosted OSRM with NE India OSM data
  (OSM coverage of Mokokchung is decent — verify and contribute if gaps)
  
  Fallback: If OSRM lacks road data, use Mapbox Directions API
  (already in BAZAR stack) with simple nearest-neighbor heuristic
```

**For Mokokchung scale (10–30 deliveries/batch):** Even a greedy nearest-neighbor algorithm gets within 15% of optimal. VROOM is optimization for when you hit 50+ drops/batch.

### Buyer UX: Making Scheduled Feel Premium, Not Downgraded

```
UX STRATEGY: Frame as "Smart Delivery" not "Delayed Delivery"

1. AT ORDER PLACEMENT:
   "🕐 Smart Delivery — Your order arrives by 3:00 PM today
    ✅ Consolidated eco-friendly delivery
    ✅ Guaranteed time window (not 'anytime today')
    ✅ ₹10 cheaper than instant delivery"

2. ORDER CONFIRMATION:
   "Your order is batched with 6 other deliveries in your area.
    Runner Imli will deliver between 2:45–3:15 PM.
    Track your batch: [live map link]"

3. 30 MIN BEFORE:
   Push notification: "Imli is 3 stops away! 
   Arriving in ~12 minutes 🛵"

4. POST-DELIVERY:
   "Delivered! You saved ₹10 and reduced 
   carbon emissions by batching 🌿"

KEY INSIGHT: The guarantee of a specific time window is 
BETTER than "arriving in 10–45 minutes" uncertainty of 
on-demand. Position it as reliability, not delay.
```

### Breakeven Math: Scheduled vs On-Demand

```
ON-DEMAND MODEL:
  Runner cost: ₹30/delivery (including idle time)
  Avg deliveries/hour: 2.5
  Runner hourly cost: ₹75 (₹30 × 2.5)
  Revenue per delivery: ₹25 delivery fee
  Revenue/hour: ₹62.50
  LOSS per runner-hour: -₹12.50
  Breakeven: 3+ deliveries/hour consistently

SCHEDULED BATCH MODEL:
  Runner cost: ₹30/delivery (but less idle time)
  Avg deliveries/batch: 6 (in 1.5 hours)
  Runner cost per batch: ₹120 (fixed route pay)
  Cost per delivery: ₹20
  Revenue per delivery: ₹25 delivery fee
  PROFIT per delivery: ₹5
  PROFIT per batch: ₹30
  Breakeven: 4 deliveries/batch (easily hit)

CROSSOVER POINT (when on-demand becomes more profitable):
  On-demand breakeven: 3 deliveries/hour
  = 24 deliveries in 8-hour shift
  = At 4 time windows, that's 6 orders/window/zone
  
  ANSWER: When you consistently get 6+ orders per zone 
  per hour, switch that zone to on-demand.
  
  For Mokokchung (pop 35K, ~2K potential users):
  Expected orders/day at launch: 30–50
  Orders per zone per window: 2–3
  VERDICT: Scheduled batching for 12–18 months minimum.
  
  For Dimapur (pop 150K+):
  Expected orders/day at 6 months: 150–300
  Orders per zone per window: 5–8
  VERDICT: Hybrid — high-density zones go on-demand, 
  periphery stays scheduled.
```

### Interaction with Sumo Syndicate for Inter-District Batches

```
INTER-DISTRICT BATCH FLOW:

1. Orders from Mokokchung for Kohima products accumulate
2. At 10am daily, inter-district batch is cut
3. Batch manifest sent to Sumo Syndicate counter
4. Counter assigns to next Sumo departing for that route
5. Sumo carries consolidated parcel bag (not individual parcels)
6. At destination counter, bag is opened and split
7. Local runner does last-mile delivery from destination counter

TIMING:
  - Mokokchung → Kohima Sumo: ~4 hours
  - 10am cut → 2pm arrival → 3pm batch delivery
  - "Order by 10am, delivered by 3pm" for inter-district

PRICING:
  - Sumo Syndicate seat-rate: ₹200–₹300 per bag
  - Bag holds ~10–15 small parcels
  - Cost per parcel: ₹15–₹25 (Sumo leg only)
  - Total inter-district delivery fee: ₹50–₹80
    (₹20 Sumo + ₹20 last-mile + ₹15 insurance + ₹10 BAZAR margin)
```
