import { Heart, ShoppingCart, GitCompare, Star, Check } from 'lucide-react';
import { Product } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToCart,
    addToCompare,
    removeFromCompare,
    isInCompare,
  } = useProducts();

  const favorite = isFavorite(product.id);
  const inCompare = isInCompare(product.id);

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Stock Badge */}
        {!product.in_stock && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            Out of Stock
          </Badge>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <Button
            size="sm"
            variant={inCompare ? "default" : "secondary"}
            className="flex-1 gap-1.5"
            onClick={() => inCompare ? removeFromCompare(product.id) : addToCompare(product.id)}
          >
            {inCompare ? <Check className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
            {inCompare ? 'Added' : 'Compare'}
          </Button>
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm transition-all",
            favorite ? "text-destructive" : "text-muted-foreground hover:text-destructive"
          )}
          onClick={() => favorite ? removeFromFavorites(product.id) : addToFavorites(product.id)}
        >
          <Heart className={cn("h-4 w-4", favorite && "fill-current")} />
        </Button>
      </div>

      <CardContent className="p-4">
        {/* Category & Brand */}
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-normal">
            {product.category}
          </Badge>
          <span className="text-xs text-muted-foreground">{product.brand}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-card-foreground line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Quantity */}
        <p className="mt-1 text-sm text-muted-foreground">{product.quantity}</p>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews_count.toLocaleString()} reviews)
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border p-4">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-card-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <Button
          size="sm"
          disabled={!product.in_stock}
          onClick={() => addToCart(product)}
          className="gap-1.5"
        >
          <ShoppingCart className="h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
