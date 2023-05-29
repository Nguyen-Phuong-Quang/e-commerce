const mongoose = require("mongoose");
const config = require("../config/config");
const generateCode = require("../utils/generateCode");
const { sendVerifyMail, sendResetPassword } = require("../utils/mail");
const validator = require("validator");
const tokenTypes = require("../config/token");

const CodeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            validate: (value) => {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email");
                }
            },
        },
        password: {
            type: String,
            trim: true,
            minlength: 8,
            validate: (value) => {
                if (
                    !value.match(
                        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/
                    )
                ) {
                    throw new Error(
                        "Password must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter and 1 number"
                    );
                }
            },
        },
        role: {
            type: String,
            enum: ["ADMIN", "SELLER", "CUSTOMER"],
            default: "CUSTOMER",
        },
        address: String,
        companyName: String,
        phone: String,
        profileImage: {
            type: String,
            required: true,
        },
        profileImageId: {
            type: String,
            required: true,
        },
        code: { type: String },
        type: {
            type: String,
            enum: [tokenTypes.resetPassword, tokenTypes.verifyEmail],
            required: true,
        },
    },
    {
        timestamps: true,
        expireAfterSeconds: config.jwt.jwt_verify_email_expiration_minutes * 60,
    }
);

CodeSchema.index({ email: 1 });

// Generate verify code and send to email register
CodeSchema.pre("save", async function (next) {
    const code = generateCode();
    if (!this.password) await sendResetPassword(this.email, code);
    else await sendVerifyMail(this.email, code);
    this.code = code;
    next();
});

module.exports = mongoose.model("Code", CodeSchema, "codes");
