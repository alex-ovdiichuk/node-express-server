const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "admin/add-product",
    product: null,
  });
};

exports.postAddProduct = async (req, res) => {
  try {
    const result = await req.user.createProduct({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
    });
    if (!result) throw new Error("Product not added");
    console.log("Product created");
  } catch (err) {
    console.log(err);
  }

  res.redirect("/admin/products");
};

exports.getEditProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const product = await req.user.getProducts({ where: { id } });
    if (!product) throw new Error("No product");
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "admin/edit-product",
      product: product[0],
    });
  } catch (err) {
    console.log(err);
    res.render("404", { pageTitle: "Not Found", path: null });
  }
};

exports.postEditProduct = async (req, res) => {
  const newData = req.body;

  try {
    const product = await Product.findByPk(newData.id);
    if (!product) throw new Error("No product");

    product.title = newData.title;
    product.imageUrl = newData.imageUrl;
    product.price = newData.price;
    product.description = newData.description;

    const result = await product.save();
    if (!result) throw new Error("Error on saving product");

    res.redirect("/product/" + newData.id);
  } catch (err) {
    console.log(err);
  }
};

exports.getDeleteProduct = async (req, res) => {
  const id = req.params.productId;
  try {
    const result = await Product.destroy({ where: { id } });
    if (!result) throw new Error("Product not deleted");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await req.user.getProducts();
    if (!products) throw new Error("Products was not finded");
    res.render("admin/product-list", {
      pageTitle: "Products",
      path: "admin/products",
      products,
    });
  } catch (err) {
    console.log(err);
  }
};
