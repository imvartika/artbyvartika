import { createClient } from "@/lib/supabase/server";
import ArtworkForm from "@/components/admin/ArtworkForm";

export default async function NewArtworkPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="font-display text-2xl italic text-clay-900">Add new artwork</h1>
      <div className="mt-6">
        <ArtworkForm categories={categories ?? []} />
      </div>
    </div>
  );
}
