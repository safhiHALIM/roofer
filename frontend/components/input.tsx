'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };

export const Input = forwardRef<HTMLInputElement, Props>(({ label, error, className, ...rest }, ref) => (
  <label className="block space-y-2">
    {label && <span className="text-sm text-slate-200">{label}</span>}
    <input
      ref={ref}
      className={clsx(
        'w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-white placeholder:text-slate-400 focus:border-mint focus:outline-none',
        className,
      )}
      {...rest}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </label>
));

Input.displayName = 'Input';
