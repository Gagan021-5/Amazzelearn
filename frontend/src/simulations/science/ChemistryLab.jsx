import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

const slotConfig = [
  {
    id: "sample-a",
    label: "Sample A",
    hint: "Place the first reagent here.",
  },
  {
    id: "sample-b",
    label: "Sample B",
    hint: "Place the second reagent here.",
  },
];

const samples = [
  {
    id: "water",
    label: "Distilled Water",
    formula: "H₂O",
    role: "Neutral solvent",
    note: "Useful for dissolving samples or making solutions.",
    tone: "from-sky-400 to-cyan-500",
  },
  {
    id: "nacl",
    label: "Sodium Chloride",
    formula: "NaCl",
    role: "Ionic solid",
    note: "Table salt. In water it dissolves, but it does not become NaOH.",
    tone: "from-slate-400 to-slate-600",
  },
  {
    id: "hcl",
    label: "Hydrochloric Acid",
    formula: "HCl",
    role: "Strong acid",
    note: "Neutralizes sodium hydroxide to form salt and water.",
    tone: "from-rose-400 to-orange-500",
  },
  {
    id: "naoh",
    label: "Sodium Hydroxide",
    formula: "NaOH",
    role: "Strong base",
    note: "Reactant used in neutralization reactions.",
    tone: "from-emerald-400 to-teal-500",
  },
  {
    id: "agno3",
    label: "Silver Nitrate",
    formula: "AgNO₃",
    role: "Precipitation reagent",
    note: "Forms a white precipitate with chloride ions.",
    tone: "from-violet-400 to-fuchsia-500",
  },
  {
    id: "nahco3",
    label: "Sodium Bicarbonate",
    formula: "NaHCO₃",
    role: "Carbonate base",
    note: "Reacts with acids to release carbon dioxide gas.",
    tone: "from-amber-400 to-yellow-500",
  },
  {
    id: "ch3cooh",
    label: "Acetic Acid",
    formula: "CH₃COOH",
    role: "Weak acid",
    note: "Vinegar acid that bubbles strongly with bicarbonate.",
    tone: "from-orange-400 to-amber-600",
  },
];

const reactionCatalog = {
  "agno3|nacl": {
    title: "Precipitation Reaction",
    equation: "AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq)",
    products: ["AgCl(s)", "NaNO₃(aq)"],
    observation: "A cloudy white silver chloride precipitate forms immediately.",
    evidence: "A solid appears in the liquid, showing a precipitation reaction.",
    fill: "#d8b4fe",
    glow: "rgba(168,85,247,0.22)",
    bubbles: false,
    precipitate: true,
    success: false,
    feedback:
      "This is a correct reaction, but it does not make the target products NaCl and H₂O.",
  },
  "ch3cooh|nahco3": {
    title: "Gas Evolution",
    equation:
      "CH₃COOH(aq) + NaHCO₃(s) → CH₃COONa(aq) + H₂O(l) + CO₂(g)",
    products: ["CH₃COONa(aq)", "H₂O(l)", "CO₂(g)"],
    observation: "Fizzing occurs as carbon dioxide gas escapes.",
    evidence: "Visible bubbles show that a gas is being formed.",
    fill: "#fcd34d",
    glow: "rgba(245,158,11,0.24)",
    bubbles: true,
    precipitate: false,
    success: false,
    feedback:
      "Valid chemistry, but this reaction makes carbon dioxide gas instead of the target neutralization products.",
  },
  "hcl|naoh": {
    title: "Neutralization",
    equation: "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
    products: ["NaCl(aq)", "H₂O(l)"],
    observation:
      "The acid and base neutralize each other, producing salt and water.",
    evidence:
      "The solution stays clear, warms slightly, and moves toward a neutral pH.",
    fill: "#a7f3d0",
    glow: "rgba(16,185,129,0.24)",
    bubbles: false,
    precipitate: false,
    success: true,
    feedback:
      "Correct reaction. Hydrochloric acid and sodium hydroxide produce sodium chloride and water.",
  },
  "hcl|water": {
    title: "Acid Dilution",
    equation: "HCl(aq) + H₂O(l) → H₃O⁺(aq) + Cl⁻(aq)",
    products: ["H₃O⁺(aq)", "Cl⁻(aq)"],
    observation: "The acid becomes more dilute, but the mixture remains acidic.",
    evidence: "There is no neutralization because no base is present.",
    fill: "#fda4af",
    glow: "rgba(244,63,94,0.2)",
    bubbles: false,
    precipitate: false,
    success: false,
    feedback:
      "Water dilutes hydrochloric acid, but it does not produce NaCl and H₂O as products.",
  },
  "nacl|water": {
    title: "Dissolution",
    equation: "NaCl(s) → Na⁺(aq) + Cl⁻(aq) in H₂O",
    products: ["Na⁺(aq)", "Cl⁻(aq)", "H₂O(l)"],
    observation:
      "The salt dissolves to make a salt solution. No new base appears.",
    evidence:
      "The liquid stays clear, and no gas or precipitate is produced.",
    fill: "#93c5fd",
    glow: "rgba(59,130,246,0.2)",
    bubbles: false,
    precipitate: false,
    success: false,
    feedback:
      "Accuracy note: NaCl added to water makes a salt solution. It does not produce NaOH.",
  },
  "naoh|water": {
    title: "Base Dissolution",
    equation: "NaOH(s) → Na⁺(aq) + OH⁻(aq) in H₂O",
    products: ["Na⁺(aq)", "OH⁻(aq)", "H₂O(l)"],
    observation: "The solid dissolves and the solution stays strongly basic.",
    evidence: "A base dissolved, but the solution is not neutralized.",
    fill: "#86efac",
    glow: "rgba(34,197,94,0.22)",
    bubbles: false,
    precipitate: false,
    success: false,
    feedback:
      "This makes a basic sodium hydroxide solution, not neutral salt and water.",
  },
};

