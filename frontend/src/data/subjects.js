/* ═══════════════════════════════════════════════════════════════════
 *  Subject Taxonomy — 4 subjects with conditional subcategories
 *  Mathematics has NO subcategories (skips directly to class selection)
 * ═══════════════════════════════════════════════════════════════════ */

export const subjectCatalog = [
  {
    id: "mathematics",
    title: "Mathematics",
    path: "/subject/mathematics",
    eyebrow: "See the pattern",
    heroTitle: "Turn equations and geometry into living visual stories.",
    description:
      "Learners explore dynamic triangles and algebraic balance with real-time feedback that makes abstract ideas concrete.",
    accent: "from-amber-300 via-orange-300 to-rose-300",
    glow: "bg-amber-100",
    icon: "calculator",
    highlights: ["Pythagorean visualizer", "Balancing scale", "Instant calculations"],
    hasSubcategories: false,
    subcategories: [],
  },
  {
    id: "science",
    title: "Science",
    path: "/subject/science",
    eyebrow: "Observe, test, explain",
    heroTitle: "Run vivid chemistry, biology, and physics labs from any classroom.",
    description:
      "Students can mix chemicals, wire circuits, and place organelles inside premium light-theme simulations built for hands-on understanding.",
    accent: "from-sky-400 via-cyan-400 to-emerald-400",
    glow: "bg-sky-100",
    icon: "beaker",
    highlights: ["Chemistry mixing lab", "Circuit builder", "Cell anatomy map"],
    hasSubcategories: true,
    subcategories: [
      { slug: "physics", title: "Physics", icon: "atom", description: "Forces, motion, electricity, and energy", order: 1 },
      { slug: "chemistry", title: "Chemistry", icon: "flask-conical", description: "Reactions, elements, and molecular structures", order: 2 },
      { slug: "biology", title: "Biology", icon: "dna", description: "Cells, organisms, and ecosystems", order: 3 },
    ],
  },
  {
    id: "social-science",
    title: "Social Science",
    path: "/subject/social-science",
    eyebrow: "Connect people, place, and power",
    heroTitle:
      "Match maps, order events, sort civic roles, and classify economic activity with confidence.",
    description:
      "Interactive geography, history, civics, and economics games help students understand chronology, institutions, global awareness, and economic sectors.",
    accent: "from-emerald-300 via-lime-300 to-yellow-300",
    glow: "bg-emerald-100",
    icon: "globe-2",
    highlights: ["Map matching", "Economics sector sort", "Timeline builder"],
    hasSubcategories: true,
    subcategories: [
      { slug: "geography", title: "Geography", icon: "map-pin", description: "Maps, landforms, and climate patterns", order: 1 },
      { slug: "history", title: "History", icon: "scroll-text", description: "Events, timelines, and historical movements", order: 2 },
      { slug: "civics", title: "Civics", icon: "landmark", description: "Government, rights, and civic responsibilities", order: 3 },
      { slug: "economics", title: "Economics", icon: "trending-up", description: "Markets, sectors, and financial literacy", order: 4 },
    ],
  },
  {
    id: "language",
    title: "Language",
    path: "/subject/language",
    eyebrow: "Express, connect, create",
    heroTitle: "Master Hindi and English through interactive grammar, vocabulary, and comprehension labs.",
    description:
      "Students build sentences, explore word families, and practice comprehension skills through gamified visual exercises instead of rote memorization.",
    accent: "from-violet-400 via-purple-400 to-fuchsia-400",
    glow: "bg-violet-100",
    icon: "book-open-text",
    highlights: ["Sentence builder", "Grammar lab", "Vocabulary explorer"],
    hasSubcategories: true,
    subcategories: [
      { slug: "hindi", title: "Hindi", icon: "languages", description: "व्याकरण, शब्द भंडार, और वाक्य रचना", order: 1 },
      { slug: "english", title: "English", icon: "pen-line", description: "Grammar, vocabulary, and reading comprehension", order: 2 },
    ],
  },
];

export const subjectMap = Object.fromEntries(
  subjectCatalog.map((subject) => [subject.id, subject]),
);

/**
 * Get a subcategory object from a subject ID + subcategory slug.
 */
export function getSubcategory(subjectId, subcategorySlug) {
  const subject = subjectMap[subjectId];
  if (!subject) return null;
  return subject.subcategories.find((s) => s.slug === subcategorySlug) || null;
}
