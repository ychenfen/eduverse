import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Compass,
  Factory,
  Gauge,
  Layers3,
  MessageSquareText,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  UserRoundSearch,
  WandSparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";
import ParticleBg from "@/components/ParticleBg";
import AgentAvatar from "@/components/AgentAvatar";
import RadarChart from "@/components/RadarChart";
import ResourceCard from "@/components/ResourceCard";
import { agents } from "@/data/agents";
import { knowledgeNodes } from "@/data/course";
import { useAppStore } from "@/store/useAppStore";

const reveal = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const resourceTypeNames = {
  document: "讲解文档",
  mindmap: "思维导图",
  quiz: "智能题组",
  reading: "拓展阅读",
  animation: "概念动画",
  code: "实操代码",
};

export default function Home() {
  const learner = useAppStore((s) => s.learner);
  const profile = useAppStore((s) => s.currentProfile);
  const resources = useAppStore((s) => s.resources);
  const learningRecords = useAppStore((s) => s.learningRecords);
  const studyPlans = useAppStore((s) => s.studyPlans);
  const currentPlanId = useAppStore((s) => s.currentPlanId);

  const currentPlan = studyPlans.find((plan) => plan.id === currentPlanId) ?? studyPlans[0];
  const learnedRecords = learningRecords.filter(
    (record) => record.learned || record.timeSpent > 0 || record.mastery > 0,
  );
  const isNewUser = learnedRecords.length === 0;
  const totalMinutes = learnedRecords.reduce((sum, record) => sum + record.timeSpent, 0);
  const averageMastery = isNewUser
    ? 0
    : Math.round(
        learnedRecords.reduce((sum, record) => sum + record.mastery, 0) /
          learnedRecords.length,
      );
  const completedNodes = learningRecords.filter(
    (record) => record.learned || record.mastery >= 80,
  ).length;
  const allPlanTasks = currentPlan?.milestones.flatMap((milestone) => milestone.tasks) ?? [];
  const completedPlanTasks = allPlanTasks.filter((task) => task.completed).length;

  const activeRecord = [...learningRecords]
    .filter((record) => record.mastery > 0 && record.mastery < 80)
    .sort((a, b) => a.mastery - b.mastery)[0];
  const firstPlanKnowledgeId = currentPlan?.milestones
    .flatMap((milestone) => milestone.knowledgeIds)[0];
  const nextKnowledgeId = activeRecord?.knowledgeId ?? firstPlanKnowledgeId ?? knowledgeNodes[0]?.id;
  const nextKnowledge = knowledgeNodes.find((node) => node.id === nextKnowledgeId);
  const nextMastery = activeRecord?.mastery ?? 0;

  const strongestDimension = [...profile.dimensions].sort((a, b) => b.score - a.score)[0];
  const focusDimension = [...profile.dimensions].sort((a, b) => a.score - b.score)[0];
  const recommendationReason = isNewUser
    ? "先用一节真实学习任务建立行为证据，画像会随学习结果持续更新。"
    : `当前掌握度 ${nextMastery}%，结合「${strongestDimension?.name ?? "学习偏好"}」与目标方向，系统已调整资源形态和学习顺序。`;

  const recommendedResources = resources
    .filter((resource) => resource.knowledgeId === nextKnowledgeId)
    .slice(0, 3);
  const fallbackResources = resources.slice(0, 3);
  const visibleResources = recommendedResources.length > 0
    ? recommendedResources
    : fallbackResources;

  const evidenceStats = [
    {
      label: "画像版本",
      value: `v${profile.version}`,
      detail: `${profile.dimensions.length} 维证据持续更新`,
      icon: UserRoundSearch,
      color: "#E63946",
    },
    {
      label: "学习结果",
      value: isNewUser ? "待建立" : `${averageMastery}%`,
      detail: isNewUser ? "完成首个任务后生成" : `${completedNodes} 个节点已进入学习`,
      icon: Gauge,
      color: "#1B9AAA",
    },
    {
      label: "内容供给",
      value: `${resources.length}`,
      detail: "6 类多模态学习资源",
      icon: Layers3,
      color: "#F4A261",
    },
    {
      label: "计划执行",
      value: `${completedPlanTasks}/${allPlanTasks.length}`,
      detail: `${currentPlan?.dailyMinutes ?? 60} 分钟日学习节奏`,
      icon: Target,
      color: "#9D4EDD",
    },
  ];

  return (
    <div className="relative pb-10">
      <section className="relative isolate overflow-hidden border-b border-[var(--card-border)]">
        <ParticleBg density={52} />
        <div className="pointer-events-none absolute -left-28 top-8 h-80 w-80 rounded-full bg-vermilion-500/10 blur-[90px]" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-azure-500/10 blur-[110px]" />

        <div className="relative z-10 grid gap-9 px-5 py-9 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)] lg:px-10 lg:py-12 xl:gap-14">
          <motion.div initial="hidden" animate="visible" className="min-w-0">
            <motion.div
              variants={reveal}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-vermilion-500/25 bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--fg)] backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-jade-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-jade-400" />
              </span>
              7 个角色智能体正在围绕同一学习目标协作
            </motion.div>

            <motion.p
              variants={reveal}
              custom={0.04}
              className="mb-2 font-mono text-[11px] tracking-[0.24em] text-vermilion-400"
            >
              EDUVERSE · PERSONAL LEARNING LOOP
            </motion.p>
            <motion.h1
              variants={reveal}
              custom={0.08}
              className="max-w-3xl font-serif text-[2.25rem] font-black leading-[1.16] tracking-tight text-[var(--fg)] sm:text-5xl xl:text-[3.45rem]"
            >
              不是再给一份标准答案，
              <br />
              而是为<span className="text-gradient">每个学生重组学习过程</span>
            </motion.h1>
            <motion.p
              variants={reveal}
              custom={0.14}
              className="mt-5 max-w-2xl text-sm leading-7 text-[var(--fg-muted)] sm:text-base"
            >
              传统在线课程提供相同内容、相同顺序，往往直到考试才暴露问题。
              智学灵境让画像、规划、内容生成、辅导与评估形成闭环，每一次学习结果都会改变下一步。
            </motion.p>

            <motion.div
              variants={reveal}
              custom={0.2}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
            >
              <Link
                to={isNewUser ? "/plan" : `/library?q=${encodeURIComponent(nextKnowledge?.title ?? "人工智能")}`}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-vermilion-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition duration-300 hover:-translate-y-0.5 hover:shadow-float"
              >
                <Zap className="h-4 w-4" />
                {isNewUser ? "启动第一项学习任务" : `继续学习：${nextKnowledge?.title ?? "今日任务"}`}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/path"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--fg)] backdrop-blur-xl transition hover:border-azure-500/60 hover:bg-azure-500/10"
              >
                <Route className="h-4 w-4 text-azure-400" />
                查看系统如何改写路径
              </Link>
            </motion.div>

            <motion.div
              variants={reveal}
              custom={0.27}
              className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card-border)] sm:grid-cols-4"
            >
              {[
                ["01", "识别差异", "画像有证据"],
                ["02", "编队协作", "角色有分工"],
                ["03", "个性生成", "资源有依据"],
                ["04", "结果回流", "路径会进化"],
              ].map(([no, title, detail]) => (
                <div key={no} className="bg-[var(--surface-popover)] p-3.5 sm:p-4">
                  <span className="font-mono text-[10px] text-vermilion-400">{no}</span>
                  <p className="mt-1 font-serif text-sm font-semibold text-[var(--fg)]">{title}</p>
                  <p className="mt-0.5 text-[11px] text-[var(--fg-muted)]">{detail}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 22, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative self-center"
          >
            <div className="absolute -inset-px rounded-[26px] bg-gradient-to-br from-vermilion-500/55 via-transparent to-azure-500/50 opacity-70 blur-[1px]" />
            <div className="relative overflow-hidden rounded-[25px] border border-white/10 bg-[var(--surface-popover)] p-5 shadow-2xl backdrop-blur-2xl sm:p-6">
              <div className="absolute right-0 top-0 h-36 w-36 bg-[radial-gradient(circle_at_top_right,rgba(244,162,97,.18),transparent_68%)]" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-aurum-400">LIVE DECISION</p>
                  <h2 className="mt-2 font-serif text-xl font-bold text-[var(--fg)]">
                    {learner.name}的下一步，不由课表决定
                  </h2>
                </div>
                <AgentAvatar agent={agents[0]} size="md" pulse />
              </div>

              <div className="relative mt-5 space-y-3">
                <DecisionRow
                  icon={UserRoundSearch}
                  label="学习证据"
                  value={isNewUser
                    ? `${learner.grade} · ${learner.goal}`
                    : `${focusDimension?.name ?? "知识基础"} ${focusDimension?.score ?? 0} 分 · 累计 ${totalMinutes} 分钟`}
                  color="#E63946"
                />
                <DecisionRow
                  icon={BrainCircuit}
                  label="协作判断"
                  value={isNewUser
                    ? "队长分发画像、路径与首课任务"
                    : `优先补强「${nextKnowledge?.title ?? "核心知识"}」并匹配视觉 + 实践资源`}
                  color="#F4A261"
                />
                <DecisionRow
                  icon={ShieldCheck}
                  label="质量门禁"
                  value="生成结果经过结构拆解、内容生成与事实校验"
                  color="#1B9AAA"
                />
              </div>

              <div className="relative mt-5 rounded-2xl border border-azure-500/20 bg-azure-500/10 p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-azure-400">
                  <Compass className="h-4 w-4" />
                  个性化决策
                </div>
                <p className="mt-2 font-serif text-lg font-bold text-[var(--fg)]">
                  {isNewUser ? "先做首课，再让真实行为修正画像" : `当前聚焦：${nextKnowledge?.title ?? "核心知识"}`}
                </p>
                <p className="mt-1 text-xs leading-5 text-[var(--fg-muted)]">
                  {recommendationReason}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(visibleResources.length > 0
                    ? visibleResources.slice(0, 3).map((resource) => resourceTypeNames[resource.type])
                    : ["讲解文档", "概念动画", "智能题组"]
                  ).map((label) => (
                    <span
                      key={label}
                      className="rounded-full border border-[var(--card-border)] bg-[var(--card)] px-2.5 py-1 text-[10px] text-[var(--fg)]"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                to="/assessment"
                className="relative mt-4 flex items-center justify-between rounded-xl border border-[var(--card-border)] px-3.5 py-3 text-xs text-[var(--fg-muted)] transition hover:border-amethyst-500/50 hover:text-[var(--fg)]"
              >
                查看这次决策的评估依据
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="loop-heading" className="px-5 py-9 sm:px-6 lg:px-10 lg:py-12">
        <SectionHeading
          eyebrow="从功能堆叠到协作闭环"
          title="一个学习问题，如何被 7 个智能体共同解决"
          description="每个角色只做自己擅长的判断，队长负责调度，校验官负责守住事实边界；过程和产物都可以在系统里继续查看。"
          id="loop-heading"
        />

        <div className="mt-6 grid gap-3 lg:grid-cols-4">
          <MethodCard
            no="01"
            icon={UserRoundSearch}
            title="先理解学生"
            description="从目标、基础、认知风格、节奏与易错证据构建六维画像。"
            evidence={`当前 ${profile.dimensions.length} 维 · v${profile.version}`}
            to="/profile"
            color="#E63946"
          />
          <MethodCard
            no="02"
            icon={Network}
            title="再组织专家"
            description="按任务动态编队，不让一个通用模型包办拆解、生成和校验。"
            evidence="7 角色 · 按需协同"
            to="/workshop"
            color="#F4A261"
          />
          <MethodCard
            no="03"
            icon={WandSparkles}
            title="生成适配资源"
            description="同一知识点按画像重组为文档、导图、题组、动画、阅读和代码。"
            evidence={`${resources.length} 份 · 6 种形态`}
            to="/library"
            color="#1B9AAA"
          />
          <MethodCard
            no="04"
            icon={Gauge}
            title="用结果再规划"
            description="掌握度、错题与学习时长回流画像，下一条路径随之改变。"
            evidence={isNewUser ? "等待首条学习证据" : `${averageMastery}% 平均掌握度`}
            to="/assessment"
            color="#9D4EDD"
          />
        </div>
      </section>

      <section className="px-5 pb-9 sm:px-6 lg:px-10 lg:pb-12">
        <div className="overflow-hidden rounded-[26px] border border-[var(--card-border)] bg-[var(--card)]">
          <div className="grid lg:grid-cols-[.85fr_1.15fr]">
            <div className="border-b border-[var(--card-border)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-vermilion-400">PERSONALIZED RESULT</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[var(--fg)]">结果不是一句“因材施教”</h2>
                </div>
                <Link
                  to="/profile"
                  className="shrink-0 rounded-full border border-[var(--card-border)] px-3 py-1.5 text-xs text-[var(--fg-muted)] transition hover:border-vermilion-500/40 hover:text-[var(--fg)]"
                >
                  查看画像
                </Link>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">
                系统保留“为什么这样推荐”的证据，并把画像变化、资源选择与学习结果放在同一条链路里。
              </p>
              <div className="mt-5 flex justify-center rounded-2xl border border-[var(--card-border)] bg-[var(--surface-input)] py-2">
                <RadarChart
                  axes={profile.dimensions.map((dimension) => ({
                    name: dimension.name,
                    score: dimension.score,
                  }))}
                  size={250}
                  color="#E63946"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <ResultSignal
                  label="优势证据"
                  value={strongestDimension?.name ?? "待识别"}
                  score={strongestDimension?.score ?? 0}
                  color="#10B981"
                />
                <ResultSignal
                  label="当前补强"
                  value={focusDimension?.name ?? "待识别"}
                  score={focusDimension?.score ?? 0}
                  color="#F4A261"
                />
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] text-azure-400">MEASURABLE EVIDENCE</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[var(--fg)]">每个数字都有页面可核验</h2>
                </div>
                <span className="text-xs text-[var(--fg-muted)]">当前学习者 · {learner.name}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {evidenceStats.map((stat) => (
                  <EvidenceStat key={stat.label} {...stat} />
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-vermilion-500/20 bg-gradient-to-br from-vermilion-500/10 to-transparent p-5">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-vermilion-400">
                      <CheckCircle2 className="h-4 w-4" />
                      下一项可执行任务
                    </div>
                    <h3 className="mt-2 font-serif text-xl font-bold text-[var(--fg)]">
                      {isNewUser ? "完成首项计划，建立你的第一条学习证据" : `补强「${nextKnowledge?.title ?? "当前知识点"}」`}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[var(--fg-muted)]">{recommendationReason}</p>
                  </div>
                  <Link
                    to={isNewUser ? "/plan" : `/library?q=${encodeURIComponent(nextKnowledge?.title ?? "人工智能")}`}
                    className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-vermilion-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-vermilion-600"
                  >
                    立即执行
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-9 sm:px-6 lg:px-10 lg:pb-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="为当前决策准备"
            title={isNewUser ? "从第一项任务开始建立真实画像" : `${nextKnowledge?.title ?? "当前知识点"} · 个性化资源包`}
            description="不是随机推荐：资源围绕当前知识节点，并由不同角色智能体协作生成。"
            id="resource-heading"
          />
          <Link
            to={`/library?q=${encodeURIComponent(nextKnowledge?.title ?? "人工智能")}`}
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-medium text-azure-400 hover:text-azure-500"
          >
            查看完整资源包
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} compact />
          ))}
        </div>
      </section>

      <section className="px-5 sm:px-6 lg:px-10">
        <div className="relative overflow-hidden rounded-[26px] border border-[var(--card-border)] bg-[var(--surface-popover)] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-amethyst-500/15 blur-3xl" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-aurum-400">
                <Sparkles className="h-4 w-4" />
                从这里继续验证完整闭环
              </div>
              <h2 className="mt-3 max-w-2xl font-serif text-2xl font-bold text-[var(--fg)] sm:text-3xl">
                选择一个真实动作，看画像、资源与路径如何联动
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap lg:justify-end">
              <ActionLink to="/workshop" icon={Factory} label="生成资源" />
              <ActionLink to="/tutor" icon={MessageSquareText} label="追问导师" />
              <ActionLink to="/practice" icon={BookOpen} label="进入训练" />
              <ActionLink to="/assessment" icon={Gauge} label="查看评估" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DecisionRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${color}18`, color }}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[var(--fg-muted)]">{label}</p>
        <p className="mt-0.5 text-xs font-medium leading-5 text-[var(--fg)]">{value}</p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.2em] text-vermilion-400">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-serif text-2xl font-bold text-[var(--fg)] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--fg-muted)]">{description}</p>
    </div>
  );
}

function MethodCard({
  no,
  icon: Icon,
  title,
  description,
  evidence,
  to,
  color,
}: {
  no: string;
  icon: LucideIcon;
  title: string;
  description: string;
  evidence: string;
  to: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="group relative min-h-[220px] overflow-hidden rounded-card border border-[var(--card-border)] bg-[var(--card)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[color:var(--method-color)] hover:shadow-float"
      style={{ "--method-color": color } as CSSProperties}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] text-[var(--fg-muted)]">{no}</span>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="mt-6 font-serif text-lg font-bold text-[var(--fg)]">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-[var(--fg-muted)]">{description}</p>
      <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 border-t border-[var(--card-border)] pt-3">
        <span className="text-[11px] font-medium" style={{ color }}>{evidence}</span>
        <ArrowRight className="h-4 w-4 text-[var(--fg-muted)] transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function ResultSignal({
  label,
  value,
  score,
  color,
}: {
  label: string;
  value: string;
  score: number;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--card-border)] bg-[var(--surface-input)] p-3.5">
      <p className="text-[10px] text-[var(--fg-muted)]">{label}</p>
      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="truncate font-serif text-sm font-semibold text-[var(--fg)]">{value}</span>
        <span className="font-mono text-xs" style={{ color }}>{score}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-700/40">
        <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function EvidenceStat({
  label,
  value,
  detail,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--surface-input)] p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] text-[var(--fg-muted)]">{label}</p>
        <Icon className="h-4 w-4" style={{ color }} />
      </div>
      <p className="mt-3 font-serif text-2xl font-bold text-[var(--fg)] sm:text-3xl">{value}</p>
      <p className="mt-1 text-[10px] leading-4 text-[var(--fg-muted)]">{detail}</p>
      <div className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: color }} />
    </div>
  );
}

function ActionLink({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--card)] px-4 py-2.5 text-xs font-medium text-[var(--fg)] transition hover:-translate-y-0.5 hover:border-azure-500/50 hover:bg-azure-500/10"
    >
      <Icon className="h-4 w-4 text-azure-400" />
      {label}
      <ChevronRight className="h-3.5 w-3.5 text-[var(--fg-muted)] transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
