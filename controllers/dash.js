const db = require("../util/database");
const Dash = require("../models/dash");
// GOOD BEFORE HERE

const defaultYear = Number(yearMonth[0]);
const defaultMonth = yearMonth[1];

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
});

// getDashboard From SQL Table
exports.getDash = (req, res, next) => {
  let cookieYear = undefined;
  let cookieMonth = undefined;
  let cookieUser = undefined;

  cookieYear =
    cookieYear !== "undefined"
      ? (cookieYear = req.get("Cookie").split("=")[3].slice(0, 4))
      : (cookieYear = defaultYear);

  cookieMonth =
    cookieMonth !== "undefined"
      ? (cookieMonth = req.get("Cookie").split("=")[4].slice(0, 3))
      : (cookieMonth = defaultMonth);

  cookieUser = req.get("Cookie").split("=")[1].split(";")[0];

  Dash.fetchAll(cookieUser, cookieYear, cookieMonth)
    .then(([rows, FieldData]) => {
      const assetArray = [];
      const liabilityArray = [];
      const expenseArray = [];
      const incomeArray = [];
      const investArray = [];
      for (let row of rows) {
        // console.log(row);

        // Loop to add values to arrays for assets, liabilites, expenses, income and investments
        if (row.trans_type === "balance_sheet" && row.category === "asset") {
          assetArray.push(parseFloat(row.amount));
        } else if (
          row.trans_type === "balance_sheet" &&
          row.category === "liability"
        ) {
          liabilityArray.push(parseFloat(row.amount));
        } else if (row.trans_type === "expense") {
          expenseArray.push(parseFloat(row.amount));
        } else if (row.trans_type === "income") {
          incomeArray.push(parseFloat(row.amount));
        } else if (row.trans_type === "investment") {
          investArray.push(parseFloat(row.amount));
        }
      }
      // Adding arrays and formatting for final values of assets, liabilites, expenses, income and investments

      // Asset Values
      const totalAssetValue = assetArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      const totalAssetValueDecimal = totalAssetValue.toFixed(2);
      const totalAssetValueFormat = formatter.format(totalAssetValueDecimal);

      // Liability Values
      const totalLiabilityValue = liabilityArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      const totalLiabilityValueDecimal = totalLiabilityValue.toFixed(2);
      const totalLiabiltiyValueFormat = formatter.format(
        totalLiabilityValueDecimal
      );

      // Net Net worth Calc
      const netWorthValueDecimal = (
        totalAssetValueDecimal - totalLiabilityValueDecimal
      ).toFixed(2);
      const netWorthValueFormat = formatter.format(netWorthValueDecimal);

      // Expense Values
      const totalExpenseValue = expenseArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      const totalExpenseValueDecimal = totalExpenseValue.toFixed(2);
      const totalExpenseValueFormat = formatter.format(
        totalExpenseValueDecimal
      );

      // Income Values
      const totalIncomeValue = incomeArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      const totalIncomeValueDecimal = totalIncomeValue.toFixed(2);
      const totalIncomeValueFormat = formatter.format(totalIncomeValueDecimal);

      // Savings Values
      const totalSavingsValueDecimal =
        totalIncomeValueDecimal - totalExpenseValueDecimal;
      const totalSavingsValueFormat = formatter.format(
        totalSavingsValueDecimal
      );

      // Investment Values
      const totalInvestValue = investArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      const totalInvestValueDecimal = totalInvestValue.toFixed(2);
      const totalInvestValueFormat = formatter.format(totalInvestValueDecimal);

      // Chart Data
      const cashFlowChartData = [
        totalIncomeValueFormat,
        totalExpenseValueFormat,
        totalSavingsValueFormat,
      ];
      const netWorthChartData = [
        totalAssetValueFormat,
        totalLiabiltiyValueFormat,
        totalInvestValueFormat,
        netWorthValueFormat,
      ];

      // console.log(`total asset value: ${totalAssetValueDecimal}`);
      // console.log(`total liab value: ${totalLiabilityValueDecimal}`);
      // console.log(`total NW: ${netWorthValueDecimal}`);
      // console.log(`total expense value: ${totalExpenseValueDecimal}`);
      // console.log(`total income value: ${totalIncomeValueDecimal}`);
      // console.log(`total invest value: ${totalInvestValueDecimal}`);

      // let calcTotalAssetArray = assetArray.reduce(function (a, b) {
      //   return a + b;
      // }, 0);
      // let totalAssetArray = calcTotalAssetArray.toFixed(2);
      // let calcTotalLiabilityArray = liabilityArray.reduce(function (a, b) {
      //   return a + b;
      // }, 0);
      // let totalLiabilityArray = calcTotalLiabilityArray.toFixed(2);
      // let bsNetWorth = totalAssetArray - totalLiabilityArray;
      // const transactionRows = JSON.stringify(rows);

      res.render("dash", {
        trans: rows,
        pageTitle: "Dashboard",
        path: "/dash",
        bsAssetTotal: totalAssetValueFormat,
        bsLiabilityTotal: totalLiabiltiyValueFormat,
        bsNetWorthTotal: netWorthValueFormat,
        expenseTotal: totalExpenseValueFormat,
        incomeTotal: totalIncomeValueFormat,
        savingsTotal: totalSavingsValueFormat,
        investTotal: totalInvestValueFormat,
        activeMonth: yearMonth[1].toUpperCase(),
        activeYear: Number(yearMonth[0]),
        isAuthenticated: req.isLoggedIn,
        cashFlowChartData: cashFlowChartData,
        netWorthChartData: netWorthChartData,
        // hasTransactions: transactions.length > 0,
        // date: null,
        // category: null,
        // description: null,
        // amount: null,
      });
    })
    .catch((err) => console.log(err));
};
