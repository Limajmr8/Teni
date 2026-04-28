// ============================================================
// BAZAR — Shared TypeScript Types
// All monetary values in PAISE (integer). Never use floats for money.
// Phone numbers in E.164 format: +91XXXXXXXXXX
// ============================================================

// ── Utility Types ────────────────────────────────────────

/** Paise value (integer). ₹1 = 100 paise. Never store as float. */
export type Paise = number;

/** ISO 8601 datetime string */
export type ISODate = string;

/** E.164 phone number e.g. +919876543210 */
export type E164Phone = string;

// ── Roles ────────────────────────────────────────────────

export type UserRole =
  | 'buyer'
  | 'seller'
  | 'runner'
  | 'warehouse_staff'
  | 'admin';

// ── Delivery Address ─────────────────────────────────────

export interface DeliveryAddress {
  name: string;
  /** E.164 phone number */
  phone: E164Phone;
  line1: string;
  locality: string;
  landmark: string;
  lat: number;
  lng: number;
}

// ── Town ─────────────────────────────────────────────────

export interface Town {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  subdomain: string | null;
  dark_store_lat: number | null;
  dark_store_lng: number | null;
  delivery_radius_km: number;
  operating_hours_json: { open: string; close: string };
  is_active: boolean;
  launch_date: string | null;
  created_at: ISODate;
}

// ── Config ───────────────────────────────────────────────

export interface Config {
  key: string;
  value: string;
  town_id: string;
  updated_at: ISODate;
}

// ── User ─────────────────────────────────────────────────

export interface User {
  id: string;
  /** E.164 format */
  phone: E164Phone | null;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  roles: UserRole[];
  town_id: string | null;
  referral_code: string | null;
  referred_by: string | null;
  created_at: ISODate;
}

// ── Buyer Profile ────────────────────────────────────────

export interface BuyerProfile {
  user_id: string;
  locality: string | null;
  default_address: DeliveryAddress | null;
  saved_addresses_json: DeliveryAddress[];
  updated_at: ISODate;
}

// ── Seller Profile ───────────────────────────────────────

export type DeliveryModel =
  | 'self_delivery'
  | 'runner_assisted'
  | 'self_pickup'
  | 'made_to_order';

export type SubscriptionPlan = 'free' | 'basic' | 'pro';

export interface PunchCardSettings {
  punches_required: number;
  reward: string;
}

export interface SellerProfile {
  user_id: string;
  store_name: string;
  store_slug: string;
  story: string | null;
  village_origin: string | null;
  category_ids: string[];
  upi_id: string | null;
  whatsapp: E164Phone | null;
  delivery_model: DeliveryModel;
  delivery_radius_km: number;
  delivery_zone_polygon: GeoJSON | null;
  /** Minimum order amount in paise */
  min_order_amount: Paise;
  /** Delivery fee in paise */
  delivery_fee: Paise;
  subscription_plan: SubscriptionPlan;
  subscription_expires_at: ISODate | null;
  commission_rate: number;
  is_approved: boolean;
  is_active: boolean;
  /** Total earnings in paise */
  total_earnings: Paise;
  punch_card_settings_json: PunchCardSettings;
  onboarded_at: ISODate;
  updated_at: ISODate;
}

// ── Runner Profile ───────────────────────────────────────

export type VehicleType = 'bike' | 'scooter' | 'car' | 'foot';

export interface RunnerProfile {
  user_id: string;
  vehicle_type: VehicleType;
  is_online: boolean;
  current_lat: number | null;
  current_lng: number | null;
  /** Earnings this week in paise */
  earnings_this_week: Paise;
  total_deliveries: number;
  rating: number;
  updated_at: ISODate;
}

// ── Warehouse Staff ──────────────────────────────────────

export type WarehouseRole = 'picker' | 'packer' | 'manager';

export interface WarehouseStaff {
  user_id: string;
  role: WarehouseRole;
  shift_json: Record<string, unknown>;
  town_id: string;
  created_at: ISODate;
}

// ── Product Category ─────────────────────────────────────

export type CategoryType = 'dark_store' | 'marketplace' | 'both';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  type: CategoryType;
  sort_order: number;
  created_at: ISODate;
}

// ── SKU (Dark Store) ─────────────────────────────────────

export type UnitType =
  | 'piece'
  | 'kg'
  | 'g'
  | 'litre'
  | 'ml'
  | 'pack'
  | 'dozen'
  | 'box';

export interface SKU {
  id: string;
  town_id: string;
  name: string;
  category_id: string | null;
  brand: string | null;
  unit: UnitType;
  /** Purchase price in paise */
  purchase_price: Paise;
  /** Selling price in paise */
  selling_price: Paise;
  /** MRP in paise */
  mrp: Paise;
  images: string[];
  description: string | null;
  shelf_code: string | null;
  low_stock_threshold: number;
  reorder_quantity: number;
  is_active: boolean;
  created_at: ISODate;
  updated_at: ISODate;
}

// ── Inventory ────────────────────────────────────────────

export interface Inventory {
  sku_id: string;
  town_id: string;
  quantity_in_stock: number;
  last_restocked_at: ISODate | null;
  updated_at: ISODate;
}

// ── Purchase Order ───────────────────────────────────────

export type PurchaseOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'received'
  | 'cancelled';

