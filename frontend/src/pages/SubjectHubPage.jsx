import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  Sparkles,
  Beaker,
  Calculator,
  Globe2,
  BookOpenText,
  ArrowRight,
} from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import SubcategoryCard from "../components/SubcategoryCard";
import ClassCard from "../components/ClassCard";
import { subjectMap } from "../data/subjects";
import { getChapters, getAvailableClasses } from "../data/chapters";
import NotFoundPage from "./NotFoundPage";

/* ═══════════════════════════════════════════════════════════════════
 *  SubjectHubPage — shows subcategory grid OR class grid (for Math)
 *  Route: /subject/:subjectSlug
 * ═══════════════════════════════════════════════════════════════════ */

const iconMap = {
  beaker: Beaker,
  calculator: Calculator,
  "globe-2": Globe2,
  "book-open-text": BookOpenText,
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const springUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function SubjectHubPage() {
  const { subjectSlug } = useParams();
  const subject = subjectMap[subjectSlug];

  // For subjects without subcategories (Mathematics), get available classes directly
  const availableClasses = useMemo(() => {
    if (!subject || subject.hasSubcategories) return [];
    return getAvailableClasses(subjectSlug);
  }, [subject, subjectSlug]);

  // For subcategory chapter counts
  const subcategoryChapterCounts = useMemo(() => {
    if (!subject?.hasSubcategories) return {};
    const counts = {};
    subject.subcategories.forEach((sub) => {
      counts[sub.slug] = getChapters({
        subjectSlug: subject.id,
        subcategorySlug: sub.slug,
      }).length;
    });
    return counts;
  }, [subject]);

  if (!subject) {
    return <NotFoundPage />;
  }

  const SubjectIcon = iconMap[subject.icon] || Beaker;

  // For Mathematics (no subcategories), show class grid directly
  const showClassGrid = !subject.hasSubcategories;

  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      {/* ── Breadcrumbs ── */}
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[{ label: subject.title }]}
        />
      </div>

      {/* ═════════ HERO HEADER ═════════ */}
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-mesh-amazze" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${subject.accent} opacity-[0.06]`}
          />

          {/* Floating shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-6, 8, -6] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[10%] top-[15%] h-10 w-10 rounded-full border-2 border-amazze-purple-200/30 bg-amazze-purple-100/20"
            />
            <motion.div
              animate={{ y: [4, -8, 4], x: [0, 6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[20%] left-[8%] h-8 w-8 rounded-lg border-2 border-amazze-mint-200/30 bg-amazze-mint-100/20"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute left-[45%] top-[10%] h-6 w-6 rounded-md border-2 border-amazze-orange-200/20 bg-amazze-orange-100/15"
            />
          </div>

          <div className="relative px-6 py-12 sm:px-10 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.accent} text-white shadow-lg`}
                >
                  <SubjectIcon className="h-6 w-6" strokeWidth={2} />
                </div>
                <span className="badge-amazze">
                  <Sparkles className="h-3 w-3" />
                  {subject.eyebrow}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {subject.heroTitle}
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-500">
                {subject.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ SUBCATEGORY GRID or CLASS GRID ═════════ */}
      <section className="mx-auto mt-12 max-w-7xl">
        {showClassGrid ? (
          /* ── Mathematics: Direct Class Selection ── */
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Select your{" "}
                <span className="text-gradient-warm">class</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Choose your grade to explore available chapters and simulation labs
              </p>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((level, i) => {
                const chapters = getChapters({
                  subjectSlug: subject.id,
                  classLevel: level,
                });
                return (
                  <ClassCard
                    key={level}
                    classLevel={level}
                    to={`/subject/${subject.id}/class/${level}`}
                    chapterCount={chapters.length}
                    subjectSlug={subject.id}
                    hasChapters={chapters.length > 0}
                    index={i}
                  />
                );
              })}
            </div>
          </>
        ) : (
          /* ── Subjects with Subcategories ── */
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8 text-center"
            >
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Choose a{" "}
                <span className="text-gradient-amazze">branch</span>
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Select a subcategory to explore class-wise chapters and labs
              </p>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 ${
                subject.subcategories.length <= 2
                  ? "sm:grid-cols-2 max-w-2xl mx-auto"
                  : subject.subcategories.length === 3
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {subject.subcategories
                .sort((a, b) => a.order - b.order)
                .map((sub, i) => (
                  <motion.div key={sub.slug} variants={springUp}>
                    <SubcategoryCard
                      subcategory={sub}
                      subjectSlug={subject.id}
                      chapterCount={subcategoryChapterCounts[sub.slug] || 0}
                      index={i}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </>
        )}
      </section>

      {/* ═════════ QUICK STATS ═════════ */}
      <section className="mx-auto mt-16 max-w-7xl">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              label: showClassGrid ? "Classes" : "Subcategories",
              value: showClassGrid ? 10 : subject.subcategories.length,
              color: "text-amazze-purple-500 bg-amazze-purple-50",
            },
            {
              label: "Total Chapters",
              value: getChapters({ subjectSlug: subject.id }).length,
              color: "text-amazze-sky-500 bg-amazze-sky-50",
            },
            {
              label: "Learn by Doing",
              value: "100%",
              color: "text-amazze-mint-500 bg-amazze-mint-50",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur-sm"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color} text-lg font-extrabold`}
              >
                {typeof stat.value === "number" ? stat.value : "✓"}
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">
                  {stat.value}
                </p>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
