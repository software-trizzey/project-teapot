"use client";

import { cn } from "@/lib/helpers";

import type { ScenePhase } from "@/lib";

export type HudProps = {
  phase: ScenePhase;
  className?: string;
};

const PHASE_LABELS: Record<ScenePhase, string> = {
  boot: "Booting",
  greeting: "Greeting",
  idle: "Awaiting resume",
  scanning: "Scanning",
  reviewing: "Reviewing",
  complete: "Complete",
  error: "Error",
};

export default function Hud({ phase, className }: HudProps) {
  return (
    <div
      className={cn(
        "pointer-events-none flex items-center gap-3 rounded-full bg-black/50 px-4 py-2",
        "text-xs uppercase tracking-[0.2em] text-white/80 backdrop-blur",
        className
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          phase === "error" ? "bg-rose-400" : "bg-emerald-400"
        )}
      />
      <span>{PHASE_LABELS[phase]}</span>
    </div>
  );
}
