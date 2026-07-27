import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/admin/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (!adminRow) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 flex-col border-r border-clay-200 bg-white p-6 sm:flex">
          <p className="font-display text-lg italic text-clay-700">Studio</p>
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            <Link href="/admin" className="rounded-md px-3 py-2 hover:bg-paper-100">
              Artworks
            </Link>
            <Link href="/admin/new" className="rounded-md px-3 py-2 hover:bg-paper-100">
              Add new
            </Link>
            <Link href="/admin/inbox" className="rounded-md px-3 py-2 hover:bg-paper-100">
              Inbox
            </Link>
            <Link href="/admin/settings" className="rounded-md px-3 py-2 hover:bg-paper-100">
              Settings
            </Link>
            <Link href="/" className="rounded-md px-3 py-2 hover:bg-paper-100">
              ← View site
            </Link>
          </nav>
          <div className="mt-auto">
            <SignOutButton />
          </div>
        </aside>
        <main className="flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
