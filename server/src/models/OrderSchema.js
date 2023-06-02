const mongoose = require("mongoose");
const statusOrder = require("../constants/statusOrder");

const OrderSchema = new mongoose.Schema(
    {
        products: Array,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        orderPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            type: Number,
        },
        isPaid: {
            type: Boolean,
            required: true,
            default: false,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            required: true,
            default: false,
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: [
                "cash",
                "debitCard",
                "creditCard",
                "mobilePayment",
                "e-banking",
            ],
        },
        taxPrice: {
            type: Number,
            default: 0.0,
        },
        shippingPrice: {
            type: Number,
            // required: true,
            default: 0.0,
        },
        phone: {
            type: String,
            require: [true, "Phone is required"],
        },
        status: {
            type: String,
            default: "Not processed",
            enum: statusOrder,
        },
    },
    { timestamps: true }
);


// Calculate total order price automatically after save
OrderSchema.pre("save", async function (next) {
    this.totalPrice = this.orderPrice + this.taxPrice + this.shippingPrice;
    next();
});

module.exports = mongoose.model("Order", OrderSchema, "orders");
