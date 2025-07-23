const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const categoryController = require("../controllers/categoryController");
const articleController = require("../controllers/articleController");

// Trang chủ
router.get("/", homeController.getHome);

// Tin bài viết (nhóm đặc biệt)
router.get("/article", articleController.getMain);

// Các chuyên mục đơn lẻ
router.get("/:category", categoryController.getCategory);

module.exports = router;
