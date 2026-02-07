"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { useHydrateAuth } from '@/hooks/useHydrateAuth';
import { Button } from './button';
import { api, setAuthToken } from '@/services/api';
import { CartModal } from './cart-modal';

export const Navbar = () => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  useHydrateAuth();
  const isAdminSection = pathname.startsWith('/admin');

  const storeLinks = [
    { href: '/', label: 'Boutique' },
    { href: '/products', label: 'Catégories' },
    { href: '/cart', label: 'Panier' },
    { href: '/account', label: 'Compte' },
  ];
  const adminLinks = [{ href: '/account', label: 'Compte' }];
  const navLinks = isAdminSection ? adminLinks : storeLinks;

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
        <nav className="flex items-center gap-4 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 hover:text-mint ${pathname === link.href ? 'text-mint' : 'text-slate-200'}`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300">{user.email}</span>
              {!isAdminSection && <CartModal />}
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
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
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
