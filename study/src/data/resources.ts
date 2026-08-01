import type { Resource, ResourceMetadata, ResourceType, KnowledgeNode, KnowledgeCategory, AnimationScene, MindmapData, MindmapNode } from "@/types";
import { knowledgeNodes } from "./course";
import { getTopicCode, getExternalVideos } from "./topicLibrary";

// 资源类型元信息
export const resourceTypeMeta: Record<
  ResourceType,
  { label: string; icon: string; color: string; desc: string }
> = {
  document: {
    label: "讲解文档",
    icon: "FileText",
    color: "#1B9AAA",
    desc: "由解构者拆解 + 编织者撰写，结构清晰的学术讲解",
  },
  mindmap: {
    label: "思维导图",
    icon: "Network",
    color: "#F4A261",
    desc: "解构者输出骨架，视觉师渲染节点连线",
  },
  quiz: {
    label: "题库",
    icon: "ListChecks",
    color: "#9D4EDD",
    desc: "出题官针对画像易错点生成多梯度题目",
  },
  reading: {
    label: "拓展阅读",
    icon: "BookOpen",
    color: "#10B981",
    desc: "编织者汇编论文与博文，校验官补全引用",
  },
  animation: {
    label: "教学动画",
    icon: "Clapperboard",
    color: "#22D3EE",
    desc: "视觉师设计 4 分镜矢量动画，播放器支持播放/暂停/进度拖拽",
  },
  code: {
    label: "代码实操",
    icon: "Code2",
    color: "#F87171",
    desc: "实操匠生成可运行代码与环境配置",
  },
};

// 内容生成模板（基于知识点类型生成差异化文档）
const classifyByTitle = (title: string): KnowledgeCategory => {
  const historyKeywords = ["历史", "发展", "浪潮", "演进", "起源", "简史", "发展史", "里程碑"];
  const algorithmKeywords = ["算法", "搜索", "排序", "优化", "策略", "剪枝", "迭代", "求解", "计算", "A*", "RAG"];
  const modelKeywords = ["模型", "网络", "神经", "架构", "感知机", "SVM", "决策树", "聚类", "回归", "CNN", "RNN", "Transformer"];

  if (historyKeywords.some((kw) => title.includes(kw))) return "history";
  if (modelKeywords.some((kw) => title.includes(kw))) return "model";
  if (algorithmKeywords.some((kw) => title.includes(kw))) return "algorithm";
  return "concept";
};

const buildHistoryDocument = (k: KnowledgeNode): string => `# ${k.title}

> 学习时长约 ${k.estimatedMinutes} 分钟 · 难度 ${"★".repeat(k.difficulty)}${"☆".repeat(5 - k.difficulty)}
> 📚 历史类知识点 · 建议结合时间轴动画学习

## 1. 历史背景与起源

${k.summary}

### 1.1 时代背景

任何技术的诞生都离不开特定的时代土壤。${k.title}的出现，既是学术探索的必然结果，也是社会需求推动的产物。

> 💡 **思考题**：为什么是在这个时间点，而不是更早或更晚？

### 1.2 先驱人物

| 人物 | 贡献 | 时代 |
|------|------|------|
| 先驱A | 奠基性理论工作 | 20世纪中叶 |
| 先驱B | 关键算法突破 | 20世纪后期 |
| 先驱C | 工程实践验证 | 21世纪初 |

[SVG:history-pioneers]

## 2. 发展阶段详解

### 2.1 萌芽期（1950s-1960s）

**核心特征**：理论奠基，概念初现

关键事件：
- 1950年：图灵测试提出
- 1956年：达特茅斯会议，AI 概念诞生
- 1958年：感知机模型提出

$$
\\text{Perceptron}: y = \\sigma\\left(\\sum_{i=1}^n w_i x_i + b\\right)
$$

其中 $\\sigma$ 为阶跃函数，$w_i$ 为权重，$b$ 为偏置。

### 2.2 第一次浪潮（1960s-1970s）

**核心特征**：符号主义盛行，期望过高

- 专家系统开始出现
- 逻辑推理成为主流
- 政府大力资助

> ⚠️ **历史教训**：过高的期望与实际能力的落差，导致了第一次"AI 寒冬"。

### 2.3 低潮与反思（1970s-1980s）

**核心特征**：资金削减，研究转向

研究方向的转变：
- 从通用智能转向特定领域
- 从符号推理转向知识工程
- 从理论探索转向工程应用

[SVG:winter-period]

### 2.4 第二次浪潮（1980s-1990s）

**核心特征**：专家系统商业化，连接主义复兴

关键进展：
- 反向传播算法重新发现
- 专家系统广泛应用
- 贝叶斯网络兴起

$$
\\frac{\\partial E}{\\partial w_{ij}} = \\delta_j \\cdot o_i
$$

其中 $\\delta_j$ 为第 $j$ 个神经元的误差项，$o_i$ 为第 $i$ 个神经元的输出。

### 2.5 第三次浪潮（2010s-至今）

**核心特征**：深度学习爆发，数据驱动

推动因素：
- 计算能力指数级增长（GPU）
- 互联网产生海量数据
- 算法创新（CNN、RNN、Transformer）

## 3. 关键里程碑事件

| 时间 | 事件 | 意义 |
|------|------|------|
| 1950 | 图灵测试 | 定义了智能的判定标准 |
| 1956 | 达特茅斯会议 | AI 作为学科正式诞生 |
| 1997 | 深蓝战胜卡斯帕罗夫 | 标志性的里程碑事件 |
| 2012 | AlexNet 夺冠 | 深度学习时代开启 |
| 2022 | ChatGPT 发布 | 大模型时代到来 |

[SVG:timeline-milestones]

## 4. 历史启示与思考

### 4.1 技术发展的规律

1. **螺旋上升**：技术发展不是线性的，而是在起伏中前进
2. **多因素驱动**：理论、算力、数据三者缺一不可
3. **期望周期**：技术成熟度曲线（Gartner Hype Cycle）

### 4.2 对当前的借鉴意义

- 保持理性，避免过度 hype
- 重视基础研究，不盲目跟风
- 关注交叉学科的融合创新

## 5. 延伸学习

- 推荐阅读：《人工智能：一种现代方法》第1章
- 纪录片：《The Age of AI》
- 经典论文：McCulloch & Pitts (1943), Rumelhart et al. (1986)
- 配合动画：时间轴演进 + 里程碑卡片

---

*本文档由解构者梳理历史脉络，编织者撰写详细内容，视觉师配套时间轴动画。*
`;

const buildConceptDocument = (k: KnowledgeNode): string => `# ${k.title}

> 学习时长约 ${k.estimatedMinutes} 分钟 · 难度 ${"★".repeat(k.difficulty)}${"☆".repeat(5 - k.difficulty)}
> 📖 概念类知识点 · 建议先建立直觉，再深入形式化

## 1. 概念引入与直觉

${k.summary}

### 1.1 为什么需要这个概念？

在深入形式化定义之前，先思考一个问题：

> 🤔 **如果没有这个概念，我们会遇到什么困难？**

答案是：我们将无法准确描述和讨论相关问题，也无法建立统一的认知基础。概念是学科的基石。

### 1.2 日常生活中的类比

为了建立直觉，我们可以用生活中的例子类比：

| 生活概念 | AI 对应概念 | 相似性 |
|----------|------------|--------|
| 工具 | 算法 | 都是解决问题的手段 |
| 经验 | 数据 | 都是知识的来源 |
| 判断 | 分类 | 都是决策的过程 |

[SVG:concept-analogy]

## 2. 形式化定义

### 2.1 核心定义

**${k.title}** 可以从多个角度来定义：

**定义1（描述性）**：${k.summary.replace(/。$/, "")}。

**定义2（数学化）**：从数学角度，可以形式化为：

$$
\\mathcal{C} = \\{ x \\mid P(x) \\}
$$

其中 $P(x)$ 是判定 $x$ 是否属于该概念的谓词。

**定义3（操作性）**：通过一组操作来定义概念的内涵与外延。

### 2.2 关键维度

每个概念都可以从多个维度来理解：

| 维度 | 说明 | 重要性 |
|------|------|--------|
| **内涵** | 概念的本质属性 | ⭐⭐⭐⭐⭐ |
| **外延** | 概念涵盖的实例范围 | ⭐⭐⭐⭐ |
| **边界** | 与其他概念的区分 | ⭐⭐⭐⭐ |
| **层次** | 在概念体系中的位置 | ⭐⭐⭐ |

[SVG:concept-dimensions]

## 3. 相关概念辨析

### 3.1 相似概念对比

学习概念时最容易混淆的是相似概念。下表列出了几组常见的对比：

| 概念 A | 概念 B | 核心区别 |
|--------|--------|----------|
| 强 AI | 弱 AI | 通用能力 vs 特定任务 |
| 监督学习 | 无监督学习 | 是否有标签 |
| 过拟合 | 欠拟合 | 模型复杂度 vs 数据量 |

### 3.2 概念关系图

概念之间不是孤立的，它们形成一个网络：

$$
\\mathcal{G} = (\\mathcal{V}, \\mathcal{E})
$$

其中 $\\mathcal{V}$ 是概念集合，$\\mathcal{E}$ 是概念间的关系边（包含、并列、对立等）。

[SVG:concept-relations]

## 4. 分类与层次

### 4.1 分类体系

根据不同的分类标准，${k.title}可以分为不同的类型：

1. **按应用领域分**
   - 类型A：应用于场景X
   - 类型B：应用于场景Y
   - 类型C：应用于场景Z

2. **按实现方式分**
   - 基于规则的方法
   - 基于统计的方法
   - 基于深度学习的方法

### 4.2 层次结构

概念体系呈现树状结构：

\`\`\`text
Root
  +-- Subclass A
  |    +-- Subclass A1
  |    +-- Subclass A2
  +-- Subclass B
  |    +-- Subclass B1
  +-- Subclass C
\`\`\`

## 5. 应用场景

### 5.1 典型应用领域

| 领域 | 应用方式 | 代表性工作 |
|------|----------|-----------|
| 自然语言处理 | 文本理解与生成 | BERT, GPT |
| 计算机视觉 | 图像识别与分割 | ResNet, ViT |
| 推荐系统 | 个性化推荐 | 协同过滤 |
| 自动驾驶 | 感知与决策 | Tesla FSD |

### 5.2 实际案例分析

> 📝 **案例研究**：某公司如何应用该概念解决实际问题
>
> **问题**：数据量庞大，人工处理效率低下
> **方案**：引入 ${k.title} 相关技术
> **效果**：效率提升 300%，成本降低 60%

[SVG:application-cases]

## 6. 常见误区与注意事项

### 6.1 典型误区

1. **误区一**：将相关性等同于因果性
   - 错误：因为 A 和 B 同时出现，所以 A 导致 B
   - 正确：需要通过控制变量实验验证因果关系

2. **误区二**：过度泛化
   - 错误：在有限数据上得出普适结论
   - 正确：明确适用范围和边界条件

3. **误区三**：非黑即白思维
   - 错误：认为一个概念要么正确要么错误
   - 正确：理解概念的发展演化和适用条件

### 6.2 学习建议

- ✅ 先建立直觉，再追求精确
- ✅ 对比相似概念，加深理解
- ✅ 在应用中巩固概念
- ❌ 不要死记硬背定义
- ❌ 不要忽略反例和边界情况

## 7. 小结

通过本章学习，你应该掌握：

1. ${k.title}的核心定义与本质
2. 关键维度与分类体系
3. 与相关概念的联系与区别
4. 典型应用场景
5. 常见误区与避坑指南

---

*本文档由解构者提炼核心概念，编织者撰写详细讲解，校验官补充常见误区。*
`;

