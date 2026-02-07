import { Product } from '@/types';
import { ProductCard } from '@/components/product-card';

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
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mint">Catalogue</p>
          <h1 className="text-3xl font-bold text-white">Nos modèles et équipements</h1>
        </div>
        <span className="text-sm text-slate-400">{products.length} produits</span>
      </div>
      {products.length === 0 ? (
        <p className="text-slate-400">Aucun produit disponible.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
