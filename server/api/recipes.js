// const router = require("express").Router();
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const response = await fetch(
    `https://api.edamam.com/search?q=${req.body.query}&app_id=${process.env.REACT_APP_ID}&app_key=${process.env.REACT_APP_KEY}`
  );
  const { hits } = await response.json();
  console.log("hits", hits);
  res.status(200).send(hits);
});

export default router;