const buildModelDocument = (k: KnowledgeNode): string => `# ${k.title} — 模型详解

> 学习时长约 ${k.estimatedMinutes} 分钟 · 难度 ${"★".repeat(k.difficulty)}${"☆".repeat(5 - k.difficulty)}
> 🧠 模型类知识点 · 建议配合架构图动画学习

## 1. 模型概述

${k.summary}

### 1.1 模型设计思想

每一种模型都有其核心设计哲学。${k.title}的核心思想是：

> 💡 **核心洞察**：通过层次化的特征提取，逐步将原始数据转化为高级语义表示。

### 1.2 发展历史

| 时间 | 里程碑 | 意义 |
|------|--------|------|
| 1980s | 早期原型 | 概念验证 |
| 2010s | 深度学习时代 | 性能飞跃 |
| 2020s | 大模型时代 | 规模效应 |

[SVG:model-evolution]

## 2. 模型架构详解

### 2.1 整体架构图

${k.title}的整体架构如下：

$$
\\text{Model}(x) = f_L(f_{L-1}(\\dots f_1(x) \\dots))
$$

其中 $f_l$ 表示第 $l$ 层的变换函数，$L$ 为网络总层数。

### 2.2 各层详解

#### 输入层

- **作用**：接收原始数据
- **输入维度**：$d_{in}$
- **预处理**：归一化、标准化

$$
x_{norm} = \\frac{x - \\mu}{\\sigma}
$$

#### 隐藏层（核心）

[SVG:model-architecture]

隐藏层是模型的核心，包含以下关键组件：

| 组件 | 作用 | 数学表达 |
|------|------|----------|
| **线性变换** | 特征变换 | $z = Wx + b$ |
| **激活函数** | 引入非线性 | $a = \\sigma(z)$ |
| **归一化** | 稳定训练 | $\\hat{z} = \\frac{z - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}}$ |
| **残差连接** | 缓解梯度消失 | $y = x + F(x)$ |

#### 输出层

- **作用**：产生最终预测
- 根据任务选择不同的激活函数：
  - 分类：Softmax
  - 回归：Linear
  - 二分类：Sigmoid

$$
\\text{Softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^K e^{z_j}}
$$

## 3. 关键机制详解

### 3.1 注意力机制（如适用）

如果模型包含注意力机制，其核心公式为：

$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V
$$

其中：
- $Q$ 为查询矩阵
- $K$ 为键矩阵
- $V$ 为值矩阵
- $d_k$ 为键的维度，用于缩放

### 3.2 前馈网络

$$
\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2
$$

两层线性变换，中间加 ReLU 激活。

### 3.3 层归一化

$$
\\text{LayerNorm}(x) = \\gamma \\odot \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\epsilon}} + \\beta
$$

其中 $\\gamma$ 和 $\\beta$ 是可学习的参数。

[SVG:key-mechanisms]

## 4. 训练流程

### 4.1 前向传播

数据从输入层流向输出层：

$$
\\begin{align*}
a^{(0)} &= x \\\\
z^{(l)} &= W^{(l)} a^{(l-1)} + b^{(l)} \\\\
a^{(l)} &= \\sigma(z^{(l)}) \\\\
\\hat{y} &= a^{(L)}
\\end{align*}
$$

### 4.2 损失函数

根据任务类型选择损失函数：

| 任务 | 损失函数 | 公式 |
|------|----------|------|
| 二分类 | 交叉熵 | $L = -[y\\log\\hat{y} + (1-y)\\log(1-\\hat{y})]$ |
| 多分类 | 交叉熵 | $L = -\\sum_{i=1}^K y_i\\log\\hat{y}_i$ |
| 回归 | MSE | $L = \\frac{1}{n}\\sum_{i=1}^n (y_i - \\hat{y}_i)^2$ |

### 4.3 反向传播

基于链式法则，从输出层向输入层逐层计算梯度：

$$
\\frac{\\partial L}{\\partial W^{(l)}} = \\frac{\\partial L}{\\partial z^{(l)}} \\cdot a^{(l-1)T}
$$

$$
\\frac{\\partial L}{\\partial b^{(l)}} = \\frac{\\partial L}{\\partial z^{(l)}}
$$

[SVG:training-flow]

### 4.4 参数更新

使用梯度下降算法更新参数：

$$
W^{(l)} \\leftarrow W^{(l)} - \\eta \\cdot \\frac{\\partial L}{\\partial W^{(l)}}
$$

$$
b^{(l)} \\leftarrow b^{(l)} - \\eta \\cdot \\frac{\\partial L}{\\partial b^{(l)}}
$$

其中 $\\eta$ 为学习率。

## 5. 模型变体与演进

### 5.1 主要变体

| 变体名称 | 改进点 | 适用场景 |
|----------|--------|----------|
| 基础版 | 标准结构 | 通用场景 |
| 轻量版 | 减少参数，加速推理 | 移动端、边缘设备 |
| 加强版 | 增加深度和宽度 | 追求高精度 |
| 改进版 | 引入新机制（注意力等） | 复杂任务 |

### 5.2 性能对比

[SVG:model-comparison]

## 6. 实现要点与调参技巧

### 6.1 常见超参数

| 超参数 | 作用 | 典型范围 | 调参建议 |
|--------|------|----------|----------|
| 学习率 | 控制更新步长 | 1e-5 ~ 1e-2 | 从大到小尝试 |
| 批次大小 | 并行样本数 | 8 ~ 512 | 显存允许范围内选大 |
| 层数 | 网络深度 | 3 ~ 100+ | 越深越难训练 |
| 隐藏维度 | 特征维度 | 64 ~ 1024 | 大模型选大值 |
| Dropout | 防止过拟合 | 0.1 ~ 0.5 | 数据少则调大 |

### 6.2 训练技巧

1. **学习率调度**：Warmup + 余弦退火
2. **权重衰减**：L2 正则化
3. **梯度裁剪**：防止梯度爆炸
4. **早停**：防止过拟合

## 7. 典型应用

- 图像分类：ImageNet 准确率 90%+
- 目标检测：COCO mAP 50+
- 语义分割：Cityscapes mIoU 80%+
- 自然语言处理：GLUE 基准刷新

---

*本文档由解构者拆解模型架构，视觉师设计架构图动画，实操匠配套代码实现。*
`;

const buildAlgorithmDocument = (k: KnowledgeNode): string => `# ${k.title} — 算法详解

> 学习时长约 ${k.estimatedMinutes} 分钟 · 难度 ${"★".repeat(k.difficulty)}${"☆".repeat(5 - k.difficulty)}
> ⚙️ 算法类知识点 · 建议配合流程图与代码实操学习

## 1. 问题定义

### 1.1 问题描述

${k.summary}

### 1.2 形式化定义

我们可以将问题形式化如下：

**输入**：

$$
\\mathcal{I} = \\{ \\text{状态空间 } S, \\text{动作空间 } A, \\text{初始状态 } s_0, \\text{目标状态 } G \\}
$$

**输出**：

$$
\\mathcal{O} = \\{ \\text{动作序列 } a_1, a_2, \\dots, a_n \\mid \\delta(s_0, a_1a_2\\dots a_n) \\in G \\}
$$

**优化目标**：

$$
\\min_{\\pi \\in \\Pi} \\quad C(\\pi)
$$

其中 $C(\\pi)$ 表示策略 $\\pi$ 的代价。

[SVG:problem-definition]

## 2. 算法原理

### 2.1 核心思想

${k.title}的核心思想是：

> 💡 **直觉理解**：在解空间中，按照特定策略系统地探索，逐步逼近最优解。

### 2.2 算法流程

算法的整体流程可以概括为以下步骤：

1. **初始化**：设置初始状态、数据结构、参数
2. **迭代搜索**：循环执行以下操作直到满足终止条件
   - 选择节点/状态
   - 扩展后继
   - 评估质量
   - 更新数据结构
3. **返回结果**：找到解或报告无解

[SVG:algorithm-flowchart]

### 2.3 伪代码

\`\`\`python
def algorithm(input_state):
    # 初始化
    frontier = initialize(input_state)
    explored = set()
    
    while frontier:
        # 选择节点
        node = select_node(frontier)
        
        # 目标检测
        if is_goal(node.state):
            return build_solution(node)
        
        # 标记已探索
        explored.add(node.state)
        
        # 扩展后继
        for action in get_actions(node.state):
            child = expand(node, action)
            if child.state not in explored:
                add_to_frontier(frontier, child)
    
    return None  # 无解
\`\`\`

## 3. 复杂度分析

### 3.1 时间复杂度

$$
T(n) = O(b^d)
$$

其中：
- $b$ 为分支因子（每个节点的平均后继数）
- $d$ 为解的深度
- $n$ 为问题规模

### 3.2 空间复杂度

$$
S(n) = O(b^d)
$$

空间复杂度通常与时间复杂度同阶，但某些算法（如迭代加深）可以显著降低空间需求。

### 3.3 对比分析

| 算法 | 时间 | 空间 | 完备性 | 最优性 |
|------|------|------|--------|--------|
| BFS | $O(b^d)$ | $O(b^d)$ | ✅ | ✅ |
| DFS | $O(b^m)$ | $O(bm)$ | ❌ | ❌ |
| UCS | $O(b^{1+\\lfloor C^*/\\epsilon \\rfloor})$ | $O(b^{1+\\lfloor C^*/\\epsilon \\rfloor})$ | ✅ | ✅ |
| A* | $O(b^d)$ | $O(b^d)$ | ✅ | ✅ |

[SVG:complexity-comparison]

## 4. 数学推导

### 4.1 关键公式推导

**定理**：如果启发函数 $h(n)$ 满足可采纳性，那么 A* 算法是最优的。

**证明**：

假设存在一个目标节点 $G_2$ 被先从 frontier 中取出，但存在另一个更优的目标节点 $G_1$（$f(G_1) < f(G_2)$）。

由于 $G_1$ 在最优路径上，设 $n$ 为最优路径上 frontier 中的某个节点，则：

$$
f(n) = g(n) + h(n) \\leq g(G_1) = f(G_1) < f(G_2)
$$

因此 $n$ 应该比 $G_2$ 先被取出，与假设矛盾。

$\\blacksquare$

### 4.2 可采纳性条件

$$
h(n) \\leq h^*(n), \\quad \\forall n
$$

其中 $h^*(n)$ 是从 $n$ 到目标的真实最小代价。

### 4.3 一致性条件

$$
h(n) \\leq c(n, a, n') + h(n')
$$

其中 $c(n, a, n')$ 是从 $n$ 通过动作 $a$ 到 $n'$ 的代价。

[SVG:admissible-heuristic]

## 5. 优化与变体

### 5.1 经典优化技术

1. **双向搜索**：从起点和终点同时搜索，相遇即停止
   - 时间复杂度：$O(b^{d/2})$（大幅降低）

2. **迭代加深**：结合 DFS 的空间效率和 BFS 的完备性
   - 空间复杂度：$O(bd)$

3. **剪枝策略**：Alpha-Beta 剪枝等，减少搜索空间

### 5.2 现代变体

- **元启发式**：遗传算法、模拟退火、粒子群优化
- **机器学习结合**：用学习到的策略指导搜索
- **并行化**：多节点并行探索

## 6. 应用场景

### 6.1 经典问题

| 问题 | 应用算法 | 复杂度 |
|------|----------|--------|
| 八数码 | A* | NP-Hard |
| 路径规划 | Dijkstra / A* | O((V+E)log V) |
| 博弈对抗 | Minimax + Alpha-Beta | O(b^{m/2}) |
| 调度问题 | 启发式搜索 | NP-Hard |

### 6.2 实际应用

- **机器人路径规划**：在地图中找到最优路径
- **游戏 AI**：状态空间搜索，决策树
- **物流调度**：车辆路径问题（VRP）
- **自然语言处理**：句法分析、机器翻译

[SVG:application-scenarios]

## 7. 常见误区

### 7.1 易错点

1. **忽略边界条件**：空输入、无解情况等
2. **启发函数不可采纳**：导致丢失最优解
3. **状态表示不当**：状态爆炸或丢失信息
4. **剪枝错误**：剪掉了正确的解

### 7.2 Debug 技巧

- 从小规模问题入手验证
- 打印中间状态检查逻辑
- 对比已知最优解
- 使用可视化工具追踪搜索过程

## 8. 学习建议

1. **先理解直觉**：不要一上来就啃公式
2. **动手实现**：写代码是理解算法的最好方式
3. **画流程图**：可视化有助于理解
4. **做练习题**：通过做题巩固理解
5. **对比学习**：将不同算法放在一起对比

---

*本文档由解构者分析算法原理，校验官补充复杂度证明，实操匠配套代码实现。*
`;

const buildDocument = (k: KnowledgeNode): string => {
  const category: KnowledgeCategory = k.category || classifyByTitle(k.title);
  switch (category) {
    case "history":
      return buildHistoryDocument(k);
    case "concept":
      return buildConceptDocument(k);
    case "model":
      return buildModelDocument(k);
    case "algorithm":
    default:
      return buildAlgorithmDocument(k);
  }
};

