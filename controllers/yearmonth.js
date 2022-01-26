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

exports.getYearMonth = (req, res, next) => {
  res.render("yearmonth", {
    pageTitle: "Year & Month Select",
    path: "/yearmonth",
    activeMonth: yearMonth[1].toUpperCase(),
    activeYear: Number(yearMonth[0]),
  });
};

exports.postYearMonth = (req, res, next) => {
  // req.body is provided by express but it does not also parse

  // Year/Month form selection updates and logging
  // console.log(req.body.year);
  // console.log(req.body.month);
  // console.log(`Before changeYearMonth var : ${yearMonth}`);
  yearMonth[0] = req.body.year;
  yearMonth[1] = req.body.month;
  const selectedYear = yearMonth[0].slice(0, 4);
  const selectedMonth = yearMonth[1];
  console.log(`selected month: ${selectedMonth}`);
  console.log(`selected year: ${selectedYear}`);

  // console.log(`New YearMonth var : ${yearMonth}`);
  // res.setHeader("Set-Cookie", `activeYear=${selectedYear}`);
  // res.setHeader("Set-Cookie", `activeMonth=${selectedMonth}`);
  res.cookie(`activeYear`, `${selectedYear}`);
  res.cookie(`activeMonth`, `${selectedMonth}`);
  res.redirect("/worthie/yearmonth");
};
