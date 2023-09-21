// const router = require("express").Router();
import express from "express";
import recipesApi from "./recipes.js";

const apiRouter = express.Router();

apiRouter.use("/recipes", recipesApi);

export default apiRouter;