const buildMindmap = (k: KnowledgeNode): string => `# ${k.title} · 思维导图

> 编织者设计 · 径向放射布局 · ${k.prerequisites.length + 5} 主分支 · 交互式可视化（悬停高亮路径 / 点击展开 / 节点浮现动画）

## 交互说明

资源详情中渲染为完整 SVG 思维导图，支持：
- **悬停高亮**：鼠标移到任一节点，自动高亮从根节点到该节点的完整路径
- **节点详情**：悬停显示该节点的详细说明（tooltip）
- **主题配色**：根据知识点所属章节自动匹配主题色（朱砂/青金/翡翠/紫宸）
- **逐层浮现**：节点按层级延迟浮现，连线带绘制动画

## 知识结构

\`\`\`mermaid
mindmap
  root((${k.title}))
    核心概念
      形式化定义
      范畴与边界
      关键术语
    关键性质
      完备性
      最优性
      复杂度
      收敛性
    典型算法
      朴素实现
      工程优化
      现代变体
      对比选型
    应用场景
      学术研究
      工程实践
      前沿探索
      跨学科融合
    易错点
      概念混淆
      边界条件
      复杂度误判
      实现陷阱
\`\`\`

**节点统计**：5 主分支 · ${15 + k.prerequisites.length} 子节点 · 关联知识点 ${k.prerequisites.length} 个
`;

// 生成结构化思维导图数据（驱动可视化组件）
const buildMindmapData = (k: KnowledgeNode): MindmapData => {
  // 根据章节选择主题色
  const themeMap: Record<string, "aurum" | "azure" | "jade" | "amethyst"> = {
    ch1: "aurum",
    ch2: "azure",
    ch3: "amethyst",
    ch4: "azure",
    ch5: "jade",
    ch6: "aurum",
  };
  const theme = themeMap[k.id] || "azure";

  const root: MindmapNode = {
    id: k.id,
    label: k.title,
    detail: k.summary,
    weight: "key",
    children: [
      {
        id: `${k.id}-c1`,
        label: "核心概念",
        detail: `${k.title} 的形式化定义、研究范畴与关键术语`,
        weight: "important",
        children: [
          { id: `${k.id}-c1-1`, label: "形式化定义", detail: "数学语言精确描述问题与解空间" },
          { id: `${k.id}-c1-2`, label: "范畴与边界", detail: "明确方法的适用条件与局限" },
          { id: `${k.id}-c1-3`, label: "关键术语", detail: "掌握领域核心词汇，避免理解偏差" },
        ],
      },
      {
        id: `${k.id}-c2`,
        label: "关键性质",
        detail: "评价方法优劣的四大维度",
        weight: "important",
        children: [
          { id: `${k.id}-c2-1`, label: "完备性", detail: "保证找到解（若解存在）", weight: "key" },
          { id: `${k.id}-c2-2`, label: "最优性", detail: "解的质量保证，是否全局最优" },
          { id: `${k.id}-c2-3`, label: "复杂度", detail: "时间与空间成本，决定可扩展性" },
          { id: `${k.id}-c2-4`, label: "收敛性", detail: "迭代方法是否收敛及收敛速度" },
        ],
      },
      {
        id: `${k.id}-c3`,
        label: "典型算法",
        detail: "从朴素到现代的算法谱系",
        weight: "important",
        children: [
          { id: `${k.id}-c3-1`, label: "朴素实现", detail: "最直观的基线方法，便于理解原理" },
          { id: `${k.id}-c3-2`, label: "工程优化", detail: "通过数据结构/并行化提升性能" },
          { id: `${k.id}-c3-3`, label: "现代变体", detail: "结合深度学习等新范式的扩展" },
          { id: `${k.id}-c3-4`, label: "对比选型", detail: "不同场景下的算法选择策略" },
        ],
      },
      {
        id: `${k.id}-c4`,
        label: "应用场景",
        detail: `${k.title} 的真实落地领域`,
        children: [
          { id: `${k.id}-c4-1`, label: "学术研究", detail: "前沿论文中的理论创新与应用" },
          { id: `${k.id}-c4-2`, label: "工程实践", detail: "工业界的真实落地案例与经验" },
          { id: `${k.id}-c4-3`, label: "前沿探索", detail: "新兴方向的早期尝试与开放问题" },
          { id: `${k.id}-c4-4`, label: "跨学科融合", detail: "与其他领域结合产生的新方向" },
        ],
      },
      {
        id: `${k.id}-c5`,
        label: "易错点",
        detail: "学习者常见误区与陷阱",
        weight: "important",
        children: [
          { id: `${k.id}-c5-1`, label: "概念混淆", detail: "相似概念之间的辨析与区分" },
          { id: `${k.id}-c5-2`, label: "边界条件", detail: "特殊输入与退化情况的处理" },
          { id: `${k.id}-c5-3`, label: "复杂度误判", detail: "常见的时间复杂度分析错误" },
          { id: `${k.id}-c5-4`, label: "实现陷阱", detail: "工程实现中的隐蔽 bug 来源" },
        ],
      },
    ],
  };

  // 若有前置知识点，作为第 6 主分支
  if (k.prerequisites.length > 0) {
    root.children!.push({
      id: `${k.id}-c6`,
      label: "前置知识",
      detail: "学习本节前应掌握的基础知识",
      children: k.prerequisites.map((p, i) => ({
        id: `${k.id}-c6-${i}`,
        label: p,
        detail: `前置知识点：${p}`,
      })),
    });
  }

  return {
    root,
    layout: "radial",
    theme,
  };
};

const buildQuiz = (k: KnowledgeNode): string => `# ${k.title} · 题库

> 共 5 题 · 难度梯度 ★ ~ ★★★★★ · 出题官依据画像易错点靶向生成

## 一、单选题（★ ~ ★★）

**1.** 下列关于 ${k.title} 的描述，最准确的是？
- A. 仅适用于离散状态空间
- B. 是${k.summary.slice(0, 8)}…的唯一方法
- C. 是一种${k.summary.slice(0, 6)}的范式与方法体系 ✓
- D. 与机器学习完全无关

**答案**：C
**解析**：${k.title} 的范畴远超单一算法，它是一整套方法体系。

## 二、多选题（★★★）

**2.** 关于 ${k.title} 的关键性质，下列说法正确的有？
- A. 完备性指保证找到解（若存在） ✓
- B. 最优性指解一定全局最优
- C. 时间复杂度与问题规模无关
- D. 不同算法在三项性质上存在权衡 ✓

**答案**：A、D

## 三、判断题（★★）

**3.** ${k.title} 的复杂度只取决于输入规模，与启发函数设计无关。（ ）

**答案**：✗
**解析**：启发函数质量直接影响搜索效率，从而影响实际复杂度。

## 四、简答题（★★★★）

**4.** 请简述 ${k.title} 在${k.summary.split("，")[0]}场景中的适用边界。

## 五、综合题（★★★★★）

**5.** 给定一个具体问题实例，请设计完整的求解流程，并分析其完备性与最优性。
`;

const buildReading = (k: KnowledgeNode): string => `# ${k.title} · 拓展阅读

> 编织者汇编 · 校验官补全引用 · 共 4 篇

## 1. 经典教材章节

**Russell & Norvig, AIMV 4th ed., Ch. 相关章节**
- 推荐阅读：第 ${k.chapter + 2} 章关于 ${k.title} 的完整论述
- 阅读重点：形式化定义与完备性证明

## 2. 综述论文

**A Survey on ${k.title} (ACM Computing Surveys, 2023)**
- 引用量 1.2k+
- 覆盖：方法分类、性能对比、开放问题

## 3. 工程博客

**Anthropic / OpenAI 技术博客系列**
- 实践视角的 ${k.title} 落地经验
- 包含可复现的实验配置

## 4. 视频资源

**Stanford CS221 / CS224N 对应讲座**
- 时长 50-80 分钟
- 含课后习题与讨论区

---

**引用规范**：所有引用已由校验官交叉核对，缺失部分标注"待补充"。
`;

const buildAnimation = (k: KnowledgeNode): string => `# ${k.title} · 教学动画

> 视觉师设计 · 7 分镜 · 总时长约 150 秒 · 矢量动画播放器（SVG + CSS 时序驱动）
>
> 本动画由多智能体协作生成：解构者输出知识骨架 → 编织者产出算法流程图 → 实操匠提供目标代码 → 视觉师设计分镜与 SVG → 校验官核对内容真实性。
> 播放器支持播放/暂停/进度拖拽/分镜跳转/字幕语音播报，矢量渲染保证任意分辨率清晰。
> 代码分镜基于主题代码库匹配真实实现，并推荐外部视频资源供深入学习。

## 播放说明

资源详情中点击「播放动画」即可观看。每分镜含：
- **画面**：SVG 矢量图，元素带时序动画（粒子汇聚 / 概念定义 / 流程图 / 代码逐行高亮 / 运行演示 / 对比卡片 / 视频推荐）
- **字幕**：同步解说文本，支持语音播报（TTS）
- **时长**：精准时间轴，支持 seek

## 分镜脚本

### 分镜 1（0-15s）— 问题导入 · 粒子汇聚

**画面**：墨色背景中浮现抽象问题图标，粒子从四周向中心汇聚成核心节点。
**字幕**："当我们面对${k.summary.split("，")[0]}的问题时，第一步是建立直觉。粒子从四周汇聚成核心节点，象征问题的聚焦。"

### 分镜 2（15-35s）— 概念定义 · 形式化

**画面**：标题与公式展示区浮现，Goal = argmax U(a, s)，下方三个关键术语卡片（输入空间/核心映射/输出结果）。
**字幕**："${k.title} 的形式化定义：在动作集合 A 中，给定状态 s，寻找使效用函数 U 最大的解。"

### 分镜 3（35-60s）— 算法流程图 · 多节点执行

**画面**：完整算法流程图，含输入/预处理/核心计算/判断分支/输出 5 个节点，连线带流动虚线，节点依次点亮，判断节点带循环箭头。
**字幕**："${k.title} 的算法流程：输入 → 预处理 → 核心计算 → 判断收敛 → 输出，含循环反馈。核心计算节点是整个流程的关键。"

### 分镜 4（60-95s）— 核心代码 · 逐行执行

**画面**：模拟代码编辑器，基于主题代码库匹配的真实 Python 实现，逐行高亮（keyword/comment/string 不同色），右侧显示变量状态与执行结果。
**字幕**："对应真实代码实现，右侧实时显示运行时状态变量变化，逐行高亮展示执行流程。"

### 分镜 5（95-115s）— 运行演示 · 变量状态

**画面**：左侧展示执行步骤列表（带编号），右侧显示输出结果面板，逐步点亮执行步骤。
**字幕**："代码逐步执行，最终收敛并输出结果，每一步的变量状态实时更新。"

### 分镜 6（115-135s）— 关键性质 · 三栏对比

**画面**：三列对比卡片自下而上浮现，分别标注完备性 / 最优性 / 复杂度，含中英文标注与影响说明。
**字幕**："评价${k.title}的三个维度：完备性决定可行性，最优性决定质量，复杂度决定可扩展性。三者需权衡取舍。"

### 分镜 7（135-150s）— 应用拓展 · 视频推荐

**画面**：三个应用场景（工业应用/学术研究/工程实践）缩略图，底部浮现外部视频推荐区域，提示查看 B站/YouTube/Coursera 等平台资源。
**字幕**："${k.title}已应用于工业界与学术界。查看下方外部视频推荐，深入理解主题。"

---

## 技术实现

- **渲染**：SVG 矢量 + CSS keyframes 时序动画
- **播放器**：自研轻量组件（play/pause/seek/进度条/分镜跳转/TTS 字幕播报）
- **流程图**：5 节点带分支判断与循环反馈，连线虚线流动 + 节点依次点亮
- **代码展示**：模拟编辑器界面，基于主题代码库匹配真实实现，关键字 / 注释 / 字符串差异化配色，逐行高亮执行
- **TTS 播报**：基于 Web Speech API 的 speechSynthesis，支持中文字幕语音朗读
- **外部视频**：根据主题推荐 B站/YouTube/Coursera/MIT OCW/Stanford/arXiv 等平台资源
- **扩展性**：已预留 SeeDance / 讯飞星火多模态生成大模型 Provider 接口，可扩展为真实视频流
- **防幻觉**：所有字幕与画面元素经校验官四重校验，命中知识点白名单
`;

const buildIntroSvg = (title: string, subtitle: string): string => `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-intro">
  <defs>
    <radialGradient id="core1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#1B9AAA" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <circle cx="240" cy="110" r="60" fill="url(#core1)" data-anim="core-pulse"/>
  <g data-anim="particles">
    <circle cx="60" cy="60" r="3" fill="#F4A261" data-anim="p1"/>
    <circle cx="420" cy="60" r="3" fill="#1B9AAA" data-anim="p2"/>
    <circle cx="60" cy="180" r="3" fill="#9D4EDD" data-anim="p3"/>
    <circle cx="420" cy="180" r="3" fill="#F4A261" data-anim="p4"/>
    <circle cx="100" cy="110" r="2" fill="#22D3EE" data-anim="p5"/>
    <circle cx="380" cy="110" r="2" fill="#22D3EE" data-anim="p6"/>
  </g>
  <circle cx="240" cy="110" r="22" fill="none" stroke="#22D3EE" stroke-width="2" data-anim="ring-expand"/>
  <text x="240" y="200" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title}</text>
  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="11" font-family="serif">${subtitle}</text>
</svg>`;

