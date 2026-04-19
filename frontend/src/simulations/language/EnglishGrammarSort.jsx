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
  {
    key: "noun",
    label: "Nouns",
    emoji: "📦",
    description: "Person, place, thing, or idea",
    tone: "from-sky-400 to-cyan-500",
    accent: "border-l-sky-400",
    bgTint: "bg-sky-50/60",
    ringTint: "ring-sky-200/60",
    chipBg: "bg-sky-50",
    chipText: "text-sky-700",
    chipBorder: "ring-sky-200",
  },
  {
    key: "verb",
    label: "Verbs",
    emoji: "⚡",
    description: "Action or state of being",
    tone: "from-amber-400 to-orange-500",
    accent: "border-l-amber-400",
    bgTint: "bg-amber-50/60",
    ringTint: "ring-amber-200/60",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    chipBorder: "ring-amber-200",
  },
  {
    key: "adjective",
    label: "Adjectives",
    emoji: "🎨",
    description: "Describes a noun",
    tone: "from-emerald-400 to-teal-500",
    accent: "border-l-emerald-400",
    bgTint: "bg-emerald-50/60",
    ringTint: "ring-emerald-200/60",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    chipBorder: "ring-emerald-200",
  },
  {
    key: "adverb",
    label: "Adverbs",
    emoji: "🏃",
    description: "Modifies a verb or adjective",
    tone: "from-violet-400 to-fuchsia-500",
    accent: "border-l-violet-400",
    bgTint: "bg-violet-50/60",
    ringTint: "ring-violet-200/60",
    chipBg: "bg-violet-50",
    chipText: "text-violet-700",
    chipBorder: "ring-violet-200",
  },
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
  const [dragOverBucket, setDragOverBucket] = useState(null);

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
    setDragOverBucket(null);
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

  const placedCount = WORDS.length - unsorted.length;

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Word Tray
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">Parts of Speech Lab</h2>
        <p className="mt-2 text-sm text-slate-500">
          {placedCount}/{WORDS.length} sorted
        </p>

        <div className="inventory-rail hide-scrollbar mt-6">
          <AnimatePresence mode="popLayout">
            {unsorted.map((wordObj) => (
              <motion.button
                key={wordObj.word}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => selectWord(wordObj)}
                disabled={controller.isLocked}
                className={[
                  "token-card text-center",
                  selected?.word === wordObj.word
                    ? "border-purple-400 bg-gradient-to-br from-purple-500 to-indigo-500 !text-white shadow-lg shadow-purple-500/20"
                    : "",
                  controller.isLocked ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <p className={`text-lg font-bold ${selected?.word === wordObj.word ? "text-white" : "text-slate-800"}`}>
                  {wordObj.word}
                </p>
              </motion.button>
            ))}
          </AnimatePresence>
          {unsorted.length === 0 && (
            <p className="text-sm font-semibold text-emerald-600 italic py-4 text-center">
              All words have been sorted! ✓
            </p>
          )}
        </div>

        <div className="mt-6 rounded-[24px] bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">How to play</p>
          <p className="mt-2 text-sm text-slate-500">
            Select a word card, then tap on the correct category bucket to sort it.
            Sort all 12 words and check your results.
          </p>
        </div>
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sorting Board
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Classify each word</h2>
          </div>
          <div className="rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700">
            Select → Tap bucket to sort
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#faf5ff_0%,#ffffff_40%,#eff6ff_100%)] p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {BUCKETS.map((bucket) => {
              const isDragOver = dragOverBucket === bucket.key;

              return (
                <motion.button
                  key={bucket.key}
                  type="button"
                  whileHover={selected ? { scale: 1.01 } : {}}
                  onClick={() => placeInBucket(bucket.key)}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOverBucket(bucket.key);
                  }}
                  onDragLeave={() => setDragOverBucket(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    placeInBucket(bucket.key);
                  }}
                  disabled={controller.isLocked}
                  className={[
                    "flex min-h-[220px] flex-col rounded-[26px] border-2 border-l-[6px] border-dashed p-5 text-left shadow-sm transition-all duration-300",
                    bucket.accent,
                    bucket.bgTint,
                    isDragOver || (selected && !controller.isLocked)
                      ? `border-amazze-purple-400 ring-4 ${bucket.ringTint} bg-amazze-purple-50/30`
                      : "border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${bucket.tone} text-2xl text-white shadow-md`}
                    >
                      {bucket.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-slate-900">{bucket.label}</p>
                      <p className="mt-1 text-sm text-slate-500">{bucket.description}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {sorted[bucket.key].length} words
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-1 flex-wrap content-start gap-2">
                    <AnimatePresence mode="popLayout">
                      {sorted[bucket.key].map((wordObj) => {
                        const result = results?.[bucket.key]?.find(
                          (r) => r.word === wordObj.word,
                        );
                        return (
                          <motion.span
                            key={wordObj.word}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 22 }}
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromBucket(bucket.key, wordObj);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                removeFromBucket(bucket.key, wordObj);
                              }
                            }}
                            className={[
                              "rounded-2xl px-4 py-2.5 text-sm font-bold ring-1 transition cursor-pointer",
                              result
                                ? result.correct
                                  ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
                                  : "bg-rose-100 text-rose-700 ring-rose-200"
                                : `${bucket.chipBg} ${bucket.chipText} ${bucket.chipBorder}`,
                            ].join(" ")}
                          >
                            {wordObj.word}
                            {result && (result.correct ? " ✓" : " ✗")}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                    {sorted[bucket.key].length === 0 && (
                      <p className="text-sm font-semibold text-slate-400 italic">
                        {selected ? "Tap to place here" : "Empty"}
                      </p>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={checkAll}
              disabled={controller.isLocked}
              className="soft-button-primary"
            >
              Check Sorting
            </button>
            <button
              onClick={resetAll}
              disabled={controller.isLocked}
              className="soft-button-secondary"
            >
              Reset Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