export interface PurchaseOrderItem {
  sku_id: string;
  sku_name: string;
  quantity: number;
  /** Unit cost in paise */
  unit_cost: Paise;
}

export interface PurchaseOrder {
  id: string;
  town_id: string;
  supplier_name: string;
  items_json: PurchaseOrderItem[];
  status: PurchaseOrderStatus;
  expected_date: string | null;
  received_at: ISODate | null;
  created_by: string | null;
  created_at: ISODate;
  updated_at: ISODate;
}

// ── Marketplace Product ──────────────────────────────────

export type FulfillmentModel = DeliveryModel;

export interface Product {
  id: string;
  seller_id: string;
  town_id: string;
  name: string;
  category_id: string | null;
  description: string | null;
  story: string | null;
  village_origin: string | null;
  /** Price in paise */
  price: Paise;
  unit: UnitType;
  images: string[];
  stock_quantity: number;
  is_made_to_order: boolean;
  lead_time_days: number;
  fulfillment_model: FulfillmentModel;
  is_active: boolean;
  is_approved: boolean;
  total_sold: number;
  created_at: ISODate;
  updated_at: ISODate;
}

// ── Cart ─────────────────────────────────────────────────

export type CartItemSource = 'dark_store' | 'seller';

export interface CartItem {
  id: string;
  source: CartItemSource;
  seller_id?: string;
  /** SKU id (dark_store) or Product id (seller) */
  item_id: string;
  name: string;
  image: string;
  /** Unit price in paise */
  price: Paise;
  quantity: number;
  unit: UnitType;
}

export interface Cart {
  items: CartItem[];
  /** Total amount in paise */
  total: Paise;
}

// ── Order ─────────────────────────────────────────────────

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

export interface ParentOrder {
  id: string;
  buyer_id: string;
  town_id: string;
  /** Total amount in paise */
  total_amount: Paise;
  payment_status: PaymentStatus;
  payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: ISODate;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'rejected'
  | 'picking'
  | 'picked'
  | 'packing'
  | 'packed'
  | 'assigned_runner'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  item_id: string;
  name: string;
  quantity: number;
  /** Unit price in paise */
  unit_price: Paise;
  /** Line total in paise */
  total: Paise;
}

export interface SubOrder {
  id: string;
  parent_order_id: string;
  source: 'dark_store' | 'seller';
  seller_id: string | null;
  runner_id: string | null;
  status: OrderStatus;
  items_json: OrderItem[];
  /** Subtotal in paise */
  subtotal: Paise;
  /** Delivery fee in paise */
  delivery_fee: Paise;
  delivery_address_json: DeliveryAddress;
  notes: string | null;
  estimated_delivery_at: ISODate | null;
  delivered_at: ISODate | null;
  created_at: ISODate;
  updated_at: ISODate;
}

export interface OrderStatusHistory {
  id: string;
  sub_order_id: string;
  status: OrderStatus;
  changed_by: string | null;
  changed_at: ISODate;
  note: string | null;
}

// ── Runner Location ───────────────────────────────────────

export interface RunnerLocationLog {
  id: string;
  runner_id: string;
  sub_order_id: string | null;
  lat: number;
  lng: number;
  recorded_at: ISODate;
}

// ── Review ────────────────────────────────────────────────

export interface Review {
  id: string;
  sub_order_id: string;
  buyer_id: string;
  seller_id: string | null;
  product_quality_rating: number | null;
  freshness_rating: number | null;
  packaging_rating: number | null;
  communication_rating: number | null;
  overall_rating: number;
  comment: string | null;
  locality: string | null;
  is_verified_purchase: boolean;
  created_at: ISODate;
}

// ── Seller Story ──────────────────────────────────────────

export type MediaType = 'image' | 'video';

export interface SellerStory {
  id: string;
  seller_id: string;
  media_url: string;
  media_type: MediaType;
  caption: string | null;
  created_at: ISODate;
  expires_at: ISODate;
  view_count: number;
}

// ── Punch Card ────────────────────────────────────────────

export interface PunchCard {
  id: string;
  buyer_id: string;
  seller_id: string;
  punch_count: number;
  reward_description: string | null;
  last_punched_at: ISODate | null;
  redeemed_count: number;
  created_at: ISODate;
}

// ── Referral Code ─────────────────────────────────────────

export type ReferralType = 'buyer' | 'seller';

export interface ReferralCode {
  code: string;
  user_id: string;
  type: ReferralType;
  rewards_given: number;
  created_at: ISODate;
}

// ── Featured Listing ──────────────────────────────────────

export type FeaturedListingType = 'category_pin' | 'home_banner';

export interface FeaturedListing {
  id: string;
  seller_id: string;
  product_id: string | null;
  type: FeaturedListingType;
  start_at: ISODate;
  end_at: ISODate;
  /** Amount paid in paise */
  amount_paid: Paise;
  is_active: boolean;
  created_at: ISODate;
}

// ── Town Ambassador ───────────────────────────────────────

export interface TownAmbassador {
  user_id: string;
  town_id: string;
  commission_rate: number;
  /** Total earned in paise */
  total_earned: Paise;
  joined_at: ISODate;
}

// ── Notification ──────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data_json: Record<string, unknown>;
  read_at: ISODate | null;
  created_at: ISODate;
}

// ── GeoJSON (minimal) ─────────────────────────────────────

export interface GeoJSON {
  type: string;
  coordinates: unknown;
}
