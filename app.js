const express = require("express");
const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use("/", routes);
app.use("/books", books);
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(3000, () => {
  console.log("Server is running on server 3000!");
});
