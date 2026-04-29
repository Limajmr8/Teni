import { create } from 'zustand';
import type { User } from '@bazar/shared';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
}));
