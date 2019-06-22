const express = require("express");
const app = express();
const sequelize = require("./models").sequelize;
const bookRoutes = require("./routes/books");
const mainRoute = require("./routes/index");
const bodyParser = require("body-parser");
// view engine

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bookRoutes);
app.use(mainRoute);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
}); // create 404 error

app.use((err, req, res, next) => {
  res.locals.error = err;
  if (err.status >= 100 && err.status < 600) {
    res.status(err.status);
    console.log(err.status);
    console.log(err.message);
    console.log(err.stack);
  } else {
    res.status(500);
    console.log(500);
    console.log(err.message);
    console.log(err.stack);
  }
  res.render("error");
}); // render template for the error.

sequelize.sync().then(() => {
  app.listen(9000, () => {
    console.log("Server is running on server 9000! It's over 9000!!!!");
  });
});
