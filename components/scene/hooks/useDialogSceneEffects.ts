"use client";

import { useEffect, useRef } from "react";
import type { Dispatch } from "react";

import type { ScenePhase, SceneVideoId } from "@/lib";
import type { DialogEvent, DialogState } from "@/lib/dialogState";

type DialogSceneEffectsConfig = {
  state: DialogState;
  dispatch: Dispatch<DialogEvent>;
  onPhaseChange: (phase: ScenePhase) => void;
  onPlayVideo: (id: SceneVideoId, phase?: ScenePhase) => void;
};

export function useDialogSceneEffects({
  state,
  dispatch,
  onPhaseChange,
  onPlayVideo,
}: DialogSceneEffectsConfig) {
  const prevStateRef = useRef<{ id: DialogState["id"]; isOpen: boolean } | null>(null);

  useEffect(() => {
    if (!state.isOpen || state.id !== "welcome" || state.hasPlayedGreeting) {
      return;
    }

    onPhaseChange("greeting");
    onPlayVideo("greet", "greeting");
    dispatch({ type: "SET_PLAYED_GREETING", value: true });
  }, [dispatch, onPhaseChange, onPlayVideo, state.hasPlayedGreeting, state.id, state.isOpen]);

  useEffect(() => {
    const prevState = prevStateRef.current;
    const prevId = prevState?.id;
    const wasOpen = prevState?.isOpen ?? state.isOpen;

    if (wasOpen && !state.isOpen) {
      onPhaseChange("idle");
      onPlayVideo("robot-idle", "idle");
    }

    if (state.isOpen && prevId !== state.id) {
      if (state.id === "scanning") {
        onPhaseChange("scanning");
        onPlayVideo("resume-scan", "scanning");
      } else if (state.id === "results") {
        onPhaseChange("reviewing");
      } else if (state.id === "error") {
        onPhaseChange("idle");
        onPlayVideo("error", "idle");
      }
    }

    if (state.isOpen && prevId === "results" && state.id !== "results" && state.id !== "scanning") {
      onPhaseChange("idle");
      onPlayVideo("robot-idle", "idle");
    }

    prevStateRef.current = { id: state.id, isOpen: state.isOpen };
  }, [onPhaseChange, onPlayVideo, state.id, state.isOpen]);
}
