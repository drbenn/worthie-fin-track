const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

router.get("/instructions", (req, res, next) => {
  //   res.sendFile(path.join(rootDir, "views", "investments.html"));
  res.render("instructions", {
    pageTitle: "Instructions",
    path: "/instructions",
  });
});

module.exports = router;