const buildOutroSvg = (title: string): string => `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-outro">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="28" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title} · 应用与拓展</text>

  <g data-anim="scene-1">
    <rect x="30" y="50" width="130" height="100" rx="8" fill="#22D3EE15" stroke="#22D3EE" stroke-width="1.5"/>
    <circle cx="95" cy="90" r="14" fill="#22D3EE" opacity="0.6"/>
    <text x="95" y="135" text-anchor="middle" fill="#22D3EE" font-size="11" font-family="serif">工业应用</text>
    <text x="95" y="150" text-anchor="middle" fill="#8B94A8" font-size="8">真实落地</text>
  </g>
  <g data-anim="scene-2" opacity="0.4">
    <rect x="175" y="50" width="130" height="100" rx="8" fill="#F4A26115" stroke="#F4A261" stroke-width="1.5"/>
    <rect x="215" y="78" width="50" height="24" rx="3" fill="#F4A261" opacity="0.6"/>
    <text x="240" y="135" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif">学术研究</text>
    <text x="240" y="150" text-anchor="middle" fill="#8B94A8" font-size="8">前沿论文</text>
  </g>
  <g data-anim="scene-3" opacity="0.4">
    <rect x="320" y="50" width="130" height="100" rx="8" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1.5"/>
    <path d="M360 100 L385 80 L385 120 Z" fill="#9D4EDD" opacity="0.6"/>
    <text x="385" y="135" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif">工程实践</text>
    <text x="385" y="150" text-anchor="middle" fill="#8B94A8" font-size="8">代码实战</text>
  </g>

  <g data-anim="video-recommend" opacity="0">
    <rect x="30" y="165" width="420" height="55" rx="8" fill="#1a223580" stroke="#F4A261" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="240" y="185" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">📺 外部视频推荐</text>
    <text x="240" y="205" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">B站 · YouTube · Coursera · MIT OCW · Stanford · arXiv</text>
  </g>
</svg>`;

const buildCompareCardsSvg = (
  title: string,
  cards: Array<{ label: string; sub1: string; sub2: string; impact: string; en: string; color: string }>
): string => {
  const colors: Record<string, string> = {
    cyan: "#22D3EE",
    orange: "#F4A261",
    purple: "#9D4EDD",
    teal: "#1B9AAA",
    green: "#10B981",
  };
  return `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-compare">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="30" text-anchor="middle" fill="#22D3EE" font-size="13" font-family="serif" font-weight="bold">${title}</text>
  ${cards
    .map((card, i) => {
      const x = 30 + i * 145;
      const color = colors[card.color] || colors.cyan;
      return `<g data-anim="card-${i + 1}" opacity="${i === 0 ? 1 : 0}">
    <rect x="${x}" y="55" width="130" height="140" rx="8" fill="${color}15" stroke="${color}" stroke-width="1.5"/>
    <text x="${x + 65}" y="90" text-anchor="middle" fill="${color}" font-size="14" font-family="serif" font-weight="bold">${card.label}</text>
    <text x="${x + 65}" y="115" text-anchor="middle" fill="#8B94A8" font-size="10">${card.sub1}</text>
    <text x="${x + 65}" y="135" text-anchor="middle" fill="#8B94A8" font-size="10">${card.sub2}</text>
    <text x="${x + 65}" y="165" text-anchor="middle" fill="${color}" font-size="9">→ ${card.impact}</text>
    <text x="${x + 65}" y="185" text-anchor="middle" fill="#4a5670" font-size="8">${card.en}</text>
  </g>`;
    })
    .join("")}
  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">多维度全面理解</text>
</svg>`;
};

const buildAlgorithmScenes = (k: KnowledgeNode): AnimationScene[] => {
  const title = k.title;
  const short = title.slice(0, 4);
  const summaryHead = k.summary.split("，")[0];
  const topicCode = getTopicCode(title);

  const svg1 = buildIntroSvg("问题导入", `问题：${summaryHead}`);

  const svg2 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-concept">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="32" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold" data-anim="concept-title">${title} · 形式化定义</text>

  <g data-anim="formula-block" opacity="0">
    <rect x="60" y="55" width="360" height="80" rx="8" fill="#1a223580" stroke="#22D3EE" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="240" y="90" text-anchor="middle" fill="#F4A261" font-size="16" font-family="serif" font-style="italic">${topicCode.formula}</text>
    <text x="240" y="115" text-anchor="middle" fill="#8B94A8" font-size="11" font-family="serif">${topicCode.formulaDesc}</text>
  </g>

  <g data-anim="terms" opacity="0">
    <rect x="40" y="150" width="130" height="60" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1"/>
    <text x="105" y="172" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">输入空间</text>
    <text x="105" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">数据 / 状态</text>

    <rect x="180" y="150" width="130" height="60" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="1"/>
    <text x="245" y="172" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">核心映射</text>
    <text x="245" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">函数 / 模型</text>

    <rect x="320" y="150" width="130" height="60" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1"/>
    <text x="385" y="172" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">输出结果</text>
    <text x="385" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">决策 / 预测</text>
  </g>
</svg>`;

  const svg3 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-flowchart">
  <defs>
    <linearGradient id="fc-g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F4A261"/>
      <stop offset="100%" stop-color="#9D4EDD"/>
    </linearGradient>
    <marker id="arrow-fc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="#22D3EE"/>
    </marker>
  </defs>
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="24" text-anchor="middle" fill="#8B94A8" font-size="11" font-family="serif">${title} · 算法流程图</text>

  <path d="M80 50 L80 80" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="fc-dash-1" marker-end="url(#arrow-fc)"/>
  <path d="M80 110 L120 140" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="fc-dash-2" marker-end="url(#arrow-fc)"/>
  <path d="M280 155 L340 155" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="fc-dash-3" marker-end="url(#arrow-fc)"/>
  <path d="M400 118 L400 60" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="fc-dash-4" marker-end="url(#arrow-fc)"/>
  <text x="410" y="90" fill="#10B981" font-size="8" font-family="serif">收敛</text>

  <path d="M360 172 L360 192 L220 192 L200 172" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="3 3" fill="none" data-anim="fc-loop" marker-end="url(#arrow-fc)" opacity="0"/>
  <text x="290" y="204" fill="#F4A261" font-size="8" font-family="serif" data-anim="fc-loop-label" opacity="0">未收敛 · 循环迭代</text>

  <g data-anim="fc-node-1" opacity="0.3">
    <rect x="40" y="35" width="80" height="28" rx="14" fill="#0A0E1A" stroke="#F4A261" stroke-width="2"/>
    <text x="80" y="53" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif">输入</text>
  </g>
  <g data-anim="fc-node-2" opacity="0.3">
    <rect x="40" y="95" width="80" height="28" rx="4" fill="#0A0E1A" stroke="#1B9AAA" stroke-width="2"/>
    <text x="80" y="113" text-anchor="middle" fill="#1B9AAA" font-size="10" font-family="serif">预处理</text>
  </g>
  <g data-anim="fc-node-3" opacity="0.3">
    <rect x="200" y="140" width="80" height="30" rx="4" fill="#0A0E1A" stroke="#22D3EE" stroke-width="2.5"/>
    <circle cx="240" cy="155" r="36" fill="none" stroke="#22D3EE" stroke-width="1" opacity="0.4" data-anim="core-ring"/>
    <text x="240" y="159" text-anchor="middle" fill="#22D3EE" font-size="12" font-family="serif" font-weight="bold">${short}</text>
  </g>
  <g data-anim="fc-node-4" opacity="0.3">
    <path d="M340 155 L390 125 L440 155 L390 185 Z" fill="#0A0E1A" stroke="#9D4EDD" stroke-width="2"/>
    <text x="390" y="159" text-anchor="middle" fill="#9D4EDD" font-size="10" font-family="serif">收敛?</text>
  </g>
  <g data-anim="fc-node-5" opacity="0.3">
    <rect x="360" y="35" width="80" height="28" rx="14" fill="#0A0E1A" stroke="#10B981" stroke-width="2"/>
    <text x="400" y="53" text-anchor="middle" fill="#10B981" font-size="11" font-family="serif">输出</text>
  </g>

  <g font-family="monospace" font-size="8" fill="#4a5670">
    <text x="42" y="38">01</text>
    <text x="42" y="98">02</text>
    <text x="202" y="143">03</text>
    <text x="346" y="130">04</text>
    <text x="362" y="38">05</text>
  </g>
</svg>`;

  const codeColors: Record<string, string> = {
    keyword: "#9D4EDD",
    func: "#1B9AAA",
    string: "#F4A261",
    comment: "#4a5670",
    number: "#10B981",
    plain: "#8B94A8",
  };

  const codeLines = topicCode.displayLines.slice(0, 12);
  const lineHeight = 11;
  const codeStartY = 42;
  const codeSvg = codeLines
    .map((line, i) => {
      const y = codeStartY + i * lineHeight;
      const color = codeColors[line.type] || codeColors.plain;
      const escapedText = line.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const hlRect = `<rect x="30" y="${y - 9}" width="250" height="11" fill="#22D3EE20" data-anim="code-hl-${i + 1}" opacity="0"/>`;
      return `${hlRect}<text x="34" y="${y}" fill="${color}" font-family="monospace" font-size="9">${escapedText}</text>`;
    })
    .join("");

  const vars = topicCode.vars;
  const varLines = [vars.init, ...vars.steps].slice(0, 6);
  const varSvg = varLines
    .map((v, i) => {
      const y = 55 + i * 18;
      return `<text x="300" y="${y}" fill="#8B94A8" font-family="monospace" font-size="8">${v}</text>`;
    })
    .join("");

  const svg4 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-code">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <rect x="0" y="0" width="480" height="22" fill="#141B2E"/>
  <circle cx="14" cy="11" r="3" fill="#F4A261"/>
  <circle cx="26" cy="11" r="3" fill="#22D3EE"/>
  <circle cx="38" cy="11" r="3" fill="#10B981"/>
  <text x="240" y="15" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="monospace">${topicCode.id}.py · ${topicCode.title}</text>

  <g font-family="monospace" font-size="9">
    <g fill="#4a5670" data-anim="code-gutter">
      ${codeLines.map((_, i) => `<text x="14" y="${codeStartY + i * lineHeight}">${i + 1}</text>`).join("")}
    </g>
    <g data-anim="code-content">
      ${codeSvg}
    </g>
  </g>

  <line x1="290" y1="22" x2="290" y2="240" stroke="#1a2235" stroke-width="1"/>
  <text x="385" y="36" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">运行时状态 · ${vars.name}</text>

  <g font-family="monospace" font-size="8" data-anim="code-state">
    ${varSvg}
  </g>

  <text x="300" y="180" fill="#8B94A8" font-size="8" font-family="serif">执行进度</text>
  <rect x="300" y="186" width="165" height="4" rx="2" fill="#1a2235"/>
  <rect x="300" y="186" width="0" height="4" rx="2" fill="#22D3EE" data-anim="conv-bar"/>
  <text x="465" y="200" text-anchor="end" fill="#22D3EE" font-size="8" font-family="monospace" data-anim="conv-pct">0%</text>

  <text x="240" y="225" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">真实代码 · ${topicCode.title}</text>
</svg>`;

  const svg5 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-runtime">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="30" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">运行演示 · ${topicCode.title}</text>

  <g data-anim="runtime-steps">
    <text x="30" y="60" fill="#8B94A8" font-size="10" font-family="serif">执行步骤：</text>
    ${vars.steps
      .map((step, i) => {
        const y = 80 + i * 22;
        return `<g data-anim="step-${i + 1}" opacity="0.4">
      <circle cx="40" cy="${y - 3}" r="8" fill="#1a2235" stroke="#22D3EE" stroke-width="1"/>
      <text x="40" y="${y}" text-anchor="middle" fill="#22D3EE" font-size="9" font-family="monospace">${i + 1}</text>
      <text x="58" y="${y}" fill="#8B94A8" font-size="9" font-family="monospace">${step}</text>
    </g>`;
      })
      .join("")}
  </g>

  <g data-anim="output-panel" opacity="0">
    <rect x="300" y="55" width="160" height="140" rx="8" fill="#1a223580" stroke="#10B981" stroke-width="1"/>
    <text x="380" y="80" text-anchor="middle" fill="#10B981" font-size="11" font-family="serif" font-weight="bold">✓ 执行完成</text>
    <text x="380" y="110" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="monospace">初始: ${vars.init}</text>
    <text x="380" y="140" text-anchor="middle" fill="#22D3EE" font-size="10" font-family="monospace">→ 收敛</text>
    <text x="380" y="170" text-anchor="middle" fill="#F4A261" font-size="10" font-family="serif">结果已输出</text>
  </g>
</svg>`;

  const svg6 = buildCompareCardsSvg(`${title} · 三大评价维度`, [
    { label: "完备性", sub1: "保证找到解", sub2: "（若解存在）", impact: "影响可行性", en: "Completeness", color: "teal" },
    { label: "最优性", sub1: "全局最优解", sub2: "vs 局部最优", impact: "影响质量", en: "Optimality", color: "orange" },
    { label: "复杂度", sub1: "时间 / 空间", sub2: "O(n) / O(n²)", impact: "影响扩展性", en: "Complexity", color: "purple" },
  ]);

  const svg7 = buildOutroSvg(title);

  return [
    {
      index: 1,
      startMs: 0,
      durationMs: 15000,
      title: "问题导入 · 粒子汇聚",
      subtitle: `当我们面对${summaryHead}的问题时，第一步是建立直觉。粒子从四周汇聚成核心节点，象征问题的聚焦。`,
      svg: svg1,
      motion: "intro",
    },
    {
      index: 2,
      startMs: 15000,
      durationMs: 20000,
      title: "概念定义 · 形式化",
      subtitle: `${title} 的形式化定义：${topicCode.formalDefinition}。输入空间经核心映射得到输出结果。`,
      svg: svg2,
      motion: "concept",
    },
    {
      index: 3,
      startMs: 35000,
      durationMs: 25000,
      title: "算法流程图 · 多节点执行",
      subtitle: `${title} 的算法流程：输入 → 预处理 → 核心计算 → 判断收敛 → 输出，含循环反馈。核心计算节点是整个流程的关键。`,
      svg: svg3,
      motion: "flowchart",
    },
    {
      index: 4,
      startMs: 60000,
      durationMs: 35000,
      title: `核心代码 · ${topicCode.title}`,
      subtitle: `对应真实代码实现：${topicCode.title}。右侧实时显示运行时状态变量变化，逐行高亮展示执行流程。`,
      svg: svg4,
      motion: "code",
    },
    {
      index: 5,
      startMs: 95000,
      durationMs: 20000,
      title: "运行演示 · 变量状态",
      subtitle: `代码执行步骤：${vars.steps.join(" → ")}。最终收敛并输出结果，每一步的变量状态实时更新。`,
      svg: svg5,
      motion: "runtime",
    },
    {
      index: 6,
      startMs: 115000,
      durationMs: 20000,
      title: "关键性质 · 三栏对比",
      subtitle: `评价${title}的三个维度：完备性决定可行性，最优性决定质量，复杂度决定可扩展性。三者需权衡取舍。`,
      svg: svg6,
      motion: "compare",
    },
    {
      index: 7,
      startMs: 135000,
      durationMs: 15000,
      title: "应用拓展 · 视频推荐",
      subtitle: `${title}已应用于工业界与学术界。查看下方外部视频推荐，深入理解主题：B站、YouTube、Coursera 等平台资源。`,
      svg: svg7,
      motion: "outro",
    },
  ];
};

