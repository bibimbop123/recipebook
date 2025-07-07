import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist" // ✅ ensures build output is in /dist
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
