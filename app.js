const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const mysql2 = require("mysql2/promise");
const db = require("./util/database");

const errorController = require("./controllers/error");
const User = require("./models/user");

// mySQL Session parameters
console.log(
  `host: ${db.pool.config.connectionConfig.host} port: ${db.pool.config.connectionConfig.port} user:  ${db.pool.config.connectionConfig.user} password:  ${db.pool.config.connectionConfig.password} database:  ${db.pool.config.connectionConfig.database}`
);

const MySQLStore = require("express-mysql-session")(session);

const sessionOptions = {
  host: db.pool.config.connectionConfig.host,
  port: db.pool.config.connectionConfig.port,
  user: db.pool.config.connectionConfig.user,
  password: db.pool.config.connectionConfig.password,
  database: db.pool.config.connectionConfig.database,
};

const sessionConnection = mysql2.createPool(sessionOptions);
const sessionStore = new MySQLStore(
  {
    createDatabaseTable: true,
    schema: {
      tableName: "sessions",
      columnNames: {
        session_id: "session_id",
        expires: "expires",
        data: "data",
      },
    },
  },
  sessionConnection
);

const testUser = {
  email: "test@test.com",
  password: "pass",
};

const app = express();

// Initiates EJS templates
app.set("view engine", "ejs");
app.set("views", "views");

// ROUTES constants
const yearMonthRoutes = require("./routes/yearMonth");

const expenseRoutes = require("./routes/expenses");
const incomeRoutes = require("./routes/income");
const investmentRoutes = require("./routes/investments");
const balancesheetRoutes = require("./routes/balancesheet");
const instructionsRoutes = require("./routes/instructions");
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");
const dashRoutes = require("./routes/dash");

// allows public access to static files
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(yearMonthRoutes.routes);
app.use(expenseRoutes.routes);
app.use(balancesheetRoutes.routes);
app.use(incomeRoutes.routes);
app.use(investmentRoutes.routes);

app.use(registerRoutes.routes);
app.use(authRoutes.routes);
app.use(instructionsRoutes);
app.use(dashRoutes.routes);

app.use(errorController.get404);

// PORT & App Port Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
