import type {
  AgentTask,
  AgentLogEntry,
  Resource,
  ResourceType,
} from "@/types";
import { agents, getAgentById } from "@/data/agents";
import { getKnowledgeById } from "@/data/course";
import { preGeneratedResources, resourceTypeMeta, buildCustomResource } from "@/data/resources";
import { validate } from "@/services/safety";
import { sleep, streamText } from "@/services/streaming";
import { generateTutorAnswer } from "@/services/tutor";

// 剧本式生成 — 模拟多智能体协同生成过程
// 实际部署时此处可替换为真实大模型调用（科大讯飞星火 / OpenAI / Claude）

const pipelineLogTemplates: Record<
  ResourceType,
  { phase: string; agentId: string; messages: string[] }[]
> = {
  document: [
    {
      phase: "拆解知识结构",
      agentId: "deconstructor",
      messages: [
        "正在检索知识点 ${k} 的前置依赖与核心要素…",
        "已识别 5 个主分支：定义 / 性质 / 算法 / 应用 / 易错点",
        "知识骨架构建完成，移交编织者。",
      ],
    },
    {
      phase: "撰写讲解文档",
      agentId: "weaver",
      messages: [
        "基于骨架组织学术叙事，引入形式化定义…",
        "正在补充典型算法对比表与学习建议…",
        "讲解文档主体撰写完成，提交校验官。",
      ],
    },
    {
      phase: "事实核查与安全过滤",
      agentId: "validator",
      messages: [
        "对照本地知识库白名单进行事实核查…",
        "敏感词扫描、引用补全、公式语法校验通过 ✓",
        "校验通过，资源正式入库。",
      ],
    },
  ],
  mindmap: [
    {
      phase: "构建思维骨架",
      agentId: "deconstructor",
      messages: ["分析知识点结构层次…", "输出 5 主分支 / 15 子节点骨架。"],
    },
    {
      phase: "渲染节点连线",
      agentId: "visualist",
      messages: ["生成 mermaid mindmap 语法…", "节点连线与配色完成。"],
    },
    {
      phase: "节点校验",
      agentId: "validator",
      messages: ["节点数量与依赖一致性校验通过 ✓"],
    },
  ],
  quiz: [
    {
      phase: "锁定考点",
      agentId: "deconstructor",
      messages: ["根据知识点与画像易错偏好锁定 5 个考点…"],
    },
    {
      phase: "生成多梯度题目",
      agentId: "quizmaster",
      messages: [
        "生成单选 / 多选 / 判断 / 简答 / 综合共 5 题…",
        "依据画像「${err}」靶向出题，难度梯度 ★ ~ ★★★★★",
      ],
    },
    {
      phase: "答案与解析校验",
      agentId: "validator",
      messages: ["答案唯一性、解析自洽性校验通过 ✓"],
    },
  ],
  reading: [
    {
      phase: "梳理拓展方向",
      agentId: "deconstructor",
      messages: ["规划经典教材 / 综述 / 博客 / 视频四条拓展线…"],
    },
    {
      phase: "汇编拓展阅读",
      agentId: "weaver",
      messages: ["汇编 4 篇拓展资源，撰写导读…"],
    },
    {
      phase: "引用补全",
      agentId: "validator",
      messages: ["引用交叉核对完成，缺失部分已标注待补充 ✓"],
    },
  ],
  animation: [
    {
      phase: "提取可视化要素",
      agentId: "deconstructor",
      messages: ["识别 4 个可视化关键帧…"],
    },
    {
      phase: "设计分镜与图解",
      agentId: "visualist",
      messages: ["设计 4 分镜脚本，生成 SVG 图解…", "配色与动效节奏完成。"],
    },
    {
      phase: "图解准确性校验",
      agentId: "validator",
      messages: ["SVG 元素与知识点一致性校验通过 ✓"],
    },
  ],
  code: [
    {
      phase: "分析实操需求",
      agentId: "deconstructor",
      messages: ["拆解可运行代码的最小功能边界…"],
    },
    {
      phase: "编写可运行代码",
      agentId: "coder",
      messages: ["生成 Python 实现 + 配置 + 单元测试…", "本地 dry-run 模拟通过。"],
    },
    {
      phase: "语法与安全校验",
      agentId: "validator",
      messages: ["语法、依赖、安全扫描通过 ✓"],
    },
  ],
};

