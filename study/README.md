# 智学灵境 EduVerse · 高等教育个性化学习多智能体系统

> 借助大模型技术体系，融合前沿 AI 技术，构建高等教育个性化学习资源体系与智能学习智能体系统，切实满足学生的个性化、多模态学习需求。

面向高等教育场景的多智能体协同学习平台。系统以「东方智学 × 未来学术」为设计调性，采用自研轻量多智能体编排框架，由 7 个角色化智能体协作完成对话式画像构建、6 类多模态学习资源生成、个性化路径规划、智能辅导与学习评估五大核心能力，真正实现「因材施教」的数字化落地。

---

## 一、核心亮点

- **多智能体协同架构**：自研轻量编排器，7 个角色化智能体（灵境队长、解构者、编织者、出题官、视觉师、实操匠、校验官）按编队协作完成资源生成全链路。
- **对话式画像自主构建**：5 轮自然语言对话自动抽取 **6 维特征**（知识基础 / 认知风格 / 易错偏好 / 学习节奏 / 兴趣方向 / 目标导向），支持随学随新。
- **6 类多模态资源生成**：讲解文档、思维导图、练习题库、拓展阅读、教学动画、代码实操案例，**144 条**预生成资源 + 流式生成。其中**思维导图**为交互式 ReactFlow 图谱，**教学动画**为 7 分镜可播放矢量动画，配备播放/暂停/进度拖拽/分镜跳转/字幕同步/语音控制的完整播放器。
- **个性化学习路径**：SVG 路径图谱 + 5 状态色节点 + 动态调优，依托画像与多智能体协同规划学习步骤。
- **智能辅导**：流式答疑 + 多模态卡片（图解 / 代码 / 表格）+ 上下文记忆。
- **学习效果评估**：4 指标卡 + 5 维雷达 + 24 知识点热力图 + 薄弱点 TOP3 + 调优方案。
- **决赛演示模式**：一键载入完整学习样例，以 180 秒引导串联画像证据、智能体协作、路径依据、练习回流和效果评估。
- **可持续学习闭环**：计划任务可深链到学习与测评，完成结果会写回学习记录、掌握度、路径状态和计划进度。
- **防幻觉四重校验**：知识点白名单 / 语法校验 / 敏感词过滤 / 引用补全。
- **流式输出 + 进度追踪**：避免白屏等待，生成过程可视化（thinking → generating → validating → done）。
- **双主题切换**：墨夜（深色默认）+ 宣纸（浅色）。
- **响应式导航与全局搜索**：移动端抽屉导航，支持 `Cmd/Ctrl + K` 搜索页面、知识点、资源和智能体。
- **按需加载与异常降级**：页面级懒加载、依赖分包、错误边界与独立 404 页面。
- **Canvas 粒子背景 + 玻璃态卡片 + 流光边框**，符合现代 AI 产品交互规范。

---

## 二、技术栈

| 层级 | 技术 |
| --- | --- |
| 前端框架 | React 18.3 + TypeScript 5.6 |
| 构建工具 | Vite 6.0 |
| 样式方案 | Tailwind CSS 3.4 + CSS 变量 |
| 状态管理 | zustand 5.0 |
| 路由 | react-router-dom 7 |
| 动效 | framer-motion 11 |
| Markdown | react-markdown 9 + remark-gfm + 定制 lowlight 高亮 |
| 图标 | lucide-react |
| 多智能体 | 自研轻量编排器（async generator 流式输出） |
| 课程示例 | 《人工智能导论》24 知识点（6 章） |

> 说明：智能体开发框架不做限制，本系统采用自研轻量多智能体编排器，未引入第三方 Agent 框架，避免外部依赖。后续若接入真实大模型，AI 辅助工具优先选用 **科大讯飞星火**（已预留 Provider 接口，详见 `docs/AI-Coding使用说明.md`）。

---

## 三、快速开始

### 1. 环境要求

- Node.js ≥ 20
- npm ≥ 9（或 pnpm / yarn 任选）

### 2. 安装与启动

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 类型检查
npm run check

