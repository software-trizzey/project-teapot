"use client";

import { useMemo } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sheet";
import { Results } from "@/components/dialog";
import { SAMPLE_RESUME_TEXT } from "@/lib/review-service/constants";
import { parseResumeText } from "@/lib/services/resume-parser";
import type { ReviewResult } from "@/lib/reviewService";

import type { SampleResume } from "./dialog-data";

type ResumeDialogSidebarProps = {
  sidebar: {
    open: boolean;
    mode: "sample" | "results" | null;
    sampleId?: string;
  };
  reviewResult: ReviewResult | null;
  samples: SampleResume[];
  onStartSampleScan: (sampleId: string) => void;
  onOpenChange: (open: boolean) => void;
};

export default function ResumeDialogSidebar({
  sidebar,
  reviewResult,
  samples,
  onStartSampleScan,
  onOpenChange,
}: ResumeDialogSidebarProps) {
  const sample = useMemo(() => {
    if (sidebar.mode !== "sample" || !sidebar.sampleId) {
      return null;
    }
    return samples.find((resume) => resume.id === sidebar.sampleId) ?? null;
  }, [samples, sidebar.mode, sidebar.sampleId]);

  const parsedResume = useMemo(() => {
    if (!sample) {
      return null;
    }
    const resumeText = SAMPLE_RESUME_TEXT[sample.id];
    return resumeText ? parseResumeText(resumeText) : null;
  }, [sample]);

  return (
    <Sidebar.Root open={sidebar.open} onOpenChange={onOpenChange}>
      {sidebar.mode === "sample" && sample && (
        <>
          <Sidebar.Header>
            <div className="flex items-start gap-3">
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
              <div className="flex-1">
                <Sidebar.Title>{sample.name}</Sidebar.Title>
                <Sidebar.Description>{sample.summary}</Sidebar.Description>
              </div>
            </div>
          </Sidebar.Header>

          <Sidebar.Content>
            {parsedResume?.sections.length ? (
              parsedResume.sections.map((section, sectionIndex) => (
                <div key={`${section.header}-${sectionIndex}`}>
                  <h4 className="mb-1 text-xs uppercase tracking-[0.2em] text-amber-200/70">
                    {section.header}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/80 whitespace-pre-line">
                    {section.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/70">
                No extra details available for this sample yet.
              </p>
            )}
          </Sidebar.Content>

          <Sidebar.Footer>
            <Button
              autoFocus
              variant="primary"
              className="w-full"
              onClick={() => onStartSampleScan(sample.id)}
            >
              Start scan
            </Button>
          </Sidebar.Footer>
        </>
      )}

      {sidebar.mode === "results" && reviewResult && (
        <>
          <Sidebar.Header>
            <Sidebar.Title>Resume signal results</Sidebar.Title>
            <Sidebar.Description>{reviewResult.summary}</Sidebar.Description>
          </Sidebar.Header>
          <Sidebar.Content>
            <Results {...reviewResult} />
          </Sidebar.Content>
        </>
      )}
    </Sidebar.Root>
  );
}
