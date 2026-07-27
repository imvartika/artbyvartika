"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/lib/admin-actions";
import type { OrderRequest } from "@/lib/supabase/types";

type Row = OrderRequest & { artwork: { title: string } | null };

const STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"] as const;

export default function InboxRow({ request }: { request: Row }) {
  const [status, setStatus] = useState(request.status);
  const [pending, startTransition] = useTransition();

  function handleStatusChange(next: string) {
    setStatus(next as Row["status"]);
    startTransition(() => updateOrderStatus(request.id, next));
  }

  return (
    <div className="rounded-2xl border border-clay-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-clay-900">
            {request.buyer_name}{" "}
            <span className="ml-2 rounded-full bg-paper-100 px-2 py-0.5 text-xs uppercase text-clay-600">
              {request.type}
            </span>
          </p>
          <p className="text-xs text-clay-800/60">
            {request.buyer_email} {request.buyer_phone && `· ${request.buyer_phone}`}
          </p>
          {request.artwork && (
            <p className="mt-1 text-xs text-clay-800/60">Re: {request.artwork.title}</p>
          )}
        </div>

        <select
          value={status}
          disabled={pending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-clay-200 px-2 py-1 text-xs"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {request.message && (
        <p className="mt-3 text-sm text-clay-800/80">{request.message}</p>
      )}
      {request.budget_range && (
        <p className="mt-1 text-xs text-clay-800/60">Budget: {request.budget_range}</p>
      )}
      {request.reference_url && (
        <a
          href={request.reference_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 block text-xs text-clay-600 underline"
        >
          View reference photo
        </a>
      )}
    </div>
  );
}
