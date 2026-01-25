export type ResultsProps = {
  score: number;
  summary: string;
  highlights: string[];
  improvements: string[];
  humor: string;
};

export default function Results({
  score,
  summary,
  highlights,
  improvements,
  humor,
}: ResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-4">
        <span className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">
          Resume signal
        </span>
        <span className="text-3xl font-semibold text-white">{score}/100</span>
      </div>
      <p className="text-base text-white/80">{summary}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Strengths
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {highlights.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.25em] text-white/50">
            Level-up ideas
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {improvements.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>
      <p className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
        {humor}
      </p>
    </div>
  );
}
