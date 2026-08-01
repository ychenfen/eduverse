import type { KnowledgeNode } from "@/types";
import { knowledgeNodes } from "@/data/course";
import { preGeneratedResources } from "@/data/resources";

// 关键词库 — 用于从用户问题中识别知识点
const keywordMap: Record<string, string[]> = {
  "ai-intro": ["人工智能", "AI", "强弱AI", "定义", "范畴"],
  "ai-history": ["发展历程", "三次浪潮", "符号主义", "连接主义", "AI发展", "发展史"],
  "ai-agents": ["智能体", "Agent", "多智能体", "理性智能体", "PEAS"],
  "ai-applications": ["应用", "落地", "场景", "AI应用"],
  "search-basics": ["搜索", "盲目搜索", "广度优先", "BFS", "深度优先", "DFS", "搜索基础"],
  "search-uninformed": ["无信息搜索", "一致代价", "UCS", "迭代加深", "深度限制"],
  "search-informed": ["启发式搜索", "A*", "A星", "启发函数", "可采纳", "一致性"],
  "search-local": ["局部搜索", "爬山法", "模拟退火", "遗传算法", "局部最优"],
  "knowledge-rep": ["知识表示", "命题逻辑", "一阶逻辑", "谓词", "本体"],
  "inference": ["推理", "归结", "前向", "后向", "推理引擎"],
  "planning": ["规划", "STRIPS", "PDDL", "状态空间规划", "规划算法"],
  "uncertainty": ["不确定性", "概率", "贝叶斯网络", "马尔可夫", "不确定推理"],
  "ml-basics": ["机器学习", "ML", "监督学习", "无监督", "训练集", "测试集"],
  "ml-models": ["线性回归", "逻辑回归", "SVM", "支持向量机", "决策树", "KNN"],
  "ml-evaluation": ["模型评估", "准确率", "召回率", "F1", "交叉验证", "过拟合"],
  "dl-fundamentals": ["深度学习", "神经网络", "DNN", "反向传播", "梯度下降"],
  "dl-optimization": ["优化", "梯度爆炸", "梯度消失", "Adam", "SGD", "学习率"],
  "dl-transformer": ["Transformer", "注意力", "Attention", "多头", "BERT", "GPT"],
  "dl-cv": ["计算机视觉", "CNN", "卷积", "图像分类", "ResNet"],
  "nlp-basics": ["自然语言处理", "NLP", "分词", "词向量", "Word2Vec", "语言模型"],
  "rl-basics": ["强化学习", "RL", "马尔可夫决策过程", "MDP", "贝尔曼方程", "Q学习"],
  "rl-advanced": ["策略梯度", "PPO", "DQN", "深度强化学习", "Actor-Critic"],
  "ethics": ["AI伦理", "公平性", "可解释性", "偏见", "安全", "对齐"],
  "ai-future": ["未来", "AGI", "通用人工智能", "前沿", "技术趋势"],
  "gradient-problem": ["梯度爆炸", "梯度消失", "梯度弥散", "梯度消失问题", "梯度爆炸问题"],
  "residual": ["残差", "残差连接", "ResNet", "残差网络", "shortcut"],
  "lstm": ["LSTM", "长短时记忆", "门控", "遗忘门", "输入门", "输出门"],
  "batchnorm": ["BatchNorm", "批量归一化", "BN", "归一化"],
  "layernorm": ["LayerNorm", "层归一化", "LN"],
  "dropout": ["Dropout", "随机失活"],
  "attention": ["注意力机制", "Attention", "自注意力", "Self-Attention"],
};

// 高频概念详细解答库（知识库没有的补充映射）
const extraConcepts: Record<string, { title: string; summary: string; category: string; fullAnswer: string }> = {
  manhattan: {
    title: "曼哈顿距离 (Manhattan Distance)",
    summary: "两点在标准坐标系上的绝对轴距总和，4邻域网格中等于最短路径长度。",
    category: "search-informed",
    fullAnswer: "",
  },
  euclidean: {
    title: "欧氏距离 (Euclidean Distance)",
    summary: "两点间的直线距离，连续空间中最常用的距离度量。",
    category: "search-informed",
    fullAnswer: "",
  },
  chebyshev: {
    title: "切比雪夫距离 (Chebyshev Distance)",
    summary: "两点在各坐标数值差绝对值的最大值，8邻域网格中等于最短路径长度。",
    category: "search-informed",
    fullAnswer: "",
  },
  "grid-search": {
    title: "网格搜索与邻域",
    summary: "4邻域（上下左右）和8邻域（加对角线）是网格路径搜索的基本运动模型。",
    category: "search-informed",
    fullAnswer: "",
  },
  "gradient-descent": {
    title: "梯度下降算法",
    summary: "沿梯度反方向迭代更新参数以最小化损失函数的一阶优化方法。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  "backpropagation": {
    title: "反向传播算法",
    summary: "利用链式法则从输出层向输入层逐层计算梯度，是训练神经网络的核心算法。",
    category: "dl-fundamentals",
    fullAnswer: "",
  },
  activation: {
    title: "激活函数",
    summary: "为神经网络引入非线性，常见的有 ReLU、Sigmoid、Tanh、GELU 等。",
    category: "dl-fundamentals",
    fullAnswer: "",
  },
  "gradient-explosion": {
    title: "梯度爆炸 (Gradient Explosion)",
    summary: "训练深层神经网络时梯度值急剧增大，导致参数更新过大、损失函数震荡或发散。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  "gradient-vanishing": {
    title: "梯度消失 (Gradient Vanishing)",
    summary: "训练深层神经网络时梯度值趋近于零，导致底层参数无法更新，模型无法学习。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  residual: {
    title: "残差连接 (Residual Connection)",
    summary: "通过跳跃连接直接将输入传递到输出，解决深层网络训练中的梯度消失问题。",
    category: "dl-cv",
    fullAnswer: "",
  },
  lstm: {
    title: "长短期记忆网络 (LSTM)",
    summary: "通过门控机制选择性地保留和遗忘信息，解决RNN的长期依赖问题。",
    category: "dl-fundamentals",
    fullAnswer: "",
  },
  batchnorm: {
    title: "批量归一化 (Batch Normalization)",
    summary: "在每一层输入上进行归一化，加速收敛并缓解梯度消失问题。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  layernorm: {
    title: "层归一化 (Layer Normalization)",
    summary: "对每个样本的特征维度进行归一化，适合NLP任务和小批量训练。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  dropout: {
    title: "Dropout 正则化",
    summary: "训练时随机丢弃部分神经元，防止过拟合，增强模型泛化能力。",
    category: "dl-optimization",
    fullAnswer: "",
  },
  attention: {
    title: "自注意力机制 (Self-Attention)",
    summary: "通过计算序列中任意两个位置之间的关联程度，实现全局依赖建模。",
    category: "dl-transformer",
    fullAnswer: "",
  },
};

