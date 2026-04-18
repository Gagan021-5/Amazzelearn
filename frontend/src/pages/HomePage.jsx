import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Beaker,
  Brain,
  Globe,
  Rocket,
  Sparkles,
  Zap,
  Layers,
  Smartphone,
  BookOpen,
} from "lucide-react";
import SubjectCard from "../components/SubjectCard";
import { subjectCatalog } from "../data/subjects";
import { chapterCatalog } from "../data/chapters";
import { simulationCatalog } from "../simulations/registry";

/* ── Animated counter that counts up on scroll ── */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1200;
          const startTime = performance.now();

          const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ── Stagger container animation ── */
const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const springUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

export default function HomePage() {
  return (
    <div className="px-4 pb-14 pt-6 sm:px-6 lg:px-8">
      {/* ═════════ HERO SECTION ═════════ */}
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem]">
          {/* Mesh gradient background */}
          <div className="absolute inset-0 bg-mesh-amazze" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(139,92,246,0.12),transparent_50%),radial-gradient(ellipse_at_70%_80%,rgba(52,211,153,0.10),transparent_50%),radial-gradient(ellipse_at_90%_30%,rgba(251,146,60,0.07),transparent_40%)]" />

          {/* Floating geometric shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute left-[8%] top-[12%] h-14 w-14 rounded-2xl border-2 border-amazze-purple-300/30 bg-amazze-purple-200/20"
            />
            <motion.div
              animate={{ y: [8, -12, 8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-[10%] top-[18%] h-10 w-10 rounded-full border-2 border-amazze-mint-300/30 bg-amazze-mint-200/20"
            />
            <motion.div
              animate={{ y: [-8, 14, -8], x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[15%] left-[15%] h-12 w-12 rounded-xl border-2 border-amazze-orange-300/30 bg-amazze-orange-200/20"
            />
            <motion.div
              animate={{ y: [5, -10, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[22%] right-[18%] h-8 w-8 rounded-full border-2 border-amazze-pink-300/30 bg-amazze-pink-200/20"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute left-[50%] top-[8%] h-6 w-6 rounded-lg border-2 border-amazze-sky-300/20 bg-amazze-sky-100/15"
            />
          </div>

          {/* Hero content */}
          <div className="relative px-6 py-18 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl text-center"
            >
              <motion.div variants={springUp}>
                <span className="badge-amazze">
                  <Sparkles className="h-3.5 w-3.5" />
                  Interactive Learning Labs
                </span>
              </motion.div>

              <motion.h1
                variants={springUp}
                className="mt-7 text-4xl font-extrabold leading-[1.08] sm:text-5xl lg:text-[3.5rem]"
              >
                Learn by doing with{" "}
                <span className="text-gradient-amazze">premium simulations</span>{" "}
                for every student.
              </motion.h1>

              <motion.p
                variants={springUp}
                className="mt-6 text-base leading-relaxed text-slate-500 sm:text-lg"
              >
                Interactive STEM, humanities, and language labs designed to be clear, playful,
                and deeply educational — from chemistry benches to grammar builders.
              </motion.p>

              <motion.div
                variants={springUp}
                className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                  }}
                >
                  <Link
                    to="/subject/science"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amazze-purple-500 to-amazze-purple-600 px-8 py-4 text-sm font-extrabold text-white shadow-purple-glow-lg transition-all hover:shadow-purple-glow-lg"
                  >
                    <Rocket className="h-4.5 w-4.5 transition-transform group-hover:-rotate-12" />
                    Start Exploring
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/subject/mathematics"
                    className="btn-secondary"
                  >
                    Browse Mathematics
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200, damping: 20 }}
              className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-4"
            >
              {[
                {
                  icon: Beaker,
                  label: "Subjects",
                  value: subjectCatalog.length,
                  color: "text-amazze-purple-500 bg-amazze-purple-50",
                },
                {
                  icon: Brain,
                  label: "Simulations",
                  value: simulationCatalog.length,
                  color: "text-amazze-sky-500 bg-amazze-sky-50",
                },
                {
                  icon: BookOpen,
                  label: "Chapters",
                  value: chapterCatalog.length,
                  color: "text-amazze-mint-500 bg-amazze-mint-50",
                },
                {
                  icon: Globe,
                  label: "Classes",
                  value: 10,
                  color: "text-amazze-orange-500 bg-amazze-orange-50",
                },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 p-4.5 backdrop-blur-sm shadow-soft"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">
                      <AnimatedCounter target={stat.value} />
                    </p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═════════ SUBJECT NAVIGATION GRID ═════════ */}
      <section id="subject-hubs" className="mx-auto mt-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="badge-amazze">
            <Sparkles className="h-3 w-3" />
            Subject Hubs
          </span>
          <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
            Choose your{" "}
            <span className="text-gradient-amazze">learning pathway</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">
            Each lab features consistent game mechanics, animated feedback, and
            guided step-by-step instructions.
          </p>
        </motion.div>

        {/* ── Subject Cards Grid — now 4 cards ── */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subjectCatalog.map((subject, index) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* ═════════ FEATURE TILES ═════════ */}
      <section className="mx-auto mt-20 max-w-7xl">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              icon: Layers,
              title: "SVG Simulations",
              desc: "Rich 2D visuals with real-time feedback.",
              color: "text-amazze-purple-500 bg-amazze-purple-50",
            },
            {
              icon: Zap,
              title: "10-Attempt Loop",
              desc: "Gamified tries with progress tracking.",
              color: "text-amazze-orange-500 bg-amazze-orange-50",
            },
            {
              icon: Smartphone,
              title: "Mobile First",
              desc: "Responsive design for any device.",
              color: "text-amazze-sky-500 bg-amazze-sky-50",
            },
            {
              icon: BookOpen,
              title: "Guided Steps",
              desc: "Step-by-step learning instructions.",
              color: "text-amazze-mint-500 bg-amazze-mint-50",
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-soft backdrop-blur-sm transition-shadow hover:shadow-soft-lg"
            >
              <div
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-sm font-extrabold text-slate-900">
                {feature.title}
              </h4>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
