import { describe, expect, it } from "vitest";

import {
  buildHighlights,
  buildHumor,
  buildImprovements,
  buildSummary,
} from "./helpers";

const SAMPLE_SCAN = {
  overall: {
    score: 82,
    band: "strong" as const,
    confidence: 0.82,
  },
  signals: {
    wordCount: 420,
    sectionsPresent: ["experience" as const],
    contact: {
      email: true,
      phone: false,
      location: false,
    },
    links: {
      github: true,
      linkedin: false,
      portfolio: false,
      liveProject: false,
    },
    skills: {
      matched: [],
      missingCore: [],
      countMatched: 0,
    },
    experience: {
      yearsEstimate: 3,
      seniorityGuess: "mid" as const,
    },
    impact: {
      metricsMentions: 0,
      actionVerbs: 0,
      impactScore: 0,
    },
  },
  reasons: [
    { code: "POSITIVE_1", weight: 8, detail: "Primary strength" },
    { code: "POSITIVE_2", weight: 5, detail: "Secondary strength" },
    { code: "NEGATIVE_1", weight: -6, detail: "Missing details" },
    { code: "POSITIVE_3", weight: 2, detail: "Bonus" },
  ],
  warnings: [{ code: "WARNING_1", detail: "No phone" }],
  version: "dev-resume-v1" as const,
  track: "full-stack" as const,
};

describe("review-service helpers", () => {
  it("buildSummary uses band and confidence", () => {
    expect(buildSummary(SAMPLE_SCAN)).toBe(
      "Strong signals with a high confidence scan and clear areas to refine."
    );
  });

  it("buildHighlights returns top weighted positives", () => {
    expect(buildHighlights(SAMPLE_SCAN)).toEqual([
      "Primary strength",
      "Secondary strength",
      "Bonus",
    ]);
  });

  it("buildImprovements combines negatives and warnings", () => {
    expect(buildImprovements(SAMPLE_SCAN)).toEqual(["Missing details", "No phone"]);
  });

  it("buildHumor selects the right band", () => {
    expect(buildHumor(90)).toMatch(/5 out of 5/);
    expect(buildHumor(72)).toMatch(/4 out of 5/);
    expect(buildHumor(55)).toMatch(/3 out of 5/);
    expect(buildHumor(20)).toMatch(/2 out of 5/);
  });
});