# 单元测试
npm test

# 覆盖率测试
npm run test:coverage

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

建议交付前执行一键质量门禁（类型、规范、测试覆盖率、生产构建）：

```bash
npm run quality
```

### 3. 首次使用

1. 打开 `http://localhost:5173`，进入「Onboarding 对话引导」。
2. 选择已有学习者直接继续，或以新同学身份完成对话式画像构建。
3. 系统自动构建 6 维画像并生成首条学习路径。
4. 进入工作台首页，可访问 10 个核心页面：
   - **决赛演示** — 180 秒评审路线 + 可点击产品证据
   - **工作台** — 仪表盘 + 快捷入口
   - **资源工坊** — 流式生成多模态学习资源
   - **学习画像** — 6 维雷达 + 版本时间线
   - **学习计划** — 阶段里程碑 + 每日任务
   - **学习路径** — SVG 图谱 + 节点详情
   - **题库训练** — 专项练习 + 社区共创
   - **智能辅导** — 流式答疑
   - **学习评估** — 多维度评估报告
   - **资源中心** — 144 条资源瀑布流

---

## 四、目录结构

```
study/
├── docs/                          # 配套文档
│   ├── 系统开发说明书.md
│   ├── 测试说明书.md
│   └── AI-Coding使用说明.md
├── .trae/documents/               # PRD 与技术架构
│   ├── PRD-个性化学习多智能体系统.md
│   └── 技术架构文档.md
├── public/
│   └── favicon.svg
├── src/
│   ├── agents/
│   │   └── orchestrator.ts        # 多智能体编排器（核心）
│   ├── components/
│   │   ├── DemoGuide.tsx          # 5 步决赛演示引导
│   │   ├── ParticleBg.tsx         # Canvas 粒子背景
│   │   ├── AgentAvatar.tsx        # 智能体头像
│   │   ├── RadarChart.tsx         # SVG 雷达图
│   │   ├── MarkdownRenderer.tsx   # Markdown 渲染
│   │   ├── ResourceCard.tsx       # 6 类资源卡
│   │   ├── MindmapViewer.tsx      # ReactFlow + Dagre 思维导图
│   │   ├── AgentLogPanel.tsx      # 协作日志面板
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Topbar.tsx
│   │       └── AppShell.tsx
│   ├── data/
│   │   ├── course.ts              # 《人工智能导论》24 知识点
│   │   ├── agents.ts              # 7 智能体定义
│   │   ├── learner.ts             # Mock 学生 + 画像 + 路径
│   │   └── resources.ts           # 144 条预生成资源
│   ├── lib/
│   │   └── utils.ts               # cn() 工具
│   ├── pages/
│   │   ├── Onboarding.tsx         # 对话式画像构建
│   │   ├── Showcase.tsx           # 决赛演示与证据总览
│   │   ├── Home.tsx               # 工作台首页
│   │   ├── Workshop.tsx           # 资源工坊
│   │   ├── Profile.tsx            # 学习画像
│   │   ├── LearningPath.tsx       # 学习路径
│   │   ├── StudyPlan.tsx          # 学习计划与闭环任务
│   │   ├── Practice.tsx           # 题库训练
│   │   ├── Tutor.tsx              # 智能辅导
│   │   ├── Assessment.tsx         # 学习评估
│   │   └── Library.tsx            # 资源中心
│   ├── services/
│   │   ├── streaming.ts           # 流式输出工具
│   │   └── safety.ts              # 防幻觉校验官
│   ├── store/
│   │   └── useAppStore.ts         # zustand 全局状态
│   ├── types/
│   │   └── index.ts               # 全部 TypeScript 类型
│   ├── App.tsx                    # 路由配置
│   ├── main.tsx                   # 入口
│   └── index.css                  # 全局样式 + 设计系统
├── tests/                         # 66 项核心逻辑回归测试
├── vitest.config.ts               # 覆盖率阈值与测试配置
├── FINALS_READINESS_REPORT.md     # 决赛演示脚本与验收证据
├── index.html
├── package.json
├── tailwind.config.js             # 设计令牌（色板/动画/圆角）
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 五、多智能体编队

| 智能体 | 角色定位 | 主要职责 |
| --- | --- | --- |
| **灵境** (Captain) | 队长 / 对话协调 | 对话式画像构建、智能辅导答疑、任务调度 |
| **解构者** (Architect) | 知识架构师 | 拆解知识点、生成讲解文档与拓展阅读 |
| **编织者** (Weaver) | 思维导图师 | 生成 SVG 思维导图、知识点关联 |
| **出题官** (QuizMaster) | 题库构建师 | 生成选择 / 填空 / 简答 / 应用题 |
| **视觉师** (Visualist) | 多模态创作 | 生成教学动画 SVG、图解 |
| **实操匠** (CodeArtisan) | 代码实操师 | 生成代码案例、实践项目 |
| **校验官** (Validator) | 防幻觉守门人 | 白名单 / 语法 / 敏感词 / 引用四重校验 |

### 编排流程

```
用户请求 → 灵境(调度) → 角色 Agent(生成) → 校验官(校验) → 资源入库
                ↓               ↓                ↓
            thinking       generating       validating → done
