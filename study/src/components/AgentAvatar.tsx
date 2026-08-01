import { cn } from "@/lib/utils";
import type { AgentDefinition } from "@/types";

interface Props {
  agent: AgentDefinition;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: { box: "h-9 w-9", glyph: "text-sm" },
  md: { box: "h-12 w-12", glyph: "text-base" },
  lg: { box: "h-16 w-16", glyph: "text-xl" },
};

// 智能体头像 — 单字 glyph + 渐变环 + 呼吸光
export default function AgentAvatar({
  agent,
  size = "md",
  active = false,
  pulse = false,
  onClick,
}: Props) {
  const s = sizeMap[size];
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition-transform",
        s.box,
        onClick && "cursor-pointer hover:scale-105",
      )}
      title={`${agent.name} · ${agent.role}`}
    >
      {/* 外环 */}
      <div
        className={cn(
          "absolute inset-0 rounded-full opacity-70",
          pulse && "animate-breathe",
        )}
        style={{
          background: `conic-gradient(from 0deg, ${agent.color}, transparent, ${agent.color})`,
          filter: "blur(1px)",
        }}
      />
      {/* 内圆 */}
      <div
        className={cn(
          "relative flex h-[78%] w-[78%] items-center justify-center rounded-full font-serif font-bold",
          s.glyph,
          active && "ring-2",
        )}
        style={{
          background: `radial-gradient(circle at 30% 30%, ${agent.color}40, #0A0E1A 80%)`,
          color: agent.color,
          boxShadow: active ? `0 0 16px ${agent.color}80` : "none",
        }}
      >
        {agent.glyph}
      </div>
    </div>
  );
}
