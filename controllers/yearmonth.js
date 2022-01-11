const Expense = require("../models/expenses");

// Post/Change Year Month to update appropriate data
const todaysDate = new Date();
const currentYear = String(todaysDate.getFullYear());
const currentMonthIndex = todaysDate.getMonth();
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
const currentMonth = MONTHS[currentMonthIndex];
global.yearMonth = [currentYear, currentMonth];

exports.postYearMonth = (req, res, next) => {
  // req.body is provided by express but it does not also parse

  // Year/Month form selection updates and logging
  // console.log(req.body.year);
  // console.log(req.body.month);
  // console.log(`Before changeYearMonth var : ${yearMonth}`);
  yearMonth[0] = req.body.year;
  yearMonth[1] = req.body.month;
  // console.log(`New YearMonth var : ${yearMonth}`);
  res.redirect("/worthie/");
};