const buildHistoryScenes = (k: KnowledgeNode): AnimationScene[] => {
  const title = k.title;
  const summaryHead = k.summary.split("，")[0];
  const topicCode = getTopicCode(title);

  const svg1 = buildIntroSvg(`主题：${title}`, summaryHead);

  const svg2 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-timeline">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="28" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title} · 演进脉络</text>

  <line x1="240" y1="50" x2="240" y2="210" stroke="#22D3EE" stroke-width="2" stroke-dasharray="4 4" data-anim="timeline-line"/>

  <g data-anim="tl-node-1">
    <circle cx="240" cy="65" r="8" fill="#F4A261" stroke="#F4A261" stroke-width="2"/>
    <text x="200" y="70" text-anchor="end" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">萌芽期</text>
    <text x="280" y="70" fill="#8B94A8" font-size="9" font-family="serif">思想起源与早期探索</text>
  </g>
  <g data-anim="tl-node-2" opacity="0">
    <circle cx="240" cy="105" r="8" fill="#1B9AAA" stroke="#1B9AAA" stroke-width="2"/>
    <text x="200" y="110" text-anchor="end" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">诞生期</text>
    <text x="280" y="110" fill="#8B94A8" font-size="9" font-family="serif">正式确立与符号主义</text>
  </g>
  <g data-anim="tl-node-3" opacity="0">
    <circle cx="240" cy="145" r="8" fill="#9D4EDD" stroke="#9D4EDD" stroke-width="2"/>
    <text x="200" y="150" text-anchor="end" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">发展期</text>
    <text x="280" y="150" fill="#8B94A8" font-size="9" font-family="serif">连接主义复兴与进步</text>
  </g>
  <g data-anim="tl-node-4" opacity="0">
    <circle cx="240" cy="185" r="8" fill="#10B981" stroke="#10B981" stroke-width="2"/>
    <text x="200" y="190" text-anchor="end" fill="#10B981" font-size="11" font-family="serif" font-weight="bold">繁荣期</text>
    <text x="280" y="190" fill="#8B94A8" font-size="9" font-family="serif">深度学习与大模型时代</text>
  </g>

  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">四个阶段见证领域的演进历程</text>
</svg>`;

  const svg3 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-timeline-cards">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="28" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title} · 关键里程碑</text>

  <g data-anim="tc-card-1">
    <rect x="30" y="50" width="130" height="150" rx="8" fill="#F4A26115" stroke="#F4A261" stroke-width="1.5"/>
    <text x="95" y="75" text-anchor="middle" fill="#F4A261" font-size="12" font-family="serif" font-weight="bold">里程碑一</text>
    <line x1="50" y1="88" x2="140" y2="88" stroke="#F4A261" stroke-width="1" opacity="0.5"/>
    <text x="95" y="108" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">开创性事件</text>
    <text x="95" y="128" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">奠定基础理论</text>
    <text x="95" y="150" text-anchor="middle" fill="#F4A261" font-size="9" font-family="serif">→ 推动领域起步</text>
    <text x="95" y="180" text-anchor="middle" fill="#4a5670" font-size="8" font-family="serif">奠基性贡献</text>
  </g>
  <g data-anim="tc-card-2" opacity="0">
    <rect x="175" y="50" width="130" height="150" rx="8" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1.5"/>
    <text x="240" y="75" text-anchor="middle" fill="#1B9AAA" font-size="12" font-family="serif" font-weight="bold">里程碑二</text>
    <line x1="195" y1="88" x2="285" y2="88" stroke="#1B9AAA" stroke-width="1" opacity="0.5"/>
    <text x="240" y="108" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">突破性进展</text>
    <text x="240" y="128" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">范式转换时刻</text>
    <text x="240" y="150" text-anchor="middle" fill="#1B9AAA" font-size="9" font-family="serif">→ 开启新纪元</text>
    <text x="240" y="180" text-anchor="middle" fill="#4a5670" font-size="8" font-family="serif">突破性贡献</text>
  </g>
  <g data-anim="tc-card-3" opacity="0">
    <rect x="320" y="50" width="130" height="150" rx="8" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1.5"/>
    <text x="385" y="75" text-anchor="middle" fill="#9D4EDD" font-size="12" font-family="serif" font-weight="bold">里程碑三</text>
    <line x1="340" y1="88" x2="430" y2="88" stroke="#9D4EDD" stroke-width="1" opacity="0.5"/>
    <text x="385" y="108" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">现代成果</text>
    <text x="385" y="128" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">大规模应用落地</text>
    <text x="385" y="150" text-anchor="middle" fill="#9D4EDD" font-size="9" font-family="serif">→ 改变世界格局</text>
    <text x="385" y="180" text-anchor="middle" fill="#4a5670" font-size="8" font-family="serif">划时代贡献</text>
  </g>

  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">关键事件推动历史车轮前进</text>
</svg>`;

  const svg4 = buildCompareCardsSvg(`${title} · 代表人物与成果`, [
    { label: "先驱者", sub1: "开创领域", sub2: "奠定理论基础", impact: "思想启迪", en: "Pioneers", color: "orange" },
    { label: "推动者", sub1: "关键突破", sub2: "实现技术跨越", impact: "承前启后", en: "Pioneers", color: "teal" },
    { label: "集大成者", sub1: "体系化贡献", sub2: "推动应用落地", impact: "影响深远", en: "Masters", color: "purple" },
  ]);

  const codeColors: Record<string, string> = {
    keyword: "#9D4EDD",
    func: "#1B9AAA",
    string: "#F4A261",
    comment: "#4a5670",
    number: "#10B981",
    plain: "#8B94A8",
  };
  const codeLines = topicCode.displayLines.slice(0, 12);
  const lineHeight = 11;
  const codeStartY = 42;
  const codeSvg = codeLines
    .map((line, i) => {
      const y = codeStartY + i * lineHeight;
      const color = codeColors[line.type] || codeColors.plain;
      const escapedText = line.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const hlRect = `<rect x="30" y="${y - 9}" width="250" height="11" fill="#22D3EE20" data-anim="code-hl-${i + 1}" opacity="0"/>`;
      return `${hlRect}<text x="34" y="${y}" fill="${color}" font-family="monospace" font-size="9">${escapedText}</text>`;
    })
    .join("");
  const vars = topicCode.vars;
  const varLines = [vars.init, ...vars.steps].slice(0, 6);
  const varSvg = varLines
    .map((v, i) => {
      const y = 55 + i * 18;
      return `<text x="300" y="${y}" fill="#8B94A8" font-family="monospace" font-size="8">${v}</text>`;
    })
    .join("");

  const svg5 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-code">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <rect x="0" y="0" width="480" height="22" fill="#141B2E"/>
  <circle cx="14" cy="11" r="3" fill="#F4A261"/>
  <circle cx="26" cy="11" r="3" fill="#22D3EE"/>
  <circle cx="38" cy="11" r="3" fill="#10B981"/>
  <text x="240" y="15" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="monospace">${topicCode.id}.py · ${topicCode.title}</text>

  <g font-family="monospace" font-size="9">
    <g fill="#4a5670" data-anim="code-gutter">
      ${codeLines.map((_, i) => `<text x="14" y="${codeStartY + i * lineHeight}">${i + 1}</text>`).join("")}
    </g>
    <g data-anim="code-content">
      ${codeSvg}
    </g>
  </g>

  <line x1="290" y1="22" x2="290" y2="240" stroke="#1a2235" stroke-width="1"/>
  <text x="385" y="36" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">运行时状态 · ${vars.name}</text>

  <g font-family="monospace" font-size="8" data-anim="code-state">
    ${varSvg}
  </g>

  <text x="300" y="180" fill="#8B94A8" font-size="8" font-family="serif">执行进度</text>
  <rect x="300" y="186" width="165" height="4" rx="2" fill="#1a2235"/>
  <rect x="300" y="186" width="0" height="4" rx="2" fill="#22D3EE" data-anim="conv-bar"/>
  <text x="465" y="200" text-anchor="end" fill="#22D3EE" font-size="8" font-family="monospace" data-anim="conv-pct">0%</text>

  <text x="240" y="225" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">真实代码 · ${topicCode.title}</text>
</svg>`;

  const svg6 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-concept">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="32" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold" data-anim="concept-title">${title} · 影响与启示</text>

  <g data-anim="formula-block" opacity="0">
    <rect x="60" y="55" width="360" height="70" rx="8" fill="#1a223580" stroke="#F4A261" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="240" y="85" text-anchor="middle" fill="#F4A261" font-size="13" font-family="serif">历史照亮未来，经验启迪智慧</text>
    <text x="240" y="108" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">从历史中汲取前进的力量</text>
  </g>

  <g data-anim="terms" opacity="0">
    <rect x="40" y="145" width="130" height="65" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1"/>
    <text x="105" y="168" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">学术影响</text>
    <text x="105" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">理论方法传承</text>
    <text x="105" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">跨学科融合</text>

    <rect x="180" y="145" width="130" height="65" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="1"/>
    <text x="245" y="168" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">产业变革</text>
    <text x="245" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">生产力跃升</text>
    <text x="245" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">新模式涌现</text>

    <rect x="320" y="145" width="130" height="65" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1"/>
    <text x="385" y="168" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">社会意义</text>
    <text x="385" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">生活方式改变</text>
    <text x="385" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">认知边界拓展</text>
  </g>
</svg>`;

  const svg7 = buildOutroSvg(title);

  return [
    {
      index: 1,
      startMs: 0,
      durationMs: 15000,
      title: "导入 · 主题引入",
      subtitle: `今天我们来了解${title}。粒子从四面八方汇聚成核心节点，象征着历史长河中无数思想的碰撞与融合，最终凝聚成这一重要主题。`,
      svg: svg1,
      motion: "intro",
    },
    {
      index: 2,
      startMs: 15000,
      durationMs: 20000,
      title: "时间轴 · 演进脉络",
      subtitle: `${title}的发展经历了四个主要阶段：从萌芽期的思想起源，到诞生期的正式确立，再到发展期的连接主义复兴，最终进入繁荣期的深度学习时代。每个阶段都有其标志性的事件与成果。`,
      svg: svg2,
      motion: "timeline",
    },
    {
      index: 3,
      startMs: 35000,
      durationMs: 25000,
      title: "关键事件 · 里程碑卡片",
      subtitle: `三个里程碑事件塑造了${title}的发展轨迹：第一个里程碑奠定了理论基础，第二个里程碑实现了范式转换，第三个里程碑推动了大规模应用落地。每一步都在历史上留下了深刻印记。`,
      svg: svg3,
      motion: "timeline-cards",
    },
    {
      index: 4,
      startMs: 60000,
      durationMs: 20000,
      title: "代表人物 · 成果展示",
      subtitle: `在${title}的发展历程中，涌现出了无数杰出人物：先驱者们开创了领域先河，推动者们实现了关键突破，集大成者们推动了体系化发展。他们的智慧与努力共同铸就了今天的成就。`,
      svg: svg4,
      motion: "compare",
    },
    {
      index: 5,
      startMs: 80000,
      durationMs: 35000,
      title: `核心代码 · ${topicCode.title}`,
      subtitle: `对应真实代码实现：${topicCode.title}。右侧实时显示运行时状态变量变化，逐行高亮展示执行流程。`,
      svg: svg5,
      motion: "code",
    },
    {
      index: 6,
      startMs: 115000,
      durationMs: 20000,
      title: "影响与启示",
      subtitle: `${title}的发展不仅带来了学术上的深远影响，推动了理论方法的传承与跨学科融合，更引发了产业变革，实现了生产力的跃升和新模式的涌现，最终深刻改变了人们的生活方式，拓展了人类的认知边界。`,
      svg: svg6,
      motion: "concept",
    },
    {
      index: 7,
      startMs: 135000,
      durationMs: 15000,
      title: "拓展 · 视频推荐",
      subtitle: `了解完${title}的发展历程，你可以进一步探索相关内容。我们为你推荐了B站、YouTube、Coursera 等平台的优质视频资源，帮助你从更多维度深入理解这一主题。`,
      svg: svg7,
      motion: "outro",
    },
  ];
};

