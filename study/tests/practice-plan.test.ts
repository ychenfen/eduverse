import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { knowledgeNodes } from "@/data/course";
import {
  generateStudyPlan,
  getAllPracticeQuestions,
  getPracticeByKnowledge,
  getPracticeByType,
  getRandomPractice,
  getRandomPracticeByTypes,
  practiceQuestions,
} from "@/data/practice";
import type { PracticeQuestion, StudyPlanOptions } from "@/types";

function expectValidAnswer(question: PracticeQuestion): void {
  if (question.type === "single" || question.type === "judge") {
    expect(typeof question.correctAnswer).toBe("number");
    const answer = question.correctAnswer as number;
    if (question.type === "judge") {
      expect([0, 1]).toContain(answer);
    } else {
      expect(question.options).toBeDefined();
      expect(answer).toBeGreaterThanOrEqual(0);
      expect(answer).toBeLessThan(question.options?.length ?? 0);
    }
  }

  if (question.type === "multiple") {
    expect(Array.isArray(question.correctAnswer)).toBe(true);
    const answers = question.correctAnswer as number[];
    expect(answers.length).toBeGreaterThan(1);
    expect(new Set(answers)).toHaveLength(answers.length);
    for (const answer of answers) {
      expect(answer).toBeGreaterThanOrEqual(0);
      expect(answer).toBeLessThan(question.options?.length ?? 0);
    }
  }

  if (question.type === "fill") {
    expect(typeof question.correctAnswer).toBe("string");
    expect((question.correctAnswer as string).trim()).not.toBe("");
  }

  if (question.type === "code-fill") {
    expect(question.codeTemplate).toContain("______");
    expect(question.blanks).toEqual(question.correctAnswer);
    expect(question.blanks).toHaveLength(question.codeTemplate?.match(/______/g)?.length ?? 0);
  }
}

describe("practice bank invariants", () => {
  it("contains 40 unique, answerable questions across all supported types", () => {
    const courseIds = new Set(knowledgeNodes.map((node) => node.id));
    expect(practiceQuestions).toHaveLength(40);
    expect(getAllPracticeQuestions()).toBe(practiceQuestions);
    expect(new Set(practiceQuestions.map((question) => question.id))).toHaveLength(40);
    expect(new Set(practiceQuestions.map((question) => question.type))).toEqual(
      new Set(["single", "multiple", "judge", "fill", "code-fill"]),
    );

    for (const question of practiceQuestions) {
      expect(question.question.trim()).not.toBe("");
      expect(question.explanation.trim()).not.toBe("");
      expect(question.difficulty).toBeGreaterThanOrEqual(1);
      expect(question.difficulty).toBeLessThanOrEqual(3);
      expect(courseIds.has(question.knowledgeId)).toBe(true);
      expectValidAnswer(question);
    }
  });

  it("filters by type without mutating the source bank", () => {
    const originalIds = practiceQuestions.map((question) => question.id);
    const single = getPracticeByType("single");
    const mixed = getRandomPracticeByTypes(8, ["fill", "judge"]);

    expect(single.length).toBeGreaterThan(0);
    expect(single.every((question) => question.type === "single")).toBe(true);
    expect(mixed).toHaveLength(8);
    expect(mixed.every((question) => ["fill", "judge"].includes(question.type))).toBe(true);
    expect(practiceQuestions.map((question) => question.id)).toEqual(originalIds);
  });

  it("supports bounded type and knowledge lookups", () => {
    expect(getPracticeByType("single", 3)).toHaveLength(3);
    expect(getPracticeByKnowledge("ai-intro")).toHaveLength(5);
    expect(getPracticeByKnowledge("missing")).toEqual([]);
  });

  it("caps random requests to the available pool and avoids duplicate questions", () => {
    const all = getRandomPractice(1000);
    expect(all).toHaveLength(practiceQuestions.length);
    expect(new Set(all.map((question) => question.id))).toHaveLength(all.length);
  });
});

describe("study plan generation", () => {
  const baseOptions: StudyPlanOptions = {
    goal: "深度学习冲刺",
    focusAreas: ["dl"],
    difficulty: "intermediate",
    dailyMinutes: 60,
    durationDays: 30,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-01T08:00:00+08:00"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates deterministic, dated tasks from valid course nodes", () => {
    const plan = generateStudyPlan(baseOptions);
    const tasks = plan.milestones.flatMap((milestone) => milestone.tasks);
    const validIds = new Set(knowledgeNodes.map((node) => node.id));

    expect(plan.title).toBe(baseOptions.goal);
    expect(plan.startDate).toBe("2026-08-01");
    expect(plan.endDate).toBe("2026-08-30");
    expect(plan.milestones).toHaveLength(3);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((task) => validIds.has(task.knowledgeId))).toBe(true);
    expect(tasks.every((task) => task.day >= 1 && task.day <= 30)).toBe(true);
    expect(tasks.every((task) => /^2026-08-\d{2}$/.test(task.date))).toBe(true);
  });

  it("scales workload upward with difficulty without changing selected topics", () => {
    const beginner = generateStudyPlan({ ...baseOptions, difficulty: "beginner" });
    const advanced = generateStudyPlan({ ...baseOptions, difficulty: "advanced" });
    const beginnerTasks = beginner.milestones.flatMap((milestone) => milestone.tasks);
    const advancedTasks = advanced.milestones.flatMap((milestone) => milestone.tasks);

    expect(advancedTasks.map((task) => task.knowledgeId)).toEqual(
      beginnerTasks.map((task) => task.knowledgeId),
    );
    expect(advancedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0)).toBeGreaterThan(
      beginnerTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0),
    );
  });

  it("recommends unlearned nodes when progress records are available", () => {
    const learnedIds = knowledgeNodes.slice(0, 8).map((node) => node.id);
    const records = learnedIds.map((knowledgeId) => ({
      knowledgeId,
      mastery: 80,
      timeSpent: 30,
      lastVisit: "2026-07-31",
      exercisesCorrect: 4,
      exercisesTotal: 5,
      completedResources: [],
      quizAttempts: 1,
      quizScore: 80,
      learned: true,
      quizCompleted: true,
    }));
    const plan = generateStudyPlan({ ...baseOptions, focusAreas: [] }, records);
    const plannedIds = new Set(
      plan.milestones.flatMap((milestone) => milestone.tasks.map((task) => task.knowledgeId)),
    );

    expect(learnedIds.some((id) => plannedIds.has(id))).toBe(false);
    expect(plannedIds.size).toBeGreaterThan(0);
  });

  it.each([7, 14, 28])("covers the final day of a %d-day plan in its milestones", (durationDays) => {
    const plan = generateStudyPlan({ ...baseOptions, focusAreas: [], durationDays });
    const tasks = plan.milestones.flatMap((milestone) => milestone.tasks);
    const taskKeys = tasks.map((task) => `${task.day}:${task.knowledgeId}:${task.type}:${task.title}`);

    expect(plan.milestones.at(-1)?.date).toBe(plan.endDate);
    expect(plan.milestones.at(-1)?.title).toContain(`-${durationDays} 天`);
    expect(new Set(taskKeys)).toHaveLength(taskKeys.length);
  });
});
