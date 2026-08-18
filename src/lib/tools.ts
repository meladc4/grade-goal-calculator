export interface ToolMeta {
  path: string;
  nameKey: string;
  descKey: string;
  icon: string;
}

export const MAIN_TOOLS: ToolMeta[] = [
  {
    path: "/grade-calculator",
    nameKey: "tool.grade.name",
    descKey: "tool.grade.desc",
    icon: "GraduationCap",
  },
  {
    path: "/grade-average",
    nameKey: "tool.average.name",
    descKey: "tool.average.desc",
    icon: "Sigma",
  },
];

export const SECONDARY_TOOLS: ToolMeta[] = [
  { path: "/percentage", nameKey: "tool.percentage.name", descKey: "tool.percentage.desc", icon: "Percent" },
  { path: "/gpa", nameKey: "tool.gpa.name", descKey: "tool.gpa.desc", icon: "Award" },
  { path: "/weighted-grade", nameKey: "tool.weighted.name", descKey: "tool.weighted.desc", icon: "Scale" },
  { path: "/target-grade", nameKey: "tool.target.name", descKey: "tool.target.desc", icon: "Target" },
  { path: "/what-if", nameKey: "tool.whatif.name", descKey: "tool.whatif.desc", icon: "Shuffle" },
  { path: "/grade-converter", nameKey: "tool.converter.name", descKey: "tool.converter.desc", icon: "ArrowLeftRight" },
  { path: "/study-timer", nameKey: "tool.studytimer.name", descKey: "tool.studytimer.desc", icon: "Timer" },
  { path: "/pomodoro", nameKey: "tool.pomodoro.name", descKey: "tool.pomodoro.desc", icon: "Clock" },
  { path: "/unit-converter", nameKey: "tool.unit.name", descKey: "tool.unit.desc", icon: "Ruler" },
  { path: "/calculator", nameKey: "tool.calculator.name", descKey: "tool.calculator.desc", icon: "Calculator" },
];

/**
 * Grading scale used by the Grade Converter.
 * Edit these thresholds to match a different school's scale.
 */
export interface GradeBand {
  letter: string;
  min: number;
}

export const GRADE_SCALE: GradeBand[] = [
  { letter: "A+", min: 97 },
  { letter: "A", min: 93 },
  { letter: "A-", min: 90 },
  { letter: "B+", min: 87 },
  { letter: "B", min: 83 },
  { letter: "B-", min: 80 },
  { letter: "C+", min: 77 },
  { letter: "C", min: 73 },
  { letter: "C-", min: 70 },
  { letter: "D", min: 60 },
  { letter: "F", min: 0 },
];

export function percentToLetter(percent: number, scale: GradeBand[] = GRADE_SCALE): string {
  for (const band of scale) {
    if (percent >= band.min) return band.letter;
  }
  return scale[scale.length - 1]?.letter ?? "F";
}
