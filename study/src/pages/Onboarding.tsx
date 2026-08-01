import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, ArrowRight, CheckCircle2, Plus, Users, RotateCcw, Calculator, ChevronRight, Presentation } from "lucide-react";
import ParticleBg from "@/components/ParticleBg";
import AgentAvatar from "@/components/AgentAvatar";
import { getAgentById } from "@/data/agents";
import { useAppStore } from "@/store/useAppStore";
import { onboardingScript } from "@/data/learner";
import { streamText } from "@/services/streaming";
import { cn } from "@/lib/utils";
import type { Learner } from "@/types";

interface Msg {
  role: "agent" | "user";
  text: string;
  streaming?: boolean;
}

type Phase = "intro" | "existing" | "intro-new" | "username" | "math-quiz" | "chat" | "building" | "done";

// 数学测试题
const mathQuestions = [
  {
    q: "已知 f(x) = 2x + 3，求 f(5) 的值",
    options: ["10", "13", "11", "8"],
    correct: 1,
    explanation: "f(5) = 2*5 + 3 = 13",
  },
  {
    q: "矩阵 A = [[1,2],[3,4]]，求 A 的转置矩阵中 (1,2) 位置的元素",
    options: ["2", "3", "4", "1"],
    correct: 1,
    explanation: "转置后行列互换，原 (2,1) 位置的 3 变为 (1,2) 位置",
  },
  {
    q: "lim(x->0) sin(x)/x 的值是多少？",
    options: ["0", "1", "无穷大", "不存在"],
    correct: 1,
    explanation: "这是一个经典极限，lim(x->0) sin(x)/x = 1",
  },
  {
    q: "一个袋中有 3 个红球 2 个白球，随机取 2 个球，都是红球的概率是多少？",
    options: ["3/10", "1/10", "3/5", "2/5"],
    correct: 0,
    explanation: "C(3,2)/C(5,2) = 3/10",
  },
  {
    q: "如果 P(A) = 0.6，P(B) = 0.5，P(A∩B) = 0.3，则 P(A∪B) = ?",
    options: ["0.8", "1.1", "0.7", "0.9"],
    correct: 0,
    explanation: "P(A∪B) = P(A) + P(B) - P(A∩B) = 0.6 + 0.5 - 0.3 = 0.8",
  },
];

