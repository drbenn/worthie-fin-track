const db = require("../util/database");

const monthsObjForSubmit = {
  "01": "jan",
  "02": "feb",
  "03": "mar",
  "04": "apr",
  "05": "may",
  "06": "jun",
  "07": "jul",
  "08": "aug",
  "09": "sep",
  10: "oct",
  11: "nov",
  12: "dec",
};

const defaultYear = Number(yearMonth[0]);
const defaultMonth = yearMonth[1];

// Income Transaction Object Class
module.exports = class Income {
  constructor(trans_id, date, category, description, amount) {
    this.trans_id = trans_id;
    this.date = date;
    this.category = category;
    this.description = description;
    this.amount = amount;
  }
  // Fetch data from SQL Database
  static fetchAll(cookieUser, cookieYear, cookieMonth) {
    console.log(`default Year: ${defaultYear}`);
    console.log(`default Month: ${defaultMonth}`);
    console.log(`cookie user in model: ${cookieUser}`);
    console.log(`cookie Year in model: ${cookieYear}`);
    console.log(`cookie Month in model: ${cookieMonth}`);

    if (cookieYear === undefined) {
      const incomeQueryDefault = db.execute(
        `SELECT * FROM transactions WHERE '${cookieUser}' = user_id AND '${defaultMonth}' = month AND '${defaultYear}' = year AND "income" = trans_type ORDER BY date DESC`
      );
      return incomeQueryDefault;
    } else {
      console.log("Year/Month cookies recognized");
      const incomeQueryCookie = db.execute(
        `SELECT * FROM transactions WHERE '${cookieUser}' = user_id AND '${cookieMonth}' = month AND '${cookieYear}' = year AND "income" = trans_type ORDER BY date DESC`
      );
      return incomeQueryCookie;
    }
  }
  // Save and submit new transaction to SQL database table
  save(cookieUser) {
    const rawDateString = this.date.toString();

    const submittedMonth = rawDateString.slice(0, 2);
    const submittedDay = rawDateString.slice(3, 5);
    const submittedYear = rawDateString.slice(6, 10);
    const submittedMonthSql = monthsObjForSubmit[submittedMonth];
    // console.log(`save cookie user: ${cookieUser}`);
    const submittedDate = `${submittedYear}-${submittedMonth}-${submittedDay}`;
    // console.log(submittedDate);
    // console.log(`sub mo sql: ${submittedMonthSql}`);
    return db.execute(
      `INSERT INTO transactions (user_id, trans_type, year, month, date, category, description, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cookieUser,
        "income",
        submittedYear,
        submittedMonthSql,
        submittedDate,
        this.category,
        this.description,
        this.amount,
      ]
    );
  }
};
