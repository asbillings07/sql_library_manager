const express = require("express");
const app = express();
const sequelize = require("./models").sequelize;
const bookRoutes = require("./routes/books");
const mainRoute = require("./routes/index");
// view engine

app.set("view engine", "pug");
app.use("/static", express.static("public"));

app.use(bookRoutes);
app.use(mainRoute);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

sequelize.sync().then(() => {
  app.listen(4000, () => {
    console.log("Server is running on server 4000!");
  });
});
