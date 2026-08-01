import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  History,
  TrendingUp,
  Sparkles,
  GitCompare,
  Send,
  X,
  Check,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RadarChart from "@/components/RadarChart";
import AgentAvatar from "@/components/AgentAvatar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { useAppStore } from "@/store/useAppStore";
import { getAgentById } from "@/data/agents";
import { streamText } from "@/services/streaming";
import type { ProfileChange } from "@/types";

// 学习画像页 — 对话式构建 + 6 维雷达 + 版本时间线
export default function Profile() {
  const captain = getAgentById("captain")!;
  const learner = useAppStore((s) => s.learner);
  const profile = useAppStore((s) => s.currentProfile);
  const history = useAppStore((s) => s.profileHistory);
  const regenerateProfile = useAppStore((s) => s.regenerateProfile);
  const predictProfileChanges = useAppStore((s) => s.predictProfileChanges);

  const [compareIdx, setCompareIdx] = useState<number | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "agent" | "user"; text: string; streaming?: boolean; changes?: ProfileChange[]; pendingConfirm?: boolean }[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);

  const startUpdate = async () => {
    setChatOpen(true);
    setMessages([]);
    setStep(0);
    await pushAgent("你好，我是灵境。我们来进行一次画像随学随新——最近你在哪些知识点上花了时间？遇到了什么困惑？");
  };

  const pushAgent = async (text: string, options?: { changes?: ProfileChange[]; pendingConfirm?: boolean }) => {
    setBusy(true);
    setMessages((m) => [...m, { role: "agent", text: "", streaming: true, changes: options?.changes, pendingConfirm: options?.pendingConfirm }]);
    let acc = "";
    for await (const tok of streamText(text, { speed: 20 })) {
      acc += tok;
      setMessages((m) =>
        m.map((msg, i) =>
          i === m.length - 1 && msg.role === "agent" ? { ...msg, text: acc } : msg,
        ),
      );
    }
    setMessages((m) =>
      m.map((msg, i) =>
        i === m.length - 1 && msg.role === "agent" ? { ...msg, streaming: false } : msg,
      ),
    );
    setBusy(false);
  };

  const formatChangesSummary = (changes: ProfileChange[]) => {
    const significant = changes.filter((c) => Math.abs(c.delta) >= 3);
    if (significant.length === 0) return "各维度有微调";
    return significant
      .map((c) => `${c.name}${c.delta > 0 ? "↑" : "↓"}${Math.abs(c.delta)}分`)
      .join("、");
  };

  const quickOptions = [
    { step: 0, options: [
      "刚学完神经网络基础",
      "在 Transformer 上遇到困难",
      "最近做了很多算法题",
      "想深入了解大模型",
      "学习节奏变快了",
      "对 CV 方向更感兴趣",
    ]},
    { step: 1, options: [
      "想提升代码实践能力",
      "准备开始做项目",
      "要准备考试了",
      "对 NLP 方向感兴趣",
      "想了解强化学习",
      "学习节奏保持稳定",
    ]},
  ];

  const currentQuickOptions = quickOptions.find((q) => q.step === step)?.options || [];

  const selectQuickOption = (opt: string) => {
    setInput(opt);
  };

  const send = async (customText?: string) => {
    const text = customText || input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));

    const predictedChanges = predictProfileChanges(text);
    const summary = formatChangesSummary(predictedChanges);

    await pushAgent(
      `根据你的描述，预计画像变化如下：${summary}。\n\n是否确认更新画像？`,
      { changes: predictedChanges, pendingConfirm: true }
    );
  };

  const confirmUpdate = async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    const text = lastUserMsg.text;
    setBusy(true);

    const { changes } = regenerateProfile(
      `基于对话「${text.slice(0, 20)}」随学随新`,
      text
    );

    const summary = formatChangesSummary(changes);
    const topChange = changes[0];
    let detailMsg = "";
    if (topChange && topChange.delta > 0) {
      detailMsg = `其中${topChange.name}提升最明显（+${topChange.delta}分）。`;
    } else if (topChange && topChange.delta < 0) {
      detailMsg = `其中${topChange.name}调整幅度最大（${topChange.delta}分）。`;
    }

    setMessages((m) =>
      m.map((msg, i) =>
        i === m.length - 1 && msg.role === "agent"
          ? { ...msg, pendingConfirm: false, changes }
          : msg
      )
    );

    await pushAgent(
      `好的，画像已更新！主要变化：${summary}。${detailMsg}\n\n你可以在右侧时间线查看历史版本，点击「对比」按钮查看各维度变化。还有其他想补充的吗？`,
      { changes }
    );
    setStep(step + 1);
  };

  const cancelUpdate = async () => {
    setMessages((m) =>
      m.map((msg, i) =>
        i === m.length - 1 && msg.role === "agent"
          ? { ...msg, pendingConfirm: false }
          : msg
      )
    );
    await pushAgent("好的，本次不更新画像。你可以继续描述你的学习情况，或者随时告诉我想要调整的方向~");
  };

  const compareProfile = compareIdx != null ? history[compareIdx] : null;

  return (
    <div className="px-6 py-6 lg:px-10">
      {/* 头部 */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">学习画像</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            6 维动态画像 · 当前版本 v{profile.version} · 更新于 {profile.createdAt}
          </p>
        </div>
        <button
          onClick={startUpdate}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
        >
          <RefreshCw className="h-4 w-4" />
          随学随新
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* 左：雷达图 + 维度详情 */}
        <div className="space-y-6">
          {/* 雷达图 */}
          <section className="glass rounded-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-base font-semibold text-[var(--fg)]">
                6 维雷达图
              </h2>
              {compareProfile && (
                <button
                  onClick={() => setCompareIdx(null)}
                  className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--fg)]"
                >
                  <X className="h-3 w-3" /> 取消对比
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-center text-xs text-[var(--fg-muted)]">
                  当前版本 · v{profile.version}
                </div>
                <RadarChart
                  axes={profile.dimensions.map((d) => ({ name: d.name, score: d.score }))}
                  size={300}
                  color="#E63946"
                />
              </div>
              {compareProfile ? (
                <div>
                  <div className="mb-2 text-center text-xs text-[var(--fg-muted)]">
                    对比版本 · v{compareProfile.version}
                  </div>
                  <RadarChart
                    axes={compareProfile.dimensions.map((d) => ({ name: d.name, score: d.score }))}
                    size={300}
                    color="#1B9AAA"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {profile.dimensions.map((d, i) => (
                    <motion.div
                      key={d.name}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-3"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-[var(--fg)]">{d.name}</span>
                        <span className="font-mono text-sm text-vermilion-400">{d.score}</span>
                      </div>
                      <div className="mb-1.5 h-1 overflow-hidden rounded-full bg-ink-700">
                        <motion.div
                          className="h-full bg-gradient-to-r from-vermilion-500 to-aurum-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${d.score}%` }}
                          transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                        />
                      </div>
                      <p className="text-[11px] leading-relaxed text-[var(--fg-muted)]">
                        {d.evidence}
                      </p>
                      {d.tags && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {d.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded-chip bg-ink-700/60 px-1.5 py-0.5 text-[10px] text-[var(--fg-muted)]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* 抽取依据 */}
          <section className="glass rounded-card p-6">
            <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-semibold text-[var(--fg)]">
              <Sparkles className="h-4 w-4 text-aurum-400" />
              特征抽取依据
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {profile.dimensions.map((d) => (
                <div key={d.name} className="rounded-chip border border-[var(--card-border)] bg-ink-900/40 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-vermilion-500" />
                    <span className="text-sm font-medium text-[var(--fg)]">{d.name}</span>
                    <span className="ml-auto font-mono text-xs text-aurum-400">{d.score}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--fg-muted)]">{d.evidence}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 右：版本时间线 */}
        <aside className="space-y-4">
          <div className="glass rounded-card p-5">
            <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
              <History className="h-4 w-4 text-azure-400" />
              画像版本时间线
            </h3>
            <div className="relative space-y-3 border-l border-[var(--card-border)] pl-4">
              {[...history].reverse().map((v, i) => (
                <div key={v.id} className="relative">
                  <div
                    className={cn(
                      "absolute -left-[1.2rem] top-1 h-3 w-3 rounded-full border-2",
                      i === 0
                        ? "border-vermilion-500 bg-vermilion-500"
                        : "border-[var(--fg-muted)] bg-ink-900",
                    )}
                  />
                  <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-semibold text-[var(--fg)]">
                        {i === 0 ? `v${v.version}（当前）` : `v${v.version}`}
                      </span>
                      {i > 0 && (
                        <button
                          onClick={() => setCompareIdx(history.findIndex((h) => h.id === v.id))}
                          className="flex items-center gap-1 text-[10px] text-azure-400 hover:text-azure-500"
                        >
                          <GitCompare className="h-3 w-3" />
                          对比
                        </button>
                      )}
                    </div>
                    <div className="mt-1 text-[10px] text-[var(--fg-muted)]">{v.createdAt}</div>
                    <div className="mt-1 text-xs text-[var(--fg-muted)]">
                      {v.trigger.replace(/用户：.*?）/, `用户：${learner.name}）`)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-card p-5">
            <h3 className="mb-2 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
              <TrendingUp className="h-4 w-4 text-jade-400" />
              画像演进趋势
            </h3>
            {history.length >= 2 ? (
              <div className="space-y-2 text-xs text-[var(--fg-muted)]">
                {profile.dimensions.map((d) => {
                  const first = history[0].dimensions.find((x) => x.name === d.name);
                  if (!first) return null;
                  const delta = d.score - first.score;
                  return (
                    <p key={d.name}>
                      · {d.name}：{first.score} → {d.score}
                      <span
                        className={cn(
                          "ml-1",
                          delta > 0
                            ? "text-jade-400"
                            : delta < 0
                            ? "text-vermilion-400"
                            : ""
                        )}
                      >
                        （{delta > 0 ? "+" : ""}{delta}）
                      </span>
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-[var(--fg-muted)]">
                <p>暂无历史数据，完成首次随学随新后显示趋势</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* 对话式画像更新弹层 */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-end justify-center bg-ink-950/80 p-4 backdrop-blur-md sm:items-center"
            onClick={() => setChatOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-[80vh] w-[min(640px,94vw)] flex-col overflow-hidden rounded-card border border-[var(--card-border)] bg-ink-900/90 shadow-float"
            >
              <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <AgentAvatar agent={captain} size="md" pulse />
                  <div>
                    <div className="font-serif text-base font-bold text-[var(--fg)]">灵境 · 随学随新</div>
                    <div className="text-[11px] text-[var(--fg-muted)]">第 {step + 1} 轮对话</div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="rounded-full p-1.5 text-[var(--fg-muted)] hover:bg-ink-700/60"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}
                  >
                    {m.role === "agent" ? (
                      <AgentAvatar agent={captain} size="sm" pulse={m.streaming} />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 text-xs font-bold text-white">
                        知
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-2">
                      <div
                        className={cn(
                          "rounded-card px-3.5 py-2.5 text-sm",
                          m.role === "agent"
                            ? "border border-[var(--card-border)] bg-[var(--card)]"
                            : "bg-gradient-to-br from-azure-500/20 to-amethyst-500/15",
                          m.streaming && "typing-cursor",
                        )}
                      >
                        <MarkdownRenderer content={m.text} />
                      </div>
                      {m.changes && m.changes.length > 0 && (
                        <div className="rounded-card border border-azure-500/30 bg-azure-500/10 px-3 py-2">
                          <div className="mb-2 text-[11px] font-medium text-azure-400">
                            {m.pendingConfirm ? "预计变化" : "实际变化"}
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {m.changes.slice(0, 6).map((c) => (
                              <div
                                key={c.name}
                                className="flex items-center justify-between text-[11px]"
                              >
                                <span className="text-[var(--fg-muted)]">{c.name}</span>
                                <span
                                  className={cn(
                                    "font-mono font-medium",
                                    c.delta > 0
                                      ? "text-jade-400"
                                      : c.delta < 0
                                      ? "text-vermilion-400"
                                      : "text-[var(--fg-muted)]"
                                  )}
                                >
                                  {c.delta > 0 ? "+" : ""}
                                  {c.delta}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {m.pendingConfirm && (
                        <div className="flex gap-2">
                          <button
                            onClick={confirmUpdate}
                            disabled={busy}
                            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" />
                            确认更新
                          </button>
                          <button
                            onClick={cancelUpdate}
                            disabled={busy}
                            className="flex flex-1 items-center justify-center gap-1 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--fg-muted)] disabled:opacity-50"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            暂不更新
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[var(--card-border)] p-4">
                {currentQuickOptions.length > 0 && step < 2 && (
                  <div className="mb-3">
                    <p className="mb-2 text-xs text-[var(--fg-muted)]">快速选择：</p>
                    <div className="flex flex-wrap gap-2">
                      {currentQuickOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => selectQuickOption(opt)}
                          className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-3 py-1 text-xs text-[var(--fg-muted)] transition-all hover:border-amethyst-500/50 hover:text-amethyst-400"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send()}
                    disabled={busy}
                    placeholder="用自然语言告诉灵境你最近的学习情况…"
                    className="h-10 flex-1 rounded-full border border-[var(--card-border)] bg-ink-950/60 px-4 text-sm focus:border-azure-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={() => send()}
                    disabled={busy || !input.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-vermilion-500 to-azure-500 text-white disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
