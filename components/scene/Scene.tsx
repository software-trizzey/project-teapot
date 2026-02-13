"use client";

import { cn } from "@/lib/helpers";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";

import {
  DEFAULT_IDLE_SCHEDULE,
  createSceneController,
  getRandomIdleDelayMs,
  pickIdleClip,
  type ScenePhase,
  type SceneState,
  type SceneVideoId,
} from "@/lib";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import MusicToggle from "@/components/audio/MusicToggle";
import sceneBg from "@/public/scene-bg.png";
import sceneBgMobile from "@/public/scene-bg-mobile.png";

import { DialogProvider, useDialogContext } from "./DialogProvider";
import Hotspots from "./Hotspots";
import Hud from "./Hud";
import ResumeDialog from "./ResumeDialog";
import SceneBackground from "./SceneBackground";

const VIDEO_SOURCES_DESKTOP: Record<SceneVideoId, string> = {
  greet: "/videos/greet.mp4",
  "resume-scan": "/videos/resume-scan.mp4",
  "robot-idle": "/videos/robot-idle.mp4",
  error: "/videos/error.mp4",
};

const VIDEO_SOURCES_MOBILE: Record<SceneVideoId, string> = {
  greet: "/videos/greet-mobile.mp4",
  "resume-scan": "/videos/resume-scan-mobile.mp4",
  "robot-idle": "/videos/robot-idle-mobile.mp4",
  error: "/videos/error-mobile.mp4",
};

export default function Scene() {
  return (
    <DialogProvider>
      <SceneContent />
    </DialogProvider>
  );
}

function SceneContent() {
  const [controller] = useState(() =>
    createSceneController({
      initialPhase: "boot",
    })
  );
  const { state: dialogState, dispatch } = useDialogContext();
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [sceneState, setSceneState] = useState<SceneState>(() =>
    controller.getState()
  );
  const isMobilePortrait = useMediaQuery("(max-width: 640px) and (orientation: portrait)");

  useEffect(() => {
    const unsubscribe = controller.subscribe((state) => {
      setSceneState(state);
    });

    controller.send({ type: "INIT" });

    return () => {
      unsubscribe();
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [controller]);
  const activeVideoSrc = useMemo(() => {
    if (!sceneState.activeVideo) {
      return null;
    }

    const sourceMap = isMobilePortrait ? VIDEO_SOURCES_MOBILE : VIDEO_SOURCES_DESKTOP;
    return sourceMap[sceneState.activeVideo];
  }, [isMobilePortrait, sceneState.activeVideo]);

  useEffect(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    if (sceneState.activeVideo) {
      return;
    }

    const idleClips = sceneState.idleWeights[sceneState.phase] ?? [];
    const nextClip = pickIdleClip(
      idleClips,
      sceneState.lastVideo,
      DEFAULT_IDLE_SCHEDULE.avoidRepeat
    );

    if (!nextClip) {
      return;
    }

    const delay = getRandomIdleDelayMs(DEFAULT_IDLE_SCHEDULE);
    idleTimeoutRef.current = setTimeout(() => {
      controller.send({ type: "PLAY_VIDEO", id: nextClip });
    }, delay);
  }, [
    controller,
    sceneState.activeVideo,
    sceneState.idleWeights,
    sceneState.lastVideo,
    sceneState.phase,
  ]);

  const handleVideoEnded = () => {
    if (dialogState.id === "scanning") {
      dispatch({ type: "SET_SCAN_ANIMATION_COMPLETED", value: true });
    }
    controller.send({ type: "VIDEO_ENDED" });
  };

  const handleVideoError = () => {
    controller.send({ type: "SET_PHASE", phase: "error" });
    controller.send({ type: "VIDEO_ENDED" });
  };

  const handlePhaseChange = useCallback(
    (phase: ScenePhase) => {
      controller.send({ type: "SET_PHASE", phase });
    },
    [controller]
  );

  const handlePlayVideo = useCallback(
    (id: SceneVideoId, phase?: ScenePhase) => {
      controller.send({ type: "PLAY_VIDEO", id, nextPhase: phase });
    },
    [controller]
  );

  const handleOpenResumeDialog = useCallback(() => {
    dispatch({ type: "OPEN_DIALOG" });
    if (dialogState.id === "welcome") {
      dispatch({ type: "SET_STATE", id: "menu" });
    }
  }, [dialogState.id, dispatch]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== " " || dialogState.isOpen) {
        return;
      }
      if (sceneState.phase === "scanning" || sceneState.phase === "reviewing") {
        return;
      }
      event.preventDefault();
      handleOpenResumeDialog();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogState.isOpen, handleOpenResumeDialog, sceneState.phase]);

  return (
    <section className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-black px-0 sm:px-6">
      <div className="starfield" aria-hidden="true">
        <div className="starfield__layer starfield__layer--slow" />
        <div className="starfield__layer starfield__layer--medium" />
        <div className="starfield__layer starfield__layer--fast" />
      </div>

      <div
        className={cn(
          "relative z-10 w-full transition-all duration-500",
          isMobilePortrait
            ? "fixed inset-0 h-full overflow-hidden"
            : "max-w-[1024px] rounded-3xl shadow-[0_40px_120px_rgba(8,10,20,0.6)]"
        )}
      >
        <div
          className={cn(
            "relative mx-auto flex items-center justify-center",
            isMobilePortrait ? "h-full w-full" : "aspect-video w-full"
          )}
        >
          <div
            className={cn(
              "relative aspect-video",
              isMobilePortrait ? "h-full min-w-full" : "w-full"
            )}
          >
            <SceneBackground
              backgroundSrc={isMobilePortrait ? sceneBgMobile : sceneBg}
              videoSrc={activeVideoSrc}
              isVideoVisible={sceneState.isVideoVisible}
              onVideoEnded={handleVideoEnded}
              onVideoError={handleVideoError}
              className={isMobilePortrait ? "" : "rounded-3xl"}
              isFullScreen={isMobilePortrait}
            />
            <Hotspots
              dialogState={dialogState.id}
              isDialogOpen={dialogState.isOpen}
              phase={sceneState.phase}
              onOpenResumeDialog={handleOpenResumeDialog}
            />
          </div>
        </div>

        <div className="absolute inset-x-4 sm:inset-x-6 top-4 sm:top-6 z-20 flex items-center justify-between gap-4">
          <Hud phase={sceneState.phase} />
          <MusicToggle />
        </div>

        <ResumeDialog onPhaseChange={handlePhaseChange} onPlayVideo={handlePlayVideo} />
      </div>
    </section>
  );
}
