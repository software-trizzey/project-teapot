import { describe, expect, it } from "vitest";

import { parseResumeText } from "./resumeParser";

describe("resume-parser", () => {
  describe("parseResumeText", () => {
    it("parses a complete resume with all sections", () => {
      const resumeText =
        "John Doe\nSummary\nExperienced developer.\nExperience\nSoftware Engineer (2020-2024)\nProjects\nProject A\nSkills\nJavaScript, TypeScript\nEducation\nB.S. Computer Science\nContact\njohn@example.com";

      const result = parseResumeText(resumeText);

      expect(result.name).toBe("John Doe");
      expect(result.sections).toHaveLength(6);
      expect(result.sections[0].header).toBe("Summary");
      expect(result.sections[0].content).toBe("Experienced developer.");
      expect(result.sections[1].header).toBe("Experience");
      expect(result.sections[1].content).toBe("Software Engineer (2020-2024)");
      expect(result.sections[2].header).toBe("Projects");
      expect(result.sections[2].content).toBe("Project A");
      expect(result.sections[3].header).toBe("Skills");
      expect(result.sections[3].content).toBe("JavaScript, TypeScript");
      expect(result.sections[4].header).toBe("Education");
      expect(result.sections[4].content).toBe("B.S. Computer Science");
      expect(result.sections[5].header).toBe("Contact");
      expect(result.sections[5].content).toBe("john@example.com");
    });

    it("handles resume with missing sections", () => {
      const resumeText = "Jane Smith\nSummary\nFrontend developer.\nSkills\nReact, Vue";

      const result = parseResumeText(resumeText);

      expect(result.name).toBe("Jane Smith");
      expect(result.sections).toHaveLength(2);
      expect(result.sections[0].header).toBe("Summary");
      expect(result.sections[1].header).toBe("Skills");
    });

    it("handles empty or whitespace-only text", () => {
      expect(parseResumeText("")).toEqual({ sections: [] });
      expect(parseResumeText("   \n\n  ")).toEqual({ sections: [] });
    });

    it("handles resume without name", () => {
      const resumeText = "Summary\nExperienced developer.\nSkills\nJavaScript";

      const result = parseResumeText(resumeText);

      expect(result.name).toBeUndefined();
      expect(result.sections).toHaveLength(2);
    });

    it("preserves multi-line content within sections", () => {
      const resumeText =
        "John Doe\nExperience\nSoftware Engineer (2020-2024)\nWorked on multiple projects.\nLed a team of 5 developers.";

      const result = parseResumeText(resumeText);

      expect(result.sections[0].content).toBe(
        "Software Engineer (2020-2024)\nWorked on multiple projects.\nLed a team of 5 developers."
      );
    });

    it("handles case-insensitive section headers", () => {
      const resumeText = "John Doe\nSUMMARY\nExperienced developer.\nSKILLS\nJavaScript";

      const result = parseResumeText(resumeText);

      expect(result.sections[0].header).toBe("Summary");
      expect(result.sections[1].header).toBe("Skills");
    });
  });
});
