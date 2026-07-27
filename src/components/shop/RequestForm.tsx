"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitOrderRequest } from "@/lib/actions";

export default function RequestForm({
  type,
  artworkId,
  onSuccess,
}: {
  type: "buy" | "commission";
  artworkId?: string;
  onSuccess?: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const result = await submitOrderRequest({
      type,
      artworkId: artworkId ?? null,
      buyerName: String(form.get("buyerName") || ""),
      buyerEmail: String(form.get("buyerEmail") || ""),
      buyerPhone: String(form.get("buyerPhone") || ""),
      message: String(form.get("message") || ""),
      budgetRange: String(form.get("budgetRange") || ""),
      referenceUrl: String(form.get("referenceUrl") || ""),
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    setDone(true);
    onSuccess?.();
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-sage-300/30 p-6 text-center">
        <p className="font-display text-lg italic text-clay-800">
          {type === "buy" ? "Reserved — thank you!" : "Request sent!"}
        </p>
        <p className="mt-1 text-sm text-clay-800/70">
          {type === "buy"
            ? "It's held for you now. She'll reach out to sort out payment and pickup/delivery."
            : "She'll get back to you soon to talk through the details."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-clay-800">
          Your name
          <input
            name="buyerName"
            required
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          />
        </label>
        <label className="block text-sm text-clay-800">
          Phone (fastest way to reach you)
          <input
            name="buyerPhone"
            className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
          />
        </label>
      </div>

      <label className="block text-sm text-clay-800">
        Email
        <input
          name="buyerEmail"
          type="email"
          className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
        />
      </label>

      {type === "commission" && (
        <>
          <label className="block text-sm text-clay-800">
            Budget range (optional)
            <input
              name="budgetRange"
              placeholder="e.g. ₹500–1500"
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
            />
          </label>

          <label className="block text-sm text-clay-800">
            Reference link (optional)
            <input
              name="referenceUrl"
              type="url"
              placeholder="Paste a link to a photo — Google Drive, Dropbox, Pinterest, etc."
              className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
            />
            <span className="mt-1 block text-xs text-clay-800/50">
              Upload your photo to Google Drive/Dropbox, set it to &ldquo;anyone with the
              link,&rdquo; then paste the link here.
            </span>
          </label>
        </>
      )}

      <label className="block text-sm text-clay-800">
        {type === "buy" ? "Anything she should know?" : "Tell her what you have in mind"}
        <textarea
          name="message"
          rows={4}
          required={type === "commission"}
          className="mt-1 w-full rounded-lg border border-clay-200 px-3 py-2 outline-none focus:border-clay-500"
        />
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-clay-600 py-3 text-sm font-medium text-white transition-colors hover:bg-clay-700 disabled:opacity-60"
      >
        {submitting
          ? "Sending…"
          : type === "buy"
            ? "Reserve this piece"
            : "Send commission request"}
      </button>
    </form>
  );
}
