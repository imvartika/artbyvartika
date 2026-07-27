import SettingsForm from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl italic text-clay-900">Site settings</h1>
      <p className="mt-1 text-sm text-clay-800/60">
        Everything here updates the public site right away.
      </p>
      <div className="mt-6">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}
