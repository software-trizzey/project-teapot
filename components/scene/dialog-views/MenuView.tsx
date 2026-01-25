"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/dialog";
import type { DialogOption } from "@/lib";

type MenuViewProps = {
  options: DialogOption[];
  onOptionClick: (option: DialogOption) => void;
  menuIndexOffset?: number;
  hintText?: string;
};

export default function MenuView({
  options,
  onOptionClick,
  menuIndexOffset = 0,
  hintText,
}: MenuViewProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 justify-items-start">
        {options.map((option, index) => {
          const label = `${index + 1 + menuIndexOffset}. ${option.label}`;

          return (
            <Button
              key={option.id}
              variant="menu"
              size="menu"
              onClick={() => onOptionClick(option)}
            >
              {label}
            </Button>
          );
        })}
      </div>
      {options.length > 0 && hintText && (
        <Dialog.Hint>
          <span>
            {hintText}
          </span>
        </Dialog.Hint>
      )}
    </div>
  );
}
