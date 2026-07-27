import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: artwork }, { data: categories }] = await Promise.all([
    supabase.from("artworks").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order", { ascending: true }),
  ]);

  if (!artwork) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl italic text-clay-900">Edit artwork</h1>
      <div className="mt-6">
        <ArtworkForm categories={categories ?? []} artwork={artwork} />
      </div>
    </div>
  );
}
