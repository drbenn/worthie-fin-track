const express = require("express");
const router = express.Router();
const app = express();

const balancesheetController = require("../controllers/balancesheet");

// /balancesheet => GET
router.get("/balancesheet", balancesheetController.getBalancesheet);

// /balancesheet => POST NEW TRANSACTION
router.post(
  "/balancesheet",
  balancesheetController.postBalancesheetTransaction
);

// /balancesheet => POST DELETE TRANSACTION
router.post(
  "/delete-balancesheet",
  balancesheetController.postDeleteBalancesheet
);

exports.routes = router;
