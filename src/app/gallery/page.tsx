import CraftCard from "@/components/home/CraftCard";
import Reveal from "@/components/Reveal";
import HandTag from "@/components/HandTag";
import { getCategories, getCategoryPreviewImage } from "@/lib/data";

export default async function GalleryPage() {
  const categories = await getCategories();
  const previews = await Promise.all(
    categories.map((c) => getCategoryPreviewImage(c.id)),
  );

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <HandTag color="terracotta" rotate={-2}>gallery</HandTag>
        <h1 className="mt-1 font-display text-4xl italic text-clay-900 sm:text-5xl">
          Everything, sorted by craft.
        </h1>
        <p className="mt-4 max-w-xl text-clay-800/70">
          Pick a craft to see the full collection — new pieces get added here
          as she finishes them.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, i) => (
          <CraftCard
            key={category.id}
            category={category}
            previewImage={previews[i]}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
