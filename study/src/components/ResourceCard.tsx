import { Link } from "react-router-dom";
import {
  FileText,
  Network,
  ListChecks,
  BookOpen,
  Clapperboard,
  Code2,
  Heart,
  Clock,
  Star,
  Quote,
  CheckCircle2,
  Play,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource, ResourceType } from "@/types";
import { resourceTypeMeta } from "@/data/resources";
import { useAppStore } from "@/store/useAppStore";

const iconMap: Record<ResourceType, LucideIcon> = {
  document: FileText,
  mindmap: Network,
  quiz: ListChecks,
  reading: BookOpen,
  animation: Clapperboard,
  code: Code2,
};

const colorMap: Record<ResourceType, string> = {
  document: "text-azure-400 border-azure-500/30",
  mindmap: "text-aurum-400 border-aurum-500/30",
  quiz: "text-amethyst-400 border-amethyst-500/30",
  reading: "text-jade-400 border-jade-500/30",
  animation: "text-cyan-300 border-cyan-400/30",
  code: "text-vermilion-400 border-vermilion-500/30",
};

interface Props {
  resource: Resource;
  compact?: boolean;
  onClick?: () => void;
}

// 资源卡 — 6 类多模态卡片化展示
export default function ResourceCard({ resource, compact = false, onClick }: Props) {
  const Icon = iconMap[resource.type];
  const meta = resourceTypeMeta[resource.type];
  const liked = useAppStore((s) => s.resources.find((r) => r.id === resource.id)?.liked);
  const likedResource = useAppStore((s) => s.likedResource);

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-3 rounded-card border bg-[var(--card)] p-4 backdrop-blur-md transition-all",
        "hover:-translate-y-1 hover:shadow-float hover:border-[var(--card-border)]",
        "border-[var(--card-border)]",
        onClick && "cursor-pointer",
      )}
    >
      {/* 顶部：类型 + 难度 */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-chip border px-2 py-1 text-xs font-medium",
            colorMap[resource.type],
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {meta.label}
        </span>
        <div className="flex items-center gap-2 text-xs text-[var(--fg-muted)]">
          {resource.metadata.difficulty && (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < (resource.metadata.difficulty || 0)
                      ? "fill-aurum-500 text-aurum-500"
                      : "text-[var(--fg-muted)]/30",
                  )}
                />
              ))}
            </span>
          )}
        </div>
      </div>

      {/* 标题 */}
      <h3 className="font-serif text-base font-semibold leading-snug text-[var(--fg)]">
        {resource.title}
      </h3>

      {/* 摘要 */}
      {!compact && (
        <p className="line-clamp-3 text-sm leading-relaxed text-[var(--fg-muted)]">
          {resource.excerpt}
        </p>
      )}

      {/* 代码片段预览 */}
      {resource.type === "code" && !compact && (
        <pre className="overflow-hidden rounded-chip bg-ink-950/80 p-2 text-[11px] leading-relaxed">
          <code className="font-mono text-jade-400">
            {resource.content.match(/```python\n([\s\S]*?)```/)?.[1]?.slice(0, 120) ||
              "# 代码片段预览"}
            …
          </code>
        </pre>
      )}

      {/* 思维导图迷你预览（思维导图卡） */}
      {resource.type === "mindmap" && !compact && (
        <div className="relative h-32 overflow-hidden rounded-chip border border-aurum-500/20 bg-gradient-to-br from-aurum-500/10 via-[var(--card)] to-azure-500/10">
          <svg viewBox="0 0 320 128" className="h-full w-full" aria-hidden="true">
            <g fill="none" stroke="currentColor" className="text-[var(--fg-muted)]" strokeOpacity="0.25">
              <path d="M160 64 L70 30 M160 64 L70 98 M160 64 L250 24 M160 64 L250 102" />
              <path d="M70 30 L28 18 M70 30 L32 50 M70 98 L28 78 M70 98 L34 116 M250 24 L292 16 M250 24 L290 48 M250 102 L292 82 M250 102 L288 118" />
            </g>
            <g fill="#F4A261">
              <circle cx="160" cy="64" r="14" opacity="0.9" />
              {["70,30", "70,98", "250,24", "250,102"].map((point) => {
                const [cx, cy] = point.split(",");
                return <circle key={point} cx={cx} cy={cy} r="8" opacity="0.7" />;
              })}
            </g>
            <g fill="#1B9AAA">
              {["28,18", "32,50", "28,78", "34,116", "292,16", "290,48", "292,82", "288,118"].map((point) => {
                const [cx, cy] = point.split(",");
                return <circle key={point} cx={cx} cy={cy} r="4" opacity="0.75" />;
              })}
            </g>
          </svg>
          <div className="absolute bottom-2 right-2 rounded-full bg-[var(--surface-popover)] px-2 py-1 text-[9px] text-[var(--fg-muted)] shadow-sm">
            {resource.metadata.nodeCount || 15} 节点 · 点击交互
          </div>
        </div>
      )}

      {/* 动画播放器迷你预览（动画卡） */}
      {resource.type === "animation" && !compact && (
        <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-chip border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-[var(--card)] to-amethyst-500/10">
          <div className="absolute inset-x-3 top-3 flex gap-1 opacity-50">
            {Array.from({ length: 8 }).map((_, index) => <span key={index} className="h-1 flex-1 rounded-full bg-cyan-300/40" />)}
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-400/15 text-cyan-300 shadow-glow-azure transition-transform group-hover:scale-110">
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </div>
          <div className="absolute bottom-2 right-2 text-[9px] text-[var(--fg-muted)]">
            {resource.metadata.scenes || 5} 分镜 · 矢量动画
          </div>
        </div>
      )}

      {/* 题型预览（题库卡） */}
      {resource.type === "quiz" && !compact && (
        <div className="rounded-chip border border-[var(--card-border)] bg-ink-950/40 p-2.5 text-xs">
          <div className="mb-1 flex items-center gap-2 text-[var(--fg-muted)]">
            <ListChecks className="h-3.5 w-3.5" />
            {resource.metadata.questionCount || 5} 题 · 单选/多选/判断/简答/综合
          </div>
          <p className="line-clamp-2 text-[var(--fg-muted)]">
            1. 下列关于本知识点的描述，最准确的是？A… B… C… D…
          </p>
        </div>
      )}

      {/* 元信息 */}
      <div className="mt-auto flex items-center gap-3 text-[11px] text-[var(--fg-muted)]">
        {resource.metadata.duration && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {resource.metadata.duration}
            {resource.type === "animation" ? "s" : "min"}
          </span>
        )}
        {resource.metadata.citations && (
          <span className="flex items-center gap-1">
            <Quote className="h-3 w-3" />
            {resource.metadata.citations.length} 引用
          </span>
        )}
        {resource.metadata.nodeCount && (
          <span>{resource.metadata.nodeCount} 节点</span>
        )}
        {resource.metadata.scenes && <span>{resource.metadata.scenes} 分镜</span>}
        {resource.metadata.runtime && (
          <span className="rounded-chip bg-ink-700/60 px-1.5 py-0.5 font-mono">
            {resource.metadata.runtime}
          </span>
        )}
        <span className="flex items-center gap-1 text-jade-400">
          <CheckCircle2 className="h-3 w-3" />
          已校验
        </span>
      </div>

      {/* 收藏按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          likedResource(resource.id);
        }}
        className={cn(
          "absolute right-3 top-3 rounded-full p-1.5 transition-colors",
          liked ? "text-vermilion-500" : "text-[var(--fg-muted)] hover:text-vermilion-500",
        )}
        aria-label="收藏"
      >
        <Heart className={cn("h-4 w-4", liked && "fill-vermilion-500")} />
      </button>

      {!compact && (
        <Link
          to="/library"
          className="text-xs text-azure-400 hover:text-azure-500"
          onClick={(e) => e.stopPropagation()}
        >
          查看详情 →
        </Link>
      )}
    </div>
  );
}
