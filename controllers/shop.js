const Product = require("../models/product");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render("shop/product-list", {
      pageTitle: "Products",
      path: "products",
      products,
    })
  );
};

exports.getShopIndex = async (req, res) => {
  Product.fetchAll((products) =>
    res.render("shop/index", { pageTitle: "Shop", path: "shop", products })
  );
};

exports.getCart = (req, res) => {
  res.render("shop/cart", { pageTitle: "Cart", path: "cart" });
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "checkout" });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { pageTitle: "Orders", path: "orders" });
};
