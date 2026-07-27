"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const artworkSchema = z.object({
  id: z.string().uuid().optional(),
  categoryId: z.string().uuid().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().or(z.literal("")),
  images: z.array(z.string().url()).default([]),
  isForSale: z.boolean(),
  price: z.number().nullable(),
  currency: z.string().default("INR"),
  status: z.enum(["showcase", "available", "reserved", "sold"]),
  isFeatured: z.boolean(),
});

export type ArtworkInput = z.infer<typeof artworkSchema>;

export async function saveArtwork(input: ArtworkInput) {
  const parsed = artworkSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const row = {
    category_id: parsed.data.categoryId,
    title: parsed.data.title,
    description: parsed.data.description || null,
    images: parsed.data.images,
    is_for_sale: parsed.data.isForSale,
    price: parsed.data.price,
    currency: parsed.data.currency,
    status: parsed.data.status,
    is_featured: parsed.data.isFeatured,
    updated_at: new Date().toISOString(),
  };

  const { error, data } = parsed.data.id
    ? await supabase.from("artworks").update(row).eq("id", parsed.data.id).select("id").single()
    : await supabase.from("artworks").insert(row).select("id").single();

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/gallery");
  revalidatePath("/shop");
  revalidatePath("/");

  return { ok: true as const, id: data.id };
}

export async function deleteArtwork(id: string) {
  const supabase = await createClient();
  await supabase.from("artworks").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/gallery");
  revalidatePath("/shop");
  redirect("/admin");
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("order_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/inbox");
}

const settingsSchema = z.object({
  artistName: z.string().min(1, "Name is required"),
  aboutText: z.string().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),
  artistPhoto: z.string().url().optional().or(z.literal("")),
  birthdayName: z.string().optional().or(z.literal("")),
  birthdayMessage: z.string().optional().or(z.literal("")),
  birthdayAlwaysOn: z.boolean(),
});

export type SiteSettingsInput = z.infer<typeof settingsSchema>;

export async function saveSiteSettings(input: SiteSettingsInput) {
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    artist_name: parsed.data.artistName,
    about_text: parsed.data.aboutText || null,
    contact_email: parsed.data.contactEmail || null,
    instagram_url: parsed.data.instagramUrl || null,
    youtube_url: parsed.data.youtubeUrl || null,
    artist_photo: parsed.data.artistPhoto || null,
    birthday_name: parsed.data.birthdayName || null,
    birthday_message: parsed.data.birthdayMessage || null,
    birthday_always_on: parsed.data.birthdayAlwaysOn,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true as const };
}
