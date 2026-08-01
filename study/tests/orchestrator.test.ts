import { describe, expect, it, vi } from "vitest";

import type { AgentLogEntry, AgentTask, ResourceType } from "@/types";

vi.mock("@/services/streaming", () => ({
  sleep: vi.fn(async () => undefined),
  streamText: vi.fn(async function* (
    text: string,
    options: { onToken?: (count: number) => void } = {},
  ) {
    options.onToken?.(1);
    yield text;
  }),
}));

import { orchestrate, profileDialogue, tutorAnswer } from "@/agents/orchestrator";

const resourceTypes: ResourceType[] = [
  "document",
  "mindmap",
  "quiz",
  "reading",
  "animation",
  "code",
];

async function runOrchestrator(task: AgentTask, logs: AgentLogEntry[]) {
  const chunks: string[] = [];
  const generator = orchestrate(task, (entry) => logs.push(entry));

  while (true) {
    const next = await generator.next();
    if (next.done) return { chunks, result: next.value };
    chunks.push(next.value);
  }
}

describe("multi-agent orchestrator", () => {
  it.each(resourceTypes)("dispatches a complete %s pipeline", async (resourceType) => {
    const logs: AgentLogEntry[] = [];
    const { chunks, result } = await runOrchestrator(
      {
        taskId: `task-${resourceType}`,
        resourceType,
        topic: "Transformer",
        knowledgeId: "dl-transformer",
        learnerId: "test-learner",
      },
      logs,
    );

    expect(result.resource.type).toBe(resourceType);
    expect(result.resource.knowledgeId).toBe("dl-transformer");
    expect(result.resource.safetyCheck.passed).toBe(true);
    expect(result.totalTokens).toBe(1);
    expect(chunks.join("")).toBe(result.resource.content);
    expect(logs[0]).toMatchObject({ agentId: "captain", phase: "thinking" });
    expect(logs.at(-1)).toMatchObject({ agentId: "captain", phase: "done" });
    expect(logs.some((entry) => entry.agentId === "validator")).toBe(true);
  });

  it("rejects a task with neither valid knowledge nor a custom topic", async () => {
    const generator = orchestrate(
      {
        taskId: "invalid-task",
        resourceType: "document",
        topic: "",
        knowledgeId: "missing-node",
        learnerId: "test-learner",
      },
      () => undefined,
    );

    await expect(generator.next()).rejects.toThrow("未提供知识点或主题");
  });

  it("streams tutor and profile dialogue responses through the shared channel", async () => {
    const tutorChunks: string[] = [];
    for await (const chunk of tutorAnswer("Transformer 注意力")) tutorChunks.push(chunk);
    expect(tutorChunks.join("")).toContain("Transformer");

    const profileChunks: string[] = [];
    for await (const chunk of profileDialogue("我喜欢图解", 1)) profileChunks.push(chunk);
    expect(profileChunks.join("")).toContain("学习方式");

    const fallbackChunks: string[] = [];
    for await (const chunk of profileDialogue("继续", 99)) fallbackChunks.push(chunk);
    expect(fallbackChunks.join("")).toContain("画像持续更新");
  });
});
