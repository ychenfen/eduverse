import type { ExternalVideo } from "@/types";

// 主题代码库 — 为动画代码分镜提供真实的代码实现
export interface TopicCodeEntry {
  id: string;
  matchKeywords: string[];
  title: string;
  code: string;
  displayLines: { text: string; type: string }[];
  vars: { name: string; init: string; steps: string[] };
  formula?: string;
  formulaDesc?: string;
  formalDefinition?: string;
}

interface KnowledgeFormula {
  matchKeywords: string[];
  formula: string;
  formulaDesc: string;
  formalDefinition: string;
}

const knowledgeFormulas: KnowledgeFormula[] = [
  {
    matchKeywords: ["局部搜索", "local search", "hill-climbing", "模拟退火", "遗传算法"],
    formula: "xₙ₊₁ = xₙ + Δx",
    formulaDesc: "x: 当前解 · Δx: 搜索步长",
    formalDefinition: "在状态空间中从当前解出发，通过邻域搜索寻找更优解",
  },
  {
    matchKeywords: ["对抗搜索", "博弈", "adversarial", "minimax", "α-β", "剪枝", "mcts"],
    formula: "v = min(max(v₁, v₂), max(v₃, v₄))",
    formulaDesc: "v: 极小极大值 · vᵢ: 子节点值",
    formalDefinition: "在双人零和博弈中，一方最大化收益，另一方最小化对方收益",
  },
  {
    matchKeywords: ["启发式搜索", "a*", "a星", "astar"],
    formula: "f(n) = g(n) + h(n)",
    formulaDesc: "g: 已耗代价 · h: 启发式估计",
    formalDefinition: "结合路径代价与启发式信息的最优搜索策略",
  },
  {
    matchKeywords: ["无信息搜索", "bfs", "dfs", "ucs", "广度", "深度"],
    formula: "Q = {s} → expand → goal?",
    formulaDesc: "Q: 搜索队列 · s: 起始节点",
    formalDefinition: "不使用领域知识，仅按固定策略遍历状态空间",
  },
  {
    matchKeywords: ["梯度下降", "gradient descent"],
    formula: "θ = θ - η · ∇J(θ)",
    formulaDesc: "η: 学习率 · ∇J: 损失梯度",
    formalDefinition: "沿损失函数负梯度方向更新参数，寻找极小值点",
  },
  {
    matchKeywords: ["反向传播", "backpropagation", "bp"],
    formula: "∂J/∂w = ∂J/∂z · ∂z/∂w",
    formulaDesc: "链式法则 · 逐层求导",
    formalDefinition: "从输出层反向计算梯度，逐层更新神经网络参数",
  },
  {
    matchKeywords: ["transformer", "注意力", "attention", "self-attention"],
    formula: "Attention(Q,K,V) = softmax(QKᵀ/√dₖ)V",
    formulaDesc: "Q: 查询 · K: 键 · V: 值",
    formalDefinition: "通过计算查询与键的相似度，加权求和得到输出",
  },
  {
    matchKeywords: ["cnn", "卷积", "convolution"],
    formula: "y = σ(W*x + b)",
    formulaDesc: "W: 卷积核 · *: 卷积运算",
    formalDefinition: "通过局部感受野和权值共享提取空间特征",
  },
  {
    matchKeywords: ["rnn", "lstm", "gru", "循环"],
    formula: "hₜ = σ(Wₓh·xₜ + Wₕh·hₜ₋₁ + b)",
    formulaDesc: "hₜ: 当前隐态 · hₜ₋₁: 前一隐态",
    formalDefinition: "通过隐状态传递，处理序列数据的时序依赖",
  },
  {
    matchKeywords: ["逻辑回归", "logistic"],
    formula: "ŷ = σ(w·x + b) = 1/(1+e⁻(w·x+b))",
    formulaDesc: "σ: Sigmoid 函数",
    formalDefinition: "通过 Sigmoid 函数将线性组合映射到 [0,1] 概率区间",
  },
  {
    matchKeywords: ["决策树", "decision tree", "id3", "c4.5"],
    formula: "Gain = H(S) - Σ|Sᵢ|/|S|·H(Sᵢ)",
    formulaDesc: "H: 熵 · Gain: 信息增益",
    formalDefinition: "基于信息增益选择最优特征，递归划分数据集",
  },
  {
    matchKeywords: ["线性模型", "线性回归", "linear"],
    formula: "ŷ = w·x + b = Σwᵢxᵢ + b",
    formulaDesc: "w: 权重 · b: 偏置",
    formalDefinition: "通过特征的线性组合预测输出",
  },
  {
    matchKeywords: ["正则化", "regularization", "l1", "l2", "lasso", "ridge"],
    formula: "J = MSE + λ(Σ|wᵢ| + Σwᵢ²)",
    formulaDesc: "λ: 正则系数",
    formalDefinition: "在损失函数中加入权重惩罚，防止过拟合",
  },
  {
    matchKeywords: ["贝叶斯", "bayes", "概率推理", "bayesian"],
    formula: "P(A|B) = P(B|A)·P(A)/P(B)",
    formulaDesc: "贝叶斯定理",
    formalDefinition: "基于先验概率和似然更新后验概率",
  },
  {
    matchKeywords: ["谓词逻辑", "predicate logic", "一阶逻辑", "推理"],
    formula: "∀x (P(x) → Q(x))",
    formulaDesc: "全称量词 · 蕴含关系",
    formalDefinition: "使用谓词和量词进行形式化推理",
  },
  {
    matchKeywords: ["知识图谱", "knowledge graph", "实体", "关系"],
    formula: "G = (E, R, T)",
    formulaDesc: "E: 实体 · R: 关系 · T: 三元组",
    formalDefinition: "以图结构存储实体及其关系的知识表示",
  },
  {
    matchKeywords: ["机器学习", "machine learning", "监督", "无监督", "强化"],
    formula: "y = f(x; θ) ≈ y*",
    formulaDesc: "f: 模型 · θ: 参数 · y*: 真实值",
    formalDefinition: "通过数据学习函数映射，使预测接近真实值",
  },
  {
    matchKeywords: ["评价", "评估", "eval", "metric", "f1", "auc", "roc"],
    formula: "F1 = 2·P·R/(P+R)",
    formulaDesc: "P: 精确率 · R: 召回率",
    formalDefinition: "综合衡量分类模型的精确率与召回率",
  },
  {
    matchKeywords: ["大模型", "llm", "预训练", "pretrain", "sft", "rlhf"],
    formula: "L = Lₚᵣₑ + αLₛբₜ + βLᵣₗₕբ",
    formulaDesc: "多阶段训练损失",
    formalDefinition: "预训练+微调+人类反馈强化学习的三阶段范式",
  },
  {
    matchKeywords: ["rag", "检索增强", "retrieval"],
    formula: "Answer = LLM(Context + Query)",
    formulaDesc: "Context: 检索文档",
    formalDefinition: "先检索相关文档，再结合查询生成回答",
  },
  {
    matchKeywords: ["智能体", "agent", "react", "tool use"],
    formula: "Agent = (Perception → Reasoning → Action)",
    formulaDesc: "感知-推理-行动循环",
    formalDefinition: "具备感知、推理、行动能力的自主智能系统",
  },
  {
    matchKeywords: ["多智能体", "multi-agent", "协同", "辩论"],
    formula: "Global = f(Agent₁, Agent₂, ..., Agentₙ)",
    formulaDesc: "个体交互产生全局行为",
    formalDefinition: "多个智能体通过协作或竞争完成复杂任务",
  },
  {
    matchKeywords: ["人工智能", "ai", "定义", "范畴"],
    formula: "AI = {感知, 推理, 学习, 行动}",
    formulaDesc: "四大核心能力",
    formalDefinition: "使计算机系统能够模拟人类智能的技术",
  },
  {
    matchKeywords: ["伦理", "ethics", "公平", "可解释"],
    formula: "Fairness: P(Y|X,A=a) = P(Y|X,A=b)",
    formulaDesc: "不同群体预测一致",
    formalDefinition: "确保 AI 系统公平、可解释、负责任",
  },
  {
    matchKeywords: ["搜索策略", "search strategy"],
    formula: "Strategy = (Frontier, Expansion, Goal)",
    formulaDesc: "搜索三要素",
    formalDefinition: "在状态空间中寻找目标状态的系统化方法",
  },
];

