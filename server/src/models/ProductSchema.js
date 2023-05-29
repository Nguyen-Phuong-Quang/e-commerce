const slugify = require("slugify");
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        slug: {
            type: String,
        },
        mainImage: {
            type: String,
            required: true,
        },
        mainImageId: {
            type: String,
            required: true,
        },
        images: {
            type: [String],
            required: true,
        },
        imagesId: {
            type: [String],
            required: true,
        },
        description: {
            type: String,
        },
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        priceAfterDiscount: {
            type: Number,
            required: true,
            default: 0,
        },
        colors: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Color",
            },
        ],
        sizes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Size",
            },
        ],
        quantity: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0,
        },
        isOutOfStock: {
            type: Boolean,
            default: false,
        },
        averageRating: {
            type: Number,
            default: 4.5,
            min: 1,
            max: 5,
            set: (value) => Math.round(value * 10) / 10,
        },
        ratingQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ProductSchema.index({ name: 1 }, { unique: true });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ slug: 1, price: 1, averageRating: -1 });

// Run before .save() and .create()
ProductSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

//  Use mongoose populate
ProductSchema.pre(/^find/, function (next) {
    this.populate([
        { path: "colors", select: "color" },
        { path: "sizes", select: "size" },
    ]);
    next();
});

module.exports = mongoose.model("Product", ProductSchema, "products");
