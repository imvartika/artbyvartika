"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveArtwork, deleteArtwork } from "@/lib/admin-actions";
import type { Artwork, Category } from "@/lib/supabase/types";

export default function ArtworkForm({
  categories,
  artwork,
}: {
  categories: Category[];
  artwork?: Artwork;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(artwork?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isForSale, setIsForSale] = useState(artwork?.is_for_sale ?? false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("artwork-images").upload(path, file);

      if (error) {
        toast.error(`Upload failed: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from("artwork-images").getPublicUrl(path);
      setImages((prev) => [...prev, data.publicUrl]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const priceRaw = form.get("price");

    const result = await saveArtwork({
      id: artwork?.id,
      categoryId: (form.get("categoryId") as string) || null,
      title: String(form.get("title") || ""),
      description: String(form.get("description") || ""),
      images,
      isForSale: isForSale,
      price: priceRaw ? Number(priceRaw) : null,
      currency: "INR",
      status: form.get("status") as Artwork["status"],
      isFeatured: form.get("isFeatured") === "on",
    });

    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Saved");
    router.push("/admin");
  }

  async function handleDelete() {
    if (!artwork) return;
    if (!confirm(`Delete "${artwork.title}"? This can't be undone.`)) return;
    await deleteArtwork(artwork.id);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block text-sm text-clay-800">
          Photos
          <div className="mt-2 flex flex-wrap gap-3">
            {images.map((src) => (
              <div key={src} className="relative h-24 w-24 overflow-hidden rounded-xl border border-clay-200">
                <Image src={src} alt="" fill className="object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => setImages((prev) => prev.filter((s) => s !== src))}
                  className="absolute right-1 top-1 rounded-full bg-clay-950/70 p-1 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-24 w-24 flex-col items-center justify-center rounded-xl border border-dashed border-clay-300 text-clay-500 hover:border-clay-500"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : "+ Add"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </label>
      </div>

      <label className="block text-sm text-clay-800">
        Title
        <input
          name="title"
          required
          defaultValue={artwork?.title}
          className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
        />
      </label>

      <label className="block text-sm text-clay-800">
        Description
        <textarea
          name="description"
          rows={3}
          defaultValue={artwork?.description ?? ""}
          className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-clay-800">
          Category
          <select
            name="categoryId"
            defaultValue={artwork?.category_id ?? ""}
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          >
            <option value="">— none —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm text-clay-800">
          Status
          <select
            name="status"
            defaultValue={artwork?.status ?? "showcase"}
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          >
            <option value="showcase">Showcase only</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-clay-800">
          <input
            type="checkbox"
            checked={isForSale}
            onChange={(e) => setIsForSale(e.target.checked)}
          />
          For sale in shop
        </label>
        <label className="flex items-center gap-2 text-sm text-clay-800">
          <input type="checkbox" name="isFeatured" defaultChecked={artwork?.is_featured} />
          Featured (used as category preview)
        </label>
      </div>

      {isForSale && (
        <label className="block text-sm text-clay-800">
          Price (₹)
          <input
            name="price"
            type="number"
            step="0.01"
            defaultValue={artwork?.price ?? ""}
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          />
        </label>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-clay-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-700 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {artwork && (
          <button
            type="button"
            onClick={handleDelete}
            className="text-sm text-clay-800/60 hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
