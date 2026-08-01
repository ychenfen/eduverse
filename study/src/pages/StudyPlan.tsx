import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Plus,
  TrendingUp,
  Award,
  Flag,
  ChevronDown,
  Play,
  FileText,
  Code,
  HelpCircle,
  Layers,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { StudyPlan, StudyPlanTask } from "@/types";

const focusOptions = [
  { id: "algorithms", label: "算法基础", icon: "🧮", desc: "搜索、排序、动态规划等核心算法" },
  { id: "ml", label: "机器学习", icon: "🤖", desc: "监督学习、无监督学习、模型评估" },
  { id: "dl", label: "深度学习", icon: "🧠", desc: "CNN、RNN、Transformer 等深度模型" },
  { id: "nlp", label: "自然语言处理", icon: "💬", desc: "文本处理、语言模型、RAG" },
  { id: "cv", label: "计算机视觉", icon: "👁️", desc: "图像分类、目标检测、生成模型" },
  { id: "rl", label: "强化学习", icon: "🎮", desc: "马尔可夫决策、Q-learning、策略梯度" },
  { id: "agent", label: "多智能体", icon: "👥", desc: "Agent 协作、多智能体系统" },
  { id: "engineering", label: "AI 工程化", icon: "⚙️", desc: "MLOps、模型部署、监控" },
];

const goalTemplates = [
  "备战考研 AI 方向",
  "零基础入门人工智能",
  "掌握深度学习核心",
  "冲刺算法面试",
  "构建 AI 项目作品集",
  "系统学习大模型技术",
];

