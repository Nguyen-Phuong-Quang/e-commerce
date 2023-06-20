const discountService = require("../services/discount.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc      Get Discount Codes Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the discounts
 */
exports.getAllDiscountCodes = async (req, res, next) => {
    try {
        const { type, message, statusCode, discounts } =
            await discountService.getAllDiscountCodes(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            discounts,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get User's Discount Code Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.discountCodes - All user's discount codes
 * @returns   { JSON } - A JSON object representing the type, message and the discounts
 */
exports.getDiscountCode = async (req, res, next) => {
    try {
        const { type, message, statusCode, discounts } =
            await discountService.getDiscountCode(req.user.discountCodes);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            discounts,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Verify Discount Code Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user.discountCodes - All user's discount codes
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.verifyDiscountCode = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await discountService.verifyDiscountCode(req.params.discountId);

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
 * @desc      Generate Discount Code Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body - Body data
 * @returns   { JSON } - A JSON object representing the type, message and the discount
 */
exports.generateDiscountCode = async (req, res, next) => {
    try {
        const { type, message, statusCode, discount } =
            await discountService.generateDiscountCode(req.body);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            discount,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete Discount Code
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.discountId - Discount code id
 * @returns   { JSON } - A JSON object representing the type, message and the discount
 */
exports.deleteDiscountCode = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await discountService.deleteDiscountCode(req.params.discountId);

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
 * @desc      Delete Discount Code
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.user - An object contains logged in user data
 * @returns   { JSON } - A JSON object representing the type, message and the discount
 */
exports.cancelDiscountCode = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await discountService.cancelDiscountCode(req.params.discountId);

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
