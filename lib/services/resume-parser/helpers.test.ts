import { describe, expect, it } from "vitest";

import { getPrettyFileSize, validateResumeFile } from "./helpers";

describe("resume-parser helpers", () => {
  describe("getPrettyFileSize", () => {
    it("formats whole megabytes without decimals", () => {
      expect(getPrettyFileSize(5 * 1024 * 1024)).toBe("5MB");
      expect(getPrettyFileSize(10 * 1024 * 1024)).toBe("10MB");
    });

    it("formats fractional megabytes with 2 decimals", () => {
      expect(getPrettyFileSize(2.5 * 1024 * 1024)).toBe("2.50MB");
      expect(getPrettyFileSize(1.25 * 1024 * 1024)).toBe("1.25MB");
    });

    it("handles zero bytes", () => {
      expect(getPrettyFileSize(0)).toBe("0MB");
    });

    it("handles bytes less than 1MB", () => {
      expect(getPrettyFileSize(512 * 1024)).toBe("0.50MB");
      expect(getPrettyFileSize(100 * 1024)).toBe("0.10MB");
    });
  });

  describe("validateResumeFile", () => {
    it("returns null for valid PDF file", () => {
      const file = new File(["content"], "resume.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 2 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBeNull();
    });

    it("returns null for valid DOCX file", () => {
      const file = new File(["content"], "resume.docx", {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBeNull();
    });

    it("rejects files with unsupported extensions", () => {
      const file = new File(["content"], "resume.txt", {
        type: "text/plain",
      });
      Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBe("Only .pdf or .docx files are supported.");
    });

    it("rejects files with unsupported MIME types", () => {
      const file = new File(["content"], "resume.pdf", {
        type: "text/plain",
      });
      Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBe("Unsupported file type provided.");
    });

    it("rejects files exceeding maximum size", () => {
      const file = new File(["content"], "resume.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 6 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBe("File must be 5MB or smaller.");
    });

    it("accepts files at maximum size", () => {
      const file = new File(["content"], "resume.pdf", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBeNull();
    });

    it("handles case-insensitive file extensions", () => {
      const file = new File(["content"], "resume.PDF", {
        type: "application/pdf",
      });
      Object.defineProperty(file, "size", { value: 1 * 1024 * 1024 });

      expect(validateResumeFile(file)).toBeNull();
    });
  });
});
