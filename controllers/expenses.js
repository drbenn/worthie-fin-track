const db = require("../util/database");
const Expense = require("../models/expenses");
// GOOD BEFORE HERE

const defaultYear = Number(yearMonth[0]);
const defaultMonth = yearMonth[1];

const expenseTransaction = [];
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

// getExpenses From SQL Table
exports.getExpenses = (req, res, next) => {
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

  Expense.fetchAll(cookieUser, cookieYear, cookieMonth)
    .then(([rows, FieldData]) => {
      const amountArray = [];
      for (let row of rows) {
        amountArray.push(parseFloat(row.amount));
      }
      let calcTotalAmountArray = amountArray.reduce(function (a, b) {
        return a + b;
      }, 0);
      let totalAmountArray = calcTotalAmountArray.toFixed(2);
      // console.log(`total fixed: ${totalAmountArray}`);
      // const transactionRows = JSON.stringify(rows);
      // console.log(`rows: ${transactionRows}`);
      res.render("expenses", {
        trans: rows,
        pageTitle: "Expenses",
        path: "/expenses",
        expenseTotal: totalAmountArray,
        activeMonth: yearMonth[1].toUpperCase(),
        activeYear: Number(yearMonth[0]),
        isAuthenticated: req.isLoggedIn,
        // hasTransactions: transactions.length > 0,
        // date: null,
        // category: null,
        // description: null,
        // amount: null,
      });
    })
    .catch((err) => console.log(err));
};

// Post/Add expense transaction data
exports.postExpenseTransaction = (req, res, next) => {
  expenseTransaction[0] = req.body.date;
  expenseTransaction[1] = req.body.category;
  expenseTransaction[2] = req.body.description;
  expenseTransaction[3] = req.body.amount;
  const newExpense = new Expense(
    null,
    expenseTransaction[0],
    expenseTransaction[1],
    expenseTransaction[2],
    expenseTransaction[3]
  );
  // console.log(`new expense: ${JSON.stringify(newExpense)}`);
  const cookieUser = req.get("Cookie").split("=")[1].split(";")[0];
  newExpense
    .save(cookieUser)
    .then(() => {
      // Slight delay to allow database to update before data being retrieved again for page reload
      function delayAfterDelete() {
        res.redirect("/worthie/expenses");
      }
      setTimeout(delayAfterDelete, 500);
    })
    .catch((err) => console.log(err));
};

//  POST/Removal of transaction line via Delete button
exports.postDeleteExpense = (req, res, next) => {
  // Retrieve form data from row and place in variables
  const cookieUser = req.get("Cookie").split("=")[1].split(";")[0];
  const cookieYear = req.get("Cookie").split("=")[3].slice(0, 4);
  const cookieMonth = req.get("Cookie").split("=")[4].slice(0, 3);

  const deleteRowDateExp = JSON.stringify(req.body.deleteRowDateFormExp);
  const deleteRowCategoryExp = JSON.stringify(
    req.body.deleteRowCategoryFormExp
  );
  const deleteRowDescriptionExp = JSON.stringify(
    req.body.deleteRowDescriptionFormExp
  );
  const deleteRowAmountExp = JSON.stringify(req.body.deleteRowAmountFormExp);

  // Transform retrived date from form into format used by SQL
  const deleteRowDateMonth = monthsObjForDelete[deleteRowDateExp.slice(5, 8)];
  const deleteRowDateForSqlExp = `${deleteRowDateExp.slice(
    12,
    16
  )}-${deleteRowDateMonth}-${deleteRowDateExp.slice(9, 11)}`;
  // const deleteRowDateForSqlString = String(deleteRowDateForSqlExp);

  // console.log of retrieved form data in SQL format
  // console.log(
  //   `Date: ${deleteRowDateForSqlExp} - Category: ${deleteRowCategoryExp} - Description: ${deleteRowDescriptionExp} - Amount: ${deleteRowAmountExp}`
  // );

  // Other (including Global yearMonth) variables to include in SQL DELETE Command
  const activeYear = Number(yearMonth[0]);
  const activeMonth = yearMonth[1];
  // const user = Number(1);

  // ConsoleLog of full SQL command
  // console.log(
  //   `DELETE FROM transactions WHERE ${user} = user_id AND 'expense' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowCategoryExp} = category AND ${deleteRowDescriptionExp} = description AND ${deleteRowAmountExp} = amount`
  // );
  // SQL Command to delete from SQL table

  if (cookieYear === undefined) {
    db.execute(
      `DELETE FROM transactions WHERE ${cookieUser} = user_id AND 'expense' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowCategoryExp} = category AND ${deleteRowDescriptionExp} = description AND ${deleteRowAmountExp} = amount`
    ).then(res.redirect("/worthie/expenses"));
  } else {
    console.log("Year/Month cookies recognized for delete");
    db.execute(
      `DELETE FROM transactions WHERE ${cookieUser} = user_id AND 'expense' = trans_type AND '${cookieYear}' = year AND '${cookieMonth}' = month AND ${deleteRowCategoryExp} = category AND ${deleteRowDescriptionExp} = description AND ${deleteRowAmountExp} = amount`
    ).then(res.redirect("/worthie/expenses"));
  }
  // // Slight delay to allow database to update before data being retrieved again for page reload
  // function delayAfterDelete() {
  //   res.redirect("/expenses");
  // }
  // setTimeout(delayAfterDelete, 500);
};
