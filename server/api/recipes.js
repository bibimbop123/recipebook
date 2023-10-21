import express from "express";
const router = express.Router();
import fetch from "node-fetch";

router.get("/", async (req, res) => {
  const response = await fetch(
    `https://api.edamam.com/api/recipes/v2/search?q=${req.query.query}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`
  );
  const { hits } = await response.json();
  console.log("hits", hits);
  res.status(200).send(hits);
});

export default router;
