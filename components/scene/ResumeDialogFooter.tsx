"use client";

import { Dialog } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import type { DialogOption, DialogStateConfig, DialogStateId } from "@/lib";

type ResumeDialogFooterProps = {
  activeState: DialogStateId;
  stateConfig: DialogStateConfig;
  errorOptions: DialogOption[];
  onOptionSelect: (option: DialogOption) => void;
  selectOptionHint: (count: number, suffix?: string) => string;
};

export default function ResumeDialogFooter({
  activeState,
  stateConfig,
  errorOptions,
  onOptionSelect,
  selectOptionHint,
}: ResumeDialogFooterProps) {
  if (activeState === "results") {
    return (
      <Dialog.Footer>
        {stateConfig.options.map((option: DialogOption) => (
          <Button
            key={option.id}
            variant="primary"
            onClick={() => onOptionSelect(option)}
          >
            {option.label}
          </Button>
        ))}
        {stateConfig.options.length > 0 && (
          <Dialog.Hint>
            <span>
              {selectOptionHint(stateConfig.options.length, "to select option")}
            </span>
          </Dialog.Hint>
        )}
      </Dialog.Footer>
    );
  }

  if (activeState === "error") {
    return (
      <Dialog.Footer>
        {errorOptions.map((option) => (
          <Button
            key={option.id}
            variant={
              option.id === "retry-scan" || errorOptions.length === 1
                ? "primary"
                : "secondary"
            }
            onClick={() => onOptionSelect(option)}
          >
            {option.label}
          </Button>
        ))}
        {errorOptions.length > 0 && (
          <Dialog.Hint>
            <span>
              {selectOptionHint(errorOptions.length, "to select option")}
            </span>
          </Dialog.Hint>
        )}
      </Dialog.Footer>
    );
  }

  return null;
}
