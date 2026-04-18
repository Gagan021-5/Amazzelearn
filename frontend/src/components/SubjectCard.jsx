import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Beaker,
  Calculator,
  Globe2,
  BookOpenText,
  BookOpen,
} from "lucide-react";
import { getChapters } from "../data/chapters";
import { simulationCatalog } from "../simulations/registry";

/* ═══════════════════════════════════════════════════════════════════
 *  SubjectCard — visual card for subject selection on Home page
 *  Now supports 4 subjects including Language
 * ═══════════════════════════════════════════════════════════════════ */

const iconMap = {
  beaker: Beaker,
  calculator: Calculator,
  "globe-2": Globe2,
  "book-open-text": BookOpenText,
  // Legacy fallback keys
  science: Beaker,
  mathematics: Calculator,
  "social-science": Globe2,
  language: BookOpenText,
};

const colorThemes = {
  science: {
    gradient: "from-amazze-sky-400 via-amazze-sky-500 to-amazze-purple-500",
    glow: "shadow-sky-glow",
    bgLight: "bg-amazze-sky-50",
    text: "text-amazze-sky-500",
    tagBg: "bg-amazze-sky-50",
    tagText: "text-amazze-sky-600",
    ring: "ring-amazze-sky-100",
  },
  mathematics: {
    gradient: "from-amazze-orange-400 via-amazze-orange-500 to-amazze-pink-500",
    glow: "shadow-orange-glow",
    bgLight: "bg-amazze-orange-50",
    text: "text-amazze-orange-500",
    tagBg: "bg-amazze-orange-50",
    tagText: "text-amazze-orange-600",
    ring: "ring-amazze-orange-100",
  },
  "social-science": {
    gradient: "from-amazze-mint-400 via-amazze-mint-500 to-amazze-sky-500",
    glow: "shadow-mint-glow",
    bgLight: "bg-amazze-mint-50",
    text: "text-amazze-mint-500",
    tagBg: "bg-amazze-mint-50",
    tagText: "text-amazze-mint-600",
    ring: "ring-amazze-mint-100",
  },
  language: {
    gradient: "from-amazze-purple-400 via-amazze-purple-500 to-amazze-pink-500",
    glow: "shadow-purple-glow",
    bgLight: "bg-amazze-purple-50",
    text: "text-amazze-purple-500",
    tagBg: "bg-amazze-purple-50",
    tagText: "text-amazze-purple-600",
    ring: "ring-amazze-purple-100",
  },
};

export default function SubjectCard({ subject, index }) {
  const theme = colorThemes[subject.id] || colorThemes.science;
  const IconComp = iconMap[subject.icon] || iconMap[subject.id] || Beaker;

  const chapterCount = getChapters({ subjectSlug: subject.id }).length;
  const simCount = simulationCatalog.filter(
    (s) => s.subjectId === subject.id,
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={subject.path}
        className="group block h-full"
      >
        <motion.div
          whileHover={{
            y: -8,
            scale: 1.02,
            transition: { type: "spring", stiffness: 400, damping: 15 },
          }}
          className={`flex h-full flex-col rounded-3xl border border-white/60 bg-white/80 p-7 backdrop-blur-sm transition-shadow duration-500 ${theme.glow} hover:shadow-lg`}
        >
          {/* Icon with gradient bg */}
          <motion.div
            whileHover={{ rotate: [0, -12, 12, -6, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg ${theme.glow}`}
          >
            <IconComp className="h-6 w-6" strokeWidth={2} />
          </motion.div>

          {/* Content */}
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
            {subject.eyebrow}
          </p>
          <h3 className="mt-2 text-lg font-extrabold text-slate-900">{subject.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {subject.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            <span className={`rounded-full ${theme.tagBg} px-3 py-1 text-xs font-bold ${theme.tagText} ring-1 ${theme.ring}`}>
              {simCount} labs
            </span>
            {subject.hasSubcategories && (
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                {subject.subcategories.length} branches
              </span>
            )}
            <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
              {chapterCount} chapters
            </span>
          </div>

          {/* CTA footer */}
          <div className={`mt-auto flex items-center gap-2 pt-6 text-sm font-bold ${theme.text}`}>
            Explore
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
