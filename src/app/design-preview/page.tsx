import Image from "next/image";
import type { Metadata } from "next";

// Hidden proposal page — not linked from nav, not indexed. Safe to delete.
export const metadata: Metadata = {
  title: "Design directions — Vartika Collection",
  robots: { index: false, follow: false },
};

const BASE =
  "https://cbsdnaeroopayopohpra.supabase.co/storage/v1/object/public/artwork-images";
const IMG = {
  fox: `${BASE}/painting-fox-on-canvas-0.png`,
  crochet: `${BASE}/crochet-crochet-flower-bouquet-0.jpeg`,
  teddy: `${BASE}/blender-teddy-bear-0.png`,
  flowers: `${BASE}/photography-world-of-flowers-0.jpg`,
  panda: `${BASE}/pottery-panda-penguin-0.jpeg`,
  portrait: `${BASE}/sketches-portrait-sketch-0.jpeg`,
};

const INK = "#3f362e";
const ACCENT = "#b1482a";

function Underline({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 12" className={className} fill="none" aria-hidden>
      <path d="M3 8c40-5 120-6 214-3" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" className={className} fill="none" aria-hidden>
      <path d="M6 10c30 42 70 55 104 52" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M92 70c9-2 16-6 20-10M110 60c-2 6-3 12-4 16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-16 w-16 rounded-xl border border-black/10 sm:h-20 sm:w-20" style={{ background: hex }} />
      <span className="text-[11px] leading-tight text-black/50">
        {name}
        <br />
        <span className="font-mono">{hex}</span>
      </span>
    </div>
  );
}

const NOW = [
  { name: "paper-50", hex: "#fdf9f2" },
  { name: "clay-900 text", hex: "#2f2a25" },
  { name: "clay-500 accent", hex: "#c1633d" },
  { name: "sage-500", hex: "#7c9473" },
  { name: "ochre-500", hex: "#d4af6a" },
];
const PROPOSED = [
  { name: "gallery wall", hex: "#faf8f3" },
  { name: "ink (text)", hex: "#241a14" },
  { name: "clay body", hex: "#3f362e" },
  { name: "terracotta CTA", hex: "#b1482a" },
  { name: "hairline", hex: "#e2ddd2" },
];

function Photo({
  src,
  className,
  rotate,
  tape,
}: {
  src: string;
  className: string;
  rotate: string;
  tape: string;
}) {
  return (
    <div className={`absolute ${className}`} style={{ transform: `rotate(${rotate})` }}>
      <div className="relative h-full w-full bg-white p-2 shadow-[0_12px_32px_rgba(74,55,40,0.24)]">
        <span className={`tape ${tape}`} />
        <div className="relative h-full w-full overflow-hidden">
          <Image src={src} alt="" fill className="object-cover" sizes="260px" />
          <div className="grain-overlay opacity-[0.09]" />
        </div>
      </div>
    </div>
  );
}

