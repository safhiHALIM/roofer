"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { z } from 'zod';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { api, setAuthToken } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AdminLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // hide navbar by forcing a minimal layout (page-level wrapper)
  useEffect(() => {
    document.body.style.background = '#0b1220';
    return () => {
      document.body.style.background = '';
    };
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.user.role !== 'ADMIN') {
        setError('Accès réservé aux administrateurs.');
        setLoading(false);
        return;
      }
      setAuth({ user: res.data.user, token: res.data.token });
      setAuthToken(res.data.token);
      router.push('/admin');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Connexion impossible');
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_16px_50px_rgba(0,0,0,0.3)]">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-mint">Panel Admin</p>
          <h1 className="text-2xl font-bold text-white">Connexion</h1>
          <p className="text-sm text-slate-400">Entrer vos identifiants administrateur.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Mot de passe" type="password" {...register('password')} error={errors.password?.message} />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          {error && <p className="text-center text-sm text-red-400">{error}</p>}
        </form>
      </div>
    </div>
  );
}
