# Developer Resume Scoring Service (v1)

## Purpose & Intent

This feature provides a **deterministic, explainable scoring system** for software developer resumes.
Its primary goal is **not hiring accuracy**, but to demonstrate the ability to design and implement a realistic, production-style analysis service with:

- Clear scope and constraints
- Structured, auditable outputs
- Separation of concerns between analysis and AI narration
- Graceful degradation when inputs are imperfect

The scoring system is designed to *feel real* while remaining lightweight, fast, and maintainable.

AI is **explicitly not responsible for scoring**. It is a secondary narrator layered on top of structured results.

---

## Non-Goals

This system intentionally does **not** attempt to:
- Fully parse or semantically understand resumes
- Perform candidate ranking across large datasets
- Replace real ATS or recruiter workflows
- Infer sensitive attributes or make hiring decisions

Accuracy beyond “plausible and explainable” is out of scope.

---

## High-Level Architecture

```
Resume Upload
     |
Text Extraction (best-effort)
     |
ResumeScoringService  (deterministic)
     |
Structured ScanResult
     |
ResumeNarrationService (AI, optional)
     |
UI / Scene State
```

### Service Boundaries

- **ResumeScoringService**
  - Pure, deterministic
  - No AI calls
  - Testable with fixtures
  - Produces structured signals, score, and reasons

- **ResumeNarrationService**
  - Consumes only structured data
  - Produces short, humorous summary
  - Safe to disable or replace

---

## Scoring Philosophy

- Start simple, explain everything
- Prefer false negatives over false positives
- Every score contribution must map to a human-readable reason
- Heuristics > inference
- Boring logic, polished presentation

Scores range from **0–100** and are mapped to qualitative bands.

---

## Scoring Bands

| Score Range | Band   |
|------------|--------|
| 0–39       | Weak   |
| 40–69      | Medium |
| 70–100     | Strong |

A separate `confidence` value indicates scan reliability, not candidate quality.

---

## Supported Resume Tracks (v1)

- Full-stack (default)
- Frontend
- Backend

Each track defines:
- Core skills (high weight)
- Bonus skills (low weight)

---

## Scoring Categories & Weights

### A. Formatting & Completeness (max 25)

- Experience section: +8
- Projects section: +8
- Skills section: +4
- Education section: +2
- Summary/Profile section: +3
- Email present: +2
- Location present: +1
- Phone present: +1

---

### B. Links & Proof of Work (max 20)

- GitHub: +8
- Portfolio / personal site: +6
- LinkedIn: +4
- Live project links: +2

---

### C. Skills Match (max 25)

- Core skill match: +3 each (cap 18)
- Bonus skill match: +1 each (cap 7)
- No core skills matched: −8 penalty

---

### D. Experience & Seniority Signal (max 15)

- 0–1 years: +2
- 1–3 years: +6
- 3–6 years: +10
- 6+ years: +12
- Leadership/ownership keywords: +3 (cap)

If years cannot be estimated, assign partial credit and reduce confidence.

---

### E. Impact Writing (max 15)

- Metrics mentions: +2 each (cap 8)
- Action verbs: +1 per 3 occurrences (cap 5)
- Performance/scale terms: +2

---

### F. Penalties (up to −20)

- <200 words: −10
- >1200 words: −5
- No projects AND no GitHub: −10
- No skills section: −6
- No email: −20

---

## Confidence Calculation (0–1)

Initial value: `0.6`

Adjustments:
- +0.1 if ≥3 sections detected
- +0.1 if years estimate found
- +0.1 if GitHub present
- −0.2 if word count < 200

Clamped to `[0.3, 0.95]`

---

## Data Model: ScanResult

```json
{
  "overall": {
    "score": 72,
    "band": "strong",
    "confidence": 0.78
  },
  "signals": {
    "word_count": 640,
    "sections_present": ["experience", "projects", "skills", "education"],
    "contact": {
      "email": true,
      "phone": false,
      "location": true
    },
    "links": {
      "github": true,
      "linkedin": true,
      "portfolio": false
    },
    "skills": {
      "matched": ["React", "TypeScript", "Django", "Postgres"],
      "missing_core": ["Testing", "CI/CD"],
      "count_matched": 4
    },
    "experience": {
      "years_estimate": 3.5,
      "seniority_guess": "mid"
    },
    "impact": {
      "metrics_mentions": 3,
      "action_verbs": 9,
      "impact_score": 0.7
    }
  },
  "reasons": [
    {
      "code": "SEC_PROJECTS_PRESENT",
      "weight": 8,
      "detail": "Projects section detected"
    },
    {
      "code": "LINK_GITHUB",
      "weight": 6,
      "detail": "GitHub profile found"
    }
  ],
  "warnings": [
    {
      "code": "NO_PHONE",
      "detail": "No phone number detected"
    }
  ],
  "version": "dev-resume-v1"
}
```

---

## Reasons & Auditability

Every scoring adjustment must emit a reason:

- `code`: stable identifier
- `weight`: numeric impact
- `detail`: human-readable explanation

This enables:
- Debug views
- Transparent UI explanations
- Safe AI narration grounded in facts

---

## Degradation Strategy

1. **Full parse success**
   - All heuristics active
   - High confidence

2. **Partial extraction**
   - Limited signals
   - Reduced confidence
   - Explicit warning surfaced

3. **Failure**
   - Resume accepted
   - Demo/sample applicant flow triggered
   - User experience preserved

The flow must never hard-fail.

---

## Versioning

The scoring system is versioned (`dev-resume-v1`) to allow:
- Backward compatibility
- UI consistency
- Safe iteration

---

## Summary

This feature is designed to showcase:
- Thoughtful scope control
- Service-oriented architecture
- Deterministic analysis
- Explainability
- Polished UX layered on boring, reliable logic

It is intentionally modest, realistic, and extensible.
