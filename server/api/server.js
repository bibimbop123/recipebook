import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configure CORS to allow requests from your frontend
const corsOptions = {
  origin: [
    'http://localhost:5173',  // Your local development frontend
    'https://recipebook-1-82qf.onrender.com',  // Your deployed frontend
    'https://recipebook-frontend-y3dl.onrender.com',
    'https://recipebook-backend-g6d9.onrender.com'  // Your backend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add these API routes directly in server.js
app.get("/api/recipes", async (req, res) => {
  const { query, from, to } = req.query;

  try {
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

app.get("/api/recipes/:id", async (req, res) => {
  const { id } = req.params;

  try {
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});