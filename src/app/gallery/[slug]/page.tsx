import { notFound } from "next/navigation";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import EditorialGallery from "@/components/gallery/EditorialGallery";
import { getArtworksByCategorySlug } from "@/lib/data";
import { craftIdentity } from "@/lib/craft-identity";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { category, artworks } = await getArtworksByCategorySlug(slug);

  if (!category) notFound();

  const identity = craftIdentity(slug);
  const count = artworks.filter((a) => a.images.length > 0).length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {/* editorial cover */}
      <div
        className="relative overflow-hidden rounded-[2rem] px-8 py-16 sm:px-14 sm:py-20"
        style={{ background: `linear-gradient(135deg, ${identity.tint}55, transparent 70%)` }}
      >
        <div className="grain-overlay opacity-[0.06]" />
        <Reveal>
          <Link href="/gallery" className="text-sm text-clay-600 hover:underline">
            ← All crafts
          </Link>
          <div
            className="mt-5 h-px w-16"
            style={{ background: identity.accent }}
            aria-hidden
          />
          <h1 className="mt-5 font-display text-5xl italic leading-none text-clay-900 sm:text-7xl">
            {category.name}
          </h1>
          <p
            className="font-hand mt-3 text-2xl"
            style={{ color: identity.accent, transform: "rotate(-1.5deg)" }}
          >
            {identity.verb}
          </p>
          {category.description && (
            <p className="mt-5 max-w-md text-clay-800/75">{category.description}</p>
          )}
          {count > 0 && (
            <p className="font-hand mt-6 text-lg text-clay-800/50">
              {count} {count === 1 ? "piece" : "pieces"} so far
            </p>
          )}
        </Reveal>
      </div>

      <div className="mt-12">
        <EditorialGallery artworks={artworks} identity={identity} />
      </div>
    </div>
  );
}
