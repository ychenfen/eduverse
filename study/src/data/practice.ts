import type {
  PracticeQuestion,
  StudyPlanOptions,
  StudyPlanTask,
  StudyPlanMilestone,
  StudyPlan,
  LearningRecord,
  PracticeType,
} from "@/types";
import { knowledgeNodes } from "./course";

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: "pq-001",
    knowledgeId: "ai-intro",
    type: "single",
    question: "Python 中定义函数使用哪个关键字？",
    options: ["function", "def", "func", "define"],
    correctAnswer: 1,
    explanation: "Python 使用 def 关键字定义函数。",
    difficulty: 1,
  },
  {
    id: "pq-002",
    knowledgeId: "ai-intro",
    type: "fill",
    question: "Python 中使用 ______ 关键字定义函数。",
    correctAnswer: "def",
    explanation: "def 是 define 的缩写，用于定义函数。",
    difficulty: 1,
  },
  {
    id: "pq-003",
    knowledgeId: "ai-intro",
    type: "code-fill",
    question: "补全代码，实现一个返回两数之和的函数：",
    codeTemplate: "def add(a, b):\n    ______ a + b",
    blanks: ["return"],
    correctAnswer: ["return"],
    explanation: "函数使用 return 语句返回计算结果。",
    difficulty: 1,
  },
  {
    id: "pq-004",
    knowledgeId: "ai-intro",
    type: "judge",
    question: "Python 函数必须有 return 语句。",
    correctAnswer: 0,
    explanation: "Python 函数可以没有 return 语句，默认返回 None。",
    difficulty: 1,
  },
  {
    id: "pq-005",
    knowledgeId: "ai-intro",
    type: "code-fill",
    question: "补全代码，实现一个欢迎函数：",
    codeTemplate: "def welcome(name):\n    print(f'欢迎, ______!')",
    blanks: ["{name}"],
    correctAnswer: ["{name}"],
    explanation: "使用 f-string 格式化字符串，将 name 参数拼接到欢迎语中。",
    difficulty: 2,
  },
  {
    id: "pq-006",
    knowledgeId: "ai-history",
    type: "single",
    question: "被称为人工智能元年的是哪一年？",
    options: ["1942 年", "1956 年", "1969 年", "1980 年"],
    correctAnswer: 1,
    explanation: "1956 年达特茅斯会议上，John McCarthy 首次提出人工智能（Artificial Intelligence）概念。",
    difficulty: 1,
  },
  {
    id: "pq-007",
    knowledgeId: "ai-history",
    type: "fill",
    question: "1956 年的 ______ 会议被认为是人工智能诞生的标志。",
    correctAnswer: "达特茅斯",
    explanation: "达特茅斯会议（Dartmouth Conference）由 John McCarthy 组织，首次提出了人工智能概念。",
    difficulty: 1,
  },
  {
    id: "pq-008",
    knowledgeId: "ai-history",
    type: "multiple",
    question: "以下哪些属于人工智能的研究领域？（多选）",
    options: ["机器学习", "计算机视觉", "自然语言处理", "软件工程"],
    correctAnswer: [0, 1, 2],
    explanation: "机器学习、计算机视觉、自然语言处理都是人工智能的重要研究领域，软件工程不属于。",
    difficulty: 1,
  },
  {
    id: "pq-009",
    knowledgeId: "ai-history",
    type: "single",
    question: "图灵测试是用来检验什么的？",
    options: ["机器的计算速度", "机器是否具有智能", "机器的存储容量", "机器的能耗"],
    correctAnswer: 1,
    explanation: "图灵测试由 Alan Turing 提出，用于判断机器是否具有人类级别的智能。",
    difficulty: 2,
  },
  {
    id: "pq-010",
    knowledgeId: "ml-overview",
    type: "single",
    question: "机器学习中，以下哪种属于监督学习？",
    options: ["聚类", "分类", "降维", "关联规则"],
    correctAnswer: 1,
    explanation: "分类是监督学习的典型任务，需要带标签的数据进行训练。",
    difficulty: 2,
  },
  {
    id: "pq-011",
    knowledgeId: "ml-overview",
    type: "fill",
    question: "机器学习按照学习方式可分为监督学习、______和强化学习三大类。",
    correctAnswer: "无监督学习",
    explanation: "机器学习主要分为监督学习、无监督学习、强化学习三大类。",
    difficulty: 2,
  },
  {
    id: "pq-012",
    knowledgeId: "ml-overview",
    type: "judge",
    question: "K-Means 是一种监督学习算法。",
    correctAnswer: 0,
    explanation: "K-Means 是无监督学习中的聚类算法，不需要标签。",
    difficulty: 1,
  },
  {
    id: "pq-013",
    knowledgeId: "ml-overview",
    type: "code-fill",
    question: "补全代码，导入 sklearn 中的线性回归模型：",
    codeTemplate: "from sklearn.______ import LinearRegression\nmodel = LinearRegression()",
    blanks: ["linear_model"],
    correctAnswer: ["linear_model"],
    explanation: "sklearn.linear_model 模块包含线性回归等线性模型。",
    difficulty: 2,
  },
  {
    id: "pq-014",
    knowledgeId: "dl-fundamentals",
    type: "single",
    question: "神经网络中，常用的激活函数不包括？",
    options: ["ReLU", "Sigmoid", "Tanh", "Fibonacci"],
    correctAnswer: 3,
    explanation: "Fibonacci（斐波那契）是数列，不是激活函数。",
    difficulty: 2,
  },
  {
    id: "pq-015",
    knowledgeId: "dl-fundamentals",
    type: "fill",
    question: "神经网络中，______ 层用于减少过拟合，随机丢弃部分神经元。",
    correctAnswer: "Dropout",
    explanation: "Dropout 层在训练时随机丢弃部分神经元，防止过拟合。",
    difficulty: 2,
  },
  {
    id: "pq-016",
    knowledgeId: "dl-fundamentals",
    type: "code-fill",
    question: "补全 PyTorch 代码，定义一个简单的全连接层：",
    codeTemplate: "import torch.nn as nn\nlayer = nn.______(in_features=784, out_features=256)",
    blanks: ["Linear"],
    correctAnswer: ["Linear"],
    explanation: "nn.Linear 是 PyTorch 中的全连接（线性）层。",
    difficulty: 2,
  },
  {
    id: "pq-017",
    knowledgeId: "dl-cnn",
    type: "single",
    question: "CNN（卷积神经网络）最适合处理什么类型的数据？",
    options: ["文本数据", "图像数据", "音频数据", "表格数据"],
    correctAnswer: 1,
    explanation: "CNN 通过卷积核提取局部特征，非常适合图像处理。",
    difficulty: 1,
  },
  {
    id: "pq-018",
    knowledgeId: "dl-cnn",
    type: "multiple",
    question: "以下哪些是 CNN 的常用组件？（多选）",
    options: ["卷积层", "池化层", "全连接层", "循环层"],
    correctAnswer: [0, 1, 2],
    explanation: "卷积层、池化层、全连接层是 CNN 的核心组件，循环层属于 RNN。",
    difficulty: 2,
  },
  {
    id: "pq-019",
    knowledgeId: "dl-cnn",
    type: "fill",
    question: "CNN 中，______ 层用于降低特征图的空间尺寸，减少计算量。",
    correctAnswer: "池化",
    explanation: "池化层（Pooling）通过下采样降低特征图尺寸，减少参数和计算量。",
    difficulty: 2,
  },
  {
    id: "pq-020",
    knowledgeId: "dl-transformer",
    type: "single",
    question: "Transformer 架构的核心机制是什么？",
    options: ["卷积", "循环", "自注意力", "池化"],
    correctAnswer: 2,
    explanation: "自注意力（Self-Attention）是 Transformer 的核心机制。",
    difficulty: 2,
  },
  {
    id: "pq-021",
    knowledgeId: "dl-transformer",
    type: "fill",
    question: "Transformer 论文的论文标题是 Attention Is ______。",
    correctAnswer: "All You Need",
    explanation: "2017 年的论文 Attention Is All You Need 提出了 Transformer 架构。",
    difficulty: 3,
  },
  {
    id: "pq-022",
    knowledgeId: "dl-transformer",
    type: "judge",
    question: "Transformer 只能处理文本数据。",
    correctAnswer: 0,
    explanation: "Transformer 不仅可以处理文本，也可以应用于图像（ViT）、音频等多种模态。",
    difficulty: 2,
  },
  {
    id: "pq-023",
    knowledgeId: "llm-pretrain",
    type: "single",
    question: "以下哪个不是大语言模型？",
    options: ["GPT", "BERT", "ResNet", "LLaMA"],
    correctAnswer: 2,
    explanation: "ResNet 是计算机视觉中的卷积网络，不是大语言模型。",
    difficulty: 1,
  },
  {
    id: "pq-024",
    knowledgeId: "llm-pretrain",
    type: "fill",
    question: "LLM 的中文全称是 ______。",
    correctAnswer: "大语言模型",
    explanation: "LLM = Large Language Model，即大语言模型。",
    difficulty: 1,
  },
  {
    id: "pq-025",
    knowledgeId: "llm-pretrain",
    type: "multiple",
    question: "大语言模型的能力包括？（多选）",
    options: ["文本生成", "代码生成", "图像生成", "推理思考"],
    correctAnswer: [0, 1, 3],
    explanation: "大语言模型可以进行文本生成、代码生成和推理思考，图像生成是图像模型的专长。",
    difficulty: 2,
  },
  {
    id: "pq-026",
    knowledgeId: "llm-agent",
    type: "single",
    question: "Prompt Engineering（提示工程）的目的是什么？",
    options: ["训练模型", "优化模型输入以获得更好输出", "压缩模型", "部署模型"],
    correctAnswer: 1,
    explanation: "提示工程通过设计巧妙的输入提示，让大模型输出更好的结果。",
    difficulty: 2,
  },
  {
    id: "pq-027",
    knowledgeId: "llm-agent",
    type: "fill",
    question: "让模型按照给定示例学习的提示技术叫做 ______ 提示（Few-shot）。",
    correctAnswer: "少样本",
    explanation: "Few-shot Learning（少样本学习）通过给几个示例让模型理解任务。",
    difficulty: 2,
  },
  {
    id: "pq-028",
    knowledgeId: "llm-agent",
    type: "judge",
    question: "Chain-of-Thought（思维链）提示可以提升模型的推理能力。",
    correctAnswer: 1,
    explanation: "思维链提示让模型逐步思考，显著提升推理类任务的表现。",
    difficulty: 2,
  },
  {
    id: "pq-029",
    knowledgeId: "llm-rag",
    type: "single",
    question: "RAG（检索增强生成）的核心作用是？",
    options: ["加速训练", "减少参数", "补充外部知识", "降低部署成本"],
    correctAnswer: 2,
    explanation: "RAG 通过检索外部知识库来增强生成内容的准确性和时效性。",
    difficulty: 3,
  },
  {
    id: "pq-030",
    knowledgeId: "llm-rag",
    type: "fill",
    question: "RAG 的三个主要步骤是检索、______、生成。",
    correctAnswer: "增强",
    explanation: "RAG = Retrieval-Augmented Generation，即检索-增强-生成。",
    difficulty: 3,
  },
  {
    id: "pq-031",
    knowledgeId: "dl-rnn",
    type: "single",
    question: "时间序列预测中，常用的深度学习模型是？",
    options: ["ResNet", "LSTM", "BERT", "GAN"],
    correctAnswer: 1,
    explanation: "LSTM（长短期记忆网络）擅长处理序列数据，常用于时间序列预测。",
    difficulty: 2,
  },
  {
    id: "pq-032",
    knowledgeId: "dl-rnn",
    type: "fill",
    question: "ARIMA 模型用于 ______ 序列预测。",
    correctAnswer: "时间",
    explanation: "ARIMA 是经典的时间序列预测统计模型。",
    difficulty: 2,
  },
  {
    id: "pq-033",
    knowledgeId: "ml-overview",
    type: "single",
    question: "推荐系统中，协同过滤的核心思想是？",
    options: ["内容相似", "用户行为相似", "价格相似", "标签相似"],
    correctAnswer: 1,
    explanation: "协同过滤基于用户或物品的行为相似性进行推荐。",
    difficulty: 2,
  },
  {
    id: "pq-034",
    knowledgeId: "ml-overview",
    type: "multiple",
    question: "推荐系统的常用方法有？（多选）",
    options: ["协同过滤", "内容推荐", "混合推荐", "随机推荐"],
    correctAnswer: [0, 1, 2],
    explanation: "协同过滤、内容推荐、混合推荐都是常用方法，随机推荐不是有效方法。",
    difficulty: 2,
  },
  {
    id: "pq-035",
    knowledgeId: "dl-cnn",
    type: "single",
    question: "计算机视觉中，目标检测的任务是？",
    options: ["分类图像", "定位并识别物体", "生成图像", "压缩图像"],
    correctAnswer: 1,
    explanation: "目标检测既要定位物体位置，又要识别物体类别。",
    difficulty: 2,
  },
  {
    id: "pq-036",
    knowledgeId: "dl-cnn",
    type: "fill",
    question: "YOLO 是一种实时 ______ 检测算法。",
    correctAnswer: "目标",
    explanation: "YOLO（You Only Look Once）是著名的实时目标检测算法系列。",
    difficulty: 2,
  },
  {
    id: "pq-037",
    knowledgeId: "search-local",
    type: "single",
    question: "强化学习中，智能体通过什么来学习？",
    options: ["标签数据", "奖励信号", "无标签数据", "规则"],
    correctAnswer: 1,
    explanation: "强化学习通过环境反馈的奖励信号来学习最优策略。",
    difficulty: 2,
  },
  {
    id: "pq-038",
    knowledgeId: "search-local",
    type: "fill",
    question: "强化学习的三要素是状态、动作和 ______。",
    correctAnswer: "奖励",
    explanation: "强化学习中，智能体在某状态下采取动作，获得奖励。",
    difficulty: 2,
  },
  {
    id: "pq-039",
    knowledgeId: "search-informed",
    type: "single",
    question: "Q-Learning 中，Q 值代表什么？",
    options: ["质量", "动作价值", "数量", "查询"],
    correctAnswer: 1,
    explanation: "Q 值表示在某状态下采取某动作的预期累积奖励价值。",
    difficulty: 3,
  },
  {
    id: "pq-040",
    knowledgeId: "search-informed",
    type: "judge",
    question: "强化学习需要大量标注数据。",
    correctAnswer: 0,
    explanation: "强化学习通过与环境交互获取奖励，不需要标注数据。",
    difficulty: 2,
  },
];

