const express = require("express");
const authorize = require("../middlewares/authorize");
const productController = require("../controllers/product.controller");
const { uploadAnyFile } = require("../utils/multer");
const restrictedTo = require("../middlewares/restrictedTo");
const router = express.Router();

// Get product statistic
router.get("/product-static", productController.getProductStatics);

// Get seller product
router.get(
    "/seller-product",
    authorize,
    restrictedTo("ADMIN", "SELLER"),
    productController.getSellerProducts
);

// Get product by id
router.get("/:productId", productController.getProductById);

// Get all product
router.get("/", productController.getAllProducts);

router.use(authorize, restrictedTo("ADMIN", "SELLER"));

// Add new product
router.post("/", uploadAnyFile(), productController.addProduct);

// Delete product by id
router.delete("/:productId", productController.deleteProductById);

// Add color and delete color
router
    .route("/color/:productId")
    .post(productController.addColor)
    .delete(productController.deleteColor);

// Add size and delete size
router
    .route("/size/:productId")
    .post(productController.addSize)
    .delete(productController.deleteSize);

// Update product images
router.patch(
    "/update-product-images/:productId",
    uploadAnyFile(),
    productController.updateProductImages
);

// Update product detail
router.patch(
    "/update-product-detail/:productId",
    productController.updateProductDetail
);



module.exports = router;
