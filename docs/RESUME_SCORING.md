# Resume Scoring (v1)

Source of truth: `lib/services/resume-scoring/scoring.ts`

This document captures the current deterministic scoring logic used by the resume scanner.

## What It Returns

- `score` clamped to `0..100`
- `band`:
  - `0-39`: `weak`
  - `40-69`: `medium`
  - `70-100`: `strong`
- `confidence` clamped to `0.3..0.95`
- structured `reasons`, `warnings`, and raw `signals`

## Scoring Heuristics

### Section detection

- Experience section: `+8`
- Projects section: `+8`
- Skills section: `+4` (or `-6` if missing)
- Education section: `+2`
- Summary/profile section: `+3`

### Contact information

- Email detected: `+2` (or `-20` if missing)
- Location detected: `+1` (warning only if missing)
- Phone detected: `+1` (warning only if missing)

### Links and online presence

- GitHub: `+8`
- Portfolio/personal site: `+6`
- LinkedIn: `+4`
- Live project link: `+2`

### Skill matching (track-specific)

- Core skills: `+3` each (max `+18`)
- If zero core skills matched: `-8`
- Bonus skills: `+1` each (max `+7`)

### Experience estimate

- `0-1` years: `+2`
- `1-3` years: `+6`
- `3-6` years: `+10`
- `6+` years: `+12`
- Unknown/unclear: `+4` and warning

### Impact signals

- Leadership/ownership keywords present: `+3`
- Metrics/KPI mentions: `+2` each (max `+8`)
- Action verbs: `+1` per 3 mentions (max `+5`)
- Performance/scale terms present: `+2`

### Penalties

- Under 200 words: `-10`
- Over 1200 words: `-5`
- No projects section and no GitHub: `-10`

## Confidence Formula

- Base: `0.6`
- `+0.1` if at least 3 sections detected
- `+0.1` if years are estimable
- `+0.1` if GitHub is present
- `-0.2` if under 200 words

## Notes

- Missing location/phone creates warnings but no score penalty.
- `impactScore` is also computed (`0..1`) and returned as a signal, but it does not directly change the overall score.
- Scoring is deterministic; AI narration is separate from scoring.
