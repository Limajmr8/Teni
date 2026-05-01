-- BAZAR Regional Operating System — Schema Extension
-- Heritage Marketplace + Sumo Syndicate Logistics + Artisan Credit Loop
-- Migration: 20260501000000

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE lr_status AS ENUM (
    'created',
    'in_transit',
    'at_checkpoint',
    'arrived',
    'delivered',
    'claimed',       -- insurance claim filed
    'lost'
);

CREATE TYPE parcel_size AS ENUM (
    'small',         -- < 2kg
    'medium',        -- 2-5kg
    'large'          -- 5-10kg
);

CREATE TYPE insurance_status AS ENUM (
    'active',
    'claim_filed',
    'claim_approved',
    'claim_rejected',
    'claim_paid',
    'expired'
);

CREATE TYPE heritage_product_status AS ENUM (
    'draft',
    'pending_review',
    'active',
    'sold_out',
    'archived'
);

CREATE TYPE gi_tag_status AS ENUM (
    'registered',       -- officially GI-tagged
    'bazar_verified',   -- BAZAR's own verification
    'pending_gi'        -- GI application in progress
);

-- ============================================================
-- LAYER 1: HERITAGE MARKETPLACE
-- ============================================================

-- Artisan profiles (extends sellers for heritage/craft sellers)
CREATE TABLE artisan_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    -- Identity
    artisan_name TEXT NOT NULL,
    tribe TEXT,
    village TEXT NOT NULL,
    district TEXT DEFAULT 'Mokokchung',
    craft_type TEXT NOT NULL,           -- e.g., 'Weaving', 'Smoking/Curing', 'Woodcarving'
    craft_specialization TEXT,           -- e.g., 'Ao Naga Warrior Shawl'
    bio TEXT,
    story TEXT,                          -- long-form "Meet the Artisan" narrative
    -- Media
    portrait_url TEXT,                   -- editorial portrait photo
    workshop_photos TEXT[],              -- Cloudinary URLs of workshop
    workshop_video_url TEXT,             -- optional video tour
    -- Location (for provenance verification)
    workshop_lat DECIMAL(10, 7),
    workshop_lng DECIMAL(10, 7),
    -- Government scheme linkage
    pm_vishwakarma_id TEXT,              -- PM Vishwakarma registration ID
    pm_vishwakarma_status TEXT,          -- 'registered', 'trained', 'toolkit_received', 'loan_disbursed'
    fssai_license_number TEXT,           -- for food artisans
    -- Verification
    is_bazar_verified BOOLEAN DEFAULT false,
    verified_at TIMESTAMPTZ,
    verified_by UUID REFERENCES users(id),
    verification_notes TEXT,
    -- Banking
    bank_account_linked BOOLEAN DEFAULT false,
    upi_id TEXT,
    -- Metrics (auto-computed, updated periodically)
    total_products_sold INTEGER DEFAULT 0,
    total_revenue BIGINT DEFAULT 0,        -- paise
    avg_rating DECIMAL(3, 2) DEFAULT 0,
    repeat_buyer_rate DECIMAL(5, 2) DEFAULT 0,
    months_active INTEGER DEFAULT 0,
    -- Timestamps
    onboarded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heritage products (premium, story-driven listings)
