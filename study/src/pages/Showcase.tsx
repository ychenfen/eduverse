import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  CircleGauge,
  FileCheck2,
  Fingerprint,
  Network,
  Play,
  Route,
  ShieldCheck,
  Sparkles,
  TimerReset,
} from "lucide-react";
import AgentAvatar from "@/components/AgentAvatar";
import { agents } from "@/data/agents";
import { knowledgeNodes } from "@/data/course";
import { resourceTypeMeta } from "@/data/resources";
import { useAppStore } from "@/store/useAppStore";

const demoSteps = [
  {
    index: "01",
    time: "35 秒",
    title: "画像不是问卷",
    detail: "从自然语言和学习行为中抽取六维特征，展示版本证据与动态变化。",
    proof: "看画像版本与证据链",
    to: "/profile",
    accent: "text-vermilion-400",
  },
  {
    index: "02",
    time: "55 秒",
    title: "资源不是套模板",
    detail: "选择任意知识主题，观察角色智能体协作生成、校验并入库的全过程。",
    proof: "现场生成一份多模态资源",
    to: "/workshop",
    accent: "text-aurum-400",
  },
  {
    index: "03",
    time: "30 秒",
    title: "推荐不是黑盒",
    detail: "画像、知识依赖和掌握度共同决定路径状态，每个推荐都给出原因。",
    proof: "查看 Transformer 推荐依据",
    to: "/path",
    accent: "text-azure-400",
  },
  {
    index: "04",
    time: "40 秒",
    title: "学习不是只看内容",
    detail: "完成专项练习，结果写回学习记录并成为下一轮画像和路径调整的依据。",
    proof: "完成一道题并查看解析",
    to: "/practice",
    accent: "text-amethyst-400",
  },
  {
    index: "05",
    time: "20 秒",
    title: "效果不是自说自话",
    detail: "用掌握度、练习、时间、画像变化和薄弱点诊断验证学习效果。",
    proof: "打开可追溯评估报告",
    to: "/assessment",
    accent: "text-jade-400",
  },
] as const;

const proofCards = [
  {
    icon: Fingerprint,
    title: "画像有证据",
    copy: "每个维度保存分数、标签、抽取依据和版本触发原因，支持随学随新。",
    to: "/profile",
    label: "验证画像",
  },
  {
    icon: Network,
    title: "协作有轨迹",
    copy: "生成过程公开 thinking、generating、validating、done 四阶段日志。",
    to: "/workshop",
    label: "验证编队",
  },
  {
    icon: ShieldCheck,
    title: "内容有校验",
    copy: "知识白名单、结构检查、敏感过滤与引用补全共同组成安全门禁。",
    to: "/library",
    label: "验证资源",
  },
  {
    icon: CircleGauge,
    title: "学习有反馈",
    copy: "学习、测验和练习记录回流至评估，驱动下一步计划与资源推荐。",
    to: "/assessment",
    label: "验证闭环",
  },
] as const;

