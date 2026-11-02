"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "@/types";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  maxCompare: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);
  const maxCompare = 4;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wf_compare_items");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed.slice(0, maxCompare));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("wf_compare_items", JSON.stringify(compareItems));
    } catch {
      // ignore
    }
  }, [compareItems]);

  const addToCompare = (product: Product): boolean => {
    if (compareItems.some((item) => item.id === product.id)) {
      return true;
    }
    if (compareItems.length >= maxCompare) {
      return false;
    }
    setCompareItems((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId: string) => {
    return compareItems.some((item) => item.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        maxCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
