import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Atom,
  FlaskConical,
  Dna,
  MapPin,
  ScrollText,
  Landmark,
  TrendingUp,
  Languages,
  PenLine,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
 *  SubcategoryCard — visual card for subject subcategories
 * ═══════════════════════════════════════════════════════════════════ */

const iconMap = {
  atom: Atom,
  "flask-conical": FlaskConical,
  dna: Dna,
  "map-pin": MapPin,
  "scroll-text": ScrollText,
  landmark: Landmark,
  "trending-up": TrendingUp,
  languages: Languages,
  "pen-line": PenLine,
};

const subjectThemes = {
  science: {
    gradient: "from-sky-400 via-cyan-400 to-emerald-400",
    glow: "shadow-sky-glow",
    hoverBorder: "hover:border-sky-200",
    tagBg: "bg-sky-50",
    tagText: "text-sky-600",
    textAccent: "text-sky-500",
  },
  "social-science": {
    gradient: "from-emerald-400 via-lime-400 to-yellow-400",
    glow: "shadow-mint-glow",
    hoverBorder: "hover:border-emerald-200",
    tagBg: "bg-emerald-50",
    tagText: "text-emerald-600",
    textAccent: "text-emerald-500",
  },
  language: {
    gradient: "from-violet-400 via-purple-400 to-fuchsia-400",
    glow: "shadow-purple-glow",
    hoverBorder: "hover:border-violet-200",
    tagBg: "bg-violet-50",
    tagText: "text-violet-600",
    textAccent: "text-violet-500",
  },
};

export default function SubcategoryCard({
  subcategory,
  subjectSlug,
  chapterCount = 0,
  index = 0,
}) {
  const theme = subjectThemes[subjectSlug] || subjectThemes.science;
  const IconComp = iconMap[subcategory.icon] || Atom;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        to={`/subject/${subjectSlug}/${subcategory.slug}`}
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
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -12, 12, -6, 0] }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${theme.gradient} text-white shadow-lg ${theme.glow}`}
          >
            <IconComp className="h-6 w-6" strokeWidth={2} />
          </motion.div>

          {/* Content */}
          <h3 className="text-lg font-extrabold text-slate-900">
            {subcategory.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            {subcategory.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex gap-2">
            <span
              className={`rounded-full ${theme.tagBg} px-3 py-1 text-xs font-bold ${theme.tagText}`}
            >
              {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
            </span>
          </div>

          {/* CTA */}
          <div
            className={`mt-auto flex items-center gap-2 pt-6 text-sm font-bold ${theme.textAccent}`}
          >
            Explore Classes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
