import { create } from "zustand";
import type {
  AgentLogEntry,
  ChatMessage,
  Learner,
  ProfileVersion,
  Resource,
  ResourceType,
  LearningRecord,
  QuizResult,
  PracticeRecord,
  StudyPlan,
  StudyPlanTaskRef,
  UserQuestion,
  QuestionComment,
  ProfileChange,
  ProfileUpdateResult,
} from "@/types";
import {
  mockLearner,
  presetLearners,
  initialProfile,
  updatedProfile,
  profileHistory,
  learningRecords as defaultLearningRecords,
} from "@/data/learner";
import { preGeneratedResources } from "@/data/resources";
import { generateStudyPlan, buildDefaultPlan } from "@/data/practice";

interface AppState {
  theme: "dark" | "light";
  toggleTheme: () => void;

  learner: Learner;
  onboarded: boolean;
  setOnboarded: (v: boolean) => void;
  presetLearners: Learner[];
  selectLearner: (id: string) => void;
  resetToNewUser: () => void;

  currentProfile: ProfileVersion;
  profileHistory: ProfileVersion[];
  updateProfile: (p: ProfileVersion) => void;
  regenerateProfile: (trigger: string, userText?: string) => ProfileUpdateResult;
  predictProfileChanges: (userText: string) => ProfileChange[];
  buildInitialProfileFromOnboarding: (extracted: string[], options?: {
    username?: string;
    mathCorrect?: number;
    mathTotal?: number;
  }) => ProfileVersion;

  resources: Resource[];
  likedResource: (id: string) => void;

  tutorMessages: ChatMessage[];
  addTutorMessage: (m: ChatMessage) => void;
  updateLastTutorMessage: (content: string) => void;

  profileMessages: ChatMessage[];
  addProfileMessage: (m: ChatMessage) => void;
  updateLastProfileMessage: (content: string) => void;

  learningRecords: LearningRecord[];
  markAsLearned: (knowledgeId: string) => void;
  completeQuiz: (knowledgeId: string, result: QuizResult) => void;
  getRecordById: (knowledgeId: string) => LearningRecord | undefined;

  practiceRecords: PracticeRecord[];
  addPracticeRecord: (record: Omit<PracticeRecord, "date" | "accuracy">) => void;
  getPracticeByDate: (date: string) => PracticeRecord[];
  getTotalPracticeStats: () => { totalQuestions: number; correctCount: number; accuracy: number; days: number };

  studyPlans: StudyPlan[];
  currentPlanId: string | null;
  createStudyPlan: (options: {
    goal: string;
    focusAreas: string[];
    difficulty: "beginner" | "intermediate" | "advanced";
    dailyMinutes: number;
    durationDays: number;
  }) => StudyPlan;
  setCurrentPlan: (id: string | null) => void;
  completeStudyPlanTask: (planId: string, task: StudyPlanTaskRef) => void;

  // 用户发布的题目
  userQuestions: UserQuestion[];
  addUserQuestion: (q: Omit<UserQuestion, "id" | "createdAt" | "likes" | "comments" | "author" | "authorAvatar">) => void;
  likeUserQuestion: (id: string) => void;
  addQuestionComment: (questionId: string, content: string) => void;