export function getPracticeByKnowledge(knowledgeId: string): PracticeQuestion[] {
  return practiceQuestions.filter((q) => q.knowledgeId === knowledgeId);
}

export function getRandomPractice(count: number, knowledgeIds?: string[]): PracticeQuestion[] {
  let pool = practiceQuestions;
  if (knowledgeIds && knowledgeIds.length > 0) {
    pool = practiceQuestions.filter((q) => knowledgeIds.includes(q.knowledgeId));
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomPracticeByTypes(count: number, types: PracticeType[]): PracticeQuestion[] {
  let pool = practiceQuestions;
  if (types && types.length > 0) {
    pool = practiceQuestions.filter((q) => types.includes(q.type));
  }
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getPracticeByType(type: string, count?: number): PracticeQuestion[] {
  const filtered = practiceQuestions.filter((q) => q.type === type);
  if (count) {
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }
  return filtered;
}

export function getAllPracticeQuestions(): PracticeQuestion[] {
  return practiceQuestions;
}

// 方向 -> 章节编号 映射（每个方向覆盖 course.ts 中对应章节）
const focusToChapters: Record<string, number[]> = {
  algorithms: [2],
  ml: [4],
  dl: [5],
  nlp: [6],
  cv: [5],
  rl: [2, 5],
  agent: [6],
  engineering: [3, 6],
};

// 难度系数：影响每天学习量和任务时长
const difficultyMultiplier: Record<StudyPlanOptions["difficulty"], number> = {
  beginner: 0.8,
  intermediate: 1,
  advanced: 1.3,
};

function getTasksForKnowledge(node: (typeof knowledgeNodes)[number]): Omit<StudyPlanTask, "day" | "date">[] {
  const baseMinutes = node.estimatedMinutes || 30;
  const tasks: Omit<StudyPlanTask, "day" | "date">[] = [];

  if (node.category === "concept" || node.category === "history") {
    tasks.push({
      title: `学习概念：${node.title}`,
      description: node.summary || `掌握 ${node.title} 的核心概念与背景知识。`,
      estimatedMinutes: Math.round(baseMinutes * 0.5),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "video",
    });
    tasks.push({
      title: `深度阅读：${node.title}`,
      description: `阅读相关材料，整理笔记，理解 ${node.title} 的关键要点。`,
      estimatedMinutes: Math.round(baseMinutes * 0.4),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "reading",
    });
  } else if (node.category === "algorithm") {
    tasks.push({
      title: `算法原理：${node.title}`,
      description: node.summary || `理解 ${node.title} 的算法思想与流程。`,
      estimatedMinutes: Math.round(baseMinutes * 0.5),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "video",
    });
    tasks.push({
      title: `算法实现：${node.title}`,
      description: `动手实现或复现 ${node.title}，加深对细节的理解。`,
      estimatedMinutes: Math.round(baseMinutes * 0.5),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "practice",
    });
  } else if (node.category === "model") {
    tasks.push({
      title: `模型原理：${node.title}`,
      description: node.summary || `学习 ${node.title} 的网络结构与训练方法。`,
      estimatedMinutes: Math.round(baseMinutes * 0.5),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "video",
    });
    tasks.push({
      title: `代码实践：${node.title}`,
      description: `使用 PyTorch / sklearn 等工具实现 ${node.title} 的小例子。`,
      estimatedMinutes: Math.round(baseMinutes * 0.5),
      knowledgeId: node.id,
      knowledgeTitle: node.title,
      type: "practice",
    });
  }

  tasks.push({
    title: `巩固测验：${node.title}`,
    description: `完成 ${node.title} 相关的练习题与测验，检验掌握情况。`,
    estimatedMinutes: Math.max(10, Math.round(baseMinutes * 0.25)),
    knowledgeId: node.id,
    knowledgeTitle: node.title,
    type: "quiz",
  });

  return tasks;
}

function distributeTasksToDays(
  knowledgeList: (typeof knowledgeNodes)[number][],
  durationDays: number,
  difficulty: StudyPlanOptions["difficulty"],
  startDate: Date,
): StudyPlanTask[] {
  const multiplier = difficultyMultiplier[difficulty];
  const allTasks = knowledgeList.flatMap((node) =>
    getTasksForKnowledge(node).map((t) => ({ ...t, estimatedMinutes: Math.round(t.estimatedMinutes * multiplier) })),
  );

  // 按天数均分任务，尽量让每天时长接近 dailyMinutes
  const tasksPerDay = Math.max(1, Math.ceil(allTasks.length / durationDays));
  const result: StudyPlanTask[] = [];

  for (let i = 0; i < allTasks.length; i++) {
    const day = Math.min(durationDays, Math.floor(i / tasksPerDay) + 1);
    const date = new Date(startDate);
    date.setDate(date.getDate() + day - 1);
    result.push({
      ...allTasks[i],
      day,
      date: date.toISOString().slice(0, 10),
    });
  }

  return result;
}

export function generateStudyPlan(options: StudyPlanOptions, records?: LearningRecord[]): StudyPlan {
  const { goal, focusAreas, difficulty, dailyMinutes, durationDays } = options;

  let selectedKnowledge: (typeof knowledgeNodes)[number][];

  if (focusAreas.length > 0) {
    const chapterSet = new Set<number>();
    focusAreas.forEach((f) => {
      (focusToChapters[f] || []).forEach((ch) => chapterSet.add(ch));
    });
    selectedKnowledge = knowledgeNodes.filter((k) => chapterSet.has(k.chapter)).sort((a, b) => a.chapter - b.chapter);
  } else if (records && records.some((r) => r.learned)) {
    // 有学习记录但没选方向：推荐未学习/掌握度低的知识点
    const learnedIds = new Set(records.filter((r) => r.learned || r.mastery > 0).map((r) => r.knowledgeId));
    selectedKnowledge = knowledgeNodes
      .filter((k) => !learnedIds.has(k.id))
      .sort((a, b) => a.difficulty - b.difficulty)
      .slice(0, Math.max(6, Math.floor(durationDays / 3)));
  } else {
    // 新用户默认路径：AI 基础 -> 搜索 -> 机器学习 -> 深度学习
    selectedKnowledge = knowledgeNodes.slice(0, Math.max(6, Math.floor(durationDays / 3)));
  }

  // 兜底：至少保证有知识点
  if (selectedKnowledge.length === 0) {
    selectedKnowledge = knowledgeNodes.slice(0, 6);
  }

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + durationDays - 1);

  const dailyTasks = distributeTasksToDays(selectedKnowledge, durationDays, difficulty, startDate);

  // 按阶段生成里程碑（每 1/3 时长一个阶段）
  const milestones: StudyPlanMilestone[] = [];
  const stageCount = 3;
  for (let stage = 0; stage < stageCount; stage++) {
    // 按比例切分，保证 7/14/28 等非 3 的倍数周期也完整覆盖最后一天。
    const startDay = Math.floor((stage * durationDays) / stageCount) + 1;
    const endDay = Math.floor(((stage + 1) * durationDays) / stageCount);
    const stageTasks = dailyTasks.filter((t) => t.day >= startDay && t.day <= endDay);
    const stageKnowledgeIds = Array.from(new Set(stageTasks.map((t) => t.knowledgeId)));

    const milestoneDate = new Date(startDate);
    milestoneDate.setDate(milestoneDate.getDate() + endDay - 1);

    const stageTitles = [
      "夯实基础",
      "深入核心",
      "综合实战",
    ];

    milestones.push({
      date: milestoneDate.toISOString().slice(0, 10),
      title: `第 ${stage + 1} 阶段：${stageTitles[stage]}（${startDay}-${endDay} 天）`,
      knowledgeIds: stageKnowledgeIds,
      tasks: stageTasks,
    });
  }

  return {
    id: `plan-${Date.now()}`,
    title: goal || "AI 学习计划",
    goal: goal || "系统学习 AI 基础知识",
    createdAt: new Date().toISOString(),
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    dailyMinutes,
    focusAreas,
    difficulty,
    milestones,
    status: "active",
  };
}

export function buildDefaultPlan(records?: LearningRecord[]): StudyPlan {
  return generateStudyPlan(
    {
      goal: "零基础入门人工智能",
      focusAreas: [],
      difficulty: "beginner",
      dailyMinutes: 60,
      durationDays: 30,
    },
    records,
  );
}
