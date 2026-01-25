import { describe, expect, it } from "vitest";

import { scoreResume } from "./scoring";

const SAMPLE_RESUME = `
Taylor Finch
Summary
Full-stack engineer focused on product delivery.
Experience
Software Engineer (2018-2024) Led delivery of a React + Node platform, improved performance by 35%.
Projects
Customer analytics dashboard built with React, TypeScript, Node, Postgres.
Skills
JavaScript, TypeScript, React, Node, SQL, Testing, CI/CD, AWS
Education
B.S. Computer Science
Contact
hello@finch.dev | Seattle, WA | github.com/tfinch | linkedin.com/in/tfinch
`;

const SHORT_RESUME = `
Taylor Finch
Skills
React, JavaScript
Contact
hello@finch.dev
`;

const FILLER_TEXT = "lorem ".repeat(220);

const MEDIUM_BOUNDARY_RESUME = `
Casey Lane
Experience
Worked on internal tools.
Projects
Created dashboards for teams.
Skills
React, Node
Contact
casey@lane.dev | github.com/lanecode
${FILLER_TEXT}
`;

const WEAK_BOUNDARY_RESUME = `
Casey Lane
Summary
Early career builder.
Skills
Figma, Photoshop
Experience
Internship (2024)
`;

const NO_EMAIL_RESUME = `
Casey Lane
Experience
Worked on internal tools.
Projects
Created dashboards.
Skills
React, Node
`;

const NO_PROJECTS_RESUME = `
Casey Lane
Experience
Worked on internal tools.
Skills
React, Node
Contact
casey@lane.dev
`;

const NO_CORE_SKILLS_RESUME = `
Casey Lane
Experience
Worked on internal tools.
Projects
Created dashboards.
Skills
Figma, Photoshop
Contact
casey@lane.dev
`;

const LONG_RESUME = `
Casey Lane
Skills
Figma
Contact
casey@lane.dev
${"word ".repeat(1301)}
`;

const CONFIDENCE_RESUME = `
Casey Lane
Experience
Software Engineer (2018-2024)
Projects
Created dashboards for teams.
Skills
React, Node
Contact
casey@lane.dev | github.com/lanecode
${FILLER_TEXT}
`;

const SHORT_CONFIDENCE_RESUME = `
Casey Lane
Experience
Software Engineer
Projects
Created dashboards for teams.
Skills
React, Node
Contact
casey@lane.dev
${"short ".repeat(20)}
`;

const IMPACT_RESUME = `
Casey Lane
Experience
Led delivery of a platform that improved performance by 50% and 3x throughput.
Projects
Built dashboards that designed new flows and delivered updates.
Skills
React, Node
Contact
casey@lane.dev
`;

describe("scoreResume", () => {
  it("scores a complete resume in the strong band", () => {
    const result = scoreResume({ resumeText: SAMPLE_RESUME });

    expect(result.overall.score).toBeGreaterThanOrEqual(70);
    expect(result.overall.band).toBe("strong");
    expect(result.signals.sectionsPresent).toEqual(
      expect.arrayContaining(["experience", "projects", "skills", "education"])
    );
    expect(result.signals.contact.email).toBe(true);
    expect(result.signals.links.github).toBe(true);
    expect(result.reasons.length).toBeGreaterThan(0);
  });

  it("applies penalties for very short resumes", () => {
    const result = scoreResume({ resumeText: SHORT_RESUME });

    expect(result.overall.score).toBeLessThan(70);
    expect(result.reasons.some((reason) => reason.code === "PENALTY_SHORT")).toBe(
      true
    );
    expect(result.warnings.some((warning) => warning.code === "NO_PHONE")).toBe(
      true
    );
  });

  it("returns low confidence when extraction is limited", () => {
    const result = scoreResume({ resumeText: "" });

    expect(result.overall.confidence).toBeLessThanOrEqual(0.6);
    expect(result.warnings.some((warning) => warning.code === "EMPTY_RESUME")).toBe(
      true
    );
  });

  it("adjusts scoring based on track skill matching", () => {
    const frontendResult = scoreResume({
      resumeText: "React CSS Accessibility Testing",
      track: "frontend",
    });
    const backendResult = scoreResume({
      resumeText: "SQL API Security CI/CD",
      track: "backend",
    });

    expect(frontendResult.reasons.some((reason) => reason.code === "SKILL_CORE_MATCH")).toBe(
      true
    );
    expect(backendResult.reasons.some((reason) => reason.code === "SKILL_CORE_MATCH")).toBe(
      true
    );
  });

  it("emits penalty reasons for missing core sections", () => {
    const noEmail = scoreResume({ resumeText: NO_EMAIL_RESUME });
    const noProjects = scoreResume({ resumeText: NO_PROJECTS_RESUME });
    const noCoreSkills = scoreResume({ resumeText: NO_CORE_SKILLS_RESUME });

    expect(noEmail.reasons.some((reason) => reason.code === "PENALTY_NO_EMAIL")).toBe(
      true
    );
    expect(
      noProjects.reasons.some((reason) => reason.code === "PENALTY_NO_PROJECTS")
    ).toBe(true);
    expect(
      noCoreSkills.reasons.some((reason) => reason.code === "PENALTY_NO_CORE_SKILLS")
    ).toBe(true);
  });

  it("applies long resume penalty", () => {
    const result = scoreResume({ resumeText: LONG_RESUME });

    expect(result.reasons.some((reason) => reason.code === "PENALTY_LONG")).toBe(
      true
    );
  });

  it("adds confidence when signals are strong", () => {
    const result = scoreResume({ resumeText: CONFIDENCE_RESUME });

    expect(result.overall.confidence).toBeGreaterThan(0.6);
  });

  it("reduces confidence for short resumes", () => {
    const result = scoreResume({ resumeText: SHORT_CONFIDENCE_RESUME });

    expect(result.overall.confidence).toBeLessThan(0.6);
  });

  it("adds impact and leadership reasons", () => {
    const result = scoreResume({ resumeText: IMPACT_RESUME });

    expect(result.reasons.some((reason) => reason.code === "IMPACT_METRICS")).toBe(
      true
    );
    expect(
      result.reasons.some((reason) => reason.code === "IMPACT_ACTION_VERBS")
    ).toBe(true);
    expect(result.reasons.some((reason) => reason.code === "IMPACT_SCALE")).toBe(true);
    expect(
      result.reasons.some((reason) => reason.code === "EXP_LEADERSHIP")
    ).toBe(true);
  });

  it("maps scores to the correct bands", () => {
    const mediumResult = scoreResume({ resumeText: MEDIUM_BOUNDARY_RESUME });
    const weakResult = scoreResume({ resumeText: WEAK_BOUNDARY_RESUME });

    expect(mediumResult.overall.band).toBe("medium");
    expect(weakResult.overall.band).toBe("weak");
  });
});
