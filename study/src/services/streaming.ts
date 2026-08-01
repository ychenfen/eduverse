// 流式输出服务 — 基于 async generator 模拟 token 流
// 生产环境可替换为真实 SSE / WebSocket

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// 将文本切片为 token（按字符 + 标点切片，模拟真实流）
export function* tokenize(text: string): Generator<string> {
  // 保留 markdown 结构标记，避免破坏渲染
  const chunks = text.match(/(```[\s\S]*?```|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\S+|\s+)/g) || [];
  for (const chunk of chunks) {
    // 长块再拆为 2-4 字符子串
    if (chunk.length > 8) {
      for (let i = 0; i < chunk.length; i += 3) {
        yield chunk.slice(i, i + 3);
      }
    } else {
      yield chunk;
    }
  }
}

// 流式产出一个完整文本
export async function* streamText(
  text: string,
  opts: { speed?: number; onToken?: (n: number) => void } = {},
): AsyncGenerator<string> {
  const speed = opts.speed ?? 18;
  let count = 0;
  for (const tok of tokenize(text)) {
    yield tok;
    count++;
    opts.onToken?.(count);
    // 标点处稍作停顿，更自然
    const pause = /[。！？，、；：\n]/.test(tok) ? speed * 4 : speed;
    await sleep(pause);
  }
}

// 流式产出多个片段（带间隔）
export async function* streamSequence(
  segments: string[],
  opts: { speed?: number; gap?: number } = {},
): AsyncGenerator<string> {
  const gap = opts.gap ?? 200;
  for (let i = 0; i < segments.length; i++) {
    if (i > 0) await sleep(gap);
    yield* streamText(segments[i], opts);
  }
}
