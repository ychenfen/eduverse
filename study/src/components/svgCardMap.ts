import type { FC } from "react";
import {
  AdmissibleHeuristicSvg,
  AlgorithmFlowchartSvg,
  ApplicationCasesSvg,
  ApplicationScenariosSvg,
  ComplexityComparisonSvg,
  ConceptAnalogySvg,
  ConceptDimensionsSvg,
  ConceptRelationsSvg,
  HistoryPioneersSvg,
  KeyMechanismsSvg,
  ModelArchitectureSvg,
  ModelComparisonSvg,
  ModelEvolutionSvg,
  ProblemDefinitionSvg,
  TimelineMilestonesSvg,
  TrainingFlowSvg,
  WinterPeriodSvg,
} from "./SvgCards";

const svgCardMap: Record<string, FC> = {
  "concept-dimensions": ConceptDimensionsSvg,
  "concept-analogy": ConceptAnalogySvg,
  "concept-relations": ConceptRelationsSvg,
  "application-cases": ApplicationCasesSvg,
  "timeline-milestones": TimelineMilestonesSvg,
  "history-pioneers": HistoryPioneersSvg,
  "winter-period": WinterPeriodSvg,
  "model-architecture": ModelArchitectureSvg,
  "model-evolution": ModelEvolutionSvg,
  "key-mechanisms": KeyMechanismsSvg,
  "training-flow": TrainingFlowSvg,
  "model-comparison": ModelComparisonSvg,
  "problem-definition": ProblemDefinitionSvg,
  "algorithm-flowchart": AlgorithmFlowchartSvg,
  "complexity-comparison": ComplexityComparisonSvg,
  "admissible-heuristic": AdmissibleHeuristicSvg,
  "application-scenarios": ApplicationScenariosSvg,
};

export default svgCardMap;
