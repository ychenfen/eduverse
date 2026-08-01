import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import PageLoader from "@/components/PageLoader";
import AppShell from "@/components/layout/AppShell";
import { useAppStore } from "@/store/useAppStore";

const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Workshop = lazy(() => import("@/pages/Workshop"));
const LearningPath = lazy(() => import("@/pages/LearningPath"));
const Tutor = lazy(() => import("@/pages/Tutor"));
const Assessment = lazy(() => import("@/pages/Assessment"));
const Library = lazy(() => import("@/pages/Library"));
const Practice = lazy(() => import("@/pages/Practice"));
const StudyPlan = lazy(() => import("@/pages/StudyPlan"));
const Showcase = lazy(() => import("@/pages/Showcase"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// 双击本地 index.html 打开时（file://），路径是磁盘路径，BrowserRouter 匹配不到任何路由，
// 只会落到 404。这种场景切 HashRouter；挂在服务器上仍走 BrowserRouter，深链保持原样。
const Router =
  typeof window !== "undefined" && window.location.protocol === "file:"
    ? HashRouter
    : BrowserRouter;

export default function App() {
  const onboarded = useAppStore((state) => state.onboarded);
  const setOnboarded = useAppStore((state) => state.setOnboarded);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("reset") !== "true") return;
    setOnboarded(false);
    url.searchParams.delete("reset");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [setOnboarded]);

  return (
    <AppErrorBoundary>
      <Router>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/path" element={<LearningPath />} />
              <Route path="/tutor" element={<Tutor />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/library" element={<Library />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/plan" element={<StudyPlan />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          {!onboarded && <Onboarding />}
        </Suspense>
      </Router>
    </AppErrorBoundary>
  );
}