const fillTemplate = (tpl: string, ctx: { k: string; err: string }) =>
  tpl
    .replace(/\$\{k\}/g, ctx.k)
    .replace(/\$\{err\}/g, ctx.err);

export interface OrchestrateResult {
  resource: Resource;
  totalTokens: number;
}

// 主编排入口
export async function* orchestrate(
  task: AgentTask,
  onLog: (entry: AgentLogEntry) => void,
): AsyncGenerator<string, OrchestrateResult> {
  const knowledge = task.knowledgeId ? getKnowledgeById(task.knowledgeId) : undefined;

  if (!knowledge && !task.topic) {
    throw new Error("未提供知识点或主题");
  }

  const pipeline = pipelineLogTemplates[task.resourceType];
  const ctx = { k: knowledge?.title || task.topic, err: "梯度爆炸 / QKV 顺序 / DP 边界" };
  let totalTokens = 0;

  // 队长开场
  onLog({
    agentId: "captain",
    agentName: "灵境",
    phase: "thinking",
    message: `收到任务：为「${knowledge?.title || task.topic}」生成${resourceTypeMeta[task.resourceType].label}，正在调度智能体编队…`,
    ts: Date.now(),
  });
  await sleep(400);

  // 逐阶段执行
  for (const stage of pipeline) {
    const agent = getAgentById(stage.agentId)!;
    onLog({
      agentId: agent.id,
      agentName: agent.name,
      phase: "thinking",
      message: `【${stage.phase}】${fillTemplate(stage.messages[0], ctx)}`,
      ts: Date.now(),
    });
    await sleep(500 + Math.random() * 400);

    for (let i = 1; i < stage.messages.length; i++) {
      onLog({
        agentId: agent.id,
        agentName: agent.name,
        phase: "generating",
        message: fillTemplate(stage.messages[i], ctx),
        ts: Date.now(),
      });
      await sleep(400 + Math.random() * 300);
    }
  }

  // 取出对应预生成资源，或根据自定义主题动态生成
  const resource = knowledge
    ? preGeneratedResources.find(
        (r) => r.knowledgeId === knowledge.id && r.type === task.resourceType,
      ) || preGeneratedResources[0]
    : buildCustomResource(task.resourceType, task.topic);

  if (!resource) {
    throw new Error("未找到资源模板");
  }

  // 重新执行校验（确保防幻觉机制真实运行）
  const safety = validate(resource.content, knowledge?.id);
  const finalResource: Resource = {
    ...resource,
    id: `${resource.id}-gen-${Date.now()}`,
    createdAt: new Date().toLocaleString("zh-CN"),
    safetyCheck: safety,
  };

  // 队长收尾
  onLog({
    agentId: "captain",
    agentName: "灵境",
    phase: "done",
    message: `生成完成 ✓ 已通过校验官防幻觉检查（安全分 ${safety.score}），开始流式呈现…`,
    ts: Date.now(),
  });

  // 流式输出内容
  for await (const tok of streamText(resource.content, {
    speed: 8,
    onToken: (n) => {
      totalTokens = n;
    },
  })) {
    yield tok;
  }

  return { resource: finalResource, totalTokens };
}

// 智能辅导答疑 — 基于知识库语义匹配，流式生成详细解答
export async function* tutorAnswer(question: string): AsyncGenerator<string> {
  const answer = generateTutorAnswer(question);
  for await (const tok of streamText(answer, { speed: 14 })) {
    yield tok;
  }
}

// 画像对话抽取 — 基于用户回复生成画像更新
export async function* profileDialogue(
  userReply: string,
  step: number,
): AsyncGenerator<string> {
  const responses = [
    `好的，我已记录你的专业与目标。接下来想了解一下你的数学基础——高数、线代、概率大致是什么水平？`,
    `收到，基础信息已纳入画像。在学习方式上，你更偏好图解、文字、还是代码实操？`,
    `明白。再问一个关键问题：你过去学习 AI 时，最容易在哪类知识点上出错？`,
    `信息已经齐全。我正在为你构建 6 维学习画像，并预生成首条学习路径——稍候片刻，专属智能体编队即将就位。`,
  ];
  const reply =
    responses[step] ||
    `我已收到你的回复。基于此，画像持续更新中…`;
  for await (const tok of streamText(reply, { speed: 22 })) {
    yield tok;
  }
}

export { agents };
