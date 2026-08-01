import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "dagre";
import { cn } from "@/lib/utils";
import type { MindmapData, MindmapNode } from "@/types";

interface Props {
  data: MindmapData;
  className?: string;
  compact?: boolean;
}

// 主题配色映射
const THEME_COLORS = {
  aurum: { primary: "#F4A261", secondary: "#E76F51", glow: "#F4A26155", root: "#FFD166" },
  azure: { primary: "#1B9AAA", secondary: "#22D3EE", glow: "#22D3EE55", root: "#67E8F9" },
  jade: { primary: "#10B981", secondary: "#34D399", glow: "#10B98155", root: "#6EE7B7" },
  amethyst: { primary: "#9D4EDD", secondary: "#C084FC", glow: "#9D4EDD55", root: "#D8B4FE" },
};

// 自定义节点样式
interface MindmapNodeData {
  label: string;
  detail?: string;
  weight?: MindmapNode["weight"];
  depth: number;
  theme: keyof typeof THEME_COLORS;
  childCount: number;
  collapsed: boolean;
}

const MindmapNodeCard = ({ data, selected }: NodeProps<MindmapNodeData>) => {
  const colors = THEME_COLORS[data.theme || "azure"];
  const isRoot = data.depth === 0;
  const isImportant = data.weight === "important" || data.weight === "key";
  const nodeColor = isRoot ? colors.root : data.depth === 1 ? colors.primary : colors.secondary;

  return (
    <div
      className={cn(
        "relative rounded-lg px-3 py-2 text-center",
        isRoot && "rounded-full",
        selected && "ring-2 ring-offset-2 ring-offset-[#0A0E1A]",
      )}
      style={{
        background: isRoot
          ? `radial-gradient(circle, ${colors.root} 0%, ${colors.primary}80 100%)`
          : `${nodeColor}15`,
        border: `1.5px solid ${nodeColor}`,
        borderRadius: isRoot ? "50%" : "8px",
        boxShadow: isImportant && !isRoot ? `0 0 12px ${colors.glow}` : "none",
        minWidth: Math.max(80, data.label.length * 10 + 32),
        cursor: "pointer",
        transition: "transform 0.15s, box-shadow 0.15s",
        transform: selected ? "scale(1.05)" : "scale(1)",
      }}
    >
      <Handle type="target" position={Position.Top} className="!h-0 !w-0 !border-0 !bg-transparent" />
      <Handle type="source" position={Position.Bottom} className="!h-0 !w-0 !border-0 !bg-transparent" />
      {/* 根节点外圈 */}
      {isRoot && (
        <>
          <div
            className="absolute -inset-2 rounded-full"
            style={{ border: `1px dashed ${colors.root}50`, borderRadius: "50%" }}
          />
          <div
            className="absolute -inset-1 rounded-full"
            style={{ border: `1px solid ${colors.root}40`, borderRadius: "50%" }}
          />
        </>
      )}

      {/* 左侧色条 */}
      {!isRoot && (
        <div
          className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
          style={{ background: nodeColor }}
        />
      )}

      {/* 节点文字 */}
      <span
        className={cn("font-serif text-sm", isRoot && "font-bold", data.depth === 1 && "font-semibold")}
        style={{ color: isRoot ? "#0A0E1A" : "#fff" }}
      >
        {data.label}
      </span>

      {/* 折叠角标：有子节点时给出可展开的提示与数量 */}
      {data.childCount > 0 && !isRoot && (
        <span
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-1.5 text-[9px] leading-4"
          style={{
            background: "#0A0E1A",
            border: `1px solid ${nodeColor}`,
            color: nodeColor,
          }}
        >
          {data.collapsed ? `+${data.childCount}` : "−"}
        </span>
      )}

      {/* Tooltip 触发区（hover 时显示详情） */}
      {data.detail && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{ borderRadius: isRoot ? "50%" : "8px" }}
          title={data.detail}
        />
      )}
    </div>
  );
};

// 树形数据转换为扁平结构，保留父指针供折叠时剪枝
interface FlatNode {
  id: string;
  parentId: string | null;
  depth: number;
  label: string;
  detail?: string;
  weight?: MindmapNode["weight"];
  childCount: number;
}

