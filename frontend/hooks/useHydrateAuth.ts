'use client';

import { useEffect } from 'react';
import { api, setAuthToken } from '@/services/api';
import { getCookie } from '@/lib/cookies';
import { useAuthStore } from '@/stores/authStore';

export const useHydrateAuth = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const token = getCookie('auth_token');
    if (!token || user) return;
    setAuthToken(token);
    api
      .get('/auth/me')
      .then((res) => setAuth({ user: res.data, token }))
      .catch(() => setAuthToken(null));
  }, [setAuth, user]);
};
