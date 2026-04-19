import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

/**
 * Geography Continent Match — drag 7 continent name labels onto their
 * correct positions on a simplified SVG world map.
 */

const continents = [
  {
    id: "north-america",
    label: "North America",
    description: "Ice cap to tropical Mexico",
    shape:
      "M60 60l30-12 28 6 12 20-8 32 24 18-6 28-22 14-20-6-30 8-28-16 10-30 10-24Z",
    dropTop: "top-[30%]",
    dropLeft: "left-[18%]",
  },
  {
    id: "south-america",
    label: "South America",
    description: "Amazon to Patagonia",
    shape:
      "M148 192l16-8 22 14 8 34-4 42-14 38-22 18-18-22 2-38 6-42 4-26Z",
    dropTop: "top-[62%]",
    dropLeft: "left-[24%]",
  },
  {
    id: "europe",
    label: "Europe",
    description: "Mediterranean to Scandinavia",
    shape:
      "M310 48l22-4 18 8 8 18-6 16 12 10-10 16-26 8-22-10-12-20 6-18 10-14Z",
    dropTop: "top-[25%]",
    dropLeft: "left-[50%]",
  },
  {
    id: "africa",
    label: "Africa",
    description: "Sahara to the Cape",
    shape:
      "M300 132l28-6 24 16 10 36-6 46-18 42-26 16-24-14-8-38 4-52 12-30 4-16Z",
    dropTop: "top-[55%]",
    dropLeft: "left-[48%]",
  },
  {
    id: "asia",
    label: "Asia",
    description: "Largest continent on Earth",
    shape:
      "M380 34l38-6 44 8 32 22 16 36-8 44 22 28-12 32-36 18-40 6-30-16-22-32-18-44 6-48 8-28Z",
    dropTop: "top-[32%]",
    dropLeft: "left-[70%]",
  },
  {
    id: "australia",
    label: "Australia",
    description: "Island continent in Oceania",
    shape:
      "M508 268l28-4 22 12 8 20-10 22-30 8-26-10-4-22 12-18Z",
    dropTop: "top-[72%]",
    dropLeft: "left-[82%]",
  },
  {
    id: "antarctica",
    label: "Antarctica",
    description: "Frozen southern landmass",
    shape:
      "M180 372l64-6 70 2 68-4 54 4 20 10-24 8-52 2-66-2-72 2-50-4-12-8Z",
    dropTop: "top-[92%]",
    dropLeft: "left-[50%]",
  },
];

