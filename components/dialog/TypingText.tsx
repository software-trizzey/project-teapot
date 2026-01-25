"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TypingTextProps = {
  text: string;
  className?: string;
  speedMs?: number;
  startDelayMs?: number;
  onComplete?: () => void;
};

const DEFAULT_SPEED_MS = 28;
const DEFAULT_DELAY_MS = 120;

export default function TypingText({
  text,
  className,
  speedMs = DEFAULT_SPEED_MS,
  startDelayMs = DEFAULT_DELAY_MS,
  onComplete,
}: TypingTextProps) {
  const [visibleText, setVisibleText] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (resetFrameRef.current) {
      window.cancelAnimationFrame(resetFrameRef.current);
      resetFrameRef.current = null;
    }

    hasCompletedRef.current = false;
    resetFrameRef.current = window.requestAnimationFrame(() => {
      setVisibleText("");
    });

    if (!text) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete?.();
      }
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      let index = 0;
      intervalRef.current = window.setInterval(() => {
        index += 1;
        setVisibleText(text.slice(0, index));
        if (index >= text.length) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
          }
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (resetFrameRef.current) {
        window.cancelAnimationFrame(resetFrameRef.current);
        resetFrameRef.current = null;
      }
    };
  }, [text, speedMs, startDelayMs, onComplete]);

  return (
    <p className={cn("whitespace-pre-line text-base text-white/80", className)}>
      {visibleText}
    </p>
  );
}
