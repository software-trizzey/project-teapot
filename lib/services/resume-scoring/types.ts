export type ResumeTrack = "full-stack" | "frontend" | "backend";

export type ScoreBand = "weak" | "medium" | "strong";

export type ResumeSection =
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "summary";

export type ScanReason = {
  code: string;
  weight: number;
  detail: string;
};

export type ScanWarning = {
  code: string;
  detail: string;
};

export type ScanSignals = {
  wordCount: number;
  sectionsPresent: ResumeSection[];
  contact: {
    email: boolean;
    phone: boolean;
    location: boolean;
  };
  links: {
    github: boolean;
    linkedin: boolean;
    portfolio: boolean;
    liveProject: boolean;
  };
  skills: {
    matched: string[];
    missingCore: string[];
    countMatched: number;
  };
  experience: {
    yearsEstimate: number | null;
    seniorityGuess: "junior" | "mid" | "senior" | "unknown";
  };
  impact: {
    metricsMentions: number;
    actionVerbs: number;
    impactScore: number;
  };
};

export type ScanResult = {
  overall: {
    score: number;
    band: ScoreBand;
    confidence: number;
  };
  signals: ScanSignals;
  reasons: ScanReason[];
  warnings: ScanWarning[];
  version: "dev-resume-v1";
  track: ResumeTrack;
};

export type ResumeScoringInput = {
  resumeText: string;
  track?: ResumeTrack;
};
