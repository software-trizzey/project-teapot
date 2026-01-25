import {
  DEFAULT_TRACK,
  SECTION_MATCHERS,
  TRACK_SKILLS,
} from "./constants";
import type {
  ResumeScoringInput,
  ResumeSection,
  ScanReason,
  ScanSignals,
  ScanWarning,
} from "./types";

export const countMatches = (text: string, matcher: RegExp): number => {
  const matches = text.match(matcher);
  return matches ? matches.length : 0;
};

export const detectSections = (text: string): ResumeSection[] => {
  const sections = Object.entries(SECTION_MATCHERS)
    .filter(([, matchers]) => matchers.some((matcher) => matcher.test(text)))
    .map(([section]) => section as ResumeSection);

  return sections.length > 0 ? sections : [];
};

export const estimateYears = (text: string): number | null => {
  const yearMatches = Array.from(text.matchAll(/\b(19\d{2}|20\d{2})\b/g)).map(
    (match) => Number(match[1])
  );
  if (yearMatches.length < 2) return null;
  const minYear = Math.min(...yearMatches);
  const maxYear = Math.max(...yearMatches);
  if (Number.isNaN(minYear) || Number.isNaN(maxYear)) return null;
  const span = maxYear - minYear;
  if (span <= 0 || span > 45) return null;
  return span;
};

export const determineSeniority = (
  years: number | null
): ScanSignals["experience"]["seniorityGuess"] => {
  if (!years) return "unknown";
  if (years < 1) return "junior";
  if (years < 3) return "junior";
  if (years < 6) return "mid";
  return "senior";
};

export const extractSkills = (
  text: string,
  track: ResumeScoringInput["track"]
) => {
  const skillBank = TRACK_SKILLS[track ?? DEFAULT_TRACK];
  const normalized = text.toLowerCase();

  const matchedCore = skillBank.core.filter((skill) =>
    normalized.includes(skill.toLowerCase())
  );
  const matchedBonus = skillBank.bonus.filter((skill) =>
    normalized.includes(skill.toLowerCase())
  );
  const matched = [...matchedCore, ...matchedBonus];
  const missingCore = skillBank.core.filter(
    (skill) => !matchedCore.includes(skill)
  );

  return {
    matched,
    missingCore,
    matchedCoreCount: matchedCore.length,
    matchedBonusCount: matchedBonus.length,
  };
};

export const buildReasons = (reasons: ScanReason[], warnings: ScanWarning[]) => ({
  addReason: (code: string, weight: number, detail: string) => {
    reasons.push({ code, weight, detail });
  },
  addWarning: (code: string, detail: string) => {
    warnings.push({ code, detail });
  },
});