export default function DesignPreview() {
  return (
    <div className="watercolor text-[#241a14]">
      <div className="grain-overlay opacity-[0.08]" />

      {/* ── STUDIO-PINBOARD HERO ─────────────────────────── */}
      <section className="relative mx-auto max-w-6xl px-6 pt-14">
        <p className="font-hand text-2xl" style={{ color: ACCENT }}>
          a design proposal — more her, less template ✎
        </p>

        <div className="relative mt-4 h-[560px]">
          <Photo src={IMG.fox} rotate="-5deg" className="left-0 top-8 h-[240px] w-[188px] hidden sm:block" tape="-top-3 left-1/2 -translate-x-1/2 -rotate-2" />
          <Photo src={IMG.crochet} rotate="4.5deg" className="left-[160px] top-[250px] h-[210px] w-[162px] hidden sm:block" tape="-top-3 left-6 -rotate-6" />
          <Photo src={IMG.teddy} rotate="5deg" className="right-4 top-2 h-[210px] w-[240px] hidden sm:block" tape="-top-3 right-8 rotate-3" />
          <Photo src={IMG.flowers} rotate="-3.5deg" className="right-[70px] top-[270px] h-[205px] w-[158px] hidden sm:block" tape="-top-3 left-1/2 -translate-x-1/2 rotate-2" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="font-hand text-3xl" style={{ color: ACCENT, transform: "rotate(-3deg)" }}>
              made by hand
            </p>
            <h1 className="font-display mt-1 text-5xl font-medium leading-[0.95] sm:text-7xl">
              clay, colour, thread
              <br />&amp; a little{" "}
              <span className="relative italic" style={{ color: ACCENT }}>
                magic
                <Underline className="absolute -bottom-4 left-0 w-full text-[#b1482a]" />
              </span>
            </h1>
            <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
              <span className="rounded-full px-7 py-3 text-sm font-medium text-white shadow-sm" style={{ background: ACCENT }}>
                See the collection
              </span>
              <span className="font-hand text-2xl" style={{ color: INK }}>
                or commission one →
              </span>
            </div>
          </div>
        </div>
        <p className="-mt-4 text-center text-sm text-black/45">
          The landing as a studio pinboard — her pieces taped up, her voice in the margins.
        </p>
      </section>

      {/* ── COLOUR ─────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="font-display text-3xl">Colour</h2>
        <span className="font-hand text-xl text-black/45">her work is the colour; the wall stays quiet</span>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-[#fdf9f2] p-6">
            <p className="font-hand mb-3 text-xl text-[#2f2a25]/70">now — warm, a bit muddy</p>
            <div className="flex flex-wrap gap-4">{NOW.map((c) => <Swatch key={c.hex} {...c} />)}</div>
          </div>
          <div className="rounded-2xl bg-[#faf8f3] p-6 ring-1 ring-[#b1482a]/20">
            <p className="font-hand mb-3 text-xl" style={{ color: ACCENT }}>proposed — clean wall + one bold accent</p>
            <div className="flex flex-wrap gap-4">{PROPOSED.map((c) => <Swatch key={c.hex} {...c} />)}</div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <figure className="rounded-2xl bg-[#fdf9f2] p-8">
            <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl">
              <Image src={IMG.fox} alt="" fill className="object-cover" sizes="320px" />
            </div>
            <figcaption className="font-hand mt-3 text-center text-xl text-[#2f2a25]/55">on today&rsquo;s cream</figcaption>
          </figure>
          <figure className="rounded-2xl bg-[#faf8f3] p-8 ring-1 ring-black/5">
            <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl">
              <Image src={IMG.fox} alt="" fill className="object-cover" sizes="320px" />
            </div>
            <figcaption className="font-hand mt-3 text-center text-xl" style={{ color: ACCENT }}>on the proposed neutral</figcaption>
          </figure>
        </div>
      </section>

      {/* ── TYPE ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <h2 className="font-display text-3xl">Type</h2>
        <span className="font-hand text-xl text-black/45">a printed voice and a handwritten one</span>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-[#fdf9f2] p-8">
            <p className="font-hand mb-4 text-xl text-[#2f2a25]/55">now — italic everywhere</p>
            <h3 className="font-display text-3xl italic leading-tight text-[#c1633d]">handmade one piece at a time.</h3>
          </div>
          <div className="rounded-2xl bg-[#faf8f3] p-8 ring-1 ring-black/5">
            <p className="font-hand mb-4 text-xl" style={{ color: ACCENT }}>proposed</p>
            <h3 className="font-display text-5xl font-medium leading-[0.95]">
              Handmade,
              <br />
              <span className="italic font-normal" style={{ color: ACCENT }}>one piece</span> at a time.
            </h3>
            <p className="font-hand mt-4 text-2xl" style={{ color: INK }}>
              + a handwritten voice for captions &amp; notes
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW PIECES FEEL ──────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-6 py-14 pb-24">
        <div className="flex items-end gap-3">
          <h2 className="font-display text-3xl">How pieces feel</h2>
          <span className="font-hand text-xl text-black/45">— pinned, not gridded</span>
        </div>
        <div className="mt-12 flex flex-wrap items-start justify-center gap-x-12 gap-y-14">
          {[
            { src: IMG.panda, cap: "the police penguin 🐧", rot: "-3deg" },
            { src: IMG.portrait, cap: "drawn from a photo", rot: "2.5deg" },
            { src: IMG.flowers, cap: "shot at golden hour", rot: "-1.5deg" },
          ].map((p, i) => (
            <figure key={i} className="relative" style={{ transform: `rotate(${p.rot})` }}>
              <div className="relative bg-white p-2.5 shadow-[0_14px_36px_rgba(74,55,40,0.22)]">
                <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" />
                <div className="relative h-64 w-52 overflow-hidden">
                  <Image src={p.src} alt="" fill className="object-cover" sizes="208px" />
                  <div className="grain-overlay opacity-[0.09]" />
                </div>
              </div>
              <figcaption className="font-hand mt-3 text-center text-2xl" style={{ color: INK }}>{p.cap}</figcaption>
            </figure>
          ))}
          <Arrow className="mt-16 hidden h-20 w-28 text-clay-500 lg:block" />
        </div>

        <p className="mt-20 text-center font-hand text-2xl" style={{ color: ACCENT }}>
          this is a mock — nothing here is live yet ♡
        </p>
      </section>
    </div>
  );
}
