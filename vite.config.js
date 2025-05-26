import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: true,
    proxy: {
      '/api': 'https://recipebook-1-82qf.onrender.com/',
    },
  },
  build: {
    outDir: "dist", // Ensure the build output directory is correct
  },
  resolve: {
    alias: {
      "@": "/src", // Alias for cleaner imports
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`, // SCSS global variables
      },
    },
  },
});