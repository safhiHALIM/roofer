'use client';

import { create } from 'zustand';
import { User } from '@/types';
import { deleteCookie, setCookie } from '@/lib/cookies';

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (payload: { user: User; token: string }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setAuth: ({ user, token }) => {
    set({ user, token });
    setCookie('auth_token', token);
    setCookie('email_verified', user.emailVerified ? 'true' : 'false');
    setCookie('user_role', user.role);
  },
  logout: () => {
    deleteCookie('auth_token');
    deleteCookie('email_verified');
    deleteCookie('user_role');
    set({ user: null, token: null });
  },
}));
