const express = require("express");
const cors = require("cors");
const connection = require("./connection");
const userRoute = require("./routes/user");
const stationRoute = require("./routes/station");
const trainRoute = require("./routes/train");
// const categoryRoute = require("./routes/category");
// const productRoute = require("./routes/product");
//  const billRoute = require("./routes/bill");
//  const dashboardRoute = require("./routes/dashboard");

const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use("/api/users", userRoute);
app.use("/api/stations", stationRoute);
app.use("/api/trains", trainRoute);
// app.use("/category", categoryRoute);
// app.use("/product", productRoute);
// app.use("/bill", billRoute);
// app.use("/dashboard", dashboardRoute);

module.exports = app;
