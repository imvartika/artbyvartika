/**
 * Per-craft visual identity — a consistent accent + a short verb that hints at
 * the making of each medium. Used to give each craft its own feel rather than
 * one card style recoloured six ways.
 */
export type CraftIdentity = {
  accent: string; // hex, for hairlines / labels / process badge
  tint: string; // soft background wash behind the cover
  verb: string; // the making gesture, shown in the cover
};

const IDENTITY: Record<string, CraftIdentity> = {
  pottery: { accent: "#8a5a3a", tint: "#f0c9a5", verb: "shaped by hand" },
  painting: { accent: "#5f7a56", tint: "#e9cf9f", verb: "brushed onto the page" },
  sketches: { accent: "#6b4226", tint: "#f7e2c7", verb: "drawn line by line" },
  crochet: { accent: "#c1633d", tint: "#f0c9a5", verb: "stitched loop by loop" },
  photography: { accent: "#2f2a25", tint: "#b7c8ad", verb: "caught in a moment" },
  blender: { accent: "#5f7a56", tint: "#b7c8ad", verb: "sculpted in 3D" },
  other: { accent: "#7c9473", tint: "#e9cf9f", verb: "still finding its shape" },
};

export function craftIdentity(slug: string): CraftIdentity {
  return IDENTITY[slug] ?? IDENTITY.other;
}
