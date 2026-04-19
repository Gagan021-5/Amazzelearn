import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

/**
 * Cell Anatomy Map — 5 organelles (Nucleus, Mitochondria, Ribosomes, ER, Golgi)
 * Students drag organelle labels to correct drop-zones in a large SVG cell.
 */

const organelles = [
  {
    id: "nucleus",
    label: "Nucleus",
    note: "Controls the cell and stores genetic material (DNA).",
    tone: "from-fuchsia-400 to-pink-400",
  },
  {
    id: "mitochondria",
    label: "Mitochondria",
    note: "The powerhouse — produces ATP energy for the cell.",
    tone: "from-amber-400 to-orange-500",
  },
  {
    id: "ribosomes",
    label: "Ribosomes",
    note: "Tiny factories that build proteins from amino acids.",
    tone: "from-sky-400 to-cyan-500",
  },
  {
    id: "er",
    label: "Endoplasmic Reticulum",
    note: "A network of membranes that transports materials through the cell.",
    tone: "from-emerald-400 to-teal-500",
  },
  {
    id: "golgi",
    label: "Golgi Apparatus",
    note: "Packages and ships proteins to their destinations.",
    tone: "from-violet-400 to-indigo-500",
  },
];

const zones = [
  {
    id: "nucleus-zone",
    label: "Nucleus Zone",
    hint: "Large central organelle",
    correctId: "nucleus",
    top: "top-[38%]",
    left: "left-[35%]",
  },
  {
    id: "mitochondria-zone",
    label: "Mitochondria Zone",
    hint: "Bean-shaped power center",
    correctId: "mitochondria",
    top: "top-[62%]",
    left: "left-[68%]",
  },
  {
    id: "ribosomes-zone",
    label: "Ribosomes Zone",
    hint: "Small dotted particles",
    correctId: "ribosomes",
    top: "top-[28%]",
    left: "left-[65%]",
  },
  {
    id: "er-zone",
    label: "ER Zone",
    hint: "Folded membrane network",
    correctId: "er",
    top: "top-[55%]",
    left: "left-[25%]",
  },
  {
    id: "golgi-zone",
    label: "Golgi Zone",
    hint: "Stacked membrane discs",
    correctId: "golgi",
    top: "top-[72%]",
    left: "left-[42%]",
  },
];

