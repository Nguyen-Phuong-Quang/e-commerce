const mongoose = require("mongoose");
const moment = require("moment");

const TokenSchema = new mongoose.Schema(
    {
        token: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        expires: { type: Date, required: true },
        type: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

// Check if token is expired
TokenSchema.methods.isExpired = function (currentTime) {
    return moment(currentTime).unix() > moment(this.expires).unix();
};

module.exports = mongoose.model("Token", TokenSchema, "tokens");
