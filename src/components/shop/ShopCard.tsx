"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Artwork } from "@/lib/supabase/types";

const STATUS_LABEL: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export default function ShopCard({ artwork, index }: { artwork: Artwork; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link
        href={`/shop/${artwork.id}`}
        className="group block overflow-hidden rounded-3xl border border-clay-200/70 bg-white shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-square overflow-hidden bg-clay-100">
          {artwork.images[0] ? (
            <Image
              src={artwork.images[0]}
              alt={artwork.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-clay-500">
              no photo yet
            </div>
          )}
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
              artwork.status === "available"
                ? "bg-sage-500 text-white"
                : "bg-clay-800/80 text-white"
            }`}
          >
            {STATUS_LABEL[artwork.status] ?? artwork.status}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-display text-lg italic text-clay-800">{artwork.title}</h3>
          {artwork.price && (
            <p className="mt-1 text-sm text-clay-800/70">
              {artwork.currency} {artwork.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
