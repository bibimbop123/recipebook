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
    'https://recipebook-1-82qf.onrender.com' // Your deployed frontend
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});