//set up server for production
// Path: server.js
const express = require("express");
const path = require("path");
const main = require("./dist/server/main");

const app = express();

app.use(express.static(path.join(main, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(main, "dist", "index.html"));
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