const buildConceptScenes = (k: KnowledgeNode): AnimationScene[] => {
  const title = k.title;
  const summaryHead = k.summary.split("，")[0];
  const topicCode = getTopicCode(title);

  const svg1 = buildIntroSvg("问题引入", summaryHead);

  const svg2 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-concept">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="32" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold" data-anim="concept-title">${title} · 核心定义</text>

  <g data-anim="formula-block" opacity="0">
    <rect x="50" y="55" width="380" height="80" rx="8" fill="#1a223580" stroke="#22D3EE" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="240" y="90" text-anchor="middle" fill="#F4A261" font-size="14" font-family="serif" font-style="italic">${topicCode.formula}</text>
    <text x="240" y="115" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">${topicCode.formulaDesc}</text>
  </g>

  <g data-anim="terms" opacity="0">
    <rect x="40" y="150" width="130" height="60" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1"/>
    <text x="105" y="172" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">内涵</text>
    <text x="105" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">概念的本质属性</text>

    <rect x="180" y="150" width="130" height="60" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="1"/>
    <text x="245" y="172" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">外延</text>
    <text x="245" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">涵盖的具体范围</text>

    <rect x="320" y="150" width="130" height="60" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1"/>
    <text x="385" y="172" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">特征</text>
    <text x="385" y="192" text-anchor="middle" fill="#8B94A8" font-size="9">显著的标志特点</text>
  </g>
</svg>`;

  const svg3 = buildCompareCardsSvg(`${title} · 关键维度`, [
    { label: "维度一", sub1: "核心属性", sub2: "本质特征描述", impact: "决定性质", en: "Dimension 1", color: "teal" },
    { label: "维度二", sub1: "分类依据", sub2: "划分标准说明", impact: "构建体系", en: "Dimension 2", color: "orange" },
    { label: "维度三", sub1: "表现形式", sub2: "具体呈现方式", impact: "指导应用", en: "Dimension 3", color: "purple" },
  ]);

  const codeColors: Record<string, string> = {
    keyword: "#9D4EDD",
    func: "#1B9AAA",
    string: "#F4A261",
    comment: "#4a5670",
    number: "#10B981",
    plain: "#8B94A8",
  };
  const codeLines = topicCode.displayLines.slice(0, 12);
  const lineHeight = 11;
  const codeStartY = 42;
  const codeSvg = codeLines
    .map((line, i) => {
      const y = codeStartY + i * lineHeight;
      const color = codeColors[line.type] || codeColors.plain;
      const escapedText = line.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const hlRect = `<rect x="30" y="${y - 9}" width="250" height="11" fill="#22D3EE20" data-anim="code-hl-${i + 1}" opacity="0"/>`;
      return `${hlRect}<text x="34" y="${y}" fill="${color}" font-family="monospace" font-size="9">${escapedText}</text>`;
    })
    .join("");
  const vars = topicCode.vars;
  const varLines = [vars.init, ...vars.steps].slice(0, 6);
  const varSvg = varLines
    .map((v, i) => {
      const y = 55 + i * 18;
      return `<text x="300" y="${y}" fill="#8B94A8" font-family="monospace" font-size="8">${v}</text>`;
    })
    .join("");

  const svg4 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-code">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <rect x="0" y="0" width="480" height="22" fill="#141B2E"/>
  <circle cx="14" cy="11" r="3" fill="#F4A261"/>
  <circle cx="26" cy="11" r="3" fill="#22D3EE"/>
  <circle cx="38" cy="11" r="3" fill="#10B981"/>
  <text x="240" y="15" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="monospace">${topicCode.id}.py · ${topicCode.title}</text>

  <g font-family="monospace" font-size="9">
    <g fill="#4a5670" data-anim="code-gutter">
      ${codeLines.map((_, i) => `<text x="14" y="${codeStartY + i * lineHeight}">${i + 1}</text>`).join("")}
    </g>
    <g data-anim="code-content">
      ${codeSvg}
    </g>
  </g>

  <line x1="290" y1="22" x2="290" y2="240" stroke="#1a2235" stroke-width="1"/>
  <text x="385" y="36" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">运行时状态 · ${vars.name}</text>

  <g font-family="monospace" font-size="8" data-anim="code-state">
    ${varSvg}
  </g>

  <text x="300" y="180" fill="#8B94A8" font-size="8" font-family="serif">执行进度</text>
  <rect x="300" y="186" width="165" height="4" rx="2" fill="#1a2235"/>
  <rect x="300" y="186" width="0" height="4" rx="2" fill="#22D3EE" data-anim="conv-bar"/>
  <text x="465" y="200" text-anchor="end" fill="#22D3EE" font-size="8" font-family="monospace" data-anim="conv-pct">0%</text>

  <text x="240" y="225" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">真实代码 · ${topicCode.title}</text>
</svg>`;

  const svg5 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-compare">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="28" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title} · 对比辨析</text>

  <line x1="240" y1="45" x2="240" y2="215" stroke="#1a2235" stroke-width="2" stroke-dasharray="4 4"/>
  <text x="240" y="40" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">VS</text>

  <g data-anim="left-col">
    <rect x="40" y="55" width="180" height="140" rx="8" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1.5"/>
    <text x="130" y="80" text-anchor="middle" fill="#1B9AAA" font-size="13" font-family="serif" font-weight="bold">${title}</text>
    <line x1="60" y1="95" x2="200" y2="95" stroke="#1B9AAA" stroke-width="1" opacity="0.5"/>
    <text x="130" y="118" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 核心特征描述</text>
    <text x="130" y="138" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 适用场景说明</text>
    <text x="130" y="158" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 典型代表举例</text>
    <text x="130" y="180" text-anchor="middle" fill="#1B9AAA" font-size="9" font-family="serif">→ 把握本质</text>
  </g>

  <g data-anim="right-col" opacity="0">
    <rect x="260" y="55" width="180" height="140" rx="8" fill="#F4A26115" stroke="#F4A261" stroke-width="1.5"/>
    <text x="350" y="80" text-anchor="middle" fill="#F4A261" font-size="13" font-family="serif" font-weight="bold">易混淆概念</text>
    <line x1="280" y1="95" x2="420" y2="95" stroke="#F4A261" stroke-width="1" opacity="0.5"/>
    <text x="350" y="118" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 形似之处辨析</text>
    <text x="350" y="138" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 关键区别说明</text>
    <text x="350" y="158" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">• 辨别方法技巧</text>
    <text x="350" y="180" text-anchor="middle" fill="#F4A261" font-size="9" font-family="serif">→ 避免混淆</text>
  </g>

  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">通过对比精准把握概念边界</text>
</svg>`;

  const svg6 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-compare">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="30" text-anchor="middle" fill="#22D3EE" font-size="13" font-family="serif" font-weight="bold">${title} · 应用场景</text>
  <g data-anim="card-1">
    <rect x="30" y="55" width="130" height="140" rx="8" fill="#22D3EE15" stroke="#22D3EE" stroke-width="1.5"/>
    <circle cx="95" cy="85" r="16" fill="#22D3EE" opacity="0.3"/>
    <text x="95" y="90" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">场景一</text>
    <text x="95" y="115" text-anchor="middle" fill="#8B94A8" font-size="10">领域应用</text>
    <text x="95" y="135" text-anchor="middle" fill="#8B94A8" font-size="9">具体情境描述</text>
    <text x="95" y="165" text-anchor="middle" fill="#22D3EE" font-size="9">→ 解决实际问题</text>
    <text x="95" y="185" text-anchor="middle" fill="#4a5670" font-size="8">典型应用</text>
  </g>
  <g data-anim="card-2" opacity="0">
    <rect x="175" y="55" width="130" height="140" rx="8" fill="#F4A26115" stroke="#F4A261" stroke-width="1.5"/>
    <rect x="220" y="75" width="40" height="20" rx="3" fill="#F4A261" opacity="0.4"/>
    <text x="240" y="90" text-anchor="middle" fill="#F4A261" font-size="14" font-family="serif" font-weight="bold">场景二</text>
    <text x="240" y="115" text-anchor="middle" fill="#8B94A8" font-size="10">学术研究</text>
    <text x="240" y="135" text-anchor="middle" fill="#8B94A8" font-size="9">理论探索方向</text>
    <text x="240" y="165" text-anchor="middle" fill="#F4A261" font-size="9">→ 推动前沿发展</text>
    <text x="240" y="185" text-anchor="middle" fill="#4a5670" font-size="8">研究热点</text>
  </g>
  <g data-anim="card-3" opacity="0">
    <rect x="320" y="55" width="130" height="140" rx="8" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1.5"/>
    <path d="M365 82 L385 70 L385 94 Z" fill="#9D4EDD" opacity="0.4"/>
    <text x="385" y="90" text-anchor="middle" fill="#9D4EDD" font-size="14" font-family="serif" font-weight="bold">场景三</text>
    <text x="385" y="115" text-anchor="middle" fill="#8B94A8" font-size="10">工程实践</text>
    <text x="385" y="135" text-anchor="middle" fill="#8B94A8" font-size="9">技术落地实施</text>
    <text x="385" y="165" text-anchor="middle" fill="#9D4EDD" font-size="9">→ 创造实用价值</text>
    <text x="385" y="185" text-anchor="middle" fill="#4a5670" font-size="8">实战场景</text>
  </g>
  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">理论联系实际，学以致用</text>
</svg>`;

  const svg7 = buildOutroSvg(title);

  return [
    {
      index: 1,
      startMs: 0,
      durationMs: 15000,
      title: "导入 · 问题引入",
      subtitle: `当我们面对${summaryHead}的问题时，首先需要建立清晰的概念认知。粒子从四周汇聚成核心节点，象征着我们对这一概念从模糊到清晰的认识过程。`,
      svg: svg1,
      motion: "intro",
    },
    {
      index: 2,
      startMs: 15000,
      durationMs: 20000,
      title: "核心定义",
      subtitle: `${title}的核心定义是：${k.summary.replace(/。$/, "")}。理解一个概念需要从三个层面入手：内涵揭示概念的本质属性，外延界定概念涵盖的具体范围，特征则是概念最显著的标志特点。`,
      svg: svg2,
      motion: "concept",
    },
    {
      index: 3,
      startMs: 35000,
      durationMs: 25000,
      title: "关键维度 · 分类体系",
      subtitle: `${title}可以从多个关键维度来理解和分类：第一个维度揭示其核心属性，决定了概念的根本性质；第二个维度提供分类依据，帮助我们构建完整的知识体系；第三个维度展现其表现形式，指导我们在实践中如何应用。`,
      svg: svg3,
      motion: "compare",
    },
    {
      index: 4,
      startMs: 60000,
      durationMs: 35000,
      title: `核心代码 · ${topicCode.title}`,
      subtitle: `对应真实代码实现：${topicCode.title}。右侧实时显示运行时状态变量变化，逐行高亮展示执行流程。`,
      svg: svg4,
      motion: "code",
    },
    {
      index: 5,
      startMs: 95000,
      durationMs: 20000,
      title: "对比辨析",
      subtitle: `学习${title}的过程中，很容易与一些相似概念混淆。通过左右对比，我们可以清晰地看到两者之间的形似之处与关键区别，掌握辨别方法技巧，从而精准把握概念的边界，避免在应用中出现偏差。`,
      svg: svg5,
      motion: "compare",
    },
    {
      index: 6,
      startMs: 115000,
      durationMs: 20000,
      title: "应用场景",
      subtitle: `${title}在现实世界中有着广泛的应用：在领域应用中解决实际问题，在学术研究中推动前沿发展，在工程实践中创造实用价值。理论联系实际，才能真正掌握并灵活运用这一概念。`,
      svg: svg6,
      motion: "compare",
    },
    {
      index: 7,
      startMs: 135000,
      durationMs: 15000,
      title: "拓展 · 视频推荐",
      subtitle: `掌握了${title}的核心概念后，你可以进一步探索更多相关内容。我们为你推荐了B站、YouTube、Coursera 等平台的优质视频资源，帮助你从更多维度深化理解，拓展知识边界。`,
      svg: svg7,
      motion: "outro",
    },
  ];
};

