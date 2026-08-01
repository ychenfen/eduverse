import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface RadarAxis {
  name: string;
  score: number;
  benchmark?: number;
}

interface Props {
  axes: RadarAxis[];
  size?: number;
  color?: string;
  className?: string;
  showLabels?: boolean;
  animated?: boolean;
}

// 通用雷达图 — SVG 绘制 + 入场动画
export default function RadarChart({
  axes,
  size = 320,
  color = "#E63946",
  className,
  showLabels = true,
  animated = true,
}: Props) {
  const [progress, setProgress] = useState(animated ? 0 : 1);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated) return;
    let raf = 0;
    const start = performance.now();
    const dur = 800;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(1 - Math.pow(1 - p, 3)); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, axes]);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 50;
  const n = axes.length;
  const angleStep = n > 0 ? (Math.PI * 2) / n : 0;

  const pointAt = (i: number, ratio: number) => {
    const angle = -Math.PI / 2 + i * angleStep;
    return {
      x: cx + Math.cos(angle) * radius * ratio,
      y: cy + Math.sin(angle) * radius * ratio,
    };
  };

  const makeClosedPath = (points: { x: number; y: number }[]) =>
    points.length >= 3
      ? points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" ") + " Z"
      : "";

  const dataPath = makeClosedPath(
    axes.map((a, i) => {
      const p = pointAt(i, (a.score / 100) * progress);
      return p;
    }),
  );

  const benchmarkPath = makeClosedPath(
    axes.flatMap((a, i) => {
      if (a.benchmark == null) return [];
      const p = pointAt(i, ((a.benchmark || 0) / 100) * progress);
      return [p];
    }),
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("mx-auto", className)}
      style={{ width: size, height: size }}
    >
      <defs>
        <radialGradient id={`radar-${color.slice(1)}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>
      </defs>

      {/* 网格 */}
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon
          key={r}
          points={axes
            .map((_, i) => {
              const p = pointAt(i, r);
              return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
            })
            .join(" ")}
          fill="none"
          stroke="rgba(139,148,168,0.18)"
          strokeWidth="1"
        />
      ))}

      {/* 轴线 */}
      {axes.map((_, i) => {
        const p = pointAt(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(139,148,168,0.18)"
            strokeWidth="1"
          />
        );
      })}

      {/* benchmark */}
      {benchmarkPath && (
        <path
          d={benchmarkPath}
          fill="none"
          stroke="rgba(139,148,168,0.5)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      )}

      {/* 数据多边形 */}
      {dataPath && <path d={dataPath} fill={`url(#radar-${color.slice(1)})`} stroke={color} strokeWidth="2" />}

      {/* 数据点 */}
      {axes.map((a, i) => {
        const p = pointAt(i, (a.score / 100) * progress);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill={color}
            stroke="#0A0E1A"
            strokeWidth="1.5"
          />
        );
      })}

      {/* 标签 */}
      {showLabels &&
        axes.map((a, i) => {
          const p = pointAt(i, 1.18);
          return (
            <g key={i}>
              <text
                x={p.x}
                y={p.y - 4}
                textAnchor="middle"
                className="fill-[var(--fg)] font-sans"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                {a.name}
              </text>
              <text
                x={p.x}
                y={p.y + 10}
                textAnchor="middle"
                className="fill-[var(--fg-muted)] font-mono"
                style={{ fontSize: 10 }}
              >
                {a.score}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
