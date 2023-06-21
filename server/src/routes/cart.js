const express = require("express");
const authorize = require("../middlewares/authorize");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.use(authorize);

router.patch("/increase-one/:productId/:sizeId/:colorId", cartController.increaseOne);
router.patch("/decrease-one/:productId/:sizeId/:colorId", cartController.decreaseOne);
router.delete("/:productId", cartController.deleteItem);
router.delete("/", cartController.deleteCart);
router.post("/", cartController.addItemToCart);
router.get("/", cartController.getCart);

module.exports = router;
