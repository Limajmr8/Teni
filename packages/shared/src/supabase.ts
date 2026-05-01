import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const formatPrice = (paise: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(paise / 100);
};

export const calculateDeliveryFee = (subtotal: number) => {
  if (subtotal >= 20000) return 0; // ₹200 free delivery
  return 2000; // ₹20 flat
};

export const calculateSubtotal = (items: { price: number; quantity: number }[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};
