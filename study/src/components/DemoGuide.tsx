import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Maximize2, Minimize2, Trophy, X } from "lucide-react";

const demoRoute = [
  { to: "/profile", label: "画像证据", time: "35 秒", action: "查看六维画像、版本与抽取依据" },
  { to: "/workshop", label: "编队生成", time: "55 秒", action: "选一个主题，现场观看多智能体协作" },
  { to: "/path", label: "路径解释", time: "30 秒", action: "点击 Transformer，查看个性化推荐理由" },
  { to: "/practice", label: "专项练习", time: "40 秒", action: "完成一道练习，查看解析与记录回流" },
  { to: "/assessment", label: "效果闭环", time: "20 秒", action: "查看掌握度、薄弱点和自适应建议" },
] as const;

export default function DemoGuide() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const demoActive = new URLSearchParams(location.search).get("demo") === "1";
  const currentIndex = demoRoute.findIndex((step) => step.to === location.pathname);

  if (!demoActive || currentIndex < 0) return null;

  const current = demoRoute[currentIndex];
  const next = demoRoute[currentIndex + 1];

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-aurum-500/35 bg-[var(--surface-popover)] px-4 py-2.5 text-xs font-semibold text-[var(--fg)] shadow-2xl backdrop-blur-xl"
        aria-label="展开决赛演示向导"
      >
        <Trophy className="h-4 w-4 text-aurum-400" />
        决赛演示 {currentIndex + 1}/{demoRoute.length}
        <Maximize2 className="h-3.5 w-3.5 text-[var(--fg-muted)]" />
      </button>
    );
  }

  return (
    <aside
      className="fixed bottom-3 left-3 right-3 z-50 overflow-hidden rounded-2xl border border-aurum-500/35 bg-[var(--surface-popover)] shadow-2xl backdrop-blur-2xl sm:bottom-5 sm:left-auto sm:right-5 sm:w-[25rem]"
      aria-label="决赛演示向导"
      aria-live="polite"
    >
      <div className="h-1 bg-[var(--surface-input)]">
        <div
          className="h-full bg-gradient-to-r from-vermilion-500 via-aurum-500 to-azure-500 transition-[width] duration-500"
          style={{ width: `${((currentIndex + 1) / demoRoute.length) * 100}%` }}
        />
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aurum-500/10 text-aurum-400">
            <Trophy className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[10px] font-semibold tracking-[0.16em] text-aurum-400">FINAL DEMO {currentIndex + 1}/{demoRoute.length}</span>
              <span className="text-[10px] text-[var(--fg-muted)]">{current.time}</span>
            </div>
            <h2 className="mt-1 font-serif text-base font-bold text-[var(--fg)]">{current.label}</h2>
          </div>
          <button type="button" onClick={() => setCollapsed(true)} className="rounded-lg p-1.5 text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]" aria-label="收起演示向导"><Minimize2 className="h-3.5 w-3.5" /></button>
          <button type="button" onClick={() => navigate("/showcase")} className="rounded-lg p-1.5 text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]" aria-label="退出演示向导"><X className="h-3.5 w-3.5" /></button>
        </div>
        <p className="mt-3 text-xs leading-5 text-[var(--fg-muted)]">{current.action}</p>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-1.5" aria-hidden="true">
            {demoRoute.map((step, index) => (
              <span key={step.to} className={`h-1.5 flex-1 rounded-full ${index <= currentIndex ? "bg-aurum-400" : "bg-[var(--card-border)]"}`} />
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate(next ? `${next.to}?demo=1` : "/showcase")}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-aurum-500 px-3.5 py-2 text-[11px] font-semibold text-ink-950 transition-colors hover:bg-aurum-400"
          >
            {next ? `下一步·${next.label}` : "完成演示"}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
