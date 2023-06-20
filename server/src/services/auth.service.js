const {
    generateAuthToken,
    verifyToken,
} = require("../middlewares/tokenHandler");
const UserSchema = require("../models/UserSchema");
const CodeSchema = require("../models/CodeSchema");
const TokenSchema = require("../models/TokenSchema");
const {
    uploadFileCloudinary,
    destroyFileCloudinary,
} = require("../utils/cloudinary");
const tokenTypes = require("../config/token");
const bcrypt = require("bcrypt");
const statusType = require("../constants/statusType");

/**
 * @desc    Sign Up Service
 * @param   { object } body - Body object data
 * @param   { object } profileImage - User profile image
 * @return  { object<type|statusCode|message|user> }
 */
exports.signup = async (body, image) => {
    // 1. Check if profile image not provided
    if (!image)
        return {
            type: statusType.error,
            message: "Profile image required!",
            statusCode: 400,
        };

    const { name, email, password, role } = body;
    let { address, companyName, phone } = body;

    if (!address) address = "";
    if (!companyName) companyName = "";
    if (!phone) phone = "";

    // 2. Check fields
    if (!name || !email || !password || !role)
        return {
            type: statusType.error,
            message: "Missing fields",
            statusCode: 400,
        };

    // 3. Check email existed
    const isExistedEmail = await UserSchema.isExistedEmail(email);

    if (isExistedEmail)
        return {
            type: statusType.error,
            message: "Email is existed!",
            statusCode: 409,
        };

    // 4. Check ADMIN
    if (role === "ADMIN") {
        if (body.adminKey !== "SECRET_ADMIN_KEY")
            return {
                type: statusType.error,
                message: "Cannot create admin!",
                statusCode: 400,
            };
    }

    // 5. Set up folder where image going to be uploaded in cloudinary
    const folderName = `Users/${name.trim().split(" ").join("-")}`;

    // 6. Upload file to cloudinary
    const imageUploadResponse = await uploadFileCloudinary(
        image.buffer,
        folderName
    );

    // 7. Create a code for verifying create account service
    const user = await CodeSchema.create({
        name,
        email,
        password,
        role,
        companyName,
        address,
        phone,
        profileImage: imageUploadResponse.secure_url,
        profileImageId: imageUploadResponse.public_id,
        type: tokenTypes.verifyEmail,
    });

    // 8. Set code and password empty to view information
    user.code = "";
    user.password = "";

    return {
        type: statusType.success,
        statusCode: 201,
        message: "Sign up successfully!",
        user,
    };
};

/**
 * @desc    Verify Email Service
 * @param   { String } verifyCode - Verification code
 * @param   { String } email - Email verification token
 * @returns { Object<type|statusCode|message> }
 */
exports.verifyEmail = async (verifyCode, email) => {
    // 1. Find code in Code Schema that contain code to verify account creation
    const users = await CodeSchema.find({ email });

    // 2. If no code exist in db (can have many codes because user can request to resend verify code)
    if (users.length === 0)
        return {
            type: statusType.error,
            message: "Code is expired!",
            statusCode: 404,
        };

    // 4. Check if code is correct
    const user = users.find(async (i) => i.code === verifyCode);

    // 5. If code is not correct
    if (!user)
        return {
            type: statusType.error,
            message: "Incorrect code!",
            statusCode: 400,
        };

    // 6. Delete image in cloudinary for the another account creation not accepted
    users.forEach(async (i) => {
        if (i.code !== verifyCode)
            await destroyFileCloudinary(i.profileImageId);
    });

    // 7. Create user
    await UserSchema.create({
        name: user.name,
        email,
        password: user.password,
        role: user.role,
        companyName: user.companyName,
        address: user.address,
        phone: user.phone,
        profileImage: user.profileImage,
        profileImageId: user.profileImageId,
    });

    // 8. Delete verify code
    await CodeSchema.deleteMany({ email });

    return {
        type: statusType.success,
        message: "Verify email successfully!",
        statusCode: 201,
    };
};

/**
 * @desc    Sign In Service
 * @param   { String } email - User email address
 * @param   { String } password - User password
 * @return  { object<type|statusCode|message|user|tokens> }
 */
exports.signin = async (email, password) => {
    // 1. Check email or password is not inputted
    if (!email || !password)
        return {
            type: statusType.error,
            message: "Email and password required!",
            statusCode: 400,
        };

    // 2. Check user is existed or not
    const user = await UserSchema.findOne({ email });

    // If not
    if (!user)
        return {
            type: statusType.error,
            message: "Email not found!",
            statusCode: 404,
        };

    // 3. Check password is correct or not
    const isMatchPassword = await user.isMatchPassword(password);

    // If not
    if (!isMatchPassword)
        return {
            type: statusType.error,
            message: "Password is wrong!",
            statusCode: 400,
        };
        
    // 4. Delete token schema of previous sign in in db
    await TokenSchema.deleteMany({ userId: user._id });

    // 5. Generate token
    const tokens = await generateAuthToken(user);

    // 6. Set user fassword undifined to return data
    user.password = undefined;

    return {
        type: statusType.success,
        message: "Sign in successfully!",
        statusCode: 200,
        user,
        tokens,
    };
};

/**
 * @desc    Refresh Auth Tokens Service
 * @param   { String } refreshToken - User's refresh token
 * @return  { object<type|statusCode|message|newTokens> }
 */
