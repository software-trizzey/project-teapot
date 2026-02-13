"use client";

import { Dialog, Scanner } from "@/components/dialog";
import type { DialogOption, DialogStateConfig } from "@/lib";
import type { DialogState } from "@/lib/dialogState";

import MenuView from "./dialog-views/MenuView";
import OptionListView from "./dialog-views/OptionListView";
import UploadView from "./dialog-views/UploadView";
import WelcomeView from "./dialog-views/WelcomeView";
import type { ResumeSourceOption } from "./dialog-data";

type ResumeDialogContentProps = {
  state: DialogState;
  stateConfig: DialogStateConfig;
  sourceOptions: ResumeSourceOption[];
  openMenuHint: string;
  selectOptionHint: (count: number, suffix?: string) => string;
  onOpenMenu: () => void;
  onBackToMenu: () => void;
  onSourceOptionSelect: (optionId: string) => void;
  onFileSelect: (file: File | null) => File | null;
  onStartScan: (file?: File | null) => void;
  onClearFile: () => void;
  onMenuOption: (option: DialogOption) => void;
};

export default function ResumeDialogContent({
  state,
  stateConfig,
  sourceOptions,
  openMenuHint,
  selectOptionHint,
  onOpenMenu,
  onBackToMenu,
  onSourceOptionSelect,
  onFileSelect,
  onStartScan,
  onClearFile,
  onMenuOption,
}: ResumeDialogContentProps) {
  return (
    <Dialog.Content>
      {state.id === "welcome" && (
        <WelcomeView onOpenMenu={onOpenMenu} hintText={openMenuHint} />
      )}

      {state.id === "scanning" && (
        <Scanner
          headline="Scanning resume signal"
          detail="The scanner is powering up. Parsing your resume now."
        />
      )}

      {state.id === "sample-list" && (
        <OptionListView
          options={sourceOptions}
          selectedOptionId={state.selectedSampleId}
          onOptionSelect={onSourceOptionSelect}
          onBack={onBackToMenu}
          hintText={selectOptionHint(sourceOptions.length)}
        />
      )}

      {state.id === "results" && state.reviewResult && (
        <p className="text-sm text-white/70">
          Review ready — check the sidebar for the full report.
        </p>
      )}

      {state.id === "upload-ready" && (
        <UploadView
          resumeFile={state.resumeFile}
          uploadError={state.uploadError}
          isUploading={state.isUploading}
          onFileSelect={onFileSelect}
          onStartScan={onStartScan}
          onBack={onBackToMenu}
          onClearFile={onClearFile}
        />
      )}

      {(state.id === "menu" || state.id === "what" || state.id === "privacy") && (
        <MenuView
          options={stateConfig.options}
          onOptionClick={onMenuOption}
          hintText={selectOptionHint(stateConfig.options.length)}
        />
      )}
    </Dialog.Content>
  );
}
