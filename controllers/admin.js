const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "admin/add-product",
    product: null,
    isAuth: req.session.user,
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      userId: req.session.user._id,
    });
    const result = await product.save();
    if (!result) throw new Error(result);
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getEditProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    if (!product) throw new Error("No product");
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      product: product,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.render("404", {
      pageTitle: "Not Found",
      path: null,
      isAuth: req.session.user,
    });
  }
};

exports.postEditProduct = async (req, res) => {
  const newData = req.body;

  try {
    const product = await Product.findById(newData.id);
    if (!product) throw new Error(product);
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.redirect("/");
    }
    product.title = newData.title;
    product.imageUrl = newData.imageUrl;
    product.price = newData.price;
    product.description = newData.description;

    const result = await product.save();
    if (!result) throw new Error(result);

    res.redirect("/product/" + newData.id);
  } catch (err) {
    console.log(err);
  }
};

exports.getDeleteProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await Product.findById(id);
    if (!product || product.userId.toString() !== req.user._id.toString())
      return res.redirect("/");
    const result = await Product.findByIdAndRemove(id);
    if (!result) throw new Error("Product not deleted");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user._id });
    if (!products) throw new Error("Products was not finded");
    res.render("admin/product-list", {
      pageTitle: "Products",
      path: "admin/products",
      products,
      isAuth: req.session.user,
    });
  } catch (err) {
    console.log(err);
  }
};
