import { lazy } from "react";

/* ═══════════════════════════════════════════════════════════════════
 *  Simulation Component Registry — Lazy-loaded mapping
 *  Maps componentKey strings (from DB/chapters) to React.lazy components
 * ═══════════════════════════════════════════════════════════════════ */

/**
 * componentMap: string key → React.lazy component
 * This is the ONLY place simulation components are imported.
 */
export const componentMap = {
  ChemistryLab: lazy(() => import("./science/ChemistryLab")),
  CircuitBuilder: lazy(() => import("./science/CircuitBuilder")),
  CellAnatomy: lazy(() => import("./science/CellAnatomy")),
  PythagoreanVisualizer: lazy(() => import("./mathematics/PythagoreanVisualizer")),
  AlgebraBalance: lazy(() => import("./mathematics/AlgebraBalance")),
  GeographyMatch: lazy(() => import("./social/GeographyMatch")),
  HistoryTimeline: lazy(() => import("./social/HistoryTimeline")),
  CivicsSort: lazy(() => import("./social/CivicsSort")),
  EconomicsSectorSort: lazy(() => import("./social/EconomicsSectorSort")),
  HindiSentenceBuilder: lazy(() => import("./language/HindiSentenceBuilder")),
  EnglishGrammarSort: lazy(() => import("./language/EnglishGrammarSort")),
};

/**
 * Full simulation metadata catalog.
 * Each entry's `componentKey` maps to the lazy component above.
 */
