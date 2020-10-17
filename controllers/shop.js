const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (!products) throw new Error("Products was not finded");
    res.render("shop/product-list", {
      pageTitle: "Products",
      path: "products",
      products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);
    res.render("shop/product-detail", {
      pageTitle: product.title,
      path: "products",
      product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getShopIndex = async (req, res) => {
  try {
    const products = await Product.findAll();
    if (!products) throw new Error("Products was not finded");
    res.render("shop/index", { pageTitle: "Shop", path: "shop", products });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    if (!cart) throw new Error("Cart not loaded");
    const products = await cart.getProducts();
    if (!products) throw new Error("Products in cart not loaded");

    res.render("shop/cart", {
      pageTitle: "Cart",
      path: "cart",
      cartProducts: products,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCartRemove = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await req.user.getCart();
    if (!cart) throw new Error("Cart not loaded");
    const products = await cart.getProducts({ where: { id } });
    if (!products) throw new Error("Products not loaded");
    const product = products[0];
    const result = await product.cartItem.destroy();
    if (!result) throw new Error("Product not deleted from cart");
    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getAddToCart = async (req, res) => {
  const id = req.params.id;
  try {
    const cart = await req.user.getCart();
    if (!cart) throw new Error("Cart not loaded");

    const productsInCart = await cart.getProducts({ where: { id } });

    let product;
    if (productsInCart.length > 0) {
      product = productsInCart[0];
    }
    let newQuantity = 1;
    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
    }

    const productInfo = await Product.findByPk(id);
    if (!productInfo) throw new Error("Product not found");

    const result = cart.addProduct(productInfo, {
      through: { quantity: newQuantity },
    });
    if (!result) throw new Error("Not added to cart");

    res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await req.user.getOrders({ include: ["products"] });
    if (!orders) throw new Error("Orders not loaded");
    orders.forEach((p) => console.log(p));
    res.render("shop/orders", { pageTitle: "Orders", path: "orders", orders });
  } catch (err) {
    console.log(err);
  }
};

exports.getCreateOrder = async (req, res) => {
  try {
    const cart = await req.user.getCart();
    if (!cart) throw new Error("Cart not loaded");
    const products = await cart.getProducts();
    if (!products) throw new Error("Products from cart not loaded");
    const order = await req.user.createOrder();
    if (!order) throw new Error("Order not created");
    const result = await order.addProducts(
      products.map((product) => {
        product.orderItem = { quantity: product.cartItem.quantity };
        return product;
      })
    );
    if (!result) throw new Error("Order not filled");
    await cart.setProducts(null);
    res.redirect("/orders");
  } catch (err) {
    console.log(err);
  }
};
