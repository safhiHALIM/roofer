import { notFound } from 'next/navigation';
import { Product } from '@/types';
import { AddToCartButton } from '@/components/product-actions';

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    return null;
  }
}

export default async function ProductDetail({ params }: { params: { slug: string } }) {
  const product = await fetchProduct(params.slug);
  if (!product) return notFound();

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="card min-h-[320px]">
        <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-slate-800 to-slate-900" />
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-slate-300">{product.description}</p>
        <p className="text-2xl font-semibold text-mint">{product.price.toFixed(2)} €</p>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
