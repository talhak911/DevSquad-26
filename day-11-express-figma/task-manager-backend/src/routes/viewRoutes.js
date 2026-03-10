const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Task Manager Dashboard" });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Sign Up" });
});

module.exports = router;
