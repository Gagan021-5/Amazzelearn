import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
 *  ClassCard — visual card for class/grade selection (1-10)
 * ═══════════════════════════════════════════════════════════════════ */

const subjectThemes = {
  science: {
    gradient: "from-sky-400 to-cyan-500",
    glow: "shadow-sky-glow",
    bgLight: "bg-sky-50",
    text: "text-sky-600",
  },
  mathematics: {
    gradient: "from-amber-400 to-orange-500",
    glow: "shadow-orange-glow",
    bgLight: "bg-amber-50",
    text: "text-amber-600",
  },
  "social-science": {
    gradient: "from-emerald-400 to-lime-500",
    glow: "shadow-mint-glow",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
  },
  language: {
    gradient: "from-violet-400 to-fuchsia-500",
    glow: "shadow-purple-glow",
    bgLight: "bg-violet-50",
    text: "text-violet-600",
  },
};

export default function ClassCard({
  classLevel,
  to,
  chapterCount = 0,
  subjectSlug,
  index = 0,
  hasChapters = false,
}) {
  const theme = subjectThemes[subjectSlug] || subjectThemes.science;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="h-full"
    >
      <Link to={to} className="group block h-full">
        <motion.div
          whileHover={{
            y: -6,
            scale: 1.03,
            transition: { type: "spring", stiffness: 400, damping: 15 },
          }}
          className={`relative flex h-full flex-col items-center rounded-3xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm transition-shadow duration-500 hover:shadow-lg ${hasChapters ? theme.glow : ""}`}
        >
          {/* Class number circle */}
          <motion.div
            whileHover={{ rotate: [0, -5, 5, 0] }}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-2xl font-black text-white shadow-lg ${theme.glow}`}
          >
            {classLevel}
          </motion.div>

          {/* Label */}
          <h3 className="mt-4 text-base font-extrabold text-slate-900">
            Class {classLevel}
          </h3>

          {/* Chapter count */}
          <div className="mt-2">
            {hasChapters ? (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full ${theme.bgLight} px-3 py-1 text-xs font-bold ${theme.text}`}
              >
                <BookOpen className="h-3 w-3" />
                {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
              </span>
            ) : (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-400">
                Coming soon
              </span>
            )}
          </div>

          {/* CTA */}
          <div
            className={`mt-auto flex items-center gap-1.5 pt-4 text-xs font-bold ${hasChapters ? theme.text : "text-slate-400"}`}
          >
            {hasChapters ? "View Chapters" : "Coming Soon"}
            {hasChapters && (
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
