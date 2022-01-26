const db = require("../util/database");
const User = require("../models/user");

let isIncorrectLoginUsed;
let isLoginFound = "false";
let isUserLoggedIn;

exports.getLogin = (req, res, next) => {
  if (req.get("Cookie") === undefined) {
    isUserloggedIn = undefined;
    res.setHeader("Set-Cookie", `user=${isUserLoggedIn}`);
    console.log("undef cook on login load");
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    isIncorrectLoginUsed: isIncorrectLoginUsed,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  console.log(`email: ${email}, pass: ${password}`);

  User.fetchAll().then(([rows, FieldData]) => {
    for (let row of rows) {
      // console.log(`row: ${JSON.stringify(row)}`);
      userIdforArray = JSON.stringify(row).split('"')[2].slice(1, -1);
      userEmailforArray = JSON.stringify(row).split('"')[5];
      userPasswordforArray = JSON.stringify(row).split('"')[9];
      // console.log(`user id from db ${userIdforArray}`);
      if (userEmailforArray === email && userPasswordforArray === password) {
        console.log("Email/Pass Authenticated");
        res.setHeader("Set-Cookie", `user=${userIdforArray}`);
        isIncorrectLoginUsed = "false";
        isLoginFound = "true";
        res.redirect("/worthie/instructions");
      }
    }
    if (isLoginFound === "false") {
      console.log(
        "Email/Password Combination incorrect, or user not registered"
      );
      isIncorrectLoginUsed = "true";
      res.render("auth/login", {
        pageTitle: "Login",
        path: "login",
        isIncorrectLoginUsed: isIncorrectLoginUsed,
      });
    }
  });
};

exports.postLogout = (req, res, next) => {
  console.log("This work?");
  const loggedOutUser = undefined;
  res.setHeader("Set-Cookie", `user=${loggedOutUser}`);
  // req.session.destroy((err) => {
  //   res.setHeader("Set-Cookie", `user=55`);
  //   console.log(err);
  res.redirect("/worthie");
  // });
};
