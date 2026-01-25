"use client";

import { useEffect, useRef } from "react";
import type { Dispatch } from "react";

import { createResumeReviewService } from "@/lib";
import type { DialogEvent, DialogState } from "@/lib/dialogState";
import { parseResumeFile } from "@/lib/services/resume-parser";

const reviewService = createResumeReviewService();
const SCAN_DELAY_MS = 2200;

export function useDialogScannerEffects(state: DialogState, dispatch: Dispatch<DialogEvent>) {
  const scanTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTokenRef = useRef(0);
  const isOpenRef = useRef(state.isOpen);

  useEffect(() => {
    isOpenRef.current = state.isOpen;
    if (!state.isOpen && scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
      scanTimeoutRef.current = null;
      scanTokenRef.current += 1;
    }
  }, [state.isOpen]);

  useEffect(() => {
    return () => {
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!state.pendingScan) {
      return;
    }

    scanTokenRef.current += 1;
    const scanToken = scanTokenRef.current;
    const pendingScan = state.pendingScan;
    dispatch({ type: "SET_PENDING_SCAN", scan: null });
    dispatch({ type: "SET_REVIEW_RESULT", result: null });
    dispatch({ type: "SET_UPLOAD_ERROR", error: null });

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }

    const runReview = async (options: {
      sourceId: string;
      label: string;
      resumeText?: string;
    }) => {
      try {
        const result = await reviewService.reviewResume({
          source: {
            id: options.sourceId,
            label: options.label,
          },
          resumeText: options.resumeText,
        });
        if (!isOpenRef.current || scanTokenRef.current !== scanToken) {
          return;
        }
        dispatch({ type: "SET_REVIEW_RESULT", result });
        dispatch({ type: "SET_STATE", id: "results" });
        dispatch({ type: "OPEN_SIDEBAR", mode: "results" });
      } catch (error) {
        if (!isOpenRef.current || scanTokenRef.current !== scanToken) {
          return;
        }
        const message =
          error instanceof Error
            ? error.message
            : "Scan failed. Please try again.";
        dispatch({ type: "SET_UPLOAD_ERROR", error: message });
        dispatch({ type: "SET_STATE", id: "error" });
      }
    };

    if (pendingScan.source === "sample") {
      scanTimeoutRef.current = setTimeout(() => {
        void runReview({
          sourceId: pendingScan.sampleId ?? "sample",
          label: "Sample resume",
        });
      }, SCAN_DELAY_MS);
      return;
    }

    const file = pendingScan.file ?? state.resumeFile;
    if (!file) {
      if (!isOpenRef.current || scanTokenRef.current !== scanToken) {
        return;
      }
      dispatch({ type: "SET_UPLOAD_ERROR", error: "Select a resume to continue." });
      dispatch({ type: "SET_STATE", id: "error" });
      return;
    }

    const parseAndScan = async () => {
      dispatch({ type: "SET_UPLOADING", isUploading: true });
      try {
        const { text } = await parseResumeFile(file);
        if (!isOpenRef.current || scanTokenRef.current !== scanToken) {
          return;
        }
        scanTimeoutRef.current = setTimeout(() => {
          void runReview({
            sourceId: "upload",
            label: "Uploaded resume",
            resumeText: text,
          });
        }, SCAN_DELAY_MS);
      } catch (error) {
        if (!isOpenRef.current || scanTokenRef.current !== scanToken) {
          return;
        }
        const message =
          error instanceof Error ? error.message : "Upload failed. Please try again.";
        dispatch({ type: "SET_UPLOAD_ERROR", error: message });
        dispatch({ type: "SET_STATE", id: "error" });
      } finally {
        if (isOpenRef.current && scanTokenRef.current === scanToken) {
          dispatch({ type: "SET_UPLOADING", isUploading: false });
        }
      }
    };

    void parseAndScan();
  }, [dispatch, state.pendingScan, state.resumeFile]);
}
