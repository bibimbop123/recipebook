import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const main = fileURLToPath(import.meta.url);
const parentfile = path.dirname(main);

const app = express();
const PORT = 3000;
export const REACT_APP_ID = process.env.REACT_APP_ID;
export const REACT_APP_KEY = process.env.REACT_APP_KEY;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(parentfile, "..", "src")));

app.get("*", (req, res) => {
  res.sendFile(path.join(parentfile, "..", "src", "index.html"));
});

app.listen(PORT, () => {
  console.log("Kickin it on port " + PORT);
});
