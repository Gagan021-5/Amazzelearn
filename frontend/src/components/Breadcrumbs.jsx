import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════
 *  Breadcrumbs — reusable animated breadcrumb trail
 *  
 *  Usage:
 *    <Breadcrumbs items={[
 *      { label: "Science", to: "/subject/science" },
 *      { label: "Physics", to: "/subject/science/physics" },
 *      { label: "Class 8" },   // last item = no link (current page)
 *    ]} />
 * ═══════════════════════════════════════════════════════════════════ */

export default function Breadcrumbs({ items = [] }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-label="Breadcrumb"
      className="mb-6"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {/* Home link always first */}
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
              {isLast || !item.to ? (
                <span className="rounded-lg px-2.5 py-1.5 font-bold text-slate-900">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="rounded-lg px-2.5 py-1.5 font-semibold text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
