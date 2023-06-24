const userService = require("../services/user.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");

/**
 * @desc      Get User Data Using It's Token
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.getUserByToken = async (req, res, next) => {
    try {
        const { type, message, statusCode, user } =
            await userService.getUserById(req.user._id);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};
/**
 * @desc      Get User Data Using It's ID Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.id - User id
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.getUserById = async (req, res, next) => {
    try {
        const { type, message, statusCode, user } =
            await userService.getUserById(req.params.id);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Get All Users Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @returns   { JSON } - A JSON object representing the type, message and the users data
 */
exports.getUsersByQuery = async (req, res, next) => {
    try {
        const { type, message, statusCode, users } =
            await userService.findByQueryUsers(req);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(200).json({
            type,
            message,
            users,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Create New User Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body - Body object data
 * @property  { Object } req.file - User image
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.createUser = async (req, res, next) => {
    try {
        // Call sign in service
        const { type, statusCode, message, user } =
            await userService.createUser(req.body, req.file);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update User Details Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @property  { Object } req.body - Body data
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.updateUserDetail = async (req, res, next) => {
    try {
        const { type, message, statusCode, user } =
            await userService.updateUserDetail(req.user._id, req.body);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUserDetailById = async (req, res, next) => {
    try {
        const { type, message, statusCode, user } =
            await userService.updateUserDetail(req.params.id, req.body);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Update User Profile Image Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @property  { Object } req.file - User image
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.updateUserProfileImage = async (req, res, next) => {
    try {
        const { type, message, statusCode, user } =
            await userService.updateUserProfileImage(req.user._id, req.file);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Delete User's Data Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.params.id - User ID
 * @returns   { JSON } - A JSON object representing the type, message and the user data
 */
exports.deleteUserById = async (req, res, next) => {
    try {
        const { type, message, statusCode } = await userService.deleteUserById(
            req.params.id
        );

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
        });
    } catch (err) {
        next(err);
    }
};
