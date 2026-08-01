import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("EduVerse 页面渲染失败", error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="app-shell-bg flex min-h-screen items-center justify-center p-6">
        <section className="glass w-full max-w-lg rounded-2xl p-8 text-center shadow-float">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vermilion-500/15 text-vermilion-400">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="mt-5 font-serif text-2xl font-bold text-[var(--fg)]">学习空间暂时走神了</h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--fg-muted)]">
            本地数据仍然安全。刷新页面即可重新连接智能体编队。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-500 to-azure-500 px-5 py-2.5 text-sm font-medium text-white shadow-glow"
          >
            <RefreshCcw className="h-4 w-4" />重新加载
          </button>
        </section>
      </main>
    );
  }
}
