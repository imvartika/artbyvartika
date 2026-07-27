import Image from "next/image";
import Reveal from "@/components/Reveal";
import HandTag from "@/components/HandTag";
import type { SiteSettings } from "@/lib/settings";

export default function AboutTeaser({ settings }: { settings: SiteSettings }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-10 sm:grid-cols-[1.1fr_1fr] sm:items-center">
        <Reveal>
          <HandTag color="sage" rotate={-2}>the artist</HandTag>
          <h2 className="mt-2 font-display text-3xl italic text-clay-900 sm:text-4xl">
            {settings.artistName} makes things with her hands.
          </h2>
          <p className="mt-5 text-clay-800/75">
            Clay figures shaped one coil at a time, poster-colour paintings
            that started as a blank page, sketches pulled straight out of a
            photograph, crochet stitched loop by loop, and a camera that
            never leaves her side. She films most of it for her YouTube
            channel — half the fun is watching it come together.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div
            className="relative mx-auto aspect-square max-w-sm bg-white p-3 shadow-[0_16px_40px_rgba(74,55,40,0.2)]"
            style={{ transform: "rotate(2deg)" }}
          >
            <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-2" />
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={settings.artistPhoto}
                alt={settings.artistName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 40vw"
              />
              <div className="grain-overlay opacity-[0.08]" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
