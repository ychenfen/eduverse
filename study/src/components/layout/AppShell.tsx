import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import DemoGuide from "@/components/DemoGuide";
import { useAppStore } from "@/store/useAppStore";

// 应用外壳 — 左侧栏 + 顶栏 + 主内容
export default function AppShell() {
  const theme = useAppStore((s) => s.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="app-shell-bg flex h-screen overflow-hidden">
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          menuOpen={mobileMenuOpen}
          onMenuClick={() => setMobileMenuOpen((open) => !open)}
        />
        <main id="main-content" ref={mainRef} tabIndex={-1} className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="移动端导航">
          <button
            type="button"
            className="absolute inset-0 bg-ink-950/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="关闭菜单"
          />
          <div id="mobile-navigation" className="relative h-full w-fit animate-slide-in-left">
            <Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
      <DemoGuide />
    </div>
  );
}
