"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/helpers";
import { MAX_FILE_SIZE_BYTES, getPrettyFileSize } from "@/lib/services/resume-parser";

type UploadViewProps = {
  resumeFile: File | null;
  uploadError: string | null;
  isUploading: boolean;
  onFileSelect: (file: File | null) => File | null;
  onStartScan: (file?: File | null) => void;
  onBack: () => void;
  onClearFile: () => void;
};

export default function UploadView({
  resumeFile,
  uploadError,
  isUploading,
  onFileSelect,
  onStartScan,
  onBack,
  onClearFile,
}: UploadViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isDropDisabled = isUploading;

  const handleDragOver = (event: React.DragEvent) => {
    if (isDropDisabled) return;
    event.preventDefault();
  };

  const handleFileSelection = (file: File | null) => {
    if (!file) return null;
    if (uploadError || isUploading) return null;
    return onFileSelect(file);
  };

  const handleDrop = (event: React.DragEvent) => {
    if (isDropDisabled) return;
    event.preventDefault();
    const file = event.dataTransfer.files.item(0);
    const selectedFile = handleFileSelection(file);
    if (selectedFile) {
      onStartScan(selectedFile);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm text-white/70">
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-4 py-6 text-center transition",
            "border-white/20 text-white/70 hover:border-white/40",
            isDropDisabled && "opacity-70"
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">
            Drag & drop resume
          </p>
          <p className="text-sm text-white/70">
            PDF or DOCX only, up to {getPrettyFileSize(MAX_FILE_SIZE_BYTES)}.
          </p>
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            Choose a file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.item(0) ?? null;
              const selectedFile = handleFileSelection(file);
              if (selectedFile) {
                onStartScan(selectedFile);
              }
              event.currentTarget.value = "";
            }}
          />
        </div>

        {resumeFile && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
            <span className="truncate max-w-[200px]">Selected: {resumeFile.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFile}
              disabled={isUploading}
            >
              Clear
            </Button>
          </div>
        )}

        {uploadError && (
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-rose-200">
            {uploadError}
          </p>
        )}

        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="primary"
            onClick={() => onStartScan()}
            disabled={!resumeFile || isUploading}
            className="w-full sm:w-auto"
          >
            {isUploading ? "Uploading..." : "Start scan"}
          </Button>
          <Button
            variant="secondary"
            onClick={onBack}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            Back to menu
          </Button>
        </div>
      </div>
    </div>
  );
}
