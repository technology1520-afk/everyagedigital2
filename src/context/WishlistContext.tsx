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
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedProds = localStorage.getItem('ead_saved_products');
      return savedProds ? JSON.parse(savedProds) : [];
    } catch {
      return [];
    }
  });

  const [savedBookIds, setSavedBookIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedBks = localStorage.getItem('ead_saved_books');
      return savedBks ? JSON.parse(savedBks) : [];
    } catch {
      return [];
    }
  });

  const [compareProductIds, setCompareProductIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const compProds = localStorage.getItem('ead_compare_products');
      return compProds ? JSON.parse(compProds) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('ead_saved_products', JSON.stringify(savedProductIds));
    } catch {}
  }, [savedProductIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ead_saved_books', JSON.stringify(savedBookIds));
    } catch {}
  }, [savedBookIds]);

  useEffect(() => {
    try {
      localStorage.setItem('ead_compare_products', JSON.stringify(compareProductIds));
    } catch {}
  }, [compareProductIds]);

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