CREATE TABLE heritage_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE CASCADE,
    -- Product info
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,               -- rich editorial content
    craft_story TEXT,                     -- "How this product is made" narrative
    -- Categorization
    category TEXT NOT NULL,              -- 'Textiles', 'Smoked Meats', 'Preserves', 'Woodcraft', 'Bamboo'
    subcategory TEXT,
    -- Pricing (paise)
    artisan_price BIGINT NOT NULL,       -- what BAZAR pays the artisan
    selling_price BIGINT NOT NULL,       -- what customer pays
    compare_at_price BIGINT,             -- strikethrough price for perceived value
    -- Inventory
    stock_quantity INTEGER DEFAULT 0,
    is_made_to_order BOOLEAN DEFAULT false,
    lead_time_days INTEGER DEFAULT 0,
    -- GI & Certification
    gi_tag_status gi_tag_status DEFAULT 'bazar_verified',
    gi_tag_name TEXT,                    -- e.g., 'Naga Mircha', 'Chakhesang Shawls'
    gi_tag_number TEXT,                  -- official GI registration number
    is_organic BOOLEAN DEFAULT false,
    organic_certification TEXT,           -- 'NPOP', 'PGS-India', etc.
    fssai_compliant BOOLEAN DEFAULT false,
    -- Media
    images TEXT[] NOT NULL,              -- editorial photography, Cloudinary URLs
    video_url TEXT,                       -- product video
    thumbnail_url TEXT,
    -- Provenance
    origin_village TEXT,
    origin_district TEXT,
    raw_materials TEXT,                   -- "Locally sourced Mithun wool from Ungma village"
    production_method TEXT,              -- "Hand-woven on traditional loin loom over 3 weeks"
    -- Shipping
    weight_grams INTEGER,
    requires_cold_chain BOOLEAN DEFAULT false,
    shelf_life_days INTEGER,             -- for food products
    packaging_type TEXT,                  -- 'vacuum_sealed', 'gift_box', 'standard'
    -- Status
    status heritage_product_status DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT false,
    -- SEO
    meta_title TEXT,
    meta_description TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Heritage collections / gift boxes
CREATE TABLE heritage_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    story TEXT,                          -- "The Naga Heritage Box" editorial
    -- Pricing (paise)
    selling_price BIGINT NOT NULL,
    compare_at_price BIGINT,
    -- Media
    images TEXT[],
    thumbnail_url TEXT,
    -- Contents
    product_ids UUID[],                  -- references heritage_products
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BAZAR Verified verification records (provenance audit trail)
CREATE TABLE verification_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- What's being verified
    heritage_product_id UUID REFERENCES heritage_products(id),
    artisan_id UUID REFERENCES artisan_profiles(id),
    -- Verification details
    verification_code TEXT UNIQUE NOT NULL,   -- QR code value
    serial_number TEXT UNIQUE NOT NULL,       -- physical seal serial
    -- Provenance chain
    artisan_confirmed_at TIMESTAMPTZ,
    qc_passed_at TIMESTAMPTZ,
    qc_notes TEXT,
    packaged_at TIMESTAMPTZ,
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    -- Metadata
    qr_scans INTEGER DEFAULT 0,
    last_scanned_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LAYER 2: SUMO SYNDICATE LOGISTICS
-- ============================================================

-- Syndicate counters (the gatekeepers)
CREATE TABLE sumo_syndicate_counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Location
    name TEXT NOT NULL,                  -- "Mokokchung Main Counter"
    district TEXT NOT NULL,
    town TEXT NOT NULL,
    address TEXT,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    -- Operator
    operator_name TEXT NOT NULL,
    operator_phone TEXT NOT NULL,
    operator_user_id UUID REFERENCES users(id),
    -- Commercial
    revenue_share_pct DECIMAL(5, 2) DEFAULT 30.00,  -- generous launch rate
    has_thermal_printer BOOLEAN DEFAULT false,
    has_bank_account BOOLEAN DEFAULT false,
    upi_id TEXT,
    paytm_number TEXT,
    -- Routes served
    routes_served TEXT[],                -- e.g., ['Kohima', 'Dimapur', 'Zunheboto']
    -- Status
    is_active BOOLEAN DEFAULT true,
    onboarded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Digital Lorry Receipts
CREATE TABLE lorry_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- LR Identity
    lr_number TEXT UNIQUE NOT NULL,      -- e.g., 'MKG-24A7-3F'
    qr_code_data TEXT,                   -- encoded QR data
    -- Route
    origin_counter_id UUID REFERENCES sumo_syndicate_counters(id),
    destination_district TEXT NOT NULL,
    destination_town TEXT,
    -- Sender
    sender_name TEXT NOT NULL,
    sender_phone TEXT NOT NULL,
    -- Receiver
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT NOT NULL,
    -- Parcel
    parcel_description TEXT,
    parcel_size parcel_size DEFAULT 'small',
    declared_value BIGINT,               -- paise, for insurance
    parcel_photo_url TEXT,
    weight_kg DECIMAL(5, 2),
    -- Driver
    driver_name TEXT,
    driver_phone TEXT,
    vehicle_number TEXT,
    -- Financials (paise)
    total_fee BIGINT NOT NULL,
    driver_share BIGINT,
    counter_share BIGINT,
    bazar_share BIGINT,
    insurance_share BIGINT,
    payment_method TEXT DEFAULT 'cash',   -- 'cash', 'upi', 'wallet'
    -- Status
    status lr_status DEFAULT 'created',
    estimated_delivery TIMESTAMPTZ,
    actual_delivery TIMESTAMPTZ,
    -- Linked order (if from BAZAR marketplace)
    parent_order_id UUID REFERENCES parent_orders(id),
    -- Offline sync
    created_offline BOOLEAN DEFAULT false,
    synced_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Checkpoint-based tracking
