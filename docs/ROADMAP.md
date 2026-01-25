# Roadmap

Robo-Resume is an interactive, scene-based web experience that simulates a futuristic HR robot reviewing a user’s resume in a playful, sci-fi setting. Instead of a traditional form-driven UI, the project uses a fixed visual scene with authored animations, subtle interactions, and state-driven dialogs to guide the user through uploading a resume, watching it scan, and receiving AI-generated feedback. The goal is to demonstrate strong front-end engineering judgment by combining animation orchestration, UI state management, and LLM integration while delivering a memorable, character-driven portfolio piece that feels intentional, polished, and technically sound.

Phase 0 — Foundation (1–2 sessions)
Goal: Get a static scene on screen with a clean mental model.
* Create Next.js app (App Router)
* Install shadcn/ui + Tailwind
* Set up basic layout shell
    * Full-viewport scene container
    * Mobile-safe scaling (use aspect-ratio)
* Add static background image
* Add placeholder HUD (music toggle, status icon)
* Commit early (this is your “it exists” milestone)
Deliverable:
A static sci-fi scene rendered cleanly on desktop + mobile.

Phase 1 — Scene interactivity (2–3 sessions)
Goal: Make the scene feel clickable and alive.
* Define hotspot map (absolute-positioned buttons)
    * Resume scanner
    * Lore panel
    * “About this demo”
* Add invisible hit targets with hover/tap feedback
* Wire hotspots → shadcn Dialog/Drawer
* Build state-driven dialog menu pattern
    * Intro → menu → leaf screens → back
Deliverable:
Scene feels like a game UI, even without animation.

Phase 2 — Robot presence & motion (2–3 sessions)
Goal: Create the illusion of a living NPC.
* Add robot overlay component (absolute positioned)
* Implement sprite-sheet animation (idle)
* Implement greet animation
* Add first-load sequence:
    * Disclaimer modal
    * Robot greet animation
    * Initial dialog message
* Add waypoint-based “wander” behavior
    * Random idle durations
    * Walk animation during movement
* Pause robot on modal open
Deliverable:
Robot greets you and casually moves behind the station.

Phase 3 — Resume scanner UX (2–3 sessions)
Goal: Core interaction loop exists end-to-end (no AI yet).
* Build Resume Scanner dialog
    * Drag/drop zone
    * File type validation (PDF/DOCX)
    * Progress indicator (“Scanning…”)
* Implement client-side text extraction
    * PDF: pdfjs
    * DOCX: mammoth
* Display extracted text preview (collapsible)
* Add “Try sample resumes” tab
    * 4–6 themed sample texts
* Feed extracted text into a fake analyzer
    * Hardcoded jokes / placeholder results
Deliverable:
You can upload or choose a resume and get themed feedback.

Phase 4 — AI feedback integration (2–3 sessions)
Goal: Real intelligence, safely wrapped.
* Add AI disclaimer (persisted in localStorage)
* Implement /api/feedback route
* Add rate limiting + text length guard
* Create structured AI prompt
    * Verdict
    * Strengths
    * Weaknesses
    * Suggested edits
    * NPC dialog lines
* Render results in RPG-style panels
* Add tone selector (Friendly / Snarky / Brutal)
Deliverable:
Upload → scan → funny, structured AI feedback.

Phase 5 — Polish & “portfolio shine” (ongoing)
Goal: Elevate from “cool” to “memorable”.
* Typewriter text effect for NPC dialog
* Subtle ambient sound + mute toggle
* Motion polish (Framer Motion on panels)
* Result share card (export image)
* Loading skeletons
* Mobile interaction tuning
* Clear README explaining architecture + UX intent
Deliverable:
A demo people remember and talk about.

Core UX loop (keep this sacred)
1. Visitor enters scene
2. Robot greets them (character moment)
3. Visitor explores hotspots
4. Resume scanner draws attention
5. Upload or sample resume
6. Scan → feedback → humor + insight
7. Visitor shares / tries another resume
If a feature doesn’t strengthen this loop, cut it.