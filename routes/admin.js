const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

router.get("/add-product", isAuth, adminController.getAddProduct);
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);
router.post("/edit-product", isAuth, adminController.postEditProduct);

router.get(
  "/delete-product/:productId",
  isAuth,
  adminController.getDeleteProduct
);

router.get("/products", isAuth, adminController.getProducts);

module.exports = router;
