export type DialogStateId =
  | "welcome"
  | "menu"
  | "what"
  | "privacy"
  | "upload-consent"
  | "upload-ready"
  | "sample-list"
  | "scanning"
  | "results"
  | "error"

export type DialogAction =
  | "close"
  | "start-upload"
  | "start-sample"
  | "start-scan"
  | "back"

export type DialogOption = {
  id: string
  label: string
  nextState?: DialogStateId
  action?: DialogAction
}

export type DialogStateConfig = {
  id: DialogStateId
  speaker: string
  prompt: string
  options: DialogOption[]
}

export const DIALOG_SPEAKER = "HR-418 (Teapot)"

export const DIALOG_STATES: Record<DialogStateId, DialogStateConfig> = {
  welcome: {
    id: "welcome",
    speaker: DIALOG_SPEAKER,
    prompt:
      "Welcome to the Galactic Career Center. I'm HR-418, designation Teapot. Please activate the scanner to begin your resume review when you're ready...",
    options: [],
  },
  menu: {
    id: "menu",
    speaker: DIALOG_SPEAKER,
    prompt: "How can I assist you today?",
    options: [
      {
        id: "choose-resume",
        label: "Scan a resume",
        nextState: "sample-list",
      },
      { id: "what", label: "What is your function?", nextState: "what" },
      {
        id: "privacy",
        label: "Privacy / data handling",
        nextState: "privacy",
      },
      { id: "close", label: "Never mind", nextState: "welcome" },
    ],
  },
  what: {
    id: "what",
    speaker: DIALOG_SPEAKER,
    prompt:
    "Scan a resume and recieve structured feedback. Upload your own or try a sample applicant.\n\nNote: listing \"fast learner\" will be verified.",
    options: [{ id: "back", label: "Never mind", nextState: "menu" }],
  },
  privacy: {
    id: "privacy",
    speaker: DIALOG_SPEAKER,
    prompt:
      "Resumes are parsed locally in your browser. We do not store files or results, and nothing is sent to third-party services.",
    options: [{ id: "back", label: "Never mind", nextState: "menu" }],
  },
  "upload-consent": {
    id: "upload-consent",
    speaker: DIALOG_SPEAKER,
    prompt:
      "Before we scan a real resume, I need your consent to parse the file in your browser. We do not store the file or generated data. Ready?",
    options: [
      { id: "agree", label: "I agree", nextState: "upload-ready" },
      { id: "use-sample", label: "Use a sample instead", nextState: "sample-list" },
      { id: "back", label: "Never mind", nextState: "menu" },
    ],
  },
  "upload-ready": {
    id: "upload-ready",
    speaker: DIALOG_SPEAKER,
    prompt:
      "Choose a .pdf or .docx resume to scan. Files are parsed in your browser and never stored.",
    options: [
      { id: "start-scan", label: "Begin scan", action: "start-scan" },
      { id: "back", label: "Never mind", nextState: "menu" },
    ],
  },
  "sample-list": {
    id: "sample-list",
    speaker: DIALOG_SPEAKER,
    prompt: "Choose what to scan. Upload your own resume or pick a sample applicant.",
    options: [{ id: "back", label: "Never mind", nextState: "menu" }],
  },
  scanning: {
    id: "scanning",
    speaker: DIALOG_SPEAKER,
    prompt: "Scanning resume...",
    options: [],
  },
  results: {
    id: "results",
    speaker: DIALOG_SPEAKER,
    prompt: "Scan complete. Here are the highlights.",
    options: [
      { id: "scan-again", label: "Scan another resume", nextState: "sample-list" },
      { id: "close", label: "Close", action: "close" },
    ],
  },
  error: {
    id: "error",
    speaker: DIALOG_SPEAKER,
    prompt: "Hmm... looks like the scanner ran into trouble. Try again?",
    options: [],
  },
}

export const getDialogStateConfig = (id: DialogStateId): DialogStateConfig => {
  return DIALOG_STATES[id]
}
