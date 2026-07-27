import { notFound } from "next/navigation";
import Link from "next/link";
import ArtworkDetail from "@/components/shop/ArtworkDetail";
import { getArtworkById } from "@/lib/data";

export default async function ArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const artwork = await getArtworkById(id);

  if (!artwork) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <Link href="/shop" className="text-sm text-clay-500 hover:underline">
        ← Back to shop
      </Link>
      <div className="mt-8">
        <ArtworkDetail artwork={artwork} />
      </div>
    </div>
  );
}
