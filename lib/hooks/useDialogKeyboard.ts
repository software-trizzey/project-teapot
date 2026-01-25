"use client";

import { useEffect } from "react";
import type { DialogStateId } from "@/lib";

type KeyboardOptions = {
  activeState: DialogStateId;
  isOpen: boolean;
  onSpacePress?: () => void;
  onNumberPress?: (index: number) => void;
  optionsCount?: number;
};

export function useDialogKeyboard({
  activeState,
  isOpen,
  onSpacePress,
  onNumberPress,
  optionsCount = 0,
}: KeyboardOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && activeState === "welcome" && onSpacePress) {
        event.preventDefault();
        onSpacePress();
        return;
      }

      if (onNumberPress && optionsCount > 0) {
        const keyNum = Number(event.key);
        if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= optionsCount) {
          const index = keyNum - 1;
          event.preventDefault();
          onNumberPress(index);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeState, isOpen, onSpacePress, onNumberPress, optionsCount]);
}
