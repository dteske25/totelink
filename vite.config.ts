/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    process.env.VITEST ? undefined : cloudflare(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    setupFiles: ["./src/setupTests.ts"],
    projects: [
      {
        extends: true,
        test: {
          name: "api",
          include: ["worker/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "ui",
          include: ["src/**/*.test.(ts|tsx)"],
          environment: "jsdom",
        },
      },
    ],
  },
});
