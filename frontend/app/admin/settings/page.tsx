"use client";

import { ShieldCheck, Lock, MailCheck, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <ShieldCheck size={18} className="text-mint" /> Sécurité
        </h2>
        <p className="text-sm text-slate-300">Options réservées aux administrateurs.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Vérification email</p>
            <p className="text-slate-400">Déjà appliquée (EmailVerifiedGuard). Toutes les commandes et paniers exigent un email confirmé.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">JWT secret</p>
            <p className="text-slate-400">Stocké dans .env (JWT_SECRET). Rotation manuelle recommandée, conserver vos valeurs actuelles.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">SMTP</p>
            <p className="text-slate-400">Utilise les valeurs .env existantes (inchangées). Mettez à jour l'env puis redémarrez l'API.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Déconnexion globale</p>
            <p className="text-slate-400">Révoquez vos cookies en cliquant ci-dessous.</p>
            <Button className="mt-3" onClick={() => window.location.replace('/logout')}>Déconnecter</Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <MailCheck size={18} className="text-mint" /> Emails
        </h2>
        <p className="text-sm text-slate-300">Suivi des emails de commande et de vérification.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Mode actuel</p>
            <p className="text-slate-400">Voir backend/.env : SMTP_HOST, SMTP_PORT, EMAIL_FROM (inchangés).</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Relancer l'API</p>
            <p className="text-slate-400">Après modification des env, redémarrez `npm run start:dev`.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Lock size={18} className="text-mint" /> Maintenance
        </h2>
        <p className="text-sm text-slate-300">Actions rapides (locales).</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Rafraîchir données</p>
            <Button variant="ghost" className="mt-2 flex items-center gap-2" onClick={() => window.location.reload()}>
              <RefreshCcw size={16} /> Recharger
            </Button>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Export commandes</p>
            <p className="text-slate-400">(À implémenter côté backend) endpoint /admin/orders export CSV.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Purge cache</p>
            <p className="text-slate-400">Invalider le revalidate Next si nécessaire (non connecté ici).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
