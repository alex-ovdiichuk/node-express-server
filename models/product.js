const fs = require("fs");
const { get } = require("http");
const path = require("path");

const p = path.join(require.main.path, "data", "products.json");

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, data) => {
    if (err) return cb([]);
    return cb(JSON.parse(data));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, description) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
};
