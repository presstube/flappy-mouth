import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "/src/main.js",
    },
    outDir: "docs",
  },
  server: {
    open: true,
    watch: {
      usePolling: true,
    },
  },
});
