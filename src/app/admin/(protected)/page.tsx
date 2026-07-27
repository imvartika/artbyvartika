import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { Artwork } from "@/lib/supabase/types";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: artworks } = await supabase
    .from("artworks")
    .select("*")
    .order("created_at", { ascending: false });

  const rows: Artwork[] = artworks ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl italic text-clay-900">Artworks</h1>
        <Link
          href="/admin/new"
          className="rounded-full bg-clay-600 px-5 py-2 text-sm font-medium text-white hover:bg-clay-700"
        >
          + Add new
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-clay-800/60">Nothing here yet — add your first piece.</p>
      ) : (
        <div className="mt-6 grid gap-3">
          {rows.map((a) => (
            <Link
              key={a.id}
              href={`/admin/${a.id}/edit`}
              className="flex items-center gap-4 rounded-2xl border border-clay-200 bg-white p-4 hover:border-clay-400"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-clay-100">
                {a.images[0] && <Image src={a.images[0]} alt="" fill className="object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-clay-900">{a.title}</p>
                <p className="text-xs text-clay-800/60">
                  {a.status}
                  {a.is_for_sale && a.price ? ` · ₹${a.price}` : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