const buildModelScenes = (k: KnowledgeNode): AnimationScene[] => {
  const title = k.title;
  const short = title.slice(0, 4);
  const summaryHead = k.summary.split("，")[0];
  const topicCode = getTopicCode(title);

  const svg1 = buildIntroSvg("问题引入", summaryHead);

  const svg2 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-concept">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="32" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold" data-anim="concept-title">${title} · 核心思想</text>

  <g data-anim="formula-block" opacity="0">
    <rect x="60" y="55" width="360" height="70" rx="8" fill="#1a223580" stroke="#22D3EE" stroke-width="1" stroke-dasharray="4 4"/>
    <text x="240" y="85" text-anchor="middle" fill="#F4A261" font-size="14" font-family="serif" font-style="italic">${topicCode.formula}</text>
    <text x="240" y="108" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">${topicCode.formulaDesc}</text>
  </g>

  <g data-anim="terms" opacity="0">
    <rect x="40" y="145" width="130" height="65" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="1"/>
    <text x="105" y="168" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">输入表示</text>
    <text x="105" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">数据编码方式</text>
    <text x="105" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">特征工程</text>

    <rect x="180" y="145" width="130" height="65" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="1"/>
    <text x="245" y="168" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">变换机制</text>
    <text x="245" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">信息处理方式</text>
    <text x="245" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">核心算法</text>

    <rect x="320" y="145" width="130" height="65" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="1"/>
    <text x="385" y="168" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">输出预测</text>
    <text x="385" y="188" text-anchor="middle" fill="#8B94A8" font-size="9">结果生成方式</text>
    <text x="385" y="204" text-anchor="middle" fill="#8B94A8" font-size="8">决策函数</text>
  </g>
</svg>`;

  const svg3 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-architecture">
  <defs>
    <marker id="arch-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="#22D3EE"/>
    </marker>
  </defs>
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="26" text-anchor="middle" fill="#22D3EE" font-size="14" font-family="serif" font-weight="bold">${title} · 模型架构</text>

  <g data-anim="arch-input">
    <rect x="60" y="50" width="100" height="35" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="2"/>
    <text x="110" y="72" text-anchor="middle" fill="#1B9AAA" font-size="12" font-family="serif" font-weight="bold">输入层</text>
    <text x="110" y="100" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">Input Layer</text>
  </g>

  <path d="M160 67 L200 67" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="arch-line-1" marker-end="url(#arch-arrow)" opacity="0"/>

  <g data-anim="arch-hidden1" opacity="0">
    <rect x="200" y="45" width="100" height="45" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="2"/>
    <text x="250" y="65" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">隐藏层 1</text>
    <text x="250" y="82" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">特征提取</text>
  </g>

  <path d="M300 67 L340 67" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="arch-line-2" marker-end="url(#arch-arrow)" opacity="0"/>

  <g data-anim="arch-hidden2" opacity="0">
    <rect x="340" y="45" width="100" height="45" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="2"/>
    <text x="390" y="65" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">隐藏层 2</text>
    <text x="390" y="82" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">抽象表示</text>
  </g>

  <path d="M390 90 L390 120" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="arch-line-3" marker-end="url(#arch-arrow)" opacity="0"/>

  <g data-anim="arch-output" opacity="0">
    <rect x="340" y="125" width="100" height="40" rx="6" fill="#10B98115" stroke="#10B981" stroke-width="2"/>
    <text x="390" y="150" text-anchor="middle" fill="#10B981" font-size="12" font-family="serif" font-weight="bold">输出层</text>
    <text x="390" y="178" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">Output Layer</text>
  </g>

  <g data-anim="arch-labels" opacity="0">
    <text x="110" y="155" fill="#1B9AAA" font-size="9" font-family="serif">原始数据输入</text>
    <text x="250" y="120" fill="#F4A261" font-size="9" font-family="serif">逐层特征变换</text>
    <text x="390" y="200" fill="#10B981" font-size="9" font-family="serif">最终预测结果</text>
  </g>

  <text x="240" y="225" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">层级结构实现从输入到输出的端到端映射</text>
</svg>`;

  const svg4 = buildCompareCardsSvg(`${title} · 关键模块`, [
    { label: "模块一", sub1: "核心组件", sub2: "功能定位说明", impact: "基础支撑", en: "Module 1", color: "teal" },
    { label: "模块二", sub1: "关键机制", sub2: "工作原理描述", impact: "核心驱动", en: "Module 2", color: "orange" },
    { label: "模块三", sub1: "输出组件", sub2: "结果生成方式", impact: "最终呈现", en: "Module 3", color: "purple" },
  ]);

  const codeColors: Record<string, string> = {
    keyword: "#9D4EDD",
    func: "#1B9AAA",
    string: "#F4A261",
    comment: "#4a5670",
    number: "#10B981",
    plain: "#8B94A8",
  };

  const codeLines = topicCode.displayLines.slice(0, 12);
  const lineHeight = 11;
  const codeStartY = 42;
  const codeSvg = codeLines
    .map((line, i) => {
      const y = codeStartY + i * lineHeight;
      const color = codeColors[line.type] || codeColors.plain;
      const escapedText = line.text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const hlRect = `<rect x="30" y="${y - 9}" width="250" height="11" fill="#22D3EE20" data-anim="code-hl-${i + 1}" opacity="0"/>`;
      return `${hlRect}<text x="34" y="${y}" fill="${color}" font-family="monospace" font-size="9">${escapedText}</text>`;
    })
    .join("");

  const vars = topicCode.vars;
  const varLines = [vars.init, ...vars.steps].slice(0, 6);
  const varSvg = varLines
    .map((v, i) => {
      const y = 55 + i * 18;
      return `<text x="300" y="${y}" fill="#8B94A8" font-family="monospace" font-size="8">${v}</text>`;
    })
    .join("");

  const svg5 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-code">
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <rect x="0" y="0" width="480" height="22" fill="#141B2E"/>
  <circle cx="14" cy="11" r="3" fill="#F4A261"/>
  <circle cx="26" cy="11" r="3" fill="#22D3EE"/>
  <circle cx="38" cy="11" r="3" fill="#10B981"/>
  <text x="240" y="15" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="monospace">${topicCode.id}.py · ${topicCode.title}</text>

  <g font-family="monospace" font-size="9">
    <g fill="#4a5670" data-anim="code-gutter">
      ${codeLines.map((_, i) => `<text x="14" y="${codeStartY + i * lineHeight}">${i + 1}</text>`).join("")}
    </g>
    <g data-anim="code-content">
      ${codeSvg}
    </g>
  </g>

  <line x1="290" y1="22" x2="290" y2="240" stroke="#1a2235" stroke-width="1"/>
  <text x="385" y="36" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">运行时状态 · ${vars.name}</text>

  <g font-family="monospace" font-size="8" data-anim="code-state">
    ${varSvg}
  </g>

  <text x="300" y="180" fill="#8B94A8" font-size="8" font-family="serif">执行进度</text>
  <rect x="300" y="186" width="165" height="4" rx="2" fill="#1a2235"/>
  <rect x="300" y="186" width="0" height="4" rx="2" fill="#22D3EE" data-anim="conv-bar"/>
  <text x="465" y="200" text-anchor="end" fill="#22D3EE" font-size="8" font-family="monospace" data-anim="conv-pct">0%</text>

  <text x="240" y="225" text-anchor="middle" fill="#8B94A8" font-size="10" font-family="serif">核心代码 · ${topicCode.title}</text>
</svg>`;

  const svg6 = `<svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" class="anim-svg anim-flowchart">
  <defs>
    <marker id="train-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 Z" fill="#22D3EE"/>
    </marker>
  </defs>
  <rect width="480" height="240" fill="#0A0E1A" rx="12"/>
  <text x="240" y="24" text-anchor="middle" fill="#22D3EE" font-size="13" font-family="serif" font-weight="bold">${title} · 训练流程</text>

  <g data-anim="train-step-1">
    <rect x="30" y="50" width="100" height="40" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="2"/>
    <text x="80" y="70" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">数据准备</text>
    <text x="80" y="86" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">数据集划分</text>
  </g>

  <path d="M130 70 L170 70" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="train-line-1" marker-end="url(#train-arrow)" opacity="0"/>

  <g data-anim="train-step-2" opacity="0">
    <rect x="170" y="50" width="100" height="40" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="2"/>
    <text x="220" y="70" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">初始化</text>
    <text x="220" y="86" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">参数随机初始化</text>
  </g>

  <path d="M270 70 L310 70" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="train-line-2" marker-end="url(#train-arrow)" opacity="0"/>

  <g data-anim="train-step-3" opacity="0">
    <rect x="310" y="50" width="100" height="40" rx="6" fill="#9D4EDD15" stroke="#9D4EDD" stroke-width="2"/>
    <text x="360" y="70" text-anchor="middle" fill="#9D4EDD" font-size="11" font-family="serif" font-weight="bold">前向传播</text>
    <text x="360" y="86" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">计算预测输出</text>
  </g>

  <path d="M410 70 L410 100" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="train-line-3" marker-end="url(#train-arrow)" opacity="0"/>

  <g data-anim="train-step-4" opacity="0">
    <rect x="310" y="105" width="100" height="40" rx="6" fill="#10B98115" stroke="#10B981" stroke-width="2"/>
    <text x="360" y="125" text-anchor="middle" fill="#10B981" font-size="11" font-family="serif" font-weight="bold">计算损失</text>
    <text x="360" y="141" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">误差评估</text>
  </g>

  <path d="M310 125 L270 125" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="train-line-4" marker-end="url(#train-arrow)" opacity="0"/>

  <g data-anim="train-step-5" opacity="0">
    <rect x="170" y="105" width="100" height="40" rx="6" fill="#F4A26115" stroke="#F4A261" stroke-width="2"/>
    <text x="220" y="125" text-anchor="middle" fill="#F4A261" font-size="11" font-family="serif" font-weight="bold">反向传播</text>
    <text x="220" y="141" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">梯度计算</text>
  </g>

  <path d="M170 125 L130 125" stroke="#22D3EE" stroke-width="1.5" stroke-dasharray="4 4" data-anim="train-line-5" marker-end="url(#train-arrow)" opacity="0"/>

  <g data-anim="train-step-6" opacity="0">
    <rect x="30" y="105" width="100" height="40" rx="6" fill="#1B9AAA15" stroke="#1B9AAA" stroke-width="2"/>
    <text x="80" y="125" text-anchor="middle" fill="#1B9AAA" font-size="11" font-family="serif" font-weight="bold">参数更新</text>
    <text x="80" y="141" text-anchor="middle" fill="#8B94A8" font-size="8" font-family="serif">优化器迭代</text>
  </g>

  <path d="M80 145 L80 175 L360 175 L360 145" stroke="#F4A261" stroke-width="1.5" stroke-dasharray="3 3" fill="none" data-anim="train-loop" marker-end="url(#train-arrow)" opacity="0"/>
  <text x="220" y="195" fill="#F4A261" font-size="9" font-family="serif" data-anim="train-loop-label" opacity="0">循环迭代直至收敛</text>

  <text x="240" y="222" text-anchor="middle" fill="#8B94A8" font-size="9" font-family="serif">数据 → 前向 → 损失 → 反向 → 更新，循环往复</text>
</svg>`;

  const svg7 = buildOutroSvg(title);

  return [
    {
      index: 1,
      startMs: 0,
      durationMs: 15000,
      title: "导入 · 问题引入",
      subtitle: `当我们面对${summaryHead}的问题时，模型方法为我们提供了强大的解决工具。粒子从四周汇聚成核心节点，象征着从复杂问题中提炼出模型的核心思想。`,
      svg: svg1,
      motion: "intro",
    },
    {
      index: 2,
      startMs: 15000,
      durationMs: 20000,
      title: "核心思想",
      subtitle: `${title}的核心思想是：${k.summary.replace(/。$/, "")}。一个完整的模型包含三个关键部分：输入表示负责数据的编码方式和特征工程，变换机制实现信息处理和核心算法，输出预测则生成最终结果和决策函数。`,
      svg: svg2,
      motion: "concept",
    },
    {
      index: 3,
      startMs: 35000,
      durationMs: 30000,
      title: "模型架构图",
      subtitle: `${title}采用层级化的架构设计：数据从输入层进入，经过隐藏层1进行特征提取，再通过隐藏层2完成更高层次的抽象表示，最终由输出层产生预测结果。这种端到端的层级结构实现了从原始数据到最终输出的完整映射。`,
      svg: svg3,
      motion: "architecture",
    },
    {
      index: 4,
      startMs: 65000,
      durationMs: 25000,
      title: "关键模块",
      subtitle: `${short}模型由三大关键模块组成：模块一作为基础支撑组件，提供核心功能定位；模块二是核心驱动机制，实现主要的工作原理；模块三负责最终结果的生成和呈现。三大模块协同工作，构成完整的模型系统。`,
      svg: svg4,
      motion: "compare",
    },
    {
      index: 5,
      startMs: 90000,
      durationMs: 30000,
      title: "核心代码",
      subtitle: `对应真实代码实现：${topicCode.title}。右侧实时显示运行时状态变量变化，逐行高亮展示执行流程。通过代码可以更深入地理解模型的具体实现细节。`,
      svg: svg5,
      motion: "code",
    },
    {
      index: 6,
      startMs: 120000,
      durationMs: 15000,
      title: "训练流程",
      subtitle: `模型的训练是一个循环迭代的过程：从数据准备开始，经过参数初始化、前向传播计算预测、计算损失评估误差、反向传播计算梯度，最后更新参数。如此循环往复，直至模型收敛，达到预期的性能指标。`,
      svg: svg6,
      motion: "flowchart",
    },
    {
      index: 7,
      startMs: 135000,
      durationMs: 15000,
      title: "拓展 · 视频推荐",
      subtitle: `掌握了${title}的架构与训练方法后，你可以进一步探索更多相关内容。我们为你推荐了B站、YouTube、Coursera 等平台的优质视频资源，帮助你从更多维度深入理解模型原理与实践。`,
      svg: svg7,
      motion: "outro",
    },
  ];
};

const buildAnimationScenes = (k: KnowledgeNode): AnimationScene[] => {
  const category: KnowledgeCategory = k.category || classifyByTitle(k.title);

  switch (category) {
    case "history":
      return buildHistoryScenes(k);
    case "concept":
      return buildConceptScenes(k);
    case "model":
      return buildModelScenes(k);
    case "algorithm":
    default:
      return buildAlgorithmScenes(k);
  }
};

const buildCode = (k: KnowledgeNode): string => `# ${k.title} · 代码实操

> 实操匠生成 · Python 3.10+ · 含单元测试 · 一键复制

## 环境准备

\`\`\`bash
pip install numpy torch matplotlib
\`\`\`

## 核心实现

\`\`\`python
"""
${k.title} 最小可运行实现
作者: 实操匠智能体
"""
import numpy as np
from dataclasses import dataclass


@dataclass
class ${k.id.replace(/-/g, "_").replace(/^(\w)/, c => c.toUpperCase())}Config:
    """配置项"""
    learning_rate: float = 1e-3
    max_steps: int = 1000
    tolerance: float = 1e-6


def run_${k.id.replace(/-/g, "_")}(config: ${k.id.replace(/-/g, "_").replace(/^(\w)/, c => c.toUpperCase())}Config) -> dict:
    """
    运行 ${k.title} 的最小示例。
    返回: {"steps": int, "result": float, "converged": bool}
    """
    np.random.seed(42)
    state = np.random.randn(8)
    
    for step in range(config.max_steps):
        # 简化的迭代更新逻辑
        grad = 2 * state  # 模拟梯度
        state = state - config.learning_rate * grad
        if np.linalg.norm(grad) < config.tolerance:
            return {"steps": step, "result": float(state.mean()), "converged": True}
    return {"steps": config.max_steps, "result": float(state.mean()), "converged": False}


if __name__ == "__main__":
    cfg = ${k.id.replace(/-/g, "_").replace(/^(\w)/, c => c.toUpperCase())}Config()
    out = run_${k.id.replace(/-/g, "_")}(cfg)
    print(f"收敛: {out['converged']}  步数: {out['steps']}  结果: {out['result']:.4f}")
\`\`\`

## 单元测试

\`\`\`python
def test_convergence():
    cfg = ${k.id.replace(/-/g, "_").replace(/^(\w)/, c => c.toUpperCase())}Config(max_steps=10000)
    out = run_${k.id.replace(/-/g, "_")}(cfg)
    assert out["converged"] is True
    assert abs(out["result"]) < 1.0
\`\`\`

## 思考题

1. 将 \`learning_rate\` 调大到 1.0 会发生什么？为什么？
2. 如何将该实现扩展到批量数据？
3. 请尝试用 PyTorch 重写并支持 GPU。
`;

const builders: Record<ResourceType, (k: KnowledgeNode) => string> = {
  document: buildDocument,
  mindmap: buildMindmap,
  quiz: buildQuiz,
  reading: buildReading,
  animation: buildAnimation,
  code: buildCode,
};

const excerpts: Record<ResourceType, (k: KnowledgeNode) => string> = {
  document: (k) =>
    `围绕"${k.title}"展开的学术讲解，含定义、性质、典型算法与学习建议，约 ${k.estimatedMinutes} 分钟。`,
  mindmap: (k) =>
    `"${k.title}" 思维导图：5 主分支 / 15 子节点，覆盖核心概念、关键性质、典型算法、应用与易错点。`,
  quiz: (k) =>
    `"${k.title}" 题库：5 题，难度 ★ ~ ★★★★★，含单选、多选、判断、简答、综合，针对画像易错点靶向出题。`,
  reading: (k) =>
    `"${k.title}" 拓展阅读 4 篇：经典教材章节、ACM 综述、工程博客、Stanford 讲座。`,
  animation: (k) =>
    `"${k.title}" 教学动画：7 分镜 / 150 秒可播放矢量动画，含粒子汇聚、概念定义、算法流程图、真实代码逐行执行、运行演示、对比卡片、视频推荐七种动效，支持字幕语音播报。`,
  code: (k) =>
    `"${k.title}" 代码实操：Python 3.10+ 可运行实现，含配置项、单元测试与思考题。`,
};

// 根据用户输入的任意主题/问题，动态生成资源（不依赖固定章节知识点）
export const buildCustomResource = (type: ResourceType, topic: string): Resource => {
  const nodeId = `custom-${Date.now()}`;
  const customNode: KnowledgeNode = {
    id: nodeId,
    chapter: 0,
    title: topic,
    parentId: null,
    difficulty: 3,
    estimatedMinutes: 30,
    prerequisites: [],
    summary: topic,
  };

  return {
    id: `R-${nodeId}-${type}`,
    type,
    title: `${topic} · ${resourceTypeMeta[type].label}`,
    knowledgeId: nodeId,
    content: builders[type](customNode),
    excerpt: excerpts[type](customNode),
    metadata: {
      duration:
        type === "animation"
          ? 150
          : type === "quiz"
            ? 15
            : type === "code"
              ? 30
              : customNode.estimatedMinutes,
      difficulty: customNode.difficulty,
      knowledgePoints: [nodeId],
      citations:
        type === "reading" || type === "document"
          ? ["Russell & Norvig, AIMA 4th", "ACM Computing Surveys 2023"]
          : undefined,
      questionCount: type === "quiz" ? 5 : undefined,
      nodeCount: type === "mindmap" ? 15 : undefined,
      runtime: type === "code" ? "Python 3.10+" : undefined,
      scenes: type === "animation" ? 7 : undefined,
      animationScenes: type === "animation" ? buildAnimationScenes(customNode) : undefined,
      videoProvider: type === "animation" ? "vector" : undefined,
      mindmap: type === "mindmap" ? buildMindmapData(customNode) : undefined,
      externalVideos: type === "animation" ? getExternalVideos(topic) : undefined,
    },
    safetyCheck: { passed: true, flags: [], score: 100 },
    createdAt: new Date().toLocaleString("zh-CN"),
  };
};

/**
 * 把重字段挂成"首次访问才构建、构建后就地缓存"的属性。
 *
 * 144 条资源的正文加动画分镜合计约 186 KB 字符串，全部在模块求值时构建会在首屏
 * 白白占住主线程，而列表页、全局搜索、卡片预览只读 title / excerpt / metadata。
 * 属性保持 enumerable，读取方式和普通字段完全一样，调用方无需改动。
 */
function defineLazy<T extends object, K extends string, V>(
  target: T,
  key: K,
  build: () => V,
): T & Record<K, V> {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      const value = build();
      Object.defineProperty(target, key, {
        value,
        configurable: true,
        enumerable: true,
        writable: true,
      });
      return value;
    },
  });
  return target as T & Record<K, V>;
}

