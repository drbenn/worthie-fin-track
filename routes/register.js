const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const registerController = require("../controllers/register");

// GET
router.get("/worthie/register", registerController.getRegister);

// POST
router.post("/worthie/register", registerController.postRegister);

exports.routes = router;
