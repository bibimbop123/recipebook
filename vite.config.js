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
    outDir: "dist", // Ensure this is for frontend only
    emptyOutDir: true,
    rollupOptions: {
      external: ["node-fetch", "url"], // Exclude Node.js modules
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