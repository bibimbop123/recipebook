import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../dist");

// ✅ Allowlisted CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://recipebook-jvvm.onrender.com",
  "https://recipebook-backend-3axy.onrender.com",
  "https://recipebook-frontend-cxqi.onrender.com"
];

// ✅ Custom CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  } else {
    console.warn("❌ CORS blocked:", origin);
    res.status(403).json({ error: "Not allowed by CORS" });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API route with enhanced logging and error handling
app.get("/api/recipes", async (req, res) => {
  const { query, from = 0, to = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query'" });
  }

  const url = `https://api.edamam.com/search?q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=${from}&to=${to}`;

  try {
    console.log("🔎 Fetching from Edamam:", url);

    const response = await fetch(url);
    const status = response.status;
    const contentType = response.headers.get("content-type") || "";

    console.log("📡 Edamam response status:", status);
    console.log("📦 Content-Type:", contentType);

    const text = await response.text();
    console.log("📄 Edamam raw response (first 300 chars):", text.slice(0, 300));

    if (!response.ok) {
      return res.status(status).json({ error: `Edamam API error: ${status}` });
    }

    if (contentType.includes("application/json")) {
      const data = JSON.parse(text);
      return res.status(200).json(data.hits || []);
    } else {
      console.error("❌ Unexpected content type:", contentType);
      return res.status(502).json({ error: "Unexpected response format from Edamam" });
    }
  } catch (err) {
    console.error("🔥 Fetch or parse error:", err.message || err);
    res.status(500).json({ error: "Internal server error while fetching recipes" });
  }
});

// ✅ Serve built React app
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
