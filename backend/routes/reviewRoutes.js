const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const reviewsController = require("../controllers/reviewsController");

router
  .post("/", auth.authenticateToken, reviewsController.createReview)
  .get("/", auth.authenticateToken, reviewsController.getReviews)
  .get("/:id", auth.authenticateToken, reviewsController.getReviewById)
  .put("/:id", auth.authenticateToken, reviewsController.updateReview)
  .delete("/:id", auth.authenticateToken, reviewsController.deleteReview);

module.exports = router;
