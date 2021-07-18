const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { getAllBooks } = require("../controllers/books.controllers");
const { getReviewsByBookID } = require("../controllers/reviews.controllers");

router.get("/", expressAsyncHandler(getAllBooks));

router.get("/:id/reviews", expressAsyncHandler(getReviewsByBookID));

module.exports = router;
