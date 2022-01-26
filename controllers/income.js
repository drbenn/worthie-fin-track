const db = require("../util/database");
const Income = require("../models/income");

const defaultYear = Number(yearMonth[0]);
const defaultMonth = yearMonth[1];

const incomeTransaction = [];
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

// getIncome From SQL Table
exports.getIncome = (req, res, next) => {
  // console.log(`session id : ${req.session.id}`);
  // console.log(`from request ${req.get("Cookie").split("=")[2].slice(0, 4)}`);
  // console.log(`from request ${req.get("Cookie").split("=")[3].slice(0, 3)}`);
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
  // console.log(`cookie year in income: ${cookieYear}`);
  // console.log(`cookie month in income: ${cookieMonth}`);
  // console.log(`cookie user in income: ${cookieUser}`);

  Income.fetchAll(cookieUser, cookieYear, cookieMonth)
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
      res.render("income", {
        trans: rows,
        pageTitle: "Income",
        path: "/income",
        incomeTotal: totalAmountArray,
        activeMonth: yearMonth[1].toUpperCase(),
        activeYear: Number(yearMonth[0]),
        // activeMonth: yearMonth[1].toUpperCase(),
        // activeYear: Number(yearMonth[0]),
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// Post/Add income transaction data
exports.postIncomeTransaction = (req, res, next) => {
  incomeTransaction[0] = req.body.date;
  incomeTransaction[1] = req.body.category;
  incomeTransaction[2] = req.body.description;
  incomeTransaction[3] = req.body.amount;
  const newIncome = new Income(
    null,
    incomeTransaction[0],
    incomeTransaction[1],
    incomeTransaction[2],
    incomeTransaction[3]
  );
  const cookieUser = req.get("Cookie").split("=")[1].split(";")[0];
  newIncome
    .save(cookieUser)
    .then(() => {
      // Slight delay to allow database to update before data being retrieved again for page reload
      function delayAfterDelete() {
        res.redirect("/worthie/income");
      }
      setTimeout(delayAfterDelete, 500);
    })
    .catch((err) => console.log(err));
};

//  POST/Removal of transaction line via Delete button
exports.postDeleteIncome = (req, res, next) => {
  // Retrieve form data from row and place in variables
  const cookieUser = req.get("Cookie").split("=")[1].split(";")[0];
  const cookieYear = req.get("Cookie").split("=")[3].slice(0, 4);
  const cookieMonth = req.get("Cookie").split("=")[4].slice(0, 3);

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

  // ConsoleLog of full SQL command
  // console.log(
  //   `DELETE FROM income WHERE ${user} = user_id AND 'income' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowDateForSqlString} = date AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
  // );

  if (cookieYear === undefined) {
    db.execute(
      `DELETE FROM transactions WHERE ${cookieUser} = user_id AND 'income' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
    );
  } else {
    console.log("Year/Month cookies recognized for delete");
    db.execute(
      `DELETE FROM transactions WHERE ${cookieUser} = user_id AND 'income' = trans_type AND '${cookieYear}' = year AND '${cookieMonth}' = month AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
    );
  }

  // Slight delay to allow database to update before data being retrieved again for page reload
  function delayAfterDelete() {
    res.redirect("/worthie/income");
  }
  setTimeout(delayAfterDelete, 500);
};
