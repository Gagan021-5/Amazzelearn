/* ═══════════════════════════════════════════════════════════════════
 *  Chapter Catalog — organized by subject + subcategory + class
 *  Each chapter maps to a simulation component via simulationId
 * ═══════════════════════════════════════════════════════════════════ */

export const chapterCatalog = [
  /* ─── SCIENCE / PHYSICS ─── */
  {
    slug: "circuit-basics",
    title: "Electric Circuits",
    description: "Build a closed circuit with a battery, conductor, switch, and bulb. Diagnose why current flows or stops.",
    subjectSlug: "science",
    subcategorySlug: "physics",
    classLevel: 8,
    order: 1,
    simulationId: "circuit-builder",
    estimatedTime: "7-9 min",
    difficulty: "intermediate",
    learningObjectives: [
      "Identify the four essential parts of a closed circuit",
      "Distinguish conductors from insulators",
      "Explain why a switch controls current flow",
    ],
    isPublished: true,
  },

  /* ─── SCIENCE / CHEMISTRY ─── */
  {
    slug: "chemical-reactions",
    title: "Chemical Reaction Bench",
    description: "Combine reagents, inspect balanced equations, and classify chemical reactions by type.",
    subjectSlug: "science",
    subcategorySlug: "chemistry",
    classLevel: 8,
    order: 1,
    simulationId: "chemistry-lab",
    estimatedTime: "7-9 min",
    difficulty: "intermediate",
    learningObjectives: [
      "Write balanced chemical equations",
      "Classify reactions: neutralization, precipitation, gas evolution",
      "Predict products of acid-base reactions",
    ],
    isPublished: true,
  },

  /* ─── SCIENCE / BIOLOGY ─── */
  {
    slug: "cell-structure",
    title: "Cell Anatomy Map",
    description: "Place the nucleus, mitochondria, ribosomes, ER, and Golgi apparatus into the correct organelle zones.",
    subjectSlug: "science",
    subcategorySlug: "biology",
    classLevel: 7,
    order: 1,
    simulationId: "cell-anatomy",
    estimatedTime: "5-6 min",
    difficulty: "beginner",
    learningObjectives: [
      "Name and locate five key organelles",
      "Describe the function of each organelle",
      "Differentiate between plant and animal cell features",
    ],
    isPublished: true,
  },

  /* ─── MATHEMATICS ─── */
  {
    slug: "pythagorean-theorem",
    title: "Right Triangle Builder",
    description: "Drag side lengths onto a triangle model, compare square areas, and construct a valid Pythagorean triple.",
    subjectSlug: "mathematics",
    subcategorySlug: null,
    classLevel: 8,
    order: 1,
    simulationId: "pythagorean-visualizer",
    estimatedTime: "6-8 min",
    difficulty: "intermediate",
    learningObjectives: [
      "State and apply the Pythagorean theorem",
      "Identify valid Pythagorean triples",
      "Visualize a² + b² = c² with area squares",
    ],
    isPublished: true,
  },
  {
    slug: "linear-equations",
    title: "Interactive Balancing Scale",
    description: "Drag number weights onto both pans and solve the equation x + 2 = 5 by balancing the scale.",
    subjectSlug: "mathematics",
    subcategorySlug: null,
    classLevel: 6,
    order: 1,
    simulationId: "algebra-balance",
    estimatedTime: "5-7 min",
    difficulty: "beginner",
    learningObjectives: [
      "Understand equations as balanced statements",
      "Solve single-variable linear equations",
      "Use inverse operations to isolate x",
    ],
    isPublished: true,
  },

  /* ─── SOCIAL SCIENCE / GEOGRAPHY ─── */
  {
    slug: "continents-oceans",
    title: "Map Matching Game",
    description: "Match continent name labels to simplified SVG silhouettes on a world-map atlas.",
    subjectSlug: "social-science",
    subcategorySlug: "geography",
    classLevel: 6,
    order: 1,
    simulationId: "geography-match",
    estimatedTime: "5-6 min",
    difficulty: "beginner",
    learningObjectives: [
      "Identify and locate all seven continents",
      "Associate continent shapes with their names",
      "Develop spatial awareness of global geography",
    ],
    isPublished: true,
  },

  /* ─── SOCIAL SCIENCE / HISTORY ─── */
  {
    slug: "indian-freedom-struggle",
    title: "Freedom to Republic Timeline",
    description: "Arrange key milestones from the Revolt of 1857 through the Constitution of India in chronological order.",
    subjectSlug: "social-science",
    subcategorySlug: "history",
    classLevel: 8,
    order: 1,
    simulationId: "history-timeline",
    estimatedTime: "7-9 min",
    difficulty: "intermediate",
    learningObjectives: [
      "Sequence major events of Indian independence",
      "Understand cause-effect in historical movements",
      "Build chronological reasoning skills",
    ],
    isPublished: true,
  },

  /* ─── SOCIAL SCIENCE / CIVICS ─── */
  {
    slug: "branches-of-government",
    title: "Government Responsibilities Sort",
    description: "Sort key responsibilities into Legislature, Executive, and Judiciary buckets.",
    subjectSlug: "social-science",
    subcategorySlug: "civics",
    classLevel: 7,
    order: 1,
    simulationId: "civics-sort",
    estimatedTime: "6-7 min",
    difficulty: "intermediate",
    learningObjectives: [
      "Name the three branches of government",
      "Classify responsibilities across branches",
      "Understand separation of powers",
    ],
    isPublished: true,
  },

  /* ─── SOCIAL SCIENCE / ECONOMICS ─── */
  {
    slug: "economic-sectors",
    title: "Economic Sectors Sort",
    description: "Sort occupations and activities into primary, secondary, and tertiary sectors.",
    subjectSlug: "social-science",
    subcategorySlug: "economics",
    classLevel: 9,
    order: 1,
    simulationId: "economics-sector-sort",
    estimatedTime: "6-7 min",
    difficulty: "intermediate",
    learningObjectives: [
      "Define primary, secondary, and tertiary sectors",
      "Classify real-world occupations by sector",
      "Understand how economies organize production",
    ],
    isPublished: true,
  },

  /* ─── LANGUAGE / HINDI ─── */
  {
    slug: "hindi-sentence-builder",
    title: "वाक्य रचना — Sentence Builder",
    description: "Arrange Hindi words in correct grammatical order to form meaningful sentences using कर्ता, क्रिया, and कर्म.",
    subjectSlug: "language",
    subcategorySlug: "hindi",
    classLevel: 5,
    order: 1,
    simulationId: "hindi-sentence-builder",
    estimatedTime: "6-8 min",
    difficulty: "beginner",
    learningObjectives: [
      "Construct grammatically correct Hindi sentences",
      "Identify subject, verb, and object in Hindi",
      "Practice common Hindi word order patterns",
    ],
    isPublished: true,
  },

  /* ─── LANGUAGE / ENGLISH ─── */
  {
    slug: "english-grammar-lab",
    title: "Parts of Speech Lab",
    description: "Classify words into nouns, verbs, adjectives, and adverbs by sorting them into the correct grammar buckets.",
    subjectSlug: "language",
    subcategorySlug: "english",
    classLevel: 5,
    order: 1,
    simulationId: "english-grammar-sort",
    estimatedTime: "5-7 min",
    difficulty: "beginner",
    learningObjectives: [
      "Identify the four main parts of speech",
      "Classify words by their grammatical function",
      "Build vocabulary awareness through categorization",
    ],
    isPublished: true,
  },
];

/**
 * Lookup helpers
 */
export const chapterMap = Object.fromEntries(
  chapterCatalog.map((ch) => [ch.slug, ch]),
);

export function getChapters({ subjectSlug, subcategorySlug = null, classLevel = null }) {
  return chapterCatalog.filter((ch) => {
    if (ch.subjectSlug !== subjectSlug) return false;
    if (subcategorySlug && ch.subcategorySlug !== subcategorySlug) return false;
    if (classLevel && ch.classLevel !== Number(classLevel)) return false;
    if (!ch.isPublished) return false;
    return true;
  });
}

/**
 * Get unique class levels that have chapters for a given subject/subcategory.
 */
export function getAvailableClasses(subjectSlug, subcategorySlug = null) {
  const levels = new Set();
  chapterCatalog.forEach((ch) => {
    if (ch.subjectSlug !== subjectSlug) return;
    if (subcategorySlug && ch.subcategorySlug !== subcategorySlug) return;
    if (!ch.isPublished) return;
    levels.add(ch.classLevel);
  });
  return Array.from(levels).sort((a, b) => a - b);
}
