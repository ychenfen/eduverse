// 校验官 · 防幻觉与安全过滤服务

const SENSITIVE_WORDS = [
  // 极简示意词表，生产应接入专业内容安全 API（如科大讯飞内容审核）
  "暴力",
  "色情",
  "赌博",
  "毒品",
  "自残",
];

const KNOWN_KNOWLEDGE_IDS = new Set([
  "ai-intro",
  "ai-history",
  "ai-schools",
  "ai-ethics",
  "search-uninformed",
  "search-informed",
  "search-local",
  "search-adversarial",
  "kr-logic",
  "kr-frame",
  "kr-uncertain",
  "kr-knowledge-graph",
  "ml-overview",
  "ml-linear",
  "ml-tree",
  "ml-eval",
  "dl-fundamentals",
  "dl-cnn",
  "dl-rnn",
  "dl-transformer",
  "llm-pretrain",
  "llm-rag",
  "llm-agent",
  "llm-multiagent",
]);

export interface SafetyResult {
  passed: boolean;
  flags: string[];
  score: number; // 0-100，越高越安全
}

export function validate(content: string, knowledgeId?: string): SafetyResult {
  const flags: string[] = [];

  // 1. 敏感词过滤
  for (const w of SENSITIVE_WORDS) {
    if (content.includes(w)) flags.push(`敏感词命中: ${w}`);
  }

  // 2. 知识点白名单校验（若指定）
  if (knowledgeId && !KNOWN_KNOWLEDGE_IDS.has(knowledgeId)) {
    flags.push("知识点不在白名单，需人工复核");
  }

  // 3. 代码块语法粗校验
  const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
  for (const block of codeBlocks) {
    const inner = block.replace(/^```\w*\n?/, "").replace(/```$/, "");
    if (inner.includes("def ") && !inner.includes(":")) {
      flags.push("代码块缺少冒号，疑似语法错误");
    }
  }

  // 4. 引用补全提示
  if (content.includes("论文") && !content.includes("引用")) {
    flags.push("缺少显式引用标注");
  }

  const score = Math.max(0, 100 - flags.length * 18);
  return {
    passed: flags.length === 0,
    flags,
    score,
  };
}