export const simulationCatalog = [
  {
    id: "chemistry-lab",
    subjectId: "science",
    subcategorySlug: "chemistry",
    subjectLabel: "Science",
    topic: "Chemistry",
    title: "Chemistry Reaction Bench",
    summary:
      "Combine two reagents, inspect the balanced equation, and distinguish between dissolution, neutralization, precipitation, and gas evolution.",
    challenge: "Make NaCl + H₂O accurately",
    estimatedTime: "7-9 min",
    accent: "from-sky-400 to-emerald-400",
    componentKey: "ChemistryLab",
    instructions: [
      "Choose two samples from the chemistry bench. You can drag them on desktop or tap-select them on mobile.",
      "Place one sample into Beaker A and one into Beaker B to load the reaction vessel.",
      "Read the equation, products, and observation panel before pressing check.",
      "Use the feedback to identify the accurate pair that produces sodium chloride and water.",
    ],
  },
  {
    id: "circuit-builder",
    subjectId: "science",
    subcategorySlug: "physics",
    subjectLabel: "Science",
    topic: "Physics",
    title: "Closed Circuit Workbench",
    summary:
      "Assemble a real energy pathway with a source, conductor, switch, and load, then diagnose why current does or does not flow.",
    challenge: "Light the lamp",
    estimatedTime: "7-9 min",
    accent: "from-indigo-400 to-amber-300",
    componentKey: "CircuitBuilder",
    instructions: [
      "Choose a source, a path material, a switch state, and an output device from the tray.",
      "Place one part into each workbench slot to complete the circuit plan.",
      "Watch the schematic update to show whether the loop is open, insulating, or closed.",
      "Check the circuit to confirm that the lamp glows for the correct scientific reason.",
    ],
  },
  {
    id: "cell-anatomy",
    subjectId: "science",
    subcategorySlug: "biology",
    subjectLabel: "Science",
    topic: "Biology",
    title: "Cell Anatomy Map",
    summary:
      "Place the nucleus, mitochondria, ribosomes, endoplasmic reticulum, and Golgi apparatus into the correct organelle zones inside a large animated cell.",
    challenge: "Map all five organelles",
    estimatedTime: "5-6 min",
    accent: "from-emerald-400 to-cyan-300",
    componentKey: "CellAnatomy",
    instructions: [
      "Choose an organelle card from the tray below the cell model.",
      "Drop it into the matching highlighted zone inside the cell membrane.",
      "Use the check button to verify both placements at once.",
      "Reset the board any time you want to practice another full attempt sequence.",
    ],
  },
  {
    id: "pythagorean-visualizer",
    subjectId: "mathematics",
    subcategorySlug: null,
    subjectLabel: "Mathematics",
    topic: "Geometry",
    title: "Right Triangle Builder",
    summary:
      "Drag side lengths onto a triangle model, compare the square areas, and build a valid Pythagorean triple. Use Slider Mode for real-time exploration or Drag Mode for the challenge.",
    challenge: "Build c = 10",
    estimatedTime: "6-8 min",
    accent: "from-amber-400 to-rose-400",
    componentKey: "PythagoreanVisualizer",
    instructions: [
      "Choose three side lengths from the number bank.",
      "Drop one value on each side label for a, b, and c.",
      "Compare a² + b² with c² in the live theorem panel.",
      "Check the triangle once you believe you have built the target right triangle.",
    ],
  },
  {
    id: "algebra-balance",
    subjectId: "mathematics",
    subcategorySlug: null,
    subjectLabel: "Mathematics",
    topic: "Algebra",
    title: "Interactive Balancing Scale",
    summary:
      "Drag number weights onto both pans and solve the equation x + 2 = 5 by balancing the scale.",
    challenge: "Solve for x",
    estimatedTime: "5-7 min",
    accent: "from-orange-300 to-amber-500",
    componentKey: "AlgebraBalance",
    instructions: [
      "Use the number cards to choose a value for x and a matching weight for the right pan.",
      "Drop one weight into the x slot and one weight into the right pan slot.",
      "Watch the beam tilt in response to the total value on each side of the scale.",
      "Check the scale to confirm whether your chosen value solves x + 2 = 5.",
    ],
  },
  {
    id: "geography-match",
    subjectId: "social-science",
    subcategorySlug: "geography",
    subjectLabel: "Social Science",
    topic: "Geography",
    title: "Map Matching Game",
    summary:
      "Match continent name labels to simplified SVG silhouettes on a world-map atlas with seven continents.",
    challenge: "Label all continents",
    estimatedTime: "5-6 min",
    accent: "from-emerald-400 to-lime-300",
    componentKey: "GeographyMatch",
    instructions: [
      "Drag or tap-select a country label from the card tray.",
      "Place the label on the matching highlighted country outline in the map panel.",
      "Check the full map once all slots are filled.",
      "Use feedback to adjust the labels until every map region is matched correctly.",
    ],
  },
  {
    id: "history-timeline",
    subjectId: "social-science",
    subcategorySlug: "history",
    subjectLabel: "Social Science",
    topic: "History",
    title: "Freedom to Republic Timeline",
    summary:
      "Arrange key milestones from the Revolt of 1857 through the Constitution of India by dragging them into chronological order.",
    challenge: "Build the chronology",
    estimatedTime: "7-9 min",
    accent: "from-lime-400 to-yellow-300",
    componentKey: "HistoryTimeline",
    instructions: [
      "Read each event card carefully and use the dates to infer the right order.",
      "Drag the cards into the numbered timeline slots from earliest to latest.",
      "Review the current order panel before checking the full sequence.",
      "If the chronology is incorrect, clear any slot and rebuild the sequence.",
    ],
  },
  {
    id: "civics-sort",
    subjectId: "social-science",
    subcategorySlug: "civics",
    subjectLabel: "Social Science",
    topic: "Civics",
    title: "Government Responsibilities Sort",
    summary:
      "Sort key responsibilities into Legislature, Executive, and Judiciary buckets with instant feedback.",
    challenge: "Sort the branches",
    estimatedTime: "6-7 min",
    accent: "from-emerald-500 to-yellow-400",
    componentKey: "CivicsSort",
    instructions: [
      "Choose a responsibility card from the unsorted tray.",
      "Drop the card into the branch of government that handles that role.",
      "Check the full sorting board to validate all assignments together.",
      "Use the overlay hint to refine any bucket that still needs correction.",
    ],
  },
  {
    id: "economics-sector-sort",
    subjectId: "social-science",
    subcategorySlug: "economics",
    subjectLabel: "Social Science",
    topic: "Economics",
    title: "Economic Sectors Sort",
    summary:
      "Sort occupations and activities into the primary, secondary, and tertiary sectors to understand how economies organize work.",
    challenge: "Sort the sectors",
    estimatedTime: "6-7 min",
    accent: "from-emerald-400 via-lime-300 to-yellow-300",
    componentKey: "EconomicsSectorSort",
    instructions: [
      "Choose an occupation or activity card from the tray.",
      "Place it into the correct sector: Primary, Secondary, or Tertiary.",
      "Continue until all cards are sorted across the three sector columns.",
      "Check the full board to confirm every activity is grouped into the right economic sector.",
    ],
  },
  {
    id: "hindi-sentence-builder",
    subjectId: "language",
    subcategorySlug: "hindi",
    subjectLabel: "Language",
    topic: "Hindi",
    title: "वाक्य रचना — Sentence Builder",
    summary:
      "Arrange Hindi words in correct grammatical order to form meaningful sentences using कर्ता, क्रिया, and कर्म.",
    challenge: "Build 3 correct sentences",
    estimatedTime: "6-8 min",
    accent: "from-violet-400 to-fuchsia-400",
    componentKey: "HindiSentenceBuilder",
    instructions: [
      "Read the English meaning of the target sentence shown at the top.",
      "Choose Hindi word cards from the shuffled tray below.",
      "Arrange them in the correct grammatical order on the sentence line.",
      "Check to verify the sentence structure and meaning.",
    ],
  },
  {
    id: "english-grammar-sort",
    subjectId: "language",
    subcategorySlug: "english",
    subjectLabel: "Language",
    topic: "English",
    title: "Parts of Speech Lab",
    summary:
      "Classify words into nouns, verbs, adjectives, and adverbs by sorting them into the correct grammar buckets.",
    challenge: "Sort all 12 words",
    estimatedTime: "5-7 min",
    accent: "from-purple-400 to-indigo-400",
    componentKey: "EnglishGrammarSort",
    instructions: [
      "Read each word card and determine its part of speech.",
      "Drag the card into the matching bucket: Noun, Verb, Adjective, or Adverb.",
      "Continue until all word cards are classified.",
      "Check the board to see which words were correctly sorted.",
    ],
  },
];

export const simulationMap = Object.fromEntries(
  simulationCatalog.map((simulation) => [simulation.id, simulation]),
);

export const getSimulationsBySubject = (subjectId) =>
  simulationCatalog.filter((simulation) => simulation.subjectId === subjectId);

export const getSimulationsBySubcategory = (subjectId, subcategorySlug) =>
  simulationCatalog.filter(
    (sim) => sim.subjectId === subjectId && sim.subcategorySlug === subcategorySlug,
  );

/**
 * Resolve a simulation's componentKey to a React.lazy component.
 */
export function getSimulationComponent(componentKey) {
  return componentMap[componentKey] || null;
}
