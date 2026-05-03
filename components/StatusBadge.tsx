type StatusBadgeProps = {
  tone?: "idle" | "waiting" | "connected" | "error" | "complete";
  children: React.ReactNode;
};

const toneClass = {
  idle: "border-white/10 bg-white/5 text-mist",
  waiting: "border-sky-300/20 bg-sky-300/10 text-driftBlue",
  connected: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  error: "border-red-300/20 bg-red-300/10 text-red-200",
  complete: "border-violet-300/20 bg-violet-300/10 text-violet-200"
};

export function StatusBadge({ tone = "idle", children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${toneClass[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
