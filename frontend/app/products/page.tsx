import Link from 'next/link';
import { Product } from '@/types';

async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Catalogue</h1>
        <span className="text-sm text-slate-300">{products.length} produits</span>
      </div>
      {products.length === 0 ? (
        <p className="text-slate-400">Aucun produit disponible.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="card hover:border-mint/40">
              <p className="text-lg font-semibold">{product.name}</p>
              <p className="mt-2 text-sm text-slate-300 line-clamp-3">{product.description}</p>
              <p className="mt-4 text-mint font-bold">{product.price.toFixed(2)} €</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
