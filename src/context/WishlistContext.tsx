'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  savedProductIds: string[];
  savedBookIds: string[];
  compareProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  isProductSaved: (productId: string) => boolean;
  toggleSaveBook: (bookId: string) => void;
  isBookSaved: (bookId: string) => boolean;
  toggleCompareProduct: (productId: string) => boolean;
  isProductInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  clearSaved: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [compareProductIds, setCompareProductIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage only after initial client mount to ensure SSR matches client hydration
  useEffect(() => {
    try {
      const savedProds = localStorage.getItem('ead_saved_products');
      if (savedProds) setSavedProductIds(JSON.parse(savedProds));
      const savedBks = localStorage.getItem('ead_saved_books');
      if (savedBks) setSavedBookIds(JSON.parse(savedBks));
      const compProds = localStorage.getItem('ead_compare_products');
      if (compProds) setCompareProductIds(JSON.parse(compProds));
    } catch {}
    setIsLoaded(true);
  }, []);

  // Sync to localStorage only after initial client load is complete
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ead_saved_products', JSON.stringify(savedProductIds));
    } catch {}
  }, [savedProductIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ead_saved_books', JSON.stringify(savedBookIds));
    } catch {}
  }, [savedBookIds, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('ead_compare_products', JSON.stringify(compareProductIds));
    } catch {}
  }, [compareProductIds, isLoaded]);

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const isProductSaved = (productId: string) => savedProductIds.includes(productId);

  const toggleSaveBook = (bookId: string) => {
    setSavedBookIds(prev => 
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  };

  const isBookSaved = (bookId: string) => savedBookIds.includes(bookId);

  const toggleCompareProduct = (productId: string): boolean => {
    if (compareProductIds.includes(productId)) {
      setCompareProductIds(prev => prev.filter(id => id !== productId));
      return false;
    }
    if (compareProductIds.length >= 4) {
      alert('You can compare up to 4 products at a time.');
      return false;
    }
    setCompareProductIds(prev => [...prev, productId]);
    return true;
  };

  const isProductInCompare = (productId: string) => compareProductIds.includes(productId);

  const clearCompare = () => setCompareProductIds([]);
  const clearSaved = () => {
    setSavedProductIds([]);
    setSavedBookIds([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        savedProductIds,
        savedBookIds,
        compareProductIds,
        toggleSaveProduct,
        isProductSaved,
        toggleSaveBook,
        isBookSaved,
        toggleCompareProduct,
        isProductInCompare,
        clearCompare,
        clearSaved
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