```

---

## 六、6 类多模态资源

| 类型 | 标识 | 生成智能体 | 内容形态 |
| --- | --- | --- | --- |
| 讲解文档 | `document` | 解构者 | Markdown 学术文档 |
| 思维导图 | `mindmap` | 编织者 | 交互式 ReactFlow 思维导图（5-6 主分支 · 15-20 子节点 · Dagre 自动布局 / 拖拽平移 / 滚轮缩放 / 悬停 tooltip / 4 主题配色 / 节点发光效果 / 迷你地图 + 控制栏） |
| 练习题库 | `quiz` | 出题官 | 多题型 + 答案解析 |
| 拓展阅读 | `reading` | 解构者 | 学术文献 + 评论 |
| 教学动画 | `animation` | 视觉师 + 编织者 + 实操匠 | 5 分镜可播放矢量动画（粒子汇聚 / 算法流程图 / 目标代码逐行执行 / 对比卡片 / 场景轮播 + 播放器：play/pause/seek/分镜跳转/字幕同步） |
| 代码实操 | `code` | 实操匠 | 可运行代码 + 注释 |

---

## 七、防幻觉机制

`src/services/safety.ts` 中 `Validator.validate()` 实现 **四重校验**：

1. **知识点白名单**：内容必须命中课程知识点白名单
2. **语法校验**：Markdown / 代码块结构合法
3. **敏感词过滤**：内置敏感词表，命中即拒
4. **引用补全**：学术内容需包含可追溯引用

校验通过返回 `{ passed: true, flags: [], score: 100 }`，未通过的资源不会进入资源中心。

---

## 八、文档索引

| 文档 | 路径 | 说明 |
| --- | --- | --- |
| 产品需求文档 | `.trae/documents/PRD-个性化学习多智能体系统.md` | 完整 PRD |
| 技术架构文档 | `.trae/documents/技术架构文档.md` | 架构 / 智能体 / 数据流 |
| 系统开发说明书 | `docs/系统开发说明书.md` | 8 章开发全流程 |
| 测试说明书 | `docs/测试说明书.md` | 11 个测试用例 + 性能 / 兼容性 |
| AI Coding 使用说明 | `docs/AI-Coding使用说明.md` | 含科大讯飞星火接入示例 |

---

## 九、大模型接入（可选）

当前 Demo 阶段使用 **本地剧本式回放**，未接入真实大模型 API，所有流式输出由 `src/services/streaming.ts` 的 `streamText()` 模拟。

如需接入真实大模型，已预留 Provider 接口，推荐使用 **科大讯飞星火** 大模型：

```typescript
// 示例：在 src/services/streaming.ts 中替换 streamText 实现
import { SparkProvider } from "./providers/spark";

const spark = new SparkProvider({
  apiKey: import.meta.env.VITE_SPARK_API_KEY,
  appId: import.meta.env.VITE_SPARK_APP_ID,
});

