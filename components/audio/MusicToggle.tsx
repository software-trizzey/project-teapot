"use client";

import { cva } from "class-variance-authority";
import { Music } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

import { clamp, cn } from "@/lib/utils";

import { useBackgroundMusic } from "./BackgroundMusicProvider";

const buttonVariants = cva(
  "cursor-pointer flex h-11 w-11 items-center justify-center rounded-xl border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/60",
  {
    variants: {
      isOn: {
        true: "border-amber-300/70 bg-amber-200/10 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.35)]",
        false: "border-white/15 bg-black/50 text-white/70 hover:border-white/30 hover:text-white",
      },
    },
    defaultVariants: {
      isOn: false,
    },
  }
);

interface MusicToggleRootProps {
  children: ReactNode;
  className?: string;
}

function MusicToggleRoot({ children, className }: MusicToggleRootProps) {
  return (
    <div className={cn("pointer-events-auto relative flex items-center", className)}>
      {children}
    </div>
  );
}

function MusicToggleButton() {
  const { isOn, toggleAudio } = useBackgroundMusic();

  return (
    <button
      type="button"
      onClick={toggleAudio}
      title="Toggle music"
      aria-label="Toggle background music"
      className={buttonVariants({ isOn })}
    >
      <Music className="h-4 w-4" />
    </button>
  );
}

function MusicToggleMarquee() {
  const { isOn, track } = useBackgroundMusic();

  if (!isOn) return null;

  const trackLabel = `${track.title} - ${track.artist}`;
  const marqueeWidth = clamp(trackLabel.length + 4, 18, 20);
  const marqueeStyle = {
    "--music-marquee-width": `${marqueeWidth}ch`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "music-marquee pointer-events-none absolute right-full mr-3 rounded-full hidden sm:block",
        "border border-amber-200/40 bg-black/60 px-3 py-1.5",
        "text-[11px] font-medium text-amber-100/80"
      )}
      aria-live="polite"
      style={marqueeStyle}
    >
      <div className="music-marquee__track">
        <span>{trackLabel}</span>
        <span aria-hidden="true">{trackLabel}</span>
      </div>
    </div>
  );
}

const MusicToggle = Object.assign(MusicToggleRoot, {
  Root: MusicToggleRoot,
  Button: MusicToggleButton,
  Marquee: MusicToggleMarquee,
});

export default function DefaultMusicToggle() {
  return (
    <MusicToggle.Root>
    <MusicToggle.Marquee />
    <MusicToggle.Button />
  </MusicToggle.Root>
  );
}