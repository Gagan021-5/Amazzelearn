import { useEffect, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SimulationPage from "./pages/SimulationPage";
import SubjectHubPage from "./pages/SubjectHubPage";
import ClassSelectionPage from "./pages/ClassSelectionPage";
import ChapterListPage from "./pages/ChapterListPage";

function RouteScrollManager() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return null;
}

/* ── Page transition wrapper ── */
function PageTransition({ children }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <div className="app-shell relative min-h-screen overflow-hidden">
      {/* ── Ambient mesh gradient blobs ── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 15, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-amazze-purple-200/25 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
          }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 top-20 h-[450px] w-[450px] rounded-full bg-amazze-mint-200/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 25, -18, 0],
            y: [0, -18, 25, 0],
          }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full bg-amazze-orange-200/15 blur-[120px]"
        />
        <div className="absolute left-1/2 top-1/3 h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-amazze-pink-100/12 blur-[100px]" />
      </div>

      <RouteScrollManager />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Routes location={location}>
          {/* ── Home ── */}
          <Route path="/" element={<HomePage />} />

          {/* ── Subject Hub (subcategories or direct class grid) ── */}
          <Route path="/subject/:subjectSlug" element={<SubjectHubPage />} />

          {/* ── Class Selection (via subcategory) ── */}
          <Route
            path="/subject/:subjectSlug/:subcategorySlug"
            element={<ClassSelectionPage />}
          />

          {/* ── Chapter List (Mathematics — no subcategory) ── */}
          <Route
            path="/subject/:subjectSlug/class/:classLevel"
            element={<ChapterListPage />}
          />

          {/* ── Chapter List (with subcategory) ── */}
          <Route
            path="/subject/:subjectSlug/:subcategorySlug/class/:classLevel"
            element={<ChapterListPage />}
          />

          {/* ── Simulation Lab (Mathematics — no subcategory) ── */}
          <Route
            path="/subject/:subjectSlug/class/:classLevel/chapter/:chapterSlug/lab"
            element={<SimulationPage />}
          />

          {/* ── Simulation Lab (with subcategory) ── */}
          <Route
            path="/subject/:subjectSlug/:subcategorySlug/class/:classLevel/chapter/:chapterSlug/lab"
            element={<SimulationPage />}
          />

          {/* ── 404 ── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
