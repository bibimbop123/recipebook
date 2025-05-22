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
    outDir: "server/api/",
    rollupOptions: {
      //server.js will be in the same folder as the dist folder
      input: {
        main: "./src/main.js",
        server: "./server/api/server.js",
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