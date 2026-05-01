-- BAZAR Hyperlocal Commerce Schema
-- Database: Supabase (PostgreSQL)

-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- TYPES & ENUMS
CREATE TYPE order_status AS ENUM (
    'pending', 
    'accepted', 
    'picking', 
    'packed', 
    'out_for_delivery', 
    'delivered', 
    'cancelled', 
    'refunded'
);

CREATE TYPE fulfillment_model AS ENUM (
    'self_delivery', 
    'bazar_runner', 
    'pickup_only'
);

CREATE TYPE seller_plan AS ENUM (
    'starter', 
    'pro'
);

-- TABLES

-- 1. TOWNS
CREATE TABLE towns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    coordinates GEOGRAPHY(POINT) NOT NULL,
    delivery_polygon GEOGRAPHY(POLYGON),
    operating_hours JSONB DEFAULT '{"start": "08:00", "end": "20:00"}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONFIG
CREATE TABLE config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    town_id UUID REFERENCES towns(id) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(town_id, key)
);

-- 3. USERS (Extending auth.users via triggers/profiles)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT NOT NULL UNIQUE, -- E.164 format
    full_name TEXT,
    avatar_url TEXT,
    roles TEXT[] DEFAULT '{buyer}', -- buyer, seller, runner, warehouse_staff, admin
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES
CREATE TABLE buyer_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    default_address JSONB, -- {name, phone, line1, locality, landmark, lat, lng}
    bazar_credits BIGINT DEFAULT 0, -- paise
    last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    town_id UUID REFERENCES towns(id),
    store_name TEXT NOT NULL,
    store_slug TEXT UNIQUE NOT NULL,
    bio TEXT,
    village_origin TEXT,
    locality TEXT,
    whatsapp_number TEXT,
    upi_id TEXT,
    is_approved BOOLEAN DEFAULT false,
    plan seller_plan DEFAULT 'starter',
    subscription_expires_at TIMESTAMPTZ,
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE runner_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    town_id UUID REFERENCES towns(id),
    is_online BOOLEAN DEFAULT false,
    vehicle_type TEXT,
    current_location GEOGRAPHY(POINT),
    last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warehouse_staff (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    town_id UUID REFERENCES towns(id),
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE town_ambassadors (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    town_id UUID REFERENCES towns(id),
    commission_rate_bps INTEGER DEFAULT 100, -- Basis points
    total_earned BIGINT DEFAULT 0
);

-- 5. DARK STORE (WAREHOUSE)
CREATE TABLE skus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    town_id UUID REFERENCES towns(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    unit TEXT NOT NULL, -- e.g., '1kg', '500ml', '12 pieces'
    purchase_price BIGINT NOT NULL, -- REVENUE STREAM: Dark store margin (cost)
    selling_price BIGINT NOT NULL, -- REVENUE STREAM: Dark store margin (sale)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory (
    sku_id UUID PRIMARY KEY REFERENCES skus(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    shelf_code TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    town_id UUID REFERENCES towns(id),
    staff_id UUID REFERENCES users(id),
    supplier_name TEXT,
    total_amount BIGINT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MARKETPLACE
CREATE TABLE product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    image_url TEXT
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES product_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price BIGINT NOT NULL, -- paise
    unit TEXT,
    images TEXT[], -- Cloudinary URLs
    village_origin TEXT,
    story TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_made_to_order BOOLEAN DEFAULT false,
    lead_time_hours INTEGER DEFAULT 0,
    fulfillment_model fulfillment_model DEFAULT 'bazar_runner',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT DEFAULT 'image',
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE parent_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id),
    town_id UUID REFERENCES towns(id),
    total_amount BIGINT NOT NULL, -- total paise
    delivery_fee BIGINT DEFAULT 0, -- REVENUE STREAM: Delivery fee
    delivery_address JSONB NOT NULL,
    payment_id TEXT, -- Razorpay Payment ID
    payment_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sub_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES parent_orders(id) ON DELETE CASCADE,
    source TEXT NOT NULL, -- 'dark_store' or 'seller'
    seller_id UUID REFERENCES users(id), -- NULL if dark_store
    items JSONB NOT NULL, -- [{id, name, quantity, price, type}]
    subtotal BIGINT NOT NULL,
    commission_amount BIGINT DEFAULT 0, -- REVENUE STREAM: Marketplace commission (6%)
    status order_status DEFAULT 'pending',
    runner_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID REFERENCES sub_orders(id) ON DELETE CASCADE,
    status order_status NOT NULL,
    changed_by UUID REFERENCES users(id),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. LOGS & ENGAGEMENT
CREATE TABLE runner_location_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    runner_id UUID REFERENCES users(id) ON DELETE CASCADE,
    location GEOGRAPHY(POINT) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sub_order_id UUID REFERENCES sub_orders(id),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id), -- NULL if dark store
    rating_quality INTEGER CHECK (rating_quality BETWEEN 1 AND 5),
    rating_freshness INTEGER CHECK (rating_freshness BETWEEN 1 AND 5),
    rating_packaging INTEGER CHECK (rating_packaging BETWEEN 1 AND 5),
    rating_communication INTEGER CHECK (rating_communication BETWEEN 1 AND 5),
    comment TEXT,
    locality TEXT, -- From buyer profile
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE punch_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES users(id),
    seller_id UUID REFERENCES users(id),
    count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE referral_codes (
    code TEXT PRIMARY KEY,
    owner_id UUID REFERENCES users(id),
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE featured_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id),
    town_id UUID REFERENCES towns(id),
    type TEXT, -- 'category_pin', 'home_banner'
    starts_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true, -- REVENUE STREAM: Featured listings
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS & COMMS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    data JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

ALTER TABLE buyer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their own profile" ON buyer_profiles FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view seller profiles" ON seller_profiles FOR SELECT USING (true);
CREATE POLICY "Sellers can update their own profile" ON seller_profiles FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Sellers can manage their own products" ON products FOR ALL USING (auth.uid() = seller_id);

ALTER TABLE sub_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyers can view their own sub_orders" ON sub_orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM parent_orders WHERE id = parent_id AND buyer_id = auth.uid())
);
CREATE POLICY "Sellers can view their sub_orders" ON sub_orders FOR SELECT USING (seller_id = auth.uid());
CREATE POLICY "Runners can view their sub_orders" ON sub_orders FOR SELECT USING (runner_id = auth.uid());
CREATE POLICY "Warehouse staff can view dark store sub_orders" ON sub_orders FOR SELECT USING (
    source = 'dark_store' AND EXISTS (SELECT 1 FROM warehouse_staff WHERE user_id = auth.uid())
);

-- SEED DATA (Mokokchung)

INSERT INTO towns (name, slug, coordinates) VALUES 
('Mokokchung', 'mokokchung', ST_SetSRID(ST_MakePoint(94.5244, 26.3267), 4326));

-- Initial Categories
INSERT INTO product_categories (name) VALUES 
('Smoked Meats'), ('Pickles'), ('Bakery'), ('Handicrafts'), ('Fresh Produce');

-- Functions for Atomic Stock Update
CREATE OR REPLACE FUNCTION decrement_inventory(p_sku_id UUID, p_quantity INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE inventory 
    SET quantity = quantity - p_quantity
    WHERE sku_id = p_sku_id AND quantity >= p_quantity;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient inventory';
    END IF;
END;
$$ LANGUAGE plpgsql;
