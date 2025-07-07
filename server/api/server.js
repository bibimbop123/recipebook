import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Static file serving for deployed frontend (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "../../../dist");

// ✅ CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://recipebook-frontend-cxqi.onrender.com",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
  methods: "GET,POST,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// ✅ Recipe route
app.get("/api/recipes", async (req, res) => {
  const { query, from = 0, to = 10 } = req.query;
  if (!query) return res.status(400).json({ error: "Missing 'query' parameter" });

  const apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=${from}&to=${to}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) return res.status(response.status).json({ error: "Edamam API error" });
    const data = await response.json();
    res.status(200).json(data.hits || []);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Optional: Serve frontend if deployed together
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
