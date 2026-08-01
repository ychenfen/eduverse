import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  BarChart3,
  BookOpen,
  Code2,
  FileQuestion,
  Lightbulb,
  ArrowLeft,
  Trophy,
  Target,
  Zap,
  Shuffle,
  Plus,
  Heart,
  MessageCircle,
  Send,
  User,
  Scroll,
  Network,
  Brain,
  Sparkles,
  Rocket,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { practiceQuestions } from "@/data/practice";
import { chapters, knowledgeNodes } from "@/data/course";
import type { PracticeQuestion, PracticeType, UserQuestion } from "@/types";

const typeConfig: Record<PracticeType, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  single: { label: "单选题", icon: FileQuestion, color: "text-azure-400", bg: "from-azure-500/20 to-azure-500/5" },
  multiple: { label: "多选题", icon: BookOpen, color: "text-amethyst-400", bg: "from-amethyst-500/20 to-amethyst-500/5" },
  judge: { label: "判断题", icon: CheckCircle2, color: "text-jade-400", bg: "from-jade-500/20 to-jade-500/5" },
  fill: { label: "填空题", icon: Target, color: "text-aurum-400", bg: "from-aurum-500/20 to-aurum-500/5" },
  "code-fill": { label: "代码填空", icon: Code2, color: "text-vermilion-400", bg: "from-vermilion-500/20 to-vermilion-500/5" },
};

const difficultyMeta = {
  1: { label: "简单", color: "text-jade-400", bg: "bg-jade-500/15" },
  2: { label: "中等", color: "text-aurum-400", bg: "bg-aurum-500/15" },
  3: { label: "困难", color: "text-vermilion-400", bg: "bg-vermilion-500/15" },
};

type ViewMode = "select" | "training" | "result" | "publish" | "community";

