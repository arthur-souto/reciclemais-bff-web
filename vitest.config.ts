import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/adapters/in/http/**/*.ts"],
      exclude: ["src/adapters/in/http/**/__tests__/**"],
    },
  },
});