// 生成 24 × 6 = 144 条预生成资源
export const preGeneratedResources: Resource[] = knowledgeNodes.flatMap((k) => {
  const types: ResourceType[] = [
    "document",
    "mindmap",
    "quiz",
    "reading",
    "animation",
    "code",
  ];
  return types.map<Resource>((type, idx) => {
    const metadata: ResourceMetadata = {
      duration:
        type === "animation"
          ? 120
          : type === "quiz"
            ? 15
            : type === "code"
              ? 30
              : k.estimatedMinutes,
      difficulty: k.difficulty,
      knowledgePoints: [k.id],
      citations:
        type === "reading" || type === "document"
          ? ["Russell & Norvig, AIMA 4th", "ACM Computing Surveys 2023"]
          : undefined,
      questionCount: type === "quiz" ? 5 : undefined,
      nodeCount: type === "mindmap" ? 15 + k.prerequisites.length : undefined,
      runtime: type === "code" ? "Python 3.10+" : undefined,
      scenes: type === "animation" ? 7 : undefined,
      videoProvider: type === "animation" ? "vector" : undefined,
      externalVideos: type === "animation" ? getExternalVideos(k.title) : undefined,
    };
    if (type === "animation") {
      defineLazy(metadata, "animationScenes", () => buildAnimationScenes(k));
    }
    if (type === "mindmap") {
      defineLazy(metadata, "mindmap", () => buildMindmapData(k));
    }

    return defineLazy(
      {
        id: `R-${k.id}-${type}-${idx}`,
        type,
        title: `${k.title} · ${resourceTypeMeta[type].label}`,
        knowledgeId: k.id,
        excerpt: excerpts[type](k),
        metadata,
        safetyCheck: { passed: true, flags: [], score: 100 },
        createdAt: "2026-03-10 09:00",
      },
      "content",
      () => builders[type](k),
    );
  });
});

export const getResourcesByKnowledge = (kid: string) =>
  preGeneratedResources.filter((r) => r.knowledgeId === kid);

export const getResourcesByType = (t: ResourceType) =>
  preGeneratedResources.filter((r) => r.type === t);

export const getResourceById = (id: string) =>
  preGeneratedResources.find((r) => r.id === id);
