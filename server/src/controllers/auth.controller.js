const authService = require("../services/auth.service");
const CustomErrorHandler = require("../utils/CustomErrorHandler");
const statusType = require("../constants/statusType");
/**
 * @desc      Sign Up Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body - Body data
 * @property  { Object } req.file - User image
 * @returns   { JSON } - A JSON object representing the type, message, user data (without password)
 * User get the verify code via sign up email
 */
exports.register = async (req, res, next) => {
    try {
        // Sign up service called
        const { type, statusCode, message, user } = await authService.signup(
            req.body,
            req.file
        );

        // Check error response
        if (type === statusType.error) {
            return next(new CustomErrorHandler(statusCode, message));
        }

        // Response if success
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
 * @desc      Verify Email Controller
 * @param     { object } req - Request object
 * @param     { number } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.body.code - Verify code
 * @property  { Object } req.body.email - User email
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.verifyEmail = async (req, res, next) => {
    try {
        // Call verify email service
        const { type, message, statusCode } = await authService.verifyEmail(
            req.body.code,
            req.body.email
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

/**
 * @desc      Sign In Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body.email - User email address
 * @property  { Object } req.body.password - User password
 * @returns   { JSON } - A JSON object representing the type, message, and tokens
 */
exports.signin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Call sign in service
        const { type, statusCode, message, user, tokens } =
            await authService.signin(email, password);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            user,
            tokens,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Refresh Token Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body.refreshToken - User refresh token address
 * @returns   { JSON } - A JSON object representing the type, message, and tokens
 */
exports.refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    try {
        // Call refresh token service
        const { type, message, statusCode, newTokens } =
            await authService.refreshToken(refreshToken);

        if (type === statusType.error)
            return next(new CustomErrorHandler(statusCode, message));

        res.status(statusCode).json({
            type,
            message,
            tokens: newTokens,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * @desc      Forget Password Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { Object } req.body.email - User email
 * @returns   { JSON } - A JSON object representing the type, message
 * User get the verify code via sign up email
 */
exports.forgetPassword = async (req, res, next) => {
    try {
        // Call forget password service
        const { type, message, statusCode } = await authService.forgetPassword(
            req.body.email
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

/**
 * @desc      Reset Password Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } resetCode - Reset verify code sent via email
 * @property  { String } email - User email
 * @property  { String } password - New password
 * @property  { String } confirmPassword - Comfirm new password
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.resetPassword = async (req, res, next) => {
    const { resetCode, email, password, confirmPassword } = req.body;
    try {
        // Call reset password service
        const { type, message, statusCode } = await authService.resetPassword(
            resetCode,
            email,
            password,
            confirmPassword
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

/**
 * @desc      Change Password Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } email - User email
 * @property  { String } newPassword - New password
 * @property  { String } comfirmPassword - Comfirm new password
 * @property  { String } req.user._id - User id
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.changePassword = async (req, res, next) => {
    const { password, newPassword, confirmPassword } = req.body;
    try {
        // Call change password service
        const { type, message, statusCode } = await authService.changePassword(
            password,
            newPassword,
            confirmPassword,
            req.user._id
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

/**
 * @desc      Change Password Controller
 * @param     { object } req - Request object
 * @param     { object } res - Response object
 * @param     { function } next - Next callback funtion
 * @property  { String } req.user._id - User id
 * @returns   { JSON } - A JSON object representing the type, message
 */
exports.signout = async (req, res, next) => {
    try {
        // Call sign out service
        const { type, statusCode, message } = await authService.signout(
            req.user._id
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
