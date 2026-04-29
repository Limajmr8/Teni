import { create } from 'zustand';
import type { CartItem } from '@bazar/shared';
import { DELIVERY_FEE_PAISE, FREE_DELIVERY_THRESHOLD_PAISE } from '@bazar/shared';

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((entry) => entry.id === item.id && entry.source === item.source);
      if (existing) {
        return {
          items: state.items.map((entry) =>
            entry.id === item.id && entry.source === item.source
              ? { ...entry, quantity: entry.quantity + item.quantity }
              : entry
          ),
        };
      }
      return { items: [...state.items, item] };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((entry) => (entry.id === id ? { ...entry, quantity } : entry)),
    })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((entry) => entry.id !== id) })),
  clear: () => set({ items: [] }),
  subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  deliveryFee: () => (get().subtotal() >= FREE_DELIVERY_THRESHOLD_PAISE ? 0 : DELIVERY_FEE_PAISE),
  total: () => get().subtotal() + get().deliveryFee(),
}));
