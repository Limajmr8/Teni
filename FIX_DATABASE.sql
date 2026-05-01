-- ============================================
-- BAZAR DATABASE FIX — Run this in Supabase SQL Editor
-- Go to: https://supabase.com/dashboard/project/ngjxwtmysvsqzrpmhnfi/sql/new
-- Paste this entire file and click RUN
-- ============================================

-- 1. Fix seller_profiles to match app expectations
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS store_slug TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS village_origin TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'starter';
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS town_id UUID;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS user_id UUID;

-- 2. Fix sub_orders — add subtotal alias and missing columns
ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS subtotal BIGINT;
ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS commission_amount BIGINT DEFAULT 0;
ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS runner_id UUID;
ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS batch_id UUID;
ALTER TABLE sub_orders ADD COLUMN IF NOT EXISTS town_id UUID;

-- Copy existing 'amount' values to 'subtotal' where subtotal is null
UPDATE sub_orders SET subtotal = amount WHERE subtotal IS NULL AND amount IS NOT NULL;

-- 3. Fix parent_orders 
ALTER TABLE parent_orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE parent_orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- 4. Create lorry_receipts table (Sumo Logistics)
CREATE TABLE IF NOT EXISTS lorry_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lr_number TEXT NOT NULL UNIQUE,
    sender_name TEXT NOT NULL,
    sender_phone TEXT,
    receiver_name TEXT NOT NULL,
    receiver_phone TEXT,
    origin_district TEXT DEFAULT 'Mokokchung',
    destination_district TEXT NOT NULL,
    parcel_description TEXT,
    parcel_size TEXT DEFAULT 'small',
    total_fee BIGINT DEFAULT 0,
    declared_value BIGINT,
    vehicle_number TEXT,
    driver_name TEXT,
    status TEXT DEFAULT 'created',
    created_offline BOOLEAN DEFAULT false,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create lr_checkpoints table
CREATE TABLE IF NOT EXISTS lr_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lr_id UUID REFERENCES lorry_receipts(id) ON DELETE CASCADE,
    checkpoint_type TEXT NOT NULL,
    location_name TEXT,
    reported_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create parcel_insurance table
CREATE TABLE IF NOT EXISTS parcel_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lr_id UUID REFERENCES lorry_receipts(id) ON DELETE CASCADE,
    insured_value BIGINT,
    premium_amount BIGINT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Seed product categories if empty
INSERT INTO product_categories (name) 
SELECT name FROM (VALUES ('Smoked Meats'), ('Pickles'), ('Bakery'), ('Handicrafts'), ('Fresh Produce')) AS t(name)
WHERE NOT EXISTS (SELECT 1 FROM product_categories LIMIT 1);

-- 8. Disable RLS on all tables for demo
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE sub_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE parent_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE skus DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE lorry_receipts DISABLE ROW LEVEL SECURITY;
ALTER TABLE lr_checkpoints DISABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_insurance DISABLE ROW LEVEL SECURITY;

-- Done! All tables should now match what the BAZAR app expects.
