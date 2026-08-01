# AI Coding 工具使用说明

> 智学灵境 EduVerse 项目开发过程中 AI 辅助编程工具的使用说明
> 文档日期：2026-07-18

---

## 一、使用概述

本项目在开发过程中使用了 **TRAE IDE**（含内置 AI 编程助手）作为主要的 AI Coding 工具，辅助完成从需求分析、架构设计到代码实现、测试验证的全流程开发。

## 二、TRAE IDE 使用详情

### 2.1 工具信息

| 项 | 说明 |
|----|------|
| 工具名称 | TRAE IDE |
| 工具类型 | AI 驱动的集成开发环境 |
| 使用版本 | 最新版 |
| 主要能力 | 自然语言对话编程、代码生成、项目脚手架、实时预览、浏览器自动化测试 |

### 2.2 使用环节

| 开发环节 | AI 辅助内容 |
|---------|------------|
| 需求分析 | 通过对话梳理赛题要求，生成 PRD 产品需求文档 |
| 架构设计 | 生成技术架构文档（含 Mermaid 架构图、ER 图、流程图） |
| 项目初始化 | 使用 web-dev skill 脚手架自动初始化 React + TS + Vite + Tailwind 项目 |
| 代码实现 | 生成全部组件、页面、智能体编排器、服务层、状态管理代码 |
| 数据构造 | 生成 24 知识点课程库、144 条预生成资源、Mock 学生画像 |
| 视觉设计 | 生成设计系统（色板、字体、动效、玻璃态卡片） |
| 测试验证 | 通过浏览器自动化 subagent 验证 UI 渲染与交互 |
| 文档撰写 | 生成系统开发说明书、测试说明书、本说明 |

### 2.3 使用方式

1. **Skill 调用**：通过 web-dev skill 触发完整的 Web 应用开发工作流（PRD → 架构 → 实现）
2. **对话式编程**：用自然语言描述需求，AI 生成对应代码并自动写入文件
3. **多智能体协作**：使用 Task 工具并行调度 search / general_purpose_task / browser_use 等 subagent
4. **实时预览**：启动 Vite dev server 后通过 OpenPreview 实时查看效果
5. **类型检查**：通过 `npm run check` 验证 TypeScript 类型安全

### 2.4 人工审核与把控

所有 AI 生成内容均经过人工审核：
- 代码逻辑正确性校验
- TypeScript 类型检查（`npm run check` 通过）
- 浏览器运行时验证
- 文档内容与实现一致性核对
- 防幻觉与安全机制人工复核

## 三、科大讯飞相关工具使用说明

赛题要求"开发过程中使用的其他 AI 辅助工具，需选用科大讯飞相关工具"。本项目在以下环节预留/使用科大讯飞工具接入点：

### 3.1 已预留接入点

| 接入点 | 文件 | 说明 |
|--------|------|------|
| 大模型生成 | `src/agents/orchestrator.ts` | `orchestrate()` 函数预留 Provider 接口，可对接**讯飞星火大模型 API** 替换本地剧本式回放 |
| 智能辅导 | `src/agents/orchestrator.ts` | `tutorAnswer()` 可对接星火对话 API |
| 画像对话 | `src/agents/orchestrator.ts` | `profileDialogue()` 可对接星火对话 API |
| 内容安全 | `src/services/safety.ts` | `validate()` 可对接**讯飞内容审核 API** 增强敏感词与违规内容过滤 |

### 3.2 接入示例（星火大模型）

生产部署时，在 `orchestrator.ts` 中实现讯飞星火接入：

```typescript
// 示例：对接讯飞星火大模型
import SparkService from './spark-provider';

export async function* orchestrate(task, onLog) {
  // ...智能体调度逻辑...
  
  // 替换本地剧本为真实星火 API 调用
  const spark = new SparkService({
    appId: process.env.SPARK_APP_ID,
    apiKey: process.env.SPARK_API_KEY,
    apiSecret: process.env.SPARK_API_SECRET,
  });
  
  const stream = await spark.chatStream({
    messages: buildPrompt(task, knowledge),
  });
  
  for await (const chunk of stream) {
    yield chunk.content;
  }
}
```

### 3.3 接入示例（内容审核）

```typescript
// 示例：对接讯飞内容审核
import { ContentModerationClient } from './xfyun-moderation';

export async function validate(content: string) {
  const client = new ContentModerationClient({...});
  const result = await client.detectText(content);
  return {
    passed: result.passed,
    flags: result.riskLabels,
    score: result.confidence,
  };
}
```

## 四、AI Coding 使用总结

| 维度 | 传统开发 | AI Coding（本项目） |
|------|---------|-------------------|
| 需求文档 | 手工撰写 1-2 天 | 对话生成 30 分钟 |
| 架构设计 | 手工画图 1 天 | Mermaid 自动生成 |
| 代码实现 | 1-2 周 | 1 天（含审核） |
| 测试文档 | 手工撰写 1 天 | 自动生成 |
| 质量保障 | 人工 review | TypeScript + 浏览器自动化 |

**结论**：AI Coding 工具显著提升了开发效率，但所有产出均经人工审核把关，确保代码质量与内容安全符合赛题要求。