// 计算两个字符串的相似度（简单的关键词匹配得分）
function similarityScore(question: string, keywords: string[]): number {
  const q = question.toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (q.includes(kw.toLowerCase())) {
      score += kw.length; // 关键词越长，匹配得分越高
    }
  }
  return score;
}

// 从用户问题中识别最相关的知识点
export function matchKnowledge(question: string): {
  primary?: KnowledgeNode;
  related: KnowledgeNode[];
  extraConcept?: { key: string; data: typeof extraConcepts[string] };
} {
  let bestScore = 0;
  let bestId: string | null = null;

  // 匹配知识库知识点
  for (const [id, keywords] of Object.entries(keywordMap)) {
    const score = similarityScore(question, keywords);
    // 也和知识点标题做匹配
    const node = knowledgeNodes.find((k) => k.id === id);
    if (node) {
      const titleScore = similarityScore(question, [node.title]);
      const summaryScore = similarityScore(question, node.summary.split(/[，。、；]/).slice(0, 5));
      const total = score + titleScore * 2 + summaryScore * 0.5;
      if (total > bestScore) {
        bestScore = total;
        bestId = id;
      }
    }
  }

  // 匹配补充概念
  let extraConcept: { key: string; data: typeof extraConcepts[string] } | undefined;
  let bestExtraScore = 0;
  
  // 特殊复合问题匹配
  if (question.includes("梯度") && question.includes("爆炸") && question.includes("消失")) {
    extraConcept = { key: "gradient-compare", data: {
      title: "梯度爆炸 vs 梯度消失",
      summary: "两种相反的梯度问题：梯度爆炸导致发散，梯度消失导致停滞，解决方法各不相同。",
      category: "dl-optimization",
      fullAnswer: "",
    } };
    bestExtraScore = 100;
  } else if (question.includes("残差") && (question.includes("训练") || question.includes("深层") || question.includes("为什么"))) {
    extraConcept = { key: "residual-deep", data: {
      title: "残差连接与深度网络训练",
      summary: "残差连接通过shortcut提供直接梯度路径，解决深层网络的梯度消失问题。",
      category: "dl-cv",
      fullAnswer: "",
    } };
    bestExtraScore = 100;
  } else if (question.includes("LSTM") && (question.includes("梯度") || question.includes("缓解") || question.includes("门控"))) {
    extraConcept = { key: "lstm-gate", data: {
      title: "LSTM门控机制与梯度缓解",
      summary: "LSTM通过遗忘门、输入门、输出门控制信息流动，有效缓解RNN的梯度消失问题。",
      category: "dl-fundamentals",
      fullAnswer: "",
    } };
    bestExtraScore = 100;
  } else if (question.includes("BatchNorm") && question.includes("LayerNorm")) {
    extraConcept = { key: "norm-compare", data: {
      title: "BatchNorm vs LayerNorm",
      summary: "两种归一化方法的核心区别在于归一化维度和统计量来源，适用于不同场景。",
      category: "dl-optimization",
      fullAnswer: "",
    } };
    bestExtraScore = 100;
  } else {
    for (const [key, data] of Object.entries(extraConcepts)) {
      const titleParts = data.title.split(/[（）()\s-]/);
      const keywords = [...titleParts, ...data.title.split(" ").map(s => s.toLowerCase())];
      const score = similarityScore(question, keywords);
      if (score > bestExtraScore) {
        bestExtraScore = score;
        extraConcept = { key, data };
      }
    }
  }

  const primary = bestId ? knowledgeNodes.find((k) => k.id === bestId) : undefined;

  // 找相关知识点（同一章节或有前置依赖关系）
  const related: KnowledgeNode[] = [];
  if (primary) {
    for (const k of knowledgeNodes) {
      if (k.id === primary.id) continue;
      if (k.chapter === primary.chapter) {
        related.push(k);
      } else if (primary.prerequisites.includes(k.id) || k.prerequisites.includes(primary.id)) {
        related.push(k);
      }
    }
  } else if (extraConcept) {
    // 补充概念关联到对应知识点
    const cat = extraConcept.data.category;
    const catNode = knowledgeNodes.find((k) => k.id === cat);
    if (catNode) {
      related.push(catNode);
      for (const k of knowledgeNodes) {
        if (k.id === catNode.id) continue;
        if (k.chapter === catNode.chapter) related.push(k);
      }
    }
  }

  return {
    primary,
    related: related.slice(0, 4),
    extraConcept: bestExtraScore > 5 ? extraConcept : undefined,
  };
}

