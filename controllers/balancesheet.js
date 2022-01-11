const db = require("../util/database");
const BalanceSheet = require("../models/balancesheet");

const balancesheetTransaction = [];
const monthsObjForDelete = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

// getbalancesheet From SQL Table
exports.getBalancesheet = (req, res, next) => {
  BalanceSheet.fetchAll()
    .then(([rows, FieldData]) => {
      const assetArray = [];
      const liabilityArray = [];
      for (let row of rows) {
        if (row.category === "asset") {
          assetArray.push(parseFloat(row.amount));
        } else if (row.category === "liability") {
          liabilityArray.push(parseFloat(row.amount));
        }
      }
      let calcTotalAssetArray = assetArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      let totalAssetArray = calcTotalAssetArray.toFixed(2);
      let calcTotalLiabilityArray = liabilityArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      let totalLiabilityArray = calcTotalLiabilityArray.toFixed(2);
      let bsNetWorth = totalAssetArray - totalLiabilityArray;
      // const transactionRows = JSON.stringify(rows);
      // console.log(`rows: ${transactionRows}`);
      // console.log(`trans_type: ${transactionRows["trans_type"]}`);
      res.render("balancesheet", {
        trans: rows,
        pageTitle: "BalanceSheet",
        path: "/worthie/balancesheet",
        bsAssetTotal: totalAssetArray,
        bsLiabilityTotal: totalLiabilityArray,
        bsNetWorthTotal: bsNetWorth,
        activeMonth: yearMonth[1].toUpperCase(),
        activeYear: Number(yearMonth[0]),
        // hasTransactions: transactions.length > 0,
        // date: null,
        // category: null,
        // description: null,
        // amount: null,
      });
    })
    .catch((err) => console.log(err));
};

// Post/Add balancesheet transaction data
exports.postBalancesheetTransaction = (req, res, next) => {
  balancesheetTransaction[0] = req.body.date;
  balancesheetTransaction[1] = req.body.category;
  balancesheetTransaction[2] = req.body.description;
  balancesheetTransaction[3] = req.body.amount;
  const newBalanceSheet = new BalanceSheet(
    null,
    balancesheetTransaction[0],
    balancesheetTransaction[1],
    balancesheetTransaction[2],
    balancesheetTransaction[3]
  );
  newBalanceSheet
    .save()
    .then(() => {
      // Slight delay to allow database to update before data being retrieved again for page reload
      function delayAfterDelete() {
        res.redirect("/worthie/balancesheet");
      }
      setTimeout(delayAfterDelete, 500);
    })
    .catch((err) => console.log(err));
};

//  POST/Removal of transaction line via Delete button
exports.postDeleteBalancesheet = (req, res, next) => {
  // Retrieve form data from row and place in variables
  const deleteRowDate = JSON.stringify(req.body.deleteRowDateForm);
  const deleteRowCategory = JSON.stringify(req.body.deleteRowCategoryForm);
  const deleteRowDescription = JSON.stringify(
    req.body.deleteRowDescriptionForm
  );
  const deleteRowAmount = JSON.stringify(req.body.deleteRowAmountForm);

  // Transform retrived date from form into format used by SQL
  const deleteRowDateMonth = monthsObjForDelete[deleteRowDate.slice(5, 8)];
  const deleteRowDateForSql = `${deleteRowDate.slice(
    12,
    16
  )}-${deleteRowDateMonth}-${deleteRowDate.slice(9, 11)}`;
  const deleteRowDateForSqlString = String(deleteRowDateForSql);

  // console.log of retrived form data in SQL format
  // console.log(
  //   `Date: ${deleteRowDateForSql} - Category: ${deleteRowCategory} - Description: ${deleteRowDescription} - Amount: ${deleteRowAmount}`
  // );

  // Other (including Global yearMonth) variables to include in SQL DELETE Command
  const activeYear = Number(yearMonth[0]);
  const activeMonth = yearMonth[1];
  const user = Number(1);

  // ConsoleLog of full SQL command
  // console.log(
  //   `DELETE FROM balancesheet WHERE ${user} = user_id AND 'balancesheet' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowDateForSqlString} = date AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
  // );

  // SQL Command to delete from SQL table
  db.execute(
    `DELETE FROM transactions WHERE ${user} = user_id AND 'balance_sheet' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
  );

  // Slight delay to allow database to update before data being retrieved again for page reload
  function delayAfterDelete() {
    res.redirect("/worthie/balancesheet");
  }
  setTimeout(delayAfterDelete, 500);
};
