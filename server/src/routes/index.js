const express = require("express");
const authRoute = require("./auth");
const userRoute = require("./user");
const productRoute = require("./product");
const cartRoute = require("./cart");
const categoryRoute = require("./category");
const orderRoute = require("./order");
const reviewRoute = require("./review");
const favouriteRoute = require("./favourite");
const discountRoute = require("./discount");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/product", productRoute);
router.use("/category", categoryRoute);
router.use("/cart", cartRoute);
router.use("/order", orderRoute);
router.use("/review", reviewRoute);
router.use("/favourite", favouriteRoute);
router.use("/discount", discountRoute);

module.exports = router;
