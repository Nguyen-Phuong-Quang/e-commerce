const express = require("express");
const discountController = require("../controllers/discount.controller");
const authorize = require("../middlewares/authorize");
const restrictTo = require("../middlewares/restrictedTo");
const router = express.Router();

router.use(authorize);

router.post("/verify/:discountCode", discountController.verifyDiscountCode);

router.get("/find", discountController.getDiscountCode);

router.delete("/cancel/:discountCode", discountController.cancelDiscountCode);

router.use(restrictTo("ADMIN"));

router.get("/", discountController.getAllDiscountCodes);

router.post("/generate", discountController.generateDiscountCode);

router.delete("/delete/:discountId", discountController.deleteDiscountCode);

module.exports = router;
