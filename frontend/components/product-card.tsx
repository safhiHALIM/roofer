import Link from 'next/link';
import { Product } from '@/types';
import { ArrowRight } from 'lucide-react';

export const ProductCard = ({ product }: { product: Product }) => (
  <Link
    href={`/products/${product.slug}`}
    className="group flex h-full flex-col rounded-2xl border border-black/5 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
  >
    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-slate-100 to-slate-50">
      {/* Placeholder; replace with product images when available */}
    </div>
    <div className="mt-4 flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 text-slate-400 transition group-hover:text-mint" />
    </div>
    <p className="mt-3 text-lg font-semibold text-mint">{product.price.toFixed(2)} €</p>
  </Link>
);
