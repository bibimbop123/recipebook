import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch"; // Only needed for Node < 18
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allow frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://recipebook-frontend-y3dl.onrender.com", // old
  "https://recipebook-backend-g6d9.onrender.com"   // current fullstack render URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options("*", cors());

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static frontend from root /dist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../dist");

app.use(express.static(distPath));

// ✅ Fallback for React Router (SPA)
app.get("/*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.send("✅ RecipeBook Backend is live!");
});

// ✅ Recipe search endpoint
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

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

// ✅ Start server for Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
