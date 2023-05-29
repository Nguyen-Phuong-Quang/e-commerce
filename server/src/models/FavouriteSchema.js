const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

FavouriteSchema.index({ user: 1 });

module.exports = mongoose.model("Favoutire", FavouriteSchema, "favourites");
