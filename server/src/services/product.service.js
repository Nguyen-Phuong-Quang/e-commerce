const ProductSchema = require("../models/ProductSchema");
const ColorSchema = require("../models/ColorSchema");
const SizeSchema = require("../models/SizeSchema");
const {
    uploadFileCloudinary,
    destroyFileCloudinary,
} = require("../utils/cloudinary");
const apiFeatures = require("../utils/apiFeatures");
const statusType = require("../constants/statusType");

/**
 * @desc    Query Product Using It's ID
 * @param   { String } productId - Product ID
 * @returns { Object<type|message|statusCode|product> }
 */
exports.getProductById = async (productId) => {
    const product = await ProductSchema.findById(productId).lean();

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Found!",
        statusCode: 200,
        product,
    };
};

/**
 * @desc    Get products by query
 * @param   { Object } req - Request object
 * @returns { Object<type|message|statusCode|products> }
 */
exports.getAllProductsByQuery = async (req) => {
    const { limit, min, max } = req.query;

    if (!limit) req.query.limit = 20;

    if (min || max) {
        const priceSearch = {};
        if (min) priceSearch.$gte = min * 1;
        if (max) priceSearch.$lte = max * 1;
        req.query.priceAfterDiscount = priceSearch;
    }

    const products = await apiFeatures(req, ProductSchema);

    if (products.length < 1)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Found!",
        statusCode: 200,
        products,
    };
};

//Lấy ra các prodcuts của người bán
exports.getSellerProducts = async (req, userId) => {
    req.query.seller = userId;

    const populate = [{ path: "category", select: "name" }];

    const products = await apiFeatures(req, ProductSchema, populate);

    if (products.length < 1)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Found!",
        statusCode: 200,
        products,
    };
};

/**
 * @desc    Create new product
 * @param   { Object } body - Body object data
 * @param   { Object } files - Product images
 * @param   { String } seller - Product seller ID
 * @returns { Object<type|message|statusCode|product> }
 */
exports.createProduct = async (body, files, sellerId) => {
    const {
        name,
        category,
        price,
        priceAfterDiscount,
        description,
        colors,
        sizes,
        quantity,
        sold,
        isOutOfStock,
    } = body;


    const mainImage = files.find((image) => image.fieldname === "mainImage");
    const images = files.filter((image) => image.fieldname === "images");

    if (
        !name ||
        !price ||
        // !colors ||
        // !sizes ||
        !quantity ||
        !mainImage ||
        mainImage.length === 0 ||
        images.length === 0
    )
        return {
            type: statusType.error,
            message: "Missing field!",
            statusCode: 400,
        };

    const folderName = `Products/${name.trim().split(" ").join("-")}`;

    const imagesPromises = images.map((image) =>
        uploadFileCloudinary(image.buffer, folderName)
    );

    const imagesResult = await Promise.all(imagesPromises);

    const mainImageResult = await uploadFileCloudinary(
        mainImage.buffer,
        folderName
    );

    const imagesSecureUrl = [];
    const imagesPublicId = [];

    imagesResult.forEach((image) => {
        imagesSecureUrl.push(image.secure_url);
        imagesPublicId.push(image.public_id);
    });

    const newProduct = await ProductSchema.create({
        name,
        category,
        price,
        priceAfterDiscount,
        description,
        quantity,
        sold,
        isOutOfStock,
        images: imagesSecureUrl,
        imagesId: imagesPublicId,
        seller: sellerId,
        mainImage: mainImageResult.secure_url,
        mainImageId: mainImageResult.public_id,
    });

    const colorsId = [];
    const sizesId = [];

    if (colors) {
        const colorsArray = colors
            .split(",")
            .map((color) => color.trim().toLowerCase());

        // const colorsArray = colors;

        await Promise.all(
            colorsArray.map(async (color) => {
                const colorDocument = await ColorSchema.findOne({
                    color: color.toLowerCase(),
                });

                if (!colorDocument) {
                    const newColor = await ColorSchema.create({
                        product: newProduct._id,
                        color,
                    });
                    colorsId.push(newColor._id);
                } else {
                    colorsId.push(colorDocument._id);
                    colorDocument.product.push(newProduct._id);
                    await colorDocument.save();
                }
            })
        );
    }
    if (sizes) {
        const sizesArray = sizes
            .split(",")
            .map((size) => size.trim().toLowerCase());

        // const sizesArray = sizes;

        await Promise.all(
            sizesArray.map(async (size) => {
                const sizeDocument = await SizeSchema.findOne({
                    size: size.toLowerCase(),
                });

                if (!sizeDocument) {
                    const newSize = await SizeSchema.create({
                        product: newProduct._id,
                        size,
                    });
                    sizesId.push(newSize._id);
                } else {
                    sizesId.push(sizeDocument._id);
                    sizeDocument.product.push(newProduct._id);
                    await sizeDocument.save();
                }
            })
        );
    }

    newProduct.colors = colorsId;
    newProduct.sizes = sizesId;

    await newProduct.save();

    return {
        type: statusType.success,
        message: "Add product successfully!",
        statusCode: 200,
        product: newProduct,
    };
};

