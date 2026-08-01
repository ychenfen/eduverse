import type { AgentDefinition } from "@/types";

export const agents: AgentDefinition[] = [
  {
    id: "captain",
    name: "灵境",
    role: "队长 · Captain",
    glyph: "灵",
    color: "#E63946",
    desc: "对话引导专家，负责学生画像构建与任务分发，是学生与智能体编队之间的桥梁。",
    skills: ["对话式画像抽取", "任务理解与分发", "学习目标对齐"],
    triggers: "all",
  },
  {
    id: "deconstructor",
    name: "解构者",
    role: "知识架构师 · Deconstructor",
    glyph: "解",
    color: "#F4A261",
    desc: "将复杂知识点拆解为可学习的结构化骨架，输出思维导图与知识依赖关系。",
    skills: ["知识结构拆解", "思维导图骨架", "前置依赖分析"],
    triggers: ["document", "mindmap", "reading"],
  },
  {
    id: "weaver",
    name: "编织者",
    role: "内容撰写师 · Weaver",
    glyph: "织",
    color: "#1B9AAA",
    desc: "将知识骨架织就为详实、可读的讲解文档与拓展阅读，注重叙事逻辑与学术严谨。",
    skills: ["学术叙事撰写", "类比与例证", "拓展阅读汇编"],
    triggers: ["document", "reading"],
  },
  {
    id: "quizmaster",
    name: "出题官",
    role: "评测设计师 · QuizMaster",
    glyph: "题",
    color: "#9D4EDD",
    desc: "依据知识图谱与画像易错点，生成多题型、多难度的练习题与解析。",
    skills: ["多题型生成", "难度梯度设计", "易错点靶向"],
    triggers: ["quiz"],
  },
  {
    id: "visualist",
    name: "视觉师",
    role: "多模态设计师 · Visualist",
    glyph: "视",
    color: "#22D3EE",
    desc: "将抽象概念可视化为 SVG 图解与动画分镜脚本，让难懂的概念一目了然。",
    skills: ["SVG 图解生成", "动画分镜脚本", "信息图设计"],
    triggers: ["animation"],
  },
  {
    id: "coder",
    name: "实操匠",
    role: "代码工程师 · Coder",
    glyph: "码",
    color: "#10B981",
    desc: "生成可运行的代码案例与实验项目，覆盖环境配置、注释与单元测试。",
    skills: ["可运行代码生成", "环境配置", "单元测试编写"],
    triggers: ["code"],
  },
  {
    id: "validator",
    name: "校验官",
    role: "防幻觉守门人 · Validator",
    glyph: "校",
    color: "#F87171",
    desc: "对照本地知识库进行事实核查、安全过滤与引用补全，确保输出无幻觉、无违规。",
    skills: ["事实核查", "安全过滤", "引用补全"],
    triggers: "all",
  },
];

export const getAgentById = (id: string) =>
  agents.find((a) => a.id === id);

// 资源类型对应的智能体编队顺序
export const agentPipeline: Record<
  string,
  { id: AgentDefinition["id"]; phase: string }[]
> = {
  document: [
    { id: "deconstructor", phase: "拆解知识结构" },
    { id: "weaver", phase: "撰写讲解文档" },
    { id: "validator", phase: "事实核查与安全过滤" },
  ],
  mindmap: [
    { id: "deconstructor", phase: "构建思维骨架" },
    { id: "visualist", phase: "渲染节点连线" },
    { id: "validator", phase: "节点校验" },
  ],
  quiz: [
    { id: "deconstructor", phase: "锁定考点" },
    { id: "quizmaster", phase: "生成多梯度题目" },
    { id: "validator", phase: "答案与解析校验" },
  ],
  reading: [
    { id: "deconstructor", phase: "梳理拓展方向" },
    { id: "weaver", phase: "汇编拓展阅读" },
    { id: "validator", phase: "引用补全" },
  ],
  animation: [
    { id: "deconstructor", phase: "提取可视化要素" },
    { id: "visualist", phase: "设计分镜与图解" },
    { id: "validator", phase: "图解准确性校验" },
  ],
  code: [
    { id: "deconstructor", phase: "分析实操需求" },
    { id: "coder", phase: "编写可运行代码" },
    { id: "validator", phase: "语法与安全校验" },
  ],
};
