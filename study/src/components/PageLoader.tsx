import { Sparkles } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6" role="status" aria-live="polite">
      <div className="text-center">
        <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-vermilion-500/30 bg-vermilion-500/10 text-vermilion-400">
          <Sparkles className="h-6 w-6 animate-pulse" />
          <span className="absolute -inset-2 animate-ping rounded-2xl border border-azure-500/20" />
        </div>
        <p className="mt-4 font-serif text-sm font-semibold text-[var(--fg)]">正在调度学习空间</p>
        <p className="mt-1 text-xs text-[var(--fg-muted)]">智能体编队正在准备页面…</p>
      </div>
    </div>
  );
}
