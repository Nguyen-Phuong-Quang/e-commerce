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

SizeSchema.statics.isExisted = async function (productId, size) {
    return await this.findOne({
        product: { $in: productId },
        size: size.trim().toLowerCase(),
    });
};

module.exports = mongoose.model("Size", SizeSchema, "sizes");