function getFormulaForTopic(topic: string): KnowledgeFormula {
  const lower = topic.toLowerCase();
  for (const entry of knowledgeFormulas) {
    if (entry.matchKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return entry;
    }
  }
  return {
    matchKeywords: [],
    formula: "Goal = argmax U(a, s)",
    formulaDesc: "A: 动作集合 · s: 当前状态 · U: 效用函数",
    formalDefinition: "在动作集合 A 中，给定状态 s，寻找使效用函数 U 最大的解",
  };
}

// 主题代码库 — 覆盖常见 AI 知识点
const topicCodeLibrary: TopicCodeEntry[] = [
  {
    id: "transformer",
    matchKeywords: ["transformer", "注意力", "attention", "自注意力", "self-attention", "multi-head", "多头"],
    title: "Self-Attention",
    code: `import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    output = torch.matmul(weights, V)
    return output, weights

# Q, K, V: [batch, heads, seq, d_k]
Q = torch.randn(1, 8, 10, 64)
K = torch.randn(1, 8, 10, 64)
V = torch.randn(1, 8, 10, 64)
out, w = scaled_dot_product_attention(Q, K, V)
print(out.shape)  # [1, 8, 10, 64]`,
    displayLines: [
      { text: "import torch", type: "keyword" },
      { text: "import torch.nn.functional as F", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def scaled_dot_product_attention(Q, K, V):", type: "func" },
      { text: "    d_k = Q.size(-1)", type: "plain" },
      { text: "    scores = torch.matmul(Q, K.T) / sqrt(d_k)", type: "plain" },
      { text: "    weights = F.softmax(scores, dim=-1)", type: "func" },
      { text: "    output = torch.matmul(weights, V)", type: "plain" },
      { text: "    return output, weights", type: "keyword" },
      { text: "", type: "plain" },
      { text: "out, w = attention(Q, K, V)  # [1,8,10,64]", type: "string" },
    ],
    vars: { name: "attention", init: "scores = Q·Kᵀ / √d_k", steps: ["scores → [1,8,10,10]", "weights = softmax(scores)", "output = weights · V", "out.shape = [1,8,10,64]"] },
  },
  {
    id: "cnn",
    matchKeywords: ["cnn", "卷积", "convolution", "conv", "resnet", "lenet", "vgg", "池化", "pooling"],
    title: "Conv2D Forward",
    code: `import torch
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes=10):
        super().__init__()
        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc = nn.Linear(32 * 16 * 16, num_classes)

    def forward(self, x):
        x = self.pool(torch.relu(self.bn1(self.conv1(x))))
        x = x.view(x.size(0), -1)
        return self.fc(x)

model = SimpleCNN()
x = torch.randn(1, 3, 32, 32)
out = model(x)  # [1, 10]`,
    displayLines: [
      { text: "import torch.nn as nn", type: "keyword" },
      { text: "", type: "plain" },
      { text: "class SimpleCNN(nn.Module):", type: "func" },
      { text: "    def __init__(self, num_classes=10):", type: "func" },
      { text: "        self.conv1 = nn.Conv2d(3, 32, 3, padding=1)", type: "plain" },
      { text: "        self.bn1 = nn.BatchNorm2d(32)", type: "plain" },
      { text: "        self.pool = nn.MaxPool2d(2, 2)", type: "plain" },
      { text: "        self.fc = nn.Linear(32*16*16, num_classes)", type: "plain" },
      { text: "", type: "plain" },
      { text: "    def forward(self, x):", type: "func" },
      { text: "        x = pool(relu(bn1(conv1(x))))", type: "plain" },
      { text: "        return self.fc(x.view(x.size(0), -1))", type: "keyword" },
    ],
    vars: { name: "cnn", init: "input: [1,3,32,32]", steps: ["conv1 → [1,32,32,32]", "bn1 + relu → [1,32,32,32]", "pool → [1,32,16,16]", "fc → [1,10]"] },
  },
  {
    id: "rnn-lstm",
    matchKeywords: ["rnn", "lstm", "gru", "循环", "序列", "sequence", "recurrent", "门控"],
    title: "LSTM Cell",
    code: `import torch
import torch.nn as nn

class LSTMCell(nn.Module):
    def __init__(self, input_size, hidden_size):
        super().__init__()
        self.forget_gate = nn.Linear(input_size + hidden_size, hidden_size)
        self.input_gate = nn.Linear(input_size + hidden_size, hidden_size)
        self.output_gate = nn.Linear(input_size + hidden_size, hidden_size)
        self.cell_gate = nn.Linear(input_size + hidden_size, hidden_size)

    def forward(self, x, h, c):
        combined = torch.cat([x, h], dim=1)
        f = torch.sigmoid(self.forget_gate(combined))
        i = torch.sigmoid(self.input_gate(combined))
        o = torch.sigmoid(self.output_gate(combined))
        c_tilde = torch.tanh(self.cell_gate(combined))
        c_new = f * c + i * c_tilde
        h_new = o * torch.tanh(c_new)
        return h_new, c_new`,
    displayLines: [
      { text: "class LSTMCell(nn.Module):", type: "func" },
      { text: "    def __init__(self, input_size, hidden_size):", type: "func" },
      { text: "        self.forget_gate = nn.Linear(...)", type: "plain" },
      { text: "        self.input_gate = nn.Linear(...)", type: "plain" },
      { text: "        self.output_gate = nn.Linear(...)", type: "plain" },
      { text: "", type: "plain" },
      { text: "    def forward(self, x, h, c):", type: "func" },
      { text: "        combined = torch.cat([x, h], dim=1)", type: "plain" },
      { text: "        f = sigmoid(forget_gate(combined))", type: "func" },
      { text: "        i = sigmoid(input_gate(combined))", type: "func" },
      { text: "        c_new = f * c + i * tanh(cell_g)", type: "plain" },
      { text: "        h_new = o * tanh(c_new)", type: "keyword" },
    ],
    vars: { name: "lstm", init: "h, c: [batch, hidden]", steps: ["f = σ(W_f·[x,h])  遗忘门", "i = σ(W_i·[x,h])  输入门", "c̃ = tanh(W_c·[x,h])", "c = f*c + i*c̃", "h = o*tanh(c)"] },
  },
  {
    id: "astar",
    matchKeywords: ["a*", "a星", "启发式搜索", "heuristic", "搜索策略", "最短路径", "pathfinding"],
    title: "A* Search",
    code: `import heapq

def astar(graph, start, goal, heuristic):
    open_set = [(heuristic(start), start)]
    came_from = {}
    g_score = {start: 0}

    while open_set:
        _, current = heapq.heappop(open_set)
        if current == goal:
            path = [current]
            while current in came_from:
                current = came_from[current]
                path.append(current)
            return path[::-1]

        for neighbor, cost in graph[current]:
            tentative = g_score[current] + cost
            if tentative < g_score.get(neighbor, float('inf')):
                came_from[neighbor] = current
                g_score[neighbor] = tentative
                f = tentative + heuristic(neighbor)
                heapq.heappush(open_set, (f, neighbor))
    return None  # 无路径`,
    displayLines: [
      { text: "import heapq", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def astar(graph, start, goal, h):", type: "func" },
      { text: "    open_set = [(h(start), start)]", type: "plain" },
      { text: "    came_from = {}", type: "plain" },
      { text: "    g_score = {start: 0}", type: "plain" },
      { text: "", type: "plain" },
      { text: "    while open_set:", type: "keyword" },
      { text: "        _, cur = heappop(open_set)", type: "func" },
      { text: "        if cur == goal: reconstruct path", type: "string" },
      { text: "        for nb, cost in graph[cur]:", type: "plain" },
      { text: "            tentative = g[cur] + cost", type: "plain" },
    ],
    vars: { name: "astar", init: "open=[(f(start),start)]", steps: ["弹出 f 最小的节点", "遍历邻居计算 tentative_g", "if tentative < g[nb]: 更新", "f = g + h, 压入 open_set", "goal 命中 → 回溯路径"] },
  },
  {
    id: "gradient-descent",
    matchKeywords: ["梯度下降", "gradient descent", "优化", "optimization", "梯度", "gradient", "学习率", "learning rate"],
    title: "Gradient Descent",
    code: `import numpy as np

def gradient_descent(f_grad, x0, lr=0.01, max_iter=1000, tol=1e-6):
    x = x0
    history = []
    for i in range(max_iter):
        grad = f_grad(x)
        x_new = x - lr * grad
        loss = 0.5 * np.sum(x_new ** 2)
        history.append(loss)
        if np.linalg.norm(x_new - x) < tol:
            print(f"收敛于第 {i} 步, loss={loss:.6f}")
            return x_new, history
        x = x_new
    return x, history

# 最小化 f(x) = 0.5 * ||x||^2,  grad = x
x_opt, hist = gradient_descent(lambda x: x, x0=np.array([5.0, -3.0]))
print(f"最优解: {x_opt}")`,
    displayLines: [
      { text: "import numpy as np", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def gradient_descent(f_grad, x0, lr=0.01):", type: "func" },
      { text: "    x = x0", type: "plain" },
      { text: "    for i in range(max_iter):", type: "keyword" },
      { text: "        grad = f_grad(x)", type: "func" },
      { text: "        x_new = x - lr * grad", type: "plain" },
      { text: "        loss = 0.5 * sum(x_new ** 2)", type: "plain" },
      { text: "        if norm(x_new - x) < tol:", type: "keyword" },
      { text: "            print(f'收敛于第 {i} 步')", type: "string" },
      { text: "            return x_new", type: "keyword" },
      { text: "        x = x_new", type: "plain" },
    ],
    vars: { name: "gd", init: "x = [5.0, -3.0]", steps: ["grad = [5.0, -3.0]", "x = x - 0.01*grad", "loss = 0.5*||x||²", "||Δx|| < 1e-6?", "收敛 ✓"] },
  },
  {
    id: "backprop",
    matchKeywords: ["反向传播", "backpropagation", "bp", "链式法则", "chain rule", "梯度消失", "梯度爆炸"],
    title: "Backpropagation",
    code: `import numpy as np

def backprop(X, y, W1, b1, W2, b2, lr):
    # 前向传播
    z1 = X @ W1 + b1
    a1 = 1 / (1 + np.exp(-z1))  # sigmoid
    z2 = a1 @ W2 + b2
    y_pred = 1 / (1 + np.exp(-z2))

    # 反向传播
    dz2 = y_pred - y
    dW2 = a1.T @ dz2
    da1 = dz2 @ W2.T
    dz1 = da1 * a1 * (1 - a1)  # sigmoid 导数
    dW1 = X.T @ dz1

    # 参数更新
    W1 -= lr * dW1
    W2 -= lr * dW2
    return W1, W2, loss(y_pred, y)`,
    displayLines: [
      { text: "def backprop(X, y, W1, b1, W2, b2, lr):", type: "func" },
      { text: "    # 前向传播", type: "comment" },
      { text: "    z1 = X @ W1 + b1", type: "plain" },
      { text: "    a1 = sigmoid(z1)  # 激活", type: "func" },
      { text: "    z2 = a1 @ W2 + b2", type: "plain" },
      { text: "    y_pred = sigmoid(z2)", type: "func" },
      { text: "", type: "plain" },
      { text: "    # 反向传播", type: "comment" },
      { text: "    dz2 = y_pred - y", type: "plain" },
      { text: "    dW2 = a1.T @ dz2", type: "plain" },
      { text: "    dz1 = da1 * a1 * (1-a1)  # 链式", type: "plain" },
      { text: "    W1 -= lr * dW1; W2 -= lr * dW2", type: "keyword" },
    ],
    vars: { name: "bp", init: "W1, W2 随机初始化", steps: ["前向: z1→a1→z2→ŷ", "dz2 = ŷ - y", "dW2 = a1ᵀ · dz2", "dz1 = da1 · σ'(z1)", "W -= lr · dW  更新"] },
  },
  {
    id: "kmeans",
    matchKeywords: ["kmeans", "k-means", "聚类", "clustering", "无监督", "unsupervised"],
    title: "K-Means",
    code: `import numpy as np

def kmeans(X, k, max_iter=100):
    centroids = X[np.random.choice(len(X), k, replace=False)]
    for _ in range(max_iter):
        # 计算每个点到各质心的距离
        dists = np.linalg.norm(X[:, None] - centroids, axis=2)
        labels = np.argmin(dists, axis=1)
        # 更新质心
        new_centroids = np.array([
            X[labels == i].mean(0) if np.any(labels == i) else centroids[i]
            for i in range(k)
        ])
        if np.allclose(centroids, new_centroids):
            break
        centroids = new_centroids
    return labels, centroids`,
    displayLines: [
      { text: "import numpy as np", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def kmeans(X, k, max_iter=100):", type: "func" },
      { text: "    centroids = X[random.choice(len(X), k)]", type: "plain" },
      { text: "    for _ in range(max_iter):", type: "keyword" },
      { text: "        dists = norm(X[:,None] - centroids)", type: "func" },
      { text: "        labels = argmin(dists, axis=1)", type: "func" },
      { text: "        new_c = [X[labels==i].mean(0)", type: "plain" },
      { text: "                  for i in range(k)]", type: "plain" },
      { text: "        if allclose(centroids, new_c):", type: "func" },
      { text: "            break", type: "keyword" },
      { text: "        centroids = new_c", type: "plain" },
    ],
    vars: { name: "kmeans", init: "centroids = random k", steps: ["计算每个点到质心距离", "labels = argmin(dists)", "new_c = 各簇均值", "质心不再变化?", "收敛 ✓"] },
  },
  {
    id: "logistic-regression",
    matchKeywords: ["逻辑回归", "logistic", "回归", "regression", "分类", "classification", "sigmoid"],
    title: "Logistic Regression",
    code: `import numpy as np

class LogisticRegression:
    def __init__(self, lr=0.01, epochs=100):
        self.lr = lr
        self.epochs = epochs

    def fit(self, X, y):
        n, d = X.shape
        self.w = np.zeros(d)
        self.b = 0
        for epoch in range(self.epochs):
            z = X @ self.w + self.b
            y_pred = 1 / (1 + np.exp(-z))
            # 梯度
            grad_w = X.T @ (y_pred - y) / n
            grad_b = (y_pred - y).mean()
            self.w -= self.lr * grad_w
            self.b -= self.lr * grad_b
        return self

    def predict(self, X):
        return (1 / (1 + np.exp(-(X @ self.w + self.b))) >= 0.5).astype(int)`,
    displayLines: [
      { text: "class LogisticRegression:", type: "func" },
      { text: "    def __init__(self, lr=0.01, epochs=100):", type: "func" },
      { text: "        self.lr = lr; self.epochs = epochs", type: "plain" },
      { text: "", type: "plain" },
      { text: "    def fit(self, X, y):", type: "func" },
      { text: "        self.w = zeros(d); self.b = 0", type: "plain" },
      { text: "        for epoch in range(epochs):", type: "keyword" },
      { text: "            z = X @ self.w + self.b", type: "plain" },
      { text: "            y_pred = sigmoid(z)", type: "func" },
      { text: "            grad_w = X.T @ (y_pred - y) / n", type: "plain" },
      { text: "            self.w -= lr * grad_w", type: "plain" },
      { text: "            self.b -= lr * grad_b", type: "keyword" },
    ],
    vars: { name: "lr", init: "w = zeros(d), b = 0", steps: ["z = X·w + b", "ŷ = σ(z) = 1/(1+e⁻ᶻ)", "grad_w = Xᵀ·(ŷ-y)/n", "w -= lr · grad_w", "收敛"] },
  },
  {
    id: "decision-tree",
    matchKeywords: ["决策树", "decision tree", "id3", "c4.5", "cart", "信息增益", "information gain", "熵", "entropy"],
    title: "Decision Tree (ID3)",
    code: `import numpy as np

def entropy(y):
    _, counts = np.unique(y, return_counts=True)
    p = counts / len(y)
    return -np.sum(p * np.log2(p + 1e-10))

def info_gain(X, y, feature, threshold):
    left = y[X[:, feature] <= threshold]
    right = y[X[:, feature] > threshold]
    n = len(y)
    if len(left) == 0 or len(right) == 0:
        return 0
    return entropy(y) - (len(left)/n * entropy(left)
                        + len(right)/n * entropy(right))

def best_split(X, y):
    best_gain, best_feat, best_thr = 0, 0, 0
    for feat in range(X.shape[1]):
        for thr in np.unique(X[:, feat]):
            gain = info_gain(X, y, feat, thr)
            if gain > best_gain:
                best_gain, best_feat, best_thr = gain, feat, thr
    return best_feat, best_thr, best_gain`,
    displayLines: [
      { text: "import numpy as np", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def entropy(y):", type: "func" },
      { text: "    p = counts / len(y)", type: "plain" },
      { text: "    return -sum(p * log2(p))", type: "func" },
      { text: "", type: "plain" },
      { text: "def info_gain(X, y, feat, thr):", type: "func" },
      { text: "    left = y[X[:,feat] <= thr]", type: "plain" },
      { text: "    right = y[X[:,feat] > thr]", type: "plain" },
      { text: "    return H(y) - weighted_H(left,right)", type: "plain" },
      { text: "", type: "plain" },
      { text: "best = max(info_gain)  →  split", type: "string" },
    ],
    vars: { name: "dt", init: "H(y) = 熵", steps: ["遍历每个特征 & 阈值", "计算 info_gain = H - H_split", "选取最大增益分裂", "递归构建子树", "叶节点 = 多数类"] },
  },
  {
    id: "rag",
    matchKeywords: ["rag", "检索增强", "retrieval", "向量检索", "embedding", "rerank"],
    title: "RAG Pipeline",
    code: `import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer

def rag_retrieve(query, documents, embeddings, top_k=3):
    # 1. 向量化查询
    q_vec = embed(query)
    # 2. 计算相似度 (cosine)
    scores = np.dot(embeddings, q_vec) / (
        np.linalg.norm(embeddings, axis=1) * np.linalg.norm(q_vec)
    )
    # 3. 取 Top-K
    top_idx = np.argsort(scores)[-top_k:][::-1]
    retrieved = [documents[i] for i in top_idx]
    # 4. Rerank（可选）
    reranked = rerank(query, retrieved)
    return reranked, scores[top_idx]

def rag_generate(query, context_docs, llm):
    context = "\\n\\n".join(context_docs)
    prompt = f"基于以下资料回答问题：\\n{context}\\n\\n问题：{query}"
    return llm.generate(prompt)`,
    displayLines: [
      { text: "def rag_retrieve(query, docs, embeddings):", type: "func" },
      { text: "    q_vec = embed(query)  # 向量化", type: "func" },
      { text: "    scores = cosine_sim(embeddings, q_vec)", type: "func" },
      { text: "    top_idx = argsort(scores)[-k:][::-1]", type: "plain" },
      { text: "    retrieved = [docs[i] for i in top_idx]", type: "plain" },
      { text: "    reranked = rerank(query, retrieved)", type: "func" },
      { text: "    return reranked", type: "keyword" },
      { text: "", type: "plain" },
      { text: "def rag_generate(query, ctx, llm):", type: "func" },
      { text: "    context = '\\n'.join(ctx)", type: "string" },
      { text: "    prompt = f'资料:{context}\\n问题:{query}'", type: "string" },
      { text: "    return llm.generate(prompt)", type: "keyword" },
    ],
    vars: { name: "rag", init: "query → embed", steps: ["cosine_sim(query, docs)", "Top-K 检索", "Rerank 重排序", "拼接 context + query", "LLM 生成回答"] },
  },
];

// 默认通用代码模板（未匹配到特定主题时使用）
const defaultCodeEntry: TopicCodeEntry = {
  id: "default",
  matchKeywords: [],
  title: "Core Implementation",
  code: `import numpy as np
from dataclasses import dataclass

@dataclass
class Config:
    learning_rate: float = 1e-3
    max_steps: int = 1000
    tolerance: float = 1e-6

def optimize(config: Config):
    np.random.seed(42)
    state = np.random.randn(8)
    history = []

    for step in range(config.max_steps):
        grad = 2 * state  # 模拟梯度
        state = state - config.learning_rate * grad
        loss = float(np.sum(state ** 2))
        history.append(loss)
        if np.linalg.norm(grad) < config.tolerance:
            print(f"收敛于第 {step} 步, loss={loss:.6f}")
            return state, history
    return state, history

cfg = Config()
result, hist = optimize(cfg)
print(f"最终结果: {result}")`,
  displayLines: [
    { text: "import numpy as np", type: "keyword" },
    { text: "from dataclasses import dataclass", type: "keyword" },
    { text: "", type: "plain" },
    { text: "@dataclass", type: "func" },
    { text: "class Config:", type: "func" },
    { text: "    learning_rate: float = 1e-3", type: "plain" },
    { text: "    max_steps: int = 1000", type: "plain" },
    { text: "", type: "plain" },
    { text: "def optimize(config):", type: "func" },
    { text: "    state = random.randn(8)", type: "plain" },
    { text: "    for step in range(max_steps):", type: "keyword" },
    { text: "        grad = 2 * state  # 梯度", type: "comment" },
  ],
  vars: { name: "default", init: "state = randn(8)", steps: ["grad = 2 * state", "state -= lr * grad", "loss = ||state||²", "||grad|| < tol?", "收敛 ✓"] },
};

// 根据主题匹配代码实现
export function getTopicCode(topic: string): TopicCodeEntry {
  const lower = topic.toLowerCase();
  const formulaInfo = getFormulaForTopic(topic);
  for (const entry of topicCodeLibrary) {
    if (entry.matchKeywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return {
        ...entry,
        formula: formulaInfo.formula,
        formulaDesc: formulaInfo.formulaDesc,
        formalDefinition: formulaInfo.formalDefinition,
      };
    }
  }
  return {
    ...defaultCodeEntry,
    formula: formulaInfo.formula,
    formulaDesc: formulaInfo.formulaDesc,
    formalDefinition: formulaInfo.formalDefinition,
  };
}

export function getTopicFormula(topic: string): {
  formula: string;
  formulaDesc: string;
  formalDefinition: string;
} {
  return getFormulaForTopic(topic);
}

// 外部视频推荐 — 根据主题生成搜索链接
export function getExternalVideos(topic: string): ExternalVideo[] {
  const encoded = encodeURIComponent(topic);
  const encodedEn = encodeURIComponent(topic);

  return [
    {
      title: `B站搜索：${topic}`,
      platform: "Bilibili",
      url: `https://search.bilibili.com/all?keyword=${encoded}`,
      duration: "10-60 min",
      desc: "B站拥有丰富的中文教学视频资源，搜索结果涵盖高校公开课、技术博主讲解等",
    },
    {
      title: `YouTube: ${topic}`,
      platform: "YouTube",
      url: `https://www.youtube.com/results?search_query=${encodedEn}`,
      duration: "15-90 min",
      desc: "YouTube 上有大量英文技术教程，包含 3Blue1Brown、Stanford CS 等优质频道",
    },
    {
      title: `Coursera 课程：${topic}`,
      platform: "Coursera",
      url: `https://www.coursera.org/search?query=${encodedEn}`,
      duration: "4-12 周",
      desc: "Coursera 提供系统化在线课程，含作业与证书，适合深度学习",
    },
    {
      title: `MIT OpenCourseWare: ${topic}`,
      platform: "MIT OCW",
      url: `https://www.google.com/search?q=site:ocw.mit.edu+${encodedEn}`,
      duration: "50-90 min",
      desc: "MIT 公开课涵盖 AI/ML 核心课程，含讲义、作业与完整视频",
    },
    {
      title: `Stanford CS 系列：${topic}`,
      platform: "Stanford CS",
      url: `https://www.google.com/search?q=site:youtube.com+stanford+${encodedEn}`,
      duration: "60-80 min",
      desc: "Stanford CS221/CS224N/CS231N 等经典 AI 课程讲座视频",
    },
    {
      title: `arXiv 论文：${topic}`,
      platform: "arXiv",
      url: `https://arxiv.org/search/?query=${encodedEn}&searchtype=all`,
      duration: "阅读 30-60 min",
      desc: "arXiv 预印本论文库，获取最新学术研究成果与原始论文",
    },
  ];
}
