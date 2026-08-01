import type { Learner, ProfileVersion, LearningPath, LearningRecord, QuizQuestion } from "@/types";

export const mockLearner: Learner = {
  id: "L2024-001",
  name: "林知远",
  avatar: "知",
  major: "人工智能 / 计算机科学与技术",
  grade: "本科大三",
  goal: "考研深造 · 大模型方向",
  enrolledAt: "2024-09-01",
};

// 多个预设学习者（首次进入时可选）
export const presetLearners: Learner[] = [
  mockLearner,
  {
    id: "L2024-002",
    name: "苏晴",
    avatar: "晴",
    major: "电子信息工程",
    grade: "本科大二",
    goal: "保研 · 计算机视觉方向",
    enrolledAt: "2024-09-01",
  },
  {
    id: "L2024-003",
    name: "陈墨",
    avatar: "墨",
    major: "计算机科学与技术",
    grade: "研一",
    goal: "就业 · 强化学习方向",
    enrolledAt: "2025-09-01",
  },
  {
    id: "L2024-004",
    name: "周屿",
    avatar: "屿",
    major: "数据科学",
    grade: "本科大三",
    goal: "竞赛 · Kaggle 方向",
    enrolledAt: "2024-09-01",
  },
];

// 初始画像（首次对话构建后）
export const initialProfile: ProfileVersion = {
  id: "PV-001",
  version: 1,
  createdAt: "2026-03-12 10:24",
  trigger: "首次对话引导",
  dimensions: [
    {
      name: "知识基础",
      score: 68,
      evidence: "自评高数 78 / 线代 65 / 概率 72；Python 中级；近期 ML 课程作业均分 82。",
      tags: ["高数 78", "线代 65", "Python 中级"],
    },
    {
      name: "认知风格",
      score: 76,
      evidence: "倾向视觉+实践型：偏好图解、可运行代码与动手实验，纯符号推导注意力衰减较快。",
      tags: ["视觉型", "实践型"],
    },
    {
      name: "易错偏好",
      score: 54,
      evidence: "梯度爆炸/消失场景易错；注意力机制 QKV 顺序易混；动态规划边界条件遗漏。",
      tags: ["梯度爆炸", "QKV 顺序", "DP 边界"],
    },
    {
      name: "学习节奏",
      score: 72,
      evidence: "稳健型：日均 1.5h，单次专注 45min，偏好小步快跑 + 复习巩固。",
      tags: ["稳健", "45min/次"],
    },
    {
      name: "兴趣方向",
      score: 88,
      evidence: "强烈关注大模型推理优化与多智能体协同；对 CV 兴趣中等；对符号推理兴趣较低。",
      tags: ["LLM 推理", "Multi-Agent", "RAG"],
    },
    {
      name: "目标导向",
      score: 82,
      evidence: "考研 + 工程双导向：需体系化理论，同时希望产出可上线的小型 Agent 项目。",
      tags: ["考研", "工程落地"],
    },
  ],
};

// 第二版画像（学习一段时间后随学随新）
export const updatedProfile: ProfileVersion = {
  id: "PV-002",
  version: 2,
  createdAt: "2026-04-08 19:42",
  trigger: "完成 CNN 章节后随学随新",
  dimensions: [
    {
      name: "知识基础",
      score: 74,
      evidence: "深度学习章节测验 86 分，知识基础提升；线代补强至 71。",
      tags: ["DL 测验 86", "线代 71"],
    },
    {
      name: "认知风格",
      score: 76,
      evidence: "维持视觉+实践型偏好；新增对动画分镜反馈良好。",
      tags: ["视觉型", "实践型", "动画偏好"],
    },
    {
      name: "易错偏好",
      score: 61,
      evidence: "梯度问题已纠正；当前易错点转移到 Multi-Head Attention 维度拼接。",
      tags: ["Multi-Head 维度", "Padding Mask"],
    },
    {
      name: "学习节奏",
      score: 78,
      evidence: "近两周日均 1.8h，单次专注提升至 55min，节奏更稳。",
      tags: ["日均 1.8h", "55min/次"],
    },
    {
      name: "兴趣方向",
      score: 92,
      evidence: "明确聚焦大模型推理与 Agent 工程；主动探索 vLLM、Function Calling。",
      tags: ["vLLM", "Function Calling", "Agent 工程"],
    },
    {
      name: "目标导向",
      score: 85,
      evidence: "考研目标院校锁定；工程目标转为完成一个 3-Agent 协同 Demo。",
      tags: ["院校锁定", "3-Agent Demo"],
    },
  ],
};