CREATE TABLE lr_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lr_id UUID REFERENCES lorry_receipts(id) ON DELETE CASCADE,
    -- Checkpoint info
    checkpoint_type TEXT NOT NULL,        -- 'origin', 'fuel_stop', 'midpoint', 'destination', 'delivered'
    location_name TEXT,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    -- Who reported
    reported_by TEXT,                     -- 'counter', 'driver', 'receiver', 'system'
    reported_by_phone TEXT,
    -- Status
    notes TEXT,
    photo_url TEXT,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parcel insurance records
CREATE TABLE parcel_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lr_id UUID REFERENCES lorry_receipts(id) ON DELETE CASCADE,
    -- Policy
    policy_reference TEXT,               -- ICICI Lombard Open Cover reference
    insured_value BIGINT NOT NULL,       -- paise
    premium_amount BIGINT NOT NULL,      -- paise
    -- Coverage
    coverage_start TIMESTAMPTZ DEFAULT NOW(),
    coverage_end TIMESTAMPTZ,
    -- Claim
    status insurance_status DEFAULT 'active',
    claim_filed_at TIMESTAMPTZ,
    claim_reason TEXT,
    claim_evidence_urls TEXT[],          -- photos of damage
    claim_amount BIGINT,
    claim_payout_amount BIGINT,
    claim_resolved_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LAYER 3: ARTISAN CREDIT LOOP (FINTECH DATA MODEL)
-- ============================================================

-- Monthly artisan analytics (computed by Edge Function)
CREATE TABLE artisan_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE CASCADE,
    -- Period
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    -- Revenue metrics
    total_revenue BIGINT DEFAULT 0,      -- paise
    total_orders INTEGER DEFAULT 0,
    avg_order_value BIGINT DEFAULT 0,    -- paise
    -- Customer metrics
    unique_buyers INTEGER DEFAULT 0,
    repeat_buyer_rate DECIMAL(5, 2) DEFAULT 0,
    -- Inventory metrics
    inventory_turnover_days DECIMAL(5, 1),
    products_listed INTEGER DEFAULT 0,
    -- Growth
    revenue_growth_pct DECIMAL(5, 2),    -- vs previous month
    -- Computed
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(artisan_id, month, year)
);

-- BAZAR Credit Score (proprietary scoring for NBFC partners)
CREATE TABLE artisan_credit_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artisan_id UUID REFERENCES artisan_profiles(id) ON DELETE CASCADE,
    -- Scores (0-100)
    bazar_score INTEGER CHECK (bazar_score BETWEEN 0 AND 100),
    revenue_consistency_score INTEGER CHECK (revenue_consistency_score BETWEEN 0 AND 100),
    delivery_reliability_score INTEGER CHECK (delivery_reliability_score BETWEEN 0 AND 100),
    buyer_satisfaction_score INTEGER CHECK (buyer_satisfaction_score BETWEEN 0 AND 100),
    inventory_efficiency_score INTEGER CHECK (inventory_efficiency_score BETWEEN 0 AND 100),
    -- Context
    months_active INTEGER DEFAULT 0,
    total_gmv BIGINT DEFAULT 0,          -- lifetime GMV in paise
    -- Timestamps
    score_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCHEDULED BATCHING (LAYER 3)
-- ============================================================

CREATE TYPE batch_status AS ENUM (
    'accumulating',
    'ready',
    'dispatched',
    'completed',
    'cancelled'
);

