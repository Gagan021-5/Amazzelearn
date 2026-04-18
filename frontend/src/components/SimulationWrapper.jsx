import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Star,
  AlertTriangle,
  Lock,
  ChevronDown,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Confetti from "./Confetti";

/* ═══════════════════════════════════════════════════════════════════
 *  useSimulationController — gamification state (untouched logic)
 * ═══════════════════════════════════════════════════════════════════ */
export function useSimulationController(maxAttempts = 10) {
  const [attempts, setAttempts] = useState(0);
  const [status, setStatus] = useState("idle");
  const [overlay, setOverlay] = useState(null);
  const [sessionId, setSessionId] = useState(0);

  const submitAttempt = (isSuccess, messages = {}) => {
    if (status === "success" || attempts >= maxAttempts) {
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (isSuccess) {
      setStatus("success");
      setOverlay({
        variant: "success",
        message:
          messages.success ??
          "Brilliant work. You matched the concept correctly.",
      });
      return;
    }

    if (nextAttempts >= maxAttempts) {
      setStatus("locked");
      setOverlay({
        variant: "locked",
        message:
          messages.locked ??
          "You have used all 10 attempts. Restart the challenge to practice again.",
      });
      return;
    }

    setStatus("error");
    setOverlay({
      variant: "error",
      message:
        messages.failure ??
        `Not quite yet. You still have ${maxAttempts - nextAttempts} attempts left.`,
    });
  };

  const clearFeedback = () => {
    if (status === "error") {
      setStatus("idle");
    }

    setOverlay((current) => (current?.variant === "error" ? null : current));
  };

  const dismissOverlay = () => {
    setOverlay(null);

    if (status === "error") {
      setStatus("idle");
    }
  };

  const restartSession = () => {
    setAttempts(0);
    setStatus("idle");
    setOverlay(null);
    setSessionId((current) => current + 1);
  };

  return {
    attempts,
    maxAttempts,
    attemptsRemaining: Math.max(0, maxAttempts - attempts),
    status,
    overlay,
    sessionId,
    isLocked: status === "success" || status === "locked",
    submitAttempt,
    clearFeedback,
    dismissOverlay,
    restartSession,
  };
}

/* ═══════════════════════════════════════════════════════════════════
 *  Overlay visual variants
 * ═══════════════════════════════════════════════════════════════════ */
const overlayVariants = {
  success: {
    badge: "You Win!",
    bg: "from-emerald-500/10 to-cyan-500/10",
    border: "border-emerald-200/80",
    iconBg: "from-emerald-500 to-cyan-500",
    text: "text-emerald-800",
    icon: Star,
  },
  error: {
    badge: "Try Again",
    bg: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-200/80",
    iconBg: "from-amber-500 to-orange-500",
    text: "text-amber-800",
    icon: AlertTriangle,
  },
  locked: {
    badge: "Attempts Used",
    bg: "from-rose-500/10 to-pink-500/10",
    border: "border-rose-200/80",
    iconBg: "from-rose-500 to-pink-500",
    text: "text-rose-800",
    icon: Lock,
  },
};

/* ═══════════════════════════════════════════════════════════════════
 *  SimulationWrapper — "Lab Monitor" shell
 *  Now accepts backTo/backLabel props for deep routing
 * ═══════════════════════════════════════════════════════════════════ */
export default function SimulationWrapper({
  simulation,
  controller,
  children,
  backTo = "/",
  backLabel = "Back",
}) {
  const overlayStyle = controller.overlay
    ? overlayVariants[controller.overlay.variant]
    : null;
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <section
      className={[
        "space-y-6 transition-all duration-300",
        isFullscreen
          ? "fixed inset-0 z-[100] overflow-y-auto bg-white/95 backdrop-blur-xl p-4 sm:p-6"
          : "",
      ].join(" ")}
    >
      {/* ── Header Panel ── */}
      <div className="rounded-3xl border border-white/50 bg-white/70 px-6 py-6 shadow-soft backdrop-blur-xl sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={backTo}
                className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.14em] text-violet-700 ring-1 ring-violet-100 transition hover:bg-violet-100"
              >
                {simulation.subjectLabel}
              </Link>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {simulation.topic}
              </span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl lg:text-4xl">
              {simulation.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500 sm:text-base">
              {simulation.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                🎯 {simulation.challenge}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                ⏱ {simulation.estimatedTime}
              </span>
            </div>
          </div>

          {/* ── Gamification HUD — Progress Dots ── */}
          <div className="w-full max-w-xs rounded-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-violet-50/30 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Attempts
                </p>
                <p className="mt-0.5 text-2xl font-extrabold text-slate-900">
                  {controller.attempts}
                  <span className="text-sm font-semibold text-slate-400">
                    /{controller.maxAttempts}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-violet-50 px-3 py-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
                  Left
                </p>
                <p className="text-lg font-extrabold text-violet-700">
                  {controller.attemptsRemaining}
                </p>
              </div>
            </div>

            {/* Glowing progress dots */}
            <div className="mt-4 flex justify-between gap-1.5">
              {Array.from({ length: controller.maxAttempts }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{
                    scale: i === controller.attempts - 1 ? [1, 1.5, 1] : 1,
                    boxShadow:
                      i < controller.attempts
                        ? controller.status === "success"
                          ? "0 0 8px rgba(16,185,129,0.5)"
                          : "0 0 8px rgba(124,58,237,0.4)"
                        : "none",
                  }}
                  transition={{ duration: 0.4 }}
                  className={[
                    "h-2.5 flex-1 rounded-full transition-colors duration-300",
                    i < controller.attempts
                      ? controller.status === "success"
                        ? "bg-emerald-400"
                        : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      : "bg-slate-200",
                  ].join(" ")}
                />
              ))}
            </div>

            {/* Health bar */}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className={`h-full rounded-full ${
                  controller.status === "success"
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                    : "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                }`}
                initial={{ width: "100%" }}
                animate={{
                  width: `${(controller.attemptsRemaining / controller.maxAttempts) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Lab Monitor Canvas ── */}
      <div className="relative rounded-3xl border border-slate-200/50 bg-white shadow-soft-lg">
        {/* Top glowing border accent */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute right-4 top-4 z-30 rounded-xl bg-white/80 p-2 text-slate-500 ring-1 ring-slate-200/60 transition hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>

        {/* Canvas inner shadow shell */}
        <div className="p-3 sm:p-4">
          <div className="sim-canvas p-4 sm:p-6 lg:p-8">
            {/* Confetti on win */}
            <Confetti active={controller.status === "success"} />

            {/* Feedback overlay */}
            <AnimatePresence>
              {controller.overlay && overlayStyle ? (
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 14, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className="absolute inset-x-4 top-4 z-20 sm:inset-x-auto sm:right-6 sm:top-6 sm:w-[22rem]"
                >
                  <div
                    className={`rounded-2xl border bg-gradient-to-br ${overlayStyle.bg} ${overlayStyle.border} p-5 shadow-xl backdrop-blur-sm`}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        initial={{ rotate: -20, scale: 0.5 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 14,
                          delay: 0.1,
                        }}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${overlayStyle.iconBg} shadow-lg`}
                      >
                        <overlayStyle.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <motion.p
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                          className="text-base font-bold"
                        >
                          {overlayStyle.badge}
                        </motion.p>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.25 }}
                          className={`mt-1 text-sm leading-relaxed ${overlayStyle.text}`}
                        >
                          {controller.overlay.message}
                        </motion.p>
                      </div>
                      <button
                        type="button"
                        onClick={controller.dismissOverlay}
                        className="rounded-lg bg-white/80 px-2.5 py-1.5 text-xs font-semibold text-slate-500 ring-1 ring-black/5 transition hover:bg-white"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {children}
          </div>
        </div>

        {/* Bottom glowing border accent */}
        <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-fuchsia-400/30 to-transparent" />
      </div>

      {/* ── Action bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 rounded-xl bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-600 ring-1 ring-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
        <button
          type="button"
          onClick={controller.restartSession}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/30"
        >
          <RotateCcw className="h-4 w-4" />
          Restart Challenge
        </button>
      </div>

      {/* ── Instructions Accordion ── */}
      <div className="rounded-2xl border border-white/50 bg-white/70 shadow-soft backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setInstructionsOpen(!instructionsOpen)}
          className="flex w-full items-center justify-between px-6 py-5 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50">
              <Sparkles className="h-4 w-4 text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Step-by-Step Instructions
              </p>
              <p className="text-xs text-slate-400">
                {simulation.instructions.length} guided steps
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: instructionsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {instructionsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6">
                <div className="grid gap-3">
                  {simulation.instructions.map((instruction, i) => (
                    <motion.div
                      key={instruction}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-4 rounded-xl bg-slate-50/80 p-4"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-bold text-white shadow-sm">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {instruction}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
