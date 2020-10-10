const fs = require("fs");
const path = require("path");

const Cart = require("./cart");

const p = path.join(require.main.path, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) return cb([]);
    return cb(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(id, title, imageUrl, price, description) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
  }

  save() {
    getProductsFromFile((products) => {
      const newProducts = [...products];

      if (this.id) {
        const productIdx = products.findIndex(
          (product) => this.id === product.id
        );
        newProducts[productIdx] = this;
      } else {
        this.id = Math.random().toString();
        newProducts.push(this);
      }

      fs.writeFile(p, JSON.stringify(newProducts), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((product) => product.id === id);
      cb(product);
    });
  }

  static delete(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((prod) => id === prod.id);
      const newProducts = products.filter((prod) => id !== prod.id);
      fs.writeFile(p, JSON.stringify(newProducts), (err) => console.log(err));
      Cart.deleteProduct(id, product.price);
      cb();
    });
  }
};
