import { Router } from "express";
import Subject from "../models/Subject.js";

const router = Router();

/* GET /api/v1/subjects — all subjects sorted by order */
router.get("/", async (_req, res) => {
  try {
    const subjects = await Subject.find().sort({ order: 1 }).lean();
    res.json({ success: true, data: subjects });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET /api/v1/subjects/:slug — single subject */
router.get("/:slug", async (req, res) => {
  try {
    const subject = await Subject.findOne({ slug: req.params.slug }).lean();
    if (!subject) {
      return res.status(404).json({ success: false, error: "Subject not found" });
    }
    res.json({ success: true, data: subject });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
