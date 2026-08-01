import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sparkles,
  Brain,
  Clapperboard,
  Code2,
  Lightbulb,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AgentAvatar from "@/components/AgentAvatar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { getAgentById } from "@/data/agents";
import { useAppStore } from "@/store/useAppStore";
import { tutorAnswer } from "@/agents/orchestrator";
import type { ChatMessage } from "@/types";

const suggestions = [
  "梯度爆炸和梯度消失怎么区分？怎么解决？",
  "Transformer 的 Multi-Head Attention 维度是怎么拼接的？",
  "A* 算法的启发函数要满足什么条件？",
  "RAG 和微调怎么选？",
];

const historyQuestions = [
  "LSTM 的门控机制如何缓解梯度消失？",
  "残差连接为什么能训练更深的网络？",
  "BatchNorm 与 LayerNorm 的区别？",
];

// 智能辅导 — 多模态答疑对话
export default function Tutor() {
  const captain = getAgentById("captain")!;
  const messages = useAppStore((s) => s.tutorMessages);
  const addMessage = useAppStore((s) => s.addTutorMessage);
  const updateLast = useAppStore((s) => s.updateLastTutorMessage);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const profile = useAppStore((s) => s.currentProfile);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const ask = async (q: string) => {
    if (!q.trim() || busy) return;
    const sequence = messages.length;
    const userMsg: ChatMessage = {
      id: `U-${sequence}`,
      role: "user",
      content: q,
      ts: sequence,
    };
    const agentMsg: ChatMessage = {
      id: `A-${sequence + 1}`,
      role: "agent",
      agentId: "captain",
      content: "",
      ts: sequence + 1,
      streaming: true,
    };
    addMessage(userMsg);
    addMessage(agentMsg);
    setInput("");
    setBusy(true);

    let acc = "";
    for await (const tok of tutorAnswer(q)) {
      acc += tok;
      updateLast(acc);
    }
    setBusy(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 px-6 py-6 lg:grid-cols-[1fr_320px] lg:px-10">
      {/* 对话区 */}
      <div className="glass flex h-[calc(100vh-7rem)] flex-col rounded-card">
        {/* 头部 */}
        <div className="flex items-center justify-between border-b border-[var(--card-border)] px-5 py-3">
          <div className="flex items-center gap-3">
            <AgentAvatar agent={captain} size="md" pulse />
            <div>
              <div className="font-serif text-base font-bold text-[var(--fg)]">智能辅导</div>
              <div className="text-[11px] text-[var(--fg-muted)]">
                多模态答疑 · 文字 + 图解 + 代码
              </div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-jade-500/30 bg-jade-500/10 px-2.5 py-1 text-xs text-jade-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade-400" />
            在线
          </span>
        </div>

        {/* 消息列表 */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <AgentAvatar agent={captain} size="lg" pulse />
              <h3 className="mt-4 font-serif text-xl font-bold text-gradient">
                有什么可以帮你？
              </h3>
              <p className="mt-2 max-w-md text-sm text-[var(--fg-muted)]">
                我是灵境，可以为你提供文字解答、SVG 图解、代码示例与短视频讲解卡片。
                试试下面的问题，或直接输入你的疑问。
              </p>
              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-card border border-[var(--card-border)] bg-[var(--card)] px-3 py-2.5 text-left text-xs text-[var(--fg)] transition-colors hover:border-azure-500"
                  >
                    <Lightbulb className="mr-1 inline h-3 w-3 text-aurum-400" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
              >
                {m.role === "agent" ? (
                  <AgentAvatar agent={captain} size="sm" pulse={m.streaming} />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 font-serif text-xs font-bold text-white">
                    知
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[82%] rounded-card px-4 py-3",
                    m.role === "user"
                      ? "bg-gradient-to-br from-azure-500/20 to-amethyst-500/15 text-[var(--fg)]"
                      : "border border-[var(--card-border)] bg-[var(--card)]",
                  )}
                >
                  {m.role === "agent" ? (
                    <MarkdownRenderer content={m.content} className={cn(m.streaming && "typing-cursor")} />
                  ) : (
                    <p className="text-sm leading-relaxed">{m.content}</p>
                  )}

                  {/* 多模态卡片占位 */}
                  {m.role === "agent" && m.content.includes("[SVG:") && (
                    <MultimodalCard content={m.content} />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* 输入框 */}
        <div className="border-t border-[var(--card-border)] p-4">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              disabled={busy}
              placeholder="输入你的问题，灵境会以多模态形式回答…"
              className="h-11 flex-1 rounded-full border border-[var(--card-border)] bg-ink-950/60 px-4 text-sm focus:border-azure-500 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => ask(input)}
              disabled={busy || !input.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-vermilion-500 to-azure-500 text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 右：上下文 + 历史 */}
      <aside className="space-y-4">
        <div className="glass rounded-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
            <Brain className="h-4 w-4 text-amethyst-400" />
            上下文记忆
          </h3>
          <div className="space-y-2 text-xs">
            <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-2.5">
              <div className="text-[10px] text-[var(--fg-muted)]">当前画像版本</div>
              <div className="mt-0.5 font-mono text-azure-400">v{profile.version}</div>
            </div>
            <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-2.5">
              <div className="text-[10px] text-[var(--fg-muted)]">易错点靶向</div>
              <div className="mt-0.5 flex flex-wrap gap-1">
                {profile.dimensions[2].tags?.map((t) => (
                  <span key={t} className="rounded-chip bg-vermilion-500/15 px-1.5 py-0.5 text-[10px] text-vermilion-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-2.5">
              <div className="text-[10px] text-[var(--fg-muted)]">认知风格</div>
              <div className="mt-0.5 text-jade-400">{profile.dimensions[1].tags?.join(" + ")}</div>
            </div>
          </div>
        </div>

        <div className="glass rounded-card p-5">
          <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
            <History className="h-4 w-4 text-azure-400" />
            历史提问
          </h3>
          <div className="space-y-1.5">
            {historyQuestions.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="block w-full truncate rounded-chip border border-[var(--card-border)] bg-[var(--card)] px-2.5 py-2 text-left text-xs text-[var(--fg-muted)] transition-colors hover:border-azure-500 hover:text-[var(--fg)]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-card p-5">
          <h3 className="mb-2 flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
            <Sparkles className="h-4 w-4 text-aurum-400" />
            多模态解答形式
          </h3>
          <div className="space-y-1.5 text-xs text-[var(--fg-muted)]">
            <p className="flex items-center gap-2"><Lightbulb className="h-3 w-3 text-aurum-400" /> 文字 + Markdown 公式</p>
            <p className="flex items-center gap-2"><Clapperboard className="h-3 w-3 text-cyan-300" /> SVG 图解卡片</p>
            <p className="flex items-center gap-2"><Code2 className="h-3 w-3 text-vermilion-400" /> 代码片段示例</p>
          </div>
        </div>
      </aside>
    </div>
  );
}

// 多模态卡片
function MultimodalCard({ content }: { content: string }) {
  const match = content.match(/\[SVG:([\w-]+)\]/);
  if (!match) return null;
  const id = match[1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 overflow-hidden rounded-card border border-cyan-400/30 bg-cyan-400/5"
    >
      <div className="flex items-center gap-2 border-b border-cyan-400/20 px-3 py-2 text-xs text-cyan-300">
        <Clapperboard className="h-3.5 w-3.5" />
        配套图解卡片 · {id}
      </div>
      <div className="p-3">
        <svg viewBox="0 0 320 120" className="w-full">
          <defs>
            <linearGradient id={`tutor-${id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1B9AAA" />
              <stop offset="100%" stopColor="#9D4EDD" />
            </linearGradient>
          </defs>
          <rect width="320" height="120" fill="#0A0E1A" rx="8" />
          {[40, 110, 180, 250].map((x, i) => (
            <g key={i}>
              <circle cx={x} cy="60" r="16" fill="none" stroke={`url(#tutor-${id})`} strokeWidth="2" />
              <text x={x} y="64" textAnchor="middle" fill="#8b94a8" fontSize="9">
                {["输入", "处理", "聚合", "输出"][i]}
              </text>
              {i < 3 && (
                <line
                  x1={x + 16}
                  y1="60"
                  x2={[40, 110, 180, 250][i + 1] - 16}
                  y2="60"
                  stroke={`url(#tutor-${id})`}
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-flow-dash"
                />
              )}
            </g>
          ))}
          <text x="160" y="105" textAnchor="middle" fill="#4A5670" fontSize="8" fontFamily="monospace">
            fig: {id}
          </text>
        </svg>
      </div>
    </motion.div>
  );
}
