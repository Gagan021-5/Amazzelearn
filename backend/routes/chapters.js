import { Router } from "express";
import Chapter from "../models/Chapter.js";

const router = Router();

/* GET /api/v1/chapters?subject=X&sub=Y&class=Z — filtered chapters */
router.get("/", async (req, res) => {
  try {
    const filter = { isPublished: true };

    if (req.query.subject) filter.subjectSlug = req.query.subject;
    if (req.query.sub) filter.subcategorySlug = req.query.sub;
    if (req.query.class) filter.classLevel = Number(req.query.class);

    const chapters = await Chapter.find(filter).sort({ order: 1 }).lean();
    res.json({ success: true, count: chapters.length, data: chapters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET /api/v1/chapters/:slug — single chapter */
router.get("/:slug", async (req, res) => {
  try {
    const chapter = await Chapter.findOne({ slug: req.params.slug }).lean();
    if (!chapter) {
      return res.status(404).json({ success: false, error: "Chapter not found" });
    }
    res.json({ success: true, data: chapter });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
