const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { getAllBooks } = require("../controllers/books.controllers");
const {
  getReviewsByBookID,
  createReview,
} = require("../controllers/reviews.controllers");
const {
  createReviewValidation,
} = require("../validations/reviews.validations");

router.get("/", expressAsyncHandler(getAllBooks));

router.get("/:id/reviews", expressAsyncHandler(getReviewsByBookID));

router.post(
  "/:id/reviews",
  createReviewValidation,
  expressAsyncHandler(createReview)
);

module.exports = router;
