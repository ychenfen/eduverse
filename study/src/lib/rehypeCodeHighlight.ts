import type { ElementContent, Root } from "hast";
import { toText } from "hast-util-to-text";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { createLowlight } from "lowlight";
import { visit } from "unist-util-visit";

const lowlight = createLowlight({
  bash,
  c,
  cpp,
  css,
  java,
  javascript,
  json,
  python,
  typescript,
  xml,
});

lowlight.registerAlias({
  bash: ["sh", "shell", "zsh"],
  cpp: ["c++"],
  javascript: ["js", "jsx"],
  python: ["py"],
  typescript: ["ts", "tsx"],
  xml: ["html", "svg"],
});

function getLanguage(classNames: unknown): string | undefined {
  if (!Array.isArray(classNames)) return undefined;
  for (const className of classNames) {
    const normalized = String(className);
    if (normalized.startsWith("language-")) return normalized.slice(9).toLowerCase();
    if (normalized.startsWith("lang-")) return normalized.slice(5).toLowerCase();
  }
  return undefined;
}

/** 仅注册教学内容实际使用的语言，避免默认高亮器打包整套语言库。 */
export default function rehypeCodeHighlight() {
  return (tree: Root) => {
    visit(tree, "element", (node, _index, parent) => {
      if (node.tagName !== "code" || parent?.type !== "element" || parent.tagName !== "pre") return;
      const language = getLanguage(node.properties.className);
      if (!language || !lowlight.registered(language)) return;

      const result = lowlight.highlight(language, toText(node, { whitespace: "pre" }), {
        prefix: "hljs-",
      });
      const classNames = Array.isArray(node.properties.className)
        ? node.properties.className.map(String)
        : [];
      node.properties.className = classNames.includes("hljs") ? classNames : ["hljs", ...classNames];
      node.children = result.children as ElementContent[];
    });
  };
}
