import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";
import rehypeCodeHighlight from "@/lib/rehypeCodeHighlight";
import svgCardMap from "./svgCardMap";

interface Props {
  content: string;
  className?: string;
}

const markdownComponents = {
  p({ node, children, ...props }) {
    const onlyChild = node?.children.length === 1 ? node.children[0] : undefined;
    const isSvgPlaceholder = onlyChild?.type === "element"
      && onlyChild.tagName === "img"
      && String(onlyChild.properties.src || "").startsWith("#svg-card-");
    return isSvgPlaceholder ? <>{children}</> : <p {...props}>{children}</p>;
  },
  code({ className, children, ...props }) {
    const text = String(children).replace(/\n$/, "");
    if ((className || "").includes("mermaid") || text.startsWith("mindmap") || text.startsWith("flowchart")) {
      return (
        <pre className="mermaid-src">
          <code>{text}</code>
        </pre>
      );
    }
    return <code className={className} {...props}>{children}</code>;
  },
  img({ src, alt, ...props }) {
    const normalizedSrc = String(src || "");
    if (normalizedSrc.startsWith("#svg-card-")) {
      const id = normalizedSrc.replace("#svg-card-", "");
      const SvgComponent = svgCardMap[id];
      if (SvgComponent) return <SvgComponent />;
      return (
        <div className="my-4 rounded-xl border border-dashed border-[var(--card-border)] p-4 text-center text-sm text-[var(--fg-muted)]">
          📺 图解卡片: {id}
        </div>
      );
    }
    return <img src={src} alt={alt || ""} loading="lazy" decoding="async" {...props} />;
  },
} satisfies Components;

export default function MarkdownRenderer({ content, className }: Props) {
  // 将 [SVG:xxx] 占位符转换为图片语法，便于在 img 组件中拦截渲染
  const processed = content.replace(
    /\[SVG:([\w-]+)\]/g,
    (_, id) => `\n\n![svg-card](#svg-card-${id})\n\n`,
  );

  return (
    <div className={cn("prose-edu", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          [rehypeKatex, { output: "html", throwOnError: false, strict: false }],
          rehypeCodeHighlight,
        ]}
        components={markdownComponents}
      >
        {processed}
      </ReactMarkdown>
    </div>
  );
}
