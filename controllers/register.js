const db = require("../util/database");
const User = require("../models/user");

const isUserAlreadyInDatabase = false;

exports.getRegister = (req, res, next) => {
  //   const isLoggedIn = req.get("Cookie").split("=")[1].trim();
  //   console.log(req.session.isLoggedIn);
  res.render("auth/register", {
    pageTitle: "Register",
    path: "/register",
    isUserAlreadyInDatabase: isUserAlreadyInDatabase,
  });
};

exports.postRegister = (req, res, next) => {
  // console.log(`cl register email: ${req.body.email}`);
  // console.log(`cl register email: ${req.body.password}`);
  let userArray = [];
  let isUserAlreadyInDatabase = false;
  let email = req.body.email;
  let password = req.body.password;
  const newUser = new User(null, email, password);
  User.fetchAllEmail()
    .then(([rows, FieldData]) => {
      for (let row of rows) {
        // console.log(`row: ${JSON.stringify(row)}`);
        userUnformatted = JSON.stringify(row).split(":")[1];
        userFormatted1 = userUnformatted.substring(
          1,
          userUnformatted.length - 2
        );
        // console.log(`userf1 ${userFormatted1}`);
        userArray.push(userFormatted1);
        if (email === userFormatted1) {
          isUserAlreadyInDatabase = "true";
          // console.log("User Already Exists");
          // console.log(isUserAlreadyInDatabase);
          res.render("auth/register", {
            pageTitle: "Register",
            path: "/register",
            isUserAlreadyInDatabase: isUserAlreadyInDatabase,
          });
        }
      }
    })
    .then(() => {
      if (isUserAlreadyInDatabase === false) {
        // console.log("we can input into user database");
        // console.log(`user: ${email}`);
        // console.log(`password: ${password}`);
        // console.log(`newUser const = ${JSON.stringify(newUser)}`);
        newUser.save().then(() => {
          // Slight delay to allow database to update before data being retrieved again for page reload
          function delayAfterDelete() {
            res.redirect("/worthie");
          }
          setTimeout(delayAfterDelete, 500);
        });
      }
    })
    .catch((err) => console.log(err));
};
