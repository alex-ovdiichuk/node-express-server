const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/product/:id", shopController.getProduct);
router.get("/products", shopController.getProducts);

router.get("/cart/remove/:id", shopController.getCartRemove);
router.get("/cart/:id", shopController.getAddToCart);
router.get("/cart", shopController.getCart);

router.get("/orders", shopController.getOrders);
router.get("/create-order", shopController.getCreateOrder);

router.get("/", shopController.getShopIndex);

module.exports = router;
