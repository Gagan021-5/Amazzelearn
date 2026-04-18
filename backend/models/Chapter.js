import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
 *  Chapter Schema — a single chapter within the taxonomy tree
 *  Links to a Subject + optional Subcategory + Class Level
 *  Each chapter maps to exactly one Simulation via simulationSlug
 * ═══════════════════════════════════════════════════════════════════ */

const chapterSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    subjectSlug: {
      type: String,
      required: true,
      index: true,
    },
    subcategorySlug: {
      type: String,
      default: null,
      index: true,
    },
    classLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      index: true,
    },
    order: { type: Number, default: 0 },
    simulationSlug: {
      type: String,
      required: true,
    },
    estimatedTime: { type: String, default: "5-7 min" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    learningObjectives: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

/* Compound index for the most common query pattern */
chapterSchema.index({ subjectSlug: 1, subcategorySlug: 1, classLevel: 1 });

export default mongoose.model("Chapter", chapterSchema);
