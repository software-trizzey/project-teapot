"use client";

import { Dialog } from "@/components/dialog";
import { Button } from "@/components/ui/button";

type WelcomeViewProps = {
  onOpenMenu: () => void;
  hintText: string;
};

export default function WelcomeView({ onOpenMenu, hintText }: WelcomeViewProps) {
  return (
    <Dialog.Hint className="pointer-events-auto">
      <Button variant="ghost" size="sm" onClick={onOpenMenu}>
        {hintText}
      </Button>
    </Dialog.Hint>
  );
}
