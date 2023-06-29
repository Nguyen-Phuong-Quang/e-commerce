const tokenTypes = require("../config/token");
const UserSchema = require("../models/UserSchema");
const apiFeatures = require("../utils/apiFeatures");
const {
    uploadFileCloudinary,
    destroyFileCloudinary,
} = require("../utils/cloudinary");
const statusType = require("../constants/statusType");

/**
 * @desc    Get User Using It's ID
 * @param   { object } id - User ID
 * @return  { object<type|message|statusCode|user> }
 */
exports.getUserById = async (id) => {
    const user = await UserSchema.findById(id);

    if (!user)
        return {
            type: statusType.error,
            message: "No user found!",
            statusCode: 404,
        };

    user.password = undefined;

    return {
        type: statusType.success,
        message: "Found!",
        statusCode: 200,
        user,
    };
};

/**
 * @desc    Query Users
 * @param   { object } req - Request object
 * @returns { object<type|message|statusCode|users> }
 */
exports.findByQueryUsers = async (req) => {
    const users = await apiFeatures(req, UserSchema);

    // If no user found
    if (users.length < 1)
        return {
            type: statusType.error,
            message: "No user found!",
            statusCode: 404,
        };

    return {
        type: statusType.success,
        message: "Found!",
        statusCode: 200,
        users,
    };
};

/**
 * @docs    Create New User
 * @param   { object } body - Body object data
 * @param   { object } image - User profile image
 * @returns { object<type|message|statusCode|user> }
 */
exports.createUser = async (body, image) => {
    const { name, email, password, role } = body;
    let { address, companyName, phone } = body;

    // Check image required
    if (!image)
        return {
            type: statusType.error,
            message: "Profile image required!",
            statusCode: 400,
        };

    //Check fields
    if (!address) address = "";
    if (!companyName) companyName = "";
    if (!phone) phone = "";

    if (!name || !email || !password || !role)
        return {
            type: statusType.error,
            message: "Missing fields",
            statusCode: 400,
        };

    // Check email existed
    const isExistedEmail = await UserSchema.isExistedEmail(email);

    if (isExistedEmail)
        return {
            type: statusType.error,
            message: "Email is existed!",
            statusCode: 409,
        };

    // Set up folder where image going to be uploaded in cloudinary
    const folderName = `Users/${name.trim().split(" ").join("-")}`;

    // Upload file to cloudinary
    const imageUploadResponse = await uploadFileCloudinary(
        image.buffer,
        folderName
    );

    // Create a code for verifying create account service
    const newUser = await UserSchema.create({
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

    newUser.password = "";

    return {
        type: statusType.success,
        statusCode: 201,
        message: "Sign up successfully!",
        user: newUser,
    };
};

/**
 * @desc    Update User Details Using It's ID
 * @param   { object } userId - User ID
 * @param   { object } body - Body object data
 * @returns { object<type|message|statusCode|user> }
 */
exports.updateUserDetail = async (userId, body) => {
    console.log(body);
    const { email } = body;

    if (email) {
        if ((await UserSchema.findById(userId)).email !== email) {
            const isExistedEmail = await UserSchema.isExistedEmail(email);
            if (isExistedEmail)
                return {
                    type: statusType.error,
                    message: "Email is existed!",
                    statusCode: 409,
                };
        }
    }

    const user = await UserSchema.findByIdAndUpdate(userId, body, {
        new: true,
        runValidators: true,
    });

    return {
        type: statusType.success,
        message: "Update user detail successfully",
        statusCode: 200,
        user,
    };
};

/**
 * @desc    Update User Profile Image Using It's ID
 * @param   { object } userId - User ID
 * @param   { object } newImage - Updated Profile Image
 * @returns { object<type|message|statusCode|user> }
 */
exports.updateUserProfileImage = async (userId, newImage) => {
    const user = await UserSchema.findById(userId).select("-password");

    if (!user)
        return {
            type: statusType.error,
            message: "No user found!",
            statusCode: 404,
        };

    await destroyFileCloudinary(user.profileImageId);

    // Set up folder where image going to be uploaded in cloudinary
    const folderName = `Users/${user.name.trim().split(" ").join("-")}`;

    // Upload file to cloudinary
    const imageUploadResponse = await uploadFileCloudinary(
        newImage.buffer,
        folderName
    );

    user.profileImage = imageUploadResponse.secure_url;
    user.profileImageId = imageUploadResponse.public_id;

    await user.save();

    return {
        type: statusType.success,
        message: "Update profile image successfully!",
        statusCode: 200,
        user,
    };
};

/**
 * @desc    Delete User Using It's ID
 * @param   { String } userId - User ID,
 * @returns { object<type|message|statusCode> }
 */
exports.deleteUserById = async (userId) => {
    const user = await UserSchema.findByIdAndDelete(userId);

    if (!user)
        return {
            type: statusType.error,
            message: "No user found!",
            statusCode: 404,
        };

    await destroyFileCloudinary(user.profileImageId);

    return {
        type: statusType.success,
        message: "Delete user successfully",
        statusCode: 200,
    };
};
