import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Product, sampleProducts } from '@/data/products';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface CartItem {
  product: Product;
  quantity: number;
}

interface ProductsContextType {
  products: Product[];
  favorites: string[];
  cart: CartItem[];
  compareList: string[];
  addToFavorites: (productId: string) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  getProductById: (productId: string) => Product | undefined;
  cartTotal: number;
  cartItemsCount: number;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products] = useState<Product[]>(sampleProducts);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  const getProductById = useCallback((productId: string) => {
    return products.find(p => p.id === productId);
  }, [products]);

  const addToFavorites = useCallback(async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }
    setFavorites(prev => [...prev, productId]);
    toast.success('Added to favorites');
  }, [user]);

  const removeFromFavorites = useCallback(async (productId: string) => {
    setFavorites(prev => prev.filter(id => id !== productId));
    toast.success('Removed from favorites');
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId);
  }, [favorites]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    toast.success('Added to cart');
  }, [user]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast.success('Removed from cart');
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const addToCompare = useCallback((productId: string) => {
    if (compareList.length >= 4) {
      toast.error('You can compare up to 4 products');
      return;
    }
    if (compareList.includes(productId)) {
      toast.info('Product already in comparison');
      return;
    }
    setCompareList(prev => [...prev, productId]);
    toast.success('Added to comparison');
  }, [compareList]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareList(prev => prev.filter(id => id !== productId));
    toast.success('Removed from comparison');
  }, []);

  const isInCompare = useCallback((productId: string) => {
    return compareList.includes(productId);
  }, [compareList]);

  const clearCompare = useCallback(() => {
    setCompareList([]);
  }, []);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ProductsContext.Provider
      value={{
        products,
        favorites,
        cart,
        compareList,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        getProductById,
        cartTotal,
        cartItemsCount,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
