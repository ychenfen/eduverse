import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentLogEntry } from "@/types";
import { getAgentById } from "@/data/agents";
import AgentAvatar from "./AgentAvatar";

interface Props {
  logs: AgentLogEntry[];
  busy?: boolean;
  className?: string;
}

const phaseMeta = {
  thinking: {
    icon: Brain,
    color: "text-aurum-400",
    label: "思考",
    spin: false,
  },
  generating: {
    icon: Loader2,
    color: "text-azure-400",
    label: "生成",
    spin: true,
  },
  validating: {
    icon: ShieldCheck,
    color: "text-amethyst-400",
    label: "校验",
    spin: false,
  },
  done: {
    icon: CheckCircle2,
    color: "text-jade-400",
    label: "完成",
    spin: false,
  },
};

// 智能体协作日志 — 实时显示各智能体"思考-生成-校验"过程
export default function AgentLogPanel({ logs, busy = false, className }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [logs]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between px-1">
        <h4 className="flex items-center gap-2 font-serif text-sm font-semibold text-[var(--fg)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-vermilion-500" />
          智能体协作日志
        </h4>
        {busy && (
          <span className="flex items-center gap-1 text-xs text-aurum-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            编队运行中
          </span>
        )}
      </div>

      <div className="flex max-h-[360px] flex-col gap-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {logs.map((log, i) => {
            const agent = getAgentById(log.agentId);
            const meta = phaseMeta[log.phase];
            const Icon = meta.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3 rounded-chip border border-[var(--card-border)] bg-[var(--card)] p-2.5"
              >
                {agent && (
                  <AgentAvatar agent={agent} size="sm" pulse={log.phase === "generating"} />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-medium text-[var(--fg)]">
                      {agent?.name}
                    </span>
                    <span
                      className={cn(
                        "flex items-center gap-1 rounded-chip bg-ink-700/60 px-1.5 py-0.5 text-[10px]",
                        meta.color,
                      )}
                    >
                      <Icon className={cn("h-2.5 w-2.5", meta.spin && "animate-spin")} />
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--fg-muted)]">
                    {log.message}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </div>
  );
}
