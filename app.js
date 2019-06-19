import express from "express";
const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