const emptyOutcome = {
  title: "Reaction Console",
  equation: "Add two samples to inspect the chemistry.",
  products: [],
  observation:
    "This bench models accurate outcomes such as dissolution, neutralization, precipitation, and gas evolution.",
  evidence:
    "Target experiment: produce NaCl(aq) and H₂O(l) by choosing the correct acid-base pair.",
  fill: "#bfdbfe",
  glow: "rgba(59,130,246,0.18)",
  bubbles: false,
  precipitate: false,
  success: false,
  feedback: "Choose two samples and then check the experiment.",
};

function getReactionOutcome(firstId, secondId) {
  if (!firstId || !secondId) {
    return emptyOutcome;
  }

  const key = [firstId, secondId].sort().join("|");

  if (reactionCatalog[key]) {
    return reactionCatalog[key];
  }

  return {
    title: "No New Chemical Change",
    equation: "No major reaction is observed under these classroom conditions.",
    products: [],
    observation:
      "The samples may simply mix or dilute without forming a visible new substance.",
    evidence:
      "Not every pair of chemicals reacts, and that is also an important scientific result.",
    fill: "#cbd5e1",
    glow: "rgba(100,116,139,0.2)",
    bubbles: false,
    precipitate: false,
    success: false,
    feedback:
      "This pair does not achieve the target. Try using an acid and a base that neutralize each other.",
  };
}

