"use client";

import Image from "next/image";

import { Dialog } from "@/components/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";

type Sample = {
  id: string;
  name: string;
  summary: string;
  iconSrc?: string;
};

type SampleListViewProps = {
  samples: Sample[];
  selectedSampleId: string | null;
  onSampleSelect: (sampleId: string) => void;
  hintText?: string;
};

type SampleListItemProps = {
  sample: Sample;
  index: number;
  isSelected: boolean;
  onClick: (sample: Sample) => void;
};

function SampleListItem({ sample, index, isSelected, onClick }: SampleListItemProps) {
  const isChaos = sample.id === "sample-chaos";
  const baseClasses =
    "relative flex flex-col items-start min-h-[150px] p-4 text-left transition-all w-full whitespace-normal";
  const selectedClasses = isChaos
    ? "border-rose-400/70 bg-rose-500/15 text-white"
    : "border-cyan-400/70 bg-cyan-400/10 text-white";
  const idleClasses = isChaos
    ? "border-rose-400/40 bg-rose-500/5 text-rose-100/80 hover:border-rose-300/70"
    : "border-white/10 bg-white/5 text-white/70 hover:border-white/20";
  return (
    <Button
      variant="outline"
      className={cn(baseClasses, isSelected ? selectedClasses : idleClasses)}
      onClick={() => onClick(sample)}
    >
      <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200/80">
        {index + 1}
      </span>
      <div className="flex w-full items-start gap-3">
        {sample.iconSrc && (
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/10">
            <Image
              src={sample.iconSrc}
              alt={`${sample.name} icon`}
              width={32}
              height={32}
              className="h-8 w-8"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 pr-8">
          <p className="text-sm font-semibold text-white line-clamp-2 leading-snug">
            {sample.name}
          </p>
          <p className="mt-2 text-xs text-white/60 line-clamp-3 leading-relaxed">
            {sample.summary}
          </p>
        </div>
      </div>
    </Button>
  );
}

export default function SampleListView({
  samples,
  selectedSampleId,
  onSampleSelect,
  hintText,
}: SampleListViewProps) {
  const handleSampleClick = (sample: Sample) => {
    onSampleSelect(sample.id);
  };

  return (
    <div className="space-y-4 scrollbar-hide">
      <div className="grid gap-3 md:grid-cols-3">
        {samples.map((sample, index) => (
          <SampleListItem
            key={sample.id}
            index={index}
            sample={sample}
            isSelected={selectedSampleId === sample.id}
            onClick={handleSampleClick}
          />
        ))}
      </div>
      {samples.length > 0 && hintText && (
        <Dialog.Hint>
          <span>
            {hintText}
          </span>
        </Dialog.Hint>
      )}
    </div>
  );
}
