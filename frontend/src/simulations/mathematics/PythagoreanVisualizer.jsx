import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

/**
 * Pythagorean Theorem Visualizer
 * Two modes: "Drag" (number bank) or "Slider" (real-time a/b sliders).
 * SVG triangle + area squares resize in real time.
 */

const numberTiles = ["3", "4", "5", "6", "8", "10", "12", "13"];

const slots = [
  { id: "leg-a", label: "Leg a", hint: "Place the horizontal leg length." },
  { id: "leg-b", label: "Leg b", hint: "Place the vertical leg length." },
  { id: "hypotenuse", label: "Hypotenuse c", hint: "Place the longest side here." },
];

function buildHypotenuseSquare(ax, ay, cx, cy) {
  const dx = cx - ax;
  const dy = cy - ay;
  return `${ax},${ay} ${cx},${cy} ${cx + dy},${cy - dx} ${ax + dy},${ay - dx}`;
}

export default function PythagoreanVisualizer({ controller }) {
  const [inputMode, setInputMode] = useState("drag"); // "drag" | "slider"
  const [sliderA, setSliderA] = useState(6);
  const [sliderB, setSliderB] = useState(8);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  const {
    placements,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    placeItem,
    clearZone,
    isPlaced,
  } = useSinglePlacementGame(
    slots.map((slot) => slot.id),
    controller.sessionId,
  );

  // Compute values based on mode
  const a = inputMode === "slider" ? sliderA : Number(placements["leg-a"] || 0);
  const b = inputMode === "slider" ? sliderB : Number(placements["leg-b"] || 0);
  const cComputed = inputMode === "slider" ? Math.sqrt(a ** 2 + b ** 2) : 0;
  const c = inputMode === "slider" ? cComputed : Number(placements.hypotenuse || 0);
  const hasAllSides = inputMode === "slider" ? (a > 0 && b > 0) : Boolean(a && b && c);
  const lhs = a ** 2 + b ** 2;
  const rhs = inputMode === "slider" ? lhs : c ** 2;
  const isRightTriangle = hasAllSides && Math.abs(lhs - rhs) < 0.01;
  const meetsTarget = inputMode === "drag" && isRightTriangle && c === 10;

  const scale = 10;
  const originX = 150;
  const originY = 170;
  const basePixels = a * scale;
  const heightPixels = b * scale;
  const topX = originX;
  const topY = originY - heightPixels;
  const rightX = originX + basePixels;
  const rightY = originY;

  const theoremMessage = useMemo(() => {
    if (!hasAllSides) {
      return inputMode === "slider"
        ? "Adjust the sliders to build a triangle and see the theorem live."
        : "Place lengths for a, b, and c to test the theorem.";
    }

    if (inputMode === "slider") {
      return `a² + b² = ${a}² + ${b}² = ${lhs}. Hypotenuse c = √${lhs} ≈ ${cComputed.toFixed(2)}`;
    }

    if (meetsTarget) {
      return "Perfect. 6² + 8² = 10², so this is the target Pythagorean triple.";
    }

    if (isRightTriangle) {
      return "These lengths do satisfy a² + b² = c², but the target hypotenuse is 10.";
    }

    return "These three lengths do not satisfy a² + b² = c².";
  }, [hasAllSides, isRightTriangle, meetsTarget, a, b, c, lhs, cComputed, inputMode]);

  const handleSelect = (value) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === value ? null : value));
  };

  const handlePlace = (slotId, value) => {
    if (controller.isLocked || !value) return;
    controller.clearFeedback();
    placeItem(slotId, value);
    setDragOverSlot(null);
  };

  const handleCheck = () => {
    if (inputMode === "slider") {
      const isWholeNumber = cComputed === Math.round(cComputed);
      const isTarget = isWholeNumber && Math.round(cComputed) === 10;

      controller.submitAttempt(isTarget, {
        success: "Correct! With a=6 and b=8, the hypotenuse is exactly 10. A perfect Pythagorean triple.",
        failure: isWholeNumber
          ? `c = ${Math.round(cComputed)}, which is a valid Pythagorean triple, but the challenge asks for c = 10.`
          : `c ≈ ${cComputed.toFixed(2)} is not a whole number. Try finding integer values where a² + b² gives a perfect square equal to 100.`,
        locked: "All attempts are used. Restart the builder and try new side lengths.",
      });
      return;
    }

    if (!hasAllSides) {
      controller.submitAttempt(false, {
        failure: "Place one length on each side label before checking whether the triangle satisfies the theorem.",
        locked: "All attempts are used. Restart the triangle builder and choose a new set of side lengths.",
      });
      return;
    }

    controller.submitAttempt(meetsTarget, {
      success: "Correct. The triangle uses the 6-8-10 Pythagorean triple, so the hypotenuse is exactly 10.",
      failure: isRightTriangle
        ? "These lengths form a valid right triangle, but the challenge asks for a hypotenuse of 10."
        : "This set of side lengths does not satisfy a² + b² = c².",
      locked: "All attempts are used. Restart the builder and assemble a new triangle.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {inputMode === "drag" ? "Number Bank" : "Slider Controls"}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Right triangle builder</h2>
          </div>
          <div className="rounded-2xl bg-amber-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Goal</p>
            <p className="mt-1 text-sm font-bold text-amber-900">Make c = 10</p>
          </div>
        </div>

        {/* ── Mode Toggle ── */}
        <div className="mt-5 flex rounded-2xl bg-slate-100 p-1">
          {["drag", "slider"].map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setInputMode(mode)}
              className={[
                "flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition",
                inputMode === mode
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700",
              ].join(" ")}
            >
              {mode === "drag" ? "🎯 Drag Mode" : "🎚️ Slider Mode"}
            </button>
          ))}
        </div>

        {inputMode === "drag" ? (
          /* ── Drag Mode: Number Bank ── */
          <div className="inventory-rail hide-scrollbar mt-6">
            {numberTiles.map((value, index) => {
              const tone = [
                "from-orange-400 to-amber-500",
                "from-sky-400 to-cyan-500",
                "from-emerald-400 to-teal-500",
                "from-rose-400 to-orange-500",
                "from-indigo-400 to-violet-500",
                "from-amber-400 to-yellow-500",
                "from-cyan-400 to-sky-600",
                "from-fuchsia-400 to-violet-500",
              ][index];

              return (
                <motion.button
                  key={value}
                  type="button"
                  draggable={!controller.isLocked}
                  onDragStart={() => {
                    controller.clearFeedback();
                    setDraggedItemId(value);
                    setSelectedItemId(value);
                  }}
                  onDragEnd={() => setDraggedItemId(null)}
                  onClick={() => handleSelect(value)}
                  disabled={controller.isLocked}
                  whileHover={{ scale: 1.04 }}
                  whileDrag={{ scale: 1.08, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
                  whileTap={{ scale: 0.96 }}
                  className={[
                    "token-card flex h-full items-center justify-center text-center",
                    selectedItemId === value ? "border-sky-300 ring-4 ring-sky-100" : "",
                    isPlaced(value) ? "opacity-40 pointer-events-none" : "",
                  ].join(" ")}
                >
                  <div>
                    <div className={`mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br ${tone} shadow-md`} />
                    <p className="mt-3 text-xl font-bold text-slate-900">{value}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* ── Slider Mode ── */
          <div className="mt-6 space-y-5">
            <div className="rounded-[20px] bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Side a (Base)
                </label>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-800">
                  {sliderA}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={sliderA}
                onChange={(e) => setSliderA(Number(e.target.value))}
                disabled={controller.isLocked}
                className="mt-3"
              />
            </div>
            <div className="rounded-[20px] bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Side b (Perpendicular)
                </label>
                <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-bold text-sky-800">
                  {sliderB}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={sliderB}
                onChange={(e) => setSliderB(Number(e.target.value))}
                disabled={controller.isLocked}
                className="mt-3"
              />
            </div>
            <div className="rounded-[20px] bg-emerald-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Computed hypotenuse c
              </p>
              <p className="mt-2 text-2xl font-bold text-emerald-900">
                {cComputed.toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-emerald-600">
                {cComputed === Math.round(cComputed) ? "✓ Whole number" : "Not a whole number"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Math check</p>
          <p className="mt-2 text-sm text-slate-500">
            Pick side lengths that satisfy the theorem and keep the hypotenuse at exactly 10 units.
          </p>
        </div>
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Geometry Stage</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {inputMode === "slider" ? "Adjust the sliders to explore" : "Drop the side lengths onto the triangle"}
            </h2>
          </div>
          <div
            className={`status-pill ${
              isRightTriangle ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {isRightTriangle ? "Theorem satisfied ✓" : "Theorem not satisfied yet"}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#fff8eb_0%,#ffffff_50%,#eff6ff_100%)] p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              {/* Drop slots — only visible in drag mode */}
              {inputMode === "drag" && (
                <div className="grid gap-4 md:grid-cols-3">
                  {slots.map((slot) => {
                    const value = placements[slot.id];
                    const isDragOver = dragOverSlot === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={controller.isLocked}
                        onClick={() => handlePlace(slot.id, selectedItemId)}
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragOverSlot(slot.id);
                        }}
                        onDragLeave={() => setDragOverSlot(null)}
                        onDrop={(event) => {
                          event.preventDefault();
                          handlePlace(slot.id, selectedItemId);
                        }}
                        className={[
                          "drop-slot text-left",
                          value ? "border-amber-200 bg-amber-50/60" : "",
                          isDragOver ? "drop-slot-active" : "",
                        ].join(" ")}
                      >
                        {value ? (
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{slot.label}</p>
                            <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
                            <p className="text-sm text-slate-500">units</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-base font-semibold text-slate-800">{slot.label}</p>
                            <p className="mt-2 text-sm text-slate-500">{slot.hint}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ── SVG Triangle Visualization ── */}
              <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-5 sm:p-6">
                <div className="overflow-x-auto pb-2">
                  <div className="min-w-[420px]">
                    <svg viewBox="0 0 420 320" className="w-full">
                      <rect x="0" y="0" width="420" height="320" fill="transparent" />

                      {a ? (
                        <motion.rect
                          x={originX}
                          y={originY}
                          width={basePixels}
                          height={basePixels}
                          fill="rgba(251,191,36,0.18)"
                          stroke="#f59e0b"
                          strokeWidth="4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, width: basePixels, height: basePixels }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : null}

                      {b ? (
                        <motion.rect
                          x={originX - heightPixels}
                          y={topY}
                          width={heightPixels}
                          height={heightPixels}
                          fill="rgba(56,189,248,0.18)"
                          stroke="#0ea5e9"
                          strokeWidth="4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1, width: heightPixels, height: heightPixels }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : null}

                      {a && b ? (
                        <motion.polygon
                          points={buildHypotenuseSquare(topX, topY, rightX, rightY)}
                          fill="rgba(16,185,129,0.16)"
                          stroke="#10b981"
                          strokeWidth="4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : null}

                      {hasAllSides ? (
                        <motion.polygon
                          points={`${originX},${originY} ${rightX},${rightY} ${topX},${topY}`}
                          fill="rgba(255,255,255,0.94)"
                          stroke={
                            isRightTriangle || controller.status === "success"
                              ? "#10b981"
                              : "#334155"
                          }
                          strokeWidth="6"
                          animate={{
                            scale:
                              (inputMode === "drag" && meetsTarget) || controller.status === "success"
                                ? [1, 1.02, 1]
                                : 1,
                          }}
                          transition={{
                            duration: 1.4,
                            repeat:
                              (inputMode === "drag" && meetsTarget) || controller.status === "success" ? Infinity : 0,
                          }}
                        />
                      ) : (
                        <path
                          d="M150 170L250 170L150 90Z"
                          fill="rgba(255,255,255,0.7)"
                          stroke="#cbd5e1"
                          strokeWidth="4"
                          strokeDasharray="10 10"
                        />
                      )}

                      <rect
                        x={originX}
                        y={originY - 18}
                        width="18"
                        height="18"
                        fill="rgba(15,23,42,0.12)"
                      />

                      {a ? (
                        <text
                          x={originX + basePixels / 2}
                          y={originY - 14}
                          textAnchor="middle"
                          className="fill-amber-700 text-[15px] font-bold"
                        >
                          a = {a}
                        </text>
                      ) : null}

                      {b ? (
                        <text
                          x={originX - 26}
                          y={originY - heightPixels / 2}
                          textAnchor="middle"
                          className="fill-sky-700 text-[15px] font-bold"
                        >
                          b = {b}
                        </text>
                      ) : null}

                      {(inputMode === "drag" ? c : hasAllSides) ? (
                        <text
                          x={(topX + rightX) / 2 + 34}
                          y={(topY + rightY) / 2 - 10}
                          textAnchor="middle"
                          className="fill-emerald-700 text-[15px] font-bold"
                        >
                          c = {inputMode === "slider" ? cComputed.toFixed(1) : c}
                        </text>
                      ) : null}
                    </svg>
                  </div>
                </div>

                {/* ── Dynamic Calculation Box ── */}
                <motion.div
                  className="mt-5 rounded-[24px] bg-slate-50 p-5"
                  animate={{
                    borderColor: isRightTriangle ? "rgba(16,185,129,0.4)" : "transparent",
                  }}
                  style={{ border: "2px solid transparent" }}
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {hasAllSides
                      ? inputMode === "slider"
                        ? `a² + b² = ${a}² + ${b}² = ${lhs} → c = √${lhs} ≈ ${cComputed.toFixed(2)}`
                        : `a² + b² = c² → ${a}² + ${b}² = ${c}² → ${lhs} ${lhs === rhs ? "=" : "≠"} ${rhs}`
                      : "a² + b² = c²"}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">{theoremMessage}</p>
                </motion.div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="panel-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Area comparison</p>
                <div className="mt-4 grid gap-3">
                  {[
                    { label: "a²", value: a ? a ** 2 : "-", tone: "bg-amber-50 text-amber-700" },
                    { label: "b²", value: b ? b ** 2 : "-", tone: "bg-sky-50 text-sky-700" },
                    {
                      label: "c²",
                      value: inputMode === "slider"
                        ? (hasAllSides ? lhs.toFixed(0) : "-")
                        : (c ? c ** 2 : "-"),
                      tone: "bg-emerald-50 text-emerald-700",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 px-5 py-3.5"
                    >
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                      <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${item.tone}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={controller.isLocked}
                  className="soft-button-primary"
                >
                  Check Triangle
                </button>
                {inputMode === "drag" &&
                  slots.map((slot) =>
                    placements[slot.id] ? (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => clearZone(slot.id)}
                        className="soft-button-secondary"
                      >
                        Clear {slot.label}
                      </button>
                    ) : null,
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
