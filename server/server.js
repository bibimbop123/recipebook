import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import App from "../src/App.jsx";

dotenv.config();

export const REACT_APP_ID = process.env.REACT_APP_ID;
export const REACT_APP_KEY = process.env.REACT_APP_KEY;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use("/api", App);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log("Kickin it on http://localhost:8080");
});
