import { Paise } from '../types';

export const paiseToRupees = (paise: Paise): number => paise / 100;

export const rupeesToPaise = (rupees: number): Paise => Math.round(rupees * 100);

export const formatPaise = (paise: Paise): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(paiseToRupees(paise));

export const formatPhone = (phone: string): string => {
  const normalized = phone.replace(/\s+/g, '');
  if (normalized.startsWith('+')) {
    return normalized;
  }
  if (/^\d{10}$/.test(normalized)) {
    return `+91${normalized}`;
  }
  return normalized;
};

export const isValidE164 = (phone: string): boolean => /^\+[1-9]\d{7,14}$/.test(phone);

export const calculateMarginPercent = (purchasePrice: Paise, sellingPrice: Paise): number => {
  if (purchasePrice <= 0) return 0;
  return ((sellingPrice - purchasePrice) / purchasePrice) * 100;
};

export const isWednesdayMarketActive = (): boolean => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  return (day === 2 && hour >= 18) || day === 3;
};

export const isStoryExpired = (expiresAt: string): boolean => new Date(expiresAt).getTime() <= Date.now();
