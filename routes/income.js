const express = require("express");
const router = express.Router();
const app = express();

const incomeController = require("../controllers/income");

// /income => GET
router.get("/income", incomeController.getIncome);

// /income => POST NEW TRANSACTION
router.post("/income", incomeController.postIncomeTransaction);

// /income => POST DELETE TRANSACTION
router.post("/delete-income", incomeController.postDeleteIncome);

exports.routes = router;
