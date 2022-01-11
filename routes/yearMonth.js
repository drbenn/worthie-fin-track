const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const yearMonthController = require("../controllers/yearmonth");

// GET
router.get("/", (req, res, next) => {
  res.render("yearmonth", {
    pageTitle: "Year & Month Select",
    path: "/yearmonth",
  });
});

// /yearmonth => POST
router.post("/yearmonth", yearMonthController.postYearMonth);

exports.routes = router;
