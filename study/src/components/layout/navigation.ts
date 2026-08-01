import {
  Calendar,
  Factory,
  Gauge,
  LayoutDashboard,
  Library,
  MessagesSquare,
  PenTool,
  Presentation,
  Route,
  UserCircle2,
  type LucideIcon,
} from "lucide-react";

export interface NavigationItem {
  to: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const navigationItems: NavigationItem[] = [
  { to: "/", label: "工作台", description: "学习概览与快捷入口", icon: LayoutDashboard },
  { to: "/showcase", label: "决赛演示", description: "3 分钟验证学习闭环", icon: Presentation },
  { to: "/profile", label: "学习画像", description: "查看与更新六维画像", icon: UserCircle2 },
  { to: "/plan", label: "学习计划", description: "制定并跟踪阶段目标", icon: Calendar },
  { to: "/workshop", label: "资源工坊", description: "生成六类多模态资源", icon: Factory },
  { to: "/path", label: "学习路径", description: "探索个性化知识图谱", icon: Route },
  { to: "/practice", label: "题库训练", description: "专项练习与社区共创", icon: PenTool },
  { to: "/tutor", label: "智能辅导", description: "获得上下文感知答疑", icon: MessagesSquare },
  { to: "/assessment", label: "学习评估", description: "诊断掌握度与薄弱点", icon: Gauge },
  { to: "/library", label: "资源中心", description: "检索全部学习资源", icon: Library },
];

export const pageNames = Object.fromEntries(
  navigationItems.map((item) => [item.to, item.label]),
) as Record<string, string>;
