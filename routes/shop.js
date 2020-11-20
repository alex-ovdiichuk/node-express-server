const express = require("express");

const shopController = require("../controllers/shop");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/product/:id", shopController.getProduct);
router.get("/products", shopController.getProducts);

router.get("/cart/remove/:id", isAuth, shopController.getCartRemove);
router.get("/cart/:id", isAuth, shopController.getAddToCart);
router.get("/cart", isAuth, shopController.getCart);

router.get("/orders", isAuth, shopController.getOrders);
router.get("/create-order", isAuth, shopController.getCreateOrder);

router.get("/", shopController.getShopIndex);

module.exports = router;
