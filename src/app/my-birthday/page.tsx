import BirthdayCelebration from "@/components/BirthdayCelebration";
import { getSiteSettings } from "@/lib/settings";

export default async function MyBirthdayPage() {
  const settings = await getSiteSettings();
  return <BirthdayCelebration name={settings.birthdayName} />;
}
