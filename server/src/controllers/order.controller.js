const orderService = require("../services/order.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc      Create New Order Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type, message and the order
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { type, message, statusCode, order } =
            await orderService.createOrder(req.body, req.user);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            order,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get All Orders Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Number }  req.query.limit - Limit number of items
 * @returns   { JSON } - A JSON object representing the type, message and the orders
 */
exports.getOrdersByQuery = async (req, res, next) => {
    try {
        if (!req.query.limit) req.query.limit = 10;

        const { type, message, statusCode, orders } =
            await orderService.getOrdersByQuery(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            orders,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get Order Using It's ID Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.orderId - Order ID
 * @returns   { JSON } - A JSON object representing the type, message and the order
 */
exports.getOrderById = async (req, res, next) => {
    try {
        const { type, message, statusCode, order } =
            await orderService.getOrderById(req.params.orderId);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            order,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Cancel Order Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.orderId - Order ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.cancelOrder = async (req, res, next) => {
    try {
        const { type, message, statusCode } = await orderService.cancelOrder(
            req.params.orderId
        );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update order status Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.body.status - Order new status
 * @property  { String } req.params.orderId - Order ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await orderService.updateOrderStatus(
                req.body.status,
                req.params.orderId
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
        });
    } catch (err) {
        next(err);
    }
};
