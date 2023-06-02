const ProductSchema = require("../models/ProductSchema");
const ReviewSchema = require("../models/ReviewSchema");
const apiFeature = require("../utils/apiFeatures");
const statusType = require("../constants/statusType");

/**
 * @desc    Create New Review
 * @param   { String } productId - Product ID
 * @param   { object } userId - An object contains logged in user data
 * @param   { object } body - Body object data
 * @returns { object<type|message|statusCode|review> }
 */
exports.addReview = async (productId, userId, body) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "Product not found!",
            statusCode: 404,
        };

    const { review, rating } = body;

    if (!review || !rating)
        return {
            type: statusType.error,
            message: "Missing field!",
            statusCode: 400,
        };

    if (rating < 1)
        return {
            type: statusType.error,
            message: "Rating must greater than or equal to 1",
        };

    if (rating > 5)
        return {
            type: statusType.error,
            message: "Rating must less than or equal to 5",
        };

    const isExited = await ReviewSchema.find({
        user: userId,
        product: productId,
    });

    if (isExited.length !== 0)
        return {
            type: statusType.error,
            message: "Only one review allowed!",
            statusCode: 400,
        };

    const newReview = await ReviewSchema.create({
        user: userId,
        product: productId,
        rating,
        review,
    });

    return {
        type: statusType.success,
        message: "Create review successfully!",
        statusCode: 200,
        review: newReview,
    };
};

/**
 * @desc    Update Review Using It's ID
 * @param   { String } userId - userId
 * @param   { String } prodcuctId - Product ID
 * @param   { String } reviewId - Review ID
 * @param   { object } body - Body object data
 * @returns { object<type|message|statusCode|review> }
 */
exports.updateReview = async (userId, productId, reviewId, body) => {
    const review = await ReviewSchema.findOne({
        _id: reviewId,
        product: productId,
    });

    if (!review)
        return {
            type: statusType.error,
            message: "Review not found!",
            statusCode: 404,
        };

    if (userId.toString() !== review.user.toString())
        return {
            type: statusType.error,
            message: "You don't have permission to edit this comment!",
            statusCode: 404,
        };

    if (body.rating < 1)
        return {
            type: statusType.error,
            message: "Rating must greater than or equal to 1",
        };

    if (body.rating > 5)
        return {
            type: statusType.error,
            message: "Rating must less than or equal to 5",
        };

    const updateReview = await ReviewSchema.findByIdAndUpdate(reviewId, body, {
        new: true,
        runValidators: true,
    });

    await ReviewSchema.calculateAverageRatings(updateReview.product);

    return {
        type: statusType.success,
        message: "Update review successfully!",
        statusCode: 200,
        review: updateReview,
    };
};

/**
 * @desc    Delete Review Using It's ID
 * @param   { String } userId - User ID
 * @param   { String } productId - Product ID
 * @param   { String } reviewId - Review ID
 * @returns { object<type|message|statusCode> }
 */
exports.deleteReview = async (userId, productId, reviewId) => {
    const review = await ReviewSchema.findOne({
        _id: reviewId,
        product: productId,
    });

    if (!review)
        return {
            type: statusType.error,
            message: "Review not found!",
            statusCode: 404,
        };

    if (userId.toString() !== review.user.toString())
        return {
            type: statusType.error,
            message: "You don't have permission to delete this comment!",
            statusCode: 404,
        };

    await ReviewSchema.findByIdAndDelete(reviewId);
    await ReviewSchema.calculateAverageRatings(review.product);

    return {
        type: statusType.success,
        message: "Delete review successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Get Review Using It's ID
 * @param   { String } productId - Product ID
 * @param   { String } reviewId - Review ID
 * @returns { object<type|message|statusCode|review> }
 */
exports.getReviewById = async (productId, reviewId) => {
    const review = await ReviewSchema.findOne({
        _id: reviewId,
        product: productId,
    });

    if (!review)
        return {
            type: statusType.error,
            message: "Review not found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Get review successfully!",
        statusCode: 200,
        review,
    };
};

/**
 * @desc    Get All Reviews By Query
 * @param   { object } req - Request object
 * @returns { object<type|message|statusCode|reviews> }
 */
exports.getAllReviews = async (req) => {
    const product = await ProductSchema.findById(req.params.productId);

    if (!product)
        return {
            type: statusType.error,
            message: "Product not found!",
            statusCode: 404,
        };

    let reviews = await apiFeature(req, ReviewSchema);

    if (reviews.length === 0)
        return {
            type: statusType.error,
            message: "No review found!",
            statusCode: 404,
        };

    reviews = reviews.filter(
        (review) =>
            review.product.toString() === req.params.productId.toString()
    );

    return {
        type: statusType.success,
        message: "Reviews found!",
        statusCode: 200,
        reviews,
    };
};
