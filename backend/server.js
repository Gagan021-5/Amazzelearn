import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import subjectRoutes from "./routes/subjects.js";
import chapterRoutes from "./routes/chapters.js";
import simulationRoutes from "./routes/simulations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ── */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ── API Routes ── */
app.use("/api/v1/subjects", subjectRoutes);
app.use("/api/v1/chapters", chapterRoutes);
app.use("/api/v1/simulations", simulationRoutes);

/* ── Health Check ── */
app.get("/api/v1/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* ── MongoDB Connection & Server Start ── */
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Amazze Learn API running on http://localhost:${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

start();
