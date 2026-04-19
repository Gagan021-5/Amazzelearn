import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";

const slots = [
  {
    id: "source",
    label: "Energy Source",
    hint: "What supplies the potential difference?",
  },
  {
    id: "path",
    label: "Conductor",
    hint: "What carries charge around the loop?",
  },
  {
    id: "switch",
    label: "Control",
    hint: "Use a switch that can complete the circuit.",
  },
  {
    id: "load",
    label: "Output Device",
    hint: "What should receive the electrical energy?",
  },
];

const parts = [
  {
    id: "battery",
    label: "Battery Cell",
    short: "1.5 V source",
    note: "Provides the push that drives current around the circuit.",
    tone: "from-rose-400 to-orange-500",
  },
  {
    id: "copper-wire",
    label: "Copper Wire",
    short: "Conductor",
    note: "Lets electric charge move easily through the path.",
    tone: "from-amber-400 to-yellow-500",
  },
  {
    id: "plastic-strip",
    label: "Plastic Strip",
    short: "Insulator",
    note: "Blocks the current because plastic is an electrical insulator.",
    tone: "from-slate-400 to-slate-600",
  },
  {
    id: "closed-switch",
    label: "Closed Switch",
    short: "Path connected",
    note: "Completes the conducting path so current can flow.",
    tone: "from-emerald-400 to-teal-500",
  },
  {
    id: "open-switch",
    label: "Open Switch",
    short: "Path broken",
    note: "Leaves a gap in the circuit, so no current flows.",
    tone: "from-sky-400 to-cyan-500",
  },
  {
    id: "bulb",
    label: "Lamp Bulb",
    short: "Light output",
    note: "Glows when electrical energy reaches the filament.",
    tone: "from-yellow-400 to-orange-500",
  },
  {
    id: "buzzer",
    label: "Buzzer",
    short: "Sound output",
    note: "Would make sound in a closed circuit, but it does not light a lamp.",
    tone: "from-violet-400 to-fuchsia-500",
  },
];

const idleEvaluation = {
  title: "Workbench Ready",
  observation:
    "Build a circuit with a source, a conducting path, a closed switch, and a bulb.",
  evidence:
    "Current only flows when every required part makes one unbroken conducting loop.",
  currentFlows: false,
  success: false,
  glow: "rgba(148,163,184,0.2)",
};

function evaluateCircuit(placements) {
  const hasAllParts = slots.every((slot) => placements[slot.id]);

  if (!hasAllParts) {
    return idleEvaluation;
  }

  if (placements.source !== "battery") {
    return {
      title: "No Active Source",
      observation:
        "The circuit has no correct energy source, so there is no potential difference to drive charge.",
      evidence: "Without a source, the lamp cannot light.",
      currentFlows: false,
      success: false,
      glow: "rgba(148,163,184,0.2)",
    };
  }

  if (placements.path !== "copper-wire") {
    return {
      title: "Insulating Path",
      observation:
        "A plastic strip breaks the conducting path because plastic is an electrical insulator.",
      evidence: "Charge cannot move easily through the path, so current stays at zero.",
      currentFlows: false,
      success: false,
      glow: "rgba(148,163,184,0.2)",
    };
  }

  if (placements.switch !== "closed-switch") {
    return {
      title: "Open Circuit",
      observation:
        "An open switch leaves a gap in the path, so the circuit is incomplete.",
      evidence: "Current stops at the open gap and the bulb stays off.",
      currentFlows: false,
      success: false,
      glow: "rgba(59,130,246,0.18)",
    };
  }

  if (placements.load === "buzzer") {
    return {
      title: "Closed Circuit, Wrong Output",
      observation:
        "The circuit is complete, so current would flow, but the load is a buzzer rather than a lamp.",
      evidence: "Electrical energy reaches the device, yet there is no bulb to glow.",
      currentFlows: true,
      success: false,
      glow: "rgba(168,85,247,0.22)",
    };
  }

  if (placements.load === "bulb") {
    return {
      title: "Lamp Powered",
      observation:
        "The battery, copper wire, closed switch, and bulb form one complete conducting loop.",
      evidence:
        "Current can now flow through the filament, so the lamp lights.",
      currentFlows: true,
      success: true,
      glow: "rgba(250,204,21,0.28)",
    };
  }

  return idleEvaluation;
}

