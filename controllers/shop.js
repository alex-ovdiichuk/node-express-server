const Product = require("../models/product");
const Order = require("../models/order");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) throw new Error("Products was not finded");
    res.render("shop/product-list", {
      pageTitle: "Products",
      path: "products",
      products,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    res.render("shop/product-detail", {
      pageTitle: product.title,
      path: "products",
      product,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getShopIndex = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) throw new Error("Products was not finded");
    res.render("shop/index", {
      pageTitle: "Shop",
      path: "shop",
      products,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  try {
    const products = await req.user
      .populate("cart.items.productId")
      .execPopulate();
    if (!products) throw new Error("Products in cart not loaded");

    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "cart",
      cartProducts: products.cart.items,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCartRemove = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await req.user.deleteFromCart(id);
    if (!result) throw new Error("Product not deleted from cart");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getAddToCart = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error(product);
    const result = await req.user.addToCart(product);
    if (!result) throw new Error(result);
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ "user.userId": req.session.user._id });
    if (!orders) throw new Error("Orders not loaded");
    res.render("shop/orders", {
      pageTitle: "Orders",
      path: "orders",
      orders,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCreateOrder = async (req, res) => {
  try {
    const products = await req.user
      .populate("cart.items.productId")
      .execPopulate();
    if (!products) throw new Error(products);

    const orderProducts = products.cart.items.map((product) => ({
      quantity: product.quantity,
      product: { ...product.productId._doc },
    }));

    const order = new Order({
      products: orderProducts,
      user: { login: req.session.user.login, userId: req.session.user._id },
    });

    req.user.cart.items = [];
    const updateCart = await req.user.save();
    if (!updateCart) throw new Error(updateCart);

    const result = await order.save();
    if (!result) throw new Error(result);

    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};
