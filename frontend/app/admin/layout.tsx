'use client';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Utilisateurs' },
  { href: '/admin/products', label: 'Produits' },
  { href: '/admin/categories', label: 'Catégories' },
  { href: '/admin/orders', label: 'Commandes' },
  { href: '/admin/settings', label: 'Paramètres' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex gap-4">
      <aside className="fixed left-2 top-24 hidden h-[calc(100vh-6rem)] w-[230px] flex-col gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.25)] md:flex">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-mint">Admin</p>
          <h1 className="text-xl font-bold text-white">Gestion boutique</h1>
        </div>
        <nav className="mt-4 flex flex-col gap-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-3 py-2 transition ${
                pathname === item.href ? 'bg-mint text-slate-900' : 'border border-white/10 text-slate-200 hover:border-mint/60'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 space-y-6 md:ml-[240px]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:hidden">
          <div className="flex flex-wrap gap-2 text-sm">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 transition ${
                  pathname === item.href ? 'bg-mint text-slate-900' : 'border border-white/10 text-slate-200 hover:border-mint/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
