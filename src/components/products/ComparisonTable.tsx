import { X, ShoppingCart, Star, Check, Minus } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export function ComparisonTable() {
  const { compareList, getProductById, removeFromCompare, clearCompare, addToCart } = useProducts();

  const products = compareList.map(id => getProductById(id)).filter(Boolean);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 py-16">
        <div className="rounded-full bg-muted p-4">
          <Minus className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No products to compare</h3>
        <p className="mt-1 text-sm text-muted-foreground text-center max-w-md">
          Add products to compare by clicking the "Compare" button on product cards
        </p>
      </div>
    );
  }

  const comparisonRows = [
    { label: 'Brand', key: 'brand' },
    { label: 'Category', key: 'category' },
    { label: 'Price', key: 'price', format: (v: number) => `$${v.toFixed(2)}` },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Rating', key: 'rating', format: (v: number) => `${v} / 5` },
    { label: 'Reviews', key: 'reviews_count', format: (v: number) => v.toLocaleString() },
    { label: 'Ingredients', key: 'ingredients' },
    { label: 'In Stock', key: 'in_stock', format: (v: boolean) => v ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compare Products</h1>
          <p className="mt-1 text-muted-foreground">
            Comparing {products.length} product{products.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" onClick={clearCompare}>
          Clear All
        </Button>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Product Headers */}
          <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}>
            <div /> {/* Empty cell for row labels */}
            {products.map((product) => (
              <Card key={product!.id} className="relative overflow-hidden">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeFromCompare(product!.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardHeader className="pb-2">
                  <div className="aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                    <img
                      src={product!.image_url}
                      alt={product!.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-card-foreground line-clamp-2">
                    {product!.name}
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    className="w-full gap-2"
                    disabled={!product!.in_stock}
                    onClick={() => addToCart(product!)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Rows */}
          <div className="mt-6 rounded-lg border border-border bg-card overflow-hidden">
            {comparisonRows.map((row, index) => (
              <div
                key={row.key}
                className="grid gap-4 border-b border-border last:border-b-0"
                style={{ gridTemplateColumns: `200px repeat(${products.length}, 1fr)` }}
              >
                <div className="flex items-center bg-muted/50 px-4 py-3 font-medium text-foreground">
                  {row.label}
                </div>
                {products.map((product) => {
                  const value = product![row.key as keyof typeof product];
                  const displayValue = row.format ? (row.format as (v: any) => string)(value) : value;

                  return (
                    <div
                      key={product!.id}
                      className="flex items-center px-4 py-3 text-sm text-card-foreground"
                    >
                      {row.key === 'rating' ? (
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span>{displayValue}</span>
                        </div>
                      ) : row.key === 'in_stock' ? (
                        <Badge variant={value ? 'default' : 'destructive'}>
                          {displayValue}
                        </Badge>
                      ) : row.key === 'price' ? (
                        <span className="text-lg font-bold">{displayValue}</span>
                      ) : (
                        <span className="line-clamp-3">{String(displayValue)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
