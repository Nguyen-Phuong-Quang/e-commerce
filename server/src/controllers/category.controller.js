const categoryService = require("../services/category.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc      Create New Category Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.body.name - Category name
 * @property  { String } req.body.description - Category description
 * @property  { Object } req.file - Category image
 * @returns   { JSON } - A JSON object representing the type, message and category
 */
exports.addCategory = async (req, res, next) => {
    try {
        const { type, message, statusCode, category } =
            await categoryService.createCategory(
                req.body.name,
                req.body.description,
                req.file
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            category,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get Category Data Using It's ID Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.categoryId - Category ID
 * @returns   { JSON } - A JSON object representing the type, message and category
 */
exports.getCategoryById = async (req, res, next) => {
    try {
        const { type, message, statusCode, category } =
            await categoryService.getCategoryById(req.params.categoryId);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            category,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get All Categories Data Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Number } req.query.limit - number of items in page
 * @returns   { JSON } - A JSON object representing the type, message and categries
 */
exports.getCategories = async (req, res, next) => {
    try {
        if (!req.query.limit) req.query.limit = 10;

        const { type, message, statusCode, categories } =
            await categoryService.getCategoriesByQuery(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            categories,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update Category Details Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.categoryId, - Category ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and category
 */
exports.updateCategoryDetail = async (req, res, next) => {
    try {
        const { type, message, statusCode, category } =
            await categoryService.updateCategoryDetail(
                req.params.categoryId,
                req.body
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            category,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update Category Image Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.categoryId, - Category ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and category
 */
// exports.updateCategoryImage = async (req, res, next) => {
//     try {
//         const { type, message, statusCode, category } =
//             await categoryService.updateCategoryImage(
//                 req.params.categoryId,
//                 req.file
//             );

//         if (type === statusType.error)
//             return next(new CustomErrorHandler(statusCode, message));

//         res.status(statusCode).json({
//             type,
//             message,
//             category,
//         });
//     } catch (err) {
//         next(err);
//     }
// };

/**
 * @desc      Delete Category Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.categoryId, - Category ID
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteCategory = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await categoryService.deleteCategory(req.params.categoryId);

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