  workshopLog: AgentLogEntry[];
  workshopStreaming: string;
  workshopBusy: boolean;
  workshopResourceType: ResourceType | null;
  workshopGenerated: Resource | null;
  setWorkshop: (patch: Partial<Pick<AppState, "workshopLog" | "workshopStreaming" | "workshopBusy" | "workshopResourceType" | "workshopGenerated">>) => void;
  pushWorkshopLog: (e: AgentLogEntry) => void;
  appendWorkshopStream: (tok: string) => void;
  resetWorkshop: () => void;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`Failed to load ${key} from localStorage`, e);
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save ${key} to localStorage`, e);
  }
}

function analyzeText(text: string): { dimensionDeltas: Record<string, number>; dimensionEvidences: Record<string, string> } {
  const dimensionKeywords: Record<string, { up: string[]; down: string[] }> = {
    知识基础: {
      up: [
        "学完", "掌握", "理解", "学会", "完成", "巩固", "复习", "做完了", "掌握了", "弄懂了",
        "搞懂了", "吃透了", "入门了", "上手了", "基础扎实", "基础不错", "学得不错",
        "进步很大", "提升明显", "越来越好了", "有进步", "知识增强", "变强了",
      ],
      down: [
        "困难", "不会", "没学", "不懂", "忘记", "卡住", "看不懂", "跟不上",
        "太难了", "好难", "搞不懂", "弄不明白", "吃力", "费劲", "基础差",
        "零基础", "没基础", "底子薄", "很多不会", "都忘了", "难度大",
      ],
    },
    认知风格: {
      up: ["视觉", "图解", "动画", "图", "看视频", "看图", "可视化", "看例子", "看代码", "实践", "动手", "写代码"],
      down: ["文字", "纯文本", "听", "朗读", "看书", "读文档", "理论", "纯理论"],
    },
    易错偏好: {
      up: ["易错", "错了", "搞错", "混淆", "记错", "做错", "经常错", "老错", "容易错", "粗心", "不仔细"],
      down: ["纠正", "改对", "不会再错", "掌握了", "搞清楚了", "不混了", "不会混淆了", "细心了"],
    },
    学习节奏: {
      up: [
        "快", "加快", "提速", "加速", "赶进度", "冲刺", "抓紧", "高效",
        "节奏快", "进度快", "学得快", "吸收快", "状态好", "干劲足",
      ],
      down: [
        "慢", "放慢", "减速", "降低速度", "调慢", "慢慢来", "稳一点",
        "节奏慢", "进度慢", "学不动", "累了", "疲惫", "状态不好",
        "压力大", "跟不上", "太赶了", "太快了", "难度大了",
      ],
    },
    目标导向: {
      up: [
        "目标明确", "有目标", "考研", "考公", "找工作", "面试", "项目",
        "竞赛", "比赛", "考试", "考证", "冲", "奋斗", "坚持",
      ],
      down: ["迷茫", "不知道学啥", "没目标", "方向不明", "随便学学", "兴趣爱好", "随便看看"],
    },
    兴趣方向: {
      up: [
        "感兴趣", "喜欢", "想学", "想了解", "好奇", "着迷",
        "ai", "人工智能", "机器学习", "深度学习", "神经网络",
        "大模型", "llm", "gpt", "transformer", "nlp", "cv",
        "计算机视觉", "自然语言", "强化学习", "多智能体", "agent",
        "算法", "数据结构", "编程", "代码",
      ],
      down: ["不感兴趣", "没兴趣", "不想学", "讨厌", "无聊", "枯燥", "没意思"],
    },
  };

  const dimensionDeltas: Record<string, number> = {};
  const dimensionEvidences: Record<string, string> = {};

  for (const [dimName, config] of Object.entries(dimensionKeywords)) {
    let delta = 0;
    let matchedKeyword = "";

    for (const kw of config.up) {
      if (text.includes(kw.toLowerCase())) {
        delta += 5 + Math.floor(Math.random() * 6);
        if (!matchedKeyword) matchedKeyword = kw;
      }
    }
    for (const kw of config.down) {
      if (text.includes(kw.toLowerCase())) {
        delta -= 5 + Math.floor(Math.random() * 6);
        if (!matchedKeyword) matchedKeyword = kw;
      }
    }

    if (delta === 0) {
      delta = Math.floor(Math.random() * 7) - 3;
    }

    dimensionDeltas[dimName] = delta;
    if (matchedKeyword) {
      dimensionEvidences[dimName] = `基于「${matchedKeyword}」更新`;
    }
  }

  if (/transformer|注意力|attention/.test(text)) {
    dimensionDeltas["兴趣方向"] = (dimensionDeltas["兴趣方向"] || 0) + 4;
    dimensionEvidences["兴趣方向"] = "对 Transformer / 注意力机制方向兴趣增强";
  }
  if (/神经网络|cnn|rnn|lstm/.test(text)) {
    dimensionDeltas["知识基础"] = (dimensionDeltas["知识基础"] || 0) + 4;
    dimensionEvidences["知识基础"] = "深度学习相关知识基础提升";
  }
  if (/大模型|llm|gpt|prompt|rag/.test(text)) {
    dimensionDeltas["兴趣方向"] = (dimensionDeltas["兴趣方向"] || 0) + 6;
    dimensionEvidences["兴趣方向"] = "大模型方向兴趣显著增强";
  }
  if (/算法|dp|动态规划|搜索|排序/.test(text)) {
    dimensionDeltas["知识基础"] = (dimensionDeltas["知识基础"] || 0) + 4;
    dimensionEvidences["知识基础"] = "算法基础提升";
  }
  if (/代码|编程|实践|实操|实现|写代码/.test(text)) {
    dimensionDeltas["认知风格"] = (dimensionDeltas["认知风格"] || 0) + 4;
    dimensionEvidences["认知风格"] = "实践型认知风格增强";
  }
  if (/项目|考试|面试/.test(text)) {
    dimensionDeltas["目标导向"] = (dimensionDeltas["目标导向"] || 0) + 4;
    dimensionEvidences["目标导向"] = "目标导向更明确";
  }

  return { dimensionDeltas, dimensionEvidences };
}

const storedTheme = loadFromStorage<"dark" | "light">("eduverse-theme", "dark");
const storedOnboarded = loadFromStorage<boolean>("eduverse-onboarded", false);
const storedLearner = loadFromStorage<Learner | null>("eduverse-learner", null);
const storedProfile = loadFromStorage<ProfileVersion | null>("eduverse-profile", null);
const storedProfileHistory = loadFromStorage<ProfileVersion[] | null>("eduverse-profile-history", null);
const storedLearningRecords = loadFromStorage<LearningRecord[] | null>("eduverse-learning-records", null);
const storedPracticeRecords = loadFromStorage<PracticeRecord[]>("eduverse-practice-records", []);
const loadedStudyPlans = loadFromStorage<StudyPlan[]>("eduverse-study-plans", []);
const storedUserQuestions = loadFromStorage<UserQuestion[]>("eduverse-user-questions", []);

// 自建学生的学习数据存档：切换身份时按 learner.id 存取，避免来回切就清空
interface LearnerSnapshot {
  profile: ProfileVersion;
  profileHistory: ProfileVersion[];
  learningRecords: LearningRecord[];
  practiceRecords: PracticeRecord[];
  userQuestions: UserQuestion[];
  studyPlans: StudyPlan[];
  currentPlanId: string | null;
}

// 自己创建的学生此前只存在于当前会话，返回选择页就找不到了。这里持久化一份名单。
const storedCustomLearners = loadFromStorage<Learner[]>("eduverse-custom-learners", []);
const allSelectableLearners = [
  ...presetLearners,
  ...storedCustomLearners.filter((l) => !presetLearners.some((p) => p.id === l.id)),
];

// 区分预设用户 vs 新用户：
// - 预设用户（林知远、苏晴、陈墨、周屿）：使用 mock 学习数据
// - 新用户（自定义用户名，非 presetLearners）：使用空记录
function isPresetLearner(learner: Learner | null): boolean {
  if (!learner) return false;
  return presetLearners.some((p) => p.id === learner.id);
}

const isPresetInitial = isPresetLearner(storedLearner);
// 新用户永远用空记录，即使 localStorage 里有残留的旧数据也不用
const effectiveLearningRecords = isPresetInitial
  ? (storedLearningRecords || defaultLearningRecords)
  : [];
const effectiveProfile = isPresetInitial
  ? (storedProfile || updatedProfile)
  : (storedProfile || initialProfile);
const effectiveProfileHistory = isPresetInitial
  ? (storedProfileHistory || profileHistory)
  : (storedProfileHistory || [initialProfile]);

// 自动为没有计划的用户生成默认/推荐计划
const initialStudyPlans = loadedStudyPlans.length > 0
  ? loadedStudyPlans
  : [buildDefaultPlan(effectiveLearningRecords)];
const initialCurrentPlanId = loadFromStorage<string | null>("eduverse-current-plan-id", null)
  ?? initialStudyPlans[0]?.id
  ?? null;

if (loadedStudyPlans.length === 0) {
  saveToStorage("eduverse-study-plans", initialStudyPlans);
  saveToStorage("eduverse-current-plan-id", initialCurrentPlanId);
}

if (typeof document !== "undefined") {
  document.documentElement.classList.remove("dark", "light");
  document.documentElement.classList.add(storedTheme);
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: storedTheme,
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(next);
      }
      saveToStorage("eduverse-theme", next);
      return { theme: next };
    }),

  learner: storedLearner || mockLearner,
  presetLearners: allSelectableLearners,
  onboarded: storedOnboarded,
  setOnboarded: (v) => {
    saveToStorage("eduverse-onboarded", v);
    set({ onboarded: v });
  },
  selectLearner: (id) =>
    set((s) => {
      const next = s.presetLearners.find((l) => l.id === id) || s.learner;
      // 重新选中当前身份 = 重新装载这位学生的初始数据（决赛演示模式走的就是这条），
      // 不能当成"没变化"直接返回，否则全新浏览器点进去会是一份空白样例。
      const sameLearner = next.id === s.learner.id;

      // 切走之前把当前学生的学习数据存档，回来才能接着用；
      // 只有真正进过系统（已完成引导）的身份才值得存，避免把空状态覆盖掉预设样例。
      const snapshots = loadFromStorage<Record<string, LearnerSnapshot>>(
        "eduverse-learner-snapshots",
        {},
      );
      if (s.onboarded && !sameLearner) {
        snapshots[s.learner.id] = {
          profile: s.currentProfile,
          profileHistory: s.profileHistory,
          learningRecords: s.learningRecords,
          practiceRecords: s.practiceRecords,
          userQuestions: s.userQuestions,
          studyPlans: s.studyPlans,
          currentPlanId: s.currentPlanId,
        };
        saveToStorage("eduverse-learner-snapshots", snapshots);
      }

      const isPreset = presetLearners.some((p) => p.id === next.id);
      const saved = sameLearner ? undefined : snapshots[next.id];

      const nextProfile = saved?.profile ?? (isPreset ? updatedProfile : initialProfile);
      const nextProfileHistory =
        saved?.profileHistory ?? (isPreset ? profileHistory : [initialProfile]);
      const nextRecords = saved?.learningRecords ?? (isPreset ? defaultLearningRecords : []);
      const nextPractice = saved?.practiceRecords ?? [];
      const nextQuestions = saved?.userQuestions ?? [];
      const nextPlans = saved?.studyPlans?.length
        ? saved.studyPlans
        : [buildDefaultPlan(nextRecords)];
      const nextPlanId = saved?.currentPlanId ?? nextPlans[0]?.id ?? null;

      saveToStorage("eduverse-learner", next);
      saveToStorage("eduverse-profile", nextProfile);
      saveToStorage("eduverse-profile-history", nextProfileHistory);
      saveToStorage("eduverse-learning-records", nextRecords);
      saveToStorage("eduverse-practice-records", nextPractice);
      saveToStorage("eduverse-user-questions", nextQuestions);
      saveToStorage("eduverse-study-plans", nextPlans);
      saveToStorage("eduverse-current-plan-id", nextPlanId);

      return {
        learner: next,
        currentProfile: nextProfile,
        profileHistory: nextProfileHistory,
        learningRecords: nextRecords,
        practiceRecords: nextPractice,
        userQuestions: nextQuestions,
        studyPlans: nextPlans,
        currentPlanId: nextPlanId,
        profileMessages: [],
        tutorMessages: [],
      };
    }),
  resetToNewUser: () =>
    set(() => {
      const newLearner: Learner = {
        id: "L-NEW-" + Date.now().toString(36),
        name: "新同学",
        avatar: "新",
        major: "尚未填写",
        grade: "尚未填写",
        goal: "尚未填写",
        enrolledAt: new Date().toISOString().slice(0, 10),
      };
      // 新用户必须连学习记录一起清空。此前这里只重置了画像与身份，
      // learningRecords / practiceRecords / studyPlans / userQuestions 仍留着上一位
      // 学生的数据，工作台和评估页会显示别人的进度，刷新后才因模块重新求值而恢复正常。
      const newPlan = buildDefaultPlan([]);
      saveToStorage("eduverse-onboarded", false);
      saveToStorage("eduverse-learner", newLearner);
      saveToStorage("eduverse-profile", initialProfile);
      saveToStorage("eduverse-profile-history", [initialProfile]);
      saveToStorage("eduverse-learning-records", []);
      saveToStorage("eduverse-practice-records", []);
      saveToStorage("eduverse-user-questions", []);
      saveToStorage("eduverse-study-plans", [newPlan]);
      saveToStorage("eduverse-current-plan-id", newPlan.id);
      return {
        onboarded: false,
        learner: newLearner,
        currentProfile: initialProfile,
        profileHistory: [initialProfile],
        profileMessages: [],
        learningRecords: [],
        practiceRecords: [],
        userQuestions: [],
        studyPlans: [newPlan],
        currentPlanId: newPlan.id,
        tutorMessages: [],
      };
    }),

  currentProfile: effectiveProfile,
  profileHistory: effectiveProfileHistory,
  updateProfile: (p) =>
    set((s) => {
      const nextHistory = [...s.profileHistory, p];
      saveToStorage("eduverse-profile", p);
      saveToStorage("eduverse-profile-history", nextHistory);
      return {
        currentProfile: p,
        profileHistory: nextHistory,
      };
    }),
  regenerateProfile: (trigger, userText) => {
    const state = get();
    const prev = state.currentProfile;
    const now = new Date();
    const ts =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    const text = (userText || trigger || "").toLowerCase();
    const { dimensionDeltas, dimensionEvidences } = analyzeText(text);

    const next: ProfileVersion = {
      id: "PV-" + Date.now().toString(36),
      version: prev.version + 1,
      createdAt: ts,
      trigger,
      dimensions: prev.dimensions.map((d) => {
        const delta = dimensionDeltas[d.name] || 0;
        const newScore = Math.min(98, Math.max(25, d.score + delta));
        const newEvidence = dimensionEvidences[d.name] || d.evidence;
        return {
          ...d,
          score: newScore,
          evidence: newEvidence,
        };
      }),
    };

    const nextHistory = [...state.profileHistory, next];
    saveToStorage("eduverse-profile", next);
    saveToStorage("eduverse-profile-history", nextHistory);
    set({
      currentProfile: next,
      profileHistory: nextHistory,
    });

    const changes = prev.dimensions
      .map((d) => {
        const newDim = next.dimensions.find((nd) => nd.name === d.name);
        const delta = (newDim?.score || 0) - d.score;
        return { name: d.name, oldScore: d.score, newScore: newDim?.score || d.score, delta };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    return { profile: next, changes };
  },
  predictProfileChanges: (userText) => {
    const state = get();
    const prev = state.currentProfile;
    const text = userText.toLowerCase();
    const { dimensionDeltas } = analyzeText(text);

    return prev.dimensions
      .map((d) => {
        const delta = dimensionDeltas[d.name] || 0;
        const newScore = Math.min(98, Math.max(25, d.score + delta));
        return { name: d.name, oldScore: d.score, newScore, delta };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
  },
  buildInitialProfileFromOnboarding: (extracted, options) => {
    const state = get();
    const prev = state.currentProfile;
    const now = new Date();
    const ts =
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0");

    const username = options?.username;
    const mathCorrect = options?.mathCorrect ?? 0;
    const mathTotal = options?.mathTotal ?? 0;
    const mathAccuracy = mathTotal > 0 ? mathCorrect / mathTotal : 0;

    // 如果提供了用户名，更新 learner，并把这位自建学生登记进可选身份名单
    if (username && username.trim()) {
      const updatedLearner = {
        ...state.learner,
        name: username.trim(),
        avatar: username.trim().charAt(0).toUpperCase(),
      };
      saveToStorage("eduverse-learner", updatedLearner);

      const customs = loadFromStorage<Learner[]>("eduverse-custom-learners", []).filter(
        (l) => l.id !== updatedLearner.id,
      );
      const nextCustoms = [...customs, updatedLearner];
      saveToStorage("eduverse-custom-learners", nextCustoms);

      set({
        learner: updatedLearner,
        presetLearners: [
          ...presetLearners,
          ...nextCustoms.filter((l) => !presetLearners.some((p) => p.id === l.id)),
        ],
      });
    }

    const parsedEvidence: Record<string, string> = {};
    for (const e of extracted) {
      if (e.startsWith("年级：")) parsedEvidence["目标导向"] = `年级 ${e.slice(3)}；${state.learner.goal}`;
      else if (e.startsWith("目标：")) parsedEvidence["目标导向"] = `目标：${e.slice(3)}`;
      else if (e.startsWith("基础自评：")) parsedEvidence["知识基础"] = `自评分数：${e.slice(5)}`;
      else if (e.startsWith("认知风格：")) parsedEvidence["认知风格"] = `偏好：${e.slice(5)}`;
      else if (e.startsWith("易错点：")) parsedEvidence["易错偏好"] = `易错点：${e.slice(4)}`;
      else if (e.startsWith("学习节奏：")) parsedEvidence["学习节奏"] = `节奏：${e.slice(5)}`;
    }

    // 根据数学测试正确率动态计算知识基础分数
    // 正确率 0% -> 35分, 50% -> 55分, 100% -> 85分
    const mathBaseScore = Math.round(35 + mathAccuracy * 50);

    // 根据数学测试结果设置易错偏好
    if (mathTotal > 0) {
      if (mathAccuracy >= 0.8) {
        parsedEvidence["易错偏好"] = `数学测试 ${mathCorrect}/${mathTotal}，基础扎实，不易在数学推导上出错`;
      } else if (mathAccuracy >= 0.5) {
        parsedEvidence["易错偏好"] = `数学测试 ${mathCorrect}/${mathTotal}，中等水平，需注意公式推导细节`;
      } else {
        parsedEvidence["易错偏好"] = `数学测试 ${mathCorrect}/${mathTotal}，数学基础薄弱，易在推导和计算上出错`;
      }
      parsedEvidence["知识基础"] = `数学测试正确率 ${Math.round(mathAccuracy * 100)}%，基础分数 ${mathBaseScore}`;
    }

    // 根据数学测试结果调整知识基础分数
    const knowledgeBaseDelta = mathBaseScore - 50; // 相对基准的偏移

    const next: ProfileVersion = {
      id: "PV-" + Date.now().toString(36),
      version: 1,
      createdAt: ts,
      trigger: username ? `首次对话引导构建（用户：${username}）` : "首次对话引导构建",
      dimensions: prev.dimensions.map((d) => {
        let baseScore = d.score;
        let delta = Math.floor(Math.random() * 7) - 3; // -3~3 的小随机扰动

        // 知识基础维度使用数学测试结果
        if (d.name === "知识基础" && mathTotal > 0) {
          baseScore = mathBaseScore;
          delta = 0;
        } else if (d.name === "知识基础") {
          delta += knowledgeBaseDelta;
        }

        // 易错偏好维度也受数学测试影响
        if (d.name === "易错偏好" && mathTotal > 0) {
          if (mathAccuracy < 0.5) {
            delta -= 5; // 基础薄弱，易错分降低
          } else if (mathAccuracy >= 0.8) {
            delta += 5; // 基础好，不易错
          }
        }

        const newScore = Math.min(95, Math.max(30, baseScore + delta));
        return {
          ...d,
          score: newScore,
          evidence: parsedEvidence[d.name] || d.evidence,
        };
      }),
    };

    const nextHistory = [next];
    saveToStorage("eduverse-profile", next);
    saveToStorage("eduverse-profile-history", nextHistory);
    set({
      currentProfile: next,
      profileHistory: nextHistory,
    });
    return next;
  },

  resources: preGeneratedResources,
  likedResource: (id) =>
    set((s) => ({
      resources: s.resources.map((r) =>
        r.id === id ? { ...r, liked: !r.liked } : r,
      ),
    })),

  tutorMessages: [],
  addTutorMessage: (m) =>
    set((s) => ({ tutorMessages: [...s.tutorMessages, m] })),
  updateLastTutorMessage: (content) =>
    set((s) => {
      const list = [...s.tutorMessages];
      const last = list[list.length - 1];
      if (last && last.role === "agent") {
        list[list.length - 1] = { ...last, content };
      }
      return { tutorMessages: list };
    }),

  profileMessages: [],
  addProfileMessage: (m) =>
    set((s) => ({ profileMessages: [...s.profileMessages, m] })),
  updateLastProfileMessage: (content) =>
    set((s) => {
      const list = [...s.profileMessages];
      const last = list[list.length - 1];
      if (last && last.role === "agent") {
        list[list.length - 1] = { ...last, content };
      }
      return { profileMessages: list };
    }),

  learningRecords: effectiveLearningRecords,
  markAsLearned: (knowledgeId) =>
    set((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const existing = s.learningRecords.find((r) => r.knowledgeId === knowledgeId);
      const next = existing
        ? s.learningRecords.map((r) =>
            r.knowledgeId === knowledgeId ? { ...r, learned: true, lastVisit: today } : r,
          )
        : [
            ...s.learningRecords,
            {
              knowledgeId,
              mastery: 0,
              timeSpent: 0,
              lastVisit: today,
              exercisesCorrect: 0,
              exercisesTotal: 0,
              completedResources: [],
              quizAttempts: 0,
              quizScore: 0,
              learned: true,
              quizCompleted: false,
            },
          ];
      saveToStorage("eduverse-learning-records", next);
      return { learningRecords: next };
    }),
  completeQuiz: (knowledgeId, result) =>
    set((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const existing = s.learningRecords.find((r) => r.knowledgeId === knowledgeId);
      const next = existing
        ? s.learningRecords.map((r) =>
            r.knowledgeId === knowledgeId
              ? {
                  ...r,
                  quizAttempts: r.quizAttempts + 1,
                  quizScore: Math.max(r.quizScore, result.score),
                  quizCompleted: true,
                  mastery: result.score,
                  exercisesCorrect: r.exercisesCorrect + result.correctCount,
                  exercisesTotal: r.exercisesTotal + result.totalQuestions,
                  lastVisit: today,
                }
              : r,
          )
        : [
            ...s.learningRecords,
            {
              knowledgeId,
              mastery: result.score,
              timeSpent: 0,
              lastVisit: today,
              exercisesCorrect: result.correctCount,
              exercisesTotal: result.totalQuestions,
              completedResources: [],
              quizAttempts: 1,
              quizScore: result.score,
              learned: false,
              quizCompleted: true,
            },
          ];
      saveToStorage("eduverse-learning-records", next);
      return { learningRecords: next };
    }),
  getRecordById: (knowledgeId) =>
    get().learningRecords.find((r) => r.knowledgeId === knowledgeId),

  practiceRecords: storedPracticeRecords,
  addPracticeRecord: (record) =>
    set((s) => {
      const today = new Date().toISOString().slice(0, 10);
      const accuracy = record.totalQuestions > 0
        ? Math.round((record.correctCount / record.totalQuestions) * 100)
        : 0;
      const newRecord: PracticeRecord = {
        ...record,
        date: today,
        accuracy,
      };
      const next = [...s.practiceRecords, newRecord];
      saveToStorage("eduverse-practice-records", next);

      const knowledgeSet = new Set(record.knowledgeIds);
      const updatedRecords = s.learningRecords.map((r) => {
        if (knowledgeSet.has(r.knowledgeId)) {
          const newMastery = Math.min(100, r.mastery + Math.max(1, Math.floor(accuracy / 20)));
          return {
            ...r,
            mastery: newMastery,
            lastVisit: today,
          };
        }
        return r;
      });
      saveToStorage("eduverse-learning-records", updatedRecords);

      return { practiceRecords: next, learningRecords: updatedRecords };
    }),
  getPracticeByDate: (date) => get().practiceRecords.filter((r) => r.date === date),
  getTotalPracticeStats: () => {
    const records = get().practiceRecords;
    const totalQ = records.reduce((s, r) => s + r.totalQuestions, 0);
    const totalC = records.reduce((s, r) => s + r.correctCount, 0);
    const days = new Set(records.map((r) => r.date)).size;
    return {
      totalQuestions: totalQ,
      correctCount: totalC,
      accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
      days,
    };
  },

  studyPlans: initialStudyPlans,
  currentPlanId: initialCurrentPlanId,
  createStudyPlan: (options) => {
    const plan = generateStudyPlan(options, get().learningRecords);
    set((s) => {
      const next = [...s.studyPlans, plan];
      saveToStorage("eduverse-study-plans", next);
      saveToStorage("eduverse-current-plan-id", plan.id);
      return { studyPlans: next, currentPlanId: plan.id };
    });
    return plan;
  },
  setCurrentPlan: (id) => {
    saveToStorage("eduverse-current-plan-id", id);
    set({ currentPlanId: id });
  },
  completeStudyPlanTask: (planId, taskRef) =>
    set((s) => {
      let completedMinutes = 0;
      let matched = false;
      const nextPlans = s.studyPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        const milestones = plan.milestones.map((milestone) => ({
          ...milestone,
          tasks: milestone.tasks.map((task) => {
            const isTarget = !matched
              && task.day === taskRef.day
              && task.knowledgeId === taskRef.knowledgeId
              && task.type === taskRef.type;
            if (!isTarget) return task;
            matched = true;
            if (!task.completed) completedMinutes = task.estimatedMinutes;
            return { ...task, completed: true };
          }),
        }));
        const allCompleted = milestones.every((milestone) =>
          milestone.tasks.every((task) => task.completed),
        );
        return { ...plan, milestones, status: allCompleted ? "completed" as const : plan.status };
      });

      if (!matched) return {};

      const today = new Date().toISOString().slice(0, 10);
      const existing = s.learningRecords.find((record) => record.knowledgeId === taskRef.knowledgeId);
      const nextRecords = existing
        ? s.learningRecords.map((record) => record.knowledgeId === taskRef.knowledgeId
          ? {
              ...record,
              learned: true,
              timeSpent: record.timeSpent + completedMinutes,
              lastVisit: today,
            }
          : record)
        : [
            ...s.learningRecords,
            {
              knowledgeId: taskRef.knowledgeId,
              mastery: 0,
              timeSpent: completedMinutes,
              lastVisit: today,
              exercisesCorrect: 0,
              exercisesTotal: 0,
              completedResources: [],
              quizAttempts: 0,
              quizScore: 0,
              learned: true,
              quizCompleted: false,
            },
          ];

      saveToStorage("eduverse-study-plans", nextPlans);
      saveToStorage("eduverse-learning-records", nextRecords);
      return { studyPlans: nextPlans, learningRecords: nextRecords };
    }),

  userQuestions: storedUserQuestions,
  addUserQuestion: (q) =>
    set((s) => {
      const now = new Date();
      const ts = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0") + " " +
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");
      const newQ: UserQuestion = {
        ...q,
        id: "uq-" + Date.now().toString(36),
        author: s.learner.name,
        authorAvatar: s.learner.avatar,
        createdAt: ts,
        likes: 0,
        comments: [],
      };
      const next = [newQ, ...s.userQuestions];
      saveToStorage("eduverse-user-questions", next);
      return { userQuestions: next };
    }),
  likeUserQuestion: (id) =>
    set((s) => {
      const next = s.userQuestions.map((q) =>
        q.id === id
          ? { ...q, likedByMe: !q.likedByMe, likes: q.likedByMe ? q.likes - 1 : q.likes + 1 }
          : q,
      );
      saveToStorage("eduverse-user-questions", next);
      return { userQuestions: next };
    }),
  addQuestionComment: (questionId, content) =>
    set((s) => {
      const now = new Date();
      const ts = now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0") + "-" +
        String(now.getDate()).padStart(2, "0") + " " +
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0");
      const comment: QuestionComment = {
        id: "cmt-" + Date.now().toString(36),
        author: s.learner.name,
        authorAvatar: s.learner.avatar,
        content,
        createdAt: ts,
      };
      const next = s.userQuestions.map((q) =>
        q.id === questionId ? { ...q, comments: [...q.comments, comment] } : q,
      );
      saveToStorage("eduverse-user-questions", next);
      return { userQuestions: next };
    }),

  workshopLog: [],
  workshopStreaming: "",
  workshopBusy: false,
  workshopResourceType: null,
  workshopGenerated: null,
  setWorkshop: (patch) => set(patch),
  pushWorkshopLog: (e) =>
    set((s) => ({ workshopLog: [...s.workshopLog, e] })),
  appendWorkshopStream: (tok) =>
    set((s) => ({ workshopStreaming: s.workshopStreaming + tok })),
  resetWorkshop: () =>
    set({
      workshopLog: [],
      workshopStreaming: "",
      workshopBusy: false,
      workshopResourceType: null,
      workshopGenerated: null,
    }),
}));

export { initialProfile, updatedProfile };
