import { Router } from "express";
import Simulation from "../models/Simulation.js";

const router = Router();

/* GET /api/v1/simulations — all simulations */
router.get("/", async (_req, res) => {
  try {
    const simulations = await Simulation.find().lean();
    res.json({ success: true, count: simulations.length, data: simulations });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* GET /api/v1/simulations/:slug — single simulation */
router.get("/:slug", async (req, res) => {
  try {
    const simulation = await Simulation.findOne({ slug: req.params.slug }).lean();
    if (!simulation) {
      return res.status(404).json({ success: false, error: "Simulation not found" });
    }
    res.json({ success: true, data: simulation });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
