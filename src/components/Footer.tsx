"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { InstagramIcon, YoutubeIcon } from "@/components/icons/BrandIcons";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-clay-200/60 bg-paper-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg italic text-clay-700">
            Vartika Collection
          </p>
          <p className="font-hand mt-0.5 text-xl text-clay-600">
            made by hand, one piece at a time
          </p>
        </div>

        <div className="flex items-center gap-5 text-clay-700">
          <a href={settings.instagramUrl} aria-label="Instagram" className="hover:text-clay-500">
            <InstagramIcon size={20} />
          </a>
          <a href={settings.youtubeUrl} aria-label="YouTube" className="hover:text-clay-500">
            <YoutubeIcon size={20} />
          </a>
          <a href={`mailto:${settings.contactEmail}`} aria-label="Email" className="hover:text-clay-500">
            <Mail size={20} />
          </a>
        </div>

        <p className="text-xs text-clay-800/50">
          <Link href="/admin/login" className="hover:text-clay-500">
            studio
          </Link>{" "}
          · © {new Date().getFullYear()} Vartika Collection
        </p>
      </div>
    </footer>
  );
}
