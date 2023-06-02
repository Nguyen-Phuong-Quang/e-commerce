const express = require("express");
const favouriteController = require("../controllers/favourite.controller");
const authorize = require("../middlewares/authorize");

const router = express.Router();

router.use(authorize);

// Add and delete favourite product
router
    .route("/:productId")
    .post(favouriteController.addToFavourite)
    .delete(favouriteController.deleteProductFromFavourite);

// Check product in favourite list
router.get(
    "/check/:productId",
    favouriteController.checkProductInFavouriteList
);

// Get favourite list
router.get("/", favouriteController.getFavouriteList);

module.exports = router;
