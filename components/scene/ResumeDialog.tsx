"use client";

import { useCallback, useMemo } from "react";

import {
  DIALOG_SPEAKER,
  getDialogStateConfig,
  type DialogOption,
  type DialogStateId,
  type ScenePhase,
  type SceneVideoId,
} from "@/lib";
import { Dialog } from "@/components/dialog";
import { useDialogShortcuts } from "@/lib/hooks/useDialogShortcuts";

import { useDialogContext } from "./DialogProvider";
import { useDialogActions } from "./hooks/useDialogActions";
import { useDialogSceneEffects } from "./hooks/useDialogSceneEffects";
import { useDialogScannerEffects } from "./hooks/useDialogScannerEffects";
import ResumeDialogContent from "./ResumeDialogContent";
import ResumeDialogFooter from "./ResumeDialogFooter";
import ResumeDialogHeader from "./ResumeDialogHeader";
import ResumeDialogSidebar from "./ResumeDialogSidebar";
import { CHAOS_SAMPLE_ID, CTA_LABELS, SAMPLE_RESUMES } from "./dialog-data";

export type ResumeDialogProps = {
  onPhaseChange: (phase: ScenePhase) => void;
  onPlayVideo: (id: SceneVideoId, phase?: ScenePhase) => void;
};

export default function ResumeDialog({ onPhaseChange, onPlayVideo }: ResumeDialogProps) {
  const { state, dispatch } = useDialogContext();
  const stateConfig = getDialogStateConfig(state.id);

  useDialogSceneEffects({ state, dispatch, onPhaseChange, onPlayVideo });
  useDialogScannerEffects(state, dispatch);

  const {
    handleMenuOption,
    handleSampleSelect,
    handleStartSampleScan,
    handleStartScan,
    handleFileSelect,
    handleClearFile,
    handleSidebarOpenChange,
    openMenu,
    setState,
  } = useDialogActions(state, dispatch);

  const isChaosError = state.id === "error" && state.selectedSampleId === CHAOS_SAMPLE_ID;
  const resolvedPrompt =
    state.id === "error" && state.uploadError
      ? isChaosError
        ? `...${state.uploadError}`
        : state.uploadError
      : state.id === "welcome" && state.hasReturnedToWelcome
        ? "Okay, activate the scanner when you're ready to begin."
        : stateConfig.prompt;
  const shouldAnimatePrompt =
    (state.id === "welcome" && !state.hasAnimatedWelcome && !state.hasReturnedToWelcome) ||
    isChaosError;

  const errorOptions = useMemo(() => {
    const options: DialogOption[] = [];
    if (state.resumeFile) {
      options.push({
        id: "retry-scan",
        label: "Try scan again",
        action: "start-scan",
      });
    }

    const errorBackState: DialogStateId =
      state.lastScanSource === "sample" ? "sample-list" : "upload-ready";

    options.push({
      id: "go-back",
      label: "Go back",
      nextState: errorBackState,
    });

    return options;
  }, [state.lastScanSource, state.resumeFile]);

  const handleNumberPress = useCallback(
    (index: number) => {
      if (state.id === "error") {
        const option = errorOptions[index];
        if (option) {
          handleMenuOption(option);
        }
        return;
      }

      if (state.id === "sample-list") {
        const sample = SAMPLE_RESUMES[index];
        if (sample) {
          handleSampleSelect(sample.id);
        }
        return;
      }

      const option = stateConfig.options[index];
      if (option) {
        handleMenuOption(option);
      }
    },
    [errorOptions, handleMenuOption, handleSampleSelect, state.id, stateConfig.options]
  );

  const optionsCount = useMemo(() => {
    if (state.id === "error") {
      return errorOptions.length;
    }

    if (state.id === "sample-list") {
      return SAMPLE_RESUMES.length;
    }

    if (state.id === "welcome" || state.id === "scanning") {
      return 0;
    }

    return stateConfig.options.length;
  }, [errorOptions.length, state.id, stateConfig.options.length]);

  const { openMenuHint, selectOptionHint } = useDialogShortcuts({
    activeState: state.id,
    isOpen: state.isOpen,
    optionsCount,
    onOpenMenu: openMenu,
    onNumberPress: handleNumberPress,
  });

  const handlePromptComplete = useCallback(() => {
    if (state.id === "welcome") {
      dispatch({ type: "WELCOME_ANIMATED" });
    }
  }, [dispatch, state.id]);

  if (!state.isOpen && state.id !== "scanning" && state.id !== "results") {
    return null;
  }

  return (
    <Dialog.Root>
      <ResumeDialogHeader
        speaker={stateConfig.speaker || DIALOG_SPEAKER}
        prompt={resolvedPrompt}
        ctaLabel={CTA_LABELS[state.id]}
        animatePrompt={shouldAnimatePrompt}
        isChaosError={isChaosError}
        onPromptComplete={handlePromptComplete}
      />

      <ResumeDialogContent
        state={state}
        stateConfig={stateConfig}
        samples={SAMPLE_RESUMES}
        openMenuHint={openMenuHint}
        selectOptionHint={selectOptionHint}
        onOpenMenu={openMenu}
        onSampleSelect={handleSampleSelect}
        onFileSelect={handleFileSelect}
        onStartScan={handleStartScan}
        onUseSample={() => setState("sample-list")}
        onClearFile={handleClearFile}
        onMenuOption={handleMenuOption}
      />

      <ResumeDialogFooter
        activeState={state.id}
        stateConfig={stateConfig}
        errorOptions={errorOptions}
        onOptionSelect={handleMenuOption}
        selectOptionHint={selectOptionHint}
      />

      <ResumeDialogSidebar
        sidebar={state.sidebar}
        reviewResult={state.reviewResult}
        samples={SAMPLE_RESUMES}
        onStartSampleScan={handleStartSampleScan}
        onOpenChange={handleSidebarOpenChange}
      />
    </Dialog.Root>
  );
}
