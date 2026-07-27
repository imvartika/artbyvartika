import Link from "next/link";
import Reveal from "@/components/Reveal";
import ShopCard from "@/components/shop/ShopCard";
import HandTag from "@/components/HandTag";
import { getShopArtworks } from "@/lib/data";

export default async function ShopPage() {
  const artworks = await getShopArtworks();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <HandTag color="terracotta" rotate={-2}>shop</HandTag>
        <h1 className="mt-1 font-display text-4xl italic text-clay-900 sm:text-5xl">
          Take a piece home.
        </h1>
        <p className="mt-4 max-w-xl text-clay-800/70">
          Each piece is one of a kind — once it&rsquo;s reserved, it&rsquo;s gone.
          Don&rsquo;t see what you&rsquo;re after?{" "}
          <Link href="/commission" className="text-clay-600 underline">
            Commission one
          </Link>
          .
        </p>
      </Reveal>

      {artworks.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-clay-300 bg-paper-100 p-16 text-center">
          <p className="font-hand text-3xl text-clay-600" style={{ transform: "rotate(-1deg)" }}>
            the shop is empty for now… ✎
          </p>
          <p className="mt-3 text-sm text-clay-800/60">
            Check back soon, or request a custom piece in the meantime.
          </p>
        </div>
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork, i) => (
            <ShopCard key={artwork.id} artwork={artwork} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
