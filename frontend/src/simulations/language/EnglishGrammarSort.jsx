import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
 *  English Grammar Sort — Parts of Speech Lab
 *  Students classify words into Nouns, Verbs, Adjectives, Adverbs
 * ═══════════════════════════════════════════════════════════════════ */

const WORDS = [
  { word: "quickly", type: "adverb" },
  { word: "beautiful", type: "adjective" },
  { word: "running", type: "verb" },
  { word: "happiness", type: "noun" },
  { word: "quietly", type: "adverb" },
  { word: "bright", type: "adjective" },
  { word: "teacher", type: "noun" },
  { word: "writes", type: "verb" },
  { word: "mountain", type: "noun" },
  { word: "slowly", type: "adverb" },
  { word: "jumped", type: "verb" },
  { word: "enormous", type: "adjective" },
];

const BUCKETS = [
  { key: "noun", label: "Nouns", emoji: "📦", color: "from-sky-400 to-cyan-400", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700" },
  { key: "verb", label: "Verbs", emoji: "⚡", color: "from-amber-400 to-orange-400", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  { key: "adjective", label: "Adjectives", emoji: "🎨", color: "from-emerald-400 to-lime-400", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
  { key: "adverb", label: "Adverbs", emoji: "🏃", color: "from-violet-400 to-purple-400", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
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
  const [unsorted, setUnsorted] = useState(() => shuffleArray(WORDS));
  const [sorted, setSorted] = useState({
    noun: [],
    verb: [],
    adjective: [],
    adverb: [],
  });
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState(null);

  const selectWord = (word) => {
    if (controller.isLocked) return;
    setSelected((prev) => (prev?.word === word.word ? null : word));
  };

  const placeInBucket = (bucketKey) => {
    if (!selected || controller.isLocked) return;

    setSorted((prev) => ({
      ...prev,
      [bucketKey]: [...prev[bucketKey], selected],
    }));
    setUnsorted((prev) => prev.filter((w) => w.word !== selected.word));
    setSelected(null);
  };

  const removeFromBucket = (bucketKey, wordObj) => {
    if (controller.isLocked) return;
    setSorted((prev) => ({
      ...prev,
      [bucketKey]: prev[bucketKey].filter((w) => w.word !== wordObj.word),
    }));
    setUnsorted((prev) => [...prev, wordObj]);
  };

  const checkAll = () => {
    const res = {};
    let allCorrect = true;
    let totalPlaced = 0;

    BUCKETS.forEach((bucket) => {
      res[bucket.key] = sorted[bucket.key].map((wordObj) => {
        totalPlaced++;
        const correct = wordObj.type === bucket.key;
        if (!correct) allCorrect = false;
        return { ...wordObj, correct };
      });
    });

    if (totalPlaced < WORDS.length) {
      controller.submitAttempt(false, {
        failure: `Place all ${WORDS.length} words before checking. ${WORDS.length - totalPlaced} words remaining.`,
      });
      return;
    }

    setResults(res);
    controller.submitAttempt(allCorrect, {
      success: "Excellent! All words correctly classified! You're a grammar master! 🎉",
      failure: "Some words are in the wrong bucket. Look for the red-highlighted words.",
    });
  };

  const resetAll = useCallback(() => {
    setUnsorted(shuffleArray(WORDS));
    setSorted({ noun: [], verb: [], adjective: [], adverb: [] });
    setSelected(null);
    setResults(null);
  }, []);

  return (
    <div className="space-y-6">
      {/* Unsorted word tray */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Word Tray — {unsorted.length} remaining
        </p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {unsorted.map((wordObj) => (
              <motion.button
                key={wordObj.word}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectWord(wordObj)}
                disabled={controller.isLocked}
                className={[
                  "rounded-xl border px-4 py-2.5 text-sm font-bold transition-all shadow-sm",
                  selected?.word === wordObj.word
                    ? "border-purple-400 bg-gradient-to-br from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/20"
                    : "border-slate-200 bg-white text-slate-700 hover:border-purple-200 hover:shadow-md",
                  controller.isLocked ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                {wordObj.word}
              </motion.button>
            ))}
          </AnimatePresence>
          {unsorted.length === 0 && (
            <p className="text-sm text-slate-400 italic">All words have been sorted!</p>
          )}
        </div>
      </div>

      {/* Sorting buckets */}
      <div className="grid gap-4 sm:grid-cols-2">
        {BUCKETS.map((bucket) => (
          <motion.div
            key={bucket.key}
            whileHover={selected ? { scale: 1.01 } : {}}
            onClick={() => placeInBucket(bucket.key)}
            className={[
              "rounded-2xl border-2 p-4 transition-all cursor-pointer min-h-[140px]",
              selected
                ? `${bucket.border} ${bucket.bg} shadow-md`
                : `border-slate-200/60 bg-slate-50/50`,
              selected ? "border-dashed" : "",
            ].join(" ")}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${bucket.color} text-white text-sm shadow-sm`}>
                {bucket.emoji}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{bucket.label}</p>
                <p className="text-[10px] text-slate-400">
                  {sorted[bucket.key].length} words
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <AnimatePresence mode="popLayout">
                {sorted[bucket.key].map((wordObj) => {
                  const result = results?.[bucket.key]?.find(
                    (r) => r.word === wordObj.word,
                  );
                  return (
                    <motion.button
                      key={wordObj.word}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromBucket(bucket.key, wordObj);
                      }}
                      disabled={controller.isLocked}
                      className={[
                        "rounded-lg px-3 py-1.5 text-xs font-bold transition",
                        result
                          ? result.correct
                            ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-rose-100 text-rose-700 ring-1 ring-rose-200 animate-wiggle"
                          : `${bucket.bg} ${bucket.text} ring-1 ${bucket.border}`,
                      ].join(" ")}
                    >
                      {wordObj.word}
                      {result && (result.correct ? " ✓" : " ✗")}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
              {sorted[bucket.key].length === 0 && (
                <p className="text-xs text-slate-400 italic">
                  {selected ? "Tap to place here" : "Empty"}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={checkAll}
          disabled={controller.isLocked}
          className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl"
        >
          Check Sorting
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetAll}
          disabled={controller.isLocked}
          className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Reset Board
        </motion.button>
      </div>
    </div>
  );
}
