// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': 'http://localhost:8080', // This will proxy to your backend
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',          // ✅ Node core module
        'crypto',
        'stream',
        'util',
        'zlib',
        'http',
        'https',
      ],
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