export default function GeographyMatch({ controller }) {
  const {
    placements,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    placeItem,
    clearZone,
    isPlaced,
  } = useSinglePlacementGame(
    continents.map((c) => c.id),
    controller.sessionId,
  );

  const [dragOverZone, setDragOverZone] = useState(null);

  const continentMap = useMemo(
    () => Object.fromEntries(continents.map((c) => [c.id, c])),
    [],
  );

  const solved = continents.every(
    (c) => placements[c.id] === c.id,
  );

  const placedCount = continents.filter((c) => placements[c.id]).length;

  const handleSelect = (itemId) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const handlePlace = (zoneId, itemId) => {
    if (controller.isLocked || !itemId) {
      return;
    }

    controller.clearFeedback();
    placeItem(zoneId, itemId);
    setDragOverZone(null);
  };

  const handleCheck = () => {
    if (continents.some((c) => !placements[c.id])) {
      controller.submitAttempt(false, {
        failure:
          "Place all seven continent labels on the map before checking.",
        locked:
          "All attempts used. Restart the map and label the continents again.",
      });
      return;
    }

    controller.submitAttempt(solved, {
      success:
        "World map complete! Every continent is correctly labelled on the globe.",
      failure:
        "Some labels are still mismatched. Review the map shapes and try again.",
      locked:
        "The map challenge is locked after 10 tries. Restart and label the continents again.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Continent Labels
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Drag onto the map</h2>
        <p className="mt-2 text-sm text-slate-500">
          {placedCount}/{continents.length} placed
        </p>
        <div className="inventory-rail hide-scrollbar mt-6">
          {continents.map((continent) => (
            <motion.button
              key={continent.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(continent.id);
                setSelectedItemId(continent.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(continent.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className={[
                "token-card text-left",
                selectedItemId === continent.id
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(continent.id) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <p className="text-base font-semibold text-slate-900">{continent.label}</p>
              <p className="mt-1.5 text-sm text-slate-500">{continent.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              World Atlas
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Match the continents</h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Drag labels onto the matching continent shapes
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_52%,#eff6ff_100%)] p-5 sm:p-6">
          <div className="overflow-x-auto pb-2">
            <div className="relative min-h-[480px] min-w-[700px] overflow-hidden rounded-[26px] border border-white/70 bg-white/90 p-4">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.12),transparent_22%),radial-gradient(circle_at_82%_26%,rgba(16,185,129,0.14),transparent_18%),linear-gradient(180deg,rgba(186,230,253,0.15)_0%,rgba(255,255,255,0)_35%)]" />

              {/* SVG World Map with continent silhouettes */}
              <svg viewBox="0 0 700 420" className="absolute inset-0 h-full w-full">
                {/* Latitude lines */}
                <path d="M0 105h700" stroke="rgba(148,163,184,0.15)" strokeWidth="1.5" strokeDasharray="12 12" />
                <path d="M0 210h700" stroke="rgba(148,163,184,0.15)" strokeWidth="1.5" strokeDasharray="12 12" />
                <path d="M0 315h700" stroke="rgba(148,163,184,0.15)" strokeWidth="1.5" strokeDasharray="12 12" />
                {/* Equator */}
                <path d="M0 210h700" stroke="rgba(56,189,248,0.2)" strokeWidth="2" />

                {/* Continent silhouettes */}
                {continents.map((continent) => (
                  <motion.path
                    key={continent.id}
                    d={continent.shape}
                    fill={
                      placements[continent.id] === continent.id
                        ? "rgba(16,185,129,0.18)"
                        : "rgba(15,23,42,0.06)"
                    }
                    stroke={
                      placements[continent.id] === continent.id
                        ? "#10b981"
                        : "#475569"
                    }
                    strokeWidth="4"
                    strokeLinejoin="round"
                    animate={{
                      fill:
                        placements[continent.id] === continent.id
                          ? "rgba(16,185,129,0.18)"
                          : "rgba(15,23,42,0.06)",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </svg>

              {/* Drop zone buttons */}
              {continents.map((continent) => {
                const isDragOver = dragOverZone === continent.id;

                return (
                  <motion.button
                    key={continent.id}
                    type="button"
                    disabled={controller.isLocked}
                    onClick={() => handlePlace(continent.id, selectedItemId)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverZone(continent.id);
                    }}
                    onDragLeave={() => setDragOverZone(null)}
                    onDrop={(event) => {
                      event.preventDefault();
                      handlePlace(continent.id, selectedItemId);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className={`absolute ${continent.dropTop} ${continent.dropLeft} flex min-h-[60px] min-w-[120px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[18px] border-2 border-dashed px-4 py-3 text-center shadow-sm transition-all duration-300 ${
                      placements[continent.id]
                        ? "border-emerald-300 bg-emerald-50/90"
                        : isDragOver
                          ? "border-amazze-purple-400 bg-amazze-purple-50/60 ring-4 ring-amazze-purple-100/60"
                          : "border-slate-300 bg-white/90 hover:border-sky-300"
                    }`}
                  >
                    {placements[continent.id] ? (
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      >
                        <p className="text-sm font-semibold text-slate-900">
                          {continentMap[placements[continent.id]].label}
                        </p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.18em] text-emerald-600">
                          placed
                        </p>
                      </motion.div>
                    ) : (
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Drop label
                      </p>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={controller.isLocked}
              className="soft-button-primary"
            >
              Check Map
            </button>
            {continents.map((continent) =>
              placements[continent.id] ? (
                <button
                  key={continent.id}
                  type="button"
                  onClick={() => clearZone(continent.id)}
                  className="soft-button-secondary"
                >
                  Clear {continent.label}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
