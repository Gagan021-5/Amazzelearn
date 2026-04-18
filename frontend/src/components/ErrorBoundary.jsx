import { Component } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
 *  ErrorBoundary — catches simulation render crashes
 *  Must be a class component (React error boundaries don't support hooks)
 * ═══════════════════════════════════════════════════════════════════ */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[SimulationError]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50/30 p-8 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30">
            <AlertOctagon className="h-8 w-8 text-white" />
          </div>
          <h3 className="mt-5 text-xl font-extrabold text-slate-900">
            Simulation Error
          </h3>
          <p className="mt-2 max-w-md text-sm text-slate-500">
            Something went wrong while running this simulation. This is usually
            a temporary issue — try restarting.
          </p>
          {this.state.error && (
            <pre className="mt-4 max-w-md overflow-x-auto rounded-xl bg-slate-900 p-4 text-left text-xs text-rose-300">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={this.handleReset}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <RotateCcw className="h-4 w-4" />
            Restart Simulation
          </button>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
