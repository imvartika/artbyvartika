export type ArtworkStatus = "showcase" | "available" | "reserved" | "sold";
export type OrderType = "buy" | "commission";
export type OrderStatus = "new" | "contacted" | "confirmed" | "completed" | "cancelled";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
};

export type Artwork = {
  id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  images: string[];
  is_for_sale: boolean;
  price: number | null;
  currency: string;
  status: ArtworkStatus;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ArtworkWithCategory = Artwork & { category: Category | null };

export type OrderRequest = {
  id: string;
  artwork_id: string | null;
  type: OrderType;
  buyer_name: string;
  buyer_email: string | null;
  buyer_phone: string | null;
  message: string | null;
  budget_range: string | null;
  reference_url: string | null;
  status: OrderStatus;
  created_at: string;
};
