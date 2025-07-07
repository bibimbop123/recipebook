import express from "express";
const router = express.Router();
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";


router.get("/", async (req, res) => {
  const { query, from, to } = req.query;
  const response = await axios.get(
    `https://api.edamam.com/api/recipes/v2?type=public&q=${query}&app_id=${process.env.EDAMAM_APP_ID}&app_key=${process.env.EDAMAM_API_KEY}&from=${from}&to=${to}`
  );
  const { hits } = response.data;
  console.log("hits", hits);
  res.status(200).send(hits);
});

export default router;
