import { NavLink } from "react-router-dom";
import { RotateCcw, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { agents } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";
import { useAppStore } from "@/store/useAppStore";
import { navigationItems } from "./navigation";

interface SidebarProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

// 左侧导航栏 — 含智能体编队
export default function Sidebar({ mobile = false, onNavigate }: SidebarProps) {
  const learner = useAppStore((s) => s.learner);
  const setOnboarded = useAppStore((s) => s.setOnboarded);

  return (
    <aside
      aria-label="主导航"
      className={cn(
        "w-[260px] shrink-0 flex-col border-r border-[var(--card-border)] bg-[var(--card)] backdrop-blur-xl",
        mobile ? "flex h-full w-[min(86vw,320px)] shadow-2xl" : "hidden lg:flex",
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-[var(--card-border)] px-5 py-4">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-vermilion-500 via-aurum-500 to-azure-500">
          <Sparkles className="h-5 w-5 text-white" />
          <div className="absolute inset-0 animate-breathe rounded-xl bg-gradient-to-br from-vermilion-500 to-azure-500 opacity-40 blur-md" />
        </div>
        <div>
          <div className="font-serif text-lg font-bold text-gradient">智学灵境</div>
          <div className="text-[10px] tracking-widest text-[var(--fg-muted)]">EDUVERSE</div>
        </div>
        {mobile && (
          <button
            type="button"
            onClick={onNavigate}
            className="ml-auto rounded-full p-2 text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]"
            aria-label="关闭菜单"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* 导航 */}
      <nav className="flex flex-col gap-1 px-3 py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-card px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-gradient-to-r from-vermilion-500/15 to-azure-500/10 text-[var(--fg)] shadow-glow"
                    : "text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive && "text-vermilion-500",
                    )}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-vermilion-500" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* 智能体编队 */}
      <div className="mt-auto border-t border-[var(--card-border)] px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--fg-muted)]">智能体编队</span>
          <span className="rounded-chip bg-jade-500/15 px-1.5 py-0.5 text-[10px] text-jade-400">
            7 在线
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {agents.map((a) => (
            <div key={a.id} className="flex flex-col items-center gap-1">
              <AgentAvatar agent={a} size="sm" pulse={a.id === "captain"} />
              <span className="text-[10px] text-[var(--fg-muted)]">{a.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 学生卡片 */}
      <div className="border-t border-[var(--card-border)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 font-serif font-bold text-white">
            {learner.avatar}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-[var(--fg)]">
              {learner.name}
            </div>
            <div className="truncate text-[10px] text-[var(--fg-muted)]">
              {learner.grade}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setOnboarded(false);
              onNavigate?.();
            }}
            title="切换身份 / 重新构建画像"
            aria-label="切换身份或重新构建画像"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-muted)] transition-colors hover:bg-ink-700/50 hover:text-[var(--fg)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
