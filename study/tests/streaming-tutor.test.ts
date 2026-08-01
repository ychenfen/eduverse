import { describe, expect, it } from "vitest";

import { streamSequence, streamText, tokenize } from "@/services/streaming";
import { generateTutorAnswer, matchKnowledge } from "@/services/tutor";

async function collect(generator: AsyncGenerator<string>): Promise<string[]> {
  const output: string[] = [];
  for await (const chunk of generator) output.push(chunk);
  return output;
}

describe("streaming primitives", () => {
  it("reconstructs markdown, fenced code, and formulas without data loss", () => {
    const input = "# 标题\n\n```python\nprint('hello')\n```\n\n$$x^2 + y^2$$";
    expect([...tokenize(input)].join("")).toBe(input);
    expect([...tokenize("")]).toEqual([]);
  });

  it("reports monotonically increasing token counts", async () => {
    const counts: number[] = [];
    const chunks = await collect(streamText("人工智能 正在改变学习方式。", {
      speed: 0,
      onToken: (count) => counts.push(count),
    }));

    expect(chunks.join("")).toBe("人工智能 正在改变学习方式。");
    expect(counts).toEqual(chunks.map((_, index) => index + 1));
  });

  it("streams multiple segments in order", async () => {
    const chunks = await collect(streamSequence(["第一段", "第二段", "第三段"], { speed: 0, gap: 0 }));
    expect(chunks.join("")).toBe("第一段第二段第三段");
  });
});

describe("knowledge-grounded tutor", () => {
  const conceptCases = [
    ["曼哈顿距离怎么计算？", "manhattan"],
    ["欧氏距离的定义", "euclidean"],
    ["切比雪夫距离适用于什么场景？", "chebyshev"],
    ["网格搜索与邻域的关系", "grid-search"],
    ["梯度下降算法的迭代公式", "gradient-descent"],
    ["反向传播算法的链式法则", "backpropagation"],
    ["激活函数如何选择？", "activation"],
    ["梯度爆炸的产生原因", "gradient-explosion"],
    ["梯度消失的表现症状", "gradient-vanishing"],
    ["残差连接的公式", "residual"],
    ["长短期记忆网络的单元状态", "lstm"],
    ["批量归一化的计算公式", "batchnorm"],
    ["层归一化的计算公式", "layernorm"],
    ["Dropout 正则化的原理", "dropout"],
    ["自注意力机制的 Q K V", "attention"],
    ["梯度爆炸和梯度消失有什么区别？", "gradient-compare"],
    ["残差连接为什么能训练深层网络？", "residual-deep"],
    ["LSTM 门控如何缓解梯度问题？", "lstm-gate"],
    ["BatchNorm 和 LayerNorm 有什么区别？", "norm-compare"],
  ] as const;

  it.each(conceptCases)("grounds '%s' in the %s concept", (question, expectedKey) => {
    const match = matchKnowledge(question);
    expect(match.extraConcept?.key).toBe(expectedKey);

    const answer = generateTutorAnswer(question);
    expect(answer).toContain(match.extraConcept?.data.title);
    expect(answer).toContain("学习路径建议");
    expect(answer.length).toBeGreaterThan(500);
  });

  it("matches a canonical course topic and returns nearby knowledge", () => {
    const match = matchKnowledge("Transformer 的自注意力和多头 Attention 是怎么工作的？");
    expect(match.primary?.id).toBe("dl-transformer");
    expect(match.related.length).toBeGreaterThan(0);
    expect(match.related.every((node) => node.id !== match.primary?.id)).toBe(true);
  });

  it("recognizes a compound misconception as a dedicated concept", () => {
    const match = matchKnowledge("梯度爆炸和梯度消失有什么区别？");
    expect(match.extraConcept?.key).toBe("gradient-compare");
    expect(match.extraConcept?.data.title).toContain("vs");
  });

  it("generates a structured answer for matched knowledge", () => {
    const answer = generateTutorAnswer("A* 启发式函数为什么要可采纳？");
    expect(answer).toContain("启发式搜索 A*");
    expect(answer).toContain("##");
    expect(answer.length).toBeGreaterThan(300);
  });

  it("falls back gracefully for an unrelated question", () => {
    const answer = generateTutorAnswer("请帮我解释火星土壤的颜色");
    expect(answer).toContain("无法从课程知识库中精确定位");
    expect(answer).toContain("火星土壤");
  });
});
