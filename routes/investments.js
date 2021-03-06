const express = require("express");
const router = express.Router();
const app = express();

const investmentsController = require("../controllers/investments");

// /investments => GET
router.get("/worthie/investments", investmentsController.getInvestments);

// /investments => POST NEW TRANSACTION
router.post(
  "/worthie/investments",
  investmentsController.postInvestmentsTransaction
);

// /investments => POST DELETE TRANSACTION
router.post(
  "/worthie/delete-investments",
  investmentsController.postDeleteInvestments
);

exports.routes = router;
