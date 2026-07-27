import Reveal from "@/components/Reveal";
import { YoutubeIcon } from "@/components/icons/BrandIcons";
import type { SiteSettings } from "@/lib/settings";

export default function YoutubeSection({ settings }: { settings: SiteSettings }) {
  return (
    <section className="bg-clay-900 py-24 text-paper-50">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <YoutubeIcon size={36} className="mx-auto text-ochre-300" />
          <h2 className="mt-4 font-display text-3xl italic sm:text-4xl">
            Watch it get made
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-paper-100/70">
            Most pieces here started as a video — hands in clay, brush on
            paper, hook and yarn. Her YouTube channel has the whole process,
            start to finish.
          </p>
          <a
            href={settings.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper-50 px-7 py-3 text-sm font-medium text-clay-900 transition-transform hover:-translate-y-0.5"
          >
            Visit the channel
          </a>
        </Reveal>
      </div>
    </section>
  );
}
