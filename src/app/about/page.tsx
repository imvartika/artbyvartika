import Image from "next/image";
import Reveal from "@/components/Reveal";
import HandTag from "@/components/HandTag";
import { getSiteSettings } from "@/lib/settings";
import { Mail } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/icons/BrandIcons";

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const paragraphs = settings.aboutText.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <HandTag color="terracotta" rotate={-2}>about</HandTag>
        <div className="mt-3 flex items-center gap-6">
          <div
            className="relative h-28 w-28 shrink-0 bg-white p-1.5 shadow-[0_8px_20px_rgba(74,55,40,0.18)]"
            style={{ transform: "rotate(-4deg)" }}
          >
            <span className="tape -top-2.5 left-1/2 -translate-x-1/2 -rotate-2" />
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={settings.artistPhoto}
                alt={settings.artistName}
                fill
                className="object-cover"
                sizes="112px"
              />
              <div className="grain-overlay opacity-[0.08]" />
            </div>
          </div>
          <h1 className="font-display text-4xl italic text-clay-900 sm:text-5xl">
            {settings.artistName}
          </h1>
        </div>

        {paragraphs.map((para, i) => (
          <p key={i} className="mt-6 text-lg leading-relaxed text-clay-800/80 first:mt-6">
            {para}
          </p>
        ))}

        <p className="mt-10 font-hand text-2xl text-sage-600" style={{ transform: "rotate(-1.5deg)" }}>
          say hi ↓
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-5">
          <a
            href={`mailto:${settings.contactEmail}`}
            className="flex items-center gap-2 text-sm text-clay-700 hover:text-clay-500"
          >
            <Mail size={18} /> {settings.contactEmail}
          </a>
          <a
            href={settings.youtubeUrl}
            className="flex items-center gap-2 text-sm text-clay-700 hover:text-clay-500"
          >
            <YoutubeIcon size={18} /> YouTube
          </a>
          <a
            href={settings.instagramUrl}
            className="flex items-center gap-2 text-sm text-clay-700 hover:text-clay-500"
          >
            <InstagramIcon size={18} /> Instagram
          </a>
        </div>
      </Reveal>
    </div>
  );
}