CREATE TABLE delivery_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    town_id UUID REFERENCES towns(id),
    -- Window
    delivery_window TEXT NOT NULL,        -- '9am', '12pm', '3pm', '6pm'
    window_date DATE DEFAULT CURRENT_DATE,
    -- Zone
    zone_name TEXT NOT NULL,
    zone_center_lat DECIMAL(10, 7),
    zone_center_lng DECIMAL(10, 7),
    zone_radius_km DECIMAL(5, 2) DEFAULT 2.0,
    -- Batch info
    order_count INTEGER DEFAULT 0,
    total_value BIGINT DEFAULT 0,        -- paise
    -- Runner
    runner_id UUID REFERENCES users(id),
    runner_payout BIGINT,                -- paise
    -- Routing (from VROOM/OSRM)
    optimized_route JSONB,               -- ordered list of stops with ETAs
    estimated_duration_min INTEGER,
    actual_duration_min INTEGER,
    -- Status
    status batch_status DEFAULT 'accumulating',
    dispatched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link sub_orders to batches
ALTER TABLE sub_orders ADD COLUMN batch_id UUID REFERENCES delivery_batches(id);
ALTER TABLE sub_orders ADD COLUMN scheduled_window TEXT;   -- '9am', '12pm', '3pm', '6pm'

-- ============================================================
-- PRODUCT CATEGORIES (Heritage-specific)
-- ============================================================

INSERT INTO product_categories (name, image_url) VALUES 
('Heritage Textiles', NULL),
('Smoked & Cured Meats', NULL),
('Preserves & Pickles', NULL),
('Bamboo & Woodcraft', NULL),
('King Chili Products', NULL),
('Gift Collections', NULL)
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE artisan_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verified artisans" ON artisan_profiles 
    FOR SELECT USING (is_bazar_verified = true);
CREATE POLICY "Artisans can update their own profile" ON artisan_profiles 
    FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE heritage_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active heritage products" ON heritage_products 
    FOR SELECT USING (status = 'active');
CREATE POLICY "Artisans can manage their products" ON heritage_products 
    FOR ALL USING (
        artisan_id IN (SELECT id FROM artisan_profiles WHERE user_id = auth.uid())
    );

ALTER TABLE heritage_collections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active collections" ON heritage_collections 
    FOR SELECT USING (is_active = true);

ALTER TABLE verification_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view verification records" ON verification_records 
    FOR SELECT USING (true);

ALTER TABLE lorry_receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Senders can view their LRs" ON lorry_receipts 
    FOR SELECT USING (sender_phone IN (SELECT phone FROM users WHERE id = auth.uid()));
CREATE POLICY "Receivers can view their LRs" ON lorry_receipts 
    FOR SELECT USING (receiver_phone IN (SELECT phone FROM users WHERE id = auth.uid()));

ALTER TABLE lr_checkpoints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view checkpoints for their LRs" ON lr_checkpoints 
    FOR SELECT USING (
        lr_id IN (SELECT id FROM lorry_receipts WHERE 
            sender_phone IN (SELECT phone FROM users WHERE id = auth.uid()) OR
            receiver_phone IN (SELECT phone FROM users WHERE id = auth.uid())
        )
    );

ALTER TABLE delivery_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Runners can view their batches" ON delivery_batches 
    FOR SELECT USING (runner_id = auth.uid());

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_heritage_products_category ON heritage_products(category);
CREATE INDEX idx_heritage_products_status ON heritage_products(status);
CREATE INDEX idx_heritage_products_artisan ON heritage_products(artisan_id);
CREATE INDEX idx_heritage_products_slug ON heritage_products(slug);
CREATE INDEX idx_heritage_products_gi ON heritage_products(gi_tag_status);
CREATE INDEX idx_lorry_receipts_lr_number ON lorry_receipts(lr_number);
CREATE INDEX idx_lorry_receipts_status ON lorry_receipts(status);
CREATE INDEX idx_lorry_receipts_sender ON lorry_receipts(sender_phone);
CREATE INDEX idx_lorry_receipts_receiver ON lorry_receipts(receiver_phone);
CREATE INDEX idx_lr_checkpoints_lr ON lr_checkpoints(lr_id);
CREATE INDEX idx_artisan_analytics_artisan ON artisan_analytics(artisan_id, year, month);
CREATE INDEX idx_delivery_batches_window ON delivery_batches(town_id, window_date, delivery_window);
CREATE INDEX idx_verification_records_code ON verification_records(verification_code);