function flattenTree(root: MindmapNode): FlatNode[] {
  const out: FlatNode[] = [];
  const traverse = (node: MindmapNode, parentId: string | null, depth: number) => {
    out.push({
      id: node.id,
      parentId,
      depth,
      label: node.label,
      detail: node.detail,
      weight: node.weight,
      childCount: node.children?.length ?? 0,
    });
    node.children?.forEach((child) => traverse(child, node.id, depth + 1));
  };
  traverse(root, null, 0);
  return out;
}

// 折叠节点的整棵子树都不参与布局
function buildGraph(
  flat: FlatNode[],
  collapsed: Set<string>,
  theme: keyof typeof THEME_COLORS,
): { nodes: Node<MindmapNodeData>[]; edges: Edge[] } {
  const hidden = new Set<string>();
  for (const node of flat) {
    if (node.parentId === null) continue;
    if (collapsed.has(node.parentId) || hidden.has(node.parentId)) hidden.add(node.id);
  }

  const nodes: Node<MindmapNodeData>[] = [];
  const edges: Edge[] = [];
  for (const node of flat) {
    if (hidden.has(node.id)) continue;
    nodes.push({
      id: node.id,
      data: {
        label: node.label,
        detail: node.detail,
        weight: node.weight,
        depth: node.depth,
        theme,
        childCount: node.childCount,
        collapsed: collapsed.has(node.id),
      },
      position: { x: 0, y: 0 },
      type: "mindmap",
    });
    if (node.parentId !== null) {
      edges.push({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId,
        target: node.id,
        animated: true,
      });
    }
  }
  return { nodes, edges };
}

// Dagre 布局算法
function dagreLayout(
  nodes: Node<MindmapNodeData>[],
  edges: Edge[],
  options?: {
    nodeWidth?: number;
    nodeHeight?: number;
    rankDir?: "TB" | "LR" | "BT" | "RL";
    rankGap?: number;
    nodeGap?: number;
  },
): Node<MindmapNodeData>[] {
  const g = new dagre.graphlib.Graph({ directed: true });
  g.setDefaultEdgeLabel(() => ({}));

  const { nodeWidth = 160, nodeHeight = 44, rankDir = "TB", rankGap = 120, nodeGap = 80 } = options || {};

  // dagre 的 ranksep / nodesep 单位就是像素。原来除以 100 后层间距只剩 1.4px、
  // 同层间距 0.9px，整张图被压成横向一条，超出画布还看不出层级。
  g.setGraph({ rankdir: rankDir, ranksep: rankGap, nodesep: nodeGap });

  // 按标签实际宽度排版，而不是给每个节点都留 160px。
  // 叶子节点普遍只有三四个字，固定宽度会把 19 个叶子摊成三千多像素，fitView 之后全糊。
  const widthOf = (node: Node<MindmapNodeData>) =>
    Math.min(nodeWidth, Math.max(80, node.data.label.length * 10 + 32));

  nodes.forEach((node) => {
    g.setNode(node.id, { width: widthOf(node), height: nodeHeight });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const pos = g.node(node.id);
    return {
      ...node,
      position: {
        x: pos.x - widthOf(node) / 2,
        y: pos.y - nodeHeight / 2,
      },
    };
  });
}

const nodeTypes = { mindmap: MindmapNodeCard };

