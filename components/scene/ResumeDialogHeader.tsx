"use client";

import { Dialog } from "@/components/dialog";

type ResumeDialogHeaderProps = {
  prompt: string;
  speaker: string;
  ctaLabel?: string;
  animatePrompt: boolean;
  isChaosError: boolean;
  onPromptComplete: () => void;
};

export default function ResumeDialogHeader({
  prompt,
  speaker,
  ctaLabel,
  animatePrompt,
  isChaosError,
  onPromptComplete,
}: ResumeDialogHeaderProps) {
  return (
    <Dialog.Header
      speaker={speaker}
      prompt={prompt}
      label={ctaLabel}
      animatePrompt={animatePrompt}
      typingSpeedMs={isChaosError ? 48 : undefined}
      typingDelayMs={isChaosError ? 4000 : undefined}
      onPromptComplete={onPromptComplete}
    />
  );
}
