"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const orderRequestSchema = z.object({
  type: z.enum(["buy", "commission"]),
  artworkId: z.string().uuid().nullable(),
  buyerName: z.string().min(2, "Please enter your name"),
  buyerEmail: z.string().email().optional().or(z.literal("")),
  buyerPhone: z.string().optional().or(z.literal("")),
  message: z.string().optional().or(z.literal("")),
  budgetRange: z.string().optional().or(z.literal("")),
  referenceUrl: z.string().url().optional().or(z.literal("")),
});

export type OrderRequestInput = z.infer<typeof orderRequestSchema>;

export async function submitOrderRequest(input: OrderRequestInput) {
  const parsed = orderRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("order_requests").insert({
    type: parsed.data.type,
    artwork_id: parsed.data.artworkId,
    buyer_name: parsed.data.buyerName,
    buyer_email: parsed.data.buyerEmail || null,
    buyer_phone: parsed.data.buyerPhone || null,
    message: parsed.data.message || null,
    budget_range: parsed.data.budgetRange || null,
    reference_url: parsed.data.referenceUrl || null,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  if (parsed.data.type === "buy" && parsed.data.artworkId) {
    await supabase.rpc("reserve_artwork", { target_id: parsed.data.artworkId });
  }

  return { ok: true as const };
}
