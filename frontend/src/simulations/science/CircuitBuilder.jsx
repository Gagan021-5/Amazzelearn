import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";
import SimulationCanvas from "../../components/SimulationCanvas";

const slots = [
  { id: "source", label: "Energy Source" },
  { id: "path", label: "Conductor" },
  { id: "switch", label: "Control" },
  { id: "load", label: "Output Device" },
];

const parts = [
  {
    id: "battery",
    type: "source",
    tone: "from-rose-400 to-amber-500",
    imgSrc: "/assets/mock/battery.png", // Mock path as requested
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full fill-white drop-shadow-md">
        <rect x="25" y="30" width="50" height="65" rx="8" />
        <rect x="40" y="20" width="20" height="10" rx="3" fill="#cbd5e1" />
        <text x="50" y="70" textAnchor="middle" fill="#1e293b" fontSize="24" fontWeight="bold" fontFamily="sans-serif">+</text>
      </svg>
    )
  },
  {
    id: "wire",
    type: "path",
    tone: "from-amber-400 to-yellow-500",
    imgSrc: "/assets/mock/wire.png",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-orange-700 drop-shadow-md" fill="none" strokeWidth="12" strokeLinecap="round">
        <path d="M20 80 Q 50 20 80 80" />
      </svg>
    )
  },
  {
    id: "switch-closed",
    type: "switch",
    tone: "from-emerald-400 to-teal-500",
    imgSrc: "/assets/mock/switch.png",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-white fill-none drop-shadow-md" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="25" cy="50" r="6" fill="white" />
        <circle cx="75" cy="50" r="6" fill="white" />
        <line x1="25" y1="50" x2="75" y2="50" />
      </svg>
    )
  },
  {
    id: "bulb",
    type: "load",
    tone: "from-sky-400 to-indigo-500",
    imgSrc: "/assets/mock/bulb.png",
    icon: (
      <svg viewBox="0 0 100 100" className="w-full h-full fill-yellow-300 stroke-yellow-500 drop-shadow-md" strokeWidth="3">
        <path d="M50 15 C 30 15 25 35 30 50 C 35 60 40 65 40 80 L 60 80 C 60 65 65 60 70 50 C 75 35 70 15 50 15 Z" />
        <polygon points="40,80 60,80 55,90 45,90" fill="#94a3b8" stroke="#64748b" />
      </svg>
    )
  },
];

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
    () => Object.fromEntries(parts.map((p) => [p.id, p])),
    [],
  );

  const isComplete = slots.every((s) => placements[s.id]);
  const isWorking = isComplete && placements.source === "battery" && placements.path === "wire" && placements.switch === "switch-closed" && placements.load === "bulb";

  const handleSelect = (itemId) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const handlePlace = (slotId, itemId) => {
    if (controller.isLocked || !itemId) return;
    controller.clearFeedback();
    placeItem(slotId, itemId);
    setDragOverSlot(null);
  };

  const itemBankContent = (
    <div className="grid grid-cols-2 gap-4">
      {parts.map((part) => (
        <motion.button
          key={part.id}
          type="button"
          disabled={controller.isLocked}
          draggable={!controller.isLocked}
          onDragStart={() => {
            controller.clearFeedback();
            setDraggedItemId(part.id);
            setSelectedItemId(part.id);
          }}
          onDragEnd={() => setDraggedItemId(null)}
          onClick={() => handleSelect(part.id)}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", zIndex: 50 }}
          whileTap={{ scale: 0.95 }}
          className={[
            "relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md transition-all cursor-grab active:cursor-grabbing",
            selectedItemId === part.id ? "ring-4 ring-indigo-400 shadow-xl" : "border-2 border-slate-100",
            isPlaced(part.id) ? "opacity-30 pointer-events-none" : "",
          ].join(" ")}
        >
          {/* We accept image or icon per prompt */}
          <div className={`flex w-full h-full items-center justify-center rounded-xl bg-gradient-to-br ${part.tone}`}>
             {part.icon}
          </div>
          {/* Hover to reveal mock path info */}
          <span className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            src: {part.imgSrc}
          </span>
        </motion.button>
      ))}
    </div>
  );

  const dropCanvasContent = (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {slots.map((slot) => {
          const part = placements[slot.id] ? partMap[placements[slot.id]] : null;
          const isDragOver = dragOverSlot === slot.id;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={controller.isLocked}
              onClick={() => handlePlace(slot.id, selectedItemId)}
              onDragOver={(e) => { e.preventDefault(); setDragOverSlot(slot.id); }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => { e.preventDefault(); handlePlace(slot.id, selectedItemId); }}
              className={[
                "flex aspect-square flex-col items-center justify-center rounded-[22px] border-2 border-dashed p-4 transition-all relative overflow-hidden",
                part ? "border-indigo-200 bg-indigo-50" : "border-slate-300 bg-slate-50/50 hover:bg-slate-100",
                isDragOver ? "bg-indigo-100/50 border-indigo-400 ring-4 ring-indigo-100" : ""
              ].join(" ")}
            >
              <p className="absolute top-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 z-10 w-full text-center">
                {slot.label}
              </p>
              
              <AnimatePresence>
                {part ? (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className={`mt-4 w-16 h-16 rounded-xl bg-gradient-to-br ${part.tone} shrink-0`}
                  >
                    {part.icon}
                  </motion.div>
                ) : (
                  <div className="mt-4 text-xs text-slate-300 font-semibold">Drop Asset</div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
      
      {/* Visual Feedback Circuit Diagram */}
      <div className="mt-4 p-8 rounded-[28px] bg-slate-800 text-center relative overflow-hidden">
        {isWorking && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: [0.1, 0.4, 0.1] }} 
             transition={{ duration: 1.5, repeat: Infinity }}
             className="absolute inset-0 bg-yellow-400 mix-blend-overlay"
           />
        )}
        <h3 className="text-xl font-bold text-white relative z-10">
          {isWorking ? "⚡ The circuit is alive! Lamp is glowing." : "Circuit is incomplete."}
        </h3>
      </div>
    </div>
  );

  return (
    <SimulationCanvas
      title="Circuit Builder"
      goal="Build a closed circuit"
      itemBankTitle="Components"
      itemBankSubtitle="Physical Parts"
      dropCanvasTitle="Bench"
      dropCanvasSubtitle="Schematic Board"
      itemBankContent={itemBankContent}
      dropCanvasContent={dropCanvasContent}
      goalStyle="bg-yellow-50 text-yellow-700 border-yellow-200"
    />
  );
}