export const profileHistory: ProfileVersion[] = [initialProfile, updatedProfile];

// 初始学习路径
export const initialPath: LearningPath = {
  id: "LP-001",
  learnerId: "L2024-001",
  goal: "大模型方向考研 + 工程 Demo 双目标",
  updatedAt: "2026-04-08 19:50",
  nodes: [
    { knowledgeId: "ai-intro", status: "done", order: 1, reason: "基础认知，已掌握" },
    { knowledgeId: "ai-history", status: "done", order: 2 },
    { knowledgeId: "ai-schools", status: "done", order: 3 },
    { knowledgeId: "ml-overview", status: "done", order: 4 },
    { knowledgeId: "ml-linear", status: "done", order: 5 },
    { knowledgeId: "ml-tree", status: "done", order: 6 },
    { knowledgeId: "dl-fundamentals", status: "done", order: 7 },
    { knowledgeId: "dl-cnn", status: "done", order: 8, reason: "近期完成，掌握度 86" },
    { knowledgeId: "dl-rnn", status: "doing", order: 9, reason: "当前学习中，建议聚焦 LSTM 门控" },
    { knowledgeId: "dl-transformer", status: "recommended", order: 10, reason: "兴趣+目标强相关，建议加速" },
    { knowledgeId: "llm-pretrain", status: "todo", order: 11 },
    { knowledgeId: "llm-rag", status: "todo", order: 12 },
    { knowledgeId: "llm-agent", status: "todo", order: 13 },
    { knowledgeId: "llm-multiagent", status: "todo", order: 14, reason: "工程 Demo 终点" },
    { knowledgeId: "search-informed", status: "recommended", order: 15, reason: "补强：A* 启发函数是面试高频" },
    { knowledgeId: "kr-knowledge-graph", status: "locked", order: 16 },
    { knowledgeId: "ml-eval", status: "todo", order: 17 },
    { knowledgeId: "ai-ethics", status: "recommended", order: 18, reason: "考研论述题热点" },
  ],
};

