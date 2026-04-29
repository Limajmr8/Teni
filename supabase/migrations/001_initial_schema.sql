CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('dark_store', 'marketplace', 'both')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE towns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  subdomain TEXT UNIQUE,
  dark_store_lat DECIMAL(10,7),
  dark_store_lng DECIMAL(10,7),
  delivery_radius_km DECIMAL(5,2) DEFAULT 5.0,
  operating_hours_json JSONB DEFAULT '{"open": "08:00", "close": "21:00"}',
  is_active BOOLEAN DEFAULT true,
  launch_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE config (
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  town_id UUID REFERENCES towns(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (key, town_id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT UNIQUE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  roles TEXT[] DEFAULT ARRAY['buyer'],
  town_id UUID REFERENCES towns(id),
  referral_code TEXT UNIQUE DEFAULT UPPER(SUBSTRING(uuid_generate_v4()::TEXT, 1, 8)),
  referred_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE buyer_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  locality TEXT,
  default_address JSONB,
  saved_addresses_json JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_slug TEXT UNIQUE NOT NULL,
  story TEXT,
  village_origin TEXT,
  category_ids UUID[] DEFAULT '{}',
  upi_id TEXT,
  whatsapp TEXT,
  delivery_model TEXT DEFAULT 'self_delivery' CHECK (delivery_model IN ('self_delivery', 'runner_assisted', 'self_pickup', 'made_to_order')),
  delivery_radius_km DECIMAL(5,2) DEFAULT 5.0,
  delivery_zone_polygon JSONB,
  min_order_amount INTEGER DEFAULT 0,
  delivery_fee INTEGER DEFAULT 0,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  commission_rate DECIMAL(5,4) DEFAULT 0.06,
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_earnings INTEGER DEFAULT 0,
  punch_card_settings_json JSONB DEFAULT '{"punches_required": 9, "reward": "1 free item"}',
  onboarded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE runner_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_type TEXT DEFAULT 'bike' CHECK (vehicle_type IN ('bike', 'scooter', 'car', 'foot')),
  is_online BOOLEAN DEFAULT false,
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  earnings_this_week INTEGER DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.00,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE warehouse_staff (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('picker', 'packer', 'manager')),
  shift_json JSONB DEFAULT '{}',
  town_id UUID REFERENCES towns(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  town_id UUID REFERENCES towns(id) NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES product_categories(id),
  brand TEXT,
  unit TEXT NOT NULL DEFAULT 'piece' CHECK (unit IN ('piece', 'kg', 'g', 'litre', 'ml', 'pack', 'dozen', 'box')),
  purchase_price INTEGER NOT NULL,
  selling_price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  shelf_code TEXT,
  low_stock_threshold INTEGER DEFAULT 10,
  reorder_quantity INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE inventory (
  sku_id UUID PRIMARY KEY REFERENCES skus(id) ON DELETE CASCADE,
  town_id UUID REFERENCES towns(id) NOT NULL,
  quantity_in_stock INTEGER NOT NULL DEFAULT 0,
  last_restocked_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  town_id UUID REFERENCES towns(id) NOT NULL,
  supplier_name TEXT NOT NULL,
  items_json JSONB NOT NULL DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'received', 'cancelled')),
  expected_date DATE,
  received_at TIMESTAMPTZ,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id) NOT NULL,
  town_id UUID REFERENCES towns(id) NOT NULL,
  name TEXT NOT NULL,
  category_id UUID REFERENCES product_categories(id),
  description TEXT,
  story TEXT,
  village_origin TEXT,
  price INTEGER NOT NULL,
  unit TEXT NOT NULL DEFAULT 'piece',
  images TEXT[] DEFAULT '{}',
  stock_quantity INTEGER DEFAULT 0,
  is_made_to_order BOOLEAN DEFAULT false,
  lead_time_days INTEGER DEFAULT 0,
  fulfillment_model TEXT DEFAULT 'self_delivery' CHECK (fulfillment_model IN ('self_delivery', 'runner_assisted', 'self_pickup', 'made_to_order')),
  is_active BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  total_sold INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parent_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id) NOT NULL,
  town_id UUID REFERENCES towns(id) NOT NULL,
  total_amount INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partial_refund')),
  payment_id TEXT,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sub_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_order_id UUID REFERENCES parent_orders(id) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('dark_store', 'seller')),
  seller_id UUID REFERENCES users(id),
  runner_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'placed' CHECK (status IN (
    'placed', 'accepted', 'rejected', 'picking', 'picked', 'packing', 'packed',
    'assigned_runner', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'
  )),
  items_json JSONB NOT NULL DEFAULT '[]',
  subtotal INTEGER NOT NULL,
  delivery_fee INTEGER DEFAULT 0,
  delivery_address_json JSONB NOT NULL,
  notes TEXT,
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_order_id UUID REFERENCES sub_orders(id) NOT NULL,
  status TEXT NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  note TEXT
);

CREATE TABLE runner_location_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  runner_id UUID REFERENCES users(id) NOT NULL,
  sub_order_id UUID REFERENCES sub_orders(id),
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sub_order_id UUID REFERENCES sub_orders(id) NOT NULL UNIQUE,
  buyer_id UUID REFERENCES users(id) NOT NULL,
  seller_id UUID REFERENCES users(id),
  product_quality_rating INTEGER CHECK (product_quality_rating BETWEEN 1 AND 5),
  freshness_rating INTEGER CHECK (freshness_rating BETWEEN 1 AND 5),
  packaging_rating INTEGER CHECK (packaging_rating BETWEEN 1 AND 5),
  communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
  overall_rating INTEGER NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  comment TEXT,
  locality TEXT,
  is_verified_purchase BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seller_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id) NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  view_count INTEGER DEFAULT 0
);

CREATE TABLE punch_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID REFERENCES users(id) NOT NULL,
  seller_id UUID REFERENCES users(id) NOT NULL,
  punch_count INTEGER DEFAULT 0,
  reward_description TEXT,
  last_punched_at TIMESTAMPTZ,
  redeemed_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (buyer_id, seller_id)
);

CREATE TABLE referral_codes (
  code TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buyer', 'seller')),
  rewards_given INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE featured_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES users(id) NOT NULL,
  product_id UUID REFERENCES products(id),
  type TEXT NOT NULL CHECK (type IN ('category_pin', 'home_banner')),
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  amount_paid INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE town_ambassadors (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  town_id UUID REFERENCES towns(id) NOT NULL,
  commission_rate DECIMAL(5,4) DEFAULT 0.015,
  total_earned INTEGER DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data_json JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE whatsapp_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_number TEXT NOT NULL,
  template TEXT NOT NULL,
  payload_json JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error')),
  message TEXT NOT NULL,
  context_json JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
