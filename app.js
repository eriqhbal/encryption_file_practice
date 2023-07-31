//jshint esversion:6
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");
app.set(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", "false");
mongoose.connect("mongodb://localhost:27017/usersDB", {
  useNewUrlParser: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "iloveyou";

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = mongoose.model("user", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const emailUser = req.body?.username;
  const passwordUser = req.body?.password;

  const newUser = new User({
    email: emailUser,
    password: passwordUser,
  });

  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
      console.log("successful to secrets page");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  const username = req.body?.username;
  const passwordUser = req.body?.password;

  User.findOne({ email: username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        if (data.password === passwordUser) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("your server is success to running on port 3000");
  }
});