export default function PracticePage() {
  const addPracticeRecord = useAppStore((s) => s.addPracticeRecord);
  const practiceRecords = useAppStore((s) => s.practiceRecords);
  const userQuestions = useAppStore((s) => s.userQuestions);
  const addUserQuestion = useAppStore((s) => s.addUserQuestion);
  const likeUserQuestion = useAppStore((s) => s.likeUserQuestion);
  const addQuestionComment = useAppStore((s) => s.addQuestionComment);

  const stats = useMemo(() => {
    const totalQ = practiceRecords.reduce((s, r) => s + r.totalQuestions, 0);
    const totalC = practiceRecords.reduce((s, r) => s + r.correctCount, 0);
    const days = new Set(practiceRecords.map((r) => r.date)).size;
    return {
      totalQuestions: totalQ,
      correctCount: totalC,
      accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
      days,
    };
  }, [practiceRecords]);

  const [view, setView] = useState<ViewMode>("select");
  const [selectedTypes, setSelectedTypes] = useState<PracticeType[]>(["single", "multiple", "judge", "fill", "code-fill"]);
  const [selectedChapters, setSelectedChapters] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number | number[]>>({});
  const [showResult, setShowResult] = useState(false);
  const [fillInput, setFillInput] = useState("");
  const [multiSelected, setMultiSelected] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const chapterIconMap: Record<string, LucideIcon> = {
    Scroll,
    Network,
    Brain,
    Sparkles,
    Rocket,
    Settings,
  };

  const toggleChapter = (chapterNo: number) => {
    setSelectedChapters((prev) =>
      prev.includes(chapterNo) ? prev.filter((c) => c !== chapterNo) : [...prev, chapterNo],
    );
  };

  // 发布题目表单
  const [pubForm, setPubForm] = useState({
    type: "single" as PracticeType,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0 as number,
    explanation: "",
    difficulty: 1 as 1 | 2 | 3,
    tags: "",
  });

  const totalByType = useMemo(() => {
    const counts: Record<string, number> = {};
    practiceQuestions.forEach((q) => {
      counts[q.type] = (counts[q.type] || 0) + 1;
    });
    return counts;
  }, []);

  const currentQ = questions[currentIndex];

  const toggleType = (type: PracticeType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const startPractice = () => {
    if (selectedTypes.length === 0) return;
    let filteredQs = practiceQuestions.filter((q) => selectedTypes.includes(q.type));
    if (selectedChapters.length > 0) {
      filteredQs = filteredQs.filter((q) => {
        const node = knowledgeNodes.find((n) => n.id === q.knowledgeId);
        return node && selectedChapters.includes(node.chapter);
      });
    }
    const shuffled = [...filteredQs].sort(() => Math.random() - 0.5);
    const qs = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    if (qs.length === 0) {
      alert("没有匹配的题目，请调整筛选条件");
      return;
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setFillInput("");
    setMultiSelected([]);
    setShowResult(false);
    setView("training");
  };

  const startRandomPractice = () => {
    let filteredQs = [...practiceQuestions];
    if (selectedChapters.length > 0) {
      filteredQs = filteredQs.filter((q) => {
        const node = knowledgeNodes.find((n) => n.id === q.knowledgeId);
        return node && selectedChapters.includes(node.chapter);
      });
    }
    const shuffled = filteredQs.sort(() => Math.random() - 0.5);
    const qs = shuffled.slice(0, Math.min(questionCount, shuffled.length));
    if (qs.length === 0) {
      alert("没有匹配的题目，请调整筛选条件");
      return;
    }
    setQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setFillInput("");
    setMultiSelected([]);
    setShowResult(false);
    setView("training");
  };

  const isCorrect = (q: PracticeQuestion, userAnswer: string | string[] | number | number[] | undefined): boolean => {
    if (userAnswer === undefined) return false;
    if (q.type === "single" || q.type === "judge") {
      return userAnswer === q.correctAnswer;
    }
    if (q.type === "multiple") {
      const ua = (userAnswer as number[]).slice().sort();
      const ca = (q.correctAnswer as number[]).slice().sort();
      return ua.length === ca.length && ua.every((v, i) => v === ca[i]);
    }
    if (q.type === "fill" || q.type === "code-fill") {
      const ua = String(userAnswer).trim().toLowerCase();
      const ca = String(q.correctAnswer).trim().toLowerCase();
      return ua === ca;
    }
    return false;
  };

  const submitAnswer = () => {
    let userAnswer: string | string[] | number | number[] | undefined;
    if (currentQ.type === "single" || currentQ.type === "judge") {
      userAnswer = answers[currentQ.id] as number | undefined;
    } else if (currentQ.type === "multiple") {
      userAnswer = multiSelected;
      setAnswers((a) => ({ ...a, [currentQ.id]: multiSelected }));
    } else if (currentQ.type === "fill" || currentQ.type === "code-fill") {
      userAnswer = fillInput;
      setAnswers((a) => ({ ...a, [currentQ.id]: fillInput }));
    }
    if (userAnswer === undefined && currentQ.type !== "multiple" && currentQ.type !== "fill" && currentQ.type !== "code-fill") return;
    if (currentQ.type === "multiple" && multiSelected.length === 0) return;
    if ((currentQ.type === "fill" || currentQ.type === "code-fill") && !fillInput.trim()) return;
    setShowResult(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
      setFillInput("");
      setMultiSelected([]);
    } else {
      finishPractice();
    }
  };

  const finishPractice = () => {
    const correct = questions.filter((q) => isCorrect(q, answers[q.id])).length;
    const knowledgeIds = [...new Set(questions.map((q) => q.knowledgeId))];
    const types = [...new Set(questions.map((q) => q.type))] as PracticeType[];

    addPracticeRecord({
      totalQuestions: questions.length,
      correctCount: correct,
      knowledgeIds,
      questionTypes: types,
    });

    setView("result");
  };

  const correctCount = questions.filter((q) => isCorrect(q, answers[q.id])).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  const handlePublish = () => {
    if (!pubForm.question.trim() || !pubForm.explanation.trim()) return;
    const needsOptions = pubForm.type === "single" || pubForm.type === "multiple" || pubForm.type === "judge";
    if (needsOptions && pubForm.options.some((o) => !o.trim())) return;

    const correctAnswer = pubForm.type === "single" || pubForm.type === "judge"
      ? pubForm.correctAnswer
      : pubForm.type === "multiple"
      ? [pubForm.correctAnswer]
      : pubForm.options[pubForm.correctAnswer] || "";

    addUserQuestion({
      type: pubForm.type,
      question: pubForm.question,
      options: needsOptions ? pubForm.options.filter((o) => o.trim()) : undefined,
      correctAnswer,
      explanation: pubForm.explanation,
      difficulty: pubForm.difficulty,
      tags: pubForm.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    });

    setPubForm({
      type: "single",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      difficulty: 1,
      tags: "",
    });
    setView("community");
  };

  const toggleComments = (id: string) => {
    setExpandedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderQuestion = () => {
    if (!currentQ) return null;
    const TypeIcon = typeConfig[currentQ.type].icon;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br",
            typeConfig[currentQ.type].bg,
          )}>
            <TypeIcon className={cn("h-5 w-5", typeConfig[currentQ.type].color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-medium", typeConfig[currentQ.type].color)}>
                {typeConfig[currentQ.type].label}
              </span>
              <span className={cn(
                "rounded-chip px-2 py-0.5 text-xs font-medium",
                difficultyMeta[currentQ.difficulty].bg,
                difficultyMeta[currentQ.difficulty].color,
              )}>
                {difficultyMeta[currentQ.difficulty].label}
              </span>
            </div>
            <div className="text-xs text-[var(--fg-muted)]">第 {currentIndex + 1} / {questions.length} 题</div>
          </div>
        </div>

        <div className="text-lg font-medium text-[var(--fg)] leading-relaxed">
          {currentQ.question}
        </div>

        {(currentQ.type === "single" || currentQ.type === "judge") && (
          <div className="space-y-3">
            {currentQ.type === "judge"
              ? [
                  { idx: 0, label: "正确", icon: "✓" },
                  { idx: 1, label: "错误", icon: "✗" },
                ].map(({ idx, label, icon }) => {
                  const selected = answers[currentQ.id] === idx;
                  const correct = currentQ.correctAnswer === idx;
                  let optClass = "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30";
                  if (showResult) {
                    if (correct) optClass = "border-jade-500 bg-jade-500/10";
                    else if (selected && !correct) optClass = "border-vermilion-500 bg-vermilion-500/10";
                  } else if (selected) {
                    optClass = "border-amethyst-500 bg-amethyst-500/10";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => !showResult && setAnswers((a) => ({ ...a, [currentQ.id]: idx }))}
                      disabled={showResult}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                        optClass,
                      )}
                    >
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        selected ? "bg-amethyst-500 text-white" : "bg-[var(--card-border)] text-[var(--fg-muted)]",
                        showResult && correct && "bg-jade-500 text-white",
                        showResult && selected && !correct && "bg-vermilion-500 text-white",
                      )}>
                        {icon}
                      </div>
                      <span className="text-sm text-[var(--fg)]">{label}</span>
                      {showResult && correct && <CheckCircle2 className="ml-auto h-5 w-5 text-jade-400" />}
                      {showResult && selected && !correct && <XCircle className="ml-auto h-5 w-5 text-vermilion-400" />}
                    </button>
                  );
                })
              : currentQ.options?.map((opt, idx) => {
                  const selected = answers[currentQ.id] === idx;
                  const correct = currentQ.correctAnswer === idx;
                  let optClass = "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30";
                  if (showResult) {
                    if (correct) optClass = "border-jade-500 bg-jade-500/10";
                    else if (selected && !correct) optClass = "border-vermilion-500 bg-vermilion-500/10";
                  } else if (selected) {
                    optClass = "border-amethyst-500 bg-amethyst-500/10";
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => !showResult && setAnswers((a) => ({ ...a, [currentQ.id]: idx }))}
                      disabled={showResult}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                        optClass,
                      )}
                    >
                      <div className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        selected ? "bg-amethyst-500 text-white" : "bg-[var(--card-border)] text-[var(--fg-muted)]",
                        showResult && correct && "bg-jade-500 text-white",
                        showResult && selected && !correct && "bg-vermilion-500 text-white",
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm text-[var(--fg)]">{opt}</span>
                      {showResult && correct && <CheckCircle2 className="ml-auto h-5 w-5 text-jade-400" />}
                      {showResult && selected && !correct && <XCircle className="ml-auto h-5 w-5 text-vermilion-400" />}
                    </button>
                  );
                })}
          </div>
        )}

        {currentQ.type === "multiple" && (
          <div className="space-y-3">
            {currentQ.options?.map((opt, idx) => {
              const selected = multiSelected.includes(idx);
              const correct = (currentQ.correctAnswer as number[]).includes(idx);
              let optClass = "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30";
              if (showResult) {
                if (correct) optClass = "border-jade-500 bg-jade-500/10";
                else if (selected && !correct) optClass = "border-vermilion-500 bg-vermilion-500/10";
              } else if (selected) {
                optClass = "border-amethyst-500 bg-amethyst-500/10";
              }
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (showResult) return;
                    setMultiSelected((prev) =>
                      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
                    );
                  }}
                  disabled={showResult}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    optClass,
                  )}
                >
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold",
                    selected ? "bg-amethyst-500 text-white" : "bg-[var(--card-border)] text-[var(--fg-muted)]",
                    showResult && correct && "bg-jade-500 text-white",
                    showResult && selected && !correct && "bg-vermilion-500 text-white",
                  )}>
                    {selected ? "✓" : String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-sm text-[var(--fg)]">{opt}</span>
                </button>
              );
            })}
          </div>
        )}

        {(currentQ.type === "fill" || currentQ.type === "code-fill") && (
          <div className="space-y-3">
            {currentQ.type === "code-fill" && currentQ.codeTemplate && (
              <pre className="overflow-x-auto rounded-xl bg-[var(--ink-900)] p-4 text-sm text-[var(--fg)]">
                <code>
                  {currentQ.codeTemplate.split("______").map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="inline-block min-w-[80px] border-b-2 border-aurum-400 px-1 text-aurum-300">
                          {showResult ? currentQ.correctAnswer : fillInput || "____"}
                        </span>
                      )}
                    </span>
                  ))}
                </code>
              </pre>
            )}
            <div className="relative">
              <input
                type="text"
                value={fillInput}
                onChange={(e) => !showResult && setFillInput(e.target.value)}
                disabled={showResult}
                placeholder="请输入你的答案..."
                className={cn(
                  "w-full rounded-xl border bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors",
                  showResult && isCorrect(currentQ, fillInput)
                    ? "border-jade-500 bg-jade-500/5"
                    : showResult && !isCorrect(currentQ, fillInput)
                    ? "border-vermilion-500 bg-vermilion-500/5"
                    : "border-[var(--card-border)] focus:border-amethyst-500",
                )}
              />
            </div>
            {showResult && !isCorrect(currentQ, fillInput) && (
              <div className="text-sm text-jade-400">
                <span className="text-[var(--fg-muted)]">正确答案：</span>
                <code className="rounded bg-jade-500/10 px-2 py-0.5">{currentQ.correctAnswer}</code>
              </div>
            )}
          </div>
        )}

        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border p-4",
              isCorrect(currentQ, answers[currentQ.id])
                ? "border-jade-500/30 bg-jade-500/5"
                : "border-vermilion-500/30 bg-vermilion-500/5",
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect(currentQ, answers[currentQ.id]) ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-jade-400" />
                  <span className="font-medium text-jade-400">回答正确！</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-vermilion-400" />
                  <span className="font-medium text-vermilion-400">回答错误</span>
                </>
              )}
            </div>
            <div className="flex items-start gap-2 text-sm text-[var(--fg-muted)]">
              <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-aurum-400" />
              <span>{currentQ.explanation}</span>
            </div>
          </motion.div>
        )}

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-[var(--fg-muted)]">
            进度：{currentIndex + 1} / {questions.length}
          </div>
          <div className="flex gap-3">
            {!showResult ? (
              <button
                onClick={submitAnswer}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amethyst-500 to-vermilion-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
              >
                提交答案
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-azure-500 to-jade-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
              >
                {currentIndex < questions.length - 1 ? "下一题" : "完成练习"}
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUserQuestion = (q: UserQuestion) => {
    const expanded = expandedComments.has(q.id);
    const TypeIcon = typeConfig[q.type].icon;
    return (
      <div key={q.id} className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-5 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br", typeConfig[q.type].bg)}>
              <TypeIcon className={cn("h-4 w-4", typeConfig[q.type].color)} />
            </div>
            <span className={cn("text-xs font-medium", typeConfig[q.type].color)}>{typeConfig[q.type].label}</span>
            <span className={cn("rounded-chip px-2 py-0.5 text-xs", difficultyMeta[q.difficulty].bg, difficultyMeta[q.difficulty].color)}>
              {difficultyMeta[q.difficulty].label}
            </span>
          </div>
          <span className="text-xs text-[var(--fg-muted)]">{q.createdAt}</span>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 text-xs font-bold text-white">
            {q.authorAvatar}
          </div>
          <span className="text-xs text-[var(--fg-muted)]">{q.author}</span>
        </div>

        <p className="mb-3 text-sm font-medium text-[var(--fg)] leading-relaxed">{q.question}</p>

        {q.options && q.options.length > 0 && (
          <div className="mb-3 space-y-2">
            {q.options.map((opt, idx) => {
              const correctAns = q.correctAnswer;
              const isCorrect = (typeof correctAns === "number" && correctAns === idx) ||
                (Array.isArray(correctAns) && (correctAns as number[]).includes(idx));
              return (
                <div key={idx} className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                  isCorrect ? "border-jade-500/40 bg-jade-500/5" : "border-[var(--card-border)]",
                )}>
                  <span className="text-xs font-bold text-[var(--fg-muted)]">{String.fromCharCode(65 + idx)}</span>
                  <span className="text-[var(--fg)]">{opt}</span>
                  {isCorrect && <CheckCircle2 className="ml-auto h-4 w-4 text-jade-400" />}
                </div>
              );
            })}
          </div>
        )}

        <div className="mb-3 rounded-lg bg-aurum-500/5 border border-aurum-500/20 p-3">
          <div className="flex items-start gap-2 text-xs text-[var(--fg-muted)]">
            <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-aurum-400" />
            <span>{q.explanation}</span>
          </div>
        </div>

        {q.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {q.tags.map((tag) => (
              <span key={tag} className="rounded-chip bg-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--fg-muted)]">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 border-t border-[var(--card-border)] pt-3">
          <button
            onClick={() => likeUserQuestion(q.id)}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              q.likedByMe ? "text-vermilion-400" : "text-[var(--fg-muted)] hover:text-[var(--fg)]",
            )}
          >
            <Heart className={cn("h-4 w-4", q.likedByMe && "fill-current")} />
            {q.likes}
          </button>
          <button
            onClick={() => toggleComments(q.id)}
            className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
          >
            <MessageCircle className="h-4 w-4" />
            {q.comments.length} 评论
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {q.comments.map((cmt) => (
                  <div key={cmt.id} className="flex items-start gap-2 rounded-lg bg-[var(--bg)]/40 p-2">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-azure-500 to-amethyst-500 text-xs font-bold text-white">
                      {cmt.authorAvatar}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-[var(--fg)]">{cmt.author}</div>
                      <div className="text-xs text-[var(--fg-muted)]">{cmt.content}</div>
                    </div>
                    <span className="text-[10px] text-[var(--fg-muted)]">{cmt.createdAt}</span>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    value={commentInputs[q.id] || ""}
                    onChange={(e) => setCommentInputs((p) => ({ ...p, [q.id]: e.target.value }))}
                    placeholder="发表你的看法..."
                    className="h-8 flex-1 rounded-full border border-[var(--card-border)] bg-[var(--bg)] px-3 text-xs text-[var(--fg)] outline-none focus:border-amethyst-500"
                  />
                  <button
                    onClick={() => {
                      const text = (commentInputs[q.id] || "").trim();
                      if (!text) return;
                      addQuestionComment(q.id, text);
                      setCommentInputs((p) => ({ ...p, [q.id]: "" }));
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amethyst-500 to-azure-500 text-white"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">题库训练</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            选择题型，开始练习，强化知识掌握
          </p>
        </div>
        {view === "select" && (
          <div className="flex gap-2">
            <button
              onClick={() => setView("community")}
              className="flex items-center gap-2 rounded-full border border-[var(--card-border)] px-4 py-2 text-sm text-[var(--fg)] transition-colors hover:border-amethyst-500/50"
            >
              <User className="h-4 w-4" />
              社区题库
            </button>
            <button
              onClick={() => setView("publish")}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-amethyst-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              发布题目
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6 lg:grid-cols-3"
          >
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-4">选择题型</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Object.keys(typeConfig) as PracticeType[]).map((type) => {
                    const { label, icon: Icon, color, bg } = typeConfig[type];
                    const selected = selectedTypes.includes(type);
                    const count = totalByType[type] || 0;
                    return (
                      <button
                        key={type}
                        onClick={() => toggleType(type)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all",
                          selected
                            ? "border-amethyst-500 bg-amethyst-500/10 scale-105"
                            : "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30",
                        )}
                      >
                        <div className={cn(
                          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                          bg,
                        )}>
                          <Icon className={cn("h-6 w-6", color)} />
                        </div>
                        <span className="text-sm font-medium text-[var(--fg)]">{label}</span>
                        <span className="text-xs text-[var(--fg-muted)]">{count} 道题</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-4">题目数量</h2>
                <div className="flex flex-wrap gap-3">
                  {[5, 10, 15, 20, 30].map((n) => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={cn(
                        "rounded-xl px-6 py-3 text-sm font-medium transition-all",
                        questionCount === n
                          ? "bg-gradient-to-r from-amethyst-500 to-vermilion-500 text-white shadow-glow"
                          : "border border-[var(--card-border)] text-[var(--fg)] hover:border-amethyst-500/50",
                      )}
                    >
                      {n} 题
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-4">选择章节（可选）</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {chapters.map((ch) => {
                    const Icon = chapterIconMap[ch.icon] || Scroll;
                    const selected = selectedChapters.includes(ch.no);
                    return (
                      <button
                        key={ch.no}
                        onClick={() => toggleChapter(ch.no)}
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all",
                          selected
                            ? "border-amethyst-500 bg-amethyst-500/10 scale-105"
                            : "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30",
                        )}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${ch.color}20` }}>
                          <Icon className="h-5 w-5" style={{ color: ch.color }} />
                        </div>
                        <span className="text-xs font-medium text-[var(--fg)]">{ch.title}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedChapters.length > 0 && (
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => setSelectedChapters([])}
                      className="text-xs text-[var(--fg-muted)] hover:text-vermilion-400 transition-colors"
                    >
                      清除章节选择
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={startPractice}
                  disabled={selectedTypes.length === 0}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 rounded-full py-4 text-base font-semibold transition-all",
                    selectedTypes.length > 0
                      ? "bg-gradient-to-r from-vermilion-500 via-amethyst-500 to-azure-500 text-white shadow-glow hover:scale-[1.02]"
                      : "bg-[var(--card-border)] text-[var(--fg-muted)] cursor-not-allowed",
                  )}
                >
                  <Play className="h-5 w-5" />
                  开始练习
                </button>
                <button
                  onClick={startRandomPractice}
                  className="flex items-center justify-center gap-2 rounded-full border border-amethyst-500/50 px-6 py-4 text-base font-semibold text-amethyst-400 transition-all hover:bg-amethyst-500/10"
                >
                  <Shuffle className="h-5 w-5" />
                  随机抽题
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-[var(--fg)] mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amethyst-400" />
                  训练统计
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--fg-muted)]">累计做题</span>
                    <span className="text-xl font-bold text-[var(--fg)]">{stats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--fg-muted)]">正确题数</span>
                    <span className="text-xl font-bold text-jade-400">{stats.correctCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--fg-muted)]">正确率</span>
                    <span className="text-xl font-bold text-azure-400">{stats.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[var(--fg-muted)]">训练天数</span>
                    <span className="text-xl font-bold text-aurum-400">{stats.days} 天</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[var(--card-border)] bg-gradient-to-br from-vermilion-500/10 via-amethyst-500/10 to-azure-500/10 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-aurum-400" />
                  <span className="font-semibold text-[var(--fg)]">今日目标</span>
                </div>
                <p className="text-sm text-[var(--fg-muted)] mb-4">
                  每天坚持做题，保持手感，掌握度稳步提升
                </p>
                <div className="text-2xl font-bold text-gradient">
                  坚持就是胜利
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === "training" && (
          <motion.div
            key="training"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-4">
              <button
                onClick={() => setView("select")}
                className="flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                返回选题
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-[var(--fg-muted)] mb-2">
                <span>答题进度</span>
                <span>{currentIndex + 1} / {questions.length}</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--card-border)] overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-vermilion-500 to-amethyst-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
              {renderQuestion()}
            </div>
          </motion.div>
        )}

        {view === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-10 backdrop-blur-sm">
              <div className="mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-jade-500 to-azure-500 shadow-glow"
                >
                  <Trophy className="h-10 w-10 text-white" />
                </motion.div>
              </div>

              <h2 className="text-2xl font-bold text-[var(--fg)] mb-2">练习完成！</h2>
              <p className="text-[var(--fg-muted)] mb-8">做得很棒，继续保持！</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl bg-[var(--bg)]/50 p-4">
                  <div className="text-3xl font-bold text-[var(--fg)]">{questions.length}</div>
                  <div className="text-sm text-[var(--fg-muted)]">总题数</div>
                </div>
                <div className="rounded-xl bg-[var(--bg)]/50 p-4">
                  <div className="text-3xl font-bold text-jade-400">{correctCount}</div>
                  <div className="text-sm text-[var(--fg-muted)]">正确数</div>
                </div>
                <div className="rounded-xl bg-[var(--bg)]/50 p-4">
                  <div className="text-3xl font-bold text-amethyst-400">{score}%</div>
                  <div className="text-sm text-[var(--fg-muted)]">正确率</div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={startPractice}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amethyst-500 to-vermilion-500 px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
                >
                  <RotateCcw className="h-4 w-4" />
                  再来一组
                </button>
                <button
                  onClick={() => setView("select")}
                  className="flex items-center gap-2 rounded-full border border-[var(--card-border)] px-6 py-3 text-sm font-medium text-[var(--fg)] hover:border-amethyst-500/50 transition-colors"
                >
                  返回选题
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === "publish" && (
          <motion.div
            key="publish"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-4">
              <button
                onClick={() => setView("select")}
                className="flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                返回选题
              </button>
            </div>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm space-y-5">
              <h2 className="text-lg font-semibold text-[var(--fg)]">发布你的题目</h2>

              <div>
                <label className="mb-2 block text-sm text-[var(--fg-muted)]">题型</label>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(typeConfig) as PracticeType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setPubForm((p) => ({ ...p, type }))}
                      className={cn(
                        "rounded-xl border px-4 py-2 text-sm transition-all",
                        pubForm.type === type
                          ? "border-amethyst-500 bg-amethyst-500/10 text-amethyst-400"
                          : "border-[var(--card-border)] text-[var(--fg-muted)] hover:border-[var(--fg-muted)]/30",
                      )}
                    >
                      {typeConfig[type].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--fg-muted)]">题目内容</label>
                <textarea
                  value={pubForm.question}
                  onChange={(e) => setPubForm((p) => ({ ...p, question: e.target.value }))}
                  placeholder="输入题目内容..."
                  rows={3}
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-amethyst-500"
                />
              </div>

              {(pubForm.type === "single" || pubForm.type === "multiple" || pubForm.type === "judge") && (
                <div>
                  <label className="mb-2 block text-sm text-[var(--fg-muted)]">
                    选项（点击选择正确答案）
                  </label>
                  <div className="space-y-2">
                    {pubForm.options.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <button
                          onClick={() => setPubForm((p) => ({ ...p, correctAnswer: idx }))}
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                            pubForm.correctAnswer === idx
                              ? "bg-jade-500 text-white"
                              : "bg-[var(--card-border)] text-[var(--fg-muted)]",
                          )}
                        >
                          {String.fromCharCode(65 + idx)}
                        </button>
                        <input
                          value={opt}
                          onChange={(e) => {
                            const next = [...pubForm.options];
                            next[idx] = e.target.value;
                            setPubForm((p) => ({ ...p, options: next }));
                          }}
                          placeholder={`选项 ${String.fromCharCode(65 + idx)}`}
                          className="h-10 flex-1 rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-3 text-sm text-[var(--fg)] outline-none focus:border-amethyst-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm text-[var(--fg-muted)]">难度</label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setPubForm((p) => ({ ...p, difficulty: d }))}
                      className={cn(
                        "rounded-xl border px-4 py-2 text-sm transition-all",
                        pubForm.difficulty === d
                          ? cn(difficultyMeta[d].bg, difficultyMeta[d].color, "border-transparent")
                          : "border-[var(--card-border)] text-[var(--fg-muted)]",
                      )}
                    >
                      {difficultyMeta[d].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--fg-muted)]">题解解析</label>
                <textarea
                  value={pubForm.explanation}
                  onChange={(e) => setPubForm((p) => ({ ...p, explanation: e.target.value }))}
                  placeholder="输入题目解析..."
                  rows={3}
                  className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-amethyst-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-[var(--fg-muted)]">标签（逗号分隔）</label>
                <input
                  value={pubForm.tags}
                  onChange={(e) => setPubForm((p) => ({ ...p, tags: e.target.value }))}
                  placeholder="如：机器学习, 神经网络"
                  className="h-10 w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 text-sm text-[var(--fg)] outline-none focus:border-amethyst-500"
                />
              </div>

              <button
                onClick={handlePublish}
                disabled={!pubForm.question.trim() || !pubForm.explanation.trim()}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all",
                  pubForm.question.trim() && pubForm.explanation.trim()
                    ? "bg-gradient-to-r from-vermilion-500 to-amethyst-500 text-white shadow-glow hover:scale-[1.02]"
                    : "bg-[var(--card-border)] text-[var(--fg-muted)] cursor-not-allowed",
                )}
              >
                <Send className="h-4 w-4" />
                发布题目
              </button>
            </div>
          </motion.div>
        )}

        {view === "community" && (
          <motion.div
            key="community"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-4">
              <button
                onClick={() => setView("select")}
                className="flex items-center gap-1 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                返回选题
              </button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--fg)]">社区题库</h2>
              <button
                onClick={() => setView("publish")}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-amethyst-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                发布题目
              </button>
            </div>

            {userQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--card-border)] p-12 text-center">
                <User className="mx-auto mb-3 h-10 w-10 text-[var(--fg-muted)]" />
                <p className="text-sm text-[var(--fg-muted)]">还没有社区题目，快来发布第一道题吧！</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userQuestions.map(renderUserQuestion)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
