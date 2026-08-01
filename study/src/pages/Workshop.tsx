import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Network,
  ListChecks,
  BookOpen,
  Clapperboard,
  Code2,
  Sparkles,
  Rocket,
  CheckCircle2,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResourceType, AgentLogEntry } from "@/types";
import { resourceTypeMeta } from "@/data/resources";
import { knowledgeNodes, getKnowledgeById } from "@/data/course";
import { getAgentById, agentPipeline } from "@/data/agents";
import AgentAvatar from "@/components/AgentAvatar";
import AgentLogPanel from "@/components/AgentLogPanel";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ResourceCard from "@/components/ResourceCard";
import AnimationPlayer from "@/components/AnimationPlayer";
import MindmapViewer from "@/components/MindmapViewer";
import { useAppStore } from "@/store/useAppStore";
import { orchestrate } from "@/agents/orchestrator";
import type { OrchestrateResult } from "@/agents/orchestrator";
import type { Resource } from "@/types";
import { ExternalLink } from "lucide-react";

const typeIcons: Record<ResourceType, LucideIcon> = {
  document: FileText,
  mindmap: Network,
  quiz: ListChecks,
  reading: BookOpen,
  animation: Clapperboard,
  code: Code2,
};

// 资源工坊 — 多智能体协同生成 6 类多模态资源
export default function Workshop() {
  const [selectedType, setSelectedType] = useState<ResourceType | null>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string>("dl-transformer");
  const [useCustomTopic, setUseCustomTopic] = useState(false);
  const [customTopic, setCustomTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generated, setGenerated] = useState<Resource | null>(null);

  const workshopLog = useAppStore((s) => s.workshopLog);
  const workshopStreaming = useAppStore((s) => s.workshopStreaming);
  const pushLog = useAppStore((s) => s.pushWorkshopLog);
  const appendStream = useAppStore((s) => s.appendWorkshopStream);
  const resetWorkshop = useAppStore((s) => s.resetWorkshop);

  const start = async () => {
    if (!selectedType) return;
    setBusy(true);
    setGenerated(null);
    setProgress(0);
    resetWorkshop();
    useAppStore.setState({ workshopBusy: true, workshopResourceType: selectedType });

    const topic = useCustomTopic ? customTopic.trim() : getKnowledgeById(selectedKnowledge)?.title || "";
    const task = {
      taskId: `T-${Date.now()}`,
      resourceType: selectedType,
      topic,
      knowledgeId: useCustomTopic ? undefined : selectedKnowledge,
      learnerId: "L2024-001",
    };

    let totalTokens = 0;
    const estimatedTokens = 800;
    try {
      const gen = orchestrate(task, (e: AgentLogEntry) => pushLog(e));
      useAppStore.setState({ workshopStreaming: "" });
      while (true) {
        const { value, done: d } = await gen.next();
        if (d) {
          const result = value as OrchestrateResult | undefined;
          if (result?.resource) {
            setGenerated(result.resource);
            setProgress(100);
          }
          break;
        }
        appendStream(value as string);
        totalTokens++;
        setProgress(Math.min(99, Math.round((totalTokens / estimatedTokens) * 100)));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
      useAppStore.setState({ workshopBusy: false });
    }
  };

  const saveResource = (resource: Resource) => {
    useAppStore.setState((s) => ({
      resources: [...s.resources, resource],
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [saved, setSaved] = useState(false);

  const knowledge = getKnowledgeById(selectedKnowledge);

  return (
    <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_360px] lg:px-10">
      {/* 主区 */}
      <div className="space-y-6">
        {/* 调度台 */}
        <section className="glass rounded-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-vermilion-500" />
            <h2 className="font-serif text-lg font-semibold text-[var(--fg)]">
              智能体调度台
            </h2>
            <span className="ml-auto rounded-chip bg-ink-700/60 px-2 py-0.5 text-xs text-[var(--fg-muted)]">
              6 类资源 · 7 智能体
            </span>
          </div>

          {/* 资源类型选择 */}
          <div className="mb-5">
            <div className="mb-2 text-xs text-[var(--fg-muted)]">① 选择资源类型</div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
              {(Object.keys(resourceTypeMeta) as ResourceType[]).map((t) => {
                const Icon = typeIcons[t];
                const meta = resourceTypeMeta[t];
                const active = selectedType === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={cn(
                      "group flex flex-col items-center gap-2 rounded-card border p-3 transition-all",
                      active
                        ? "border-transparent bg-ink-700/60 shadow-glow"
                        : "border-[var(--card-border)] bg-[var(--card)] hover:border-[var(--card-border)] hover:bg-ink-700/40",
                    )}
                    style={active ? { boxShadow: `0 0 20px ${meta.color}40` } : undefined}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{ background: `${meta.color}20`, color: meta.color }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-[var(--fg)]">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 知识点 / 自定义主题选择 */}
          <div className="mb-5">
            <div className="mb-2 text-xs text-[var(--fg-muted)]">② 选择主题来源</div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseCustomTopic(false)}
                className={cn(
                  "rounded-card border px-3 py-2 text-xs transition-all",
                  !useCustomTopic
                    ? "border-transparent bg-azure-500/20 text-azure-400"
                    : "border-[var(--card-border)] bg-ink-900/40 text-[var(--fg-muted)] hover:bg-ink-700/40",
                )}
              >
                章节知识点
              </button>
              <button
                type="button"
                onClick={() => setUseCustomTopic(true)}
                className={cn(
                  "rounded-card border px-3 py-2 text-xs transition-all",
                  useCustomTopic
                    ? "border-transparent bg-vermilion-500/20 text-vermilion-400"
                    : "border-[var(--card-border)] bg-ink-900/40 text-[var(--fg-muted)] hover:bg-ink-700/40",
                )}
              >
                自定义主题
              </button>
            </div>

            {!useCustomTopic ? (
              <>
                <select
                  value={selectedKnowledge}
                  onChange={(e) => setSelectedKnowledge(e.target.value)}
                  className="h-10 w-full rounded-card border border-[var(--card-border)] bg-ink-900/60 px-3 text-sm focus:border-azure-500 focus:outline-none"
                >
                  {knowledgeNodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      第{n.chapter}章 · {n.title}（难度{"★".repeat(n.difficulty)}）
                    </option>
                  ))}
                </select>
                {knowledge && (
                  <div className="mt-2 rounded-chip border border-[var(--card-border)] bg-ink-900/40 p-3 text-xs text-[var(--fg-muted)]">
                    <span className="text-azure-400">摘要：</span>
                    {knowledge.summary}
                  </div>
                )}
              </>
            ) : (
              <textarea
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="输入你想学习的主题或问题，例如：Transformer 注意力机制、梯度消失、强化学习中的 Q-Learning…"
                rows={3}
                className="w-full resize-none rounded-card border border-[var(--card-border)] bg-ink-900/60 px-3 py-2 text-sm placeholder:text-[var(--fg-muted)]/50 focus:border-vermilion-500 focus:outline-none"
              />
            )}
          </div>

          {/* 智能体编队预览 */}
          {selectedType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-5"
            >
              <div className="mb-2 text-xs text-[var(--fg-muted)]">③ 本次智能体编队</div>
              <div className="flex items-center gap-2 overflow-x-auto rounded-card border border-[var(--card-border)] bg-ink-900/40 p-3">
                {agentPipeline[selectedType].map((step, i) => {
                  const agent = getAgentById(step.id)!;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <AgentAvatar agent={agent} size="sm" />
                        <span className="text-[10px] text-[var(--fg-muted)]">
                          {agent.name}
                        </span>
                      </div>
                      {i < agentPipeline[selectedType].length - 1 && (
                        <div className="h-px w-8 bg-gradient-to-r from-[var(--fg-muted)]/40 to-transparent" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* 启动按钮 */}
          <button
            onClick={start}
            disabled={!selectedType || busy || (useCustomTopic && !customTopic.trim())}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all",
              selectedType && !busy && (!useCustomTopic || customTopic.trim())
                ? "bg-gradient-to-r from-vermilion-500 to-azure-500 text-white shadow-glow hover:scale-[1.02]"
                : "cursor-not-allowed bg-ink-700/60 text-[var(--fg-muted)]",
            )}
          >
            <Rocket className="h-4 w-4" />
            {busy ? "智能体编队运行中…" : "启动多智能体协同生成"}
          </button>
        </section>

        {/* 流式生成区 */}
        <AnimatePresence>
          {(busy || workshopStreaming || generated) && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-card p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-serif text-base font-semibold text-[var(--fg)]">
                  <span className={cn("h-2 w-2 rounded-full", busy ? "animate-pulse bg-aurum-400" : "bg-jade-400")} />
                  生成结果 · 流式呈现
                </h3>
                {generated && (
                  <button
                    onClick={() => {
                      setGenerated(null);
                      resetWorkshop();
                    }}
                    className="rounded-full p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60 hover:text-[var(--fg)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 进度条 */}
              {busy && (
                <div className="mb-4">
                  <div className="mb-1.5 flex justify-between text-xs text-[var(--fg-muted)]">
                    <span>生成进度追踪</span>
                    <span className="font-mono text-aurum-400">{progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ink-700">
                    <motion.div
                      className="h-full bg-gradient-to-r from-vermilion-500 via-aurum-500 to-azure-500"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* 流式内容 */}
              <div className="max-h-[480px] overflow-y-auto rounded-card border border-[var(--card-border)] bg-ink-950/40 p-5">
                {workshopStreaming ? (
                  <MarkdownRenderer content={workshopStreaming} className="typing-cursor" />
                ) : (
                  <div className="flex h-32 items-center justify-center text-sm text-[var(--fg-muted)]">
                    <Sparkles className="mr-2 h-4 w-4 animate-spin-slow" />
                    正在调用智能体编队…
                  </div>
                )}
              </div>

              {/* 生成完成卡片 */}
              {generated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-jade-400">
                      <CheckCircle2 className="h-4 w-4" />
                      生成完成 · 已通过校验官防幻觉检查
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 rounded-chip bg-jade-500/15 px-2 py-0.5 text-xs text-jade-400">
                        <ShieldCheck className="h-3 w-3" />
                        安全分 {generated.safetyCheck.score}
                      </span>
                      <button
                        onClick={() => saveResource(generated)}
                        disabled={saved}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all",
                          saved
                            ? "bg-jade-500/20 text-jade-400"
                            : "bg-ink-700/60 text-[var(--fg)] hover:bg-ink-600/60",
                        )}
                      >
                        <CheckCircle2 className={cn("h-3 w-3", saved && "text-jade-400")} />
                        {saved ? "已保存" : "保存到资源库"}
                      </button>
                    </div>
                  </div>

                  {generated.type === "animation" && generated.metadata.animationScenes && (
                    <AnimationPlayer scenes={generated.metadata.animationScenes} />
                  )}
                  {generated.type === "mindmap" && generated.metadata.mindmap && (
                    <div className="rounded-card border border-[var(--card-border)] bg-ink-950/80 p-4">
                      <MindmapViewer key={generated.id} data={generated.metadata.mindmap} className="h-80" />
                    </div>
                  )}
                  {generated.type !== "animation" && generated.type !== "mindmap" && (
                    <ResourceCard resource={generated} />
                  )}

                  {/* 外部视频推荐 */}
                  {generated.metadata.externalVideos && generated.metadata.externalVideos.length > 0 && (
                    <div className="rounded-card border border-[var(--card-border)] bg-ink-900/40 p-4">
                      <h4 className="mb-3 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
                        <ExternalLink className="h-4 w-4 text-aurum-400" />
                        外部视频与资源推荐
                        <span className="ml-auto text-xs font-normal text-[var(--fg-muted)]">
                          {generated.metadata.externalVideos.length} 个平台
                        </span>
                      </h4>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {generated.metadata.externalVideos.map((v, i) => (
                          <a
                            key={i}
                            href={v.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col gap-1 rounded-chip border border-[var(--card-border)] bg-ink-950/40 p-3 transition-all hover:border-aurum-500/50 hover:bg-ink-700/40"
                          >
                            <div className="flex items-center justify-between">
                              <span className="rounded-chip bg-aurum-500/15 px-2 py-0.5 text-[10px] text-aurum-400">
                                {v.platform}
                              </span>
                              <span className="text-[10px] text-[var(--fg-muted)]">{v.duration}</span>
                            </div>
                            <span className="text-xs font-medium text-[var(--fg)] group-hover:text-aurum-400">
                              {v.title}
                            </span>
                            <span className="text-[10px] leading-relaxed text-[var(--fg-muted)]">
                              {v.desc}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>

      {/* 右：智能体协作日志 */}
      <aside className="lg:sticky lg:top-20 lg:h-fit">
        <div className="glass rounded-card p-4">
          <AgentLogPanel logs={workshopLog} busy={busy} />
          {workshopLog.length === 0 && !busy && (
            <div className="mt-4 rounded-chip border border-dashed border-[var(--card-border)] p-4 text-center text-xs text-[var(--fg-muted)]">
              选择资源类型并启动生成后，
              <br />
              各智能体的"思考-生成-校验"过程
              <br />
              将在此实时呈现。
            </div>
          )}
        </div>

        {/* 防幻觉说明 */}
        <div className="mt-4 glass rounded-card p-4">
          <h4 className="mb-2 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
            <ShieldCheck className="h-4 w-4 text-jade-400" />
            防幻觉与安全机制
          </h4>
          <ul className="space-y-1.5 text-xs text-[var(--fg-muted)]">
            <li>· 校验官对照本地知识库白名单进行事实核查</li>
            <li>· 公式与代码语法自动校验</li>
            <li>· 敏感词扫描（内置词表 + 可对接讯飞内容审核）</li>
            <li>· 引用补全，缺失部分标注"待补充"</li>
            <li>· 不通过则打回重生成（最多 2 次）</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
