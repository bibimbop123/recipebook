import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch"; // Add this line if you're using Node < 18

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://recipebook-frontend-y3dl.onrender.com" // Replace with your real frontend URL if deployed
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log request origin for debugging
app.use((req, res, next) => {
  console.log("Request Origin:", req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Recipes endpoint
app.get("/api/recipes", async (req, res) => {
  try {
    const { query, from, to } = req.query;
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

// Recipe by ID endpoint
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
