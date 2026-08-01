// 智学灵境 EduVerse 类型定义

export type ResourceType =
  | "document"
  | "mindmap"
  | "quiz"
  | "reading"
  | "animation"
  | "code";

export type AgentId =
  | "captain"
  | "deconstructor"
  | "weaver"
  | "quizmaster"
  | "visualist"
  | "coder"
  | "validator";

export type AgentPhase = "thinking" | "generating" | "validating" | "done";

export interface AgentLogEntry {
  agentId: AgentId;
  agentName: string;
  phase: AgentPhase;
  message: string;
  ts: number;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  glyph: string; // 单字代号
  color: string; // 主色 hex
  desc: string;
  skills: string[];
  triggers: ResourceType[] | "all";
}

export type KnowledgeCategory =
  | "history"
  | "concept"
  | "algorithm"
  | "model";

export interface KnowledgeNode {
  id: string;
  chapter: number;
  title: string;
  parentId: string | null;
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  prerequisites: string[];
  summary: string;
  category?: KnowledgeCategory;
}

// 动画分镜 — 结构化存储，驱动播放器
export interface AnimationScene {
  index: number; // 1-based
  startMs: number; // 分镜起始时间（毫秒）
  durationMs: number; // 分镜时长（毫秒）
  title: string; // 分镜标题
  subtitle: string; // 解说字幕
  svg: string; // 分镜 SVG（含 data-anim 类名，由 CSS 驱动动画）
  motion: "intro" | "concept" | "flowchart" | "code" | "runtime" | "compare" | "outro" | "timeline" | "timeline-cards" | "architecture";
}

// 思维导图节点 — 树形结构，支持任意层级
export interface MindmapNode {
  id: string;
  label: string;
  detail?: string; // 悬停时显示的说明
  children?: MindmapNode[];
  color?: string; // 节点主色（HEX），缺省由层级决定
  weight?: "default" | "important" | "key"; // 节点重要性，影响样式
}

export interface MindmapData {
  root: MindmapNode;
  layout: "radial" | "tree"; // 布局类型
  theme?: "aurum" | "azure" | "jade" | "amethyst"; // 主题色
}

// 外部视频推荐
export interface ExternalVideo {
  title: string;
  platform: "Bilibili" | "YouTube" | "Coursera" | "MIT OCW" | "Stanford CS" | "arXiv";
  url: string;
  duration: string;
  desc: string;
}

export interface ResourceMetadata {
  duration?: number; // 阅读时长(分钟) / 视频时长(秒)
  difficulty?: 1 | 2 | 3 | 4 | 5;
  knowledgePoints: string[];
  citations?: string[];
  questionCount?: number; // 题库题数
  nodeCount?: number; // 思维导图节点数
  runtime?: string; // 代码运行环境
  scenes?: number; // 动画分镜数
  animationScenes?: AnimationScene[]; // 教学动画结构化分镜（驱动播放器）
  videoProvider?: "vector" | "seedance" | "spark-tts"; // 视频生成来源
  mindmap?: MindmapData; // 结构化思维导图（驱动可视化组件）
  externalVideos?: ExternalVideo[]; // 外部视频推荐链接
}

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  knowledgeId: string;
  content: string; // markdown / svg / code
  excerpt: string; // 卡片摘要
  metadata: ResourceMetadata;
  safetyCheck: { passed: boolean; flags: string[]; score: number };
  createdAt: string;
  liked?: boolean;
}

export interface ProfileDimension {
  name: string;
  score: number; // 0-100
  evidence: string; // 抽取依据
  tags?: string[];
}

export interface ProfileVersion {
  id: string;
  version: number;
  createdAt: string;
  trigger: string;
  dimensions: ProfileDimension[];
}

export interface ProfileChange {
  name: string;
  oldScore: number;
  newScore: number;
  delta: number;
}

export interface ProfileUpdateResult {
  profile: ProfileVersion;
  changes: ProfileChange[];
}

export interface Learner {
  id: string;
  name: string;
  avatar: string;
  major: string;
  grade: string;
  goal: string;
  enrolledAt: string;
}

export interface ChatMessage {
  id: string;
  role: "agent" | "user" | "system";
  agentId?: AgentId;
  content: string;
  ts: number;
  streaming?: boolean;
  cardRefs?: { type: ResourceType; id: string }[];
}

export interface PathNode {
  knowledgeId: string;
  status: "locked" | "todo" | "doing" | "done" | "recommended";
  order: number;
  reason?: string;
}

export interface LearningPath {
  id: string;
  learnerId: string;
  goal: string;
  nodes: PathNode[];
  updatedAt: string;
}

export interface AssessmentDimension {
  name: string;
  score: number;
  benchmark: number;
}

export interface LearningRecord {
  knowledgeId: string;
  mastery: number; // 0-100
  timeSpent: number; // 分钟
  lastVisit: string;
  exercisesCorrect: number;
  exercisesTotal: number;
  completedResources: string[]; // 已完成的资源ID
  quizAttempts: number; // 测验尝试次数
  quizScore: number; // 最高测验分数
  learned: boolean; // 是否已学习浏览
  quizCompleted: boolean; // 测验是否完成
}

export interface QuizQuestion {
  id: string;
  knowledgeId: string;
  type: "single" | "multiple" | "judge";
  question: string;
  options?: string[];
  correctAnswer: number | number[];
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export type PracticeType = "single" | "multiple" | "judge" | "fill" | "code-fill";

export interface PracticeQuestion {
  id: string;
  knowledgeId: string;
  type: PracticeType;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number | number[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  codeTemplate?: string;
  blanks?: string[];
}

export interface PracticeSession {
  id: string;
  knowledgeId: string;
  type: PracticeType;
  questions: PracticeQuestion[];
  currentIndex: number;
  answers: Record<string, string | string[] | number | number[]>;
  correctCount: number;
  totalQuestions: number;
  startTime: string;
  endTime?: string;
  completed: boolean;
}

export interface PracticeRecord {
  date: string;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  knowledgeIds: string[];
  questionTypes: PracticeType[];
}

// 用户发布的题目
export interface UserQuestion {
  id: string;
  author: string;
  authorAvatar: string;
  type: PracticeType;
  question: string;
  options?: string[];
  correctAnswer: string | string[] | number | number[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  codeTemplate?: string;
  tags: string[];
  createdAt: string;
  likes: number;
  likedByMe?: boolean;
  comments: QuestionComment[];
}

// 题目讨论评论
export interface QuestionComment {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface StudyPlanTask {
  day: number;
  date: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  knowledgeId: string;
  knowledgeTitle: string;
  type: "video" | "reading" | "practice" | "quiz" | "project";
  completed?: boolean;
}

export type StudyPlanTaskRef = Pick<
  StudyPlanTask,
  "day" | "knowledgeId" | "type"
>;

export interface StudyPlanMilestone {
  date: string;
  title: string;
  knowledgeIds: string[];
  tasks: StudyPlanTask[];
}

export interface StudyPlan {
  id: string;
  title: string;
  goal: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  dailyMinutes: number;
  focusAreas: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  milestones: StudyPlanMilestone[];
  status: "active" | "completed" | "paused";
}

export interface StudyPlanOptions {
  goal: string;
  focusAreas: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  dailyMinutes: number;
  durationDays: number;
}

export interface QuizResult {
  knowledgeId: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  answers: { questionId: string; userAnswer: number | number[]; isCorrect: boolean }[];
  masteryLevel: "mastered" | "partial" | "weak";
}

export interface AgentTask {
  taskId: string;
  resourceType: ResourceType;
  topic: string;
  knowledgeId?: string;
  learnerId: string;
}
