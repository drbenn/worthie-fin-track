const db = require("../util/database");
const Investment = require("../models/investments");

const investmentsTransaction = [];
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

// getInvestments From SQL Table
exports.getInvestments = (req, res, next) => {
  Investment.fetchAll()
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
      res.render("investments", {
        trans: rows,
        pageTitle: "Investments",
        path: "/worthie/investments",
        investmentsTotal: totalAmountArray,
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

// Post/Add investments transaction data
exports.postInvestmentsTransaction = (req, res, next) => {
  investmentsTransaction[0] = req.body.date;
  investmentsTransaction[1] = req.body.category;
  investmentsTransaction[2] = req.body.description;
  investmentsTransaction[3] = req.body.amount;
  const newInvestment = new Investment(
    null,
    investmentsTransaction[0],
    investmentsTransaction[1],
    investmentsTransaction[2],
    investmentsTransaction[3]
  );
  newInvestment
    .save()
    .then(() => {
      // Slight delay to allow database to update before data being retrieved again for page reload
      function delayAfterDelete() {
        res.redirect("/worthie/investments");
      }
      setTimeout(delayAfterDelete, 500);
    })
    .catch((err) => console.log(err));
};

//  POST/Removal of transaction line via Delete button
exports.postDeleteInvestments = (req, res, next) => {
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
  //   `DELETE FROM investments WHERE ${user} = user_id AND 'investment' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowDateForSqlString} = date AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
  // );

  // SQL Command to delete from SQL table
  db.execute(
    `DELETE FROM transactions WHERE ${user} = user_id AND 'investment' = trans_type AND '${activeYear}' = year AND '${activeMonth}' = month AND ${deleteRowCategory} = category AND ${deleteRowDescription} = description AND ${deleteRowAmount} = amount`
  );
  // Slight delay to allow database to update before data being retrieved again for page reload
  function delayAfterDelete() {
    res.redirect("/worthie/investments");
  }
  setTimeout(delayAfterDelete, 500);
};
