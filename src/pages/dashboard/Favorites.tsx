import { Heart } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

export default function Favorites() {
  const { favorites, getProductById } = useProducts();

  const favoriteProducts = favorites.map(id => getProductById(id)).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Favorites</h1>
        <p className="mt-1 text-muted-foreground">
          Your saved products ({favoriteProducts.length})
        </p>
      </div>

      {favoriteProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard key={product!.id} product={product!} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
          <div className="rounded-full bg-muted p-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">No favorites yet</h3>
          <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">
            Click the heart icon on products to add them to your favorites
          </p>
        </div>
      )}
    </div>
  );
}
