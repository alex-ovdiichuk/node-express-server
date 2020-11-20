const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = async (req, res) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "login",
      error: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const login = req.body.login;
    const password = req.body.password;
    const user = await User.findOne({ login: login });
    if (!user) {
      req.flash("error", "Invalid login or password");
      return res.redirect("/login");
    }

    const validatePassword = await bcrypt.compare(password, user.password);
    if (validatePassword) {
      req.session.user = user;
      res.redirect("/");
    } else {
      req.flash("error", "Invalid login or password");
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getSignup = async (req, res) => {
  try {
    res.render("auth/signup", {
      pageTitle: "Signup",
      path: "signup",
      error: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postSignup = async (req, res) => {
  try {
    const login = req.body.login;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const checkEmail = await User.findOne({ email: email });
    const checkLogin = await User.findOne({ login: login });
    if (checkEmail || checkLogin) {
      req.flash("error", "Email or password already exists");
      return res.redirect("/signup");
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
      login,
      email,
      password: hash,
      cart: { items: [] },
    });
    const result = await user.save();
    if (result) res.redirect("/login");
    else throw new Error(result);
  } catch (err) {
    console.log(err);
  }
};

exports.getLogout = async (req, res) => {
  try {
    req.session.destroy(() => res.redirect("/"));
  } catch (err) {
    console.log(err);
  }
};
