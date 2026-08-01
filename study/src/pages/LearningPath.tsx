import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Circle,
  Loader2,
  CheckCircle2,
  Sparkles,
  X,
  Lightbulb,
  TrendingUp,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronDown,
  BookOpen,
  Brain,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { initialPath } from "@/data/learner";
import { knowledgeNodes, getKnowledgeById, chapters } from "@/data/course";
import { getResourcesByKnowledge } from "@/data/resources";
import ResourceCard from "@/components/ResourceCard";
import { useAppStore } from "@/store/useAppStore";
import type { PathNode } from "@/types";

const statusMeta = {
  locked: { icon: Lock, color: "#4A5670", label: "未解锁", bg: "rgba(74,86,112,0.15)" },
  todo: { icon: Circle, color: "#8b94a8", label: "待学习", bg: "rgba(139,148,168,0.15)" },
  doing: { icon: Loader2, color: "#F4A261", label: "进行中", bg: "rgba(244,162,97,0.2)" },
  done: { icon: CheckCircle2, color: "#10B981", label: "已完成", bg: "rgba(16,185,129,0.2)" },
  recommended: { icon: Sparkles, color: "#9D4EDD", label: "推荐加速", bg: "rgba(157,78,221,0.2)" },
};

// 学习路径图谱 — 节点-连线 SVG + 状态色 + 节点详情抽屉 + 拖拽平移
export default function LearningPath() {
  const navigate = useNavigate();
  const learningRecords = useAppStore((state) => state.learningRecords);
  const [selected, setSelected] = useState<PathNode | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [advising, setAdvising] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1]));
  const dragStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes: PathNode[] = knowledgeNodes.map((knowledge, index) => {
    const curatedNode = initialPath.nodes.find((node) => node.knowledgeId === knowledge.id);
    const prerequisitesReady = knowledge.prerequisites.every((prerequisiteId) => {
      const prerequisiteRecord = learningRecords.find((record) => record.knowledgeId === prerequisiteId);
      return prerequisiteRecord?.learned && prerequisiteRecord.mastery >= 60;
    });
    const node: PathNode = curatedNode ?? {
      knowledgeId: knowledge.id,
      order: index + 1,
      status: prerequisitesReady ? "todo" : "locked",
      reason: prerequisitesReady
        ? "前置知识已就绪，可以开始学习"
        : `需先完成 ${knowledge.prerequisites.length} 个前置知识点`,
    };
    const record = learningRecords.find((item) => item.knowledgeId === node.knowledgeId);
    if (record?.learned && record.quizCompleted && record.mastery >= 60) {
      return { ...node, status: "done" as const, reason: `实时评估：掌握度 ${record.mastery}%` };
    }
    if (record && (record.learned || record.quizCompleted || record.mastery > 0)) {
      return { ...node, status: "doing" as const, reason: `实时评估：掌握度 ${record.mastery}%，建议继续学习与测验` };
    }
    return node;
  });
  const knowledge = selected ? getKnowledgeById(selected.knowledgeId) : null;
  const resources = selected ? getResourcesByKnowledge(selected.knowledgeId) : [];
  const selectedRecord = selected
    ? learningRecords.find((record) => record.knowledgeId === selected.knowledgeId)
    : undefined;

  // 计算节点坐标（按章节分组，章节内垂直排列，章节间水平分布）
  const chapterNodes = chapters.map((c) =>
    nodes.filter((n) => getKnowledgeById(n.knowledgeId)?.chapter === c.no).sort((a, b) => a.order - b.order),
  );

  const positions: { x: number; y: number }[] = [];

  // 6 章水平排列，每章内节点垂直分布
  const colGap = 280;
  const startX = 150;
  const startY = 120;
  const nodeVGap = 95;

  let maxHeight = 0;

  for (let chIdx = 0; chIdx < 6; chIdx++) {
    const chNodes = chapterNodes[chIdx];
    const baseX = startX + chIdx * colGap;

    if (chNodes.length === 0) continue;

    const chapterHeight = (chNodes.length - 1) * nodeVGap;
    const yStart = startY - chapterHeight / 2;

    for (let i = 0; i < chNodes.length; i++) {
      const n = chNodes[i];
      const idx = nodes.findIndex((nn) => nn.knowledgeId === n.knowledgeId);
      if (idx >= 0) {
        positions[idx] = {
          x: baseX,
          y: yStart + i * nodeVGap,
        };
      }
    }

    maxHeight = Math.max(maxHeight, chapterHeight + 200);
  }

  // 确保所有节点都有位置
  nodes.forEach((_, i) => {
    if (!positions[i]) {
      positions[i] = { x: 800 + (i % 3) * 100, y: startY + Math.floor(i / 3) * 100 };
    }
  });

  const W = startX + 5 * colGap + 150;
  const H = Math.max(500, maxHeight);
  const viewportW = 900;
  const viewportH = 520;
  const baseScale = Math.min(viewportW / W, viewportH / H, 1);
  const [transform, setTransform] = useState(() => ({
    x: (viewportW - W * baseScale) / 2,
    y: (viewportH - H * baseScale) / 2,
    scale: 1,
  }));

  // 拖拽处理
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as SVGElement;
      if (target.closest(".node-group")) return;
      setIsDragging(true);
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: transform.x,
        ty: transform.y,
      };
    },
    [transform.x, transform.y],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setTransform((prev) => ({
        ...prev,
        x: dragStart.current.tx + dx,
        y: dragStart.current.ty + dy,
      }));
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.92 : 1.08;
    setTransform((prev) => {
      const newScale = Math.max(0.4, Math.min(2, prev.scale * delta));
      return { ...prev, scale: newScale };
    });
  }, []);

  const resetView = () => {
    const initX = (viewportW - W * baseScale) / 2;
    const initY = (viewportH - H * baseScale) / 2;
    setTransform({ x: initX, y: initY, scale: 1 });
  };

  const displayScale = Math.round(transform.scale * baseScale * 100);

  const zoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(2 / baseScale, prev.scale * 1.2) }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(0.4 / baseScale, prev.scale * 0.8) }));
  };

  const optimize = async () => {
    setAdvising(true);
    setAdvice(null);
    await new Promise((r) => setTimeout(r, 1200));
    setAdvice(`基于你近 7 天的学习行为与画像目标，我建议：

1. **加速**：dl-transformer（推荐节点）— 与你的兴趣方向（LLM 推理）强相关，且基础已就绪，建议本周完成。
2. **补强**：search-informed（A* 启发式）— 考研面试高频，建议穿插学习 1-2 次。
3. **延后**：kr-knowledge-graph — 与当前目标关联较弱，可在 v3 画像更新时再激活。
4. **巩固**：dl-rnn（进行中）— 当前掌握度 62，建议完成配套题库第 4-5 题后再进入 Transformer。

资源推送策略调整：将增加 Transformer 相关的「代码实操」与「教学动画」权重，降低符号推理类资源推送。`);
    setAdvising(false);
  };

  return (
    <div className="px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">个性化学习路径</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            目标：{initialPath.goal} · 与学习记录实时同步
          </p>
        </div>
        <button
          onClick={optimize}
          disabled={advising}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amethyst-500 to-azure-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow-azure transition-transform hover:scale-105 disabled:opacity-60"
        >
          <Sparkles className={cn("h-4 w-4", advising && "animate-spin")} />
          {advising ? "正在生成调优建议…" : "动态调优路径"}
        </button>
      </div>

      {/* 进度统计 */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {(["done", "doing", "recommended", "todo", "locked"] as const).map((s) => {
          const meta = statusMeta[s];
          const Icon = meta.icon;
          const count = nodes.filter((n) => n.status === s).length;
          return (
            <div key={s} className="glass rounded-card p-3">
              <div className="flex items-center gap-2">
                <Icon
                  className={cn("h-4 w-4", s === "doing" && "animate-spin")}
                  style={{ color: meta.color }}
                />
                <span className="text-xs text-[var(--fg-muted)]">{meta.label}</span>
              </div>
              <div className="mt-1 font-serif text-xl font-bold text-[var(--fg)]">{count}</div>
            </div>
          );
        })}
      </div>

      {/* 调优建议 */}
      <AnimatePresence>
        {advice && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-card border border-amethyst-500/30 bg-amethyst-500/10 p-5"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-serif text-base font-semibold text-[var(--fg)]">
                <Lightbulb className="h-4 w-4 text-aurum-400" />
                路径动态调优建议
              </h3>
              <button onClick={() => setAdvice(null)} className="rounded-full p-1 hover:bg-ink-700/60">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-sm leading-relaxed text-[var(--fg-muted)] whitespace-pre-line">
              {advice}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* 路径图谱 */}
        <section className="glass rounded-card p-4">
          <div className="mb-3 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-base font-semibold text-[var(--fg)]">路径图谱</h2>
              <span className="flex items-center gap-1 text-[10px] text-[var(--fg-muted)]">
                <Move className="h-3 w-3" />
                可拖拽平移 · 滚轮缩放
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60"
                title="缩小"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="w-10 text-center text-[10px] text-[var(--fg-muted)]">
                {displayScale}%
              </span>
              <button
                onClick={zoomIn}
                className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60"
                title="放大"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={resetView}
                className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60"
                title="重置视图"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-lg select-none"
            style={{ height: viewportH, cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <div
              className="absolute left-0 top-0"
              style={{
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale * baseScale})`,
                transformOrigin: "0 0",
                width: W,
                height: H,
              }}
            >
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="block"
                style={{ width: W, height: H }}
              >
              <defs>
                <linearGradient id="pathline" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1B9AAA" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#9D4EDD" stopOpacity="0.6" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="rgba(139,148,168,0.5)" />
                </marker>
              </defs>
                {/* 章节背景和标题 */}
                {chapters.map((c, i) => {
                  const chNodes = chapterNodes[i];
                  if (chNodes.length === 0) return null;
                  const chPositions = chNodes
                    .map((n) => {
                      const idx = nodes.findIndex((nn) => nn.knowledgeId === n.knowledgeId);
                      return idx >= 0 ? positions[idx] : null;
                    })
                    .filter(Boolean) as { x: number; y: number }[];
                  if (chPositions.length === 0) return null;
                  const minY = Math.min(...chPositions.map((p) => p.y)) - 50;
                  const maxY = Math.max(...chPositions.map((p) => p.y)) + 50;
                  const centerX = chPositions[0].x;
                  return (
                    <g key={`ch-bg-${c.no}`}>
                      <rect
                        x={centerX - 110}
                        y={minY - 20}
                        width="220"
                        height={maxY - minY + 40}
                        rx="12"
                        fill={c.color}
                        opacity="0.06"
                      />
                      <text
                        x={centerX}
                        y={minY - 5}
                        textAnchor="middle"
                        className="fill-[var(--fg)] font-serif"
                        style={{ fontSize: 12, fontWeight: 600 }}
                      >
                        第{c.no}章 · {c.title}
                      </text>
                    </g>
                  );
                })}

                {/* 连线 */}
                {nodes.slice(0, -1).map((n, i) => {
                  const p1 = positions[i];
                  const p2 = positions[i + 1];
                  const knowledge = getKnowledgeById(n.knowledgeId);
                  const next = getKnowledgeById(nodes[i + 1].knowledgeId);
                  if (!knowledge || !next || !p1 || !p2) return null;
                  const isFlow = n.status === "done";
                  return (
                    <line
                      key={`line-${i}`}
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isFlow ? "url(#pathline)" : "rgba(139,148,168,0.25)"}
                      strokeWidth="1.5"
                      strokeDasharray={isFlow ? "6 4" : "3 4"}
                      className={isFlow ? "animate-flow-dash" : ""}
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}

                {/* 节点 */}
                {nodes.map((n, i) => {
                  const p = positions[i];
                  if (!p) return null;
                  const meta = statusMeta[n.status];
                  const Icon = meta.icon;
                  const k = getKnowledgeById(n.knowledgeId);
                  if (!k) return null;
                  const r = n.status === "doing" ? 24 : 20;
                  return (
                    <g
                      key={n.knowledgeId}
                      className="node-group cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(n);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelected(n);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${k.title}，${meta.label}`}
                      style={{ pointerEvents: "auto" }}
                    >
                      {(n.status === "doing" || n.status === "recommended") && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={r + 8}
                          fill={meta.color}
                          opacity="0.15"
                          className="animate-breathe"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={r}
                        fill={meta.bg}
                        stroke={meta.color}
                        strokeWidth="2"
                      />
                      <foreignObject x={p.x - 8} y={p.y - 8} width="16" height="16">
                        <Icon
                          className={cn("h-4 w-4", n.status === "doing" && "animate-spin")}
                          style={{ color: meta.color }}
                        />
                      </foreignObject>
                      <text
                        x={p.x}
                        y={p.y + r + 14}
                        textAnchor="middle"
                        className="fill-[var(--fg)] font-sans"
                        style={{ fontSize: 11, fontWeight: 500 }}
                      >
                        {k.title.length > 10 ? k.title.slice(0, 9) + "…" : k.title}
                      </text>
                      <text
                        x={p.x}
                        y={p.y + r + 26}
                        textAnchor="middle"
                        className="fill-[var(--fg-muted)] font-mono"
                        style={{ fontSize: 9 }}
                      >
                        难度{"★".repeat(k.difficulty)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* 右：节点详情 / 章节导航 */}
        <aside className="space-y-4">
          <AnimatePresence mode="wait">
            {selected && knowledge ? (
              <motion.div
                key={selected.knowledgeId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass rounded-card p-5"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <span
                      className="rounded-chip px-2 py-0.5 text-[10px]"
                      style={{
                        background: statusMeta[selected.status].bg,
                        color: statusMeta[selected.status].color,
                      }}
                    >
                      {statusMeta[selected.status].label}
                    </span>
                    <h3 className="mt-2 font-serif text-base font-semibold text-[var(--fg)]">
                      {knowledge.title}
                    </h3>
                    <div className="mt-1 text-[10px] text-[var(--fg-muted)]">
                      第{knowledge.chapter}章 · 难度{"★".repeat(knowledge.difficulty)} · 约{knowledge.estimatedMinutes}分钟
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="rounded-full p-1 hover:bg-ink-700/60">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--fg-muted)]">
                  {knowledge.summary}
                </p>
                {selectedRecord && (
                  <div className="mt-3 rounded-chip border border-[var(--card-border)] bg-[var(--bg)]/40 p-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--fg-muted)]">实时掌握度</span>
                      <span className="font-semibold text-[var(--fg)]">{selectedRecord.mastery}%</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--card-border)]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-vermilion-500 via-aurum-500 to-jade-500 transition-all"
                        style={{ width: `${selectedRecord.mastery}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-[var(--fg-muted)]">
                      <span>{selectedRecord.timeSpent} 分钟</span>
                      <span>{selectedRecord.quizAttempts} 次测验</span>
                    </div>
                  </div>
                )}
                {selected.reason && (
                  <div className="mt-3 rounded-chip border border-azure-500/30 bg-azure-500/10 p-2.5 text-xs text-azure-400">
                    <TrendingUp className="mr-1 inline h-3 w-3" />
                    {selected.reason}
                  </div>
                )}
                <div className="mt-4">
                  <div className="mb-2 text-xs font-medium text-[var(--fg-muted)]">
                    关联资源（{resources.length}）
                  </div>
                  <div className="space-y-2">
                    {resources.slice(0, 3).map((r) => (
                      <ResourceCard key={r.id} resource={r} compact />
                    ))}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/assessment?knowledge=${encodeURIComponent(knowledge.id)}&mode=learn&source=path`)}
                    disabled={selected.status === "locked"}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amethyst-500 to-azure-500 px-3 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {selected.status === "locked" ? "尚未解锁" : selected.status === "done" ? "再次巩固" : "开始学习"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/assessment?knowledge=${encodeURIComponent(knowledge.id)}&mode=quiz&source=path`)}
                    disabled={selected.status === "locked"}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-aurum-500/30 bg-aurum-500/10 px-3 py-2 text-xs font-medium text-aurum-400 transition-colors hover:bg-aurum-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Brain className="h-3.5 w-3.5" />
                    专项测评
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/library?query=${encodeURIComponent(knowledge.title)}`)}
                    className="col-span-2 flex items-center justify-center gap-1.5 rounded-full border border-[var(--card-border)] px-3 py-2 text-xs font-medium text-[var(--fg-muted)] transition-colors hover:border-amethyst-500/30 hover:text-amethyst-400"
                  >
                    <Library className="h-3.5 w-3.5" />
                    查看全部 {resources.length} 个关联资源
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="guide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-card p-5"
              >
                <h3 className="mb-3 font-serif text-sm font-semibold text-[var(--fg)]">
                  章节导航
                </h3>
                <div className="space-y-2">
                  {chapters.map((c) => {
                    const cnt = knowledgeNodes.filter((n) => n.chapter === c.no).length;
                    const done = nodes.filter(
                      (n) => getKnowledgeById(n.knowledgeId)?.chapter === c.no && n.status === "done",
                    ).length;
                    const isExpanded = expandedChapters.has(c.no);
                    const chKnowledge = knowledgeNodes
                      .filter((n) => n.chapter === c.no)
                      .sort((a, b) => a.id.localeCompare(b.id));

                    return (
                      <div
                        key={c.no}
                        className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedChapters);
                            if (isExpanded) {
                              newExpanded.delete(c.no);
                            } else {
                              newExpanded.add(c.no);
                            }
                            setExpandedChapters(newExpanded);
                          }}
                          className="w-full flex items-center justify-between p-2.5 text-left hover:bg-ink-700/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 text-[var(--fg-muted)] transition-transform",
                                isExpanded && "rotate-180",
                              )}
                            />
                            <span className="text-xs font-medium text-[var(--fg)]">
                              第{c.no}章 · {c.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[var(--fg-muted)]">
                              {done}/{cnt}
                            </span>
                          </div>
                        </button>
                        <div className="px-2.5 pb-2.5">
                          <div className="h-1 overflow-hidden rounded-full bg-ink-700">
                            <div
                              className="h-full transition-all duration-500"
                              style={{ width: `${(done / cnt) * 100}%`, background: c.color }}
                            />
                          </div>
                        </div>
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[var(--card-border)]">
                            {chKnowledge.map((k) => {
                              const node = nodes.find(
                                (n) => n.knowledgeId === k.id,
                              );
                              const nodeStatus = node?.status || "locked";
                              const meta = statusMeta[nodeStatus];
                              const Icon = meta.icon;
                              return (
                                <button
                                  key={k.id}
                                  onClick={() => {
                                    if (node) {
                                      setSelected(node);
                                    }
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-ink-700/30 transition-colors"
                                >
                                  <Icon className="h-3 w-3 flex-shrink-0" style={{ color: meta.color }} />
                                  <span className="flex-1 text-left text-[11px] text-[var(--fg-muted)] truncate">
                                    {k.title}
                                  </span>
                                  <span className="text-[10px] text-[var(--fg-muted)]">
                                    {"★".repeat(k.difficulty)}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 rounded-chip border border-dashed border-[var(--card-border)] p-3 text-center text-[11px] text-[var(--fg-muted)]">
                  点击知识点查看详情与关联资源
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
