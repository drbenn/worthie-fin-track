const express = require("express");
const router = express.Router();
const app = express();

const expensesController = require("../controllers/expenses");

// /expenses => GET
router.get("/worthie/expenses", expensesController.getExpenses);

// /expenses => POST NEW TRANSACTION
router.post("/expenses", expensesController.postExpenseTransaction);

// /expenses => POST DELETE TRANSACTION
router.post("/delete-expense", expensesController.postDeleteExpense);

exports.routes = router;
