import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product-card';

async function fetchProducts(category?: string): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/products${category ? `?category=${category}` : ''}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams?: { category?: string } }) {
  const selectedSlug = searchParams?.category;
  const [products, categories] = await Promise.all([fetchProducts(selectedSlug), fetchCategories()]);
  const selectedCategory = categories.find((c) => c.slug === selectedSlug);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mint">Catalogue</p>
          <h1 className="text-3xl font-bold text-white">Nos modèles et équipements</h1>
          <p className="text-sm text-slate-400">
            {selectedCategory ? `Catégorie : ${selectedCategory.name}` : 'Toutes les catégories'}
          </p>
        </div>
        <span className="text-sm text-slate-400">{products.length} produits</span>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <a
            href="/products"
            className={`rounded-full border px-3 py-1 text-sm transition ${
              !selectedSlug ? 'border-mint text-mint' : 'border-white/10 text-slate-200 hover:border-mint/60'
            }`}
          >
            Toutes
          </a>
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                selectedSlug === cat.slug ? 'border-mint text-mint' : 'border-white/10 text-slate-200 hover:border-mint/60'
              }`}
            >
              {cat.name}
            </a>
          ))}
        </div>
      )}

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
