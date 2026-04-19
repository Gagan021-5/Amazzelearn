import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";
import SimulationCanvas from "../../components/SimulationCanvas";

const weights = [
  { id: "1", val: 1, type: "number", imgSrc: "/assets/mock/weight-1.png", color: "from-slate-300 to-slate-400" },
  { id: "2", val: 2, type: "number", imgSrc: "/assets/mock/weight-2.png", color: "from-slate-400 to-slate-500" },
  { id: "3", val: 3, type: "number", imgSrc: "/assets/mock/weight-3.png", color: "from-slate-500 to-slate-600" },
  { id: "4", val: 4, type: "number", imgSrc: "/assets/mock/weight-4.png", color: "from-slate-600 to-slate-700" },
  { id: "x", val: "x", type: "variable", imgSrc: "/assets/mock/weight-x.png", color: "from-amber-400 to-amber-600" },
];

const zones = [
  { id: "x-slot", label: "x Value Block" },
  { id: "right-slot", label: "Right Pan Block" },
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
  } = useSinglePlacementGame(zones.map((z) => z.id), controller.sessionId);

  const weightMap = useMemo(() => Object.fromEntries(weights.map(w => [w.id, w])), []);

  const [dragOverSlot, setDragOverSlot] = useState(null);

  // In this logic, the left pan has our placed x block + an imaginary fixed + 2 block.
  // The right pan has our placed weight block.
  const leftValueNum = placements["x-slot"] ? Number(placements["x-slot"]) + 2 : 2;
  const rightValueNum = placements["right-slot"] ? Number(placements["right-slot"]) : 0;
  
  const beamRotation = Math.max(-15, Math.min(15, (rightValueNum - leftValueNum) * 3));
  const balanced = (placements["x-slot"] === "2" && placements["right-slot"] === "4");

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
      {weights.map((w) => (
        <motion.button
          key={w.id}
          type="button"
          disabled={controller.isLocked}
          draggable={!controller.isLocked}
          onDragStart={() => {
            controller.clearFeedback();
            setDraggedItemId(w.id);
            setSelectedItemId(w.id);
          }}
          onDragEnd={() => setDraggedItemId(null)}
          onClick={() => handleSelect(w.id)}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", zIndex: 50 }}
          whileTap={{ scale: 0.95 }}
          className={[
            "group relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md transition-all cursor-grab active:cursor-grabbing",
            selectedItemId === w.id ? "ring-4 ring-orange-400 shadow-xl border-transparent" : "border-2 border-slate-100",
             isPlaced(w.id) ? "opacity-30 pointer-events-none" : "",
          ].join(" ")}
        >
          {/* Tangible 3D Block Icon */}
          <div className={`relative flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-br ${w.color} shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_4px_8px_rgba(0,0,0,0.3)] border border-slate-700/20`}>
             <span className="text-2xl font-bold text-white drop-shadow-md">{w.val}</span>
          </div>
          <span className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            src: {w.imgSrc}
          </span>
        </motion.button>
      ))}
    </div>
  );

  const dropCanvasContent = (
    <div className="flex flex-col gap-6">
      {/* Visual Balance Scale */}
      <div className="relative min-h-[350px] w-full max-w-2xl mx-auto flex flex-col items-center justify-end pb-8">
        {/* Beam mechanism */}
        <motion.div 
          animate={{ rotate: beamRotation }} 
          transition={{ type: "spring", stiffness: 80, damping: 12 }}
          className="absolute bottom-24 w-[80%] h-4 bg-slate-700 rounded-full flex justify-between px-[5%] origin-center z-10 shadow-lg"
        >
           {/* Left Pan Attachment */}
           <div className="w-1 h-12 bg-slate-400 mx-auto transform -translate-y-2" />
           {/* Right Pan Attachment */}
           <div className="w-1 h-12 bg-slate-400 mx-auto transform -translate-y-2" />
        </motion.div>

        {/* Fulcrum Stand */}
        <div className="w-6 h-28 bg-amber-800 rounded-t-full shadow-inner z-0" />
        <div className="w-32 h-6 bg-amber-900 rounded-lg shadow-md -mt-2 z-0" />

        {/* The Drop Zones positioned over the pan points conceptually */}
        <div className="absolute top-16 w-full flex justify-between px-10 z-20">
           {zones.map((zone) => {
             const weight = placements[zone.id] ? weightMap[placements[zone.id]] : null;
             const isDragOver = dragOverSlot === zone.id;

             return (
               <button
                 key={zone.id}
                 type="button"
                 onClick={() => handlePlace(zone.id, selectedItemId)}
                 onDragOver={(e) => { e.preventDefault(); setDragOverSlot(zone.id); }}
                 onDragLeave={() => setDragOverSlot(null)}
                 onDrop={(e) => { e.preventDefault(); handlePlace(zone.id, selectedItemId); }}
                 className={[
                   "relative flex aspect-square w-32 flex-col items-center justify-center rounded-[24px] border-2 border-dashed p-4 transition-all",
                   weight ? "border-amber-200 bg-amber-50" : "border-slate-300 bg-white/60 hover:bg-slate-50",
                   isDragOver ? "ring-4 ring-amber-200 border-amber-400 bg-amber-100/50" : ""
                 ].join(" ")}
               >
                 <p className="absolute -top-6 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-center w-full">
                    {zone.label}
                 </p>
                 <AnimatePresence>
                   {weight ? (
                      <motion.div
                        initial={{ scale: 0.5, y: -20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.5, y: 20, opacity: 0 }}
                        className={`relative flex w-16 h-16 items-center justify-center rounded-xl bg-gradient-to-br ${weight.color} shadow-[inset_0px_2px_4px_rgba(255,255,255,0.4),0px_4px_8px_rgba(0,0,0,0.3)]`}
                      >
                         <span className="text-2xl font-bold text-white drop-shadow-md">{weight.val}</span>
                      </motion.div>
                   ) : (
                      <div className="text-xs font-semibold text-slate-300">Drop Block</div>
                   )}
                 </AnimatePresence>
               </button>
             );
           })}
        </div>
      </div>
    </div>
  );

  return (
    <SimulationCanvas
      title="Algebra Balance"
      goal="Solve: x + 2 = 4"
      itemBankTitle="Weights"
      itemBankSubtitle="Brass Blocks"
      dropCanvasTitle="Equation Scale"
      dropCanvasSubtitle="Balance the equation"
      itemBankContent={itemBankContent}
      dropCanvasContent={dropCanvasContent}
      goalStyle="bg-orange-50 text-orange-700 border-orange-200"
    />
  );
}
