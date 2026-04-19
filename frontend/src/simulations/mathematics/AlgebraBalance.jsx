import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

/**
 * Algebra Balance — interactive balancing scale for solving x + 2 = 5.
 * Enhanced with richer SVG scale, spring overshoot tilt, and sparkle on solve.
 */

const weights = ["1", "2", "3", "4", "5"];
const zones = [
  { id: "x-slot", label: "x Value Slot" },
  { id: "right-slot", label: "Right Pan Slot" },
];

export default function AlgebraBalance({ controller }) {
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

  const leftValue = Number(placements["x-slot"] || 0) + 2;
  const rightValue = Number(placements["right-slot"] || 0);
  const beamRotation = Math.max(-12, Math.min(12, (rightValue - leftValue) * 3));
  const solved =
    placements["x-slot"] === "3" && placements["right-slot"] === "5";

  const weightStyles = useMemo(
    () =>
      Object.fromEntries(
        weights.map((weight, index) => [
          weight,
          [
            "from-orange-400 to-amber-500",
            "from-sky-400 to-cyan-500",
            "from-emerald-400 to-teal-500",
            "from-violet-400 to-fuchsia-500",
            "from-rose-400 to-orange-500",
          ][index],
        ]),
      ),
    [],
  );

  const handleSelect = (weight) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === weight ? null : weight));
  };

  const handlePlace = (zoneId, weight) => {
    if (controller.isLocked || !weight) {
      return;
    }

    controller.clearFeedback();
    placeItem(zoneId, weight);
  };

  const handleCheck = () => {
    controller.submitAttempt(solved, {
      success:
        "Balanced perfectly. x equals 3 because 3 + 2 matches the 5 on the right pan.",
      failure:
        "The scale is not balanced yet. Choose a value for x and a matching right-side weight.",
      locked:
        "Attempts are finished. Restart the balancing scale and solve the equation again.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Weight Bank
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Choose numbered weights</h2>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {weights.map((weight) => (
            <motion.button
              key={weight}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(weight);
                setSelectedItemId(weight);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(weight)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.04 }}
              whileDrag={{ scale: 1.08, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.96 }}
              className={[
                "token-card flex h-28 items-center justify-center text-center",
                selectedItemId === weight
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(weight) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <div>
                <div
                  className={`mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${weightStyles[weight]} shadow-md`}
                />
                <p className="mt-3 text-xl font-bold text-slate-900">{weight}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Equation target</p>
          <p className="mt-2 text-sm text-slate-500">
            Solve <span className="font-bold text-slate-900">x + 2 = 5</span> by
            placing the correct x-value on the left pan and the matching total
            on the right pan.
          </p>
        </div>
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Algebra Stage
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Interactive balancing scale</h2>
          </div>
          <motion.div
            animate={{
              backgroundColor: solved ? "rgb(240 253 244)" : "rgb(255 247 237)",
              color: solved ? "rgb(21 128 61)" : "rgb(194 65 12)",
            }}
            className="rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            Left: {leftValue} | Right: {rightValue}
          </motion.div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_50%,#eef6ff_100%)] p-5 sm:p-6">
          <div className="overflow-x-auto pb-2">
            <div className="relative min-h-[420px] min-w-[560px] overflow-hidden rounded-[26px] border border-white/70 bg-white/85 p-4">
              {/* ── Sparkle effect on solve ── */}
              <AnimatePresence>
                {(solved || controller.status === "success") && (
                  <>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={`sparkle-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1.2, 0],
                          x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 12)],
                          y: [0, -20 - i * 8],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "35%",
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          backgroundColor: ["#f59e0b", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6", "#06b6d4"][i],
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* ── Scale base ── */}
              <div className="absolute bottom-0 left-1/2 h-28 w-24 -translate-x-1/2 rounded-t-[36px] bg-gradient-to-b from-amber-200 to-amber-400 shadow-inner" />
              <div className="absolute bottom-24 left-1/2 h-0 w-0 -translate-x-1/2 border-l-[70px] border-r-[70px] border-b-[110px] border-l-transparent border-r-transparent border-b-amber-600/80" />

              {/* ── Fulcrum dot ── */}
              <div className="absolute bottom-[175px] left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-amber-800 shadow-lg" />

              {/* ── Beam ── */}
              <motion.div
                animate={{ rotate: beamRotation }}
                transition={{ type: "spring", stiffness: 100, damping: 10, mass: 0.8 }}
                style={{ transformOrigin: "50% 18%" }}
                className="absolute bottom-[176px] left-1/2 flex w-[520px] -translate-x-1/2 justify-between"
              >
                <div className="absolute left-[86px] right-[86px] top-7 h-4 rounded-full bg-gradient-to-b from-slate-600 to-slate-800 shadow-md" />

                {/* Left pan */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-1 rounded-full bg-slate-500" />
                  <motion.button
                    type="button"
                    disabled={controller.isLocked}
                    onClick={() => handlePlace("x-slot", selectedItemId)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handlePlace("x-slot", selectedItemId);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex h-36 w-48 flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-white/95 px-5 py-4 shadow-lg"
                  >
                    <div className="mb-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      x + 2
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="rounded-2xl bg-slate-900 px-5 py-3.5 text-base font-bold text-white">
                        {placements["x-slot"] || "x"}
                      </div>
                      <div className="rounded-2xl bg-amber-100 px-5 py-3.5 text-base font-bold text-amber-800">
                        +2
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* Right pan */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="h-10 w-1 rounded-full bg-slate-500" />
                  <motion.button
                    type="button"
                    disabled={controller.isLocked}
                    onClick={() => handlePlace("right-slot", selectedItemId)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      handlePlace("right-slot", selectedItemId);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex h-36 w-48 flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-slate-300 bg-white/95 px-5 py-4 shadow-lg"
                  >
                    <div className="mb-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Right pan
                    </div>
                    <div className="rounded-2xl bg-sky-100 px-6 py-3.5 text-base font-bold text-sky-800">
                      {placements["right-slot"] || "?"}
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheck}
              disabled={controller.isLocked}
              className="soft-button-primary"
            >
              Check Balance
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
