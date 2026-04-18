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
    <div className="space-y-6">
      {/* Progress indicators */}
      <div className="flex items-center justify-center gap-3">
        {SENTENCES.map((_, i) => (
          <button
            key={i}
            onClick={() => !controller.isLocked && goToSentence(i)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300",
              completed[i]
                ? "bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-lg shadow-emerald-500/20"
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
      <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-fuchsia-50/30 p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
          Translate to Hindi
        </p>
        <p className="mt-2 text-lg font-bold text-slate-900">
          &ldquo;{sentence.english}&rdquo;
        </p>
      </div>

      {/* Sentence construction line */}
      <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 p-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Your Sentence
        </p>
        <div className="flex min-h-[3rem] flex-wrap gap-2">
          <AnimatePresence mode="popLayout">
            {placedWords.map((word, i) => (
              <motion.button
                key={`${word}-${i}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => removeWord(i)}
                className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-500 to-fuchsia-500 px-4 py-2.5 text-base font-bold text-white shadow-md shadow-violet-500/20 transition hover:shadow-lg"
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
          {placedWords.length === 0 && (
            <p className="flex items-center text-sm text-slate-400">
              Tap words below to build the sentence...
            </p>
          )}
        </div>
      </div>

      {/* Available word cards */}
      <div className="flex flex-wrap justify-center gap-3">
        <AnimatePresence mode="popLayout">
          {availableWords.map((word, i) => (
            <motion.button
              key={`avail-${word}-${i}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => placeWord(word)}
              disabled={controller.isLocked}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-base font-bold text-slate-800 shadow-sm transition-all hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/10 disabled:opacity-50"
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Hint toggle */}
      {!showHint && !controller.isLocked && (
        <div className="text-center">
          <button
            onClick={() => setShowHint(true)}
            className="text-xs font-bold text-violet-500 hover:text-violet-700 transition"
          >
            💡 Show Hint
          </button>
        </div>
      )}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center text-sm text-amber-700"
        >
          {sentence.hint}
        </motion.div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={checkSentence}
          disabled={
            placedWords.length !== sentence.correct.length || controller.isLocked
          }
          className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-xl"
        >
          Check Sentence
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetCurrent}
          disabled={controller.isLocked}
          className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-600 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-40"
        >
          Clear
        </motion.button>
      </div>
    </div>
  );
}
