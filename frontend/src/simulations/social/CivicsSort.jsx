import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBucketSortGame } from "../../hooks/useBucketSortGame";

/**
 * Civics Sort — drag government responsibilities into Legislature, Executive,
 * and Judiciary buckets. Spacious sim-layout with chunky draggable cards.
 */

const branchBuckets = [
  {
    id: "legislature",
    title: "Legislature",
    description: "Writes laws and approves budgets.",
    tone: "from-sky-400 to-cyan-500",
    accent: "border-l-sky-400",
    bgTint: "bg-sky-50/60",
    ringTint: "ring-sky-200/60",
  },
  {
    id: "executive",
    title: "Executive",
    description: "Implements laws and runs departments.",
    tone: "from-amber-400 to-orange-500",
    accent: "border-l-amber-400",
    bgTint: "bg-amber-50/60",
    ringTint: "ring-amber-200/60",
  },
  {
    id: "judiciary",
    title: "Judiciary",
    description: "Interprets laws and resolves disputes.",
    tone: "from-emerald-400 to-teal-500",
    accent: "border-l-emerald-400",
    bgTint: "bg-emerald-50/60",
    ringTint: "ring-emerald-200/60",
  },
];

const responsibilities = [
  { id: "makes-laws", label: "Makes laws", hint: "Debating and passing bills in Parliament", bucket: "legislature" },
  { id: "passes-budget", label: "Passes budgets", hint: "Approving government spending plans", bucket: "legislature" },
  { id: "runs-ministries", label: "Runs ministries", hint: "Operating government departments", bucket: "executive" },
  { id: "implements-policy", label: "Implements policy", hint: "Putting laws into action on the ground", bucket: "executive" },
  { id: "interprets-constitution", label: "Interprets the Constitution", hint: "Reviewing whether laws are constitutional", bucket: "judiciary" },
  { id: "settles-disputes", label: "Settles legal disputes", hint: "Hearing cases and delivering justice", bucket: "judiciary" },
];

export default function CivicsSort({ controller }) {
  const {
    buckets,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    moveItemToBucket,
    handleBucketDrop,
    removeItem,
    isPlaced,
  } = useBucketSortGame(
    branchBuckets.map((bucket) => bucket.id),
    controller.sessionId,
  );

  const [dragOverBucket, setDragOverBucket] = useState(null);

  const responsibilityMap = useMemo(
    () =>
      Object.fromEntries(
        responsibilities.map((r) => [r.id, r]),
      ),
    [],
  );

  const solved = responsibilities.every((r) =>
    buckets[r.bucket].includes(r.id),
  );

  const isBucketCorrect = (bucketId) => {
    const expected = responsibilities.filter((r) => r.bucket === bucketId);
    return expected.length > 0 && expected.every((r) => buckets[bucketId].includes(r.id));
  };

  const placedCount = responsibilities.filter((r) => isPlaced(r.id)).length;

  const handleSelect = (itemId) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const dropToBucket = (bucketId) => {
    if (controller.isLocked || !selectedItemId) {
      return;
    }

    controller.clearFeedback();
    moveItemToBucket(bucketId, selectedItemId);
    setDragOverBucket(null);
  };

  const handleCheck = () => {
    controller.submitAttempt(solved, {
      success:
        "Great sorting. Every responsibility is matched to the correct branch of government.",
      failure:
        "Some cards are still in the wrong branch. Review each responsibility and sort again.",
      locked:
        "The challenge is locked after 10 tries. Restart and sort the branches again.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank (Side Panel) ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Unsorted Cards
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Government Responsibilities
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {placedCount}/{responsibilities.length} sorted
        </p>

        <div className="inventory-rail hide-scrollbar mt-6">
          {responsibilities.map((responsibility) => (
            <motion.button
              key={responsibility.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(responsibility.id);
                setSelectedItemId(responsibility.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(responsibility.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className={[
                "token-card text-left",
                selectedItemId === responsibility.id
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(responsibility.id) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <p className="text-base font-semibold text-slate-900">
                {responsibility.label}
              </p>
              <p className="mt-1.5 text-sm text-slate-500">{responsibility.hint}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Drop Canvas (Main Area) ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sorting Board
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Three branches of government</h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Drag → Drop into branches
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_40%,#fff7ed_100%)] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-3">
            {branchBuckets.map((bucket) => {
              const bucketCorrect = isBucketCorrect(bucket.id);
              const isDragOver = dragOverBucket === bucket.id;

              return (
                <motion.button
                  key={bucket.id}
                  type="button"
                  disabled={controller.isLocked}
                  onClick={() => dropToBucket(bucket.id)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverBucket(bucket.id);
                  }}
                  onDragLeave={() => setDragOverBucket(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    handleBucketDrop(bucket.id);
                    setDragOverBucket(null);
                  }}
                  whileHover={{ scale: 1.01 }}
                  className={[
                    "flex min-h-[320px] flex-col rounded-[26px] border-2 border-l-[6px] border-dashed p-5 text-left shadow-sm transition-all duration-300",
                    bucket.accent,
                    bucket.bgTint,
                    isDragOver
                      ? `border-amazze-purple-400 ring-4 ${bucket.ringTint} bg-amazze-purple-50/30`
                      : "border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${bucket.tone} shadow-md`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold text-slate-900">{bucket.title}</p>
                        <AnimatePresence>
                          {bucketCorrect && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-md"
                            >
                              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
                                <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{bucket.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-1 flex-col gap-3">
                    <AnimatePresence mode="popLayout">
                      {buckets[bucket.id].length > 0 ? (
                        buckets[bucket.id].map((responsibilityId) => (
                          <motion.div
                            key={responsibilityId}
                            layout
                            initial={{ scale: 0.85, opacity: 0, y: -8 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.85, opacity: 0, y: 8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            className="rounded-2xl bg-white px-5 py-4 text-base font-semibold text-slate-800 shadow-sm"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span>{responsibilityMap[responsibilityId].label}</span>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeItem(responsibilityId);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    removeItem(responsibilityId);
                                  }
                                }}
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-slate-200 transition hover:bg-red-50 hover:text-red-600 hover:ring-red-200"
                              >
                                Remove
                              </span>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          layout
                          className="flex flex-1 items-center justify-center rounded-[22px] border-2 border-dashed border-slate-200 bg-white/60 p-6 text-center text-sm font-semibold text-slate-400"
                        >
                          Drop cards here
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={controller.isLocked}
              className="soft-button-primary"
            >
              Check Sorting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
