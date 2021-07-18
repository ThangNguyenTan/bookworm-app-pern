const express = require("express");
const router = express.Router();
const expressAsyncHandler = require("express-async-handler");
const { getReviewsByBookID } = require("../controllers/reviews.controllers");

router.get("/:id", expressAsyncHandler(getReviewsByBookID));

module.exports = router;
