import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // you forgot to import this
import fetch from "node-fetch"; // Only needed for Node < 18

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ CORS setup: allow specific origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://recipebook-frontend-y3dl.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Recipes endpoint
app.get("/api/recipes", async (req, res) => {
  try {
    const { query, from = 0, to = 10 } = req.query;
    const response = await fetch(
      `https://api.edamam.com/search?q=${query}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}&from=${from}&to=${to}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch recipes" });
    }

    const data = await response.json();
    res.status(200).json(data.hits);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Recipe by ID endpoint
app.get("/api/recipes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await fetch(
      `https://api.edamam.com/search?r=${id}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch recipe" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

// ✅ Start server (Render compatibility)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
