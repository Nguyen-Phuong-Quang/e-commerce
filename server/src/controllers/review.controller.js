const reviewService = require("../services/review.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");

/**
 * @desc      Create New Review Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the review
 */
exports.addReview = async (req, res, next) => {
    try {
        const { type, message, statusCode, review } =
            await reviewService.addReview(
                req.params.productId,
                req.user._id,
                req.body
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            review,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update Review Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.params.reviewId - Review ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the review
 */
exports.updateReview = async (req, res, next) => {
    try {
        const { type, message, statusCode, review } =
            await reviewService.updateReview(
                req.user._id,
                req.params.productId,
                req.params.reviewId,
                req.body
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            review,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete Review Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.params.reviewId - Review ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteReview = async (req, res, next) => {
    const { productId, reviewId } = req.params;

    try {
        const { type, message, statusCode } = await reviewService.deleteReview(
            req.user._id,
            productId,
            reviewId
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
 * @desc      Get Review Using It's ID Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.params.reviewId - Review ID
 * @returns   { JSON } - A JSON object representing the type, message and the review
 */
exports.getReviewById = async (req, res, next) => {
    try {
        const { type, message, statusCode, review } =
            await reviewService.getReviewById(
                req.params.productId,
                req.params.reviewId
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            review,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get All Reviews Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the reviews
 */
exports.getAllReviews = async (req, res, next) => {
    try {
        if (!req.query.limit) req.query.limit = 3;

        const { type, message, statusCode, reviews } =
            await reviewService.getAllReviews(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            reviews,
        });
    } catch (err) {
        next(err);
    }
};
