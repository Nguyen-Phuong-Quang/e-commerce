const express = require("express");
const authController = require("../controllers/auth.controller");
const authorize = require("../middlewares/authorize");
const { uploadSingleFile } = require("../utils/multer");

const router = express.Router();

// Register
router.post("/sign-up", uploadSingleFile("image"), authController.register);

// Verify
router.post("/verify-email", authController.verifyEmail);

// Sign in
router.post("/sign-in", authController.signin);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

//Forget password
router.post("/forget-password", authController.forgetPassword);

//Reset password
router.post("/reset-password", authController.resetPassword);

//Need authorize
router.use(authorize);

//Change password
router.post("/change-password", authController.changePassword);

router.post("/sign-out", authController.signout);

module.exports = router;
