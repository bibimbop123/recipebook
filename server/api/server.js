import express from "express";
import dotenv from "dotenv";
import path from "path";
import apiRouter from "./api/index.js";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "dist")));

app.use("/api", apiRouter);

// app.post("/api", async (req, res) => {
//   const response = await fetch(
//     `https://api.edamam.com/search?q=${req.body.query}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`
//   );
//   const { hits } = await response.json();
//   console.log("hits", hits);
//   res.status(200).send(hits);
// });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log("Kickin it on http://localhost:8080");
});
