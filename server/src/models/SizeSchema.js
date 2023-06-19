const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema(
    {
        product: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        size: {
            type: String,
            lowercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

SizeSchema.index({ size: 1 }, { unique: true });

SizeSchema.statics.isExisted = async function (productId, sizeId) {
    return await this.findOne({
        _id: sizeId,
        product: { $in: productId },
    });
};

module.exports = mongoose.model("Size", SizeSchema, "sizes");
