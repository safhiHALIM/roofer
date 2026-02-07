"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useHydrateAuth } from '@/hooks/useHydrateAuth';
import { Button } from './button';
import { api, setAuthToken } from '@/services/api';
import { CartModal } from './cart-modal';
import { Category } from '@/types';

export const Navbar = () => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  useHydrateAuth();
  const isAdminSection = pathname.startsWith('/admin');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (isAdminSection) return;
    api
      .get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, [isAdminSection]);

  const handleLogout = async () => {
    try {
      const token = useAuthStore.getState().token;
      setAuthToken(token);
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      logout();
      setAuthToken(null);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={isAdminSection ? '/admin' : '/'} className="text-lg font-bold tracking-tight text-mint">
          Roofer Univers
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href="/account"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-100 hover:border-mint hover:text-mint transition"
              >
                {user.email}
              </Link>
              {!isAdminSection && <CartModal />}
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-200 hover:text-mint">
                Connexion
              </Link>
              {!isAdminSection && (
                <>
                  <CartModal />
                  <Link href="/register" className="button-primary">
                    Créer un compte
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
      {!isAdminSection && (
        <div className="border-t border-white/5 bg-[#0b1220]/85">
          <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2 text-sm">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`rounded-lg px-3 py-1 transition ${
                  pathname.startsWith('/products') && pathname.includes(cat.slug)
                    ? 'bg-mint text-slate-900'
                    : 'text-slate-200 hover:bg-white/5 hover:text-mint'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
