const cartService = require("../services/cart.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc      Add Product To Cart Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @property  { String } productId - Product ID
 * @property  { Number } quantity - Product quantity
 * @property  { String } color - Color
 * @property  { String } size - Size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
exports.addItemToCart = async (req, res, next) => {
    const { productId, quantity, colorId, sizeId } = req.body;
    try {
        const { type, message, statusCode, cart } =
            await cartService.addItemToCart(
                req.user.email,
                productId,
                quantity,
                colorId,
                sizeId
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            cart,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get Cart By User Email Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
exports.getCart = async (req, res, next) => {
    try {
        const { type, message, statusCode, cart } = await cartService.getCart(
            req.user.email
        );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            cart,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete Cart By User Email Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteCart = async (req, res, next) => {
    try {
        const { type, message, statusCode } = await cartService.deleteCart(
            req.user.email
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
 * @desc      Delete Product From Cart Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.body.color - Color
 * @property  { String } req.body.size - Size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
exports.deleteItem = async (req, res, next) => {
    try {
        const { type, message, statusCode, cart } =
            await cartService.deleteItem(
                req.user.email,
                req.params.productId,
                req.query.size,
                req.query.color
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            cart,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc       Increase Product By One Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @property  { String } productId - Product ID
 * @property  { String } color - Color
 * @property  { String } size - Size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
exports.increaseOne = async (req, res, next) => {

    const { productId, sizeId, colorId } = req.params;
    try {
        const { type, statusCode, message, cart } =
            await cartService.increaseOne(
                req.user.email,
                productId,
                colorId,
                sizeId
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            cart,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc       Decrease Product By One Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.email - User email
 * @property  { String } productId - Product ID
 * @property  { String } color - Color
 * @property  { String } size - Size
 * @returns   { JSON } - A JSON object representing the type, message, and the cart
 */
exports.decreaseOne = async (req, res, next) => {
    const { productId, sizeId, colorId } = req.params;

    try {
        const { type, statusCode, message, cart } =
            await cartService.decreaseOne(
                req.user.email,
                productId,
                colorId,
                sizeId
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            cart,
        });
    } catch (err) {
        next(err);
    }
};
