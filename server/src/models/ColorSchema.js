const mongoose = require("mongoose");

const ColorSchema = new mongoose.Schema(
    {
        product: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        color: {
            type: String,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

ColorSchema.index({ color: 1 }, { unique: true });

ColorSchema.statics.isExisted = async function (productId, color) {
    return await this.findOne({
        color,
        product: { $in: productId },
    });
};

module.exports = mongoose.model("Color", ColorSchema, "colors");
