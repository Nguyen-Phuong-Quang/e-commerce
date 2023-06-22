const mongoose = require("mongoose");
const validator = require("validator");
const ProductSchema = require("./ProductSchema");
const CustomErrorHandler = require("../utils/CustomErrorHandler");

const CartSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: (value) => {
                if (!validator.isEmail(value)) throw new Error("Invalid email");
            },
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                color: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Color",
                    // required: true,
                },
                size: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Size",
                    // required: true,
                },
                totalProductQuantity: {
                    type: Number,
                    required: true,
                },
                totalProductPrice: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                },
            },
        ],
        totalQuantity: {
            type: Number,
        },
        totalPrice: {
            type: Number,
        },
    },
    { timestamps: true }
);

CartSchema.index({ email: 1 }, { unique: 1 });

CartSchema.pre("save", function (next) {
    // this.populate([
    //     {
    //         path: "items.product",
    //         select: "name",
    //     },
    //     {
    //         path: "items.color",
    //         select: "color",
    //     },
    //     {
    //         path: "items.size",
    //         select: "size",
    //     },
    // ]);

    next();
});

CartSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: "items.product",
            select: "name",
        },
        {
            path: "items.color",
            select: "color",
        },
        {
            path: "items.size",
            select: "size",
        },
    ]);

    next();
});

CartSchema.pre(/^delete/, async function (next) {
    await Promise.all(
        this.items.map(async (item) => {
            const product = await ProductSchema.findById(item.product);

            if (!product)
                return next(new CustomErrorHandler(404, "No product found!"));

            product.quantity += item.totalProductQuantity;
        })
    );

    next();
});

// Caculate total quantity and total price automatically after save
CartSchema.pre("save", function (next) {
    this.totalQuantity = this.items.reduce(
        (total, item) => total + item.totalProductQuantity,
        0
    );
    this.totalPrice = this.items.reduce(
        (total, item) =>
            total + item.totalProductPrice,
        0
    );

    next();
});

module.exports = mongoose.model("Cart", CartSchema, "carts");
