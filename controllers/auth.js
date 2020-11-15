const User = require("../models/user");

exports.getLogin = async (req, res) => {
  try {
    res.render("auth/login", {
      pageTitle: "Login",
      path: "login",
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postLogin = async (req, res) => {
  try {
    const user = await User.findById("5fa24ed35bc24a24642539c7");
    if (!user) throw new Error("User not found");
    else {
      req.session.user = user;
      res.redirect("/");
    }
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
