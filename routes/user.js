const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Trang chủ
router.get("/", userController.getHomePage);

// Danh sách sản phẩm với bộ lọc & tìm kiếm
router.get("/products", userController.getProducts);

// Chi tiết sản phẩm
router.get("/product/:id", userController.getProductDetail);
router.get("/products/:id", userController.getProductDetail);

// Xem sản phẩm theo danh mục (Shop by Category)
router.get("/category/:id", userController.getCategoryProducts);
router.get("/categories/:id", userController.getCategoryProducts);

// Trang tổng hợp danh mục
router.get("/categories", userController.getCategoriesPage);
router.get("/category", userController.getCategoriesPage);

module.exports = router;
