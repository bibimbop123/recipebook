import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Define your Vite configuration here
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000, // Specify the port you want to use
    open: true, // Automatically open the browser
  },
  build: {
    outDir: "dist", // Output directory
  },
});
