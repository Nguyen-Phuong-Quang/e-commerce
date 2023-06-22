const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
    {
        discountValue: {
            type: Number,
            required: true,
        },
        discountUnit: {
            type: String,
            enum: ["percent", "VND"],
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

module.exports = mongoose.model("Discount", DiscountSchema, "discounts");
