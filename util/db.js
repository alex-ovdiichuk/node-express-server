const Sequelize = require("sequelize");

const sequelize = new Sequelize("express-test", "postgres", "1111", {
  dialect: "postgres",
  //host: "localhost",
});

module.exports = sequelize;