export default function MindmapViewer({ data, className, compact = false }: Props) {
  const colors = THEME_COLORS[data.theme || "azure"];
  const theme = data.theme || "azure";
  const flat = useMemo(() => flattenTree(data.root), [data]);

  // 25 个节点全铺开时，适配到弹窗里只有约 0.4 倍缩放，14px 的节点字被压到 6px 看不清。
  // 默认收起二级以下，先给根 + 五个主分支的可读概览，点节点再逐支展开。
  const branchIds = useMemo(
    () => flat.filter((n) => n.depth === 1 && n.childCount > 0).map((n) => n.id),
    [flat],
  );
  // 折叠态跟着实例走：换资源时调用方用 key 重挂载，这里不需要再同步一次
  const [collapsed, setCollapsed] = useState<Set<string>>(() => new Set(branchIds));

  const { nodes: rawNodes, edges } = useMemo(
    () => buildGraph(flat, compact ? new Set<string>() : collapsed, theme),
    [flat, collapsed, theme, compact],
  );
  const nodes = useMemo(
    () => dagreLayout(rawNodes, edges, { rankDir: "TB", rankGap: 90, nodeGap: 32 }),
    [rawNodes, edges],
  );

  const toggleNode = useCallback((_: unknown, node: Node<MindmapNodeData>) => {
    if (node.data.childCount === 0) return;
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  }, []);

  const allExpanded = collapsed.size === 0;
  const toggleAll = useCallback(
    () => setCollapsed((prev) => (prev.size === 0 ? new Set(branchIds) : new Set())),
    [branchIds],
  );

  // ReactFlow 的 fitView padding 是比例不是像素（原来传 40 等于要 4000% 留白）。
  const instanceRef = useRef<ReactFlowInstance | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const fit = useCallback(() => {
    instanceRef.current?.fitView({ padding: 0.15, maxZoom: 1.6, duration: 0 });
  }, []);

  const handleInit = useCallback(
    (rf: ReactFlowInstance) => {
      instanceRef.current = rf;
      fit();
    },
    [fit],
  );

  // 弹窗是带动画进场的，onInit 那一刻容器往往还没到最终尺寸，只 fit 一次会留下
  // 被裁掉的半张图。容器尺寸稳定后再补一次。
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new ResizeObserver(() => fit());
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [fit, nodes]);

  if (compact) {
    return (
      <div className={cn("relative overflow-hidden rounded-chip bg-ink-950/80", className)}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={3}
          nodesDraggable={false}
          nodesConnectable={false}
          className="h-full w-full"
          style={{ background: "radial-gradient(circle at center, #0A0E1A 0%, #050810 100%)" }}
        >
          <Background color="#2a3550" gap={16} />
        </ReactFlow>
        <div className="absolute bottom-1.5 right-2 rounded-chip bg-ink-950/80 px-2 py-0.5 text-[9px] text-[var(--fg-muted)] backdrop-blur">
          {nodes.length} 节点 · Dagre 布局
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-card border border-[var(--card-border)] bg-ink-950/80 shadow-float", className)}>
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between border-b border-[var(--card-border)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: colors.primary, boxShadow: `0 0 8px ${colors.glow}` }}
          />
          <span className="text-xs font-medium text-[var(--fg-muted)]">
            交互式思维导图 · {nodes.length}/{flat.length} 节点 · Dagre 自动布局
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[var(--fg-muted)]">
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-chip border border-[var(--card-border)] bg-ink-700/40 px-2 py-0.5 transition-colors hover:text-[var(--fg)]"
            aria-pressed={allExpanded}
          >
            {allExpanded ? "收起子节点" : "展开全部"}
          </button>
          <span className="rounded-chip bg-ink-700/40 px-2 py-0.5">点击节点展开</span>
          <span className="rounded-chip bg-ink-700/40 px-2 py-0.5">拖拽平移 / 滚轮缩放</span>
        </div>
      </div>

      {/* ReactFlow 画布 */}
      <div ref={wrapRef} className="relative h-[520px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onInit={handleInit}
          onNodeClick={toggleNode}
          minZoom={0.2}
          maxZoom={3}
          nodesDraggable={false}
          nodesConnectable={false}
          className="h-full w-full"
          style={{ background: "radial-gradient(circle at center, #0A0E1A 0%, #050810 100%)" }}
        >
          <Background color="#2a3550" gap={20} />
          <Controls />
          {/* 缩略图挪到右上：默认的右下角会盖住最后一个主分支 */}
          <MiniMap
            position="top-right"
            pannable
            nodeStrokeWidth={2}
            maskColor="#05081088"
            style={{ background: "#050810", width: 140, height: 90 }}
          />
        </ReactFlow>
      </div>

      {/* 底部信息 */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: colors.root }} />
            <span className="text-[10px] text-[var(--fg-muted)]">根节点</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: colors.primary }} />
            <span className="text-[10px] text-[var(--fg-muted)]">主分支</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full" style={{ background: colors.secondary }} />
            <span className="text-[10px] text-[var(--fg-muted)]">子节点</span>
          </div>
        </div>
        <div className="text-[10px] text-[var(--fg-muted)]">
          主题：{data.theme} · {nodes.filter((n) => n.data.depth === 1).length} 主分支 · {nodes.filter((n) => n.data.depth === 2).length} 子节点
        </div>
      </div>
    </div>
  );
}