export default function CellAnatomy({ controller }) {
  const {
    placements,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    placeItem,
    clearZone,
    isPlaced,
  } = useSinglePlacementGame(
    zones.map((zone) => zone.id),
    controller.sessionId,
  );

  const [dragOverZone, setDragOverZone] = useState(null);

  const organelleMap = useMemo(
    () => Object.fromEntries(organelles.map((item) => [item.id, item])),
    [],
  );

  const completed = zones.every(
    (zone) => placements[zone.id] === zone.correctId,
  );

  const placedCount = zones.filter((zone) => placements[zone.id]).length;

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
    if (zones.some((zone) => !placements[zone.id])) {
      controller.submitAttempt(false, {
        failure:
          "Place all five organelles into their zones before checking the anatomy map.",
        locked:
          "You have used all attempts. Restart the cell map and place the organelles again.",
      });
      return;
    }

    controller.submitAttempt(completed, {
      success:
        "Cell map complete! All five organelles — Nucleus, Mitochondria, Ribosomes, ER, and Golgi — are correctly placed.",
      failure:
        "One or more organelles are misplaced. Review each zone carefully and try again.",
      locked:
        "You have used all attempts. Restart the cell map and place the organelles again.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Organelle Tray
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Drag into the cell</h2>
        <p className="mt-2 text-sm text-slate-500">
          {placedCount}/{organelles.length} placed
        </p>
        <div className="inventory-rail hide-scrollbar mt-6">
          {organelles.map((organelle) => (
            <motion.button
              key={organelle.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(organelle.id);
                setSelectedItemId(organelle.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(organelle.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className={[
                "token-card text-left",
                selectedItemId === organelle.id
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(organelle.id) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br ${organelle.tone} shadow-md`}
                />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {organelle.label}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500">{organelle.note}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Biology Viewer
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Animal cell anatomy</h2>
          </div>
          <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            Place each organelle in the highlighted zone
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#f0fdf4_0%,#ffffff_50%,#eff6ff_100%)] p-5 sm:p-6">
          <div className="overflow-x-auto pb-2">
            <div className="relative min-h-[480px] min-w-[700px] overflow-hidden rounded-[26px] border border-white/70 bg-white/85 p-4">
              {/* ── Rich SVG Cell Diagram ── */}
              <svg viewBox="0 0 700 420" className="absolute inset-0 h-full w-full">
                {/* Cell membrane */}
                <motion.ellipse
                  cx="350"
                  cy="210"
                  rx="290"
                  ry="160"
                  fill="rgba(187,247,208,0.25)"
                  stroke={controller.status === "success" ? "#10b981" : "#86efac"}
                  strokeWidth="10"
                  animate={{
                    scale: controller.status === "success" ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: controller.status === "success" ? Infinity : 0,
                  }}
                />

                {/* Nucleus outline */}
                <ellipse
                  cx="240"
                  cy="165"
                  rx="62"
                  ry="50"
                  fill="rgba(244,114,182,0.12)"
                  stroke="#f472b6"
                  strokeDasharray="10 10"
                  strokeWidth="5"
                />
                <circle cx="230" cy="160" r="12" fill="rgba(236,72,153,0.18)" />

                {/* Mitochondria outline */}
                <ellipse
                  cx="480"
                  cy="265"
                  rx="68"
                  ry="32"
                  fill="rgba(251,191,36,0.12)"
                  stroke="#f59e0b"
                  strokeDasharray="10 10"
                  strokeWidth="5"
                />
                <path
                  d="M440 265q10-18 20 0 M460 265q10-18 20 0 M480 265q10-18 20 0 M500 265q10-18 20 0"
                  fill="none"
                  stroke="rgba(245,158,11,0.3)"
                  strokeWidth="2"
                />

                {/* Ribosomes zone */}
                <circle cx="460" cy="120" r="4" fill="rgba(56,189,248,0.35)" />
                <circle cx="448" cy="132" r="3" fill="rgba(56,189,248,0.3)" />
                <circle cx="472" cy="128" r="4" fill="rgba(56,189,248,0.35)" />
                <circle cx="456" cy="110" r="3" fill="rgba(56,189,248,0.25)" />
                <circle cx="480" cy="118" r="3" fill="rgba(56,189,248,0.3)" />
                <circle cx="440" cy="118" r="3.5" fill="rgba(56,189,248,0.3)" />
                <circle
                  cx="460"
                  cy="122"
                  r="30"
                  fill="none"
                  stroke="#38bdf8"
                  strokeDasharray="8 8"
                  strokeWidth="4"
                />

                {/* ER zone */}
                <path
                  d="M130 230q20-22 40 0q20 22 40 0q20-22 40 0"
                  fill="none"
                  stroke="#10b981"
                  strokeDasharray="8 8"
                  strokeWidth="5"
                />
                <path
                  d="M130 250q20-22 40 0q20 22 40 0q20-22 40 0"
                  fill="none"
                  stroke="rgba(16,185,129,0.3)"
                  strokeWidth="3"
                />
                <rect
                  x="120"
                  y="210"
                  width="110"
                  height="60"
                  rx="14"
                  fill="rgba(16,185,129,0.06)"
                  stroke="#10b981"
                  strokeDasharray="8 8"
                  strokeWidth="3"
                />

                {/* Golgi zone */}
                <ellipse cx="300" cy="310" rx="50" ry="10" fill="rgba(139,92,246,0.12)" stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth="4" />
                <ellipse cx="300" cy="322" rx="44" ry="9" fill="rgba(139,92,246,0.08)" stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth="3" />
                <ellipse cx="300" cy="333" rx="38" ry="8" fill="rgba(139,92,246,0.06)" stroke="#8b5cf6" strokeDasharray="8 8" strokeWidth="3" />

                {/* Additional cell details */}
                <circle cx="560" cy="175" r="10" fill="rgba(59,130,246,0.1)" />
                <circle cx="145" cy="145" r="8" fill="rgba(14,165,233,0.1)" />
                <circle cx="530" cy="340" r="7" fill="rgba(59,130,246,0.1)" />
                <circle cx="190" cy="330" r="6" fill="rgba(16,185,129,0.12)" />
              </svg>

              {/* ── Drop zones ── */}
              {zones.map((zone) => {
                const organelle = placements[zone.id]
                  ? organelleMap[placements[zone.id]]
                  : null;
                const isDragOver = dragOverZone === zone.id;

                return (
                  <motion.button
                    key={zone.id}
                    type="button"
                    disabled={controller.isLocked}
                    onClick={() => handlePlace(zone.id, selectedItemId)}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverZone(zone.id);
                    }}
                    onDragLeave={() => setDragOverZone(null)}
                    onDrop={(event) => {
                      event.preventDefault();
                      handlePlace(zone.id, selectedItemId);
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={`absolute ${zone.top} ${zone.left} flex min-h-[84px] min-w-[140px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[22px] border-2 border-dashed px-5 py-4 text-center shadow-sm transition-all duration-300 ${
                      organelle
                        ? "border-emerald-300 bg-emerald-50/80"
                        : isDragOver
                          ? "border-amazze-purple-400 bg-amazze-purple-50/60 ring-4 ring-amazze-purple-100/60"
                          : "border-slate-300 bg-white/80 hover:border-sky-300"
                    }`}
                  >
                    {organelle ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      >
                        <div
                          className={`mx-auto h-11 w-11 rounded-2xl bg-gradient-to-br ${organelle.tone} shadow-md`}
                        />
                        <p className="mt-2 text-sm font-semibold text-slate-800">
                          {organelle.label}
                        </p>
                      </motion.div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                          {zone.label}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{zone.hint}</p>
                      </div>
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
              Check Anatomy
            </button>
            {zones.map((zone) =>
              placements[zone.id] ? (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => clearZone(zone.id)}
                  className="soft-button-secondary"
                >
                  Clear {zone.label}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
