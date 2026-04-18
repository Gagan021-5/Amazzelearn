import mongoose from "mongoose";

/* ═══════════════════════════════════════════════════════════════════
 *  Simulation Schema — the interactive lab component metadata
 *  componentKey maps to a React.lazy component on the frontend
 * ═══════════════════════════════════════════════════════════════════ */

const simulationSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: { type: String, required: true },
    summary: { type: String, default: "" },
    topic: { type: String, default: "" },
    challenge: { type: String, default: "" },
    estimatedTime: { type: String, default: "5-7 min" },
    accent: { type: String, default: "" },
    componentKey: {
      type: String,
      required: true,
    },
    subjectSlug: { type: String, required: true, index: true },
    subcategorySlug: { type: String, default: null },
    subjectLabel: { type: String, default: "" },
    instructions: [{ type: String }],
    tags: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model("Simulation", simulationSchema);
