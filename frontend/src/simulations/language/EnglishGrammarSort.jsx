import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SimulationCanvas from "../../components/SimulationCanvas";

const PHONICS = [
  { id: "apple", word: "Apple", type: "noun", imgSrc: "/assets/mock/apple.png", emoji: "🍎" },
  { id: "tree", word: "Tree", type: "noun", imgSrc: "/assets/mock/tree.png", emoji: "🌳" },
  { id: "running", word: "Running", type: "verb", imgSrc: "/assets/mock/running.png", emoji: "🏃" },
  { id: "beautiful", word: "Beautiful", type: "adjective", imgSrc: "/assets/mock/beautiful.png", emoji: "✨" },
];

const BUCKETS = [
  { key: "noun", label: "Nouns", description: "Person, place, or thing", ring: "ring-sky-200" },
  { key: "verb", label: "Verbs", description: "Action words", ring: "ring-amber-200" },
  { key: "adjective", label: "Adjectives", description: "Descriptive words", ring: "ring-violet-200" },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function EnglishGrammarSort({ controller }) {
  const [unsorted, setUnsorted] = useState(() => shuffleArray(PHONICS));
  const [sorted, setSorted] = useState({ noun: [], verb: [], adjective: [] });
  const [selected, setSelected] = useState(null);
  const [dragOverBucket, setDragOverBucket] = useState(null);

  const selectWord = (wordId) => {
    if (controller.isLocked) return;
    setSelected((prev) => (prev === wordId ? null : wordId));
  };

  const placeInBucket = (bucketKey, itemId) => {
    if (!itemId || controller.isLocked) return;
    const itemObj = unsorted.find(u => u.id === itemId) || Object.values(sorted).flat().find(s => s.id === itemId);
    if (!itemObj) return;

    // Remove from previous locations
    setUnsorted((prev) => prev.filter((w) => w.id !== itemId));
    setSorted((prev) => {
      const newSorted = { ...prev };
      Object.keys(newSorted).forEach(k => {
        newSorted[k] = newSorted[k].filter(w => w.id !== itemId);
      });
      newSorted[bucketKey].push(itemObj);
      return newSorted;
    });
    
    setSelected(null);
    setDragOverBucket(null);
  };

  const removeFromBucket = (wordId) => {
    if (controller.isLocked) return;
    let found = null;
    setSorted((prev) => {
      const newSorted = { ...prev };
      Object.keys(newSorted).forEach(k => {
        const idx = newSorted[k].findIndex(w => w.id === wordId);
        if (idx !== -1) {
          found = newSorted[k][idx];
          newSorted[k].splice(idx, 1);
        }
      });
      return newSorted;
    });
    if (found) {
      setUnsorted((prev) => [...prev, found]);
    }
  };

  const checkAll = () => {
    let allCorrect = true;
    let placedCount = 0;
    
    BUCKETS.forEach(b => {
      placedCount += sorted[b.key].length;
      sorted[b.key].forEach(item => {
        if (item.type !== b.key) allCorrect = false;
      });
    });

    if (placedCount < PHONICS.length) {
       controller.submitAttempt(false, { failure: "Place all flashcards first!" });
       return;
    }

    controller.submitAttempt(allCorrect, {
      success: "Amazing! You correctly classified all the picture flashcards!",
      failure: "Some flashcards are in the wrong bucket. Check again!"
    });
  };

  const itemBankContent = (
    <div className="grid grid-cols-2 gap-4">
      {unsorted.map((wc) => (
        <motion.button
          key={wc.id}
          type="button"
          disabled={controller.isLocked}
          draggable={!controller.isLocked}
          onDragStart={() => {
            selectWord(wc.id);
            controller.clearFeedback();
          }}
          onClick={() => selectWord(wc.id)}
          whileHover={{ scale: 1.05 }}
          whileDrag={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)", zIndex: 50 }}
          whileTap={{ scale: 0.95 }}
          className={[
            "group relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-md transition-all cursor-grab active:cursor-grabbing",
            selected === wc.id ? "ring-4 ring-purple-400 shadow-xl border-transparent" : "border-2 border-slate-100",
          ].join(" ")}
        >
          <div className="text-5xl filter drop-shadow-md mb-2">{wc.emoji}</div>
          <span className="text-xs font-bold text-slate-800 tracking-wide">{wc.word}</span>
          <span className="absolute -bottom-6 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            src: {wc.imgSrc}
          </span>
        </motion.button>
      ))}
      {unsorted.length === 0 && (
         <div className="col-span-2 text-center text-sm font-semibold text-emerald-600 p-8">
           All cards sorted!
         </div>
      )}
    </div>
  );

  const dropCanvasContent = (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {BUCKETS.map((bucket) => {
          const isDragOver = dragOverBucket === bucket.key;

          return (
            <button
              key={bucket.key}
              type="button"
              onClick={() => placeInBucket(bucket.key, selected)}
              onDragOver={(e) => { e.preventDefault(); setDragOverBucket(bucket.key); }}
              onDragLeave={() => setDragOverBucket(null)}
              onDrop={(e) => { e.preventDefault(); placeInBucket(bucket.key, selected); }}
              className={[
                "relative flex min-h-[300px] flex-col items-center justify-start rounded-[28px] border-2 border-dashed p-6 transition-all",
                isDragOver ? `bg-white border-slate-400 ring-4 ${bucket.ring} shadow-xl scale-[1.02]` : "border-slate-300 bg-white/70 hover:bg-white"
              ].join(" ")}
            >
              <div className="w-full border-b-2 border-slate-100 pb-3 mb-4 text-center">
                 <h3 className="text-xl font-bold tracking-tight text-slate-800">{bucket.label}</h3>
                 <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">{bucket.description}</p>
              </div>
              
              <div className="flex flex-col gap-3 w-full items-center">
                <AnimatePresence>
                  {sorted[bucket.key].map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ scale: 0.5, y: -20, opacity: 0 }}
                      animate={{ scale: 1, y: 0, opacity: 1 }}
                      exit={{ scale: 0.5, y: 20, opacity: 0 }}
                      onClick={(e) => { e.stopPropagation(); removeFromBucket(item.id); }}
                      className="group relative flex w-3/4 aspect-square flex-col items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 transition hover:border-red-200"
                    >
                       <span className="text-4xl filter drop-shadow-sm">{item.emoji}</span>
                       <span className="mt-2 text-[10px] font-bold text-slate-600">{item.word}</span>
                       <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold transition-opacity">×</div>
                    </motion.div>
                  ))}
                  {sorted[bucket.key].length === 0 && (
                     <div className="text-xs font-semibold text-slate-300 mt-10">Drop Flashcards</div>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex justify-center">
         <button onClick={checkAll} className="soft-button-primary" disabled={controller.isLocked}>Check Answers</button>
      </div>
    </div>
  );

  return (
    <SimulationCanvas
      title="Flashcard Sort"
      goal="Sort parts of speech"
      itemBankTitle="Flashcards"
      itemBankSubtitle="Picture Cards"
      dropCanvasTitle="Grammar Buckets"
      dropCanvasSubtitle="Sort the words"
      itemBankContent={itemBankContent}
      dropCanvasContent={dropCanvasContent}
      goalStyle="bg-purple-50 text-purple-700 border-purple-200"
    />
  );
}