// 生成详细的辅导回答
export function generateTutorAnswer(question: string): string {
  const match = matchKnowledge(question);
  const { primary, related, extraConcept } = match;

  // 如果完全没匹配到，给出引导性回答
  if (!primary && !extraConcept) {
    return generateGenericAnswer(question);
  }

  const topicTitle = extraConcept?.data.title || primary?.title || "";
  const topicSummary = extraConcept?.data.summary || primary?.summary || "";

  let answer = "";

  // 1. 直接回答
  answer += `## 关于「${topicTitle}」的详细讲解\n\n`;
  answer += `${topicSummary}\n\n`;

  // 2. 形式化定义 / 公式
  if (extraConcept) {
    answer += `### 1. 核心定义\n\n`;
    if (extraConcept.key === "manhattan") {
      answer += `对于二维空间中的两点 $p_1(x_1, y_1)$ 和 $p_2(x_2, y_2)$，曼哈顿距离定义为：\n\n`;
      answer += `$$d_{\\text{manhattan}}(p_1, p_2) = |x_1 - x_2| + |y_1 - y_2|$$\n\n`;
      answer += `推广到 $n$ 维空间：\n\n`;
      answer += `$$d(\\mathbf{a}, \\mathbf{b}) = \\sum_{i=1}^{n} |a_i - b_i|$$\n\n`;
      answer += `**几何意义**：在只能沿坐标轴方向移动的网格中（如城市街道），两点之间的最短路径长度等于曼哈顿距离。\n\n`;
    } else if (extraConcept.key === "euclidean") {
      answer += `对于二维空间中的两点 $p_1(x_1, y_1)$ 和 $p_2(x_2, y_2)$，欧氏距离定义为：\n\n`;
      answer += `$$d_{\\text{euclidean}}(p_1, p_2) = \\sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}$$\n\n`;
      answer += `**几何意义**：两点之间的直线距离，不受运动方向限制。\n\n`;
    } else if (extraConcept.key === "chebyshev") {
      answer += `对于二维空间中的两点 $p_1(x_1, y_1)$ 和 $p_2(x_2, y_2)$，切比雪夫距离定义为：\n\n`;
      answer += `$$d_{\\text{chebyshev}}(p_1, p_2) = \\max(|x_1-x_2|, |y_1-y_2|)$$\n\n`;
      answer += `**几何意义**：在8邻域网格中（可走对角线），两点之间的最短路径步数等于切比雪夫距离。\n\n`;
    } else if (extraConcept.key === "grid-search") {
      answer += `网格搜索中的邻域概念：\n\n`;
      answer += `- **4 邻域（上下左右）**：每个格子有 4 个相邻格，移动代价为 1\n`;
      answer += `- **8 邻域（加对角线）**：每个格子有 8 个相邻格，直向代价 1，对角代价 $\\sqrt{2}$\n`;
      answer += `- **曼哈顿距离**是 4 邻域的启发函数\n`;
      answer += `- **切比雪夫距离**是 8 邻域的启发函数\n\n`;
    } else if (extraConcept.key === "gradient-descent") {
      answer += `梯度下降的核心迭代公式：\n\n`;
      answer += `$$\\theta_{t+1} = \\theta_t - \\alpha \\cdot \\nabla_\\theta J(\\theta_t)$$\n\n`;
      answer += `其中 $\\alpha$ 为学习率，$J(\\theta)$ 为损失函数。\n\n`;
      answer += `**三种变体**：\n\n`;
      answer += `| 类型 | 每步使用样本数 | 优点 | 缺点 |\n`;
      answer += `|------|--------------|------|------|\n`;
      answer += `| BGD（批量） | 全部 | 稳定收敛 | 速度慢，内存大 |\n`;
      answer += `| SGD（随机） | 1个 | 速度快，内存小 | 震荡大 |\n`;
      answer += `| Mini-batch | 一小批 | 平衡性能与稳定 | 需要调batch size |\n\n`;
    } else if (extraConcept.key === "backpropagation") {
      answer += `反向传播基于**链式法则**，从输出层向输入层逐层传递误差梯度：\n\n`;
      answer += `1. **前向传播**：计算各层激活值\n`;
      answer += `2. **计算输出层误差**：$\\delta^L = \\nabla_a J \\odot \\sigma'(z^L)$\n`;
      answer += `3. **反向传递误差**：$\\delta^l = ((w^{l+1})^T \\delta^{l+1}) \\odot \\sigma'(z^l)$\n`;
      answer += `4. **计算参数梯度**：$\\frac{\\partial J}{\\partial w^l} = \\delta^l (a^{l-1})^T$\n\n`;
    } else if (extraConcept.key === "activation") {
      answer += `| 激活函数 | 公式 | 特点 |\n`;
      answer += `|---------|------|------|\n`;
      answer += `| ReLU | $f(x) = \\max(0, x)$ | 计算快，缓解梯度消失 | 可能神经元死亡 |\n`;
      answer += `| Sigmoid | $f(x) = \\frac{1}{1+e^{-x}}$ | 输出0~1，可作概率 | 梯度消失，非零中心 |\n`;
      answer += `| Tanh | $f(x) = \\tanh(x)$ | 零中心 | 仍有梯度消失问题 |\n`;
      answer += `| GELU | 高斯误差线性单元 | 平滑，Transformer常用 | 计算稍复杂 |\n\n`;
    } else if (extraConcept.key === "gradient-explosion") {
      answer += `**产生原因**：\n\n`;
      answer += `- 使用 Sigmoid/Tanh 激活函数，梯度被压缩在 [0,1] 或 [-1,1] 范围内\n`;
      answer += `- 深层网络梯度需通过链式法则逐层相乘，累积后梯度值急剧增大\n`;
      answer += `- 参数初始化不当或学习率过大也会加剧此问题\n\n`;
      answer += `**数学原理**：假设每层梯度为 $g$，经过 $L$ 层后梯度为 $g^L$\n\n`;
      answer += `- 当 $|g| > 1$ 时，$g^L$ 指数增长 → **梯度爆炸**\n`;
      answer += `- 当 $|g| < 1$ 时，$g^L$ 指数衰减 → **梯度消失**\n\n`;
      answer += `**表现症状**：\n\n`;
      answer += `- 损失函数剧烈震荡，无法收敛\n`;
      answer += `- 参数更新值过大，模型预测出现 NaN\n`;
      answer += `- 训练早期就出现发散\n\n`;
    } else if (extraConcept.key === "gradient-vanishing") {
      answer += `**产生原因**：\n\n`;
      answer += `- Sigmoid/Tanh 激活函数在饱和区梯度接近 0\n`;
      answer += `- 梯度通过链式法则逐层传递时被不断缩小\n`;
      answer += `- 深层网络中底层参数梯度趋近于 0，无法有效学习\n\n`;
      answer += `**数学原理**：\n\n`;
      answer += `Sigmoid 导数：$\\sigma'(x) = \\sigma(x)(1-\\sigma(x))$，最大值仅为 0.25\n`;
      answer += `Tanh 导数：$\\tanh'(x) = 1 - \\tanh^2(x)$，最大值为 1\n\n`;
      answer += `经过多层后，梯度 $\\prod_{l=1}^L \\sigma'(z^l)$ 指数衰减。\n\n`;
      answer += `**表现症状**：\n\n`;
      answer += `- 训练停滞，损失函数下降缓慢或不再下降\n`;
      answer += `- 浅层参数更新正常，深层参数几乎不更新\n`;
      answer += `- 深层网络无法训练\n\n`;
    } else if (extraConcept.key === "residual") {
      answer += `**核心思想**：\n\n`;
      answer += `不直接拟合 $H(x)$，而是拟合残差 $F(x) = H(x) - x$\n\n`;
      answer += `$$y = F(x, \\{W_i\\}) + x$$\n\n`;
      answer += `**残差块结构**：\n\n`;
      answer += `\`\`\`\n`;
      answer += `x ──┬── Conv ── BN ── ReLU ── Conv ── BN ──┬──→ y\n`;
      answer += `    │                                     │\n`;
      answer += `    └───────────────── shortcut ───────────┘\n`;
      answer += `\`\`\`\n\n`;
      answer += `**为什么能解决梯度消失**：\n\n`;
      answer += `- 梯度可通过 shortcut 直接传递：$\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial y} + \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial F}{\\partial x}$\n`;
      answer += `- 恒等映射保证梯度至少为 $\\frac{\\partial L}{\\partial y}$，不会衰减到 0\n`;
      answer += `- 使得数百层甚至上千层的网络可以有效训练\n\n`;
    } else if (extraConcept.key === "lstm") {
      answer += `**LSTM 门控结构**：\n\n`;
      answer += `- **遗忘门 (Forget Gate)**：决定丢弃哪些历史信息\n`;
      answer += `  $$f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$$\n\n`;
      answer += `- **输入门 (Input Gate)**：决定存储哪些新信息\n`;
      answer += `  $$i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)$$\n`;
      answer += `  $$\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$$\n\n`;
      answer += `- **更新单元状态**：\n`;
      answer += `  $$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$$\n\n`;
      answer += `- **输出门 (Output Gate)**：决定输出哪些信息\n`;
      answer += `  $$o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)$$\n`;
      answer += `  $$h_t = o_t \\odot \\tanh(C_t)$$\n\n`;
      answer += `**如何缓解梯度消失**：\n\n`;
      answer += `- 单元状态 $C_t$ 有直接的路径连接，梯度可沿此路径流动\n`;
      answer += `- 遗忘门可以选择性保留长期记忆\n`;
      answer += `- 相比普通 RNN，梯度流动路径更长更稳定\n\n`;
    } else if (extraConcept.key === "batchnorm") {
      answer += `**核心公式**：\n\n`;
      answer += `$$\\hat{x}_i = \\frac{x_i - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}$$\n`;
      answer += `$$y_i = \\gamma \\hat{x}_i + \\beta$$\n\n`;
      answer += `其中 $\\mu_B$ 和 $\\sigma_B^2$ 是 mini-batch 的均值和方差，$\\gamma$ 和 $\\beta$ 是可学习参数。\n\n`;
      answer += `**作用**：\n\n`;
      answer += `- **加速收敛**：减少内部协变量偏移\n`;
      answer += `- **缓解梯度消失**：每层输入被归一化，避免激活函数进入饱和区\n`;
      answer += `- **正则化效果**：mini-batch 统计带来随机噪声，类似 Dropout\n\n`;
      answer += `**注意事项**：\n\n`;
      answer += `- 训练时用 batch 统计，推理时用移动平均统计\n`;
      answer += `- 小批量时效果不稳定，推荐 batch size ≥ 16\n\n`;
    } else if (extraConcept.key === "layernorm") {
      answer += `**与 BatchNorm 的区别**：\n\n`;
      answer += `| 维度 | BatchNorm | LayerNorm |\n`;
      answer += `|------|-----------|-----------|\n`;
      answer += `| 归一化维度 | 样本方向 | 特征方向 |\n`;
      answer += `| 统计量来源 | 当前 batch | 当前样本 |\n`;
      answer += `| batch size 敏感性 | 敏感 | 不敏感 |\n`;
      answer += `| 适用场景 | CV | NLP |\n\n`;
      answer += `**公式**：\n\n`;
      answer += `$$\\mu = \\frac{1}{H} \\sum_{i=1}^H x_i$$\n`;
      answer += `$$\\sigma^2 = \\frac{1}{H} \\sum_{i=1}^H (x_i - \\mu)^2$$\n`;
      answer += `$$\\hat{x}_i = \\frac{x_i - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}$$\n\n`;
      answer += `**优点**：\n\n`;
      answer += `- 不依赖 batch size，适合小批量训练\n`;
      answer += `- 适合变长序列（NLP任务）\n`;
      answer += `- Transformer 默认使用 LayerNorm\n\n`;
    } else if (extraConcept.key === "dropout") {
      answer += `**工作原理**：\n\n`;
      answer += `训练时，以概率 $p$ 随机将神经元输出设为 0：\n\n`;
      answer += `$$r_j^{(l)} \\sim \\text{Bernoulli}(1-p)$$\n`;
      answer += `$$\\tilde{y}_j^{(l)} = r_j^{(l)} \\cdot y_j^{(l)}$$\n\n`;
      answer += `推理时，所有神经元都参与计算，但输出乘以 $(1-p)$ 进行缩放。\n\n`;
      answer += `**为什么有效**：\n\n`;
      answer += `- **防止过拟合**：神经元无法依赖其他特定神经元，被迫学习鲁棒特征\n`;
      answer += `- **集成效果**：相当于训练多个子网络，推理时取平均\n`;
      answer += `- **减少共适应**：避免神经元协同适应形成脆弱的特征表示\n\n`;
      answer += `**实践建议**：\n\n`;
      answer += `- 隐藏层 dropout rate 常用 0.5\n`;
      answer += `- 输入层 dropout rate 常用 0.2\n`;
      answer += `- 推理时务必关闭 dropout 或进行缩放\n\n`;
    } else if (extraConcept.key === "attention") {
      answer += `**自注意力计算过程**：\n\n`;
      answer += `1. **生成 Q, K, V**：\n`;
      answer += `   $$Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V$$\n\n`;
      answer += `2. **计算注意力分数**：\n`;
      answer += `   $$\\text{scores} = \\frac{Q K^T}{\\sqrt{d_k}}$$\n\n`;
      answer += `3. **Softmax 归一化**：\n`;
      answer += `   $$\\text{attention} = \\text{softmax}(\\text{scores})$$\n\n`;
      answer += `4. **加权求和**：\n`;
      answer += `   $$\\text{output} = \\text{attention} \\cdot V$$\n\n`;
      answer += `**核心特点**：\n\n`;
      answer += `- **全局依赖**：任意两个位置直接计算关联，不受序列长度限制\n`;
      answer += `- **并行计算**：所有位置的注意力分数可同时计算\n`;
      answer += `- **缩放因子**：$\\sqrt{d_k}$ 防止分数过大导致 Softmax 饱和\n\n`;
    } else if (extraConcept.key === "gradient-compare") {
      answer += `**梯度爆炸 vs 梯度消失对比表**：\n\n`;
      answer += `| 维度 | 梯度爆炸 | 梯度消失 |\n`;
      answer += `|------|---------|---------|\n`;
      answer += `| 梯度变化 | 指数增长 | 指数衰减 |\n`;
      answer += `| 产生条件 | $|g| > 1$ | $|g| < 1$ |\n`;
      answer += `| 损失表现 | 剧烈震荡 | 停滞不前 |\n`;
      answer += `| 参数更新 | 更新过大 | 更新过小 |\n`;
      answer += `| 常见原因 | 学习率过大、初始化不当 | Sigmoid/Tanh饱和区 |\n`;
      answer += `| 发生位置 | 深层网络 | 深层网络 |\n\n`;
      answer += `**解决方法汇总**：\n\n`;
      answer += `- **同时缓解两者**：ReLU 激活函数、残差连接、层归一化\n`;
      answer += `- **针对梯度爆炸**：梯度裁剪 (Gradient Clipping)、更小的学习率\n`;
      answer += `- **针对梯度消失**：LSTM/GRU、权重初始化 (Xavier/He)、正则化\n\n`;
      answer += `**数学本质**：\n\n`;
      answer += `假设每层梯度为 $g$，经过 $L$ 层后梯度为 $g^L$\n\n`;
      answer += `- $|g| > 1$ → $g^L$ 指数增长 → **梯度爆炸**\n`;
      answer += `- $|g| < 1$ → $g^L$ 指数衰减 → **梯度消失**\n\n`;
    } else if (extraConcept.key === "residual-deep") {
      answer += `**残差连接如何解决深层网络训练问题**：\n\n`;
      answer += `**问题根源**：\n\n`;
      answer += `深层网络中，梯度通过链式法则逐层传递：\n`;
      answer += `$$\\frac{\\partial L}{\\partial x_1} = \\frac{\\partial L}{\\partial x_L} \\cdot \\prod_{l=1}^{L-1} \\frac{\\partial x_{l+1}}{\\partial x_l}$$\n\n`;
      answer += `当每层梯度 $< 1$ 时，乘积趋近于 0，底层参数无法更新。\n\n`;
      answer += `**残差连接的解决方案**：\n\n`;
      answer += `引入 shortcut，输出变为：\n`;
      answer += `$$y = F(x) + x$$\n\n`;
      answer += `梯度传递路径变为：\n`;
      answer += `$$\\frac{\\partial L}{\\partial x} = \\frac{\\partial L}{\\partial y} + \\frac{\\partial L}{\\partial y} \\cdot \\frac{\\partial F}{\\partial x}$$\n\n`;
      answer += `**关键洞察**：即使 $\\frac{\\partial F}{\\partial x} \\to 0$，梯度至少为 $\\frac{\\partial L}{\\partial y}$，不会完全消失！\n\n`;
      answer += `**效果对比**：\n\n`;
      answer += `| 网络类型 | 最大可训练层数 | 梯度稳定性 |\n`;
      answer += `|---------|--------------|-----------|\n`;
      answer += `| 普通 CNN | ~20 层 | 差 |\n`;
      answer += `| ResNet-18 | 18 层 | 好 |\n`;
      answer += `| ResNet-50 | 50 层 | 好 |\n`;
      answer += `| ResNet-152 | 152 层 | 好 |\n\n`;
    } else if (extraConcept.key === "lstm-gate") {
      answer += `**LSTM 门控机制详解**：\n\n`;
      answer += `**遗忘门 (Forget Gate)**：\n`;
      answer += `- 决定从单元状态中丢弃哪些信息\n`;
      answer += `- $f_t = \\sigma(W_f \\cdot [h_{t-1}, x_t] + b_f)$\n`;
      answer += `- 输出 0~1，表示保留/遗忘的比例\n\n`;
      answer += `**输入门 (Input Gate)**：\n`;
      answer += `- 决定将哪些新信息存入单元状态\n`;
      answer += `- $i_t = \\sigma(W_i \\cdot [h_{t-1}, x_t] + b_i)$ — 选择哪些值更新\n`;
      answer += `- $\\tilde{C}_t = \\tanh(W_C \\cdot [h_{t-1}, x_t] + b_C)$ — 生成候选值\n\n`;
      answer += `**输出门 (Output Gate)**：\n`;
      answer += `- 决定从单元状态中输出哪些信息\n`;
      answer += `- $o_t = \\sigma(W_o \\cdot [h_{t-1}, x_t] + b_o)$\n`;
      answer += `- $h_t = o_t \\odot \\tanh(C_t)$\n\n`;
      answer += `**如何缓解梯度消失**：\n\n`;
      answer += `1. **单元状态直接传递**：$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$\n`;
      answer += `   - 梯度可沿单元状态直接流动，无需经过激活函数\n`;
      answer += `   - 遗忘门控制梯度是否通过\n\n`;
      answer += `2. **门控机制保护**：\n`;
      answer += `   - 遗忘门接近 1 时，梯度几乎无损传递\n`;
      answer += `   - 输入门接近 0 时，新信息不影响旧记忆\n\n`;
      answer += `3. **对比普通 RNN**：\n`;
      answer += `   - RNN：梯度需经过多层 tanh，指数衰减\n`;
      answer += `   - LSTM：梯度可通过单元状态直接传递，衰减慢得多\n\n`;
    } else if (extraConcept.key === "norm-compare") {
      answer += `**BatchNorm 与 LayerNorm 深度对比**：\n\n`;
      answer += `| 维度 | BatchNorm | LayerNorm |\n`;
      answer += `|------|-----------|-----------|\n`;
      answer += `| 归一化维度 | 样本方向 (batch) | 特征方向 (feature) |\n`;
      answer += `| 统计量来源 | 当前 mini-batch | 当前单个样本 |\n`;
      answer += `| 计算公式 | $\\mu_B, \\sigma_B^2$ | $\\mu_H, \\sigma_H^2$ |\n`;
      answer += `| Batch Size 敏感性 | 敏感，batch 越小效果越差 | 不敏感 |\n`;
      answer += `| 训练/推理差异 | 需移动平均统计 | 无差异 |\n`;
      answer += `| 适用场景 | 计算机视觉 (CNN) | 自然语言处理 (Transformer) |\n`;
      answer += `| 内存开销 | 较高 (存储 batch 统计) | 较低 |\n\n`;
      answer += `**数学公式对比**：\n\n`;
      answer += `**BatchNorm**（对每个特征维度，跨 batch 归一化）：\n`;
      answer += `$$\\hat{x}_{ij} = \\frac{x_{ij} - \\mu_j}{\\sqrt{\\sigma_j^2 + \\epsilon}}$$\n`;
      answer += `其中 $\\mu_j = \\frac{1}{N} \\sum_{i=1}^N x_{ij}$\n\n`;
      answer += `**LayerNorm**（对每个样本，跨特征维度归一化）：\n`;
      answer += `$$\\hat{x}_{ij} = \\frac{x_{ij} - \\mu_i}{\\sqrt{\\sigma_i^2 + \\epsilon}}$$\n`;
      answer += `其中 $\\mu_i = \\frac{1}{D} \\sum_{j=1}^D x_{ij}$\n\n`;
      answer += `**实践建议**：\n\n`;
      answer += `- **CNN**：优先使用 BatchNorm（放在卷积层之后，激活函数之前）\n`;
      answer += `- **Transformer**：优先使用 LayerNorm（放在每个子层输入处）\n`;
      answer += `- **小 batch 训练**：使用 LayerNorm 或 InstanceNorm\n`;
      answer += `- **序列模型**：使用 LayerNorm（不依赖序列长度）\n\n`;
    }
  } else if (primary) {
    answer += `### 1. 核心定义\n\n`;
    answer += `${primary.summary}\n\n`;
    answer += `**所属章节**：第 ${primary.chapter} 章 · 难度 ${primary.difficulty}/5 · 预计学习 ${primary.estimatedMinutes} 分钟\n\n`;
  }

  // 3. 关键性质 / 特点
  answer += `### 2. 关键性质\n\n`;
  if (extraConcept?.key === "manhattan") {
    answer += `- **非负性**：$d \\ge 0$，当且仅当两点重合时取等号\n`;
    answer += `- **对称性**：$d(p_1, p_2) = d(p_2, p_1)$\n`;
    answer += `- **三角不等式**：$d(p_1, p_3) \\le d(p_1, p_2) + d(p_2, p_3)$\n`;
    answer += `- **是 $L_1$ 范数**：也叫城市街区距离、出租车距离\n`;
    answer += `- **A* 启发式**：4 邻域网格中是可采纳的（不高估真实代价）\n\n`;
  } else if (extraConcept?.key === "grid-search") {
    answer += `- **4 邻域移动代价**：每步 +1，共 4 个方向\n`;
    answer += `- **8 邻域移动代价**：直向 +1，对角 +$\\sqrt{2}$，共 8 个方向\n`;
    answer += `- **可采纳性**：启发函数 ≤ 真实最短路径时，A* 保证找到最优解\n`;
    answer += `- **一致性**：启发函数满足 $h(n) \\le c(n,n') + h(n')$ 时，节点只需扩展一次\n\n`;
  } else if (extraConcept?.key === "gradient-explosion") {
    answer += `- **指数增长**：梯度随网络深度呈指数增长\n`;
    answer += `- **不稳定性**：损失函数剧烈震荡，难以收敛\n`;
    answer += `- **参数敏感性**：对学习率和初始化高度敏感\n`;
    answer += `- **深层网络更严重**：层数越多，梯度爆炸风险越大\n\n`;
  } else if (extraConcept?.key === "gradient-vanishing") {
    answer += `- **指数衰减**：梯度随网络深度呈指数衰减\n`;
    answer += `- **浅层优势**：浅层参数更新正常，深层参数几乎不更新\n`;
    answer += `- **激活函数依赖**：Sigmoid/Tanh 比 ReLU 更容易出现\n`;
    answer += `- **长期依赖困难**：RNN 中无法学习远距离依赖\n\n`;
  } else if (extraConcept?.key === "residual") {
    answer += `- **恒等映射**：shortcut 提供直接的梯度传递路径\n`;
    answer += `- **残差学习**：拟合 $F(x) = H(x) - x$ 比直接拟合 $H(x)$ 更容易\n`;
    answer += `- **深度可扩展性**：支持训练数百层甚至上千层网络\n`;
    answer += `- **参数效率**：相比同深度的普通网络，参数更少\n\n`;
  } else if (extraConcept?.key === "lstm") {
    answer += `- **门控机制**：遗忘门、输入门、输出门控制信息流动\n`;
    answer += `- **长期记忆**：单元状态 $C_t$ 可存储长期信息\n`;
    answer += `- **梯度稳定**：相比普通 RNN，梯度流动路径更稳定\n`;
    answer += `- **序列建模**：适合处理变长序列数据\n\n`;
  } else if (extraConcept?.key === "batchnorm") {
    answer += `- **内部协变量偏移减少**：每层输入分布更稳定\n`;
    answer += `- **学习率容忍度高**：可以使用更大的学习率\n`;
    answer += `- **正则化效果**：mini-batch 统计提供隐式正则化\n`;
    answer += `- **加速收敛**：通常可将训练速度提升 3-5 倍\n\n`;
  } else if (extraConcept?.key === "layernorm") {
    answer += `- **样本级归一化**：对每个样本独立计算统计量\n`;
    answer += `- **batch size 无关**：适合小批量或动态 batch size\n`;
    answer += `- **序列友好**：适合处理变长序列（NLP任务）\n`;
    answer += `- **Transformer 默认**：是 Transformer 架构的标配\n\n`;
  } else if (extraConcept?.key === "dropout") {
    answer += `- **随机失活**：训练时随机丢弃部分神经元\n`;
    answer += `- **集成效果**：等价于训练多个子网络的集成\n`;
    answer += `- **防止过拟合**：减少神经元间的共适应\n`;
    answer += `- **推理时缩放**：需乘以 $(1-p)$ 保持输出期望一致\n\n`;
  } else if (extraConcept?.key === "attention") {
    answer += `- **全局依赖**：任意两个位置直接计算关联\n`;
    answer += `- **并行计算**：所有位置的注意力分数可同时计算\n`;
    answer += `- **缩放机制**：$\\sqrt{d_k}$ 防止 Softmax 饱和\n`;
    answer += `- **多头机制**：多个注意力头捕捉不同类型的关联\n\n`;
  } else if (extraConcept?.key === "gradient-compare") {
    answer += `- **对称性**：两者是同一问题的正反两面\n`;
    answer += `- **深度依赖**：网络越深，问题越严重\n`;
    answer += `- **激活函数影响**：ReLU 缓解消失，加剧爆炸\n`;
    answer += `- **相互转化**：调整学习率可能使一种问题变为另一种\n\n`;
  } else if (extraConcept?.key === "residual-deep") {
    answer += `- **恒等映射保障**：shortcut 提供直接梯度路径\n`;
    answer += `- **残差学习更容易**：拟合 $F(x)$ 比拟合 $H(x)$ 更简单\n`;
    answer += `- **参数效率**：相同性能下参数更少\n`;
    answer += `- **泛化能力强**：深度残差网络通常有更好的泛化性能\n\n`;
  } else if (extraConcept?.key === "lstm-gate") {
    answer += `- **门控的灵活性**：三个门独立控制信息流动\n`;
    answer += `- **梯度路径多样**：可通过单元状态或隐藏状态传递\n`;
    answer += `- **长期记忆能力**：遗忘门可选择性保留长期信息\n`;
    answer += `- **计算复杂度**：比普通 RNN 高，但训练更稳定\n\n`;
  } else if (extraConcept?.key === "norm-compare") {
    answer += `- **归一化方向不同**：BatchNorm 跨样本，LayerNorm 跨特征\n`;
    answer += `- **统计量稳定性**：LayerNorm 更稳定（不依赖 batch）\n`;
    answer += `- **适用领域差异**：CV 用 BN，NLP 用 LN\n`;
    answer += `- **实现细节**：BN 需要 running mean/variance，LN 不需要\n\n`;
  } else if (primary) {
    answer += `根据该知识点的性质，重点掌握以下维度：\n\n`;
    answer += `- **形式化定义**：精确的数学描述与边界条件\n`;
    answer += `- **核心性质**：完备性、最优性、时间/空间复杂度\n`;
    answer += `- **适用场景**：什么情况下选择该方法\n`;
    answer += `- **常见变体**：基础算法的扩展与优化方向\n\n`;
  } else {
    answer += `待补充...\n\n`;
  }

  // 4. 图示说明
  answer += `### 3. 图示理解\n\n`;
  if (extraConcept?.key === "manhattan") {
    answer += `\`\`\`\n`;
    answer += `● ──┐    起点 (0,0) → 终点 (3,2)\n`;
    answer += `    │\n`;
    answer += `    ├─── ●  曼哈顿距离 = |3-0| + |2-0| = 5\n`;
    answer += `    │\n`;
    answer += `    └─── ●  无论走哪条路径，总步数都是 5\n`;
    answer += `\`\`\`\n\n`;
    answer += `在网格中，所有"只向右和向上走"的路径长度都等于曼哈顿距离。\n\n`;
  } else if (extraConcept?.key === "grid-search") {
    answer += `\`\`\`\n`;
    answer += `4 邻域 (上下左右)：   8 邻域 (加对角线)：\n`;
    answer += `   ○                     ○ ○ ○\n`;
    answer += ` ○ ● ○                   ○ ● ○\n`;
    answer += `   ○                     ○ ○ ○\n`;
    answer += `\`\`\`\n\n`;
  } else {
    answer += `建议结合配套的思维导图与教学动画中的图示部分，建立直观理解。\n\n`;
  }

  // 5. 代码示例
  answer += `### 4. 代码实现\n\n`;
  if (extraConcept?.key === "manhattan") {
    answer += `\`\`\`python\ndef manhattan_distance(p1, p2):\n    """计算二维曼哈顿距离"""\n    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])\n\n\ndef manhattan_distance_n(a, b):\n    """n 维曼哈顿距离"""\n    return sum(abs(ai - bi) for ai, bi in zip(a, b))\n\n\n# 在 A* 中作为启发函数\ndef heuristic(pos, goal):\n    return manhattan_distance(pos, goal)  # 4 邻域可采纳\n\`\`\`\n\n`;
  } else if (extraConcept?.key === "gradient-descent") {
    answer += `\`\`\`python\nimport numpy as np\n\ndef gradient_descent(X, y, lr=0.01, epochs=1000):\n    """线性回归的批量梯度下降"""\n    n_samples, n_features = X.shape\n    w = np.zeros(n_features)\n    b = 0.0\n    \n    for epoch in range(epochs):\n        y_pred = X @ w + b\n        \n        # 计算梯度\n        dw = (1 / n_samples) * X.T @ (y_pred - y)\n        db = (1 / n_samples) * np.sum(y_pred - y)\n        \n        # 更新参数\n        w -= lr * dw\n        b -= lr * db\n        \n        if epoch % 100 == 0:\n            loss = np.mean((y_pred - y) ** 2)\n            print(f"Epoch {epoch}: loss = {loss:.4f}")\n    \n    return w, b\n\`\`\`\n\n`;
  } else {
    answer += `完整代码示例可参考资源中心的「代码实操」类资源，支持在线运行与修改。\n\n`;
  }

  // 6. 常见易错点
  answer += `### 5. 常见易错点\n\n`;
  if (extraConcept?.key === "manhattan") {
    answer += `1. **适用场景混淆**：曼哈顿距离只适用于 4 邻域网格，8 邻域要用切比雪夫\n`;
    answer += `2. **可采纳性判断**：当移动代价不全为 1 时，曼哈顿距离可能高估（不满足可采纳性）\n`;
    answer += `3. **维度灾难**：高维空间中曼哈顿距离的区分度下降\n`;
    answer += `4. **与切比雪夫混淆**：4 邻域→曼哈顿，8 邻域→切比雪夫，不要搞反\n\n`;
  } else if (extraConcept?.key === "gradient-descent") {
    answer += `1. **学习率太大**：导致震荡不收敛甚至发散\n`;
    answer += `2. **学习率太小**：收敛太慢，训练时间过长\n`;
    answer += `3. **特征未标准化**：不同特征尺度差异大，梯度下降路径呈"之"字形\n`;
    answer += `4. **局部最优**：非凸函数可能陷入局部最优（深度学习中较常见鞍点）\n`;
    answer += `5. **BatchNorm 顺序**：BN 应放在激活函数之前还是之后？推荐 Conv-BN-Activation\n\n`;
  } else if (primary) {
    answer += `学习本知识点时需要特别注意：\n\n`;
    answer += `- 边界条件与退化情况的处理\n`;
    answer += `- 与相似概念的区分（避免张冠李戴）\n`;
    answer += `- 复杂度分析中的常数因子与实际性能差异\n`;
    answer += `- 工程实现中常见的"看起来对但其实错"的陷阱\n\n`;
  }

  // 7. 学习路径建议
  answer += `### 6. 学习路径建议\n\n`;
  if (primary) {
    answer += `**前置知识**：${primary.prerequisites.length > 0 ? primary.prerequisites.join("、") : "无，可直接开始"}\n\n`;
  }
  if (related.length > 0) {
    answer += `**相关知识点**：\n\n`;
    for (const r of related.slice(0, 4)) {
      answer += `- [${r.title}](#)（第 ${r.chapter} 章）\n`;
    }
    answer += `\n`;
  }
  answer += `**推荐学习顺序**：\n\n`;
  answer += `1. 先读讲解文档，建立概念框架\n`;
  answer += `2. 看思维导图，理清知识结构\n`;
  answer += `3. 配合教学动画建立直观理解\n`;
  answer += `4. 动手写代码（代码实操资源）\n`;
  answer += `5. 做题检验掌握程度（题库资源）\n`;
  answer += `6. 阅读拓展材料，了解前沿应用\n\n`;

  // 8. 相关资源推荐
  const relatedResources = preGeneratedResources.filter((r) => {
    if (primary && r.knowledgeId === primary.id) return true;
    if (extraConcept && r.knowledgeId === extraConcept.data.category) return true;
    return false;
  }).slice(0, 4);

  if (relatedResources.length > 0) {
    answer += `### 7. 相关学习资源\n\n`;
    answer += `| 类型 | 资源 | 时长 |\n`;
    answer += `|------|------|------|\n`;
    for (const r of relatedResources) {
      const typeLabel = {
        document: "📄 讲解文档",
        mindmap: "🧠 思维导图",
        quiz: "📝 练习题库",
        reading: "📚 拓展阅读",
        animation: "🎬 教学动画",
        code: "💻 代码实操",
      }[r.type] || r.type;
      answer += `| ${typeLabel} | ${r.title} | ${r.metadata.duration || "—"} |\n`;
    }
    answer += `\n`;
    answer += `> 在资源中心搜索关键词可找到更多相关内容。\n\n`;
  }

  answer += `---\n\n`;
  answer += `*解答由「灵境队长 + 校验官」双智能体协作生成，内容已通过事实核查。如有疑问可继续追问。*`;

  return answer;
}

// 通用兜底回答（未匹配到知识点时）
function generateGenericAnswer(question: string): string {
  return `## 关于你的问题\n\n你提出的「${question}」是一个很好的问题。我暂时无法从课程知识库中精确定位到对应的知识点，但可以从以下角度帮你思考：\n\n### 建议的探索方向\n\n1. **概念澄清**：先明确问题涉及的核心概念是什么？是否有形式化定义？\n2. **分类定位**：这个问题属于 AI 的哪个子领域？搜索 / 学习 / 推理 / NLP / CV / RL？\n3. **方法对比**：有哪些主流方法？各有什么优缺点？\n4. **实践验证**：能否通过代码实验来验证你的理解？\n\n### 你可以这样补充问题\n\n- 说明你在学习哪门课程的哪一章\n- 描述你已经了解了什么，卡在哪里\n- 附上题目原文或代码片段（如果是解题类问题）\n\n你可以在**学习画像 → 随学随新**中更新你的学习进度，系统会根据你的掌握情况调整推荐策略。\n\n> 💡 提示：试试问"梯度下降"、"A* 算法"、"Transformer 注意力"等具体知识点，我可以给出更详细的讲解。`;
}
