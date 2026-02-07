"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cards = [
  { title: 'Produits', desc: 'Créer, activer/désactiver, modifier, supprimer', href: '/admin/products' },
  { title: 'Catégories', desc: 'Organiser les gammes et slugs', href: '/admin/categories' },
  { title: 'Commandes', desc: 'Suivre et changer le statut', href: '/admin/orders' },
];

export default function AdminHome() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-[0_12px_32px_rgba(0,0,0,0.1)] transition hover:-translate-y-1 hover:border-mint/60"
        >
          <p className="text-sm font-semibold text-white">{card.title}</p>
          <p className="mt-1 text-sm text-slate-300">{card.desc}</p>
          <div className="mt-3 inline-flex items-center gap-2 text-mint text-sm font-semibold">
            Ouvrir <ArrowRight size={14} className="transition group-hover:translate-x-1" />
          </div>
        </Link>
      ))}
    </div>
  );
}
