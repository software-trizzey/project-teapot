import type { ScanResult } from "@/lib/services/resume-scoring";

export const buildSummary = (scan: ScanResult): string => {
  const bandTone =
    scan.overall.band === "strong"
      ? "Strong signals"
      : scan.overall.band === "medium"
      ? "Solid foundation"
      : "Early signals";

  const confidenceNote =
    scan.overall.confidence >= 0.8
      ? "High confidence scan"
      : scan.overall.confidence >= 0.6
      ? "Moderate confidence scan"
      : "Limited confidence scan";

  return `${bandTone} with a ${confidenceNote.toLowerCase()} and clear areas to refine.`;
};

export const buildHighlights = (scan: ScanResult): string[] => {
  return scan.reasons
    .filter((reason) => reason.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((reason) => reason.detail);
};

export const buildImprovements = (scan: ScanResult): string[] => {
  const improvementReasons = scan.reasons
    .filter((reason) => reason.weight < 0)
    .sort((a, b) => a.weight - b.weight)
    .map((reason) => reason.detail);

  const warningImprovements = scan.warnings.map((warning) => warning.detail);

  return [...improvementReasons, ...warningImprovements].slice(0, 3);
};

// TODO: Make this actually funny lol
export const buildHumor = (score: number): string => {
  if (score >= 85) {
    return "Verdict: 5 out of 5 servo whirs. The bot is impressed.";
  }
  if (score >= 70) {
    return "Verdict: 4 out of 5 servo whirs. Solid circuitry detected.";
  }
  if (score >= 40) {
    return "Verdict: 3 out of 5 servo whirs. A few tuning bolts needed.";
  }
  return "Verdict: 2 out of 5 servo whirs. Needs a full recalibration.";
};
