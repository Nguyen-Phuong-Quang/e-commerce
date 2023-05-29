const favouriteService = require("../services/favourite.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc       Add product to favorite list controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @property  { String } req.params.productId - Product ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.addToFavourite = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await favouriteService.addToFavourite(
                req.user._id,
                req.params.productId
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
 * @desc      Delete product from favorite list controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @property  { String } req.params.productId - Product ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteProductFromFavourite = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await favouriteService.deleteProductFromFavourite(
                req.user._id,
                req.params.productId
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
 * @desc      Get user's favorite list controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @returns   { JSON } - A JSON object representing the type, message, and favourite list
 */
exports.getFavouriteList = async (req, res, next) => {
    try {
        const { type, message, statusCode, favourite } =
            await favouriteService.getFavouriteList(req.user._id);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            favourite,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc       Check if product in favorite list controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @property  { String } req.params.productId - Product ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.checkProductInFavouriteList = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await favouriteService.checkProductInFavouriteList(
                req.user._id,
                req.params.productId
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
