const CartSchema = require("../models/CartSchema");
const ColorSchema = require("../models/ColorSchema");
const SizeSchema = require("../models/SizeSchema");
const ProductSchema = require("../models/ProductSchema");
const statusType = require("../constants/statusType");

/**
 * @desc    Add Product To Cart
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { Number } quantity - Product quantity
 * @param   { String } color - Color
 * @param   { String } size - Size
 * @returns { object<type|message|statusCode|cart> }
 */
exports.addItemToCart = async (email, productId, quantity, colorId, sizeId) => {
    // 1. Check quantity must be greater than zero
    if (quantity <= 0)
        return {
            type: statusType.error,
            message: "Quantity must be greater than zero!",
            statusCode: 400,
        };

    const product = await ProductSchema.findById(productId);

    // 2. Check if product doesn't exist
    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (product.isOutOfStock)
        return {
            type: statusType.error,
            message: "Out of stock!",
            statusCode: 400,
        };

    if (quantity > product.quantity)
        return {
            type: statusType.error,
            message: "The quantity in stock is not enough!",
            statusCode: 400,
        };

    const { priceAfterDiscount, mainImage } = product;

    const data = {
        product: productId,
        totalProductQuantity: quantity,
        totalProductPrice: priceAfterDiscount * quantity,
        image: mainImage,
    };

    const colorCheck = product.colors.find(
        (cl) => cl._id.toString() === colorId.toString()
    );

    // 3. Check if color doesn't exist
    if (!colorCheck)
        return {
            type: statusType.error,
            message: "This product does not have this color!",
            statusCode: 400,
        };

    data.color = colorCheck._id;

    const sizeCheck = product.sizes.find(
        (sz) => sz._id.toString() === sizeId.toString()
    );

    // 3. Check if size doesn't exist
    if (!sizeCheck)
        return {
            type: statusType.error,
            message: "This product does not have this size!",
            statusCode: 400,
        };

    data.size = sizeCheck._id;

    const cart = await CartSchema.findOne({ email });
    // If no cart existed
    if (!cart) {
        const cartData = {
            email,
            items: [data],
        };

        const newCart = await CartSchema.create(cartData);

        return {
            type: statusType.success,
            message: "Create new cart and add item successfully!",
            statusCode: 200,
            cart: newCart,
        };
    }

    const indexFound = cart.items.findIndex((item) => {
        return (
            item.product._id.toString() === productId.toString() &&
            item.color._id.toString() === colorCheck._id.toString() &&
            item.size._id.toString() === sizeCheck._id.toString()
        );
    });

    // If this product not exist in this cart
    if (indexFound !== -1) {
        cart.items[indexFound].totalProductQuantity += quantity;
        cart.items[indexFound].totalProductPrice +=
            priceAfterDiscount * quantity;
    } else {
        cart.items.push(data);
    }
    product.quantity -= quantity;

    if (product.quantity <= 0) product.isOutOfStock = true;

    await product.save();
    await cart.save();

    return {
        type: statusType.success,
        message: "Add item to cart successfully!",
        statusCode: 200,
        cart,
    };
};

/**
 * @desc    Get Cart
 * @param   { String } email - User email address
 * @returns { object<type|message|statusCode|cart> }
 */
exports.getCart = async (email) => {
    const cart = await CartSchema.findOne({ email });

    // Check cart if not exist
    if (!cart)
        return {
            type: statusType.error,
            message: "No cart found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Cart found!",
        statusCode: 200,
        cart,
    };
};
/**
 * @desc    Delete Cart
 * @param   { String } email - User email address
 * @return  { object<type|message|statusCode> }
 */
