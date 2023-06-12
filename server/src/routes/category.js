const express = require("express");
const authorize = require("../middlewares/authorize");
const categoryController = require("../controllers/category.controller");
const { uploadSingleFile } = require("../utils/multer");

const router = express.Router();

// Get category by id
router.get("/:categoryId", categoryController.getCategoryById);

// Get category by query
router.get("/", categoryController.getCategories);

router.use(authorize);

// Add category
router.post("/", uploadSingleFile("image"), categoryController.addCategory);

// Update or delete category
router
    .route("/:categoryId")
    .patch(categoryController.updateCategoryDetail)
    .delete(categoryController.deleteCategory);

// Update category image
// router.patch(
//     "/image/:categoryId",
//     uploadSingleFile("image"),
//     categoryController.updateCategoryImage
// );

module.exports = router;
