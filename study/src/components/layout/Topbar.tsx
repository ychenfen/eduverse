import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  Bot,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { knowledgeNodes } from "@/data/course";
import { agents } from "@/data/agents";
import { navigationItems, pageNames } from "./navigation";

interface TopbarProps {
  onMenuClick?: () => void;
  menuOpen?: boolean;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  group: "页面" | "知识点" | "资源" | "智能体";
  to: string;
}

const notifications = [
  { title: "今日学习计划待完成", detail: "还有 3 个任务，预计 45 分钟", to: "/plan", color: "text-aurum-400" },
  { title: "画像已更新至最新版本", detail: "兴趣方向与目标导向有所提升", to: "/profile", color: "text-azure-400" },
  { title: "薄弱点诊断已生成", detail: "建议优先复习启发式搜索", to: "/assessment", color: "text-vermilion-400" },
];

export default function Topbar({ onMenuClick, menuOpen = false }: TopbarProps) {
  const theme = useAppStore((state) => state.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const resources = useAppStore((state) => state.resources);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pageName = pageNames[location.pathname] || "智学灵境";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
        setNotificationsOpen(false);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const frame = requestAnimationFrame(() => searchInputRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [searchOpen]);

  const searchableItems = useMemo<SearchResult[]>(() => [
    ...navigationItems.map((item) => ({
      id: `page-${item.to}`,
      title: item.label,
      description: item.description,
      group: "页面" as const,
      to: item.to,
    })),
    ...knowledgeNodes.map((node) => ({
      id: `knowledge-${node.id}`,
      title: node.title,
      description: `第 ${node.chapter} 章 · ${node.summary}`,
      group: "知识点" as const,
      to: `/assessment?knowledge=${encodeURIComponent(node.id)}`,
    })),
    ...resources.map((resource) => ({
      id: `resource-${resource.id}`,
      title: resource.title,
      description: resource.excerpt,
      group: "资源" as const,
      to: `/library?resource=${encodeURIComponent(resource.id)}`,
    })),
    ...agents.map((agent) => ({
      id: `agent-${agent.id}`,
      title: agent.name,
      description: `${agent.role} · ${agent.desc}`,
      group: "智能体" as const,
      to: "/workshop",
    })),
  ], [resources]);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("zh-CN");
    const source = normalized
      ? searchableItems.filter((item) => `${item.title} ${item.description} ${item.group}`.toLocaleLowerCase("zh-CN").includes(normalized))
      : searchableItems.filter((item) => item.group === "页面");
    return source.slice(0, normalized ? 10 : 6);
  }, [query, searchableItems]);

  const openSearch = () => {
    setSearchOpen(true);
    setNotificationsOpen(false);
  };

  const selectResult = (result: SearchResult) => {
    navigate(result.to);
    setSearchOpen(false);
    setQuery("");
  };

  const iconForGroup = (group: SearchResult["group"]) => {
    if (group === "知识点") return BookOpen;
    if (group === "资源") return FileText;
    if (group === "智能体") return Bot;
    return ChevronRight;
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[var(--card-border)] bg-[var(--card)] px-3 backdrop-blur-xl sm:px-4 lg:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--fg-muted)] hover:bg-[var(--card)] hover:text-[var(--fg)] lg:hidden"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex min-w-0 items-center gap-1.5 text-sm" aria-label="面包屑">
          <Link to="/" className="hidden text-[var(--fg-muted)] hover:text-[var(--fg)] sm:inline">智学灵境</Link>
          <ChevronRight className="hidden h-3.5 w-3.5 text-[var(--fg-muted)]/50 sm:block" />
          <span className="truncate font-serif font-semibold text-[var(--fg)]">{pageName}</span>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={openSearch}
            className="group hidden h-9 w-64 items-center rounded-full border border-[var(--card-border)] bg-[var(--surface-input)] px-3 text-left text-sm text-[var(--fg-muted)] transition-colors hover:border-azure-500/60 md:flex"
            aria-label="打开全局搜索"
          >
            <Search className="mr-2 h-4 w-4" />
            <span className="truncate">搜索知识点 / 资源 / 智能体…</span>
            <kbd className="ml-auto rounded bg-[var(--card)] px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </button>
          <button type="button" onClick={openSearch} className="rounded-full p-2 hover:bg-[var(--card)] md:hidden" aria-label="搜索">
            <Search className="h-5 w-5" />
          </button>

          <button type="button" onClick={toggleTheme} className="rounded-full p-2 hover:bg-[var(--card)]" aria-label={`切换为${theme === "dark" ? "浅色" : "深色"}主题`}>
            {theme === "dark" ? <Sun className="h-5 w-5 text-aurum-400" /> : <Moon className="h-5 w-5 text-amethyst-500" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setSearchOpen(false);
              }}
              className="relative rounded-full p-2 hover:bg-[var(--card)]"
              aria-label="查看通知"
              aria-expanded={notificationsOpen}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-vermilion-500 ring-2 ring-[var(--bg)]" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-1rem))] overflow-hidden rounded-card border border-[var(--card-border)] bg-[var(--surface-popover)] shadow-float backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-3">
                  <div>
                    <div className="font-serif text-sm font-semibold">学习动态</div>
                    <div className="text-[10px] text-[var(--fg-muted)]">3 条待处理提醒</div>
                  </div>
                  <button type="button" onClick={() => setNotificationsOpen(false)} className="rounded-full p-1 text-[var(--fg-muted)] hover:bg-[var(--card)]" aria-label="关闭通知">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-2">
                  {notifications.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        navigate(item.to);
                        setNotificationsOpen(false);
                      }}
                      className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-[var(--card)]"
                    >
                      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--card)]", item.color)}>
                        {index === 0 ? <Clock3 className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-[var(--fg)]">{item.title}</span>
                        <span className="mt-0.5 block text-[10px] leading-relaxed text-[var(--fg-muted)]">{item.detail}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-jade-500/30 bg-jade-500/10 px-2.5 py-1 text-xs text-jade-400 sm:flex">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade-400" />编队在线
          </div>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink-950/75 px-3 pt-[10vh] backdrop-blur-md" role="dialog" aria-modal="true" aria-label="全局搜索" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--surface-popover)] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[var(--card-border)] px-4">
              <Search className="h-5 w-5 shrink-0 text-azure-400" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && searchResults[0]) selectResult(searchResults[0]);
                }}
                placeholder="搜索页面、知识点、资源或智能体…"
                className="h-14 flex-1 bg-transparent text-sm text-[var(--fg)] outline-none placeholder:text-[var(--fg-muted)]"
                aria-label="搜索内容"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="rounded-lg border border-[var(--card-border)] px-2 py-1 text-[10px] text-[var(--fg-muted)] hover:text-[var(--fg)]" aria-label="关闭搜索">ESC</button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 pb-2 pt-1 text-[10px] font-medium tracking-[0.18em] text-[var(--fg-muted)]">
                {query.trim() ? `${searchResults.length} 条匹配结果` : "快速导航"}
              </div>
              {searchResults.length > 0 ? searchResults.map((result) => {
                const ResultIcon = iconForGroup(result.group);
                return (
                  <button key={result.id} type="button" onClick={() => selectResult(result)} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-[var(--card)]">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-azure-400"><ResultIcon className="h-4 w-4" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2"><span className="truncate text-sm font-medium text-[var(--fg)]">{result.title}</span><span className="rounded-full bg-[var(--card)] px-2 py-0.5 text-[9px] text-[var(--fg-muted)]">{result.group}</span></span>
                      <span className="mt-0.5 block truncate text-xs text-[var(--fg-muted)]">{result.description}</span>
                    </span>
                    <ChevronRight className="h-4 w-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5" />
                  </button>
                );
              }) : (
                <div className="px-4 py-12 text-center"><Search className="mx-auto h-8 w-8 text-[var(--fg-muted)]/40" /><p className="mt-3 text-sm text-[var(--fg-muted)]">没有找到“{query}”</p><p className="mt-1 text-xs text-[var(--fg-muted)]/70">试试知识点名称、资源类型或智能体角色</p></div>
              )}
            </div>
            <div className="flex items-center gap-4 border-t border-[var(--card-border)] px-4 py-2 text-[10px] text-[var(--fg-muted)]"><span>↵ 打开首项</span><span>ESC 关闭</span><span className="ml-auto">覆盖 {knowledgeNodes.length} 个知识点 · {resources.length} 份资源</span></div>
          </div>
        </div>
      )}
    </>
  );
}
