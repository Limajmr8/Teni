export type Paise = number;
export type E164Phone = string;

export type UserRole = 'buyer' | 'seller' | 'runner' | 'warehouse_staff' | 'admin';

export interface DeliveryAddress {
  name: string;
  phone: E164Phone;
  line1: string;
  locality: string;
  landmark: string;
  lat: number;
  lng: number;
}

export interface Town {
  id: string;
  name: string;
  state: string;
  lat?: number;
  lng?: number;
  subdomain?: string;
  darkStoreLat?: number;
  darkStoreLng?: number;
  deliveryRadiusKm?: number;
  operatingHoursJson?: Record<string, string>;
  isActive: boolean;
  launchDate?: string;
  createdAt?: string;
}

export interface Config {
  key: string;
  value: string;
  townId?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  phone?: E164Phone;
  email?: string;
  name?: string;
  avatarUrl?: string;
  roles: UserRole[];
  townId?: string;
  referralCode?: string;
  referredBy?: string;
  createdAt?: string;
}

export interface BuyerProfile {
  userId: string;
  locality?: string;
  defaultAddress?: DeliveryAddress;
  savedAddresses: DeliveryAddress[];
  updatedAt?: string;
}

export interface SellerProfile {
  userId: string;
  storeName: string;
  storeSlug: string;
  story?: string;
  villageOrigin?: string;
  categoryIds: string[];
  upiId?: string;
  whatsapp?: E164Phone;
  deliveryModel: 'self_delivery' | 'runner_assisted' | 'self_pickup' | 'made_to_order';
  deliveryRadiusKm?: number;
  deliveryZonePolygon?: Record<string, unknown>;
  minOrderAmount?: Paise;
  deliveryFee?: Paise;
  subscriptionPlan: 'free' | 'basic' | 'pro';
  subscriptionExpiresAt?: string;
  commissionRate?: number;
  isApproved: boolean;
  isActive: boolean;
  totalEarnings: Paise;
  punchCardSettingsJson?: Record<string, unknown>;
  onboardedAt?: string;
  updatedAt?: string;
}

export interface RunnerProfile {
  userId: string;
  vehicleType: 'bike' | 'scooter' | 'car' | 'foot';
  isOnline: boolean;
  currentLat?: number;
  currentLng?: number;
  earningsThisWeek: Paise;
  totalDeliveries: number;
  rating?: number;
  updatedAt?: string;
}

export interface WarehouseStaff {
  userId: string;
  role: 'picker' | 'packer' | 'manager';
  shiftJson?: Record<string, unknown>;
  townId?: string;
  createdAt?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
  type: 'dark_store' | 'marketplace' | 'both';
  sortOrder?: number;
  createdAt?: string;
}

export interface SKU {
  id: string;
  townId: string;
  name: string;
  categoryId?: string;
  brand?: string;
  unit: 'piece' | 'kg' | 'g' | 'litre' | 'ml' | 'pack' | 'dozen' | 'box';
  purchasePrice: Paise;
  sellingPrice: Paise;
  mrp: Paise;
  images: string[];
  description?: string;
  shelfCode?: string;
  lowStockThreshold?: number;
  reorderQuantity?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Inventory {
  skuId: string;
  townId: string;
  quantityInStock: number;
  lastRestockedAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrder {
  id: string;
  townId: string;
  supplierName: string;
  itemsJson: Record<string, unknown>[];
  status: 'pending' | 'confirmed' | 'received' | 'cancelled';
  expectedDate?: string;
  receivedAt?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  townId: string;
  name: string;
  categoryId?: string;
  description?: string;
  story?: string;
  villageOrigin?: string;
  price: Paise;
  unit: string;
  images: string[];
  stockQuantity?: number;
  isMadeToOrder: boolean;
  leadTimeDays?: number;
  fulfillmentModel: 'self_delivery' | 'runner_assisted' | 'self_pickup' | 'made_to_order';
  isActive: boolean;
  isApproved: boolean;
  totalSold?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface ParentOrder {
  id: string;
  buyerId: string;
  townId: string;
  totalAmount: Paise;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund';
  paymentId?: string;
  razorpayOrderId?: string;
  createdAt?: string;
}

export interface SubOrder {
  id: string;
  parentOrderId: string;
  source: 'dark_store' | 'seller';
  sellerId?: string;
  runnerId?: string;
  status: OrderStatus;
  itemsJson: Record<string, unknown>[];
  subtotal: Paise;
  deliveryFee: Paise;
  deliveryAddress: DeliveryAddress;
  notes?: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderStatusHistory {
  id: string;
  subOrderId: string;
  status: OrderStatus;
  changedBy?: string;
  changedAt?: string;
  note?: string;
}

export interface CartItem {
  id: string;
  source: 'dark_store' | 'seller';
  name: string;
  quantity: number;
  unit?: string;
  price: Paise;
  sellerId?: string;
  imageUrl?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: Paise;
  deliveryFee: Paise;
  total: Paise;
}

export interface Review {
  id: string;
  subOrderId: string;
  buyerId: string;
  sellerId?: string;
  productQualityRating?: number;
  freshnessRating?: number;
  packagingRating?: number;
  communicationRating?: number;
  overallRating: number;
  comment?: string;
  locality?: string;
  isVerifiedPurchase: boolean;
  createdAt?: string;
}

export interface SellerStory {
  id: string;
  sellerId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt?: string;
  expiresAt?: string;
  viewCount?: number;
}

export interface PunchCard {
  id: string;
  buyerId: string;
  sellerId: string;
  punchCount: number;
  rewardDescription?: string;
  lastPunchedAt?: string;
  redeemedCount?: number;
  createdAt?: string;
}

export interface ReferralCode {
  code: string;
  userId: string;
  type: 'buyer' | 'seller';
  rewardsGiven: number;
  createdAt?: string;
}

export interface FeaturedListing {
  id: string;
  sellerId: string;
  productId?: string;
  type: 'category_pin' | 'home_banner';
  startAt: string;
  endAt: string;
  amountPaid: Paise;
  isActive: boolean;
  createdAt?: string;
}

export interface TownAmbassador {
  userId: string;
  townId: string;
  commissionRate: number;
  totalEarned: Paise;
  joinedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  dataJson?: Record<string, unknown>;
  readAt?: string;
  createdAt?: string;
}

export interface RunnerLocationLog {
  id: string;
  runnerId: string;
  subOrderId?: string;
  lat: number;
  lng: number;
  recordedAt?: string;
}
