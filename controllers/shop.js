const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render("shop/product-list", {
      pageTitle: "Products",
      path: "products",
      products,
    })
  );
};

exports.getProduct = (req, res) => {
  const id = req.params.id;
  Product.findById(id, (p) =>
    res.render("shop/product-detail", {
      pageTitle: p.title,
      path: "products",
      product: p,
    })
  );
};

exports.getShopIndex = async (req, res) => {
  Product.fetchAll((products) =>
    res.render("shop/index", { pageTitle: "Shop", path: "shop", products })
  );
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    if (cart) {
      Product.fetchAll((products) => {
        const cartProducts = [];
        if (cart.products.length > 0) {
          products.forEach((product) => {
            const cartProduct = cart.products.find(
              (cartProduct) => cartProduct.id === product.id
            );
            if (cartProduct)
              cartProducts.push({ product, quantity: cartProduct.quantity });
          });
        }

        res.render("shop/cart", {
          pageTitle: "Cart",
          path: "cart",
          cartProducts,
        });
      });
    }
  });
};

exports.getCartRemove = (req, res) => {
  const id = req.params.id;
  const product = Product.findById(id, (product) => {
    Cart.deleteProduct(id, product.price);
    res.redirect("/cart");
  });
};

exports.getCartWithId = (req, res) => {
  const id = req.params.id;
  Product.findById(id, (product) => {
    Cart.addProduct(id, product.price);
  });
  res.redirect("/cart");
};

exports.getCheckout = (req, res) => {
  res.render("shop/checkout", { pageTitle: "Checkout", path: "checkout" });
};

exports.getOrders = (req, res) => {
  res.render("shop/orders", { pageTitle: "Orders", path: "orders" });
};
