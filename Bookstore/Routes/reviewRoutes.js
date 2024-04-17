const express = require("express");
const reviewController = require("../Controller/reviewController");
// const { protect, restrictTo } = require("../Controllers/authController");

const router = express.Router({ mergeParams: true });

// router.use(protect);

router
  .route("/")
  .post(
    // restrictTo("user"),
    reviewController.setBookUserIds,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .get(reviewController.getReview)
  .delete( reviewController.deleteReview)
  .patch( reviewController.updateReview);



  
module.exports = router;
// restrictTo("admin", "user"),