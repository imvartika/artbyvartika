"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveSiteSettings } from "@/lib/admin-actions";
import type { SiteSettings } from "@/lib/settings";

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photo, setPhoto] = useState(settings.artistPhoto);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alwaysOn, setAlwaysOn] = useState(settings.birthdayAlwaysOn);

  async function handlePhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `site/portrait-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("artwork-images").upload(path, file);
    if (error) {
      toast.error(`Upload failed: ${error.message}`);
    } else {
      const { data } = supabase.storage.from("artwork-images").getPublicUrl(path);
      setPhoto(data.publicUrl);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const result = await saveSiteSettings({
      artistName: String(form.get("artistName") || ""),
      aboutText: String(form.get("aboutText") || ""),
      contactEmail: String(form.get("contactEmail") || ""),
      instagramUrl: String(form.get("instagramUrl") || ""),
      youtubeUrl: String(form.get("youtubeUrl") || ""),
      artistPhoto: photo,
      birthdayName: String(form.get("birthdayName") || ""),
      birthdayMessage: String(form.get("birthdayMessage") || ""),
      birthdayAlwaysOn: alwaysOn,
    });
    setSaving(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("Saved — changes are live");
    router.refresh();
  }

  const field =
    "mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <section className="space-y-4 rounded-2xl border border-clay-200 bg-white p-6">
        <h2 className="font-display text-lg italic text-clay-800">Profile</h2>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-clay-100">
            {photo && <Image src={photo} alt="" fill className="object-cover" />}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-full border border-clay-300 px-4 py-2 text-sm hover:border-clay-500"
            >
              {uploading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Change photo"
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePhoto(e.target.files?.[0])}
            />
          </div>
        </div>

        <label className="block text-sm text-clay-800">
          Name
          <input name="artistName" required defaultValue={settings.artistName} className={field} />
        </label>

        <label className="block text-sm text-clay-800">
          About (blank line starts a new paragraph)
          <textarea name="aboutText" rows={6} defaultValue={settings.aboutText} className={field} />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-clay-200 bg-white p-6">
        <h2 className="font-display text-lg italic text-clay-800">Links</h2>
        <label className="block text-sm text-clay-800">
          Contact email
          <input name="contactEmail" type="email" defaultValue={settings.contactEmail} className={field} />
        </label>
        <label className="block text-sm text-clay-800">
          Instagram URL
          <input name="instagramUrl" type="url" defaultValue={settings.instagramUrl} className={field} />
        </label>
        <label className="block text-sm text-clay-800">
          YouTube URL
          <input name="youtubeUrl" type="url" defaultValue={settings.youtubeUrl} className={field} />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-clay-200 bg-white p-6">
        <h2 className="font-display text-lg italic text-clay-800">Birthday surprise</h2>
        <label className="flex items-center gap-2 text-sm text-clay-800">
          <input
            type="checkbox"
            checked={alwaysOn}
            onChange={(e) => setAlwaysOn(e.target.checked)}
          />
          Show the surprise to every visitor (turn off after the birthday)
        </label>
        <label className="block text-sm text-clay-800">
          Name in the card
          <input name="birthdayName" defaultValue={settings.birthdayName} className={field} />
        </label>
        <label className="block text-sm text-clay-800">
          Message
          <textarea name="birthdayMessage" rows={4} defaultValue={settings.birthdayMessage} className={field} />
        </label>
      </section>

      <button
        type="submit"
        disabled={saving || uploading}
        className="rounded-full bg-clay-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-clay-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
