import type { ResumeSection, ResumeTrack, ScoreBand } from "./types";

export const VERSION = "dev-resume-v1" as const;
export const DEFAULT_TRACK: ResumeTrack = "full-stack";

export const SECTION_MATCHERS: Record<ResumeSection, RegExp[]> = {
  experience: [/\bexperience\b/i, /\bwork history\b/i, /\bemployment\b/i],
  projects: [/\bprojects?\b/i, /\bportfolio\b/i, /\bcase studies?\b/i],
  skills: [/\bskills?\b/i, /\btechnologies\b/i, /\btoolbox\b/i],
  education: [/\beducation\b/i, /\bdegree\b/i, /\buniversity\b/i],
  summary: [/\bsummary\b/i, /\bprofile\b/i, /\babout\b/i],
};

export const CONTACT_PATTERNS = {
  email: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  phone: /\b(\+?\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}\b/,
  location: /\b([A-Z][a-z]+,\s?[A-Z]{2}|Remote|Hybrid|On-site|Onsite)\b/,
};

export const LINK_PATTERNS = {
  github: /github\.com\/\w+/i,
  linkedin: /linkedin\.com\/in\/[\w-]+/i,
  portfolio: /(portfolio|\.dev|\.design|\.me|\.io)\b/i,
  liveProject: /(https?:\/\/[^\s]+|www\.[^\s]+)\b/i,
};

export const METRICS_PATTERN =
  /\b\d+(?:\.\d+)?%|\b\d{1,3}(?:,\d{3})+|\b\d+x\b/gi;

export const ACTION_VERBS = [
  "built",
  "designed",
  "led",
  "owned",
  "launched",
  "implemented",
  "optimized",
  "improved",
  "reduced",
  "scaled",
  "delivered",
  "architected",
  "developed",
  "shipped",
  "collaborated",
];

export const LEADERSHIP_KEYWORDS = [
  "led",
  "managed",
  "mentored",
  "owner",
  "owned",
  "strategy",
  "initiative",
  "principal",
  "head",
];

export const SCALE_TERMS = [
  "scale",
  "performance",
  "latency",
  "throughput",
  "availability",
  "uptime",
  "reliability",
];

export const TRACK_SKILLS: Record<
  ResumeTrack,
  { core: string[]; bonus: string[] }
> = {
  "full-stack": {
    core: [
      "JavaScript",
      "TypeScript",
      "React",
      "Node",
      "API",
      "SQL",
      "Testing",
      "CI/CD",
    ],
    bonus: [
      "Next.js",
      "Postgres",
      "GraphQL",
      "AWS",
      "Docker",
      "Redis",
      "Tailwind",
    ],
  },
  frontend: {
    core: [
      "JavaScript",
      "TypeScript",
      "React",
      "CSS",
      "Accessibility",
      "Testing",
    ],
    bonus: ["Next.js", "Tailwind", "Animations", "Design Systems"],
  },
  backend: {
    core: [
      "Node",
      "SQL",
      "API",
      "Testing",
      "CI/CD",
      "Security",
    ],
    bonus: ["Postgres", "Redis", "Docker", "AWS", "Queues"],
  },
};

export const SCORE_BANDS: { min: number; band: ScoreBand }[] = [
  { min: 70, band: "strong" },
  { min: 40, band: "medium" },
  { min: 0, band: "weak" },
];
