const express = require("express");
const router = express.Router();
const app = express();

const balancesheetController = require("../controllers/balancesheet");
const incomeController = require("../controllers/income");

// /balancesheet => GET
router.get("/worthie/balancesheet", balancesheetController.getBalancesheet);

// /balancesheet => POST NEW TRANSACTION
router.post(
  "/worthie/balancesheet",
  balancesheetController.postBalancesheetTransaction
);

// /balancesheet => POST DELETE TRANSACTION
router.post(
  "/worthie/delete-balancesheet",
  balancesheetController.postDeleteBalancesheet
);

exports.routes = router;
