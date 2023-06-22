const moment = require("moment");
const OrderSchema = require("../models/OrderSchema");
const CartSchema = require("../models/CartSchema");
const ProductSchema = require("../models/ProductSchema");
const DiscountSchema = require("../models/DiscountSchema");
const apiFeatures = require("../utils/apiFeatures");
const statusOrder = require("../constants/statusOrder");
const statusType = require("../constants/statusType");

/**
 * @desc    Create New Order
 * @param   { object } body - Body object data
 * @param   { object } user - An object contains logged in user data
 * @returns { object<type|message|statusCode|order> }
 */
exports.createOrder = async (body, user) => {
    const {
        shippingAddress,
        paymentMethod,
        phone,
        discountCode,
        shippingPrice,
    } = body;
    const { address, city, postalCode, country } = shippingAddress;

    // 1. Check if missing field
    if (
        !paymentMethod ||
        !phone ||
        !address ||
        !city ||
        !postalCode ||
        !country
    )
        return {
            type: statusType.error,
            message: "Missing field!",
            statusCode: 400,
        };

    const cart = await CartSchema.findOne({ email: user.email });

    // 2. Check if cart not found or no item found in cart
    if (!cart || cart.items.length === 0)
        return {
            type: statusType.error,
            message: "No cart found!",
            statusCode: 404,
        };

    // 3. Init final total order proce
    let finalPrice = cart.totalPrice + shippingPrice;

    // 4. Check user use discount code
    if (discountCode) {
        // Check discount code exist
        const discount = await DiscountSchema.findById(discountCode);

        // If no discount found
        if (!discount)
            return {
                type: statusType.error,
                message: "No discount code found!",
                statusCode: 404,
            };

        // Check valid day
        if (moment().unix() > discount.validUntil)
            return {
                type: statusType.error,
                message: "Discount code is expired!",
                statusCode: 400,
            };

        // Check min price required
        if (cart.totalPrice > discount.minOrderValue) {
            // Check price unit
            if (discount.discountUnit === "percent") {
                // Check value to reduce amount
                const reducedAmount =
                    (cart.totalPrice * discount.discountValue) / 100;

                if (reducedAmount > discount.maxDiscountAmount) {
                    finalPrice -= discount.maxDiscountAmount;
                } else {
                    finalPrice -= reducedAmount;
                }
            } else {
                finalPrice -= discount.discountValue;
            }
        }
        discount.available -= 1;
        await discount.save();
    }

    // 5. Order detail
    const orderDetail = {
        products: cart.items,
        user: user._id,
        orderPrice: cart.totalPrice,
        totalPrice: finalPrice,
        isPaid: true,
        paidAt: moment(),
        shippingAddress,
        phone,
        paymentMethod,
        shippingPrice,
    };

    // 6. Create order
    const order = await OrderSchema.create(orderDetail);

    // 7. Update product quantity and sold
    for (const item of cart.items) {
        const id = item.product;
        const { totalProductQuantity } = item;
        const product = await ProductSchema.findById(id);
        product.sold += totalProductQuantity;
        product.quantity -= totalProductQuantity;
        await product.save();
    }

    // 8. Delete cart after create order
    await CartSchema.findByIdAndDelete(cart._id);

    return {
        type: statusType.success,
        message: "Order is being processed!",
        statusCode: 200,
        order,
    };
};

/**
 * @desc    Get Orders By query
 * @param   { object } req - Request object
 * @returns { object<type|message|statusCode|orders> }
 */

exports.getOrdersByQuery = async (req) => {
    // 1. Set user id in req.query
    req.query.user = req.user._id;

    // 2. Get orders by api feature
    const orders = await apiFeatures(req, OrderSchema);

    // 3. If no order found
    if (!orders || orders.length === 0)
        return {
            type: statusType.error,
            message: "No order found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Order found!",
        statusCode: 200,
        orders,
    };
};

/**
 * @desc    Get Order Using It's ID
 * @param   { String } id - Order ID
 * @returns { object<type|message|statusCode|order> }
 */
exports.getOrderById = async (orderId) => {
    const order = await OrderSchema.findById(orderId);

    // If no order found
    if (!order)
        return {
            type: statusType.error,
            message: "No order found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Order found!",
        statusCode: 200,
        order,
    };
};

/**
 * @desc    Cancel Order
 * @param   { String } id - Order ID
 * @returns { object<type|message|statusCode> }
 */
exports.cancelOrder = async (orderId) => {
    const order = await OrderSchema.findById(orderId);

    // 1. Check order if not found
    if (!order)
        return {
            type: statusType.error,
            message: "No order found!",
            statusCode: 404,
        };

    // 2. Update item in order
    for (const item of order.products) {
        const product = await ProductSchema.findById(item.product);

        if (!product)
            return {
                type: statusType.error,
                message: "No product found!",
                statusCode: 404,
            };

        product.quantity += item.totalProductQuantity;
        product.sold -= item.totalProductQuantity;

        await product.save();
    }

    // 3. Delete order
    await OrderSchema.findByIdAndDelete(orderId);

    return {
        type: statusType.success,
        message: "Cancel order successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Update Order Status
 * @param   { String } status - Order status
 * @param   { String } id - Order ID
 * @returns { object<type|message|statusCode> }
 */
exports.updatestatusOrder = async (status, orderId) => {
    // 1. Check if missing status field
    if (!status)
        return {
            type: statusType.error,
            message: "Status field required!",
            statusCode: 400,
        };

    // 2. Check order is in format
    if (!statusOrder.includes(status))
        return {
            type: statusType.error,
            message: "No status found in enum!",
            statusCode: 400,
        };

    const order = await OrderSchema.findById(orderId);

    // 3. Check if no order found
    if (!order)
        return {
            type: statusType.error,
            message: "No order found!",
            statusCode: 404,
        };

    // 4. Cancelled Case
    if (status === "Cancelled") {
        const response = await this.cancelOrder(orderId);

        if (response.type === "Error") {
            return response;
        }

        return {
            type: statusType.success,
            message: "Cancel order successfully!",
            statusCode: 200,
        };
    }

    // 5. Update status
    order.status = status;

    // 6. Save order
    await order.save();

    return {
        type: statusType.success,
        message: "Update order status successfully!",
        statusCode: 200,
    };
};
