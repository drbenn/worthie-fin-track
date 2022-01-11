const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const errorController = require("./controllers/error");

const app = express();

// Initiates EJS templates
app.set("view engine", "ejs");
app.set("views", "views");

// ROUTES constants
const yearMonthRoutes = require("./routes/yearMonth");

const expensesData = require("./routes/expenses");
const incomeData = require("./routes/income");
const investmentsData = require("./routes/investments");
const balancesheetData = require("./routes/balancesheet");
const instructionsRoutes = require("./routes/instructions");
const dashData = require("./routes/dash");

app.use(bodyParser.urlencoded({ extended: false }));
// allows public access to static files
app.use(express.static(path.join(__dirname, "public")));

app.use(yearMonthRoutes.routes);
app.use(expensesData.routes);
app.use(incomeData.routes);
app.use(investmentsData.routes);
app.use(balancesheetData.routes);
app.use(instructionsRoutes);
app.use(dashData.routes);

app.use(errorController.get404);

// PORT & App Port Listener
const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
