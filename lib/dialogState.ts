import type { ReviewResult } from "@/lib/reviewService";
import type { DialogStateId } from "@/lib/dialogConfig";

export type DialogScanSource = "upload" | "sample";

export type DialogSidebarState = {
  open: boolean;
  mode: "sample" | "results" | null;
  sampleId?: string;
};

export type DialogPendingScan = {
  source: DialogScanSource;
  sampleId?: string;
  file?: File | null;
};

export type DialogState = {
  id: DialogStateId;
  isOpen: boolean;
  selectedSampleId: string | null;
  lastScanSource: DialogScanSource | null;
  resumeFile: File | null;
  uploadError: string | null;
  isUploading: boolean;
  reviewResult: ReviewResult | null;
  sidebar: DialogSidebarState;
  hasAnimatedWelcome: boolean;
  hasReturnedToWelcome: boolean;
  hasPlayedGreeting: boolean;
  pendingScan: DialogPendingScan | null;
};

export type DialogEvent =
  | { type: "OPEN_DIALOG" }
  | { type: "SET_STATE"; id: DialogStateId }
  | { type: "SET_RESUME_FILE"; file: File | null }
  | { type: "SET_UPLOAD_ERROR"; error: string | null }
  | { type: "SET_UPLOADING"; isUploading: boolean }
  | { type: "SET_REVIEW_RESULT"; result: ReviewResult | null }
  | { type: "SELECT_SAMPLE"; sampleId: string | null }
  | { type: "SET_LAST_SCAN_SOURCE"; source: DialogScanSource | null }
  | { type: "SET_PENDING_SCAN"; scan: DialogPendingScan | null }
  | { type: "OPEN_SIDEBAR"; mode: "sample" | "results"; sampleId?: string }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "WELCOME_ANIMATED" }
  | { type: "SET_RETURNED_TO_WELCOME"; value: boolean }
  | { type: "SET_PLAYED_GREETING"; value: boolean };

export const initialDialogState: DialogState = {
  id: "welcome",
  isOpen: true,
  selectedSampleId: null,
  lastScanSource: null,
  resumeFile: null,
  uploadError: null,
  isUploading: false,
  reviewResult: null,
  sidebar: {
    open: false,
    mode: null,
  },
  hasAnimatedWelcome: false,
  hasReturnedToWelcome: false,
  hasPlayedGreeting: false,
  pendingScan: null,
};

export const dialogReducer = (state: DialogState, event: DialogEvent): DialogState => {
  switch (event.type) {
    case "OPEN_DIALOG":
      return {
        ...state,
        isOpen: true,
      };
    case "SET_STATE":
      return {
        ...state,
        id: event.id,
      };
    case "SET_RESUME_FILE":
      return {
        ...state,
        resumeFile: event.file,
      };
    case "SET_UPLOAD_ERROR":
      return {
        ...state,
        uploadError: event.error,
      };
    case "SET_UPLOADING":
      return {
        ...state,
        isUploading: event.isUploading,
      };
    case "SET_REVIEW_RESULT":
      return {
        ...state,
        reviewResult: event.result,
      };
    case "SELECT_SAMPLE":
      return {
        ...state,
        selectedSampleId: event.sampleId,
      };
    case "SET_LAST_SCAN_SOURCE":
      return {
        ...state,
        lastScanSource: event.source,
      };
    case "SET_PENDING_SCAN":
      return {
        ...state,
        pendingScan: event.scan,
      };
    case "OPEN_SIDEBAR":
      return {
        ...state,
        sidebar: {
          open: true,
          mode: event.mode,
          sampleId: event.sampleId,
        },
      };
    case "CLOSE_SIDEBAR":
      return {
        ...state,
        sidebar: {
          open: false,
          mode: null,
        },
      };
    case "WELCOME_ANIMATED":
      return {
        ...state,
        hasAnimatedWelcome: true,
      };
    case "SET_RETURNED_TO_WELCOME":
      return {
        ...state,
        hasReturnedToWelcome: event.value,
      };
    case "SET_PLAYED_GREETING":
      return {
        ...state,
        hasPlayedGreeting: event.value,
      };
    default:
      return state;
  }
};
