import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/site-config";

export type SiteSettings = {
  artistName: string;
  aboutText: string;
  contactEmail: string;
  instagramUrl: string;
  youtubeUrl: string;
  artistPhoto: string;
  birthdayName: string;
  birthdayMessage: string;
  birthdayAlwaysOn: boolean;
};

const DEFAULTS: SiteSettings = {
  artistName: siteConfig.artistName,
  aboutText:
    "Vartika makes things with her hands — clay figures shaped one coil at a time, poster-colour and watercolour paintings, sketches pulled straight out of a photograph, crochet stitched loop by loop, and photography that catches the moment before you knew you wanted it. Most of it starts as a video on her YouTube channel, because half the fun is watching it come together.\n\nThis little corner of the internet exists to keep it all in one place — browse the gallery, take a finished piece home, or ask her to make something just for you.",
  contactEmail: siteConfig.contactEmail,
  instagramUrl: siteConfig.instagramUrl,
  youtubeUrl: siteConfig.youtubeUrl,
  artistPhoto: siteConfig.artistPhoto,
  birthdayName: siteConfig.birthdayName,
  birthdayMessage: siteConfig.birthdayMessage,
  birthdayAlwaysOn: siteConfig.birthdayAlwaysOn,
};

/**
 * Reads the editable site settings from the DB, falling back to the static
 * defaults for any missing field (and if the table doesn't exist yet, e.g.
 * before the migration is applied). Deduped per request via React cache.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (!data) return DEFAULTS;

    return {
      artistName: data.artist_name || DEFAULTS.artistName,
      aboutText: data.about_text || DEFAULTS.aboutText,
      contactEmail: data.contact_email || DEFAULTS.contactEmail,
      instagramUrl: data.instagram_url || DEFAULTS.instagramUrl,
      youtubeUrl: data.youtube_url || DEFAULTS.youtubeUrl,
      artistPhoto: data.artist_photo || DEFAULTS.artistPhoto,
      birthdayName: data.birthday_name || DEFAULTS.birthdayName,
      birthdayMessage: data.birthday_message || DEFAULTS.birthdayMessage,
      birthdayAlwaysOn: data.birthday_always_on ?? DEFAULTS.birthdayAlwaysOn,
    };
  } catch {
    return DEFAULTS;
  }
});
