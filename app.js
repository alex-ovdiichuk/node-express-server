const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorController = require("./controllers/error");
//const sequelize = require("./util/db");
const mongo = require("./util/mongo");
const User = require("./models/user");

// const Product = require("./models/product");
// const User = require("./models/user");
// const Cart = require("./models/cart");
// const CartItem = require("./models/cart-item");
// const Order = require("./models/order");
// const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(async (req, res, next) => {
  try {
    const user = await User.fetchById("5f8deed37f56ec37091a1d76");
    if (!user) throw new Error("User not found");
    req.user = new User(user.login, user.email, user.cart, user._id);
    next();
  } catch (err) {
    console.log(err);
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });
// Order.belongsTo(Order);
// User.hasMany(Order);
// Order.belongsToMany(Product, { through: OrderItem });

// sequelize
//   .sync()
//   .then((result) => {
//     return User.findByPk(1);
//     //console.log(result);
//   })
//   .then(async (user) => {
//     if (!user) {
//       const user = await User.create({
//         name: "Vasya",
//         email: "test@test.test",
//       });
//       user.createCart();
//     }
//     return Promise.resolve(user);
//   })
//   .catch((err) => console.log(err));
mongo.mongoConnect(() => {
  app.listen(3000, () => console.log("Server is running"));
});
