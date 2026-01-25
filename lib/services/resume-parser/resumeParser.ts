import mammoth from "mammoth";

import { PDFJS_VERSION, SECTION_HEADERS } from "./constants";
import type { ParsedResume, ParsedResumeSection, ResumeParseResult } from "./types";

const parsePdfResume = async (file: File): Promise<ResumeParseResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  
  // Use CDN for worker (Next.js doesn't support import.meta.url in client components)
  // This works for both client and server contexts
  GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let text = "";

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: unknown) => {
        const textItem = item as { str?: string };
        return textItem.str ?? "";
      })
      .join(" ");
    text += `${pageText}\n`;
  }

  await pdf.destroy();

  console.log("Parsed PDF text:", text);

  return { text: text.trim(), source: "pdf" };
};

const parseDocxResume = async (file: File): Promise<ResumeParseResult> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();
  console.log("Parsed DOCX text:", text);
  return { text, source: "docx" };
};

export const parseResumeFile = async (file: File): Promise<ResumeParseResult> => {
  if (file.name.toLowerCase().endsWith(".pdf")) {
    return parsePdfResume(file);
  }

  return parseDocxResume(file);
};

export const parseResumeText = (resumeText: string): ParsedResume => {
  if (!resumeText || resumeText.trim().length === 0) {
    return { sections: [] };
  }

  const lines = resumeText.split("\n").map((line) => line.trim()).filter(Boolean);
  const sections: ParsedResumeSection[] = [];
  let currentSection: ParsedResumeSection | null = null;
  let name: string | undefined;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();

    if (i === 0 && !SECTION_HEADERS.some((header) => lowerLine.includes(header))) {
      name = line;
      continue;
    }

    const matchingHeader = SECTION_HEADERS.find((header) => lowerLine === header);

    if (matchingHeader) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        header: matchingHeader.charAt(0).toUpperCase() + matchingHeader.slice(1),
        content: "",
      };
    } else if (currentSection) {
      if (currentSection.content) {
        currentSection.content += "\n";
      }
      currentSection.content += line;
    } else {
      if (!name) {
        name = line;
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  return { name, sections };
};
