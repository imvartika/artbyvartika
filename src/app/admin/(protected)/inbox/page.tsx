import { createClient } from "@/lib/supabase/server";
import InboxRow from "@/components/admin/InboxRow";

export default async function InboxPage() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("order_requests")
    .select("*, artwork:artworks(title)")
    .order("created_at", { ascending: false });

  const rows = requests ?? [];

  return (
    <div>
      <h1 className="font-display text-2xl italic text-clay-900">Inbox</h1>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-clay-800/60">No requests yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((r) => (
            <InboxRow key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
}
