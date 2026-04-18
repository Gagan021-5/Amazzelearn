import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import SimulationWrapper, {
  useSimulationController,
} from "../components/SimulationWrapper";
import ErrorBoundary from "../components/ErrorBoundary";
import Breadcrumbs from "../components/Breadcrumbs";
import { simulationMap, getSimulationComponent } from "../simulations/registry";
import { chapterMap } from "../data/chapters";
import { subjectMap, getSubcategory } from "../data/subjects";
import NotFoundPage from "./NotFoundPage";

/* ═══════════════════════════════════════════════════════════════════
 *  SimulationPage — deep-routed lab environment
 *  Routes:
 *    /subject/:subjectSlug/:subcategorySlug/class/:classLevel/chapter/:chapterSlug/lab
 *    /subject/:subjectSlug/class/:classLevel/chapter/:chapterSlug/lab
 * ═══════════════════════════════════════════════════════════════════ */

function SimulationLoadingSkeleton() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-12 w-12 rounded-2xl border-4 border-amazze-purple-100 border-t-amazze-purple-500"
        />
        <p className="mt-4 text-sm font-bold text-slate-400">
          Loading simulation...
        </p>
      </div>
    </div>
  );
}

export default function SimulationPage() {
  const { subjectSlug, subcategorySlug, classLevel, chapterSlug } = useParams();
  const controller = useSimulationController(10);

  // Look up chapter and simulation
  const chapter = chapterMap[chapterSlug];
  const simulation = chapter ? simulationMap[chapter.simulationId] : null;
  const subject = subjectMap[subjectSlug];
  const subcategory = subcategorySlug
    ? getSubcategory(subjectSlug, subcategorySlug)
    : null;

  if (!chapter || !simulation || !subject) {
    return <NotFoundPage />;
  }

  const SimulationComponent = getSimulationComponent(simulation.componentKey);

  if (!SimulationComponent) {
    return <NotFoundPage />;
  }

  // Build breadcrumb trail
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

  const chapterListPath = subcategorySlug
    ? `/subject/${subjectSlug}/${subcategorySlug}/class/${classLevel}`
    : `/subject/${subjectSlug}/class/${classLevel}`;

  breadcrumbItems.push({
    label: `Class ${classLevel}`,
    to: chapterListPath,
  });

  breadcrumbItems.push({ label: chapter.title });

  // Build back link for SimulationWrapper
  const backTo = chapterListPath;
  const backLabel = `Class ${classLevel} Chapters`;

  return (
    <div className="px-4 pb-14 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Breadcrumbs ── */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* ── Simulation Shell ── */}
        <ErrorBoundary onReset={controller.restartSession}>
          <SimulationWrapper
            simulation={simulation}
            controller={controller}
            backTo={backTo}
            backLabel={backLabel}
          >
            <Suspense fallback={<SimulationLoadingSkeleton />}>
              <SimulationComponent
                key={controller.sessionId}
                controller={controller}
              />
            </Suspense>
          </SimulationWrapper>
        </ErrorBoundary>
      </div>
    </div>
  );
}
