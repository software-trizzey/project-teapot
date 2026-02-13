"use client";

import { useCallback } from "react";
import type { Dispatch } from "react";

import type { DialogOption, DialogStateId } from "@/lib";
import type { DialogEvent, DialogState } from "@/lib/dialogState";
import { validateResumeFile } from "@/lib/services/resume-parser";

import { CHAOS_SAMPLE_ERROR, CHAOS_SAMPLE_ID } from "../dialog-data";

type DialogActions = {
  handleMenuOption: (option: DialogOption) => void;
  handleSampleSelect: (sampleId: string) => void;
  handleUploadResumeSelect: () => void;
  handleStartSampleScan: (sampleId: string) => void;
  handleStartScan: (file?: File | null) => void;
  handleFileSelect: (file: File | null) => File | null;
  handleClearFile: () => void;
  handleSidebarOpenChange: (open: boolean) => void;
  openMenu: () => void;
  setState: (nextState: DialogStateId) => void;
};

export function useDialogActions(state: DialogState, dispatch: Dispatch<DialogEvent>): DialogActions {
  const clearScanState = useCallback(() => {
    dispatch({ type: "SET_RESUME_FILE", file: null });
    dispatch({ type: "SET_UPLOAD_ERROR", error: null });
    dispatch({ type: "SET_UPLOADING", isUploading: false });
    dispatch({ type: "SET_REVIEW_RESULT", result: null });
    dispatch({ type: "SET_PENDING_SCAN", scan: null });
    dispatch({ type: "SET_SCAN_ANIMATION_COMPLETED", value: false });
    dispatch({ type: "SET_LAST_SCAN_SOURCE", source: null });
  }, [dispatch]);

  const setState = useCallback(
    (nextState: DialogStateId) => {
      if (nextState === "menu") {
        clearScanState();
        dispatch({ type: "SELECT_SAMPLE", sampleId: null });
        dispatch({ type: "CLOSE_SIDEBAR" });
      }
      dispatch({ type: "SET_STATE", id: nextState });
    },
    [clearScanState, dispatch]
  );

  const openMenu = useCallback(() => {
    setState("menu");
  }, [setState]);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      if (!file) {
        return null;
      }

      const error = validateResumeFile(file);
      if (error) {
        dispatch({ type: "SET_UPLOAD_ERROR", error });
        dispatch({ type: "SET_RESUME_FILE", file: null });
        return null;
      }

      dispatch({ type: "SET_RESUME_FILE", file });
      dispatch({ type: "SET_UPLOAD_ERROR", error: null });
      return file;
    },
    [dispatch]
  );

  const handleClearFile = useCallback(() => {
    dispatch({ type: "SET_RESUME_FILE", file: null });
    dispatch({ type: "SET_UPLOAD_ERROR", error: null });
  }, [dispatch]);

  const handleStartScan = useCallback(
    (file?: File | null) => {
      const selectedFile = file ?? state.resumeFile;

      if (!selectedFile) {
        dispatch({ type: "SET_LAST_SCAN_SOURCE", source: "upload" });
        dispatch({ type: "SET_UPLOAD_ERROR", error: "Select a resume to continue." });
        dispatch({ type: "SET_STATE", id: "error" });
        return;
      }

      if (file) {
        dispatch({ type: "SET_RESUME_FILE", file });
      }

      dispatch({ type: "SET_LAST_SCAN_SOURCE", source: "upload" });
      dispatch({ type: "SET_UPLOAD_ERROR", error: null });
      dispatch({ type: "SET_SCAN_ANIMATION_COMPLETED", value: false });
      dispatch({ type: "CLOSE_SIDEBAR" });
      dispatch({ type: "SET_STATE", id: "scanning" });
      dispatch({ type: "SET_PENDING_SCAN", scan: { source: "upload", file: selectedFile } });
    },
    [dispatch, state.resumeFile]
  );

  const handleSampleSelect = useCallback(
    (sampleId: string) => {
      dispatch({ type: "SELECT_SAMPLE", sampleId });
      dispatch({ type: "SET_RESUME_FILE", file: null });
      dispatch({ type: "SET_UPLOAD_ERROR", error: null });
      dispatch({ type: "OPEN_SIDEBAR", mode: "sample", sampleId });
    },
    [dispatch]
  );

  const handleUploadResumeSelect = useCallback(() => {
    dispatch({ type: "SELECT_SAMPLE", sampleId: null });
    dispatch({ type: "SET_UPLOAD_ERROR", error: null });
    dispatch({ type: "CLOSE_SIDEBAR" });
    dispatch({ type: "SET_STATE", id: "upload-ready" });
  }, [dispatch]);

  const handleStartSampleScan = useCallback(
    (sampleId: string) => {
      dispatch({ type: "SET_LAST_SCAN_SOURCE", source: "sample" });
      dispatch({ type: "SELECT_SAMPLE", sampleId });
      dispatch({ type: "SET_RESUME_FILE", file: null });

      if (sampleId === CHAOS_SAMPLE_ID) {
        dispatch({ type: "SET_UPLOAD_ERROR", error: CHAOS_SAMPLE_ERROR });
        dispatch({ type: "CLOSE_SIDEBAR" });
        dispatch({ type: "SET_PENDING_SCAN", scan: null });
        dispatch({ type: "SET_STATE", id: "error" });
        return;
      }

      dispatch({ type: "SET_UPLOAD_ERROR", error: null });
      dispatch({ type: "SET_SCAN_ANIMATION_COMPLETED", value: false });
      dispatch({ type: "CLOSE_SIDEBAR" });
      dispatch({ type: "SET_STATE", id: "scanning" });
      dispatch({ type: "SET_PENDING_SCAN", scan: { source: "sample", sampleId } });
    },
    [dispatch]
  );

  const handleMenuOption = useCallback(
    (option: DialogOption) => {
      if (option.action === "close") {
        setState("menu");
        return;
      }

      if (option.action === "start-scan") {
        handleStartScan();
        return;
      }

      if (option.nextState) {
        if (state.id === "results" && option.id === "scan-again") {
          clearScanState();
          dispatch({ type: "SELECT_SAMPLE", sampleId: null });
          dispatch({ type: "CLOSE_SIDEBAR" });
        }

        if (state.id === "menu" && option.id === "close") {
          dispatch({ type: "SET_RETURNED_TO_WELCOME", value: true });
        }
        setState(option.nextState);
      }
    },
    [clearScanState, dispatch, handleStartScan, setState, state.id]
  );

  const handleSidebarOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        dispatch({ type: "CLOSE_SIDEBAR" });
      }
    },
    [dispatch]
  );

  return {
    handleMenuOption,
    handleSampleSelect,
    handleUploadResumeSelect,
    handleStartSampleScan,
    handleStartScan,
    handleFileSelect,
    handleClearFile,
    handleSidebarOpenChange,
    openMenu,
    setState,
  };
}
