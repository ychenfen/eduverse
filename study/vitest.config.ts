import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: [
        "src/agents/orchestrator.ts",
        "src/data/agents.ts",
        "src/data/course.ts",
        "src/data/practice.ts",
        "src/data/resources.ts",
        "src/services/safety.ts",
        "src/services/streaming.ts",
        "src/services/tutor.ts",
      ],
      reporter: ["text", "json-summary", "lcov"],
      reportsDirectory: "coverage",
      thresholds: {
        statements: 95,
        branches: 85,
        functions: 95,
        lines: 95,
      },
    },
  },
});
