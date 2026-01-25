import {
  ACTION_VERBS,
  CONTACT_PATTERNS,
  DEFAULT_TRACK,
  LEADERSHIP_KEYWORDS,
  LINK_PATTERNS,
  METRICS_PATTERN,
  SCALE_TERMS,
  SCORE_BANDS,
  VERSION,
} from "./constants";
import { clamp } from "@/lib/utils";
import {
  buildReasons,
  countMatches,
  detectSections,
  determineSeniority,
  estimateYears,
  extractSkills,
} from "./helpers";
import type {
  ResumeScoringInput,
  ScanReason,
  ScanResult,
  ScanWarning,
} from "./types";

export const scoreResume = (input: ResumeScoringInput): ScanResult => {
  const track = input.track ?? DEFAULT_TRACK;
  const resumeText = input.resumeText ?? "";
  const normalizedText = resumeText.replace(/\s+/g, " ").trim();
  const wordCount = normalizedText ? normalizedText.split(" ").length : 0;

  const reasons: ScanReason[] = [];
  const warnings: ScanWarning[] = [];
  const { addReason, addWarning } = buildReasons(reasons, warnings);

  const sectionsPresent = detectSections(resumeText);
  const contact = {
    email: CONTACT_PATTERNS.email.test(resumeText),
    phone: CONTACT_PATTERNS.phone.test(resumeText),
    location: CONTACT_PATTERNS.location.test(resumeText),
  };
  const links = {
    github: LINK_PATTERNS.github.test(resumeText),
    linkedin: LINK_PATTERNS.linkedin.test(resumeText),
    portfolio: LINK_PATTERNS.portfolio.test(resumeText),
    liveProject: LINK_PATTERNS.liveProject.test(resumeText),
  };

  const yearsEstimate = estimateYears(resumeText);
  const seniorityGuess = determineSeniority(yearsEstimate);
  const metricsMentions = countMatches(resumeText, METRICS_PATTERN);
  const actionVerbCount = ACTION_VERBS.reduce(
    (count, verb) =>
      count +
      countMatches(resumeText.toLowerCase(), new RegExp(`\\b${verb}\\b`, "g")),
    0
  );
  const leadershipMentions = LEADERSHIP_KEYWORDS.reduce(
    (count, term) =>
      count +
      countMatches(resumeText.toLowerCase(), new RegExp(`\\b${term}\\b`, "g")),
    0
  );
  const scaleMentioned = SCALE_TERMS.some((term) =>
    resumeText.toLowerCase().includes(term)
  );

  const { matched, missingCore, matchedCoreCount, matchedBonusCount } =
    extractSkills(resumeText, track);

  let score = 0;

  if (sectionsPresent.includes("experience")) {
    score += 8;
    addReason("SEC_EXPERIENCE_PRESENT", 8, "Experience section detected");
  }
  if (sectionsPresent.includes("projects")) {
    score += 8;
    addReason("SEC_PROJECTS_PRESENT", 8, "Projects section detected");
  }
  if (sectionsPresent.includes("skills")) {
    score += 4;
    addReason("SEC_SKILLS_PRESENT", 4, "Skills section detected");
  } else {
    score -= 6;
    addReason("PENALTY_NO_SKILLS", -6, "No skills section detected");
  }
  if (sectionsPresent.includes("education")) {
    score += 2;
    addReason("SEC_EDUCATION_PRESENT", 2, "Education section detected");
  }
  if (sectionsPresent.includes("summary")) {
    score += 3;
    addReason("SEC_SUMMARY_PRESENT", 3, "Summary/profile section detected");
  }

  if (contact.email) {
    score += 2;
    addReason("CONTACT_EMAIL", 2, "Email address detected");
  } else {
    score -= 20;
    addReason("PENALTY_NO_EMAIL", -20, "No email address detected");
  }
  if (contact.location) {
    score += 1;
    addReason("CONTACT_LOCATION", 1, "Location detected");
  } else {
    addWarning("NO_LOCATION", "No location detected");
  }
  if (contact.phone) {
    score += 1;
    addReason("CONTACT_PHONE", 1, "Phone number detected");
  } else {
    addWarning("NO_PHONE", "No phone number detected");
  }

  if (links.github) {
    score += 8;
    addReason("LINK_GITHUB", 8, "GitHub profile found");
  }
  if (links.portfolio) {
    score += 6;
    addReason("LINK_PORTFOLIO", 6, "Portfolio link found");
  }
  if (links.linkedin) {
    score += 4;
    addReason("LINK_LINKEDIN", 4, "LinkedIn profile found");
  }
  if (links.liveProject) {
    score += 2;
    addReason("LINK_LIVE_PROJECT", 2, "Live project link found");
  }

  const coreSkillPoints = Math.min(matchedCoreCount * 3, 18);
  if (coreSkillPoints > 0) {
    score += coreSkillPoints;
    addReason(
      "SKILL_CORE_MATCH",
      coreSkillPoints,
      `${matchedCoreCount} core skills matched`
    );
  } else {
    score -= 8;
    addReason("PENALTY_NO_CORE_SKILLS", -8, "No core skills detected");
  }

  const bonusSkillPoints = Math.min(matchedBonusCount, 7);
  if (bonusSkillPoints > 0) {
    score += bonusSkillPoints;
    addReason(
      "SKILL_BONUS_MATCH",
      bonusSkillPoints,
      `${matchedBonusCount} bonus skills matched`
    );
  }

  if (yearsEstimate !== null) {
    if (yearsEstimate < 1) {
      score += 2;
      addReason("EXP_YEARS_0_1", 2, "Estimated 0–1 years experience");
    } else if (yearsEstimate < 3) {
      score += 6;
      addReason("EXP_YEARS_1_3", 6, "Estimated 1–3 years experience");
    } else if (yearsEstimate < 6) {
      score += 10;
      addReason("EXP_YEARS_3_6", 10, "Estimated 3–6 years experience");
    } else {
      score += 12;
      addReason("EXP_YEARS_6_PLUS", 12, "Estimated 6+ years experience");
    }
  } else {
    score += 4;
    addReason("EXP_UNKNOWN", 4, "Experience timeframe unclear");
    addWarning("EXP_UNCERTAIN", "Could not estimate years of experience");
  }

  if (leadershipMentions > 0) {
    score += 3;
    addReason(
      "EXP_LEADERSHIP",
      3,
      "Leadership or ownership keywords detected"
    );
  }

  if (metricsMentions > 0) {
    const metricPoints = Math.min(metricsMentions * 2, 8);
    score += metricPoints;
    addReason("IMPACT_METRICS", metricPoints, "Metrics and KPIs referenced");
  }

  if (actionVerbCount > 0) {
    const verbPoints = Math.min(Math.floor(actionVerbCount / 3), 5);
    if (verbPoints > 0) {
      score += verbPoints;
      addReason("IMPACT_ACTION_VERBS", verbPoints, "Strong action verbs used");
    }
  }

  if (scaleMentioned) {
    score += 2;
    addReason("IMPACT_SCALE", 2, "Performance or scale mentioned");
  }

  if (wordCount < 200) {
    score -= 10;
    addReason("PENALTY_SHORT", -10, "Resume is under 200 words");
  }
  if (wordCount > 1200) {
    score -= 5;
    addReason("PENALTY_LONG", -5, "Resume exceeds 1200 words");
  }
  if (!sectionsPresent.includes("projects") && !links.github) {
    score -= 10;
    addReason(
      "PENALTY_NO_PROJECTS",
      -10,
      "No projects section or GitHub detected"
    );
  }

  const rawScore = clamp(score, 0, 100);
  const band = SCORE_BANDS.find((entry) => rawScore >= entry.min)?.band ?? "weak";

  let confidence = 0.6;
  if (sectionsPresent.length >= 3) confidence += 0.1;
  if (yearsEstimate !== null) confidence += 0.1;
  if (links.github) confidence += 0.1;
  if (wordCount < 200) confidence -= 0.2;
  confidence = clamp(confidence, 0.3, 0.95);

  const impactScore = clamp(
    metricsMentions / 5 + actionVerbCount / 20 + (scaleMentioned ? 0.2 : 0),
    0,
    1
  );

  if (!normalizedText) {
    addWarning("EMPTY_RESUME", "No readable text detected");
  }

  return {
    overall: {
      score: rawScore,
      band,
      confidence,
    },
    signals: {
      wordCount,
      sectionsPresent,
      contact,
      links,
      skills: {
        matched,
        missingCore,
        countMatched: matched.length,
      },
      experience: {
        yearsEstimate,
        seniorityGuess,
      },
      impact: {
        metricsMentions,
        actionVerbs: actionVerbCount,
        impactScore,
      },
    },
    reasons,
    warnings,
    version: VERSION,
    track,
  };
};
