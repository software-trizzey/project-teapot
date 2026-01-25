import { describe, expect, it } from "vitest";

import { clamp } from "@/lib/helpers";

import {
  buildReasons,
  countMatches,
  detectSections,
  determineSeniority,
  estimateYears,
  extractSkills,
} from "./helpers";

const SAMPLE_TEXT = `
Summary
Engineer
Experience
Software Engineer (2019-2024)
Projects
Skills
JavaScript, TypeScript, React, Node, SQL, Testing, CI/CD, Docker
Education
`;

describe("helpers", () => {
  it("clamp keeps values within bounds", () => {
    expect(clamp(10, 0, 5)).toBe(5);
    expect(clamp(-1, 0, 5)).toBe(0);
    expect(clamp(3, 0, 5)).toBe(3);
  });

  it("countMatches returns match counts", () => {
    expect(countMatches("value 10% and 20%", /%/g)).toBe(2);
    expect(countMatches("value 10% and 20%", /%/)).toBe(1);
    expect(countMatches("no matches", /%/g)).toBe(0);
  });

  it("detectSections finds common section headers", () => {
    const sections = detectSections(SAMPLE_TEXT);
    expect(sections).toEqual(
      expect.arrayContaining(["experience", "projects", "skills", "education"])
    );
    expect(detectSections("no headers here")).toEqual([]);
    expect(
      detectSections("Profile\nWork History\nEmployment Overview")
    ).toEqual(expect.arrayContaining(["summary", "experience"]));
  });

  it("estimateYears returns a valid span", () => {
    expect(estimateYears("2018 2024")).toBe(6);
    expect(estimateYears("2024")).toBeNull();
    expect(estimateYears("2024 2024")).toBeNull();
    expect(estimateYears("1970 2024")).toBeNull();
  });

  it("determineSeniority maps year ranges", () => {
    expect(determineSeniority(null)).toBe("unknown");
    expect(determineSeniority(0.5)).toBe("junior");
    expect(determineSeniority(1)).toBe("junior");
    expect(determineSeniority(3)).toBe("mid");
    expect(determineSeniority(6)).toBe("senior");
  });

  it("extractSkills returns matched and missing skills", () => {
    const result = extractSkills(
      "React, TypeScript, Node, SQL, Testing, CI/CD",
      "full-stack"
    );

    expect(result.matched).toEqual(
      expect.arrayContaining(["React", "TypeScript", "Node", "SQL"])
    );
    expect(result.missingCore).toEqual(
      expect.arrayContaining(["JavaScript", "API"])
    );
    expect(result.matchedCoreCount).toBeGreaterThan(0);

    const bonusResult = extractSkills("react next.js", "full-stack");
    expect(bonusResult.matched).toEqual(
      expect.arrayContaining(["React", "Next.js"])
    );
    expect(bonusResult.matchedBonusCount).toBeGreaterThan(0);
  });

  it("buildReasons appends reasons and warnings", () => {
    const reasons: { code: string; weight: number; detail: string }[] = [];
    const warnings: { code: string; detail: string }[] = [];

    const { addReason, addWarning } = buildReasons(reasons, warnings);
    addReason("TEST_REASON", 5, "Reason added");
    addWarning("TEST_WARNING", "Warning added");

    expect(reasons).toEqual([
      {
        code: "TEST_REASON",
        weight: 5,
        detail: "Reason added",
      },
    ]);
    expect(warnings).toEqual([
      {
        code: "TEST_WARNING",
        detail: "Warning added",
      },
    ]);
  });
});
