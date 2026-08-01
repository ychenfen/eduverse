import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  PlayCircle,
  FileText,
  Code2,
  Brain,
  ChevronRight,
  X,
  Send,
  RefreshCw,
  Trophy,
  Award,
  AlertTriangle,
  CircleCheck,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import RadarChart from "@/components/RadarChart";
import AnimationPlayer from "@/components/AnimationPlayer";
import { assessmentDimensions, getQuizByKnowledgeId } from "@/data/learner";
import { knowledgeNodes, getKnowledgeById, chapters } from "@/data/course";
import { useAppStore } from "@/store/useAppStore";
import { preGeneratedResources } from "@/data/resources";
import type { QuizQuestion, QuizResult, KnowledgeNode, AnimationScene, StudyPlanTaskRef } from "@/types";

type ViewMode = "dashboard" | "learn" | "quiz" | "result";

interface PlanContext {
  planId: string;
  task: StudyPlanTaskRef;
}

export default function Assessment() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeNode | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | number[])[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [advice, setAdvice] = useState<string | null>(null);
  const [advising, setAdvising] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [learnStep, setLearnStep] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [planContext, setPlanContext] = useState<PlanContext | null>(null);
  const { learningRecords: storeRecords, markAsLearned, completeQuiz, completeStudyPlanTask } = useAppStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 支持从 URL 参数自动选择知识点并进入学习
  useEffect(() => {
    const kid = searchParams.get("knowledge");
    if (kid) {
      const node = getKnowledgeById(kid);
      if (node) {
        const taskType = searchParams.get("taskType");
        const day = Number(searchParams.get("day"));
        const planId = searchParams.get("plan");
        const validTaskTypes: StudyPlanTaskRef["type"][] = ["video", "reading", "practice", "quiz", "project"];
        const context = searchParams.get("source") === "plan"
          && planId
          && Number.isInteger(day)
          && day > 0
          && validTaskTypes.includes(taskType as StudyPlanTaskRef["type"])
          ? {
              planId,
              task: {
                day,
                knowledgeId: node.id,
                type: taskType as StudyPlanTaskRef["type"],
              },
            }
          : null;
        const requestedMode = searchParams.get("mode");
        const questions = requestedMode === "quiz" ? getQuizByKnowledgeId(node.id) : [];
        // URL 是跨页面深链入口，这里需要把外部导航同步为本页交互状态。
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedKnowledge(node);
        setPlanContext(context);
        if (requestedMode === "quiz" && questions.length > 0) {
          setQuizQuestions(questions);
          setCurrentQuestionIndex(0);
          setUserAnswers(new Array(questions.length).fill(null));
          setQuizResult(null);
          setViewMode("quiz");
        } else {
          setViewMode("learn");
        }
        setLearningProgress(0);
        setLearnStep(0);
      }
      // 清理入口参数，交互上下文已保存在组件状态中，避免刷新重复触发。
      setSearchParams(new URLSearchParams(), { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const totalMinutes = storeRecords.reduce((s, r) => s + r.timeSpent, 0);
  const avgMastery = storeRecords.length > 0
    ? Math.round(storeRecords.reduce((s, r) => s + r.mastery, 0) / storeRecords.length)
    : 0;
  const totalExercises = storeRecords.reduce((s, r) => s + r.exercisesTotal, 0);
  const correctExercises = storeRecords.reduce((s, r) => s + r.exercisesCorrect, 0);
  const accuracy = totalExercises > 0 ? Math.round((correctExercises / totalExercises) * 100) : 0;

  const generateAdvice = async () => {
    setAdvising(true);
    setAdvice(null);
    await new Promise((r) => setTimeout(r, 1400));

    const learnedNodes = heatmap.filter((h) => h.learned || h.mastery > 0);
    const notLearnedNodes = heatmap.filter((h) => !h.learned && h.mastery === 0);
    const weakNodes = learnedNodes
      .filter((h) => h.mastery > 0 && h.mastery < 70)
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, 5);
    const strongNodes = learnedNodes
      .filter((h) => h.mastery >= 85)
      .sort((a, b) => b.mastery - a.mastery)
      .slice(0, 3);

    const avgMasteryLine = learnedNodes.length > 0
      ? `平均掌握度 ${avgMastery}%（${avgMastery >= 75 ? "整体达标" : avgMastery >= 60 ? "中等水平，仍有提升空间" : "基础薄弱，建议重点补足"}）`
      : "暂无已学知识点数据，建议从学习计划首页开始学习";

    const accuracyLine = totalExercises > 0
      ? `题库正确率 ${accuracy}%（共完成 ${totalExercises} 题，答对 ${correctExercises} 题）`
      : "尚未完成题库练习，建议学完知识点后参与测验";

    const weakLine = weakNodes.length > 0
      ? `薄弱知识点：${weakNodes.map((h) => `${h.node.title}(${h.mastery}%)`).join("、")}`
      : "暂无显著薄弱知识点，继续保持";

    const strongLine = strongNodes.length > 0
      ? `优势知识点：${strongNodes.map((h) => `${h.node.title}(${h.mastery}%)`).join("、")}`
      : "暂无优势知识点数据";

    const notLearnedLine = notLearnedNodes.length > 0
      ? `待学习知识点：${notLearnedNodes.length} 个`
      : "已完成全部知识点的学习";

    const chapterStats = chapters.map((ch) => {
      const nodes = knowledgeNodes.filter((n) => n.chapter === ch.no);
      const mastered = nodes.filter((n) => {
        const rec = storeRecords.find((r) => r.knowledgeId === n.id);
        return rec?.learned && rec?.quizCompleted && rec?.mastery >= 60;
      }).length;
      return { ...ch, total: nodes.length, mastered };
    });
    const weakestChapter = [...chapterStats]
      .filter((c) => c.total > 0)
      .sort((a, b) => a.mastered / a.total - b.mastered / b.total)[0];

    const recommendationLines: string[] = [];
    if (weakNodes.length > 0) {
      recommendationLines.push(`1. 优先复习薄弱知识点：${weakNodes[0].node.title}，通过重新学习和测验将掌握度提升到 80% 以上`);
    }
    if (notLearnedNodes.length > 0) {
      recommendationLines.push(`${recommendationLines.length + 1}. 开启新知识点学习：${notLearnedNodes[0].node.title}，预计 ${notLearnedNodes[0].node.estimatedMinutes} 分钟`);
    }
    if (weakestChapter && weakestChapter.mastered < weakestChapter.total) {
      recommendationLines.push(`${recommendationLines.length + 1}. 强化「${weakestChapter.title}」章节，当前仅掌握 ${weakestChapter.mastered}/${weakestChapter.total} 个知识点`);
    }
    if (totalExercises > 0 && accuracy < 80) {
      recommendationLines.push(`${recommendationLines.length + 1}. 题库正确率偏低，建议针对错题进行二次练习`);
    }
    if (recommendationLines.length === 0) {
      recommendationLines.push("1. 学习状态优秀，建议挑战更高难度的拓展资源");
      recommendationLines.push("2. 查看学习画像，探索新的兴趣方向");
    }

    setAdvice(`基于近 30 天学习行为与评估数据，生成个性化调优方案：

**📊 多维分析**
- ${avgMasteryLine}
- ${accuracyLine}
- ${weakLine}
- ${strongLine}
- ${notLearnedLine}

**🎯 资源推送策略调整**
${recommendationLines.join("\n")}

**📅 学习计划动态调整**
- 本周聚焦：${weakestChapter ? `巩固「${weakestChapter.title}」章节，目标完成 ${weakestChapter.total - weakestChapter.mastered} 个知识点` : "完成基础学习"}
- 每日建议学习时长：${avgMastery >= 75 ? "45-60 分钟" : avgMastery >= 60 ? "60-90 分钟" : "90-120 分钟，循序渐进"}
- 建议复习周期：薄弱知识点 3 天后再次测验，已掌握知识点 7 天后回顾一次`);
    setAdvising(false);
  };

  const heatmap = knowledgeNodes.map((n) => {
    const rec = storeRecords.find((r) => r.knowledgeId === n.id);
    return {
      node: n,
      mastery: rec?.mastery ?? 0,
      learned: rec?.learned ?? false,
      quizCompleted: rec?.quizCompleted ?? false,
    };
  });

  const masteryColor = (m: number) => {
    if (m === 0) return "rgba(74,86,112,0.2)";
    if (m < 50) return "rgba(230,57,70,0.6)";
    if (m < 70) return "rgba(244,162,97,0.7)";
    if (m < 85) return "rgba(27,154,170,0.7)";
    return "rgba(16,185,129,0.8)";
  };

  const stats = [
    { label: "平均掌握度", value: avgMastery, unit: "%", icon: Target, color: "#10B981" },
    { label: "累计学习", value: totalMinutes, unit: "min", icon: Clock, color: "#1B9AAA" },
    { label: "题库正确率", value: accuracy, unit: "%", icon: CheckCircle2, color: "#F4A261" },
    { label: "题库完成", value: `${correctExercises}/${totalExercises}`, unit: "", icon: Gauge, color: "#9D4EDD" },
  ];

  const handleStartLearn = (node: KnowledgeNode) => {
    setPlanContext(null);
    setSelectedKnowledge(node);
    setLearningProgress(0);
    setLearnStep(0);
    setShowVideo(false);
    setViewMode("learn");
  };

  const getAnimationScenes = (knowledgeId: string): AnimationScene[] => {
    const resource = preGeneratedResources.find(
      (r) => r.knowledgeId === knowledgeId && r.type === "animation"
    );
    return resource?.metadata.animationScenes || [];
  };

  const handleCompleteStep = () => {
    if (learnStep < 3) {
      setLearnStep(learnStep + 1);
      setLearningProgress((learnStep + 1) * 25);
    }
  };

  const handleToggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const handleCompleteLearn = () => {
    if (selectedKnowledge) {
      setLearnStep(4);
      setLearningProgress(100);
      markAsLearned(selectedKnowledge.id);
      if (planContext && planContext.task.type !== "quiz") {
        completeStudyPlanTask(planContext.planId, planContext.task);
      }
    }
  };

  const handleStartQuiz = (node: KnowledgeNode) => {
    const questions = getQuizByKnowledgeId(node.id);
    if (questions.length === 0) {
      alert("该知识点暂无测验题目");
      return;
    }
    if (viewMode === "dashboard") setPlanContext(null);
    setSelectedKnowledge(node);
    setQuizQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setQuizResult(null);
    setViewMode("quiz");
  };

  const handleAnswer = (answer: number | number[]) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (userAnswers.some((a) => a === null)) {
      alert("请完成所有题目后提交");
      return;
    }
    let correctCount = 0;
    const answers = quizQuestions.map((q, i) => {
      const userAnswer = userAnswers[i];
      const correct = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
      const user = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
      const isCorrect = q.type === "multiple"
        ? correct.length === user.length && correct.every((answer) => user.includes(answer))
        : userAnswer === q.correctAnswer;
      if (isCorrect) correctCount++;
      return { questionId: q.id, userAnswer, isCorrect };
    });
    const score = Math.round((correctCount / quizQuestions.length) * 100);
    const masteryLevel: "mastered" | "partial" | "weak" =
      score >= 80 ? "mastered" : score >= 60 ? "partial" : "weak";
    const result: QuizResult = {
      knowledgeId: selectedKnowledge!.id,
      score,
      totalQuestions: quizQuestions.length,
      correctCount,
      answers,
      masteryLevel,
    };
    setQuizResult(result);
    completeQuiz(selectedKnowledge!.id, result);
    if (planContext?.task.type === "quiz") {
      completeStudyPlanTask(planContext.planId, planContext.task);
    }
    setViewMode("result");
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(quizQuestions.length).fill(null));
    setQuizResult(null);
    setViewMode("quiz");
  };

  const handleBackToDashboard = () => {
    setViewMode("dashboard");
    setSelectedKnowledge(null);
    setQuizResult(null);
    setPlanContext(null);
  };

  const returnToPlan = () => navigate("/plan");

  const groupedKnowledge = chapters.map((ch) => ({
    ...ch,
    nodes: knowledgeNodes.filter((n) => n.chapter === ch.no),
  }));

  const planContextBanner = planContext ? (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-amethyst-500/30 bg-amethyst-500/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amethyst-500/20">
          <Target className="h-4 w-4 text-amethyst-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-[var(--fg)]">学习计划 · 第 {planContext.task.day} 天任务</div>
          <div className="text-xs text-[var(--fg-muted)]">完成后将自动回写任务进度、学习时长与掌握度</div>
        </div>
      </div>
      <button
        type="button"
        onClick={returnToPlan}
        className="rounded-full border border-amethyst-500/30 px-3 py-1.5 text-xs font-medium text-amethyst-400 transition-colors hover:bg-amethyst-500/10"
      >
        返回计划
      </button>
    </div>
  ) : null;

  return (
    <div className="px-6 py-6 lg:px-10">
      <AnimatePresence mode="wait">
        {viewMode === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">学习效果评估</h1>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  章节学习 · 测验评估 · 掌握判定
                </p>
              </div>
              <button
                onClick={generateAdvice}
                disabled={advising}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-aurum-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105 disabled:opacity-60"
              >
                <Sparkles className={cn("h-4 w-4", advising && "animate-spin")} />
                {advising ? "正在生成调优方案…" : "生成调优方案"}
              </button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass relative overflow-hidden rounded-card p-5"
                  >
                    <Icon className="mb-3 h-5 w-5" style={{ color: s.color }} />
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-3xl font-bold text-[var(--fg)]">{s.value}</span>
                      <span className="text-sm text-[var(--fg-muted)]">{s.unit}</span>
                    </div>
                    <div className="mt-1 text-xs text-[var(--fg-muted)]">{s.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <section className="glass rounded-card p-6">
                  <h2 className="mb-4 font-serif text-base font-semibold text-[var(--fg)]">
                    章节学习进度
                  </h2>
                  <div className="space-y-4">
                    {groupedKnowledge.map((ch, chIndex) => (
                      <motion.div
                        key={ch.no}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: chIndex * 0.08 }}
                        className="border border-[var(--card-border)] rounded-card bg-[var(--card)] overflow-hidden"
                      >
                        <div
                          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--card-hover)]"
                          onClick={() => {
                            const el = document.getElementById(`chapter-${ch.no}`);
                            if (el) el.style.display = el.style.display === "none" ? "block" : "none";
                          }}
                        >
                          <div
                            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            style={{ backgroundColor: ch.color }}
                          >
                            {ch.no}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-[var(--fg)]">{ch.title}</h3>
                            <p className="text-xs text-[var(--fg-muted)]">{ch.desc}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--fg-muted)]">
                              {ch.nodes.filter((n) => {
                                const rec = storeRecords.find((r) => r.knowledgeId === n.id);
                                return rec?.learned && rec?.quizCompleted && rec?.mastery >= 60;
                              }).length}/{ch.nodes.length} 已掌握
                            </span>
                            <ChevronRight className="h-4 w-4 text-[var(--fg-muted)]" />
                          </div>
                        </div>
                        <div id={`chapter-${ch.no}`} className="border-t border-[var(--card-border)]">
                          <div className="p-3 space-y-2">
                            {ch.nodes.map((node) => {
                              const record = storeRecords.find((r) => r.knowledgeId === node.id);
                              const isCompleted = record?.learned && record?.quizCompleted;
                              const isMastered = isCompleted && record?.mastery >= 60;
                              const hasQuiz = getQuizByKnowledgeId(node.id).length > 0;
                              return (
                                <motion.div
                                  key={node.id}
                                  initial={{ opacity: 0, scale: 0.98 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="flex items-center gap-3 p-3 rounded-chip border border-[var(--card-border)] bg-[var(--bg)] hover:border-amethyst-500/50 transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm text-[var(--fg)]">
                                        {node.title}
                                      </span>
                                      {isMastered && (
                                        <CircleCheck className="h-4 w-4 text-jade-400" />
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-[var(--fg-muted)]">
                                        {node.estimatedMinutes}分钟
                                      </span>
                                      <span className="text-xs text-[var(--fg-muted)]">
                                        难度: {"★".repeat(node.difficulty)}
                                      </span>
                                      {record?.mastery > 0 && (
                                        <span className={`text-xs ${
                                          record.mastery >= 80 ? "text-jade-400" :
                                          record.mastery >= 60 ? "text-aurum-400" :
                                          "text-vermilion-400"
                                        }`}>
                                          掌握度: {record.mastery}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!record?.learned ? (
                                      <button
                                        onClick={() => handleStartLearn(node)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-amethyst-500/10 text-amethyst-400 hover:bg-amethyst-500/20 transition-colors"
                                      >
                                        <BookOpen className="h-3 w-3" />
                                        学习
                                      </button>
                                    ) : !record?.quizCompleted && hasQuiz ? (
                                      <button
                                        onClick={() => handleStartQuiz(node)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-aurum-500/10 text-aurum-400 hover:bg-aurum-500/20 transition-colors"
                                      >
                                        <Brain className="h-3 w-3" />
                                        测验
                                      </button>
                                    ) : isMastered ? (
                                      <div className="flex items-center gap-1 text-xs text-jade-400">
                                        <Trophy className="h-3 w-3" />
                                        已掌握
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => handleStartQuiz(node)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-vermilion-500/10 text-vermilion-400 hover:bg-vermilion-500/20 transition-colors"
                                      >
                                        <RefreshCw className="h-3 w-3" />
                                        重新测验
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="glass rounded-card p-6">
                  <h2 className="mb-4 font-serif text-base font-semibold text-[var(--fg)]">
                    知识点掌握热力图
                  </h2>
                  <div className="grid grid-cols-6 gap-1.5">
                    {heatmap.map((h, i) => (
                      <motion.div
                        key={h.node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.015 }}
                        className="group relative aspect-square cursor-pointer rounded-chip"
                        style={{ background: masteryColor(h.mastery) }}
                        title={`${h.node.title}: ${h.mastery}%`}
                        onClick={() => {
                          if (h.mastery > 0) {
                            const node = getKnowledgeById(h.node.id);
                            if (node) handleStartLearn(node);
                          }
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white/80">
                          {h.mastery}
                        </div>
                        <div className="pointer-events-none absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-chip border border-[var(--card-border)] bg-ink-900 px-2 py-1 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                          {h.node.title}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-[var(--fg-muted)]">
                    <span>未学习</span>
                    <div className="flex items-center gap-1">
                      <span className="h-3 w-3 rounded" style={{ background: masteryColor(0) }} />
                      <span className="h-3 w-3 rounded" style={{ background: masteryColor(40) }} />
                      <span className="h-3 w-3 rounded" style={{ background: masteryColor(60) }} />
                      <span className="h-3 w-3 rounded" style={{ background: masteryColor(75) }} />
                      <span className="h-3 w-3 rounded" style={{ background: masteryColor(90) }} />
                    </div>
                    <span>已掌握</span>
                  </div>
                </section>

                <section className="glass rounded-card p-6">
                  <h2 className="mb-4 font-serif text-base font-semibold text-[var(--fg)]">
                    5 维效果雷达
                  </h2>
                  <RadarChart
                    axes={assessmentDimensions.map((d) => ({
                      name: d.name,
                      score: d.score,
                      benchmark: d.benchmark,
                    }))}
                    size={240}
                    color="#9D4EDD"
                  />
                  <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-[var(--fg-muted)]">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-amethyst-500" /> 当前
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[var(--fg-muted)]" /> 基准
                    </span>
                  </div>
                </section>

                <section className="glass rounded-card p-6">
                  <h3 className="mb-2 text-xs font-medium text-[var(--fg-muted)]">薄弱知识点 TOP 3</h3>
                  <div className="space-y-1.5">
                    {[...heatmap]
                      .filter((h) => h.mastery > 0 && h.mastery < 70)
                      .sort((a, b) => a.mastery - b.mastery)
                      .slice(0, 3)
                      .map((h) => (
                        <div
                          key={h.node.id}
                          className="flex items-center gap-2 rounded-chip border border-vermilion-500/30 bg-vermilion-500/5 p-2"
                        >
                          <AlertCircle className="h-3.5 w-3.5 text-vermilion-400" />
                          <span className="flex-1 text-xs text-[var(--fg)]">{h.node.title}</span>
                          <span className="font-mono text-xs text-vermilion-400">{h.mastery}%</span>
                        </div>
                      ))}
                  </div>
                </section>
              </div>
            </div>

            {advice && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 glass rounded-card p-6"
              >
                <h2 className="mb-3 flex items-center gap-2 font-serif text-base font-semibold text-[var(--fg)]">
                  <Sparkles className="h-4 w-4 text-aurum-400" />
                  智能调优方案
                </h2>
                <div className="whitespace-pre-line text-sm leading-relaxed text-[var(--fg-muted)]">
                  {advice}
                </div>
              </motion.section>
            )}
          </motion.div>
        )}

        {viewMode === "learn" && selectedKnowledge && (
          <motion.div
            key="learn"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 rounded-chip hover:bg-[var(--card-hover)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--fg-muted)]" />
              </button>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">
                  {selectedKnowledge.title}
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  第 {selectedKnowledge.chapter} 章 · 预计 {selectedKnowledge.estimatedMinutes} 分钟
                </p>
              </div>
            </div>

            {planContextBanner}

            <div className="glass rounded-card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-[var(--fg-muted)]">学习进度</span>
                <span className="text-sm font-medium text-amethyst-400">{learningProgress}%</span>
              </div>
              <div className="h-2 bg-[var(--card-border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amethyst-500 to-aurum-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${learningProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <section className="glass rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-amethyst-400" />
                      <h2 className="font-serif text-base font-semibold text-[var(--fg)]">核心内容</h2>
                    </div>
                    {learnStep === 0 && (
                      <button
                        onClick={handleCompleteStep}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-amethyst-500/10 text-amethyst-400 hover:bg-amethyst-500/20 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        标记已阅读
                      </button>
                    )}
                  </div>
                  <div className="prose prose-sm max-w-none text-[var(--fg-muted)]">
                    <p className="mb-4">{selectedKnowledge.summary}</p>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-[var(--fg)]">核心要点：</div>
                      <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                        {selectedKnowledge.summary.split('。').filter(s => s.trim()).slice(0, 4).map((sentence, i) => (
                          <li key={i}>{sentence.trim()}。</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="glass rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="h-5 w-5 text-aurum-400" />
                      <h2 className="font-serif text-base font-semibold text-[var(--fg)]">教学视频</h2>
                    </div>
                    {learnStep === 1 && (
                      <button
                        onClick={handleCompleteStep}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-aurum-500/10 text-aurum-400 hover:bg-aurum-500/20 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        标记已观看
                      </button>
                    )}
                  </div>
                  <div className="aspect-video bg-ink-800 rounded-chip overflow-hidden relative">
                    {!showVideo ? (
                      <button
                        onClick={handleToggleVideo}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full bg-amethyst-500/20 flex items-center justify-center">
                          <Play className="h-8 w-8 text-amethyst-400 ml-1" />
                        </div>
                        <span className="text-white/70 text-sm">点击播放教学动画</span>
                      </button>
                    ) : (
                      <AnimationPlayer scenes={getAnimationScenes(selectedKnowledge.id)} />
                    )}
                  </div>
                  {!showVideo && (
                    <p className="mt-3 text-sm text-[var(--fg-muted)] text-center">
                      点击播放教学动画视频
                    </p>
                  )}
                </section>

                <section className="glass rounded-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-jade-400" />
                      <h2 className="font-serif text-base font-semibold text-[var(--fg)]">代码示例</h2>
                    </div>
                    {learnStep === 2 && (
                      <button
                        onClick={handleCompleteStep}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-chip bg-jade-500/10 text-jade-400 hover:bg-jade-500/20 transition-colors"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        标记已实践
                      </button>
                    )}
                  </div>
                  <pre className="bg-ink-900 rounded-chip p-4 text-sm overflow-x-auto text-[var(--fg-muted)]">
                    {`# ${selectedKnowledge.title} 示例代码
# 核心实现逻辑

def learn_knowledge(concept):
    """学习知识点的核心方法"""
    understand = analyze(concept)
    practice = implement(understand)
    mastery = evaluate(practice)
    return mastery

# 运行示例
result = learn_knowledge("${selectedKnowledge.title}")
print(f"掌握度: {result}%")`}
                  </pre>
                </section>
              </div>

              <div className="space-y-6">
                <section className="glass rounded-card p-6 sticky top-6">
                  <h2 className="font-serif text-base font-semibold text-[var(--fg)] mb-4">学习导航</h2>
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-chip transition-colors ${
                      learnStep === 0 ? "bg-amethyst-500/10 border border-amethyst-500/30" : learnStep > 0 ? "bg-jade-500/10 border border-jade-500/30" : ""
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        learnStep > 0 ? "bg-jade-500/20 text-jade-400" : "bg-amethyst-500/20 text-amethyst-400"
                      }`}>1</span>
                      <span className={learnStep >= 0 ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>阅读核心内容</span>
                      {learnStep > 0 && <CheckCircle2 className="h-4 w-4 text-jade-400 ml-auto" />}
                    </div>
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-chip transition-colors ${
                      learnStep === 1 ? "bg-aurum-500/10 border border-aurum-500/30" : learnStep > 1 ? "bg-jade-500/10 border border-jade-500/30" : ""
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        learnStep > 1 ? "bg-jade-500/20 text-jade-400" : learnStep === 1 ? "bg-aurum-500/20 text-aurum-400" : "bg-[var(--card-border)] text-[var(--fg-muted)]"
                      }`}>2</span>
                      <span className={learnStep >= 1 ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>观看教学视频</span>
                      {learnStep > 1 && <CheckCircle2 className="h-4 w-4 text-jade-400 ml-auto" />}
                    </div>
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-chip transition-colors ${
                      learnStep === 2 ? "bg-jade-500/10 border border-jade-500/30" : learnStep > 2 ? "bg-jade-500/10 border border-jade-500/30" : ""
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        learnStep > 2 ? "bg-jade-500/20 text-jade-400" : learnStep === 2 ? "bg-jade-500/20 text-jade-400" : "bg-[var(--card-border)] text-[var(--fg-muted)]"
                      }`}>3</span>
                      <span className={learnStep >= 2 ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>实践代码示例</span>
                      {learnStep > 2 && <CheckCircle2 className="h-4 w-4 text-jade-400 ml-auto" />}
                    </div>
                    <div className={`flex items-center gap-2 text-sm p-2 rounded-chip transition-colors ${
                      learnStep === 3 ? "bg-blue-500/10 border border-blue-500/30" : learnStep > 3 ? "bg-jade-500/10 border border-jade-500/30" : ""
                    }`}>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        learnStep > 3 ? "bg-jade-500/20 text-jade-400" : learnStep === 3 ? "bg-blue-500/20 text-blue-400" : "bg-[var(--card-border)] text-[var(--fg-muted)]"
                      }`}>4</span>
                      <span className={learnStep >= 3 ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}>完成学习</span>
                      {learnStep > 3 && <CheckCircle2 className="h-4 w-4 text-jade-400 ml-auto" />}
                    </div>
                  </div>

                  <button
                    onClick={handleCompleteLearn}
                    disabled={learnStep < 3}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-card bg-gradient-to-r from-amethyst-500 to-aurum-500 text-white font-medium transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {learnStep >= 4 ? "已完成并回写进度" : "完成学习并记录"}
                  </button>

                  {learnStep >= 4 && (
                    <div className="mt-3 rounded-card border border-jade-500/30 bg-jade-500/10 p-3 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-jade-400">
                        <CircleCheck className="h-4 w-4" />
                        学习记录已更新
                      </div>
                      <p className="mt-1 text-xs text-[var(--fg-muted)]">
                        {planContext ? "计划任务已完成，可继续测验或返回计划查看进度。" : "可继续完成测验，获得精确掌握度反馈。"}
                      </p>
                      {planContext && (
                        <button
                          type="button"
                          onClick={returnToPlan}
                          className="mt-3 w-full rounded-full bg-jade-500/15 px-3 py-2 text-xs font-medium text-jade-400 transition-colors hover:bg-jade-500/25"
                        >
                          返回学习计划查看进度
                        </button>
                      )}
                    </div>
                  )}

                  {getQuizByKnowledgeId(selectedKnowledge.id).length > 0 && (
                    <button
                      onClick={() => {
                        markAsLearned(selectedKnowledge.id);
                        handleStartQuiz(selectedKnowledge);
                      }}
                      disabled={learnStep < 4}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-card border border-aurum-500/30 bg-aurum-500/10 text-aurum-400 font-medium transition-colors hover:bg-aurum-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Brain className="h-4 w-4" />
                      开始测验
                    </button>
                  )}
                </section>
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "quiz" && selectedKnowledge && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToDashboard}
                  className="p-2 rounded-chip hover:bg-[var(--card-hover)] transition-colors"
                >
                  <X className="h-5 w-5 text-[var(--fg-muted)]" />
                </button>
                <div>
                  <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">
                    {selectedKnowledge.title} 测验
                  </h1>
                  <p className="mt-1 text-sm text-[var(--fg-muted)]">
                    共 {quizQuestions.length} 题 · 完成后自动评分
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {quizQuestions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                      i === currentQuestionIndex
                        ? "bg-amethyst-500 text-white"
                        : userAnswers[i] !== null
                        ? "bg-jade-500/20 text-jade-400"
                        : "bg-[var(--card-border)] text-[var(--fg-muted)]"
                    }`}
                    onClick={() => setCurrentQuestionIndex(i)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {planContextBanner}

            <div className="max-w-3xl mx-auto">
              <section className="glass rounded-card p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-chip text-xs font-medium bg-amethyst-500/10 text-amethyst-400">
                    第 {currentQuestionIndex + 1}/{quizQuestions.length} 题
                  </span>
                  <span className={`px-2 py-1 rounded-chip text-xs font-medium ${
                    quizQuestions[currentQuestionIndex].difficulty === 1
                      ? "bg-jade-500/10 text-jade-400"
                      : quizQuestions[currentQuestionIndex].difficulty === 2
                      ? "bg-aurum-500/10 text-aurum-400"
                      : "bg-vermilion-500/10 text-vermilion-400"
                  }`}>
                    {quizQuestions[currentQuestionIndex].difficulty === 1
                      ? "简单"
                      : quizQuestions[currentQuestionIndex].difficulty === 2
                      ? "中等"
                      : "困难"}
                  </span>
                  <span className={`px-2 py-1 rounded-chip text-xs font-medium ${
                    quizQuestions[currentQuestionIndex].type === "single"
                      ? "bg-blue-500/10 text-blue-400"
                      : quizQuestions[currentQuestionIndex].type === "multiple"
                      ? "bg-purple-500/10 text-purple-400"
                      : "bg-green-500/10 text-green-400"
                  }`}>
                    {quizQuestions[currentQuestionIndex].type === "single"
                      ? "单选题"
                      : quizQuestions[currentQuestionIndex].type === "multiple"
                      ? "多选题"
                      : "判断题"}
                  </span>
                </div>

                <h2 className="text-lg font-medium text-[var(--fg)] mb-6">
                  {quizQuestions[currentQuestionIndex].question}
                </h2>

                <div className="space-y-3">
                  {quizQuestions[currentQuestionIndex].options?.map((option, i) => {
                    const isSelected = quizQuestions[currentQuestionIndex].type === "multiple"
                      ? Array.isArray(userAnswers[currentQuestionIndex]) && userAnswers[currentQuestionIndex].includes(i)
                      : userAnswers[currentQuestionIndex] === i;

                    const handleOptionClick = () => {
                      if (quizQuestions[currentQuestionIndex].type === "multiple") {
                        const current = Array.isArray(userAnswers[currentQuestionIndex])
                          ? [...userAnswers[currentQuestionIndex]]
                          : [];
                        if (current.includes(i)) {
                          handleAnswer(current.filter((x) => x !== i));
                        } else {
                          handleAnswer([...current, i]);
                        }
                      } else {
                        handleAnswer(i);
                      }
                    };

                    return (
                      <button
                        key={i}
                        onClick={handleOptionClick}
                        className={`w-full flex items-start gap-3 p-4 rounded-chip border text-left transition-all ${
                          isSelected
                            ? "border-amethyst-500 bg-amethyst-500/10"
                            : "border-[var(--card-border)] bg-[var(--card)] hover:border-amethyst-500/50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isSelected
                            ? "border-amethyst-500 bg-amethyst-500"
                            : "border-[var(--card-border)]"
                        }`}>
                          {isSelected && (
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm text-[var(--fg)]">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {quizQuestions[currentQuestionIndex].type === "judge" && (
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => handleAnswer(0)}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-chip border font-medium transition-all ${
                        userAnswers[currentQuestionIndex] === 0
                          ? "border-jade-500 bg-jade-500/10 text-jade-400"
                          : "border-[var(--card-border)] bg-[var(--card)] hover:border-jade-500/50"
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      正确
                    </button>
                    <button
                      onClick={() => handleAnswer(1)}
                      className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-chip border font-medium transition-all ${
                        userAnswers[currentQuestionIndex] === 1
                          ? "border-vermilion-500 bg-vermilion-500/10 text-vermilion-400"
                          : "border-[var(--card-border)] bg-[var(--card)] hover:border-vermilion-500/50"
                      }`}
                    >
                      <AlertCircle className="h-5 w-5" />
                      错误
                    </button>
                  </div>
                )}
              </section>

              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-chip border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4 rotate-180" />
                  上一题
                </button>

                {currentQuestionIndex < quizQuestions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 px-6 py-2 rounded-chip bg-amethyst-500 text-white font-medium hover:bg-amethyst-600 transition-colors"
                  >
                    下一题
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    className="flex items-center gap-2 px-6 py-2 rounded-chip bg-gradient-to-r from-vermilion-500 to-aurum-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                    提交答案
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {viewMode === "result" && quizResult && selectedKnowledge && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="mb-6 flex items-center gap-4">
              <button
                onClick={handleBackToDashboard}
                className="p-2 rounded-chip hover:bg-[var(--card-hover)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--fg-muted)]" />
              </button>
              <div>
                <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">
                  {selectedKnowledge.title} 测验结果
                </h1>
                <p className="mt-1 text-sm text-[var(--fg-muted)]">
                  第 {selectedKnowledge.chapter} 章
                </p>
              </div>
            </div>

            {planContextBanner}

            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`glass rounded-card p-8 text-center mb-6 ${
                  quizResult.masteryLevel === "mastered"
                    ? "border-jade-500/30 bg-jade-500/5"
                    : quizResult.masteryLevel === "partial"
                    ? "border-aurum-500/30 bg-aurum-500/5"
                    : "border-vermilion-500/30 bg-vermilion-500/5"
                }`}
              >
                <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
                  quizResult.masteryLevel === "mastered"
                    ? "bg-jade-500/20"
                    : quizResult.masteryLevel === "partial"
                    ? "bg-aurum-500/20"
                    : "bg-vermilion-500/20"
                }`}>
                  {quizResult.masteryLevel === "mastered" ? (
                    <Trophy className="h-12 w-12 text-jade-400" />
                  ) : quizResult.masteryLevel === "partial" ? (
                    <Award className="h-12 w-12 text-aurum-400" />
                  ) : (
                    <AlertTriangle className="h-12 w-12 text-vermilion-400" />
                  )}
                </div>
                <div className="text-5xl font-bold mb-2" style={{
                  color: quizResult.masteryLevel === "mastered"
                    ? "#10B981"
                    : quizResult.masteryLevel === "partial"
                    ? "#F4A261"
                    : "#E63946"
                }}>
                  {quizResult.score}
                </div>
                <div className="text-lg font-medium mb-4" style={{
                  color: quizResult.masteryLevel === "mastered"
                    ? "#10B981"
                    : quizResult.masteryLevel === "partial"
                    ? "#F4A261"
                    : "#E63946"
                }}>
                  {quizResult.masteryLevel === "mastered"
                    ? "🎉 恭喜掌握！"
                    : quizResult.masteryLevel === "partial"
                    ? "💪 继续加油！"
                    : "📚 需要复习"}
                </div>
                <p className="text-sm text-[var(--fg-muted)]">
                  答对 {quizResult.correctCount}/{quizResult.totalQuestions} 题
                </p>
              </motion.div>

              <section className="glass rounded-card p-6 mb-6">
                <h2 className="font-serif text-base font-semibold text-[var(--fg)] mb-4">
                  答题详情
                </h2>
                <div className="space-y-4">
                  {quizResult.answers.map((answer, i) => {
                    const question = quizQuestions.find((q) => q.id === answer.questionId);
                    if (!question) return null;
                    return (
                      <div
                        key={answer.questionId}
                        className={`rounded-chip border p-4 ${
                          answer.isCorrect
                            ? "border-jade-500/30 bg-jade-500/5"
                            : "border-vermilion-500/30 bg-vermilion-500/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {answer.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-jade-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-vermilion-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--fg)] mb-2">
                              {i + 1}. {question.question}
                            </p>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-center gap-2">
                                <span className="text-[var(--fg-muted)]">你的答案:</span>
                                <span className={answer.isCorrect ? "text-jade-400" : "text-vermilion-400"}>
                                  {question.options
                                    ? question.type === "multiple"
                                      ? Array.isArray(answer.userAnswer)
                                        ? answer.userAnswer.map((a) => question.options![a]).join(", ")
                                        : question.options[answer.userAnswer as number]
                                      : question.options[answer.userAnswer as number]
                                    : (answer.userAnswer === 0 ? "正确" : "错误")}
                                </span>
                              </div>
                              {!answer.isCorrect && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[var(--fg-muted)]">正确答案:</span>
                                  <span className="text-jade-400">
                                    {question.options
                                      ? question.type === "multiple"
                                        ? Array.isArray(question.correctAnswer)
                                          ? question.correctAnswer.map((a) => question.options![a]).join(", ")
                                          : question.options[question.correctAnswer as number]
                                        : question.options[question.correctAnswer as number]
                                      : (question.correctAnswer === 0 ? "正确" : "错误")}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-[var(--fg-muted)]">解析:</span>
                                <span className="text-[var(--fg)]">{question.explanation}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleRetryQuiz}
                    className="flex items-center gap-2 px-6 py-2 rounded-chip border border-[var(--card-border)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                    重新测验
                  </button>
                  <button
                    onClick={planContext ? returnToPlan : handleBackToDashboard}
                    className="flex items-center gap-2 px-6 py-2 rounded-chip bg-gradient-to-r from-amethyst-500 to-aurum-500 text-white font-medium hover:opacity-90 transition-opacity"
                  >
                    {planContext ? "返回学习计划" : "返回评估首页"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
