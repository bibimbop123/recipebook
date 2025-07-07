import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// 🔐 Absolute path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../dist");

// ✅ Allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://recipebook-backend-g6d9.onrender.com"
];

// ✅ Global CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("🌐 Request origin:", origin);

  if (!origin || allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  } else {
    console.warn("❌ Blocked by CORS:", origin);
    res.status(403).json({ error: "Not allowed by CORS" });
  }
});

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Recipes endpoint
app.get("/api/recipes", async (req, res) => {
  try {
    const { query, from = 0, to = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ error: "Missing 'query' parameter" });
    }

    const edamamUrl = `https://api.edamam.com/search?q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=${from}&to=${to}`;
    console.log("🔎 Fetching from Edamam:", edamamUrl);

    const response = await fetch(edamamUrl);

    if (!response.ok) {
      console.error("❌ Edamam error:", response.statusText);
      return res.status(response.status).json({ error: "Failed to fetch recipes" });
    }

    const data = await response.json();
    res.status(200).json(data.hits);
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Fetch by recipe ID
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://api.edamam.com/search?r=${id}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch recipe" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("✅ RecipeBook Backend is live!");
});

// ✅ Serve static frontend after API routes
app.use(express.static(distPath));

// ✅ Fallback to React SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

// ✅ Start server for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
