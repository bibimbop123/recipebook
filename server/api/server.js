import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Resolve __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Correct distPath for most deployments (dist in project root)
const distPath = path.join(__dirname, "../../dist");

// ✅ Allowlisted CORS origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://recipebook-frontend-m4pz.onrender.com"
];

// ✅ Use only the cors package for CORS handling
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API route
app.get("/api/recipes", async (req, res) => {
  const { query, from = 0, to = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing 'query'" });
  }

  const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=${from}&to=${to}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Edamam-Account-User": process.env.EDAMAM_USER_ID || "chef-boyardee"
      }
    });

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Edamam API error response:", text);
      return res.status(response.status).json({ error: "Failed to fetch recipes", details: text });
    }

    const data = await response.json();
    res.status(200).json(data.hits);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// ✅ Serve static React app (production build)
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});