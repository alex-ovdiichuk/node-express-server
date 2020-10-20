// const Sequelize = require("sequelize");

// const sequelize = require("../util/db");
const ObjectId = require("mongodb").ObjectId;
const getDb = require("../util/mongo").getDb;

class User {
  constructor(login, email, cart, id) {
    this.login = login;
    this.email = email;
    this.cart = cart;
    this.id = id ? new ObjectId(id) : null;
  }

  async save() {
    try {
      const db = getDb();
      if (this._id) {
        const result = await db
          .collection("users")
          .updateOne({ _id: this._id }, { $set: this });
        if (!result) throw new Error(result);
        return result;
      } else {
        const result = await db.collection("users").insertOne(this);
        if (!result) throw new Error(result);
        return result;
      }
    } catch (err) {
      console.log(err);
    }
  }

  async addToCart(product) {
    try {
      const cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.equals(product._id);
      });
      console.log(cartProductIndex);
      let updatedCart = [];

      if (cartProductIndex >= 0) {
        const quantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCart = {
          items: [...this.cart.items],
        };
        updatedCart.items[cartProductIndex] = {
          ...this.cart.items[cartProductIndex],
          quantity,
        };
      } else {
        updatedCart = {
          items: [...this.cart.items, { productId: product._id, quantity: 1 }],
        };
      }

      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne({ _id: this.id }, { $set: { cart: updatedCart } });
      if (!result) throw new Error(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async getCart() {
    try {
      const db = getDb();
      const productIds = this.cart.items.map((item) => {
        return item.productId;
      });
      const result = await db
        .collection("products")
        .find({ _id: { $in: productIds } })
        .toArray();
      if (!result) throw new Error(result);
      return result.map((p) => ({
        ...p,
        quantity: this.cart.items.find((i) => i.productId.equals(p._id))
          .quantity,
      }));
    } catch (err) {
      console.log(err);
    }
    return this.cart;
  }

  async deleteItemFromCart(productId) {
    try {
      const updatedCart = this.cart.items.filter((i) => {
        return !i.productId.equals(productId);
      });
      const db = getDb();
      const result = await db
        .collection("users")
        .updateOne(
          { _id: this.id },
          { $set: { cart: { items: updatedCart } } }
        );
      if (!result) throw new Error(result);
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  async addOrder() {
    try {
      const db = getDb();
      const products = await this.getCart();
      if (!products) throw new Error(products);
      const order = {
        items: products,
        user: {
          _id: this.id,
          name: this.name,
          email: this.email,
        },
      };
      const resultOrder = await db.collection("orders").insertOne(order);
      if (resultOrder) {
        this.cart = { items: [] };
        const resultUser = await db
          .collection("users")
          .updateOne({ _id: this.id }, { $set: { cart: { items: [] } } });
        if (!resultUser) throw new Error(resultUser);
        else return resultOrder;
      } else throw new Error(result);
    } catch (err) {
      console.log(err);
    }
  }

  async getOrders() {
    try {
      const db = getDb();
      const result = await db
        .collection("orders")
        .find({ "user._id": this.id });
      if (!result) throw new Error(result);
      else return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchById(userId) {
    try {
      const db = getDb();
      const user = await db
        .collection("users")
        .find({ _id: new ObjectId(userId) })
        .next();
      if (!user) throw new Error(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  }
}

// const User = sequelize.define("user", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
// });

module.exports = User;
