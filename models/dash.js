const db = require("../util/database");
const activeYear = Number(yearMonth[0]);
const activeMonth = yearMonth[1];

const defaultYear = Number(yearMonth[0]);
const defaultMonth = yearMonth[1];

// Dashboard Object Class
module.exports = class Dash {
  constructor() {
    // userid,
    // trans_type,
    // year,
    // month,
    trans_id, date, category, description, amount;
    // this.userid = userid;
    // this.trans_type = trans_type;
    // this.year = year;
    // this.month = month;
    this.trans_id = trans_id;
    this.date = date;
    this.category = category;
    this.description = description;
    this.amount = amount;
  }
  // Fetch data from SQL Database
  static fetchAll(cookieUser, cookieYear, cookieMonth) {
    const activeYear = Number(yearMonth[0]);
    const activeMonth = yearMonth[1];
    // console.log(`activeYear: ${activeYear}`);
    // console.log(`activeMonth: ${activeMonth}`);

    // `SELECT amount, category, year,month,trans_type FROM income, expenses, investments, balancesheet WHERE '${activeMonth}' = month AND '${activeYear}' = year`
    if (cookieYear === undefined) {
      const dashQuery = db.execute(
        `SELECT * FROM transactions WHERE '${cookieUser}' = user_id AND '${defaultMonth}' = month AND '${defaultYear}' = year ORDER BY date DESC`
      );
      return dashQuery;
    } else {
      console.log("Year/Month cookies recognized");
      const dashQuery = db.execute(
        `SELECT * FROM transactions WHERE '${cookieUser}' = user_id AND '${cookieMonth}' = month AND '${cookieYear}' = year ORDER BY date DESC`
      );
      return dashQuery;
    }
  }
};
