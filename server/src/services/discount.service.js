const moment = require("moment");
const DiscountSchema = require("../models/DiscountSchema");
const UserSchema = require("../models/UserSchema");
const apiFeatures = require("../utils/apiFeatures");
const statusType = require("../constants/statusType");

/**
 * @desc    Get all discount codes
 * @param   { object } req - Request object
 * @returns { object<type|message|statusCode|discounts> }
 */
exports.getAllDiscountCodes = async (req) => {
    const minValue = req.query.minOrderValue;
    req.query.minOrderValue = { $lte: minValue };
    req.query.available = { $gte: 0 };

    const discounts = await apiFeatures(req, DiscountSchema);

    if (!discounts || discounts.length === 0)
        return {
            type: statusType.error,
            message: "No discount code found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Discount codes found!",
        statusCode: 200,
        discounts,
    };
};

/**
 * @desc    Get Discount Code
 * @param   { Array } codes - Discount codes
 * @return  { object<type|message|statusCode|discounts> }
 */
exports.getDiscountCode = async (discountId) => {
    const discounts = await DiscountSchema.findById(discountId);

    if (!discounts || discounts.length === 0)
        return {
            type: statusType.error,
            message: "No discount found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Discount found!",
        statusCode: 200,
        discounts,
    };
};

/**
 * @desc    Verfiy discount code
 * @param   { String } discountCode - Discount code
 * @param   { object } user - User object data
 * @returns { object<type|message|statusCode> }
 */
exports.verifyDiscountCode = async (discountId) => {
    if (!discountId)
        return {
            type: statusType.error,
            message: "Missing discount code on url params",
            statusCode: 400,
        };

    const discount = await DiscountSchema.findById(discountId);

    if (!discount)
        return {
            type: statusType.error,
            message: "No discount found!",
            statusCode: 404,
        };

    discount.available -= 1;

    await discount.save();

    return {
        type: statusType.success,
        message: "Success verify discount code!",
        statusCode: 200,
    };
};

/**
 * @desc    Generate Discount Code
 * @param   { object }  body - Request body data
 * @returns { object<type|message|statusCode|discount> }
 */
exports.generateDiscountCode = async (body) => {
    const {
        available,
        discountValue,
        discountUnit,
        validUntil,
        minOrderValue,
        maxDiscountAmount,
    } = body;

    if (
        !available ||
        !discountValue ||
        !discountUnit ||
        !validUntil ||
        !minOrderValue ||
        !maxDiscountAmount
    )
        return {
            type: statusType.error,
            message: "Missing field!",
            statusCode: 400,
        };

    const discount = await DiscountSchema.create({
        discountValue,
        discountUnit,
        validUntil: moment(validUntil).unix(),
        available,
        minOrderValue,
        maxDiscountAmount,
    });

    return {
        type: statusType.success,
        message: "Create discount code successfully!",
        statusCode: 200,
        discount,
    };
};

/**
 * @desc    Delete Discount Code
 * @param   { String } discountId - ID of discount code
 * @return  { object<type|message|statusCode> }
 */
exports.deleteDiscountCode = async (discountId) => {
    const success = await DiscountSchema.findByIdAndDelete(discountId);

    if (!success)
        return {
            type: statusType.error,
            message: "No discount code found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Delete discount code successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Cancel Discount Code
 * @param   { String } discountCode - Discount code
 * @param   { String } userId - ID of user
 * @return  { object<type|message|statusCode> }
 */
exports.cancelDiscountCode = async (discountCode) => {
    const discount = await DiscountSchema.findOne({ code: discountCode });

    if (!discount)
        return {
            type: statusType.error,
            message: "No discount code found!",
            statusCode: 404,
        };

    discount.available += 1;

    await discount.save();

    return {
        type: statusType.success,
        message: "Discount code cancelled!",
        statusCode: 200,
    };
};
