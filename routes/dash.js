const express = require("express");
const router = express.Router();

const dashController = require("../controllers/dash");

// /dash => GET
router.get("/dash", dashController.getDash);

exports.routes = router;
