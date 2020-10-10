const Product = require("../models/product");

exports.getAddProduct = (req, res) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "admin/add-product",
    product: null,
  });
};

exports.postAddProduct = (req, res) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, price, description);
  product.save();
  res.redirect("/admin/products");
};

exports.getEditProduct = (req, res) => {
  const id = req.params.productId;
  Product.findById(id, (product) => {
    if (!product) res.render("404", { pageTitle: "Not Found", path: null });
    else
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "admin/edit-product",
        product,
      });
  });
};

exports.postEditProduct = (req, res) => {
  const newData = req.body;
  Product.findById(newData.id, (product) => {
    if (!product) res.render("404", { pageTitle: "Not Found", path: null });
    else {
      const newProduct = new Product(
        newData.id,
        newData.title,
        newData.imageUrl,
        newData.price,
        newData.description
      );
      newProduct.save();
      res.redirect("/product/" + newData.id);
    }
  });
};

exports.getDeleteProduct = (req, res) => {
  const id = req.params.productId;
  Product.delete(id, () => {
    res.redirect("/admin/products");
  });
};

exports.getProducts = (req, res) => {
  Product.fetchAll((products) =>
    res.render("admin/product-list", {
      pageTitle: "Products",
      path: "admin/products",
      products,
    })
  );
};
