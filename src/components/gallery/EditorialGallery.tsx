"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import type { Artwork } from "@/lib/supabase/types";
import type { CraftIdentity } from "@/lib/craft-identity";

// varied aspect ratios so the masonry reads as a curated gallery with rhythm,
// not a uniform inventory grid. Cycles across the pieces.
const RATIOS = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/4]",
  "aspect-[4/3]",
  "aspect-[5/6]",
  "aspect-square",
  "aspect-[3/4]",
];

// small, fixed tilts so pieces feel set down by hand (not random per render)
const TILT = [-1.4, 0.9, -0.6, 1.2, -1.1, 0.5, 1.5];

export default function EditorialGallery({
  artworks,
  identity,
}: {
  artworks: Artwork[];
  identity: CraftIdentity;
}) {
  const reduce = useReducedMotion();
  const [openId, setOpenId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const withImages = artworks.filter((a) => a.images.length > 0);
  const active = withImages.find((a) => a.id === openId) ?? null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight") setStep((s) => (s + 1) % active.images.length);
      if (e.key === "ArrowLeft")
        setStep((s) => (s - 1 + active.images.length) % active.images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  function open(id: string) {
    setOpenId(id);
    setStep(0);
  }

  if (withImages.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-clay-300 bg-paper-100 p-16 text-center">
        <p className="font-display text-xl italic text-clay-700">More coming soon</p>
        <p className="mt-2 text-sm text-clay-800/60">
          She hasn&rsquo;t added photos to this craft yet — check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="gap-6 [column-gap:1.5rem] columns-1 sm:columns-2 lg:columns-3">
        {withImages.map((art, i) => {
          const ratio = RATIOS[i % RATIOS.length];
          const tilt = reduce ? 0 : TILT[i % TILT.length];
          const isProcess = art.images.length > 1;

          return (
            <motion.figure
              key={art.id}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-6 break-inside-avoid"
            >
              {/* stacked "process" layers peeking behind multi-image pieces */}
              {isProcess && !reduce && (
                <>
                  <span className="absolute inset-0 -z-10 translate-x-2 translate-y-2 rotate-2 rounded-2xl bg-white/70 shadow-sm transition-transform duration-500 group-hover:translate-x-3 group-hover:translate-y-3" />
                  <span className="absolute inset-0 -z-20 translate-x-4 translate-y-4 rotate-3 rounded-2xl bg-white/40" />
                </>
              )}

              <button
                onClick={() => open(art.id)}
                style={{ ["--tilt" as string]: `${tilt}deg` }}
                className="relative block w-full rounded-2xl bg-white p-2 shadow-[0_2px_20px_rgba(74,55,40,0.08)] transition-all duration-500 [transform:rotate(var(--tilt))] hover:-translate-y-1.5 hover:rotate-0 hover:shadow-[0_18px_40px_rgba(74,55,40,0.18)]"
              >
                <div className={`relative w-full overflow-hidden rounded-xl bg-clay-100 ${ratio}`}>
                  <div className="grain-overlay z-10 opacity-[0.07]" />
                  <Image
                    src={art.images[0]}
                    alt={art.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {isProcess && (
                    <span
                      className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
                      style={{ color: identity.accent }}
                    >
                      <Layers size={12} /> {art.images.length} steps
                    </span>
                  )}
                </div>
                <figcaption className="flex items-baseline justify-between px-1 pb-1 pt-3">
                  <span className="font-display text-lg italic text-clay-800">{art.title}</span>
                  {isProcess && (
                    <span className="font-hand text-lg text-clay-500">the making of →</span>
                  )}
                </figcaption>
              </button>
            </motion.figure>
          );
        })}
      </div>

      {/* process / detail viewer */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex flex-col bg-clay-950/92 px-4 py-6 backdrop-blur-sm"
            onClick={() => setOpenId(null)}
          >
            <div className="flex items-center justify-between text-paper-50/90">
              <div>
                <p className="font-display text-xl italic">{active.title}</p>
                {active.images.length > 1 && (
                  <p className="font-hand text-lg text-paper-50/70">
                    the making of · step {step + 1} of {active.images.length}
                  </p>
                )}
              </div>
              <button onClick={() => setOpenId(null)} aria-label="Close" className="hover:text-paper-50">
                <X size={26} />
              </button>
            </div>

            <div
              className="relative flex flex-1 items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {active.images.length > 1 && (
                <button
                  aria-label="Previous step"
                  onClick={() =>
                    setStep((s) => (s - 1 + active.images.length) % active.images.length)
                  }
                  className="absolute left-0 z-10 text-paper-50/70 hover:text-paper-50"
                >
                  <ChevronLeft size={34} />
                </button>
              )}

              <motion.div
                key={step}
                initial={reduce ? false : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative h-full w-full max-w-4xl"
              >
                <Image
                  src={active.images[step]}
                  alt={`${active.title} — step ${step + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </motion.div>

              {active.images.length > 1 && (
                <button
                  aria-label="Next step"
                  onClick={() => setStep((s) => (s + 1) % active.images.length)}
                  className="absolute right-0 z-10 text-paper-50/70 hover:text-paper-50"
                >
                  <ChevronRight size={34} />
                </button>
              )}
            </div>

            {active.description && (
              <p className="mx-auto max-w-2xl text-center text-sm text-paper-50/70">
                {active.description}
              </p>
            )}

            {active.images.length > 1 && (
              <div className="mx-auto mt-3 flex gap-2" onClick={(e) => e.stopPropagation()}>
                {active.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setStep(i)}
                    className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-opacity ${
                      i === step ? "opacity-100" : "border-transparent opacity-50"
                    }`}
                    style={{ borderColor: i === step ? identity.accent : "transparent" }}
                  >
                    <Image src={src} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
