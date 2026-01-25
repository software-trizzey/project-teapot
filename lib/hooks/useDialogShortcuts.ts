"use client";

import { useCallback } from "react";

import type { DialogStateId } from "@/lib";
import { useDialogKeyboard } from "@/lib/hooks/useDialogKeyboard";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

type DialogShortcutsConfig = {
  activeState: DialogStateId;
  isOpen: boolean;
  optionsCount: number;
  onOpenMenu: () => void;
  onNumberPress: (index: number) => void;
};

export function useDialogShortcuts({
  activeState,
  isOpen,
  optionsCount,
  onOpenMenu,
  onNumberPress,
}: DialogShortcutsConfig) {
  const isTouchLayout = useMediaQuery("(max-width: 1024px)");

  useDialogKeyboard({
    activeState,
    isOpen,
    optionsCount,
    onSpacePress: onOpenMenu,
    onNumberPress,
  });

  const openMenuHint = isTouchLayout
    ? "Tap to open menu"
    : "Press SPACEBAR";

  const selectOptionHint = useCallback(
    (count: number, suffix = "to select") => {
      if (isTouchLayout) {
        return "Tap an option";
      }

      if (count <= 0) {
        return "";
      }

      const prefix = count === 1 ? "Press 1" : `Press 1-${count}`;
      return suffix ? `${prefix} ${suffix}` : prefix;
    },
    [isTouchLayout]
  );

  return {
    isTouchLayout,
    openMenuHint,
    selectOptionHint,
  };
}
