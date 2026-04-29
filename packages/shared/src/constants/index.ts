// Revenue streams (Hormozi frameworks) tracked from day one.
// 1) Dark store margin, 2) Delivery fees, 3) Marketplace commission/subscription,
// 4) Featured listings, 5) Runner delivery commission.

export const DELIVERY_FEE_PAISE = 2000;
export const FREE_DELIVERY_THRESHOLD_PAISE = 20000;
export const COMMISSION_RATE = 0.06;
export const SUBSCRIPTION_MONTHLY_PAISE = 19900;
export const PRO_SUBSCRIPTION_MONTHLY_PAISE = 49900;
export const RUNNER_BASE_PAY_PAISE = 2500;
export const RUNNER_DELIVERY_COMMISSION_RATE = 0.8;
export const STORY_EXPIRY_HOURS = 24;
export const ORDER_ACCEPT_WINDOW_MINUTES = 15;
export const SELLER_FREE_PERIOD_DAYS = 90;

export const DARK_STORE_CATEGORIES = [
  { id: 'fruits-vegetables', name: 'Fruits & Vegetables' },
  { id: 'dairy-eggs', name: 'Dairy & Eggs' },
  { id: 'packaged-food', name: 'Packaged Food' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
  { id: 'household', name: 'Household' },
  { id: 'personal-care', name: 'Personal Care' },
  { id: 'frozen', name: 'Frozen' },
  { id: 'baby', name: 'Baby' },
  { id: 'pet', name: 'Pet' },
];

export const ORDER_STATUSES = [
  'placed',
  'accepted',
  'rejected',
  'picking',
  'picked',
  'packing',
  'packed',
  'assigned_runner',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'refunded',
] as const;
