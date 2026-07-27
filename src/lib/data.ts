import { createClient } from "@/lib/supabase/server";
import type { Artwork, Category } from "@/lib/supabase/types";

export async function getHeroImages(limit = 5): Promise<string[]> {
  const supabase = await createClient();
  // prefer featured pieces, then most recent — grab a varied handful with photos
  const { data } = await supabase
    .from("artworks")
    .select("images, is_featured, created_at")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(40);

  const urls: string[] = [];
  for (const row of data ?? []) {
    const first = row.images?.[0];
    if (first && !urls.includes(first)) urls.push(first);
    if (urls.length >= limit) break;
  }
  return urls;
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getCategories", error.message);
    return [];
  }
  return data ?? [];
}

export async function getCategoryPreviewImage(categoryId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artworks")
    .select("images")
    .eq("category_id", categoryId)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(10);

  const withImage = (data ?? []).find((row) => row.images?.length);
  return withImage?.images?.[0] ?? null;
}

export async function getArtworksByCategorySlug(slug: string): Promise<{
  category: Category | null;
  artworks: Artwork[];
}> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!category) return { category: null, artworks: [] };

  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")
    .eq("category_id", category.id)
    .order("sort_order", { ascending: true });

  return { category, artworks: artworks ?? [] };
}

export async function getShopArtworks(): Promise<Artwork[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("artworks")
    .select("*")
    .eq("is_for_sale", true)
    .in("status", ["available", "reserved", "sold"])
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("artworks").select("*").eq("id", id).maybeSingle();
  return data ?? null;
}
