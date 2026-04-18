import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
 *  Subject Schema — top-level taxonomy node
 *  Example: Science, Mathematics, Social Science, Language
 * ═══════════════════════════════════════════════════════════════════ */

const subcategorySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, default: "atom" },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const subjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    eyebrow: { type: String, default: "" },
    heroTitle: { type: String, default: "" },
    description: { type: String, default: "" },
    accent: { type: String, default: "" },
    glow: { type: String, default: "" },
    icon: { type: String, default: "beaker" },
    highlights: [{ type: String }],
    hasSubcategories: { type: Boolean, default: false },
    subcategories: [subcategorySchema],
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Subject", subjectSchema);