export default function CircuitBuilder({ controller }) {
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

  const [dragOverSlot, setDragOverSlot] = useState(null);

  const partMap = useMemo(
    () => Object.fromEntries(parts.map((part) => [part.id, part])),
    [],
  );

  const evaluation = useMemo(() => evaluateCircuit(placements), [placements]);

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
    if (slots.some((slot) => !placements[slot.id])) {
      controller.submitAttempt(false, {
        failure:
          "Place one part in every workbench slot before checking whether the circuit will run.",
        locked:
          "The board is locked after 10 tries. Restart the circuit lab and rebuild the loop.",
      });
      return;
    }

    controller.submitAttempt(evaluation.success, {
      success:
        "Circuit complete. The battery, copper wire, closed switch, and bulb make a working loop.",
      failure:
        evaluation.currentFlows && placements.load === "buzzer"
          ? "Current would flow, but the output device is a buzzer. Use a bulb to complete the lamp challenge."
          : evaluation.observation,
      locked:
        "The board is locked after 10 tries. Restart the circuit lab and build a fresh loop.",
    });
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Component Tray
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Closed circuit workbench</h2>
          </div>
          <div className="rounded-2xl bg-indigo-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
              Target
            </p>
            <p className="mt-1 text-sm font-bold text-indigo-900">
              Light the lamp safely
            </p>
          </div>
        </div>

        <div className="inventory-rail hide-scrollbar mt-6">
          {parts.map((part) => (
            <motion.button
              key={part.id}
              type="button"
              draggable={!controller.isLocked}
              onDragStart={() => {
                controller.clearFeedback();
                setDraggedItemId(part.id);
                setSelectedItemId(part.id);
              }}
              onDragEnd={() => setDraggedItemId(null)}
              onClick={() => handleSelect(part.id)}
              disabled={controller.isLocked}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ scale: 1.05, boxShadow: "0 12px 28px rgba(139,92,246,0.18)" }}
              whileTap={{ scale: 0.97 }}
              className={[
                "token-card h-full",
                selectedItemId === part.id
                  ? "border-sky-300 ring-4 ring-sky-100"
                  : "",
                isPlaced(part.id) ? "opacity-40 pointer-events-none" : "",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-1 h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${part.tone} shadow-md`}
                />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {part.label}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    {part.short}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-500">{part.note}</p>
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
              Physics Stage
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Assemble the energy pathway</h2>
          </div>
          <div
            className={`status-pill ${
              evaluation.currentFlows
                ? "bg-amber-50 text-amber-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {evaluation.currentFlows ? "Current path closed" : "Current path open"}
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#eef6ff_0%,#ffffff_48%,#fff8eb_100%)] p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {slots.map((slot) => {
                  const part = placements[slot.id]
                    ? partMap[placements[slot.id]]
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
                        part ? "border-indigo-200 bg-indigo-50/60" : "",
                        isDragOver ? "drop-slot-active" : "",
                      ].join(" ")}
                    >
                      {part ? (
                        <div className="flex items-start gap-3 text-left">
                          <div
                            className={`mt-1 h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${part.tone} shadow-md`}
                          />
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                              {slot.label}
                            </p>
                            <p className="mt-2 text-base font-semibold text-slate-900">
                              {part.label}
                            </p>
                            <p className="text-sm text-slate-500">{part.short}</p>
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
                <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[26px] bg-[radial-gradient(circle_at_25%_22%,rgba(14,165,233,0.12),transparent_24%),radial-gradient(circle_at_82%_24%,rgba(251,191,36,0.18),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.85)_0%,rgba(241,245,249,0.72)_100%)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Circuit schematic
                    </p>
                    <div className="relative mt-5 flex min-h-[250px] items-center justify-center">
                      <svg viewBox="0 0 520 240" className="w-full max-w-[520px]">
                        <motion.path
                          d="M92 120H208H324H428"
                          fill="none"
                          stroke={
                            evaluation.currentFlows || controller.status === "success"
                              ? "#f59e0b"
                              : "#94a3b8"
                          }
                          strokeWidth="14"
                          strokeLinecap="round"
                          animate={{
                            pathLength:
                              evaluation.currentFlows || controller.status === "success"
                                ? 1
                                : 0.58,
                            opacity:
                              evaluation.currentFlows || controller.status === "success"
                                ? 1
                                : 0.78,
                          }}
                          transition={{ duration: 0.6 }}
                        />

                        {[92, 208, 324, 428].map((x) => (
                          <circle
                            key={x}
                            cx={x}
                            cy="120"
                            r="18"
                            fill="white"
                            stroke="#334155"
                            strokeWidth="5"
                          />
                        ))}

                        {evaluation.currentFlows
                          ? [0, 1, 2, 3].map((index) => (
                              <motion.circle
                                key={index}
                                cx="104"
                                cy="120"
                                r="8"
                                fill="#fde68a"
                                animate={{ cx: [104, 416], opacity: [0, 1, 0] }}
                                transition={{
                                  duration: 1.8,
                                  repeat: Infinity,
                                  delay: index * 0.35,
                                }}
                              />
                            ))
                          : null}
                      </svg>

                      <div className="pointer-events-none absolute inset-0 grid grid-cols-4 items-center gap-3">
                        {slots.map((slot) => {
                          const part = placements[slot.id]
                            ? partMap[placements[slot.id]]
                            : null;

                          return (
                            <div key={slot.id} className="flex justify-center">
                              <div className="rounded-[20px] bg-white/92 px-3 py-3 text-center shadow-md ring-1 ring-slate-100">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                  {slot.label}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                  {part ? part.label : "Empty"}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={Object.values(placements).join("|") || "idle"}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="panel-card p-5"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Diagnostic result
                        </p>
                        <p className="mt-3 text-base font-semibold text-slate-900">
                          {evaluation.title}
                        </p>
                        <p className="mt-3 text-sm text-slate-500">
                          {evaluation.observation}
                        </p>
                        <p className="mt-3 text-sm text-slate-400">
                          {evaluation.evidence}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <motion.div
                      animate={{
                        scale:
                          evaluation.success || controller.status === "success"
                            ? [1, 1.05, 1]
                            : 1,
                        boxShadow:
                          evaluation.success || controller.status === "success"
                            ? [
                                "0 0 0 8px rgba(250,204,21,0.3), 0 0 30px rgba(250,204,21,0.25)",
                                "0 0 0 18px rgba(250,204,21,0.15), 0 0 50px rgba(250,204,21,0.35)",
                                "0 0 0 8px rgba(250,204,21,0.3), 0 0 30px rgba(250,204,21,0.25)",
                              ]
                            : `0 0 0 0 ${evaluation.glow}`,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat:
                          evaluation.success || controller.status === "success"
                            ? Infinity
                            : 0,
                      }}
                      className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-8 border-slate-300 bg-white"
                    >
                      <motion.div
                        animate={{
                          backgroundColor:
                            evaluation.success || controller.status === "success"
                              ? ["#fde68a", "#fbbf24", "#fde68a"]
                              : evaluation.currentFlows
                                ? "#c4b5fd"
                                : "#e2e8f0",
                        }}
                        transition={{
                          duration: 1.2,
                          repeat: evaluation.success || controller.status === "success" ? Infinity : 0,
                        }}
                        className="h-14 w-14 rounded-full"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="panel-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Physics rule
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  A working lamp circuit needs a source, a conductor, a closed
                  switch, and the correct output device all connected in one loop.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  disabled={controller.isLocked}
                  className="soft-button-primary"
                >
                  Check Circuit
                </button>
                {slots.map((slot) =>
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
