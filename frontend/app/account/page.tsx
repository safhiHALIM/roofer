'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Loader2, Mail, ShieldCheck, UserCircle2, Sparkles, LockKeyhole, Send } from 'lucide-react';

import { useAuthStore } from '@/stores/authStore';
import { api, setAuthToken } from '@/services/api';
import { Button } from '@/components/button';
import { Input } from '@/components/input';

const profileSchema = z.object({
  name: z.string().min(2, 'Votre nom doit contenir au moins 2 caractères'),
  phone: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .refine((val) => !val || /^[0-9+().\-\s]{6,20}$/.test(val), {
      message: 'Numéro invalide (6 à 20 caractères, chiffres et +().- autorisés)',
    }),
});

type ProfileForm = z.infer<typeof profileSchema>;

const emailSchema = z
  .object({
    newEmail: z.string().email('Email invalide'),
    confirmEmail: z.string().email('Email invalide'),
  })
  .refine((data) => data.newEmail === data.confirmEmail, {
    message: 'Les emails ne correspondent pas',
    path: ['confirmEmail'],
  });
type EmailForm = z.infer<typeof emailSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Mot de passe actuel requis'),
    newPassword: z.string().min(8, 'Minimum 8 caractères'),
    confirmPassword: z.string().min(8, 'Minimum 8 caractères'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function AccountPage() {
  const { user, token, logout, setAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passSaving, setPassSaving] = useState(false);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [passError, setPassError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      phone: user?.phone ?? '',
    },
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    reset: resetEmail,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  // Hydrate the session and redirect if missing token
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    setAuthToken(token);
    setLoading(true);
    api
      .get('/auth/me')
      .then((res) => {
        setAuth({ user: res.data, token });
        reset({ name: res.data.name ?? '', phone: res.data.phone ?? '' });
      })
      .catch(() => {
        logout();
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [token, setAuth, logout, router, reset]);

  useEffect(() => {
    if (user) {
      reset({ name: user.name ?? '', phone: user.phone ?? '' });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!token) return router.push('/login');
    setSaving(true);
    setError(null);
    setSuccess(null);
    setAuthToken(token);
    try {
      const res = await api.put('/users/me', { ...data, phone: data.phone ?? null });
      setAuth({ user: res.data, token });
      reset({ name: res.data.name ?? '', phone: res.data.phone ?? '' });
      setSuccess('Profil mis à jour');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Impossible de sauvegarder pour le moment.';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setSaving(false);
    }
  };

  const onEmailSubmit = handleSubmitEmail(async (data) => {
    if (!token) return router.push('/login');
    setEmailSaving(true);
    setEmailError(null);
    setEmailSuccess(null);
    setAuthToken(token);
    try {
      const res = await api.post('/users/change-email', { newEmail: data.newEmail });
      setEmailSuccess(res.data?.message || 'Vérifiez votre nouvelle boîte mail pour confirmer.');
      resetEmail();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Impossible de mettre à jour l’email.';
      setEmailError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setEmailSaving(false);
    }
  });

  const onPasswordSubmit = handleSubmitPassword(async (data) => {
    if (!token) return router.push('/login');
    setPassSaving(true);
    setPassError(null);
    setPassSuccess(null);
    setAuthToken(token);
    try {
      const res = await api.post('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPassSuccess(res.data?.message || 'Mot de passe mis à jour');
      resetPassword();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Mise à jour impossible.';
      setPassError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setPassSaving(false);
    }
  });

  if (loading || !user) {
    return <p className="text-slate-300">Chargement de votre espace...</p>;
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/70 to-slate-800/60 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
        <div className="absolute left-[-12%] top-[-30%] h-48 w-48 rounded-full bg-mint/15 blur-[100px]" />
        <div className="absolute right-[-18%] bottom-[-40%] h-64 w-64 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-mint">
              <Sparkles size={14} /> Espace client
            </span>
            <h1 className="text-3xl font-bold text-white">Bonjour, {user.name}</h1>
            <p className="flex items-center gap-2 text-slate-200">
              <Mail size={16} className="text-mint" />
              {user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                <CheckCircle2 size={16} />
                Email vérifié
              </span>
            ) : (
              <Button onClick={() => router.push('/verify-email')} className="gap-2">
                <ShieldCheck size={16} />
                Vérifier mon email
              </Button>
            )}
          </div>
        </div>
        <div className="relative mt-6 grid gap-4 sm:grid-cols-3">
          {[{ label: 'Statut', value: user.emailVerified ? 'Compte confirmé' : 'En attente de confirmation' },
            { label: 'Rôle', value: user.role === 'ADMIN' ? 'Administrateur' : 'Client' },
            { label: 'Créé le', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-' }].map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                <p className="text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                <p className="font-semibold text-white">{item.value}</p>
              </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="card space-y-4">
            <div className="flex items-center gap-3">
              <UserCircle2 className="text-mint" />
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Résumé</p>
                <p className="text-lg font-semibold text-white">Vos informations</p>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {[
                { label: 'Nom complet', value: user.name },
                { label: 'Email', value: user.email },
                { label: 'Téléphone', value: user.phone || 'Non renseigné' },
                { label: 'Rôle', value: user.role },
                { label: 'Créé le', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '-' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-semibold text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card space-y-3 border border-cyan-400/20">
            <div className="flex items-center gap-2 text-cyan-200">
              <ShieldCheck size={16} />
              <p className="text-sm font-semibold">Sécurité du compte</p>
            </div>
            <p className="text-sm text-slate-300">
              Votre session est protégée par un jeton JWT. Gardez vos accès privés et déconnectez-vous sur les appareils publics.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => router.push('/')}>
                Retour à la boutique
              </Button>
              <Button variant="ghost" onClick={() => router.push('/cart')}>
                Voir mon panier
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Paramètres</p>
                <h2 className="text-xl font-semibold text-white">Modifier mes informations</h2>
              </div>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <Input label="Nom complet" {...register('name')} error={errors.name?.message} />
              <Input label="Téléphone (optionnel)" placeholder="+33 6 12 34 56 78" {...register('phone')} error={errors.phone?.message} />
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-emerald-300">{success}</p>}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={!isDirty || saving} className="gap-2">
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Sauvegarder
                </Button>
                <Button type="button" variant="ghost" onClick={() => reset({ name: user.name ?? '', phone: user.phone ?? '' })}>
                  Réinitialiser
                </Button>
              </div>
            </form>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-mint" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                <h2 className="text-lg font-semibold text-white">Changer d’adresse</h2>
              </div>
            </div>
            <form className="space-y-3" onSubmit={onEmailSubmit}>
              <Input label="Nouvel email" type="email" {...registerEmail('newEmail')} error={emailErrors.newEmail?.message} />
              <Input label="Confirmer le nouvel email" type="email" {...registerEmail('confirmEmail')} error={emailErrors.confirmEmail?.message} />
              {emailError && <p className="text-sm text-red-400">{emailError}</p>}
              {emailSuccess && <p className="text-sm text-emerald-300">{emailSuccess}</p>}
              <Button type="submit" disabled={emailSaving} className="gap-2">
                {emailSaving && <Loader2 size={16} className="animate-spin" />}
                <Send size={16} />
                Envoyer le lien de confirmation
              </Button>
            </form>
            <p className="text-xs text-slate-400">La modification prendra effet après validation du lien reçu sur la nouvelle adresse.</p>
          </div>

          <div className="card space-y-4">
            <div className="flex items-center gap-2">
              <LockKeyhole size={16} className="text-cyan-300" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sécurité</p>
                <h2 className="text-lg font-semibold text-white">Mettre à jour mon mot de passe</h2>
              </div>
            </div>
            <form className="space-y-3" onSubmit={onPasswordSubmit}>
              <Input
                label="Mot de passe actuel"
                type="password"
                {...registerPassword('currentPassword')}
                error={passwordErrors.currentPassword?.message}
              />
              <Input label="Nouveau mot de passe" type="password" {...registerPassword('newPassword')} error={passwordErrors.newPassword?.message} />
              <Input
                label="Confirmer le nouveau mot de passe"
                type="password"
                {...registerPassword('confirmPassword')}
                error={passwordErrors.confirmPassword?.message}
              />
              {passError && <p className="text-sm text-red-400">{passError}</p>}
              {passSuccess && <p className="text-sm text-emerald-300">{passSuccess}</p>}
              <Button type="submit" disabled={passSaving} className="gap-2">
                {passSaving && <Loader2 size={16} className="animate-spin" />}
                Mettre à jour
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
