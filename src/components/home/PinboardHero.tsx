"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const ACCENT = "#b1482a";
const INK = "#3f362e";

// desktop collage slots — tucked toward the corners so the headline has room
const SLOTS = [
  { className: "left-0 top-6 h-[240px] w-[186px]", rotate: "-5deg", tape: "-top-3 left-1/2 -translate-x-1/2 -rotate-2" },
  { className: "left-[150px] top-[254px] h-[206px] w-[158px]", rotate: "4.5deg", tape: "-top-3 left-6 -rotate-6" },
  { className: "right-2 top-2 h-[206px] w-[238px]", rotate: "5deg", tape: "-top-3 right-8 rotate-3" },
  { className: "right-[64px] top-[266px] h-[202px] w-[156px]", rotate: "-3.5deg", tape: "-top-3 left-1/2 -translate-x-1/2 rotate-2" },
];

function Underline({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 220 12" className={className} style={style} fill="none" aria-hidden>
      <path d="M3 8c40-5 120-6 214-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function TapedPhoto({ src, tape, priority }: { src: string; tape: string; priority?: boolean }) {
  return (
    <div className="relative h-full w-full bg-white p-2 shadow-[0_12px_32px_rgba(74,55,40,0.22)]">
      <span className={`tape ${tape}`} />
      <div className="relative h-full w-full overflow-hidden">
        <Image src={src} alt="" fill className="object-cover" sizes="260px" priority={priority} />
        <div className="grain-overlay opacity-[0.08]" />
      </div>
    </div>
  );
}

export default function PinboardHero({ images }: { images: string[] }) {
  const reduce = useReducedMotion();
  const imgs = images.length ? images : [];

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="watercolor relative overflow-hidden">
      <div className="grain-overlay opacity-[0.07]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-10 sm:pb-20 sm:pt-14">
        {/* ── desktop collage ── */}
        <div className="relative hidden h-[560px] sm:block">
          {SLOTS.map((s, i) =>
            imgs[i] ? (
              <motion.div
                key={i}
                className={`absolute ${s.className}`}
                style={{ transform: `rotate(${s.rotate})` }}
                {...rise(0.15 + i * 0.1)}
              >
                <TapedPhoto src={imgs[i]} tape={s.tape} priority={i < 2} />
              </motion.div>
            ) : null,
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <motion.p className="font-hand text-3xl" style={{ color: ACCENT, transform: "rotate(-3deg)" }} {...rise(0)}>
              made by hand
            </motion.p>
            <motion.h1 className="font-display mt-1 max-w-3xl text-6xl font-medium leading-[0.95] text-clay-950 lg:text-7xl" {...rise(0.08)}>
              clay, colour, thread
              <br />&amp; a little{" "}
              <span className="relative italic" style={{ color: ACCENT }}>
                magic
                <Underline className="absolute -bottom-4 left-0 w-full" style={{ color: ACCENT }} />
              </span>
            </motion.h1>
            <motion.div className="mt-10 flex items-center gap-5" {...rise(0.2)}>
              <Link
                href="/gallery"
                className="rounded-full px-7 py-3 text-sm font-medium text-white shadow-sm transition-transform hover:-translate-y-0.5"
                style={{ background: ACCENT }}
              >
                See the collection
              </Link>
              <Link href="/commission" className="font-hand text-2xl transition-colors hover:opacity-70" style={{ color: INK }}>
                or commission one →
              </Link>
            </motion.div>
          </div>
        </div>

        {/* ── mobile: clean vertical stack ── */}
        <div className="sm:hidden">
          <motion.p className="font-hand text-2xl" style={{ color: ACCENT, transform: "rotate(-2deg)" }} {...rise(0)}>
            made by hand
          </motion.p>
          <motion.h1 className="font-display mt-1 text-5xl font-medium leading-[0.96] text-clay-950" {...rise(0.06)}>
            clay, colour, thread &amp; a little{" "}
            <span className="relative italic" style={{ color: ACCENT }}>
              magic
              <Underline className="absolute -bottom-3 left-0 w-full" style={{ color: ACCENT }} />
            </span>
          </motion.h1>

          <motion.div className="mt-8 flex gap-3 overflow-hidden" {...rise(0.15)}>
            {imgs.slice(0, 3).map((src, i) => (
              <div
                key={i}
                className="relative h-40 flex-1"
                style={{ transform: `rotate(${[-3, 2, -1.5][i]}deg)` }}
              >
                <TapedPhoto src={src} tape="-top-3 left-1/2 -translate-x-1/2 -rotate-3" priority={i === 0} />
              </div>
            ))}
          </motion.div>

          <motion.div className="mt-10 flex flex-col items-start gap-3" {...rise(0.25)}>
            <Link
              href="/gallery"
              className="rounded-full px-7 py-3 text-sm font-medium text-white shadow-sm"
              style={{ background: ACCENT }}
            >
              See the collection
            </Link>
            <Link href="/commission" className="font-hand text-2xl" style={{ color: INK }}>
              or commission one →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
