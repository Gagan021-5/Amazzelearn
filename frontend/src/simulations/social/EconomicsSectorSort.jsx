import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBucketSortGame } from "../../hooks/useBucketSortGame";

const sectorBuckets = [
  {
    id: "primary",
    title: "Primary",
    description: "Uses natural resources directly.",
    tone: "from-sky-400 to-cyan-500",
    accent: "border-l-sky-400",
    bgTint: "bg-sky-50/60",
    ringTint: "ring-sky-200/60",
  },
  {
    id: "secondary",
    title: "Secondary",
    description: "Turns raw materials into finished goods.",
    tone: "from-amber-400 to-orange-500",
    accent: "border-l-amber-400",
    bgTint: "bg-amber-50/60",
    ringTint: "ring-amber-200/60",
  },
  {
    id: "tertiary",
    title: "Tertiary",
    description: "Provides services to people and businesses.",
    tone: "from-emerald-400 to-teal-500",
    accent: "border-l-emerald-400",
    bgTint: "bg-emerald-50/60",
    ringTint: "ring-emerald-200/60",
  },
];

const sectorActivities = [
  { id: "farming", label: "Farming", imgSrc: "/assets/images/economic-sectors/farming_icon_1776578825488.png", bucket: "primary" },
  { id: "fishing", label: "Fishing", imgSrc: "/assets/images/economic-sectors/fishing_icon_1776579101758.png", bucket: "primary" },
  { id: "manufacturing", label: "Manufacturing", imgSrc: "/assets/images/economic-sectors/manufacturing_icon_1776579134703.png", bucket: "secondary" },
  { id: "textiles", label: "Textiles", imgSrc: "/assets/images/economic-sectors/textiles_icon_1776579149950.png", bucket: "secondary" },
  { id: "banking", label: "Banking", imgSrc: "/assets/images/economic-sectors/banking_icon_1776579169385.png", bucket: "tertiary" },
  { id: "teaching", label: "Teaching", imgSrc: "/assets/images/economic-sectors/teaching_icon_1776579185289.png", bucket: "tertiary" },
];

export default function EconomicsSectorSort({ controller }) {
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
    sectorBuckets.map((bucket) => bucket.id),
    controller.sessionId,
  );

  const [dragOverBucket, setDragOverBucket] = useState(null);

  const activityMap = useMemo(
    () => Object.fromEntries(sectorActivities.map((item) => [item.id, item])),
    [],
  );

  const solved = sectorActivities.every((item) =>
    buckets[item.bucket].includes(item.id),
  );

  const isBucketCorrect = (bucketId) => {
    const expected = sectorActivities.filter((item) => item.bucket === bucketId);
    return expected.length > 0 && expected.every((item) => buckets[bucketId].includes(item.id));
  };

  const placedCount = sectorActivities.filter((item) => isPlaced(item.id)).length;

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
        "Excellent sorting. Every activity is matched to the correct economic sector.",
      failure:
        "Some activities are still in the wrong sector. Review how primary, secondary, and tertiary sectors differ, then try again.",
      locked:
        "The challenge is locked after 10 tries. Restart and sort the sectors again.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank (Side Panel) ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Activity Cards
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">
          Economic Sectors
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {placedCount}/{sectorActivities.length} sorted
        </p>

        <div className="inventory-rail hide-scrollbar mt-6 grid grid-cols-2 gap-4">
          {sectorActivities.map((activity) => (
            <motion.button
              key={activity.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(activity.id);
                setSelectedItemId(activity.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(activity.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className={[
                "flex flex-col items-center justify-center rounded-2xl bg-white p-3 shadow-md border-2 transition-all",
                selectedItemId === activity.id ? "border-sky-400 ring-4 ring-sky-100" : "border-transparent",
                isPlaced(activity.id) ? "opacity-30 pointer-events-none" : "",
              ].join(" ")}
            >
              <img 
                src={activity.imgSrc} 
                alt={activity.label} 
                className="w-full aspect-square object-contain drop-shadow-sm pointer-events-none rounded-lg"
              />
              {/* Optional: we can keep a tiny label underneath since user said "replace text entirely", but label often helps. I'll hide the text layer as requested. */}
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
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Group each tile by sector
            </h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Drag → Drop into buckets
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_40%,#fefce8_100%)] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-3">
            {sectorBuckets.map((bucket) => {
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
                    "flex min-h-[360px] flex-col rounded-[26px] border-2 border-l-[6px] border-dashed p-5 text-left shadow-sm transition-all duration-300",
                    bucket.accent,
                    bucket.bgTint,
                    isDragOver
                      ? `border-amazze-purple-400 ring-4 ${bucket.ringTint} bg-amazze-purple-50/30`
                      : "border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${bucket.tone} shadow-sm`}
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
                              className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 shadow-sm"
                            >
                              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none">
                                <path d="M3 8l3 3 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{bucket.description}</p>
                    </div>
                  </div>

                  {/* Drop zone visual area */}
                  <div className="mt-5 flex flex-1 flex-col gap-3 rounded-2xl bg-white/40 p-3">
                    <AnimatePresence mode="popLayout">
                      {buckets[bucket.id].length > 0 ? (
                        <div className="grid grid-cols-2 gap-3 place-items-center w-full">
                          {buckets[bucket.id].map((activityId) => {
                            const activity = activityMap[activityId];
                            return (
                              <motion.div
                                key={activityId}
                                layout
                                initial={{ scale: 0.5, opacity: 0, y: -10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.5, opacity: 0, y: 10 }}
                                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                className="relative group w-full max-w-[120px] aspect-square rounded-2xl bg-white p-3 shadow-md"
                              >
                                <img 
                                  src={activity.imgSrc} 
                                  alt={activity.label} 
                                  className="w-full h-full object-contain pointer-events-none rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    removeItem(activityId);
                                  }}
                                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-500 hover:text-white"
                                >
                                  ×
                                </button>
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <motion.div
                          layout
                          className="flex flex-1 items-center justify-center rounded-[18px] border-2 border-dashed border-slate-200/50 bg-white/50 p-6 text-center text-sm font-semibold text-slate-400"
                        >
                          Drop image tiles here
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
