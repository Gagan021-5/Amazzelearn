import { useMemo } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { Sparkles, Search, BookOpen } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ChapterCard from "../components/ChapterCard";
import { subjectMap, getSubcategory } from "../data/subjects";
import { getChapters } from "../data/chapters";
import NotFoundPage from "./NotFoundPage";

/* ═══════════════════════════════════════════════════════════════════
 *  ChapterListPage — dynamic chapter list for a subject+sub+class
 *  Routes:
 *    /subject/:subjectSlug/class/:classLevel               (Mathematics)
 *    /subject/:subjectSlug/:subcategorySlug/class/:classLevel (others)
 * ═══════════════════════════════════════════════════════════════════ */

export default function ChapterListPage() {
  const { subjectSlug, subcategorySlug, classLevel } = useParams();
  const subject = subjectMap[subjectSlug];
  const subcategory = subcategorySlug
    ? getSubcategory(subjectSlug, subcategorySlug)
    : null;

  const chapters = useMemo(() => {
    if (!subject) return [];
    return getChapters({
      subjectSlug,
      subcategorySlug: subcategorySlug || null,
      classLevel: Number(classLevel),
    });
  }, [subject, subjectSlug, subcategorySlug, classLevel]);

  if (!subject) {
    return <NotFoundPage />;
  }

  // Validate subcategory if subject requires one
  if (subject.hasSubcategories && subcategorySlug && !subcategory) {
    return <NotFoundPage />;
  }

  // Build breadcrumb items
  const breadcrumbItems = [];
  breadcrumbItems.push({
    label: subject.title,
    to: `/subject/${subjectSlug}`,
  });

  if (subcategory) {
    breadcrumbItems.push({
      label: subcategory.title,
      to: `/subject/${subjectSlug}/${subcategorySlug}`,
    });
  }

  breadcrumbItems.push({ label: `Class ${classLevel}` });

  // Build lab URL base
  const labBase = subcategorySlug
    ? `/subject/${subjectSlug}/${subcategorySlug}/class/${classLevel}`
    : `/subject/${subjectSlug}/class/${classLevel}`;

  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      {/* ── Breadcrumbs ── */}
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* ═════════ HERO ═════════ */}
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem]">
          <div className="absolute inset-0 bg-mesh-amazze" />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${subject.accent} opacity-[0.06]`}
          />

          {/* Floating shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-5, 7, -5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[14%] top-[20%] h-8 w-8 rounded-full border-2 border-amazze-purple-200/30 bg-amazze-purple-100/20"
            />
            <motion.div
              animate={{ y: [4, -6, 4], x: [0, 5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[22%] left-[10%] h-6 w-6 rounded-lg border-2 border-amazze-orange-200/25 bg-amazze-orange-100/15"
            />
          </div>

          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-amazze">
                  <Sparkles className="h-3 w-3" />
                  {subject.title}
                  {subcategory ? ` / ${subcategory.title}` : ""}
                </span>
                <span className="rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200/60 backdrop-blur-sm">
                  Class {classLevel}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                {subcategory ? subcategory.title : subject.title}{" "}
                <span className="text-gradient-amazze">
                  Chapters — Class {classLevel}
                </span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-500">
                {chapters.length > 0
                  ? `${chapters.length} interactive simulation ${chapters.length === 1 ? "lab" : "labs"} ready to explore. Each chapter provides a hands-on learning experience.`
                  : "Chapters for this class are being prepared. Check back soon!"}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ CHAPTER GRID ═════════ */}
      <section className="mx-auto mt-10 max-w-7xl">
        {chapters.length > 0 ? (
          <>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amazze-purple-50">
                <BookOpen className="h-4 w-4 text-amazze-purple-500" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Available Chapters
                </h2>
                <p className="text-xs text-slate-500">
                  {chapters.length} simulation {chapters.length === 1 ? "lab" : "labs"}
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {chapters
                .sort((a, b) => a.order - b.order)
                .map((chapter, index) => (
                  <ChapterCard
                    key={chapter.slug}
                    chapter={chapter}
                    to={`${labBase}/chapter/${chapter.slug}/lab`}
                    index={index}
                  />
                ))}
            </div>
          </>
        ) : (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200/60 bg-white/40 p-8"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <Search className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="mt-5 text-lg font-extrabold text-slate-600">
              Coming Soon
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-slate-400">
              {subcategory ? subcategory.title : subject.title} chapters for
              Class {classLevel} are currently being developed. Explore other
              classes in the meantime!
            </p>
            <Link
              to={
                subcategory
                  ? `/subject/${subjectSlug}/${subcategorySlug}`
                  : `/subject/${subjectSlug}`
              }
              className="btn-primary mt-6"
            >
              Browse Other Classes
            </Link>
          </motion.div>
        )}
      </section>
    </div>
  );
}
