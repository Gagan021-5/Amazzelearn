import { useMemo } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Breadcrumbs from "../components/Breadcrumbs";
import ClassCard from "../components/ClassCard";
import { subjectMap, getSubcategory } from "../data/subjects";
import { getChapters } from "../data/chapters";
import NotFoundPage from "./NotFoundPage";

/* ═══════════════════════════════════════════════════════════════════
 *  ClassSelectionPage — 10-card grid for Classes 1-10
 *  Route: /subject/:subjectSlug/:subcategorySlug
 * ═══════════════════════════════════════════════════════════════════ */

export default function ClassSelectionPage() {
  const { subjectSlug, subcategorySlug } = useParams();
  const subject = subjectMap[subjectSlug];
  const subcategory = getSubcategory(subjectSlug, subcategorySlug);

  const chapterCountsByClass = useMemo(() => {
    const counts = {};
    for (let level = 1; level <= 10; level++) {
      counts[level] = getChapters({
        subjectSlug,
        subcategorySlug,
        classLevel: level,
      }).length;
    }
    return counts;
  }, [subjectSlug, subcategorySlug]);

  if (!subject || !subcategory) {
    return <NotFoundPage />;
  }

  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      {/* ── Breadcrumbs ── */}
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          items={[
            { label: subject.title, to: `/subject/${subjectSlug}` },
            { label: subcategory.title },
          ]}
        />
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
              animate={{ y: [-6, 8, -6], rotate: [0, 180, 360] }}
              transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              className="absolute right-[12%] top-[18%] h-8 w-8 rounded-lg border-2 border-amazze-purple-200/30 bg-amazze-purple-100/20"
            />
            <motion.div
              animate={{ y: [5, -10, 5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[10%] bottom-[22%] h-6 w-6 rounded-full border-2 border-amazze-mint-200/30 bg-amazze-mint-100/20"
            />
          </div>

          <div className="relative px-6 py-12 sm:px-10 sm:py-14">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="max-w-2xl"
            >
              <span className="badge-amazze">
                <Sparkles className="h-3 w-3" />
                {subject.title} / {subcategory.title}
              </span>
              <h1 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                Select your{" "}
                <span className="text-gradient-amazze">class</span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-slate-500">
                {subcategory.description}. Choose your grade to explore
                chapters and interactive simulation labs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ CLASS GRID ═════════ */}
      <section className="mx-auto mt-10 max-w-7xl">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((level, i) => (
            <ClassCard
              key={level}
              classLevel={level}
              to={`/subject/${subjectSlug}/${subcategorySlug}/class/${level}`}
              chapterCount={chapterCountsByClass[level]}
              subjectSlug={subjectSlug}
              hasChapters={chapterCountsByClass[level] > 0}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* ═════════ INFO BANNER ═════════ */}
      <section className="mx-auto mt-12 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/30 p-6 text-center"
        >
          <p className="text-sm text-slate-600">
            <span className="font-bold text-violet-600">
              {Object.values(chapterCountsByClass).reduce((a, b) => a + b, 0)}
            </span>{" "}
            total chapters available across all classes for{" "}
            <span className="font-bold">{subcategory.title}</span>.
            More chapters are being added regularly!
          </p>
        </motion.div>
      </section>
    </div>
  );
}
