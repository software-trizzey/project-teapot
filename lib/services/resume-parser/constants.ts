export const WORKER_PATH = "pdfjs-dist/build/pdf.worker.min.mjs";
export const PDFJS_VERSION = "5.4.296";

export const ALLOWED_EXTENSIONS = new Set(["pdf", "docx"]);

export const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const SECTION_HEADERS = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "contact",
] as const;
