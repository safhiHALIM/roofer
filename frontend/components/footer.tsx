import Link from 'next/link';
import { Facebook, Instagram, Phone, Mail } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-black/5 bg-white text-slate-800">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3 md:max-w-sm">
        <h3 className="text-lg font-bold text-slate-900">Roofer Univers</h3>
        <p className="text-sm text-slate-600">
          Equipements outdoor, toits de tente et accessoires livrés partout. Paiement par commande email après vérification.
        </p>
        <div className="flex gap-3 text-slate-600">
          <a href="https://www.instagram.com" aria-label="Instagram" className="hover:text-mint"><Instagram size={18} /></a>
          <a href="https://www.facebook.com" aria-label="Facebook" className="hover:text-mint"><Facebook size={18} /></a>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-6 text-sm md:grid-cols-3">
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Boutique</h4>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-mint">Catalogue</Link></li>
            <li><Link href="/cart" className="hover:text-mint">Panier</Link></li>
            <li><Link href="/favorites" className="hover:text-mint">Favoris</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Compte</h4>
          <ul className="space-y-2">
            <li><Link href="/login" className="hover:text-mint">Connexion</Link></li>
            <li><Link href="/register" className="hover:text-mint">Inscription</Link></li>
            <li><Link href="/account" className="hover:text-mint">Espace client</Link></li>
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Contact</h4>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2"><Phone size={16} /> +33 1 84 80 00 00</li>
            <li className="flex items-center gap-2"><Mail size={16} /> support@roofer-univers.com</li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-black/5 bg-white/80 py-4 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} Roofer Univers — Outdoor, vans & tentes de toit.
    </div>
  </footer>
);