export default function ChemistryLab({ controller }) {
  const {
    placements,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    placeItem,
    clearZone,
    isPlaced,
  } = useSinglePlacementGame(
    slotConfig.map((slot) => slot.id),
    controller.sessionId,
  );

  const [dragOverSlot, setDragOverSlot] = useState(null);

  const firstSample = placements["sample-a"];
  const secondSample = placements["sample-b"];

  const sampleMap = useMemo(
    () => Object.fromEntries(samples.map((sample) => [sample.id, sample])),
    [],
  );

  const outcome = useMemo(
    () => getReactionOutcome(firstSample, secondSample),
    [firstSample, secondSample],
  );

  const handleSelect = (itemId) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const handlePlace = (slotId, itemId) => {
    if (controller.isLocked || !itemId) {
      return;
    }

    controller.clearFeedback();
    placeItem(slotId, itemId);
    setDragOverSlot(null);
  };

  const handleCheck = () => {
    if (!firstSample || !secondSample) {
      controller.submitAttempt(false, {
        failure:
          "Add two samples before checking the result so the reaction bench has a complete setup.",
        locked:
          "All attempts are used. Restart the lab and place two samples before checking again.",
      });
      return;
    }

    controller.submitAttempt(outcome.success, {
      success:
        "Target achieved. This neutralization makes sodium chloride and water from hydrochloric acid and sodium hydroxide.",
      failure: outcome.feedback,
      locked:
        "All attempts are used. Restart the chemistry lab and try a different reagent pair.",
    });
  };

  const liquidRaised = Boolean(firstSample && secondSample);

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sample Bank
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Chemistry reaction bench</h2>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Lab goal
            </p>
            <p className="mt-1 text-sm font-bold text-emerald-900">
              Make NaCl(aq) + H₂O(l)
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Accuracy note</p>
          <p className="mt-2 text-sm text-slate-500">
            Sodium chloride added to water makes a salt solution. It does not
            produce sodium hydroxide. The target products come from a real
            neutralization reaction instead.
          </p>
        </div>

        <div className="inventory-rail hide-scrollbar mt-6">
          {samples.map((sample) => (
            <motion.button
              key={sample.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(sample.id);
                setSelectedItemId(sample.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(sample.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className={[
                "token-card h-full",
                selectedItemId === sample.id
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(sample.id) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${sample.tone} shadow-md`}
                />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {sample.label}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {sample.formula}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold text-sky-700">
                    {sample.role}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500">{sample.note}</p>
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
              Lab Table
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Mix two samples and inspect the result</h2>
          </div>
          <div className="status-pill bg-sky-50 text-sky-700">
            Choose two reagents, then check the reaction
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_45%,#fef9ec_100%)] p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                {slotConfig.map((slot) => {
                  const sample = placements[slot.id]
                    ? sampleMap[placements[slot.id]]
                    : null;
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
                        sample ? "border-sky-200 bg-sky-50/60" : "",
                        isDragOver ? "drop-slot-active" : "",
                      ].join(" ")}
                    >
                      {sample ? (
                        <div className="flex items-start gap-3 text-left">
                          <div
                            className={`mt-1 h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${sample.tone} shadow-md`}
                          />
                          <div>
                            <p className="text-sm font-semibold text-slate-500">
                              {slot.label}
                            </p>
                            <p className="mt-2 text-lg font-bold text-slate-900">
                              {sample.formula}
                            </p>
                            <p className="text-sm text-slate-500">{sample.label}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-base font-semibold text-slate-800">
                            {slot.label}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">{slot.hint}</p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Reaction Vessel
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Watch the outcome update as soon as two samples are in the beakers.
                    </p>
                  </div>
                  <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
                    {outcome.title}
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[320px] rounded-[26px] bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.12),transparent_25%),radial-gradient(circle_at_75%_25%,rgba(251,191,36,0.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.8)_0%,rgba(241,245,249,0.72)_100%)] p-4">
                    <div className="grid-fade absolute inset-0 opacity-40" />
                    <div className="relative flex h-full items-center justify-center">
                      <svg viewBox="0 0 320 280" className="h-[280px] w-[320px] max-w-full">
                        <defs>
                          <clipPath id="reaction-beaker">
                            <path d="M78 28h164v28l22 34c10 15 18 34 18 57 0 53-40 97-94 97h-56c-54 0-94-44-94-97 0-23 8-42 18-57l22-34V28Z" />
                          </clipPath>
                        </defs>
                        <path
                          d="M78 28h164v28l22 34c10 15 18 34 18 57 0 53-40 97-94 97h-56c-54 0-94-44-94-97 0-23 8-42 18-57l22-34V28Z"
                          fill="rgba(255,255,255,0.8)"
                          stroke="#475569"
                          strokeWidth="8"
                          strokeLinejoin="round"
                        />
                        <g clipPath="url(#reaction-beaker)">
                          <motion.rect
                            x="42"
                            y={liquidRaised ? 128 : 156}
                            width="236"
                            height="130"
                            animate={{
                              y: liquidRaised ? 128 : 156,
                              fill: outcome.fill,
                            }}
                            transition={{ duration: 0.55 }}
                          />
                          <motion.ellipse
                            cx="160"
                            cy={liquidRaised ? 128 : 156}
                            rx="105"
                            ry="18"
                            animate={{
                              cy: liquidRaised ? 128 : 156,
                              fill: outcome.fill,
                            }}
                            transition={{ duration: 0.55 }}
                          />
                          {outcome.precipitate ? (
                            <motion.rect
                              x="58"
                              y="214"
                              width="204"
                              height="30"
                              initial={{ opacity: 0.45 }}
                              animate={{ opacity: [0.45, 0.8, 0.45] }}
                              transition={{ duration: 1.6, repeat: Infinity }}
                              fill="rgba(255,255,255,0.88)"
                            />
                          ) : null}
                          {outcome.bubbles
                            ? [0, 1, 2, 3, 4].map((index) => (
                                <motion.circle
                                  key={index}
                                  cx={116 + index * 24}
                                  cy={188 - index * 10}
                                  r={6 + (index % 2)}
                                  fill="rgba(255,255,255,0.78)"
                                  animate={{
                                    cy: [188 - index * 10, 108 - index * 6],
                                    opacity: [0, 0.95, 0],
                                  }}
                                  transition={{
                                    duration: 1.8,
                                    repeat: Infinity,
                                    delay: index * 0.18,
                                  }}
                                />
                              ))
                            : null}
                        </g>
                        <motion.circle
                          cx="160"
                          cy="146"
                          r="78"
                          fill={outcome.glow}
                          animate={{ scale: liquidRaised ? [1, 1.06, 1] : 1 }}
                          transition={{
                            duration: 2,
                            repeat: liquidRaised ? Infinity : 0,
                          }}
                        />
                        {(outcome.success || controller.status === "success") && (
                          <motion.circle
                            cx="160"
                            cy="146"
                            r="92"
                            fill="none"
                            stroke="rgba(16,185,129,0.35)"
                            strokeWidth="6"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                              scale: [1, 1.15, 1],
                              opacity: [0.6, 0.2, 0.6],
                            }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        )}
                        <text
                          x="160"
                          y="182"
                          textAnchor="middle"
                          className="fill-slate-800 text-[16px] font-bold"
                        >
                          {firstSample && secondSample ? outcome.title : "Add Two Samples"}
                        </text>
                        <text
                          x="160"
                          y="206"
                          textAnchor="middle"
                          className="fill-slate-500 text-[11px] font-semibold uppercase tracking-[0.26em]"
                        >
                          Result Beaker
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${firstSample ?? "empty"}-${secondSample ?? "empty"}`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="panel-card p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Balanced equation
                        </p>
                        <p className="mt-3 text-sm font-semibold text-slate-900">
                          {outcome.equation}
                        </p>
                        <p className="mt-3 text-sm text-slate-500">
                          {outcome.observation}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="panel-card p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Evidence and products
                      </p>
                      <p className="mt-3 text-sm text-slate-500">{outcome.evidence}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {outcome.products.length > 0 ? (
                          outcome.products.map((product) => (
                            <span
                              key={product}
                              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                            >
                              {product}
                            </span>
                          ))
                        ) : (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-500">
                            Products will appear once two samples are placed.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="panel-card p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Teacher prompt
                      </p>
                      <p className="mt-3 text-sm text-slate-500">
                        Find the pair that really makes sodium chloride and water.
                        A clear solution can still be meaningful chemistry when it
                        comes from neutralization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="panel-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Current setup
                </p>
                <div className="mt-4 grid gap-3">
                  {slotConfig.map((slot) => {
                    const sample = placements[slot.id]
                      ? sampleMap[placements[slot.id]]
                      : null;

                    return (
                      <div key={slot.id} className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          {slot.label}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">
                          {sample ? `${sample.label} (${sample.formula})` : "Empty"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={controller.isLocked}
                  className="soft-button-primary"
                >
                  Check Experiment
                </button>
                {slotConfig.map((slot) =>
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
