"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "@/components/gallery/Lightbox";
import type { Artwork } from "@/lib/supabase/types";

export default function ArtworkGrid({ artworks }: { artworks: Artwork[] }) {
  const flatImages = artworks.flatMap((a) => a.images.map((src) => ({ src, artwork: a })));
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (flatImages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-clay-300 bg-paper-100 p-16 text-center">
        <p className="font-display text-xl italic text-clay-700">
          More coming soon
        </p>
        <p className="mt-2 text-sm text-clay-800/60">
          She hasn&rsquo;t added photos to this craft yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {flatImages.map(({ src, artwork }, i) => (
          <motion.button
            key={`${artwork.id}-${i}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.06 }}
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-clay-100"
          >
            <Image
              src={src}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-clay-950/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
              <p className="p-3 text-sm font-medium text-paper-50">{artwork.title}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <Lightbox
        images={flatImages.map((f) => f.src)}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </>
  );
}
