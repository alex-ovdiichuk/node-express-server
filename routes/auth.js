const express = require("express");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("login", "Login must be 6-20 alphanumeric characters")
      .isLength({ min: 6, max: 20 })
      .isAlphanumeric()
      .trim(),
    body("password", "Password must be 6-20 alphanumeric characters")
      .isLength({ min: 6, max: 20 })
      .isAlphanumeric()
      .custom(async (value, { req }) => {
        const user = await User.findOne({ login: req.body.login });
        if (!user) throw new Error("Login or password incorrect");
        const validatePassword = await bcrypt.compare(value, user.password);
        if (!validatePassword) throw new Error("Login or password incorrect");
        return true;
      })
      .trim(),
  ],
  authController.postLogin
);
router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    body("login", "Login must be 6-20 alphanumeric characters")
      .isLength({ min: 6, max: 20 })
      .isAlphanumeric()
      .custom(async (value) => {
        const checkLogin = await User.findOne({ login: value });
        if (checkLogin) {
          throw new Error("User with this login is already exists");
        }
        return true;
      })
      .trim(),
    body("email")
      .isEmail()
      .withMessage("Please, enter a valid email")
      .custom(async (value) => {
        const checkEmail = await User.findOne({ email: value });
        if (checkEmail) {
          throw new Error("User with this email is already exists");
        }
        return true;
      })
      .normalizeEmail(),
    body("password", "Password must be 6-20 alphanumeric characters")
      .isLength({ min: 6, max: 20 })
      .isAlphanumeric()
      .trim(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords are not equal");
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/logout", authController.getLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/new-password/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