/**
 * @desc    Update Product Details
 * @param   { String } productId - Product ID
 * @param   { String } sellerIdId - Seller ID
 * @param   { Object } body - Body object data
 * @returns { Object<type|message|statusCode|product> }
 */
exports.updateProductDetail = async (productId, sellerId, body) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (sellerId.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    const newProduct = await ProductSchema.findByIdAndUpdate(productId, body, {
        new: true,
        runValidators: true,
    });

    return {
        type: statusType.success,
        message: "Update product detail successfully!",
        statusCode: 200,
        product: newProduct,
    };
};

/**
 * @desc    Update Product Images
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { Object } images - Product images
 * @returns { Object<type|message|statusCode> }
 */
exports.updateProductImages = async (productId, sellerId, images) => {
    if (images.length === 0)
        return {
            type: statusType.error,
            message: "Select images!",
            statusCode: 400,
        };

    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (sellerId.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    const mainImage = images.find((image) => image.fieldname === "mainImage");
    const otherImages = images.filter((image) => image.fieldname === "images");

    const folderName = `Products/${product.name.trim().split(" ").join("-")}`;

    const newProductBody = {};

    if (mainImage) {
        await destroyFileCloudinary(product.mainImageId);
        const mainImageResult = await uploadFileCloudinary(
            mainImage.buffer,
            folderName
        );

        newProductBody.mainImage = mainImageResult.secure_url;
        newProductBody.mainImageId = mainImageResult.public_id;
    }

    if (otherImages.length > 0) {
        product.imagesId.forEach((image) => destroyFileCloudinary(image));

        const imagesPromises = otherImages.map((image) =>
            uploadFileCloudinary(image.buffer, folderName)
        );
        const imagesResult = await Promise.all(imagesPromises);

        const imagesSecureUrl = [];
        const imagesPublicId = [];

        imagesResult.forEach((image) => {
            imagesSecureUrl.push(image.secure_url);
            imagesPublicId.push(image.public_id);
        });

        newProductBody.images = imagesSecureUrl;
        newProductBody.imagesId = imagesPublicId;
    }

    await ProductSchema.findByIdAndUpdate(productId, newProductBody, {
        new: true,
        runValidators: true,
    });

    return {
        type: statusType.success,
        message: "Update image successfully!",
        statusCode: 200,
    };
};

exports.deleteProductById = async (productId, sellerId) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (sellerId.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    await destroyFileCloudinary(product.mainImageId);

    product.imagesId.forEach((image) => destroyFileCloudinary(image));

    await Promise.all(
        product.colors.map(async (color) => {
            await ColorSchema.updateOne(
                { _id: color },
                { $pull: { product: product._id } }
            );
        })
    );

    await Promise.all(
        product.sizes.map(async (size) => {
            await SizeSchema.updateOne(
                { _id: size },
                { $pull: { product: product._id } }
            );
        })
    );

    await ProductSchema.findByIdAndDelete(productId);

    return {
        type: statusType.success,
        message: "Delete product successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Update Product Color
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } color - Product color
 * @returns { Object<type|message|statusCode|color> }
 */
exports.addColor = async (productId, seller, color) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (seller.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    if (await ColorSchema.isExisted(productId, color.toLowerCase()))
        return {
            type: statusType.error,
            message: "Color exists!",
            statusCode: 401,
        };

    const colorDoc = await ColorSchema.findOne({ color: color.toLowerCase() });

    if (colorDoc) {
        product.colors.push(colorDoc._id);
        colorDoc.product.push(productId);
        await colorDoc.save();

        await product.save();

        return {
            type: statusType.success,
            message: "Add color successfully!",
            statusCode: 200,
            color: colorDoc,
        };
    }

    const newColor = await ColorSchema.create({ product: productId, color });

    product.colors.push(newColor._id);

    await product.save();

    return {
        type: statusType.success,
        message: "Add color successfully!",
        statusCode: 200,
        color: newColor,
    };
};

/**
 * @desc    Delete Product Color
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } color - Product color
 * @returns { Object<type|message|statusCode> }
 */
exports.deleteColor = async (productId, sellerId, color) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (sellerId.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    const colorDoc = await ColorSchema.isExisted(productId, color);
    if (!colorDoc)
        return {
            type: statusType.error,
            message: "No color found!",
            statusCode: 404,
        };

    product.colors = product.colors.filter(
        (color) => color._id.toString() !== colorDoc._id.toString()
    );

    await ColorSchema.updateOne({ color }, { $pull: { product: product._id } });

    await product.save();

    return {
        type: statusType.success,
        message: "Delete color successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Update Product Size
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } size - Product size
 * @returns { Object<type|message|statusCode|size> }
 */
exports.addSize = async (productId, seller, size) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (seller.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    if (await SizeSchema.isExisted(productId, size.toLowerCase()))
        return {
            type: statusType.error,
            message: "Size exists!",
            statusCode: 401,
        };

    const sizeDoc = await SizeSchema.findOne({ size: size.toLowerCase() });

    if (sizeDoc) {
        product.sizes.push(sizeDoc._id);
        sizeDoc.product.push(productId);
        await sizeDoc.save();

        await product.save();

        return {
            type: statusType.success,
            message: "Add size successfully!",
            statusCode: 200,
            size: sizeDoc,
        };
    }
    const newSize = await SizeSchema.create({ product: productId, size });

    product.sizes.push(newSize._id);

    await product.save();

    return {
        type: statusType.success,
        message: "Add size successfully!",
        statusCode: 200,
        size: newSize,
    };
};

/**
 * @desc    Delete Product Size
 * @param   { String } productId - Product ID
 * @param   { String } sellerId - Seller ID
 * @param   { String } size - Product size
 * @returns { Object<type|message|statusCode> }
 */
exports.deleteSize = async (productId, sellerId, size) => {
    const product = await ProductSchema.findById(productId);

    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (sellerId.toString() !== product.seller.toString())
        return {
            type: statusType.error,
            message: "This is not your product!",
            statusCode: 403,
        };

    const sizeDoc = await SizeSchema.isExisted(productId, size);
    if (!sizeDoc)
        return {
            type: statusType.error,
            message: "No size found!",
            statusCode: 404,
        };

    product.sizes = product.sizes.filter(
        (size) => size._id.toString() !== sizeDoc._id.toString()
    );

    await SizeSchema.updateOne({ size }, { $pull: { product: product._id } });

    await product.save();

    return {
        type: statusType.success,
        message: "Delete cosizelor successfully!",
        statusCode: 200,
    };
};

//lấy thống kê về các sản phẩm.
exports.getProductStatics = async () => {
    return await ProductSchema.aggregate([
        {
            $match: { averageRating: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: "$category",
                "Number of products": { $sum: 1 },
                "Number of ratings": { $sum: "$ratingQuantity" },
                "Average rating": { $avg: "$averageRating" },
                "Average price": { $avg: "$price" },
                "Minimum price": { $min: "$price" },
                "Maximum price": { $max: "$price" },
                Quantity: { $sum: "$quantity" },
            },
        },
        {
            $lookup: {
                from: "categories",
                as: "Category",
                localField: "_id",
                foreignField: "_id",
            },
        },
        {
            $unwind: "$Category",
        },
        {
            $project: {
                _id: 0,
                Category: {
                    name: 1,
                },
                Quantity: 1,
                "Number of products": 1,
                "Number of ratings": 1,
                "Average rating": 1,
                "Average price": 1,
                "Minimum price": 1,
                "Maximum price": 1,
            },
        },
    ]);
};
