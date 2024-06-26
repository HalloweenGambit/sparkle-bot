import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./setupTests.ts", // Path to your setup file
  },
});
