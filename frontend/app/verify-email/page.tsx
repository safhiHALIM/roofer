'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Button } from '@/components/button';

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token manquant');
      return;
    }
    api
      .get('/auth/verify-email', { params: { token } })
      .then(() => {
        setStatus('success');
        setMessage('Email vérifié. Vous pouvez vous connecter.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err?.response?.data?.message || 'Vérification impossible');
      });
  }, [params]);

  return (
    <div className="mx-auto max-w-lg space-y-4 text-center">
      <h1 className="text-3xl font-bold">Vérification email</h1>
      <p className="text-slate-300">Nous sécurisons l'accès par confirmation.</p>
      <div className="card space-y-3">
        <p className={status === 'success' ? 'text-mint' : 'text-red-300'}>{message}</p>
        {status === 'success' && (
          <Button onClick={() => router.push('/login')} className="w-full">
            Aller à la connexion
          </Button>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<p className="text-center text-slate-300">Chargement...</p>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
