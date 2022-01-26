const db = require("../util/database");

module.exports = class User {
  constructor(user_id, email, password) {
    this.user_id = user_id;
    this.email = email;
    this.password = password;
  }

  static fetchAll() {
    const userQuery = db.execute(`SELECT * FROM users`);
    return userQuery;
  }

  static fetchAllEmail() {
    const userQuery = db.execute(`SELECT email FROM users`);
    return userQuery;
  }

  save() {
    // console.log(`user this.email: ${this.email}`);
    return db.execute(`INSERT INTO users (email, password) VALUES (?, ?)`, [
      this.email,
      this.password,
    ]);
  }
};
