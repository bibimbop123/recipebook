import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    outDir: "server/api",
    emptyOutDir: true,
    rollupOptions: {
      external: ["node-fetch"], // Exclude node-fetch from the frontend build
      input: {
        main: "./server/api/server.js",
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
});