export async function* streamText(text: string, options?: StreamOptions) {
  const stream = await spark.chatStream(text);
  for await (const chunk of stream) {
    yield chunk;
  }
}
```

### 多模态视频生成扩展（SeeDance 等）

教学动画当前由「视觉师」+「编织者」+「实操匠」三个智能体协作生成 **7 分镜 SVG 矢量动画 + CSS 时序动画**：

- 分镜 1：问题导入与主题聚焦
- 分镜 2：形式化定义与核心公式
- 分镜 3：算法或概念流程可视化
- 分镜 4：真实代码逐行执行
- 分镜 5：运行状态与变量演示
- 分镜 6：关键性质与方法对比
- 分镜 7：应用拓展与视频推荐

通过自研播放器（`src/components/AnimationPlayer.tsx`）渲染。`Resource.metadata.videoProvider` 字段已预留多模态生成大模型来源标识，当前值为 `"vector"`，可扩展为：

- `"seedance"` — 接入 SeeDance 多模态生成大模型，输出真实视频流
- `"spark-tts"` — 接入讯飞星火 TTS + 视频生成

扩展时只需在 `buildAnimationScenes()` 中替换 SVG 为视频 URL，播放器组件已设计为可切换渲染源。

详细接入步骤见 `docs/AI-Coding使用说明.md`。

---

## 十、测试数据

系统预置了一门完整的《人工智能导论》课程作为初始知识库：

- **6 章 24 知识点**：机器学习概览、监督学习、神经网络、深度学习、强化学习、AI 前沿
- **Mock 学生**：林知远（大三 · 计算机科学与技术）
- **初始画像 + 更新画像**：演示随学随新
- **18 节点学习路径**：覆盖推荐 / 进行中 / 已完成 / 待解锁 / 薄弱 5 种状态
- **144 条预生成资源**：24 知识点 × 6 类型，开箱即用
- **10 条学习行为记录**：用于评估页热力图
- **5 维评估指标**：知识掌握 / 应用能力 / 学习投入 / 路径完成 / 综合表现

---

## 十一、开源协议与依赖标注

本项目使用的开源依赖均遵循其原始协议，主要依赖包括：

| 依赖 | 协议 | 用途 |
| --- | --- | --- |
| React 18 | MIT | UI 框架 |
| Vite 6 | MIT | 构建工具 |
| Tailwind CSS 3 | MIT | 样式方案 |
| framer-motion 11 | MIT | 动效 |
| zustand 5 | MIT | 状态管理 |
| react-markdown 9 | MIT | Markdown 渲染 |
| lucide-react | ISC | 图标库 |

完整依赖列表见 `package.json`。

---

## 十二、AI Coding 工具使用说明

本项目开发过程中使用了 AI Coding 工具辅助开发，主要包括：

- **代码生成**：组件骨架、类型定义、Mock 数据生成
- **文档撰写**：PRD、技术架构、开发说明书、测试说明书
- **代码审查**：TypeScript 类型检查、潜在问题排查

按赛题要求，AI 辅助工具选用 **科大讯飞星火** 系列。详细使用记录与接入示例见 `docs/AI-Coding使用说明.md`。

---

## 十三、演示流程建议

1. **Onboarding 对话引导**（约 1 分钟）— 展示对话式画像构建
2. **工作台首页**（约 1 分钟）— 仪表盘 + 智能体编队 + 雷达图
3. **资源工坊**（约 2 分钟）— 触发流式生成 + 协作日志 + 防幻觉
4. **学习画像**（约 30 秒）— 6 维雷达 + 版本时间线 + 随学随新
5. **学习路径**（约 30 秒）— SVG 图谱 + 节点详情
6. **智能辅导**（约 1 分钟）— 流式答疑 + 多模态卡片
7. **学习评估**（约 30 秒）— 热力图 + 薄弱点 + 调优方案
8. **资源中心**（约 30 秒）— 瀑布流 + 筛选 + 详情

---

## License

本项目用于参赛演示，未设开源协议。
