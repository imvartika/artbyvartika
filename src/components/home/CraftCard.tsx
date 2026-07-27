"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Category } from "@/lib/supabase/types";

const TEXTURES: Record<string, string> = {
  pottery: "from-clay-300 via-clay-200 to-paper-100",
  painting: "from-sage-300 via-ochre-300 to-paper-100",
  sketches: "from-clay-100 via-paper-100 to-clay-200",
  crochet: "from-ochre-300 via-clay-200 to-paper-100",
  photography: "from-clay-900 via-clay-700 to-clay-500",
  blender: "from-sage-600 via-sage-300 to-clay-100",
  other: "from-sage-500 via-sage-300 to-paper-100",
};

export default function CraftCard({
  category,
  previewImage,
  index,
}: {
  category: Category;
  previewImage: string | null;
  index: number;
}) {
  const gradient = TEXTURES[category.slug] ?? TEXTURES.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
    >
      <Link
        href={`/gallery/${category.slug}`}
        className="group block overflow-hidden rounded-3xl border border-clay-200/70 bg-white shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className={`relative h-56 overflow-hidden bg-gradient-to-br ${gradient}`}>
          {previewImage ? (
            <Image
              src={previewImage}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded-full bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-clay-700 backdrop-blur-sm">
                more coming soon
              </span>
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display text-xl italic text-clay-800">{category.name}</h3>
          <p className="mt-1 text-sm text-clay-800/60">{category.description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
