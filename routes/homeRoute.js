const express = require("express");
const home_route = express();

const userController = require("../controllers/userController");
home_route.set("view engine", "ejs");
home_route.set("views", "./views/home");

home_route.get("/", (req, res) => {
  res.render("index");
});

module.exports = home_route;
