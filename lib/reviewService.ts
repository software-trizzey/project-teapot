import { scoreResume } from "@/lib/services/resume-scoring";

import { SAMPLE_RESUME_TEXT } from "@/lib/review-service/constants";
import {
  buildHighlights,
  buildHumor,
  buildImprovements,
  buildSummary,
} from "@/lib/review-service/helpers";

export type ReviewSource = {
  id: string
  label: string
}

export type ReviewRequest = {
  source: ReviewSource
  resumeText?: string
}

export type ReviewResult = {
  score: number
  summary: string
  highlights: string[]
  improvements: string[]
  humor: string
}

export type ReviewService = {
  reviewResume: (request: ReviewRequest) => Promise<ReviewResult>
}



export const createResumeReviewService = (): ReviewService => {
  return {
    reviewResume: async (request) => {
      const fallbackText = SAMPLE_RESUME_TEXT[request.source.id] ?? ""
      const resumeText = request.resumeText ?? fallbackText
      const scan = scoreResume({ resumeText })
      const highlights = buildHighlights(scan)
      const improvements = buildImprovements(scan)

      return {
        score: scan.overall.score,
        summary: buildSummary(scan),
        highlights:
          highlights.length > 0
            ? highlights
            : ["Resume structure detected; add more detail to strengthen signals."],
        improvements:
          improvements.length > 0
            ? improvements
            : ["Add more measurable outcomes to increase impact."],
        humor: buildHumor(scan.overall.score),
      }
    },
  }
}
