import { describe, expect, it } from "vitest";

import { agents, agentPipeline, getAgentById } from "@/data/agents";
import {
  chapters,
  getKnowledgeByChapter,
  getKnowledgeById,
  knowledgeNodes,
} from "@/data/course";
import {
  buildCustomResource,
  getResourceById,
  getResourcesByKnowledge,
  getResourcesByType,
  preGeneratedResources,
  resourceTypeMeta,
} from "@/data/resources";
import type { ResourceType } from "@/types";

const resourceTypes = Object.keys(resourceTypeMeta) as ResourceType[];

function hasPrerequisiteCycle(): boolean {
  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (id: string): boolean => {
    if (visiting.has(id)) return true;
    if (visited.has(id)) return false;
    visiting.add(id);
    const node = getKnowledgeById(id);
    if (node?.prerequisites.some(visit)) return true;
    visiting.delete(id);
    visited.add(id);
    return false;
  };

  return knowledgeNodes.some((node) => visit(node.id));
}

describe("course catalog invariants", () => {
  it("keeps six chapters with four unique knowledge nodes each", () => {
    expect(chapters.map((chapter) => chapter.no)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(knowledgeNodes).toHaveLength(24);
    expect(new Set(knowledgeNodes.map((node) => node.id))).toHaveLength(24);

    for (const chapter of chapters) {
      expect(getKnowledgeByChapter(chapter.no)).toHaveLength(4);
    }
  });

  it("has no dangling prerequisites or dependency cycles", () => {
    const ids = new Set(knowledgeNodes.map((node) => node.id));
    for (const node of knowledgeNodes) {
      expect(node.prerequisites.every((id) => ids.has(id))).toBe(true);
      expect(node.prerequisites).not.toContain(node.id);
    }
    expect(hasPrerequisiteCycle()).toBe(false);
  });

  it("keeps every node within supported learning bounds", () => {
    for (const node of knowledgeNodes) {
      expect(node.difficulty).toBeGreaterThanOrEqual(1);
      expect(node.difficulty).toBeLessThanOrEqual(5);
      expect(node.estimatedMinutes).toBeGreaterThan(0);
      expect(node.title.trim()).not.toBe("");
      expect(node.summary.trim()).not.toBe("");
      expect(getKnowledgeById(node.id)).toBe(node);
    }
  });
});

describe("generated resource catalog", () => {
  it("covers every knowledge node with all six resource types", () => {
    expect(resourceTypes).toHaveLength(6);
    expect(preGeneratedResources).toHaveLength(144);
    expect(new Set(preGeneratedResources.map((resource) => resource.id))).toHaveLength(144);

    for (const node of knowledgeNodes) {
      const resources = getResourcesByKnowledge(node.id);
      expect(resources).toHaveLength(6);
      expect(new Set(resources.map((resource) => resource.type))).toEqual(new Set(resourceTypes));
    }
  });

  it("keeps resource metadata and type-specific payloads internally consistent", () => {
    const knowledgeIds = new Set(knowledgeNodes.map((node) => node.id));

    for (const resource of preGeneratedResources) {
      expect(knowledgeIds.has(resource.knowledgeId)).toBe(true);
      expect(resource.title).toContain(resourceTypeMeta[resource.type].label);
      expect(resource.content.trim().length).toBeGreaterThan(100);
      expect(resource.excerpt.trim().length).toBeGreaterThan(10);
      expect(resource.metadata.knowledgePoints).toContain(resource.knowledgeId);
      expect(resource.safetyCheck).toEqual({ passed: true, flags: [], score: 100 });
      expect(getResourceById(resource.id)).toBe(resource);

      if (resource.type === "animation") {
        const scenes = resource.metadata.animationScenes ?? [];
        expect(scenes).toHaveLength(resource.metadata.scenes);
        expect(scenes.map((scene) => scene.index)).toEqual([1, 2, 3, 4, 5, 6, 7]);
        scenes.forEach((scene, index) => {
          expect(scene.durationMs).toBeGreaterThan(0);
          expect(scene.svg).toContain("<svg");
          if (index > 0) {
            const previous = scenes[index - 1];
            expect(scene.startMs).toBe(previous.startMs + previous.durationMs);
          }
        });
      }

      if (resource.type === "mindmap") {
        expect(resource.metadata.mindmap?.root.id).toBe(resource.knowledgeId);
      }
      if (resource.type === "quiz") expect(resource.metadata.questionCount).toBe(5);
      if (resource.type === "code") expect(resource.metadata.runtime).toBe("Python 3.10+");
    }
  });

  it.each(resourceTypes)("returns the complete %s resource collection", (type) => {
    const resources = getResourcesByType(type);
    expect(resources).toHaveLength(24);
    expect(resources.every((resource) => resource.type === type)).toBe(true);
  });

  it.each(resourceTypes)("builds a safe custom %s resource", (type) => {
    const resource = buildCustomResource(type, "可解释人工智能");
    expect(resource.type).toBe(type);
    expect(resource.title).toContain("可解释人工智能");
    expect(resource.knowledgeId).toMatch(/^custom-\d+$/);
    expect(resource.metadata.knowledgePoints).toEqual([resource.knowledgeId]);
    expect(resource.safetyCheck.passed).toBe(true);
  });
});

describe("agent pipeline registry", () => {
  it("uses unique agents and resolvable pipeline members", () => {
    expect(new Set(agents.map((agent) => agent.id))).toHaveLength(agents.length);
    expect(getAgentById("captain")?.name).toBe("灵境");
    expect(getAgentById("missing")).toBeUndefined();

    expect(Object.keys(agentPipeline).sort()).toEqual([...resourceTypes].sort());
    for (const type of resourceTypes) {
      const pipeline = agentPipeline[type];
      expect(pipeline).toHaveLength(3);
      expect(pipeline.at(-1)?.id).toBe("validator");
      expect(pipeline.every((stage) => getAgentById(stage.id))).toBe(true);
    }
  });
});
