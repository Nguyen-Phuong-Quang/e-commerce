const FavouriteSchema = require("../models/FavouriteSchema");
const ProductSchema = require("../models/ProductSchema");
const statusType = require("../constants/statusType");

/**
 * @desc    Add product to favorite list service
 * @param   { String } userId - User ID
 * @param   { String } productId - Product ID
 * @returns { Object<type|statusCode|message> }
 */
exports.addToFavourite = async (userId, productId) => {
    const product = await ProductSchema.findById(productId);

    // 1. Check product if not exist
    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    const favourite = await FavouriteSchema.findOne({ user: userId });

    // 2. Check favourite exist or not
    if (!favourite) {
        await FavouriteSchema.create({
            user: userId,
            products: [productId],
        });
    } else {
        if (favourite.products.includes(productId))
            return {
                type: statusType.error,
                message: "Product is existed in favourite list!",
                statusCode: 400,
            };

        favourite.products.push(productId);

        await favourite.save();
    }

    return {
        type: statusType.success,
        message: "Add product to favourite list successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Remove product from favorite list service
 * @param   { String } userId - User ID
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode> }
 */
exports.deleteProductFromFavourite = async (userId, productId) => {
    const favourite = await FavouriteSchema.findOne({ user: userId });

    // 1. Check favourite list if not exist
    if (!favourite)
        return {
            type: statusType.error,
            message: "No favourite list found!",
            statusCode: 404,
        };

    // 2. Check if favourite list does not have this product
    if (!favourite.products.includes(productId))
        return {
            type: statusType.error,
            message: "This product is not in favourite list!",
            statusCode: 404,
        };

    // 3. Update favout=rite list (Remove product from list)
    await favourite.update({ $pull: { products: productId } });

    return {
        type: statusType.success,
        message: "Remove product from favourite list successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Get product's favorite list service
 * @param   { String } userId - User ID
 * @returns { Object<type|message|statusCode|favorite> }
 */
exports.getFavouriteList = async (userId) => {
    const favourite = await FavouriteSchema.findOne({ user: userId });

    // 1. Check if no favourite list found or no product in list
    if (!favourite || favourite.products.length === 0)
        return {
            type: statusType.error,
            message: "Favourite list is empty!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Favourite list found!",
        statusCode: 200,
        favourite,
    };
};

/**
 * @desc    Check if product in favorite list service
 * @param   { String } userId - User ID
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode> }
 */
exports.checkProductInFavouriteList = async (userId, productId) => {
    const favourite = await FavouriteSchema.findOne({
        user: userId,
        products: productId,
    });

    // Check favourite list if not exist
    if (!favourite)
        return {
            type: statusType.error,
            message: "No product in favourite list found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Product in favourite list found!",
        statusCode: 200,
    };
};
