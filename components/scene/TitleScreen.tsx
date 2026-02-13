"use client";

import { useCallback, useEffect, useState } from "react";

import TypingText from "@/components/dialog/TypingText";

type TitleScreenProps = {
  onContinue: () => void;
};

const TITLE_COPY =
  "After a month of production fires and 16-hour days, that \"cracked team\" promising $100M ARR feels different.\n\nYour gut says you're in the right place...";

export default function TitleScreen({ onContinue }: TitleScreenProps) {
  const [hasFinishedTyping, setHasFinishedTyping] = useState(false);
  const handleTypingComplete = useCallback(() => {
    setHasFinishedTyping(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      onContinue();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onContinue]);

  return (
    <button
      type="button"
      onClick={onContinue}
      className="group relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950 px-8 text-left text-white sm:px-14 lg:px-20"
      aria-label="Continue to resume review center"
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(34,211,238,0.1),transparent_40%)]"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col items-start animate-in fade-in duration-700">
        <TypingText
          text={TITLE_COPY}
          className="m-0 max-w-[72ch] text-xl leading-[1.45] text-white/90 italic sm:text-[2.75rem] sm:leading-[1.32]"
          speedMs={30}
          startDelayMs={220}
          onComplete={handleTypingComplete}
        />
        {hasFinishedTyping && (
          <p className="m-0 mt-8 text-xs uppercase tracking-[0.28em] text-amber-200/80 transition-opacity group-hover:opacity-100 sm:text-sm animate-soft-blink">
            Click or tap anywhere to continue
          </p>
        )}
      </div>
    </button>
  );
}
