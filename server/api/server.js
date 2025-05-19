import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // ✅ Add this line
import apiRouter from "./index.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors()); // ✅ Add this line
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/api", apiRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.get("/recipes", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
