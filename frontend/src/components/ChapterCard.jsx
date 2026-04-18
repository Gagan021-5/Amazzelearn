import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Target, BookOpen, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
 *  ChapterCard — rich chapter card with learning objectives
 * ═══════════════════════════════════════════════════════════════════ */

const difficultyConfig = {
  beginner: {
    label: "Beginner",
    color: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  },
  intermediate: {
    label: "Intermediate",
    color: "bg-amber-50 text-amber-600 ring-amber-100",
  },
  advanced: {
    label: "Advanced",
    color: "bg-rose-50 text-rose-600 ring-rose-100",
  },
};

export default function ChapterCard({ chapter, to, index = 0 }) {
  const difficulty = difficultyConfig[chapter.difficulty] || difficultyConfig.beginner;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="h-full"
    >
      <Link to={to} className="group block h-full">
        <motion.div
          whileHover={{
            y: -6,
            transition: { type: "spring", stiffness: 400, damping: 15 },
          }}
          className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow duration-500 hover:shadow-soft-lg"
        >
          {/* Top accent line */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-amazze-purple-400 via-amazze-pink-400 to-amazze-orange-400 opacity-60" />

          {/* Header with chapter number */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amazze-purple-500 to-amazze-pink-500 text-lg font-black text-white shadow-purple-glow">
              {chapter.order}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-slate-900 transition-colors group-hover:text-amazze-purple-600 line-clamp-2">
                {chapter.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 line-clamp-2">
                {chapter.description}
              </p>
            </div>
          </div>

          {/* Metadata pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ${difficulty.color}`}
            >
              <Sparkles className="h-3 w-3" />
              {difficulty.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-100">
              <Clock className="h-3 w-3" />
              {chapter.estimatedTime}
            </span>
          </div>

          {/* Learning objectives */}
          {chapter.learningObjectives && chapter.learningObjectives.length > 0 && (
            <div className="mt-4 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                You&apos;ll learn
              </p>
              {chapter.learningObjectives.slice(0, 2).map((obj, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amazze-purple-400" />
                  <p className="text-xs leading-relaxed text-slate-500">
                    {obj}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* CTA footer */}
          <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-amazze-purple-500">
            <Target className="h-4 w-4" />
            Launch Lab
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </div>
        </motion.div>
      </Link>
    </motion.article>
  );
}
