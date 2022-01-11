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

// Income Transaction Object Class
module.exports = class Income {
  constructor(
    // userid,
    // trans_type,
    // year,
    // month,
    trans_id,
    date,
    category,
    description,
    amount
  ) {
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
  static fetchAll() {
    const activeYear = Number(yearMonth[0]);
    const activeMonth = yearMonth[1];
    // console.log(`activeYear: ${activeYear}`);
    // console.log(`activeMonth: ${activeMonth}`);

    const incomeQuery = db.execute(
      `SELECT * FROM transactions WHERE '${activeMonth}' = month AND '${activeYear}' = year AND "income" = trans_type ORDER BY date DESC`
    );
    return incomeQuery;
  }
  // Save and submit new transaction to SQL database table
  save() {
    const user = Number(1);
    const rawDateString = this.date.toString();

    const submittedMonth = rawDateString.slice(0, 2);
    const submittedDay = rawDateString.slice(3, 5);
    const submittedYear = rawDateString.slice(6, 10);
    const submittedMonthSql = monthsObjForSubmit[submittedMonth];

    const submittedDate = `${submittedYear}-${submittedMonth}-${submittedDay}`;
    // console.log(submittedDate);
    // console.log(`sub mo sql: ${submittedMonthSql}`);
    return db.execute(
      `INSERT INTO transactions (user_id, trans_type, year, month, date, category, description, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user,
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
