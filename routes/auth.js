const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

const authController = require("../controllers/auth");

// GET
router.get("/worthie", authController.getLogin);

router.post("/worthie/login", authController.postLogin);

router.post("/worthie/logout", authController.postLogout);

exports.routes = router;
