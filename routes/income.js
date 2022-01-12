const express = require("express");
const router = express.Router();
const app = express();

const incomeController = require("../controllers/income");

// /income => GET
router.get("/worthie/income", incomeController.getIncome);

// /income => POST NEW TRANSACTION
router.post("/worthie/income", incomeController.postIncomeTransaction);

// /income => POST DELETE TRANSACTION
router.post("/worthie/delete-income", incomeController.postDeleteIncome);

exports.routes = router;