// 学习记录（用于评估）
export const learningRecords: LearningRecord[] = [
  { knowledgeId: "ai-intro", mastery: 92, timeSpent: 28, lastVisit: "2026-03-13", exercisesCorrect: 5, exercisesTotal: 5, completedResources: ["doc-1", "anim-1"], quizAttempts: 2, quizScore: 90, learned: true, quizCompleted: true },
  { knowledgeId: "ai-history", mastery: 88, timeSpent: 32, lastVisit: "2026-03-14", exercisesCorrect: 4, exercisesTotal: 5, completedResources: ["doc-2", "anim-2"], quizAttempts: 1, quizScore: 80, learned: true, quizCompleted: true },
  { knowledgeId: "ai-schools", mastery: 85, timeSpent: 38, lastVisit: "2026-03-16", exercisesCorrect: 7, exercisesTotal: 8, completedResources: ["doc-3"], quizAttempts: 1, quizScore: 75, learned: true, quizCompleted: true },
  { knowledgeId: "ai-ethics", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "search-uninformed", mastery: 78, timeSpent: 40, lastVisit: "2026-03-18", exercisesCorrect: 6, exercisesTotal: 8, completedResources: ["doc-4", "code-1"], quizAttempts: 1, quizScore: 70, learned: true, quizCompleted: true },
  { knowledgeId: "search-informed", mastery: 72, timeSpent: 50, lastVisit: "2026-03-20", exercisesCorrect: 5, exercisesTotal: 7, completedResources: ["doc-5", "code-2"], quizAttempts: 1, quizScore: 65, learned: true, quizCompleted: true },
  { knowledgeId: "search-local", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "search-adversarial", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "kr-logic", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "kr-frame", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "kr-uncertain", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "kr-knowledge-graph", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "ml-overview", mastery: 84, timeSpent: 35, lastVisit: "2026-03-19", exercisesCorrect: 4, exercisesTotal: 5, completedResources: ["doc-6", "mindmap-1"], quizAttempts: 1, quizScore: 80, learned: true, quizCompleted: true },
  { knowledgeId: "ml-linear", mastery: 80, timeSpent: 52, lastVisit: "2026-03-22", exercisesCorrect: 8, exercisesTotal: 10, completedResources: ["doc-7", "code-3"], quizAttempts: 2, quizScore: 75, learned: true, quizCompleted: true },
  { knowledgeId: "ml-tree", mastery: 82, timeSpent: 48, lastVisit: "2026-03-26", exercisesCorrect: 7, exercisesTotal: 9, completedResources: ["doc-8", "code-4"], quizAttempts: 1, quizScore: 78, learned: true, quizCompleted: true },
  { knowledgeId: "ml-eval", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "dl-fundamentals", mastery: 78, timeSpent: 65, lastVisit: "2026-04-02", exercisesCorrect: 6, exercisesTotal: 8, completedResources: ["doc-9", "code-5"], quizAttempts: 1, quizScore: 70, learned: true, quizCompleted: false },
  { knowledgeId: "dl-cnn", mastery: 86, timeSpent: 58, lastVisit: "2026-04-08", exercisesCorrect: 9, exercisesTotal: 10, completedResources: ["doc-10", "anim-3", "code-6"], quizAttempts: 2, quizScore: 85, learned: true, quizCompleted: true },
  { knowledgeId: "dl-rnn", mastery: 62, timeSpent: 30, lastVisit: "2026-04-10", exercisesCorrect: 3, exercisesTotal: 5, completedResources: ["doc-11"], quizAttempts: 1, quizScore: 60, learned: true, quizCompleted: false },
  { knowledgeId: "dl-transformer", mastery: 35, timeSpent: 8, lastVisit: "2026-04-11", exercisesCorrect: 0, exercisesTotal: 2, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "llm-pretrain", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "llm-rag", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "llm-agent", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
  { knowledgeId: "llm-multiagent", mastery: 0, timeSpent: 0, lastVisit: "", exercisesCorrect: 0, exercisesTotal: 0, completedResources: [], quizAttempts: 0, quizScore: 0, learned: false, quizCompleted: false },
];

// 模拟测验题目数据
export const quizQuestions: QuizQuestion[] = [
  // 第一章 AI 绪论与发展史
  { id: "q-ai-intro-1", knowledgeId: "ai-intro", type: "single", question: "以下哪项不属于人工智能的研究范畴？", options: ["机器学习", "深度学习", "云计算", "自然语言处理"], correctAnswer: 2, explanation: "云计算是一种基础设施服务，不属于人工智能的研究范畴。", difficulty: 1 },
  { id: "q-ai-intro-2", knowledgeId: "ai-intro", type: "single", question: "强人工智能（AGI）的特点是什么？", options: ["只能完成特定任务", "具备人类级别的通用智能", "需要大量标注数据", "基于规则引擎"], correctAnswer: 1, explanation: "强人工智能指具备人类级别的通用智能，可以胜任任何智力任务。", difficulty: 2 },
  { id: "q-ai-history-1", knowledgeId: "ai-history", type: "single", question: "人工智能的第一次浪潮主要基于什么方法论？", options: ["连接主义", "行为主义", "符号主义", "深度学习"], correctAnswer: 2, explanation: "第一次浪潮（1956-1974）以符号主义为主导，强调逻辑推理和知识表示。", difficulty: 1 },
  { id: "q-ai-history-2", knowledgeId: "ai-history", type: "single", question: "深度学习浪潮兴起的关键技术突破是？", options: ["专家系统", "卷积神经网络", "决策树", "支持向量机"], correctAnswer: 1, explanation: "卷积神经网络（CNN）和深度学习的发展推动了第三次浪潮的兴起。", difficulty: 2 },
  { id: "q-ai-schools-1", knowledgeId: "ai-schools", type: "single", question: "连接主义学派的代表方法是什么？", options: ["逻辑推理", "神经网络", "进化算法", "专家系统"], correctAnswer: 1, explanation: "连接主义以神经网络为代表，模拟人脑神经元的连接方式。", difficulty: 1 },
  { id: "q-ai-schools-2", knowledgeId: "ai-schools", type: "multiple", question: "以下哪些属于人工智能的研究学派？", options: ["符号主义", "连接主义", "行为主义", "实用主义"], correctAnswer: [0, 1, 2], explanation: "人工智能的三大研究学派是符号主义、连接主义和行为主义。", difficulty: 2 },
  { id: "q-ai-ethics-1", knowledgeId: "ai-ethics", type: "single", question: "AI 伦理中'价值对齐'指的是什么？", options: ["算法效率优化", "AI 目标与人类价值观一致", "数据隐私保护", "模型可解释性"], correctAnswer: 1, explanation: "价值对齐确保 AI 系统的目标与人类价值观保持一致，避免产生有害行为。", difficulty: 2 },

  // 第二章 搜索与优化
  { id: "q-search-1", knowledgeId: "search-uninformed", type: "single", question: "BFS（广度优先搜索）的时间复杂度是？", options: ["O(b)", "O(b^d)", "O(d)", "O(b*d)"], correctAnswer: 1, explanation: "BFS 的时间复杂度为 O(b^d)，其中 b 是分支因子，d 是解的深度。", difficulty: 2 },
  { id: "q-search-2", knowledgeId: "search-uninformed", type: "single", question: "以下哪种搜索策略是完备且最优的？", options: ["DFS", "BFS", "迭代加深", "UCS"], correctAnswer: 3, explanation: "UCS（统一代价搜索）在边权非负时是完备且最优的。", difficulty: 2 },
  { id: "q-search-astar-1", knowledgeId: "search-informed", type: "single", question: "A* 算法的启发函数 h(n) 需要满足什么条件才能保证最优？", options: ["可采纳性", "单调性", "可采纳性且单调性", "无约束"], correctAnswer: 2, explanation: "A* 算法需要启发函数满足可采纳性（h(n) <= h*(n)）且单调一致才能保证最优。", difficulty: 3 },
  { id: "q-search-astar-2", knowledgeId: "search-informed", type: "single", question: "当启发函数 h(n) = 0 时，A* 算法退化为？", options: ["DFS", "BFS", "UCS", "贪婪搜索"], correctAnswer: 2, explanation: "当 h(n) = 0 时，f(n) = g(n)，A* 退化为统一代价搜索（UCS）。", difficulty: 2 },

  // 第三章 知识表示与推理
  { id: "q-kr-logic-1", knowledgeId: "kr-logic", type: "single", question: "一阶谓词逻辑中，以下哪个符号表示全称量词？", options: ["∃", "∀", "→", "∧"], correctAnswer: 1, explanation: "∀ 表示全称量词（for all），∃ 表示存在量词（exists）。", difficulty: 1 },
  { id: "q-kr-frame-1", knowledgeId: "kr-frame", type: "single", question: "框架表示法主要用于表示什么类型的知识？", options: ["数学公式", "结构化知识", "图像数据", "时序数据"], correctAnswer: 1, explanation: "框架表示法适合表示结构化知识，如对象、概念及其属性。", difficulty: 1 },

  // 第四章 机器学习基础
  { id: "q-ml-overview-1", knowledgeId: "ml-overview", type: "single", question: "监督学习与无监督学习的主要区别是？", options: ["计算复杂度", "是否有标签", "数据量大小", "模型类型"], correctAnswer: 1, explanation: "监督学习使用标注数据（有标签），无监督学习使用未标注数据。", difficulty: 1 },
  { id: "q-ml-linear-1", knowledgeId: "ml-linear", type: "single", question: "L1 正则化会产生什么效果？", options: ["特征缩放", "特征选择（稀疏解）", "防止过拟合但不稀疏", "加速收敛"], correctAnswer: 1, explanation: "L1 正则化会产生稀疏解，使得一些特征权重变为 0，实现特征选择。", difficulty: 2 },
  { id: "q-ml-linear-2", knowledgeId: "ml-linear", type: "single", question: "逻辑回归用于解决什么类型的问题？", options: ["回归", "二分类", "多分类", "聚类"], correctAnswer: 1, explanation: "逻辑回归主要用于二分类问题，输出概率值。", difficulty: 1 },
  { id: "q-ml-tree-1", knowledgeId: "ml-tree", type: "single", question: "决策树的 ID3 算法使用什么指标选择特征？", options: ["信息增益", "信息增益比", "基尼系数", "方差"], correctAnswer: 0, explanation: "ID3 使用信息增益，C4.5 使用信息增益比，CART 使用基尼系数。", difficulty: 2 },
  { id: "q-ml-tree-2", knowledgeId: "ml-tree", type: "multiple", question: "以下哪些属于集成学习方法？", options: ["随机森林", "GBDT", "XGBoost", "SVM"], correctAnswer: [0, 1, 2], explanation: "随机森林、GBDT、XGBoost 都是集成学习方法，SVM 是单一模型。", difficulty: 2 },
  { id: "q-ml-eval-1", knowledgeId: "ml-eval", type: "single", question: "AUC（Area Under Curve）衡量的是什么？", options: ["准确率", "召回率", "模型区分正负样本的能力", "F1 分数"], correctAnswer: 2, explanation: "AUC 衡量模型区分正负样本的能力，值越大越好。", difficulty: 2 },

  // 第五章 深度学习
  { id: "q-dl-fund-1", knowledgeId: "dl-fundamentals", type: "single", question: "反向传播算法的核心原理是什么？", options: ["前向计算", "链式法则", "梯度下降", "随机采样"], correctAnswer: 1, explanation: "反向传播基于链式法则，从输出层向输入层逐层计算梯度。", difficulty: 2 },
  { id: "q-dl-fund-2", knowledgeId: "dl-fundamentals", type: "single", question: "ReLU 激活函数的优点是？", options: ["处处可导", "避免梯度消失", "输出范围有限", "计算复杂"], correctAnswer: 1, explanation: "ReLU 在正值区间梯度为常数，有效缓解了梯度消失问题。", difficulty: 2 },
  { id: "q-dl-cnn-1", knowledgeId: "dl-cnn", type: "single", question: "卷积操作的主要作用是什么？", options: ["降维", "特征提取", "分类", "归一化"], correctAnswer: 1, explanation: "卷积通过滑动窗口提取局部特征，是 CNN 的核心操作。", difficulty: 1 },
  { id: "q-dl-cnn-2", knowledgeId: "dl-cnn", type: "single", question: "池化层的作用是什么？", options: ["增加参数", "特征选择", "降采样（减少计算量）", "非线性变换"], correctAnswer: 2, explanation: "池化层通过降采样减少特征图尺寸和计算量，同时增加平移不变性。", difficulty: 2 },
  { id: "q-dl-rnn-1", knowledgeId: "dl-rnn", type: "single", question: "LSTM 解决了 RNN 的什么问题？", options: ["过拟合", "梯度消失/爆炸", "计算复杂度", "内存不足"], correctAnswer: 1, explanation: "LSTM 通过门控机制解决了 RNN 的梯度消失和梯度爆炸问题。", difficulty: 2 },
  { id: "q-dl-transformer-1", knowledgeId: "dl-transformer", type: "single", question: "Transformer 的核心创新是什么？", options: ["卷积操作", "自注意力机制", "循环结构", "池化操作"], correctAnswer: 1, explanation: "Transformer 的核心是自注意力机制，可以并行计算序列中任意位置的依赖关系。", difficulty: 2 },
  { id: "q-dl-transformer-2", knowledgeId: "dl-transformer", type: "multiple", question: "Transformer 包含哪些关键组件？", options: ["自注意力", "位置编码", "前馈网络", "卷积层"], correctAnswer: [0, 1, 2], explanation: "Transformer 包含自注意力、位置编码、前馈网络等组件，不包含卷积层。", difficulty: 3 },

  // 第六章 大模型与多智能体
  { id: "q-llm-pretrain-1", knowledgeId: "llm-pretrain", type: "single", question: "SFT（监督微调）在大模型训练流程中的作用是？", options: ["预训练", "对齐人类偏好", "增强推理能力", "减少参数量"], correctAnswer: 1, explanation: "SFT 通过标注数据微调预训练模型，使其输出与人类偏好对齐。", difficulty: 2 },
  { id: "q-llm-rag-1", knowledgeId: "llm-rag", type: "single", question: "RAG 的主要目的是什么？", options: ["加速训练", "增强模型的知识时效性和准确性", "减少推理延迟", "增加模型参数"], correctAnswer: 1, explanation: "RAG 通过检索外部知识增强模型回答的准确性和时效性。", difficulty: 2 },
  { id: "q-llm-agent-1", knowledgeId: "llm-agent", type: "single", question: "ReAct 框架的核心思想是？", options: ["纯推理", "推理与行动交替", "纯行动", "监督学习"], correctAnswer: 1, explanation: "ReAct 通过推理（Reason）和行动（Act）交替进行，让模型逐步解决问题。", difficulty: 2 },
];

export const getQuizByKnowledgeId = (knowledgeId: string): QuizQuestion[] =>
  quizQuestions.filter((q) => q.knowledgeId === knowledgeId);

// 对话引导剧本（首次进入）
export const onboardingScript = [
  {
    agent: "captain" as const,
    text: "你好呀，我是灵境，你的专属 AI 学习队长。在正式为你启动学习之前，我想先简单地认识你一下——你目前的专业和年级是？",
  },
  {
    user: "我是人工智能专业大三学生，目标是考研深造大模型方向。",
  },
  {
    agent: "captain" as const,
    text: "很棒的方向！大模型这条路既需要扎实的数学与深度学习基础，也考验工程能力。你目前高数、线代、概率的自评大概在什么水平？",
  },
  {
    user: "高数 78、线代 65、概率 72，Python 还算熟练。",
  },
  {
    agent: "captain" as const,
    text: "了解了，基础很扎实。学习方式上，你更偏好看图解、听讲解、读文字，还是直接动手敲代码？或者几种混合？",
  },
  {
    user: "我比较喜欢图解 + 代码实操，纯公式推导容易走神。",
  },
  {
    agent: "captain" as const,
    text: "明白，视觉+实践型学习者。我再问你两个问题：你过去学习 AI 时最容易在哪类知识点上栽跟头？你希望我们这次学习节奏是冲刺型还是稳健型？",
  },
  {
    user: "梯度爆炸/消失这块老搞混，动态规划边界也容易漏。节奏上希望稳健一些，每天 1-2 小时。",
  },
  {
    agent: "captain" as const,
    text: "好的，信息已经齐全。我正在为你构建 6 维学习画像，并预生成首条学习路径。请稍候——你的专属智能体编队即将就位。",
  },
];

// 评估维度（5 维）
export const assessmentDimensions = [
  { name: "掌握度", score: 78, benchmark: 75 },
  { name: "熟练度", score: 72, benchmark: 70 },
  { name: "迁移力", score: 68, benchmark: 65 },
  { name: "坚持度", score: 86, benchmark: 70 },
  { name: "创新力", score: 74, benchmark: 65 },
];
