"use client";

import { useCallback, useState } from "react";

const CONSENT_STORAGE_KEY = "resume-consent";

const checkStoredConsent = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.sessionStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

const writeStoredConsent = (value: boolean) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (value) {
      window.sessionStorage.setItem(CONSENT_STORAGE_KEY, "true");
    } else {
      window.sessionStorage.removeItem(CONSENT_STORAGE_KEY);
    }
  } catch (error) {
    // Ignore storage errors and fallback to in-memory state.
    console.error("Failed to store consent:", error instanceof Error ? error.message : String(error));
  }
};

export function useResumeConsent() {
  const [hasConsent, setHasConsent] = useState(() => checkStoredConsent());

  const grantConsent = useCallback(() => {
    setHasConsent(true);
    writeStoredConsent(true);
  }, []);

  const clearConsent = useCallback(() => {
    setHasConsent(false);
    writeStoredConsent(false);
  }, []);

  return {
    hasConsent,
    grantConsent,
    clearConsent,
  };
}
