const express = require("express");
const authorize = require("../middlewares/authorize");
const orderController = require("../controllers/order.controller");
const restrictedTo = require("../middlewares/restrictedTo");

const router = express.Router();

router.use(authorize);

// Create order
// Get order by query
router
    .route("/")
    .post(orderController.createOrder)
    .get(orderController.getOrdersByQuery);

// Get order by id
// Delete order by id
// Update order status
router
    .route("/:orderId")
    .get(orderController.getOrderById)
    .delete(orderController.cancelOrder)
    .patch(restrictedTo("ADMIN", "SELLER"), orderController.updateOrderStatus);

module.exports = router;
