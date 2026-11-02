export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website: string;
  shopifyDomain?: string;
  saleUrl: string;
  primaryColor: string;
  active: boolean;
  totalDeals: number;
}

export interface PriceHistoryItem {
  date: string;
  price: number;
  salePrice: number;
}

export interface Product {
  id: string;
  brandId: string;
  brandName: string;
  title: string;
  handle: string;
  originalPrice: number;
  salePrice: number;
  discountPct: number;
  imageUrl: string;
  category: "unstitched" | "pret" | "festive" | "western" | "accessories";
  fabric?: string;
  pieceCount?: "1 Piece" | "2 Piece" | "3 Piece";
  productUrl: string;
  isLowestPrice: boolean;
  onSale: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
  priceHistory: PriceHistoryItem[];
}

export interface FilterState {
  searchQuery: string;
  selectedBrand: string;
  selectedCategory: string;
  minDiscount: number;
  maxPrice: number;
  sortBy: "discount-desc" | "price-asc" | "price-desc" | "newest";
  onlyLowestEver: boolean;
  pieceFilter: string;
}
