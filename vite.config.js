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
      outDir: "dist",
      rollupOptions: {
        input: {
          main: "./index.html",
          // Remove nested to fix the error
        },
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
  }
});

