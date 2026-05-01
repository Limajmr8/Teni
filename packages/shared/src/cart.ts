import { CartItem, SubOrder, COMMISION_RATE } from "./index";

export interface SplitResult {
  darkStoreItems: CartItem[];
  sellerItems: Record<string, CartItem[]>;
}

export const splitCart = (items: CartItem[]): SplitResult => {
  const darkStoreItems: CartItem[] = [];
  const sellerItems: Record<string, CartItem[]> = {};

  items.forEach(item => {
    if (item.type === 'dark_store') {
      darkStoreItems.push(item);
    } else if (item.type === 'seller' && item.seller_id) {
      if (!sellerItems[item.seller_id]) {
        sellerItems[item.seller_id] = [];
      }
      sellerItems[item.seller_id].push(item);
    }
  });

  return { darkStoreItems, sellerItems };
};

export const calculateSubtotal = (items: CartItem[]) => {
  return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

export const calculateCommission = (subtotal: number) => {
  return Math.round(subtotal * COMMISION_RATE);
};
