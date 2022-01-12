const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const yearMonthController = require("../controllers/yearmonth");

// GET
router.get("/worthie", (req, res, next) => {
  res.render("yearmonth", {
    pageTitle: "Year & Month Select",
    path: "/yearmonth",
  });
});

// /yearmonth => POST
router.post("/worthie/update-year", yearMonthController.postYearMonth);

exports.routes = router;
