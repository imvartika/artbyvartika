"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-clay-950/90 px-4"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 text-paper-50/80 hover:text-paper-50"
          >
            <X size={28} />
          </button>

          {images.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-paper-50/80 hover:text-paper-50"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((index + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-paper-50/80 hover:text-paper-50"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <motion.div
            key={images[index]}
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative h-[80vh] w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt=""
              fill
              className="object-contain"
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
