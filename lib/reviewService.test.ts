import { describe, expect, it } from "vitest";

import { createResumeReviewService } from "./reviewService";

const SAMPLE_RESUME = `
Taylor Finch
Summary
Full-stack engineer focused on delivery.
Experience
Software Engineer (2018-2024) Led delivery of a React + Node platform, improved performance by 35%.
Projects
Customer analytics dashboard built with React, TypeScript, Node, Postgres.
Skills
JavaScript, TypeScript, React, Node, SQL, Testing, CI/CD, AWS
Education
B.S. Computer Science
Contact
hello@finch.dev | Seattle, WA | github.com/tfinch
`;

const SHORT_RESUME = `
Taylor Finch
Skills
React, JavaScript
Contact
hello@finch.dev
`;

const EMPTY_TEXT_RESUME = "";

const UNKNOWN_SOURCE_RESUME = `
Taylor Finch
Summary
Early signals only.
`;

describe("createResumeReviewService", () => {
  it("returns structured review output for uploaded resumes", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: SAMPLE_RESUME,
    });

    expect(result.score).toBeGreaterThan(0);
    expect(result.summary).toMatch(/confidence scan/);
    expect(result.highlights.length).toBeGreaterThan(0);
    expect(result.highlights.length).toBeLessThanOrEqual(3);
    expect(result.improvements.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeLessThanOrEqual(3);
    expect(result.humor).toMatch(/^Verdict:/);
  });

  it("falls back to sample resume text when no text is provided", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "sample-frontend", label: "Sample resume" },
    });

    expect(result.score).toBeGreaterThan(0);
    expect(result.highlights.length).toBeGreaterThan(0);
  });

  it("handles empty resume text without crashing", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "sample-backend", label: "Sample resume" },
      resumeText: EMPTY_TEXT_RESUME,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.summary).toMatch(/signals/);
  });

  it("handles unknown sample ids with safe defaults", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "unknown", label: "Unknown sample" },
      resumeText: UNKNOWN_SOURCE_RESUME,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.highlights.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it("provides improvement guidance for sparse resumes", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: SHORT_RESUME,
    });

    expect(result.score).toBeLessThan(70);
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it("returns highlights even for sparse resumes", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: "No contact details provided.",
    });

    expect(result.highlights.length).toBeGreaterThan(0);
  });

  it("falls back to default improvement copy when no negatives", async () => {
    const service = createResumeReviewService();

    const result = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: SAMPLE_RESUME,
    });

    expect(result.improvements.length).toBeGreaterThan(0);
    expect(result.improvements.length).toBeLessThanOrEqual(3);
  });

  it("maps humor copy based on score bands", async () => {
    const service = createResumeReviewService();

    const strong = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: SAMPLE_RESUME,
    });

    const weak = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: "No email or skills listed.",
    });

    expect(strong.humor).toMatch(/4 out of 5|5 out of 5/);
    expect(weak.humor).toMatch(/2 out of 5/);
  });

  it("reflects band language in the summary", async () => {
    const service = createResumeReviewService();

    const strong = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: SAMPLE_RESUME,
    });

    const weak = await service.reviewResume({
      source: { id: "upload", label: "Uploaded resume" },
      resumeText: "No email or skills listed.",
    });

    expect(strong.summary).toMatch(/Strong signals|Solid foundation/);
    expect(weak.summary).toMatch(/Early signals/);
  });
});
