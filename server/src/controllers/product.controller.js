const productService = require("../services/product.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");

/**
 * @desc      Get Product By product Id
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the products
 */
exports.getProductById = async (req, res, next) => {
    try {
        const { type, message, statusCode, product } =
            await productService.getProductById(req.params.productId);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            product,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get All Products Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the products
 */
exports.getAllProducts = async (req, res, next) => {
    try {
        const { type, message, statusCode, products } =
            await productService.getAllProductsByQuery(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            products,
        });
    } catch (err) {
        next(err);
    }
};

//lấy ra các sản phẩm của người bán
exports.getSellerProducts = async (req, res, next) => {
    try {
        const { type, message, statusCode, products } =
            await productService.getSellerProducts(req, req.user._id);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            products,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Create New Product Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.files - Product images
 * @property  { String } req.user._id - User ID
 * @returns   { JSON } - A JSON object representing the type, message and the products
 */
exports.addProduct = async (req, res, next) => {
    try {
        const { type, message, statusCode, product } =
            await productService.createProduct(
                req.body,
                req.files,
                req.user._id
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            product,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update Product Details Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { Object } req.body - Body object data
 * @returns   { JSON } - A JSON object representing the type, message and the product data
 */
exports.updateProductDetail = async (req, res, next) => {
    try {
        const { type, message, statusCode, product } =
            await productService.updateProductDetail(
                req.params.productId,
                req.user._id,
                req.body
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            product,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update Product Images Controller (Main image and others images)
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - Seller ID
 * @property  { Object } req.files - Product images
 * @returns   { JSON } - A JSON object representing the type, message, and the product
 */
exports.updateProductImages = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await productService.updateProductImages(
                req.params.productId,
                req.user._id,
                req.files
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
 * @desc      Delete Product Using It's ID Controller
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - Seller ID
 * @returns   { JSON } - A JSON object representing the type, message, and the product
 */
exports.deleteProductById = async (req, res, next) => {
    try {
        const { type, message, statusCode } =
            await productService.deleteProductById(
                req.params.productId,
                req.user._id
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
 * @desc      Add Product Color Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.body.color - Product color
 * @returns   { JSON } - A JSON object representing the type, message and the color
 */
exports.addColor = async (req, res, next) => {
    try {
        const { type, message, statusCode, color } =
            await productService.addColor(
                req.params.productId,
                req.user._id,
                req.body.color
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            color,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete Product Color Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.body.color - Product color
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteColor = async (req, res, next) => {
    try {
        const { type, message, statusCode } = await productService.deleteColor(
            req.params.productId,
            req.user._id,
            req.query.color
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
 * @desc      Add Product Size Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.body.color - Product size
 * @returns   { JSON } - A JSON object representing the type, message and the size
 */
exports.addSize = async (req, res, next) => {
    try {
        const { type, message, statusCode, size } =
            await productService.addSize(
                req.params.productId,
                req.user._id,
                req.body.size
            );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            size,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete Product Size Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.productId - Product ID
 * @property  { String } req.user._id - User ID
 * @property  { String } req.body.size - Product size
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.deleteSize = async (req, res, next) => {
    try {
        const { type, message, statusCode } = await productService.deleteSize(
            req.params.productId,
            req.user._id,
            req.query.size
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
 * @desc      Delete Product Size Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the static
 */
exports.getProductStatics = async (req, res, next) => {
    try {
        const static = await productService.getProductStatics();

        res.status(200).json({
            type: "Success",
            message: "Get statistic successfully!",
            static,
        });
    } catch (err) {
        next(err);
    }
};
