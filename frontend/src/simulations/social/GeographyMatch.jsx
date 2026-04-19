import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSinglePlacementGame } from "../../hooks/useSinglePlacementGame";
import SimulationCanvas from "../../components/SimulationCanvas";

const regions = [
  { id: "north-america", label: "North America Map" },
  { id: "south-america", label: "South America Map" },
  { id: "asia", label: "Asia Map" },
];

const landmarks = [
  { id: "rocky", type: "north-america", label: "Rocky Mountains", imgSrc: "/assets/mock/rocky.png", emoji: "⛰️" },
  { id: "amazon", type: "south-america", label: "Amazon River", imgSrc: "/assets/mock/amazon.png", emoji: "🏞️" },
  { id: "fuji", type: "asia", label: "Mount Fuji", imgSrc: "/assets/mock/fuji.png", emoji: "🗻" },
];

export default function GeographyMatch({ controller }) {
  const {
    placements,
    selectedItemId,
    setSelectedItemId,
    setDraggedItemId,
    placeItem,
    isPlaced,
  } = useSinglePlacementGame(regions.map((r) => r.id), controller.sessionId);

  const [dragOverRegion, setDragOverRegion] = useState(null);

  const landmarkMap = useMemo(() => Object.fromEntries(landmarks.map((l) => [l.id, l])), []);

  const handleSelect = (itemId) => {
    controller.clearFeedback();
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const handlePlace = (regionId, itemId) => {
    if (controller.isLocked || !itemId) return;
    controller.clearFeedback();
    placeItem(regionId, itemId);
    setDragOverRegion(null);
  };

  const checkMatches = () => {
    const isSolved = landmarks.every((l) => placements[l.type] === l.id);
    controller.submitAttempt(isSolved, {
      success: "Perfect! All geographical features placed correctly on the map.",
      failure: "Some landmarks are misplaced. Try matching the ecosystem to the continent."
    });
  };

  const itemBankContent = (
    <div className="grid grid-cols-2 gap-4">
      {landmarks.map((lm) => (
        <motion.button
          key={lm.id}
          type="button"
          disabled={controller.isLocked}
          draggable={!controller.isLocked}
          onDragStart={() => {
            controller.clearFeedback();
            setDraggedItemId(lm.id);
            setSelectedItemId(lm.id);
          }}
          onDragEnd={() => setDraggedItemId(null)}
          onClick={() => handleSelect(lm.id)}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", zIndex: 50 }}
          whileTap={{ scale: 0.95 }}
          className={[
            "group relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md transition-all cursor-grab active:cursor-grabbing",
            selectedItemId === lm.id ? "ring-4 ring-emerald-400 shadow-xl border-transparent" : "border-2 border-slate-100",
             isPlaced(lm.id) ? "opacity-30 pointer-events-none" : "",
          ].join(" ")}
        >
          <div className="text-4xl filter drop-shadow-md">{lm.emoji}</div>
          <span className="mt-2 text-xs font-bold text-slate-700 text-center">{lm.label}</span>
          <span className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            src: {lm.imgSrc}
          </span>
        </motion.button>
      ))}
    </div>
  );

  const dropCanvasContent = (
    <div className="flex flex-col gap-6 w-full items-center">
      <div className="grid gap-6 w-full max-w-lg">
        {regions.map((region) => {
          const placedLM = placements[region.id] ? landmarkMap[placements[region.id]] : null;
          const isDragOver = dragOverRegion === region.id;

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => handlePlace(region.id, selectedItemId)}
              onDragOver={(e) => { e.preventDefault(); setDragOverRegion(region.id); }}
              onDragLeave={() => setDragOverRegion(null)}
              onDrop={(e) => { e.preventDefault(); handlePlace(region.id, selectedItemId); }}
              className={[
                "relative flex min-h-[140px] w-full flex-row items-center justify-between rounded-[24px] border-2 border-dashed p-6 transition-all",
                placedLM ? "border-emerald-200 bg-emerald-50" : "border-slate-300 bg-slate-50/50 hover:bg-slate-100",
                isDragOver ? "ring-4 ring-emerald-200 border-emerald-400 bg-emerald-100/50" : ""
              ].join(" ")}
            >
              <div className="flex flex-col items-start text-left">
                 <p className="text-sm font-bold uppercase tracking-wider text-slate-600">
                    {region.label}
                 </p>
                 <p className="text-xs text-slate-400 mt-1">Region Zone</p>
              </div>
              
              <AnimatePresence>
                {placedLM ? (
                  <motion.div
                    initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.5, rotate: 10, opacity: 0 }}
                    className="flex w-24 h-24 items-center justify-center rounded-2xl bg-white shadow-lg border border-slate-100"
                  >
                     <span className="text-5xl filter drop-shadow-md">{placedLM.emoji}</span>
                  </motion.div>
                ) : (
                  <div className="flex w-24 h-24 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 text-xs font-semibold text-slate-300">
                    Drop Feature
                  </div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 flex justify-center">
         <button onClick={checkMatches} className="soft-button-primary">Check Map Matches</button>
      </div>
    </div>
  );

  return (
    <SimulationCanvas
      title="Geography Match"
      goal="Place landmarks in regions"
      itemBankTitle="Features"
      itemBankSubtitle="Map Landmarks"
      dropCanvasTitle="World Map"
      dropCanvasSubtitle="Match to region"
      itemBankContent={itemBankContent}
      dropCanvasContent={dropCanvasContent}
      goalStyle="bg-emerald-50 text-emerald-700 border-emerald-200"
    />
  );
}
