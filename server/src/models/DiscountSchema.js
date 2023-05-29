const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        discountUnit: {
            type: String,
            enum: ["percent", "dolar"],
        },
        validUntil: {
            type: Date,
            required: true,
        },
        minOrderValue: {
            type: Number,
            required: true,
        },
        maxDiscountAmount: {
            type: Number,
            required: true,
        },
        available: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

DiscountSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("Discount", DiscountSchema, "discounts");