export default function StudyPlanPage() {
  const studyPlans = useAppStore((s) => s.studyPlans);
  const currentPlanId = useAppStore((s) => s.currentPlanId);
  const createStudyPlan = useAppStore((s) => s.createStudyPlan);
  const setCurrentPlan = useAppStore((s) => s.setCurrentPlan);

  const [view, setView] = useState<"list" | "create">("list");
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [dailyMinutes, setDailyMinutes] = useState(60);
  const [durationDays, setDurationDays] = useState(30);

  const currentPlan = studyPlans.find((p) => p.id === currentPlanId);
  const [expandedMilestones, setExpandedMilestones] = useState<Record<number, boolean>>({ 0: true });
  const navigate = useNavigate();

  const toggleMilestone = (idx: number) => {
    setExpandedMilestones((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const goToAssessment = (planId: string, task: StudyPlanTask) => {
    const params = new URLSearchParams({
      knowledge: task.knowledgeId,
      mode: task.type === "quiz" ? "quiz" : "learn",
      source: "plan",
      plan: planId,
      day: String(task.day),
      taskType: task.type,
    });
    navigate(`/assessment?${params.toString()}`);
  };

  const taskTypeIcon: Record<StudyPlanTask["type"], typeof Play> = {
    video: Play,
    reading: FileText,
    practice: Code,
    quiz: HelpCircle,
    project: Layers,
  };

  const taskTypeLabel: Record<StudyPlanTask["type"], string> = {
    video: "视频学习",
    reading: "阅读",
    practice: "代码实践",
    quiz: "测验",
    project: "项目实战",
  };

  const toggleFocus = (id: string) => {
    setSelectedFocus((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const canNext = () => {
    if (step === 0) return goal.trim().length > 0;
    if (step === 1) return selectedFocus.length > 0;
    return true;
  };

  const handleCreate = () => {
    createStudyPlan({
      goal,
      focusAreas: selectedFocus,
      difficulty,
      dailyMinutes,
      durationDays,
    });
    setView("list");
    setStep(0);
    setGoal("");
    setSelectedFocus([]);
    setDifficulty("beginner");
    setDailyMinutes(60);
    setDurationDays(30);
  };

  const difficultyConfig = {
    beginner: { label: "入门", color: "text-jade-400", bg: "from-jade-500/20 to-jade-500/5" },
    intermediate: { label: "进阶", color: "text-aurum-400", bg: "from-aurum-500/20 to-aurum-500/5" },
    advanced: { label: "高阶", color: "text-vermilion-400", bg: "from-vermilion-500/20 to-vermilion-500/5" },
  };

  const renderPlanCard = (plan: StudyPlan) => {
    const tasks = plan.milestones.flatMap((milestone) => milestone.tasks);
    const completedTasks = tasks.filter((task) => task.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    return (
    <motion.div
      key={plan.id}
      whileHover={{ y: -2 }}
      className={cn(
        "rounded-2xl border p-6 cursor-pointer transition-all",
        plan.id === currentPlanId
          ? "border-amethyst-500 bg-amethyst-500/5"
          : "border-[var(--card-border)] bg-[var(--card)]/50 hover:border-[var(--fg-muted)]/30",
      )}
      onClick={() => setCurrentPlan(plan.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setCurrentPlan(plan.id);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={plan.id === currentPlanId}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[var(--fg)]">{plan.title}</h3>
          <p className="text-sm text-[var(--fg-muted)] mt-1">{plan.goal}</p>
        </div>
        {plan.id === currentPlanId && (
          <span className="rounded-chip bg-amethyst-500/20 px-2 py-0.5 text-xs text-amethyst-400">
            当前计划
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-[var(--fg-muted)]">
          <Calendar className="h-4 w-4" />
          <span>{plan.startDate} ~ {plan.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--fg-muted)]">
          <Clock className="h-4 w-4" />
          <span>{plan.dailyMinutes} 分钟/天</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--fg-muted)]">
          <Target className="h-4 w-4" />
          <span>{difficultyConfig[plan.difficulty].label}难度</span>
        </div>
        <div className="flex items-center gap-2 text-[var(--fg-muted)]">
          <Flag className="h-4 w-4" />
          <span>{plan.milestones.length} 个里程碑</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
        <div className="mb-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-[var(--fg-muted)]">任务进度</span>
            <span className="font-medium text-[var(--fg)]">{completedTasks}/{tasks.length} · {progress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--card-border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amethyst-500 to-jade-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {plan.focusAreas.slice(0, 4).map((f) => {
            const opt = focusOptions.find((o) => o.id === f);
            return (
              <span key={f} className="rounded-chip bg-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--fg-muted)]">
                {opt?.icon} {opt?.label || f}
              </span>
            );
          })}
          {plan.focusAreas.length > 4 && (
            <span className="rounded-chip bg-[var(--card-border)] px-2 py-0.5 text-xs text-[var(--fg-muted)]">
              +{plan.focusAreas.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
    );
  };

  return (
    <div className="px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--fg)]">学习计划</h1>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">
            定制专属学习路径，科学规划，高效进步
          </p>
        </div>
        {view === "list" && (
          <button
            onClick={() => setView("create")}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-amethyst-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            新建计划
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {view === "list" && (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {studyPlans.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[var(--card-border)] p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amethyst-500/20 to-vermilion-500/20">
                  <Sparkles className="h-8 w-8 text-amethyst-400" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg)] mb-2">还没有学习计划</h3>
                <p className="text-sm text-[var(--fg-muted)] mb-6">
                  创建你的第一个学习计划，开启系统化 AI 学习之旅
                </p>
                <button
                  onClick={() => setView("create")}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-amethyst-500 px-6 py-3 text-sm font-medium text-white shadow-glow transition-transform hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  创建学习计划
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studyPlans.map(renderPlanCard)}
              </div>
            )}

            {currentPlan && (
              <div className="mt-8 rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-6 backdrop-blur-sm">
                {(() => {
                  const allTasks = currentPlan.milestones.flatMap((milestone) => milestone.tasks);
                  const doneCount = allTasks.filter((task) => task.completed).length;
                  const percent = allTasks.length > 0 ? Math.round((doneCount / allTasks.length) * 100) : 0;
                  return (
                    <div className="mb-5 rounded-xl border border-amethyst-500/20 bg-amethyst-500/5 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--fg)]">
                            <TrendingUp className="h-5 w-5 text-amethyst-400" />
                            当前计划里程碑
                          </h2>
                          <p className="mt-1 text-xs text-[var(--fg-muted)]">
                            完成学习或测验后自动回写任务进度与学习时长
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-2xl font-bold text-amethyst-400">{percent}%</div>
                          <div className="text-xs text-[var(--fg-muted)]">{doneCount}/{allTasks.length} 项完成</div>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--card-border)]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-amethyst-500 via-azure-500 to-jade-500"
                          animate={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
                <div className="space-y-4">
                  {currentPlan.milestones.map((m, idx) => {
                    const expanded = expandedMilestones[idx] ?? false;
                    const tasksByDay = m.tasks.reduce<Record<number, StudyPlanTask[]>>((acc, t) => {
                      acc[t.day] = acc[t.day] || [];
                      acc[t.day].push(t);
                      return acc;
                    }, {});
                    const sortedDays = Object.keys(tasksByDay).map(Number).sort((a, b) => a - b);
                    const totalMinutes = m.tasks.reduce((s, t) => s + t.estimatedMinutes, 0);

                    return (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amethyst-500 to-vermilion-500 text-white text-sm font-bold">
                            {idx + 1}
                          </div>
                          {idx < currentPlan.milestones.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gradient-to-b from-amethyst-500 to-azure-500 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <button
                            type="button"
                            onClick={() => toggleMilestone(idx)}
                            className="flex w-full items-center justify-between rounded-xl border border-[var(--card-border)] bg-[var(--bg)]/40 p-4 text-left transition-colors hover:border-[var(--fg-muted)]/30"
                            aria-expanded={expanded}
                            aria-controls={`milestone-${idx}`}
                          >
                            <div>
                              <h4 className="font-medium text-[var(--fg)]">{m.title}</h4>
                              <p className="mt-1 text-xs text-[var(--fg-muted)]">
                                截止 {m.date} · {m.knowledgeIds.length} 个知识点 · {Math.round(totalMinutes / 60 * 10) / 10} 小时
                              </p>
                            </div>
                            <ChevronDown className={cn("h-5 w-5 text-[var(--fg-muted)] transition-transform", expanded && "rotate-180")} />
                          </button>

                          <AnimatePresence>
                            {expanded && (
                              <motion.div
                                id={`milestone-${idx}`}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-3 space-y-3 rounded-xl border border-[var(--card-border)] bg-[var(--bg)]/30 p-4">
                                  {sortedDays.map((day) => {
                                    const dayTasks = tasksByDay[day];
                                    const dayMinutes = dayTasks.reduce((s, t) => s + t.estimatedMinutes, 0);
                                    return (
                                      <div key={day} className="rounded-lg border border-[var(--card-border)] bg-[var(--card)]/40 p-3">
                                        <div className="mb-2 flex items-center justify-between">
                                          <span className="text-xs font-medium text-amethyst-400">第 {day} 天</span>
                                          <span className="text-xs text-[var(--fg-muted)]">约 {dayMinutes} 分钟</span>
                                        </div>
                                        <div className="space-y-2">
                                          {dayTasks.map((task, tidx) => {
                                            const Icon = taskTypeIcon[task.type];
                                            return (
                                              <div
                                                key={tidx}
                                                className={cn(
                                                  "flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--card)]",
                                                  task.completed && "bg-jade-500/5",
                                                )}
                                              >
                                                <div className={cn(
                                                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                                                  task.completed ? "bg-jade-500/15" : "bg-[var(--card-border)]",
                                                )}>
                                                  {task.completed
                                                    ? <CheckCircle2 className="h-4 w-4 text-jade-400" />
                                                    : <Icon className="h-3.5 w-3.5 text-[var(--fg-muted)]" />}
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                      "text-sm font-medium text-[var(--fg)]",
                                                      task.completed && "text-[var(--fg-muted)] line-through",
                                                    )}>{task.title}</span>
                                                    <span className="rounded-chip bg-[var(--card-border)] px-1.5 py-0 text-[10px] text-[var(--fg-muted)]">
                                                      {taskTypeLabel[task.type]}
                                                    </span>
                                                  </div>
                                                  <p className="mt-0.5 text-xs text-[var(--fg-muted)] leading-relaxed">{task.description}</p>
                                                  <div className="mt-1.5 flex items-center gap-3">
                                                    <span className="text-[10px] text-[var(--fg-muted)]">预计 {task.estimatedMinutes} 分钟</span>
                                                    <button
                                                      onClick={() => goToAssessment(currentPlan.id, task)}
                                                      className={cn(
                                                        "flex items-center gap-1 text-[10px] transition-colors",
                                                        task.completed
                                                          ? "text-jade-400 hover:text-jade-300"
                                                          : "text-amethyst-400 hover:text-amethyst-300",
                                                      )}
                                                    >
                                                      <ExternalLink className="h-3 w-3" />
                                                      {task.completed ? "再次巩固" : task.type === "quiz" ? "去测验" : "去学习"}
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {view === "create" && (
          <motion.div
            key="create"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto"
          >
            <button
              onClick={() => setView("list")}
              className="mb-4 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
            >
              ← 返回列表
            </button>

            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)]/50 p-8 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--fg-muted)]">
                    步骤 {step + 1} / 4
                  </span>
                  <span className="text-sm font-medium text-amethyst-400">
                    {step === 0 && "设定目标"}
                    {step === 1 && "选择方向"}
                    {step === 2 && "难度与节奏"}
                    {step === 3 && "确认创建"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[var(--card-border)] overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-vermilion-500 to-amethyst-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / 4) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {step === 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--fg)] mb-2">🎯 你的学习目标是什么？</h2>
                    <p className="text-sm text-[var(--fg-muted)]">
                      明确目标能帮助我们为你规划更精准的学习路径
                    </p>
                  </div>

                  <div className="grid gap-2">
                    {goalTemplates.map((t) => (
                      <button
                        key={t}
                        onClick={() => setGoal(t)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                          goal === t
                            ? "border-amethyst-500 bg-amethyst-500/10"
                            : "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30",
                        )}
                      >
                        <Target className={cn(
                          "h-5 w-5",
                          goal === t ? "text-amethyst-400" : "text-[var(--fg-muted)]",
                        )} />
                        <span className="text-sm text-[var(--fg)]">{t}</span>
                        {goal === t && <CheckCircle2 className="ml-auto h-5 w-5 text-amethyst-400" />}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-sm text-[var(--fg-muted)] mb-2 block">
                      或者自定义目标
                    </label>
                    <input
                      type="text"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="输入你的学习目标..."
                      className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--fg)] outline-none focus:border-amethyst-500 transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--fg)] mb-2">📚 你想重点学习哪些方向？</h2>
                    <p className="text-sm text-[var(--fg-muted)]">
                      可多选，我们会围绕这些方向安排学习内容
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {focusOptions.map((opt) => {
                      const selected = selectedFocus.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleFocus(opt.id)}
                          className={cn(
                            "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
                            selected
                              ? "border-amethyst-500 bg-amethyst-500/10 scale-[1.02]"
                              : "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30",
                          )}
                        >
                          <div className="text-2xl">{opt.icon}</div>
                          <span className="text-sm font-medium text-[var(--fg)]">{opt.label}</span>
                          <span className="text-xs text-[var(--fg-muted)]">{opt.desc}</span>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-sm text-[var(--fg-muted)]">
                    已选择 <span className="text-amethyst-400 font-medium">{selectedFocus.length}</span> 个方向
                  </p>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--fg)] mb-2">⚡ 选择难度等级</h2>
                    <p className="text-sm text-[var(--fg-muted)]">
                      根据你的基础选择合适的起点
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {(Object.keys(difficultyConfig) as Array<keyof typeof difficultyConfig>).map((d) => {
                      const cfg = difficultyConfig[d];
                      const selected = difficulty === d;
                      return (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-xl border p-6 transition-all",
                            selected
                              ? "border-amethyst-500 bg-amethyst-500/10 scale-[1.02]"
                              : "border-[var(--card-border)] hover:border-[var(--fg-muted)]/30",
                          )}
                        >
                          <div className={cn(
                            "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
                            cfg.bg,
                          )}>
                            <Award className={cn("h-6 w-6", cfg.color)} />
                          </div>
                          <span className="font-semibold text-[var(--fg)]">{cfg.label}</span>
                          <span className="text-xs text-[var(--fg-muted)] text-center">
                            {d === "beginner" && "零基础友好"}
                            {d === "intermediate" && "有一定基础"}
                            {d === "advanced" && "追求深度"}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[var(--fg)]">每日学习时长</label>
                      <span className="text-sm text-amethyst-400 font-medium">{dailyMinutes} 分钟</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="180"
                      step="15"
                      value={dailyMinutes}
                      onChange={(e) => setDailyMinutes(Number(e.target.value))}
                      className="w-full accent-amethyst-500"
                    />
                    <div className="flex justify-between text-xs text-[var(--fg-muted)] mt-1">
                      <span>15 分钟</span>
                      <span>3 小时</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-[var(--fg)]">计划周期</label>
                      <span className="text-sm text-amethyst-400 font-medium">{durationDays} 天</span>
                    </div>
                    <input
                      type="range"
                      min="7"
                      max="120"
                      step="7"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full accent-amethyst-500"
                    />
                    <div className="flex justify-between text-xs text-[var(--fg-muted)] mt-1">
                      <span>1 周</span>
                      <span>4 个月</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amethyst-500/20 to-vermilion-500/20">
                      <Sparkles className="h-8 w-8 text-amethyst-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--fg)] mb-2">确认你的学习计划</h2>
                    <p className="text-sm text-[var(--fg-muted)]">
                      确认无误后即可开始你的 AI 学习之旅
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl bg-[var(--bg)]/50 p-5">
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-muted)]">学习目标</span>
                      <span className="font-medium text-[var(--fg)]">{goal}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-[var(--fg-muted)]">重点方向</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
                        {selectedFocus.map((f) => {
                          const opt = focusOptions.find((o) => o.id === f);
                          return (
                            <span key={f} className="rounded-chip bg-amethyst-500/15 px-2 py-0.5 text-xs text-amethyst-400">
                              {opt?.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-muted)]">难度等级</span>
                      <span className={cn("font-medium", difficultyConfig[difficulty].color)}>
                        {difficultyConfig[difficulty].label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-muted)]">每日学习</span>
                      <span className="font-medium text-[var(--fg)]">{dailyMinutes} 分钟</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-muted)]">计划周期</span>
                      <span className="font-medium text-[var(--fg)]">{durationDays} 天</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--fg-muted)]">里程碑数</span>
                      <span className="font-medium text-[var(--fg)]">4 个</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => step > 0 ? setStep(step - 1) : setView("list")}
                  className="rounded-full border border-[var(--card-border)] px-6 py-2.5 text-sm font-medium text-[var(--fg)] hover:border-[var(--fg-muted)]/30 transition-colors"
                >
                  {step === 0 ? "取消" : "上一步"}
                </button>

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!canNext()}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all",
                      canNext()
                        ? "bg-gradient-to-r from-amethyst-500 to-vermilion-500 text-white shadow-glow hover:scale-105"
                        : "bg-[var(--card-border)] text-[var(--fg-muted)] cursor-not-allowed",
                    )}
                  >
                    下一步
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 via-amethyst-500 to-azure-500 px-6 py-2.5 text-sm font-medium text-white shadow-glow hover:scale-105 transition-transform"
                  >
                    <Sparkles className="h-4 w-4" />
                    创建计划
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
