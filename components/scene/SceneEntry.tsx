"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/helpers";

import Scene from "./Scene";
import TitleScreen from "./TitleScreen";

const PRELOAD_IMAGE_ASSETS = ["/scene-bg.png"];
const PRELOAD_VIDEO_ASSETS = ["/videos/greet.mp4", "/videos/robot-idle.mp4", "/videos/resume-scan.mp4"];
const ENTRY_FADE_MS = 520;

const getViewportProfile = () => {
  const isMobilePortrait = window.matchMedia("(max-width: 640px) and (orientation: portrait)").matches;
  return isMobilePortrait ? "mobile-portrait" : "desktop";
};

const preloadImage = (src: string) => {
  const image = new Image();
  image.src = src;
};

const preloadVideo = (src: string) => {
  const existingLink = document.querySelector(`link[rel=\"preload\"][href=\"${src}\"]`);
  if (existingLink) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
};

export default function SceneEntry() {
  const [entryState, setEntryState] = useState<"title" | "transition" | "scene">("title");

  useEffect(() => {
    document.documentElement.dataset.viewportProfile = getViewportProfile();

    PRELOAD_IMAGE_ASSETS.forEach(preloadImage);
    PRELOAD_VIDEO_ASSETS.forEach(preloadVideo);
  }, []);

  const handleContinue = useCallback(() => {
    setEntryState((currentState) => {
      if (currentState !== "title") {
        return currentState;
      }
      return "transition";
    });
  }, []);

  useEffect(() => {
    if (entryState !== "transition") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setEntryState("scene");
    }, ENTRY_FADE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [entryState]);

  const showScene = entryState === "transition" || entryState === "scene";
  const showTitle = entryState === "title" || entryState === "transition";

  return (
    <div className="relative min-h-screen w-full">
      {showScene && <Scene />}
      {showTitle && (
        <div
          className={cn(
            "absolute inset-0 z-50 transition-opacity",
            entryState === "transition" ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          style={{ transitionDuration: `${ENTRY_FADE_MS}ms` }}
        >
          <TitleScreen onContinue={handleContinue} />
        </div>
      )}
    </div>
  );
}
