import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FileText,
  Network,
  ListChecks,
  BookOpen,
  Clapperboard,
  Code2,
  Search,
  Heart,
  Filter,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ResourceCard from "@/components/ResourceCard";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AnimationPlayer from "@/components/AnimationPlayer";
import MindmapViewer from "@/components/MindmapViewer";
import { useAppStore } from "@/store/useAppStore";
import { resourceTypeMeta } from "@/data/resources";
import { chapters } from "@/data/course";
import type { Resource, ResourceType } from "@/types";

const typeIcons: Record<ResourceType, LucideIcon> = {
  document: FileText,
  mindmap: Network,
  quiz: ListChecks,
  reading: BookOpen,
  animation: Clapperboard,
  code: Code2,
};

// 资源中心 — 瀑布流 + 类型/章节筛选 + 详情抽屉
export default function Library() {
  const resources = useAppStore((s) => s.resources);
  const [searchParams, setSearchParams] = useSearchParams();
  const [typeFilter, setTypeFilter] = useState<ResourceType | "all">("all");
  const [chapterFilter, setChapterFilter] = useState<number | "all">("all");
  const [keyword, setKeyword] = useState("");
  const [likedOnly, setLikedOnly] = useState(false);
  const [localSelection, setLocalSelection] = useState<Resource | null>(null);
  const linkedResourceId = searchParams.get("resource");
  const selected = linkedResourceId
    ? resources.find((resource) => resource.id === linkedResourceId) || null
    : localSelection;
  const effectiveKeyword = searchParams.get("q") ?? keyword;
  const isWideResource = selected?.type === "mindmap" || selected?.type === "animation";

  const closeSelected = useCallback(() => {
    setLocalSelection(null);
    const next = new URLSearchParams(searchParams);
    next.delete("resource");
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (!selected) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSelected();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeSelected, selected]);

  const openResource = (resource: Resource) => {
    setLocalSelection(resource);
    const next = new URLSearchParams(searchParams);
    next.set("resource", resource.id);
    setSearchParams(next, { replace: true });
  };

  // 章节推断：根据 knowledgeId 前缀
  const getChapter = (kid: string): number => {
    if (kid.startsWith("ai")) return 1;
    if (kid.startsWith("search")) return 2;
    if (kid.startsWith("kr")) return 3;
    if (kid.startsWith("ml")) return 4;
    if (kid.startsWith("dl")) return 5;
    if (kid.startsWith("llm")) return 6;
    return 0;
  };

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (chapterFilter !== "all" && getChapter(r.knowledgeId) !== chapterFilter) return false;
      if (effectiveKeyword && !r.title.toLowerCase().includes(effectiveKeyword.toLowerCase()) && !r.excerpt.includes(effectiveKeyword))
        return false;
      if (likedOnly && !r.liked) return false;
      return true;
    });
  }, [resources, typeFilter, chapterFilter, effectiveKeyword, likedOnly]);

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });
    return counts;
  }, [resources]);

  return (
    <div className="px-6 py-6 lg:px-10">
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">资源中心</h1>
        <p className="mt-1 text-sm text-[var(--fg-muted)]">
          共 {resources.length} 份多模态学习资源 · 6 类 · 24 知识点全覆盖
        </p>
      </div>

      {/* 筛选栏 */}
      <div className="mb-6 glass rounded-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
            <input
              value={effectiveKeyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                if (searchParams.has("q")) {
                  const next = new URLSearchParams(searchParams);
                  next.delete("q");
                  setSearchParams(next, { replace: true });
                }
              }}
              placeholder="搜索资源标题或摘要…"
              className="h-9 w-full rounded-full border border-[var(--card-border)] bg-ink-950/60 pl-9 pr-3 text-sm focus:border-azure-500 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setLikedOnly(!likedOnly)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs transition-colors",
              likedOnly
                ? "border-vermilion-500 bg-vermilion-500/15 text-vermilion-400"
                : "border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            <Heart className={cn("h-3.5 w-3.5", likedOnly && "fill-vermilion-500")} />
            收藏
          </button>

          <Filter className="h-4 w-4 text-[var(--fg-muted)]" />
        </div>

        {/* 类型筛选 */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={cn(
              "rounded-chip px-3 py-1 text-xs transition-colors",
              typeFilter === "all"
                ? "bg-gradient-to-r from-vermilion-500 to-azure-500 text-white"
                : "border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            全部 ({resources.length})
          </button>
          {(Object.keys(resourceTypeMeta) as ResourceType[]).map((t) => {
            const Icon = typeIcons[t];
            const meta = resourceTypeMeta[t];
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={cn(
                  "flex items-center gap-1.5 rounded-chip px-3 py-1 text-xs transition-colors",
                  active
                    ? "text-white"
                    : "border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
                )}
                style={active ? { background: meta.color } : undefined}
              >
                <Icon className="h-3 w-3" />
                {meta.label} ({typeCounts[t] || 0})
              </button>
            );
          })}
        </div>

        {/* 章节筛选 */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => setChapterFilter("all")}
            className={cn(
              "rounded-chip px-2.5 py-0.5 text-[11px] transition-colors",
              chapterFilter === "all"
                ? "bg-azure-500 text-white"
                : "border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            全部章节
          </button>
          {chapters.map((c) => (
            <button
              key={c.no}
              onClick={() => setChapterFilter(c.no)}
              className={cn(
                "rounded-chip px-2.5 py-0.5 text-[11px] transition-colors",
                chapterFilter === c.no
                  ? "text-white"
                  : "border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)]",
              )}
              style={chapterFilter === c.no ? { background: c.color } : undefined}
            >
              第{c.no}章
            </button>
          ))}
        </div>
      </div>

      {/* 瀑布流 */}
      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-[var(--card-border)] p-12 text-center text-sm text-[var(--fg-muted)]">
          未找到匹配资源，试试调整筛选条件。
        </div>
      ) : (
        <div className="resource-masonry">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.4) }}
              className="mb-4 break-inside-avoid"
              onClick={() => openResource(r)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openResource(r);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`打开资源：${r.title}`}
            >
              <ResourceCard resource={r} />
            </motion.div>
          ))}
        </div>
      )}

      {/* 详情模态框 */}
      <AnimatePresence>
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 backdrop-blur-md p-4 md:p-8"
          onClick={closeSelected}
          role="dialog"
          aria-modal="true"
          aria-labelledby="resource-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "h-[90vh] w-full overflow-hidden rounded-2xl border border-[var(--card-border)] bg-ink-900/95 shadow-2xl flex flex-col",
              // 正文类资源保持窄栏易读；思维导图和动画是图形，窄栏会把它们压到看不清
              isWideResource ? "max-w-6xl" : "max-w-3xl",
            )}
          >
            <div className="flex items-start justify-between px-6 py-4 border-b border-[var(--card-border)] flex-shrink-0">
              <div>
                <span
                  className="rounded-chip px-2 py-0.5 text-[10px]"
                  style={{
                    background: `${resourceTypeMeta[selected.type].color}20`,
                    color: resourceTypeMeta[selected.type].color,
                  }}
                >
                  {resourceTypeMeta[selected.type].label}
                </span>
                <h2 id="resource-dialog-title" className="mt-2 font-serif text-xl font-bold text-[var(--fg)]">
                  {selected.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeSelected}
                className="rounded-full p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60 transition-colors"
                aria-label="关闭资源详情"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className={cn("mx-auto space-y-4", isWideResource ? "max-w-5xl" : "max-w-2xl")}>
                {/* 动画资源：渲染播放器 */}
                {selected.type === "animation" && selected.metadata.animationScenes ? (
                  <>
                    <AnimationPlayer scenes={selected.metadata.animationScenes} />
                    <div className="rounded-card border border-[var(--card-border)] bg-ink-950/40 p-5">
                      <MarkdownRenderer content={selected.content} />
                    </div>
                  </>
                ) : selected.type === "mindmap" && selected.metadata.mindmap ? (
                  <>
                    <MindmapViewer key={selected.id} data={selected.metadata.mindmap} />
                    <div className="rounded-card border border-[var(--card-border)] bg-ink-950/40 p-5">
                      <MarkdownRenderer content={selected.content} />
                    </div>
                  </>
                ) : (
                  <div className="rounded-card border border-[var(--card-border)] bg-ink-950/40 p-5">
                    <MarkdownRenderer content={selected.content} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </div>
  );
}
