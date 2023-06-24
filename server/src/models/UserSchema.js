const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const moment = require("moment");

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
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
            required: true,
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
            required: true,
            enum: ["ADMIN", "SELLER", "CUSTOMER"],
            default: "CUSTOMER",
            uppercase: true,
        },
        passwordChangeAt: Date,
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
        // discountCodes: [
        //     {
        //         type: String,
        //     },
        // ],
    },
    {
        timestamps: true,
    }
);

UserSchema.index({ name: 1, email: 1 }, { unique: true });

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

//Set current time when user change password to passwordChangeAt field
UserSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangeAt = new Date();
    next();
});

// Check existed email
UserSchema.statics.isExistedEmail = async function (email) {
    const user = await this.findOne({ email });
    return !!user;
};

// Check password is match user's password or not
UserSchema.methods.isMatchPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// Check if password is changed after token is generated
UserSchema.methods.isChangePasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTime = moment(this.passwordChangeAt).unix();
        return JWTTimestamp < changedTime;
    }
    return false;
};

module.exports = mongoose.model("User", UserSchema, "users");
