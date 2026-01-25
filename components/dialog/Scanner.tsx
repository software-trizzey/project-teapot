export type ScannerProps = {
  headline: string;
  detail: string;
};

export default function Scanner({ headline, detail }: ScannerProps) {
  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-white">{headline}</p>
      <p className="text-sm text-white/70">{detail}</p>
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
        <span className="text-xs uppercase tracking-[0.3em] text-white/50">
          Scanning in progress
        </span>
      </div>
    </div>
  );
}
