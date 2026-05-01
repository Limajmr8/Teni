export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'picking' 
  | 'packed' 
  | 'out_for_delivery' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export type FulfillmentModel = 
  | 'self_delivery' 
  | 'teni_runner' 
  | 'pickup_only';

export type SellerPlan = 'starter' | 'pro';

export interface Address {
  name: string;
  phone: string;
  line1: string;
  locality: string;
  landmark: string;
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  phone: string;
  full_name: string | null;
  avatar_url: string | null;
  roles: ('buyer' | 'seller' | 'runner' | 'warehouse_staff' | 'admin')[];
  created_at: string;
}

export interface SellerProfile {
  user_id: string;
  town_id: string;
  store_name: string;
  store_slug: string;
  bio: string | null;
  village_origin: string | null;
  locality: string | null;
  whatsapp_number: string | null;
  upi_id: string | null;
  is_approved: boolean;
  plan: SellerPlan;
  subscription_expires_at: string | null;
  rating: number;
}

export interface SKU {
  id: string;
  town_id: string;
  name: string;
  description: string | null;
  category: string;
  image_url: string | null;
  unit: string;
  purchase_price: number;
  selling_price: number;
  is_active: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string | null;
  images: string[];
  village_origin: string | null;
  story: string | null;
  stock_quantity: number;
  is_made_to_order: boolean;
  lead_time_hours: number;
  fulfillment_model: FulfillmentModel;
  is_active: boolean;
}

export interface SubOrder {
  id: string;
  parent_id: string;
  source: 'dark_store' | 'seller' | 'marketplace';
  seller_id: string | null;
  items: CartItem[];
  subtotal: number;
  amount?: number; // Cloud DB uses 'amount' instead of 'subtotal'
  commission_amount: number;
  status: OrderStatus;
  runner_id: string | null;
  created_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: 'dark_store' | 'seller';
  seller_id?: string;
  image?: string;
  unit?: string;
}

export const COMMISION_RATE = 0.06; // 6%
export const DELIVERY_FEE_FLAT = 2000; // ₹20 in paise
export const FREE_DELIVERY_THRESHOLD = 20000; // ₹200 in paise

export * from './whatsapp';
