import type { DialogStateId } from "@/lib";

export type SampleResume = {
  id: string;
  name: string;
  summary: string;
  iconSrc: string;
};

export type ResumeSourceOption = {
  id: string;
  name: string;
  summary: string;
  iconSrc?: string;
  kind: "upload" | "sample";
};

export const UPLOAD_RESUME_OPTION_ID = "upload-resume";

export const SAMPLE_RESUMES: SampleResume[] = [
  {
    id: "sample-frontend",
    name: "Frontend Builder",
    summary: "UI polish with strong React fundamentals.",
    iconSrc: "/assets/icons/sample-frontend.svg",
  },
  {
    id: "sample-backend",
    name: "Backend Systems",
    summary: "API-first builder with queues, data, and observability.",
    iconSrc: "/assets/icons/sample-backend.svg",
  },
  {
    id: "sample-fullstack",
    name: "Full-stack Generalist",
    summary: "End-to-end delivery with balanced impact.",
    iconSrc: "/assets/icons/sample-fullstack.svg",
  },
  {
    id: "sample-newgrad",
    name: "New Grad",
    summary: "Strong projects, lighter experience timeline.",
    iconSrc: "/assets/icons/sample-newgrad.svg",
  },
  {
    id: "sample-chaos",
    name: "Chaos Resume",
    summary: "Buzzwords, missing sections, and minimal proof.",
    iconSrc: "/assets/icons/sample-chaos.svg",
  },
];

export const RESUME_SOURCE_OPTIONS: ResumeSourceOption[] = [
  {
    id: UPLOAD_RESUME_OPTION_ID,
    name: "Upload My Resume",
    summary: "Use your own file for a personalized review.",
    iconSrc: "/assets/icons/upload-resume.svg",
    kind: "upload",
  },
  ...SAMPLE_RESUMES.map((sample) => ({ ...sample, kind: "sample" as const })),
];

export const CTA_LABELS: Partial<Record<DialogStateId, string>> = {
  "upload-ready": "Upload ready",
  "sample-list": "Choose a resume",
};

export const CHAOS_SAMPLE_ID = "sample-chaos";
export const CHAOS_SAMPLE_ERROR =
  "Hmm... looks like the scanner couldn't handle that many buzzwords. Maybe try a different resume?";
