"use client";

import React from "react";
import { cn } from "@/lib/utils";
import TypingText from "./TypingText";

type DialogProps = {
  children: React.ReactNode;
  className?: string;
};

function DialogRoot({ children, className }: DialogProps) {
  return (
    <div className="pointer-events-none fixed sm:absolute inset-x-0 bottom-6 sm:bottom-0 sm:translate-y-[45%] z-50 sm:z-20 flex justify-center px-4 sm:px-6">
      <div
        className={cn(
          "pointer-events-auto w-full max-w-[760px] max-h-[60vh] sm:max-h-[42vh] overflow-visible rounded-2xl border border-white/20 bg-slate-950/90 px-6 pb-6 pt-10 text-white shadow-[0_30px_80px_rgba(10,15,35,0.7)] backdrop-blur flex flex-col relative",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({
  speaker,
  prompt,
  label,
  animatePrompt,
  typingSpeedMs,
  typingDelayMs,
  onPromptComplete,
  className,
}: {
  speaker?: string;
  prompt?: string | React.ReactNode;
  label?: string;
  animatePrompt?: boolean;
  typingSpeedMs?: number;
  typingDelayMs?: number;
  onPromptComplete?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("relative mb-4", className)}>
      {speaker && (
        <div className="absolute -top-11 sm:-top-14 left-0">
          <span className="rounded-full border border-cyan-300/40 bg-slate-900/95 px-3 sm:px-4 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            {speaker}
          </span>
        </div>
      )}
      <div className="space-y-3">
        {prompt &&
          (typeof prompt === "string" ? (
            animatePrompt ? (
              <TypingText
                text={prompt}
                speedMs={typingSpeedMs}
                startDelayMs={typingDelayMs}
                onComplete={onPromptComplete}
              />
            ) : (
              <p className="whitespace-pre-line text-base text-white/80">{prompt}</p>
            )
          ) : (
            <p className="whitespace-pre-line text-base text-white/80">{prompt}</p>
          ))}
        {label && (
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}


function DialogContent({ children, className }: DialogProps) {
  return (
    <div className={cn("min-h-0 flex-1 overflow-y-auto pr-1", className)}>
      {children}
    </div>
  );
}

function DialogFooter({ children, className }: DialogProps) {
  return <div className={cn("mt-4 flex flex-wrap gap-3", className)}>{children}</div>;
}


function DialogHint({ children, className }: DialogProps) {
  return (
    <div
      className={cn(
        "absolute bottom-4 right-6 text-xs tracking-[0.3em] text-amber-200/80 pointer-events-none animate-soft-blink",
        className
      )}
    >
      {children}
    </div>
  );
}

export const Dialog = {
  Root: DialogRoot,
  Header: DialogHeader,
  Content: DialogContent,
  Footer: DialogFooter,
  Hint: DialogHint,
};