export default function Showcase() {
  const learner = useAppStore((state) => state.learner);
  const profile = useAppStore((state) => state.currentProfile);
  const resources = useAppStore((state) => state.resources);
  const learningRecords = useAppStore((state) => state.learningRecords);

  const profileAverage = Math.round(
    profile.dimensions.reduce((sum, dimension) => sum + dimension.score, 0) /
      Math.max(profile.dimensions.length, 1),
  );
  const learnedCount = learningRecords.filter((record) => record.learned).length;
  const safeResources = resources.filter((resource) => resource.safetyCheck.passed).length;
  const resourceTypes = new Set(resources.map((resource) => resource.type)).size;
  const activeRecord = learningRecords
    .filter((record) => record.mastery > 0 && record.mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)[0];
  const activeKnowledge = knowledgeNodes.find((node) => node.id === activeRecord?.knowledgeId);

  return (
    <div className="mx-auto max-w-[1500px] overflow-hidden px-4 py-6 sm:px-6 lg:px-8 lg:py-9">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-[var(--card-border)] bg-[var(--card)] px-5 py-7 shadow-float sm:px-8 sm:py-10 lg:px-12 lg:py-12"
      >
        <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-vermilion-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 left-1/3 h-96 w-96 rounded-full bg-azure-500/10 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-8 hidden h-40 w-40 rounded-full border border-aurum-500/15 lg:block" />
        <div className="pointer-events-none absolute right-[5.75rem] top-[5.75rem] hidden h-24 w-24 rounded-full border border-vermilion-500/20 lg:block" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-vermilion-500/30 bg-vermilion-500/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-vermilion-400">
                <Sparkles className="h-3.5 w-3.5" /> FINAL DEMO · 决赛演示台
              </span>
              <span className="text-xs text-[var(--fg-muted)]">3 分钟·验证一个真实学习闭环</span>
            </div>
            <h1 className="max-w-4xl font-serif text-3xl font-bold leading-[1.18] tracking-tight text-[var(--fg)] sm:text-5xl lg:text-[3.4rem]">
              不是又一个内容生成器，
              <span className="mt-2 block text-gradient">而是会随学习改变的智能体系统。</span>
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-[var(--fg-muted)] sm:text-base">
              智学灵境把「画像建模—资源生成—路径规划—学习练习—效果评估」连成一条可解释、可追踪、可持续调整的高等教育个性化学习链路。
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/profile?demo=1"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-aurum-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-current" />
                开始 3 分钟演示
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#demo-route"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--surface-input)] px-6 py-3 text-sm font-medium text-[var(--fg)] transition-colors hover:border-azure-500/50"
              >
                <TimerReset className="h-4 w-4 text-azure-400" />
                先看演示路线
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rotate-2 rounded-[2rem] border border-aurum-500/15" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-[var(--card-border)] bg-[var(--surface-popover)] p-5 shadow-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--card-border)] pb-4">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.2em] text-jade-400">LIVE LEARNING PROOF</div>
                  <div className="mt-1 font-serif text-xl font-bold text-[var(--fg)]">{learner.name}·实时学习态</div>
                </div>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-jade-500/10 text-jade-400">
                  <span className="absolute inset-0 animate-ping rounded-full border border-jade-400/30" />
                  <BrainCircuit className="h-5 w-5" />
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 py-5">
                <div>
                  <div className="font-serif text-2xl font-bold text-[var(--fg)]">v{profile.version}</div>
                  <div className="mt-1 text-[10px] text-[var(--fg-muted)]">画像版本</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-azure-400">{profileAverage}</div>
                  <div className="mt-1 text-[10px] text-[var(--fg-muted)]">六维均值</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-aurum-400">{learnedCount}/{knowledgeNodes.length}</div>
                  <div className="mt-1 text-[10px] text-[var(--fg-muted)]">已学知识点</div>
                </div>
              </div>
              <div className="rounded-2xl border border-vermilion-500/20 bg-vermilion-500/[0.06] p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-vermilion-400">
                  <CircleGauge className="h-4 w-4" /> 当前调优焦点
                </div>
                <div className="mt-2 font-serif text-lg font-bold text-[var(--fg)]">
                  {activeKnowledge?.title ?? "Transformer 与注意力"}
                </div>
                <div className="mt-1 text-xs leading-5 text-[var(--fg-muted)]">
                  掌握度 {activeRecord?.mastery ?? 35}%·系统已提升图解、代码和针对性题库的推荐权重。
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-[10px] text-[var(--fg-muted)]">
                <span>{safeResources}/{resources.length} 资源通过校验</span>
                <span className="inline-flex items-center gap-1 text-jade-400"><CheckCircle2 className="h-3 w-3" /> 数据已就绪</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="可验证系统规模">
        {[
          { value: agents.length, suffix: " 个", label: "角色化智能体", icon: Bot },
          { value: knowledgeNodes.length, suffix: " 个", label: "课程知识节点", icon: BookOpenCheck },
          { value: resources.length, suffix: " 份", label: "多模态学习资源", icon: FileCheck2 },
          { value: resourceTypes || Object.keys(resourceTypeMeta).length, suffix: " 类", label: "可生成资源形态", icon: Sparkles },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * index }}
              className="group flex items-center gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-colors hover:border-azure-500/35"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-azure-500/10 text-azure-400 transition-transform group-hover:rotate-3 group-hover:scale-105"><Icon className="h-5 w-5" /></span>
              <div>
                <div className="font-serif text-2xl font-bold text-[var(--fg)]">{metric.value}<span className="text-sm text-[var(--fg-muted)]">{metric.suffix}</span></div>
                <div className="text-xs text-[var(--fg-muted)]">{metric.label}</div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section id="demo-route" className="scroll-mt-20 py-14">
        <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.22em] text-vermilion-400">JUDGE ROUTE / 评审路线</div>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--fg)]">3 分钟，五步验证核心闭环</h2>
          </div>
          <div className="text-xs leading-5 text-[var(--fg-muted)]">180 秒设计，每一步都有可点击的产品证据</div>
        </div>

        <div className="relative">
          <div className="absolute bottom-8 left-[1.65rem] top-8 hidden w-px bg-gradient-to-b from-vermilion-500 via-azure-500 to-jade-500 sm:block" />
          <div className="space-y-3">
            {demoSteps.map((step) => (
              <Link
                key={step.index}
                to={`${step.to}?demo=1`}
                className="group relative grid gap-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4 transition-all hover:-translate-y-0.5 hover:border-azure-500/40 hover:shadow-float sm:grid-cols-[3.5rem_7rem_1fr_auto] sm:items-center sm:p-5"
              >
                <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--surface-popover)] font-serif text-sm font-bold text-[var(--fg)]">{step.index}</span>
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--surface-input)] px-2.5 py-1 text-[10px] text-[var(--fg-muted)]"><TimerReset className="h-3 w-3" />{step.time}</span>
                <span>
                  <span className="block font-serif text-lg font-bold text-[var(--fg)]">{step.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--fg-muted)]">{step.detail}</span>
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium ${step.accent}`}>
                  {step.proof}<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-[var(--card-border)] bg-[var(--card)] p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-aurum-400"><Bot className="h-4 w-4" /> AGENT ORCHESTRA</div>
          <h2 className="mt-3 font-serif text-2xl font-bold text-[var(--fg)]">一支有分工、有质检的学习编队</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--fg-muted)]">队长理解目标并调度任务，专业角色各司其职，校验官守住最后一道质量门。</p>
          <div className="mt-6 grid grid-cols-4 gap-3">
            {agents.map((agent, index) => (
              <div key={agent.id} className="relative flex flex-col items-center gap-1.5 text-center">
                <AgentAvatar agent={agent} size="md" pulse={agent.id === "captain"} />
                <span className="text-[10px] font-medium text-[var(--fg)]">{agent.name}</span>
                {index < agents.length - 1 && <span className="absolute left-[calc(50%+1.6rem)] top-5 hidden h-px w-[calc(100%-1.2rem)] bg-[var(--card-border)] sm:block" />}
              </div>
            ))}
          </div>
          <Link to="/workshop" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-aurum-400 hover:text-aurum-300">现场观看一次编队协作 <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {proofCards.map((proof) => {
            const Icon = proof.icon;
            return (
              <Link key={proof.title} to={proof.to} className="group rounded-[1.5rem] border border-[var(--card-border)] bg-[var(--card)] p-5 transition-all hover:-translate-y-0.5 hover:border-jade-500/35">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-jade-500/10 text-jade-400"><Icon className="h-5 w-5" /></span>
                <h3 className="mt-4 font-serif text-lg font-bold text-[var(--fg)]">{proof.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--fg-muted)]">{proof.copy}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-jade-400">{proof.label}<ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="my-14 overflow-hidden rounded-[2rem] border border-azure-500/25 bg-gradient-to-br from-azure-500/10 via-[var(--card)] to-amethyst-500/10 p-6 text-center sm:p-10">
        <Route className="mx-auto h-8 w-8 text-azure-400" />
        <h2 className="mt-4 font-serif text-2xl font-bold text-[var(--fg)] sm:text-3xl">让评委看到的不只是功能，而是改变如何发生。</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--fg-muted)]">从一条学习证据开始，到一次精准调整结束。整个过程可解释、可验证、可继续。</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/profile?demo=1" className="inline-flex items-center justify-center gap-2 rounded-full bg-azure-500 px-6 py-3 text-sm font-semibold text-white hover:bg-azure-400"><Play className="h-4 w-4 fill-current" />进入决赛演示</Link>
          <Link to="/assessment" className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--card-border)] bg-[var(--surface-popover)] px-6 py-3 text-sm font-semibold text-[var(--fg)] hover:border-azure-500/50"><CircleGauge className="h-4 w-4 text-jade-400" />查看学习成效</Link>
        </div>
      </section>
    </div>
  );
}
