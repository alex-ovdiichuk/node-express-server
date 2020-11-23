const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

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
    if (result) {
      const sendEmail = await transporter.sendMail({
        to: email,
        from: "iwasmusic32@gmail.com",
        subject: "Sign Up Secceded",
        html: "<h1>You signed up!</h1>",
      });
      res.redirect("/login");
    } else throw new Error(result);
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

exports.getReset = async (req, res) => {
  try {
    res.render("auth/reset", {
      pageTitle: "Reset password",
      path: "reset",
      error: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postReset = async (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect("/reset");
      }
      const token = buffer.toString("hex");
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        req.flash("error", "No account with that email found");
        res.redirect("/reset");
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      const result = await user.save();
      if (result) {
        const sendEmail = await transporter.sendMail({
          to: user.email,
          from: "iwasmusic32@gmail.com",
          subject: "Password reset",
          html: `
            <h1>You signed up!</h1>
            <p>Token: ${token}</p>
            <p><a href="http://localhost:3000/new-password/${token}">Reset password</a></p>
          `,
        });
        res.redirect("/");
      } else throw new Error(result);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getNewPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      req.flash("User not found");
      res.redirect("/login");
    }
    res.render("auth/new-password", {
      pageTitle: "New Password",
      path: "new-password",
      error: req.flash("error"),
      userId: user._id.toString(),
      passwordToken: token,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postNewPassword = async (req, res) => {
  try {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    const user = await User.findOne({
      _id: userId,
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (!user) {
      req.flash("Something went wrong. Please, try again");
      return res.redirect("/login");
    }
    const hash = await bcrypt.hash(newPassword, 12);
    user.password = hash;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    const result = await user.save();
    if (!result) throw new Error(result);
    res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};
