import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

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

export const API_KEY = process.env.REACT_APP_KEY;
export const API_ID = process.env.REACT_APP_ID;

const express = require("express");
const path = require("path");
const main = require("./dist/server/main");

const app = express();

app.use(express.static(path.join(main, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(main, "dist", "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
