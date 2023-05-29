const express = require("express");
const authorize = require("../middlewares/authorize");
const reviewController = require("../controllers/review.controller");

const router = express.Router();

// Get reviews by query
router.get("/:productId", reviewController.getAllReviews);

// Get review by id
router.get("/:productId/:reviewId", reviewController.getReviewById);

router.use(authorize);

// Add review
router.post("/:productId", reviewController.addReview);

// Update review
// Delete review
router
    .route("/:productId/:reviewId")
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);
module.exports = router;