// 首次对话引导 — 灵境队长与学生对话构建画像
export default function Onboarding() {
  const navigate = useNavigate();
  const captain = getAgentById("captain")!;
  const setOnboarded = useAppStore((s) => s.setOnboarded);
  const presetLearners = useAppStore((s) => s.presetLearners);
  const selectLearner = useAppStore((s) => s.selectLearner);
  const resetToNewUser = useAppStore((s) => s.resetToNewUser);
  const buildInitialProfileFromOnboarding = useAppStore((s) => s.buildInitialProfileFromOnboarding);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<Phase>("intro");
  const [extracted, setExtracted] = useState<string[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<Learner | null>(null);
  const [mode, setMode] = useState<"existing" | "new" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // 用户名和数学测试
  const [username, setUsername] = useState("");
  const [mathIdx, setMathIdx] = useState(0);
  const [mathAnswers, setMathAnswers] = useState<number[]>([]);
  const [mathSelected, setMathSelected] = useState<number | null>(null);
  const [mathShowResult, setMathShowResult] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 选择原有用户
  const pickExisting = (l: Learner) => {
    setSelectedLearner(l);
    selectLearner(l.id);
    setMode("existing");
    // 原有用户已有画像，可直接进入工作台（但仍展示一次欢迎）
    setPhase("done");
  };

  // 崭新开始
  const startNew = () => {
    resetToNewUser();
    setMode("new");
    setPhase("username");
  };

  const enterFinalDemo = () => {
    const demoLearner = presetLearners[0];
    if (demoLearner) selectLearner(demoLearner.id);
    setOnboarded(true);
    navigate("/showcase");
  };

  // 用户名提交后进入数学测试
  const submitUsername = () => {
    if (!username.trim()) return;
    setPhase("math-quiz");
    setMathIdx(0);
    setMathAnswers([]);
    setMathSelected(null);
    setMathShowResult(false);
  };

  // 数学测试选择答案
  const selectMathAnswer = (idx: number) => {
    if (mathShowResult) return;
    setMathSelected(idx);
  };

  // 数学测试提交当前题
  const submitMathAnswer = () => {
    if (mathSelected === null) return;
    setMathAnswers((prev) => [...prev, mathSelected]);
    setMathShowResult(true);
  };

  // 数学测试下一题或完成
  const nextMathQuestion = () => {
    if (mathIdx < mathQuestions.length - 1) {
      setMathIdx(mathIdx + 1);
      setMathSelected(null);
      setMathShowResult(false);
    } else {
      // 数学测试完成，进入对话
      finishMathQuiz();
    }
  };

  // 数学测试完成后进入对话
  const finishMathQuiz = async () => {
    setPhase("chat");
    await pushAgent(onboardingScript[0].text);
  };

  const mathCorrectCount = mathAnswers.filter((a, i) => a === mathQuestions[i].correct).length;

  const startChat = async () => {
    setPhase("chat");
    await pushAgent(onboardingScript[0].text);
  };

  const pushAgent = async (text: string) => {
    setBusy(true);
    const id = Date.now();
    setMessages((m) => [...m, { role: "agent", text: "", streaming: true }]);
    let acc = "";
    for await (const tok of streamText(text, { speed: 22 })) {
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
    void id;
  };

  const send = async () => {
    if (!input.trim() || busy) return;
    const userText = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userText }]);
    setExtracted((e) => [...e, extractFeature(userText)]);
    setStep((s) => s + 1);
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    const nextIdx = (step + 1) * 2;
    if (nextIdx < onboardingScript.length) {
      const next = onboardingScript[nextIdx];
      if (next && "text" in next) {
        await pushAgent(next.text);
      }
    } else {
      // 进入构建阶段
      setPhase("building");
      await new Promise((r) => setTimeout(r, 1200));
      // 基于抽取的特征 + 用户名 + 数学测试结果构建初始画像
      buildInitialProfileFromOnboarding(extracted, {
        username: username.trim(),
        mathCorrect: mathCorrectCount,
        mathTotal: mathQuestions.length,
      });
      setPhase("done");
    }
    setBusy(false);
  };

  const extractFeature = (text: string): string => {
    if (/大三|大四|研/.test(text)) return `年级：${text.match(/大[三四]|研[一二三]/)?.[0] || "本科"}`;
    if (/考研|保研|就业|兴趣/.test(text)) return `目标：${text.match(/考研|保研|就业|兴趣/)?.[0] || "未识别"}`;
    if (/\d+/.test(text)) return `基础自评：${text.match(/\d+/g)?.join("/") || "待补充"}`;
    if (/视觉|图解|代码|实操|文字|听/.test(text)) return `认知风格：${text.match(/视觉|图解|代码|实操|文字|听/)?.[0] || "混合"}`;
    if (/梯度|爆炸|消失|DP|动态规划|边界/.test(text)) return `易错点：${text.match(/梯度爆炸|梯度消失|动态规划|边界|DP/)?.[0] || "已记录"}`;
    if (/冲刺|稳健|沉浸|小时/.test(text)) return `学习节奏：${text.match(/冲刺|稳健|沉浸/)?.[0] || "稳健"}`;
    return `已记录：${text.slice(0, 16)}…`;
  };

  const enter = () => setOnboarded(true);

  // 原有用户退回选择界面
  const backToChoice = () => {
    setMode(null);
    setSelectedLearner(null);
    setPhase("intro");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4 backdrop-blur-md">
      <ParticleBg density={80} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 grid max-h-[92vh] w-[min(1080px,94vw)] grid-cols-1 overflow-hidden overflow-y-auto rounded-card border border-[var(--card-border)] bg-ink-900/80 shadow-float md:grid-cols-[1fr_320px]"
      >
        {/* 左：对话/选择区 */}
        <div className="flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between border-b border-[var(--card-border)] px-6 py-4">
            <div className="flex items-center gap-3">
              <AgentAvatar agent={captain} size="md" pulse />
              <div>
                <div className="font-serif text-lg font-bold text-gradient">灵境 · 队长</div>
                <div className="text-xs text-[var(--fg-muted)]">
                  {phase === "intro" && "选择学习身份"}
                  {phase === "intro-new" && "崭新开始 · 对话构建画像"}
                  {phase === "username" && "输入用户名"}
                  {phase === "math-quiz" && `数学基础测试 · 第 ${mathIdx + 1} / ${mathQuestions.length} 题`}
                  {phase === "chat" && `对话式画像构建 · 第 ${Math.min(step + 1, 5)} / 5 轮`}
                  {phase === "building" && "正在构建 6 维画像…"}
                  {phase === "done" && "画像就绪"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-jade-500/30 bg-jade-500/10 px-2.5 py-1 text-xs text-jade-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade-400" />
              在线
            </div>
          </div>

          {/* 消息列表 / 选择界面 */}
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {/* 入口选择：原有用户 vs 崭新开始 */}
            {phase === "intro" && (
              <div className="space-y-5">
                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <h2 className="mb-2 font-serif text-2xl font-bold text-gradient">
                    欢迎来到智学灵境
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    我是你的专属 AI 学习队长「灵境」。在启动学习之前，我们需要先构建你的 6 维学习画像。
                    <br />
                    <br />
                    你可以选择一位已有学习记录的同学继续学习，也可以作为新同学从零开始构建专属画像。
                  </p>
                </div>

                <button
                  type="button"
                  onClick={enterFinalDemo}
                  className="group flex w-full items-center gap-4 rounded-card border border-aurum-500/35 bg-gradient-to-r from-aurum-500/10 via-vermilion-500/[0.06] to-azure-500/10 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-aurum-500/60 hover:shadow-float"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aurum-500/15 text-aurum-400">
                    <Presentation className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-serif text-base font-bold text-[var(--fg)]">决赛演示模式
                      <span className="rounded-full bg-vermilion-500/10 px-2 py-0.5 font-sans text-[9px] tracking-[0.16em] text-vermilion-400">3 MIN TOUR</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[var(--fg-muted)]">加载完整学习样例，一键进入可验证的画像—资源—路径—练习—评估闭环。</span>
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 text-aurum-400 transition-transform group-hover:translate-x-1" />
                </button>

                {/* 两个大入口卡片 */}
                <div className="grid gap-3 md:grid-cols-2">
                  {/* 原有用户 */}
                  <button
                    onClick={() => setPhase("existing")}
                    className="group flex flex-col items-start gap-2 rounded-card border border-azure-500/30 bg-azure-500/5 p-4 text-left transition-all hover:border-azure-500 hover:bg-azure-500/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-azure-500/20 text-azure-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="font-serif text-base font-bold text-[var(--fg)]">
                      我是原有用户
                    </div>
                    <div className="text-xs leading-relaxed text-[var(--fg-muted)]">
                      已有学习画像与进度，直接进入工作台继续学习
                    </div>
                  </button>

                  {/* 崭新开始 */}
                  <button
                    onClick={startNew}
                    className="group flex flex-col items-start gap-2 rounded-card border border-vermilion-500/30 bg-vermilion-500/5 p-4 text-left transition-all hover:border-vermilion-500 hover:bg-vermilion-500/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-vermilion-500/20 text-vermilion-400">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div className="font-serif text-base font-bold text-[var(--fg)]">
                      崭新开始
                    </div>
                    <div className="text-xs leading-relaxed text-[var(--fg-muted)]">
                      通过 5 轮对话构建专属画像，从零开启个性化学习
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 原有用户列表 */}
            {phase === "existing" && (
              <div className="space-y-3">
                <button
                  onClick={() => setPhase("intro")}
                  className="flex items-center gap-1 text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  返回选择
                </button>
                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-4">
                  <h3 className="mb-3 font-serif text-base font-bold text-[var(--fg)]">
                    选择你的身份
                  </h3>
                  <p className="mb-4 text-xs text-[var(--fg-muted)]">
                    以下同学已有完整学习画像与进度记录，点击进入即可继续学习。
                  </p>
                  <div className="grid gap-2">
                    {presetLearners.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => pickExisting(l)}
                        className="group flex items-center gap-3 rounded-chip border border-[var(--card-border)] bg-ink-900/40 p-3 text-left transition-all hover:border-azure-500 hover:bg-azure-500/10"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 font-serif text-sm font-bold text-white">
                          {l.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="font-serif text-sm font-bold text-[var(--fg)]">
                            {l.name}
                          </div>
                          <div className="text-xs text-[var(--fg-muted)]">
                            {l.major} · {l.grade}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-[var(--fg-muted)]">目标</div>
                          <div className="text-xs text-azure-400">{l.goal}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-1 group-hover:text-azure-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 崭新开始 - 用户名输入 */}
            {phase === "username" && (
              <div className="space-y-4">
                <button
                  onClick={() => setPhase("intro")}
                  className="flex items-center gap-1 text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  返回选择
                </button>
                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <h2 className="mb-2 font-serif text-2xl font-bold text-gradient">
                    你好，新同学
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    我是你的专属 AI 学习队长「灵境」。在开始之前，请告诉我你的名字，
                    接下来我会通过数学测试和几轮对话，构建你的专属学习画像。
                  </p>
                </div>
                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <label className="mb-2 block text-sm font-medium text-[var(--fg)]">
                    你的用户名
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitUsername()}
                      placeholder="输入你希望被称呼的名字..."
                      autoFocus
                      className="h-11 flex-1 rounded-full border border-[var(--card-border)] bg-ink-900/60 px-4 text-sm focus:border-azure-500 focus:outline-none"
                    />
                    <button
                      onClick={submitUsername}
                      disabled={!username.trim()}
                      className="flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-6 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      继续
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 数学测试 */}
            {phase === "math-quiz" && (
              <div className="space-y-4">
                <div className="rounded-card border border-aurum-500/30 bg-aurum-500/5 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-aurum-400" />
                    <h3 className="font-serif text-base font-bold text-[var(--fg)]">
                      数学基础测试
                    </h3>
                    <span className="ml-auto text-xs text-[var(--fg-muted)]">
                      第 {mathIdx + 1} / {mathQuestions.length} 题
                    </span>
                  </div>
                  <p className="text-xs text-[var(--fg-muted)]">
                    {username}，通过这 {mathQuestions.length} 道数学题，我会判断你的数学基础水平，用于更精准地构建画像。
                  </p>
                </div>

                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <p className="mb-4 text-sm font-medium text-[var(--fg)] leading-relaxed">
                    {mathQuestions[mathIdx].q}
                  </p>
                  <div className="space-y-2">
                    {mathQuestions[mathIdx].options.map((opt, idx) => {
                      const selected = mathSelected === idx;
                      const correct = mathQuestions[mathIdx].correct === idx;
                      let cls = "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30";
                      if (mathShowResult) {
                        if (correct) cls = "border-jade-500 bg-jade-500/10";
                        else if (selected && !correct) cls = "border-vermilion-500 bg-vermilion-500/10";
                      } else if (selected) {
                        cls = "border-amethyst-500 bg-amethyst-500/10";
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => selectMathAnswer(idx)}
                          disabled={mathShowResult}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                            cls,
                          )}
                        >
                          <span className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                            selected ? "bg-amethyst-500 text-white" : "bg-[var(--card-border)] text-[var(--fg-muted)]",
                            mathShowResult && correct && "bg-jade-500 text-white",
                            mathShowResult && selected && !correct && "bg-vermilion-500 text-white",
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm text-[var(--fg)]">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {mathShowResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "mt-4 rounded-xl border p-3 text-sm",
                        mathSelected === mathQuestions[mathIdx].correct
                          ? "border-jade-500/30 bg-jade-500/5 text-jade-400"
                          : "border-vermilion-500/30 bg-vermilion-500/5 text-vermilion-400",
                      )}
                    >
                      {mathSelected === mathQuestions[mathIdx].correct ? "回答正确！" : "回答错误。"}
                      <span className="text-[var(--fg-muted)]"> {mathQuestions[mathIdx].explanation}</span>
                    </motion.div>
                  )}

                  <div className="mt-4 flex justify-end">
                    {!mathShowResult ? (
                      <button
                        onClick={submitMathAnswer}
                        disabled={mathSelected === null}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amethyst-500 to-vermilion-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
                      >
                        提交答案
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={nextMathQuestion}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-azure-500 to-jade-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
                      >
                        {mathIdx < mathQuestions.length - 1 ? "下一题" : "完成测试"}
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {mathQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors",
                        i < mathIdx ? "bg-jade-500" : i === mathIdx ? "bg-amethyst-500" : "bg-[var(--card-border)]",
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 崭新开始的欢迎 */}
            {phase === "intro-new" && (
              <div className="space-y-4">
                <button
                  onClick={() => setPhase("intro")}
                  className="flex items-center gap-1 text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                  返回选择
                </button>
                <div className="rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5">
                  <h2 className="mb-2 font-serif text-2xl font-bold text-gradient">
                    你好，新同学
                  </h2>
                  <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
                    接下来我会通过 5 轮自然语言对话，自动抽取你的 6 维学习特征，
                    构建专属画像并预生成首条学习路径。
                    <br />
                    <br />
                    让我们先认识一下。
                  </p>
                </div>
                <button
                  onClick={startChat}
                  className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
                >
                  <Sparkles className="h-4 w-4" />
                  开始对话构建画像
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}

            {/* 对话消息 */}
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3", m.role === "user" && "flex-row-reverse")}
                >
                  {m.role === "agent" ? (
                    <AgentAvatar agent={captain} size="sm" pulse={m.streaming} />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 font-serif text-sm font-bold text-white">
                      {selectedLearner?.avatar || "新"}
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[78%] rounded-card px-4 py-3 text-sm leading-relaxed",
                      m.role === "agent"
                        ? "border border-[var(--card-border)] bg-[var(--card)] text-[var(--fg)]"
                        : "bg-gradient-to-br from-azure-500/20 to-amethyst-500/15 text-[var(--fg)]",
                      m.streaming && "typing-cursor",
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 构建中 */}
            {phase === "building" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-card border border-aurum-500/30 bg-aurum-500/10 p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-sm text-aurum-400">
                  <Sparkles className="h-4 w-4 animate-spin-slow" />
                  正在构建 6 维画像…
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {["知识基础", "认知风格", "易错偏好", "学习节奏", "兴趣方向", "目标导向"].map(
                    (d, i) => (
                      <div
                        key={d}
                        className="flex items-center gap-1.5 rounded-chip bg-ink-700/60 px-2 py-1"
                        style={{ animationDelay: `${i * 150}ms` }}
                      >
                        <CheckCircle2 className="h-3 w-3 animate-pulse text-jade-400" />
                        {d}
                      </div>
                    ),
                  )}
                </div>
              </motion.div>
            )}

            {/* 完成 */}
            {phase === "done" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-card border border-jade-500/40 bg-jade-500/10 p-5 text-center"
              >
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-jade-400" />
                <h3 className="font-serif text-lg font-bold text-[var(--fg)]">
                  {mode === "existing" ? "欢迎回来" : "画像构建完成"}
                </h3>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  {mode === "existing"
                    ? `已加载 ${selectedLearner?.name} 的学习画像与进度，继续你的个性化学习之旅。`
                    : "6 维特征已就位，首条学习路径已生成。欢迎进入你的智能学习工作台。"}
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  {mode === "existing" && (
                    <button
                      onClick={backToChoice}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--card-border)] bg-ink-900/60 px-5 py-2.5 text-sm font-medium text-[var(--fg-muted)] transition-colors hover:border-[var(--fg)] hover:text-[var(--fg)]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      重新选择
                    </button>
                  )}
                  <button
                    onClick={enter}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-jade-500 to-azure-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow-azure transition-transform hover:scale-105"
                  >
                    进入工作台
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
            <div ref={endRef} />
          </div>

          {/* 输入框 */}
          {phase === "chat" && (
            <div className="border-t border-[var(--card-border)] px-6 py-4">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  disabled={busy}
                  placeholder="用自然语言回答灵境的问题…"
                  className="h-11 flex-1 rounded-full border border-[var(--card-border)] bg-ink-900/60 px-4 text-sm focus:border-azure-500 focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-vermilion-500 to-azure-500 text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 右：实时抽取特征 / 当前身份 */}
        <div className="hidden flex-col border-l border-[var(--card-border)] bg-ink-950/40 p-5 md:flex">
          {mode === "existing" && selectedLearner ? (
            <>
              <h3 className="mb-3 font-serif text-sm font-semibold text-[var(--fg)]">
                当前身份
              </h3>
              <div className="mb-4 flex items-center gap-3 rounded-card border border-[var(--card-border)] bg-[var(--card)] p-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 font-serif text-lg font-bold text-white">
                  {selectedLearner.avatar}
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-[var(--fg)]">
                    {selectedLearner.name}
                  </div>
                  <div className="text-xs text-[var(--fg-muted)]">{selectedLearner.major}</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between rounded-chip bg-ink-900/40 px-3 py-2">
                  <span className="text-[var(--fg-muted)]">年级</span>
                  <span className="text-[var(--fg)]">{selectedLearner.grade}</span>
                </div>
                <div className="flex justify-between rounded-chip bg-ink-900/40 px-3 py-2">
                  <span className="text-[var(--fg-muted)]">目标</span>
                  <span className="text-azure-400">{selectedLearner.goal}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 className="mb-3 font-serif text-sm font-semibold text-[var(--fg)]">
                {phase === "math-quiz" ? "测试进度" : "实时特征抽取"}
              </h3>
              <div className="mb-4">
                <div className="mb-1 flex justify-between text-[10px] text-[var(--fg-muted)]">
                  <span>{phase === "math-quiz" ? "答题进度" : "画像进度"}</span>
                  <span>
                    {phase === "math-quiz"
                      ? `${mathIdx + (mathShowResult ? 1 : 0)} / ${mathQuestions.length}`
                      : `${Math.min(extracted.length * 20, 100)}%`}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-ink-700">
                  <motion.div
                    className="h-full bg-gradient-to-r from-vermilion-500 to-azure-500"
                    animate={{
                      width: phase === "math-quiz"
                        ? `${((mathIdx + (mathShowResult ? 1 : 0)) / mathQuestions.length) * 100}%`
                        : `${Math.min(extracted.length * 20, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {phase === "math-quiz" ? (
                <div className="space-y-2">
                  <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs">
                    <span className="text-[var(--fg-muted)]">用户名：</span>
                    <span className="text-[var(--fg)]">{username}</span>
                  </div>
                  <div className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs">
                    <span className="text-[var(--fg-muted)]">已答对：</span>
                    <span className="text-jade-400">
                      {mathAnswers.filter((a, i) => a === mathQuestions[i].correct).length} / {mathAnswers.length}
                    </span>
                  </div>
                  <div className="rounded-chip border border-aurum-500/30 bg-aurum-500/5 px-3 py-2 text-[11px] leading-relaxed text-[var(--fg-muted)]">
                    数学测试结果将直接影响画像中「知识基础」和「易错偏好」维度的初始分数。
                  </div>
                </div>
              ) : (
                <div className="flex-1 space-y-2 overflow-y-auto">
                  <AnimatePresence initial={false}>
                    {extracted.map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-chip border border-[var(--card-border)] bg-[var(--card)] px-3 py-2 text-xs"
                      >
                        <span className="text-jade-400">✓ </span>
                        <span className="text-[var(--fg)]">{e}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          <div className="mt-4 rounded-chip border border-azure-500/30 bg-azure-500/10 p-3 text-[11px] leading-relaxed text-[var(--fg-muted)]">
            {mode === "existing"
              ? "原有用户已具备完整画像，进入工作台后可随时在「学习画像」页随学随新。"
              : "灵境会从你的自然语言中自动抽取特征，无需填写繁琐表单。画像支持「随学随新」，每次更新都会生成新版本。"}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
