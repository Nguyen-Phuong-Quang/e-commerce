const mongoose = require("mongoose");
const ProductSchema = require("./ProductSchema");

const ReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            require: [true, "You need to sign in to review"],
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: [true, "Review must belong to a product"],
        },
        review: {
            type: String,
            default: "",
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });


// Update product review
ReviewSchema.statics.calculateAverageRatings = async function (productId) {
    const statistic = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: "$product",
                numberOfRating: { $sum: 1 },
                avgRating: { $avg: "$rating" },
            },
        },
    ]);

    if (statistic.length > 0) {
        await ProductSchema.findByIdAndUpdate(productId, {
            ratingQuantity: statistic[0].numberOfRating,
            averageRating: statistic[0].avgRating,
        });
    } else {
        await ProductSchema.findByIdAndUpdate(productId, {
            ratingQuantity: 0,
            averageRating: 4.5,
        });
    }
};

// Auto update product review after save
ReviewSchema.post("save", async function () {
    await this.constructor.calculateAverageRatings(this.product);
});


module.exports = mongoose.model("Review", ReviewSchema, "reviews");
