import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════════
 *  Hindi Sentence Builder — वाक्य रचना
 *  Students arrange Hindi words in correct SOV grammatical order
 * ═══════════════════════════════════════════════════════════════════ */

const SENTENCES = [
  {
    english: "Ram eats food.",
    words: ["राम", "खाना", "खाता", "है"],
    correct: ["राम", "खाना", "खाता", "है"],
    hint: "Hindi follows Subject-Object-Verb (कर्ता-कर्म-क्रिया) order",
  },
  {
    english: "Sita reads a book.",
    words: ["सीता", "पढ़ती", "किताब", "है"],
    correct: ["सीता", "किताब", "पढ़ती", "है"],
    hint: "The object (कर्म) comes before the verb (क्रिया)",
  },
  {
    english: "The boy plays in the garden.",
    words: ["में", "लड़का", "बगीचे", "खेलता", "है"],
    correct: ["लड़का", "बगीचे", "में", "खेलता", "है"],
    hint: "Place + postposition (में) comes before the verb",
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

export default function HindiSentenceBuilder({ controller }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [availableWords, setAvailableWords] = useState(() =>
    shuffleArray(SENTENCES[0].words),
  );
  const [placedWords, setPlacedWords] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState([false, false, false]);

  const sentence = SENTENCES[currentIndex];

  const resetCurrent = useCallback(() => {
    setAvailableWords(shuffleArray(SENTENCES[currentIndex].words));
    setPlacedWords([]);
    setShowHint(false);
  }, [currentIndex]);

  const placeWord = (word) => {
    if (controller.isLocked) return;
    setPlacedWords((prev) => [...prev, word]);
    setAvailableWords((prev) => {
      const idx = prev.indexOf(word);
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });
  };

  const removeWord = (index) => {
    if (controller.isLocked) return;
    const word = placedWords[index];
    setPlacedWords((prev) => [...prev.slice(0, index), ...prev.slice(index + 1)]);
    setAvailableWords((prev) => [...prev, word]);
  };

  const checkSentence = () => {
    if (placedWords.length !== sentence.correct.length) return;

    const isCorrect = placedWords.every(
      (w, i) => w === sentence.correct[i],
    );

    if (isCorrect) {
      const newCompleted = [...completed];
      newCompleted[currentIndex] = true;
      setCompleted(newCompleted);

      const allDone = newCompleted.every(Boolean);
      controller.submitAttempt(allDone, {
        success: "शानदार! All sentences correctly constructed! 🎉",
        failure: `Correct! Moving to sentence ${currentIndex + 2}...`,
      });

      if (!allDone) {
        setTimeout(() => {
          const next = currentIndex + 1;
          setCurrentIndex(next);
          setAvailableWords(shuffleArray(SENTENCES[next].words));
          setPlacedWords([]);
          setShowHint(false);
          controller.clearFeedback();
        }, 1500);
      }
    } else {
      controller.submitAttempt(false, {
        failure: "Word order is not quite right. Remember: कर्ता → कर्म → क्रिया (Subject → Object → Verb)",
      });
    }
  };

  const goToSentence = (idx) => {
    setCurrentIndex(idx);
    setAvailableWords(shuffleArray(SENTENCES[idx].words));
    setPlacedWords([]);
    setShowHint(false);
  };

  return (
    <div className="sim-layout">
      {/* ─── Item Bank ─── */}
      <div className="item-bank">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Word Cards
        </p>
        <h2 className="mt-2 text-2xl font-bold text-slate-900">वाक्य रचना — Sentence Builder</h2>

        {/* Sentence progress */}
        <div className="mt-5 flex items-center gap-3">
          {SENTENCES.map((_, i) => (
            <button
              key={i}
              onClick={() => !controller.isLocked && goToSentence(i)}
              className={[
                "flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold transition-all duration-300 shadow-sm",
                completed[i]
                  ? "bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg shadow-emerald-500/20"
                  : i === currentIndex
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200",
              ].join(" ")}
            >
              {completed[i] ? "✓" : i + 1}
            </button>
          ))}
        </div>

        {/* English sentence prompt */}
        <div className="mt-6 rounded-[24px] border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
            Translate to Hindi
          </p>
          <p className="mt-3 text-lg font-bold text-slate-900">
            &ldquo;{sentence.english}&rdquo;
          </p>
        </div>

        {/* Available word cards */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">
            Available Words
          </p>
          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode="popLayout">
              {availableWords.map((word, i) => (
                <motion.button
                  key={`avail-${word}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  whileHover={{ scale: 1.06, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => placeWord(word)}
                  disabled={controller.isLocked}
                  className="token-card !px-6 !py-3.5 text-lg font-bold text-slate-800 disabled:opacity-50"
                >
                  {word}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Hint */}
        {!showHint && !controller.isLocked && (
          <div className="mt-5 text-center">
            <button
              onClick={() => setShowHint(true)}
              className="text-sm font-semibold text-violet-500 hover:text-violet-700 transition"
            >
              💡 Show Hint
            </button>
          </div>
        )}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-2xl bg-amber-50 border border-amber-100 p-5 text-sm text-amber-700"
          >
            {sentence.hint}
          </motion.div>
        )}
      </div>

      {/* ─── Drop Canvas ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Sentence Construction
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Build the Hindi sentence</h2>
          </div>
          <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
            Tap words in correct order
          </div>
        </div>

        <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#faf5ff_0%,#ffffff_52%,#eff6ff_100%)] p-5 sm:p-6">
          {/* Sentence construction line */}
          <div className="rounded-[24px] border-2 border-dashed border-slate-200 bg-white/70 p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Your Sentence
            </p>
            <div className="flex min-h-[80px] flex-wrap items-center gap-3">
              <AnimatePresence mode="popLayout">
                {placedWords.map((word, i) => (
                  <motion.button
                    key={`${word}-${i}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => removeWord(i)}
                    className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-500 to-fuchsia-500 px-6 py-3.5 text-lg font-bold text-white shadow-md shadow-violet-500/20 transition hover:shadow-lg"
                  >
                    {word}
                  </motion.button>
                ))}
              </AnimatePresence>
              {placedWords.length === 0 && (
                <p className="flex items-center text-sm font-semibold text-slate-400">
                  Tap word cards from the bank to build the sentence...
                </p>
              )}
            </div>
          </div>

          {/* Visual sentence preview */}
          {placedWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-[24px] bg-white/80 p-5 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 mb-3">Preview</p>
              <p className="text-2xl font-bold text-slate-900">
                {placedWords.join(" ")}
              </p>
            </motion.div>
          )}

          {/* Grammar reference */}
          <div className="mt-5 rounded-[24px] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Grammar reference</p>
            <p className="mt-2 text-sm text-slate-500">
              Hindi sentences follow <strong className="text-slate-800">SOV</strong> order:
              Subject (कर्ता) → Object (कर्म) → Verb (क्रिया). The auxiliary verb (है/हैं)
              comes at the end.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={checkSentence}
              disabled={
                placedWords.length !== sentence.correct.length || controller.isLocked
              }
              className="soft-button-primary"
            >
              Check Sentence
            </button>
            <button
              onClick={resetCurrent}
              disabled={controller.isLocked}
              className="soft-button-secondary"
            >
              Clear Words
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
