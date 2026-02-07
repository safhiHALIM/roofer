'use client';

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' };

export const Button: React.FC<Props> = ({ variant = 'primary', className, children, ...rest }) => {
  const base =
    'rounded-xl px-4 py-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-mint/40';
  const styles =
    variant === 'primary'
      ? 'bg-mint text-slate-900 hover:bg-green-500'
      : 'border border-white/20 text-white hover:border-white/40';
  return (
    <button className={clsx(base, styles, className)} {...rest}>
      {children}
    </button>
  );
};
