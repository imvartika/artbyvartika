import PinboardHero from "@/components/home/PinboardHero";
import CraftCard from "@/components/home/CraftCard";
import AboutTeaser from "@/components/home/AboutTeaser";
import YoutubeSection from "@/components/home/YoutubeSection";
import CTASection from "@/components/home/CTASection";
import HandTag from "@/components/HandTag";
import { getCategories, getCategoryPreviewImage, getHeroImages } from "@/lib/data";
import { getSiteSettings } from "@/lib/settings";

export default async function Home() {
  const [categories, settings, heroImages] = await Promise.all([
    getCategories(),
    getSiteSettings(),
    getHeroImages(),
  ]);
  const previews = await Promise.all(
    categories.map((c) => getCategoryPreviewImage(c.id)),
  );

  return (
    <>
      <PinboardHero images={heroImages} />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 text-center">
          <HandTag color="sage" rotate={-2}>the collection</HandTag>
          <h2 className="mt-1 font-display text-3xl italic text-clay-900 sm:text-4xl">
            Six crafts, one pair of hands.
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <CraftCard
              key={category.id}
              category={category}
              previewImage={previews[i]}
              index={i}
            />
          ))}
        </div>
      </section>

      <AboutTeaser settings={settings} />
      <YoutubeSection settings={settings} />
      <CTASection />
    </>
  );
}