exports.deleteCart = async (email) => {
    const { deletedCount } = await CartSchema.deleteOne({ email });

    // Check no cart found!
    if (deletedCount === 0)
        return {
            type: statusType.error,
            message: "No cart found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Delete cart successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Delete Cart Item
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { String } Color - Color
 * @param   { String } Size - Size
 * @returns { object<type|message|statusCode|cart> }
 */
exports.deleteItem = async (email, productId, size, color) => {
    const cart = await CartSchema.findOne({ email });

    // 1. Check cart if not exist
    if (!cart)
        return {
            type: statusType.error,
            message: "No cart found!",
            statusCode: 404,
        };

    const colorDoc = await ColorSchema.isExisted(productId, color);

    // 2. Check product color not exist
    if (!colorDoc)
        return {
            type: statusType.error,
            message: "This color of product does not exist!",
            statusCode: 404,
        };

    const sizeDoc = await SizeSchema.isExisted(productId, size);

    // 3. Check product size not exist
    if (!sizeDoc)
        return {
            type: statusType.error,
            message: "This size of product does not exist!",
            statusCode: 404,
        };

    // 4. Find product that match color and size
    const product = cart.items.find((item) => {
        return (
            item.product._id.toString() === productId.toString() &&
            item.color.color.toString() === color.toString() &&
            item.size.size.toString() === size.toString()
        );
    });

    // 5. Check product if not exist in cart
    if (!product)
        return {
            type: statusType.error,
            message: "This product does not exist in your cart!",
            statusCode: 404,
        };

    const productDoc = await ProductSchema.findById(productId);
    productDoc.quantity += product.totalProductQuantity;
    await productDoc.save();

    // 6. Update cart (delete item)
    const newCart = await cart.updateOne({
        $pull: {
            items: {
                product: productId,
                color: colorDoc._id,
                size: sizeDoc._id,
            },
        },
        totalQuantity: cart.totalQuantity - product.totalProductQuantity,
        totalPrice: cart.totalPrice - product.totalProductPrice,
    });

    return {
        type: statusType.success,
        message: "Remove item successfully!",
        statusCode: 200,
        cart: newCart,
    };
};

/**
 * @desc    Increase Product Quantity By One
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { String } Color - Color
 * @param   { String } Size - Size
 * @returns { object<type|message|statusCode> }
 */
exports.increaseOne = async (email, productId, colorId, sizeId) => {
    const cart = await CartSchema.findOne({ email });

    // 1. Check cart if not exist
    if (!cart)
        return {
            type: statusType.error,
            message: "No cart found for user!",
            statusCode: 404,
        };

    const product = await ProductSchema.findById(productId);

    // 2. Check product if not exist
    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    if (product.isOutOfStock)
        return {
            type: statusType.error,
            message: "Out of stock!",
            statusCode: 404,
        };

    // const colorDoc = await ColorSchema.isExisted(productId, colorId);

    // // 3. Check product color if not exist in cart
    // if (!colorDoc)
    //     return {
    //         type: statusType.error,
    //         message: "This color does not exist!",
    //         statusCode: 404,
    //     };

    // const sizeDoc = await SizeSchema.isExisted(productId, sizeId);

    // // 4. Check product size if not exist in cart
    // if (!sizeDoc)
    //     return {
    //         type: statusType.error,
    //         message: "This size does not exist!",
    //         statusCode: 404,
    //     };

    // 5. Find product index in cart that match id, color and size
    const indexProductExistedInCart = cart.items.findIndex((item) => {
        return (
            item.product._id.toString() === productId.toString() &&
            item.color._id.toString() === colorId.toString() &&
            item.size._id.toString() === sizeId.toString()
        );
    });

    // 6. If product found incart
    if (indexProductExistedInCart !== -1) {
        cart.items[indexProductExistedInCart].totalProductQuantity += 1;
        cart.items[indexProductExistedInCart].totalProductPrice +=
            product.priceAfterDiscount;
        product.quantity -= 1;
        if (product.quantity <= 0) product.isOutOfStock = true;
        await product.save();
        await cart.save();

        return {
            type: statusType.success,
            message: `Increate item ${product.name} by one successfully!`,
            statusCode: 200,
            cart,
        };
    }

    return {
        type: statusType.error,
        message: `No item found in cart!`,
        statusCode: 404,
    };
};

/**
 * @desc    Decrease Product Quantity By One
 * @param   { String } email - User email address
 * @param   { String } productId - Product ID
 * @param   { String } Color - Color
 * @param   { String } Size - Size
 * @returns { object<type|message|statusCode> }
 */
exports.decreaseOne = async (email, productId, colorId, sizeId) => {
    const cart = await CartSchema.findOne({ email });

    // 1. Check cart if not exist
    if (!cart)
        return {
            type: statusType.error,
            message: "No cart found for user!",
            statusCode: 404,
        };

    const product = await ProductSchema.findById(productId);

    // 2. Check product if not exist
    if (!product)
        return {
            type: statusType.error,
            message: "No product found!",
            statusCode: 404,
        };

    // const colorDoc = await ColorSchema.isExisted(productId, colorId);

    // // 3. Check product color if not exist in cart
    // if (!colorDoc)
    //     return {
    //         type: statusType.error,
    //         message: "This color does not exist!",
    //         statusCode: 404,
    //     };

    // const sizeDoc = await SizeSchema.isExisted(productId, sizeId);

    // // 4. Check product size if not exist in cart
    // if (!sizeDoc)
    //     return {
    //         type: statusType.error,
    //         message: "This size does not exist!",
    //         statusCode: 404,
    //     };

    const indexProductExistedInCart = cart.items.findIndex((item) => {
        return (
            item.product._id.toString() === productId.toString() &&
            item.color._id.toString() === colorId.toString() &&
            item.size._id.toString() === sizeId.toString()
        );
    });

    if (indexProductExistedInCart !== -1) {
        const updateTotalProductQuantity =
            cart.items[indexProductExistedInCart].totalProductQuantity - 1;
        const updatetotalProductPrice =
            cart.items[indexProductExistedInCart].totalProductPrice -
            product.priceAfterDiscount;

        if (updateTotalProductQuantity <= 0 || updatetotalProductPrice <= 0) {
            cart.items.splice(indexProductExistedInCart, 1);
        } else {
            cart.items[indexProductExistedInCart].totalProductQuantity =
                updateTotalProductQuantity;
            cart.items[indexProductExistedInCart].totalProductPrice =
                updatetotalProductPrice;
        }

        product.quantity += 1;
        product.isOutOfStock = false;
        await product.save();
        await cart.save();

        return {
            type: statusType.success,
            message: `Decrease item ${product.name} by one successfully!`,
            statusCode: 200,
            cart,
        };
    }

    return {
        type: statusType.error,
        message: `No item found in cart!`,
        statusCode: 404,
    };
};
