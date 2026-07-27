"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-clay-800/70 hover:bg-paper-100"
    >
      Sign out
    </button>
  );
}
