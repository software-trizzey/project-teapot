"use client";

import { cn } from "@/lib/utils";

import type { DialogStateId, ScenePhase } from "@/lib";

export type HotspotsProps = {
  dialogState: DialogStateId;
  isDialogOpen: boolean;
  phase: ScenePhase;
  onOpenResumeDialog: () => void;
};

export default function Hotspots({
  dialogState,
  isDialogOpen,
  phase,
  onOpenResumeDialog,
}: HotspotsProps) {
  const isBusy = phase === "scanning" || phase === "reviewing";
  const isHotspotVisible = dialogState === "welcome" || !isDialogOpen;
  const isHotspotInteractive = isHotspotVisible && !isBusy;
  const shouldPulse =
    isHotspotVisible &&
    !isBusy &&
    (dialogState === "welcome" || phase === "idle" || phase === "greeting");

  return (
    <>
      <button
        type="button"
        aria-label="Activate resume scanner"
        className={cn(
          "scanner-hotspot absolute left-[28%] top-[63.5%] h-[19%] w-[44%] transition",
          "after:absolute after:left-1/2 after:top-[-8px] after:h-0 after:w-0 after:-translate-x-1/2 after:border-l-[6px]",
          "after:border-r-[6px] after:border-t-[8px] after:border-l-transparent after:border-r-transparent",
          "after:border-t-yellow-400/90 after:opacity-0 after:transition-opacity",
          isHotspotInteractive ? "cursor-pointer hover:after:opacity-100 hover:after:animate-[bounce-arrow_0.6s_ease-in-out_infinite]" : "pointer-events-none",
          isHotspotVisible ? "opacity-100" : "opacity-0",
          shouldPulse && "scanner-hotspot--pulse"
        )}
        onClick={() => {
          if (!isHotspotInteractive) {
            return;
          }
          onOpenResumeDialog();
        }}
      />
    </>
  );
}
