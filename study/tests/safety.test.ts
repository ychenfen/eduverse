import { describe, expect, it } from "vitest";

import { validate } from "@/services/safety";

describe("content safety gate", () => {
  it("accepts clean content for a whitelisted knowledge node", () => {
    expect(validate("A* 使用启发式函数估计剩余代价。", "search-informed")).toEqual({
      passed: true,
      flags: [],
      score: 100,
    });
  });

  it("accumulates independent safety and factual-review signals", () => {
    const result = validate(
      "论文讨论了暴力内容\n```python\ndef broken(value)\n    return value\n```",
      "unknown-node",
    );

    expect(result.passed).toBe(false);
    expect(result.flags).toEqual(
      expect.arrayContaining([
        "敏感词命中: 暴力",
        "知识点不在白名单，需人工复核",
        "代码块缺少冒号，疑似语法错误",
        "缺少显式引用标注",
      ]),
    );
    expect(result.score).toBe(28);
  });

  it("does not report valid Python blocks or explicitly cited papers", () => {
    const result = validate(
      "论文引用已标注。\n```python\ndef valid(value):\n    return value\n```",
      "dl-transformer",
    );

    expect(result).toMatchObject({ passed: true, score: 100 });
  });

  it("never lets a heavily flagged score fall below zero", () => {
    const result = validate(
      "暴力 色情 赌博 毒品 自残 论文\n```python\ndef broken()\n```",
      "not-allowed",
    );

    expect(result.flags).toHaveLength(8);
    expect(result.score).toBe(0);
  });
});