exports.refreshToken = async (refreshToken) => {
    // 1. Check token is expired or not
    const refreshTokenDoc = await verifyToken(refreshToken);

    // 2. If expired
    if (refreshTokenDoc.type === statusType.error)
        return {
            type: statusType.error,
            message: "User token not found!",
            statusCode: 404,
        };

    // 3. Find user of token
    const user = await UserSchema.findById(
        refreshTokenDoc.tokenResponse.userId
    );

    // If no user found
    if (!user)
        return {
            type: statusType.error,
            message: "User not found!",
            statusCode: 404,
        };

    // 4. Check refresh token expired
    if (
        (await TokenSchema.findOne({ token: refreshToken })).isExpired(
            new Date()
        )
    ) {
        await TokenSchema.deleteMany({ token: refreshToken });
        return {
            type: statusType.error,
            message: "This refresh token is expired!",
            statusCode: 406,
        };
    }
    // 5. Delete token
    await TokenSchema.deleteMany({ token: refreshToken });

    // 6. Generate new token
    const newTokens = await generateAuthToken(user);

    return {
        type: statusType.success,
        message: "Refresh token successfully!",
        statusCode: 200,
        newTokens,
    };
};

/**
 * @desc    Forget Password Service
 * @param   { email } refreshToken - User's email
 * @return  { object<type|statusCode|message> }
 */
exports.forgetPassword = async (email) => {
    // 1. Check if user is existed
    const user = await UserSchema.findOne({ email });

    // if not
    if (!user) {
        return {
            type: statusType.error,
            message: "No user found",
            statusCode: 404,
        };
    }

    // 2. Generate code for resetting password
    await CodeSchema.create({
        email,
        type: tokenTypes.resetPassword,
    });

    return {
        type: statusType.success,
        message: "Please check reset password code in email!",
        statusCode: 200,
    };
};

/**
 * @desc    Reset Password Service
 * @param   { String } resetCode - Reset password confirm code
 * @param   { String } email - User email
 * @param   { String } password - User's password
 * @param   { String } confirmPassword - User's password confirmation
 * @return  { Object<type|statusCode|message> }
 */
exports.resetPassword = async (resetCode, email, password, confirmPassword) => {
    // 1. Check code to reset password (can have many codes because user can request to resend verify code)
    const resetUserDoc = await CodeSchema.find({ email });

    // if no code found
    if (resetUserDoc.length < 1)
        return {
            type: statusType.error,
            message: "Expired reset process!",
            statusCode: 400,
        };

    // 2. Check password matchs confirm password or not
    if (password !== confirmPassword)
        return {
            type: statusType.error,
            message: "Password does not match!",
            statusCode: 400,
        };

    // 3. Check code is correct or not
    const check = resetUserDoc.find((i) => i.code === resetCode);

    // If not
    if (!check)
        return {
            type: statusType.error,
            message: "Wrong code!",
            statusCode: 400,
        };

    // 4. Get user data by email
    const user = await UserSchema.findOne({ email });

    if (!user)
        return {
            type: statusType.error,
            message: "No user found!",
            statusCode: 404,
        };

    // 5. Check password is math old password
    if (bcrypt.compareSync(password, user.password))
        return {
            type: statusType.error,
            message: "Password must not be the same as the old password",
            statusCode: 400,
        };

    // 6. Set password to new password
    user.password = password;

    // 7. Save new user
    await user.save();

    // 8. Delete code verify
    await CodeSchema.deleteMany({ email });

    return {
        type: statusType.success,
        message: "Reset password successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Change Password Service
 * @param   { String } password - Current user password
 * @param   { String } newPassword - User's password
 * @param   { String } confirmPassword - User's password confirmation
 * @param   { String } userId - User ID
 * @return  { object<type|statusCode|message> }
 */
exports.changePassword = async (
    password,
    newPassword,
    confirmPassword,
    userId
) => {
    // 1. Check new password is match confirm password or not
    if (newPassword !== confirmPassword)
        return {
            type: statusType.error,
            message: "Password is not match!",
            statusCode: 400,
        };

    // 2. Check new password is match current password or not
    if (password === newPassword)
        return {
            type: statusType.error,
            message: "Password and new password must not be same!",
            statusCode: 400,
        };

    // 3. Find user in schema
    const user = await UserSchema.findById(userId);

    // 4. Check current password is correct
    const isMatch = await user.isMatchPassword(password);

    // If not
    if (!isMatch)
        return {
            type: statusType.error,
            message: "Current password is not match!",
            statusCode: 400,
        };

    // 5. Update password
    user.password = newPassword;

    // 6. Save password
    await user.save();

    // 7. Delete all token with old password
    await TokenSchema.deleteMany({ userId: userId });

    return {
        type: statusType.success,
        message: "Change password successfully!",
        statusCode: 200,
    };
};

/**
 * @desc    Logout Service
 * @param   { String } userId - User's ID
 * @return  { object }
 */
exports.signout = async (userId) => {
    // 1. Delete all sign in token
    const deleleResponse = await TokenSchema.deleteMany({ userId });

    // 2. Check if no token found
    if (deleleResponse.deletedCount === 0)
        return {
            type: statusType.error,
            message: "Please login again!",
            statusCode: 400,
        };

    return {
        type: statusType.success,
        message: "Sign out successfully!",
        statusCode: 200,
    };
};
