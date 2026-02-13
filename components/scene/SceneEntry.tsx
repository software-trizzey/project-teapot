"use client";

import { useCallback, useEffect, useState } from "react";

import { useBackgroundMusic } from "@/components/audio/BackgroundMusicProvider";
import { cn } from "@/lib/helpers";

import Scene from "./Scene";
import TitleScreen from "./TitleScreen";

const PRELOAD_ASSETS = {
  desktop: {
    images: ["/scene-bg.png"],
    videos: [
      "/videos/greet.mp4",
      "/videos/robot-idle.mp4",
      "/videos/resume-scan.mp4",
      "/videos/error.mp4",
    ],
  },
  "mobile-portrait": {
    images: ["/scene-bg-mobile.png"],
    videos: [
      "/videos/greet-mobile.mp4",
      "/videos/robot-idle-mobile.mp4",
      "/videos/resume-scan-mobile.mp4",
      "/videos/error-mobile.mp4",
    ],
  },
} as const;
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
  const { enableAudio } = useBackgroundMusic();

  useEffect(() => {
    const viewportProfile = getViewportProfile();
    document.documentElement.dataset.viewportProfile = viewportProfile;

    const assets = PRELOAD_ASSETS[viewportProfile];
    assets.images.forEach(preloadImage);
    assets.videos.forEach(preloadVideo);
  }, []);

  const handleContinue = useCallback(() => {
    enableAudio();
    setEntryState((currentState) => {
      if (currentState !== "title") {
        return currentState;
      }
      return "transition";
    });
  }, [enableAudio]);

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
