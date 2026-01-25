import type { DialogStateConfig } from "@/lib";

export type WelcomeProps = {
  state: DialogStateConfig;
};

export default function Welcome({ state }: WelcomeProps) {
  return (
    <div className="space-y-6">
      <p className="text-base text-white/80">{state.prompt}</p>
      <div className="grid gap-3">
        {state.options.map((option) => (
          <div
            key={option.id}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70"
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
}
