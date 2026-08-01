import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] items-center justify-center px-6 py-12">
      <div className="glass max-w-xl rounded-2xl p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-azure-500/15 text-azure-400">
          <Compass className="h-8 w-8" />
        </div>
        <div className="mt-5 font-mono text-xs tracking-[0.28em] text-vermilion-400">ROUTE 404</div>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[var(--fg)]">这条学习路径尚未生成</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)]">当前地址没有对应页面，返回工作台后可继续使用学习计划、资源工坊和智能辅导。</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow">
          <ArrowLeft className="h-4 w-4" />返回工作台
        </Link>
      </div>
    </div>
  );
}
