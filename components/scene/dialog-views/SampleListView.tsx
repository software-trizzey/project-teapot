"use client";

import Image from "next/image";

import { Dialog } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import type { ResumeSourceOption } from "@/components/scene/dialog-data";

type SampleListViewProps = {
  options: ResumeSourceOption[];
  selectedOptionId: string | null;
  onOptionSelect: (optionId: string) => void;
  hintText?: string;
};

type SampleListItemProps = {
  option: ResumeSourceOption;
  index: number;
  isSelected: boolean;
  onClick: (option: ResumeSourceOption) => void;
};

function SampleListItem({ option, index, isSelected, onClick }: SampleListItemProps) {
  const isChaos = option.id === "sample-chaos";
  const isUpload = option.kind === "upload";
  const baseClasses =
    "relative flex flex-col items-start min-h-[150px] p-4 text-left transition-all w-full whitespace-normal";
  const selectedClasses = isChaos
    ? "border-rose-400/70 bg-rose-500/15 text-white"
    : isUpload
      ? "border-emerald-300/80 bg-emerald-400/15 text-white"
      : "border-cyan-400/70 bg-cyan-400/10 text-white";
  const idleClasses = isChaos
    ? "border-rose-400/40 bg-rose-500/5 text-rose-100/80 hover:border-rose-300/70"
    : isUpload
      ? "border-emerald-300/35 bg-emerald-400/5 text-emerald-100/80 hover:border-emerald-200/70"
      : "border-white/10 bg-white/5 text-white/70 hover:border-white/20";
  return (
    <Button
      variant="outline"
      className={cn(baseClasses, isSelected ? selectedClasses : idleClasses)}
      onClick={() => onClick(option)}
    >
      <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
        {index + 1}
      </span>
      <div className="flex w-full items-start gap-3">
        {option.iconSrc && (
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
            <Image
              src={option.iconSrc}
              alt={`${option.name} icon`}
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pr-8">
          <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
            {option.name}
          </p>
          <p className="mt-2 text-xs text-white/60 line-clamp-3 leading-relaxed">
            {option.summary}
          </p>
        </div>
      </div>
    </Button>
  );
}

export default function SampleListView({
  options,
  selectedOptionId,
  onOptionSelect,
  hintText,
}: SampleListViewProps) {
  const handleOptionClick = (option: ResumeSourceOption) => {
    onOptionSelect(option.id);
  };

  return (
    <div className="space-y-4 scrollbar-hide">
      <div className="grid gap-3 md:grid-cols-3">
        {options.map((option, index) => (
          <SampleListItem
            key={option.id}
            index={index}
            option={option}
            isSelected={selectedOptionId === option.id}
            onClick={handleOptionClick}
          />
        ))}
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
