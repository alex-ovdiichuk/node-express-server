// const Sequelize = require("sequelize");

// const sequelize = require("../util/db");
const mongodb = require("mongodb");
const getDb = require("../util/mongo").getDb;
class Product {
  constructor(title, imageUrl, price, description, id, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    if (id) this._id = new mongodb.ObjectId(id);
    this.userId = userId;
  }

  async save() {
    try {
      const db = getDb();
      if (this._id) {
        const result = await db
          .collection("products")
          .updateOne({ _id: this._id }, { $set: this });
        if (!result) throw new Error(result);
        return result;
      } else {
        const result = await db.collection("products").insertOne(this);
        if (!result) throw new Error(result);
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const products = await db.collection("products").find().toArray();
      if (!products) throw new Error(products);
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchById(prodId) {
    try {
      const db = getDb();
      const product = await db
        .collection("products")
        .find({ _id: new mongodb.ObjectID(prodId) })
        .next();
      if (!product) throw new Error(product);
      return product;
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteById(prodId) {
    try {
      const db = getDb();
      const result = await db
        .collection("products")
        .deleteOne({ _id: new mongodb.ObjectID(prodId) });
      if (!result) throw new Error(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

// const Product = sequelize.define("product", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.DOUBLE,
//     allowNull: false,
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.TEXT,
//     allowNull: false,
//   },
// });

module.exports = Product;
