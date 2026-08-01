import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  a: number;
};

const COLORS = ["#E63946", "#1B9AAA", "#F4A261", "#9D4EDD", "#22D3EE"];
const LINK_DISTANCE = 120; // CSS px

// 粒子背景 — Canvas 实现，墨色星空 + 流光粒子
export default function ParticleBg({ density = 60 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 粒子坐标用归一化的 [0,1]，而不是挂载瞬间的像素尺寸。
    // 挂载时 clientWidth 经常还是 0（父容器尚未完成布局），按像素播撒会让整片星空
    // 塌缩到左上角一小块；归一化之后尺寸变化只是重新映射，不会把粒子甩出边界。
    const particles: Particle[] = Array.from({ length: density }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0005,
      vy: (Math.random() - 0.5) * 0.0005,
      r: Math.random() * 1.6 + 0.4,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: Math.random() * 0.5 + 0.2,
    }));

    let w = 0;
    let h = 0;
    let ratio = 1;
    let raf = 0;

    // 尺寸从父容器读，不从画布自己读：改 canvas.width 会改变它的固有尺寸，
    // 观察自身会自激成一个把画布压扁的循环。写入前先比对，保证幂等。
    const host = canvas.parentElement ?? canvas;
    const applySize = (cssW: number, cssH: number) => {
      ratio = window.devicePixelRatio || 1;
      const nextW = Math.round(cssW * ratio);
      const nextH = Math.round(cssH * ratio);
      if (nextW === w && nextH === h) return;
      w = canvas.width = nextW;
      h = canvas.height = nextH;
    };

    const paint = (advance: boolean) => {
      if (w <= 1 || h <= 1) return;
      ctx.clearRect(0, 0, w, h);

      if (advance) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x <= 0 || p.x >= 1) {
            p.vx *= -1;
            p.x = Math.min(1, Math.max(0, p.x));
          }
          if (p.y <= 0 || p.y >= 1) {
            p.vy *= -1;
            p.y = Math.min(1, Math.max(0, p.y));
          }
        }
      }

      // 连线：比较距离平方，省掉每帧上千次开方
      const link = LINK_DISTANCE * ratio;
      const linkSq = link * link;
      ctx.lineWidth = 0.5 * ratio;
      for (let i = 0; i < particles.length; i++) {
        const px = particles[i].x * w;
        const py = particles[i].y * h;
        for (let j = i + 1; j < particles.length; j++) {
          const dx = px - particles[j].x * w;
          const dy = py - particles[j].y * h;
          const dSq = dx * dx + dy * dy;
          if (dSq >= linkSq) continue;
          const d = Math.sqrt(dSq);
          ctx.strokeStyle = `rgba(139,148,168,${0.15 * (1 - d / link)})`;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(particles[j].x * w, particles[j].y * h);
          ctx.stroke();
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.arc(p.x * w, p.y * h, p.r * ratio, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const loop = () => {
      paint(true);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    // 降级动效的用户只画一帧静态星图；标签页切走时也停掉 rAF，别在后台空转
    const start = () => {
      stop();
      if (reducedMotion.matches || document.hidden) {
        paint(false);
        return;
      }
      loop();
    };

    // 尺寸要等真实布局，用 ResizeObserver 而不是只监听 window resize：
    // 这块画布跟着首屏区块 / 弹层容器变，窗口尺寸不变时也会变。
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box) return;
      applySize(box.width, box.height);
      if (!raf) paint(false);
    });
    observer.observe(host);
    const rect = host.getBoundingClientRect();
    applySize(rect.width, rect.height);
    start();

    document.addEventListener("visibilitychange", start);
    reducedMotion.addEventListener("change", start);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", start);
      reducedMotion.removeEventListener("change", start);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
