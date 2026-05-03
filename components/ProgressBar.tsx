import { clamp } from "@/lib/utils";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const progress = clamp(value, 0, 100);

  return (
    <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
      <div
        className="h-full rounded-full bg-gradient-to-r from-driftBlue to-driftViolet transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
