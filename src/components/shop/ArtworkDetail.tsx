"use client";

import { useState } from "react";
import Image from "next/image";
import RequestForm from "@/components/shop/RequestForm";
import type { Artwork } from "@/lib/supabase/types";

export default function ArtworkDetail({ artwork }: { artwork: Artwork }) {
  const [activeImage, setActiveImage] = useState(0);
  const [reserving, setReserving] = useState(false);

  return (
    <div className="grid gap-10 sm:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-clay-100">
          {artwork.images[activeImage] ? (
            <Image
              src={artwork.images[activeImage]}
              alt={artwork.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-clay-500">
              no photo yet
            </div>
          )}
        </div>
        {artwork.images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {artwork.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 ${
                  i === activeImage ? "border-clay-500" : "border-transparent"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl italic text-clay-900">{artwork.title}</h1>
        {artwork.price && (
          <p className="mt-2 text-xl text-clay-700">
            {artwork.currency} {artwork.price.toLocaleString("en-IN")}
          </p>
        )}
        {artwork.description && (
          <p className="mt-4 text-clay-800/75">{artwork.description}</p>
        )}

        <div className="mt-8">
          {artwork.status === "available" && !reserving && (
            <button
              onClick={() => setReserving(true)}
              className="rounded-full bg-clay-600 px-7 py-3 text-sm font-medium text-white hover:bg-clay-700"
            >
              Reserve this piece
            </button>
          )}

          {artwork.status !== "available" && (
            <p className="rounded-2xl bg-paper-100 px-5 py-4 text-sm text-clay-800/70">
              This piece is {artwork.status}. Want something similar?{" "}
              <a href="/commission" className="text-clay-600 underline">
                Commission one
              </a>
              .
            </p>
          )}

          {reserving && (
            <div className="mt-2 rounded-2xl border border-clay-200 bg-white p-6">
              <RequestForm type="buy" artworkId={artwork.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
